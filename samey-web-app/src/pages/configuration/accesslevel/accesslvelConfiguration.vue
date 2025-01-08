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
        @click:row="(event, { item }) => editItem(item)"
      >
        <template v-slot:[`item.assignedDoors`]="{ item }">
          {{
            item.assignedDoors
              ?.map((door) => door.doors_id?.doorName)
              .join(", ") || ""
          }}
        </template>
        <template v-slot:top>
          <div class="d-flex align-center py-2 px-4">
            <v-text-field
              v-model="search"
              label="Search Employee"
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
              Add Employee
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
            v-model="filters.branch"
            :items="branchOptions"
            label="Branch"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="filters.department"
            :items="departmentOptions"
            label="Department"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="filters.role"
            :items="roleOptions"
            label="Role"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="filters.accessLevel"
            :items="accessLevelOptions"
            label="Access Level"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
          ></v-select>

          <v-select
            v-model="filters.gender"
            :items="['Male', 'Female', 'Other']"
            label="Gender"
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

    <!-- Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Employee</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.name"
                  label="Name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.empId"
                  label="Employee ID"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeEdit">Cancel</v-btn>
          <v-btn color="primary" @click="saveEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete Employee</v-card-title>
        <v-card-text>
          Are you sure you want to delete this employee?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeDelete"
            >Cancel</v-btn
          >
          <v-btn color="primary" @click="confirmDelete">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
//  import { authService } from '@/services/authService';
import { currentUserTenant } from "@/utils/currentUserTenant";
const emit = defineEmits(["showEditPage"]);
// Refs
const selected = ref([]);
const items = ref([]);
const loading = ref(false);
const search = ref("");
const showFilters = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const editedItem = ref({});
//  FETCH
const showError = ref(false); // Add this declaration for showError
const errorMessage = ref(""); // Add this declaration for errorMessage
const accessLevels = ref([]); // Add this declaration for accessLevels
const totalItems = ref(0); // Add this declaration for totalItems
const options = ref({ page: 1, itemsPerPage: 50 });
// Filter options
const filters = ref({
  status: [],
  accessType: [],
  tenant: [],
  dateFrom: "",
  dateTo: "",
});

// Mock data for select options
const branchOptions = ["Branch A", "Branch B", "Branch C"];
const departmentOptions = ["IT", "HR", "Finance"];
const roleOptions = ["Admin", "User", "Manager"];
const accessLevelOptions = ["Level 1", "Level 2", "Level 3"];

// Table headers
const headers = [
  { title: "Status", key: "status", width: "100px" },
  { title: "AccessLevel Number", key: "accessLevelNumber", width: "150px" },
  { title: "AccessLevel Name", key: "accessLevelName", width: "150px" },
  { title: "Access Type", key: "accessType", width: "120px" },
  { title: "Holidays", key: "holidays", width: "100px" },
  { title: "24 Hours", key: "_24hrs", width: "100px" },
  { title: "Max Work Hours", key: "maxWorkHours", width: "120px" },
  { title: "Working Hours", key: "workingHours", width: "120px" },
  {
    title: "Assigned Doors",
    key: "assignedDoors",
    width: "150px",
    render: (value) => {
      return (
        value?.map((door) => `${door.doors_id?.doorName || ""}`).join(", ") ||
        ""
      );
    },
  },
  { title: "Tenant Name", key: "tenant.tenantName", width: "150px" },
];

const getToken = () => {
  return localStorage.getItem("userToken");
};

const fetchTotalCount = async () => {
  try {
    const token = getToken();
    console.log("ytoken", token);
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/accesslevels?aggregate%5BcountDistinct%5D=id`,
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
    return data.data?.[0]?.countDistinct || 0; // Ensure the structure matches the API response
  } catch (error) {
    console.error("Error fetching total count:", error);
    throw new Error("Failed to fetch total count.");
  }
};

// USER

const fetchAccessLevels = async () => {
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
      "accessLevelName",
      "accessLevelNumber",
      "accessType",
      "status",
      "id",
      "wrkHrs.id",
      "wrkHrs.workDays",
      "tenant.tenantId",
      "tenant.tenantName",
      "assignedDoors.doors_id.doorNumber",
      "assignedDoors.doors_id.doorName",
      "assignedDoors.doors_id.id",
      "assignedDoors.id",
      "holidays",
      "_24hrs",
      "maxWorkHours",
      "workingHours",
      "date_created",
      "controllerStatus",
      "uniqueId",
    ].forEach((field) => params.append("fields[]", field));

    // Add sort[] and pagination parameters
    params.append("sort[]", "-date_created");
    params.append("limit", String(itemsPerPage || 50));
    params.append("page", String(page || 1));

    if (userRole === "Manager") {
      params.append("filter[tenant][tenantId][_eq]", tenantId);
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/accesslevels?${params}`,
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
    accessLevels.value = data.data;
    // Add this line to copy data to items
    items.value = data.data;
    totalItems.value = data.meta?.total_count || 0;
  } catch (error) {
    console.error("Error fetching access levels:", error);
    showError.value = true;
    errorMessage.value =
      error.message || "Failed to fetch access levels. Please try again.";
  } finally {
    loading.value = false;
  }
};
// existing data
const editItem = (item) => {
  console.log("Raw item:", item);

  // The main change: Format assignedDoors properly
  const formattedItem = {
    ...item,
  };

  console.log("Formatted item:", formattedItem);
  editedItem.value = formattedItem;
  showEditPage.value = true;
  emit("showEditPage", formattedItem);
};
// Computed properties
const filteredItems = computed(() => {
  let filtered = items.value;

  if (search.value) {
    const searchLower = search.value.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.accessLevelName.toLowerCase().includes(searchLower) ||
        item.tenant?.tenantName.toLowerCase().includes(searchLower)
    );
  }

  if (filters.value.status.length) {
    filtered = filtered.filter((item) =>
      filters.value.status.includes(item.status)
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
    accessType: [],
    tenant: [],
    dateFrom: "",
    dateTo: "",
  };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const startResize = (event, header) => {
  // Add your resize logic here
  console.log("Resizing", header);
};

const closeEdit = () => {
  editDialog.value = false;
  editedItem.value = {};
};

const saveEdit = () => {
  // Add your save logic here
  console.log("Saving", editedItem.value);
  editDialog.value = false;
};

const closeDelete = () => {
  deleteDialog.value = false;
};

const confirmDelete = () => {
  // Add your delete logic here
  console.log("Deleting item");
  deleteDialog.value = false;
};

const applyFilters = () => {
  // Add your filter apply logic here
  console.log("Applying filters", filters.value);
};

// Lifecycle hooks
onMounted(async () => {
  try {
    const count = await fetchTotalCount();
    totalItems.value = count;
    await fetchAccessLevels();
  } catch (error) {
    console.error("Error during initialization:", error);
    showError.value = true;
    errorMessage.value = "Failed to initialize data. Please refresh the page.";
  }
});

// edit
const showEditPage = ref(false);

const handleEditClick = (event) => {
  // The row data is directly in the event parameter
  console.log("Raw item received:", event);

  if (!event) {
    console.error("No item data received");
    return;
  }
};
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

.filter-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
