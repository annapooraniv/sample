<template>
  <div>
    <v-form ref="form">
      <v-toolbar density="compact" color="grey-lighten-4">
        <v-btn icon color="black" @click="$emit('closeAddPage')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-4">Add Access Level</v-toolbar-title>
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
                      v-model="formData.accessLevelName"
                      label="AccessLevel Name *"
                      variant="outlined"
                      :rules="[(v) => !!v || 'AccessLevel Name is required']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-autocomplete
                      v-model="formData.assignedDoors"
                      label="Assigned Doors *"
                      :items="availableDoors"
                      item-title="doorName"
                      item-value="id"
                      return-object
                      variant="outlined"
                      multiple
                      chips
                      closable-chips
                      :loading="loadingDoors"
                      :rules="[
                        (v) => !!v || 'At least one Assigned Door is required',
                      ]"
                      required
                    >
                      <template v-slot:chip="{ props, item }">
                        <v-chip
                          v-bind="props"
                          closable
                          @click:close="removeDoor(item.raw)"
                        >
                          {{ item.raw.doorName }}
                        </v-chip>
                      </template>
                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :title="item.raw.doorName"
                        ></v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-switch
                      v-model="formData.accessType"
                      label="Access Type"
                      color="black"
                      hide-details
                      inset
                      class="mr-6"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-switch
                      v-model="formData.holidays"
                      label="Holidays"
                      color="black"
                      hide-details
                      inset
                      class="mr-6"
                    ></v-switch>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-switch
                      v-model="formData._24hrs"
                      label="24 Hours"
                      color="black"
                      hide-details
                      inset
                      class="mr-6"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-switch
                      v-model="formData.workingHours"
                      label="Working Hours"
                      color="black"
                      hide-details
                      inset
                      class="mr-6"
                    ></v-switch>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="formData.maxWorkHours"
                      label="Max Work Hours"
                      type="number"
                      variant="outlined"
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
const doors = ref([]);
const loadingDoors = ref(false);
const tenantId = currentUserTenant.getTenantId();

const formData = ref({
  accessLevelName: "",
  maxWorkHours: 0,
  accessType: false,
  holidays: false,
  _24hrs: false,
  workingHours: false,
  wrkHrs: [],
  assignedDoors: [],
});

const getToken = () => {
  return localStorage.getItem("userToken");
};
const removeDoor = (door) => {
  formData.value.assignedDoors = formData.value.assignedDoors.filter(
    (d) => d.id !== door.id
  );
};

const fetchDoors = async () => {
  loadingDoors.value = true;
  const token = getToken();
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/doors?filter[tenant][tenantId][_eq]=${tenantId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) throw new Error("Failed to fetch doors");
    const data = await response.json();
    doors.value = data.data || [];
  } catch (error) {
    console.error("Error fetching doors:", error);
  } finally {
    loadingDoors.value = false;
  }
};

onMounted(() => {
  fetchDoors();
});

const availableDoors = computed(() => {
  return doors.value.filter(
    (door) =>
      !formData.value.assignedDoors.some(
        (assignedDoor) => assignedDoor.id === door.id
      )
  );
});

const generateSequentialAccessLevelId = async () => {
  try {
    const token = getToken();
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/accesslevels?filter[tenant][tenantId][_eq]=${tenantId}&sort[]=-accessLevelNumber&limit=1`,
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
const lastAccessLevel = data.data[0].accessLevelNumber;
if (!lastAccessLevel || lastAccessLevel === "NaN") {
  return "1";
}
const lastNumber = parseInt(lastAccessLevel, 10);
if (isNaN(lastNumber)) {
  return "1";
}
return (lastNumber + 1).toString();
   
  } catch (error) {
    console.error("Error generating access level ID:", error);
    return "1";
  }
};

const transformPayload = async (data) => {
  const accessLevelNumber = await generateSequentialAccessLevelId();
  return {
    tenant: { tenantId },
    accessLevelName: data.accessLevelName,
    accessLevelNumber: accessLevelNumber,
    uniqueId: `${tenantId}-${accessLevelNumber}`,
    status: "assigned",
    controllerStatus: "waiting",
    accessType: data.accessType ? 1 : 0,
    holidays: data.holidays ? 1 : 0,
    _24hrs: data._24hrs ? 1 : 0,
    maxWorkHours: data.maxWorkHours || 0,
    workingHours: data.workingHours ? 1 : 0,
    wrkHrs: data.wrkHrs && data.wrkHrs.length > 0 ? data.wrkHrs[0].id : null,
    assignedDoors: {
      create: data.assignedDoors.map((door) => ({
        accesslevels_id: "+",
        doors_id: { id: door.id },
      })),
      delete: [],
      update: [],
    },
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
      `${import.meta.env.VITE_API_URL}/items/accesslevels`,
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
      throw new Error("Failed to save access level");
    }
    const userResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/items/personalModule?filter[_and][0][assignedUser][tenant][tenantId][_eq]=${tenantId}&filter[_and][0][assignedAccessLevels][accesslevels_id][accessLevelName][_contains]=${payload.accessLevelName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch users");
    }

   
    emit("closeAddPage");
  } catch (error) {
    console.error("Error saving access level:", error);
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
