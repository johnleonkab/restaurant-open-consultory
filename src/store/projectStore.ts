import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RestaurantProject, ProjectPhase } from '@/types/project';

interface ProjectState {
  project: RestaurantProject;
  updateProject: (data: Partial<RestaurantProject>) => void;
  updatePhaseData: <K extends keyof RestaurantProject['data']>(
    phase: K,
    data: Partial<RestaurantProject['data'][K]>
  ) => void;
  setPhase: (phase: ProjectPhase) => void;
  resetProject: () => void;
  addChatMessage: (message: any) => void;
}

const initialProject: RestaurantProject = {
  id: 'default-project',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  currentPhase: 'ONBOARDING',
  data: {
    onboarding: {
      businessType: null,
      locationCity: '',
      budgetRange: null,
      currentStatus: null,
      completed: false,
    },
    concept: {
      description: '',
      location: {
        country: '',
        city: '',
        areaAverageTicket: 0,
        hasLocation: false,
        sizeSqM: 0,
      },
      style: {
        cuisine: '',
        atmosphere: '',
      },
      team: {
        hasTeam: false,
        kitchenStaff: 0,
        serviceStaff: 0,
        averageStaffCost: 0,
        notes: '',
      },
      aiSuggestions: [],
      competitors: [],
      viability: {
        averageTicket: 0,
        capacity: 0,
        dailyRotations: { lunch: 0, dinner: 0 },
        monthlyOpenDays: 26,
        fixedCosts: {
          rent: 0,
          staff: 0,
          utilities: 0,
          licenses: 0,
          other: 0,
        },
        breakEvenPoint: 0,
        minMonthlyRevenue: 0,
        viabilityStatus: 'UNKNOWN',
      },
    },
    financials: {
      investment: {
        location: 0,
        kitchenEquipment: 0,
        furniture: 0,
        tech: 0,
        initialStock: 0,
        legal: 0,
        marketing: 0,
        operatingCushion: 0,
        total: 0,
      },
      funding: {
        ownFunds: 0,
        loans: 0,
        investors: 0,
        other: 0,
        total: 0,
      },
      businessPlanGenerated: false,
    },
    location: {
      status: 'SEARCHING',
      candidates: [],
      searchChecklist: [],
    },
    legal: {
      legalForm: null,
      licenses: [],
    },
    design: {
      layout: {
        diningAreaSqM: 0,
        kitchenAreaSqM: 0,
        toiletsAreaSqM: 0,
        capacityEstimate: 0,
      },
      floorPlan: [],
      equipmentChecklist: [],
      constructionTimeline: [],
    },
    menu: {
      structure: {
        starters: [],
        mains: [],
        desserts: [],
        drinks: [],
      },
      foodCostTarget: 30,
    },
    suppliers: {
      list: [],
      initialStockBudget: {
        fresh: 0,
        drinks: 0,
        consumables: 0,
      },
    },
    tech: {
      pos: {
        selected: null,
        status: 'PENDING',
      },
      reservation: {
        selected: null,
        status: 'PENDING',
      },
    },
    team: {
      staffNeeds: {
        kitchen: 0,
        service: 0,
        management: 0,
      },
      estimatedMonthlyCost: 0,
      employees: [],
      shifts: [],
    },
    marketing: {
      brandIdentity: {
        name: '',
        description: '',
        elevatorPitch: '',
        colors: [],
      },
      digitalPresence: [],
      launchStrategy: [],
      socialMediaPlan: [],
    },
    opening: {
      finalChecklist: [],
      openingDate: null,
    },
    postOpening: {
      weeklyMetrics: [],
    },
    chatHistory: [],
  },
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      project: initialProject,
      updateProject: (data) =>
        set((state) => ({
          project: { ...state.project, ...data, updatedAt: new Date() },
        })),
      updatePhaseData: (phase, data) =>
        set((state) => ({
          project: {
            ...state.project,
            data: {
              ...state.project.data,
              [phase]: { ...state.project.data[phase], ...data },
            },
            updatedAt: new Date(),
          },
        })),
      setPhase: (phase) =>
        set((state) => ({
          project: { ...state.project, currentPhase: phase, updatedAt: new Date() },
        })),
      resetProject: () => set({ project: initialProject }),
      addChatMessage: (message) =>
        set((state) => {
          const history = state.project.data.chatHistory || [];
          // Prevent duplicates
          if (history.some((m) => m.id === message.id)) {
            return state;
          }
          return {
            project: {
              ...state.project,
              data: {
                ...state.project.data,
                chatHistory: [...history, message],
              },
              updatedAt: new Date(),
            },
          };
        }),
    }),
    {
      name: 'restaurant-project-storage',
    }
  )
);
