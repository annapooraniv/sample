<template>
  <v-container fluid>
    <v-card class="mb-4" elevation="2">
      <v-tabs
        v-model="activeTab"
        background-color="black"
        centered
        dark
        slider-color="white"
      >
        <v-tab value="payroll" class="text-body-1">
          <v-icon start class="mr-2">mdi-cash-multiple</v-icon>
          Payroll Management
        </v-tab>
        <v-tab value="payment" class="text-body-1">
          <v-icon start class="mr-2">mdi-credit-card</v-icon>
          Payment Processing
        </v-tab>
        <v-tab value="history" class="text-body-1">
          <v-icon start class="mr-2">mdi-history</v-icon>
          Transaction History
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Payroll Tab -->
        <v-window-item value="payroll">
          <!-- Table View -->
          <div v-if="!editMode">
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    label="Search employees..."
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="selectedRole"
                    :items="roles"
                    label="Filter by Role"
                    prepend-inner-icon="mdi-filter-variant"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    clearable
                    class="rounded-lg"
                  />
                </v-col>
                <v-col cols="12" md="5" class="d-flex justify-end align-center">
                  <v-btn-group variant="outlined" class="mr-4">
                    <v-btn
                      :disabled="!hasSelection"
                      prepend-icon="mdi-export"
                      variant="outlined"
                    >
                      Export
                    </v-btn>
                    <v-btn
                      :disabled="!hasSelection"
                      prepend-icon="mdi-printer"
                      variant="outlined"
                    >
                      Print
                    </v-btn>
                  </v-btn-group>
                  <v-btn
                    color="error"
                    :disabled="!hasSelection"
                    prepend-icon="mdi-delete"
                    @click="confirmDeleteSelected"
                    class="mr-2"
                  >
                    Delete
                  </v-btn>
                  <v-btn
                    color="black"
                    :disabled="selected.length !== 1"
                    prepend-icon="mdi-pencil"
                    @click="editSelected"
                  >
                    Edit
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>

            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="processedItems"
              :search="search"
              show-select
              class="elevation-1"
              :loading="loading"
              :items-per-page="itemsPerPage"
            >
              <template v-slot:[`item.status`]="{ item }">
                <v-chip
                  :color="getStatusColor(item.status)"
                  size="small"
                  class="text-uppercase"
                >
                  {{ item.status }}
                </v-chip>
              </template>

              <template v-slot:bottom>
                <div class="d-flex align-center justify-space-between pa-4">
                  <div class="d-flex align-center">
                    <span class="mr-4 text-caption">Items per page</span>
                    <v-select
                      v-model="itemsPerPage"
                      :items="[5, 10, 15, 20, 25, 50]"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="pagination-select"
                    />
                  </div>
                  <v-pagination
                    v-model="page"
                    :length="pageCount"
                    :total-visible="7"
                    rounded="circle"
                  />
                </div>
              </template>
            </v-data-table>
          </div>

          <!-- Edit View -->
          <div v-else>
            <v-toolbar density="compact" color="grey-lighten-4">
              <v-btn icon color="black" @click="cancelEdit">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-toolbar-title class="ml-4">
                Edit Payroll Details
              </v-toolbar-title>
            </v-toolbar>

            <edit-payroll-inline
              :employee-data="editedItem"
              @save="savePayroll"
              @cancel="cancelEdit"
            />
          </div>
        </v-window-item>

        <!-- Payment Tab -->
        <v-window-item value="payment">
          <v-sheet class="d-flex align-center justify-center pa-12">
            <v-card variant="outlined" class="text-center pa-6" width="400">
              <v-icon size="64" color="grey-lighten-1" class="mb-4"
                >mdi-database-off</v-icon
              >
              <div class="text-h6 mb-2">No Payment Data Available</div>
              <div class="text-body-2 text-grey">
                Payment processing module will be available soon.
              </div>
            </v-card>
          </v-sheet>
        </v-window-item>

        <!-- History Tab -->
        <v-window-item value="history">
          <v-sheet class="d-flex align-center justify-center pa-12">
            <v-card variant="outlined" class="text-center pa-6" width="400">
              <v-icon size="64" color="grey-lighten-1" class="mb-4"
                >mdi-history-off</v-icon
              >
              <div class="text-h6 mb-2">No Payment History Available</div>
              <div class="text-body-2 text-grey">
                Transaction history will be displayed here.
              </div>
            </v-card>
          </v-sheet>
        </v-window-item>
      </v-window>
    </v-card>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-4">
          <v-icon start color="error" class="mr-2">mdi-alert-circle</v-icon>
          Delete Confirmation
        </v-card-title>
        <v-card-text class="pa-4">{{ deleteConfirmationText }}</v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="error" @click="deleteConfirmed" variant="flat">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import EditPayrollInline from "./sidetab.vue";

export default {
  name: "PayrollList",
  components: {
    EditPayrollInline,
  },
  data() {
    return {
      activeTab: "payroll",
      search: "",
      selected: [],
      selectedRole: null,
      editMode: false,
      editedItem: {},
      deleteDialog: false,
      deleteMode: "single",
      loading: false,
      itemsPerPage: 10,
      page: 1,
      items: [],
      headers: [
        { title: "Name", key: "name", sortable: true },
        { title: "Role", key: "role", sortable: true },
        { title: "Basic Salary", key: "basicSalary", sortable: true },
        { title: "Net Salary", key: "netSalary", sortable: true },
        { title: "Basic Pay", key: "basicPay", sortable: true },
        { title: "Paid", key: "salaryPaid", sortable: true },
        { title: "Pending", key: "salaryPending", sortable: true },
        { title: "Earnings", key: "totalEarnings", sortable: true },
        { title: "Deductions", key: "totalDeductions", sortable: true },
        { title: "HRA", key: "hra", sortable: true },
        { title: "Incentives", key: "incentives", sortable: true },
        { title: "Status", key: "status", sortable: true },
        { title: "ESI", key: "esi", sortable: true },
        { title: "PF", key: "pf", sortable: true },
        { title: "Bonus", key: "bonus", sortable: true },
      ],
      roles: [],
    };
  },

  computed: {
    hasSelection() {
      return this.selected && this.selected.length > 0;
    },
    deleteConfirmationText() {
      return this.deleteMode === "single"
        ? "Are you sure you want to delete this item?"
        : `Are you sure you want to delete ${this.selected.length} selected items?`;
    },
    processedItems() {
      return this.items.map((item) => ({
        id: item.id,
        name: item["12997e31"]?.assignedUser?.first_name || "",
        role: item["29cde34e"]?.assignedUser?.role?.name || "",
        basicSalary: parseFloat(item.basicSalary || 0).toFixed(2),
        netSalary: parseFloat(item.netSalary || 0).toFixed(2),
        basicPay: parseFloat(item.basicPay || 0).toFixed(2),
        salaryPaid: item.salaryPaid || "0.00",
        salaryPending: item.salaryPending || "0.00",
        totalEarnings: parseFloat(item.totalEarnings || 0).toFixed(2),
        totalDeductions: parseFloat(item.totalDeductions || 0).toFixed(2),
        hra: parseFloat(item.hra || 0).toFixed(2),
        incentives: parseFloat(item.incentives || 0).toFixed(2),
        status: item.status,
        esi: parseFloat(item.esi || 0).toFixed(2),
        pf: parseFloat(item.pf || 0).toFixed(2),
        bonus: parseFloat(item.bonus || 0).toFixed(2),
      }));
    },
    pageCount() {
      return Math.ceil(this.processedItems.length / this.itemsPerPage);
    },
  },

  created() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const params = {
          "fields[]": [
            "12997e31.assignedUser.first_name",
            "29cde34e.assignedUser.role.name",
            "basicSalary",
            "netSalary",
            "basicPay",
            "salaryPaid",
            "salaryPending",
            "totalEarnings",
            "totalDeductions",
            "hra",
            "incentives",
            "status",
            "5a9d4cba.assignedBranch.branch_id",
            "esi",
            "pf",
            "bonus",
            "professionalTax",
            "4722e6ae",
            "allowance",
            "id",
          ],
          "alias[12997e31]": "employee",
          "alias[29cde34e]": "employee",
          "alias[5a9d4cba]": "employee",
          "alias[4722e6ae]": "employee",
        };

        const response = await axios.get(
          "https://access.sensenservice.com/items/SalaryBreakdown",
          {
            params,
            headers: {
              Authorization: "Bearer Dz9wJMYwHNnN73PYnvNh5y8Yw67uJ6M5",
            },
          }
        );

        this.items = response.data.data;
        this.roles = [
          ...new Set(this.processedItems.map((item) => item.role)),
        ].filter(Boolean);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    editSelected() {
      if (this.selected.length === 1) {
        this.editedItem = { ...this.selected[0] };
        this.editMode = true;
      }
    },

    cancelEdit() {
      this.editMode = false;
      this.editedItem = {};
      this.selected = [];
    },

    savePayroll(updatedData) {
      const index = this.items.findIndex((item) => item.id === updatedData.id);
      if (index !== -1) {
        this.$set(this.items, index, { ...updatedData });
      }
      this.editMode = false;
      this.editedItem = {};
      this.selected = [];
    },

    confirmDeleteSelected() {
      this.deleteMode = this.selected.length > 1 ? "multiple" : "single";
      this.deleteDialog = true;
    },

    deleteConfirmed() {
      if (this.deleteMode === "single") {
        const index = this.items.findIndex(
          (item) => item.id === this.selected[0].id
        );
        if (index !== -1) this.items.splice(index, 1);
      } else {
        const selectedIds = this.selected.map((item) => item.id);
        this.items = this.items.filter(
          (item) => !selectedIds.includes(item.id)
        );
      }
      this.selected = [];
      this.deleteDialog = false;
    },
    getStatusColor(status) {
      const colors = {
        active: "success",
        pending: "warning",
        inactive: "error",
        default: "grey",
      };
      return colors[status?.toLowerCase()] || colors.default;
    },
  },
};
</script>

<style scoped>
.v-data-table {
  width: 100%;
  border-radius: 8px;
}

.pagination-select {
  max-width: 100px;
}

.v-btn-group .v-btn {
  background-color: white !important;
}

:deep(.v-data-table-footer) {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
