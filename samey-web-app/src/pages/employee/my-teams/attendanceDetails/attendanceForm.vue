<template>
  <div class="attendance-form-container" :class="{ 'inline-form': true }">
    <!-- Header -->
    <div class="form-header">
      <div class="d-flex align-center justify-space-between px-4 py-3">
        <div class="d-flex align-center">
          <v-btn icon class="me-2" @click="$emit('cancel')">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h2 class="text-h6 font-weight-medium mb-0">Edit Attendance</h2>
        </div>
        <div class="action-buttons">
          <v-btn color="error" variant="text" @click="$emit('cancel')"
            >CANCEL</v-btn
          >
          <v-btn color="black" class="ms-2" @click="updateAttendance"
            >UPDATE</v-btn
          >
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
                  v-model="formData.date"
                  label="Date"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.shift"
                  :items="shiftOptions"
                  label="Shift *"
                  required
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
          </div>

          <!-- Time Details Section -->
          <div v-show="currentTab === 'time'" class="form-section">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.checkIn"
                  label="Check In"
                  type="time"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.checkOut"
                  label="Check Out"
                  type="time"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.breakStart"
                  label="Break Start"
                  type="time"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.breakEnd"
                  label="Break End"
                  type="time"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.overtimeHours"
                  label="Overtime Hours"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.workHours"
                  label="Work Hours"
                  readonly
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Status Section -->
          <div v-show="currentTab === 'status'" class="form-section">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.leaveType"
                  :items="leaveTypeOptions"
                  label="Leave Type"
                  variant="outlined"
                  density="comfortable"
                  :disabled="formData.status !== 'On Leave'"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.mode"
                  :items="modeOptions"
                  label="Mode"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.attendance"
                  :items="attendanceOptions"
                  label="Attendance"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.onTime"
                  label="On Time"
                  readonly
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.lateBy"
                  label="Late By"
                  readonly
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="formData.remarks"
                  label="Remarks"
                  variant="outlined"
                  density="comfortable"
                ></v-textarea>
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
  attendanceData: {
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
  { id: "time", title: "Time Details", icon: "mdi-clock" },
  { id: "status", title: "Status", icon: "mdi-clipboard-check" },
];

const shiftOptions = ["Morning", "Evening", "Night"];
const statusOptions = ["Present", "Absent", "Late", "On Leave"];
const leaveTypeOptions = ["Sick Leave", "Casual Leave", "Annual Leave"];
const modeOptions = ["Remote", "Office", "Hybrid"];
const attendanceOptions = ["Full Day", "Half Day"];

const formData = reactive({
  employeeName: "",
  employeeId: "",
  date: "",
  shift: "",
  checkIn: "",
  checkOut: "",
  breakStart: "",
  breakEnd: "",
  overtimeHours: 0,
  status: "",
  leaveType: "",
  remarks: "",
  workHours: "",
  mode: "",
  attendance: "",
  onTime: "",
  lateBy: "",
});

const computedWorkHours = computed(() => {
  // Add your work hours calculation logic here
  return "8:00"; // Placeholder value
});

onMounted(() => {
  if (props.attendanceData) {
    formData.employeeName = props.attendanceData.employeeId?.employeeName || "";
    formData.employeeId = props.attendanceData.employeeId?.employeeId || "";
    formData.date = props.attendanceData.date || "";
    formData.shift = props.attendanceData.shift || "";
    formData.checkIn = props.attendanceData.inTime || "";
    formData.checkOut = props.attendanceData.outTime || "";
    formData.breakStart = props.attendanceData.breakStart || "";
    formData.breakEnd = props.attendanceData.breakEnd || "";
    formData.overtimeHours = props.attendanceData.overTime || 0;
    formData.status = props.attendanceData.status || "";
    formData.leaveType = props.attendanceData.leaveType || "";
    formData.remarks = props.attendanceData.remarks || "";
    formData.workHours = props.attendanceData.workHours || "";
    formData.mode = props.attendanceData.mode || "";
    formData.attendance = props.attendanceData.attendance || "";
    formData.onTime = props.attendanceData.onTime || "";
    formData.lateBy = props.attendanceData.lateBy || "";
  }
});

const updateAttendance = async () => {
  if (!form.value.validate()) return;

  try {
    const payload = {
      id: props.attendanceData.id,
      shift: formData.shift,
      inTime: formData.checkIn,
      outTime: formData.checkOut,
      breakStart: formData.breakStart || null,
      breakEnd: formData.breakEnd || null,
      overTime: formData.overtimeHours,
      status: formData.status,
      leaveType: formData.status === "On Leave" ? formData.leaveType : null,
      remarks: formData.remarks,
      workHours: computedWorkHours.value,
      mode: formData.mode,
      attendance: formData.attendance,
      onTime: formData.onTime,
      lateBy: formData.lateBy,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/attendance/${
        props.attendanceData.id
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
      throw new Error("Failed to update attendance record");
    }

    alert("Attendance record updated successfully!");
    emit("save-success");
  } catch (error) {
    console.error("Error updating attendance:", error);
    alert("Failed to update attendance record. Please try again.");
  }
};
</script>

<style scoped>
.attendance-form-container {
  background: white;
  z-index: 1000;
}

.attendance-form-container.inline-form {
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
