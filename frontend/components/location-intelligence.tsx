"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { MapPin, Star, DollarSign, Filter, Search, Heart, Share2 } from "lucide-react"
import MapInterface from "./map-interface"

export default function LocationIntelligence() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [distanceRange, setDistanceRange] = useState([5])
  const [priceRange, setPriceRange] = useState([50])

  const categories = [
    { id: "all", name: "All Categories", count: 156 },
    { id: "restaurants", name: "Restaurants", count: 45 },
    { id: "hotels", name: "Hotels", count: 23 },
    { id: "attractions", name: "Attractions", count: 34 },
    { id: "shopping", name: "Shopping", count: 28 },
    { id: "transport", name: "Transport", count: 26 },
  ]

  const pois = [
    {
      id: 1,
      name: "The Shard",
      category: "Attractions",
      rating: 4.5,
      reviews: 12543,
      distance: "0.8 km",
      price: "£25",
      image: "/placeholder.svg?height=80&width=80",
      description: "Iconic skyscraper with observation deck",
    },
    {
      id: 2,
      name: "Borough Market",
      category: "Food & Drink",
      rating: 4.7,
      reviews: 8932,
      distance: "1.2 km",
      price: "Free",
      image: "/placeholder.svg?height=80&width=80",
      description: "Historic food market with local vendors",
    },
    {
      id: 3,
      name: "Tate Modern",
      category: "Museums",
      rating: 4.4,
      reviews: 15678,
      distance: "0.5 km",
      price: "Free",
      image: "/placeholder.svg?height=80&width=80",
      description: "Contemporary art museum in former power station",
    },
    {
      id: 4,
      name: "Premier Inn",
      category: "Hotels",
      rating: 4.2,
      reviews: 3421,
      distance: "0.3 km",
      price: "£89/night",
      image: "/placeholder.svg?height=80&width=80",
      description: "Modern hotel with comfortable rooms",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Search and Filters */}
      <div className="lg:col-span-1 space-y-6">
        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Discover Places</CardTitle>
            <CardDescription>Find points of interest near you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Distance: {distanceRange[0]} km</label>
              <Slider
                value={distanceRange}
                onValueChange={setDistanceRange}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Price: £{priceRange[0]}</label>
              <Slider value={priceRange} onValueChange={setPriceRange} max={200} min={0} step={5} className="w-full" />
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(1).map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="justify-start text-xs"
                >
                  {category.name}
                  <Badge variant="secondary" className="ml-auto">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Area Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total POIs</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Rating</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-semibold">4.3</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Price Range</span>
                <span className="font-semibold">£0 - £150</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Map and Results */}
      <div className="lg:col-span-2 space-y-6">
        {/* Interactive Map */}
        <MapInterface
          height="400px"
          markers={pois.map((poi) => ({
            lat: 51.5074 + (Math.random() - 0.5) * 0.01,
            lng: -0.1278 + (Math.random() - 0.5) * 0.01,
            title: poi.name,
            type: poi.category,
          }))}
        />

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>Found {pois.length} places matching your criteria</CardDescription>
              </div>
              <Select defaultValue="rating">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">By Rating</SelectItem>
                  <SelectItem value="distance">By Distance</SelectItem>
                  <SelectItem value="price">By Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                {pois.map((poi) => (
                  <div key={poi.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={poi.image || "/placeholder.svg"}
                      alt={poi.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{poi.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {poi.category}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{poi.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-semibold">{poi.rating}</span>
                            <span className="text-gray-500 ml-1">({poi.reviews.toLocaleString()})</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span>{poi.distance}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="font-semibold">{poi.price}</span>
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pois.map((poi) => (
                  <Card key={poi.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={poi.image || "/placeholder.svg"}
                        alt={poi.name}
                        className="w-full h-full object-cover"
                      />
                      <Button variant="ghost" size="sm" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{poi.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {poi.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{poi.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-semibold">{poi.rating}</span>
                        </div>
                        <span className="font-semibold text-blue-600">{poi.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
