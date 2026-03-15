import { Poppins, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import WelcomePopup from "@/components/Welcome";
import TitleManager from "@/components/TitleManager";

// ইংরেজির জন্য Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

// বাংলার জন্য Hind Siliguri
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
});

export const metadata = {
  title: {
    default: "Cyberlink",
    template: "Cyberlink | %s",
  },
  description:
    "Cyberlink Communication delivers high-speed broadband, enterprise connectivity, and modern digital services across Bangladesh.",
  applicationName: "Cyberlink",
  icons: {
    icon: [{ url: "/Navlogo/logo%20(2).png", type: "image/png" }],
    shortcut: ["/Navlogo/logo%20(2).png"],
    apple: [{ url: "/Navlogo/logo%20(2).png", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${hindSiliguri.variable}`}>
      <body className="antialiased font-poppins">
        <TitleManager />
        <WelcomePopup />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
