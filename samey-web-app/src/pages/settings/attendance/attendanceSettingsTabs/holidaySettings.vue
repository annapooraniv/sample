<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h6 font-weight-bold mb-4">
        Holiday Settings
      </v-card-title>

      <v-card-text>
        <v-switch
          v-model="selected"
          :label="selected === 'fixed' ? 'Fixed Holidays' : 'Custom Holidays'"
          :true-value="'custom'"
          :false-value="'fixed'"
          color="black"
          inset
          dense
          hide-details
          class="custom-switch"
        ></v-switch>

        <v-expand-transition>
          <div v-if="selected === 'fixed'" class="mt-4">
            <v-sheet class="overflow-y-auto" max-height="400px">
              <v-list>
                <v-list-item
                  v-for="(holiday, index) in fixedHolidays"
                  :key="index"
                  class="holiday-row"
                >
                  <div class="d-flex align-center justify-space-between w-100">
                    <span class="holiday-name text-subtitle-1">{{
                      holiday.name
                    }}</span>
                    <span class="holiday-date mx-4 text-subtitle-1">{{
                      formatDate(holiday.date)
                    }}</span>
                    <v-chip
                      :color="getHolidayColor(index)"
                      text-color="white"
                      small
                    >
                      {{ getMonthName(holiday.date) }}
                    </v-chip>
                  </div>
                </v-list-item>
              </v-list>
            </v-sheet>
          </div>
        </v-expand-transition>

        <v-expand-transition>
          <div v-if="selected === 'custom'" class="mt-4">
            <v-btn color="black" @click="openAddDialog" class="mb-4">
              <v-icon left>mdi-plus</v-icon>
              Add Holiday
            </v-btn>

            <v-data-table
              :headers="headers"
              :items="customHolidays"
              class="mt-4 custom-table"
              :hide-default-footer="true"
            >
              <template v-slot:item.date="{ item }">
                <span class="text-subtitle-1">{{ formatDate(item.date) }}</span>
              </template>
              <template v-slot:item.name="{ item }">
                <span class="text-subtitle-1">{{ item.name }}</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editHoliday(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteHoliday(item)"> mdi-delete </v-icon>
              </template>
            </v-data-table>

            <!-- Add/Edit Dialog -->
            <v-dialog v-model="dialog" max-width="400px">
              <v-card>
                <v-card-title class="text-h6 pa-4">
                  {{ formTitle }}
                </v-card-title>

                <v-card-text class="pt-4">
                  <v-text-field
                    v-model="editedItem.name"
                    label="Holiday Name"
                    outlined
                    dense
                  ></v-text-field>

                  <v-text-field
                    v-model="editedItem.date"
                    label="Date"
                    type="date"
                    outlined
                    dense
                  ></v-text-field>
                </v-card-text>

                <v-card-actions class="pa-4 pt-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    style="background-color: black"
                    color="white"
                    text
                    @click="close"
                    >CANCEL</v-btn
                  >
                  <v-btn
                    text
                    @click="save"
                    :disabled="!editedItem.name"
                    style="background-color: black"
                    color="white"
                    >SAVE</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- Delete Dialog -->
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5 grey lighten-2 py-4">
                  Delete Holiday
                </v-card-title>
                <v-card-text class="pt-5 pb-5">
                  Are you sure you want to delete this holiday?
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    style="background-color: black"
                    color="white"
                    text
                    @click="closeDelete"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    style="background-color: black"
                    color="white"
                    @click="deleteItemConfirm"
                  >
                    Delete
                  </v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "HolidaySettings",
  data() {
    return {
      valid: true,
      selected: "fixed",
      dialog: false,
      dialogDelete: false,
      dateMenu: false,
      headers: [
        {
          text: "Holiday Name",
          value: "name",
          class: "text-subtitle-1 font-weight-bold",
        },
        {
          text: "Date",
          value: "date",
          class: "text-subtitle-1 font-weight-bold",
        },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          class: "text-subtitle-1 font-weight-bold",
        },
      ],
      fixedHolidays: [
        { name: "New Year's Day", date: "2024-01-01" },
        { name: "Republic Day", date: "2024-01-26" },
        { name: "Holi", date: "2024-03-25" },
        { name: "Good Friday", date: "2024-03-29" },
        { name: "Eid al-Fitr", date: "2024-04-11" },
        { name: "Independence Day", date: "2024-08-15" },
        { name: "Gandhi Jayanti", date: "2024-10-02" },
        { name: "Dussehra", date: "2024-10-12" },
        { name: "Diwali", date: "2024-11-01" },
        { name: "Eid al-Adha", date: "2024-06-17" },
        { name: "Christmas", date: "2024-12-25" },
        { name: "Buddha Purnima", date: "2024-05-23" },
      ],
      customHolidays: [],
      editedIndex: -1,
      editedItem: {
        name: "",
        date: "",
      },
      defaultItem: {
        name: "",
        date: "",
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add Holiday" : "Edit Holiday";
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    getMonthName(date) {
      return new Date(date).toLocaleString("default", { month: "short" });
    },
    getHolidayColor(index) {
      const colors = [
        "red",
        "pink",
        "purple",
        "deep-purple",
        "indigo",
        "blue",
        "light-blue",
        "cyan",
        "teal",
        "green",
        "light-green",
        "lime",
      ];
      return colors[index % colors.length];
    },
    openAddDialog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialog = true;
    },
    editHoliday(item) {
      this.editedIndex = this.customHolidays.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteHoliday(item) {
      this.editedIndex = this.customHolidays.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.customHolidays.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedItem.name) {
        if (this.editedIndex > -1) {
          Object.assign(this.customHolidays[this.editedIndex], this.editedItem);
        } else {
          this.customHolidays.push(this.editedItem);
        }
        this.close();
      }
    },
  },
};
</script>

<style scoped>
.holiday-row {
  padding: 8px 16px;
}
.holiday-name {
  min-width: 150px;
}
.holiday-date {
  color: rgba(0, 0, 0, 0.6);
}
.custom-switch {
  margin-top: 8px;
}
.v-input--switch {
  margin-top: 0;
}
.custom-table {
  font-size: 1.1rem;
}
.v-data-table >>> .v-data-table__wrapper > table > thead > tr > th {
  font-size: 1rem !important;
}
.v-data-table >>> .v-data-table__wrapper > table > tbody > tr > td {
  font-size: 1rem !important;
}
</style>
