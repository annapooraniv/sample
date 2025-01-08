<template>
  <v-container fluid class="pa-4">
    <v-card class="elevation-3 rounded-lg">
      <v-card-title class="d-flex flex-wrap align-center py-4 px-6 bg-white">
        <v-icon size="32" color="color" class="mr-3">mdi-account-group</v-icon>
        <span class="text-h5 font-weight-bold white--text"
          >Assign Employees</span
        >
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Search employees..."
          single-line
          hide-details
          filled
          rounded
          dense
          dark
          class="mt-3 mt-sm-0 mx-sm-2"
          style="max-width: 300px"
        ></v-text-field>
        <v-select
          v-model="selectedDepartment"
          :items="departments"
          label="Department"
          hide-details
          filled
          rounded
          dense
          dark
          style="max-width: 200px"
          class="mt-3 mt-sm-0"
        ></v-select>
      </v-card-title>

      <v-data-table
        v-model:page="page"
        :headers="headers"
        :items="filteredEmployees"
        :search="search"
        :items-per-page="itemsPerPage"
        class="elevation-1"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="black" class="mr-2">
              <span class="white--text text-subtitle-2">{{
                item.name.charAt(0)
              }}</span>
            </v-avatar>
            {{ item.name }}
          </div>
        </template>

        <template v-slot:item.department="{ item }">
          <v-chip
            :color="getDepartmentColor(item.department)"
            text-color="white"
            small
          >
            {{ item.department }}
          </v-chip>
        </template>

        <template v-slot:item.assign="{ item }">
          <v-switch
            v-model="item.assigned"
            color="black"
            hide-details
            inset
            @change="updateAssignment(item)"
          ></v-switch>
        </template>

        <template v-slot:bottom>
          <v-toolbar flat color="transparent" class="px-4">
            <v-toolbar-title class="text-subtitle-1">
              Total Employees: {{ filteredEmployees.length }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-select
              v-model="itemsPerPage"
              :items="[5, 10, 15, 20]"
              label="Items per page"
              hide-details
              dense
              outlined
              style="max-width: 150px"
            ></v-select>
          </v-toolbar>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "AssignEmployee",
  data() {
    return {
      search: "",
      page: 1,
      itemsPerPage: 5,
      selectedDepartment: "All Departments",
      headers: [
        {
          title: "Employee Name",
          align: "start",
          key: "name",
          sortable: true,
        },
        {
          title: "Department",
          align: "start",
          key: "department",
          sortable: true,
        },
        {
          title: "Assign Template",
          align: "center",
          key: "assign",
          sortable: false,
        },
      ],
      departments: [
        "All Departments",
        "IT",
        "HR",
        "Finance",
        "Marketing",
        "Operations",
      ],
      employees: [
        { name: "John Doe", department: "IT", assigned: true },
        { name: "Jane Smith", department: "HR", assigned: false },
        { name: "Mike Johnson", department: "Finance", assigned: true },
        { name: "Sarah Wilson", department: "IT", assigned: false },
        { name: "Robert Brown", department: "Marketing", assigned: true },
        { name: "Emily Davis", department: "HR", assigned: false },
        { name: "Michael Clark", department: "Finance", assigned: true },
        { name: "Lisa Anderson", department: "Operations", assigned: false },
        { name: "David Martinez", department: "IT", assigned: true },
        { name: "Jennifer Taylor", department: "Marketing", assigned: false },
        { name: "William White", department: "Operations", assigned: true },
        { name: "Elizabeth Thomas", department: "HR", assigned: false },
      ],
    };
  },
  computed: {
    filteredEmployees() {
      if (this.selectedDepartment === "All Departments") {
        return this.employees;
      }
      return this.employees.filter(
        (emp) => emp.department === this.selectedDepartment
      );
    },
  },
  methods: {
    updateAssignment(employee) {
      console.log(
        `Updated assignment for ${employee.name}:`,
        employee.assigned
      );
      // Here you would typically make an API call to update the assignment
    },
    getDepartmentColor(department) {
      const colors = {
        IT: "indigo",
        HR: "deep-purple",
        Finance: "green",
        Marketing: "orange",
        Operations: "blue",
      };
      return colors[department] || "grey";
    },
  },
};
</script>

<style scoped>
.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 0 0 8px 8px;
}

.v-data-table :deep(.v-data-table-header) {
  background-color: #f5f5f5;
}

.v-data-table :deep(.v-data-table-header th) {
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.6);
}

.v-data-table
  :deep(
    .v-data-table__wrapper
      > table
      > tbody
      > tr:hover:not(.v-data-table__expanded__content):not(
        .v-data-table__empty-wrapper
      )
  ) {
  background: #f5f5f5 !important;
}

.v-card-title {
  border-radius: 8px 8px 0 0;
}
</style>
