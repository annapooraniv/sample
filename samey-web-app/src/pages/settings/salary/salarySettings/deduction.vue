<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="d-flex align-center">
          <h3 class="text-h6">Deductions</h3>
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
          v-model="advancedMode"
          label="Advanced Mode"
          color="black"
          hide-details
          class="mr-4"
        ></v-switch>
      </div>

      <div class="fields-container">
        <div
          v-for="(field, index) in visibleFields"
          :key="index"
          class="field-row mb-4"
        >
          <div class="field-content">
            <v-text-field
              v-model="field.name"
              :label="field.label"
              variant="outlined"
              density="comfortable"
              hide-details
              :readonly="!field.isEditing"
            ></v-text-field>

            <v-select
              v-model="field.value"
              :items="deductionOptions"
              label="Value"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 value-input"
              :readonly="!field.isEditing"
            ></v-select>
          </div>

          <div v-if="advancedMode" class="d-flex align-center">
            <template v-if="field.isEditing">
              <v-btn
                icon="mdi-check"
                variant="text"
                size="small"
                color="success"
                class="action-button"
                @click="saveEdit(index)"
              ></v-btn>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                color="error"
                class="action-button"
                @click="cancelEdit(index)"
              ></v-btn>
            </template>
            <template v-else>
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                color="black"
                class="action-button"
                @click="startEdit(index)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                variant="text"
                size="small"
                color="black"
                class="action-button"
                @click="deleteField(index)"
              ></v-btn>
            </template>
          </div>
        </div>
      </div>

      <v-btn
        v-if="advancedMode"
        color="black"
        @click="dialog = true"
        class="px-4 mt-4"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Deduction
      </v-btn>

      <!-- Add Deduction Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>Add New Deduction</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newField.name"
              label="Deduction Name"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
            <v-select
              v-model="newField.value"
              :items="deductionOptions"
              label="Value"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              style="background-color: black"
              color="white"
              variant="contained"
              @click="saveNewField"
              class="white--text"
            >
              Save
            </v-btn>
            <v-btn
              style="background-color: black"
              color="white"
              variant="outlined"
              @click="dialog = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Note Dialog -->
      <v-dialog v-model="showNoteDialog" max-width="500px">
        <v-card>
          <v-card-title class="text-h6">Important Information</v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-1">
              <strong>Employee PF and ESI Regulations:</strong>
            </p>
            <p class="text-body-2 mt-2">
              Employee PF and ESI contributions are subject to government
              regulations. PF is typically applicable for companies with 20+
              employees, while ESI coverage depends on the employee's monthly
              wage. Rates and thresholds may vary based on current policies.
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
  name: "PolicyDeductions",
  data() {
    return {
      dialog: false,
      showNoteDialog: false,
      advancedMode: false,
      deductionOptions: ["12%", "₹1800", "No value"],
      newField: {
        name: "",
        value: "",
      },
      deductionFields: [
        {
          name: "employeePF",
          label: "Employee PF",
          value: "12%",
          isEditing: false,
          originalData: null,
        },
        {
          name: "employeeESI",
          label: "Employee ESI",
          value: "12%",
          isEditing: false,
          originalData: null,
        },
      ],
    };
  },
  computed: {
    visibleFields() {
      return this.advancedMode
        ? this.deductionFields
        : this.deductionFields.slice(0, 2);
    },
  },
  methods: {
    startEdit(index) {
      this.deductionFields[index].originalData = {
        name: this.deductionFields[index].name,
        value: this.deductionFields[index].value,
      };
      this.deductionFields[index].isEditing = true;
    },
    saveEdit(index) {
      this.deductionFields[index].isEditing = false;
      this.deductionFields[index].originalData = null;
    },
    cancelEdit(index) {
      const original = this.deductionFields[index].originalData;
      this.deductionFields[index].name = original.name;
      this.deductionFields[index].value = original.value;
      this.deductionFields[index].isEditing = false;
      this.deductionFields[index].originalData = null;
    },
    saveNewField() {
      if (this.newField.name) {
        this.deductionFields.push({
          name: this.newField.name,
          label: this.newField.name,
          value: this.newField.value,
          isEditing: false,
          originalData: null,
        });
        this.dialog = false;
        this.newField = {
          name: "",
          value: "",
        };
      }
    },
    deleteField(index) {
      this.deductionFields.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.v-card .v-card-title {
  line-height: 1.6;
  margin-bottom: 10px;
  font-weight: bold;
}
.fields-container {
  max-width: 800px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-content {
  display: flex;
  flex: 1;
  align-items: center;
}

.value-input {
  width: 150px;
}

.action-button {
  margin-left: 4px;
}

:deep(.v-btn) {
  text-transform: none;
  border-radius: 4px;
}

:deep(.v-field__input) {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
