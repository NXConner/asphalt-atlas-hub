import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, Shield, AlertTriangle, CheckCircle, FileText, Map, Building, Users } from "lucide-react"

export const RegulationsGuide = () => {
  const federalRegulations = [
    {
      title: "Americans with Disabilities Act (ADA)",
      agency: "DOJ/Access Board",
      summary: "Parking lot accessibility requirements including space dimensions, signage, and access aisles",
      keyPoints: [
        "1 accessible space per 25 total spaces",
        "Minimum 8' wide with 5' access aisle", 
        "Van spaces: 11' wide with 5' access aisle",
        "Maximum 2% slope in any direction",
        "Proper signage and marking requirements"
      ],
      compliance: "mandatory",
      lastUpdated: "2024"
    },
    {
      title: "Clean Air Act - VOC Regulations",
      agency: "EPA",
      summary: "Volatile Organic Compound limits for sealcoating and striping materials",
      keyPoints: [
        "VOC content limits for sealers and paints",
        "Emission control requirements",
        "Application method restrictions",
        "Record keeping requirements"
      ],
      compliance: "mandatory",
      lastUpdated: "2023"
    },
    {
      title: "OSHA Safety Standards",
      agency: "OSHA",
      summary: "Worker safety requirements for asphalt and sealcoating operations",
      keyPoints: [
        "Personal protective equipment (PPE)",
        "Respiratory protection for coal tar exposure",
        "Traffic control during operations",
        "Chemical handling and storage"
      ],
      compliance: "mandatory",
      lastUpdated: "2024"
    },
    {
      title: "MUTCD - Traffic Control Standards",
      agency: "FHWA",
      summary: "Manual on Uniform Traffic Control Devices for striping and signage",
      keyPoints: [
        "Line width specifications (4-6 inches)",
        "Color standards for different markings",
        "Reflectivity requirements",
        "Work zone traffic control"
      ],
      compliance: "mandatory",
      lastUpdated: "2023"
    }
  ]

  const stateConsiderations = [
    {
      category: "Environmental Regulations",
      description: "State-specific environmental protection requirements",
      examples: [
        "Coal tar sealant bans (MN, WI, WA, CT, etc.)",
        "Storm water runoff regulations",
        "Air quality emission standards",
        "Waste disposal requirements"
      ]
    },
    {
      category: "Licensing & Permits",
      description: "Professional licensing and permit requirements",
      examples: [
        "Contractor licensing requirements",
        "Environmental permits for large projects",
        "Business registration and insurance",
        "Specialty trade certifications"
      ]
    },
    {
      category: "Material Standards",
      description: "State DOT specifications for materials and applications",
      examples: [
        "Approved material lists",
        "Performance specifications",
        "Testing and quality control",
        "Warranty requirements"
      ]
    }
  ]

  const localRequirements = [
    {
      type: "Municipal Codes",
      description: "City and county specific requirements",
      requirements: [
        "Building permit requirements for large lots",
        "Parking space ratios for businesses",
        "Fire lane specifications and markings",
        "Accessibility compliance beyond ADA minimums"
      ]
    },
    {
      type: "HOA & Property Standards",
      description: "Private property association rules",
      requirements: [
        "Aesthetic standards for materials and colors",
        "Maintenance schedules and requirements",
        "Approval processes for work",
        "Quality standards above code minimums"
      ]
    }
  ]

  const bestPractices = [
    {
      title: "Pre-Project Planning",
      items: [
        "Verify all applicable regulations before starting",
        "Obtain necessary permits and approvals",
        "Review insurance and bonding requirements",
        "Plan for weather and curing time"
      ]
    },
    {
      title: "Material Selection",
      items: [
        "Choose compliant sealers and paints",
        "Verify VOC content meets local limits",
        "Use approved materials from state DOT lists",
        "Consider environmental impact and durability"
      ]
    },
    {
      title: "Application Standards",
      items: [
        "Follow manufacturer application guidelines",
        "Maintain proper line widths and dimensions",
        "Use appropriate equipment and techniques",
        "Document work for compliance records"
      ]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Asphalt Regulations & Standards Guide
        </h1>
        <p className="text-muted-foreground">
          Comprehensive guide to federal, state, and local regulations for sealcoating and striping
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Regulations vary by location and change frequently. Always verify current local requirements before starting any project. This guide provides general information only.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="federal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="federal" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Federal
          </TabsTrigger>
          <TabsTrigger value="state" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            State
          </TabsTrigger>
          <TabsTrigger value="local" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Local
          </TabsTrigger>
          <TabsTrigger value="practices" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Best Practices
          </TabsTrigger>
        </TabsList>

        <TabsContent value="federal" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {federalRegulations.map((reg, index) => (
              <Card key={index} className="shadow-elevation">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {reg.title}
                      </CardTitle>
                      <CardDescription>{reg.agency} • Updated {reg.lastUpdated}</CardDescription>
                    </div>
                    <Badge variant={reg.compliance === "mandatory" ? "destructive" : "secondary"}>
                      {reg.compliance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">{reg.summary}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Requirements:</h4>
                    <ul className="space-y-1">
                      {reg.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="state" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {stateConsiderations.map((category, index) => (
              <Card key={index} className="shadow-elevation">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    {category.category}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Coal Tar Bans:</strong> Several states have banned coal tar sealants due to environmental concerns. Check your state's current regulations before selecting sealcoating materials.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="local" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {localRequirements.map((req, index) => (
              <Card key={index} className="shadow-elevation">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {req.type}
                  </CardTitle>
                  <CardDescription>{req.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {req.requirements.map((requirement, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Research Local Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Local requirements can vary significantly. Always research these sources:
                </p>
                <ul className="text-sm space-y-1">
                  <li>• City/County Building Department</li>
                  <li>• Local Fire Marshal Office</li>
                  <li>• Property Owner or HOA Guidelines</li>
                  <li>• Environmental Health Department</li>
                  <li>• State DOT District Office</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practices" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {bestPractices.map((practice, index) => (
              <Card key={index} className="shadow-elevation">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    {practice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {practice.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/10">
            <CardHeader>
              <CardTitle>Industry Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Professional Organizations:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Pavement Maintenance Contractors Association</li>
                    <li>• International Sealcoating Association</li>
                    <li>• National Pavement Contractors Association</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Resources:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• ASTM International Standards</li>
                    <li>• AASHTO Specifications</li>
                    <li>• Manufacturer Technical Data Sheets</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}