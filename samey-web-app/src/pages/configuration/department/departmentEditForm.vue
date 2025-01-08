<template>
  <div>
    <v-form ref="form">
      <v-toolbar density="compact" color="grey-lighten-4">
        <v-btn icon color="black" @click="$emit('closeEditPage')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-4">Edit Department</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          variant="text"
          class="mr-2"
          @click="$emit('closeEditPage')"
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
            <h2 class="text-h6 mb-4">Department Details</h2>

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
import { ref, onMounted } from "vue";
import { currentUserTenant } from "@/utils/currentUserTenant";

const props = defineProps({
  editData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["closeEditPage"]);
const form = ref(null);
const selectedTab = ref("department"); // Default selected tab

const tenantId = currentUserTenant.getTenantId();

// Store original form data for comparison
const originalForm = ref(null);

const formData = ref({
  departmentName: "",
  status: "unassigned",
  branch: [],
});

// Fetch Token
const getToken = () => {
  return localStorage.getItem("userToken");
};

// Load form data on mounted
onMounted(() => {
  if (props.editData) {
    // Store original form data for comparison
    originalForm.value = { ...props.editData };

    // Set initial form data
    formData.value = {
      ...props.editData,
    };
  }
});

// Transform Payload for Department Changes
const transformDepartmentPayload = (form, originalForm) => {
  const payload = {};

  if (form.departmentName !== originalForm.departmentName) {
    payload.departmentName = form.departmentName;
  }

  if (form.status !== originalForm.status) {
    payload.status = form.status;
  }

  const newBranchId = form.branch?.[0]?.id || null;
  const originalBranchId = originalForm.branch?.[0]?.id || null;

  if (newBranchId !== originalBranchId) {
    payload.branch = newBranchId;
  }

  return {
    keys: [form.id],
    data: payload,
  };
};

// Save changes for the Department tab
const handleSave = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();
  if (!valid) {
    console.error("Form validation failed");
    return;
  }

  try {
    const payload = transformDepartmentPayload(
      formData.value,
      originalForm.value
    );
    const token = getToken();

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/department/${formData.value.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update department");
    }

    emit("closeEditPage");
  } catch (error) {
    console.error("Error updating department:", error);
  }
};

// Menu items for tabs
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
