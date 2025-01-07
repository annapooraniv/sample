<template>
  <div class="bank-details-container">
    <div
      v-if="!showForm"
      class="main-content"
      :class="{ 'with-filter': showFilters }"
    >
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :items-per-page="10"
        class="elevation-1 bank-table"
        height="calc(90vh - 190px)"
        fixed-header
        show-select
        @click:row="(event, { item }) => editItem(item)"
      >
        <template v-slot:top>
          <div class="d-flex align-center py-2 px-4">
            <v-text-field
              v-model="search"
              label="Search Bank Details"
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

        <template v-slot:item.actions="{ item }">
          <div class="d-flex justify-center">
            <v-icon size="small" class="me-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
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
            v-model="filters.tenantName"
            :items="tenantOptions"
            item-title="title"
            item-value="id"
            label="Tenant Name"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

          <v-select
            v-model="filters.role"
            :items="roleOptions"
            item-title="title"
            item-value="id"
            label="Role"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

          <v-select
            v-model="filters.branch"
            :items="branchOptions"
            item-title="title"
            item-value="id"
            label="Branch"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

          <v-select
            v-model="filters.bankName"
            :items="bankOptions"
            item-title="title"
            item-value="id"
            label="Bank Name"
            multiple
            chips
            closable-chips
            variant="outlined"
            class="mb-4"
            @update:model-value="handleFilterChange"
          >
            <template v-slot:selection="{ item }">
              {{ item.title }}
            </template>
          </v-select>

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

    <BankForm
      v-if="showForm"
      :is-editing="isEditing"
      :bank-data="editedItem"
      :tenant-id="tenantId"
      @save-success="handleSaveSuccess"
      @cancel="showForm = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { authService } from "@/services/authService";
import BankForm from "./bankForm.vue";
import { currentUserTenant } from "@/utils/currentUserTenant";

// Table Headers
const headers = ref([
  {
    title: "Employee ID",
    key: "employeeId",
    align: "start",
    sortable: true,
    width: "120px",
  },
  {
    title: "Employee Name",
    key: "assignedUser.first_name",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "Branch",
    key: "assignedBranch",
    align: "start",
    sortable: true,
    width: "150px",
    value: (item) => {
      return item.assignedBranch?.[0]?.branch_id?.branchName || "N/A";
    },
  },
  {
    title: "Bank Name",
    key: "assignedUser.bankName",
    align: "start",
    sortable: true,
    width: "150px",
  },
  {
    title: "Company Name",
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

// Filter Options
const branchOptions = ref([]);
const bankOptions = ref([]);
const tenantOptions = ref([]);
const roleOptions = ref([]);

// State
const showFilters = ref(false);
const search = ref("");
const showForm = ref(false);
const isEditing = ref(false);
const editedItem = ref({});

const filters = reactive({
  tenantName: [],
  role: [],
  branch: [],
  bankName: [],
});

// API Integration
const loading = ref(false);
const bankData = ref([]);

const fetchBankData = async () => {
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
        "assignedBranch.branch_id.branchName",
        "assignedUser.first_name",
        "assignedUser.phone",
        "assignedUser.UPI",
        "assignedUser.bankName",
        "assignedUser.IFSC",
        "assignedUser.accountNumber",
        "assignedUser.tenant.tenantId",
        "assignedUser.tenant.tenantName",
        "assignedUser.role.name",
        "assignedUser.role.id",
        "assignedUser.id",
        "assignedUser.accountStatus",
        "id",
        "date_created",
      ].join(","),
      sort: "-date_created",
      limit: "2500",
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
    bankData.value = data.data;
  } catch (error) {
    console.error("Error fetching bank data:", error);
  } finally {
    loading.value = false;
  }
};

// Computed
const filteredItems = computed(() => {
  let result = [...bankData.value];

  if (
    search.value ||
    filters.tenantName.length ||
    filters.role.length ||
    filters.branch.length ||
    filters.bankName.length
  ) {
    const searchTerm = search.value.toLowerCase();
    result = result.filter((item) => {
      const searchFields = [
        item.employeeId,
        item.assignedUser.first_name,
        item.assignedUser.bankName,
        item.assignedUser.tenant?.tenantName,
        item.assignedUser.role?.name,
        item.assignedBranch?.[0]?.branch_id?.branchName,
      ];

      const matchesSearch =
        !search.value ||
        searchFields.some((field) =>
          field?.toString().toLowerCase().includes(searchTerm)
        );

      const matchesTenant =
        !filters.tenantName.length ||
        filters.tenantName.includes(item.assignedUser?.tenant?.id);

      const matchesRole =
        !filters.role.length ||
        filters.role.includes(item.assignedUser?.role?.id);

      const matchesBranch =
        !filters.branch.length ||
        filters.branch.includes(item.assignedBranch?.[0]?.branch_id?.id);

      const matchesBankName =
        !filters.bankName.length ||
        filters.bankName.includes(item.assignedUser?.bankName);

      return (
        matchesSearch &&
        matchesTenant &&
        matchesRole &&
        matchesBranch &&
        matchesBankName
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

const editItem = (item) => {
  isEditing.value = true;
  editedItem.value = item;
  showForm.value = true;
};

const handleSaveSuccess = () => {
  showForm.value = false;
  fetchBankData();
};

const deleteItem = async (item) => {
  if (confirm("Are you sure you want to delete this bank detail?")) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/personalModule/${item.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedUser: {
              bankName: null,
              accountNumber: null,
              IFSC: null,
              UPI: null,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete bank details");
      }

      alert("Bank details deleted successfully");
      fetchBankData();
    } catch (error) {
      console.error("Error deleting bank details:", error);
      alert("An error occurred while deleting the bank details");
    }
  }
};

const fetchFilterOptions = async () => {
  const token = authService.getToken();
  const tenantId = await currentUserTenant.getTenantId();

  if (!token || !tenantId) {
    console.error("Authentication required or tenant not found");
    return;
  }

  try {
    const [branchRes, bankRes, tenantRes, roleRes] = await Promise.all([
      fetch(
        `${
          import.meta.env.VITE_API_URL
        }/items/branch?fields=id,branchName&filter[tenant][tenantId][_eq]=${tenantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
      fetch(
        `${
          import.meta.env.VITE_API_URL
        }/items/personalModule?fields=assignedUser.bankName&filter[assignedUser][tenant][tenantId][_eq]=${tenantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
      fetch(
        `${
          import.meta.env.VITE_API_URL
        }/items/tenant?fields=tenantId,tenantName`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
      fetch(`${import.meta.env.VITE_API_URL}/roles?fields=id,name`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const [branchData, bankData, tenantData, roleData] = await Promise.all([
      branchRes.json(),
      bankRes.json(),
      tenantRes.json(),
      roleRes.json(),
    ]);

    branchOptions.value = branchData.data.map((b) => ({
      id: b.id,
      title: b.branchName,
    }));
    bankOptions.value = [
      ...new Set(
        bankData.data.map((b) => b.assignedUser?.bankName).filter(Boolean)
      ),
    ].map((name) => ({ id: name, title: name }));
    tenantOptions.value = tenantData.data.map((t) => ({
      id: t.id,
      title: t.tenantName,
    }));
    roleOptions.value = roleData.data.map((r) => ({ id: r.id, title: r.name }));
  } catch (error) {
    console.error("Error fetching filter options:", error);
  }
};

onMounted(async () => {
  fetchBankData();
  fetchFilterOptions();
  await currentUserTenant.fetchLoginUserDetails();
  tenantId.value = currentUserTenant.getTenantId();
});
</script>

<style scoped>
.bank-details-container {
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

:deep(.v-data-table) {
  background: white;
}

:deep(.v-data-table__wrapper) {
  overflow-x: auto;
  scrollbar-width: thin;
}

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

:deep(.v-data-table tbody td) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 16px;
}

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

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

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
