"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Route, MapPin, Timer, Building2, Truck, Package, Search, Compass, Star } from "lucide-react";

export default function MainNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Features",
      link: "/#features",
      dropdown: {
        items: [
          // Routing & Navigation
          {
            id: "get_directions",
            title: "Smart Route Planning",
            description: "Calculate optimal routes between multiple locations with real-time traffic data",
            icon: Route,
            href: "/dashboard/route-planning",
            badge: "Popular",
          },
          {
            id: "optimize_traveling_salesman",
            title: "TSP Optimization",
            description: "Find the shortest route visiting all locations exactly once",
            icon: Compass,
            href: "/dashboard/tsp-optimization",
            isPro: true,
          },
          
          // Geocoding & Location
          {
            id: "geocode_address",
            title: "Address Geocoding",
            description: "Convert addresses and place names to precise coordinates",
            icon: MapPin,
            href: "/dashboard/geocoding",
          },
          
          // Reachability Analysis
          {
            id: "get_isochrones",
            title: "Reachability Analysis",
            description: "Visualize areas reachable within specific time or distance limits",
            icon: Timer,
            href: "/dashboard/reachability",
            badge: "New",
          },
          
          // Points of Interest
          {
            id: "get_pois",
            title: "POI Discovery",
            description: "Find points of interest like hotels, restaurants, and attractions",
            icon: Building2,
            href: "/dashboard/poi-search",
          },
          {
            id: "get_poi_names",
            title: "Quick POI Names",
            description: "Get a simplified list of nearby point names",
            icon: Search,
            href: "/dashboard/poi-names",
          },
          
          // Vehicle Optimization
          {
            id: "optimize_vehicle_routes",
            title: "Vehicle Route Optimization",
            description: "Optimize routes for multiple vehicles with capacity constraints",
            icon: Truck,
            href: "/dashboard/vehicle-optimization",
            isPro: true,
            badge: "Advanced",
          },
          {
            id: "create_simple_delivery_problem",
            title: "Delivery Optimization",
            description: "Solve simple delivery problems with one depot and multiple stops",
            icon: Package,
            href: "/dashboard/delivery-optimization",
            isPro: true,
          },
        ],
      },
    },
    {
      name: "Dashboard",
      link: "/dashboard",
    },
  ];

  const isAuthPage = pathname?.startsWith("/auth");

  console.log("Navbar render - pathname:", pathname, "isAuthPage:", isAuthPage);

  if (isAuthPage) {
    return null; // Don't show navbar on auth pages
  }

  return (
    <div className="relative w-full bg-red-500">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton href="/auth/login" variant="secondary">Login</NavbarButton>
            <NavbarButton href="/auth/register" variant="primary">Sign Up</NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <div key={`mobile-link-${idx}`}>
                <a
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300 block mb-2"
                >
                  <span className="block">{item.name}</span>
                </a>
                {item.dropdown && (
                  <div className="ml-4 space-y-2 mb-4">
                    <div className="text-xs font-semibold text-blue-600 mb-2">
                      MCP Features:
                    </div>
                    {item.dropdown.items.slice(0, 3).map((dropdownItem) => (
                      <a
                        key={dropdownItem.id}
                        href={dropdownItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 block"
                      >
                        <dropdownItem.icon className="h-3 w-3" />
                        <span>{dropdownItem.title}</span>
                        {dropdownItem.isPro && (
                          <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-1 py-0.5 rounded text-[10px]">
                            Pro
                          </span>
                        )}
                      </a>
                    ))}
                    <a
                      href="/#features"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs text-blue-600 hover:text-blue-800 block"
                    >
                      View all features →
                    </a>
                  </div>
                )}
              </div>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="secondary"
                className="w-full"
              >
                Login
              </NavbarButton>
              <NavbarButton
                href="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Sign Up
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
} 