"use client"

import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { useState } from "react"



export const MainNav = ({className, ...props}: React.HtmlHTMLAttributes<HTMLElement>) => {

    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/`,
            label: "Dashboard",
            active: pathname === `/`,
        },

        {
            href: `/industries`,
            label: "Industries",
            active: pathname === `/industries`,
        },

        {
            href: `/products`,
            label: "Products",
            active: pathname === `/products`,
        },
        {
            href: `/orders`,
            label: "Orders",
            active: pathname === `/orders`,
        },
        {
            href: `/stores`,
            label: "Stores",
            active: pathname === `/stores`,
        },
        {
          href: `/returns`,
          label: "Returns",
          active: pathname === `/returns`,
      },
        {
            href: `/settings`,
            label: "Settings",
            active: pathname === `/settings`,
        },
    ];

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <>
          {/* Desktop Navigation (hidden on mobile) */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 pl-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  route.active 
                    ? "text-black dark:text-white" 
                    : "text-muted-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
    
          {/* Mobile Hamburger Menu (visible on mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:text-primary transition-colors"
              aria-label="Toggle menu"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
    
            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
              <div 
                id="mobile-menu"
                className="absolute top-14 left-0 right-0 bg-background shadow-md py-4 px-6 space-y-4 z-50 bg-opacity-80"
              >
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block text-base font-medium transition-colors hover:text-primary",
                      route.active
                        ? "text-black dark:text-white"
                        : "text-muted-foreground"
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      );
};

