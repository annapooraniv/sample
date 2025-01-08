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
            <v-window-item value="salary-structure">
              <SalaryStructure />
            </v-window-item>
            <v-window-item value="contribution">
              <Contribution />
            </v-window-item>
            <v-window-item value="deduction"> <Deduction /> </v-window-item>
            <v-window-item value="assign-employee">
              <AssignEmployee />
            </v-window-item>
            <v-window-item value="policy-salary-structure">
              <PolicySalaryStructure />
            </v-window-item>
            <v-window-item value="compliance"> <Compliance /> </v-window-item>
            <v-window-item value="professional-tax">
              <ProfessionalTax />
            </v-window-item>
            <v-window-item value="bonus"> <Bonus /> </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import SalaryStructure from "../salary/salarySettings/salaryStructure.vue";
import Contribution from "./salarySettings/contribution.vue";
import Deduction from "./salarySettings/deduction.vue";
import AssignEmployee from "./salarySettings/assignEmployee.vue";
import PolicySalaryStructure from "./salaryPolicy/policySalaryStructure.vue";
import Compliance from "../salary/salaryPolicy/compliance.vue";
import ProfessionalTax from "../salary/salaryPolicy/professionalTa.vue";
import Bonus from "../salary/salaryPolicy/bonus.vue";
export default {
  name: "SalaryConfiguration",
  components: {
    SalaryStructure,
    Contribution,
    Deduction,
    AssignEmployee,
    PolicySalaryStructure,
    Compliance,
    ProfessionalTax,
    Bonus,
  },
  data() {
    return {
      currentSection: "settings",
      activeTab: "salary-structure",
      sidebarItems: [
        {
          title: "Salary Settings",
          value: "settings",
          icon: "mdi-cog-outline",
        },
        {
          title: "Salary Policies",
          value: "policies",
          icon: "mdi-clipboard-text-outline",
        },
      ],
      settingsTabs: [
        {
          title: "Salary Structure",
          value: "salary-structure",
          icon: "mdi-cash",
        },
        {
          title: "Contribution",
          value: "contribution",
          icon: "mdi-account-cash",
        },
        { title: "Deduction", value: "deduction", icon: "mdi-cash-minus" },
        {
          title: "Assign to Employee",
          value: "assign-employee",
          icon: "mdi-account-cog-outline",
        },
      ],
      policiesTabs: [
        {
          title: "Salary Structure",
          value: "policy-salary-structure",
          icon: "mdi-cash-multiple",
        },
        { title: "Compliance", value: "compliance", icon: "mdi-shield-check" },
        {
          title: "Professional Tax",
          value: "professional-tax",
          icon: "mdi-percent",
        },
        { title: "Bonus & Gratuity", value: "bonus", icon: "mdi-gift" },
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
    currentSection(newSection) {
      this.activeTab =
        newSection === "settings"
          ? "salary-structure"
          : "policy-salary-structure";
    },
  },
  mounted() {
    this.activeTab = "salary-structure";
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
