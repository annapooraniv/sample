<template>
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
    <v-window v-model="activeTab">
      <v-window-item v-for="tab in tabs" :key="tab.value" :value="tab.value">
        <v-card flat>
          <v-card-text>
            <!-- Main Component -->
            <component
              :is="tab.component"
              v-if="!tab.showAdd && !tab.showEdit"
              
              @showAddPage="tab.showAdd = true"
              @showEditPage="(item) => handleShowEdit(tab, item)"
            />

            <!-- Add Component -->
            <component
              :is="tab.addComponent"
              v-if="tab.showAdd"
              @closeAddPage="tab.showAdd = false"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import LeaveRequest from "./leaveRequest.vue/table.vue";
import AddLeaveRequest from "./leaveRequest.vue/add.vue";
import LeavePermission from "./leavePermission.vue/leavePermissionTable.vue";

const tabs = ref([
  {
    value: "leaveRequest",
    title: "LEAVE REQUEST",
    icon: "mdi-calendar-clock",
    component: LeaveRequest,
    addComponent: AddLeaveRequest,
  },
  {
    value: "leavePermission",
    title: "LEAVE PERMISSION",
    icon: "mdi-account-check",
    component: LeavePermission,
  },
]);

const activeTab = ref("leaveRequest");

const handleTabChange = () => {
  // Reset all tabs' add and edit states
  tabs.value.forEach((tab) => {
    tab.showAdd = false;
    tab.showEdit = false;
    tab.editedItem = {};
  });
};

const handleShowEdit = (tab, item) => {
  tab.editedItem = item;
  tab.showEdit = true;
};
</script>

<style scoped>
.v-tab {
  text-transform: none !important;
}
</style>
