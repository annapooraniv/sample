<!-- report tab -->

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
import EmployeeDetails from './employeeReport/employeeReportTable.vue';
import AttendanceDetails from "./attendance/attendanceTable.vue";
// import BankDetails from "./bankDetails/bankDetails.vue";
// import SalaryDetails from "./salaryDetails/salaryDetails.vue";
// import LeaveBalance from "./leaveDeatils/leaveBalance.vue";
// import PenaltyDetails from "./personalDetails/PenaltyDetails.vue";

const tabs = [
{
    value: "attendance",
    title: "Attendance Details",
    icon: "mdi-calendar-clock",
    component: AttendanceDetails,
  },
  {
    value: "employee",
    title: "Employee Details",
    icon: "mdi-account-details",
    component: EmployeeDetails,
  },
  
  {
    value: "payroll",
    title: "Payroll Report",
    icon: "mdi-cash",
   // component: "PayrollReport", 
  },
  
];

const activeTab = ref("attendance");

const currentTabComponent = computed(() => {
  const tab = tabs.find((t) => t.value === activeTab.value);
  return tab ? tab.component : null;
});

const handleTabChange = () => {
  // Handle tab change logic if needed
};
</script>
