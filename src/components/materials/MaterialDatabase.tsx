import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Package, 
  Truck, 
  Thermometer, 
  Droplets, 
  Gauge,
  MapPin,
  Phone,
  Mail,
  Star,
  DollarSign,
  Calendar,
  Info
} from "lucide-react"

interface Material {
  id: string
  name: string
  category: string
  type: string
  manufacturer: string
  description: string
  specifications: {
    viscosity?: string
    temperature?: string
    coverage?: string
    dryTime?: string
    density?: string
    size?: string
  }
  applications: string[]
  price?: {
    unit: string
    amount: number
    bulk?: number
  }
  availability: "in-stock" | "limited" | "out-of-stock"
  rating: number
  lastUpdated: string
}

interface Supplier {
  id: string
  name: string
  contact: {
    phone: string
    email: string
    address: string
  }
  specialties: string[]
  rating: number
  deliveryRadius: number
  minimumOrder?: number
  materials: string[]
}

export const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")

  const materials: Material[] = [
    {
      id: "seal-1",
      name: "Premium Coal Tar Sealcoat",
      category: "sealcoat",
      type: "Coal Tar Emulsion",
      manufacturer: "SealMaster",
      description: "High-quality coal tar emulsion sealcoat for maximum protection and durability.",
      specifications: {
        viscosity: "75-125 KU",
        temperature: "Apply 50-90°F",
        coverage: "80-100 sq ft/gallon",
        dryTime: "4-8 hours"
      },
      applications: ["Parking lots", "Driveways", "Commercial surfaces"],
      price: {
        unit: "per gallon",
        amount: 2.85,
        bulk: 2.50
      },
      availability: "in-stock",
      rating: 4.5,
      lastUpdated: "2024-01-15"
    },
    {
      id: "seal-2",
      name: "Eco-Friendly Acrylic Sealcoat",
      category: "sealcoat",
      type: "Acrylic Emulsion",
      manufacturer: "GreenSeal Pro",
      description: "Environmentally friendly acrylic-based sealcoat with excellent UV resistance.",
      specifications: {
        viscosity: "65-85 KU",
        temperature: "Apply 45-85°F",
        coverage: "85-110 sq ft/gallon",
        dryTime: "2-4 hours"
      },
      applications: ["Residential driveways", "Light traffic areas"],
      price: {
        unit: "per gallon",
        amount: 3.25,
        bulk: 2.95
      },
      availability: "in-stock",
      rating: 4.2,
      lastUpdated: "2024-01-12"
    },
    {
      id: "crack-1",
      name: "Hot Pour Rubberized Crack Sealant",
      category: "crack-sealant",
      type: "Rubberized Asphalt",
      manufacturer: "CrackSeal Systems",
      description: "Professional grade hot pour sealant for long-lasting crack repair.",
      specifications: {
        temperature: "Heat to 380-400°F",
        coverage: "150-200 linear ft/lb",
        dryTime: "30-60 minutes"
      },
      applications: ["Highway cracks", "Parking lot maintenance", "Airport runways"],
      price: {
        unit: "per 50lb bag",
        amount: 45.50,
        bulk: 42.00
      },
      availability: "in-stock",
      rating: 4.7,
      lastUpdated: "2024-01-10"
    },
    {
      id: "paint-1",
      name: "High-Performance Traffic Paint",
      category: "striping",
      type: "Waterborne Paint",
      manufacturer: "StripeMax",
      description: "Durable waterborne traffic paint with excellent visibility and longevity.",
      specifications: {
        coverage: "350-400 linear ft/gallon (4\" line)",
        dryTime: "15-30 minutes",
        temperature: "Apply above 45°F"
      },
      applications: ["Parking lot striping", "Road marking", "Airport markings"],
      price: {
        unit: "per gallon",
        amount: 28.75,
        bulk: 26.50
      },
      availability: "limited",
      rating: 4.3,
      lastUpdated: "2024-01-08"
    },
    {
      id: "asphalt-1",
      name: "Hot Mix Asphalt - Type A",
      category: "asphalt",
      type: "Dense Graded Mix",
      manufacturer: "Regional Asphalt Co.",
      description: "Standard hot mix asphalt for general paving applications.",
      specifications: {
        size: "3/4\" maximum aggregate",
        temperature: "Lay at 280-320°F",
        density: "147-150 pcf"
      },
      applications: ["Road construction", "Parking lots", "Driveways"],
      price: {
        unit: "per ton",
        amount: 95.00,
        bulk: 88.00
      },
      availability: "in-stock",
      rating: 4.1,
      lastUpdated: "2024-01-14"
    },
    {
      id: "additive-1",
      name: "Sand Additive for Sealcoat",
      category: "additives",
      type: "Silica Sand",
      manufacturer: "ProMix Materials",
      description: "Fine silica sand additive for improved traction and texture.",
      specifications: {
        size: "30-60 mesh",
        coverage: "2-4 lbs per gallon of sealcoat"
      },
      applications: ["Sealcoat texture", "Anti-slip surfaces"],
      price: {
        unit: "per 50lb bag",
        amount: 12.50,
        bulk: 11.00
      },
      availability: "in-stock",
      rating: 4.0,
      lastUpdated: "2024-01-11"
    }
  ]

  const suppliers: Supplier[] = [
    {
      id: "sup-1",
      name: "Metro Paving Supply",
      contact: {
        phone: "(555) 123-4567",
        email: "orders@metropaving.com",
        address: "123 Industrial Blvd, Metro City, ST 12345"
      },
      specialties: ["Sealcoating materials", "Crack sealants", "Equipment"],
      rating: 4.6,
      deliveryRadius: 50,
      minimumOrder: 500,
      materials: ["seal-1", "crack-1", "additive-1"]
    },
    {
      id: "sup-2",
      name: "GreenLine Materials",
      contact: {
        phone: "(555) 987-6543",
        email: "info@greenlinematerials.com",
        address: "456 Eco Way, Green Valley, ST 54321"
      },
      specialties: ["Eco-friendly products", "Striping materials"],
      rating: 4.4,
      deliveryRadius: 35,
      minimumOrder: 300,
      materials: ["seal-2", "paint-1"]
    },
    {
      id: "sup-3",
      name: "Highway Materials Corp",
      contact: {
        phone: "(555) 456-7890",
        email: "sales@highwaymaterials.com",
        address: "789 Highway 1, Industrial Park, ST 67890"
      },
      specialties: ["Asphalt", "Highway materials", "Bulk orders"],
      rating: 4.2,
      deliveryRadius: 75,
      minimumOrder: 1000,
      materials: ["asphalt-1", "crack-1"]
    }
  ]

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "sealcoat", label: "Sealcoat" },
    { value: "crack-sealant", label: "Crack Sealant" },
    { value: "striping", label: "Striping Paint" },
    { value: "asphalt", label: "Asphalt" },
    { value: "additives", label: "Additives" }
  ]

  const availabilityOptions = [
    { value: "all", label: "All Availability" },
    { value: "in-stock", label: "In Stock" },
    { value: "limited", label: "Limited Stock" },
    { value: "out-of-stock", label: "Out of Stock" }
  ]

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory
    const matchesAvailability = selectedAvailability === "all" || material.availability === selectedAvailability
    
    return matchesSearch && matchesCategory && matchesAvailability
  })

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200"
      case "limited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "out-of-stock":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Material Database</h1>
        <p className="text-lg text-gray-600">
          Comprehensive database of materials, specifications, and suppliers for pavement projects
        </p>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials">Materials & Specifications</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers & Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search materials, manufacturers, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{material.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Package className="h-4 w-4" />
                        {material.manufacturer} • {material.type}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="outline" className={getAvailabilityColor(material.availability)}>
                        {material.availability.charAt(0).toUpperCase() + material.availability.slice(1).replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getRatingStars(material.rating)}
                        <span className="text-sm text-gray-600 ml-1">({material.rating})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{material.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Specifications</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(material.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Applications</h4>
                      <ul className="text-sm space-y-1">
                        {material.applications.map((app, index) => (
                          <li key={index} className="text-gray-600">• {app}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {material.price && (
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">
                          ${material.price.amount.toFixed(2)} {material.price.unit}
                        </span>
                        {material.price.bulk && (
                          <span className="text-sm text-gray-600">
                            (Bulk: ${material.price.bulk.toFixed(2)})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        Updated: {material.lastUpdated}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      {getRatingStars(supplier.rating)}
                      <span className="text-sm text-gray-600 ml-1">({supplier.rating})</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{supplier.contact.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{supplier.contact.email}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <span>{supplier.contact.address}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-500" />
                          <span>Delivery Radius: {supplier.deliveryRadius} miles</span>
                        </div>
                        {supplier.minimumOrder && (
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-500" />
                            <span>Minimum Order: ${supplier.minimumOrder}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {supplier.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Available Materials</h4>
                    <div className="text-sm text-gray-600">
                      {supplier.materials.length} materials available - 
                      {supplier.materials.map(materialId => {
                        const material = materials.find(m => m.id === materialId)
                        return material ? ` ${material.name}` : ''
                      }).join(',')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}