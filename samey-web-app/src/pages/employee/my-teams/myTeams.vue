# employee/my-teams/MyTeams.vue

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <!-- Tabs -->
        <v-tabs
          v-model="activeTab"
          color="black"
          show-arrows
          @update:modelValue="handleTabChange"
        >
          <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
            <v-icon :icon="tab.icon" class="mr-2"></v-icon>
            {{ tab.title }}
          </v-tab>
        </v-tabs>

        <!-- Dynamic Component Loading -->
        <component :is="currentTabComponent"></component>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue";
import EmployeeDetails from "./personalDetails/employeeDetails.vue";
import AttendanceDetails from "./attendanceDetails/attendanceDetails.vue";
import BankDetails from "./bankDetails/bankDetails.vue";
import SalaryDetails from "./salaryDetails/salaryDetails.vue";
import LeaveBalance from "./leaveDeatils/leaveBalance.vue";
import PenaltyDetails from "./personalDetails/PenaltyDetails.vue";

const tabs = [
  {
    value: "employee",
    title: "Employee Details",
    icon: "mdi-account-details",
    component: EmployeeDetails,
  },
  {
    value: "attendance",
    title: "Attendance Details",
    icon: "mdi-calendar-clock",
    component: AttendanceDetails,
  },
  {
    value: "bank",
    title: "Bank Details",
    icon: "mdi-bank",
    component: BankDetails,
  },
  {
    value: "salary",
    title: "Salary Details",
    icon: "mdi-cash",
    component: SalaryDetails,
  },
  {
    value: "leave",
    title: "Leave Balance",
    icon: "mdi-calendar-check",
    component: LeaveBalance,
  },
  {
    value: "penalty",
    title: "Penalty Details",
    icon: "mdi-alert-circle",
    component: PenaltyDetails,
  },
];

const activeTab = ref("employee");

const currentTabComponent = computed(() => {
  const tab = tabs.find((t) => t.value === activeTab.value);
  return tab ? tab.component : null;
});

const handleTabChange = () => {
  // Handle tab change logic if needed
};
</script>
