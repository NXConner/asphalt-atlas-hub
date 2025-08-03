import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Calculator, FileText, BookOpen, Settings, MapPin, DollarSign, Truck, Calendar, BarChart3, Shield, CheckCircle, Eye } from "lucide-react"

interface NavigationProps {
  currentSection: string
  onSectionChange: (section: string) => void
}

export const Navigation = ({ currentSection, onSectionChange }: NavigationProps) => {
  const menuItems = [
    {
      title: "Calculators",
      items: [
        { name: "Sealcoat Calculator", section: "sealcoat-calc", icon: Calculator },
        { name: "Striping Calculator", section: "striping-calc", icon: Calculator },
        { name: "Material Estimator", section: "material-calc", icon: Calculator },
        { name: "Cost Estimator", section: "cost-calc", icon: DollarSign },
      ]
    },
    {
      title: "Guardian Suite",
      items: [
        { name: "Live Monitoring", section: "guardian", icon: Shield },
        { name: "Quality Control", section: "quality", icon: CheckCircle },
        { name: "Compliance Dashboard", section: "compliance", icon: FileText },
        { name: "Site Inspections", section: "inspections", icon: Eye },
      ]
    },
    {
      title: "Project Management", 
      items: [
        { name: "Project Dashboard", section: "dashboard", icon: BarChart3 },
        { name: "Job Scheduler", section: "scheduler", icon: Calendar },
        { name: "Equipment Tracker", section: "equipment", icon: Truck },
        { name: "Site Mapping", section: "mapping", icon: MapPin },
      ]
    },
    {
      title: "Resources",
      items: [
        { name: "Regulations & Standards", section: "regulations", icon: BookOpen },
        { name: "Material Database", section: "materials", icon: FileText },
        { name: "Best Practices", section: "practices", icon: BookOpen },
        { name: "Weather Conditions", section: "weather", icon: Settings },
      ]
    }
  ]

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">AsphaltPro</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((category) => (
                  <NavigationMenuItem key={category.title}>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-accent">
                      {category.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-6">
                        {category.items.map((item) => (
                          <NavigationMenuLink key={item.section} asChild>
                            <Button
                              variant={currentSection === item.section ? "default" : "ghost"}
                              className="w-full justify-start h-auto p-3"
                              onClick={() => onSectionChange(item.section)}
                            >
                              <item.icon className="mr-2 h-4 w-4" />
                              <span>{item.name}</span>
                            </Button>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-8 space-y-6">
                  {menuItems.map((category) => (
                    <div key={category.title}>
                      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                        {category.title}
                      </h3>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <Button
                            key={item.section}
                            variant={currentSection === item.section ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => onSectionChange(item.section)}
                          >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}