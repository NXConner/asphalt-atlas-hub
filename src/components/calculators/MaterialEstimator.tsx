import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calculator, Truck, Package, DollarSign, Clock, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MaterialEstimate {
  sealcoat: {
    concentrated: number
    water: number
    sand: number
    additives: number
    totalCost: number
  }
  striping: {
    whitePaint: number
    yellowPaint: number
    bluePaint: number
    totalCost: number
  }
  equipment: {
    sprayerHours: number
    stripeHours: number
    laborHours: number
    equipmentCost: number
  }
  totalProjectCost: number
  profitMargin: number
  clientQuote: number
}

export const MaterialEstimator = () => {
  const { toast } = useToast()
  const [projectInputs, setProjectInputs] = useState({
    projectName: "",
    sealcoatArea: "",
    stripingSpaces: "",
    projectType: "combined",
    clientType: "commercial",
    timeline: "standard",
    complexity: "standard"
  })
  const [estimate, setEstimate] = useState<MaterialEstimate | null>(null)

  const calculateFullEstimate = () => {
    if (!projectInputs.sealcoatArea && !projectInputs.stripingSpaces) {
      toast({
        title: "Invalid Input",
        description: "Please enter either sealcoat area or striping spaces",
        variant: "destructive"
      })
      return
    }

    const sealcoatSqFt = parseFloat(projectInputs.sealcoatArea) || 0
    const stripingSpaces = parseInt(projectInputs.stripingSpaces) || 0

    // Sealcoat calculations
    let sealcoatCost = 0
    let sealcoatMaterials = { concentrated: 0, water: 0, sand: 0, additives: 0, totalCost: 0 }
    
    if (sealcoatSqFt > 0) {
      const sqYards = sealcoatSqFt / 9
      const mixedSealer = sqYards * 0.15 // gallons per sq yard
      const concentrated = mixedSealer * 0.65
      const water = concentrated * 0.385
      const sand = (mixedSealer / 100) * 50 // 50 lbs per 100 gallons
      const additives = concentrated * 0.1
      
      sealcoatMaterials = {
        concentrated: Math.round(concentrated * 100) / 100,
        water: Math.round(water * 100) / 100,
        sand: Math.round(sand * 100) / 100,
        additives: Math.round(additives * 100) / 100,
        totalCost: Math.round((concentrated * 2.50 + additives * 4.50 + sand * 0.15) * 100) / 100
      }
      sealcoatCost = sealcoatMaterials.totalCost
    }

    // Striping calculations
    let stripingCost = 0
    let stripingMaterials = { whitePaint: 0, yellowPaint: 0, bluePaint: 0, totalCost: 0 }
    
    if (stripingSpaces > 0) {
      const totalPaint = stripingSpaces * 0.08 // approximate gallons per space
      const whitePaint = totalPaint * 0.85
      const yellowPaint = totalPaint * 0.10
      const bluePaint = totalPaint * 0.05
      
      stripingMaterials = {
        whitePaint: Math.round(whitePaint * 100) / 100,
        yellowPaint: Math.round(yellowPaint * 100) / 100,
        bluePaint: Math.round(bluePaint * 100) / 100,
        totalCost: Math.round((totalPaint * 45) * 100) / 100 // $45/gallon average
      }
      stripingCost = stripingMaterials.totalCost
    }

    // Equipment and labor calculations
    const sealcoatTime = sealcoatSqFt / 2000 // 2000 sq ft per hour
    const stripingTime = stripingSpaces / 25 // 25 spaces per hour
    const totalLaborHours = sealcoatTime + stripingTime + 2 // setup time

    const equipmentCosts = {
      sprayerHours: Math.round(sealcoatTime * 10) / 10,
      stripeHours: Math.round(stripingTime * 10) / 10,
      laborHours: Math.round(totalLaborHours * 10) / 10,
      equipmentCost: Math.round((sealcoatTime * 50 + stripingTime * 40 + totalLaborHours * 65) * 100) / 100
    }

    // Total project calculations
    const materialCost = sealcoatCost + stripingCost
    const totalCost = materialCost + equipmentCosts.equipmentCost

    // Pricing based on client type and complexity
    let baseMargin = 0.35 // 35% base margin
    if (projectInputs.clientType === "residential") baseMargin = 0.45
    if (projectInputs.complexity === "complex") baseMargin += 0.1
    if (projectInputs.timeline === "rush") baseMargin += 0.15

    const profitMargin = Math.round(baseMargin * 100)
    const clientQuote = Math.round(totalCost * (1 + baseMargin))

    const result: MaterialEstimate = {
      sealcoat: sealcoatMaterials,
      striping: stripingMaterials,
      equipment: equipmentCosts,
      totalProjectCost: Math.round(totalCost * 100) / 100,
      profitMargin,
      clientQuote
    }

    setEstimate(result)
    
    toast({
      title: "Estimate Complete",
      description: `Full project estimate calculated for ${projectInputs.projectName || 'Unnamed Project'}`,
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Package className="h-8 w-8 text-primary" />
          Complete Material & Cost Estimator
        </h1>
        <p className="text-muted-foreground">
          Comprehensive project estimation including materials, labor, equipment, and client pricing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Project Specification
            </CardTitle>
            <CardDescription>
              Enter complete project details for comprehensive estimation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Main Street Shopping Center"
                value={projectInputs.projectName}
                onChange={(e) => setProjectInputs({...projectInputs, projectName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sealcoatArea">Sealcoat Area (sq ft)</Label>
                <Input
                  id="sealcoatArea"
                  type="number"
                  placeholder="25000"
                  value={projectInputs.sealcoatArea}
                  onChange={(e) => setProjectInputs({...projectInputs, sealcoatArea: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripingSpaces">Parking Spaces</Label>
                <Input
                  id="stripingSpaces"
                  type="number"
                  placeholder="150"
                  value={projectInputs.stripingSpaces}
                  onChange={(e) => setProjectInputs({...projectInputs, stripingSpaces: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={projectInputs.projectType} onValueChange={(value) => setProjectInputs({...projectInputs, projectType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sealcoat-only">Sealcoating Only</SelectItem>
                  <SelectItem value="striping-only">Striping Only</SelectItem>
                  <SelectItem value="combined">Combined Project</SelectItem>
                  <SelectItem value="maintenance">Full Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientType">Client Type</Label>
                <Select value={projectInputs.clientType} onValueChange={(value) => setProjectInputs({...projectInputs, clientType: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="municipal">Municipal</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={projectInputs.timeline} onValueChange={(value) => setProjectInputs({...projectInputs, timeline: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                    <SelectItem value="rush">Rush (1-3 days)</SelectItem>
                    <SelectItem value="flexible">Flexible (2+ weeks)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Project Complexity</Label>
              <Select value={projectInputs.complexity} onValueChange={(value) => setProjectInputs({...projectInputs, complexity: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (Flat lot, easy access)</SelectItem>
                  <SelectItem value="standard">Standard (Some obstacles)</SelectItem>
                  <SelectItem value="complex">Complex (Multiple levels, tight access)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateFullEstimate} className="w-full" size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              Generate Complete Estimate
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {estimate && (
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Project Estimate
              </CardTitle>
              <CardDescription>
                Comprehensive breakdown of materials, labor, and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="materials" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="labor">Labor & Equipment</TabsTrigger>
                  <TabsTrigger value="pricing">Client Pricing</TabsTrigger>
                </TabsList>

                <TabsContent value="materials" className="space-y-4">
                  {estimate.sealcoat.totalCost > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Sealcoating Materials
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium">{estimate.sealcoat.concentrated} gal</div>
                          <div className="text-muted-foreground">Concentrated Sealer</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium">{estimate.sealcoat.water} gal</div>
                          <div className="text-muted-foreground">Water</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium">{estimate.sealcoat.sand} lbs</div>
                          <div className="text-muted-foreground">Sand</div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium">{estimate.sealcoat.additives} gal</div>
                          <div className="text-muted-foreground">Additives</div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-primary/10 rounded">
                        <div className="font-semibold">Sealcoat Cost: ${estimate.sealcoat.totalCost.toLocaleString()}</div>
                      </div>
                    </div>
                  )}

                  {estimate.striping.totalCost > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Striping Materials</h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="bg-muted/50 p-3 rounded">
                          <div className="font-medium">{estimate.striping.whitePaint} gal</div>
                          <div className="text-muted-foreground">White Paint</div>
                        </div>
                        <div className="bg-warning/20 p-3 rounded">
                          <div className="font-medium">{estimate.striping.yellowPaint} gal</div>
                          <div className="text-muted-foreground">Yellow Paint</div>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded">
                          <div className="font-medium">{estimate.striping.bluePaint} gal</div>
                          <div className="text-muted-foreground">Blue Paint</div>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-primary/10 rounded">
                        <div className="font-semibold">Striping Cost: ${estimate.striping.totalCost.toLocaleString()}</div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="labor" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-card rounded-lg">
                      <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-lg font-bold">{estimate.equipment.sprayerHours}h</div>
                      <div className="text-sm text-muted-foreground">Sprayer Time</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-card rounded-lg">
                      <Clock className="h-6 w-6 mx-auto mb-2 text-accent" />
                      <div className="text-lg font-bold">{estimate.equipment.stripeHours}h</div>
                      <div className="text-sm text-muted-foreground">Striping Time</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Labor Hours:</span>
                      <span className="font-semibold">{estimate.equipment.laborHours} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment & Labor Cost:</span>
                      <span className="font-semibold">${estimate.equipment.equipmentCost.toLocaleString()}</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pricing" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Material Costs:</span>
                      <span>${(estimate.sealcoat.totalCost + estimate.striping.totalCost).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor & Equipment:</span>
                      <span>${estimate.equipment.equipmentCost.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Project Cost:</span>
                      <span>${estimate.totalProjectCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Profit Margin:</span>
                      <Badge variant="outline">{estimate.profitMargin}%</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Client Quote:</span>
                      <span>${estimate.clientQuote.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Estimate Notes:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Prices based on current material costs</li>
                      <li>• Weather delays may affect timeline</li>
                      <li>• Final quote valid for 30 days</li>
                      <li>• Additional charges may apply for site preparation</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}