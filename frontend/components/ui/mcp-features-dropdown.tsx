"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Navigation,
  MapPin,
  Route,
  Clock,
  Search,
  Building2,
  Truck,
  Car,
  Bike,
  Target,
  Zap,
  Globe,
  Calculator,
  Package,
  Users,
  Star,
  ArrowRight,
  ChevronDown,
  Map,
  Timer,
  Compass,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

interface MCPFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  color: string;
  href: string;
  badge?: string;
  isPro?: boolean;
}

const mcpFeatures: MCPFeature[] = [
  // Routing & Navigation
  {
    id: "get_directions",
    title: "Smart Route Planning",
    description: "Calculate optimal routes between multiple locations with real-time traffic data",
    icon: Route,
    category: "Routing & Navigation",
    color: "from-blue-500 to-blue-600",
    href: "/dashboard/route-planning",
    badge: "Popular",
  },
  {
    id: "optimize_traveling_salesman",
    title: "TSP Optimization",
    description: "Find the shortest route visiting all locations exactly once",
    icon: Compass,
    category: "Routing & Navigation",
    color: "from-indigo-500 to-indigo-600",
    href: "/dashboard/tsp-optimization",
    isPro: true,
  },
  
  // Geocoding & Location
  {
    id: "geocode_address",
    title: "Address Geocoding",
    description: "Convert addresses and place names to precise coordinates",
    icon: MapPin,
    category: "Geocoding & Location",
    color: "from-green-500 to-green-600",
    href: "/dashboard/geocoding",
  },
  
  // Reachability Analysis
  {
    id: "get_isochrones",
    title: "Reachability Analysis",
    description: "Visualize areas reachable within specific time or distance limits",
    icon: Timer,
    category: "Reachability Analysis",
    color: "from-purple-500 to-purple-600",
    href: "/dashboard/reachability",
    badge: "New",
  },
  
  // Points of Interest
  {
    id: "get_pois",
    title: "POI Discovery",
    description: "Find points of interest like hotels, restaurants, and attractions",
    icon: Building2,
    category: "Points of Interest",
    color: "from-orange-500 to-orange-600",
    href: "/dashboard/poi-search",
  },
  {
    id: "get_poi_names",
    title: "Quick POI Names",
    description: "Get a simplified list of nearby point names",
    icon: Search,
    category: "Points of Interest",
    color: "from-teal-500 to-teal-600",
    href: "/dashboard/poi-names",
  },
  
  // Vehicle Optimization
  {
    id: "optimize_vehicle_routes",
    title: "Vehicle Route Optimization",
    description: "Optimize routes for multiple vehicles with capacity constraints",
    icon: Truck,
    category: "Vehicle Optimization",
    color: "from-red-500 to-red-600",
    href: "/dashboard/vehicle-optimization",
    isPro: true,
    badge: "Advanced",
  },
  {
    id: "create_simple_delivery_problem",
    title: "Delivery Optimization",
    description: "Solve simple delivery problems with one depot and multiple stops",
    icon: Package,
    category: "Vehicle Optimization",
    color: "from-cyan-500 to-cyan-600",
    href: "/dashboard/delivery-optimization",
    isPro: true,
  },
];

const categories = [
  "Routing & Navigation",
  "Geocoding & Location", 
  "Reachability Analysis",
  "Points of Interest",
  "Vehicle Optimization",
];

export function MCPFeaturesDropdown() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredFeatures = selectedCategory === "all" 
    ? mcpFeatures 
    : mcpFeatures.filter(feature => feature.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Routing & Navigation": return Navigation;
      case "Geocoding & Location": return MapPin;
      case "Reachability Analysis": return Timer;
      case "Points of Interest": return Building2;
      case "Vehicle Optimization": return Truck;
      default: return Target;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
          <Zap className="w-4 h-4 mr-2" />
          Advanced Features
        </Badge>
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Advanced Travel Intelligence
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Access powerful routing, geocoding, and optimization tools for intelligent travel planning
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Target className="w-4 h-4 mr-2" />
          All Features
        </Button>
        {categories.map((category) => {
          const Icon = getCategoryIcon(category);
          return (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category}
            </Button>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="h-full bg-white/80 backdrop-blur-sm border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {feature.badge && (
                      <Badge 
                        variant="outline" 
                        className="text-xs border-blue-200 text-blue-600"
                      >
                        {feature.badge}
                      </Badge>
                    )}
                    {feature.isPro && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900 mt-4">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={feature.href}>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    size="sm"
                  >
                    Try Feature
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-8">
            <h4 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to Experience Advanced Travel Intelligence?
            </h4>
            <p className="text-gray-600 mb-6">
              Sign up for a free account to access these powerful advanced features and transform your travel planning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8">
                  View Dashboard
                  <BarChart3 className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 