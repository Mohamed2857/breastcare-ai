"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FilePlus2, History, Users, ListChecks, BarChart3, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analysis/new", label: "New Analysis", icon: FilePlus2 },
  { href: "/history", label: "History", icon: History },
];
const adminLinks = [
  { href: "/admin", label: "Admin Dashboard", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/predictions", label: "All Predictions", icon: ListChecks },
  { href: "/admin/models", label: "Model Comparison", icon: BarChart3 },
];

function NavItem({ href, label, icon: Icon, active }) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium",
      active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
    )}>
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}

export default function AppLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  const isActive = (href) => pathname === href;
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b bg-white md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="p-4"><Link href="/" className="text-lg font-bold text-primary">BreastCare AI</Link></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {userLinks.map((l) => <NavItem key={l.href} {...l} active={isActive(l.href)} />)}
          {user.role === "admin" && (
            <>
              <p className="hidden px-3 pt-4 text-xs font-semibold uppercase text-muted-foreground md:block">Admin</p>
              {adminLinks.map((l) => <NavItem key={l.href} {...l} active={isActive(l.href)} />)}
            </>
          )}
        </nav>
        <div className="hidden p-4 text-sm md:block">
          <p className="font-medium">{user.name}</p>
          <p className="mb-3 truncate text-xs text-muted-foreground">{user.email}</p>
          <Button variant="outline" size="sm" className="w-full"
            onClick={async () => { await logout(); router.push("/"); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 bg-muted/30 p-4 md:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
        <div className="mx-auto mt-8 max-w-5xl md:hidden">
          <Button variant="outline" size="sm" onClick={async () => { await logout(); router.push("/"); }}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </main>
    </div>
  );
}
