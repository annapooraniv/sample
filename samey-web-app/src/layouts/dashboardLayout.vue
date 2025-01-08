//src/layout/DashboardLayout.vue
<template>
  <v-app>
    <!-- Side Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      :style="{ background: 'var(--theme-color)' }"
      class="sidebar"
    >
      <div class="sidebar-content">
        <!-- App Title -->
        <v-list-item nav class="py-3 app-title">
          <h1 class="text-h4 font-weight-bold white-text">Samay</h1>
          <template v-slot:append>
            <v-btn
              variant="text"
              icon
              @click.stop="rail = !rail"
              class="white-text"
            >
              <v-icon>{{
                rail ? "mdi-chevron-right" : "mdi-chevron-left"
              }}</v-icon>
            </v-btn>
          </template>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- Fixed Menu List -->
        <v-list density="compact" nav class="menu-list">
          <v-list-item
            v-for="item in menuItems"
            :key="item.title"
            :value="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
            class="menu-item"
            :class="{ 'menu-item-active': $route.path === item.to }"
          >
            <template v-slot:prepend>
              <v-icon class="white-text">{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title class="white-text">{{
              item.title
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>

      <!-- Bottom Section -->
      <div class="logout-section">
        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-logout"
            :title="rail ? '' : 'Logout'"
            @click="handleLogout"
            class="menu-item"
          >
            <template v-slot:prepend>
              <v-icon class="white-text">mdi-logout</v-icon>
            </template>
            <v-list-item-title class="white-text"></v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <!-- Top App Bar -->
      <v-app-bar color="white" elevation="1" class="top-bar">
        <!-- Page Title -->
        <v-toolbar-title class="text-h6 font-weight-medium">
          {{ getCurrentPageTitle }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Status Badge -->
        <v-chip color="success" class="mr-4" size="small"> Active </v-chip>

        <!-- Profile Section -->
        <v-menu v-model="profileMenu" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn class="profile-btn" v-bind="props">
              <v-avatar size="32" class="mr-2">
                <v-img :src="profileImage || ''" alt="Profile">
                  <template v-slot:placeholder>
                    <v-icon>mdi-account-circle</v-icon>
                  </template>
                </v-img>
              </v-avatar>
              <span class="text-subtitle-1">{{ userFullName }}</span>
              <v-icon right>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-card min-width="200">
            <v-list>
              <v-list-item
                prepend-icon="mdi-account-outline"
                title="Profile"
                @click="$router.push('/profile')"
              ></v-list-item>
              <v-list-item
                prepend-icon="mdi-cog-outline"
                title="Settings"
                @click="$router.push('/settings')"
              ></v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-app-bar>

      <!-- Router View with Scrollable Content -->
      <v-container fluid class="pa-1 scrollable-content">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from "axios";
export default {
  name: "DashboardLayout",
  data() {
    return {
      drawer: true,
      rail: false,
      profileMenu: false,
      profileImage: null,
      userFullName: "",
      isLoadingImage: false,
      menuItems: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          to: "/dashboard",
        },
        {
          title: "Employee Details",
          icon: "mdi-account-details",
          to: "/employee-deatils",
        },
        {
          title: "Attendance",
          icon: "mdi-calendar-check",
          to: "/attendance",
        },
        {
          title: "Configuration",
          icon: "mdi-tune",
          to: "/configuration",
        },
        // {
        //   title: "Device Manager",
        //   icon: "mdi-devices",
        //   to: "/device-manager",
        // },
        {
          title: "Leave Management",
          icon: "mdi-account-off",
          to: "/leave",
        },
        {
          title: "Payroll",
          icon: "mdi-cash-multiple",
          to: "/payroll",
        },
        {
          title: "Reports",
          icon: "mdi-file-chart",
          to: "/reports",
        },
        {
          title: "Profile",
          icon: "mdi-account",
          to: "/profile",
        },
        {
          title: "Settings",
          icon: "mdi-cog-outline",
          to: "/settings",
        },
      ],
    };
  },
  computed: {
    getCurrentPageTitle() {
      const currentRoute = this.$route.path;
      const currentMenuItem = this.menuItems.find(
        (item) => item.to === currentRoute
      );
      return currentMenuItem ? currentMenuItem.title : "Dashboard";
    },
  },
  methods: {
    async fetchUserProfile() {
      try {
        const api = axios.create({
          baseURL: import.meta.env.VITE_API_URL,
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        const phone = localStorage.getItem("userPhone");
        const formattedPhone = phone?.startsWith("+91")
          ? phone
          : `+91${phone}`;

        const response = await api.get("/items/personalModule", {
          params: {
            fields: ["assignedUser.first_name", "assignedUser.avatar.id"],
            filter: {
              _and: [
                { assignedUser: { phone: { _contains: formattedPhone } } },
              ],
            },
          },
        });

        if (response.data.data?.length) {
          const userData = response.data.data[0];
          this.userFullName = userData.assignedUser.first_name;

          if (userData.assignedUser.avatar?.id) {
            await this.fetchAuthorizedImage(
              `${import.meta.env.VITE_API_URL}/assets/${
                userData.assignedUser.avatar.id
              }`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response?.status === 401) {
          authService.removeToken();
          this.$router.push("/login");
        }
      }
    },

    async fetchAuthorizedImage(imageUrl) {
      this.isLoadingImage = true;
      try {
        const response = await fetch(imageUrl, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
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

    handleLogout() {
      authService.removeToken();
      this.$router.push("/login");
    },
  },
  mounted() {
    this.fetchUserProfile();
  },
};
</script>

<style scoped>
.font-weight-medium {
  font-weight: 600 !important;
}
.v-btn .v-icon {
  --v-icon-size-multiplier: 1.6;
}

.sidebar {
  border-right: none !important;
  background: var(--background-color) !important;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  flex-grow: 1;
  overflow: hidden;
}

.app-title {
  letter-spacing: 3px;
  padding: 20px 16px;
}

.menu-list {
  padding: 8px;
  height: calc(100vh - 200px);
  overflow: hidden;
}

.menu-item {
  margin: 4px 0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item-active {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.main-content {
  background-color: var(--background-color);
  min-height: 100vh;
  overflow-y: auto;
}

.scrollable-content {
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.top-bar {
  border-bottom: 1px solid #eee;
}

.profile-btn {
  height: 40px;
  padding: 0 16px;
  background-color: transparent !important;
  color: var(--text-dark) !important;
}

.white-text {
  color: var(--white) !important;
}

.logout-section {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Divider color */
:deep(.v-divider) {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Status chip styling */
:deep(.v-chip.v-chip--size-small) {
  font-size: 0.75rem;
  height: 24px;
}

/* Custom scroll styling for main content */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: var(--background-color);
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
