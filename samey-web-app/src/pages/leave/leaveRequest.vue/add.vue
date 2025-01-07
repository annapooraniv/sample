<template>
    <div>
      <v-form ref="form">
        <v-toolbar density="compact" color="grey-lighten-4">
          <v-btn icon color="black" @click="$emit('closeAddPage')">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title class="ml-4">Add Leave</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" class="mr-2" @click="$emit('closeAddPage')">CANCEL</v-btn>
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
              <h2 class="text-h6 mb-4">Leave Details</h2>
              
              <v-window v-model="selectedTab">
                <!-- Basic Details -->
                <v-window-item value="basic">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-date-picker
                        v-model="formData.from"
                        label="Leave Start *"
                        variant="outlined"
                        :rules="[(v) => !!v || 'Start date is required']"
                        required
                      ></v-date-picker>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-date-picker
                        v-model="formData.to"
                        label="Leave End *"
                        variant="outlined"
                        :rules="[(v) => !!v || 'End date is required']"
                        required
                      ></v-date-picker>
                    </v-col>
                  </v-row>
  
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="formData.leaveType"
                        label="Leave Type *"
                        :items="leaveTypes"
                        item-title="name"
                        item-value="name"
                        variant="outlined"
                        :rules="[(v) => !!v || 'Leave type is required']"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-switch
                        v-model="formData.halfDay"
                        label="Half Day"
                        color="black"
                        hide-details
                        inset
                      ></v-switch>
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
  import { ref } from 'vue'
  import { currentUserTenant } from '@/utils/currentUserTenant'
  
  const emit = defineEmits(['closeAddPage'])
  const form = ref(null)
  const selectedTab = ref('basic')
  const tenantId = currentUserTenant.getTenantId()
  
  const formData = ref({
    from: null,
    to: null,
    leaveType: null,
    halfDay: false,
  })
  
  const leaveTypes = [
    { name: "sickLeave" },
    { name: "casualLeave" },
    { name: "privilegedLeave" },
    { name: "paid" },
    { name: "unpaid" },
    { name: "weekOff" },
  ]
  
  const getToken = () => {
    return localStorage.getItem("userToken")
  }
  
 // Updated function to get both personal module and branch data
 async function fetchPersonalModuleId() {
    const userDetails = await currentUserTenant.fetchLoginUserDetails();
    const userId = userDetails.id;
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Fetch data by filtering based on userId
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/personalModule?filter[_and][0][assignedUser][id][_eq]=${userId}&fields[]=assignedBranch.branch_id.branchId&fields[]=id`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format from server');
    }

    const data = await response.json();

    // Extract personalModuleId and assigned branch IDs
const personalModuleId = data.data?.[0]?.id || null;
const assignedBranchIds = Array.isArray(data.data?.[0]?.assignedBranch) && data.data[0].assignedBranch.length > 0
  ? data.data[0].assignedBranch.map(branch => branch.branch_id?.branchId).filter(Boolean)
  : []; // Handle empty or undefined assignedBranch array


    return { personalModuleId, assignedBranchIds };
  } catch (error) {
    console.error('Error fetching personal module:', error);
    return null;
  }
}


const transformPayload = async (data) => {
  const userData = await fetchPersonalModuleId();
  
  return {
    tenant: { tenantId },
    fromDate: data.from ,
    toDate: data.to ,
    leaveType: data.leaveType,
    halfDay: data.halfDay,
    status: "pending",
    requestedBy:userData.personalModuleId
   
   
  }
}
  
  const handleSave = async () => {
    if (!form.value) return
  
    const { valid } = await form.value.validate()
    if (!valid) {
      console.error('Form validation failed')
      return
    }
  
    try {
      const payload = await transformPayload(formData.value)
      const token = getToken()
      
      const response = await fetch('https://access.sensenservice.com/items/leaveRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })
  
      if (!response.ok) {
        throw new Error('Failed to save leave request')
      }
  
      emit('closeAddPage')
    } catch (error) {
      console.error('Error saving leave request:', error)
    }
  }
  
  const menuItems = [
    { 
      title: 'Basic Details',
      icon: 'mdi-card-text-outline',
      value: 'basic'
    }
  ]
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