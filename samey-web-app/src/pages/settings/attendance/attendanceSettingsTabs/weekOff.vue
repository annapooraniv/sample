<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Week Off Configuration
      </v-card-title>
      <v-card-text>
        <v-table fixed-header>
          <thead>
            <tr>
              <th class="text-left" style="width: 120px">Day</th>
              <th class="text-left">Week Off</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="day in weekDays"
              :key="day.name"
              @click="toggleWeekOff(day)"
            >
              <td>{{ day.name }}</td>
              <td>
                <v-switch
                  v-model="day.isWeekOff"
                  color="black"
                  hide-details
                  inset
                  :readonly="!day.isEditing"
                  density="compact"
                >
                  <template v-slot:label>
                    <span :class="{ 'font-weight-bold': day.isWeekOff }">
                      {{ day.isWeekOff ? "Week Off" : "Working Day" }}
                    </span>
                  </template>
                </v-switch>
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
  name: "WeekOff",
  data() {
    return {
      weekDays: [
        { name: "Monday", isWeekOff: false, isEditing: false },
        { name: "Tuesday", isWeekOff: false, isEditing: false },
        { name: "Wednesday", isWeekOff: false, isEditing: false },
        { name: "Thursday", isWeekOff: false, isEditing: false },
        { name: "Friday", isWeekOff: false, isEditing: false },
        { name: "Saturday", isWeekOff: true, isEditing: false },
        { name: "Sunday", isWeekOff: true, isEditing: false },
      ],
      originalData: null,
    };
  },
  methods: {
    startEditing(day) {
      this.weekDays.forEach((d) => (d.isEditing = false));
      day.isEditing = true;
      this.originalData = { ...day };
    },
    saveEditing(day) {
      day.isEditing = false;
    },
    cancelEditing(day) {
      Object.assign(day, this.originalData);
      day.isEditing = false;
    },
    toggleWeekOff(day) {
      if (!day.isEditing) {
        this.startEditing(day);
      } else {
        this.saveEditing(day);
      }
    },
  },
};
</script>

<style scoped>
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
  border-color: #e0e0e0 !important;
}
.v-switch :deep(.v-switch__thumb) {
  background-color: white !important;
}
.v-switch--active :deep(.v-switch__track) {
  background-color: black !important;
  border-color: black !important;
}
.v-switch :deep(.v-selection-control__input) {
  opacity: 1 !important;
}

.v-switch--readonly :deep(.v-switch__track) {
  opacity: 1 !important;
}

.v-switch--readonly.v-switch--active :deep(.v-switch__track) {
  background-color: black !important;
  border-color: black !important;
}
</style>
