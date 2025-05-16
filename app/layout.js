import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppSidebar from "./_components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OrbiQ",
  description: "Created by GANGULY",
};

export default function RootLayout( {children} ) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} font-mono ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <Provider>
              {children}
            </Provider>
          </SidebarProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
