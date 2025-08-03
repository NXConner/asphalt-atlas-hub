import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { HeroSection } from "@/components/HeroSection"
import { SealcoatCalculator } from "@/components/calculators/SealcoatCalculator"
import { StripingCalculator } from "@/components/calculators/StripingCalculator"
import { MaterialEstimator } from "@/components/calculators/MaterialEstimator"
import { RegulationsGuide } from "@/components/regulations/RegulationsGuide"
import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard"
import { AsphaltGuardian } from "@/components/guardian/AsphaltGuardian"
import { WeatherConditions } from "@/components/weather/WeatherConditions"
import { BestPractices } from "@/components/practices/BestPractices"
import { MaterialDatabase } from "@/components/materials/MaterialDatabase"
import { CostCalculator } from "@/components/calculators/CostCalculator"
import { JobScheduler } from "@/components/scheduler/JobScheduler"
import { EquipmentTracker } from "@/components/equipment/EquipmentTracker"
import { SiteMapping } from "@/components/mapping/SiteMapping"

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home")

  const renderSection = () => {
    switch (currentSection) {
      case "sealcoat-calc":
        return <SealcoatCalculator />
      case "striping-calc":
        return <StripingCalculator />
      case "material-calc":
        return <MaterialEstimator />
      case "regulations":
        return <RegulationsGuide />
      case "dashboard":
        return <ProjectDashboard />
      case "guardian":
        return <AsphaltGuardian />
      case "quality":
        return <AsphaltGuardian />
      case "compliance":
        return <AsphaltGuardian />
      case "inspections":
        return <AsphaltGuardian />
      case "cost-calc":
        return <CostCalculator />
      case "scheduler":
        return <JobScheduler />
      case "equipment":
        return <EquipmentTracker />
      case "mapping":
        return <SiteMapping />
      case "materials":
        return <MaterialDatabase />
      case "practices":
        return <BestPractices />
      case "weather":
        return <WeatherConditions />
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
