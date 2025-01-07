// export const authService = new AuthService();
import axios from "axios";

class AuthService {
  constructor() {
    // For public API endpoints that don't require user authentication
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    // For authenticated endpoints that require user's token
    this.protectedApi = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add token to all protected requests
    this.protectedApi.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle 401 responses (Log warning but avoid automatic logout)
    this.protectedApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn(
            "Unauthorized access. Token might be invalid or missing."
          );
          // Optionally, notify the user here instead of logging out automatically.
        }
        return Promise.reject(error);
      }
    );
  }

  // Store user token
  setToken(token) {
    if (!token) return;
    localStorage.setItem("userToken", token);
    this.protectedApi.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem("userToken");
  }

  // Store phone number
  setPhone(phone) {
    if (!phone) return;
    localStorage.setItem("userPhone", phone);
  }

  // Get stored phone
  getPhone() {
    return localStorage.getItem("userPhone");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.getToken() && this.getPhone());
  }

  // Clear all auth data
  logout() {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("sessionUuid");
    delete this.protectedApi.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  }

  async checkPhoneExists(phone) {
    try {
      const response = await this.api.get("/users", {
        params: {
          "filter[_and][0][phone][_contains]": phone,
        },
      });
      return response.data.data.length > 0;
    } catch (error) {
      console.error("Error checking phone:", error);
      throw error;
    }
  }

  async generateOtp(phone) {
    try {
      const cleanPhone = phone.replace(/\D/g, "").replace(/^91/, "");
      const formattedPhone = "0" + cleanPhone;

      const response = await this.api.get(
        `/flows/trigger/0e3ef205-fab4-476a-aa96-fd98afe93871?phone_number=${formattedPhone}&country_code=91`
      );

      if (response.data.otp_session_uuid) {
        localStorage.setItem("sessionUuid", response.data.otp_session_uuid);
        this.setPhone(phone); // Store phone number when OTP is generated
      }

      return response.data;
    } catch (error) {
      console.error("Error generating OTP:", error);
      throw error;
    }
  }

  async verifyOtp(otp, sessionUuid, phone) {
    try {
      // Verify required data is available
      if (!otp || !sessionUuid || !phone) {
        throw new Error("Missing required verification data");
      }

      const cleanPhone = phone.replace(/\D/g, "").replace(/^91/, "");
      const formattedPhone = "0" + cleanPhone;

      const response = await this.api.get(
        `/flows/trigger/f3dfe231-8428-4a18-9d93-0b8eb1743559?otp=${otp}&session_uuid=${sessionUuid}&phone_number=${formattedPhone}`
      );

      // If verification successful, store auth data
      if (response.data.token) {
        this.setToken(response.data.token);
        this.setPhone(phone);
        localStorage.removeItem("sessionUuid"); // Clean up session UUID
      }

      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    // Check if we have required auth data
    if (!this.isAuthenticated()) {
      throw new Error("User not authenticated");
    }

    const phone = this.getPhone();
    return this.getUserByPhone(phone);
  }

  async getUserByPhone(phone) {
    try {
      const response = await this.protectedApi.get("/users", {
        params: {
          "filter[phone][_eq]": phone,
          "fields[]": [
            "id",
            "tenant",
            "role.name",
            "phone",
            "first_name",
            "last_name",
            "email",
          ],
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data[0];
      }
      throw new Error("User not found");
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();