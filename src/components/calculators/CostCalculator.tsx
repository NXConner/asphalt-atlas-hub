import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator, 
  DollarSign, 
  Users, 
  Truck, 
  Package, 
  Clock,
  TrendingUp,
  FileText,
  Settings,
  PieChart
} from "lucide-react"

interface ProjectEstimate {
  materials: number
  labor: number
  equipment: number
  overhead: number
  profit: number
  total: number
}

interface MaterialCost {
  name: string
  quantity: number
  unit: string
  unitCost: number
  total: number
}

interface LaborCost {
  role: string
  hours: number
  rate: number
  total: number
}

export const CostCalculator = () => {
  const [projectType, setProjectType] = useState("")
  const [projectSize, setProjectSize] = useState("")
  const [location, setLocation] = useState("")
  const [laborRate, setLaborRate] = useState("25")
  const [overheadPercent, setOverheadPercent] = useState("15")
  const [profitPercent, setProfitPercent] = useState("20")
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null)
  const [materialCosts, setMaterialCosts] = useState<MaterialCost[]>([])
  const [laborCosts, setLaborCosts] = useState<LaborCost[]>([])

  const projectTypes = [
    { value: "sealcoat", label: "Sealcoating", baseRate: 0.15 },
    { value: "striping", label: "Line Striping", baseRate: 1.25 },
    { value: "crack-seal", label: "Crack Sealing", baseRate: 0.85 },
    { value: "paving", label: "Asphalt Paving", baseRate: 3.50 },
    { value: "resurfacing", label: "Resurfacing", baseRate: 2.25 },
    { value: "full-depth", label: "Full Depth Reclamation", baseRate: 4.75 }
  ]

  const locationFactors = [
    { value: "urban", label: "Urban Area", factor: 1.15 },
    { value: "suburban", label: "Suburban Area", factor: 1.0 },
    { value: "rural", label: "Rural Area", factor: 0.85 },
    { value: "highway", label: "Highway/Interstate", factor: 1.25 }
  ]

  const calculateEstimate = () => {
    if (!projectType || !projectSize || !location) return

    const selectedProject = projectTypes.find(p => p.value === projectType)
    const selectedLocation = locationFactors.find(l => l.value === location)
    
    if (!selectedProject || !selectedLocation) return

    const size = parseFloat(projectSize)
    const baseRate = selectedProject.baseRate
    const locationFactor = selectedLocation.factor
    
    // Calculate material costs
    const materialCostPerUnit = baseRate * 0.4 * locationFactor
    const totalMaterialCost = size * materialCostPerUnit

    // Calculate labor costs  
    const laborHours = calculateLaborHours(projectType, size)
    const hourlyRate = parseFloat(laborRate)
    const totalLaborCost = laborHours * hourlyRate

    // Calculate equipment costs
    const equipmentCost = calculateEquipmentCost(projectType, size, laborHours)

    // Calculate overhead and profit
    const subtotal = totalMaterialCost + totalLaborCost + equipmentCost
    const overheadCost = subtotal * (parseFloat(overheadPercent) / 100)
    const profitCost = (subtotal + overheadCost) * (parseFloat(profitPercent) / 100)
    
    const total = subtotal + overheadCost + profitCost

    const newEstimate: ProjectEstimate = {
      materials: totalMaterialCost,
      labor: totalLaborCost,
      equipment: equipmentCost,
      overhead: overheadCost,
      profit: profitCost,
      total: total
    }

    setEstimate(newEstimate)
    setMaterialCosts(generateMaterialBreakdown(projectType, size, materialCostPerUnit))
    setLaborCosts(generateLaborBreakdown(projectType, laborHours, hourlyRate))
  }

  const calculateLaborHours = (type: string, size: number): number => {
    const productivityRates = {
      "sealcoat": 0.002, // hours per sq ft
      "striping": 0.003, // hours per linear ft
      "crack-seal": 0.004, // hours per linear ft
      "paving": 0.005, // hours per sq ft
      "resurfacing": 0.004, // hours per sq ft
      "full-depth": 0.008 // hours per sq ft
    }
    
    return size * (productivityRates[type as keyof typeof productivityRates] || 0.003)
  }

  const calculateEquipmentCost = (type: string, size: number, hours: number): number => {
    const equipmentRates = {
      "sealcoat": 45, // per hour
      "striping": 35, // per hour
      "crack-seal": 55, // per hour
      "paving": 125, // per hour
      "resurfacing": 110, // per hour
      "full-depth": 180 // per hour
    }
    
    return hours * (equipmentRates[type as keyof typeof equipmentRates] || 50)
  }

  const generateMaterialBreakdown = (type: string, size: number, costPerUnit: number): MaterialCost[] => {
    const materials: { [key: string]: MaterialCost[] } = {
      "sealcoat": [
        { name: "Sealcoat Material", quantity: size / 90, unit: "gallons", unitCost: 2.75, total: 0 },
        { name: "Sand Additive", quantity: size / 500, unit: "bags", unitCost: 12.50, total: 0 },
        { name: "Primer/Cleaner", quantity: size / 1000, unit: "gallons", unitCost: 15.00, total: 0 }
      ],
      "striping": [
        { name: "Traffic Paint", quantity: size / 350, unit: "gallons", unitCost: 28.75, total: 0 },
        { name: "Glass Beads", quantity: size / 1000, unit: "bags", unitCost: 45.00, total: 0 },
        { name: "Primer", quantity: size / 2000, unit: "gallons", unitCost: 22.00, total: 0 }
      ],
      "crack-seal": [
        { name: "Hot Pour Sealant", quantity: size / 175, unit: "bags", unitCost: 45.50, total: 0 },
        { name: "Cleaning Materials", quantity: 1, unit: "lot", unitCost: 25.00, total: 0 }
      ],
      "paving": [
        { name: "Hot Mix Asphalt", quantity: size * 0.25, unit: "tons", unitCost: 95.00, total: 0 },
        { name: "Tack Coat", quantity: size / 300, unit: "gallons", unitCost: 3.25, total: 0 },
        { name: "Joint Sealant", quantity: 1, unit: "lot", unitCost: 150.00, total: 0 }
      ]
    }

    const projectMaterials = materials[type] || []
    return projectMaterials.map(material => ({
      ...material,
      total: material.quantity * material.unitCost
    }))
  }

  const generateLaborBreakdown = (type: string, totalHours: number, rate: number): LaborCost[] => {
    const laborDistribution: { [key: string]: { role: string, percentage: number }[] } = {
      "sealcoat": [
        { role: "Foreman", percentage: 0.15 },
        { role: "Equipment Operator", percentage: 0.3 },
        { role: "General Labor", percentage: 0.55 }
      ],
      "striping": [
        { role: "Foreman", percentage: 0.2 },
        { role: "Striping Operator", percentage: 0.4 },
        { role: "Helper", percentage: 0.4 }
      ],
      "paving": [
        { role: "Foreman", percentage: 0.1 },
        { role: "Paver Operator", percentage: 0.15 },
        { role: "Roller Operator", percentage: 0.2 },
        { role: "General Labor", percentage: 0.55 }
      ]
    }

    const rateMultipliers = {
      "Foreman": 1.4,
      "Equipment Operator": 1.2,
      "Paver Operator": 1.3,
      "Roller Operator": 1.2,
      "Striping Operator": 1.1,
      "General Labor": 1.0,
      "Helper": 0.9
    }

    const distribution = laborDistribution[type] || [
      { role: "Foreman", percentage: 0.2 },
      { role: "General Labor", percentage: 0.8 }
    ]

    return distribution.map(item => {
      const hours = totalHours * item.percentage
      const adjustedRate = rate * (rateMultipliers[item.role as keyof typeof rateMultipliers] || 1.0)
      return {
        role: item.role,
        hours: hours,
        rate: adjustedRate,
        total: hours * adjustedRate
      }
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Advanced Cost Calculator</h1>
        <p className="text-lg text-gray-600">
          Comprehensive project cost estimation with detailed breakdowns for materials, labor, and equipment
        </p>
      </div>

      <Tabs defaultValue="estimate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="estimate">Project Estimate</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="settings">Settings & Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="estimate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Project Parameters
              </CardTitle>
              <CardDescription>Enter project details to generate cost estimate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-type">Project Type</Label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location Type</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationFactors.map(loc => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-size">
                    Project Size ({projectType?.includes('striping') || projectType?.includes('crack') ? 'Linear Feet' : 'Square Feet'})
                  </Label>
                  <Input
                    id="project-size"
                    type="number"
                    value={projectSize}
                    onChange={(e) => setProjectSize(e.target.value)}
                    placeholder="Enter project size"
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={calculateEstimate} className="w-full">
                    Calculate Estimate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {estimate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Package className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Materials</p>
                      <p className="text-xl font-semibold text-blue-600">{formatCurrency(estimate.materials)}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Users className="h-6 w-6 mx-auto text-green-600 mb-2" />
                      <p className="text-sm text-gray-600">Labor</p>
                      <p className="text-xl font-semibold text-green-600">{formatCurrency(estimate.labor)}</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <Truck className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                      <p className="text-sm text-gray-600">Equipment</p>
                      <p className="text-xl font-semibold text-yellow-600">{formatCurrency(estimate.equipment)}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(estimate.materials + estimate.labor + estimate.equipment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overhead ({overheadPercent}%):</span>
                      <span className="font-medium">{formatCurrency(estimate.overhead)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit ({profitPercent}%):</span>
                      <span className="font-medium">{formatCurrency(estimate.profit)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Project Cost:</span>
                      <span className="text-green-600">{formatCurrency(estimate.total)}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Cost per unit:</strong> {formatCurrency(estimate.total / parseFloat(projectSize))} per {projectType?.includes('striping') || projectType?.includes('crack') ? 'linear foot' : 'square foot'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          {materialCosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Material Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {materialCosts.map((material, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-gray-600">
                          {material.quantity.toFixed(1)} {material.unit} × {formatCurrency(material.unitCost)}
                        </p>
                      </div>
                      <span className="font-semibold">{formatCurrency(material.total)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Total Materials:</span>
                    <span>{formatCurrency(materialCosts.reduce((sum, m) => sum + m.total, 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {laborCosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Labor Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {laborCosts.map((labor, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">{labor.role}</p>
                        <p className="text-sm text-gray-600">
                          {labor.hours.toFixed(1)} hours × {formatCurrency(labor.rate)}/hr
                        </p>
                      </div>
                      <span className="font-semibold">{formatCurrency(labor.total)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold">
                    <span>Total Labor:</span>
                    <span>{formatCurrency(laborCosts.reduce((sum, l) => sum + l.total, 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cost Settings
              </CardTitle>
              <CardDescription>Adjust rates and percentages for your local market</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="labor-rate">Base Labor Rate ($/hour)</Label>
                  <Input
                    id="labor-rate"
                    type="number"
                    value={laborRate}
                    onChange={(e) => setLaborRate(e.target.value)}
                    step="0.25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overhead-percent">Overhead Percentage (%)</Label>
                  <Input
                    id="overhead-percent"
                    type="number"
                    value={overheadPercent}
                    onChange={(e) => setOverheadPercent(e.target.value)}
                    step="1"
                    min="0"
                    max="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profit-percent">Profit Margin (%)</Label>
                  <Input
                    id="profit-percent"
                    type="number"
                    value={profitPercent}
                    onChange={(e) => setProfitPercent(e.target.value)}
                    step="1"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Prices are estimates based on national averages</li>
                  <li>• Actual costs may vary based on local market conditions</li>
                  <li>• Consider seasonal pricing fluctuations</li>
                  <li>• Include permits and inspection fees separately</li>
                  <li>• Review and adjust rates regularly</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}