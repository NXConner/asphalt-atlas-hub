import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Droplets, Package, Truck, AlertTriangle, CheckCircle2, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { MATERIAL_COSTS, MIX_SPECIFICATIONS, APPLICATION_RATES, EQUIPMENT, CALCULATIONS, BUSINESS_INFO } from "@/lib/business-config"

interface SealcoatInputs {
  squareFeet: string
  secondCoat: boolean
  thirdCoat: boolean
  firstCoatCoverage: string // gallons per sq ft (undiluted)
  secondCoatCoverage: string
  thirdCoatCoverage: string
  sandAdded: boolean
  sandPerGallon: string // lbs per gallon before water
  polymerAdded: boolean
  polymerPercent: string // % of sealcoat mix before water
  oilSpotPriming: string // number of spots
  waterPercentage: string // water to seal mixture %
  jobLocation: string
  distanceFromBase: string
}

interface SealcoatResults {
  materials: {
    firstCoatSealer: number
    secondCoatSealer: number
    thirdCoatSealer: number
    totalUndilutedSealer: number
    sandPounds: number
    sandBags: number
    waterGallons: number
    polymerBuckets: number
    totalMixVolume: number
    oilSpotPrimerBuckets: number
  }
  costs: {
    sealerCost: number
    sandCost: number
    waterCost: number
    polymerCost: number
    oilSpotPrimerCost: number
    laborCost: number
    fuelCost: number
    totalMaterialCost: number
    totalProjectCost: number
  }
  logistics: {
    totalHours: number
    totalDays: number
    tankLoads: number
    truckWeight: {
      totalWeight: number
      withinGVWR: boolean
      warning: string
    }
  }
  coverage: {
    firstCoatSqFt: number
    secondCoatSqFt: number
    thirdCoatSqFt: number
    avgCoveragePerGallon: number
  }
}

export const SealcoatCalculator = () => {
  const { toast } = useToast()
  const [inputs, setInputs] = useState<SealcoatInputs>({
    squareFeet: "",
    secondCoat: false,
    thirdCoat: false,
    firstCoatCoverage: "0.0144", // 1.44444E-2 from Excel
    secondCoatCoverage: "0.0111", // 1.11111E-2 from Excel
    thirdCoatCoverage: "0.0111",
    sandAdded: true,
    sandPerGallon: "3", // lbs per gallon before water
    polymerAdded: false,
    polymerPercent: "3", // 3% polymer as in Excel
    oilSpotPriming: "0",
    waterPercentage: "20", // Default 20% water
    jobLocation: "",
    distanceFromBase: "0"
  })
  
  const [results, setResults] = useState<SealcoatResults | null>(null)

  const calculateMaterials = () => {
    if (!inputs.squareFeet || parseFloat(inputs.squareFeet) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid square footage",
        variant: "destructive"
      })
      return
    }

    const sqFt = parseFloat(inputs.squareFeet)
    const sqYards = CALCULATIONS.sqFtToSqYards(sqFt)
    
    // Calculate undiluted sealer needed for each coat (Excel formulas)
    const firstCoatRate = parseFloat(inputs.firstCoatCoverage)
    const secondCoatRate = parseFloat(inputs.secondCoatCoverage)
    const thirdCoatRate = parseFloat(inputs.thirdCoatCoverage)
    
    const firstCoatSealer = sqFt * firstCoatRate
    const secondCoatSealer = inputs.secondCoat ? sqFt * secondCoatRate : 0
    const thirdCoatSealer = inputs.thirdCoat ? sqFt * thirdCoatRate : 0
    const totalUndilutedSealer = firstCoatSealer + secondCoatSealer + thirdCoatSealer

    // Calculate sand (before water addition)
    const sandPerGallon = parseFloat(inputs.sandPerGallon)
    const sandPounds = inputs.sandAdded ? totalUndilutedSealer * sandPerGallon : 0
    const sandBags = Math.ceil(sandPounds / 50) // 50lb bags

    // Calculate polymer additives (before water)
    const polymerPercent = parseFloat(inputs.polymerPercent) / 100
    const polymerGallons = inputs.polymerAdded ? totalUndilutedSealer * polymerPercent : 0
    const polymerBuckets = Math.ceil(polymerGallons / 5) // 5-gallon buckets

    // Calculate water (Excel formula: water percentage of total solution)
    const waterPercent = parseFloat(inputs.waterPercentage) / 100
    const waterGallons = totalUndilutedSealer * (waterPercent / (1 - waterPercent))

    // Total mix volume including sand displacement
    const sandDisplacementGallons = sandPounds / 100 // Approximation from Excel
    const totalMixVolume = totalUndilutedSealer + waterGallons + polymerGallons + sandDisplacementGallons

    // Oil spot primer calculation
    const oilSpots = parseInt(inputs.oilSpotPriming) || 0
    const oilSpotPrimerBuckets = Math.ceil(oilSpots / 200) // ~200 spots per 5-gallon bucket

    // Calculate costs using Virginia pricing
    const sealerCost = totalUndilutedSealer * MATERIAL_COSTS.sealMasterPMM.price
    const sandCost = sandBags * MATERIAL_COSTS.sand50lb.price
    const waterCost = 0 // Assume water is free/minimal cost
    const polymerCost = polymerBuckets * MATERIAL_COSTS.fastDry.price
    const oilSpotPrimerCost = oilSpotPrimerBuckets * MATERIAL_COSTS.prepSeal.price
    const totalMaterialCost = sealerCost + sandCost + waterCost + polymerCost + oilSpotPrimerCost

    // Calculate labor hours (Excel approach: based on application speeds)
    const firstCoatSpeed = 5000 // sq ft per hour from Excel
    const secondCoatSpeed = 12000
    const thirdCoatSpeed = 14000
    
    let totalHours = firstCoatSealer > 0 ? sqFt / firstCoatSpeed : 0
    totalHours += secondCoatSealer > 0 ? sqFt / secondCoatSpeed : 0  
    totalHours += thirdCoatSealer > 0 ? sqFt / thirdCoatSpeed : 0
    totalHours += 1 // Add prep time from Excel
    
    const laborCost = totalHours * BUSINESS_INFO.employees.blendedRateWithOverhead

    // Calculate fuel/travel costs
    const distance = parseFloat(inputs.distanceFromBase) || 0
    const fuelCost = CALCULATIONS.travelCost(distance)

    // Equipment logistics
    const tankLoads = Math.ceil(totalMixVolume / EQUIPMENT.sealMaster.capacity)
    const totalDays = Math.ceil(totalHours / 8) // 8-hour work days
    
    // Truck weight calculation
    const truckWeight = CALCULATIONS.truckLoadWeight(totalMixVolume)

    // Coverage calculations
    const firstCoatSqFt = firstCoatSealer > 0 ? sqFt : 0
    const secondCoatSqFt = secondCoatSealer > 0 ? sqFt : 0  
    const thirdCoatSqFt = thirdCoatSealer > 0 ? sqFt : 0
    const totalSqFt = firstCoatSqFt + secondCoatSqFt + thirdCoatSqFt
    const avgCoveragePerGallon = totalSqFt / totalMixVolume

    const totalProjectCost = totalMaterialCost + laborCost + fuelCost

    const calculationResults: SealcoatResults = {
      materials: {
        firstCoatSealer: Math.round(firstCoatSealer * 100) / 100,
        secondCoatSealer: Math.round(secondCoatSealer * 100) / 100,
        thirdCoatSealer: Math.round(thirdCoatSealer * 100) / 100,
        totalUndilutedSealer: Math.round(totalUndilutedSealer * 100) / 100,
        sandPounds: Math.round(sandPounds * 100) / 100,
        sandBags,
        waterGallons: Math.round(waterGallons * 100) / 100,
        polymerBuckets,
        totalMixVolume: Math.round(totalMixVolume * 100) / 100,
        oilSpotPrimerBuckets
      },
      costs: {
        sealerCost: Math.round(sealerCost * 100) / 100,
        sandCost: Math.round(sandCost * 100) / 100,
        waterCost,
        polymerCost: Math.round(polymerCost * 100) / 100,
        oilSpotPrimerCost: Math.round(oilSpotPrimerCost * 100) / 100,
        laborCost: Math.round(laborCost * 100) / 100,
        fuelCost: Math.round(fuelCost * 100) / 100,
        totalMaterialCost: Math.round(totalMaterialCost * 100) / 100,
        totalProjectCost: Math.round(totalProjectCost * 100) / 100
      },
      logistics: {
        totalHours: Math.round(totalHours * 100) / 100,
        totalDays,
        tankLoads,
        truckWeight: {
          totalWeight: truckWeight.totalWeight,
          withinGVWR: truckWeight.withinGVWR,
          warning: truckWeight.withinGVWR ? "" : "WARNING: Exceeds truck GVWR!"
        }
      },
      coverage: {
        firstCoatSqFt,
        secondCoatSqFt,
        thirdCoatSqFt,
        avgCoveragePerGallon: Math.round(avgCoveragePerGallon * 100) / 100
      }
    }

    setResults(calculationResults)
    
    toast({
      title: "Calculation Complete",
      description: `Professional estimate generated for ${sqFt.toLocaleString()} sq ft project`,
    })
  }

  const formatCurrency = (amount: number) => `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Droplets className="h-8 w-8 text-primary" />
          Professional Sealcoat Calculator
        </h1>
        <p className="text-muted-foreground mb-2">
          Excel-based formulas with Virginia business specifications
        </p>
        <Badge variant="outline" className="text-sm">
          {BUSINESS_INFO.name} • {BUSINESS_INFO.address}
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Project Specifications
              </CardTitle>
              <CardDescription>
                Enter project details for accurate material and cost calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Project Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Total Area (Square Feet)</Label>
                  <Input
                    id="squareFeet"
                    type="number"
                    placeholder="25000"
                    value={inputs.squareFeet}
                    onChange={(e) => setInputs({...inputs, squareFeet: e.target.value})}
                    className="text-lg font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobLocation">Job Location</Label>
                  <Input
                    id="jobLocation"
                    placeholder="Customer address"
                    value={inputs.jobLocation}
                    onChange={(e) => setInputs({...inputs, jobLocation: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distanceFromBase">Distance from Base (Miles)</Label>
                <Input
                  id="distanceFromBase"
                  type="number"
                  placeholder="0"
                  value={inputs.distanceFromBase}
                  onChange={(e) => setInputs({...inputs, distanceFromBase: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Distance from {BUSINESS_INFO.address} for fuel cost calculation
                </p>
              </div>

              <Separator />

              {/* Coat Configuration */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Sealcoat Application
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Second Coat Applied?</Label>
                    <Select 
                      value={inputs.secondCoat ? "yes" : "no"} 
                      onValueChange={(value) => setInputs({...inputs, secondCoat: value === "yes"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No (1 Coat Only)</SelectItem>
                        <SelectItem value="yes">Yes (Apply 2nd Coat)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Third Coat Applied?</Label>
                    <Select 
                      value={inputs.thirdCoat ? "yes" : "no"} 
                      onValueChange={(value) => setInputs({...inputs, thirdCoat: value === "yes"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes (Apply 3rd Coat)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>1st Coat Coverage</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={inputs.firstCoatCoverage}
                      onChange={(e) => setInputs({...inputs, firstCoatCoverage: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Gal/sq ft (undiluted)</p>
                  </div>
                  
                  {inputs.secondCoat && (
                    <div className="space-y-2">
                      <Label>2nd Coat Coverage</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={inputs.secondCoatCoverage}
                        onChange={(e) => setInputs({...inputs, secondCoatCoverage: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">Gal/sq ft (undiluted)</p>
                    </div>
                  )}
                  
                  {inputs.thirdCoat && (
                    <div className="space-y-2">
                      <Label>3rd Coat Coverage</Label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={inputs.thirdCoatCoverage}
                        onChange={(e) => setInputs({...inputs, thirdCoatCoverage: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">Gal/sq ft (undiluted)</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Additives Configuration */}
              <div className="space-y-4">
                <h4 className="font-semibold">Mix Additives</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sand Added?</Label>
                    <Select 
                      value={inputs.sandAdded ? "yes" : "no"} 
                      onValueChange={(value) => setInputs({...inputs, sandAdded: value === "yes"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {inputs.sandAdded && (
                    <div className="space-y-2">
                      <Label>Sand (lbs per gallon)</Label>
                      <Input
                        type="number"
                        value={inputs.sandPerGallon}
                        onChange={(e) => setInputs({...inputs, sandPerGallon: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">Before water addition</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Polymer Added?</Label>
                    <Select 
                      value={inputs.polymerAdded ? "yes" : "no"} 
                      onValueChange={(value) => setInputs({...inputs, polymerAdded: value === "yes"})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {inputs.polymerAdded && (
                    <div className="space-y-2">
                      <Label>Polymer Percentage</Label>
                      <Input
                        type="number"
                        value={inputs.polymerPercent}
                        onChange={(e) => setInputs({...inputs, polymerPercent: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">% of mix (before water)</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Water Percentage</Label>
                    <Input
                      type="number"
                      value={inputs.waterPercentage}
                      onChange={(e) => setInputs({...inputs, waterPercentage: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">% of total solution</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Oil Spot Priming</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={inputs.oilSpotPriming}
                      onChange={(e) => setInputs({...inputs, oilSpotPriming: e.target.value})}
                    />
                    <p className="text-xs text-muted-foreground">Number of spots</p>
                  </div>
                </div>
              </div>

              <Button onClick={calculateMaterials} className="w-full" size="lg">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Materials & Costs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        {results && (
          <div className="space-y-6">
            <Tabs defaultValue="materials" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="materials" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Material Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>SealMaster PMM Concentrate:</span>
                          <span className="font-semibold">{results.materials.totalUndilutedSealer} gal</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          1st: {results.materials.firstCoatSealer} | 
                          2nd: {results.materials.secondCoatSealer} | 
                          3rd: {results.materials.thirdCoatSealer}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Water Needed:</span>
                        <span className="font-semibold">{results.materials.waterGallons} gal</span>
                      </div>
                    </div>

                    {inputs.sandAdded && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between">
                          <span>Sand Required:</span>
                          <span className="font-semibold">{results.materials.sandPounds} lbs</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sand Bags (50 lb):</span>
                          <span className="font-semibold">{results.materials.sandBags} bags</span>
                        </div>
                      </div>
                    )}

                    {inputs.polymerAdded && (
                      <div className="flex justify-between">
                        <span>Polymer Buckets (5 gal):</span>
                        <span className="font-semibold">{results.materials.polymerBuckets} buckets</span>
                      </div>
                    )}

                    {results.materials.oilSpotPrimerBuckets > 0 && (
                      <div className="flex justify-between">
                        <span>Oil Spot Primer (5 gal):</span>
                        <span className="font-semibold">{results.materials.oilSpotPrimerBuckets} buckets</span>
                      </div>
                    )}

                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Mix Volume:</span>
                      <span>{results.materials.totalMixVolume} gallons</span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Coverage: {results.coverage.avgCoveragePerGallon} sq ft per gallon mixed
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="costs" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>SealMaster PMM Concentrate:</span>
                        <span>{formatCurrency(results.costs.sealerCost)}</span>
                      </div>
                      
                      {inputs.sandAdded && (
                        <div className="flex justify-between">
                          <span>Sand ({results.materials.sandBags} bags):</span>
                          <span>{formatCurrency(results.costs.sandCost)}</span>
                        </div>
                      )}

                      {inputs.polymerAdded && (
                        <div className="flex justify-between">
                          <span>Polymer Additive:</span>
                          <span>{formatCurrency(results.costs.polymerCost)}</span>
                        </div>
                      )}

                      {results.costs.oilSpotPrimerCost > 0 && (
                        <div className="flex justify-between">
                          <span>Oil Spot Primer:</span>
                          <span>{formatCurrency(results.costs.oilSpotPrimerCost)}</span>
                        </div>
                      )}

                      <Separator />
                      
                      <div className="flex justify-between font-semibold">
                        <span>Material Subtotal:</span>
                        <span>{formatCurrency(results.costs.totalMaterialCost)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Labor ({results.logistics.totalHours} hrs):</span>
                        <span>{formatCurrency(results.costs.laborCost)}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Fuel & Travel:</span>
                        <span>{formatCurrency(results.costs.fuelCost)}</span>
                      </div>

                      <Separator />
                      
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Project Cost:</span>
                        <span>{formatCurrency(results.costs.totalProjectCost)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      * Prices based on Virginia suppliers. Add overhead and profit margin for customer pricing.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logistics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Project Logistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span>Total Hours:</span>
                        <span className="font-semibold">{results.logistics.totalHours} hrs</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Work Days:</span>
                        <span className="font-semibold">{results.logistics.totalDays} days</span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span>Tank Loads (550 gal):</span>
                      <span className="font-semibold">{results.logistics.tankLoads} loads</span>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-semibold">Equipment Load Analysis</h4>
                      <div className="flex justify-between">
                        <span>Total Truck Weight:</span>
                        <span className="font-semibold">{results.logistics.truckWeight.totalWeight.toLocaleString()} lbs</span>
                      </div>
                      
                      {!results.logistics.truckWeight.withinGVWR && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            {results.logistics.truckWeight.warning}
                            <br />Consider multiple trips or larger truck.
                          </AlertDescription>
                        </Alert>
                      )}
                      
                      {results.logistics.truckWeight.withinGVWR && (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>
                            Load is within 1978 Chevy C30 GVWR limits.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Summary</CardTitle>
                    <CardDescription>
                      Complete overview for {parseFloat(inputs.squareFeet || "0").toLocaleString()} sq ft project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{results.materials.totalUndilutedSealer}</div>
                        <div className="text-sm text-muted-foreground">Gallons PMM</div>
                      </div>
                      
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{formatCurrency(results.costs.totalProjectCost)}</div>
                        <div className="text-sm text-muted-foreground">Total Cost</div>
                      </div>
                      
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{results.logistics.totalDays}</div>
                        <div className="text-sm text-muted-foreground">Work Days</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Coverage Summary</h4>
                      <div className="text-sm space-y-1">
                        {results.coverage.firstCoatSqFt > 0 && (
                          <div>• 1st Coat: {results.coverage.firstCoatSqFt.toLocaleString()} sq ft</div>
                        )}
                        {results.coverage.secondCoatSqFt > 0 && (
                          <div>• 2nd Coat: {results.coverage.secondCoatSqFt.toLocaleString()} sq ft</div>
                        )}
                        {results.coverage.thirdCoatSqFt > 0 && (
                          <div>• 3rd Coat: {results.coverage.thirdCoatSqFt.toLocaleString()} sq ft</div>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground pt-4 border-t">
                      Calculations based on Excel formulas and Virginia business specifications.
                      <br />Generated by {BUSINESS_INFO.name} • Professional Grade Estimating System
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}