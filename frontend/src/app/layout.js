import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "BreastCare AI",
  description: "AI-powered breast cancer classification (educational prototype)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
