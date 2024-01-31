"use client";

import SiteFooter from "./SiteFooter";
import NavBar from "./NavBar";

export default function NewRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      {children}
      <SiteFooter />
    </>
  );
}
