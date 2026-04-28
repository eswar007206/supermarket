import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ALL_PRODUCTS } from "@/data/catalog";

export type CartItem = { productId: string; quantity: number };

type CartCtx = {
  items: CartItem[];
  itemCount: number;
  add: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  save: () => Promise<void>;
  saving: boolean;
  dirty: boolean;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const parseQty = (value: string | null) => {
    const qty = Number.parseInt(value ?? "1", 10);
    return Number.isFinite(qty) && qty > 0 ? qty : 1;
  };

  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

  const productIdByName = useCallback(() => {
    const map = new Map<string, string>();
    for (const [localId, product] of Object.entries(ALL_PRODUCTS)) {
      map.set(product.name, localId);
    }
    return map;
  }, []);

  // Load saved cart on mount / user change
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: plan, error: planError } = await supabase
        .from("shopping_plans")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

      if (!active) return;
      if (planError) {
        console.error(planError);
        setLoaded(true);
        return;
      }

      if (!plan?.id) {
        setItems([]);
        setLoaded(true);
        return;
      }

      const { data: rows, error: rowsError } = await supabase
        .from("shopping_plan_items")
        .select("item_id, quantity_text, items(item_name)")
        .eq("plan_id", plan.id);

      if (!active) return;
      if (rowsError) {
        console.error(rowsError);
        setLoaded(true);
        return;
      }

      const localIdByName = productIdByName();
      const restoredItems: CartItem[] = [];

      for (const row of rows ?? []) {
        const itemName = row.items?.item_name;
        if (!itemName) continue;
        const localProductId = localIdByName.get(itemName) ?? localIdByName.get(itemName.trim());
        if (!localProductId) continue;
        restoredItems.push({ productId: localProductId, quantity: parseQty(row.quantity_text) });
      }

      setItems(restoredItems);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  const markDirty = () => setDirty(true);

  const add = useCallback((productId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) return prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { productId, quantity: 1 }];
    });
    markDirty();
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)),
    );
    markDirty();
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    markDirty();
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    markDirty();
  }, []);

  const persistCart = useCallback(async (showSuccessToast: boolean) => {
    setSaving(true);
    try {
      const { data: plan, error: planErr } = await supabase
        .from("shopping_plans")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "active")
        .maybeSingle();

      if (planErr) throw planErr;

      const { data: existingRows, error: existingErr } = await supabase
        .from("shopping_plan_items")
        .select("item_id, items(item_name)")
        .eq("plan_id", plan?.id ?? "00000000-0000-0000-0000-000000000000");

      if (existingErr) throw existingErr;

      const localIdByName = productIdByName();
      const existingLocalIds = new Set(
        (existingRows ?? [])
          .map((row) => row.items?.item_name)
          .filter((name): name is string => Boolean(name))
          .map((name) => localIdByName.get(name) ?? localIdByName.get(name.trim()))
          .filter((id): id is string => Boolean(id)),
      );

      const localItemNames = items.map((item) => ALL_PRODUCTS[item.productId]?.name).filter((name): name is string => Boolean(name));
      const { data: dbItems, error: dbItemsErr } = await supabase
        .from("items")
        .select("id, item_name, aliases");

      if (dbItemsErr) throw dbItemsErr;
      const dbIdByItemName = new Map((dbItems ?? []).map((dbItem) => [normalize(dbItem.item_name), dbItem.id]));
      const dbIdByAlias = new Map<string, string>();
      for (const dbItem of dbItems ?? []) {
        for (const alias of dbItem.aliases ?? []) {
          dbIdByAlias.set(normalize(alias), dbItem.id);
        }
      }
      const nextLocalIds = new Set(items.map((item) => item.productId));

      for (const item of items) {
        const product = ALL_PRODUCTS[item.productId];
        if (!product) throw new Error(`Missing local product for id ${item.productId}`);
        const key = normalize(product.name);
        const dbItemId = dbIdByItemName.get(key) ?? dbIdByAlias.get(key);
        if (!dbItemId) {
          throw new Error(`No matching DB item for "${product.name}". Add this item in public.items or align names.`);
        }

        const { error: addErr } = await supabase.rpc("add_item_to_cart", {
          p_item_id: dbItemId,
          p_quantity_text: String(item.quantity),
        });
        if (addErr) throw addErr;
      }

      const localIdsToDelete = [...existingLocalIds].filter((id) => !nextLocalIds.has(id));
      for (const localId of localIdsToDelete) {
        const product = ALL_PRODUCTS[localId];
        if (!product) continue;
        const key = normalize(product.name);
        const dbItemId = dbIdByItemName.get(key) ?? dbIdByAlias.get(key);
        if (!dbItemId) continue;

        const { error: deleteErr } = await supabase.rpc("remove_item_from_cart", {
          p_item_id: dbItemId,
        });
        if (deleteErr) throw deleteErr;
      }

      setDirty(false);
      if (showSuccessToast) toast.success("Cart saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Couldn't save cart";
      toast.error(message);
      console.error(error);
    } finally {
      setSaving(false);
    }
  }, [items, userId]);

  const save = useCallback(async () => {
    await persistCart(true);
  }, [persistCart]);

  useEffect(() => {
    if (!loaded || !dirty || saving) return;
    const timer = window.setTimeout(() => {
      void persistCart(false);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [dirty, loaded, saving, persistCart]);

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, itemCount, add, setQty, remove, clear, save, saving, dirty: dirty && loaded }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}
