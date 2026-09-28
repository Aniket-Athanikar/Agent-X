import { DM_Sans, Albert_Sans } from "next/font/google";
import { AuthProvider } from "@/services/authContext";
import ScrollToTop from "@/components/ScrollToTop";
import WarningSuppressor from "@/components/WarningSuppressor";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Agent-X",
  description: "Join the world's most elite network of experts helping frontier AI models become smarter, safer, and more aligned with human intelligence.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${dmSans.variable} ${albertSans.variable} font-sans antialiased text-text-primary selection:bg-primary/30 selection:text-white`}>
        <AuthProvider>
          <WarningSuppressor />
          {children}
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
