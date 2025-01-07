// src/components/loginAuthentication/verification.vue
<template>
  <v-container class="login-container" fluid>
    <v-row class="row-container">
      <v-col class="login-col">
        <v-card class="login-card">
          <div class="logo-container">
            <h1 class="main-title">Samay Web Application</h1>
          </div>

          <h2 class="sign-in-title">Verify Your Number</h2>
          <p class="verification-subtitle">We've sent a code to your phone</p>

          <div class="otp-container">
            <v-text-field
              v-for="(digit, index) in 6"
              :key="index"
              v-model="otpDigits[index]"
              variant="outlined"
              density="comfortable"
              class="otp-input"
              maxlength="1"
              @input="handleInput(index)"
              @keydown="handleKeydown($event, index)"
              ref="otpFields"
            ></v-text-field>
          </div>

          <v-btn
            block
            size="large"
            type="submit"
            :loading="loading"
            class="submit-btn"
            @click="verifyCode"
            :disabled="!isValidOtp"
          >
            Verify
          </v-btn>

          <div class="resend-container">
            <a href="#" class="resend-link" @click.prevent="resendCode">
              Resend Code
            </a>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { authService } from "@/services/authService";

export default {
  name: "Verification",
  data() {
    return {
      otpDigits: Array(6).fill(""),
      loading: false,
      error: "",
      timer: 300,
      timerInterval: null,
    };
  },

  computed: {
    isValidOtp() {
      return this.otpDigits.every((digit) => digit !== "");
    },

    phoneNumber() {
      return this.$route.params.phoneNumber;
    },
  },

  methods: {
    handleInput(index) {
      this.otpDigits[index] = this.otpDigits[index].replace(/[^0-9]/g, "");

      if (this.otpDigits[index] && index < 5) {
        this.$refs.otpFields[index + 1].$el.querySelector("input").focus();
      }
    },

    handleKeydown(event, index) {
      if (event.key === "Backspace" && !this.otpDigits[index] && index > 0) {
        this.$refs.otpFields[index - 1].$el.querySelector("input").focus();
      }
    },

    async verifyCode() {
      this.loading = true;
      this.error = "";

      try {
        const sessionUuid = localStorage.getItem("sessionUuid");
        const phone = localStorage.getItem("userPhone"); // Get stored phone number

        if (!sessionUuid || !phone) {
          throw new Error(
            "Missing session information. Please try logging in again."
          );
        }

        // Get the entered OTP
        const enteredOtp = this.otpDigits.join("");

        if (!enteredOtp || enteredOtp.length !== 6) {
          throw new Error("Please enter a valid 6-digit OTP");
        }

        // Call the verification API with the entered OTP
        const verificationResponse = await authService.verifyOtp(
          enteredOtp,
          sessionUuid,
          phone
        );

        if (verificationResponse.token) {
          // Store the phone number and token
          localStorage.setItem("userPhone", phone);
          authService.setToken(verificationResponse.token);

          // Navigate to dashboard after successful verification
          this.$router.push("/dashboard");
        } else {
          throw new Error("Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        this.error = "Invalid OTP. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    async resendCode() {
      try {
        const cleanPhone = this.phoneNumber
          .replace(/\D/g, "")
          .replace(/^91/, "");
        const otpResponse = await authService.generateOtp(cleanPhone);

        if (otpResponse.otp_session_uuid) {
          localStorage.setItem("sessionUuid", otpResponse.otp_session_uuid);
          this.startTimer();
          // Reset OTP input fields
          this.otpDigits = Array(6).fill("");
          // Focus on first input
          this.$nextTick(() => {
            this.$refs.otpFields[0].$el.querySelector("input").focus();
          });
        }
      } catch (error) {
        console.error("Resend code error:", error);
        this.error = "Failed to resend code. Please try again.";
      }
    },

    startTimer() {
      this.timer = 300;
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },

    formatTime() {
      const minutes = Math.floor(this.timer / 60);
      const seconds = this.timer % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    },
  },

  mounted() {
    // Start timer when component mounts
    this.startTimer();
    // Focus first OTP input
    this.$nextTick(() => {
      this.$refs.otpFields[0].$el.querySelector("input").focus();
    });
  },

  beforeDestroy() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
.login-container {
  background-color: var(--background-color);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.row-container {
  width: 100%;
  justify-content: center;
}

.login-col {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.login-card {
  background-color: var(--white);
  border-radius: 12px;
  padding: 32px;
}

.logo-container {
  text-align: center;
  margin-bottom: 32px;
}

.main-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.sub-title {
  font-size: 16px;
  color: var(--text-light);
}

.sign-in-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
  color: var(--text-dark);
}

.verification-subtitle {
  text-align: center;
  color: var(--text-light);
  margin-bottom: 24px;
}

.otp-container {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  justify-content: center;
}

.otp-input {
  max-width: 56px;
  text-align: center;
}

.submit-btn {
  background-color: var(--theme-color) !important;
  color: var(--text-color);
  font-weight: 500;
  text-transform: none;
  height: 48px;
  border-radius: 8px;
}

.submit-btn:hover {
  opacity: 0.9;
}

.resend-container {
  text-align: center;
  margin-top: 16px;
}

.resend-link {
  color: var(--theme-color);
  text-decoration: none;
  font-weight: 500;
}

/* Vuetify overrides */
:deep(.v-field) {
  border-radius: 8px;
}

:deep(.v-field__input) {
  font-size: 16px;
  color: var(--theme-color);
  text-align: center;
}

:deep(.v-label) {
  color: var(--text-light);
}
</style>
