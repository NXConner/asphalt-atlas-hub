// Virginia Business Configuration - Stuart, VA
// Based on Key knowledge file specifications

export const BUSINESS_INFO = {
  name: "Asphalt Management Services",
  address: "337 Ayers Orchard Road, Stuart, VA 24171",
  phone: "1-800-ASPHALT",
  email: "info@asphaltmanagement.com",
  employees: {
    fullTime: 2,
    partTime: 1,
    baseHourlyRate: 12.00,
    blendedRateWithOverhead: 45.00 // Including taxes, benefits, overhead
  }
}

export const MATERIAL_SUPPLIER = {
  name: "SealMaster",
  address: "703 West Decatur Street, Madison, NC 27025",
  phone: "",
  primarySupplier: true
}

// Current material costs as of 2025
export const MATERIAL_COSTS = {
  sealMasterPMM: {
    name: "SealMaster PMM Asphalt Sealer Concentrate",
    price: 3.79,
    unit: "gallon",
    coverage: "Base for mix calculations"
  },
  sand50lb: {
    name: "Sand",
    price: 10.00,
    unit: "50lb bag",
    coverage: "300 lbs per 100 gallons concentrate"
  },
  prepSeal: {
    name: "Prep Seal Oil Spot Primer",
    price: 50.00,
    unit: "5-gallon bucket",
    coverage: "750-1000 sq ft per bucket"
  },
  fastDry: {
    name: "Fast Dry Additive (FASS-DRI PSA)",
    price: 50.00,
    unit: "5-gallon bucket",
    coverage: "2 gallons per 125 gallons concentrate"
  },
  crackMaster: {
    name: "CrackMaster Crackfiller Parking Lot LP",
    price: 44.95,
    unit: "30lb box",
    coverage: "Variable based on crack size"
  }
}

// Mix ratios and usage guidelines
export const MIX_SPECIFICATIONS = {
  sandRatio: {
    min: 200, // lbs per 100 gallons
    max: 400,
    average: 300 // Use for calculations
  },
  waterRatio: {
    min: 10, // percent by volume
    max: 30,
    average: 20 // Use for calculations
  },
  fastDryRatio: {
    gallons: 2, // per 125 gallons of concentrate
    baseGallons: 125
  },
  prepSealCoverage: {
    min: 750, // sq ft per 5-gallon bucket
    max: 1000,
    average: 875
  }
}

// Industry standard application rates
export const APPLICATION_RATES = {
  crackFilling: {
    min: 0.50, // per linear foot
    max: 3.00,
    laborRate: 100 // linear feet per hour
  },
  asphaltPatching: {
    hotMix: {
      min: 2.00, // per sq ft (2" thick)
      max: 5.00
    },
    coldPatch: {
      min: 2.00, // per sq ft (temporary)
      max: 4.00
    }
  },
  sealcoating: {
    coverage: {
      min: 70, // sq ft per gallon mixed
      max: 82,
      average: 76
    }
  },
  lineStriping: {
    standardStall: 20, // linear feet
    doubleStall: 25,
    costPerLinearFoot: {
      min: 0.75,
      max: 1.00
    },
    costPerStall: {
      min: 4.00,
      max: 5.00
    },
    mobilizationFee: {
      min: 150,
      max: 350
    }
  }
}

// Equipment specifications
export const EQUIPMENT = {
  sealMaster: {
    model: "SK 550 Tank Sealing Machine (Skid Unit)",
    emptyWeight: 1865, // lbs
    capacity: 550, // gallons
    sealerWeightPerGallon: 10, // lbs
    fullWeight: 1865 + (550 * 10) // 7,365 lbs total when full
  },
  truck: {
    model: "1978 Chevy C30 Custom Deluxe",
    engine: "350 engine with 3-speed manual (granny low)",
    curbWeight: 4300, // lbs
    gvwr: {
      min: 10000, // lbs
      max: 14000  // lbs depending on configuration
    }
  }
}

// Fuel and operational costs
export const OPERATIONAL_COSTS = {
  fuel: {
    equipmentIdleRate: 50.00, // per hour including fuel, service, depreciation
    equipmentActiveRate: 2.0, // gallons per hour for larger equipment
    truckMPG: {
      min: 15,
      max: 20,
      average: 17.5
    }
  },
  overhead: {
    defaultPercent: 20, // 15-25% suggested range
    min: 15,
    max: 25
  },
  profit: {
    defaultPercent: 20, // 15-25% suggested range
    min: 15,
    max: 25
  }
}

// Calculation helpers
export const CALCULATIONS = {
  // Convert square feet to square yards
  sqFtToSqYards: (sqFt: number) => sqFt / 9,
  
  // Calculate sand bags needed
  sandBagsNeeded: (concentrateGallons: number) => {
    const sandPounds = (concentrateGallons / 100) * MIX_SPECIFICATIONS.sandRatio.average
    return Math.ceil(sandPounds / 50) // 50lb bags
  },
  
  // Calculate water needed
  waterNeeded: (concentrateGallons: number) => {
    return concentrateGallons * (MIX_SPECIFICATIONS.waterRatio.average / 100)
  },
  
  // Calculate total mix volume
  totalMixVolume: (concentrateGallons: number, waterGallons: number, additiveGallons: number = 0) => {
    return concentrateGallons + waterGallons + additiveGallons
  },
  
  // Calculate truck load weight
  truckLoadWeight: (sealerGallons: number) => {
    const sealerWeight = sealerGallons * EQUIPMENT.sealMaster.sealerWeightPerGallon
    const equipmentWeight = EQUIPMENT.sealMaster.emptyWeight
    const truckWeight = EQUIPMENT.truck.curbWeight
    return {
      sealerWeight,
      equipmentWeight,
      truckWeight,
      totalWeight: truckWeight + equipmentWeight + sealerWeight,
      withinGVWR: (truckWeight + equipmentWeight + sealerWeight) <= EQUIPMENT.truck.gvwr.min
    }
  },
  
  // Calculate travel costs
  travelCost: (distanceMiles: number, fuelPricePerGallon: number = 3.50) => {
    const roundTripMiles = distanceMiles * 2
    const gallonsUsed = roundTripMiles / OPERATIONAL_COSTS.fuel.truckMPG.average
    return gallonsUsed * fuelPricePerGallon
  }
}

// Professional estimate workflow
export const ESTIMATE_WORKFLOW = {
  steps: [
    "Gather project details and specifications",
    "Calculate material costs and quantities", 
    "Estimate labor hours and costs",
    "Calculate fuel and equipment costs",
    "Determine transport load requirements",
    "Apply overhead and profit margins",
    "Present itemized estimate breakdown",
    "Allow for parameter adjustments"
  ],
  
  requiredInputs: [
    "Service type (crack filling, patching, sealcoating, striping)",
    "Square footage of areas",
    "Linear footage of cracks",
    "Number and type of parking stalls",
    "Asphalt condition assessment",
    "Job site location for travel calculation",
    "Desired start date and timeframe"
  ]
}

export default {
  BUSINESS_INFO,
  MATERIAL_SUPPLIER,
  MATERIAL_COSTS,
  MIX_SPECIFICATIONS,
  APPLICATION_RATES,
  EQUIPMENT,
  OPERATIONAL_COSTS,
  CALCULATIONS,
  ESTIMATE_WORKFLOW
}