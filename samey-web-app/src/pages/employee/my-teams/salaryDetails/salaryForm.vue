<template>
  <div class="salary-form-container" :class="{ 'inline-form': true }">
    <!-- Header -->
    <div class="form-header">
      <div class="d-flex align-center justify-space-between px-4 py-3">
        <div class="d-flex align-center">
          <v-btn icon class="me-2" @click="$emit('cancel')">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h2 class="text-h6 font-weight-medium mb-0">Edit Salary</h2>
        </div>
        <div class="action-buttons">
          <v-btn color="error" variant="text" @click="$emit('cancel')"
            >CANCEL</v-btn
          >
          <v-btn color="black" class="ms-2" @click="updateSalary">UPDATE</v-btn>
        </div>
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
          >
            <template v-slot:prepend>
              <v-icon>{{ tab.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ tab.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <!-- Right Content Area -->
      <div class="form-content">
        <v-form ref="form" v-model="valid">
          <!-- Basic Info Section -->
          <div v-show="currentTab === 'basic'" class="form-section">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeeName"
                  label="Employee Name"
                  readonly
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeeId"
                  label="Employee ID"
                  readonly
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.basicPay"
                  label="Basic Pay"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
          </div>

          <!-- Earnings Section -->
          <div v-show="currentTab === 'earnings'" class="form-section">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.earnings.hra"
                  label="HRA"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.earnings.da"
                  label="DA"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.earnings.ta"
                  label="TA"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.earnings.other"
                  label="Other Allowances"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="totalEarnings"
                  label="Total Earnings"
                  readonly
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Deductions Section -->
          <div v-show="currentTab === 'deductions'" class="form-section">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeepf"
                  label="Employee PF"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeeesi"
                  label="Employee ESI"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employerpf"
                  label="Employer PF"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeresi"
                  label="Employer ESI"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.deductions.other"
                  label="Other Deductions"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="totalDeductions"
                  label="Total Deductions"
                  readonly
                  variant="outlined"
                  density="comfortable"
                  prefix="$"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { authService } from "@/services/authService";

const props = defineProps({
  salaryData: {
    type: Object,
    required: true,
  },
  tenantId: {
    type: String,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save-success", "cancel"]);

const valid = ref(false);
const form = ref(null);
const currentTab = ref("basic");

const tabs = [
  { id: "basic", title: "Basic Info", icon: "mdi-account" },
  { id: "earnings", title: "Earnings", icon: "mdi-cash-plus" },
  { id: "deductions", title: "Deductions", icon: "mdi-cash-minus" },
];

const statusOptions = ["Active", "Inactive", "On Hold"];

const formData = reactive({
  employeeName: "",
  employeeId: "",
  basicPay: 0,
  status: "",
  earnings: {
    hra: 0,
    da: 0,
    ta: 0,
    other: 0,
  },
  employeepf: 0,
  employeeesi: 0,
  employerpf: 0,
  employeresi: 0,
  deductions: {
    other: 0,
  },
});

const totalEarnings = computed(() => {
  return (
    formData.basicPay +
    formData.earnings.hra +
    formData.earnings.da +
    formData.earnings.ta +
    formData.earnings.other
  );
});

const totalDeductions = computed(() => {
  return (
    formData.employeepf +
    formData.employeeesi +
    formData.employerpf +
    formData.employeresi +
    formData.deductions.other
  );
});

onMounted(() => {
  if (props.salaryData) {
    formData.employeeName = props.salaryData.employeeName || "";
    formData.employeeId = props.salaryData.employeeId || "";
    formData.basicPay = props.salaryData.basicPay || 0;
    formData.status = props.salaryData.status || "";
    formData.earnings = props.salaryData.earnings || {
      hra: 0,
      da: 0,
      ta: 0,
      other: 0,
    };
    formData.employeepf = props.salaryData.employeepf || 0;
    formData.employeeesi = props.salaryData.employeeesi || 0;
    formData.employerpf = props.salaryData.employerpf || 0;
    formData.employeresi = props.salaryData.employeresi || 0;
    formData.deductions = props.salaryData.deductions || { other: 0 };
  }
});

const updateSalary = async () => {
  if (!form.value.validate()) return;

  try {
    const payload = {
      id: props.salaryData.id,
      basicPay: formData.basicPay,
      status: formData.status,
      earnings: formData.earnings,
      employeepf: formData.employeepf,
      employeeesi: formData.employeeesi,
      employerpf: formData.employerpf,
      employeresi: formData.employeresi,
      deductions: formData.deductions,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/salarySetting/${
        props.salaryData.id
      }`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update salary record");
    }

    alert("Salary record updated successfully!");
    emit("save-success");
  } catch (error) {
    console.error("Error updating salary:", error);
    alert("Failed to update salary record. Please try again.");
  }
};
</script>

<style scoped>
.salary-form-container {
  background: white;
  z-index: 1000;
}

.salary-form-container.inline-form {
  position: relative;
  top: auto;
  right: auto;
  bottom: auto;
  width: 100%;
  height: calc(100vh - 64px); /* Adjust based on your header height */
}

.form-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.form-content-wrapper {
  display: flex;
  height: calc(100% - 64px); /* Adjust based on your header height */
  overflow: hidden;
}

.sidebar {
  width: 240px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  background: white;
}

.form-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: white;
}

.form-section {
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

/* Scrollbar styling */
.form-content::-webkit-scrollbar,
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.form-content::-webkit-scrollbar-track,
.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.form-content::-webkit-scrollbar-thumb,
.sidebar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.form-content::-webkit-scrollbar-thumb:hover,
.sidebar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
