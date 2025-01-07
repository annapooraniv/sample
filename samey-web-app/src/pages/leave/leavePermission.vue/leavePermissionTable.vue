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
          
        >
          <template v-slot:top>
            <div class="d-flex align-center py-2 px-4">
              <v-text-field
                v-model="search"
                label="Search Department"
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
             
            </div>
          </template>
          <template v-slot:[`item.date_created`]="{ item }">
  {{ formatDate(item.date_created) }}
</template>
<template v-slot:[`item.status`]="{ item }">
  <div class="d-flex align-center">
    <!-- <span :class="getStatusClass(item.status)" class="status-chip">
      {{ formatStatus(item.status) }}
    </span> -->
    <div v-if="item.status === 'pending'" class="d-flex ms-2">
      <v-btn
        size="small"
        color="success"
        class="me-2 action-btn"
        @click.stop="updateStatus(item.id, 'approved')"
      >
        Accept
      </v-btn>
      <v-btn
        size="small"
        color="error"
        class="action-btn"
        @click.stop="updateStatus(item.id, 'declined')"
      >
        Reject
      </v-btn>
    </div>
  </div>
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
              v-model="filters.tenant"
              :items="tenantOptions"
              label="Tenant"
              multiple
              chips
              closable-chips
              variant="outlined"
              class="mb-4"
            ></v-select>
  
            <v-select
              v-model="filters.branch"
              :items="branchOptions"
              label="Branch"
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
const emit = defineEmits(["showEditPage"]);

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
  leaveType: [],
  dateFrom: "",
  dateTo: "",
});


// Table headers
const headers = [
 
 { title: "Applied On", key: "date_created", width: "150px" },
  { title: "LeaveType", key: "leaveType", width: "120px" },
  { title: "LeaveFrom", key: "fromDate", width: "120px" },
  { title: "LeaveTO", key: "toDate", width: "120px" },
  { title: "Status", key: "status", width: "250px"  },
  { title: "Reason", key: "reason", width: "200px" },
  
];
// DATEFORMAT
const formatDate = (date) => {
  if (!date) return '';
  const newDate = new Date(date);
  return newDate.toISOString().split('T')[0];  // This will show exactly as 2025-01-15
};
const formatStatus = (status) => {
  return status === 'pending' ? 'Requested' : status;
};

const getStatusClass = (status) => {
  return {
    'status-requested': status === 'pending',
    'status-approved': status === 'approved',
    'status-rejected': status === 'declined'
  };
};
const updateStatus = async (id, newStatus) => {
  try {
    const token = getToken();
    const response = await fetch(
      `https://access.sensenservice.com/items/leaveRequest/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      }
    );

    if (!response.ok) throw new Error(`Failed to ${newStatus} request`);
    
    // Update item in local data
    items.value = items.value.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    );
  } catch (error) {
    console.error('Error updating status:', error);
    // Handle error notification here
  }
};
const cancelRequest = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(
      `https://access.sensenservice.com/items/leaveRequest/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to cancel request');
    
    // Remove item from local data
    items.value = items.value.filter(item => item.id !== id);
  } catch (error) {
    console.error('Error cancelling request:', error);
    // Handle error notification here
  }
};
const getToken = () => {
  return localStorage.getItem("userToken");
};

const fetchTotalCount = async () => {
  try {
    const token = getToken();
    const response = await fetch(
      "https://access.sensenservice.com/items/leaveRequest?aggregate%5BcountDistinct%5D=id",
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

const fetchData = async () => {
  const token = getToken();

  if (!token) {
    showError.value = true;
    errorMessage.value = "Authentication required. Please login again.";
    return;
  }

  const userDetails = await currentUserTenant.fetchLoginUserDetails();
  const tenantId = currentUserTenant.getTenantId();
  const userRole = userDetails.role?.name;

  loading.value = true;
  try {
    const { page, itemsPerPage } = options.value;

    const params = new URLSearchParams();

    // Add fields[] parameters
    [
      "id",
      "requestedBy.assignedUser.first_name",
      "requestedBy.id",
      "requestedBy",
      "leaveType",
      "date_created",
      "fromDate",
      "toDate",
      "reason",
      "status",
      "tenant.tenantId",
      "tenant.tenantName"
    ].forEach((field) => params.append("fields[]", field));

    // Add sort[] and pagination parameters
    params.append("sort[]", "-status");
    params.append("limit", String(itemsPerPage || 50));
    params.append("page", String(page || 1));

    if (userRole === "Manager") {
      params.append("filter[tenant][tenantId][_eq]", tenantId);
    }

    const response = await fetch(
      `https://access.sensenservice.com/items/leaveRequest?${params}`,
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
    console.error("Error fetching leave requests:", error);
    showError.value = true;
    errorMessage.value =
      error.message || "Failed to fetch leave requests. Please try again.";
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
        item.requestedBy?.assignedUser?.first_name?.toLowerCase().includes(searchLower) ||
        item.leaveType?.toLowerCase().includes(searchLower) ||
        item.reason?.toLowerCase().includes(searchLower)
    );
  }

  if (filters.value.status.length) {
    filtered = filtered.filter((item) =>
      filters.value.status.includes(item.status)
    );
  }

  if (filters.value.leaveType.length) {
    filtered = filtered.filter((item) =>
      filters.value.leaveType.includes(item.leaveType)
    );
  }

  if (filters.value.dateFrom && filters.value.dateTo) {
    filtered = filtered.filter((item) => {
      const itemDate = new Date(item.date_created);
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
    status: [],
    leaveType: [],
    dateFrom: "",
    dateTo: "",
  };
};

const startResize = (event, header) => {
  console.log("Resizing", header);
};

const applyFilters = () => {
  console.log("Applying filters", filters.value);
};

// Lifecycle hooks
onMounted(async () => {
  try {
    const count = await fetchTotalCount();
    totalItems.value = count;
    await fetchData();
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
/* STATUS COLOR */
.status-chip {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.status-requested {
  background-color: #e0e0e0;
  color: #424242;
}

.status-approved {
  background-color: #7f7777;
  color: #ffffff;
}

.status-rejected {
  background-color: #9e9e9e;
  color: #ffffff;
}

.status-chip:hover {
  opacity: 0.9;
  cursor: default;
}
.cancel {
    padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: #000000;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}
.cancel:hover {
    background-color: #333333;
    color: #e0e0e0;
}
action-btn {
  min-width: 64px;
  text-transform: none;
}

.action-btn:hover {
  opacity: 0.9;
}
</style>
