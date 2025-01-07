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
import AttendanceTable from "../attendance/attendance/attendanceTableDetails.vue";
import LogsTable from "../attendance/log/logTable.vue";

const tabs = [
  {
    value: "attendance",
    title: "Attendance",
    icon: "mdi-calendar-clock",
    component: AttendanceTable,
  },
  {
    value: "logs",
    title: "Logs",
    icon: "mdi-clipboard-text-clock",
    component: LogsTable,
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

<style scoped>
.v-app {
  height: 100%;
}

.v-main {
  display: flex;
  flex-direction: column;
}

.v-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.v-tabs {
  flex-shrink: 0;
}

.v-window {
  flex-grow: 1;
  overflow: auto;
}
</style>
