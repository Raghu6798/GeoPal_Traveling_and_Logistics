"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, Clock, Thermometer, DollarSign, Plus } from "lucide-react"
import MapInterface from "./map-interface"

export default function TripDashboard() {
  const recentTrips = [
    { id: 1, name: "Paris Weekend", status: "Planning", progress: 65, date: "Dec 15-17" },
    { id: 2, name: "Tokyo Business", status: "Confirmed", progress: 100, date: "Jan 8-12" },
    { id: 3, name: "London Getaway", status: "Draft", progress: 30, date: "Feb 20-25" },
  ]

  const quickStats = [
    { label: "Active Trips", value: "3", icon: Calendar, color: "text-blue-600" },
    { label: "Saved Locations", value: "24", icon: MapPin, color: "text-blue-600" },
    { label: "Total Distance", value: "2,847 km", icon: Clock, color: "text-blue-600" },
    { label: "Est. Budget", value: "$4,250", icon: DollarSign, color: "text-blue-600" },
  ]

  const stats = [
    { label: "Total Trips", value: "24", icon: Route, color: "text-blue-600" },
    { label: "Saved Locations", value: "24", icon: MapPin, color: "text-blue-600" },
    { label: "Time Saved", value: "12h", icon: Clock, color: "text-blue-600" },
    { label: "Cost Saved", value: "£156", icon: DollarSign, color: "text-blue-600" },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Trip Overview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quick Actions
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Trip
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
            <CardDescription>Your latest travel plans and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{trip.name}</h3>
                      <Badge
                        variant={
                          trip.status === "Confirmed" ? "default" : trip.status === "Planning" ? "secondary" : "outline"
                        }
                      >
                        {trip.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {trip.date}
                      </span>
                      <span>Progress: {trip.progress}%</span>
                    </div>
                    <Progress value={trip.progress} className="mt-2 h-2" />
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Map Overview */}
        <MapInterface
          height="300px"
          markers={[
            { lat: 48.8566, lng: 2.3522, title: "Paris", type: "Destination" },
            { lat: 35.6762, lng: 139.6503, title: "Tokyo", type: "Business" },
            { lat: 51.5074, lng: -0.1278, title: "London", type: "Leisure" },
          ]}
        />
      </div>

      {/* Right Column - Weather & Info */}
      <div className="space-y-6">
        {/* Weather Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
              Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">22°C</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Partly Cloudy</div>
                <div className="text-xs text-gray-500">Paris, France</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="font-semibold">Today</div>
                  <div className="text-gray-600 dark:text-gray-400">22°/15°</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="font-semibold">Tomorrow</div>
                  <div className="text-gray-600 dark:text-gray-400">25°/18°</div>
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="font-semibold">Wed</div>
                  <div className="text-gray-600 dark:text-gray-400">20°/12°</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Converter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
              Currency Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">USD → EUR</span>
                <span className="font-semibold">0.85</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">USD → GBP</span>
                <span className="font-semibold">0.79</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">USD → JPY</span>
                <span className="font-semibold">110.25</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Time Zones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">New York</span>
                <span className="font-semibold">2:30 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">London</span>
                <span className="font-semibold">7:30 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tokyo</span>
                <span className="font-semibold">3:30 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-500" />
              Saved Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["Eiffel Tower", "Central Park", "Big Ben", "Tokyo Station"].map((location, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm">{location}</span>
                  <Button variant="ghost" size="sm">
                    <MapPin className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
