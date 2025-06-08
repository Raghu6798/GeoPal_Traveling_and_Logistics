"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Bike, MapPin, Clock, Route, Navigation, Share2, Download, Loader2 } from "lucide-react"
import MapInterface from "./map-interface"
import { apiClient } from "./api-client"

export default function RouteExplorer() {
  const [routeType, setRouteType] = useState("driving-car")
  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [routeResults, setRouteResults] = useState<any[]>([])

  const routeOptions = [
    { id: "driving-car", name: "Driving", icon: Car, color: "text-blue-600" },
    { id: "foot-walking", name: "Walking", icon: Navigation, color: "text-green-600" },
    { id: "cycling-regular", name: "Cycling", icon: Bike, color: "text-purple-600" },
  ]

  const handleFindRoutes = async () => {
    if (!startLocation || !endLocation) return

    setIsLoading(true)
    try {
      // First geocode the addresses
      const startGeocode = await apiClient.geocodeAddress(startLocation)
      const endGeocode = await apiClient.geocodeAddress(endLocation)

      if (startGeocode.features?.length && endGeocode.features?.length) {
        const startCoords = startGeocode.features[0].geometry.coordinates
        const endCoords = endGeocode.features[0].geometry.coordinates

        // Get directions
        const directions = await apiClient.getDirections({
          locations: [
            { longitude: startCoords[0], latitude: startCoords[1] },
            { longitude: endCoords[0], latitude: endCoords[1] },
          ],
          profile: routeType,
          preference: "fastest",
        })

        // Transform the results for display
        if (directions.routes?.length) {
          const transformedResults = directions.routes.map((route: any, index: number) => ({
            id: index + 1,
            name: index === 0 ? "Fastest Route" : `Alternative ${index}`,
            distance: `${(route.summary.distance / 1000).toFixed(1)} km`,
            duration: `${Math.round(route.summary.duration / 60)} min`,
            traffic: "Light", // This would come from real traffic data
            type: index === 0 ? "primary" : "alternative",
          }))
          setRouteResults(transformedResults)
        }
      }
    } catch (error) {
      console.error("Error finding routes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Route Planning */}
      <motion.div
        className="lg:col-span-1 space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Route Input */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Plan Your Route</CardTitle>
            <CardDescription>Enter your start and destination points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">From</label>
              <Input
                placeholder="Enter starting location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">To</label>
              <Input
                placeholder="Enter destination"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                className="border-green-200 focus:border-green-400"
              />
            </div>

            {/* Route Type Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Travel Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {routeOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={routeType === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRouteType(option.id)}
                    className={`flex flex-col items-center p-3 h-auto ${
                      routeType === option.id
                        ? "bg-gradient-to-r from-green-500 to-emerald-600"
                        : "border-green-200 hover:bg-green-50"
                    }`}
                  >
                    <option.icon className={`h-5 w-5 mb-1 ${option.color}`} />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleFindRoutes}
              disabled={isLoading || !startLocation || !endLocation}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finding Routes...
                </>
              ) : (
                <>
                  <Route className="h-4 w-4 mr-2" />
                  Find Routes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Route Options */}
        {routeResults.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="bg-white/80 backdrop-blur-sm border-green-100">
              <CardHeader>
                <CardTitle className="text-green-700">Route Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {routeResults.map((route) => (
                  <motion.div
                    key={route.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      route.type === "primary"
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{route.name}</h3>
                      {route.type === "primary" && <Badge className="bg-green-600">Recommended</Badge>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {route.distance}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {route.duration}
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={
                          route.traffic === "Light"
                            ? "text-green-600 border-green-200"
                            : route.traffic === "Moderate"
                              ? "text-yellow-600 border-yellow-200"
                              : "text-red-600 border-red-200"
                        }
                      >
                        {route.traffic} Traffic
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Route Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50">
              <Share2 className="h-4 w-4 mr-2" />
              Share Route
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50">
              <Download className="h-4 w-4 mr-2" />
              Export GPX
            </Button>
            <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50">
              <Navigation className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Column - Map and Details */}
      <motion.div
        className="lg:col-span-2 space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Interactive Map */}
        <MapInterface
          height="500px"
          markers={[
            { lat: 51.5074, lng: -0.1278, title: "Start: London", type: "start" },
            { lat: 51.5155, lng: -0.0922, title: "End: Tower Bridge", type: "end" },
          ]}
        />

        {/* Route Details */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Route Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-green-50">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="directions">Directions</TabsTrigger>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="elevation">Elevation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12.4</div>
                    <div className="text-sm text-gray-600">km</div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">18</div>
                    <div className="text-sm text-gray-600">min</div>
                  </div>
                  <div className="text-center p-3 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">£2.50</div>
                    <div className="text-sm text-gray-600">toll</div>
                  </div>
                  <div className="text-center p-3 bg-cyan-50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600">45</div>
                    <div className="text-sm text-gray-600">m elev</div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="directions" className="space-y-3">
                {[
                  "Head north on A1 toward City Center",
                  "Turn right onto B2 (signs for Tower Bridge)",
                  "Continue straight for 2.3 km",
                  "Turn left onto Tower Bridge Road",
                  "Arrive at destination on the right",
                ].map((direction, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3 p-2 bg-green-50 rounded"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-sm">{direction}</span>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="traffic" className="space-y-3">
                <div className="text-sm text-gray-600">Current traffic conditions along your route:</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">A1 Highway</span>
                    <Badge className="bg-green-600">Clear</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm">City Center</span>
                    <Badge className="bg-yellow-600">Moderate</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Tower Bridge Rd</span>
                    <Badge className="bg-green-600">Clear</Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="elevation">
                <div className="h-32 bg-green-50 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Elevation profile would be displayed here</span>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
