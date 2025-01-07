<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-4">
        <h3 class="text-h6">Earnings</h3>
        <v-switch
          v-model="advancedSettings"
          label="Advanced Settings"
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
              v-model="field.type"
              :items="earningsTypes"
              label="Type"
              variant="outlined"
              density="comfortable"
              hide-details
              class="ml-4 type-select"
              :readonly="!field.isEditing"
            ></v-select>

            <v-text-field
              v-model="field.value"
              variant="outlined"
              density="comfortable"
              hide-details
              type="number"
              class="ml-4 value-input"
              :prefix="getPrefix(field.type)"
              :placeholder="getPlaceholder(field.type)"
              :readonly="!field.isEditing"
            ></v-text-field>
          </div>

          <div class="d-flex align-center" v-if="advancedSettings">
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
                :color="field.name === 'Basic Pay' ? 'grey' : 'black'"
                class="action-button"
                @click="deleteField(index)"
                :disabled="field.name === 'Basic Pay'"
              ></v-btn>
            </template>
          </div>
        </div>
      </div>

      <v-btn
        v-if="advancedSettings"
        color="black"
        @click="dialog = true"
        class="px-4 mt-4"
      >
        <v-icon start>mdi-plus</v-icon>
        Add Field
      </v-btn>

      <!-- Add Field Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>Add New Field</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newField.name"
              label="Field Name"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
            <v-select
              v-model="newField.type"
              :items="earningsTypes"
              label="Type"
              variant="outlined"
              density="comfortable"
            ></v-select>
            <v-text-field
              v-model="newField.value"
              variant="outlined"
              density="comfortable"
              type="number"
              :prefix="getPrefix(newField.type)"
              :placeholder="getPlaceholder(newField.type)"
            ></v-text-field>
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
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SalaryStructure",
  data() {
    return {
      dialog: false,
      advancedSettings: false,
      earningsTypes: ["$ Dollar", "% Percentage", "₹ Amount"],
      newField: {
        name: "",
        type: "$ Dollar",
        value: "",
      },
      earningsFields: [
        {
          name: "Basic Pay",
          label: "Basic Pay",
          type: "% Percentage",
          value: "100",
          isEditing: false,
          originalData: null,
        },
        {
          name: "HRA",
          label: "HRA",
          type: "% Percentage",
          value: "",
          isEditing: false,
          originalData: null,
        },
        {
          name: "Dearness Allowance",
          label: "Dearness Allowance",
          type: "₹ Amount",
          value: "",
          isEditing: false,
          originalData: null,
        },
      ],
    };
  },
  computed: {
    visibleFields() {
      return this.advancedSettings
        ? this.earningsFields
        : this.earningsFields.filter((field) => field.name === "Basic Pay");
    },
  },
  methods: {
    getPrefix(type) {
      if (type.startsWith("$")) return "$";
      if (type.startsWith("₹")) return "₹";
      if (type.startsWith("%")) return "%";
      return "";
    },
    getPlaceholder(type) {
      if (type.startsWith("%")) return "Enter percentage";
      return "Enter amount";
    },
    startEdit(index) {
      this.earningsFields[index].originalData = {
        name: this.earningsFields[index].name,
        type: this.earningsFields[index].type,
        value: this.earningsFields[index].value,
      };
      this.earningsFields[index].isEditing = true;
    },
    saveEdit(index) {
      this.earningsFields[index].isEditing = false;
      this.earningsFields[index].originalData = null;
    },
    cancelEdit(index) {
      const original = this.earningsFields[index].originalData;
      this.earningsFields[index].name = original.name;
      this.earningsFields[index].type = original.type;
      this.earningsFields[index].value = original.value;
      this.earningsFields[index].isEditing = false;
      this.earningsFields[index].originalData = null;
    },
    saveNewField() {
      if (this.newField.name) {
        this.earningsFields.push({
          name: this.newField.name,
          label: this.newField.name,
          type: this.newField.type,
          value: this.newField.value,
          isEditing: false,
          originalData: null,
        });
        this.dialog = false;
        this.newField = {
          name: "",
          type: "$ Dollar",
          value: "",
        };
      }
    },
    deleteField(index) {
      if (this.earningsFields[index].name !== "Basic Pay") {
        this.earningsFields.splice(index, 1);
      }
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
}

.type-select {
  width: 160px;
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

:deep(.v-text-field input[type="number"]) {
  -moz-appearance: textfield;
}

:deep(.v-text-field input[type="number"]::-webkit-outer-spin-button),
:deep(.v-text-field input[type="number"]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
