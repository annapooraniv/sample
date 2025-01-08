<template>
  <v-app>
    <v-main
      class="background"
      style="background-color: var(--background-color)"
    >
      <v-container fluid>
        <v-row>
          <!-- Left Column -->
          <v-col cols="12" md="4" lg="3">
            <!-- Profile Card -->
            <v-card class="mb-6" elevation="2">
              <v-card-text class="text-center">
                <div class="position-relative d-inline-block">
                  <v-avatar size="150" class="mb-4 profile-avatar">
                    <v-img
                      :src="profileImage"
                      :alt="profileData.avatar?.title || 'Profile Image'"
                      class="profile-image"
                      @error="handleImageError"
                    >
                      <template v-slot:placeholder>
                        <v-progress-circular
                          v-if="profileData.avatar?.id && !profileImage"
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                        <v-icon v-else size="180" class="placeholder-icon">
                          mdi-account-circle
                        </v-icon>
                      </template>
                    </v-img>
                  </v-avatar>
                  <v-btn
                    color="var(--theme-color)"
                    fab
                    small
                    class="profile-camera-btn"
                    @click="triggerImageUpload"
                  >
                    <v-icon size="20">mdi-camera</v-icon>
                  </v-btn>
                </div>
                <h2 class="text-h4 mb-2">{{ fullName }}</h2>
                <p
                  class="text-subtitle-1 mb-1"
                  style="color: var(--text-light)"
                >
                  {{ profileData.roleName }}
                </p>
                <p
                  class="text-subtitle-2 mb-4"
                  style="color: var(--text-light)"
                >
                  {{ profileData.tenantName }}
                </p>
                <input
                  type="file"
                  ref="imageInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  style="display: none"
                />
              </v-card-text>
            </v-card>

            <!-- Quick Stats -->
            <v-card elevation="2">
              <v-card-title class="text-h6">Quick Stats</v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-card outlined class="mb-3">
                      <v-card-text>
                        <div class="d-flex align-center">
                          <v-icon
                            color="var(--theme-color)"
                            size="24"
                            class="mr-3"
                          >
                            mdi-domain
                          </v-icon>
                          <div>
                            <div
                              class="text-caption"
                              style="color: var(--text-light)"
                            >
                              Department
                            </div>
                            <div class="text-subtitle-1 font-weight-medium">
                              {{ profileData.departmentName }}
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                    <v-card outlined>
                      <v-card-text>
                        <div class="d-flex align-center">
                          <v-icon
                            color="var(--theme-color)"
                            size="24"
                            class="mr-3"
                          >
                            mdi-office-building
                          </v-icon>
                          <div>
                            <div
                              class="text-caption"
                              style="color: var(--text-light)"
                            >
                              Branch
                            </div>
                            <div class="text-subtitle-1 font-weight-medium">
                              {{ profileData.branchName }}
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" md="8" lg="9">
            <!-- Profile Details Card -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="text-h5">Profile Details</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    v-for="field in profileFields"
                    :key="field.name"
                  >
                    <div class="field-wrapper">
                      <label class="field-label">{{ field.label }}</label>
                      <input
                        v-model="profileData[field.name]"
                        type="text"
                        :placeholder="field.label"
                        readonly
                        class="custom-input"
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Additional Information -->
            <v-card elevation="2">
              <v-card-title class="text-h5"
                >Additional Information</v-card-title
              >
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="6">
                    <div class="field-wrapper">
                      <label class="field-label">Department</label>
                      <div class="input-icon-wrapper">
                        <v-icon class="field-icon">mdi-domain</v-icon>
                        <input
                          v-model="profileData.departmentName"
                          type="text"
                          placeholder="Department"
                          readonly
                          class="custom-input with-icon"
                        />
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="field-wrapper">
                      <label class="field-label">Access Level</label>
                      <div class="input-icon-wrapper">
                        <v-icon class="field-icon">mdi-shield-account</v-icon>
                        <input
                          v-model="profileData.accessLevelName"
                          type="text"
                          placeholder="Access Level"
                          readonly
                          class="custom-input with-icon"
                        />
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="field-wrapper">
                      <label class="field-label">Branch</label>
                      <div class="input-icon-wrapper">
                        <v-icon class="field-icon">mdi-office-building</v-icon>
                        <input
                          v-model="profileData.branchName"
                          type="text"
                          placeholder="Branch"
                          readonly
                          class="custom-input with-icon"
                        />
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <div class="field-wrapper">
                      <label class="field-label">Location</label>
                      <div class="input-icon-wrapper">
                        <v-icon class="field-icon">mdi-map-marker</v-icon>
                        <input
                          v-model="profileData.location"
                          type="text"
                          placeholder="Location"
                          readonly
                          class="custom-input with-icon"
                        />
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { authService } from "@/services/authService";

export default {
  name: "ProfilePage",
  data() {
    return {
      profileData: {},
      profileFields: [
        { name: "first_name", label: "First Name", editable: true },
        { name: "last_name", label: "Last Name", editable: true },
        { name: "phone", label: "Phone Number", editable: true },
        { name: "email", label: "Email", editable: true },
        { name: "roleName", label: "Role", editable: false },
        { name: "tenantName", label: "Tenant Name", editable: false },
      ],
      tenantId: null,
      profileImage: null,
      isLoadingImage: false,
    };
  },

  computed: {
    fullName() {
      return `${this.profileData.first_name || ""} ${
        this.profileData.last_name || ""
      }`.trim();
    },
  },

  mounted() {
    this.fetchLoginUserDetails();
  },

  methods: {
    async fetchLoginUserDetails() {
      try {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
          throw new Error("User not authenticated");
        }
        const phone = authService.getPhone();
        if (!phone) {
          throw new Error("Phone number not found");
        }
        const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
        // Use protectedApi from authService
        const userResponse = await authService.protectedApi.get("/users", {
          params: {
            "filter[_and][0][phone][_contains]": formattedPhone,
            "fields[]": ["id", "tenant", "role.name", "phone"],
          },
        });
        if (userResponse.data.data?.length) {
          const userData = userResponse.data.data[0];
          this.tenantId = userData.tenant;
          await this.fetchProfileData(userData.id);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error fetching login user details:", error);
        if (error.response?.status === 401) {
          authService.logout(); // Use authService logout method
        }
      }
    },
    async fetchProfileData(userId) {
      try {
        const phone = authService.getPhone();
        const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
        // Use protectedApi from authService
        const response = await authService.protectedApi.get(
          "/items/personalModule",
          {
            params: {
              fields: [
                "id",
                "assignedUser.first_name",
                "assignedUser.last_name",
                "assignedUser.phone",
                "assignedUser.email",
                "assignedUser.role.name",
                "assignedUser.tenant.tenantName",
                "assignedDepartment.department_id.departmentName",
                "assignedAccessLevels.accesslevels_id.accessLevelName",
                "assignedBranch.branch_id.branchName",
                "assignedUser.location",
                "assignedUser.avatar.id",
                "assignedUser.avatar.type",
                "assignedUser.avatar.title",
              ],
              filter: {
                _and: [
                  { assignedUser: { phone: { _contains: formattedPhone } } },
                ],
              },
            },
          }
        );
        if (response.data.data?.length) {
          const userData = response.data.data[0];
          this.profileData = {
            first_name: userData.assignedUser.first_name,
            last_name: userData.assignedUser.last_name,
            phone: userData.assignedUser.phone,
            email: userData.assignedUser.email,
            roleName: userData.assignedUser.role.name,
            tenantName: userData.assignedUser.tenant.tenantName,
            departmentName:
              userData.assignedDepartment?.[0]?.department_id?.departmentName ||
              "Not Set",
            accessLevelName:
              userData.assignedAccessLevels?.[0]?.accesslevels_id
                ?.accessLevelName || "Not Set",
            branchName:
              userData.assignedBranch?.[0]?.branch_id?.branchName || "Not Set",
            location: userData.assignedUser.location || "Not Set",
            avatar: userData.assignedUser.avatar || null,
          };
          // Set profile image if avatar exists
          if (this.profileData.avatar?.id) {
            await this.fetchAuthorizedImage(
              `${import.meta.env.VITE_API_URL}/assets/${
                this.profileData.avatar.id
              }`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response?.status === 401) {
          authService.logout(); // Use authService logout method
        }
      }
    },
    async fetchAuthorizedImage(imageUrl) {
      this.isLoadingImage = true;
      try {
        // Use the stored user token for image fetch
        const token = authService.getToken();
        const response = await fetch(imageUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load image");
        const blob = await response.blob();
        this.profileImage = URL.createObjectURL(blob);
      } catch (error) {
        console.error("Error loading profile image:", error);
        this.profileImage = null;
      } finally {
        this.isLoadingImage = false;
      }
    },
    handleImageError() {
      this.profileImage = null;
      console.warn("Failed to load profile image");
    },
    triggerImageUpload() {
      this.$refs.imageInput.click();
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          // Use protectedApi for file upload
          const response = await authService.protectedApi.post(
            "/files",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          if (response.data.id) {
            // Update profile image
            const reader = new FileReader();
            reader.onload = (e) => {
              this.profileImage = e.target.result;
            };
            reader.readAsDataURL(file);
            // Update user avatar in backend
            await authService.protectedApi.patch(
              `/users/${this.profileData.id}`,
              {
                avatar: response.data.id,
              }
            );
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          if (error.response?.status === 401) {
            authService.logout();
          }
        }
      }
    },
  },
};
</script>

<style scoped>
/* New input field styles */
.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.field-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-size: 20px;
}

.custom-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  line-height: 20px;
  color: #111827;
  background-color: #f9fafb;
  transition: all 0.2s ease;
}

.custom-input.with-icon {
  padding-left: 40px;
}

.custom-input:focus {
  outline: none;
  border-color: var(--theme-color);
  box-shadow: 0 0 0 1px var(--theme-color);
}

.custom-input:read-only {
  background-color: #f3f4f6;
  cursor: default;
}

.custom-input::placeholder {
  color: #9ca3af;
}

/* Existing styles */
.profile-camera-btn {
  position: absolute;
  right: 0;
  border-radius: 50% !important;
  height: 36px !important;
  width: 36px !important;
}

.profile-avatar {
  border: 4px solid var(--theme-color);
  overflow: hidden !important;
}

.profile-image {
  width: 130px !important;
  height: 150px !important;
}

.placeholder-icon {
  font-size: 180px !important;
  height: 150px !important;
  width: 130px !important;
  margin-left: -1rem;
}

.background {
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
