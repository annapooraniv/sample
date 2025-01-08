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
            <component
              :is="tab.component"
              v-if="!tab.showAdd && !tab.showEdit"
              @showAddPage="tab.showAdd = true"
              @showEditPage="(item) => handleShowEdit(tab, item)"
            />
            
            <component
              :is="tab.addComponent"
              v-else-if="tab.showAdd"
              @closeAddPage="tab.showAdd = false"
            />
            <component
              :is="tab.editComponent"
              v-else
              :editData="tab.editedItem"
              @closeEditPage="tab.showEdit = false"
            />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

// Components imports
import AccessLevel from "./accesslevel/accesslvelConfiguration.vue";
import AddAccessLevel from "./accesslevel/accesslvelAddForm.vue";
import EditAccessLevel from "./accesslevel/accesslvelEditForm.vue";
import Branch from "./branch/branchConfiguration.vue";
import AddBranch from "./branch/branchAddForm.vue";
import EditBranch from "./branch/branchEditForm.vue";
import Department from "./department/departmentConfiguration.vue";
import AddDepartment from "./department/departmentAddForm.vue";
import EditDepartment from "./department/departmentEditForm.vue";

const tabs = ref([
  {
    value: "accessLevel",
    title: "ACCESSLEVEL CONFIGURATION",
    icon: "mdi-shield-account",
    component: AccessLevel,
    addComponent: AddAccessLevel,
    editComponent: EditAccessLevel,
    showAdd: false,
    showEdit: false,
    editedItem: {},
  },
  {
    value: "branch",
    title: "BRANCH CONFIGURATION",
    icon: "mdi-source-branch",
    component: Branch,
    addComponent: AddBranch,
    editComponent: EditBranch,
    showAdd: false,
    showEdit: false,
    editedItem: {},
  },
  {
    value: "department",
    title: "DEPARTMENT CONFIGURATION",
    icon: "mdi-domain",
    component: Department,
    addComponent: AddDepartment,
    editComponent: EditDepartment,
    showAdd: false,
    showEdit: false,
    editedItem: {},
  },
]);

const activeTab = ref("accessLevel");

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
