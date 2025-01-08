# Template
<template>
  <div class="logs-container">
    <div class="main-content">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-per-page="10"
        class="elevation-1"
        height="calc(90vh - 190px)"
        :loading="loading"
      >
        <template v-slot:top>
          <div class="d-flex align-center py-2 px-4">
            <v-text-field
              v-model="search"
              label="Search Logs"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              variant="outlined"
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="toggleFilters">
              <v-icon start>mdi-filter</v-icon>
              Filters
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </div>

    <!-- Filter Dialog -->
    <v-dialog v-model="showFilters" max-width="300">
      <v-card>
        <v-card-title>Filters</v-card-title>
        <v-card-text>
          <v-select
            v-model="filters.action"
            :items="actionOptions"
            label="Action"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="filters.mode"
            :items="modeOptions"
            label="Mode"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-text-field
            v-model="filters.dateFrom"
            label="From Date"
            type="date"
            variant="outlined"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="filters.dateTo"
            label="To Date"
            type="date"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="clearFilters"
            >Clear</v-btn
          >
          <v-btn color="primary" @click="applyFilters">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { currentUserTenant } from "@/utils/currentUserTenant";

// Refs
const items = ref([]);
const loading = ref(false);
const search = ref("");
const showFilters = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const totalItems = ref(0);
const options = ref({ page: 1, itemsPerPage: 50 });

// Filter options
const filters = ref({
  action: [],
  mode: [],
  dateFrom: "",
  dateTo: "",
});

const actionOptions = ["in", "out"];
const modeOptions = ["face", "card", "manual"];

// Table headers
const headers = [
  { title: "Employee ID", key: "employeeId.employeeId" },
  { title: "Action", key: "action" },
  { title: "Mode", key: "mode" },
  { title: "Time", key: "timeStamp" },
  { title: "Date", key: "date" },
  { title: "Branch", key: "employeeId.assignedBranch[0].branch_id.branchName" },
  { title: "Door", key: "door.doorName" },
  { title: "Door Number", key: "door.doorNumber" },
  { title: "Tenant", key: "tenant.tenantName" },
  { title: "Face ID", key: "faceId" },
];

const getToken = () => {
  return localStorage.getItem("userToken");
};

const fetchLogs = async () => {
  const token = getToken();

  if (!token) {
    showError.value = true;
    errorMessage.value = "Authentication required. Please login again.";
    return;
  }

  const userDetails = await currentUserTenant.fetchLoginUserDetails();
  const tenantId = currentUserTenant.getTenantId();

  loading.value = true;
  try {
    const { page, itemsPerPage } = options.value;

    const params = new URLSearchParams();

    // Add fields[] parameters
    [
      "action",
      "employeeId.employeeId",
      "mode",
      "timeStamp",
      "date",
      "id",
      "tenant",
      "tenant.tenantId",
      "tenant.tenantName",
      "employeeId.assignedBranch.branch_id.branchName",
      "date_created",
      "door.doorNumber",
      "door.doorName",
      "faceId",
    ].forEach((field) => params.append("fields[]", field));

    // Add filter for tenant
    params.append("filter[tenant][tenantId][_eq]", tenantId);

    // Add sort[] and pagination parameters
    params.append("sort[]", "-date_created");
    params.append("limit", String(itemsPerPage || 50));
    params.append("page", String(page || 1));

    const response = await fetch(
      `https://access.sensenservice.com/items/logs?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized access. Token might be expired.");
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    items.value = data.data;
    totalItems.value = data.meta?.total_count || 0;
  } catch (error) {
    console.error("Error fetching logs:", error);
    showError.value = true;
    errorMessage.value =
      error.message || "Failed to fetch logs. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Computed properties
const filteredItems = computed(() => {
  let filtered = items.value;

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.employeeId?.employeeId || "")
          .toLowerCase()
          .includes(searchLower) ||
        (item.employeeId?.assignedBranch?.[0]?.branch_id?.branchName || "")
          .toLowerCase()
          .includes(searchLower) ||
        (item.door?.doorName || "").toLowerCase().includes(searchLower) ||
        (item.tenant?.tenantName || "").toLowerCase().includes(searchLower)
    );
  }

  if (filters.value.action.length) {
    filtered = filtered.filter((item) =>
      filters.value.action.includes(item.action)
    );
  }

  if (filters.value.mode.length) {
    filtered = filtered.filter((item) =>
      filters.value.mode.includes(item.mode)
    );
  }

  if (filters.value.dateFrom && filters.value.dateTo) {
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = new Date(filters.value.dateFrom);
      const toDate = new Date(filters.value.dateTo);
      return itemDate >= fromDate && itemDate <= toDate;
    });
  }

  return filtered;
});

// Methods
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  filters.value = {
    action: [],
    mode: [],
    dateFrom: "",
    dateTo: "",
  };
};

const applyFilters = () => {
  showFilters.value = false;
};

// Lifecycle hooks
onMounted(async () => {
  try {
    await fetchLogs();
  } catch (error) {
    console.error("Error during initialization:", error);
    showError.value = true;
    errorMessage.value = "Failed to initialize data. Please refresh the page.";
  }
});
</script>
<style scoped>
.employee-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
  transition: margin-right 0.3s ease;
}

.main-content.with-filter {
  margin-right: 300px;
}

.search-field {
  max-width: 300px;
}

/* Table Styles */
:deep(.v-data-table) {
  background: white;
}

:deep(.v-data-table__wrapper) {
  overflow-x: auto;
  scrollbar-width: thin;
}

/* Header Styles */
:deep(.resizable-header) {
  position: relative;
  background: #f5f5f5;
  padding: 0 16px;
  height: 48px;
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  user-select: none;
}

:deep(.resize-handle) {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
}

:deep(.resize-handle:hover) {
  background: rgba(0, 0, 0, 0.1);
}

/* Filter Panel Styles */
.filter-panel {
  width: 300px;
  background: white;
  border-left: 1px solid #e0e0e0;
  position: fixed;
  right: 0;
  top: 64px;
  height: calc(100vh - 64px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
}

.filter-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  background: white;
  position: sticky;
  top: 0;
}

.filter-content {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  background: white;
  position: sticky;
  bottom: 0;
}

/* Transition animations */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Scrollbar Styling */
:deep(.v-data-table__wrapper::-webkit-scrollbar) {
  height: 8px;
  width: 8px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-track) {
  background: #f1f1f1;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb) {
  background: #888;
  border-radius: 4px;
}

:deep(.v-data-table__wrapper::-webkit-scrollbar-thumb:hover) {
  background: #555;
}

.filter-content::-webkit-scrollbar {
  width: 8px;
}

.filter-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.filter-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.filter-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Additional styles for attendance-specific features */
:deep(.v-data-table .text-center) {
  text-align: center;
}

:deep(.v-data-table .status-cell) {
  text-transform: capitalize;
  font-weight: 500;
}

:deep(.v-data-table .time-cell) {
  font-family: monospace;
  font-size: 0.9em;
}

/* Status indicators */
.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-in {
  background-color: #4caf50;
}

.status-out {
  background-color: #f44336;
}

/* Time display formatting */
.time-display {
  font-family: monospace;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

/* Null value display */
.null-value {
  color: #999;
  font-style: italic;
}
</style>
