import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Calendar, DollarSign, MapPin, Clock, CheckCircle, AlertTriangle, Truck } from "lucide-react"

export const ProjectDashboard = () => {
  const activeProjects = [
    {
      id: "P001",
      name: "Walmart Parking Lot - Sealcoating",
      location: "123 Main St, Springfield",
      status: "in-progress",
      progress: 65,
      startDate: "2024-01-15",
      expectedCompletion: "2024-01-20",
      budget: 15000,
      spent: 9750,
      type: "sealcoating",
      area: "45,000 sq ft"
    },
    {
      id: "P002", 
      name: "Shopping Center - Line Striping",
      location: "456 Oak Ave, Springfield",
      status: "scheduled",
      progress: 0,
      startDate: "2024-01-22",
      expectedCompletion: "2024-01-24",
      budget: 8500,
      spent: 0,
      type: "striping",
      area: "150 spaces"
    },
    {
      id: "P003",
      name: "Office Complex - Full Maintenance",
      location: "789 Business Dr, Springfield", 
      status: "completed",
      progress: 100,
      startDate: "2024-01-08",
      expectedCompletion: "2024-01-12",
      budget: 22000,
      spent: 21450,
      type: "full-service",
      area: "65,000 sq ft"
    }
  ]

  const equipment = [
    { name: "Sealcoat Sprayer #1", status: "available", location: "Shop", nextMaintenance: "2024-02-01" },
    { name: "Line Striper #1", status: "in-use", location: "Project P002", nextMaintenance: "2024-01-25" },
    { name: "Crack Sealer", status: "maintenance", location: "Shop", nextMaintenance: "2024-01-18" },
    { name: "Blower", status: "available", location: "Shop", nextMaintenance: "2024-02-15" }
  ]

  const getStatusColor = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "completed": return "default"
      case "in-progress": return "outline" 
      case "scheduled": return "secondary"
      case "overdue": return "destructive"
      default: return "secondary"
    }
  }

  const getEquipmentStatusColor = (status: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "available": return "default"
      case "in-use": return "outline"
      case "maintenance": return "destructive"
      default: return "secondary"
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Project Dashboard
          </h1>
          <p className="text-muted-foreground">Monitor active projects, equipment, and performance metrics</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Schedule New Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue This Month</p>
                <p className="text-2xl font-bold">$36,750</p>
              </div>
              <div className="bg-success/10 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Equipment Available</p>
                <p className="text-2xl font-bold">2/4</p>
              </div>
              <div className="bg-warning/10 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Project Time</p>
                <p className="text-2xl font-bold">4.2 days</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Projects */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Active Projects
            </CardTitle>
            <CardDescription>Current and upcoming asphalt projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-semibold">{project.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </p>
                    <p className="text-sm text-muted-foreground">{project.area}</p>
                  </div>
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>

                {project.status === "in-progress" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-medium">${project.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spent</p>
                    <p className="font-medium">${project.spent.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-muted-foreground">
                    Due: {new Date(project.expectedCompletion).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Equipment Status
            </CardTitle>
            <CardDescription>Monitor equipment availability and maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {equipment.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Location: {item.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Next maintenance: {new Date(item.nextMaintenance).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant={getEquipmentStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Maintenance
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="shadow-elevation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Key performance indicators for your asphalt business</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-card rounded-lg">
              <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-muted-foreground">On-Time Completion</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-card rounded-lg">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">15%</div>
              <div className="text-sm text-muted-foreground">Profit Margin</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-card rounded-lg">
              <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Pending Quotes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}