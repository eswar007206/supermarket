import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartProvider, useCart } from "@/context/CartContext";
import { ShoppingBasket, ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      if (error || !data.session) {
        setCheckingSession(false);
        navigate({ to: "/auth" });
        return;
      }
      setUserId(data.session.user.id);
      setEmail(data.session.user.email ?? "");
      setCheckingSession(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) {
        setUserId(null);
        setEmail("");
        navigate({ to: "/auth" });
        return;
      }
      setUserId(session.user.id);
      setEmail(session.user.email ?? "");
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  if (checkingSession) {
    return <div className="min-h-screen grid place-items-center text-sm text-muted-foreground">Checking session…</div>;
  }

  if (!userId) return null;

  return (
    <CartProvider userId={userId}>
      <div className="min-h-screen flex flex-col">
        <Header email={email ?? ""} />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="py-8 text-center text-sm text-muted-foreground">
          © MART · Fresh. Friendly. Fast.
        </footer>
      </div>
    </CartProvider>
  );
}

function Header({ email }: { email: string }) {
  const { itemCount } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "backdrop-blur-md bg-[var(--brand-cream)]/80 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[var(--brand-plum)] text-[var(--brand-cream)] grid place-items-center">
            <ShoppingBasket className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="font-display text-lg sm:text-2xl text-[var(--brand-plum)]">MART</span>
        </Link>

        <nav className="hidden min-[420px]:flex items-center gap-1 ml-2 sm:ml-4">
          <Link
            to="/"
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm ${pathname === "/" ? "bg-[var(--brand-plum)] text-[var(--brand-cream)]" : "hover:bg-[var(--brand-blue)]/40"}`}
          >
            Shop
          </Link>
          <Link
            to="/cart"
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm ${pathname === "/cart" ? "bg-[var(--brand-plum)] text-[var(--brand-cream)]" : "hover:bg-[var(--brand-blue)]/40"}`}
          >
            Cart
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <span className="hidden md:inline text-sm text-muted-foreground truncate max-w-[180px]">{email}</span>
          <div className="min-[420px]:hidden">
            <Link
              to="/cart"
              className={`px-2.5 py-1.5 rounded-full text-xs ${pathname === "/cart" ? "bg-[var(--brand-plum)] text-[var(--brand-cream)]" : "hover:bg-[var(--brand-blue)]/40"}`}
            >
              Cart
            </Link>
          </div>
          <Link to="/cart" className="relative">
            <Button variant="secondary" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[var(--brand-plum)] text-[var(--brand-cream)] text-xs grid place-items-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10" onClick={logout} aria-label="Log out">
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
