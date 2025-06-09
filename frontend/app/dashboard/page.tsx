"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Route, Search, Clock, Star, Navigation, Calendar, Share2, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import TripDashboard from "@/components/trip-dashboard"
import RouteExplorer from "@/components/route-explorer"
import LocationIntelligence from "@/components/location-intelligence"
import ReachabilityAnalysis from "@/components/reachability-analysis"
import TripOptimization from "@/components/trip-optimization"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchQuery, setSearchQuery] = useState("")

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Calendar },
    { id: "routes", label: "Routes", icon: Route },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "reachability", label: "Reachability", icon: Clock },
    { id: "optimization", label: "Optimize", icon: Navigation },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      {/* Header with Navigation */}
      <motion.header
        className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>

              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg">
                  <Navigation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    TravelAI
                  </h1>
                  <p className="text-sm text-gray-600">Intelligent Travel Companion</p>
                </div>
              </div>
            </div>

            {/* Quick Search */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search destinations, routes..."
                  className="pl-10 w-80 bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400"
                />
              </div>
              <Button
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Trip
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.div
        className="bg-white/60 backdrop-blur-sm border-b border-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <nav className="flex space-x-1 py-2">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "dashboard" && <TripDashboard />}
          {activeTab === "routes" && <RouteExplorer />}
          {activeTab === "locations" && <LocationIntelligence />}
          {activeTab === "reachability" && <ReachabilityAnalysis />}
          {activeTab === "optimization" && <TripOptimization />}
        </motion.div>
      </main>
    </div>
  )
}
