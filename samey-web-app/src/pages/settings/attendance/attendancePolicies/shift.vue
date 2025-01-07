<template>
  <div class="pa-4">
    <v-card flat class="shift-settings">
      <v-card-title
        class="text-h5 font-weight-bold bg-white black--text pa-4 rounded-t"
      >
        Shift Settings
      </v-card-title>
      <v-card-text class="text-right">
        <v-btn color="black" dark @click="addShift">
          <v-icon left>mdi-plus</v-icon>
          Add Shift
        </v-btn>
      </v-card-text>
      <v-card-text class="pt-2">
        <v-row
          v-for="(shift, index) in shifts"
          :key="index"
          class="mb-4 align-center"
        >
          <v-col cols="2">
            <v-text-field
              v-model="shift.name"
              label="Shift Name"
              dense
              outlined
              hide-details
              :readonly="!shift.isEditing"
            ></v-text-field>
          </v-col>

          <v-col cols="4" class="d-flex gap-2">
            <v-text-field
              v-model="shift.lateEntry.min"
              label="Late Entry Min"
              type="number"
              dense
              outlined
              hide-details
              :readonly="!shift.isEditing"
            ></v-text-field>
            <v-text-field
              v-model="shift.lateEntry.max"
              label="Late Entry Max"
              type="number"
              dense
              outlined
              hide-details
              :readonly="!shift.isEditing"
            ></v-text-field>
          </v-col>

          <v-col cols="4" class="d-flex gap-2">
            <v-text-field
              v-model="shift.earlyExit.min"
              label="Early Exit Min"
              type="number"
              dense
              outlined
              hide-details
              :readonly="!shift.isEditing"
            ></v-text-field>
            <v-text-field
              v-model="shift.earlyExit.max"
              label="Early Exit Max"
              type="number"
              dense
              outlined
              hide-details
              :readonly="!shift.isEditing"
            ></v-text-field>
          </v-col>

          <v-col cols="2" class="text-right">
            <v-btn v-if="!shift.isEditing" icon small @click="editShift(index)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="!shift.isEditing"
              icon
              small
              @click="deleteShift(index)"
              class="ml-2"
            >
              <v-icon color="black">mdi-delete</v-icon>
            </v-btn>
            <template v-else>
              <v-btn icon small class="mr-2" @click="cancelEdit(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn icon small color="black" @click="saveShift(index)">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ShiftSettings",
  data() {
    return {
      shifts: [
        {
          name: "Morning Shift",
          lateEntry: { min: 15, max: 30 },
          earlyExit: { min: 15, max: 30 },
          isEditing: false,
          originalData: null,
        },
        {
          name: "Afternoon Shift",
          lateEntry: { min: 15, max: 30 },
          earlyExit: { min: 15, max: 30 },
          isEditing: false,
          originalData: null,
        },
        {
          name: "Night Shift",
          lateEntry: { min: 15, max: 30 },
          earlyExit: { min: 15, max: 30 },
          isEditing: false,
          originalData: null,
        },
      ],
    };
  },
  methods: {
    editShift(index) {
      this.shifts[index].originalData = JSON.parse(
        JSON.stringify(this.shifts[index])
      );
      this.shifts[index].isEditing = true;
    },
    cancelEdit(index) {
      Object.assign(this.shifts[index], this.shifts[index].originalData);
      this.shifts[index].isEditing = false;
    },
    saveShift(index) {
      this.shifts[index].isEditing = false;
      this.shifts[index].originalData = null;
      // Add API call here to save shift data
    },
    addShift() {
      const newShift = {
        name: `New Shift ${this.shifts.length + 1}`,
        lateEntry: { min: 15, max: 30 },
        earlyExit: { min: 15, max: 30 },
        isEditing: false,
        originalData: null,
      };
      this.shifts.push(newShift);
    },
    deleteShift(index) {
      if (confirm("Are you sure you want to delete this shift?")) {
        this.shifts.splice(index, 1);
        // Add API call here to delete shift data if needed
      }
    },
  },
};
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.shift-settings {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
