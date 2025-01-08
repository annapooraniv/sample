# employee/my-teams/personal-details/LeaveBalance.vue

<template>
  <div>
    <v-row v-if="!isEditing" class="my-4">
      <v-col cols="12" sm="3">
        <v-text-field
          v-model="search"
          label="Search Leave Balance"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Select Year"
          density="compact"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn color="black" prepend-icon="mdi-plus" @click="startAdd"
          >Update Leave Balance</v-btn
        >
      </v-col>
    </v-row>

    <v-card v-if="isEditing" class="mb-4">
      <v-card-title>{{
        isAdding ? "Add Leave Record" : "Update Leave Balance"
      }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="editedItem.empId"
              label="Employee"
              :items="employees"
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="editedItem.employeeCategory"
              label="Category"
              :items="categories"
            ></v-select>
          </v-col>

          <v-col cols="12">
            <v-divider>Leave Balances</v-divider>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.casualLeaveBalance"
              label="Casual Leave Balance"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.sickLeaveBalance"
              label="Sick Leave Balance"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.privilegeLeaveBalance"
              label="Privilege Leave Balance"
              type="number"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-divider>Leave Status</v-divider>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.leaveWithoutPay"
              label="Leave Without Pay"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.totalLeaveTaken"
              label="Total Leave Taken"
              type="number"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.totalLeaveBalance"
              label="Total Leave Balance"
              type="number"
              readonly
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="cancelEdit">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>

    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      :search="search"
      class="elevation-1"
    >
      <template v-slot:item.leaveStatus="{ item }">
        <v-chip
          :color="getLeaveStatusColor(item.totalLeaveBalance)"
          :text-color="white"
        >
          {{ getLeaveStatus(item.totalLeaveBalance) }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const search = ref("");
const selectedYear = ref(new Date().getFullYear());
const isEditing = ref(false);
const isAdding = ref(false);

const headers = [
  { title: "Employee ID", key: "empId" },
  { title: "Name", key: "name" },
  { title: "Category", key: "employeeCategory" },
  { title: "Casual Leave", key: "casualLeaveBalance" },
  { title: "Sick Leave", key: "sickLeaveBalance" },
  { title: "Privilege Leave", key: "privilegeLeaveBalance" },
  { title: "Leave Status", key: "leaveStatus" },
  { title: "Actions", key: "actions", sortable: false },
];

const years = [
  new Date().getFullYear() - 1,
  new Date().getFullYear(),
  new Date().getFullYear() + 1,
];

const categories = ["Full-time", "Part-time", "Contract"];
const employees = ["EMP001", "EMP002", "EMP003"];

const editedItem = ref({
  empId: "",
  employeeCategory: "",
  casualLeaveBalance: 0,
  sickLeaveBalance: 0,
  privilegeLeaveBalance: 0,
  leaveWithoutPay: 0,
  totalLeaveTaken: 0,
  totalLeaveBalance: 0,
});

const getLeaveStatus = (balance) => {
  if (balance > 10) return "Good Standing";
  if (balance > 5) return "Warning";
  return "Critical";
};

const getLeaveStatusColor = (balance) => {
  if (balance > 10) return "green";
  if (balance > 5) return "orange";
  return "red";
};

// CRUD operations methods (similar to previous components)
</script>
