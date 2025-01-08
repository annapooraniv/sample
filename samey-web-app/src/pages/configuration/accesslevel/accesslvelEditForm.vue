<template>
  <div>
    <v-form ref="form">
      <v-toolbar density="compact" color="grey-lighten-4">
        <v-btn icon color="black" @click="$emit('closeEditPage')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title class="ml-4">Edit Access Level</v-toolbar-title>
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
            <h2 class="text-h6 mb-4">Edit Details</h2>

            <v-window v-model="selectedTab">
              <!-- Edit Details -->
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

const props = defineProps({
  editData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["closeEditPage"]);
const form = ref(null);
const selectedTab = ref("basic");
const doors = ref([]);
const loadingDoors = ref(false);
const tenantId = currentUserTenant.getTenantId();

// Store original form data for comparison
const originalForm = ref(null);

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

const availableDoors = computed(() => {
  return doors.value.filter(
    (door) =>
      !formData.value.assignedDoors.some(
        (assignedDoor) =>
          assignedDoor.id === door.id || assignedDoor.doors_id?.id === door.id
      )
  );
});

onMounted(async () => {
  await fetchDoors();
  if (props.editData) {
    // Store original form data for comparison
    originalForm.value = { ...props.editData };

    // Format switches to boolean
    formData.value = {
      ...props.editData,
      accessType: Boolean(props.editData.accessType),
      holidays: Boolean(props.editData.holidays),
      _24hrs: Boolean(props.editData._24hrs),
      workingHours: Boolean(props.editData.workingHours),
      // Format assigned doors
      assignedDoors: props.editData.assignedDoors || [],
    };
  }
});

const transformPayload = (form, originalForm) => {
  const payload = {};

  // Track changes
  if (form.accessType !== originalForm.accessType) {
    payload.accessType = form.accessType ? 1 : 0;
  }
  if (form._24hrs !== originalForm._24hrs) {
    payload._24hrs = form._24hrs ? 1 : 0;
  }
  if (form.maxWorkHours !== originalForm.maxWorkHours) {
    payload.maxWorkHours = form.maxWorkHours || 0;
  }

  // Handle assignedDoors changes
  const assignedDoorsChanges = {
    create: [],
    delete: [],
  };

  if (form.assignedDoors && Array.isArray(form.assignedDoors)) {
    form.assignedDoors.forEach((door) => {
      if (
        !originalForm.assignedDoors.some(
          (origDoor) =>
            origDoor.id === door.id ||
            origDoor.doors_id?.id === door.doors_id?.id
        )
      ) {
        assignedDoorsChanges.create.push({
          accesslevels_id: "+",
          doors_id: { id: door.doors_id?.id || door.id },
        });
      }
    });

    originalForm.assignedDoors.forEach((origDoor) => {
      if (
        !form.assignedDoors.some(
          (door) =>
            door.id === origDoor.id ||
            door.doors_id?.id === origDoor.doors_id?.id
        )
      ) {
        assignedDoorsChanges.delete.push(origDoor.id);
      }
    });
  }

  if (
    assignedDoorsChanges.create.length > 0 ||
    assignedDoorsChanges.delete.length > 0
  ) {
    payload.assignedDoors = assignedDoorsChanges;
  }

  return payload;
};

const handleSave = async () => {
  if (!form.value) return;

  const { valid } = await form.value.validate();
  if (!valid) {
    console.error("Form validation failed");
    return;
  }

  try {
    const payload = transformPayload(formData.value, originalForm.value);
    const token = getToken();

    // First update the access level
    console.log("Updating access level...");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/accesslevels/${formData.value.id}`,
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
      console.error("Failed to update access level");
      throw new Error("Failed to update access level");
    }

    // Fetch users with matching access level name
    console.log("Fetching users with matching access level...");
    const userResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/items/personalModule?filter[_and][0][assignedUser][tenant][tenantId][_eq]=${tenantId}&filter[_and][0][assignedAccessLevels][accesslevels_id][accessLevelName][_contains]=${payload.accessLevelName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!userResponse.ok) {
      console.error("Failed to fetch users");
      throw new Error("Failed to fetch users");
    }

    const userData = await userResponse.json();
    console.log("Found users to update:", userData.data);

    if (userData.data && userData.data.length > 0) {
      // Update each user's accessOn status
      console.log("Updating users' access status...");
      const updatePromises = userData.data.map(async user => {
        try {
          const updateResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/items/personalModule/${user.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                accessOn: payload.accessType ? 1 : 0,
              }),
            }
          );

          if (!updateResponse.ok) {
            throw new Error(`Failed to update user ${user.id}`);
          }
          return updateResponse;
        } catch (error) {
          console.error(`Error updating user ${user.id}:`, error);
          throw error;
        }
      });

      await Promise.all(updatePromises);
    } else {
      console.log("No users found to update");
    }

    emit("closeEditPage");
  } catch (error) {
    console.error("Error in handleSave:", error);
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
.content-wrapper {
  display: flex;
  flex-direction: row;
}
.side-nav {
  width: 250px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
}
.content-area {
  flex: 1;
}
</style>
