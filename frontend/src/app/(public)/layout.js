import Navbar from "@/components/Navbar";
import Disclaimer from "@/components/Disclaimer";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 pb-10"><Disclaimer /></footer>
    </div>
  );
}
