import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Paintbrush, Calculator, Car, Accessibility } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StripingResult {
  whitePaint: number
  yellowPaint: number
  bluePaint: number
  totalPaint: number
  laborHours: number
  estimatedCost: number
  parkingSpaces: number
  adaSpaces: number
}

export const StripingCalculator = () => {
  const { toast } = useToast()
  const [inputs, setInputs] = useState({
    lotLength: "",
    lotWidth: "",
    spaceWidth: "9",
    spaceLength: "18",
    driveWidth: "24",
    adaRequired: true,
    includeHandicap: true,
    fireZones: true,
    crosswalks: false,
    arrows: true,
    lineWidth: "4"
  })
  const [results, setResults] = useState<StripingResult | null>(null)

  const paintTypes = {
    "latex": { coverage: 375, costPerGal: 45 }, // sq ft per gallon at 4" width
    "thermoplastic": { coverage: 320, costPerGal: 85 },
    "epoxy": { coverage: 400, costPerGal: 65 }
  }

  const [paintType, setPaintType] = useState("latex")

  const calculateStriping = () => {
    if (!inputs.lotLength || !inputs.lotWidth || parseFloat(inputs.lotLength) <= 0 || parseFloat(inputs.lotWidth) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid lot dimensions",
        variant: "destructive"
      })
      return
    }

    const lotLength = parseFloat(inputs.lotLength)
    const lotWidth = parseFloat(inputs.lotWidth)
    const spaceWidth = parseFloat(inputs.spaceWidth)
    const spaceLength = parseFloat(inputs.spaceLength)
    const driveWidth = parseFloat(inputs.driveWidth)
    const lineWidth = parseFloat(inputs.lineWidth)
    
    // Calculate parking spaces
    const usableWidth = lotWidth - driveWidth
    const spacesPerRow = Math.floor(usableWidth / spaceWidth)
    const rows = Math.floor(lotLength / (spaceLength + 4)) // 4ft for driving lane
    const totalSpaces = spacesPerRow * rows
    
    // ADA requirements (1 space per 25 spaces, minimum 1)
    const adaSpaces = inputs.adaRequired ? Math.max(1, Math.ceil(totalSpaces / 25)) : 0
    
    // Calculate linear feet of striping
    let totalLinearFeet = 0
    
    // Parking space lines (vertical lines between spaces)
    totalLinearFeet += (spacesPerRow + 1) * rows * spaceLength
    
    // Horizontal lines (top and bottom of spaces)
    totalLinearFeet += spacesPerRow * rows * 2 * spaceWidth
    
    // Drive lane lines
    totalLinearFeet += lotLength * 2 // both sides of main drive
    
    // Fire zone striping (typically red/yellow)
    if (inputs.fireZones) {
      totalLinearFeet += (lotWidth + lotLength) * 2 * 0.1 // 10% of perimeter
    }
    
    // Crosswalks
    if (inputs.crosswalks) {
      totalLinearFeet += 100 // estimated crosswalk striping
    }
    
    // Arrows and symbols
    let symbolArea = 0
    if (inputs.arrows) {
      symbolArea += Math.floor(rows / 2) * 15 // 15 sq ft per arrow
    }
    
    // Handicap symbols
    if (inputs.includeHandicap && adaSpaces > 0) {
      symbolArea += adaSpaces * 12 // 12 sq ft per handicap symbol
    }
    
    // Convert linear feet to square feet based on line width
    const stripingArea = (totalLinearFeet * lineWidth) / 12 // convert inches to feet
    const totalArea = stripingArea + symbolArea
    
    // Paint calculations
    const paintInfo = paintTypes[paintType as keyof typeof paintTypes]
    const totalPaintGallons = totalArea / paintInfo.coverage
    
    // Paint distribution (typical percentages)
    const whitePaint = totalPaintGallons * 0.85 // 85% white
    const yellowPaint = totalPaintGallons * 0.10 // 10% yellow
    const bluePaint = totalPaintGallons * 0.05 // 5% blue (handicap)
    
    // Labor calculations (square feet per hour varies by method)
    const laborRate = 500 // sq ft per hour for machine application
    const laborHours = totalArea / laborRate
    
    // Cost calculations
    const paintCost = totalPaintGallons * paintInfo.costPerGal
    const laborCost = laborHours * 65 // $65/hour average
    const equipmentCost = totalArea * 0.05 // equipment overhead
    const estimatedCost = paintCost + laborCost + equipmentCost

    const result: StripingResult = {
      whitePaint: Math.round(whitePaint * 100) / 100,
      yellowPaint: Math.round(yellowPaint * 100) / 100,
      bluePaint: Math.round(bluePaint * 100) / 100,
      totalPaint: Math.round(totalPaintGallons * 100) / 100,
      laborHours: Math.round(laborHours * 10) / 10,
      estimatedCost: Math.round(estimatedCost * 100) / 100,
      parkingSpaces: totalSpaces,
      adaSpaces: adaSpaces
    }

    setResults(result)
    
    toast({
      title: "Calculation Complete",
      description: `Striping calculated for ${totalSpaces} parking spaces`,
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Paintbrush className="h-8 w-8 text-primary" />
          Parking Lot Striping Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate paint quantities and costs for parking lot line striping projects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Lot Specifications
            </CardTitle>
            <CardDescription>
              Enter parking lot dimensions and striping requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lotLength">Lot Length (feet)</Label>
                <Input
                  id="lotLength"
                  type="number"
                  placeholder="300"
                  value={inputs.lotLength}
                  onChange={(e) => setInputs({...inputs, lotLength: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lotWidth">Lot Width (feet)</Label>
                <Input
                  id="lotWidth"
                  type="number"
                  placeholder="150"
                  value={inputs.lotWidth}
                  onChange={(e) => setInputs({...inputs, lotWidth: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spaceWidth">Space Width (feet)</Label>
                <Input
                  id="spaceWidth"
                  type="number"
                  value={inputs.spaceWidth}
                  onChange={(e) => setInputs({...inputs, spaceWidth: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spaceLength">Space Length (feet)</Label>
                <Input
                  id="spaceLength"
                  type="number"
                  value={inputs.spaceLength}
                  onChange={(e) => setInputs({...inputs, spaceLength: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paintType">Paint Type</Label>
              <Select value={paintType} onValueChange={setPaintType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latex">Latex Traffic Paint</SelectItem>
                  <SelectItem value="thermoplastic">Thermoplastic</SelectItem>
                  <SelectItem value="epoxy">Epoxy Paint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lineWidth">Line Width (inches)</Label>
              <Select value={inputs.lineWidth} onValueChange={(value) => setInputs({...inputs, lineWidth: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 inches</SelectItem>
                  <SelectItem value="4">4 inches</SelectItem>
                  <SelectItem value="6">6 inches</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-semibold">Additional Features</Label>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="adaRequired" 
                  checked={inputs.adaRequired}
                  onCheckedChange={(checked) => setInputs({...inputs, adaRequired: !!checked})}
                />
                <Label htmlFor="adaRequired">ADA Compliance Required</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeHandicap" 
                  checked={inputs.includeHandicap}
                  onCheckedChange={(checked) => setInputs({...inputs, includeHandicap: !!checked})}
                />
                <Label htmlFor="includeHandicap">Handicap Symbols</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fireZones" 
                  checked={inputs.fireZones}
                  onCheckedChange={(checked) => setInputs({...inputs, fireZones: !!checked})}
                />
                <Label htmlFor="fireZones">Fire Zone Striping</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="crosswalks" 
                  checked={inputs.crosswalks}
                  onCheckedChange={(checked) => setInputs({...inputs, crosswalks: !!checked})}
                />
                <Label htmlFor="crosswalks">Crosswalks</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="arrows" 
                  checked={inputs.arrows}
                  onCheckedChange={(checked) => setInputs({...inputs, arrows: !!checked})}
                />
                <Label htmlFor="arrows">Directional Arrows</Label>
              </div>
            </div>

            <Button onClick={calculateStriping} className="w-full" size="lg">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Striping
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5" />
                Paint Requirements
              </CardTitle>
              <CardDescription>
                Detailed breakdown of paint and labor requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{results.parkingSpaces}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Car className="h-3 w-3" />
                    Parking Spaces
                  </div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{results.adaSpaces}</div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Accessibility className="h-3 w-3" />
                    ADA Spaces
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Paint Requirements:</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-lg font-bold">{results.whitePaint}</div>
                    <div className="text-xs text-muted-foreground">White (gal)</div>
                  </div>
                  <div className="text-center p-3 bg-warning/20 rounded-lg">
                    <div className="text-lg font-bold">{results.yellowPaint}</div>
                    <div className="text-xs text-muted-foreground">Yellow (gal)</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-lg font-bold">{results.bluePaint}</div>
                    <div className="text-xs text-muted-foreground">Blue (gal)</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Total Paint Needed:</span>
                  <span className="font-bold">{results.totalPaint} gallons</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Estimated Labor:</span>
                  <span>{results.laborHours} hours</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Project Cost:</span>
                  <span className="font-bold text-primary">${results.estimatedCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Striping Guidelines:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Standard parking space: 9' x 18'</li>
                  <li>• ADA space: 12' wide (8' + 4' access aisle)</li>
                  <li>• Apply in dry conditions above 50°F</li>
                  <li>• Allow 15-30 minutes dry time</li>
                  <li>• Use reflective beads for night visibility</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}