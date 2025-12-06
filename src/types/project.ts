export type ProjectPhase =
  | "ONBOARDING"
  | "CONCEPT"
  | "FINANCIALS"
  | "LOCATION"
  | "LEGAL"
  | "DESIGN"
  | "MENU"
  | "SUPPLIERS"
  | "TECH"
  | "TEAM"
  | "MARKETING"
  | "OPENING"
  | "POST_OPENING";

export interface RestaurantProject {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  currentPhase: ProjectPhase;

  // Datos segregados por fases
  data: {
    onboarding: OnboardingData;
    concept: ConceptData;
    financials: FinancialData;
    location: LocationData;
    legal: LegalData;
    design: DesignData;
    menu: MenuData;
    suppliers: SuppliersData;
    tech: TechData;
    team: TeamData;
    marketing: MarketingData;
    opening: OpeningData;
    postOpening: PostOpeningData;
    chatHistory: ChatMessage[];
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// 0. Onboarding
export interface OnboardingData {
  businessType:
    | "TRADITIONAL"
    | "SPECIALTY"
    | "CAFE"
    | "TAPAS"
    | "FAST_CASUAL"
    | "FOOD_TRUCK"
    | "DARK_KITCHEN"
    | null;
  locationCity: string;
  budgetRange:
    | "<30K"
    | "30K-60K"
    | "60K-100K"
    | "100K-200K"
    | ">200K"
    | "UNKNOWN"
    | null;
  currentStatus:
    | "IDEA"
    | "PLAN"
    | "HAS_LOCATION"
    | "LICENSES"
    | "CONSTRUCTION"
    | null;
  completed: boolean;
}

// 1. Concepto
export interface ConceptData {
  description: string;
  // New fields for detailed concept
  location: {
    country: string;
    city: string;
    areaAverageTicket: number; // AI estimated
    hasLocation: boolean;
    sizeSqM?: number;
  };
  style: {
    cuisine: string;
    atmosphere: string;
  };
  team: {
    hasTeam: boolean;
    kitchenStaff: number;
    serviceStaff: number;
    averageStaffCost: number;
    notes: string;
  };
  // Existing
  aiSuggestions: string[];
  competitors: CompetitorAnalysis[];
  viability: {
    averageTicket: number;
    capacity: number;
    dailyRotations: { lunch: number; dinner: number };
    monthlyOpenDays: number;
    fixedCosts: {
      rent: number;
      staff: number;
      utilities: number;
      licenses: number;
      other: number;
    };
    // Calculated fields
    breakEvenPoint: number; // Cubiertos/día
    minMonthlyRevenue: number;
    viabilityStatus: "VIABLE" | "TIGHT" | "NOT_VIABLE" | "UNKNOWN";
  };
}

export interface CompetitorAnalysis {
  name: string;
  type: string;
  priceRange: string;
  rating: number;
}

// 2. Financiero (CAPEX)
export interface FinancialData {
  investment: {
    location: number; // Fianza, obra
    kitchenEquipment: number;
    furniture: number;
    tech: number;
    initialStock: number;
    legal: number;
    marketing: number;
    operatingCushion: number;
    total: number;
  };
  funding: {
    ownFunds: number;
    loans: number;
    investors: number;
    other: number;
    total: number;
  };
  businessPlanGenerated: boolean;
}

// 3. Local
export interface LocationData {
  status: "SEARCHING" | "SELECTED";
  candidates: CandidateLocation[];
  selectedCandidateId?: string;
  searchChecklist: ChecklistItem[];
}

export interface CandidateLocation {
  id: string;
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  capacity: number;
  monthlyRent: number;
  isOwned: boolean;
  notes: string;
  rating?: number; // 1-5 stars
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: "MUST" | "IMPORTANT" | "NICE_TO_HAVE" | "GENERAL";
  checked: boolean;
}

// 4. Legal
export interface LegalData {
  legalForm: "AUTONOMO" | "SL" | "CB" | null;
  licenses: LicenseTask[];
}

export interface LicenseTask {
  id: string;
  name: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "APPROVED";
  category: "CITY" | "HEALTH" | "ADMIN" | "OTHER";
  estimatedCost: number;
  estimatedTime: string;
  procedure?: string;
  requirements?: string[];
}

// 5. Diseño y Equipamiento
export interface DesignData {
  layout: {
    diningAreaSqM: number;
    kitchenAreaSqM: number;
    toiletsAreaSqM: number;
    capacityEstimate: number;
  };
  floorPlan: Floor[];
  equipmentChecklist: EquipmentItem[];
  constructionTimeline: ConstructionTask[];
}

export interface Floor {
  id: string;
  name: string;
  width: number;
  height: number;
  tables: Table[];
  obstacles: Obstacle[];
}

export interface Table {
  id: string;
  name: string;
  type: 'SQUARE' | 'ROUND' | 'RECTANGLE';
  capacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface Obstacle {
  id: string;
  type: 'WALL' | 'COLUMN' | 'DOOR' | 'BAR';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: "HOT" | "COLD" | "WASHING" | "STORAGE" | "SALA";
  estimatedCost: number;
  purchased: boolean;
}

export interface ConstructionTask {
  id: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

// 6. Carta (Menú)
export interface MenuData {
  structure: {
    starters: MenuItem[];
    mains: MenuItem[];
    desserts: MenuItem[];
    drinks: MenuItem[];
  };
  foodCostTarget: number; // %
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: "STARTER" | "MAIN" | "DESSERT" | "DRINK";
  ingredients: Ingredient[];
  costPrice: number; // Calculado
  sellingPrice: number;
  margin: number;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
}

// 7. Proveedores
export interface SuppliersData {
  list: Supplier[];
  initialStockBudget: {
    fresh: number;
    drinks: number;
    consumables: number;
  };
}

export interface Supplier {
  id: string;
  name: string;
  category: 'INGREDIENTS' | 'FURNITURE' | 'CONSTRUCTION' | 'OTHER';
  contactInfo: string;
  email?: string;
  phone?: string;
  status: 'POTENTIAL' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
  rating?: number; // 1-5
  deliveryDays: string[];
  assignedResources: string[]; // IDs of ingredients, equipment, or tasks
}

// 8. Tecnología
export interface TechData {
  pos: {
    selected: string | null;
    status: 'PENDING' | 'CONTACTED' | 'DEMO' | 'INSTALLED';
  };
  reservation: {
    selected: 'COVER_MANAGER' | null;
    status: 'PENDING' | 'CONTACTED' | 'ACTIVE';
  };
}

// 9. Equipo (RRHH)
export interface TeamData {
  staffNeeds: {
    kitchen: number;
    service: number;
    management: number;
  };
  estimatedMonthlyCost: number;
  employees: Employee[];
  shifts: Shift[];
}

export type EmployeeRole = 'HEAD_CHEF' | 'CHEF' | 'KITCHEN_PORTER' | 'MANAGER' | 'HEAD_WAITER' | 'WAITER' | 'HOST' | 'BARTENDER';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  salary: number; // Gross monthly
  status: 'CANDIDATE' | 'INTERVIEWING' | 'HIRED' | 'REJECTED';
  contractType: 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY';
  startDate?: Date;
}


export interface Shift {
  id: string;
  employeeId: string;
  day: string;
  startTime: string;
  endTime: string;
}

// 10. Marketing
export interface MarketingData {
  brandIdentity: {
    name: string;
    description: string;
    elevatorPitch: string;
    colors: string[];
    logoUrl?: string;
    toneOfVoice?: string;
  };
  digitalPresence: ChecklistItem[]; // Web, GMB, Social
  launchStrategy: ChecklistItem[];
  socialMediaPlan: {
    platform: string;
    strategy: string;
    frequency: string;
  }[];
}

// 11. Apertura
export interface OpeningData {
  finalChecklist: ChecklistItem[];
  openingDate: Date | null;
}

// 12. Post-Apertura
export interface PostOpeningData {
  weeklyMetrics: WeeklyMetric[];
}

export interface WeeklyMetric {
  weekStartDate: Date;
  covers: number;
  averageTicket: number;
  foodCostPercentage: number;
  revenue: number;
}
