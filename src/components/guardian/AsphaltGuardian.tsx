import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Clock,
  Camera,
  Gauge,
  MapPin,
  Zap
} from "lucide-react"

export const AsphaltGuardian = () => {
  const [activeMonitoring, setActiveMonitoring] = useState(true)

  const qualityMetrics = [
    {
      name: "Surface Temperature",
      value: 68,
      unit: "°F",
      status: "optimal",
      range: "50-85°F",
      icon: Thermometer
    },
    {
      name: "Humidity Level",
      value: 45,
      unit: "%",
      status: "good",
      range: "30-70%",
      icon: CloudRain
    },
    {
      name: "Wind Speed",
      value: 8,
      unit: "mph",
      status: "acceptable",
      range: "0-15 mph",
      icon: Wind
    },
    {
      name: "Cure Time Remaining",
      value: 6.5,
      unit: "hours",
      status: "monitoring",
      range: "4-24 hours",
      icon: Clock
    }
  ]

  const siteInspections = [
    {
      id: "INS-001",
      site: "Walmart Plaza",
      type: "Pre-Application",
      status: "passed",
      inspector: "John Davis",
      date: "2024-01-15",
      score: 92,
      issues: 0
    },
    {
      id: "INS-002", 
      site: "Shopping Center",
      type: "Post-Application",
      status: "pending",
      inspector: "Sarah Johnson",
      date: "2024-01-16",
      score: null,
      issues: null
    },
    {
      id: "INS-003",
      site: "Office Complex",
      type: "Quality Control",
      status: "attention",
      inspector: "Mike Wilson",
      date: "2024-01-14",
      score: 78,
      issues: 2
    }
  ]

  const complianceChecks = [
    {
      category: "ADA Compliance",
      status: "compliant",
      lastCheck: "2024-01-15",
      nextCheck: "2024-02-15",
      details: "All accessibility requirements met"
    },
    {
      category: "Environmental Standards",
      status: "compliant",
      lastCheck: "2024-01-10", 
      nextCheck: "2024-02-10",
      details: "VOC levels within EPA limits"
    },
    {
      category: "Material Specifications",
      status: "warning",
      lastCheck: "2024-01-12",
      nextCheck: "2024-01-20",
      details: "Sealer batch #B2024-015 needs re-testing"
    },
    {
      category: "Safety Protocols",
      status: "compliant",
      lastCheck: "2024-01-14",
      nextCheck: "2024-02-14", 
      details: "All safety measures in place"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
      case "compliant":
      case "passed":
        return "text-success"
      case "good":
      case "monitoring":
      case "pending":
        return "text-primary"
      case "acceptable":
      case "warning":
      case "attention":
        return "text-warning"
      case "critical":
      case "failed":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "optimal":
      case "compliant":
      case "passed":
        return "default"
      case "warning":
      case "attention":
        return "outline"
      case "critical":
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Asphalt Guardian Suite
          </h1>
          <p className="text-muted-foreground">
            Advanced monitoring, quality control, and compliance management for asphalt operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${activeMonitoring ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
          <span className="text-sm text-muted-foreground">
            {activeMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
          </span>
          <Button 
            variant={activeMonitoring ? "outline" : "default"}
            onClick={() => setActiveMonitoring(!activeMonitoring)}
          >
            {activeMonitoring ? 'Pause' : 'Start'} Monitoring
          </Button>
        </div>
      </div>

      <Alert>
        <Eye className="h-4 w-4" />
        <AlertDescription>
          Guardian Suite continuously monitors environmental conditions, quality metrics, and compliance status across all active projects.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="inspections">Site Inspections</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {qualityMetrics.map((metric, index) => (
              <Card key={index} className="shadow-elevation">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <metric.icon className={`h-6 w-6 ${getStatusColor(metric.status)}`} />
                    <Badge variant={getStatusBadge(metric.status)}>{metric.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {metric.value} {metric.unit}
                    </div>
                    <div className="text-sm font-medium">{metric.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Optimal: {metric.range}
                    </div>
                    <Progress 
                      value={metric.name === "Cure Time Remaining" ? 73 : 
                             metric.status === "optimal" ? 90 : 
                             metric.status === "good" ? 75 : 60} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Real-Time Site Feed
              </CardTitle>
              <CardDescription>Live monitoring of active job sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold">Walmart Plaza</h4>
                  <p className="text-sm text-muted-foreground">Sealcoating - 65% Complete</p>
                  <div className="mt-2">
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-warning" />
                  <h4 className="font-semibold">Shopping Center</h4>
                  <p className="text-sm text-muted-foreground">Line Striping - Setup</p>
                  <div className="mt-2">
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-success" />
                  <h4 className="font-semibold">Office Complex</h4>
                  <p className="text-sm text-muted-foreground">Inspection Ready</p>
                  <div className="mt-2">
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {siteInspections.map((inspection) => (
              <Card key={inspection.id} className="shadow-elevation">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{inspection.site}</h3>
                      <p className="text-muted-foreground">{inspection.type} - {inspection.id}</p>
                    </div>
                    <Badge variant={getStatusBadge(inspection.status)}>
                      {inspection.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Inspector</p>
                      <p className="font-medium">{inspection.inspector}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(inspection.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Score</p>
                      <p className="font-medium">
                        {inspection.score ? `${inspection.score}/100` : 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issues</p>
                      <p className="font-medium">
                        {inspection.issues !== null ? inspection.issues : 'TBD'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {complianceChecks.map((check, index) => (
              <Card key={index} className="shadow-elevation">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {check.status === "compliant" ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        )}
                        {check.category}
                      </h3>
                      <p className="text-muted-foreground">{check.details}</p>
                      <div className="flex gap-4 text-sm">
                        <span>Last Check: {new Date(check.lastCheck).toLocaleDateString()}</span>
                        <span>Next Check: {new Date(check.nextCheck).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={getStatusBadge(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-elevation">
              <CardContent className="p-6 text-center">
                <Gauge className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">94.5%</div>
                <div className="text-sm text-muted-foreground">Quality Score Average</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-elevation">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold">98.2%</div>
                <div className="text-sm text-muted-foreground">Compliance Rate</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-elevation">
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-warning" />
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Active Monitoring Sites</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-elevation">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Historical quality and compliance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Project Completion Rate</span>
                    <span>96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Customer Satisfaction</span>
                    <span>98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Material Efficiency</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Schedule Adherence</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}