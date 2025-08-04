import { useState, lazy, Suspense } from "react"
import { Navigation } from "@/components/Navigation"
import { HeroSection } from "@/components/HeroSection"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Lazy load components for better performance
const SealcoatCalculator = lazy(() => import("@/components/calculators/SealcoatCalculator").then(module => ({ default: module.SealcoatCalculator })))
const StripingCalculator = lazy(() => import("@/components/calculators/StripingCalculator").then(module => ({ default: module.StripingCalculator })))
const MaterialEstimator = lazy(() => import("@/components/calculators/MaterialEstimator").then(module => ({ default: module.MaterialEstimator })))
const RegulationsGuide = lazy(() => import("@/components/regulations/RegulationsGuide").then(module => ({ default: module.RegulationsGuide })))
const ProjectDashboard = lazy(() => import("@/components/dashboard/ProjectDashboard").then(module => ({ default: module.ProjectDashboard })))
const AsphaltGuardian = lazy(() => import("@/components/guardian/AsphaltGuardian").then(module => ({ default: module.AsphaltGuardian })))
const WeatherConditions = lazy(() => import("@/components/weather/WeatherConditions").then(module => ({ default: module.WeatherConditions })))
const BestPractices = lazy(() => import("@/components/practices/BestPractices").then(module => ({ default: module.BestPractices })))
const MaterialDatabase = lazy(() => import("@/components/materials/MaterialDatabase").then(module => ({ default: module.MaterialDatabase })))
const CostCalculator = lazy(() => import("@/components/calculators/CostCalculator").then(module => ({ default: module.CostCalculator })))
const JobScheduler = lazy(() => import("@/components/scheduler/JobScheduler").then(module => ({ default: module.JobScheduler })))
const EquipmentTracker = lazy(() => import("@/components/equipment/EquipmentTracker").then(module => ({ default: module.EquipmentTracker })))
const SiteMapping = lazy(() => import("@/components/mapping/SiteMapping").then(module => ({ default: module.SiteMapping })))

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home")

  const renderSection = () => {
    const ComponentWrapper = ({ children }: { children: React.ReactNode }) => (
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        {children}
      </Suspense>
    )

    switch (currentSection) {
      case "sealcoat-calc":
        return <ComponentWrapper><SealcoatCalculator /></ComponentWrapper>
      case "striping-calc":
        return <ComponentWrapper><StripingCalculator /></ComponentWrapper>
      case "material-calc":
        return <ComponentWrapper><MaterialEstimator /></ComponentWrapper>
      case "regulations":
        return <ComponentWrapper><RegulationsGuide /></ComponentWrapper>
      case "dashboard":
        return <ComponentWrapper><ProjectDashboard /></ComponentWrapper>
      case "guardian":
        return <ComponentWrapper><AsphaltGuardian /></ComponentWrapper>
      case "quality":
        return <ComponentWrapper><AsphaltGuardian /></ComponentWrapper>
      case "compliance":
        return <ComponentWrapper><AsphaltGuardian /></ComponentWrapper>
      case "inspections":
        return <ComponentWrapper><AsphaltGuardian /></ComponentWrapper>
      case "cost-calc":
        return <ComponentWrapper><CostCalculator /></ComponentWrapper>
      case "scheduler":
        return <ComponentWrapper><JobScheduler /></ComponentWrapper>
      case "equipment":
        return <ComponentWrapper><EquipmentTracker /></ComponentWrapper>
      case "mapping":
        return <ComponentWrapper><SiteMapping /></ComponentWrapper>
      case "materials":
        return <ComponentWrapper><MaterialDatabase /></ComponentWrapper>
      case "practices":
        return <ComponentWrapper><BestPractices /></ComponentWrapper>
      case "weather":
        return <ComponentWrapper><WeatherConditions /></ComponentWrapper>
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
