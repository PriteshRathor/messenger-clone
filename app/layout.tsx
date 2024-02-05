import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContent from "./context/ToasterContent";
import AuthContext from "./context/AuthContext";
import ActiveStatus from "./components/ActiveStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Messenger',
  description: 'Messenger Clone',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContent />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
