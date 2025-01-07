<template>
  <v-container fluid class="pa-0">
    <div class="leave-settings">
      <h2 class="text-h6 mb-6">Leave Settings</h2>

      <div class="mb-8">
        <div class="d-flex align-center mb-2">
          <span class="text-subtitle-1">Leave Cycle:</span>
          <div class="ml-4">
            <v-btn-toggle
              v-model="leaveCycle"
              mandatory
              density="comfortable"
              rounded="0"
              class="custom-toggle"
            >
              <v-btn
                value="yearly"
                :class="{ 'active-btn': leaveCycle === 'yearly' }"
              >
                Yearly
              </v-btn>
              <v-btn
                value="monthly"
                :class="{ 'active-btn': leaveCycle === 'monthly' }"
              >
                Monthly
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </div>

      <div class="leave-types">
        <div class="d-flex justify-space-between align-center mb-4">
          <h3 class="text-h6">Leave Types</h3>
          <v-btn
            color="black"
            @click="openAddLeaveDialog"
            prepend-icon="mdi-plus"
            class="add-btn text-none"
          >
            ADD LEAVE TYPE
          </v-btn>
        </div>

        <v-table class="custom-table">
          <thead>
            <tr>
              <th class="text-left">Leave Type</th>
              <th class="text-left">Count</th>
              <th class="text-left">Carry Forward</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(leave, index) in leaveTypes" :key="index">
              <td>{{ leave.name }}</td>
              <td>{{ leave.count }}</td>
              <td>
                <div class="d-flex align-center">
                  <v-switch
                    v-model="leave.carryForward.enabled"
                    color="black"
                    hide-details
                    inset
                    density="compact"
                  ></v-switch>
                  <span
                    class="text-caption text-grey ml-2"
                    v-if="leave.carryForward.enabled"
                  >
                    Max: {{ leave.carryForward.max }}
                  </span>
                </div>
              </td>
              <td>
                <div class="d-flex">
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    density="comfortable"
                    class="mr-2"
                    @click="editLeaveType(index)"
                  ></v-btn>
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    density="comfortable"
                    @click="removeLeaveType(index)"
                  ></v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>

    <!-- Add/Edit Leave Dialog -->
    <v-dialog v-model="leaveTypeDialog" max-width="400">
      <v-card class="pa-4">
        <v-card-title class="px-0 pt-0">
          {{ editIndex === -1 ? "Add Leave Type" : "Edit Leave Type" }}
        </v-card-title>
        <v-card-text class="px-0">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedLeave.name"
                label="Leave Type Name"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model.number="editedLeave.count"
                label="Count"
                type="number"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <div class="d-flex align-center justify-space-between">
                <span>Carry Forward</span>
                <v-switch
                  v-model="editedLeave.carryForward.enabled"
                  color="black"
                  hide-details
                  inset
                ></v-switch>
              </div>
            </v-col>
            <v-col cols="12" v-if="editedLeave.carryForward.enabled">
              <v-text-field
                v-model.number="editedLeave.carryForward.max"
                label="Max Carry Forward"
                type="number"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-0 pb-0">
          <v-spacer></v-spacer>
          <v-btn
            style="background-color: black"
            color="white"
            variant="text"
            @click="leaveTypeDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            style="background-color: black"
            color="white"
            @click="saveLeaveType"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "LeaveSettings",
  data() {
    return {
      leaveCycle: "yearly",
      leaveTypes: [
        {
          name: "Annual Leave",
          count: 20,
          carryForward: { enabled: true, max: 0 },
        },
        {
          name: "Sick Leave",
          count: 10,
          carryForward: { enabled: false, max: 0 },
        },
      ],
      leaveTypeDialog: false,
      editedLeave: {
        name: "",
        count: 0,
        carryForward: { enabled: false, max: 0 },
      },
      editIndex: -1,
    };
  },
  methods: {
    openAddLeaveDialog() {
      this.editedLeave = {
        name: "",
        count: 0,
        carryForward: { enabled: false, max: 0 },
      };
      this.editIndex = -1;
      this.leaveTypeDialog = true;
    },
    editLeaveType(index) {
      this.editedLeave = JSON.parse(JSON.stringify(this.leaveTypes[index]));
      this.editIndex = index;
      this.leaveTypeDialog = true;
    },
    saveLeaveType() {
      if (this.editIndex > -1) {
        this.leaveTypes.splice(this.editIndex, 1, { ...this.editedLeave });
      } else {
        this.leaveTypes.push({ ...this.editedLeave });
      }
      this.leaveTypeDialog = false;
    },
    removeLeaveType(index) {
      this.leaveTypes.splice(index, 1);
    },
  },
};
</script>

<style scoped>
.leave-settings {
  max-width: 1000px;
}

.custom-toggle {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  overflow: hidden;
}

.custom-toggle .v-btn {
  background: white;
  color: rgba(0, 0, 0, 0.87);
  border-radius: 0;
  padding: 0 20px;
  height: 36px;
  text-transform: none;
  letter-spacing: normal;
}

.custom-toggle .v-btn.active-btn {
  background: black;
  color: white;
}

.custom-table {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
}

.custom-table th {
  font-weight: 500 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 0.875rem;
  text-transform: none;
  white-space: nowrap;
}

.add-btn {
  font-size: 0.875rem;
  font-weight: 500;
  height: 36px;
}

.v-switch :deep(.v-switch__track) {
  opacity: 1;
  border-color: #e0e0e0 !important;
}

.v-switch :deep(.v-switch__thumb) {
  background-color: white !important;
}

.v-switch--active :deep(.v-switch__track) {
  background-color: black !important;
  border-color: black !important;
}

/* Dialog styles */
.v-dialog :deep(.v-card) {
  border-radius: 8px;
}

.v-dialog :deep(.v-text-field .v-field__input) {
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
