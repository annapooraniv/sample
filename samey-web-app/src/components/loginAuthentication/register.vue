<template>
  <!-- Keep the existing template code unchanged -->
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Left side -->
      <div class="left-side">
        <h2 class="main-heading">Create Account</h2>
        <h3 class="sub-heading">Join Samay Web Application</h3>
        <div class="animation-wrapper"></div>
      </div>

      <!-- Right side with registration steps -->
      <div class="right-side">
        <div class="form-container">
          <!-- Progress indicator -->
          <div class="progress-steps">
            <div
              v-for="step in 2"
              :key="step"
              :class="['step', { active: step <= currentStep }]"
            ></div>
          </div>

          <!-- Form -->
          <v-form ref="form">
            <!-- Step 1: Tenant Details -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="form-title">Company Details</h2>
              <v-text-field
                v-model="tenantForm.tenantName"
                label="Company Name"
                variant="outlined"
                density="comfortable"
                :rules="requiredRule"
              ></v-text-field>

              <v-text-field
                v-model="tenantForm.panOrGst"
                label="PAN/GST Number"
                variant="outlined"
                density="comfortable"
                :rules="[
                  ...requiredRule,
                  (v) =>
                    !isDuplicateIdentifier ||
                    'This PAN/GST is already registered',
                ]"
                @blur="checkDuplicateIdentifier"
              ></v-text-field>

              <div class="error-message" v-if="tenantError">
                {{ tenantError }}
              </div>
            </div>

            <!-- Step 2: User Details -->
            <div v-if="currentStep === 2" class="step-content">
              <h2 class="form-title">Personal Details</h2>
              <v-text-field
                v-model="userForm.first_name"
                label="Full Name"
                variant="outlined"
                density="comfortable"
                :rules="requiredRule"
              ></v-text-field>

              <v-text-field
                v-model="userForm.email"
                label="Email"
                variant="outlined"
                density="comfortable"
                :rules="emailRules"
                type="email"
              ></v-text-field>

              <div class="phone-input">
                <v-text-field
                  v-model="userForm.phone"
                  label="Phone Number"
                  variant="outlined"
                  density="comfortable"
                  :rules="phoneRules"
                  type="tel"
                  prefix="+91"
                ></v-text-field>
              </div>

              <v-text-field
                v-model="userForm.employeeId"
                label="Employee ID"
                variant="outlined"
                density="comfortable"
                :rules="requiredRule"
              ></v-text-field>

              <v-text-field
                v-model="userForm.pan"
                label="PAN Number"
                variant="outlined"
                density="comfortable"
                :rules="[...requiredRule, (v) => validatePAN(v)]"
              ></v-text-field>

              <v-text-field
                v-model="userForm.gst"
                label="GST Number"
                variant="outlined"
                density="comfortable"
                :rules="[...requiredRule, (v) => validateGST(v)]"
              ></v-text-field>

              <div class="error-message" v-if="userError">
                {{ userError }}
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="button-group">
              <v-btn
                v-if="currentStep > 1"
                variant="outlined"
                size="large"
                @click="prevStep"
                class="navigation-btn"
              >
                Back
              </v-btn>

              <v-btn
                block
                size="large"
                :loading="loading"
                @click="handleStep"
                class="submit-btn"
                :style="currentStep > 1 ? 'max-width: calc(100% - 120px)' : ''"
              >
                {{ currentStep === 1 ? "Continue" : "Create Account" }}
              </v-btn>
            </div>

            <p class="sign-in-text">
              Already have an account?
              <router-link to="/login" class="sign-in-link"
                >Sign in</router-link
              >
            </p>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "vue-router";

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default {
  name: "Register",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      currentStep: 1,
      loading: false,
      tenantError: "",
      userError: "",
      isDuplicateIdentifier: false,
      generatedTenantId: null,
      generatedUUID: null,
      tenantForm: {
        tenantName: "",
        panOrGst: "",
      },
      userForm: {
        first_name: "",
        email: "",
        phone: "",
        employeeId: "",
        pan: "",
        gst: "",
      },
      requiredRule: [(v) => !!v || "This field is required"],
      emailRules: [
        (v) => !!v || "Email is required",
        (v) => /.+@.+\..+/.test(v) || "Email must be valid",
      ],
      phoneRules: [
        (v) => !!v || "Phone number is required",
        (v) => /^\d{10}$/.test(v) || "Phone number must be 10 digits",
      ],
    };
  },
  methods: {
    validatePAN(pan) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return panRegex.test(pan) || "Invalid PAN format";
    },

    validateGST(gst) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      return gstRegex.test(gst) || "Invalid GST format";
    },

    async checkDuplicateIdentifier() {
      if (!this.tenantForm.panOrGst) return;

      try {
        const response = await api.get("/items/tenant", {
          params: {
            filter: {
              panOrGst: {
                _eq: this.tenantForm.panOrGst,
              },
            },
          },
        });

        if (response.data && response.data.data) {
          this.isDuplicateIdentifier = response.data.data.length > 0;
        }
      } catch (error) {
        console.error("Error checking identifier:", error);
        this.isDuplicateIdentifier = false;
      }
    },

    async validateStep() {
      if (!this.$refs.form) return false;
      const { valid } = await this.$refs.form.validate();
      return valid;
    },

    async handleStep() {
      if (!(await this.validateStep())) return;

      if (this.currentStep === 1) {
        this.currentStep = 2;
      } else {
        await this.saveAllDetails();
      }
    },

    async saveAllDetails() {
      this.loading = true;
      this.tenantError = "";
      this.userError = "";

      try {
        // Check for duplicate identifier first
        await this.checkDuplicateIdentifier();
        if (this.isDuplicateIdentifier) {
          this.tenantError = "This PAN/GST is already registered";
          this.currentStep = 1; // Go back to first step
          return;
        }

        // Generate UUID
        this.generatedUUID = uuidv4();

        // Save tenant details
        const tenantResponse = await api.post("/items/tenant", {
          status: "active",
          tenantId: this.generatedUUID,
          tenantName: this.tenantForm.tenantName,
          panOrGst: this.tenantForm.panOrGst,
        });

        if (!tenantResponse.data || !tenantResponse.data.data) {
          throw new Error("Tenant registration failed");
        }

        this.generatedTenantId = tenantResponse.data.data.id;

        // Save user details
        const userPayload = {
          status: "active",
          employeeId: this.userForm.employeeId,
          uniqueId: `${this.generatedUUID}-${this.userForm.employeeId}`,
          assignedUser: {
            first_name: this.userForm.first_name,
            email: this.userForm.email,
            phone: "+91" + this.userForm.phone,
            password: this.userForm.phone,
            role: "ea2303aa-1662-43ca-a7f7-ab84924a7e0a",
            tenant: this.generatedUUID,
            pan: this.userForm.pan,
            gst: this.userForm.gst,
          },
        };

        const userResponse = await api.post(
          "/items/personalModule",
          userPayload
        );

        if (!userResponse.data) {
          // If user registration fails, we should handle the cleanup
          await api.delete(`/items/tenant/${this.generatedTenantId}`);
          throw new Error("User registration failed");
        }

        // If both succeed, redirect to verification
        this.router.push("/verification");
      } catch (error) {
        console.error("Registration error:", error);
        if (error.message === "Tenant registration failed") {
          this.tenantError = "Company registration failed. Please try again.";
          this.currentStep = 1;
        } else {
          this.userError =
            "Personal details registration failed. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  color: #ff5252;
  font-size: 0.875rem;
  margin-top: 8px;
}

.phone-input {
  position: relative;
}

.login-wrapper {
  min-height: 100vh;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: flex;
  background: var(--background-color);
  border-radius: 24px;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.left-side {
  flex: 1;
  background: var(--theme-color);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
}

.animation-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.animation-image {
  max-width: 300px;
  height: auto;
}

.right-side {
  flex: 1;
  padding: 3rem;
  display: flex;
  align-items: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.progress-steps {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0;
}

.step {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e0e0e0;
  transition: all 0.3s ease;
}

.step.active {
  background-color: var(--theme-color);
}

.main-heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.sub-heading {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.button-group {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.navigation-btn {
  width: 100px;
}

.submit-btn {
  background-color: var(--theme-color) !important;
  color: var(--white);
}

.sign-in-text {
  text-align: center;
  margin-top: 24px;
  color: #666;
}

.sign-in-link {
  color: var(--theme-color);
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 960px) {
  .login-container {
    flex-direction: column;
  }

  .left-side {
    padding: 2rem;
  }

  .right-side {
    padding: 2rem;
  }

  .button-group {
    flex-direction: column-reverse;
  }

  .navigation-btn {
    width: 100%;
  }

  .submit-btn {
    max-width: 100% !important;
  }
}
</style>
