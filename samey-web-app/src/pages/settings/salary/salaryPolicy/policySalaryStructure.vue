<template>
  <v-card flat>
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-4">
        <h3 class="text-h6">Earnings</h3>
        <v-btn color="black" @click="dialog = true" class="px-4">
          <v-icon start>mdi-plus</v-icon>
          Add Field
        </v-btn>
      </div>

      <div class="fields-container">
        <div
          v-for="(field, index) in earningsFields"
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
          </div>

          <div class="d-flex align-center">
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
  name: "PolicySalaryStructure",
  data() {
    return {
      dialog: false,
      earningsTypes: ["On Attendance", "Flat Rate"],
      newField: {
        name: "",
        type: "On Attendance",
      },
      earningsFields: [
        {
          name: "Basic Pay",
          label: "Basic Pay",
          type: "On Attendance",
          isEditing: false,
          originalData: null,
        },
        {
          name: "HRA",
          label: "HRA",
          type: "Flat Rate",
          isEditing: false,
          originalData: null,
        },
        {
          name: "Dearness Allowance",
          label: "Dearness Allowance",
          type: "On Attendance",
          isEditing: false,
          originalData: null,
        },
      ],
    };
  },
  methods: {
    startEdit(index) {
      this.earningsFields[index].originalData = {
        name: this.earningsFields[index].name,
        type: this.earningsFields[index].type,
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
      this.earningsFields[index].isEditing = false;
      this.earningsFields[index].originalData = null;
    },
    saveNewField() {
      if (this.newField.name) {
        this.earningsFields.push({
          name: this.newField.name,
          label: this.newField.name,
          type: this.newField.type,
          isEditing: false,
          originalData: null,
        });
        this.dialog = false;
        this.newField = {
          name: "",
          type: "On Attendance",
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
  width: 200px;
}

.action-button {
  margin-left: 4px;
}

:deep(.v-btn) {
  text-transform: none;
  border-radius: 4px;
}
</style>
