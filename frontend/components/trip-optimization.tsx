"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Clock, Route, Calendar, Download, Share2, Play, Plus, X } from "lucide-react"
import MapInterface from "./map-interface"

export default function TripOptimization() {
  const [optimizationType, setOptimizationType] = useState("tsp")
  const [vehicleType, setVehicleType] = useState("car")
  const [timeWindows, setTimeWindows] = useState(true)
  const [capacity, setCapacity] = useState(100)

  const [stops, setStops] = useState([
    { id: 1, name: "Warehouse", address: "123 Industrial St", type: "depot", timeWindow: "08:00-18:00", priority: 1 },
    { id: 2, name: "Customer A", address: "456 Main St", type: "delivery", timeWindow: "09:00-12:00", priority: 2 },
    { id: 3, name: "Customer B", address: "789 Oak Ave", type: "delivery", timeWindow: "13:00-16:00", priority: 3 },
    { id: 4, name: "Customer C", address: "321 Pine Rd", type: "pickup", timeWindow: "10:00-15:00", priority: 2 },
    { id: 5, name: "Service Center", address: "654 Elm St", type: "service", timeWindow: "14:00-17:00", priority: 1 },
  ])

  const optimizationResults = {
    originalDistance: "145.2 km",
    optimizedDistance: "98.7 km",
    timeSaved: "2h 15m",
    fuelSaved: "12.4L",
    costSaved: "£45.60",
    efficiency: "32%",
  }

  const addStop = () => {
    const newStop = {
      id: stops.length + 1,
      name: `Stop ${stops.length + 1}`,
      address: "",
      type: "delivery",
      timeWindow: "09:00-17:00",
      priority: 2,
    }
    setStops([...stops, newStop])
  }

  const removeStop = (id: number) => {
    setStops(stops.filter((stop) => stop.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Optimization Setup */}
      <div className="lg:col-span-1 space-y-6">
        {/* Optimization Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Optimization</CardTitle>
            <CardDescription>Optimize routes for multiple stops</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Optimization Type</label>
              <Select value={optimizationType} onValueChange={setOptimizationType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tsp">Traveling Salesman (TSP)</SelectItem>
                  <SelectItem value="vrp">Vehicle Routing (VRP)</SelectItem>
                  <SelectItem value="cvrp">Capacitated VRP</SelectItem>
                  <SelectItem value="vrptw">VRP with Time Windows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Type</label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Capacity (kg)</label>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                placeholder="100"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Time Windows</label>
              <Switch checked={timeWindows} onCheckedChange={setTimeWindows} />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Route className="h-4 w-4 mr-2" />
              Optimize Route
            </Button>
          </CardContent>
        </Card>

        {/* Optimization Results */}
        <Card>
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-lg font-bold text-green-600">32%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Efficiency</div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-lg font-bold text-blue-600">2h 15m</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Time Saved</div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Original Distance:</span>
                <span className="font-semibold text-red-600">{optimizationResults.originalDistance}</span>
              </div>
              <div className="flex justify-between">
                <span>Optimized Distance:</span>
                <span className="font-semibold text-green-600">{optimizationResults.optimizedDistance}</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Saved:</span>
                <span className="font-semibold">{optimizationResults.fuelSaved}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost Saved:</span>
                <span className="font-semibold text-green-600">{optimizationResults.costSaved}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Play className="h-4 w-4 mr-2" />
              Start Navigation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Route
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Route
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Share with Team
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Map and Stops */}
      <div className="lg:col-span-2 space-y-6">
        {/* Interactive Map */}
        <MapInterface
          height="400px"
          markers={stops.map((stop, index) => ({
            lat: 51.5074 + (Math.random() - 0.5) * 0.02,
            lng: -0.1278 + (Math.random() - 0.5) * 0.02,
            title: stop.name,
            type: stop.type,
          }))}
        />

        {/* Stops Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Route Stops</CardTitle>
                <CardDescription>Manage your delivery and pickup points</CardDescription>
              </div>
              <Button onClick={addStop} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Stop
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list">Stop List</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="constraints">Constraints</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-3">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-sm">{stop.name}</h3>
                        <Badge variant={stop.type === "depot" ? "default" : "outline"} className="text-xs">
                          {stop.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Priority {stop.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{stop.address}</p>
                      {timeWindows && (
                        <div className="flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-xs text-gray-500">{stop.timeWindow}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStop(stop.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <div className="relative">
                  {stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center space-x-4 pb-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        {index < stops.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{stop.name}</span>
                          <span className="text-xs text-gray-500">
                            {index === 0 ? "08:00" : `${8 + index * 2}:${index % 2 === 0 ? "00" : "30"}`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Est. arrival • {index === 0 ? "Start" : `${15 + index * 5} min`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="constraints" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold mb-3">Vehicle Constraints</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Max Capacity:</span>
                        <span className="font-semibold">{capacity} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Distance:</span>
                        <span className="font-semibold">200 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Duration:</span>
                        <span className="font-semibold">8 hours</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold mb-3">Time Constraints</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Working Hours:</span>
                        <span className="font-semibold">08:00-18:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Break Time:</span>
                        <span className="font-semibold">30 min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service Time:</span>
                        <span className="font-semibold">15 min/stop</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
