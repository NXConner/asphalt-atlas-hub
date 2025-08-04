import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, Square, Triangle, Circle, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RectangularSection {
  id: string
  length: string
  width: string
  area: number
}

interface TriangularSection {
  id: string
  base: string
  height: string
  area: number
}

interface CircularSection {
  id: string
  radius: string
  area: number
}

export const AreaCalculator = () => {
  const { toast } = useToast()
  
  // Rectangular sections
  const [rectangularSections, setRectangularSections] = useState<RectangularSection[]>([
    { id: '1', length: '', width: '', area: 0 }
  ])
  
  // Triangular sections  
  const [triangularSections, setTriangularSections] = useState<TriangularSection[]>([
    { id: '1', base: '', height: '', area: 0 }
  ])
  
  // Circular sections
  const [circularSections, setCircularSections] = useState<CircularSection[]>([
    { id: '1', radius: '', area: 0 }
  ])

  // Calculate rectangular area
  const calculateRectangularArea = (length: number, width: number) => {
    return length * width
  }

  // Calculate triangular area (Excel formula: 0.5 * base * height)
  const calculateTriangularArea = (base: number, height: number) => {
    return 0.5 * base * height
  }

  // Calculate circular area (Excel formula: π * radius²)
  const calculateCircularArea = (radius: number) => {
    return Math.PI * radius * radius
  }

  // Update rectangular section
  const updateRectangularSection = (id: string, field: 'length' | 'width', value: string) => {
    setRectangularSections(prev => prev.map(section => {
      if (section.id === id) {
        const updated = { ...section, [field]: value }
        const length = parseFloat(updated.length) || 0
        const width = parseFloat(updated.width) || 0
        updated.area = length && width ? calculateRectangularArea(length, width) : 0
        return updated
      }
      return section
    }))
  }

  // Update triangular section
  const updateTriangularSection = (id: string, field: 'base' | 'height', value: string) => {
    setTriangularSections(prev => prev.map(section => {
      if (section.id === id) {
        const updated = { ...section, [field]: value }
        const base = parseFloat(updated.base) || 0
        const height = parseFloat(updated.height) || 0
        updated.area = base && height ? calculateTriangularArea(base, height) : 0
        return updated
      }
      return section
    }))
  }

  // Update circular section
  const updateCircularSection = (id: string, value: string) => {
    setCircularSections(prev => prev.map(section => {
      if (section.id === id) {
        const updated = { ...section, radius: value }
        const radius = parseFloat(updated.radius) || 0
        updated.area = radius ? calculateCircularArea(radius) : 0
        return updated
      }
      return section
    }))
  }

  // Add new sections
  const addRectangularSection = () => {
    const newId = (rectangularSections.length + 1).toString()
    setRectangularSections(prev => [...prev, { id: newId, length: '', width: '', area: 0 }])
  }

  const addTriangularSection = () => {
    const newId = (triangularSections.length + 1).toString()
    setTriangularSections(prev => [...prev, { id: newId, base: '', height: '', area: 0 }])
  }

  const addCircularSection = () => {
    const newId = (circularSections.length + 1).toString()
    setCircularSections(prev => [...prev, { id: newId, radius: '', area: 0 }])
  }

  // Remove sections
  const removeRectangularSection = (id: string) => {
    if (rectangularSections.length > 1) {
      setRectangularSections(prev => prev.filter(section => section.id !== id))
    }
  }

  const removeTriangularSection = (id: string) => {
    if (triangularSections.length > 1) {
      setTriangularSections(prev => prev.filter(section => section.id !== id))
    }
  }

  const removeCircularSection = (id: string) => {
    if (circularSections.length > 1) {
      setCircularSections(prev => prev.filter(section => section.id !== id))
    }
  }

  // Calculate totals
  const totalRectangularArea = rectangularSections.reduce((sum, section) => sum + section.area, 0)
  const totalTriangularArea = triangularSections.reduce((sum, section) => sum + section.area, 0)
  const totalCircularArea = circularSections.reduce((sum, section) => sum + section.area, 0)
  const grandTotal = totalRectangularArea + totalTriangularArea + totalCircularArea

  const copyTotalToClipboard = () => {
    navigator.clipboard.writeText(grandTotal.toFixed(2))
    toast({
      title: "Copied to clipboard",
      description: `Total area: ${grandTotal.toFixed(2)} sq ft`,
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-primary" />
          Area Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate areas for multiple geometric sections from Excel formulas
        </p>
      </div>

      <Tabs defaultValue="rectangular" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rectangular" className="flex items-center gap-2">
            <Square className="h-4 w-4" />
            Rectangular
          </TabsTrigger>
          <TabsTrigger value="triangular" className="flex items-center gap-2">
            <Triangle className="h-4 w-4" />
            Triangular
          </TabsTrigger>
          <TabsTrigger value="circular" className="flex items-center gap-2">
            <Circle className="h-4 w-4" />
            Circular
          </TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Rectangular Sections */}
        <TabsContent value="rectangular" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Square className="h-5 w-5" />
                    Rectangular/Square Sections
                  </CardTitle>
                  <CardDescription>
                    Calculate areas for rectangular and square sections (Length × Width)
                  </CardDescription>
                </div>
                <Button onClick={addRectangularSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {rectangularSections.map((section, index) => (
                <div key={section.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Section {index + 1}</Label>
                    <Badge variant="outline">Rectangle</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`length-${section.id}`}>Length (ft)</Label>
                    <Input
                      id={`length-${section.id}`}
                      type="number"
                      placeholder="0"
                      value={section.length}
                      onChange={(e) => updateRectangularSection(section.id, 'length', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`width-${section.id}`}>Width (ft)</Label>
                    <Input
                      id={`width-${section.id}`}
                      type="number"
                      placeholder="0"
                      value={section.width}
                      onChange={(e) => updateRectangularSection(section.id, 'width', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Area (sq ft)</Label>
                    <div className="p-2 bg-muted rounded font-semibold text-primary">
                      {section.area.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeRectangularSection(section.id)}
                      disabled={rectangularSections.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total Rectangular Area:</span>
                <Badge variant="default" className="text-lg py-1 px-3">
                  {totalRectangularArea.toFixed(2)} sq ft
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Triangular Sections */}
        <TabsContent value="triangular" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Triangle className="h-5 w-5" />
                    Triangular Sections
                  </CardTitle>
                  <CardDescription>
                    Calculate areas for triangular sections (0.5 × Base × Height)
                  </CardDescription>
                </div>
                <Button onClick={addTriangularSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {triangularSections.map((section, index) => (
                <div key={section.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Section {index + 1}</Label>
                    <Badge variant="outline">Triangle</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`base-${section.id}`}>Base (ft)</Label>
                    <Input
                      id={`base-${section.id}`}
                      type="number"
                      placeholder="0"
                      value={section.base}
                      onChange={(e) => updateTriangularSection(section.id, 'base', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`height-${section.id}`}>Height (ft)</Label>
                    <Input
                      id={`height-${section.id}`}
                      type="number"
                      placeholder="0"
                      value={section.height}
                      onChange={(e) => updateTriangularSection(section.id, 'height', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Area (sq ft)</Label>
                    <div className="p-2 bg-muted rounded font-semibold text-primary">
                      {section.area.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeTriangularSection(section.id)}
                      disabled={triangularSections.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total Triangular Area:</span>
                <Badge variant="default" className="text-lg py-1 px-3">
                  {totalTriangularArea.toFixed(2)} sq ft
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Circular Sections */}
        <TabsContent value="circular" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Circle className="h-5 w-5" />
                    Circular Sections
                  </CardTitle>
                  <CardDescription>
                    Calculate areas for circular sections (π × Radius²)
                  </CardDescription>
                </div>
                <Button onClick={addCircularSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {circularSections.map((section, index) => (
                <div key={section.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Section {index + 1}</Label>
                    <Badge variant="outline">Circle</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`radius-${section.id}`}>Radius (ft)</Label>
                    <Input
                      id={`radius-${section.id}`}
                      type="number"
                      placeholder="0"
                      value={section.radius}
                      onChange={(e) => updateCircularSection(section.id, e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Area (sq ft)</Label>
                    <div className="p-2 bg-muted rounded font-semibold text-primary">
                      {section.area.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => removeCircularSection(section.id)}
                      disabled={circularSections.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold">Total Circular Area:</span>
                <Badge variant="default" className="text-lg py-1 px-3">
                  {totalCircularArea.toFixed(2)} sq ft
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Area Calculation Summary</CardTitle>
              <CardDescription>
                Complete breakdown of all calculated areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <Square className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{totalRectangularArea.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Rectangular Areas</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {rectangularSections.length} section{rectangularSections.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-muted rounded-lg">
                  <Triangle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{totalTriangularArea.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Triangular Areas</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {triangularSections.length} section{triangularSections.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-muted rounded-lg">
                  <Circle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{totalCircularArea.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Circular Areas</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {circularSections.length} section{circularSections.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">
                  {grandTotal.toFixed(2)} sq ft
                </div>
                <div className="text-lg text-muted-foreground">
                  Total Area of All Sections
                </div>
                
                <div className="space-y-2">
                  <Button onClick={copyTotalToClipboard} className="mr-2">
                    Copy to Clipboard
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    Use this total in your sealcoat calculator
                  </div>
                </div>
              </div>

              <Separator />

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold">Detailed Breakdown</h4>
                
                {rectangularSections.some(s => s.area > 0) && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Rectangular Sections
                    </h5>
                    <div className="space-y-1 text-sm">
                      {rectangularSections.map((section, index) => (
                        section.area > 0 && (
                          <div key={section.id} className="flex justify-between">
                            <span>Section {index + 1}: {section.length} × {section.width} ft</span>
                            <span className="font-semibold">{section.area.toFixed(2)} sq ft</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {triangularSections.some(s => s.area > 0) && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Triangle className="h-4 w-4" />
                      Triangular Sections
                    </h5>
                    <div className="space-y-1 text-sm">
                      {triangularSections.map((section, index) => (
                        section.area > 0 && (
                          <div key={section.id} className="flex justify-between">
                            <span>Section {index + 1}: Base {section.base} × Height {section.height} ft</span>
                            <span className="font-semibold">{section.area.toFixed(2)} sq ft</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {circularSections.some(s => s.area > 0) && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Circle className="h-4 w-4" />
                      Circular Sections
                    </h5>
                    <div className="space-y-1 text-sm">
                      {circularSections.map((section, index) => (
                        section.area > 0 && (
                          <div key={section.id} className="flex justify-between">
                            <span>Section {index + 1}: Radius {section.radius} ft</span>
                            <span className="font-semibold">{section.area.toFixed(2)} sq ft</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">Formula Reference:</h5>
                <div className="space-y-1">
                  <div>• Rectangle/Square: Length × Width</div>
                  <div>• Triangle: 0.5 × Base × Height</div>
                  <div>• Circle: π × Radius² ≈ 3.14159 × Radius²</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}