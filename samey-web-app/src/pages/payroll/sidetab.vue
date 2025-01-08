<template>
  <div class="edit-payroll">
    <!-- Header -->

    <!-- Main Content -->
    <div class="pa-4">
      <v-tabs v-model="activeTab" color="black" align-tabs="start" class="mb-4">
        <v-tab value="salary" class="text-body-2">
          <v-icon start class="mr-2">mdi-currency-usd</v-icon>
          Salary Settings
        </v-tab>
        <v-tab value="attendance" class="text-body-2">
          <v-icon start class="mr-2">mdi-calendar-clock</v-icon>
          Attendance Settings
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Salary Settings Tab -->
        <v-window-item value="salary">
          <v-form @submit.prevent="savePayroll">
            <!-- Basic Information -->
            <v-card>
              <v-card-title class="text-h6 font-weight-medium mb-2"
                >Basic Information</v-card-title
              >
              <v-text-field
                v-model="localData.basicSalary"
                label="Basic Salary"
                type="number"
                prefix="₹"
                variant="outlined"
                density="compact"
                :rules="[(v) => !!v || 'Basic salary is required']"
                @input="calculateSalaryComponents"
                class="mb-2"
              />
            </v-card>

            <!-- Salary Components -->
            <v-card>
              <v-card-title class="text-h6 font-weight-medium mb-2">
                <div class="d-flex justify-space-between align-center">
                  <span>Salary Components</span>
                  <v-switch
                    v-model="showAdvancedSettings"
                    color="black"
                    hide-details
                    density="compact"
                    class="ma-0"
                    label="Advanced"
                  />
                </div>
              </v-card-title>

              <v-row>
                <!-- Earnings Column -->
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="salary-column">
                    <v-card-title
                      class="text-subtitle-2 font-weight-medium px-4 py-2 bg-grey-lighten-4"
                    >
                      Earnings
                    </v-card-title>
                    <v-card-text class="px-4 py-2">
                      <!-- Basic Pay (Always Visible) -->
                      <v-text-field
                        v-model="localData.basicPay"
                        label="Basic Pay (67%)"
                        type="number"
                        prefix="₹"
                        variant="outlined"
                        density="compact"
                        :value="calculateBasicPay"
                        readonly
                        class="mb-2"
                      />

                      <v-expand-transition>
                        <div v-if="showAdvancedSettings">
                          <!-- HRA -->
                          <v-text-field
                            v-model="localData.hra"
                            label="HR Allowance (30%)"
                            type="number"
                            prefix="₹"
                            variant="outlined"
                            density="compact"
                            :value="calculateHRA"
                            readonly
                            class="mb-2"
                          />

                          <!-- Additional Earnings -->
                          <div
                            class="d-flex justify-space-between align-center mb-2"
                          >
                            <div class="text-caption">Additional Earnings</div>
                            <v-btn
                              color="black"
                              variant="text"
                              density="compact"
                              size="small"
                              @click="addAllowance"
                            >
                              Add
                            </v-btn>
                          </div>

                          <div
                            v-if="allowances.length > 0"
                            class="allowances-list"
                          >
                            <v-list lines="one" class="pa-0">
                              <v-list-item
                                v-for="(item, index) in allowances"
                                :key="'allowance-' + index"
                                :title="item.name"
                                :subtitle="`₹${item.amount}`"
                                density="compact"
                              >
                                <template v-slot:append>
                                  <v-btn
                                    icon="mdi-delete"
                                    variant="text"
                                    color="error"
                                    size="small"
                                    @click="removeAllowance(index)"
                                  />
                                </template>
                              </v-list-item>
                            </v-list>
                          </div>
                        </div>
                      </v-expand-transition>

                      <!-- Total Earnings -->
                      <v-divider class="my-2" />
                      <div
                        class="d-flex justify-space-between align-center pa-2 bg-grey-lighten-4"
                      >
                        <span class="text-caption font-weight-medium"
                          >Total Earnings</span
                        >
                        <span class="text-subtitle-2 font-weight-bold"
                          >₹{{ totalEarnings }}</span
                        >
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Deductions Column -->
                <v-col cols="12" md="6">
                  <v-card variant="outlined" class="salary-column">
                    <v-card-title
                      class="text-subtitle-2 font-weight-medium px-4 py-2 bg-grey-lighten-4"
                    >
                      Deductions
                    </v-card-title>
                    <v-card-text class="px-4 py-2">
                      <v-expand-transition>
                        <div v-if="showAdvancedSettings">
                          <!-- PF (Only visible when advanced settings are enabled) -->
                          <v-text-field
                            v-model="localData.pf"
                            label="PF (3%)"
                            type="number"
                            prefix="₹"
                            variant="outlined"
                            density="compact"
                            :value="calculatePF"
                            readonly
                            class="mb-2"
                          />

                          <!-- Tax -->
                          <v-text-field
                            v-model="localData.tax"
                            label="Tax"
                            type="number"
                            prefix="₹"
                            variant="outlined"
                            density="compact"
                            class="mb-2"
                          />

                          <!-- Additional Deductions -->
                          <div
                            class="d-flex justify-space-between align-center mb-2"
                          >
                            <div class="text-caption">
                              Additional Deductions
                            </div>
                            <v-btn
                              color="black"
                              variant="text"
                              density="compact"
                              size="small"
                              @click="addDeduction"
                            >
                              Add
                            </v-btn>
                          </div>

                          <div
                            v-if="deductions.length > 0"
                            class="deductions-list"
                          >
                            <v-list lines="one" class="pa-0">
                              <v-list-item
                                v-for="(item, index) in deductions"
                                :key="'deduction-' + index"
                                :title="item.name"
                                :subtitle="`₹${item.amount}`"
                                density="compact"
                              >
                                <template v-slot:append>
                                  <v-btn
                                    icon="mdi-delete"
                                    variant="text"
                                    color="error"
                                    size="small"
                                    @click="removeDeduction(index)"
                                  />
                                </template>
                              </v-list-item>
                            </v-list>
                          </div>
                        </div>
                      </v-expand-transition>

                      <!-- Total Deductions -->
                      <v-divider class="my-2" />
                      <div
                        class="d-flex justify-space-between align-center pa-2 bg-grey-lighten-4"
                      >
                        <span class="text-caption font-weight-medium"
                          >Total Deductions</span
                        >
                        <span class="text-subtitle-2 font-weight-bold"
                          >₹{{ totalDeductions }}</span
                        >
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Net Salary -->
              <v-card variant="outlined" class="mt-4">
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <div class="text-subtitle-1 font-weight-medium">
                        Net Salary
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Total Earnings - Total Deductions
                      </div>
                    </div>
                    <div class="text-h5 font-weight-bold">₹{{ netSalary }}</div>
                  </div>
                </v-card-text>
              </v-card>
            </v-card>

            <!-- Action Buttons -->
            <div class="d-flex justify-end mt-4">
              <v-btn
                color="error"
                variant="outlined"
                @click="cancelEdit"
                class="mr-2"
              >
                Cancel
              </v-btn>
              <v-btn color="black" @click="savePayroll"> Save Changes </v-btn>
            </div>
          </v-form>
        </v-window-item>

        <!-- Attendance Settings Tab -->
        <v-window-item value="attendance">
          <v-card variant="outlined" class="pa-4">
            <v-card-title class="text-h6 font-weight-medium mb-4"
              >Attendance Configuration</v-card-title
            >
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="localData.workingDays"
                  label="Working Days per Month"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="localData.workingHours"
                  label="Working Hours per Day"
                  type="number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="localData.overtimeRate"
                  :items="overtimeRates"
                  label="Overtime Rate"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="localData.leavePolicy"
                  :items="leavePolicies"
                  label="Leave Policy"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <v-card-title class="text-h6 font-weight-medium mb-4"
              >Paid Leave Allocation</v-card-title
            >
            <v-row>
              <v-col
                cols="12"
                v-for="(leaveType, index) in localData.paidLeaveTypes"
                :key="index"
              >
                <v-card variant="outlined" class="pa-2">
                  <v-row align="center" no-gutters>
                    <v-col cols="8">
                      <v-card-title class="text-subtitle-1">{{
                        leaveType.name
                      }}</v-card-title>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="leaveType.count"
                        type="number"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="mt-1"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-window-item>
      </v-window>
    </div>

    <!-- Add Allowance Dialog -->
    <v-dialog v-model="allowanceDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6 px-4 py-3 bg-grey-lighten-4">
          Add New Earnings
        </v-card-title>
        <v-card-text class="px-4 py-3">
          <v-text-field
            v-model="newAllowance.name"
            label="Description"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          <v-text-field
            v-model="newAllowance.amount"
            label="Amount"
            type="number"
            prefix="₹"
            variant="outlined"
            density="compact"
          />
        </v-card-text>
        <v-card-actions class="px-4 py-3">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="allowanceDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="black" @click="saveAllowance"> Add </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Deduction Dialog -->
    <v-dialog v-model="deductionDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6 px-4 py-3 bg-grey-lighten-4">
          Add New Deduction
        </v-card-title>
        <v-card-text class="px-4 py-3">
          <v-text-field
            v-model="newDeduction.name"
            label="Description"
            variant="outlined"
            density="compact"
            class="mb-3"
          />
          <v-text-field
            v-model="newDeduction.amount"
            label="Amount"
            type="number"
            prefix="₹"
            variant="outlined"
            density="compact"
          />
        </v-card-text>
        <v-card-actions class="px-4 py-3">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deductionDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn color="black" @click="saveDeduction"> Add </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "EditPayrollInline",
  

  props: {
    employeeData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      activeTab: "salary",
      showAdvancedSettings: false,
      allowanceDialog: false,
      deductionDialog: false,
      localData: {
        id: null,
        name: "",
        basicSalary: 0,
        basicPay: 0,
        hra: 0,
        pf: 0,
        tax: 0,
        workingDays: 22,
        workingHours: 8,
        overtimeRate: "1.5x",
        leavePolicy: "Standard",
        paidLeaveTypes: [
          { name: "Annual Leave", count: 20 },
          { name: "Sick Leave", count: 10 },
          { name: "Personal Leave", count: 5 },
        ],
      },
      allowances: [],
      deductions: [],
      newAllowance: {
        name: "",
        amount: 0,
      },
      newDeduction: {
        name: "",
        amount: 0,
      },
      overtimeRates: ["1.5x", "2x", "2.5x"],
      leavePolicies: ["Standard", "Flexible", "Unlimited"],
    };
  },

  computed: {
    calculateBasicPay() {
      return this.localData.basicSalary * 0.67;
    },

    calculateHRA() {
      return this.localData.basicSalary * 0.3;
    },

    calculatePF() {
      return this.localData.basicSalary * 0.03;
    },

    totalEarnings() {
      const baseEarnings = this.calculateBasicPay + this.calculateHRA;
      const additionalAllowances = this.allowances.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      return (baseEarnings + additionalAllowances).toFixed(2);
    },

    totalDeductions() {
      const baseDeductions = this.calculatePF + Number(this.localData.tax);
      const additionalDeductions = this.deductions.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      return (baseDeductions + additionalDeductions).toFixed(2);
    },

    netSalary() {
      return (
        Number(this.totalEarnings) - Number(this.totalDeductions)
      ).toFixed(2);
    },
  },

  watch: {
    employeeData: {
      handler(newVal) {
        if (newVal) {
          this.localData = {
            id: newVal.id,
            name: newVal.name || "",
            basicSalary: parseFloat(newVal.basicSalary) || 0,
            basicPay: parseFloat(newVal.basicPay) || 0,
            hra: parseFloat(newVal.hra) || 0,
            pf: parseFloat(newVal.pf) || 0,
            tax: parseFloat(newVal.tax) || 0,
            workingDays: newVal.workingDays || 22,
            workingHours: newVal.workingHours || 8,
            overtimeRate: newVal.overtimeRate || "1.5x",
            leavePolicy: newVal.leavePolicy || "Standard",
            paidLeaveTypes: newVal.paidLeaveTypes || [
              { name: "Annual Leave", count: 20 },
              { name: "Sick Leave", count: 10 },
              { name: "Personal Leave", count: 5 },
            ],
          };
          this.allowances = newVal.allowances || [];
          this.deductions = newVal.deductions || [];
        }
      },
      immediate: true,
    },
  },

  methods: {
    addAllowance() {
      this.allowanceDialog = true;
    },

    addDeduction() {
      this.deductionDialog = true;
    },

    saveAllowance() {
      if (this.newAllowance.name && this.newAllowance.amount) {
        this.allowances.push({ ...this.newAllowance });
        this.newAllowance = { name: "", amount: 0 };
        this.allowanceDialog = false;
      }
    },

    saveDeduction() {
      if (this.newDeduction.name && this.newDeduction.amount) {
        this.deductions.push({ ...this.newDeduction });
        this.newDeduction = { name: "", amount: 0 };
        this.deductionDialog = false;
      }
    },

    removeAllowance(index) {
      this.allowances.splice(index, 1);
    },

    removeDeduction(index) {
      this.deductions.splice(index, 1);
    },

    calculateSalaryComponents() {
      this.localData.basicPay = this.calculateBasicPay;
      this.localData.hra = this.calculateHRA;
      this.localData.pf = this.calculatePF;
    },

    savePayroll() {
      const payrollData = {
        id: this.localData.id,
        name: this.localData.name,
        basicSalary: this.localData.basicSalary,
        basicPay: this.calculateBasicPay,
        hra: this.calculateHRA,
        pf: this.calculatePF,
        tax: this.localData.tax,
        allowances: this.allowances,
        deductions: this.deductions,
        totalEarnings: this.totalEarnings,
        totalDeductions: this.totalDeductions,
        netSalary: this.netSalary,
        workingDays: this.localData.workingDays,
        workingHours: this.localData.workingHours,
        overtimeRate: this.localData.overtimeRate,
        leavePolicy: this.localData.leavePolicy,
        paidLeaveTypes: this.localData.paidLeaveTypes,
      };
      this.$emit("save", payrollData);
    },

    cancelEdit() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.edit-payroll {
  background-color: white;
  min-height: 100vh;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.salary-column {
  height: 100%;
  border-radius: 4px;
}

:deep(.v-list) {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-card-title) {
  letter-spacing: 0.0125em;
}

:deep(.v-card) {
  border-radius: 4px;
}

:deep(.v-text-field .v-input__details) {
  padding-inline-start: 16px;
}

.allowances-list,
.deductions-list {
  max-height: 200px;
  overflow-y: auto;
}
</style>
