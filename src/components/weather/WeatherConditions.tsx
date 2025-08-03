import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Droplets, 
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  visibility: number
  precipitation: number
  condition: string
  forecast: Array<{
    day: string
    temp: number
    condition: string
    precipitation: number
  }>
}

interface WorkRecommendation {
  activity: string
  status: "ideal" | "caution" | "not-recommended"
  reason: string
  requirements?: string[]
}

export const WeatherConditions = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 68,
    humidity: 45,
    windSpeed: 5,
    visibility: 10,
    precipitation: 0,
    condition: "partly-cloudy",
    forecast: [
      { day: "Today", temp: 68, condition: "partly-cloudy", precipitation: 0 },
      { day: "Tomorrow", temp: 72, condition: "sunny", precipitation: 0 },
      { day: "Wednesday", temp: 75, condition: "sunny", precipitation: 0 },
      { day: "Thursday", temp: 65, condition: "cloudy", precipitation: 20 },
      { day: "Friday", temp: 58, condition: "rainy", precipitation: 80 }
    ]
  })

  const [selectedLocation, setSelectedLocation] = useState("Current Location")

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "partly-cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-600" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  const getWorkRecommendations = (): WorkRecommendation[] => {
    const recommendations: WorkRecommendation[] = []

    // Sealcoating recommendations
    if (weatherData.temperature >= 50 && weatherData.temperature <= 90 && weatherData.precipitation === 0 && weatherData.humidity < 85) {
      recommendations.push({
        activity: "Sealcoating",
        status: "ideal",
        reason: "Perfect temperature and dry conditions",
        requirements: ["Temperature: 50-90°F", "No precipitation", "Humidity < 85%"]
      })
    } else if (weatherData.temperature < 50 || weatherData.temperature > 90) {
      recommendations.push({
        activity: "Sealcoating",
        status: "not-recommended",
        reason: "Temperature outside optimal range (50-90°F)"
      })
    } else if (weatherData.precipitation > 0) {
      recommendations.push({
        activity: "Sealcoating",
        status: "not-recommended",
        reason: "Precipitation present - surface must be dry"
      })
    } else {
      recommendations.push({
        activity: "Sealcoating",
        status: "caution",
        reason: "Conditions are marginal - monitor closely"
      })
    }

    // Striping recommendations
    if (weatherData.temperature >= 45 && weatherData.precipitation === 0 && weatherData.windSpeed < 15) {
      recommendations.push({
        activity: "Line Striping",
        status: "ideal",
        reason: "Good temperature and low wind conditions",
        requirements: ["Temperature: >45°F", "No precipitation", "Wind speed < 15 mph"]
      })
    } else if (weatherData.windSpeed >= 15) {
      recommendations.push({
        activity: "Line Striping",
        status: "caution",
        reason: "High winds may affect paint application accuracy"
      })
    } else {
      recommendations.push({
        activity: "Line Striping",
        status: "not-recommended",
        reason: "Poor weather conditions for precise work"
      })
    }

    // Asphalt paving recommendations
    if (weatherData.temperature >= 50 && weatherData.precipitation === 0) {
      recommendations.push({
        activity: "Asphalt Paving",
        status: "ideal",
        reason: "Optimal conditions for hot mix asphalt",
        requirements: ["Temperature: >50°F", "Dry surface", "No precipitation forecast"]
      })
    } else {
      recommendations.push({
        activity: "Asphalt Paving",
        status: "not-recommended",
        reason: "Temperature too low or wet conditions present"
      })
    }

    // Crack sealing recommendations
    if (weatherData.temperature >= 40 && weatherData.precipitation === 0) {
      recommendations.push({
        activity: "Crack Sealing",
        status: "ideal",
        reason: "Good conditions for hot pour crack sealant"
      })
    } else {
      recommendations.push({
        activity: "Crack Sealing",
        status: "caution",
        reason: "Monitor temperature and moisture conditions"
      })
    }

    return recommendations
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ideal":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "caution":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "not-recommended":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ideal":
        return "bg-green-100 text-green-800 border-green-200"
      case "caution":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "not-recommended":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Weather Conditions</h1>
        <p className="text-lg text-gray-600">
          Monitor weather conditions and get work recommendations for optimal project execution
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Conditions</TabsTrigger>
          <TabsTrigger value="forecast">5-Day Forecast</TabsTrigger>
          <TabsTrigger value="recommendations">Work Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getWeatherIcon(weatherData.condition)}
                Current Weather - {selectedLocation}
              </CardTitle>
              <CardDescription>Real-time weather conditions for your project site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-xl font-semibold">{weatherData.temperature}°F</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Humidity</p>
                    <p className="text-xl font-semibold">{weatherData.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Wind className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Wind Speed</p>
                    <p className="text-xl font-semibold">{weatherData.windSpeed} mph</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Visibility</p>
                    <p className="text-xl font-semibold">{weatherData.visibility} miles</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CloudRain className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Precipitation</p>
                    <p className="text-xl font-semibold">{weatherData.precipitation}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <p className="font-semibold text-sm text-gray-600 mb-2">{day.day}</p>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <p className="text-lg font-bold">{day.temp}°F</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {day.precipitation}% rain
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Weather-Based Work Recommendations</AlertTitle>
            <AlertDescription>
              These recommendations are based on current weather conditions and industry best practices. 
              Always consult local regulations and manufacturer specifications.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {getWorkRecommendations().map((rec, index) => (
              <Card key={index} className={`border-2 ${getStatusColor(rec.status)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{rec.activity}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(rec.status)}
                      <Badge variant="outline" className={getStatusColor(rec.status)}>
                        {rec.status.charAt(0).toUpperCase() + rec.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{rec.reason}</p>
                  {rec.requirements && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Requirements:</p>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {rec.requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Location Settings</CardTitle>
          <CardDescription>Configure your project location for accurate weather data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Button 
              variant="outline" 
              onClick={() => setSelectedLocation("Current Location")}
              className={selectedLocation === "Current Location" ? "bg-primary text-primary-foreground" : ""}
            >
              Use Current Location
            </Button>
            <Button 
              variant="outline"
              onClick={() => setSelectedLocation("Custom Location")}
              className={selectedLocation === "Custom Location" ? "bg-primary text-primary-foreground" : ""}
            >
              Set Custom Location
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}