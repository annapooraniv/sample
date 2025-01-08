// src/utils/currentUserTenant.js
import { authService } from "@/services/authService";

class CurrentUserTenant {
  constructor() {
    this.tenantId = null;
  }

  async fetchLoginUserDetails() {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error("User not authenticated");
      }

      const phone = authService.getPhone();
      if (!phone) {
        throw new Error("Phone number not found");
      }

      const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;

      const userResponse = await authService.protectedApi.get("/users", {
        params: {
          "filter[_and][0][phone][_contains]": formattedPhone,
          "fields[]": ["id", "tenant", "role.name", "phone"],
        },
      });

      if (userResponse.data.data?.length) {
        const userData = userResponse.data.data[0];
        this.tenantId = userData.tenant;
        return userData;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching login user details:", error);
      if (error.response?.status === 401) {
        authService.logout();
      }
      throw error;
    }
  }

  getTenantId() {
    return this.tenantId;
  }
}

export const currentUserTenant = new CurrentUserTenant();
