# employee/my-teams/personal-details/PenaltyDetails.vue

<template>
  <div>
    <v-row v-if="!isEditing" class="my-4">
      <v-col cols="12" sm="3">
        <v-text-field
          v-model="search"
          label="Search Penalty Records"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          variant="outlined"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="3">
        <v-select
          v-model="selectedMonth"
          :items="months"
          label="Select Month"
          density="compact"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn color="black" prepend-icon="mdi-plus" @click="startAdd"
          >Add Penalty Record</v-btn
        >
      </v-col>
    </v-row>

    <v-card v-if="isEditing" class="mb-4">
      <v-card-title>{{
        isAdding ? "Add Penalty Record" : "Edit Penalty Record"
      }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="editedItem.empId"
              label="Employee"
              :items="employees"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="editedItem.employeeCategory"
              label="Category"
              :items="categories"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.lastPenaltyDate"
              label="Penalty Date"
              type="date"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-divider>Attendance Rules</v-divider>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="editedItem.allowEarlyExit"
              label="Allow Early Exit"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="editedItem.graceTimeEarlyExit"
              label="Grace Time (Early)"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="editedItem.allowLateEntry"
              label="Allow Late Entry"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="editedItem.graceTimeLateEntry"
              label="Grace Time (Late)"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-divider>Penalty Information</v-divider>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.lateArrivalsCount"
              label="Late Arrivals"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.deductionRate"
              label="Deduction Rate"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.totalPenaltyAmount"
              label="Total Penalty"
              type="number"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="editedItem.warningsIssued"
              label="Warnings Issued"
              type="number"
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
      <template v-slot:item.status="{ item }">
        <v-chip
          :color="getPenaltyStatusColor(item.warningsIssued)"
          :text-color="white"
        >
          {{ getPenaltyStatus(item.warningsIssued) }}
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
import { ref } from "vue";

const search = ref("");
const selectedMonth = ref("");
const isEditing = ref(false);
const isAdding = ref(false);

const headers = [
  { title: "Employee ID", key: "empId" },
  { title: "Name", key: "name" },
  { title: "Late Arrivals", key: "lateArrivalsCount" },
  { title: "Total Penalty", key: "totalPenaltyAmount" },
  { title: "Warnings", key: "warningsIssued" },
  { title: "Status", key: "status" },
  { title: "Last Penalty Date", key: "lastPenaltyDate" },
  { title: "Actions", key: "actions", sortable: false },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const categories = ["Full-time", "Part-time", "Contract"];
const employees = ["EMP001", "EMP002", "EMP003"];

const editedItem = ref({
  empId: "",
  employeeCategory: "",
  allowEarlyExit: "",
  graceTimeEarlyExit: "",
  allowLateEntry: "",
  graceTimeLateEntry: "",
  deductionRate: "",
  lateArrivalsCount: 0,
  totalPenaltyAmount: 0,
  warningsIssued: 0,
  lastPenaltyDate: "",
});

const getPenaltyStatus = (warnings) => {
  if (warnings === 0) return "Good Standing";
  if (warnings === 1) return "Warning";
  if (warnings === 2) return "Final Warning";
  return "Critical";
};

const getPenaltyStatusColor = (warnings) => {
  if (warnings === 0) return "green";
  if (warnings === 1) return "orange";
  if (warnings === 2) return "deep-orange";
  return "red";
};

// CRUD operations methods (similar to previous components)
</script>
