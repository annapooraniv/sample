<template>
  <div class="bank-form-container">
    <!-- Header -->
    <div class="form-header">
      <div class="header-content">
        <v-btn icon variant="text" @click="$emit('cancel')" class="back-button">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h2 class="text-h6">
          {{ isEditing ? "Edit Bank Details" : "Add Bank Details" }}
        </h2>
      </div>
      <div class="action-buttons">
        <v-btn color="error" variant="text" @click="$emit('cancel')"
          >CANCEL</v-btn
        >
        <v-btn color="black" @click="saveBankDetails">SAVE</v-btn>
      </div>
    </div>

    <!-- Main Content with Sidebar -->
    <div class="form-content-wrapper">
      <!-- Left Sidebar with Tabs -->
      <div class="sidebar">
        <v-list>
          <v-list-item
            v-for="(tab, index) in tabs"
            :key="index"
            :value="tab"
            :active="currentTab === tab.id"
            @click="currentTab = tab.id"
            :class="{ 'has-error': tabHasError(tab.id) }"
          >
            <template v-slot:prepend>
              <v-icon :color="tabHasError(tab.id) ? 'error' : 'default'">
                {{ tab.icon }}
              </v-icon>
            </template>

            <v-list-item-title>
              {{ tab.title }}
              <v-icon
                v-if="tabHasError(tab.id)"
                color="error"
                size="small"
                class="ms-2"
              >
                mdi-alert-circle
              </v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <!-- Main Content Area -->
      <div class="form-content">
        <v-form ref="form" v-model="valid" @submit.prevent="saveBankDetails">
          <!-- Employee Details Section -->
          <div v-show="currentTab === 'employee'" class="form-section">
            <!-- Info Alert -->
            <v-alert
              type="info"
              variant="tonal"
              class="mb-4"
              density="comfortable"
            >
              The fields in the Employee Details Section are set to read-only
              and cannot be edited. This ensures that the displayed information
              is for reference purposes only and cannot be modified directly in
              this section
            </v-alert>

            <v-row>
              <!-- Employee ID -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeeId"
                  label="Employee ID"
                  variant="outlined"
                  density="comfortable"
                  readonly
                ></v-text-field>
              </v-col>

              <!-- Employee Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeeName"
                  label="Employee Name"
                  variant="outlined"
                  density="comfortable"
                  readonly
                ></v-text-field>
              </v-col>

              <!-- Role -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.role"
                  label="Role"
                  variant="outlined"
                  density="comfortable"
                  readonly
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Bank Details Section -->
          <div v-show="currentTab === 'bank'" class="form-section">
            <v-row>
              <!-- Advance Mode Toggle -->
              <v-col cols="12">
                <v-switch
                  v-model="advanceModeEnabled"
                  label="Advance Mode"
                  color="black"
                  hide-details
                  inset
                  class="mr-6"
                  @change="handleAdvanceModeToggle"
                ></v-switch>
              </v-col>

              <!-- Bank Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.bankName"
                  label="Bank Name *"
                  required
                  :error-messages="getFieldErrorMessage('bankName')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('bankName')"
                ></v-text-field>
              </v-col>

              <!-- Account Number -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.accountNumber"
                  label="Account Number *"
                  required
                  :error-messages="getFieldErrorMessage('accountNumber')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('accountNumber')"
                ></v-text-field>
              </v-col>

              <!-- IFSC Code with Verify Button -->
              <v-col cols="12" md="6">
                <div class="d-flex align-center gap-2">
                  <v-text-field
                    v-model="formData.IFSC"
                    label="IFSC Code *"
                    required
                    :error-messages="getFieldErrorMessage('IFSC')"
                    variant="outlined"
                    density="comfortable"
                    @blur="markFieldAsTouched('IFSC')"
                  ></v-text-field>
                  <v-btn
                    v-if="advanceModeEnabled"
                    color="black"
                    @click="showVerifyDialog"
                  >
                    Verify
                  </v-btn>
                </div>
                <div class="mt-1">
                  <v-chip
                    :color="
                      formData.accountStatus === 'verified'
                        ? 'success'
                        : 'warning'
                    "
                    size="small"
                  >
                    {{
                      formData.accountStatus === "verified"
                        ? "Verified"
                        : "Unverified"
                    }}
                  </v-chip>
                </div>
              </v-col>

              <!-- UPI -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.UPI"
                  label="UPI"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </div>
    </div>

    <!-- IFSC Verification Dialog -->
    <v-dialog v-model="verifyDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 pa-4">Verify IFSC Code</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="verifyIFSC"
            label="Enter IFSC Code"
            variant="outlined"
            density="comfortable"
            :error-messages="ifscError"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeVerifyDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="verifyIFSCCode">Verify</v-btn>
          <v-btn color="secondary" @click="saveWithoutVerification">
            Save without verification
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
import { authService } from "@/services/authService";
import { currentUserTenant } from "@/utils/currentUserTenant";

const props = defineProps({
  isEditing: Boolean,
  bankData: Object,
  tenantId: String,
});

const emit = defineEmits(["save-success", "cancel"]);

// Initialize reactive references
const form = ref(null);
const valid = ref(false);
const formErrors = ref({});
const touchedFields = ref({});
const branchOptions = ref([]);
const currentTab = ref("employee");
const advanceModeEnabled = ref(false);
const verifyDialog = ref(false);
const verifyIFSC = ref("");
const ifscError = ref("");

const tabs = [
  { id: "employee", title: "Employee Details", icon: "mdi-account" },
  { id: "bank", title: "Bank Details", icon: "mdi-bank" },
];

// Initialize form data
const formData = reactive({
  employeeId: "",
  employeeName: "",
  bankName: "",
  accountNumber: "",
  IFSC: "",
  UPI: "",
  branch: "",
  role: "",
  accountStatus: "unverified",
});

// Add computed property for branch name
const getBranchName = computed(() => {
  const branch = branchOptions.value.find((b) => b.id === formData.branch);
  return branch ? branch.name : "";
});

const tabRequiredFields = {
  employee: ["employeeId"],
  bank: ["bankName", "accountNumber", "IFSC"],
};

const getFieldErrorMessage = (field) => {
  if (formData[field]) {
    formErrors.value[field] = "";
    return "";
  }
  if (formErrors.value[field] && touchedFields.value[field]) {
    return formErrors.value[field];
  }
  return "";
};

const markFieldAsTouched = (field) => {
  touchedFields.value[field] = true;
  if (
    !formData[field] &&
    ["employeeId", "bankName", "accountNumber", "IFSC"].includes(field)
  ) {
    formErrors.value[field] = "This field is required";
  }
};

const tabHasError = (tabId) => {
  const requiredFields = tabRequiredFields[tabId];
  return requiredFields.some(
    (field) => !formData[field] && touchedFields.value[field]
  );
};

// Method to handle Advance Mode toggle
const handleAdvanceModeToggle = () => {
  // No specific action needed here as we're always showing all fields
};

// Method to show verify dialog
const showVerifyDialog = () => {
  verifyIFSC.value = formData.IFSC;
  verifyDialog.value = true;
};

// Method to close verify dialog
const closeVerifyDialog = () => {
  verifyDialog.value = false;
  ifscError.value = "";
};

// Dummy method to verify IFSC code
const verifyIFSCCode = async () => {
  try {
    // Simulating API call for IFSC verification
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    // Dummy verification logic (always succeeds for demonstration)
    const isVerified = true;

    if (isVerified) {
      formData.accountStatus = "verified";
      closeVerifyDialog();
      alert("IFSC Code verified successfully!");
    } else {
      ifscError.value = "Invalid IFSC Code";
    }
  } catch (error) {
    console.error("Error verifying IFSC:", error);
    ifscError.value = "Error verifying IFSC code";
  }
};

// Method to save without verification
const saveWithoutVerification = () => {
  formData.accountStatus = "unverified";
  closeVerifyDialog();
};

async function saveBankDetails() {
  if (!valid.value) {
    alert("Please fill in all required fields correctly before saving");
    return;
  }

  try {
    const resolvedTenantId = await resolveTenantId();

    const payload = {
      assignedUser: {
        id: props.bankData?.assignedUser?.id,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        IFSC: formData.IFSC,
        UPI: formData.UPI,
        accountStatus: formData.accountStatus,
        role: props.bankData?.assignedUser?.role?.id,
      },
    };

    const url = props.isEditing
      ? `${import.meta.env.VITE_API_URL}/items/personalModule/${
          props.bankData.id
        }`
      : `${import.meta.env.VITE_API_URL}/items/personalModule`;

    const method = props.isEditing ? "PATCH" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to save bank details");
    }

    alert(
      props.isEditing
        ? "Bank details updated successfully!"
        : "Bank details added successfully!"
    );
    emit("save-success");
  } catch (error) {
    console.error("Error saving bank details:", error);
    alert("An error occurred while saving the bank details. Please try again.");
  }
}

async function fetchBranches() {
  try {
    const resolvedTenantId = await resolveTenantId();
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/branch?filter[tenant][tenantId][_eq]=${resolvedTenantId}`,
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );
    const data = await response.json();
    branchOptions.value = data.data.map((branch) => ({
      id: branch.id,
      name: branch.branchName,
    }));
  } catch (error) {
    console.error("Error fetching branches:", error);
  }
}

async function resolveTenantId() {
  if (props.tenantId instanceof Promise) {
    return await props.tenantId;
  }
  return props.tenantId;
}

watch(
  () => props.bankData,
  (newVal) => {
    if (props.isEditing && newVal) {
      formData.employeeId = newVal.employeeId || "";
      formData.employeeName = newVal.assignedUser?.first_name || "";
      formData.bankName = newVal.assignedUser?.bankName || "";
      formData.accountNumber = newVal.assignedUser?.accountNumber || "";
      formData.IFSC = newVal.assignedUser?.IFSC || "";
      formData.UPI = newVal.assignedUser?.UPI || "";
      formData.branch = newVal.assignedBranch?.[0]?.branch_id?.id || "";
      formData.role = newVal.assignedUser?.role?.name || "";
      formData.accountStatus =
        newVal.assignedUser?.accountStatus || "unverified";
      advanceModeEnabled.value = false; // Reset to default state when editing
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await fetchBranches();
});
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.bank-form-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  width: 100%;
  max-width: 100%;
}

.form-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.form-content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.form-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  height: calc(100vh - 64px);
}

.form-section {
  margin-bottom: 24px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.has-error {
  color: rgb(var(--v-theme-error));
}

:deep(.v-list-item--active) {
  background-color: #eee;
}

:deep(.v-list-item:hover) {
  background-color: #f0f0f0;
}
</style>
