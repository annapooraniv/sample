# Department Add Form
<template>
  <div>
    <v-form ref="form">
      <v-toolbar density="compact" color="grey-lighten-4">
        <v-btn icon color="black" @click="$emit('closeAddPage')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-4">Generate Report</v-toolbar-title>
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
  <v-select
    v-model="formData.collectionName"
    label="Collection Name *"
    :items="['LeaveReport', 'AbsentReport', 'PresentReport']"
    variant="outlined"
    :rules="[(v) => !!v || 'Collection Name is required']"
    required
  ></v-select>
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
                  <v-col cols="12" sm="6">
  <v-text-field
    v-model="formData.startDate"
    label="Start Date *"
    type="date"
    variant="outlined"
    :rules="[(v) => !!v || 'Start Date is required']"
    required
  ></v-text-field>
</v-col>

<v-col cols="12" sm="6">
  <v-text-field
    v-model="formData.endDate"
    label="End Date *"
    type="date"
    variant="outlined"
    :rules="[(v) => !!v || 'End Date is required']"
    required
  ></v-text-field>
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
  collectionName: "",
  branch: null,
  startDate: "",
  endDate: ""
});

const getToken = () => {
  return localStorage.getItem("userToken");
};

const fetchBranches = async () => {
  loadingBranches.value = true;
  const token = getToken();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/branch?filter[tenant][tenantId][_eq]=${tenantId}`,
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
const attendanceMapping = {
  LeaveReport: "leave",
  AbsentReport: "absent",
  PresentReport: "present",
};

const fetchAttendanceData = async () => {
  const token = getToken();

  try {
    // Debug: Log the entire formData to check its structure
    console.log("FormData Value:", formData.value);

    // Check and log the value of branch
    const branchValue = formData.value.branch;
    console.log("Original Branch Value:", branchValue);

    // Debug: Check the type of branchValue
    console.log("Type of Branch Value:", typeof branchValue);

    // Ensure branchValue is a string before calling .trim()
    const branch = typeof branchValue === "string" ? branchValue.trim() : branchValue;

    console.log("Trimmed Branch Value (if string):", branch);

    // Map the collectionName to the expected attendance value
    const expectedAttendance = attendanceMapping[formData.value.collectionName];
    if (!expectedAttendance) {
      console.error(
        "Invalid collection name provided:",
        formData.value.collectionName
      );
      return;
    }

    // Construct the API URL with query parameters
    const apiUrl = new URL(`${import.meta.env.VITE_API_URL}/items/attendance`);
    apiUrl.searchParams.append(
      "filter[_and][0][date][_between][0]",
      formData.value.startDate
    );
    apiUrl.searchParams.append(
      "filter[_and][0][date][_between][1]",
      formData.value.endDate
    );
    apiUrl.searchParams.append(
      "filter[_and][1][attendance][_eq]",
      expectedAttendance
    );
    apiUrl.searchParams.append(
      "filter[_and][2][employeeId][assignedBranch][branch_id][_eq]",
      branch
    );

    console.log("Constructed API URL:", apiUrl.toString());

    // Make the API request
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed to fetch attendance data");
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    // Process the data (if any)
    const filteredData = data.data;
    if (filteredData.length > 0) {
        const processedData = filteredData.map((record) => ({
  employeeId: record.employeeId?.employeeId || 'N/A',
  branchName: record.employeeId?.assignedBranch?.branch_id?.branchName || 'N/A',
  status: record.status || 'N/A',
  date: record.date,
  attendance: record.attendance,
  id: record.id,
  mode: record.mode || 'N/A',
  tenant: record.tenant?.tenantId || 'N/A',
  tenantName: record.tenant?.tenantName || 'N/A',
  inTime: record.inTime || 'N/A',
  outTime: record.outTime || 'N/A',
  dateCreated: record.date_created,
  onTime: record.onTime || 'N/A',
  overTime: record.overTime || 'N/A',
  lateBy: record.lateBy || 'N/A',
  workHours: record.workHours || 'N/A',
  breakTime: record.breakTime || 'N/A'
}));

      console.log("Processed Data for Download:", processedData);

      // Convert to CSV and download
      downloadCSV(processedData);
    } else {
      console.log("No matching records found");
    }
  } catch (error) {
    console.error("Error fetching attendance data:", error);
  }
};





const downloadCSV = (data) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => row[header]).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', `attendance_report_${formData.value.startDate}_${formData.value.endDate}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const handleSave = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();
  if (!valid) {
    console.error("Form validation failed");
    return;
  }

  await fetchAttendanceData();
  
  // Make POST call to export endpoint
  const token = getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/items/export`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate: formData.value.startDate,
        endDate: formData.value.endDate,
        collectionName: formData.value.collectionName,
        status: "Requested",
        tenant: { tenantId },
        branch: formData.value.branch ? formData.value.branch : null
      })
    });

    if (response.ok) {
      alert('Report generated and exported successfully!');
    } else {
      throw new Error('Export failed');
    }
  } catch (error) {
    console.error('Error exporting report:', error);
    alert('Failed to export report. Please try again.');
  }
};



onMounted(() => {
  fetchBranches();
});

const availableBranches = computed(() => branches.value);

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
