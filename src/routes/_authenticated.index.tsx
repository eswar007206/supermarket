import { createFileRoute } from "@tanstack/react-router";
import { CATALOG, type Product } from "@/data/catalog";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Plus, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Shop — MART" },
      { name: "description", content: "Browse 15 aisles of fresh groceries, pantry staples and everyday essentials." },
    ],
  }),
  component: ShopPage,
});

const CATEGORY_IMAGES: Record<string, string> = {
  fruits: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80",
  vegetables: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
  "dairy-eggs": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
  "meat-poultry": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80",
  seafood: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?auto=format&fit=crop&w=1200&q=80",
  "pantry-staples": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=80",
  snacks: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=1200&q=80",
  beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
  "frozen-foods": "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1200&q=80",
  "breakfast-cereal": "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=1200&q=80",
  "condiments-sauces": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=1200&q=80",
  "household-cleaning": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80",
  "personal-care": "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=1200&q=80",
  "baby-care": "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1200&q=80",
};

function ShopPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const selectedCategory = CATALOG.find((cat) => cat.id === selectedCategoryId) ?? null;

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-10">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[var(--brand-blue)] via-[var(--brand-blue)]/70 to-[var(--brand-cream)] p-5 sm:p-12 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[var(--brand-plum)]/20 blur-3xl" />
          <p className="text-[var(--brand-plum)] font-medium tracking-wide uppercase text-xs">Today at MART</p>
          <h1 className="font-display text-2xl leading-tight sm:text-5xl text-[var(--brand-ink)] mt-2 max-w-2xl">
            Everything you need, from <span className="text-[var(--brand-plum)]">aisle 1</span> to aisle 15.
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[var(--brand-ink)]/80 max-w-xl">
            Fresh picks, daily essentials and pantry favorites — all in one basket.
          </p>
        </div>
      </section>

      {selectedCategory ? (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          <Button variant="ghost" className="mb-3 sm:mb-4 h-9 px-3" onClick={() => setSelectedCategoryId(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to categories
          </Button>

          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">{selectedCategory.products.length} items</p>
              <h2 className="font-display text-2xl sm:text-4xl text-[var(--brand-plum)]">{selectedCategory.name}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {selectedCategory.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
          <div className="mb-4 sm:mb-6">
            <h2 className="font-display text-2xl sm:text-4xl text-[var(--brand-plum)]">Shop by category</h2>
            <p className="text-muted-foreground mt-1">Select a category to view its items.</p>
          </div>
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {CATALOG.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className="text-left bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[var(--brand-blue)]/20">
                  <img
                    src={CATEGORY_IMAGES[cat.id]}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-medium text-[var(--brand-ink)]">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{cat.products.length} items</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const inCart = items.find((i) => i.productId === product.id);
  const [justAdded, setJustAdded] = useState(false);

  const onAdd = () => {
    add(product.id);
    setJustAdded(true);
    toast.success(`Added ${product.name}`);
    setTimeout(() => setJustAdded(false), 900);
  };

  return (
    <div className="group bg-card rounded-2xl border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-0.5">
        <h3 className="font-medium text-[var(--brand-ink)] leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <p className="text-xs text-muted-foreground">{product.unit}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-display text-lg text-[var(--brand-plum)]">${product.price.toFixed(2)}</span>
          <Button
            size="sm"
            onClick={onAdd}
            className="rounded-full h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm"
            variant={justAdded ? "secondary" : "default"}
          >
            {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span className="ml-1">{inCart ? `${inCart.quantity}` : "Add"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
