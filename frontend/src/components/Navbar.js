"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-bold text-primary">BreastCare AI</Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link href="/about">About</Link></Button>
          {!loading && user ? (
            <Button asChild size="sm"><Link href="/dashboard">Dashboard</Link></Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm"><Link href="/login">Login</Link></Button>
              <Button asChild size="sm"><Link href="/register">Register</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
