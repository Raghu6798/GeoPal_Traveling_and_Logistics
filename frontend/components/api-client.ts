// Frontend API client for communicating with FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface Location {
  longitude: number
  latitude: number
}

export interface RouteRequest {
  locations: Location[]
  profile?: string
  preference?: string
  optimize_waypoints?: boolean
}

export interface POIRequest {
  coordinates: Location
  buffer?: number
  limit?: number
  filters?: {
    category_ids?: number[]
  }
}

export interface IsochroneRequest {
  locations: Location[]
  profile?: string
  range?: number[]
  range_type?: string
  intervals?: number
}

export interface OptimizationRequest {
  jobs: Array<{
    id: number
    location: [number, number]
    service?: number
    time_windows?: number[][]
    amount?: number[]
    skills?: number[]
    priority?: number
  }>
  vehicles: Array<{
    id: number
    start: [number, number]
    end?: [number, number]
    capacity?: number[]
    skills?: number[]
    time_window?: number[]
    profile?: string
  }>
  shipments?: any[]
  matrices?: any
}

class APIClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  async getDirections(request: RouteRequest) {
    return this.request("/api/directions", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async geocodeAddress(text: string) {
    return this.request("/api/geocode", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
  }

  async getPOIs(request: POIRequest) {
    return this.request("/api/pois", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getIsochrones(request: IsochroneRequest) {
    return this.request("/api/isochrones", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async optimizeRoutes(request: OptimizationRequest) {
    return this.request("/api/optimize", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async optimizeTSP(locations: Location[], startLocation?: Location, returnToStart = true) {
    return this.request("/api/optimize/tsp", {
      method: "POST",
      body: JSON.stringify({
        locations,
        start_location: startLocation,
        return_to_start: returnToStart,
      }),
    })
  }

  async createDeliveryProblem(
    deliveryLocations: Location[],
    depotLocation: Location,
    vehicleCapacity?: number[],
    serviceTimes?: number[],
    timeWindows?: Array<[number, number]>,
    profile = "driving-car",
  ) {
    return this.request("/api/optimize/delivery", {
      method: "POST",
      body: JSON.stringify({
        delivery_locations: deliveryLocations,
        depot_location: depotLocation,
        vehicle_capacity: vehicleCapacity,
        service_times: serviceTimes,
        time_windows: timeWindows,
        profile,
      }),
    })
  }
}

export const apiClient = new APIClient()
