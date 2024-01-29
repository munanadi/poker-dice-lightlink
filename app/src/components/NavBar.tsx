"use client";

import * as React from "react";
import Link from "next/link";

import { MainNav } from "./MainNav";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavBar = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container flex h-14 items-center">
        <MainNav />
        {/*  <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {/* <ConnectButton /> 
          </nav>
        </div> */}
      </div>
    </header>
  );
};

export default NavBar;
