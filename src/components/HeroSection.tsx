import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calculator, FileText, MapPin, Truck } from "lucide-react"
import heroImage from "@/assets/hero-asphalt.jpg"

interface HeroSectionProps {
  onSectionChange: (section: string) => void
}

export const HeroSection = ({ onSectionChange }: HeroSectionProps) => {
  const quickActions = [
    {
      title: "Sealcoat Calculator",
      description: "Calculate materials and costs for sealcoating projects",
      icon: Calculator,
      section: "sealcoat-calc",
      color: "primary"
    },
    {
      title: "Striping Calculator", 
      description: "Estimate paint and labor for parking lot striping",
      icon: Calculator,
      section: "striping-calc",
      color: "warning"
    },
    {
      title: "Regulations Guide",
      description: "Federal, state, and local regulations for asphalt work",
      icon: FileText,
      section: "regulations",
      color: "success"
    },
    {
      title: "Project Management",
      description: "Schedule jobs, track equipment, and monitor progress",
      icon: Truck,
      section: "dashboard",
      color: "secondary"
    }
  ]

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="bg-gradient-hero relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-hero/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              Complete Asphalt
              <span className="block text-accent">Management Platform</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto animate-fade-in">
              Everything you need for professional sealcoating, striping, and asphalt maintenance. 
              From calculations to regulations, manage every aspect of your asphalt business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button 
                size="xl" 
                variant="hero"
                onClick={() => onSectionChange("sealcoat-calc")}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Start Calculating
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => onSectionChange("regulations")}
              >
                <FileText className="mr-2 h-5 w-5" />
                View Regulations
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={action.section}
              className="p-6 bg-gradient-card border-0 shadow-elevation hover:shadow-glow transition-all duration-300 hover:-translate-y-2 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSectionChange(action.section)}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-${action.color} text-${action.color}-foreground group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {action.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {action.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Industry-Leading Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built by professionals, for professionals. Our platform covers every aspect of asphalt work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Precise Calculations</h3>
            <p className="text-muted-foreground">
              Industry-standard formulas for material estimation, cost analysis, and project planning.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compliance Ready</h3>
            <p className="text-muted-foreground">
              Up-to-date federal, state, and local regulations with automatic compliance checking.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Project Management</h3>
            <p className="text-muted-foreground">
              Complete project lifecycle management from estimation to completion tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}