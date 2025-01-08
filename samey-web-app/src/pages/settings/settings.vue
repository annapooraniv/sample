<!-- src/views/Settings.vue -->
<template>
  <div class="settings-container">
    <!-- Template Section -->
    <div class="template-section">
      <div class="section-header">
        <div class="header-with-back">
          <v-btn
            v-if="showTabs"
            icon="mdi-arrow-left"
            variant="text"
            size="small"
            @click="goBackToTemplates"
            class="back-btn"
          ></v-btn>
          <h3 class="text-h6">
            {{ showTabs ? selectedTemplate.name : "Template" }}
          </h3>
        </div>
        <v-btn
          v-if="!showTabs"
          color="black"
          class="create-btn"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Create Template
        </v-btn>
        <v-btn
          v-else
          color="black"
          class="save-btn"
          @click="saveTemplateChanges"
        >
          Save Template
        </v-btn>
      </div>

      <!-- Template Container -->
      <div v-if="!showTabs" class="templates-wrapper">
        <div class="templates-container">
          <!-- Create Template Card -->
          <div class="template-card" @click="openCreateDialog">
            <div class="create-card-content">
              <v-icon size="24" color="grey-darken-1">mdi-plus</v-icon>
              <span class="create-text">Create</span>
            </div>
          </div>

          <!-- Default Template Card -->
          <div class="template-card" @click="showTemplateConfig('default')">
            <div class="template-content">
              <span class="default-text">Default Category</span>
              <div class="template-actions">
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  @click.stop="editTemplate('default')"
                ></v-btn>
              </div>
            </div>
          </div>

          <!-- Custom Template Cards -->
          <div
            v-for="template in customTemplates"
            :key="template.id"
            class="template-card"
            @click="showTemplateConfig(template.id)"
          >
            <div class="template-content">
              <span class="default-text">{{ template.name }}</span>
              <div class="template-actions">
                <v-btn
                  icon="mdi-pencil"
                  variant="text"
                  size="small"
                  @click.stop="editTemplateName(template)"
                ></v-btn>
                <v-btn
                  icon="mdi-content-copy"
                  variant="text"
                  size="small"
                  @click.stop="duplicateTemplate(template)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  variant="text"
                  size="small"
                  @click.stop="deleteTemplate(template.id)"
                ></v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Template Configuration Tabs -->
      <div v-else class="template-config">
        <div class="custom-tabs">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'attendance' }"
            @click="activeTab = 'attendance'"
          >
            Attendance Configuration
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'salary' }"
            @click="activeTab = 'salary'"
          >
            Salary Configuration
          </button>
        </div>

        <v-window v-model="activeTab" class="mt-4">
          <v-window-item value="attendance">
            <AttendanceConfiguration :template="selectedTemplate" />
          </v-window-item>

          <v-window-item value="salary">
            <SalaryConfiguration :template="selectedTemplate" />
          </v-window-item>
        </v-window>
      </div>
    </div>

    <!-- Create Template Dialog -->
    <v-dialog v-model="createDialog" max-width="500px">
      <v-card>
        <v-card-title>Create New Template</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTemplate.name"
            label="Template Name"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="createDialog = false">Cancel</v-btn>
          <v-btn color="success" text @click="saveTemplate">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Template Name Dialog -->
    <v-dialog v-model="editNameDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit Template Name</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editingTemplate.name"
            label="Template Name"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="editNameDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="success" text @click="saveTemplateName">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AttendanceConfiguration from "./attendance/attendanceConfiguration.vue";
import SalaryConfiguration from "./salary/salaryConfiguration.vue";

export default {
  name: "Settings",
  components: {
    AttendanceConfiguration,
    SalaryConfiguration,
  },
  data() {
    return {
      createDialog: false,
      editNameDialog: false,
      showTabs: false,
      activeTab: "attendance",
      newTemplate: {
        name: "",
      },
      editingTemplate: null,
      customTemplates: [],
      selectedTemplate: null,
      defaultTemplate: {
        id: "default",
        name: "Default Category",
        attendance: {},
        salary: {},
      },
    };
  },
  mounted() {
    this.loadTemplates();
  },
  methods: {
    openCreateDialog() {
      this.newTemplate.name = `Employee Category ${
        this.customTemplates.length + 1
      }`;
      this.createDialog = true;
    },
    saveTemplate() {
      const template = {
        id: Date.now().toString(),
        name: this.newTemplate.name,
        attendance: JSON.parse(JSON.stringify(this.defaultTemplate.attendance)),
        salary: JSON.parse(JSON.stringify(this.defaultTemplate.salary)),
      };
      this.customTemplates.push(template);
      this.saveTemplates();
      this.createDialog = false;
      this.newTemplate.name = "";
    },
    editTemplate(templateId) {
      this.selectedTemplate =
        templateId === "default"
          ? this.defaultTemplate
          : this.customTemplates.find((t) => t.id === templateId);
      this.showTabs = true;
    },
    editTemplateName(template) {
      this.editingTemplate = { ...template };
      this.editNameDialog = true;
    },
    saveTemplateName() {
      const index = this.customTemplates.findIndex(
        (t) => t.id === this.editingTemplate.id
      );
      if (index !== -1) {
        this.customTemplates[index].name = this.editingTemplate.name;
        this.saveTemplates();
      }
      this.editNameDialog = false;
    },
    deleteTemplate(templateId) {
      this.customTemplates = this.customTemplates.filter(
        (t) => t.id !== templateId
      );
      this.saveTemplates();
    },
    duplicateTemplate(template) {
      const newTemplate = {
        ...JSON.parse(JSON.stringify(template)),
        id: Date.now().toString(),
        name: `${template.name} Copy`,
      };
      this.customTemplates.push(newTemplate);
      this.saveTemplates();
    },
    showTemplateConfig(templateId) {
      this.editTemplate(templateId);
    },
    goBackToTemplates() {
      this.showTabs = false;
      this.selectedTemplate = null;
    },
    saveTemplateChanges() {
      if (this.selectedTemplate.id !== "default") {
        const index = this.customTemplates.findIndex(
          (t) => t.id === this.selectedTemplate.id
        );
        if (index !== -1) {
          this.customTemplates[index] = { ...this.selectedTemplate };
          this.saveTemplates();
        }
      }
      this.goBackToTemplates();
    },
    saveTemplates() {
      localStorage.setItem(
        "customTemplates",
        JSON.stringify(this.customTemplates)
      );
    },
    loadTemplates() {
      const savedTemplates = localStorage.getItem("customTemplates");
      if (savedTemplates) {
        this.customTemplates = JSON.parse(savedTemplates);
      }
    },
  },
};
</script>

<style scoped>
.settings-container {
  padding: 20px;
  width: 100%;
  background: white;
}

.template-section {
  background: white;
  border-radius: 8px;
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 14px;
}

.header-with-back {
  display: flex;
  align-items: center;
  gap: 12px;
}

.templates-wrapper {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  overflow-x: auto;
  min-height: calc(100vh - 200px);
  border: 1px solid #e0e0e0;
}

.templates-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 4px;
}

.template-card {
  width: 100%;
  min-width: 160px;
  height: 130px;
  background: #f5f5f5; /* Light gray background */
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.template-card:hover {
  background: #eeeeee;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.create-card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.create-text {
  color: #333; /* Dark gray text */
  font-size: 14px;
  font-weight: 500;
}

.template-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 12px;
}

.default-text {
  font-weight: 500;
  color: #333; /* Dark text */
  text-align: center;
  padding: 0 8px;
  word-break: break-word;
  max-width: 140px;
  font-size: 14px;
}

.template-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px;
  border-radius: 4px;
}

.template-card:hover .template-actions {
  opacity: 1;
}

.template-config {
  background: white;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #e0e0e0;
  min-height: calc(100vh - 200px);
}

.custom-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-button {
  padding: 10px 20px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333; /* Dark text */
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.tab-button:hover {
  background: #eeeeee;
}

.tab-button.active {
  background: #333; /* Dark background for active tab */
  color: white;
  font-size: 14px;
  border-color: #333;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .templates-container {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }

  .template-card {
    height: 120px;
  }

  /* .section-header {
    padding: 12px 16px;
  } */

  .custom-tabs {
    gap: 8px;
  }

  .tab-button {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
