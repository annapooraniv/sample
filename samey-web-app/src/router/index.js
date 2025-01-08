import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/loginAuthentication/login.vue";
import Verification from "../components/loginAuthentication/verification.vue";
import Register from "../components/loginAuthentication/register.vue";
import DashboardLayout from "../layouts/dashboardLayout.vue";
import Dashboard from "../pages/dashboard/dashboard.vue";
import Profile from "../pages/profile/profile.vue";
import settings from "../pages/settings/settings.vue";
import Payroll from "../pages/payroll/payroll.vue";
import Configuration from "../pages/configuration/configurationTab.vue";
import EmployeeDetails from "../pages/employee/my-teams/myTeams.vue";
// import DeviceManager from "../pages/dashboard/deviceManager.vue";
// import AccessLevel from "../pages/dashboard/accessLevel.vue";//
import LeaveManagement from "@/pages/leave/tab.vue";
import Attendance from "../pages/attendance/logTab.vue";
import Reports from '@/pages/report/reportTab.vue';
// import Settings from "../pages/dashboard/settings.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/verify",
    name: "Verification",
    component: Verification,
  },
  {
    path: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "/profile",
        name: "Profile",
        component: Profile,
      },
      // {
      //   path: "/personal-module",
      //   name: "PersonalModule",
      //   component: Module,
      // },
      // {
      //   path: "/device-manager",
      //   name: "DeviceManager",
      //   component: Module,
      // },
      // {
      //   path: "/access-level",
      //   name: "AccessLevel",
      //   component: Module,
      // },
      {
        path: "/configuration",
        name: "Configuration",
        component: Configuration,
      },
      {
        path: "/leave",
        name: "LeaveManagement",
        component: LeaveManagement,
      },
      {
        path: "/attendance",
        name: "Attendance",
        component: Attendance,
      },
      {
        path: "/employee-deatils",
        name: "Employee Details",
        component: EmployeeDetails,
      },
      {
        path: "/payroll",
        name: "Payroll",
        component: Payroll,
      },
      {
        path: "/reports",
        name: "Reports",
        component:Reports,
      },
      {
        path: "/settings",
        name: "Settings",
        component: settings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
