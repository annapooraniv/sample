<template>
  <div class="pa-4">
    <!-- Early Leaving Policy -->
    <div class="mb-6">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="text-subtitle-1 font-weight-medium">
          Early Leaving Policy
        </div>
        <div v-if="!earlyLeaving.editing">
          <v-btn icon small @click="startEditing('earlyLeaving')">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <div v-else class="d-flex gap-2">
          <v-btn icon small color="black" @click="saveEdit('earlyLeaving')">
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn icon small @click="cancelEdit('earlyLeaving')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="d-flex align-center mb-4">
        <v-radio-group
          v-model="earlyLeaving.fineType"
          inline
          hide-details
          class="mt-0"
          :readonly="!earlyLeaving.editing"
        >
          <v-radio label="Daily" value="daily" color="black"></v-radio>
          <v-radio label="Hourly" value="hourly" color="black"></v-radio>
        </v-radio-group>
      </div>

      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="earlyLeaving.gracePeriod"
            label="Grace Period (mins)"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
            :readonly="!earlyLeaving.editing"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="earlyLeaving.fineAmount"
            label="Fine Amount"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
            :readonly="!earlyLeaving.editing"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="earlyLeaving.waiveOffDays"
            label="Waive Off Days"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
            :readonly="!earlyLeaving.editing"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <!-- Late Coming Policy -->
    <div class="mb-6">
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="text-subtitle-1 font-weight-medium">Late Coming Policy</div>
        <div v-if="!latecoming.editing">
          <v-btn icon small @click="startEditing('latecoming')">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <div v-else class="d-flex gap-2">
          <v-btn icon small color="black" @click="saveEdit('latecoming')">
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn icon small @click="cancelEdit('latecoming')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="d-flex align-center mb-4">
        <v-radio-group
          v-model="latecoming.fineType"
          inline
          hide-details
          class="mt-0"
          :readonly="!latecoming.editing"
        >
          <v-radio label="Daily" value="daily" color="black"></v-radio>
          <v-radio label="Hourly" value="hourly" color="black"></v-radio>
        </v-radio-group>
      </div>

      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="latecoming.gracePeriod"
            label="Grace Period (mins)"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
            :readonly="!latecoming.editing"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="latecoming.fineAmount"
            label="Fine Amount"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
            :readonly="!latecoming.editing"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="latecoming.waiveOffDays"
            label="Waive Off Days"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-3"
            :readonly="!latecoming.editing"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>

    <!-- Overtime Policy -->
    <div>
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="text-subtitle-1 font-weight-medium">Overtime Policy</div>
        <div v-if="!overtime.editing">
          <v-btn icon small @click="startEditing('overtime')">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
        <div v-else class="d-flex gap-2">
          <v-btn icon small color="black" @click="saveEdit('overtime')">
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn icon small @click="cancelEdit('overtime')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
      <v-row>
        <v-col cols="3">
          <v-text-field
            v-model="overtime.gracePeriod"
            label="Grace Period (mins)"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            :readonly="!overtime.editing"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="overtime.extraHoursPay"
            label="Extra Hours Pay"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            :readonly="!overtime.editing"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="overtime.publicHolidayPay"
            label="Public Holiday Pay"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            :readonly="!overtime.editing"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="overtime.weekOffPay"
            label="Week Off Pay"
            type="number"
            variant="outlined"
            density="comfortable"
            hide-details
            :readonly="!overtime.editing"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "PenaltySettings",
  data() {
    return {
      earlyLeaving: {
        fineType: "daily",
        gracePeriod: "120",
        fineAmount: "200",
        waiveOffDays: "3",
        editing: false,
        originalData: {},
      },
      latecoming: {
        fineType: "hourly",
        gracePeriod: "120",
        fineAmount: "200",
        waiveOffDays: "2",
        editing: false,
        originalData: {},
      },
      overtime: {
        gracePeriod: "120",
        extraHoursPay: "5",
        publicHolidayPay: "1",
        weekOffPay: "1",
        editing: false,
        originalData: {},
      },
    };
  },
  methods: {
    startEditing(section) {
      this[section].editing = true;
      this[section].originalData = JSON.parse(JSON.stringify(this[section]));
    },
    saveEdit(section) {
      this[section].editing = false;
      // Here you would typically save the changes to your backend
    },
    cancelEdit(section) {
      Object.assign(this[section], this[section].originalData);
      this[section].editing = false;
    },
  },
};
</script>

<style>
.gap-2 {
  gap: 8px;
}
</style>
