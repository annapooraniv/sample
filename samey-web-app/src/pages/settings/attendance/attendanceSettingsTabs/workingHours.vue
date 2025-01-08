<template>
  <v-container fluid class="pa-0">
    <div class="d-flex align-center justify-space-between mb-6">
      <div class="d-flex align-center">
        <v-switch
          v-model="fixedWorkingTiming"
          label="Fixed Working Timing"
          color="black"
          hide-details
          inset
          class="mr-6"
          @update:model-value="handleFixedToggle"
        ></v-switch>
        <v-switch
          v-model="shiftWorkingTiming"
          label="Shift Working Timing"
          color="black"
          hide-details
          inset
          @update:model-value="handleShiftToggle"
        ></v-switch>
      </div>
    </div>

    <v-card v-if="fixedWorkingTiming" flat>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Fixed Working Timing
      </v-card-title>
      <v-card-text>
        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Day</th>
              <th class="text-left">Working Hours</th>
              <th class="text-left">Break Time (min)</th>
              <th class="text-left">Holiday</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in weekDays" :key="day.name">
              <td>{{ day.name }}</td>
              <td>
                <template v-if="!day.isHoliday">
                  <template v-if="day.isEditing">
                    <v-text-field
                      v-model="day.workingHours"
                      hide-details
                      density="compact"
                      class="ma-0 pa-0"
                    ></v-text-field>
                  </template>
                  <template v-else>
                    {{ day.workingHours }}
                  </template>
                </template>
                <template v-else>
                  <span class="text-grey">Holiday</span>
                </template>
              </td>
              <td>
                <template v-if="!day.isHoliday">
                  <template v-if="day.isEditing">
                    <v-text-field
                      v-model="day.breakTime"
                      hide-details
                      density="compact"
                      class="ma-0 pa-0"
                      type="number"
                    ></v-text-field>
                  </template>
                  <template v-else>
                    {{ day.breakTime }}
                  </template>
                </template>
                <template v-else>
                  <span class="text-grey">-</span>
                </template>
              </td>
              <td>
                <v-checkbox
                  v-model="day.isHoliday"
                  hide-details
                  density="compact"
                  color="black"
                  :disabled="!day.isEditing"
                ></v-checkbox>
              </td>
              <td>
                <div class="d-flex align-center">
                  <template v-if="!day.isEditing">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click="startEditing(day)"
                    ></v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      icon="mdi-check"
                      size="small"
                      color="black"
                      variant="text"
                      class="mr-2"
                      @click="saveEditing(day)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-close"
                      size="small"
                      color="error"
                      variant="text"
                      @click="cancelEditing(day)"
                    ></v-btn>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-card v-if="shiftWorkingTiming" flat class="mt-6">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Shift Working Timing
      </v-card-title>
      <v-card-text>
        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">Day</th>
              <th class="text-left">Shifts</th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="day in shiftDays" :key="day.name">
              <td style="width: 120px">{{ day.name }}</td>
              <td>
                <div v-if="!day.isEditing">
                  <div v-if="day.shifts.length === 0" class="text-grey">
                    No shifts assigned
                  </div>
                  <v-chip
                    v-for="(shift, index) in day.shifts"
                    :key="index"
                    class="mr-2 mb-2"
                    size="small"
                    variant="outlined"
                  >
                    {{ shift.name }} ({{ shift.timing }}, Break:
                    {{ shift.breakTime }}min)
                  </v-chip>
                </div>
                <div v-else>
                  <v-row dense>
                    <v-col
                      cols="12"
                      v-for="(shift, index) in day.shifts"
                      :key="index"
                    >
                      <v-card variant="outlined" class="pa-2 mb-2">
                        <div class="d-flex align-center">
                          <v-text-field
                            v-model="shift.name"
                            label="Shift"
                            hide-details
                            density="compact"
                            class="mr-2"
                            style="width: 150px"
                          ></v-text-field>
                          <v-text-field
                            v-model="shift.timing"
                            label="Timing"
                            hide-details
                            density="compact"
                            class="mr-2"
                            style="width: 150px"
                          ></v-text-field>
                          <v-text-field
                            v-model="shift.breakTime"
                            label="Break (min)"
                            hide-details
                            density="compact"
                            type="number"
                            style="width: 100px"
                            class="mr-2"
                          ></v-text-field>
                          <v-btn
                            icon="mdi-delete"
                            size="small"
                            color="error"
                            variant="text"
                            @click="removeShiftFromDay(day, index)"
                          ></v-btn>
                        </div>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-btn
                    size="small"
                    prepend-icon="mdi-plus"
                    variant="text"
                    @click="addShiftToDay(day)"
                    class="mt-2"
                  >
                    Add Shift
                  </v-btn>
                </div>
              </td>
              <td style="width: 100px">
                <div class="d-flex align-center">
                  <template v-if="!day.isEditing">
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      variant="text"
                      @click="startEditingShift(day)"
                    ></v-btn>
                  </template>
                  <template v-else>
                    <v-btn
                      icon="mdi-check"
                      size="small"
                      color="black"
                      variant="text"
                      class="mr-2"
                      @click="saveEditingShift(day)"
                    ></v-btn>
                    <v-btn
                      icon="mdi-close"
                      size="small"
                      color="error"
                      variant="text"
                      @click="cancelEditingShift(day)"
                    ></v-btn>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "WorkingHours",
  data() {
    return {
      fixedWorkingTiming: true,
      shiftWorkingTiming: false,
      weekDays: [
        {
          name: "Monday",
          workingHours: "09:00 - 18:00",
          breakTime: "60",
          isHoliday: false,
          isEditing: false,
        },
        {
          name: "Tuesday",
          workingHours: "09:00 - 18:00",
          breakTime: "60",
          isHoliday: false,
          isEditing: false,
        },
        {
          name: "Wednesday",
          workingHours: "09:00 - 18:00",
          breakTime: "60",
          isHoliday: false,
          isEditing: false,
        },
        {
          name: "Thursday",
          workingHours: "09:00 - 18:00",
          breakTime: "60",
          isHoliday: false,
          isEditing: false,
        },
        {
          name: "Friday",
          workingHours: "09:00 - 18:00",
          breakTime: "60",
          isHoliday: false,
          isEditing: false,
        },
        {
          name: "Saturday",
          workingHours: "",
          breakTime: "0",
          isHoliday: true,
          isEditing: false,
        },
        {
          name: "Sunday",
          workingHours: "",
          breakTime: "0",
          isHoliday: true,
          isEditing: false,
        },
      ],
      shift: {
        name: "",
        timing: "",
        breakTime: "",
      },
      shiftDays: [
        { name: "Monday", shifts: [], isEditing: false },
        { name: "Tuesday", shifts: [], isEditing: false },
        { name: "Wednesday", shifts: [], isEditing: false },
        { name: "Thursday", shifts: [], isEditing: false },
        { name: "Friday", shifts: [], isEditing: false },
        { name: "Saturday", shifts: [], isEditing: false },
        { name: "Sunday", shifts: [], isEditing: false },
      ],
      originalData: null,
      originalShiftData: null,
    };
  },
  methods: {
    handleFixedToggle(value) {
      if (value && this.shiftWorkingTiming) {
        this.shiftWorkingTiming = false;
      }
    },
    handleShiftToggle(value) {
      if (value && this.fixedWorkingTiming) {
        this.fixedWorkingTiming = false;
      }
    },
    startEditing(day) {
      this.originalData = { ...day };
      day.isEditing = true;
    },
    saveEditing(day) {
      day.isEditing = false;
      this.originalData = null;
    },
    cancelEditing(day) {
      Object.assign(day, this.originalData);
      day.isEditing = false;
      this.originalData = null;
    },
    startEditingShift(day) {
      this.originalShiftData = JSON.parse(JSON.stringify(day.shifts));
      day.isEditing = true;
    },
    saveEditingShift(day) {
      day.isEditing = false;
      this.originalShiftData = null;
    },
    cancelEditingShift(day) {
      day.shifts = JSON.parse(JSON.stringify(this.originalShiftData));
      day.isEditing = false;
      this.originalShiftData = null;
    },
    addShiftToDay(day) {
      const newShift = {
        name: "New Shift",
        timing: "09:00 - 18:00",
        breakTime: "60",
      };
      day.shifts.push(newShift);
    },
    removeShiftFromDay(day, shiftIndex) {
      day.shifts.splice(shiftIndex, 1);
    },
  },
};
</script>

<style scoped>
.text-grey {
  color: #333 !important;
}
.v-table {
  background: transparent !important;
}
.v-table ::v-deep thead tr th {
  font-weight: 600 !important;
  color: rgba(0, 0, 0, 0.87) !important;
  font-size: 0.875rem;
}
.v-btn--size-small {
  width: 24px;
  height: 24px;
  min-width: 24px;
}
.v-switch :deep(.v-switch__track) {
  opacity: 1;
  /* background-color: #e0e0e0 !important; */
  border-color: #e0e0e0 !important;
}
.v-switch :deep(.v-switch__thumb) {
  background-color: white !important;
}
.v-switch--active :deep(.v-switch__track) {
  background-color: black !important;
  border-color: black !important;
}
.v-chip {
  background-color: transparent !important;
}
</style>
