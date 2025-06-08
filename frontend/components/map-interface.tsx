"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layers, Maximize2, Download, Ruler } from "lucide-react"
import L from "leaflet"

interface MapInterfaceProps {
  height?: string
  showControls?: boolean
  markers?: Array<{
    lat: number
    lng: number
    title: string
    type: string
  }>
}

export default function MapInterface({ height = "400px", showControls = true, markers = [] }: MapInterfaceProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [activeLayer, setActiveLayer] = useState("streets")

  useEffect(() => {
    // Store map instance in a ref to avoid recreating the map on re-renders
    if (typeof window !== "undefined" && mapRef.current && !mapInstance) {
      // Fix for default markers in Leaflet with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/leaflet/marker-icon-2x.png",
        iconUrl: "/leaflet/marker-icon.png",
        shadowUrl: "/leaflet/marker-shadow.png",
      })

      // Create map instance
      const map = L.map(mapRef.current!).setView([51.505, -0.09], 13)

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map)

      // Add markers
      markers.forEach((marker) => {
        const leafletMarker = L.marker([marker.lat, marker.lng])
          .addTo(map)
          .bindPopup(`<b>${marker.title}</b><br>Type: ${marker.type}`)
      })

      setMapInstance(map)
    }

    // Clean up function
    return () => {
      if (mapInstance) {
        // Properly remove the map instance
        mapInstance.remove()
        setMapInstance(null)
      }
    }
  }, []) // Empty dependency array - we only want to create the map once

  // Add a separate useEffect to handle marker updates
  useEffect(() => {
    if (mapInstance) {
      // Clear existing markers
      mapInstance.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstance.removeLayer(layer)
        }
      })

      // Add new markers
      markers.forEach((marker) => {
        L.marker([marker.lat, marker.lng])
          .addTo(mapInstance)
          .bindPopup(`<b>${marker.title}</b><br>Type: ${marker.type}`)
      })
    }
  }, [markers, mapInstance])

  const layers = [
    { id: "streets", name: "Streets", active: true },
    { id: "satellite", name: "Satellite", active: false },
    { id: "terrain", name: "Terrain", active: false },
    { id: "traffic", name: "Traffic", active: false },
  ]

  return (
    <Card className="overflow-hidden">
      {showControls && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Interactive Map</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {layers.map((layer) => (
                  <Badge
                    key={layer.id}
                    variant={activeLayer === layer.id ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    {layer.name}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Ruler className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <div ref={mapRef} style={{ height, width: "100%" }} className="relative" />
      </CardContent>
    </Card>
  )
}
