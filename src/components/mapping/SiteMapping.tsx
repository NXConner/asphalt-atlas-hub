import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Map, 
  MapPin, 
  Ruler, 
  Calculator, 
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Move,
  Square,
  Circle,
  Polygon,
  Save,
  Trash2
} from "lucide-react"

interface Site {
  id: string
  name: string
  address: string
  type: string
  status: "active" | "completed" | "pending"
  area: number
  perimeter: number
  coordinates: { lat: number, lng: number }[]
  notes: string
  measurements: Measurement[]
}

interface Measurement {
  id: string
  type: "area" | "perimeter" | "distance"
  value: number
  unit: string
  label: string
  coordinates: { lat: number, lng: number }[]
}

export const SiteMapping = () => {
  const [selectedTool, setSelectedTool] = useState("move")
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [zoomLevel, setZoomLevel] = useState(16)

  const [newSite, setNewSite] = useState({
    name: "",
    address: "",
    type: "",
    notes: ""
  })

  const [sites, setSites] = useState<Site[]>([
    {
      id: "site-1",
      name: "Walmart Parking Lot",
      address: "123 Main St, Anytown, ST 12345",
      type: "commercial",
      status: "active",
      area: 45600, // square feet
      perimeter: 860, // linear feet
      coordinates: [
        { lat: 40.7128, lng: -74.0060 },
        { lat: 40.7138, lng: -74.0060 },
        { lat: 40.7138, lng: -74.0040 },
        { lat: 40.7128, lng: -74.0040 }
      ],
      notes: "Large retail parking lot. Sealcoating scheduled for Q2 2024.",
      measurements: [
        {
          id: "m1",
          type: "area",
          value: 45600,
          unit: "sq ft",
          label: "Total Parking Area",
          coordinates: []
        }
      ]
    },
    {
      id: "site-2",
      name: "Oak Hills Subdivision",
      address: "Oak Hills Dr, Suburbia, ST 54321",
      type: "residential",
      status: "pending",
      area: 125000,
      perimeter: 2400,
      coordinates: [
        { lat: 40.7200, lng: -74.0100 },
        { lat: 40.7250, lng: -74.0100 },
        { lat: 40.7250, lng: -74.0050 },
        { lat: 40.7200, lng: -74.0050 }
      ],
      notes: "HOA community roads and driveways. Multiple phases planned.",
      measurements: [
        {
          id: "m2",
          type: "area",
          value: 125000,
          unit: "sq ft",
          label: "Total Road Surface",
          coordinates: []
        }
      ]
    },
    {
      id: "site-3",
      name: "Highway 45 Section",
      address: "Highway 45, Mile Markers 12-18",
      type: "highway",
      status: "completed",
      area: 890000,
      perimeter: 6500,
      coordinates: [
        { lat: 40.7300, lng: -74.0200 },
        { lat: 40.7400, lng: -74.0180 },
        { lat: 40.7450, lng: -74.0160 },
        { lat: 40.7500, lng: -74.0140 }
      ],
      notes: "State highway crack sealing project completed January 2024.",
      measurements: [
        {
          id: "m3",
          type: "area",
          value: 890000,
          unit: "sq ft",
          label: "Highway Surface",
          coordinates: []
        }
      ]
    }
  ])

  const tools = [
    { id: "move", label: "Move", icon: Move },
    { id: "measure", label: "Measure", icon: Ruler },
    { id: "area", label: "Area", icon: Square },
    { id: "polygon", label: "Polygon", icon: Polygon },
    { id: "circle", label: "Circle", icon: Circle }
  ]

  const siteTypes = [
    { value: "commercial", label: "Commercial" },
    { value: "residential", label: "Residential" },
    { value: "highway", label: "Highway" },
    { value: "municipal", label: "Municipal" },
    { value: "industrial", label: "Industrial" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatArea = (area: number) => {
    if (area >= 43560) {
      return `${(area / 43560).toFixed(2)} acres`
    }
    return `${area.toLocaleString()} sq ft`
  }

  const formatDistance = (distance: number) => {
    if (distance >= 5280) {
      return `${(distance / 5280).toFixed(2)} miles`
    }
    return `${distance.toLocaleString()} ft`
  }

  const handleAddSite = () => {
    if (!newSite.name || !newSite.address) return

    const site: Site = {
      id: `site-${Date.now()}`,
      name: newSite.name,
      address: newSite.address,
      type: newSite.type,
      status: "pending",
      area: 0,
      perimeter: 0,
      coordinates: [],
      notes: newSite.notes,
      measurements: []
    }

    setSites([...sites, site])
    setNewSite({
      name: "",
      address: "",
      type: "",
      notes: ""
    })
    setShowAddForm(false)
  }

  const handleDeleteSite = (siteId: string) => {
    setSites(sites.filter(site => site.id !== siteId))
    if (selectedSite?.id === siteId) {
      setSelectedSite(null)
    }
  }

  const calculateTotalArea = () => {
    return sites.reduce((total, site) => total + site.area, 0)
  }

  const getProjectCost = (site: Site) => {
    // Basic cost estimation based on site type and area
    const costPerSqFt = {
      commercial: 0.25,
      residential: 0.20,
      highway: 0.35,
      municipal: 0.22,
      industrial: 0.28
    }
    
    const rate = costPerSqFt[site.type as keyof typeof costPerSqFt] || 0.25
    return site.area * rate
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Site Mapping</h1>
        <p className="text-lg text-gray-600">
          Interactive mapping with area calculations and project visualization
        </p>
      </div>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="sites">Site Management</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Map Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tools.map(tool => {
                    const IconComponent = tool.icon
                    return (
                      <Button
                        key={tool.id}
                        variant={selectedTool === tool.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTool(tool.id)}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {tool.label}
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Map Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.min(20, zoomLevel + 1))}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoomLevel(Math.max(10, zoomLevel - 1))}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Zoom Level: {zoomLevel}x
                  </div>
                </CardContent>
              </Card>

              {selectedSite && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Selected Site</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <h4 className="font-semibold">{selectedSite.name}</h4>
                    <p className="text-sm text-gray-600">{selectedSite.address}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Area:</span>
                        <span className="font-medium">{formatArea(selectedSite.area)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Perimeter:</span>
                        <span className="font-medium">{formatDistance(selectedSite.perimeter)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Cost:</span>
                        <span className="font-medium">${getProjectCost(selectedSite).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Project Site Map
                  </CardTitle>
                  <CardDescription>Interactive map showing all project sites and measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-gray-100 rounded-lg" style={{ height: "500px" }}>
                    {/* Simulated map interface */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <Map className="h-16 w-16 mx-auto text-gray-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-600">Interactive Map Interface</h3>
                          <p className="text-sm text-gray-500">
                            In a production environment, this would integrate with mapping services like Google Maps, 
                            Mapbox, or Leaflet for full interactive mapping capabilities.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                          {sites.slice(0, 4).map(site => (
                            <div
                              key={site.id}
                              className={`p-3 border rounded cursor-pointer transition-all ${
                                selectedSite?.id === site.id 
                                  ? 'border-blue-500 bg-blue-50' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              onClick={() => setSelectedSite(site)}
                            >
                              <MapPin className="h-4 w-4 text-blue-600 mb-1" />
                              <p className="text-xs font-medium">{site.name}</p>
                              <p className="text-xs text-gray-500">{formatArea(site.area)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Sites</p>
                  <p className="text-xl font-bold text-blue-600">{sites.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Square className="h-6 w-6 mx-auto text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Area</p>
                  <p className="text-xl font-bold text-green-600">{formatArea(calculateTotalArea())}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Calculator className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Est. Value</p>
                  <p className="text-xl font-bold text-purple-600">
                    ${sites.reduce((total, site) => total + getProjectCost(site), 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Button onClick={() => setShowAddForm(true)}>
              <MapPin className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </div>

          <div className="grid gap-4">
            {sites.map(site => (
              <Card key={site.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {site.address}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getStatusColor(site.status)}>
                        {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {siteTypes.find(t => t.value === site.type)?.label || site.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Area</h4>
                      <p className="text-sm text-gray-600">{formatArea(site.area)}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Perimeter</h4>
                      <p className="text-sm text-gray-600">{formatDistance(site.perimeter)}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Measurements</h4>
                      <p className="text-sm text-gray-600">{site.measurements.length} recorded</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Est. Cost</h4>
                      <p className="text-sm text-gray-600">${getProjectCost(site).toLocaleString()}</p>
                    </div>
                  </div>

                  {site.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Notes</h4>
                      <p className="text-sm text-gray-600">{site.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedSite(site)}
                    >
                      <Map className="h-4 w-4 mr-2" />
                      View on Map
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteSite(site.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="measurements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Measurement Tools
              </CardTitle>
              <CardDescription>Calculate areas, distances, and perimeters for project planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <Square className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <h4 className="font-semibold">Area Calculator</h4>
                    <p className="text-sm text-gray-600 mb-3">Measure rectangular or complex areas</p>
                    <Button size="sm" variant="outline">Start Measuring</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <Ruler className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <h4 className="font-semibold">Distance Tool</h4>
                    <p className="text-sm text-gray-600 mb-3">Measure linear distances and perimeters</p>
                    <Button size="sm" variant="outline">Start Measuring</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <Polygon className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                    <h4 className="font-semibold">Polygon Tool</h4>
                    <p className="text-sm text-gray-600 mb-3">Create custom shapes and boundaries</p>
                    <Button size="sm" variant="outline">Start Drawing</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Calculations</CardTitle>
              <CardDescription>Common area and material calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Area Conversions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1 acre =</span>
                      <span>43,560 sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 sq yard =</span>
                      <span>9 sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1 hectare =</span>
                      <span>107,639 sq ft</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Material Coverage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sealcoat:</span>
                      <span>80-100 sq ft/gal</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crack Sealant:</span>
                      <span>150-200 lf/bag</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Asphalt (2"):</span>
                      <span>~110 lb/sq ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAddForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Add New Site</CardTitle>
            <CardDescription>Register a new project site for mapping and measurement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name *</Label>
                <Input
                  id="site-name"
                  value={newSite.name}
                  onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                  placeholder="Enter site name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-type">Site Type</Label>
                <Select value={newSite.type} onValueChange={(value) => setNewSite({...newSite, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select site type" />
                  </SelectTrigger>
                  <SelectContent>
                    {siteTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={newSite.address}
                onChange={(e) => setNewSite({...newSite, address: e.target.value})}
                placeholder="Full site address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="site-notes">Notes</Label>
              <Textarea
                id="site-notes"
                value={newSite.notes}
                onChange={(e) => setNewSite({...newSite, notes: e.target.value})}
                placeholder="Project notes and details..."
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSite}>
                Add Site
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}