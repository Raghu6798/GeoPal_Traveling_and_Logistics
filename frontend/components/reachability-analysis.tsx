"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Clock, MapPin, Car, Bike, Navigation, Download, Share2, Layers } from "lucide-react"
import MapInterface from "./map-interface"

export default function ReachabilityAnalysis() {
  const [centerLocation, setCenterLocation] = useState("")
  const [analysisType, setAnalysisType] = useState("time")
  const [transportMode, setTransportMode] = useState("driving")
  const [timeRange, setTimeRange] = useState([15])
  const [distanceRange, setDistanceRange] = useState([5])

  const transportModes = [
    { id: "driving", name: "Driving", icon: Car, color: "text-blue-600" },
    { id: "walking", name: "Walking", icon: Navigation, color: "text-blue-600" },
    { id: "cycling", name: "Cycling", icon: Bike, color: "text-blue-600" },
    { id: "public", name: "Public Transit", icon: Bus, color: "text-blue-600" },
  ]

  const isochroneResults = [
    { time: "5 min", area: "12.3 km²", population: "15,420", pois: 45 },
    { time: "10 min", area: "48.7 km²", population: "62,180", pois: 156 },
    { time: "15 min", area: "89.2 km²", population: "124,350", pois: 287 },
    { time: "30 min", area: "245.6 km²", population: "456,780", pois: 892 },
  ]

  const poiCategories = [
    { name: "Restaurants", count: 156, percentage: 35 },
    { name: "Shopping", count: 89, percentage: 20 },
    { name: "Healthcare", count: 67, percentage: 15 },
    { name: "Education", count: 45, percentage: 10 },
    { name: "Entertainment", count: 43, percentage: 10 },
    { name: "Transport", count: 42, percentage: 10 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Analysis Controls */}
      <div className="lg:col-span-1 space-y-6">
        {/* Analysis Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Reachability Analysis</CardTitle>
            <CardDescription>Analyze what's reachable from a location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Center Location</label>
              <Input
                placeholder="Enter location or click on map"
                value={centerLocation}
                onChange={(e) => setCenterLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Type</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time-based (Isochrone)</SelectItem>
                  <SelectItem value="distance">Distance-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {transportModes.map((mode) => (
                  <Button
                    key={mode.id}
                    variant={transportMode === mode.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTransportMode(mode.id)}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <mode.icon className={`h-4 w-4 mb-1 ${mode.color}`} />
                    <span className="text-xs">{mode.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {analysisType === "time" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Range: {timeRange[0]} minutes</label>
                <Slider value={timeRange} onValueChange={setTimeRange} max={60} min={5} step={5} className="w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Distance Range: {distanceRange[0]} km</label>
                <Slider
                  value={distanceRange}
                  onValueChange={setDistanceRange}
                  max={20}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            )}

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Clock className="h-4 w-4 mr-2" />
              Generate Analysis
            </Button>
          </CardContent>
        </Card>

        {/* Isochrone Results */}
        <Card>
          <CardHeader>
            <CardTitle>Reachability Zones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isochroneResults.map((result, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4"
                style={{ borderLeftColor: `hsl(${220 + index * 30}, 70%, 50%)` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{result.time}</span>
                  <Badge variant="outline">{result.area}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div>Population: {result.population}</div>
                  <div>POIs: {result.pois}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export & Share</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export GeoJSON
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Share Analysis
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Layers className="h-4 w-4 mr-2" />
              Save as Layer
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Map and Analysis */}
      <div className="lg:col-span-2 space-y-6">
        {/* Interactive Map with Isochrones */}
        <MapInterface
          height="500px"
          markers={[{ lat: 51.5074, lng: -0.1278, title: "Analysis Center", type: "center" }]}
        />

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="pois">POIs</TabsTrigger>
                <TabsTrigger value="comparison">Compare</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">89.2</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">km² reachable</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">124K</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">People Reached</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">287</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">POIs</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">15</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">min travel</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Accessibility Score</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Accessibility</span>
                      <span className="font-semibold">8.5/10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="demographics" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold mb-2">Age Distribution</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>18-25</span>
                        <span>22%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>26-40</span>
                        <span>35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>41-65</span>
                        <span>28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>65+</span>
                        <span>15%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold mb-2">Income Levels</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Low</span>
                        <span>18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Medium</span>
                        <span>52%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>High</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pois" className="space-y-4">
                <div className="space-y-3">
                  {poiCategories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{category.count}</span>
                        <Badge variant="outline">{category.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comparison">
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select multiple locations to compare reachability</p>
                  <Button className="mt-4" variant="outline">
                    Add Comparison Point
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
