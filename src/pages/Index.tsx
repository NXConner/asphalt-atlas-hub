import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { HeroSection } from "@/components/HeroSection"
import { SealcoatCalculator } from "@/components/calculators/SealcoatCalculator"
import { StripingCalculator } from "@/components/calculators/StripingCalculator"
import { RegulationsGuide } from "@/components/regulations/RegulationsGuide"
import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard"

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home")

  const renderSection = () => {
    switch (currentSection) {
      case "sealcoat-calc":
        return <SealcoatCalculator />
      case "striping-calc":
        return <StripingCalculator />
      case "regulations":
        return <RegulationsGuide />
      case "dashboard":
        return <ProjectDashboard />
      case "material-calc":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Material Estimator - Coming Soon</h1></div>
      case "cost-calc":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Cost Estimator - Coming Soon</h1></div>
      case "scheduler":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Job Scheduler - Coming Soon</h1></div>
      case "equipment":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Equipment Tracker - Coming Soon</h1></div>
      case "mapping":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Site Mapping - Coming Soon</h1></div>
      case "materials":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Material Database - Coming Soon</h1></div>
      case "practices":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Best Practices - Coming Soon</h1></div>
      case "weather":
        return <div className="max-w-4xl mx-auto p-6"><h1 className="text-3xl font-bold">Weather Conditions - Coming Soon</h1></div>
      default:
        return <HeroSection onSectionChange={setCurrentSection} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentSection={currentSection} onSectionChange={setCurrentSection} />
      {renderSection()}
    </div>
  );
};

export default Index;
