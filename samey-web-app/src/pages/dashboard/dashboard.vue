// src/pages/dashboard/Dashboard.vue
<template>
  <div class="dashboard-container">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
  </div>
  <div class="dashboard">
    <!-- Devices Section -->
    <section class="dashboard-section">
      <h2 class="section-title">Devices</h2>
      <div class="cards-grid">
        <div
          v-for="card in deviceCards"
          :key="card.title"
          class="dashboard-card"
          :class="card.colorClass"
          @click="detailDataPage(card.title)"
        >
          <button
            class="redirect-button"
            @click.stop="detailDataPage(card.title)"
          >
            <i class="fa-regular fa-pen-to-square fa-xl"></i>
          </button>
          <h3 class="card-title">{{ card.title }}</h3>
          <div class="status-counters">
            <div
              v-for="(label, key) in card.statuses"
              :key="key"
              class="status-counter"
            >
              <span class="status-label">{{ label }}</span>
              <span class="status-value">{{ card.stats[key] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Settings Section -->
    <section class="dashboard-section">
      <h2 class="section-title">Settings</h2>
      <div class="cards-grid">
        <div
          v-for="card in settingsCards"
          :key="card.title"
          class="dashboard-card"
          :class="card.colorClass"
          @click="detailDataPage(card.title)"
        >
          <button
            class="redirect-button"
            @click.stop="detailDataPage(card.title)"
          >
            <i class="fa-regular fa-pen-to-square fa-xl"></i>
          </button>
          <h3 class="card-title">{{ card.title }}</h3>
          <div class="status-counters">
            <div
              v-for="(label, key) in card.statuses"
              :key="key"
              class="status-counter"
            >
              <span class="status-label">{{ label }}</span>
              <span class="status-value">{{ card.stats[key] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- user SETTINGS -->
    <section class="dashboard-section">
      <h2 class="section-title">User Settings</h2>
      <div class="cards-grid">
        <div
          v-for="card in userCards"
          :key="card.title"
          class="dashboard-card"
          :class="[card.colorClass, { 'simple-card': card.isSimpleCard }]"
          @click="detailDataPage(card.title)"
        >
          <button
            class="redirect-button"
            @click.stop="detailDataPage(card.title)"
          >
            <i class="fa-regular fa-pen-to-square fa-xl"></i>
          </button>

          <template v-if="card.isSimpleCard">
            <div class="simple-card-content">
              <h3 class="card-title">{{ card.title }}</h3>
            </div>
          </template>
          <!-- Regular card layout -->
          <template v-else>
            <h3 class="card-title">{{ card.title }}</h3>
            <div class="status-counters">
              <div
                v-for="(label, key) in card.statuses"
                :key="key"
                class="status-counter"
              >
                <span class="status-label">{{ label }}</span>
                <span class="status-value">{{ card.stats[key] || 0 }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Leave Settings Section -->
    <section class="dashboard-section">
      <h2 class="section-title">Leave Settings</h2>
      <div class="cards-grid">
        <div
          v-for="card in leaveCards"
          :key="card.title"
          class="dashboard-card"
          :class="card.colorClass"
          @click="detailDataPage(card.title)"
        >
          <button
            class="redirect-button"
            @click.stop="detailDataPage(card.title)"
          >
            <i class="fa-regular fa-pen-to-square fa-xl"></i>
          </button>
          <h3 class="card-title">{{ card.title }}</h3>
          <div class="status-counters">
            <div
              v-for="(label, key) in card.statuses"
              :key="key"
              class="status-counter"
            >
              <span class="status-label">{{ label }}</span>
              <span class="status-value">{{ card.stats[key] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Attendance Settings Section -->
    <section class="dashboard-section">
      <h2 class="section-title">Attendance Settings</h2>
      <div class="cards-grid">
        <div
          v-for="card in attendanceCards"
          :key="card.title"
          class="dashboard-card"
          :class="card.colorClass"
          @click="detailDataPage(card.title)"
        >
          <button
            class="redirect-button"
            @click.stop="detailDataPage(card.title)"
          >
            <i class="fa-regular fa-pen-to-square fa-xl"></i>
          </button>
          <h3 class="card-title">{{ card.title }}</h3>
          <div class="status-counters">
            <div
              v-for="(label, key) in card.statuses"
              :key="key"
              class="status-counter"
            >
              <span class="status-label">{{ label }}</span>
              <span class="status-value">{{ card.stats[key] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { authService } from "@/services/authService";

export default {
  name: "DashboardGroups",
  data() {
    return {
      deviceCards: [
        {
          title: "Devices",
          stats: {},
          data: {},
          endpoint: "items/controllers",
          params: { fields: ["status", "controllerName"] },
          fieldName: "controllerName",
          statuses: { approved: "Approved", unApproved: "Unapproved" },
          colorClass: "card-orange",
        },
        {
          title: "Doors",
          stats: {},
          data: {},
          endpoint: "items/doors",
          params: { fields: ["status", "doorName"] },
          fieldName: "doorName",
          statuses: { assigned: "Assigned", unassigned: "Unassigned" },
          colorClass: "card-orange",
        },
      ],
      settingsCards: [
        {
          title: "Department",
          stats: {},
          data: {},
          endpoint: "items/department",
          params: { fields: ["status", "departmentName"] },
          fieldName: "departmentName",
          statuses: { assigned: "Assigned", unassigned: "Unassigned" },
          colorClass: "card-orange",
        },
        {
          title: "Branch",
          stats: {},
          data: {},
          endpoint: "items/branch",
          params: { fields: ["status", "branchName"] },
          fieldName: "branchName",
          statuses: { assigned: "Assigned", unassigned: "Unassigned" },
          colorClass: "card-orange",
        },
        {
          title: "Accesslevels",
          stats: {},
          data: {},
          endpoint: "items/accesslevels",
          params: { fields: ["status", "accessLevelName"] },
          fieldName: "accessLevelName",
          statuses: { assigned: "Assigned", unassigned: "Unassigned" },
          colorClass: "card-orange",
        },
      ],
      userCards: [
        {
          title: "Users",
          stats: {},
          data: {},
          endpoint: "items/personalModule",
          params: { fields: ["status", "assignedUser.first_name"] },
          fieldName: "assignedUser.first_name",
          statuses: { active: "Active", unassigned: "InActive" },
          colorClass: "card-orange",
        },
        {
          title: "Edit Users",
          isSimpleCard: true,
          colorClass: "card-orange",
          icon: "✏️",
        },
      ],
      leaveCards: [
        {
          title: "Leave Request",
          stats: {},
          data: {},
          endpoint: "items/leaveRequest",
          params: { fields: ["status"] },
          fieldName: "status",
          statuses: { approved: "Approved", declined: "Reject" },
          colorClass: "card-orange",
        },
        {
          title: "Leave Permission",
          stats: {},
          data: {},
          endpoint: "items/leaveRequest",
          params: { fields: ["status"] },
          fieldName: "status",
          statuses: { pending: "LeaveRequest", declined: "Reject" },
          colorClass: "card-orange",
        },
      ],
      attendanceCards: [
        {
          title: "Attendance",
          stats: {},
          data: {},
          endpoint: "items/attendance",
          params: { fields: ["attendance"] },
          fieldName: "attendance",
          statuses: { present: "Present", absent: "Absent" },
          colorClass: "card-orange",
        },
      ],
    };
  },

  methods: {
    detailDataPage(title) {
      const routes = {
        Accesslevels: "/accessLevel",
        Department: "/config",
        Branch: "/config",
        Users: "/personalmodule",
        Devices: "/controllersetup",
        Doors: "/controllersetup",
        "Edit Users": "/flow",
        "Leave Permission": "/leave",
        "Leave Request": "/leave",
        Attendance: "/attendance",
      };

      if (title in routes) {
        if (["Department", "Branch", "Users", "Doors"].includes(title)) {
          const redirectSources = {
            Department: "departmentRedirect",
            Branch: "branchRedirect",
            Users: "PersonalModuleRedirect",
            Doors: "doorsRedirect",
          };
          sessionStorage.setItem("redirectSource", redirectSources[title]);
        }
        this.$router.push(routes[title]);
      }
    },

    async fetchData(cards) {
      for (const card of cards) {
        if (card.isSimpleCard) continue;

        try {
          if (!authService.isAuthenticated()) {
            throw new Error("User not authenticated");
          }

          const response = await authService.protectedApi.get(card.endpoint, {
            params: card.params,
          });

          const items = Array.isArray(response.data)
            ? response.data
            : response.data.data || [];

          Object.keys(card.statuses).forEach((statusKey) => {
            card.data[statusKey] = items
              .filter(
                (item) =>
                  item.status === statusKey || item.attendance === statusKey
              )
              .map((item) => ({
                name: card.fieldName.includes(".")
                  ? card.fieldName
                      .split(".")
                      .reduce((obj, key) => obj?.[key], item)
                  : item[card.fieldName],
              }));
            card.stats[statusKey] = card.data[statusKey].length;
          });
        } catch (error) {
          console.error(`Error fetching data for ${card.title}:`, error);

          if (error.response?.status === 401) {
            authService.logout();
            return;
          }

          Object.keys(card.statuses).forEach((statusKey) => {
            card.data[statusKey] = [];
            card.stats[statusKey] = 0;
          });
        }
      }
    },
  },

  mounted() {
    if (authService.isAuthenticated()) {
      this.fetchData(this.deviceCards);
      this.fetchData(this.settingsCards);
      this.fetchData(this.userCards);
      this.fetchData(this.leaveCards);
      this.fetchData(this.attendanceCards);
    } else {
      authService.logout();
    }
  },
};
</script>

<style scoped>
.dashboard-title {
  margin-left: 20px;
  font-family: "Arial", sans-serif;
  font-weight: bold;
  font-size: 2rem;
  color: var(--tittle);
}
.redirect-button {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.875rem;
}

.redirect-button:hover {
  background: rgba(255, 255, 255, 0.3);
}
.simple-card {
  min-height: 120px !important;
  justify-content: center !important;
}

.simple-card-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dashboard {
  padding: 2rem;
  background-color: var(--background-color);
  min-height: 100vh;
}

.dashboard-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  /* border-bottom: 2px solid #e2e8f0; */
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 0.25fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: var(--theme-accent);
  border-radius: 12px;
  padding: 1.5rem;
  color: var(--text-color);
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(26, 35, 126, 0.1);
}

.card-teal {
  background: linear-gradient(135deg, #4fd1c5, #38b2ac);
}

.card-purple {
  background: linear-gradient(135deg, #9f7aea, #805ad5);
}

.card-blue {
  background: linear-gradient(135deg, #63b3ed, #4299e1);
}

.card-green {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.card-orange {
  background: var(--theme-accent);
}

.dashboard-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(26, 35, 126, 0.15);
}

.status-counter {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.3s ease;
}

.status-counter:hover {
  background: rgba(255, 255, 255, 0.2);
}

.section-title {
  color: var(--title);
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(26, 35, 126, 0.1);
}
.card-title {
  /* font-size: 1.5rem; */
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.status-counters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.status-label {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.status-value {
  font-size: 1rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .cards-grid {
    grid-template-columns: 0.25fr;
  }

  .dashboard-card {
    height: auto;
    min-height: 160px;
  }
}
</style>
