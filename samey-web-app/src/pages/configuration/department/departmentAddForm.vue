# Department Add Form
<template>
  <div>
    <v-form ref="form">
      <v-toolbar density="compact" color="grey-lighten-4">
        <v-btn icon color="black" @click="$emit('closeAddPage')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-4">Add Department</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          class="mr-2"
          @click="$emit('closeAddPage')"
          >CANCEL</v-btn
        >
        <v-btn color="black" @click="handleSave">SAVE</v-btn>
      </v-toolbar>

      <div class="d-flex content-wrapper">
        <!-- Side Navigation -->
        <div class="side-nav pa-4">
          <v-list density="compact" nav>
            <v-list-item
              v-for="(item, i) in menuItems"
              :key="i"
              :value="item"
              :active="selectedTab === item.value"
              @click="selectedTab = item.value"
              color="black"
              rounded
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </div>

        <!-- Content Area -->
        <div class="content-area pa-4">
          <v-card flat>
            <h2 class="text-h6 mb-4">Basic Details</h2>

            <v-window v-model="selectedTab">
              <!-- Basic Details -->
              <v-window-item value="basic">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.departmentName"
                      label="Department Name *"
                      variant="outlined"
                      :rules="[(v) => !!v || 'Department Name is required']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-model="formData.branch"
                      label="Branch *"
                      :items="availableBranches"
                      item-title="branchName"
                      item-value="id"
                      variant="outlined"
                      :loading="loadingBranches"
                      :rules="[(v) => !!v || 'Branch is required']"
                      required
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { currentUserTenant } from "@/utils/currentUserTenant";

const emit = defineEmits(["closeAddPage"]);
const form = ref(null);
const selectedTab = ref("basic");
const branches = ref([]);
const loadingBranches = ref(false);
const tenantId = currentUserTenant.getTenantId();

const formData = ref({
  departmentName: "",
  branch: null,
});

const getToken = () => {
  return localStorage.getItem("userToken");
};

const fetchBranches = async () => {
  loadingBranches.value = true;
  const token = getToken();

  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/branch?filter[tenant][tenantId][_eq]=${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch branches");
    const data = await response.json();
    branches.value = data.data || [];
  } catch (error) {
    console.error("Error fetching branches:", error);
  } finally {
    loadingBranches.value = false;
  }
};

onMounted(() => {
  fetchBranches();
});

const availableBranches = computed(() => branches.value);

const generateSequentialDepartmentId = async () => {
  try {
    const token = getToken();
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/department?filter[tenant][tenantId][_eq]=${tenantId}&sort[]=-departmentId&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      return "1";
    }
    const lastNumber = parseInt(data.data[0].departmentId, 10);
    return (lastNumber + 1).toString();
  } catch (error) {
    console.error("Error generating department ID:", error);
    return "1";
  }
};

const transformPayload = async (data) => {
  const departmentId = await generateSequentialDepartmentId();
  return {
    tenant: { tenantId },
    departmentId: departmentId,
    uniqueId: `${tenantId}-${departmentId}`,
    departmentName: data.departmentName,
    branch: data.branch ? { id: data.branch } : null,
    status: "assigned",
  };
};

const handleSave = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();
  if (!valid) {
    console.error("Form validation failed");
    return;
  }

  try {
    const payload = await transformPayload(formData.value); // Added await here
    const token = getToken();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/department`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save department");
    }

    emit("closeAddPage");
  } catch (error) {
    console.error("Error saving department:", error);
  }
};

const menuItems = [
  {
    title: "Basic Details",
    icon: "mdi-card-text-outline",
    value: "basic",
  },
];
</script>

<style scoped>
.side-nav {
  width: 240px;
  border-right: 1px solid #e0e0e0;
  background-color: white;
}

.content-area {
  flex: 1;
}
</style>
