<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="d-flex align-center">
          <h3 class="text-h6">Contributions</h3>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-information"
                variant="text"
                size="small"
                color="grey"
                class="ml-2"
                @click="showNoteDialog = true"
              ></v-btn>
            </template>
            <span>Click for more information</span>
          </v-tooltip>
        </div>
        <v-switch
          v-model="advancedSettings"
          label="Advanced Settings"
          color="black"
          hide-details
          class="mr-4"
        ></v-switch>
      </div>

      <div class="fields-container">
        <!-- Employee Contributions -->
        <div class="mb-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 font-weight-medium">
              Employee Contribution
            </div>
            <!-- <v-btn
              v-if="advancedSettings"
              color="black"
              variant="flat"
              size="small"
              @click="showAddEmployeeChargeDialog = true"
              class="add-field-btn"
            >
              <v-icon start>mdi-plus</v-icon>
              Add Field
            </v-btn> -->
          </div>

          <div class="field-row mb-4">
            <v-text-field
              label="Employee PF"
              variant="outlined"
              density="comfortable"
              hide-details
              readonly
              class="field-name"
              value="Employee PF"
            ></v-text-field>

            <v-select
              v-model="employeePF.value"
              :items="pfOptions"
              label="Value"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 value-input"
              :readonly="!employeePF.isEditing"
            ></v-select>

            <v-select
              v-if="showEmployeePFComponent"
              v-model="employeePF.component"
              :items="availableComponents"
              label="Component"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 component-input"
              :readonly="!employeePF.isEditing"
            ></v-select>

            <div v-if="advancedSettings" class="d-flex align-center">
              <template v-if="employeePF.isEditing">
                <v-btn
                  icon="mdi-check"
                  variant="text"
                  size="small"
                  color="success"
                  class="ml-2"
                  @click="saveEdit('employeePF')"
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  color="error"
                  class="ml-2"
                  @click="cancelEdit('employeePF')"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="startEdit('employeePF')"
                ></v-btn>
              </template>
            </div>
          </div>

          <div class="field-row mb-4">
            <v-text-field
              label="Employee ESI"
              variant="outlined"
              density="comfortable"
              hide-details
              readonly
              class="field-name"
              value="Employee ESI"
            ></v-text-field>

            <v-select
              v-model="employeeESI.value"
              :items="esiOptions"
              label="Value"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 value-input"
              :readonly="!employeeESI.isEditing"
            ></v-select>

            <v-select
              v-if="showEmployeeESIComponent"
              v-model="employeeESI.component"
              :items="availableComponents"
              label="Component"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 component-input"
              :readonly="!employeeESI.isEditing"
            ></v-select>

            <div v-if="advancedSettings" class="d-flex align-center">
              <template v-if="employeeESI.isEditing">
                <v-btn
                  icon="mdi-check"
                  variant="text"
                  size="small"
                  color="success"
                  class="ml-2"
                  @click="saveEdit('employeeESI')"
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  color="error"
                  class="ml-2"
                  @click="cancelEdit('employeeESI')"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="startEdit('employeeESI')"
                ></v-btn>
              </template>
            </div>
          </div>

          <div
            v-for="(charge, index) in employeeAdditionalCharges"
            :key="index"
            class="field-row mb-4"
          >
            <v-text-field
              v-model="charge.name"
              :label="charge.name"
              variant="outlined"
              density="comfortable"
              hide-details
              :readonly="!charge.isEditing"
              class="field-name"
            ></v-text-field>

            <v-select
              v-if="charge.isStateSpecific"
              v-model="charge.state"
              :items="states"
              label="State"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 value-input"
              :readonly="!charge.isEditing"
            ></v-select>

            <v-text-field
              v-model="charge.value"
              label="Value"
              variant="outlined"
              density="comfortable"
              hide-details
              type="number"
              class="ml-4 value-input"
              :suffix="charge.type === 'percentage' ? '%' : '₹'"
              :readonly="!charge.isEditing"
            ></v-text-field>

            <div v-if="advancedSettings" class="d-flex align-center">
              <template v-if="charge.isEditing">
                <v-btn
                  icon="mdi-check"
                  variant="text"
                  size="small"
                  color="success"
                  class="ml-2"
                  @click="saveCharge(index, 'employee')"
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  color="error"
                  class="ml-2"
                  @click="cancelEditCharge(index, 'employee')"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="editCharge(index, 'employee')"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="deleteCharge(index, 'employee')"
                ></v-btn>
              </template>
            </div>
          </div>
        </div>

        <!-- Employer Contributions -->
        <div class="mb-6">
          <div class="d-flex justify-space-between align-center mb-4">
            <div class="text-subtitle-1 font-weight-medium">
              Employer Contribution
            </div>
            <!-- <v-btn
              v-if="advancedSettings"
              color="black"
              variant="flat"
              size="small"
              @click="showAddEmployerChargeDialog = true"
              class="add-field-btn"
            >
              <v-icon start>mdi-plus</v-icon>
              Add Field
            </v-btn> -->
          </div>

          <div class="field-row mb-4">
            <v-text-field
              label="Employer PF"
              variant="outlined"
              density="comfortable"
              hide-details
              readonly
              class="field-name"
              value="Employer PF"
            ></v-text-field>

            <v-select
              v-model="employerPF.value"
              :items="pfOptions"
              label="Value"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 value-input"
              :readonly="!employerPF.isEditing"
            ></v-select>

            <v-select
              v-if="showEmployerPFComponent"
              v-model="employerPF.component"
              :items="availableComponents"
              label="Component"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 component-input"
              :readonly="!employerPF.isEditing"
            ></v-select>

            <div v-if="advancedSettings" class="d-flex align-center">
              <template v-if="employerPF.isEditing">
                <v-btn
                  icon="mdi-check"
                  variant="text"
                  size="small"
                  color="success"
                  class="ml-2"
                  @click="saveEdit('employerPF')"
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  color="error"
                  class="ml-2"
                  @click="cancelEdit('employerPF')"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="startEdit('employerPF')"
                ></v-btn>
              </template>
            </div>
          </div>

          <div class="field-row mb-4">
            <v-text-field
              label="Employer ESI"
              variant="outlined"
              density="comfortable"
              hide-details
              readonly
              class="field-name"
              value="Employer ESI"
            ></v-text-field>

            <v-select
              v-model="employerESI.value"
              :items="esiOptions"
              label="Value"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 value-input"
              :readonly="!employerESI.isEditing"
            ></v-select>

            <v-select
              v-if="showEmployerESIComponent"
              v-model="employerESI.component"
              :items="availableComponents"
              label="Component"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 component-input"
              :readonly="!employerESI.isEditing"
            ></v-select>

            <div v-if="advancedSettings" class="d-flex align-center">
              <template v-if="employerESI.isEditing">
                <v-btn
                  icon="mdi-check"
                  variant="text"
                  size="small"
                  color="success"
                  class="ml-2"
                  @click="saveEdit('employerESI')"
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  color="error"
                  class="ml-2"
                  @click="cancelEdit('employerESI')"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="startEdit('employerESI')"
                ></v-btn>
              </template>
            </div>
          </div>

          <div
            v-for="(charge, index) in employerAdditionalCharges"
            :key="index"
            class="field-row mb-4"
          >
            <v-text-field
              v-model="charge.name"
              :label="charge.name"
              variant="outlined"
              density="comfortable"
              hide-details
              :readonly="!charge.isEditing"
              class="field-name"
            ></v-text-field>

            <v-select
              v-if="charge.isStateSpecific"
              v-model="charge.state"
              :items="states"
              label="State"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 value-input"
              :readonly="!charge.isEditing"
            ></v-select>

            <v-text-field
              v-model="charge.value"
              label="Value"
              variant="outlined"
              density="comfortable"
              hide-details
              type="number"
              class="ml-4 value-input"
              :suffix="charge.type === 'percentage' ? '%' : '₹'"
              :readonly="!charge.isEditing"
            ></v-text-field>

            <div v-if="advancedSettings" class="d-flex align-center">
              <template v-if="charge.isEditing">
                <v-btn
                  icon="mdi-check"
                  variant="text"
                  size="small"
                  color="success"
                  class="ml-2"
                  @click="saveCharge(index, 'employer')"
                ></v-btn>
                <v-btn
                  icon="mdi-close"
                  variant="text"
                  size="small"
                  color="error"
                  class="ml-2"
                  @click="cancelEditCharge(index, 'employer')"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="editCharge(index, 'employer')"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  color="black"
                  class="ml-2"
                  @click="deleteCharge(index, 'employer')"
                ></v-btn>
              </template>
            </div>
          </div>
        </div>
      </div>

      <v-dialog v-model="showAddEmployeeChargeDialog" max-width="500px">
        <v-card>
          <v-card-title>Add Employee Additional Charge</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newCharge.name"
              label="Charge Name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            ></v-text-field>

            <v-switch
              v-model="newCharge.isStateSpecific"
              label="State Specific"
              color="black"
              hide-details
              class="mb-4"
            ></v-switch>

            <template v-if="newCharge.isStateSpecific">
              <v-select
                v-model="newCharge.state"
                :items="states"
                label="State"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-select>
            </template>

            <template v-if="!newCharge.isStateSpecific">
              <v-select
                v-model="newCharge.type"
                :items="chargeTypes"
                label="Type"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-select>

              <v-text-field
                v-model="newCharge.value"
                label="Value"
                variant="outlined"
                density="comfortable"
                type="number"
                :suffix="newCharge.type === 'percentage' ? '%' : '₹'"
              ></v-text-field>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="black"
              variant="contained"
              @click="saveNewCharge('employee')"
              class="white--text"
            >
              Save
            </v-btn>
            <v-btn
              color="black"
              variant="outlined"
              @click="showAddEmployeeChargeDialog = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showAddEmployerChargeDialog" max-width="500px">
        <v-card>
          <v-card-title>Add Employer Additional Charge</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newCharge.name"
              label="Charge Name"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            ></v-text-field>

            <v-switch
              v-model="newCharge.isStateSpecific"
              label="State Specific"
              color="black"
              hide-details
              class="mb-4"
            ></v-switch>

            <template v-if="newCharge.isStateSpecific">
              <v-select
                v-model="newCharge.state"
                :items="states"
                label="State"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-select>
            </template>

            <template v-if="!newCharge.isStateSpecific">
              <v-select
                v-model="newCharge.type"
                :items="chargeTypes"
                label="Type"
                variant="outlined"
                density="comfortable"
                class="mb-4"
              ></v-select>

              <v-text-field
                v-model="newCharge.value"
                label="Value"
                variant="outlined"
                density="comfortable"
                type="number"
                :suffix="newCharge.type === 'percentage' ? '%' : '₹'"
              ></v-text-field>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="black"
              variant="contained"
              @click="saveNewCharge('employer')"
              class="white--text"
            >
              Save
            </v-btn>
            <v-btn
              color="black"
              variant="outlined"
              @click="showAddEmployerChargeDialog = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="showNoteDialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h6">Important Information</v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-1">
              <strong>Contribution Guidelines:</strong>
            </p>
            <p class="text-body-2 mt-2">
              PF and ESI contributions are subject to government regulations.
              The rates and components can be customized based on your
              organization's policies. Additional charges can be added to
              account for specific organizational needs.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="black" variant="text" @click="showNoteDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Contribution",
  props: {
    earningsFields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      advancedSettings: false,
      showNoteDialog: false,
      showAddEmployeeChargeDialog: false,
      showAddEmployerChargeDialog: false,
      pfOptions: ["12% Variable", "₹1800 Limit", "No Value"],
      esiOptions: ["12% Variable", "₹1800 Limit", "No Value"],
      chargeTypes: [
        { title: "Percentage", value: "percentage" },
        { title: "Amount", value: "amount" },
      ],
      states: [
        { title: "Andhra Pradesh", value: "AP", rate: 20 },
        { title: "Karnataka", value: "KA", rate: 20 },
        { title: "Kerala", value: "KL", rate: 30 },
        { title: "Tamil Nadu", value: "TN", rate: 20 },
        { title: "Telangana", value: "TS", rate: 25 },
        { title: "Maharashtra", value: "MH", rate: 24 },
        { title: "Gujarat", value: "GJ", rate: 15 },
      ],
      employeePF: {
        value: "12% Variable",
        component: "Basic",
        isEditing: false,
        originalData: null,
      },
      employeeESI: {
        value: "12% Variable",
        component: "Basic",
        isEditing: false,
        originalData: null,
      },
      employerPF: {
        value: "12% Variable",
        component: "Basic",
        isEditing: false,
        originalData: null,
      },
      employerESI: {
        value: "12% Variable",
        component: "Basic",
        isEditing: false,
        originalData: null,
      },
      employeeAdditionalCharges: [],
      employerAdditionalCharges: [],
      newCharge: {
        name: "",
        type: "percentage",
        value: "",
        isStateSpecific: false,
        state: "",
      },
      availableComponents: ["Basic", "Overtime", "Incentive"],
    };
  },
  computed: {
    showEmployeePFComponent() {
      return this.employeePF.value === "12% Variable";
    },
    showEmployeeESIComponent() {
      return this.employeeESI.value === "12% Variable";
    },
    showEmployerPFComponent() {
      return this.employerPF.value === "12% Variable";
    },
    showEmployerESIComponent() {
      return this.employerESI.value === "12% Variable";
    },
  },
  methods: {
    startEdit(field) {
      if (this.advancedSettings) {
        this[field].originalData = JSON.parse(JSON.stringify(this[field]));
        this[field].isEditing = true;
      }
    },
    saveEdit(field) {
      this[field].isEditing = false;
      this[field].originalData = null;
    },
    cancelEdit(field) {
      const original = this[field].originalData;
      Object.assign(this[field], original);
      this[field].isEditing = false;
      this[field].originalData = null;
    },
    editCharge(index, type) {
      const charges =
        type === "employee"
          ? this.employeeAdditionalCharges
          : this.employerAdditionalCharges;
      charges[index].originalData = { ...charges[index] };
      charges[index].isEditing = true;
    },
    saveCharge(index, type) {
      const charges =
        type === "employee"
          ? this.employeeAdditionalCharges
          : this.employerAdditionalCharges;
      charges[index].isEditing = false;
      charges[index].originalData = null;
    },
    cancelEditCharge(index, type) {
      const charges =
        type === "employee"
          ? this.employeeAdditionalCharges
          : this.employerAdditionalCharges;
      const original = charges[index].originalData;
      Object.assign(charges[index], original);
      charges[index].isEditing = false;
      charges[index].originalData = null;
    },
    deleteCharge(index, type) {
      if (type === "employee") {
        this.employeeAdditionalCharges.splice(index, 1);
      } else {
        this.employerAdditionalCharges.splice(index, 1);
      }
    },
    saveNewCharge(type) {
      if (this.newCharge.name) {
        const charge = {
          name: this.newCharge.name,
          isEditing: false,
          originalData: null,
        };

        if (this.newCharge.isStateSpecific) {
          charge.isStateSpecific = true;
          charge.state = this.newCharge.state;
          const stateData = this.states.find(
            (s) => s.value === this.newCharge.state
          );
          charge.value = stateData ? stateData.rate : "";
          charge.type = "amount";
        } else {
          charge.type = this.newCharge.type;
          charge.value = this.newCharge.value;
        }

        if (type === "employee") {
          this.employeeAdditionalCharges.push(charge);
          this.showAddEmployeeChargeDialog = false;
        } else {
          this.employerAdditionalCharges.push(charge);
          this.showAddEmployerChargeDialog = false;
        }

        this.newCharge = {
          name: "",
          type: "percentage",
          value: "",
          isStateSpecific: false,
          state: "",
        };
      }
    },
  },
  watch: {
    earningsFields: {
      handler(newFields) {
        const staticComponents = ["Basic", "Overtime", "Incentive"];
        const dynamicComponents = newFields
          .filter((field) => !staticComponents.includes(field.name))
          .map((field) => field.name);
        this.availableComponents = [...staticComponents, ...dynamicComponents];
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.fields-container {
  max-width: 800px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-name {
  width: 200px;
}

.value-input {
  width: 150px;
}

.component-input {
  width: 200px;
}

.add-field-btn {
  background-color: black !important;
  color: white !important;
}

:deep(.v-field__input) {
  padding-top: 6px;
  padding-bottom: 6px;
}

:deep(.v-text-field input[type="number"]) {
  -moz-appearance: textfield;
}

:deep(.v-text-field input[type="number"]::-webkit-outer-spin-button),
:deep(.v-text-field input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
