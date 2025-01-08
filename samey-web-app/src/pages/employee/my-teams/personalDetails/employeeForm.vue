<template>
  <div class="employee-form-container">
    <!-- Header -->
    <div class="form-header">
      <div class="header-content">
        <v-btn icon variant="text" @click="$emit('cancel')" class="back-button">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h2 class="text-h6">
          {{ isEditing ? "Edit Employee" : "Add Employee" }}
        </h2>
      </div>
      <div class="action-buttons">
        <v-btn color="error" variant="text" @click="$emit('cancel')"
          >CANCEL</v-btn
        >
        <v-btn color="black" @click="saveEmployee">SAVE</v-btn>
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

      <!-- Right Content Area -->
      <div class="form-content">
        <v-form ref="form" v-model="valid" @submit.prevent="saveEmployee">
          <!-- Personal Details Section -->
          <div v-show="currentTab === 'personal'" class="form-section">
            <v-row>
              <!-- Avatar Input -->
              <v-col cols="12" md="6">
                <v-file-input
                  v-model="formData.avatarFile"
                  label="Avatar"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="handleAvatarChange"
                  :error-messages="avatarError"
                  :show-size="false"
                ></v-file-input>
              </v-col>

              <!-- First Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.firstName"
                  label="First Name *"
                  required
                  :error-messages="getFieldErrorMessage('firstName')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('firstName')"
                ></v-text-field>
              </v-col>

              <!-- Phone -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.phone"
                  label="Phone *"
                  required
                  :error-messages="getFieldErrorMessage('phone')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('phone')"
                ></v-text-field>
              </v-col>

              <!-- Email -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.email"
                  label="Email *"
                  required
                  :error-messages="getFieldErrorMessage('email')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('email')"
                ></v-text-field>
              </v-col>

              <!-- Office Email -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.officeEmail"
                  label="Office Email *"
                  required
                  :error-messages="getFieldErrorMessage('officeEmail')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('officeEmail')"
                ></v-text-field>
              </v-col>

              <!-- Gender -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.gender"
                  :items="['Female', 'Male', 'Other']"
                  label="Gender"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>

              <!-- Date of Birth -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <!-- Marital Status -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.maritalStatus"
                  :items="['Single', 'Married', 'Divorced', 'Widowed']"
                  label="Marital Status"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>

              <!-- Blood Group -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.bloodGroup"
                  :items="['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']"
                  label="Blood Group"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>
            </v-row>
          </div>

          <!-- Government IDs Section -->
          <div v-show="currentTab === 'government'" class="form-section">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.pan"
                  label="PAN *"
                  required
                  :error-messages="getFieldErrorMessage('pan')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('pan')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.aadhar"
                  label="Aadhar *"
                  required
                  :error-messages="getFieldErrorMessage('aadhar')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('aadhar')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.gst"
                  label="GST"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>
            </v-row>
          </div>

          <!-- Company Details Section -->
          <div v-show="currentTab === 'company'" class="form-section">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.employeeId"
                  label="Employee ID *"
                  required
                  :error-messages="getFieldErrorMessage('employeeId')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('employeeId')"
                ></v-text-field>
              </v-col>

              <!-- Department -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.department"
                  :items="departmentOptions"
                  item-title="name"
                  item-value="name"
                  label="Department"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>

              <!-- Branch -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.branch"
                  :items="branchOptions"
                  item-title="name"
                  item-value="name"
                  label="Branch"
                  variant="outlined"
                  density="comfortable"
                ></v-select>
              </v-col>

              <!-- Role -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.role"
                  :items="roleOptions"
                  item-title="name"
                  item-value="name"
                  label="Role *"
                  required
                  :error-messages="getFieldErrorMessage('role')"
                  variant="outlined"
                  density="comfortable"
                  @blur="markFieldAsTouched('role')"
                ></v-select>
              </v-col>

              <!-- Access Level -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.accessLevel"
                  :items="accessLevelOptions"
                  label="Access Level"
                  variant="outlined"
                  density="comfortable"
                  item-title="accessLevelName"
                  item-value="accessLevelName"
                >
                  <template v-slot:item="{ item, props }">
                    <v-list-item
                      v-bind="props"
                      :disabled="!item.raw.accessType"
                    >
                      <template v-slot:append>
                        <span v-if="!item.raw.accessType" class="text-error"
                          >(Disabled)</span
                        >
                        <span v-else class="text-success">(Enabled)</span>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <!-- Date of Joining -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.dateOfJoining"
                  label="Date of Joining"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <!-- Date of Leaving -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.dateOfLeaving"
                  label="Date of Leaving"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                ></v-text-field>
              </v-col>

              <!-- Access On/Off Switch -->
              <v-col cols="12" md="6">
                <v-switch
                  color="black"
                  v-model="formData.accessOn"
                  :label="`Access: ${formData.accessOn ? 'On' : 'Off'}`"
                ></v-switch>
              </v-col>
            </v-row>
          </div>

          <!-- Access Management Section -->
          <div v-show="currentTab === 'access'" class="form-section">
            <v-col cols="12" v-if="!formData.accessOn">
              <div
                class="bg-light-blue-lighten-5 pa-4 rounded d-flex align-center"
              >
                <v-icon color="blue" class="mr-2">mdi-information</v-icon>
                <span class="text-blue"
                  >To assign cards, please enable access in the Company Details
                  section.</span
                >
              </div>
            </v-col>
            <v-row>
              <v-col cols="12">
                <div
                  class="card-assignment-container"
                  :class="{ disabled: !formData.accessOn }"
                >
                  <div class="input-group">
                    <v-text-field
                      v-model="cardInput"
                      label="Swipe card to enter"
                      :readonly="true"
                      variant="outlined"
                      density="comfortable"
                      class="swipe-input"
                      @focus="handleCardFocus"
                      :disabled="!formData.accessOn"
                    ></v-text-field>

                    <v-select
                      v-model="selectedCardType"
                      :items="['rfid', 'tag']"
                      variant="outlined"
                      density="comfortable"
                      class="type-select"
                      :disabled="!formData.accessOn"
                    ></v-select>

                    <v-btn
                      style="background-color: black"
                      color="white"
                      @click="addNewCard"
                      :disabled="!cardInput || !formData.accessOn"
                      class="create-btn"
                    >
                      Create New
                    </v-btn>
                  </div>

                  <div class="assigned-cards-list">
                    <div
                      v-for="card in assignedCards"
                      :key="card.id"
                      class="card-item"
                    >
                      <span class="card-number"
                        >{{ card.rfidCard }} ({{ card.type }})</span
                      >
                      <div class="card-actions">
                        <v-switch
                          v-model="card.enabled"
                          :disabled="!formData.accessOn"
                          :color="formData.accessOn ? 'black' : 'grey'"
                          density="compact"
                          class="ma-0 pa-0"
                        ></v-switch>
                        <v-btn
                          icon
                          variant="text"
                          color="error"
                          @click="removeCard(card.id)"
                          class="remove-btn"
                          :disabled="!formData.accessOn"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/services/authService";
import { convertToCardAccessHex } from "@/utils/helpers/convertToCardAccessHex";

const props = defineProps({
  isEditing: Boolean,
  employeeData: Object,
  tenantId: String,
});

const emit = defineEmits(["save-success", "cancel"]);

// Initialize other reactive references
const router = useRouter();
const currentTab = ref("personal");
const avatarError = ref("");
const currentAvatarId = ref(null);
const cardInput = ref("");
const selectedCardType = ref("rfid");
const formSubmitAttempted = ref(false);
const assignedCards = ref([]);
const formErrors = ref({});
const touchedFields = ref({});
const form = ref(null);
const valid = ref(false);
let cardListener = null;

const tabs = [
  { id: "personal", title: "Personal Details", icon: "mdi-account" },
  {
    id: "government",
    title: "Government IDs",
    icon: "mdi-card-account-details",
  },
  { id: "company", title: "Company Details", icon: "mdi-domain" },
  { id: "access", title: "Access Management", icon: "mdi-key" },
];

const tabRequiredFields = {
  personal: ["firstName", "phone", "email", "officeEmail"],
  government: ["pan", "aadhar"],
  company: ["employeeId", "role"],
  access: [],
};
// Initialize form data with empty values
const formData = reactive({
  avatar: null,
  avatarFile: null,
  firstName: "",
  phone: "",
  email: "",
  officeEmail: "",
  gender: "",
  dateOfBirth: "",
  maritalStatus: "",
  bloodGroup: "",
  status: "active",
  pan: "",
  aadhar: "",
  gst: "",
  employeeId: "",
  department: "",
  branch: "",
  role: "",
  accessLevel: "",
  tenantName: "",
  dateOfJoining: "",
  dateOfLeaving: "",
  accessOn: true,
});

const departmentOptions = ref([]);
const branchOptions = ref([]);
const accessLevelOptions = ref([]);
const roleOptions = ref([]);

const userTenant = computed(() => {
  return authService.getUserTenant();
});

const tabHasError = (tabId) => {
  if (!formSubmitAttempted.value) return false;
  const requiredFields = tabRequiredFields[tabId];
  return requiredFields.some((field) => !formData[field]);
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

function handleCardFocus() {
  cardListener = window.addEventListener("keypress", handleCardSwipe);
}

function handleCardSwipe(event) {
  if (event.keyCode === 13) {
    window.removeEventListener("keypress", handleCardSwipe);
    processCardData(cardInput.value);
  } else {
    cardInput.value += event.key;
  }
}

function processCardData(cardData) {
  const existingCard = assignedCards.value.find(
    (card) => card.rfidCard === cardData
  );
  if (existingCard) {
    alert("This card is already assigned");
    cardInput.value = "";
    return;
  }
}

function addNewCard() {
  if (!cardInput.value) return;

  const cardEnabled = formData.accessOn;

  assignedCards.value.push({
    id: Date.now(),
    rfidCard: cardInput.value,
    type: selectedCardType.value,
    enabled: cardEnabled,
  });

  cardInput.value = "";
}

function removeCard(cardId) {
  assignedCards.value = assignedCards.value.filter(
    (card) => card.id !== cardId
  );
}

async function fetchDepartments() {
  try {
    const resolvedTenantId = await resolveTenantId();
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/department?filter[tenant][tenantId][_eq]=${resolvedTenantId}`,
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );
    const data = await response.json();
    departmentOptions.value = data.data.map((dept) => ({
      id: dept.id,
      name: dept.departmentName,
    }));
  } catch (error) {
    console.error("Error fetching departments:", error);
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

async function fetchAccessLevels() {
  try {
    const resolvedTenantId = await resolveTenantId();
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/items/accesslevels?filter[tenant][tenantId][_eq]=${resolvedTenantId}`,
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );
    const data = await response.json();
    accessLevelOptions.value = data.data.map((level) => ({
      id: level.id,
      accessLevelName: level.accessLevelName,
      accessLevelNumber: level.accessLevelNumber,
      accessType: level.accessType,
      name: level.accessLevelName,
      label: level.accessLevelName,
    }));
  } catch (error) {
    console.error("Error fetching access levels:", error);
  }
}

async function fetchRoles() {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/roles?filter[name][_neq]=Administrator&filter[_and][1][name][_neq]=esslAdmin`,
      {
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );
    const data = await response.json();
    roleOptions.value = data.data.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
}

async function resolveTenantId() {
  if (props.tenantId instanceof Promise) {
    return await props.tenantId;
  }
  return props.tenantId;
}

const markFieldAsTouched = (field) => {
  touchedFields.value[field] = true;
  if (!formData[field] && tabRequiredFields[currentTab.value].includes(field)) {
    formErrors.value[field] = "This field is required";
  }
};
async function handleAvatarChange(file) {
  try {
    if (file) {
      // If there's a current avatar, delete it first
      if (currentAvatarId.value) {
        await deleteAvatar(currentAvatarId.value);
      }

      // Upload new avatar and get its ID
      const fileId = await handleAvatarUpload(file);
      currentAvatarId.value = fileId;
      formData.avatar = fileId; // Store just the ID in the form data
      avatarError.value = "";
    } else {
      // If file is cleared, delete the current avatar if it exists
      if (currentAvatarId.value) {
        await deleteAvatar(currentAvatarId.value);
        currentAvatarId.value = null;
        formData.avatar = null;
      }
    }
  } catch (error) {
    avatarError.value = "Failed to process avatar. Please try again.";
    console.error("Avatar handling error:", error);
  }
}
async function saveEmployee() {
  if (props.isEditing) {
    await editEmployee();
  } else {
    await createNewEmployee();
  }
}

async function createNewEmployee() {
  formSubmitAttempted.value = true;
  const mandatoryFields = [
    "firstName",
    "email",
    "phone",
    "role",
    "employeeId",
    "pan",
    "aadhar",
  ];
  let hasErrors = false;

  mandatoryFields.forEach((field) => {
    if (!formData[field]) {
      hasErrors = true;
      formErrors.value[field] = "This field is required";
      touchedFields.value[field] = true;
    }
  });

  if (hasErrors) {
    alert("Please fill in all required fields before saving");
    return;
  }

  try {
    const resolvedTenantId = await resolveTenantId();

    const selectedDepartment = departmentOptions.value.find(
      (dept) => dept.name === formData.department
    );
    const selectedBranch = branchOptions.value.find(
      (branch) => branch.name === formData.branch
    );
    const selectedRole = roleOptions.value.find(
      (role) => role.name === formData.role
    );
    const selectedAccessLevel = accessLevelOptions.value.find(
      (level) => level.name === formData.accessLevel
    );
    const accessLevelNumber = selectedAccessLevel?.accessLevelNumber || 0;

    const payload = {
      status: formData.status,
      employeeId: formData.employeeId,
      accessOn: formData.accessOn,
      uniqueId: `${resolvedTenantId}-${formData.employeeId}`,
      assignedBranch: {
        create: [
          {
            personalModule_id: "+",
            branch_id: { id: selectedBranch?.id },
          },
        ],
        update: [],
        delete: [],
      },
      assignedDepartment: {
        create: [
          {
            personalModule_id: "+",
            department_id: { id: selectedDepartment?.id },
          },
        ],
        update: [],
        delete: [],
      },
      assignedAccessLevels: {
        create: [
          {
            personalModule_id: "+",
            accesslevels_id: { id: selectedAccessLevel?.id },
          },
        ],
        update: [],
        delete: [],
      },
      assignedCards: {
        create: assignedCards.value.map((card) => ({
          cardManagement_id: {
            rfidCard: card.rfidCard,
            type: card.type.toLowerCase(),
            enabled: card.enabled,
            tenant: resolvedTenantId,
            accessLevelsId: accessLevelNumber,
            cardAccess: card.enabled,
            cardAccessLevelArray: `${card.rfidCard}:${
              card.enabled ? 1 : 0
            }:${accessLevelNumber}`,
            cardAccessLevelHex: convertToCardAccessHex(
              card.rfidCard,
              card.enabled,
              accessLevelNumber
            ),
          },
        })),
        update: [],
        delete: [],
      },
      assignedUser: {
        first_name: formData.firstName,
        email: formData.email,
        phone: formData.phone,
        password: formData.email,
        avatar: currentAvatarId.value,
        role: selectedRole?.id,
        tenant: resolvedTenantId,
        officeEmail: formData.officeEmail,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        maritalStatus: formData.maritalStatus,
        bloodGroup: formData.bloodGroup,
        pan: formData.pan,
        aadhar: formData.aadhar,
        gst: formData.gst,
      },
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/personalModule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save employee data");
    }

    alert("Employee added successfully!");
    emit("save-success");
  } catch (error) {
    console.error("Error saving employee data:", error);
    alert(
      "An error occurred while saving the employee data. Please try again."
    );
  }
}

async function editEmployee() {
  formSubmitAttempted.value = true;
  const mandatoryFields = [
    "firstName",
    "email",
    "phone",
    "role",
    "employeeId",
    "pan",
    "aadhar",
  ];
  let hasErrors = false;

  mandatoryFields.forEach((field) => {
    if (!formData[field]) {
      hasErrors = true;
      formErrors.value[field] = "This field is required";
      touchedFields.value[field] = true;
    }
  });

  if (hasErrors) {
    alert("Please fill in all required fields before saving");
    return;
  }

  try {
    const resolvedTenantId = await resolveTenantId();

    // Get all selected options
    const selectedDepartment = departmentOptions.value.find(
      (dept) => dept.name === formData.department
    );
    const selectedBranch = branchOptions.value.find(
      (branch) => branch.name === formData.branch
    );
    const selectedRole = roleOptions.value.find(
      (role) => role.name === formData.role
    );
    const selectedAccessLevel = accessLevelOptions.value.find(
      (level) => level.name === formData.accessLevel
    );
    const accessLevelNumber = selectedAccessLevel?.accessLevelNumber || 0;

    // Initialize payload with basic data
    const payload = {
      status: formData.status,
      employeeId: formData.employeeId,
      accessOn: formData.accessOn,
    };

    // Handle card operations - can use create, update, and delete
    const cardChanges = {
      create: [],
      update: [],
      delete: [],
    };

    // Process each current card
    assignedCards.value.forEach((card) => {
      const existingCard = props.employeeData?.assignedCards?.find(
        (ec) => ec.cardManagement_id.rfidCard === card.rfidCard
      );

      if (existingCard) {
        // Card exists - check if it needs updating
        if (
          existingCard.cardManagement_id.cardAccess !== card.enabled ||
          existingCard.cardManagement_id.type !== card.type
        ) {
          cardChanges.update.push({
            id: existingCard.id,
            cardManagement_id: {
              rfidCard: card.rfidCard,
              type: card.type.toLowerCase(),
              cardAccess: card.enabled,
              accessLevelsId: accessLevelNumber,
              cardAccessLevelArray: `${card.rfidCard}:${
                card.enabled ? 1 : 0
              }:${accessLevelNumber}`,
              cardAccessLevelHex: convertToCardAccessHex(
                card.rfidCard,
                card.enabled,
                accessLevelNumber
              ),
            },
          });
        }
      } else {
        // New card - create it
        cardChanges.create.push({
          cardManagement_id: {
            rfidCard: card.rfidCard,
            type: card.type.toLowerCase(),
            cardAccess: card.enabled,
            tenant: resolvedTenantId,
            accessLevelsId: accessLevelNumber,
            cardAccessLevelArray: `${card.rfidCard}:${
              card.enabled ? 1 : 0
            }:${accessLevelNumber}`,
            cardAccessLevelHex: convertToCardAccessHex(
              card.rfidCard,
              card.enabled,
              accessLevelNumber
            ),
          },
        });
      }
    });

    // Find deleted cards
    props.employeeData?.assignedCards?.forEach((existingCard) => {
      if (
        !assignedCards.value.find(
          (c) => c.rfidCard === existingCard.cardManagement_id.rfidCard
        )
      ) {
        cardChanges.delete.push(existingCard.id);
      }
    });

    payload.assignedCards = cardChanges;

    // Handle Branch - only create and delete
    if (
      selectedBranch?.id !== props.employeeData?.assignedBranch?.branch_id?.id
    ) {
      payload.assignedBranch = {
        create: [
          {
            personalModule_id: props.employeeData.id,
            branch_id: { id: selectedBranch?.id },
          },
        ],
        delete: props.employeeData?.assignedBranch?.id
          ? [props.employeeData.assignedBranch.id]
          : [],
        update: [],
      };
    }

    // Handle Department - only create and delete
    if (
      selectedDepartment?.id !==
      props.employeeData?.assignedDepartment?.department_id?.id
    ) {
      payload.assignedDepartment = {
        create: [
          {
            personalModule_id: props.employeeData.id,
            department_id: { id: selectedDepartment?.id },
          },
        ],
        delete: props.employeeData?.assignedDepartment?.id
          ? [props.employeeData.assignedDepartment.id]
          : [],
        update: [],
      };
    }

    // Handle Access Levels - only create and delete
    if (
      selectedAccessLevel?.id !==
      props.employeeData?.assignedAccessLevels?.accesslevels_id?.id
    ) {
      payload.assignedAccessLevels = {
        create: [
          {
            personalModule_id: props.employeeData.id,
            accesslevels_id: { id: selectedAccessLevel?.id },
          },
        ],
        delete: props.employeeData?.assignedAccessLevels?.id
          ? [props.employeeData.assignedAccessLevels.id]
          : [],
        update: [],
      };
    }

    // Handle User data changes
    const userChanges = {};
    const userFields = [
      "first_name",
      "email",
      "phone",
      "avatar",
      "role",
      "officeEmail",
      "gender",
      "dateOfBirth",
      "maritalStatus",
      "bloodGroup",
      "pan",
      "aadhar",
      "gst",
      "dateOfJoining",
      "dateOfLeaving",
    ];

    userFields.forEach((field) => {
      // Skip officeEmail if it hasn't changed
      if (
        field === "officeEmail" &&
        formData[field] === props.employeeData?.assignedUser?.[field]
      ) {
        return;
      }

      const formValue =
        field === "first_name"
          ? formData.firstName
          : field === "avatar"
          ? currentAvatarId.value
          : field === "role"
          ? selectedRole?.id
          : formData[field];

      const existingValue = props.employeeData?.assignedUser?.[field];

      if (formValue !== existingValue) {
        userChanges[field] = formValue;
      }
    });

    if (Object.keys(userChanges).length > 0) {
      if (userChanges.dateOfLeaving === "") delete userChanges.dateOfLeaving;
      if (userChanges.dateOfJoining === "") delete userChanges.dateOfJoining;
      if (userChanges.dateOfBirth === "") delete userChanges.dateOfBirth;

      payload.assignedUser = {
        ...userChanges,
        id: props.employeeData.assignedUser.id,
      };
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/items/personalModule/${
        props.employeeData.id
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
      throw new Error("Failed to update employee data");
    }

    alert("Employee updated successfully!");
    emit("save-success");
  } catch (error) {
    console.error("Error updating employee data:", error);
    alert(
      "An error occurred while updating the employee data. Please try again."
    );
  }
}
async function handleAvatarUpload(file) {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("file", file);

    // Upload file to the files endpoint
    const uploadResponse = await fetch(
      `${import.meta.env.VITE_API_URL}/files`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload avatar");
    }

    // Get the file data from the response
    const uploadData = await uploadResponse.json();
    const fileId = uploadData.data.id;

    if (!fileId) {
      throw new Error("File ID not received from server");
    }

    // Fetch file details
    const fileResponse = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/files/${fileId}?fields[]=id&fields[]=type&fields[]=title`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!fileResponse.ok) {
      throw new Error("Failed to verify file upload");
    }

    const fileData = await fileResponse.json();
    return fileId;
  } catch (error) {
    console.error("Error handling avatar upload:", error);
    throw error;
  }
}

// Function to handle avatar deletion (unchanged)
async function deleteAvatar(fileId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authService.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete avatar");
    }

    return true;
  } catch (error) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
}

onMounted(async () => {
  await fetchDepartments();
  await fetchBranches();
  await fetchAccessLevels();
  await fetchRoles();

  // If editing, populate form data immediately
  if (props.isEditing && props.employeeData) {
    console.log("Initial employee data:", props.employeeData);
  }

  formData.tenantName = authService.getTenantName();
});

// Add debug watch for form data changes
watch(
  formData,
  (newVal) => {
    console.log("Form data changed:", newVal);
  },
  { deep: true }
);

// Watch for changes in employeeData prop
watch(
  () => props.employeeData,
  (newVal) => {
    if (props.isEditing && newVal) {
      console.log("Populating form with employee data:", newVal);

      try {
        // Reset form data
        Object.keys(formData).forEach((key) => (formData[key] = ""));

        // Basic fields
        formData.status = newVal.status || "active";
        formData.employeeId = newVal.employeeId || "";
        formData.accessOn = newVal.accessOn ?? true;

        // User details
        if (newVal.assignedUser) {
          const user = newVal.assignedUser;
          formData.firstName = user.first_name || "";
          formData.email = user.email || "";
          formData.phone = user.phone || "";
          formData.officeEmail = user.officeEmail || "";
          formData.gender = user.gender || "";
          formData.dateOfBirth = user.dateOfBirth || "";
          formData.maritalStatus = user.maritalStatus || "";
          formData.bloodGroup = user.bloodGroup || "";
          formData.pan = user.pan || "";
          formData.aadhar = user.aadhar || "";
          formData.gst = user.gst || "";
          formData.dateOfJoining = user.dateOfJoining || "";
          formData.dateOfLeaving = user.dateOfLeaving || "";

          if (user.avatar) {
            currentAvatarId.value = user.avatar.id;
            formData.avatarFile = {
              name: user.avatar.title,
              type: user.avatar.type,
              size: 0,
            };
            formData.avatar = user.avatar.id;
          }

          // Role
          if (newVal.assignedUser?.role) {
            formData.role = newVal.assignedUser.role.name || "";
          }

          // Department
          if (newVal.assignedDepartment?.[0]?.department_id) {
            formData.department =
              newVal.assignedDepartment[0].department_id.departmentName || "";
          }

          // Branch
          if (newVal.assignedBranch?.[0]?.branch_id) {
            formData.branch =
              newVal.assignedBranch[0].branch_id.branchName || "";
          }

          // Access Level
          if (newVal.assignedAccessLevels?.[0]?.accesslevels_id) {
            formData.accessLevel =
              newVal.assignedAccessLevels[0].accesslevels_id.accessLevelName ||
              "";
          }

          // Cards
          assignedCards.value = [];
          if (newVal.assignedCards && Array.isArray(newVal.assignedCards)) {
            assignedCards.value = newVal.assignedCards.map((card) => ({
              id: card.id,
              rfidCard: card.cardManagement_id.rfidCard,
              type: card.cardManagement_id.type,
              enabled: card.cardManagement_id.cardAccess,
            }));
          }
          console.log("Form data populated:", formData);
        }
      } catch (error) {
        console.error("Error populating form data:", error);
        alert("Error loading employee data. Please try again.");
      }
    }
  },
  { immediate: true, deep: true }
);

watch(
  formData,
  (newVal, oldVal) => {
    Object.keys(newVal).forEach((field) => {
      if (newVal[field] && formErrors.value[field]) {
        formErrors.value[field] = "";
      }
    });
  },
  { deep: true }
);

watch(
  () => formData.accessOn,
  (newValue) => {
    if (!newValue) {
      assignedCards.value.forEach((card) => {
        card.enabled = false;
      });
    }
  }
);

watch(currentTab, (newTab, oldTab) => {
  if (oldTab) {
    const mandatoryFields = tabRequiredFields[oldTab];
    mandatoryFields.forEach((field) => {
      if (!formData[field]) {
        touchedFields.value[field] = true;
        formErrors.value[field] = "This field is required";
      }
    });
  }
});

onUnmounted(() => {
  if (cardListener) {
    window.removeEventListener("keypress", handleCardSwipe);
  }
});
</script>

<style scoped>
.employee-form-container {
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

.card-assignment-container {
  padding: 1rem;
  border-radius: 8px;
}

.card-assignment-container.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.swipe-input {
  flex: 2;
}

.type-select {
  flex: 1;
}

.create-btn {
  min-width: 120px;
}

.assigned-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f5f5f5;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
