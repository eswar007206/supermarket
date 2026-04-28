import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { ALL_PRODUCTS } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Save, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — MART" },
      { name: "description", content: "Review items in your cart and save for later." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, save, saving, dirty, clear } = useCart();

  const lines = items
    .map((i) => ({ ...i, product: ALL_PRODUCTS[i.productId] }))
    .filter((l) => l.product);

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-2xl bg-[var(--brand-blue)]/40 grid place-items-center">
          <ShoppingBag className="h-10 w-10 text-[var(--brand-plum)]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl mt-6 text-[var(--brand-plum)]">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Start adding items from any of our 15 aisles.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/">Start shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
      <div className="flex items-start sm:items-end justify-between mb-4 sm:mb-6 flex-wrap gap-3 sm:gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--brand-plum)]">Your Cart</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {lines.length} product{lines.length !== 1 ? "s" : ""} · {items.reduce((n, i) => n + i.quantity, 0)} item
            {items.reduce((n, i) => n + i.quantity, 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {dirty && (
            <span className="text-xs px-2 py-1 rounded-full bg-[var(--brand-blue)]/50 text-[var(--brand-ink)]">
              Unsaved changes
            </span>
          )}
          <Button onClick={save} disabled={saving || !dirty} className="rounded-full ml-auto sm:ml-0">
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving…" : "Save cart"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 sm:gap-8">
        <div className="space-y-3">
          {lines.map((l) => (
            <div
              key={l.productId}
              className="bg-card border border-border rounded-2xl p-3 sm:p-4 flex flex-col min-[460px]:flex-row gap-3 sm:gap-4 min-[460px]:items-center"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{l.product.category}</p>
                <h3 className="font-medium truncate">{l.product.name}</h3>
                <p className="text-xs text-muted-foreground">{l.product.unit}</p>
                <p className="font-display text-[var(--brand-plum)] mt-1">
                  ${(l.product.price * l.quantity).toFixed(2)}
                  <span className="text-xs text-muted-foreground font-sans ml-2">
                    (${l.product.price.toFixed(2)} each)
                  </span>
                </p>
              </div>
              <div className="flex flex-row min-[460px]:flex-col sm:flex-row items-center justify-between min-[460px]:justify-center gap-2 w-full min-[460px]:w-auto">
                <div className="flex items-center bg-[var(--brand-blue)]/30 rounded-full">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQty(l.productId, l.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{l.quantity}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setQty(l.productId, l.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => remove(l.productId)}
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="ghost" className="text-muted-foreground w-full sm:w-auto" onClick={clear}>
            Clear cart
          </Button>
        </div>

        <aside className="h-fit lg:sticky lg:top-28 bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
          <h2 className="font-display text-2xl text-[var(--brand-plum)]">Summary</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-baseline">
            <span className="font-medium">Total</span>
            <span className="font-display text-2xl text-[var(--brand-plum)]">${subtotal.toFixed(2)}</span>
          </div>
          <Button className="w-full rounded-full" onClick={save} disabled={saving || !dirty}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving…" : dirty ? "Save cart" : "Cart saved"}
          </Button>
          <Button asChild variant="secondary" className="w-full rounded-full">
            <Link to="/">Continue shopping</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
