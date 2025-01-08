<template>
  <div class="employee-container">
    <div
      v-if="!showForm"
      class="main-content"
      :class="{ 'with-filter': showFilters }"
    >
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="filteredItems"
        :items-per-page="10"
        class="elevation-1 employee-table"
        height="calc(90vh - 190px)"
        fixed-header
        show-select
        @click:row="(event, { item }) => editItem(item)"
      >
        <template v-slot:item.avatarImage="{ item }">
          <v-avatar size="40" v-if="item.avatarImage">
            <v-img
              :src="item.avatarImage"
              :alt="item.assignedUser.first_name"
            ></v-img>
          </v-avatar>
          <v-avatar size="40" v-else color="grey" class="text-uppercase">
            {{ item.assignedUser.first_name.charAt(0) }}
          </v-avatar>
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
            <template v-if="selected.length > 0">
              <v-btn color="error" @click="deleteSelected" class="ms-2">
                <v-icon start>mdi-delete</v-icon>
                Delete ({{ selected.length }})
              </v-btn>
            </template>
            <v-btn color="primary" @click="toggleFilters" class="ms-2">
              <v-icon start>mdi-filter</v-icon>
              Filters
            </v-btn>
            <v-btn color="black" class="ms-2" @click="showAddEmployeeForm">
              <v-icon start>mdi-plus</v-icon>
              Add Employee
            </v-btn>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center">
            <v-icon size="small" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
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
            @update:model-value="handleFilterChange"
            persistent-placeholder
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

          <v-select
            v-model="filters.department"
            :items="departmentOptions"
            label="Department"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
            persistent-placeholder
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

          <v-select
            v-model="filters.role"
            :items="roleOptions"
            label="Role"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
            persistent-placeholder
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

          <v-select
            v-model="filters.accessLevel"
            :items="accessLevelOptions"
            label="Access Level"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
            persistent-placeholder
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

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

    <EmployeeForm
      v-if="showForm"
      :is-editing="isEditing"
      :employee-data="editedItem"
      :tenant-id="tenantId"
      @save-success="handleSaveSuccess"
      @cancel="showForm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { authService } from "@/services/authService";
import EmployeeForm from "./employeeForm.vue";
import { currentUserTenant } from "@/utils/currentUserTenant";

// Table Headers
const headers = ref([
  {
    title: "Avatar",
    key: "avatarImage",
    align: "start",
    sortable: false,
    width: "80px",
  },
  {
    title: "Employee ID",
    key: "employeeId",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "Status",
    key: "status",
    align: "start",
    sortable: true,
    width: "100px",
  },
  {
    title: "Access On",
    key: "accessOn",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "First Name",
    key: "assignedUser.first_name",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "Phone",
    key: "assignedUser.phone",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "Email",
    key: "assignedUser.email",
    align: "start",
    sortable: true,
    width: "180px",
  },
  {
    title: "Office Email",
    key: "assignedUser.officeEmail",
    align: "start",
    sortable: true,
    width: "180px",
  },
  {
    title: "CompanyName",
    key: "assignedUser.tenant.tenantName",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "Role",
    key: "assignedUser.role.name",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "RFID Card Status",
    key: "rfidStatus",
    align: "start",
    sortable: true,
    width: "180px",
    value: (item) => {
      const rfidCard = item.assignedCards?.find(
        (card) => card.cardManagement_id.type === "rfid"
      );
      if (rfidCard) {
        return `${rfidCard.cardManagement_id.rfidCard} (${
          rfidCard.cardManagement_id.cardAccess ? "Enabled" : "Disabled"
        })`;
      }
      return "";
    },
  },
  {
    title: "Tag Status",
    key: "tagStatus",
    align: "start",
    sortable: true,
    width: "180px",
    value: (item) => {
      const tagCard = item.assignedCards?.find(
        (card) => card.cardManagement_id.type === "tag"
      );
      if (tagCard) {
        return `${tagCard.cardManagement_id.rfidCard} (${
          tagCard.cardManagement_id.cardAccess ? "Enabled" : "Disabled"
        })`;
      }
      return "";
    },
  },
  {
    title: "Department",
    key: "assignedDepartment",
    align: "start",
    sortable: true,
    width: "150px",
    value: (item) => {
      return item.assignedDepartment?.[0]?.department_id?.departmentName || "";
    },
  },
  {
    title: "Access Level",
    key: "accessLevelName",
    align: "start",
    sortable: true,
    width: "150px",
    value: (item) => {
      return (
        item.assignedAccessLevels?.[0]?.accesslevels_id?.accessLevelName || ""
      );
    },
  },
  {
    title: "Branch",
    key: "branchName",
    align: "start",
    sortable: true,
    width: "150px",
    value: (item) => {
      return item.assignedBranch?.[0]?.branch_id?.branchName || "";
    },
  },
  {
    title: "Aadhar",
    key: "assignedUser.aadhar",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "Gender",
    key: "assignedUser.gender",
    align: "start",
    sortable: true,
    width: "100px",
  },
  {
    title: "Date of Leaving",
    key: "assignedUser.dateOfLeaving",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "Date of Joining",
    key: "assignedUser.dateOfJoining",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "Date of Birth",
    key: "assignedUser.DOB",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "Blood Group",
    key: "assignedUser.bloodGroup",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "Marital Status",
    key: "assignedUser.maritalStatus",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "ESI Account Number",
    key: "assignedUser.ESIAccountNumber",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "PF Account Number",
    key: "assignedUser.PFAccountNumber",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "Office Email",
    key: "assignedUser.officeEmail",
    align: "start",
    sortable: true,
    width: "180px",
  },
  {
    title: "PAN",
    key: "assignedUser.pan",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "GST",
    key: "assignedUser.gst",
    align: "start",
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
const branchOptions = ref([]);
const departmentOptions = ref([]);
const roleOptions = ref([]);
const accessLevelOptions = ref([]);

// State
const showFilters = ref(false);
const search = ref("");
const selected = ref([]);
const showForm = ref(false);
const isEditing = ref(false);
const editedItem = ref({});

const filters = reactive({
  branch: [],
  department: [],
  role: [],
  accessLevel: [],
  gender: [],
  dateFrom: "",
  dateTo: "",
});

// API Integration
const loading = ref(false);
const employeeData = ref([]);

const fetchEmployeeData = async () => {
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
        "employeeId",
        "accessOn",
        "status",
        "assignedCards.cardManagement_id.id",
        "assignedCards.cardManagement_id.rfidCard",
        "assignedCards.cardManagement_id.type",
        "assignedCards.cardManagement_id.cardAccess",
        "assignedTag.cardManagement_id.rfidCard",
        "assignedTag.cardManagement_id.type",
        "assignedTag.cardManagement_id.cardAccess",
        "assignedDepartment.department_id.id",
        "assignedDepartment.department_id.departmentName",
        "assignedDepartment.department_id.departmentId",
        "assignedAccessLevels.accesslevels_id.accessLevelName",
        "assignedAccessLevels.accesslevels_id.id",
        "assignedAccessLevels.accesslevels_id.accessLevelNumber",
        "id",
        "assignedCards.id",
        "assignedTag.id",
        "assignedDepartment.id",
        "assignedAccessLevels.id",
        "assignedBranch.branch_id.branchName",
        "assignedBranch.branch_id.id",
        "assignedBranch.id",
        "assignedUser.first_name",
        "assignedUser.phone",
        "assignedUser.email",
        "assignedUser.avatar.id",
        "assignedUser.avatar.type",
        "assignedUser.avatar.title",
        "assignedUser.tenant.tenantId",
        "assignedUser.tenant.tenantName",
        "assignedUser.role.name",
        "assignedUser.role.id",
        "assignedUser.id",
        "date_created",
        "assignedUser.accountNumber",
        "assignedUser.aadhar",
        "assignedUser.IFSC",
        "assignedUser.gender",
        "assignedUser.UPI",
        "assignedUser.dateOfLeaving",
        "assignedUser.dateOfJoining",
        "assignedUser.DOB",
        "assignedUser.PFAccountNumber",
        "assignedUser.maritalStatus",
        "assignedUser.ESIAccountNumber",
        "assignedUser.officeEmail",
        "assignedUser.pan",
        "assignedUser.bloodGroup",
        "assignedUser.gst",
      ].join(","),
      sort: "-date_created",
      limit: "50",
      page: "1",
      "filter[assignedUser][tenant][tenantId][_eq]": tenantId,
    });
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/personalModule?${params}`,
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
    employeeData.value = await Promise.all(
      data.data.map(async (employee) => {
        if (employee.assignedUser.avatar?.id) {
          const avatarUrl = `${import.meta.env.VITE_API_URL}/assets/${
            employee.assignedUser.avatar.id
          }`;
          employee.avatarImage = await fetchAuthorizedImage(avatarUrl);
        }
        return employee;
      })
    );
  } catch (error) {
    console.error("Error fetching employee data:", error);
  } finally {
    loading.value = false;
  }
};

const fetchAuthorizedImage = async (imageUrl) => {
  try {
    const token = authService.getToken();
    const response = await fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to load image");
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error loading profile image:", error);
    return null;
  }
};

// Computed
const filteredItems = computed(() => {
  let result = [...employeeData.value];

  // Combined search and filter logic
  if (
    search.value ||
    filters.branch.length ||
    filters.department.length ||
    filters.role.length ||
    filters.accessLevel.length ||
    filters.gender.length ||
    filters.dateFrom ||
    filters.dateTo
  ) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter((item) => {
      // Search fields
      const searchFields = [
        item.employeeId,
        item.assignedUser.first_name,
        item.assignedUser.email,
        item.assignedUser.phone,
        item.assignedUser.officeEmail,
        item.assignedUser.tenant?.tenantName,
        item.assignedUser.role?.name,
        item.assignedDepartment?.[0]?.department_id?.departmentName,
        item.assignedAccessLevels?.[0]?.accesslevels_id?.accessLevelName,
        item.assignedBranch?.[0]?.branch_id?.branchName,
        item.assignedUser.aadhar,
        item.assignedUser.gender,
        item.assignedUser.pan,
        item.assignedUser.gst,
        item.assignedUser.bloodGroup,
        item.assignedUser.maritalStatus,
        item.assignedUser.dateOfLeaving,
        item.assignedUser.dateOfJoining,
        item.assignedUser.DOB,
      ];

      // Search matching
      const matchesSearch =
        !search.value ||
        searchFields.some((field) =>
          field?.toString().toLowerCase().includes(searchTerm)
        );

      // Filter matching
      const matchesBranch =
        !filters.branch.length ||
        filters.branch.some(
          (branch) => item.assignedBranch?.[0]?.branch_id?.branchName === branch
        );

      const matchesDepartment =
        !filters.department.length ||
        filters.department.some(
          (dept) =>
            item.assignedDepartment?.[0]?.department_id?.departmentName === dept
        );

      const matchesRole =
        !filters.role.length ||
        filters.role.some((role) => item.assignedUser?.role?.name === role);

      const matchesAccessLevel =
        !filters.accessLevel.length ||
        filters.accessLevel.some(
          (level) =>
            item.assignedAccessLevels?.[0]?.accesslevels_id?.accessLevelName ===
            level
        );

      const matchesGender =
        !filters.gender.length ||
        filters.gender.includes(item.assignedUser?.gender);

      // Date range matching
      const joiningDate = new Date(item.assignedUser?.dateOfJoining);
      const matchesDateFrom =
        !filters.dateFrom || joiningDate >= new Date(filters.dateFrom);
      const matchesDateTo =
        !filters.dateTo || joiningDate <= new Date(filters.dateTo);

      return (
        matchesSearch &&
        matchesBranch &&
        matchesDepartment &&
        matchesRole &&
        matchesAccessLevel &&
        matchesGender &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }

  return result;
});

// Methods
const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const clearFilters = () => {
  Object.keys(filters).forEach((key) => {
    filters[key] = Array.isArray(filters[key]) ? [] : "";
  });
};

const applyFilters = () => {
  showFilters.value = false;
};

const showAddEmployeeForm = () => {
  isEditing.value = false;
  editedItem.value = {}; // Reset editedItem
  showForm.value = true;
};

const editItem = (item) => {
  isEditing.value = true;
  editedItem.value = item;
  showForm.value = true;
};

const handleSaveSuccess = () => {
  showForm.value = false;
  fetchEmployeeData(); // Refresh the employee data
};

const deleteItem = async (item) => {
  if (confirm("Are you sure you want to delete this employee?")) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/personalModule/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      // Remove the item from the local data
      const index = employeeData.value.findIndex((emp) => emp.id === item.id);
      if (index !== -1) {
        employeeData.value.splice(index, 1);
      }

      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("An error occurred while deleting the employee");
    }
  }
};

const deleteSelected = async () => {
  if (!selected.value || selected.value.length === 0) {
    alert("Please select items to delete");
    return;
  }

  // Convert numeric IDs to proper format
  const itemsToDelete = selected.value.map((item) => {
    return typeof item === "number" ? { id: item } : item;
  });

  if (
    confirm(
      `Are you sure you want to delete ${itemsToDelete.length} selected employee(s)?`
    )
  ) {
    try {
      const deletePromises = itemsToDelete.map((item) =>
        fetch(
          `${import.meta.env.VITE_API_URL}/items/personalModule/${item.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${authService.getToken()}`,
            },
          }
        )
      );

      await Promise.all(deletePromises);

      // Update local data
      employeeData.value = employeeData.value.filter(
        (emp) => !itemsToDelete.some((item) => item.id === emp.id)
      );
      selected.value = [];
      alert("Selected employees deleted successfully");
    } catch (error) {
      console.error("Error deleting selected employees:", error);
      alert("An error occurred while deleting the selected employees");
    }
  }
};
const fetchFilterOptions = async () => {
  const token = authService.getToken();
  const tenantId = currentUserTenant.getTenantId();

  if (!token || !tenantId) {
    console.error("Authentication required or tenant not found");
    return;
  }

  try {
    const params = new URLSearchParams({
      "filter[tenant][tenantId][_eq]": tenantId, // Tenant-based filter
    });

    const [branchRes, departmentRes, roleRes, accessLevelRes] =
      await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/items/branch?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/items/department?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(
          `${
            import.meta.env.VITE_API_URL
          }/roles?filter[name][_neq]=Administrator`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        ),
        fetch(`${import.meta.env.VITE_API_URL}/items/accesslevels?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

    const [branchData, departmentData, roleData, accessLevelData] =
      await Promise.all([
        branchRes.json(),
        departmentRes.json(),
        roleRes.json(),
        accessLevelRes.json(),
      ]);

    // Map the data to appropriate options
    branchOptions.value = branchData.data.map((b) => b.branchName);
    departmentOptions.value = departmentData.data.map((d) => d.departmentName);
    roleOptions.value = roleData.data.map((r) => r.name);
    accessLevelOptions.value = accessLevelData.data.map(
      (a) => a.accessLevelName
    );
  } catch (error) {
    console.error("Error fetching filter options:", error);
  }
};
onMounted(async () => {
  fetchEmployeeData();
  fetchFilterOptions();
  await currentUserTenant.fetchLoginUserDetails();
  tenantId.value = currentUserTenant.getTenantId();
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
