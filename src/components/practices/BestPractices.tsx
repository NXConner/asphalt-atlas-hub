import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  FileText, 
  Shield, 
  Wrench,
  Clock,
  ThermometerSun,
  Droplets,
  HardHat,
  Book
} from "lucide-react"

interface BestPractice {
  id: string
  title: string
  category: string
  priority: "high" | "medium" | "low"
  description: string
  steps: string[]
  warnings?: string[]
  tips?: string[]
}

export const BestPractices = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const bestPractices: BestPractice[] = [
    {
      id: "sealcoat-prep",
      title: "Surface Preparation for Sealcoating",
      category: "sealcoating",
      priority: "high",
      description: "Proper surface preparation is critical for sealcoat adhesion and longevity.",
      steps: [
        "Clean all debris, dirt, and vegetation from surface",
        "Fill and repair all cracks larger than 1/4 inch",
        "Remove oil stains with degreaser or primer",
        "Allow surface to dry completely (24-48 hours after rain)",
        "Check for proper drainage and standing water issues"
      ],
      warnings: [
        "Never apply sealcoat to wet or damp surfaces",
        "Temperatures must be above 50°F and rising"
      ],
      tips: [
        "Use compressed air to remove debris from cracks",
        "Test sealcoat adhesion on a small area first"
      ]
    },
    {
      id: "striping-layout",
      title: "Parking Lot Layout and Striping",
      category: "striping",
      priority: "high",
      description: "Proper layout ensures compliance with ADA requirements and maximizes space efficiency.",
      steps: [
        "Review local ADA compliance requirements",
        "Calculate required number of accessible spaces (1:25 ratio minimum)",
        "Plan traffic flow patterns and fire lanes",
        "Mark layout with chalk or temporary paint",
        "Verify measurements before permanent striping",
        "Apply primer to new asphalt before striping"
      ],
      warnings: [
        "ADA violations can result in significant fines",
        "Fire lanes must be clearly marked and sized per local codes"
      ],
      tips: [
        "Use 4-inch wide lines for standard spaces",
        "6-inch wide lines for handicap spaces",
        "Allow paint to dry completely before removing tape"
      ]
    },
    {
      id: "crack-sealing",
      title: "Hot Pour Crack Sealing",
      category: "maintenance",
      priority: "high",
      description: "Proper crack sealing prevents water infiltration and extends pavement life.",
      steps: [
        "Clean cracks with compressed air or wire brush",
        "Heat sealant to manufacturer's specifications (380-400°F)",
        "Apply sealant slightly above pavement surface",
        "Allow to cool and cure before traffic",
        "Sand if necessary to prevent tracking"
      ],
      warnings: [
        "Hot sealant can cause severe burns",
        "Ensure proper ventilation when heating materials"
      ],
      tips: [
        "Work in temperatures above 40°F",
        "Use rubberized sealants for high-traffic areas"
      ]
    },
    {
      id: "asphalt-paving",
      title: "Hot Mix Asphalt Placement",
      category: "paving",
      priority: "high",
      description: "Proper paving techniques ensure long-lasting, durable surfaces.",
      steps: [
        "Verify base preparation and compaction",
        "Check temperature of asphalt mix (280-320°F)",
        "Maintain consistent paver speed (20-40 ft/min)",
        "Begin compaction while mix is still hot (above 220°F)",
        "Achieve required density (92-96% of maximum theoretical)",
        "Allow proper cooling time before opening to traffic"
      ],
      warnings: [
        "Cold mix will not compact properly",
        "Over-compaction can cause aggregate breakdown"
      ],
      tips: [
        "Use breakdown, intermediate, and finish rolling",
        "Match joints carefully for smooth transitions"
      ]
    },
    {
      id: "safety-protocols",
      title: "Worksite Safety Protocols",
      category: "safety",
      priority: "high",
      description: "Essential safety measures for all pavement maintenance operations.",
      steps: [
        "Establish proper traffic control devices",
        "Ensure all workers wear high-visibility clothing",
        "Use appropriate signage and flaggers when needed",
        "Maintain safe distances from traffic",
        "Provide proper ventilation for hot materials",
        "Keep fire extinguisher and first aid kit on site"
      ],
      warnings: [
        "Highway work zones are high-risk environments",
        "Hot asphalt and sealers can cause serious burns"
      ],
      tips: [
        "Review MUTCD guidelines for traffic control",
        "Conduct daily safety briefings with crew"
      ]
    },
    {
      id: "quality-control",
      title: "Quality Control Testing",
      category: "quality",
      priority: "medium",
      description: "Regular testing ensures work meets specifications and standards.",
      steps: [
        "Test asphalt temperature at delivery",
        "Check sealcoat application rate",
        "Verify line striping dimensions and spacing",
        "Conduct density tests on compacted asphalt",
        "Document all test results",
        "Address any deficiencies immediately"
      ],
      tips: [
        "Use calibrated equipment for accurate measurements",
        "Take photos for documentation purposes"
      ]
    }
  ]

  const categories = [
    { id: "all", label: "All Categories", icon: Book },
    { id: "sealcoating", label: "Sealcoating", icon: Droplets },
    { id: "striping", label: "Striping", icon: FileText },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "paving", label: "Paving", icon: ThermometerSun },
    { id: "safety", label: "Safety", icon: Shield },
    { id: "quality", label: "Quality Control", icon: CheckCircle }
  ]

  const filteredPractices = selectedCategory === "all" 
    ? bestPractices 
    : bestPractices.filter(practice => practice.category === selectedCategory)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Info className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Best Practices Guide</h1>
        <p className="text-lg text-gray-600">
          Industry standards and recommendations for professional asphalt and pavement work
        </p>
      </div>

      <Alert>
        <HardHat className="h-4 w-4" />
        <AlertTitle>Professional Standards</AlertTitle>
        <AlertDescription>
          These best practices are compiled from industry standards, manufacturer recommendations, 
          and professional experience. Always consult local regulations and specific product guidelines.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="practices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="practices">Best Practices</TabsTrigger>
          <TabsTrigger value="resources">Resources & Standards</TabsTrigger>
        </TabsList>

        <TabsContent value="practices" className="space-y-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>

          <div className="grid gap-6">
            {filteredPractices.map((practice) => (
              <Card key={practice.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{practice.title}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1 ${getPriorityColor(practice.priority)}`}
                    >
                      {getPriorityIcon(practice.priority)}
                      {practice.priority.charAt(0).toUpperCase() + practice.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  <CardDescription>{practice.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="steps">
                      <AccordionTrigger>Step-by-Step Process</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside space-y-2">
                          {practice.steps.map((step, index) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {practice.warnings && (
                      <AccordionItem value="warnings">
                        <AccordionTrigger className="text-red-700">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Important Warnings
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc list-inside space-y-1">
                            {practice.warnings.map((warning, index) => (
                              <li key={index} className="text-red-700">{warning}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                    
                    {practice.tips && (
                      <AccordionItem value="tips">
                        <AccordionTrigger className="text-green-700">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Pro Tips
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc list-inside space-y-1">
                            {practice.tips.map((tip, index) => (
                              <li key={index} className="text-green-700">{tip}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Industry Standards
                </CardTitle>
                <CardDescription>Key industry specifications and standards</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• ASTM D6690 - Standard Specification for Joint and Crack Sealants</li>
                  <li>• ASTM D6372 - Standard Practice for Design, Construction, and Evaluation of Slurry Seal</li>
                  <li>• ASTM D6497 - Standard Guide for Application of Sealcoats</li>
                  <li>• MUTCD - Manual on Uniform Traffic Control Devices</li>
                  <li>• ADA Standards for Accessible Design</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Safety Resources
                </CardTitle>
                <CardDescription>Essential safety guidelines and regulations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• OSHA Construction Standards (29 CFR Part 1926)</li>
                  <li>• ANSI/ISEA 107 - High-Visibility Safety Apparel</li>
                  <li>• NIOSH Criteria for Hot Mix Asphalt Workers</li>
                  <li>• Work Zone Safety Guidelines</li>
                  <li>• Material Safety Data Sheets (MSDS)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Educational Resources
                </CardTitle>
                <CardDescription>Training and certification programs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Pavement Maintenance Certification Programs</li>
                  <li>• Asphalt Institute Training Courses</li>
                  <li>• NAPA (National Asphalt Pavement Association)</li>
                  <li>• Local DOT Training Programs</li>
                  <li>• Equipment Manufacturer Training</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Quality Control
                </CardTitle>
                <CardDescription>Testing and inspection guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Nuclear Density Testing Procedures</li>
                  <li>• Core Sampling and Analysis</li>
                  <li>• Sealcoat Application Rate Testing</li>
                  <li>• Stripe Thickness and Retroreflectivity</li>
                  <li>• Documentation and Record Keeping</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}