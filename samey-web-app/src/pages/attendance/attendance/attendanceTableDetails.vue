# Template
<template>
  <div class="employee-container">
    <div class="main-content" :class="{ 'with-filter': showFilters }">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-per-page="10"
        class="elevation-1 employee-table"
        height="calc(90vh - 190px)"
        show-select
        fixed-header
        @click:row="(event, row) => $emit('showEditPage', row)"
      >
        <template v-slot:top>
          <div class="d-flex align-center py-2 px-4">
            <v-text-field
              v-model="search"
              label="Search Attendance"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              variant="outlined"
              class="search-field"
              hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="toggleFilters" class="ms-2">
              <v-icon start>mdi-filter</v-icon>
              Filters
            </v-btn>
            <v-btn color="black" class="ms-2" @click="$emit('showAddPage')">
              <v-icon start>mdi-plus</v-icon>
              Add Attendance
            </v-btn>
          </div>
        </template>

        <!-- Custom Header Template for Resizable Columns -->
        <template v-slot:header="{ props }">
          <thead>
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.key"
                :style="{ width: header.width }"
                class="resizable-header"
                @mousedown="startResize($event, header)"
              >
                {{ header.title }}
                <div class="resize-handle"></div>
              </th>
            </tr>
          </thead>
        </template>

        <!-- Custom cell template for formatting times and handling nulls -->
        <template v-slot:[`item.inTime`]="{ item }">
          {{ formatTime(item.inTime) }}
        </template>
        <template v-slot:[`item.outTime`]="{ item }">
          {{ formatTime(item.outTime) }}
        </template>
        <template v-slot:[`item.workHours`]="{ item }">
          {{ formatDuration(item.workHours) }}
        </template>
        <template v-slot:[`item.breakTime`]="{ item }">
          {{ formatDuration(item.breakTime) }}
        </template>
      </v-data-table>
    </div>

    <!-- Right Filter Panel -->
    <transition name="slide">
      <div v-if="showFilters" class="filter-panel">
        <div class="filter-header">
          <div class="d-flex align-center justify-space-between px-4">
            <h3 class="text-h6 font-weight-medium">Advanced Filters</h3>
            <v-btn icon @click="toggleFilters">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <div class="filter-content">
          <v-select
            v-model="filters.status"
            :items="statusOptions"
            label="Status"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="filters.attendance"
            :items="attendanceOptions"
            label="Attendance"
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

          <p class="text-subtitle-2 mb-2">Date Range</p>
          <v-text-field
            v-model="filters.dateFrom"
            label="From"
            type="date"
            variant="outlined"
            density="compact"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            v-model="filters.dateTo"
            label="To"
            type="date"
            variant="outlined"
            density="compact"
            class="mb-4"
          ></v-text-field>

          <div class="filter-actions">
            <v-btn color="error" variant="text" @click="clearFilters">
              Clear
            </v-btn>
            <v-btn color="primary" @click="applyFilters" class="ms-2">
              Apply
            </v-btn>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { currentUserTenant } from "@/utils/currentUserTenant";

// Refs
const selected = ref([]);
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
  status: [],
  attendance: [],
  mode: [],
  dateFrom: "",
  dateTo: "",
});

// Options for filters
const statusOptions = ["in", "out"];
const attendanceOptions = ["present", "absent", "late"];
const modeOptions = ["face", "card", "manual"];

// Table headers
const headers = [
  { title: "Employee ID", key: "employeeId.employeeId", width: "120px" },
  {
    title: "Branch",
    key: "employeeId.assignedBranch[0].branch_id.branchName",
    width: "150px",
  },
  { title: "Status", key: "status", width: "100px" },
  { title: "Date", key: "date", width: "120px" },
  { title: "Attendance", key: "attendance", width: "120px" },
  { title: "Mode", key: "mode", width: "100px" },
  { title: "In Time", key: "inTime", width: "100px" },
  { title: "Out Time", key: "outTime", width: "100px" },
  { title: "Work Hours", key: "workHours", width: "120px" },
  { title: "Break Time", key: "breakTime", width: "120px" },
  { title: "Late By", key: "lateBy", width: "100px" },
  { title: "Over Time", key: "overTime", width: "100px" },
  { title: "On Time", key: "onTime", width: "100px" },
  { title: "Tenant", key: "tenant.tenantName", width: "150px" },
];

const getToken = () => {
  return localStorage.getItem("userToken");
};

const fetchTotalCount = async () => {
  try {
    const token = getToken();
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/attendance?aggregate%5BcountDistinct%5D=id`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.[0]?.countDistinct || 0;
  } catch (error) {
    console.error("Error fetching total count:", error);
    throw new Error("Failed to fetch total count.");
  }
};

const fetchAttendance = async () => {
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
      "employeeId.employeeId",
      "employeeId.assignedBranch.branch_id.branchName",
      "status",
      "date",
      "attendance",
      "id",
      "mode",
      "tenant",
      "inTime",
      "outTime",
      "tenant.tenantId",
      "tenant.tenantName",
      "date_created",
      "onTime",
      "overTime",
      "lateBy",
      "workHours",
      "breakTime",
    ].forEach((field) => params.append("fields[]", field));

    // Add filter for tenant
    params.append("filter[tenant][tenantId][_eq]", tenantId);

    // Add sort[] and pagination parameters
    params.append("sort[]", "-date_created");
    params.append("limit", String(itemsPerPage || 50));
    params.append("page", String(page || 1));

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/attendance?${params}`,
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
    console.error("Error fetching attendance:", error);
    showError.value = true;
    errorMessage.value =
      error.message || "Failed to fetch attendance data. Please try again.";
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
        (item.tenant?.tenantName || "").toLowerCase().includes(searchLower)
    );
  }

  if (filters.value.status.length) {
    filtered = filtered.filter((item) =>
      filters.value.status.includes(item.status)
    );
  }

  if (filters.value.attendance.length) {
    filtered = filtered.filter((item) =>
      filters.value.attendance.includes(item.attendance)
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

// Utility methods for formatting
const formatTime = (time) => {
  if (!time) return "-";
  return time;
};

const formatDuration = (duration) => {
  if (!duration) return "-";
  return duration;
};

// Methods
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  filters.value = {
    status: [],
    attendance: [],
    mode: [],
    dateFrom: "",
    dateTo: "",
  };
};

const startResize = (event, header) => {
  // Add resize logic here
  console.log("Resizing", header);
};

const applyFilters = () => {
  // Add filter apply logic here
  console.log("Applying filters", filters.value);
};

// Lifecycle hooks
onMounted(async () => {
  try {
    const count = await fetchTotalCount();
    totalItems.value = count;
    await fetchAttendance();
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
