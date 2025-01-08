/ src/components/loginAuthentication/Login.vue
<template>
  <div class="login-wrapper">
    <div class="login-container">
      <!-- Left side with Lottie animation -->
      <div class="left-side">
        <h2 class="main-heading">Welcome to Samay</h2>
        <h3 class="sub-heading">Web Application</h3>
        <div class="animation-wrapper">
          <dotlottie-player
            src="https://lottie.host/e4dafee6-4b5c-4185-bd27-5e968b34789b/XGfDOe4uzv.lottie"
            background="transparent"
            speed="1"
            class="lottie-player"
            loop
            autoplay
          ></dotlottie-player>
        </div>
      </div>

      <!-- Right side with login form -->
      <div class="right-side">
        <div class="form-container">
          <h2 class="form-title">Sign In</h2>

          <v-form @submit.prevent="handleSubmit">
            <div class="input-group">
              <v-row class="phone-row">
                <v-col class="country-col">
                  <v-select
                    v-model="countryCode"
                    :items="countryCodes"
                    item-title="code"
                    item-value="code"
                    variant="outlined"
                    density="comfortable"
                    class="country-select"
                  ></v-select>
                </v-col>
                <v-col class="phone-input-col">
                  <v-text-field
                    v-model="phoneNumber"
                    label="Enter phone number"
                    variant="outlined"
                    density="comfortable"
                    type="tel"
                    :rules="phoneRules"
                    class="phone-input"
                    :error-messages="phoneError"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <v-btn
              block
              size="large"
              type="submit"
              :loading="loading"
              class="submit-btn"
            >
              Get Verification Code
            </v-btn>

            <div class="divider">
              <span>OR</span>
            </div>

            <div class="social-buttons">
              <v-btn class="google-btn" variant="outlined" block>
                <img
                  src="/images/Logo-google-icon.png"
                  alt="Google Icon"
                  class="google-icon"
                />
                <span class="google-btn-text">Sign in with Google</span>
              </v-btn>
            </div>

            <p class="sign-up-text">
              Don't have an account?
              <router-link to="/register" class="sign-up-link"
                >Sign up</router-link
              >
            </p>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authService } from "@/services/authService";

export default {
  name: "Login",
  data() {
    return {
      countryCode: "+91",
      phoneNumber: "",
      loading: false,
      phoneError: "",
      countryCodes: [{ code: "+91", flag: "🇮🇳" }],
      phoneRules: [
        (v) => !!v || "Phone number is required",
        (v) => /^\d{10}$/.test(v) || "Phone number must be 10 digits",
      ],
    };
  },

  mounted() {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
    script.type = "module";
    document.head.appendChild(script);
  },

  methods: {
    async handleSubmit() {
      this.phoneError = "";

      // Validate phone number
      if (!this.phoneNumber) {
        this.phoneError = "Phone number is required";
        return;
      }

      if (!/^\d{10}$/.test(this.phoneNumber)) {
        this.phoneError = "Phone number must be 10 digits";
        return;
      }

      this.loading = true;

      try {
        // Construct the full phone number
        const fullPhoneNumber = this.countryCode + this.phoneNumber;

        // Check if phone exists
        const phoneExists = await authService.checkPhoneExists(fullPhoneNumber);

        if (phoneExists) {
          // Generate OTP - pass the phone number without country code
          const otpResponse = await authService.generateOtp(this.phoneNumber);
          if (otpResponse.otp_session_uuid) {
            this.$router.push({
              name: "Verification",
              params: { phoneNumber: fullPhoneNumber },
            });
          } else {
            this.phoneError = "Failed to generate OTP. Please try again.";
          }
        } else {
          this.phoneError =
            "This phone number is not registered. Please sign up first.";
        }
      } catch (error) {
        console.error("Login error:", error);
        this.phoneError = "An error occurred. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    async handleGoogleSignIn() {
      try {
        const response = await api.post("/auth/google");
        console.log("Google Sign In response:", response);
      } catch (error) {
        console.error("Google Sign In error:", error);
        this.$toast.error("Google Sign In failed. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  /* background-image: url("../../../public/images/background.png"); */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: flex;
  background: var(--text-color);
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

.animation-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottie-player {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.right-side {
  flex: 1;
  padding: 3rem;
  display: flex;
  align-items: center;
}

.logo-container {
  text-align: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.phone-row {
  margin: 0 -8px;
}

.country-col {
  padding: 0 8px;
  flex: 0 0 120px;
}

.phone-input-col {
  padding: 0 8px;
  flex: 1;
}

.submit-btn {
  background-color: var(--theme-color) !important;
  color: var(--text-color);
  height: 48px;
  font-size: 1rem;
  text-transform: none;
  border-radius: 8px;
  margin-top: 1rem;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background-color: #e0e0e0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background-color: var(--background-color);
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.social-buttons {
  margin-top: 1.5rem;
}

.google-btn {
  height: 48px;
  border: 1px solid #e0e0e0;
  color: #333;
  text-transform: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.google-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.google-btn-text {
  flex: 1;
  text-align: center;
}

.sign-up-text {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.sign-up-link {
  color: var(--theme-color);
  text-decoration: none;
  font-weight: 500;
}

@media (max-width: 960px) {
  .login-container {
    flex-direction: column;
    min-height: auto;
  }

  .left-side {
    padding: 2rem;
  }

  .right-side {
    padding: 2rem;
  }

  .main-heading {
    font-size: 2rem;
  }

  .form-title {
    font-size: 1.75rem;
  }
}

/* Vuetify overrides */
:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-field__input) {
  font-size: 16px;
}

:deep(.v-label) {
  color: #666;
}
</style>
