<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="3" class="sidebar">
        <v-list>
          <v-list-item
            v-for="(item, i) in sidebarItems"
            :key="i"
            :value="item"
            @click="currentSection = item.value"
            :active="currentSection === item.value"
            color="black"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="9" class="content">
        <v-card flat class="pa-4">
          <v-tabs
            v-model="activeTab"
            color="black"
            align-tabs="start"
            active-color="black"
          >
            <v-tab
              v-for="tab in getCurrentSectionTabs"
              :key="tab.value"
              :value="tab.value"
              class="text-none"
            >
              <v-icon start>{{ tab.icon }}</v-icon> {{ tab.title }}
            </v-tab>
          </v-tabs>
          <v-window v-model="activeTab" class="mt-4">
            <v-window-item value="working-hours">
              <WorkingHours />
            </v-window-item>
            <v-window-item value="week-off">
              <WeekOff />
            </v-window-item>
            <v-window-item value="leave-settings">
              <LeaveSettings />
            </v-window-item>
            <v-window-item value="holiday-settings">
              <HolidaySettings />
            </v-window-item>
            <v-window-item value="assign-employee">
              <AssignEmployee />
            </v-window-item>
            <v-window-item value="attendance-cycle">
              <AttendanceCycle />
            </v-window-item>
            <v-window-item value="shift-settings">
              <ShiftSettings />
            </v-window-item>
            <v-window-item value="penalty-settings">
              <PenaltyOverTime />
            </v-window-item>
            <!-- <v-window-item value="additional-settings">
              <AdditionalSettings />
            </v-window-item> -->
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WorkingHours from "./attendanceSettingsTabs/workingHours.vue";
import WeekOff from "./attendanceSettingsTabs/weekOff.vue";
import LeaveSettings from "./attendanceSettingsTabs/leaveSettings.vue";
import HolidaySettings from "./attendanceSettingsTabs/holidaySettings.vue";
import AssignEmployee from "./attendanceSettingsTabs/assigendEmployee.vue";
import AttendanceCycle from "../attendance/attendancePolicies/attendanceCycle.vue";
import ShiftSettings from "../attendance/attendancePolicies/shift.vue";
import PenaltyOverTime from "../attendance/attendancePolicies/penality&OverTime.vue";

export default {
  name: "AttendanceConfiguration",
  components: {
    WorkingHours,
    WeekOff,
    LeaveSettings,
    HolidaySettings,
    AssignEmployee,
    AttendanceCycle,
    ShiftSettings,
    PenaltyOverTime,
  },
  data() {
    return {
      currentSection: "settings",
      activeTab: null,
      sidebarItems: [
        {
          title: "Attendance Settings",
          value: "settings",
          icon: "mdi-cog-outline",
        },
        {
          title: "Attendance Policies",
          value: "policies",
          icon: "mdi-clipboard-text-outline",
        },
      ],
      settingsTabs: [
        {
          title: "Working Hours",
          value: "working-hours",
          icon: "mdi-clock-outline",
        },
        {
          title: "Week Off",
          value: "week-off",
          icon: "mdi-calendar-weekend",
        },
        {
          title: "Leave Settings",
          value: "leave-settings",
          icon: "mdi-calendar-check-outline",
        },
        {
          title: "Holiday Settings",
          value: "holiday-settings",
          icon: "mdi-beach",
        },
        {
          title: "Assign to Employee",
          value: "assign-employee",
          icon: "mdi-account-cog-outline",
        },
      ],
      policiesTabs: [
        {
          title: "Attendance Cycle",
          value: "attendance-cycle",
          icon: "mdi-refresh",
        },
        {
          title: "Shift Settings",
          value: "shift-settings",
          icon: "mdi-clock-time-four-outline",
        },
        {
          title: "Penalty Settings",
          value: "penalty-settings",
          icon: "mdi-alert-circle-outline",
        },
      ],
    };
  },
  computed: {
    getCurrentSectionTabs() {
      return this.currentSection === "settings"
        ? this.settingsTabs
        : this.policiesTabs;
    },
  },
  watch: {
    currentSection() {
      this.activeTab = this.getCurrentSectionTabs[0].value;
    },
  },
  mounted() {
    this.activeTab = this.settingsTabs[0].value;
  },
};
</script>

<style scoped>
.sidebar {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100vh;
  overflow-y: auto;
}
.content {
  height: 100vh;
  overflow-y: auto;
}
.v-tab {
  text-transform: none !important;
}
</style>
