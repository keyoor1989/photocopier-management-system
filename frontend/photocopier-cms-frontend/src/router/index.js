import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Layouts
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

// Auth Views
import Login from '@/views/auth/Login.vue'
import ForgotPassword from '@/views/auth/ForgotPassword.vue'
import ResetPassword from '@/views/auth/ResetPassword.vue'

// Dashboard Views
import Dashboard from '@/views/dashboard/Dashboard.vue'
import DashboardMetrics from '@/views/dashboard/DashboardMetrics.vue'
import ActivityFeed from '@/views/dashboard/ActivityFeed.vue'

// Customer Views
import CustomersIndex from '@/views/customers/CustomersIndex.vue'
import CustomerDetails from '@/views/customers/CustomerDetails.vue'
import CustomerForm from '@/views/customers/CustomerForm.vue'
import CustomerMachines from '@/views/customers/CustomerMachines.vue'
import CustomerHistory from '@/views/customers/CustomerHistory.vue'

// Machine Views
import MachinesIndex from '@/views/machines/MachinesIndex.vue'
import MachineDetails from '@/views/machines/MachineDetails.vue'
import MachineForm from '@/views/machines/MachineForm.vue'
import MachineServiceHistory from '@/views/machines/MachineServiceHistory.vue'

// Service Ticket Views
import ServiceTicketsIndex from '@/views/service-tickets/ServiceTicketsIndex.vue'
import ServiceTicketDetails from '@/views/service-tickets/ServiceTicketDetails.vue'
import ServiceTicketForm from '@/views/service-tickets/ServiceTicketForm.vue'
import ServiceCalendar from '@/views/service-tickets/ServiceCalendar.vue'

// Inventory Views
import InventoryIndex from '@/views/inventory/InventoryIndex.vue'
import InventoryDetails from '@/views/inventory/InventoryDetails.vue'
import InventoryForm from '@/views/inventory/InventoryForm.vue'
import StockAdjustment from '@/views/inventory/StockAdjustment.vue'
import LowStockAlerts from '@/views/inventory/LowStockAlerts.vue'

// Report Views
import ReportsIndex from '@/views/reports/ReportsIndex.vue'
import ReportDetails from '@/views/reports/ReportDetails.vue'
import SalesReport from '@/views/reports/SalesReport.vue'
import ServiceReport from '@/views/reports/ServiceReport.vue'
import InventoryReport from '@/views/reports/InventoryReport.vue'

// Settings Views
import Settings from '@/views/settings/Settings.vue'
import CompanyProfile from '@/views/settings/CompanyProfile.vue'
import UserManagement from '@/views/settings/UserManagement.vue'
import BranchManagement from '@/views/settings/BranchManagement.vue'
import IntegrationSettings from '@/views/settings/IntegrationSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: to => {
        const authStore = useAuthStore()
        return authStore.isAuthenticated ? '/app/dashboard' : '/login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { layout: AuthLayout, requiresGuest: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: { layout: AuthLayout, requiresGuest: true }
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: ResetPassword,
      meta: { layout: AuthLayout, requiresGuest: true }
    },
    {
      path: '/app',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
          children: [
            {
              path: '',
              name: 'dashboard-metrics',
              component: DashboardMetrics
            },
            {
              path: 'activity',
              name: 'activity-feed',
              component: ActivityFeed
            }
          ]
        },
        // Customers routes
        {
          path: 'customers',
          name: 'customers',
          component: CustomersIndex
        },
        {
          path: 'customers/new',
          name: 'customer-new',
          component: CustomerForm
        },
        {
          path: 'customers/:id',
          name: 'customer-details',
          component: CustomerDetails,
          children: [
            {
              path: '',
              name: 'customer-info',
              component: CustomerDetails
            },
            {
              path: 'machines',
              name: 'customer-machines',
              component: CustomerMachines
            },
            {
              path: 'history',
              name: 'customer-history',
              component: CustomerHistory
            }
          ]
        },
        {
          path: 'customers/:id/edit',
          name: 'customer-edit',
          component: CustomerForm
        },
        // Machines routes
        {
          path: 'machines',
          name: 'machines',
          component: MachinesIndex
        },
        {
          path: 'machines/new',
          name: 'machine-new',
          component: MachineForm
        },
        {
          path: 'machines/:id',
          name: 'machine-details',
          component: MachineDetails,
          children: [
            {
              path: '',
              name: 'machine-info',
              component: MachineDetails
            },
            {
              path: 'service-history',
              name: 'machine-service-history',
              component: MachineServiceHistory
            }
          ]
        },
        {
          path: 'machines/:id/edit',
          name: 'machine-edit',
          component: MachineForm
        },
        // Service Tickets routes
        {
          path: 'service-tickets',
          name: 'service-tickets',
          component: ServiceTicketsIndex
        },
        {
          path: 'service-tickets/calendar',
          name: 'service-calendar',
          component: ServiceCalendar
        },
        {
          path: 'service-tickets/new',
          name: 'service-ticket-new',
          component: ServiceTicketForm
        },
        {
          path: 'service-tickets/:id',
          name: 'service-ticket-details',
          component: ServiceTicketDetails
        },
        {
          path: 'service-tickets/:id/edit',
          name: 'service-ticket-edit',
          component: ServiceTicketForm
        },
        // Inventory routes
        {
          path: 'inventory',
          name: 'inventory',
          component: InventoryIndex
        },
        {
          path: 'inventory/new',
          name: 'inventory-new',
          component: InventoryForm
        },
        {
          path: 'inventory/:id',
          name: 'inventory-details',
          component: InventoryDetails
        },
        {
          path: 'inventory/:id/edit',
          name: 'inventory-edit',
          component: InventoryForm
        },
        {
          path: 'inventory/adjust-stock',
          name: 'stock-adjustment',
          component: StockAdjustment
        },
        {
          path: 'inventory/low-stock',
          name: 'low-stock-alerts',
          component: LowStockAlerts
        },
        // Reports routes
        {
          path: 'reports',
          name: 'reports',
          component: ReportsIndex
        },
        {
          path: 'reports/sales',
          name: 'sales-report',
          component: SalesReport
        },
        {
          path: 'reports/service',
          name: 'service-report',
          component: ServiceReport
        },
        {
          path: 'reports/inventory',
          name: 'inventory-report',
          component: InventoryReport
        },
        {
          path: 'reports/:id',
          name: 'report-details',
          component: ReportDetails
        },
        // Settings routes
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
          children: [
            {
              path: '',
              name: 'settings-profile',
              component: CompanyProfile
            },
            {
              path: 'users',
              name: 'settings-users',
              component: UserManagement
            },
            {
              path: 'branches',
              name: 'settings-branches',
              component: BranchManagement
            },
            {
              path: 'integrations',
              name: 'settings-integrations',
              component: IntegrationSettings
            }
          ]
        },
        // Activity route
        {
          path: 'activity',
          name: 'activity',
          component: ActivityFeed
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    if (!isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    // If route doesn't require auth and user is logged in, redirect to dashboard
    if (authStore.isAuthenticated && to.name === 'login') {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  }
})

export default router
