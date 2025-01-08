<template>
  <v-card flat class="attendance-settings">
    <v-card-text>
      <div class="d-flex justify-space-between align-center mb-4">
        <div class="d-flex align-center">
          <h3 class="text-h6">Attendance Cycle</h3>
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-information"
                variant="text"
                size="small"
                color="grey"
                class="ml-2"
                @click="showInfoDialog = true"
              ></v-btn>
            </template>
            <span>Click for more information</span>
          </v-tooltip>
        </div>
        <div class="custom-toggle-wrapper">
          <label class="toggle">
            <input type="checkbox" v-model="isCustomCycle" />
            <span class="slider"></span>
          </label>
          <span class="ml-2">{{
            isCustomCycle ? "Custom Cycle" : "Fixed Cycle"
          }}</span>
        </div>
      </div>

      <div class="settings-container">
        <!-- Fixed Cycle View -->
        <div v-if="!isCustomCycle" class="fixed-cycle-view">
          <div class="cycle-content-wrapper">
            <div class="calendar-section">
              <div class="cycle-month-selector mb-4">
                <div class="d-flex align-center justify-space-between">
                  <v-btn
                    icon="mdi-chevron-left"
                    variant="text"
                    @click="previousMonth"
                  ></v-btn>
                  <span class="text-h6">{{ currentMonthYear }}</span>
                  <v-btn
                    icon="mdi-chevron-right"
                    variant="text"
                    @click="nextMonth"
                  ></v-btn>
                </div>
              </div>

              <div class="calendar-wrapper">
                <div class="calendar-grid">
                  <div
                    v-for="day in weekDays"
                    :key="day"
                    class="calendar-header"
                  >
                    {{ day }}
                  </div>
                  <template
                    v-for="(week, weekIndex) in calendarDates"
                    :key="weekIndex"
                  >
                    <div
                      v-for="(date, dateIndex) in week"
                      :key="dateIndex"
                      :class="[
                        'calendar-day',
                        {
                          selected: isDateSelected(date),
                          disabled: !date,
                          current: isCurrentDate(date),
                        },
                      ]"
                      @click="date && selectDate(date)"
                    >
                      {{ date ? date.getDate() : "" }}
                    </div>
                  </template>
                </div>
              </div>
            </div>

            <div class="cycle-toggles">
              <div class="toggle-item">
                <label class="toggle">
                  <input type="checkbox" v-model="includeWeekoffs" />
                  <span class="slider"></span>
                </label>
                <span class="ml-2">Include Weekoffs</span>
              </div>
              <div class="toggle-item mt-2">
                <label class="toggle">
                  <input type="checkbox" v-model="includeHolidays" />
                  <span class="slider"></span>
                </label>
                <span class="ml-2">Include Holidays</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Cycle View -->
        <div v-else class="custom-cycle-view">
          <div class="cycle-settings mb-4">
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="text-subtitle-1 font-weight-medium"
                >Cycle Period</span
              >
              <button
                v-if="!isEditing"
                class="edit-button"
                @click="startEditing"
              >
                <v-icon size="small">mdi-pencil</v-icon>
              </button>
            </div>
            <div class="d-flex align-center gap-4">
              <v-select
                v-model="startDay"
                :items="daysInMonth"
                label="Start Date"
                variant="outlined"
                density="comfortable"
                hide-details
                class="date-select"
                :readonly="!isEditing"
              ></v-select>
              <span class="mx-2">to</span>
              <v-select
                v-model="endDay"
                :items="daysInMonth"
                label="End Date"
                variant="outlined"
                density="comfortable"
                hide-details
                class="date-select"
                :readonly="!isEditing"
              ></v-select>
            </div>
          </div>

          <div class="custom-settings">
            <div class="toggle-item mb-2">
              <label class="toggle">
                <input type="checkbox" v-model="includeWeekoffs" />
                <span class="slider"></span>
              </label>
              <span class="ml-2">Include Weekoffs</span>
            </div>
            <div class="toggle-item">
              <label class="toggle">
                <input type="checkbox" v-model="includeHolidays" />
                <span class="slider"></span>
              </label>
              <span class="ml-2">Include Holidays</span>
            </div>
          </div>

          <div class="mt-4" v-if="isEditing">
            <v-btn color="black" @click="saveSettings">Save</v-btn>
            <v-btn
              style="background-color: black"
              color="white"
              variant="text"
              class="ml-2"
              @click="cancelEditing"
              >Cancel</v-btn
            >
          </div>
        </div>
      </div>

      <!-- Info Dialog -->
      <v-dialog v-model="showInfoDialog" max-width="500">
        <v-card>
          <v-card-title>Attendance Cycle Information</v-card-title>
          <v-card-text>
            <p>
              The attendance cycle determines the period for which attendance is
              calculated. You can set a fixed cycle or a custom cycle with
              additional options for weekoffs and holidays.
            </p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              style="background-color: black"
              color="white"
              variant="text"
              @click="showInfoDialog = false"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "AttendanceCycle",
  data() {
    return {
      isCustomCycle: false,
      showInfoDialog: false,
      isEditing: false,
      startDay: "21",
      endDay: "20",
      includeWeekoffs: false,
      includeHolidays: false,
      daysInMonth: Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
      originalSettings: null,
      currentDate: new Date(),
      selectedStartDate: null,
      selectedEndDate: null,
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };
  },
  computed: {
    currentMonthYear() {
      return this.currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
    },
    calendarDates() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const dates = [];
      let week = [];

      // Add empty spaces for days before first of month
      for (let i = 0; i < firstDay.getDay(); i++) {
        week.push(null);
      }

      // Add all days of the month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        if (week.length === 7) {
          dates.push(week);
          week = [];
        }
        week.push(new Date(year, month, i));
      }

      // Fill in remaining days
      while (week.length < 7) {
        week.push(null);
      }
      dates.push(week);

      return dates;
    },
  },
  methods: {
    previousMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      );
    },
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      );
    },
    isDateSelected(date) {
      if (!date) return false;
      if (!this.selectedStartDate) return false;
      if (!this.selectedEndDate)
        return date.getTime() === this.selectedStartDate.getTime();

      return date >= this.selectedStartDate && date <= this.selectedEndDate;
    },
    isCurrentDate(date) {
      if (!date) return false;
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
    selectDate(date) {
      if (!this.selectedStartDate || this.selectedEndDate) {
        this.selectedStartDate = date;
        this.selectedEndDate = null;
      } else {
        if (date < this.selectedStartDate) {
          this.selectedEndDate = this.selectedStartDate;
          this.selectedStartDate = date;
        } else {
          this.selectedEndDate = date;
        }
      }
    },
    startEditing() {
      this.isEditing = true;
      this.originalSettings = {
        startDay: this.startDay,
        endDay: this.endDay,
        includeWeekoffs: this.includeWeekoffs,
        includeHolidays: this.includeHolidays,
      };
    },
    saveSettings() {
      this.isEditing = false;
      console.log("Saving settings:", {
        isCustomCycle: this.isCustomCycle,
        startDay: this.startDay,
        endDay: this.endDay,
        includeWeekoffs: this.includeWeekoffs,
        includeHolidays: this.includeHolidays,
      });
    },
    cancelEditing() {
      this.isEditing = false;
      if (this.originalSettings) {
        this.startDay = this.originalSettings.startDay;
        this.endDay = this.originalSettings.endDay;
        this.includeWeekoffs = this.originalSettings.includeWeekoffs;
        this.includeHolidays = this.originalSettings.includeHolidays;
      }
    },
  },
};
</script>

<style scoped>
.attendance-settings {
  font-family: Arial, sans-serif;
}

.settings-container {
  max-width: 600px;
}

.date-select {
  width: 100px;
}

/* Calendar Styles */
.calendar-wrapper {
  background: #f8f7fa;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  max-width: 400px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-header {
  text-align: center;
  font-weight: 500;
  color: #666;
  padding: 4px 0;
  font-size: 12px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  font-size: 12px;
  min-width: 28px;
  min-height: 28px;
  padding: 0;
}

.cycle-month-selector {
  margin-bottom: 12px;
}

.cycle-month-selector .text-h6 {
  font-size: 1rem;
}

.calendar-day:not(.disabled):hover {
  background: rgba(0, 0, 0, 0.05);
}

.calendar-day.selected {
  background: black;
  color: white;
}

.calendar-day.disabled {
  visibility: hidden;
}

.calendar-day.current {
  border: 2px solid #666;
}

/* Toggle Styles */
.toggle-item {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: black;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

/* Custom Edit Button */
.edit-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.edit-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* Custom Settings */
.custom-settings {
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

/* New styles for layout */
.cycle-content-wrapper {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.calendar-section {
  flex: 1;
}

.cycle-toggles {
  padding-top: 45px;
  border-top: none;
  min-width: 160px;
}

:deep(.v-btn) {
  text-transform: none;
}
</style>
