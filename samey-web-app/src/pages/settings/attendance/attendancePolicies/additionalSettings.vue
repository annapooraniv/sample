<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title
        class="text-h6 font-weight-bold d-flex justify-space-between align-center"
      >
        Additional Pay Settings
        <v-btn color="black" @click="showAddDialog('pay')" class="px-4">
          <v-icon start>mdi-plus</v-icon>
          Add Field
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isValid" @submit.prevent="saveSettings">
          <v-row>
            <!-- Additional Pay Settings Section -->
            <v-col cols="12" sm="6" v-for="field in payFields" :key="field.id">
              <v-text-field
                v-model="field.value"
                :label="field.label"
                type="number"
                variant="outlined"
                density="comfortable"
              >
                <template v-slot:append>
                  <v-btn icon small @click="editField(field)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <!-- Fine Settings Section -->
            <v-col cols="12" class="d-flex justify-space-between align-center">
              <div class="text-h6 font-weight-bold">Fine Settings</div>
              <v-btn color="black" @click="showAddDialog('fine')" class="px-4">
                <v-icon start>mdi-plus</v-icon>
                Add Field
              </v-btn>
            </v-col>

            <v-col cols="12" sm="6" v-for="field in fineFields" :key="field.id">
              <template v-if="field.type === 'select'">
                <v-select
                  v-model="field.value"
                  :label="field.label"
                  :items="fineTypes"
                  variant="outlined"
                  density="comfortable"
                >
                  <template v-slot:append>
                    <v-btn icon small @click="editField(field)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-select>
              </template>
              <template v-else>
                <v-text-field
                  v-model="field.value"
                  :label="field.label"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                >
                  <template v-slot:append>
                    <v-btn icon small @click="editField(field)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </template>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Field Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingField ? "Edit Field" : "Add New Field" }}
        </v-card-title>
        <v-card-text>
          <v-form ref="dialogForm" v-model="dialogValid">
            <v-text-field
              v-model="newField.label"
              label="Field Name"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-text-field
              v-model="newField.value"
              label="Value"
              type="number"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-select
              v-model="newField.type"
              label="Field Type"
              :items="fieldTypes"
              variant="outlined"
              density="comfortable"
            ></v-select>

            <v-select
              v-if="newField.type === 'select'"
              v-model="newField.options"
              label="Fine Type"
              :items="fineTypes"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn background-color="black" text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="black" @click="saveField">
            {{ editingField ? "Save" : "Add" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "AdditionalSettings",
  data() {
    return {
      isValid: true,
      loading: false,
      dialog: false,
      dialogValid: true,
      editingField: null,
      sectionType: "pay", // 'pay' or 'fine'
      newField: {
        label: "",
        value: "",
        type: "number",
        options: null,
      },
      fieldTypes: [
        { title: "Number", value: "number" },
        { title: "Selection", value: "select" },
      ],
      fineTypes: [
        { title: "Fixed", value: "fixed" },
        { title: "Hourly", value: "hourly" },
        { title: "Daily", value: "daily" },
      ],
      payFields: [
        { id: 1, label: "Extra Hours Pay", value: "", type: "number" },
        { id: 2, label: "Week Off Pay", value: "", type: "number" },
        { id: 3, label: "Public Holiday Pay", value: "", type: "number" },
      ],
      fineFields: [
        { id: 4, label: "Early Leave Fine", value: "", type: "select" },
        { id: 5, label: "Late Coming Fine", value: "", type: "select" },
        { id: 6, label: "Grace Period (paid)", value: "", type: "number" },
        { id: 7, label: "Fine Amount", value: "", type: "number" },
      ],
    };
  },
  methods: {
    showAddDialog(type) {
      this.sectionType = type;
      this.editingField = null;
      this.newField = {
        label: "",
        value: "",
        type: type === "fine" ? "select" : "number",
        options: null,
      };
      this.dialog = true;
    },

    editField(field) {
      this.editingField = field;
      this.newField = { ...field };
      this.sectionType = this.payFields.includes(field) ? "pay" : "fine";
      this.dialog = true;
    },

    saveField() {
      if (!this.$refs.dialogForm.validate()) return;

      const newFieldData = {
        id: this.editingField ? this.editingField.id : Date.now(),
        label: this.newField.label,
        value: this.newField.value,
        type: this.newField.type,
        options: this.newField.type === "select" ? this.newField.options : null,
      };

      if (this.editingField) {
        // Update existing field
        if (this.payFields.find((f) => f.id === this.editingField.id)) {
          this.payFields = this.payFields.map((f) =>
            f.id === this.editingField.id ? newFieldData : f
          );
        } else {
          this.fineFields = this.fineFields.map((f) =>
            f.id === this.editingField.id ? newFieldData : f
          );
        }
      } else {
        // Add new field
        if (this.sectionType === "fine") {
          this.fineFields.push(newFieldData);
        } else {
          this.payFields.push(newFieldData);
        }
      }

      this.dialog = false;
      this.editingField = null;
    },

    async saveSettings() {
      if (!this.$refs.form.validate()) return;

      this.loading = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Saving settings:", {
          payFields: this.payFields,
          fineFields: this.fineFields,
        });
      } catch (error) {
        console.error("Error saving settings:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card-title {
  margin-bottom: 10px;
}
.v-text-field :deep(.v-field__input) {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
