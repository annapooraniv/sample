<template>
  <div class="salary-container">
    <div
      v-if="!showForm"
      class="main-content"
      :class="{ 'with-filter': showFilters }"
    >
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-per-page="10"
        class="elevation-1 salary-table"
        height="calc(90vh - 190px)"
        fixed-header
        show-select
        @click:row="editItem"
      >
        <template v-slot:top>
          <div class="d-flex align-center py-2 px-4">
            <v-text-field
              v-model="search"
              label="Search Salary"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              variant="outlined"
              class="search-field"
              hide-details
              @input="debounceSearch"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="toggleFilters" class="ms-2">
              <v-icon start>mdi-filter</v-icon>
              Filters
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
            @update:model-value="handleFilterChange"
            persistent-placeholder
          ></v-select>

          <v-select
            v-model="filters.tenant"
            :items="tenantOptions"
            label="Company"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
            persistent-placeholder
          ></v-select>

          <p class="text-subtitle-2 mb-2">Basic Pay Range</p>
          <v-text-field
            v-model="filters.basicPayFrom"
            label="From"
            type="number"
            variant="outlined"
            density="compact"
            class="mb-2"
            @update:model-value="handleFilterChange"
          ></v-text-field>
          <v-text-field
            v-model="filters.basicPayTo"
            label="To"
            type="number"
            variant="outlined"
            density="compact"
            class="mb-4"
            @update:model-value="handleFilterChange"
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

    <SalaryForm
      v-if="showForm"
      :is-editing="true"
      :salary-data="editedItem"
      :tenant-id="tenantId"
      @save-success="handleSaveSuccess"
      @cancel="showForm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { authService } from "@/services/authService";
import SalaryForm from "./salaryForm.vue";
import { currentUserTenant } from "@/utils/currentUserTenant";
import debounce from "lodash/debounce";

// Table Headers
const headers = ref([
  {
    title: "Status",
    key: "status",
    align: "start",
    sortable: true,
    width: "100px",
  },
  {
    title: "Company",
    key: "tenant.tenantName",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "Basic Pay",
    key: "basicPay",
    align: "end",
    sortable: true,
    width: "120px",
  },
  {
    title: "Earnings",
    key: "earnings",
    align: "end",
    sortable: true,
    width: "120px",
  },
  {
    title: "Employee PF",
    key: "employeepf",
    align: "end",
    sortable: true,
    width: "120px",
  },
  {
    title: "Employee ESI",
    key: "employeeesi",
    align: "end",
    sortable: true,
    width: "120px",
  },
  {
    title: "Employer PF",
    key: "employerpf",
    align: "end",
    sortable: true,
    width: "120px",
  },
  {
    title: "Employer ESI",
    key: "employeresi",
    align: "end",
    sortable: true,
    width: "120px",
  },
  {
    title: "Deductions",
    key: "deductions",
    align: "end",
    sortable: true,
    width: "120px",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
    width: "100px",
  },
]);

// Column Resizing Logic
const resizing = ref(false);
const currentHeader = ref(null);
const startX = ref(0);
const startWidth = ref(0);
const tenantId = ref(null);

const startResize = (event, header) => {
  if (event.target.classList.contains("resize-handle")) {
    resizing.value = true;
    currentHeader.value = header;
    startX.value = event.pageX;
    startWidth.value = parseInt(header.width);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
  }
};

const handleMouseMove = (event) => {
  if (resizing.value && currentHeader.value) {
    const diff = event.pageX - startX.value;
    const newWidth = Math.max(100, startWidth.value + diff);
    currentHeader.value.width = `${newWidth}px`;
  }
};

const stopResize = () => {
  resizing.value = false;
  currentHeader.value = null;
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopResize);
};

// Cleanup event listeners
onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", stopResize);
});

// Filter Options
const statusOptions = ref([]);
const tenantOptions = ref([]);

// State
const showFilters = ref(false);
const search = ref("");
const showForm = ref(false);
const editedItem = ref({});

const filters = reactive({
  status: [],
  tenant: [],
  basicPayFrom: "",
  basicPayTo: "",
});

// API Integration
const loading = ref(false);
const salaryData = ref([]);

const fetchSalaryData = async () => {
  const token = authService.getToken();

  try {
    await currentUserTenant.fetchLoginUserDetails();
    const tenantId = currentUserTenant.getTenantId();

    if (!token || !tenantId) {
      throw new Error("Authentication required or tenant not found");
    }

    loading.value = true;
    const params = new URLSearchParams({
      fields: [
        "status",
        "tenant.tenantName",
        "tenant.tenantId",
        "basicPay",
        "earnings",
        "employeepf",
        "employeeesi",
        "employerpf",
        "employeresi",
        "deductions",
        "id",
      ].join(","),
      sort: "-id",
      limit: "25",
      page: "1",
      "filter[tenant][tenantId][_eq]": tenantId,
    });

    // Add filters to params
    if (filters.status.length) {
      params.append("filter[status][_in]", filters.status.join(","));
    }
    if (filters.tenant.length) {
      params.append("filter[tenant.tenantName][_in]", filters.tenant.join(","));
    }
    if (filters.basicPayFrom) {
      params.append("filter[basicPay][_gte]", filters.basicPayFrom);
    }
    if (filters.basicPayTo) {
      params.append("filter[basicPay][_lte]", filters.basicPayTo);
    }

    // Add search parameter
    if (search.value) {
      params.append("search", search.value);
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/salarySetting?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    salaryData.value = data.data;
  } catch (error) {
    console.error("Error fetching salary data:", error);
  } finally {
    loading.value = false;
  }
};

// Computed
const filteredItems = computed(() => salaryData.value);

const fetchFilterOptions = async () => {
  const token = authService.getToken();
  const tenantId = currentUserTenant.getTenantId();

  if (!token || !tenantId) {
    console.error("Authentication required or tenant not found");
    return;
  }

  try {
    const params = new URLSearchParams({
      "filter[tenant][tenantId][_eq]": tenantId,
    });

    // Fetch status options
    const statusRes = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/salarySetting?fields=status&${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const statusData = await statusRes.json();
    statusOptions.value = [
      ...new Set(statusData.data.map((item) => item.status)),
    ].filter(Boolean);

    // Fetch tenant options
    const tenantRes = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/tenant?fields=tenantName&fields=tenantId&${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const tenantData = await tenantRes.json();
    tenantOptions.value = [
      ...new Set(tenantData.data.map((item) => item.tenantName)),
    ].filter(Boolean);
  } catch (error) {
    console.error("Error fetching filter options:", error);
  }
};

// Methods
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  Object.keys(filters).forEach((key) => {
    filters[key] = Array.isArray(filters[key]) ? [] : "";
  });
  fetchSalaryData();
};

const applyFilters = () => {
  fetchSalaryData();
  showFilters.value = false;
};

// Editing functionality
const editItem = (item) => {
  editedItem.value = item;
  showForm.value = true;
};

const handleSaveSuccess = () => {
  showForm.value = false;
  fetchSalaryData();
};

const deleteItem = async (item) => {
  if (confirm("Are you sure you want to delete this salary record?")) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/salarySetting/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete salary record");
      }

      fetchSalaryData();
      alert("Salary record deleted successfully");
    } catch (error) {
      console.error("Error deleting salary record:", error);
      alert("An error occurred while deleting the salary record");
    }
  }
};

const handleFilterChange = debounce(() => {
  fetchSalaryData();
}, 300);

const debounceSearch = debounce(() => {
  fetchSalaryData();
}, 300);

// Watch for changes in search and filters
watch(
  [search, filters],
  () => {
    fetchSalaryData();
  },
  { deep: true }
);

onMounted(async () => {
  await currentUserTenant.fetchLoginUserDetails();
  tenantId.value = currentUserTenant.getTenantId();
  await fetchFilterOptions();
  fetchSalaryData();
});
</script>

<style scoped>
.salary-container {
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

/* Cell Styles */
:deep(.v-data-table tbody td) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 16px;
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

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
