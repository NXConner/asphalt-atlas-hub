import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Package, Building2, Star, MapPin, Truck } from "lucide-react"
import { MATERIAL_COSTS, MATERIAL_SUPPLIER, BUSINESS_INFO } from "@/lib/business-config"

interface Material {
  id: string
  name: string
  category: "sealcoat" | "additives" | "crack-filling" | "sand" | "equipment" | "prep"
  description: string
  supplier: string
  price?: {
    amount: number
    unit: string
    bulk?: number
  }
  specifications: {
    coverage?: string
    applicationRate?: string
    mixRatio?: string
    weight?: string
    capacity?: string
  }
  inStock: boolean
  leadTime?: string
  isPrimary?: boolean
}

export const MaterialDatabase = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Virginia-specific materials based on Key knowledge and business config
  const materials: Material[] = [
    // PRIMARY SEALMASTER PRODUCTS
    {
      id: "sealmaster-pmm",
      name: "SealMaster PMM Asphalt Sealer Concentrate",
      category: "sealcoat",
      description: "Premium pavement maintenance sealer concentrate. Industry-leading performance with excellent adhesion and durability.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: MATERIAL_COSTS.sealMasterPMM.price,
        unit: "gallon",
        bulk: 3.65
      },
      specifications: {
        coverage: "70-82 sq ft per gallon (mixed)",
        applicationRate: "0.0144 gal/sq ft (1st coat)",
        mixRatio: "Add 10-30% water by volume",
        weight: "9-11 lbs per gallon"
      },
      inStock: true,
      isPrimary: true
    },
    {
      id: "sand-50lb",
      name: "Silica Sand - 50 lb bags",
      category: "sand",
      description: "Premium silica sand for sealcoat applications. Provides texture and slip resistance.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: MATERIAL_COSTS.sand50lb.price,
        unit: "50lb bag",
        bulk: 9.50
      },
      specifications: {
        mixRatio: "200-400 lbs per 100 gallons concentrate",
        coverage: "Average 300 lbs per 100 gallons",
        applicationRate: "3 lbs per gallon sealer"
      },
      inStock: true,
      isPrimary: true
    },
    {
      id: "prep-seal",
      name: "Prep Seal Oil Spot Primer",
      category: "prep",
      description: "Oil spot primer for treating stained areas before sealcoat application. Essential for proper adhesion over oil spots.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: MATERIAL_COSTS.prepSeal.price,
        unit: "5-gallon bucket",
        bulk: 47.50
      },
      specifications: {
        coverage: "750-1000 sq ft per bucket",
        applicationRate: "150-200 sq ft per gallon",
        mixRatio: "Ready to use"
      },
      inStock: true,
      leadTime: "2-3 days",
      isPrimary: true
    },
    {
      id: "fast-dry",
      name: "Fast Dry Additive (FASS-DRI PSA)",
      category: "additives",
      description: "Fast-drying polymer additive for improved cure times and enhanced performance.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: MATERIAL_COSTS.fastDry.price,
        unit: "5-gallon bucket",
        bulk: 48.00
      },
      specifications: {
        mixRatio: "2 gallons per 125 gallons concentrate",
        applicationRate: "1.6% by volume",
        coverage: "Accelerates cure time by 50%"
      },
      inStock: true,
      isPrimary: true
    },
    {
      id: "crack-master",
      name: "CrackMaster Crackfiller Parking Lot LP",
      category: "crack-filling",
      description: "Low-profile crack filler for asphalt surfaces. Excellent for parking lots and low-traffic areas.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: MATERIAL_COSTS.crackMaster.price,
        unit: "30lb box",
        bulk: 42.95
      },
      specifications: {
        coverage: "Variable based on crack width/depth",
        applicationRate: "$0.50-$3.00 per linear foot",
        mixRatio: "Hot applied at 375-400°F"
      },
      inStock: true,
      leadTime: "1-2 days",
      isPrimary: true
    },

    // ADDITIONAL SEALMASTER PRODUCTS
    {
      id: "sealmaster-latex",
      name: "SealMaster Latex Modified Sealer",
      category: "sealcoat",
      description: "Latex-modified sealer for enhanced flexibility and durability in extreme weather conditions.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: 4.25,
        unit: "gallon",
        bulk: 4.10
      },
      specifications: {
        coverage: "75-85 sq ft per gallon (mixed)",
        applicationRate: "0.012 gal/sq ft",
        mixRatio: "Add 15-25% water"
      },
      inStock: true,
      leadTime: "3-5 days"
    },
    {
      id: "sealmaster-commercial",
      name: "SealMaster Commercial Grade Sealer",
      category: "sealcoat",
      description: "Heavy-duty commercial grade sealer for high-traffic applications.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: 4.85,
        unit: "gallon",
        bulk: 4.65
      },
      specifications: {
        coverage: "65-75 sq ft per gallon (mixed)",
        applicationRate: "0.016 gal/sq ft",
        mixRatio: "Add 8-20% water"
      },
      inStock: true,
      leadTime: "2-4 days"
    },

    // EQUIPMENT AND SUPPLIES
    {
      id: "sk-550-tank",
      name: "SealMaster SK 550 Tank Sealing Machine",
      category: "equipment",
      description: "Skid-mounted 550-gallon sealing machine. Professional-grade equipment for large projects.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: 28500,
        unit: "each"
      },
      specifications: {
        capacity: "550 gallons",
        weight: "1,865 lbs (empty)",
        coverage: "Professional application system"
      },
      inStock: false,
      leadTime: "4-6 weeks"
    },
    {
      id: "spray-tips",
      name: "Professional Spray Tips",
      category: "equipment",
      description: "Replacement spray tips for sealcoat application equipment.",
      supplier: MATERIAL_SUPPLIER.name,
      price: {
        amount: 12.50,
        unit: "each",
        bulk: 11.75
      },
      specifications: {
        coverage: "Replace every 700 gallons mixed",
        applicationRate: "Various orifice sizes available"
      },
      inStock: true
    },

    // COMPETITIVE PRODUCTS (For comparison)
    {
      id: "generic-sealer",
      name: "Generic Asphalt Sealer",
      category: "sealcoat",
      description: "Basic asphalt sealer for budget-conscious projects.",
      supplier: "Local Supplier",
      price: {
        amount: 2.85,
        unit: "gallon"
      },
      specifications: {
        coverage: "60-70 sq ft per gallon",
        applicationRate: "0.017 gal/sq ft"
      },
      inStock: true,
      leadTime: "Same day"
    }
  ]

  const categories = [
    { value: "all", label: "All Materials" },
    { value: "sealcoat", label: "Sealcoating" },
    { value: "additives", label: "Additives" },
    { value: "sand", label: "Sand & Aggregates" },
    { value: "crack-filling", label: "Crack Filling" },
    { value: "prep", label: "Surface Prep" },
    { value: "equipment", label: "Equipment" }
  ]

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const primaryMaterials = filteredMaterials.filter(m => m.isPrimary)
  const otherMaterials = filteredMaterials.filter(m => !m.isPrimary)

  const formatPrice = (price: { amount: number; unit: string; bulk?: number }) => {
    return `$${price.amount.toFixed(2)} /${price.unit}${price.bulk ? ` (Bulk: $${price.bulk.toFixed(2)})` : ''}`
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          Virginia Materials Database
        </h1>
        <p className="text-muted-foreground mb-4">
          Professional-grade materials for asphalt maintenance and repair
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <Badge variant="outline" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Primary Supplier: {MATERIAL_SUPPLIER.name}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {MATERIAL_SUPPLIER.address}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Serving: {BUSINESS_INFO.address}
          </Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Materials</CardTitle>
          <CardDescription>Find materials by name, description, or supplier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Materials</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, description, or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label>Category</Label>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full">
                  {categories.map(category => (
                    <TabsTrigger key={category.value} value={category.value} className="text-xs">
                      {category.label.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary SealMaster Products */}
      {primaryMaterials.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h2 className="text-2xl font-bold">Primary SealMaster Products</h2>
            <Badge variant="default">Virginia Pricing</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {primaryMaterials.map((material) => (
              <Card key={material.id} className="shadow-elevation border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg leading-tight">{material.name}</CardTitle>
                      <CardDescription className="text-sm">{material.description}</CardDescription>
                    </div>
                    <Badge variant="default" className="ml-2">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-medium">{material.supplier}</span>
                    </div>
                    
                    {material.price && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold text-primary">
                          {formatPrice(material.price)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <Badge variant={material.inStock ? "default" : "secondary"}>
                        {material.inStock ? "In Stock" : "Special Order"}
                      </Badge>
                    </div>
                    
                    {material.leadTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lead Time:</span>
                        <span>{material.leadTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Specifications</h4>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      {material.specifications.coverage && (
                        <div>• Coverage: {material.specifications.coverage}</div>
                      )}
                      {material.specifications.applicationRate && (
                        <div>• Application: {material.specifications.applicationRate}</div>
                      )}
                      {material.specifications.mixRatio && (
                        <div>• Mix Ratio: {material.specifications.mixRatio}</div>
                      )}
                      {material.specifications.weight && (
                        <div>• Weight: {material.specifications.weight}</div>
                      )}
                      {material.specifications.capacity && (
                        <div>• Capacity: {material.specifications.capacity}</div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Materials */}
      {otherMaterials.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Additional Materials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {otherMaterials.map((material) => (
              <Card key={material.id} className="shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                  <CardDescription>{material.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-medium">{material.supplier}</span>
                    </div>
                    
                    {material.price && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold">
                          {formatPrice(material.price)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <Badge variant={material.inStock ? "default" : "secondary"}>
                        {material.inStock ? "In Stock" : "Special Order"}
                      </Badge>
                    </div>
                    
                    {material.leadTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Lead Time:</span>
                        <span>{material.leadTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Specifications</h4>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      {material.specifications.coverage && (
                        <div>• Coverage: {material.specifications.coverage}</div>
                      )}
                      {material.specifications.applicationRate && (
                        <div>• Application: {material.specifications.applicationRate}</div>
                      )}
                      {material.specifications.mixRatio && (
                        <div>• Mix Ratio: {material.specifications.mixRatio}</div>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No materials found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or category filter.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Supplier Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Primary Supplier Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">SealMaster - Madison, NC</h4>
                <p className="text-sm text-muted-foreground mb-3">{MATERIAL_SUPPLIER.address}</p>
                <div className="space-y-1 text-sm">
                  <div>• Primary supplier for {BUSINESS_INFO.name}</div>
                  <div>• Professional-grade asphalt maintenance products</div>
                  <div>• Competitive pricing for Virginia contractors</div>
                  <div>• Reliable delivery and support</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Pricing Information</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Prices shown are current Virginia rates</div>
                  <div>• Bulk pricing available for large orders</div>
                  <div>• Freight costs calculated separately</div>
                  <div>• Prices subject to change without notice</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Delivery Information</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Standard delivery to {BUSINESS_INFO.address.split(',')[1]}</div>
                  <div>• Minimum order quantities may apply</div>
                  <div>• Schedule delivery 24-48 hours in advance</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}