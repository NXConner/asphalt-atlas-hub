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
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Filter,
  Download
} from "lucide-react"

interface Job {
  id: string
  title: string
  client: string
  location: string
  type: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  startDate: string
  endDate: string
  estimatedHours: number
  crew: string[]
  equipment: string[]
  notes: string
  weather: {
    temperature: number
    conditions: string
    suitable: boolean
  }
}

export const JobScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)

  const [newJob, setNewJob] = useState({
    title: "",
    client: "",
    location: "",
    type: "",
    startDate: "",
    endDate: "",
    estimatedHours: "",
    crew: "",
    equipment: "",
    notes: "",
    priority: "medium"
  })

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "job-1",
      title: "Walmart Parking Lot Sealcoating",
      client: "Walmart Inc.",
      location: "123 Main St, Anytown, ST",
      type: "sealcoat",
      status: "scheduled",
      priority: "high",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      estimatedHours: 24,
      crew: ["John Smith", "Mike Johnson", "Sarah Davis"],
      equipment: ["Sealcoat Tank", "Squeegee Machine", "Compressor"],
      notes: "Large commercial job. Requires 3-day completion window.",
      weather: {
        temperature: 68,
        conditions: "Sunny",
        suitable: true
      }
    },
    {
      id: "job-2",
      title: "Residential Driveway Striping",
      client: "Oak Hills HOA",
      location: "Oak Hills Subdivision",
      type: "striping",
      status: "in-progress",
      priority: "medium",
      startDate: "2024-01-18",
      endDate: "2024-01-19",
      estimatedHours: 16,
      crew: ["Tom Wilson", "Lisa Brown"],
      equipment: ["Striping Machine", "Paint Sprayer"],
      notes: "75 driveways need fresh striping.",
      weather: {
        temperature: 72,
        conditions: "Partly Cloudy",
        suitable: true
      }
    },
    {
      id: "job-3",
      title: "Highway Crack Sealing",
      client: "State DOT",
      location: "Highway 45, Mile Marker 12-18",
      type: "crack-seal",
      status: "scheduled",
      priority: "high",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      estimatedHours: 20,
      crew: ["John Smith", "Mike Johnson", "Tom Wilson", "Dave Chen"],
      equipment: ["Crack Sealing Machine", "Air Compressor", "Hot Box"],
      notes: "Night work required. Traffic control needed.",
      weather: {
        temperature: 45,
        conditions: "Clear",
        suitable: true
      }
    }
  ])

  const jobTypes = [
    { value: "sealcoat", label: "Sealcoating" },
    { value: "striping", label: "Line Striping" },
    { value: "crack-seal", label: "Crack Sealing" },
    { value: "paving", label: "Asphalt Paving" },
    { value: "maintenance", label: "General Maintenance" }
  ]

  const statusOptions = [
    { value: "all", label: "All Jobs" },
    { value: "scheduled", label: "Scheduled" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ]

  const crewMembers = [
    "John Smith", "Mike Johnson", "Sarah Davis", "Tom Wilson", 
    "Lisa Brown", "Dave Chen", "Anna Martinez", "Chris Taylor"
  ]

  const equipment = [
    "Sealcoat Tank", "Squeegee Machine", "Compressor", "Striping Machine",
    "Paint Sprayer", "Crack Sealing Machine", "Hot Box", "Paver",
    "Roller", "Truck", "Traffic Control Equipment"
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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

  const filteredJobs = jobs.filter(job => 
    filterStatus === "all" || job.status === filterStatus
  )

  const getJobsForDate = (date: string) => {
    return jobs.filter(job => 
      date >= job.startDate && date <= job.endDate
    )
  }

  const handleAddJob = () => {
    if (!newJob.title || !newJob.client || !newJob.startDate) return

    const job: Job = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      client: newJob.client,
      location: newJob.location,
      type: newJob.type,
      status: "scheduled",
      priority: newJob.priority as "low" | "medium" | "high",
      startDate: newJob.startDate,
      endDate: newJob.endDate || newJob.startDate,
      estimatedHours: parseInt(newJob.estimatedHours) || 8,
      crew: newJob.crew.split(',').map(c => c.trim()).filter(c => c),
      equipment: newJob.equipment.split(',').map(e => e.trim()).filter(e => e),
      notes: newJob.notes,
      weather: {
        temperature: 65,
        conditions: "Clear",
        suitable: true
      }
    }

    setJobs([...jobs, job])
    setNewJob({
      title: "",
      client: "",
      location: "",
      type: "",
      startDate: "",
      endDate: "",
      estimatedHours: "",
      crew: "",
      equipment: "",
      notes: "",
      priority: "medium"
    })
    setShowAddForm(false)
  }

  const handleDeleteJob = (jobId: string) => {
    setJobs(jobs.filter(job => job.id !== jobId))
  }

  const handleStatusChange = (jobId: string, newStatus: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: newStatus as Job['status'] } : job
    ))
  }

  const generateCalendarDays = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateString = date.toISOString().split('T')[0]
      const dayJobs = getJobsForDate(dateString)
      
      days.push({
        date: day,
        dateString,
        jobs: dayJobs,
        isToday: dateString === today.toISOString().split('T')[0]
      })
    }

    return days
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Job Scheduler</h1>
        <p className="text-lg text-gray-600">
          Manage project schedules, crews, and equipment with integrated calendar planning
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            onClick={() => setViewMode("calendar")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            onClick={() => setViewMode("list")}
          >
            <Filter className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")}>
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Calendar - {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-50">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border rounded ${
                      day?.isToday ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'
                    }`}
                  >
                    {day && (
                      <>
                        <div className={`text-sm font-medium mb-1 ${day.isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                          {day.date}
                        </div>
                        <div className="space-y-1">
                          {day.jobs.slice(0, 2).map(job => (
                            <div
                              key={job.id}
                              className={`text-xs p-1 rounded text-center ${getStatusColor(job.status)}`}
                            >
                              {job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title}
                            </div>
                          ))}
                          {day.jobs.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{day.jobs.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="grid gap-4">
            {filteredJobs.map(job => (
              <Card key={job.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {job.client} • {job.location}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(job.priority)}>
                        {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)} Priority
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Schedule</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{job.startDate} to {job.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{job.estimatedHours} estimated hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{job.crew.length} crew members</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {job.crew.slice(0, 2).join(', ')}
                          {job.crew.length > 2 && ` +${job.crew.length - 2} more`}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Weather</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          {job.weather.suitable ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span>{job.weather.temperature}°F, {job.weather.conditions}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {job.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Notes</h4>
                      <p className="text-sm text-gray-600">{job.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Select value={job.status} onValueChange={(value) => handleStatusChange(job.id, value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteJob(job.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showAddForm && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Add New Job</CardTitle>
            <CardDescription>Create a new scheduled job with all necessary details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  placeholder="Enter job title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Input
                  id="client"
                  value={newJob.client}
                  onChange={(e) => setNewJob({...newJob, client: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  placeholder="Job location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job-type">Job Type</Label>
                <Select value={newJob.type} onValueChange={(value) => setNewJob({...newJob, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={newJob.startDate}
                  onChange={(e) => setNewJob({...newJob, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={newJob.endDate}
                  onChange={(e) => setNewJob({...newJob, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newJob.notes}
                onChange={(e) => setNewJob({...newJob, notes: e.target.value})}
                placeholder="Additional job notes..."
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddJob}>
                Add Job
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}