import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Truck, 
  Wrench, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Settings,
  BarChart3
} from "lucide-react"

interface Equipment {
  id: string
  name: string
  type: string
  manufacturer: string
  model: string
  year: number
  status: "available" | "in-use" | "maintenance" | "repair" | "out-of-service"
  condition: "excellent" | "good" | "fair" | "poor"
  location: string
  assignedTo?: string
  purchaseDate: string
  purchasePrice: number
  currentValue: number
  lastMaintenance: string
  nextMaintenance: string
  hoursUsed: number
  notes: string
  maintenanceHistory: MaintenanceRecord[]
}

interface MaintenanceRecord {
  id: string
  date: string
  type: "routine" | "repair" | "inspection"
  description: string
  cost: number
  performedBy: string
  hoursAtService: number
}

export const EquipmentTracker = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "",
    manufacturer: "",
    model: "",
    year: "",
    location: "",
    purchaseDate: "",
    purchasePrice: "",
    notes: ""
  })

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: "eq-1",
      name: "Sealcoat Tank #1",
      type: "sealcoat",
      manufacturer: "SealMaster",
      model: "ST-500",
      year: 2020,
      status: "available",
      condition: "excellent",
      location: "Main Depot",
      purchaseDate: "2020-03-15",
      purchasePrice: 12500,
      currentValue: 9500,
      lastMaintenance: "2024-01-10",
      nextMaintenance: "2024-04-10",
      hoursUsed: 1250,
      notes: "500-gallon capacity. Excellent condition.",
      maintenanceHistory: [
        {
          id: "maint-1",
          date: "2024-01-10",
          type: "routine",
          description: "Oil change, filter replacement, general inspection",
          cost: 125,
          performedBy: "Mike Johnson",
          hoursAtService: 1200
        }
      ]
    },
    {
      id: "eq-2",
      name: "Striping Machine Pro",
      type: "striping",
      manufacturer: "Graco",
      model: "LineLazer V 5900",
      year: 2019,
      status: "in-use",
      condition: "good",
      location: "Site A - Oak Hills",
      assignedTo: "Tom Wilson",
      purchaseDate: "2019-08-22",
      purchasePrice: 8900,
      currentValue: 6200,
      lastMaintenance: "2023-12-15",
      nextMaintenance: "2024-03-15",
      hoursUsed: 890,
      notes: "Airless striping machine. Due for maintenance soon.",
      maintenanceHistory: [
        {
          id: "maint-2",
          date: "2023-12-15",
          type: "routine",
          description: "Pump maintenance, tip replacement, calibration",
          cost: 175,
          performedBy: "Service Tech",
          hoursAtService: 850
        }
      ]
    },
    {
      id: "eq-3",
      name: "Crack Sealing Unit",
      type: "crack-seal",
      manufacturer: "Crafco",
      model: "Rocker M",
      year: 2021,
      status: "maintenance",
      condition: "good",
      location: "Service Shop",
      purchaseDate: "2021-05-10",
      purchasePrice: 28500,
      currentValue: 24000,
      lastMaintenance: "2024-01-18",
      nextMaintenance: "2024-07-18",
      hoursUsed: 680,
      notes: "Currently in shop for scheduled maintenance.",
      maintenanceHistory: [
        {
          id: "maint-3",
          date: "2024-01-18",
          type: "routine",
          description: "Hydraulic system service, burner cleaning, safety inspection",
          cost: 450,
          performedBy: "Crafco Service",
          hoursAtService: 680
        }
      ]
    },
    {
      id: "eq-4",
      name: "Compactor Roller",
      type: "paving",
      manufacturer: "Caterpillar",
      model: "CB-334E",
      year: 2018,
      status: "available",
      condition: "fair",
      location: "Equipment Yard",
      purchaseDate: "2018-04-12",
      purchasePrice: 45000,
      currentValue: 28000,
      lastMaintenance: "2023-11-30",
      nextMaintenance: "2024-02-28",
      hoursUsed: 2150,
      notes: "Shows wear but functional. Consider replacement in 2025.",
      maintenanceHistory: [
        {
          id: "maint-4",
          date: "2023-11-30",
          type: "repair",
          description: "Hydraulic leak repair, drum bearing replacement",
          cost: 850,
          performedBy: "Cat Service",
          hoursAtService: 2100
        }
      ]
    },
    {
      id: "eq-5",
      name: "Hot Box Trailer",
      type: "crack-seal",
      manufacturer: "Bergkamp",
      model: "HB-2000",
      year: 2022,
      status: "available",
      condition: "excellent",
      location: "Main Depot",
      purchaseDate: "2022-01-20",
      purchasePrice: 15800,
      currentValue: 14200,
      lastMaintenance: "2024-01-05",
      nextMaintenance: "2024-06-05",
      hoursUsed: 320,
      notes: "Newest addition to fleet. Excellent condition.",
      maintenanceHistory: [
        {
          id: "maint-5",
          date: "2024-01-05",
          type: "inspection",
          description: "Annual safety inspection, minor adjustments",
          cost: 75,
          performedBy: "Mike Johnson",
          hoursAtService: 300
        }
      ]
    }
  ])

  const equipmentTypes = [
    { value: "all", label: "All Equipment" },
    { value: "sealcoat", label: "Sealcoating" },
    { value: "striping", label: "Striping" },
    { value: "crack-seal", label: "Crack Sealing" },
    { value: "paving", label: "Paving" },
    { value: "general", label: "General Tools" }
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "available", label: "Available" },
    { value: "in-use", label: "In Use" },
    { value: "maintenance", label: "Maintenance" },
    { value: "repair", label: "Repair" },
    { value: "out-of-service", label: "Out of Service" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-use":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "repair":
        return "bg-red-100 text-red-800 border-red-200"
      case "out-of-service":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200"
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "poor":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    const matchesType = filterType === "all" || item.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.type) return

    const equipment_item: Equipment = {
      id: `eq-${Date.now()}`,
      name: newEquipment.name,
      type: newEquipment.type,
      manufacturer: newEquipment.manufacturer,
      model: newEquipment.model,
      year: parseInt(newEquipment.year) || new Date().getFullYear(),
      status: "available",
      condition: "good",
      location: newEquipment.location,
      purchaseDate: newEquipment.purchaseDate,
      purchasePrice: parseFloat(newEquipment.purchasePrice) || 0,
      currentValue: parseFloat(newEquipment.purchasePrice) || 0,
      lastMaintenance: "",
      nextMaintenance: "",
      hoursUsed: 0,
      notes: newEquipment.notes,
      maintenanceHistory: []
    }

    setEquipment([...equipment, equipment_item])
    setNewEquipment({
      name: "",
      type: "",
      manufacturer: "",
      model: "",
      year: "",
      location: "",
      purchaseDate: "",
      purchasePrice: "",
      notes: ""
    })
    setShowAddForm(false)
  }

  const handleDeleteEquipment = (equipmentId: string) => {
    setEquipment(equipment.filter(item => item.id !== equipmentId))
  }

  const handleStatusChange = (equipmentId: string, newStatus: string) => {
    setEquipment(equipment.map(item => 
      item.id === equipmentId ? { ...item, status: newStatus as Equipment['status'] } : item
    ))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getTotalValue = () => {
    return equipment.reduce((sum, item) => sum + item.currentValue, 0)
  }

  const getMaintenanceDue = () => {
    const today = new Date().toISOString().split('T')[0]
    return equipment.filter(item => item.nextMaintenance && item.nextMaintenance <= today)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Equipment Tracker</h1>
        <p className="text-lg text-gray-600">
          Manage machinery inventory, maintenance schedules, and equipment utilization
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Truck className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-sm text-gray-600">Total Equipment</p>
            <p className="text-2xl font-bold text-blue-600">{equipment.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl font-bold text-green-600">
              {equipment.filter(item => item.status === "available").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
            <p className="text-sm text-gray-600">Maintenance Due</p>
            <p className="text-2xl font-bold text-yellow-600">{getMaintenanceDue().length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(getTotalValue())}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Equipment Inventory</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredEquipment.map(item => (
              <Card key={item.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>
                        {item.manufacturer} {item.model} ({item.year})
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getConditionColor(item.condition)}>
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                      <p className="text-sm text-gray-600">{item.location}</p>
                      {item.assignedTo && (
                        <p className="text-xs text-blue-600">Assigned to: {item.assignedTo}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Usage</h4>
                      <p className="text-sm text-gray-600">{item.hoursUsed} hours</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Value</h4>
                      <p className="text-sm text-gray-600">{formatCurrency(item.currentValue)}</p>
                      <p className="text-xs text-gray-500">Purchased: {formatCurrency(item.purchasePrice)}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Next Maintenance</h4>
                      <p className={`text-sm ${
                        item.nextMaintenance && item.nextMaintenance <= new Date().toISOString().split('T')[0] 
                          ? 'text-red-600 font-medium' 
                          : 'text-gray-600'
                      }`}>
                        {item.nextMaintenance || 'Not scheduled'}
                      </p>
                    </div>
                  </div>

                  {item.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Notes</h4>
                      <p className="text-sm text-gray-600">{item.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Select value={item.status} onValueChange={(value) => handleStatusChange(item.id, value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-use">In Use</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="out-of-service">Out of Service</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedEquipment(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteEquipment(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Schedule
              </CardTitle>
              <CardDescription>Equipment requiring maintenance attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getMaintenanceDue().map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-600">Due: {item.nextMaintenance}</p>
                      <p className="text-xs text-gray-500">{item.hoursUsed} hours</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Maintenance Due
                    </Badge>
                  </div>
                ))}
                {getMaintenanceDue().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>All equipment maintenance is up to date!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Equipment by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusOptions.slice(1).map(status => {
                    const count = equipment.filter(item => item.status === status.value).length
                    const percentage = equipment.length > 0 ? (count / equipment.length) * 100 : 0
                    return (
                      <div key={status.value} className="flex items-center justify-between">
                        <span className="text-sm">{status.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Value Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Purchase Value:</span>
                    <span className="font-medium">
                      {formatCurrency(equipment.reduce((sum, item) => sum + item.purchasePrice, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Value:</span>
                    <span className="font-medium">{formatCurrency(getTotalValue())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Depreciation:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(equipment.reduce((sum, item) => sum + (item.purchasePrice - item.currentValue), 0))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {showAddForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Add New Equipment</CardTitle>
            <CardDescription>Register new equipment in the inventory system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment-name">Equipment Name *</Label>
                <Input
                  id="equipment-name"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  placeholder="Enter equipment name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment-type">Type *</Label>
                <Select value={newEquipment.type} onValueChange={(value) => setNewEquipment({...newEquipment, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.slice(1).map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={newEquipment.manufacturer}
                  onChange={(e) => setNewEquipment({...newEquipment, manufacturer: e.target.value})}
                  placeholder="Manufacturer name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment({...newEquipment, model: e.target.value})}
                  placeholder="Model number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newEquipment.year}
                  onChange={(e) => setNewEquipment({...newEquipment, year: e.target.value})}
                  placeholder="Year"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchase-price">Purchase Price</Label>
                <Input
                  id="purchase-price"
                  type="number"
                  value={newEquipment.purchasePrice}
                  onChange={(e) => setNewEquipment({...newEquipment, purchasePrice: e.target.value})}
                  placeholder="Purchase price"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipment-notes">Notes</Label>
              <Textarea
                id="equipment-notes"
                value={newEquipment.notes}
                onChange={(e) => setNewEquipment({...newEquipment, notes: e.target.value})}
                placeholder="Additional notes..."
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEquipment}>
                Add Equipment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}