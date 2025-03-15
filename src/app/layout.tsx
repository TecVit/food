import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "@/app/globals.css";
import "@/lib/toastify/style.css";

const fontLexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Food",
  description: "Criado por TecVit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${fontLexend.variable}`}>

        {children}

        <ToastContainer />
      </body>
    </html>
  );
}
