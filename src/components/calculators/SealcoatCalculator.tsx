import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, Droplets, Palette, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SealcoatResult {
  concentratedSealer: number
  waterNeeded: number
  sandNeeded: number
  additiveNeeded: number
  totalVolume: number
  applicationRate: number
  estimatedCost: number
  coverage: number
}

export const SealcoatCalculator = () => {
  const { toast } = useToast()
  const [inputs, setInputs] = useState({
    squareFeet: "",
    coats: "1",
    applicationRate: "0.15", // gallons per square yard
    sealerType: "coal-tar",
    additivesPercent: "10",
    sandPounds: "50",
    waterRatio: "25"
  })
  const [results, setResults] = useState<SealcoatResult | null>(null)

  const sealerTypes = {
    "coal-tar": { name: "Coal Tar Emulsion", baseRate: 0.15, costPerGal: 2.50 },
    "asphalt-emulsion": { name: "Asphalt Emulsion", baseRate: 0.18, costPerGal: 2.25 },
    "acrylic": { name: "Acrylic Sealer", baseRate: 0.12, costPerGal: 3.00 },
    "refined-tar": { name: "Refined Tar", baseRate: 0.14, costPerGal: 2.75 }
  }

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
    const sqYards = sqFt / 9
    const coats = parseInt(inputs.coats)
    const appRate = parseFloat(inputs.applicationRate)
    const sealerInfo = sealerTypes[inputs.sealerType as keyof typeof sealerTypes]
    
    // Calculate total mixed sealer needed
    const totalMixedSealer = sqYards * appRate * coats
    
    // Calculate concentrated sealer (typically 60-70% of mix)
    const concentrationRatio = 0.65
    const concentratedSealer = totalMixedSealer * concentrationRatio
    
    // Calculate water needed
    const waterRatio = parseFloat(inputs.waterRatio) / 100
    const waterNeeded = concentratedSealer * waterRatio / (1 - waterRatio)
    
    // Calculate sand (pounds per 100 gallons of mix)
    const sandPer100Gal = parseFloat(inputs.sandPounds)
    const sandNeeded = (totalMixedSealer / 100) * sandPer100Gal
    
    // Calculate additives
    const additivePercent = parseFloat(inputs.additivesPercent) / 100
    const additiveNeeded = concentratedSealer * additivePercent
    
    // Total volume
    const totalVolume = concentratedSealer + waterNeeded + additiveNeeded
    
    // Cost estimation
    const sealerCost = concentratedSealer * sealerInfo.costPerGal
    const additiveCost = additiveNeeded * 4.50 // average additive cost
    const sandCost = sandNeeded * 0.15 // cost per pound
    const estimatedCost = sealerCost + additiveCost + sandCost
    
    // Coverage rate
    const coverage = sqFt / totalMixedSealer

    const result: SealcoatResult = {
      concentratedSealer: Math.round(concentratedSealer * 100) / 100,
      waterNeeded: Math.round(waterNeeded * 100) / 100,
      sandNeeded: Math.round(sandNeeded * 100) / 100,
      additiveNeeded: Math.round(additiveNeeded * 100) / 100,
      totalVolume: Math.round(totalVolume * 100) / 100,
      applicationRate: Math.round(appRate * 1000) / 1000,
      estimatedCost: Math.round(estimatedCost * 100) / 100,
      coverage: Math.round(coverage * 100) / 100
    }

    setResults(result)
    
    toast({
      title: "Calculation Complete",
      description: `Materials calculated for ${sqFt.toLocaleString()} sq ft`,
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Droplets className="h-8 w-8 text-primary" />
          Sealcoat Material Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate precise material quantities for sealcoating projects with industry-standard formulas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Project Details
            </CardTitle>
            <CardDescription>
              Enter your project specifications for accurate material calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="squareFeet">Area to Seal (Square Feet)</Label>
              <Input
                id="squareFeet"
                type="number"
                placeholder="10000"
                value={inputs.squareFeet}
                onChange={(e) => setInputs({...inputs, squareFeet: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coats">Number of Coats</Label>
              <Select value={inputs.coats} onValueChange={(value) => setInputs({...inputs, coats: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Coat</SelectItem>
                  <SelectItem value="2">2 Coats</SelectItem>
                  <SelectItem value="3">3 Coats</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sealerType">Sealer Type</Label>
              <Select value={inputs.sealerType} onValueChange={(value) => setInputs({...inputs, sealerType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(sealerTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationRate">Application Rate (Gallons per Sq Yard)</Label>
              <Input
                id="applicationRate"
                type="number"
                step="0.01"
                value={inputs.applicationRate}
                onChange={(e) => setInputs({...inputs, applicationRate: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterRatio">Water Ratio (%)</Label>
                <Input
                  id="waterRatio"
                  type="number"
                  value={inputs.waterRatio}
                  onChange={(e) => setInputs({...inputs, waterRatio: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sandPounds">Sand (lbs per 100 gal)</Label>
                <Input
                  id="sandPounds"
                  type="number"
                  value={inputs.sandPounds}
                  onChange={(e) => setInputs({...inputs, sandPounds: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additivesPercent">Additives (%)</Label>
              <Input
                id="additivesPercent"
                type="number"
                value={inputs.additivesPercent}
                onChange={(e) => setInputs({...inputs, additivesPercent: e.target.value})}
              />
            </div>

            <Button onClick={calculateMaterials} className="w-full" size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Materials
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Material Requirements
              </CardTitle>
              <CardDescription>
                Detailed breakdown of materials needed for your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{results.concentratedSealer}</div>
                  <div className="text-sm text-muted-foreground">Gallons Sealer</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{results.waterNeeded}</div>
                  <div className="text-sm text-muted-foreground">Gallons Water</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{results.sandNeeded}</div>
                  <div className="text-sm text-muted-foreground">Pounds Sand</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{results.additiveNeeded}</div>
                  <div className="text-sm text-muted-foreground">Gallons Additive</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Total Mixed Volume:</span>
                  <span className="font-bold">{results.totalVolume} gallons</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Application Rate:</span>
                  <span>{results.applicationRate} gal/sq yd</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Coverage:</span>
                  <span>{results.coverage} sq ft/gal</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Estimated Material Cost:</span>
                  <span className="font-bold text-primary">${results.estimatedCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Application Notes:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Apply when temperature is above 50°F</li>
                  <li>• Ensure surface is clean and dry</li>
                  <li>• Allow 24-48 hours cure time</li>
                  <li>• Check weather forecast for rain</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}