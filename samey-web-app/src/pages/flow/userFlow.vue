<template>
  <private-view title="Flow">
    <!-- FontAwesome stylesheet -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />

    <div class="flow-container">
      <!-- Pure Loading State -->
      <div v-if="isLoadingPermissions" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading permissions...</p>
      </div>

      <!-- Content After Loading -->
      <template v-else>
        <!-- Tabs Section -->
        <div v-if="hasAnyTabPermission" class="main-tabs">
          <button
            v-if="hasUserTabPermission"
            @click="switchTab('user')"
            :class="{ active: activeMainTab === 'user' }"
          >
            User Flow
          </button>
          <button
            v-if="hasVehicleTabPermission"
            @click="switchTab('vehicle')"
            :class="{ active: activeMainTab === 'vehicle' }"
          >
            Vehicle Flow
          </button>
          <button
            v-if="hasVisitorTabPermission"
            @click="switchTab('visitor')"
            :class="{ active: activeMainTab === 'visitor' }"
          >
            Visitor Flow
          </button>
        </div>

        <!-- No Permission Message - Only show after loading and if no permissions -->
        <div
          v-if="!isLoadingPermissions && !hasAnyTabPermission"
          class="no-permission"
        >
          <div class="no-permission-icon">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2>No Permission</h2>
          <p>You don't have permission to access any features.</p>
        </div>

        <!-- No Data Message - Show when data is empty -->
        <div v-else-if="showNoDataMessage" class="no-data-container">
          <div class="no-data-icon">
            <i class="fa-solid fa-database"></i>
          </div>
          <h2>No Data Available</h2>
          <p>There is no data to display at this time.</p>
        </div>

        <!-- Tab Content -->
        <template v-else>
          <div v-if="activeMainTab === 'user'" class="tabs-container">
            <div class="left-tabs">
              <button
                @click="activeLeftTab = 'action'"
                :class="{ active: activeLeftTab === 'action' }"
              >
                Activity
              </button>
              <button
                @click="activeLeftTab = 'allActivity'"
                :class="{ active: activeLeftTab === 'allActivity' }"
              >
                History
              </button>
            </div>
            <div v-if="canManageUsers" class="right-tabs">
              <!-- bulk data  -->
              <button
                v-if="userRole === 'Administrator'"
                @click="showBulkGenerateConfirm"
                class="action-button bulk-generate-btn"
                :disabled="isGenerating"
              >
                <i
                  class="fa-solid fa-database"
                  :class="{ 'fa-spin': isGenerating }"
                ></i>
                <span v-if="isGenerating"> Generating ({{ progress }}%) </span>
                <span v-else> Generate Bulk Data </span>
              </button>
              <!-- bulk data -->
              <button @click="showAddUserPopup = true" class="action-button">
                Add New User
              </button>
              <button
                @click="showExistingUserSearchPopup = true"
                class="action-button"
              >
                Existing User
              </button>
            </div>
          </div>
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>
          <div v-if="activeMainTab === 'user'">
            <div v-if="activeLeftTab === 'action'" class="action-tab">
              <div v-if="recentActivities.length === 0" class="no-data-message">
                <!-- There is no create or update data for the last 7 days. -->
                Loading the data .....
              </div>
              <table v-else>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action Type</th>
                    <th>Action By</th>
                    <th>User Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in recentActivities" :key="activity.id">
                    <td>{{ formatDate(activity.date_created) }}</td>
                    <td>
                      <span
                        :class="[
                          'action-type',
                          getActionTypeClass(activity.actionType),
                        ]"
                      >
                        {{ activity.actionType }}
                      </span>
                    </td>
                    <td>{{ activity.user_created?.first_name || "N/A" }}</td>
                    <td
                      class="user-details"
                      @click="showUserDetailsPopup(activity)"
                    >
                      {{ getEmployeeId(activity.userDetails) }}
                    </td>
                    <td>
                      <div class="status-box">
                        <template
                          v-if="getControllerStatus(activity) === 'waiting'"
                        >
                          <span class="waiting-status">
                            Waiting for controller response
                            <span class="loading-icon"></span>
                          </span>
                        </template>
                        <template v-else>
                          {{ getControllerStatus(activity) }}
                        </template>
                        <button
                          @click="renderUser(activity)"
                          class="render-button"
                          :disabled="
                            getControllerStatus(activity) === 'waiting'
                          "
                        >
                          Resend
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else-if="activeLeftTab === 'allActivity'"
              class="all-activity-tab"
            >
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action Type</th>
                    <th>Action By</th>
                    <th>User Details</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in activities" :key="activity.id">
                    <td>{{ formatDate(activity.date_created) }}</td>
                    <td>
                      <span
                        :class="[
                          'action-type',
                          getActionTypeClass(activity.actionType),
                        ]"
                      >
                        {{ activity.actionType }}
                      </span>
                    </td>
                    <td>{{ activity.user_created?.first_name || "N/A" }}</td>
                    <td
                      class="user-details"
                      @click="showUserDetailsPopup(activity)"
                    >
                      {{ getEmployeeId(activity.userDetails) }}
                    </td>
                    <td>
                      <div class="status-box">
                        {{ activity.status }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else-if="activeMainTab === 'vehicle'">
            <p>Vehicle Flow data will be displayed here.</p>
          </div>
          <div v-if="activeMainTab === 'visitor'">
            <visitor-flow
              :dropdownData="dropdownData"
              @update:dropdownData="(newData) => (dropdownData = newData)"
            />
          </div>
        </template>
      </template>
    </div>
    <!-- User Edit Details Popup -->
    <!-- <div v-if="showUserEditDetailsPopup && userRevisionDetails.length > 0" class="popup-overlay">
    <div class="popup-content">
      <h2>User Details Changes</h2>
      <div v-for="(user, userIndex) in userRevisionDetails" :key="userIndex" class="user-revision">
        <h3>Employee ID: {{ user.employeeId }}</h3>
        <div class="revision-table-container">
          <table class="revision-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Original Data</th>
                <th>Changed Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="field in getFilteredFields(user)" :key="field">
                <td><strong>{{ formatFieldName(field) }}</strong></td>
                <td>{{ formatFieldValue(field, user.originalData[field]) }}</td>
                <td>
                  <span :class="{ 'changed': isFieldChanged(field, user) }">
                    {{ formatFieldValue(field, user.changedData[field]) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="form-buttons">
        <button @click="showUserEditDetailsPopup = false" class="btn-cancel">Close</button>
      </div>
    </div>
  </div> -->
    <!-- Add User Popup -->
    <div v-if="showAddUserPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Add New User</h2>
        <form @submit.prevent="submitNewUser">
          <div class="form-grid">
            <div class="left-column">
              <div class="form-group">
                <label for="avatar">Profile</label>
                <div class="image-container">
                  <input
                    type="file"
                    id="avatar"
                    @change="handleAvatarUpload"
                    accept="image/*"
                    class="avatar-input"
                  />
                  <label v-if="!avatarPreview" for="avatar">
                    <i
                      class="fa-solid fa-upload fa-bounce"
                      style="color: #d65151"
                    ></i>
                  </label>
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Avatar Preview"
                    class="avatar-preview"
                  />
                  <button
                    v-if="avatarPreview"
                    @click="removeAvatar"
                    class="remove-image-btn"
                  >
                    <i class="fa-solid fa-x fa-xl" style="color: #0d0c0d"></i>
                  </button>
                </div>
              </div>
              <!-- New 2x2 grid for form fields -->
              <div class="form-grid-2x2">
                <div class="form-group-half">
                  <label for="employeeId"
                    >Employee ID <span style="color: red">*</span></label
                  >
                  <input
                    id="employeeId"
                    v-model="formattedEmployeeId"
                    type="text"
                    placeholder="Enter employee ID"
                    class="input-field"
                    :class="{
                      'input-error': !newUser.employeeId && showValidation,
                    }"
                    required
                  />
                  <div
                    v-if="!newUser.employeeId && showValidation"
                    class="error-text"
                  >
                    Employee ID is required.
                  </div>
                </div>

                <div class="form-group-half">
                  <label for="first_name">First Name</label>
                  <input
                    id="first_name"
                    v-model="formattedFirstName"
                    type="text"
                    placeholder="Enter first name"
                    class="input-field"
                  />
                </div>

                <div class="form-group-half">
                  <label for="email"
                    >Email <span style="color: red">*</span></label
                  >
                  <input
                    id="email"
                    v-model="formattedEmail"
                    type="email"
                    placeholder="Enter email"
                    class="input-field"
                    :class="{ 'input-error': !newUser.email && showValidation }"
                    required
                  />
                  <div
                    v-if="!newUser.email && showValidation"
                    class="error-text"
                  >
                    Email is required.
                  </div>
                </div>

                <div class="form-group-half">
                  <label for="phone"
                    >Phone <span style="color: red">*</span></label
                  >
                  <input
                    id="phone"
                    v-model="newUser.phone"
                    type="tel"
                    placeholder="Enter phone number"
                    class="input-field"
                    :class="{ 'input-error': !newUser.phone && showValidation }"
                    required
                  />
                  <div
                    v-if="!newUser.phone && showValidation"
                    class="error-text"
                  >
                    Phone number is required.
                  </div>
                </div>
              </div>
              <!-- <div class="form-group">
                <label for="assignedCards">Assigned Cards & Tag </label>
                <div class="card-input">
                  <input
                    id="assignedCards"
                    v-model="newCardNumber"
                    type="text"
                    placeholder="Swipe card to enter"
                    class="input-field"
                    @keydown.enter.prevent
                    readonly
                    ref="cardInput"
                    @keypress="handleCardSwipe"
                    @focus="handleFocus"
                  />
                  <select v-model="newCardType" class="input-field">
                    <option value="rfid">RFID</option>
                    <option value="tag">Tag</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    @click="createNewCard"
                    class="btn-create"
                  >
                    Create New
                  </button>
                </div>
                <div class="assigned-cards-list">
                  <div
                    v-for="(card, index) in newUser.assignedCards"
                    :key="index"
                    class="assigned-card"
                  >
                    {{ card.rfidCard }} ({{ card.type }})
                    <div class="card-actions">
                      <button
                        type="button"
                        @click="card.cardAccess = !card.cardAccess"
                        :class="[
                          'access-toggle',
                          card.cardAccess !== false ? 'enabled' : 'disabled',
                        ]"
                      >
                        {{ card.cardAccess !== false ? "Enabled" : "Disabled" }}
                      </button>
                      <button
                        type="button"
                        @click="removeCard(index)"
                        class="btn-remove"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div> -->
            </div>
            <div class="right-column">
              <!-- Role -->
              <div class="form-group">
                <label for="role">Role</label>
                <select id="role" v-model="newUser.role" class="input-field">
                  <option
                    v-for="role in dropdownData.roles"
                    :key="role.id"
                    :value="role.id"
                    :selected="role.name === 'Employee'"
                  >
                    {{ role.name }}
                  </option>
                </select>
              </div>
              <!-- Department Dropdown for Add User -->
              <div class="form-group">
                <label>Assigned Department</label>
                <div class="dropdown-container">
                  <input
                    type="text"
                    @click="toggleDropdown('department')"
                    :value="getDepartmentName(newUser.assignedDepartment[0])"
                    placeholder="Select department"
                    class="input-field dropdown-input"
                    readonly
                  />
                  <div v-if="showAddDepartmentDropdown" class="dropdown-list">
                    <div class="search-box">
                      <input
                        type="text"
                        v-model="departmentSearch"
                        @input="
                          searchDropdownData('departments', departmentSearch)
                        "
                        placeholder="Search departments..."
                        class="search-input"
                        @click.stop
                      />
                    </div>
                    <div class="options-list">
                      <div
                        v-for="dept in dropdownData.departments"
                        :key="dept.id"
                        class="option-item"
                        :class="{
                          selected: newUser.assignedDepartment.includes(
                            dept.id
                          ),
                        }"
                        @click="
                          handleAddSingleSelect('assignedDepartment', dept.id)
                        "
                      >
                        {{ dept.departmentName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Access Levels Dropdown for Add User -->
              <div class="form-group">
                <label>Assigned Access Levels</label>
                <div class="dropdown-container">
                  <input
                    type="text"
                    @click="toggleDropdown('accessLevel')"
                    :value="
                      getAccessLevelDisplay(newUser.assignedAccessLevels[0])
                    "
                    placeholder="Select access level"
                    class="input-field dropdown-input"
                    readonly
                  />
                  <div v-if="showAddAccessLevelDropdown" class="dropdown-list">
                    <div class="search-box">
                      <input
                        type="text"
                        v-model="accessLevelSearch"
                        @input="
                          searchDropdownData('accessLevels', accessLevelSearch)
                        "
                        placeholder="Search access levels..."
                        class="search-input"
                        @click.stop
                      />
                    </div>
                    <div class="options-list">
                      <div
                        v-for="level in dropdownData.accessLevels"
                        :key="level.id"
                        class="option-item"
                        :class="{
                          selected: newUser.assignedAccessLevels.includes(
                            level.id
                          ),
                          disabled: !level.accessType,
                        }"
                        @click="
                          level.accessType &&
                            handleAccessLevelChange(
                              'assignedAccessLevels',
                              level.id
                            )
                        "
                      >
                        <div class="level-item">
                          <span>{{ level.accessLevelName }}</span>
                          <span v-if="!level.accessType" class="disabled-tag"
                            >(Disabled)</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Branch Dropdown for Add User -->
              <div class="form-group">
                <label>Assigned Branch</label>
                <div class="dropdown-container">
                  <input
                    type="text"
                    @click="toggleDropdown('branch')"
                    :value="getBranchName(newUser.assignedBranch[0])"
                    placeholder="Select branch"
                    class="input-field dropdown-input"
                    readonly
                  />
                  <div v-if="showAddBranchDropdown" class="dropdown-list">
                    <div class="search-box">
                      <input
                        type="text"
                        v-model="branchSearch"
                        @input="searchDropdownData('branches', branchSearch)"
                        placeholder="Search branches..."
                        class="search-input"
                        @click.stop
                      />
                    </div>
                    <div class="options-list">
                      <div
                        v-for="branch in dropdownData.branches"
                        :key="branch.id"
                        class="option-item"
                        :class="{
                          selected: newUser.assignedBranch.includes(branch.id),
                        }"
                        @click="
                          handleAddSingleSelect('assignedBranch', branch.id)
                        "
                      >
                        {{ branch.branchName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Access toggle remains unchanged -->
              <div class="form-group">
                <label for="accessOn">Access</label>
                <button
                  type="button"
                  @click="newUser.accessOn = !newUser.accessOn"
                  :class="[
                    'toggle-button',
                    newUser.accessOn ? 'enabled' : 'disabled',
                  ]"
                >
                  {{ newUser.accessOn ? "Enabled" : "Disabled" }}
                </button>
              </div>
            </div>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-save" :disabled="isSaving">
              <span v-if="isSaving" class="loading-spinner"></span>
              {{ isSaving ? "Saving..." : "Save" }}
            </button>
            <button
              type="button"
              @click="
                resetNewUserForm();
                showAddUserPopup = false;
              "
              class="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Existing User Search Popup -->
    <div v-if="showExistingUserSearchPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Search Existing User</h2>
        <div class="search-container">
          <input
            v-model="searchQuery"
            @input="searchUsers"
            placeholder="Search by Person Name or Employee ID"
            class="search-input"
          />
        </div>
        <div class="user-list">
          <div v-for="user in filteredUsers" :key="user.id" class="user-item">
            <label class="checkbox-container">
              <input type="checkbox" v-model="selectedUsers" :value="user.id" />
              <span class="checkmark"></span>
              {{ user.first_name }} ({{ user.employeeId }})
            </label>
          </div>
        </div>
        <div class="form-buttons">
          <button
            @click="processSelectedUsers"
            class="btn-next"
            :disabled="selectedUsers.length === 0"
          >
            Next
          </button>
          <button
            @click="showExistingUserSearchPopup = false"
            class="btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!-- Existing User Details Popup -->
    <div v-if="showExistingUserDetailsPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Edit User Details</h2>
        <form @submit.prevent="submitUserUpdates">
          <div class="form-grid">
            <div class="left-column">
              <!-- Profile -->
              <div class="form-group">
                <label for="avatar">Profile</label>
                <div class="image-container">
                  <input
                    type="file"
                    id="avatar"
                    @change="handleAvatarUpload"
                    accept="image/*"
                    class="avatar-input"
                  />
                  <label v-if="!avatarPreview" for="avatar">
                    <i
                      class="fa-solid fa-upload fa-bounce"
                      style="color: #d65151"
                    ></i>
                  </label>
                  <img
                    v-if="avatarPreview"
                    :src="avatarPreview"
                    alt="Avatar Preview"
                    class="avatar-preview"
                  />
                  <img
                    v-else-if="selectedUser.avatar"
                    :src="`/assets/${selectedUser.avatar}?key=system-large-cover`"
                    alt="Current Avatar"
                    class="avatar-preview"
                  />
                  <button
                    v-if="avatarPreview || selectedUser.avatar"
                    @click="removeAvatar"
                    class="remove-image-btn"
                  >
                    <i class="fa-solid fa-x fa-xl" style="color: #0d0c0d"></i>
                  </button>
                </div>
              </div>
              <!-- New 2x2 grid for form fields -->
              <div class="form-grid-2x2">
                <div class="form-group-half">
                  <label for="employeeId"
                    >Employee ID <span style="color: red">*</span></label
                  >
                  <input
                    id="employeeId"
                    v-model="selectedFormattedEmployeeId"
                    type="text"
                    placeholder="Enter employee ID"
                    class="input-field"
                    :class="{
                      'input-error': !selectedUser.employeeId && showValidation,
                    }"
                    required
                  />
                  <div
                    v-if="!selectedUser.employeeId && showValidation"
                    class="error-text"
                  >
                    Employee ID is required.
                  </div>
                </div>

                <div class="form-group-half">
                  <label for="first_name">First Name</label>
                  <input
                    id="first_name"
                    v-model="selectedFormattedFirstName"
                    type="text"
                    placeholder="Enter first name"
                    class="input-field"
                  />
                </div>

                <div class="form-group-half">
                  <label for="email"
                    >Email <span style="color: red">*</span></label
                  >
                  <input
                    id="email"
                    v-model="selectedFormattedEmail"
                    type="email"
                    placeholder="Enter email"
                    class="input-field"
                    :class="{
                      'input-error': !selectedUser.email && showValidation,
                    }"
                    required
                  />
                  <div
                    v-if="!selectedUser.email && showValidation"
                    class="error-text"
                  >
                    Email is required.
                  </div>
                </div>

                <div class="form-group-half">
                  <label for="phone"
                    >Phone <span style="color: red">*</span></label
                  >
                  <input
                    id="phone"
                    v-model="selectedUser.phone"
                    type="tel"
                    placeholder="Enter phone number"
                    class="input-field"
                    :class="{
                      'input-error': !selectedUser.phone && showValidation,
                    }"
                    required
                  />
                  <div
                    v-if="!selectedUser.phone && showValidation"
                    class="error-text"
                  >
                    Phone number is required.
                  </div>
                </div>
              </div>

              <!-- Assigned Cards -->
              <!-- <div class="form-group">
                <label for="assignedCards">Assigned Card & Tag</label>
                <div class="card-input">
                  <input
                    id="assignedCards"
                    v-model="newCardNumber"
                    type="text"
                    placeholder="Swipe card to enter"
                    class="input-field"
                    @keydown.enter.prevent
                    readonly
                    ref="cardInput"
                    @keypress="handleCardSwipe"
                    @focus="handleFocus"
                  />
                  <select v-model="newCardType" class="input-field">
                    <option value="rfid">RFID</option>
                    <option value="tag">Tag</option>
                  </select>
                  <button
                    type="button"
                    @click="createNewCard"
                    class="btn-create"
                  >
                    Create New
                  </button>
                </div>
                <div class="assigned-cards-list">
             <div 
          v-for="(card, index) in selectedUser.assignedCards" 
          :key="index" 
          class="assigned-card"
        >
          {{ getCardInfo(card).rfidCard }} ({{ getCardInfo(card).type }})
          <div class="card-actions">
            <button
              type="button"
              @click="toggleCardAccess(card)"
              :class="[
                'access-toggle',
                {
                  'enabled': isCardAccessEnabled(card),
                  'disabled': !isCardAccessEnabled(card)
                }
              ]"
              :disabled="!canToggleCardAccess(card)"
            >
              {{ isCardAccessEnabled(card) ? 'Enabled' : 'Disabled' }}
            </button>
            <button
              type="button"
              @click="removeCard(index)"
              class="btn-remove"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
              </div> -->
            </div>
            <div class="right-column">
              <!-- Role -->
              <div class="form-group">
                <label for="role">Role</label>
                <select id="role" v-model="selectedUser.role" required>
                  <option
                    v-for="role in dropdownData.roles"
                    :key="role.id"
                    :value="role.id"
                  >
                    {{ role.name }}
                  </option>
                </select>
              </div>
              <!-- Department Dropdown for Edit User -->
              <div class="form-group">
                <label>Assigned Department</label>
                <div class="dropdown-container">
                  <input
                    type="text"
                    @click="toggleEditDropdown('department')"
                    :value="
                      getDepartmentName(selectedUser.assignedDepartment[0])
                    "
                    placeholder="Select department"
                    class="input-field dropdown-input"
                    readonly
                  />
                  <div v-if="showEditDepartmentDropdown" class="dropdown-list">
                    <div class="search-box">
                      <input
                        type="text"
                        v-model="departmentSearch"
                        @input="
                          searchDropdownData('departments', departmentSearch)
                        "
                        placeholder="Search departments..."
                        class="search-input"
                        @click.stop
                      />
                    </div>
                    <div class="options-list">
                      <div
                        v-for="dept in dropdownData.departments"
                        :key="dept.id"
                        class="option-item"
                        :class="{
                          selected: selectedUser.assignedDepartment.includes(
                            dept.id
                          ),
                        }"
                        @click="
                          handleEditSingleSelect('assignedDepartment', dept.id)
                        "
                      >
                        {{ dept.departmentName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Access Levels Dropdown for Edit User -->
              <div class="form-group">
                <label>Assigned Access Levels</label>
                <div class="dropdown-container">
                  <input
                    type="text"
                    @click="toggleEditDropdown('accessLevel')"
                    :value="
                      getAccessLevelDisplay(
                        selectedUser.assignedAccessLevels[0]
                      )
                    "
                    placeholder="Select access level"
                    class="input-field dropdown-input"
                    readonly
                  />
                  <div v-if="showEditAccessLevelDropdown" class="dropdown-list">
                    <div class="search-box">
                      <input
                        type="text"
                        v-model="accessLevelSearch"
                        @input="
                          searchDropdownData('accessLevels', accessLevelSearch)
                        "
                        placeholder="Search access levels..."
                        class="search-input"
                        @click.stop
                      />
                    </div>
                    <div class="options-list">
                      <div
                        v-for="level in dropdownData.accessLevels"
                        :key="level.id"
                        class="option-item"
                        :class="{
                          selected: selectedUser.assignedAccessLevels.includes(
                            level.id
                          ),
                          disabled:
                            !level.accessType &&
                            !selectedUser.assignedAccessLevels.includes(
                              level.id
                            ),
                        }"
                        @click="handleEditAccessLevel(level)"
                      >
                        <div class="level-item">
                          <span>{{ level.accessLevelName }}</span>
                          <span v-if="!level.accessType" class="disabled-tag"
                            >(Disabled)</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Branch Dropdown for Edit User -->
              <div class="form-group">
                <label>Assigned Branch</label>
                <div class="dropdown-container">
                  <input
                    type="text"
                    @click="toggleEditDropdown('branch')"
                    :value="getBranchName(selectedUser.assignedBranch[0])"
                    placeholder="Select branch"
                    class="input-field dropdown-input"
                    readonly
                  />
                  <div v-if="showEditBranchDropdown" class="dropdown-list">
                    <div class="search-box">
                      <input
                        type="text"
                        v-model="branchSearch"
                        @input="searchDropdownData('branches', branchSearch)"
                        placeholder="Search branches..."
                        class="search-input"
                        @click.stop
                      />
                    </div>
                    <div class="options-list">
                      <div
                        v-for="branch in dropdownData.branches"
                        :key="branch.id"
                        class="option-item"
                        :class="{
                          selected: selectedUser.assignedBranch.includes(
                            branch.id
                          ),
                        }"
                        @click="
                          handleEditSingleSelect('assignedBranch', branch.id)
                        "
                      >
                        {{ branch.branchName }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Access toggle remains unchanged -->
              <div class="form-group">
                <label for="accessOn">Access</label>
                <button
                  type="button"
                  @click="handleAccessToggle"
                  :class="[
                    'toggle-button',
                    {
                      enabled: selectedUser.accessOn,
                      disabled: !selectedUser.accessOn || isAccessDisabled,
                    },
                  ]"
                  :disabled="isAccessDisabled"
                >
                  {{ selectedUser.accessOn ? "Enabled" : "Disabled" }}
                </button>
              </div>
            </div>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-save" :disabled="isSaving">
              <span v-if="isSaving" class="loading-spinner"></span>
              {{ isSaving ? "Updating..." : "Update" }}
            </button>
            <button
              type="button"
              @click="showExistingUserDetailsPopup = false"
              class="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Multi-User Edit Popup -->
    <div v-if="showMultiEditPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Edit Multiple Users</h2>
        <form @submit.prevent="submitMultiUserUpdates">
          <div class="form-group checkbox-group">
            <label class="checkbox-container">
              Access On
              <input
                type="checkbox"
                v-model="commonAccessOn"
                :indeterminate.prop="commonAccessOn === null"
              />
              <span class="checkmark"></span>
            </label>
          </div>
          <div class="form-group">
            <label>Assigned Department</label>
            <div class="checkbox-dropdown">
              <input
                type="text"
                v-model="departmentSearch"
                @input="searchDropdownData('departments', departmentSearch)"
                placeholder="Search departments..."
                class="input-dropdown-search"
              />
              <div
                v-for="dept in dropdownData.departments"
                :key="dept.id"
                class="checkbox-item"
              >
                <label class="checkbox-container">
                  <input
                    type="checkbox"
                    :value="dept.id"
                    v-model="newUser.assignedDepartment"
                    @change="handleSingleSelect('assignedDepartment', dept.id)"
                    :disabled="
                      newUser.assignedDepartment.length > 0 &&
                      !newUser.assignedDepartment.includes(dept.id)
                    "
                  />
                  <span class="checkmark"></span>
                  {{ dept.departmentName }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>Assigned Access Levels</label>
            <div class="checkbox-dropdown">
              <input
                type="text"
                v-model="accessLevelSearch"
                @input="searchDropdownData('accessLevels', accessLevelSearch)"
                placeholder="Search access levels..."
                class="input-dropdown-search"
              />
              <div
                v-for="level in dropdownData.accessLevels"
                :key="level.id"
                class="checkbox-item"
              >
                <label
                  class="checkbox-container"
                  :class="{ disabled: !level.accessType }"
                >
                  <input
                    type="checkbox"
                    :value="level.id"
                    v-model="newUser.assignedAccessLevels"
                    @change="handleMultiEditAccessLevel(level)"
                    :disabled="!level.accessType"
                  />
                  <span class="checkmark"></span>
                  <div class="level-item">
                    <span>{{ level.accessLevelName }}</span>
                    <span v-if="!level.accessType" class="disabled-tag"
                      >(Disabled)</span
                    >
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn-save">
              Update Selected Users
            </button>
            <button
              type="button"
              @click="showMultiEditPopup = false"
              class="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </private-view>
</template>
<script>
import VisitorFlow from "./components/view/VisitorFlow.vue";
import { UserValidator } from "./utils/validations/userValidation";
import { CardValidator, validation } from "./utils/validations/cardValidation";
import { convertToCardAccessHex } from "./utils/helpers/convertToCardAccessHex";

export default {
  components: {
    VisitorFlow,
    CardValidator,
    validation,
    convertToCardAccessHex,
  },
  data() {
    return {
      activities: [],
      activeMainTab: "user",
      activeLeftTab: "action",
      showAddUserPopup: false,
      existingUsers: [],
      selectedUser: null,
      searchQuery: "",
      users: [],
      filteredUsers: [],
      selectedUsers: [],
      showExistingUserDetailsPopup: false,
      showExistingUserSearchPopup: false,
      showUserEditDetailsPopup: false,
      userRevisionDetails: [],
      showMultiEditPopup: false,
      initialUserStates: new Map(),
      successMessage: "",
      userRole: null,
      newUser: {
        avatar: null,
        first_name: "",
        email: "",
        phone: "",
        accessOn: true,
        assignedDepartment: [],
        assignedAccessLevels: [],
        assignedBranch: [],
        role: "",
        tenant: "",
        assignedCards: [],
      },
      dropdownData: {
        departments: [],
        accessLevels: [],
        branches: [],
        roles: [],
        tenants: [],
      },
      tabPermissions: {
        user: ["Administrator", "Admin", "Manager"],
        vehicle: ["Administrator", "Admin"],
        visitor: ["Administrator", "Admin"],
      },
      isLoadingPermissions: true,
      userRole: null,
      showAddDepartmentDropdown: false,
      showAddAccessLevelDropdown: false,
      showAddBranchDropdown: false,
      showEditDepartmentDropdown: false,
      showEditAccessLevelDropdown: false,
      showEditBranchDropdown: false,
      departmentSearch: "",
      accessLevelSearch: "",
      branchSearch: "",
      commonAccessOn: null,
      newCardNumber: "",
      newCardType: "rfid",
      newTagNumber: "",
      newTagType: "tag",
      departmentSearch: "",
      accessLevelSearch: "",
      branchSearch: "",
      isSaving: false,
      // New properties for bulk generation
      isGenerating: false,
      progress: 0,
      batchSize: 100,
      totalUsers: 10000,
      usedNames: new Set(),
      usedCardNumbers: new Set(),
      firstNames: [
        "James",
        "John",
        "Robert",
        "Michael",
        "William",
        "David",
        "Richard",
        "Joseph",
        "Thomas",
        "Charles",
        "Mary",
        "Patricia",
        "Jennifer",
        "Linda",
        "Elizabeth",
        "Barbara",
        "Susan",
        "Jessica",
        "Sarah",
        "Karen",
        "Daniel",
        "Paul",
        "Mark",
        "Donald",
        "George",
        "Kenneth",
        "Steven",
        "Edward",
        "Brian",
        "Ronald",
        "Lisa",
        "Nancy",
        "Betty",
        "Helen",
        "Sandra",
        "Donna",
        "Carol",
        "Ruth",
        "Sharon",
        "Michelle",
        "Anthony",
        "Kevin",
        "Jason",
        "Matthew",
        "Gary",
        "Timothy",
        "Jose",
        "Larry",
        "Jeffrey",
        "Frank",
        "Emma",
        "Anna",
        "Sophia",
        "Isabella",
        "Ava",
        "Mia",
        "Emily",
        "Charlotte",
        "Amelia",
        "Olivia",
      ],
      lastNames: [
        "Smith",
        "Johnson",
        "Williams",
        "Brown",
        "Jones",
        "Garcia",
        "Miller",
        "Davis",
        "Rodriguez",
        "Martinez",
        "Anderson",
        "Taylor",
        "Thomas",
        "Hernandez",
        "Moore",
        "Martin",
        "Jackson",
        "Thompson",
        "White",
        "Lopez",
        "Lee",
        "Gonzalez",
        "Harris",
        "Clark",
        "Lewis",
        "Robinson",
        "Walker",
        "Perez",
        "Hall",
        "Young",
        "Wilson",
        "Allen",
        "Scott",
        "Hill",
        "Green",
        "Adams",
        "Baker",
        "Nelson",
        "Campbell",
        "Mitchell",
        "Roberts",
        "Carter",
        "Phillips",
        "Evans",
        "Turner",
        "Torres",
        "Parker",
        "Collins",
        "Edwards",
        "Stewart",
        "Morris",
        "Murphy",
        "Rivera",
        "Cook",
        "Rogers",
        "Morgan",
        "Peterson",
        "Cooper",
        "Reed",
        "Bailey",
        "Chen",
        "Wang",
        "Li",
        "Yang",
        "Liu",
        "Wu",
        "Zhao",
        "Zhou",
        "Sun",
        "Zhang",
        "Kim",
        "Park",
        "Lee",
        "Choi",
        "Jung",
        "Kang",
        "Cho",
        "Yoon",
        "Jang",
        "Lim",
        "Singh",
        "Kumar",
        "Sharma",
        "Patel",
        "Shah",
        "Mehta",
        "Verma",
        "Gupta",
        "Malhotra",
        "Kapoor",
        "Silva",
        "Santos",
        "Oliveira",
        "Pereira",
        "Costa",
        "Carvalho",
        "Almeida",
        "Ferreira",
        "Ribeiro",
        "Sousa",
      ],
    };
  },
  computed: {
    isAccessDisabled() {
      if (!this.selectedUser) return true;

      const selectedAccessLevelId = this.selectedUser.assignedAccessLevels[0];
      const selectedAccessLevel = this.dropdownData.accessLevels.find(
        (level) => level.id === selectedAccessLevelId
      );

      return selectedAccessLevel && !selectedAccessLevel.accessType;
    },
    //past 30 days data only show in activity tab
    recentActivities() {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return this.activities.filter(
        (activity) => new Date(activity.date_created) >= thirtyDaysAgo
      );
    },
    // role based authorization
    canManageUsers() {
      return (
        this.userRole === "Administrator" ||
        this.userRole === "Admin" ||
        this.userRole === "Manager"
      );
    },
    hasUserTabPermission() {
      return (
        this.userRole === "Administrator" ||
        this.userRole === "Admin" ||
        this.userRole === "Manager" ||
        this.userRole === "Admin"
      );
    },

    hasVehicleTabPermission() {
      return (
        this.userRole === "Administrator" ||
        this.userRole === "Admin" ||
        this.userRole === "Admin"
      );
    },

    hasVisitorTabPermission() {
      return (
        this.userRole === "Administrator" ||
        this.userRole === "Admin" ||
        this.userRole === "Admin"
      );
    },
    permissionString() {
      return `${this.hasUserTabPermission},${this.hasVehicleTabPermission},${this.hasVisitorTabPermission}`;
    },

    // Check if user has any tab permissions
    hasAnyTabPermission() {
      return (
        this.hasUserTabPermission ||
        this.hasVehicleTabPermission ||
        this.hasVisitorTabPermission
      );
    },

    // Check if we should show no data message
    showNoDataMessage() {
      // if (this.activeMainTab === 'user') {
      //   return !this.isLoadingPermissions &&
      //          this.hasUserTabPermission &&
      //          this.activities.length === 0;
      // }
      if (this.activeMainTab === "vehicle") {
        return (
          !this.isLoadingPermissions &&
          this.hasVehicleTabPermission &&
          (!this.vehicleData || this.vehicleData.length === 0)
        );
      }
      return false;
    },
    // Check if we have permission for the current active tab
    hasActiveTabPermission() {
      switch (this.activeMainTab) {
        case "user":
          return this.hasUserTabPermission;
        case "vehicle":
          return this.hasVehicleTabPermission;
        case "visitor":
          return this.hasVisitorTabPermission;
        default:
          return false;
      }
    },
    // default data must be enter in small
    formattedEmployeeId: {
      get() {
        return this.newUser._employeeId;
      },
      set(value) {
        this.newUser._employeeId = value.toUpperCase();
      },
    },
    formattedFirstName: {
      get() {
        return this.newUser._firstName;
      },
      set(value) {
        this.newUser._firstName = value.toLowerCase();
      },
    },
    formattedEmail: {
      get() {
        return this.newUser._email;
      },
      set(value) {
        this.newUser._email = value.toLowerCase();
      },
    },
    // Computed properties for selectedUser formatting
    selectedFormattedEmployeeId: {
      get() {
        return this.selectedUser._employeeId;
      },
      set(value) {
        this.selectedUser._employeeId = value.toUpperCase();
      },
    },
    selectedFormattedFirstName: {
      get() {
        return this.selectedUser._firstName;
      },
      set(value) {
        this.selectedUser._firstName = value.toLowerCase();
      },
    },
    selectedFormattedEmail: {
      get() {
        return this.selectedUser._email;
      },
      set(value) {
        this.selectedUser._email = value.toLowerCase();
      },
    },
  },
  watch: {
    "dropdownData.roles": {
      handler(newRoles) {
        if (newRoles.length > 0 && !this.newUser.role) {
          this.newUser.role = this.getDefaultRoleId();
        }
      },
      immediate: true,
    },
  },
  methods: {
    getControllerStatus(activity) {
      return (
        activity.userDetails?.[0]?.personalModule_id?.controllerStatus ||
        "Waiting for controller response"
      );
    },
    handleAccessToggle() {
      if (!this.isAccessDisabled) {
        this.selectedUser.accessOn = !this.selectedUser.accessOn;

        // When disabling access, disable all cards
        if (!this.selectedUser.accessOn) {
          this.selectedUser.assignedCards = this.selectedUser.assignedCards.map(
            (card) => ({
              ...card,
              cardManagement_id: {
                ...card.cardManagement_id,
                cardAccess: false,
              },
            })
          );
        }
      }
    },

    canToggleCardAccess(card) {
      if (!this.selectedUser.accessOn) return false;

      const selectedAccessLevelId = this.selectedUser.assignedAccessLevels[0];
      const selectedAccessLevel = this.dropdownData.accessLevels.find(
        (level) => level.id === selectedAccessLevelId
      );

      return selectedAccessLevel && selectedAccessLevel.accessType;
    },

    isCardAccessEnabled(card) {
      if (!this.selectedUser.accessOn) return false;
      if (!this.canToggleCardAccess(card)) return false;

      return card.cardManagement_id?.cardAccess || false;
    },
    // case sensitive for these data in dialog
    formatInput(value, type) {
      switch (type) {
        case "employeeId":
          return value.toUpperCase();
        case "email":
        case "firstName":
          return value.toLowerCase();
        default:
          return value;
      }
    },
    // Show confirmation before generating
    showBulkGenerateConfirm() {
      if (
        confirm(
          "Are you sure you want to generate 10,000 user records? This operation cannot be undone."
        )
      ) {
        this.generateBulkData();
      }
    },

    // Generate unique employee ID
    generateEmployeeId(index) {
      return `EMP${String(index + 1).padStart(6, "0")}`;
    },

    // Generate unique email
    generateEmail(firstName, employeeId) {
      // Remove any spaces and special characters from firstName
      const cleanFirstName = firstName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") // Remove any non-alphanumeric characters
        .trim();

      // Remove any special characters from employeeId
      const cleanEmployeeId = employeeId
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .trim();

      // Ensure we have valid parts for the email
      if (!cleanFirstName || !cleanEmployeeId) {
        // Fallback to a guaranteed valid format
        return `user${employeeId.toLowerCase()}@sensen.com`;
      }

      return `${cleanFirstName}.${cleanEmployeeId}@sensen.com`;
    },

    // Generate unique phone number
    generatePhone() {
      return `+1${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`;
    },

    // Generate unique name
    generateUniqueName(index) {
      let attempts = 0;
      let fullName;

      while (attempts < 1000) {
        const firstName =
          this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
        const lastName =
          this.lastNames[Math.floor(Math.random() * this.lastNames.length)];

        const suffix =
          attempts > 0 ? ` ${Math.floor(index / 100)}${attempts}` : "";
        fullName = `${firstName} ${lastName}${suffix}`;

        if (!this.usedNames.has(fullName)) {
          this.usedNames.add(fullName);
          return {
            firstName: firstName + (suffix ? suffix : ""),
            fullName: fullName,
          };
        }

        attempts++;
      }

      fullName = `User ${index + 1}`;
      this.usedNames.add(fullName);
      return {
        firstName: `User ${index + 1}`,
        fullName: fullName,
      };
    },

    // Generate unique 10-digit number
    generateUniqueCardNumber() {
      let cardNumber;
      do {
        // Generate a number between 1000000000 and 9999999999
        cardNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      } while (this.usedCardNumbers.has(cardNumber));

      this.usedCardNumbers.add(cardNumber);
      return cardNumber;
    },

    // Modified generateCardsAndTags method
    generateCardsAndTags(accessLevelNumber) {
      const cards = [];

      // Generate 1 RFID card
      const rfidCard = this.generateUniqueCardNumber();
      cards.push({
        rfidCard: rfidCard.toString(),
        type: "rfid",
        cardAccess: true,
        cardAccessLevelArray: `${rfidCard}:1:${accessLevelNumber}`,
      });

      // Generate 1 tag
      const tagCard = this.generateUniqueCardNumber();
      cards.push({
        rfidCard: tagCard.toString(),
        type: "tag",
        cardAccess: true,
        cardAccessLevelArray: `${tagCard}:1:${accessLevelNumber}`,
      });

      return cards;
    },

    // Get random item from array
    getRandomItem(array) {
      return array[Math.floor(Math.random() * array.length)];
    },
    getRandomAvatarId() {
      // These should be actual file IDs from your system
      const avatarIds = [
        "00000000-0000-0000-0000-000000000001",
        "00000000-0000-0000-0000-000000000002",
        "00000000-0000-0000-0000-000000000003",
        "00000000-0000-0000-0000-000000000004",
        "00000000-0000-0000-0000-000000000005",
      ];
      return avatarIds[Math.floor(Math.random() * avatarIds.length)];
    },
    // Main bulk data generation function
    async generateBulkData() {
      this.isGenerating = true;
      this.progress = 0;
      this.usedNames.clear();
      this.usedCardNumbers.clear();
      let successCount = 0;
      let failedBatches = [];

      const batches = Math.ceil(this.totalUsers / this.batchSize);

      try {
        const userTenant = await this.fetchUserRole();
        if (!userTenant) throw new Error("User tenant not found");

        const employeeRole = this.dropdownData.roles.find(
          (role) => role.name === "Employee"
        )?.id;
        if (!employeeRole) throw new Error("Employee role not found");

        for (let batch = 0; batch < batches; batch++) {
          const batchUsers = [];
          const start = batch * this.batchSize;
          const end = Math.min(start + this.batchSize, this.totalUsers);

          for (let i = start; i < end; i++) {
            const employeeId = this.generateEmployeeId(i);
            const { firstName, fullName } = this.generateUniqueName(i);
            const email = this.generateEmail(firstName, employeeId);
            const phone = this.generatePhone();

            // Get random access level and its number first
            const selectedAccessLevel = this.getRandomItem(
              this.dropdownData.accessLevels
            );
            const accessLevelNumber =
              selectedAccessLevel?.accessLevelNumber || "";

            // Then generate cards with the access level number
            const generatedCards = this.generateCardsAndTags(accessLevelNumber);

            const userData = {
              employeeId,
              status: "active",
              accessOn: true,
              assignedUser: {
                first_name: fullName,
                email,
                phone,
                avatar: this.getRandomAvatarId(),
                role: employeeRole,
                tenant: userTenant,
              },
              assignedAccessLevels: {
                create: [
                  {
                    accesslevels_id: { id: selectedAccessLevel.id },
                  },
                ],
              },
              assignedCards: {
                create: generatedCards.map((card) => ({
                  cardManagement_id: {
                    rfidCard: card.rfidCard,
                    type: card.type,
                    cardAccess: card.cardAccess,
                    tenant: userTenant,
                    accessLevelsId: accessLevelNumber,
                    cardAccessLevelArray: card.cardAccessLevelArray,
                  },
                })),
              },
              assignedDepartment: {
                create: [this.getRandomItem(this.dropdownData.departments)].map(
                  (dept) => ({
                    department_id: { id: dept.id },
                  })
                ),
              },
              assignedBranch: {
                create: [this.getRandomItem(this.dropdownData.branches)].map(
                  (branch) => ({
                    branch_id: { id: branch.id },
                  })
                ),
              },
            };

            batchUsers.push(userData);
          }

          if (batchUsers.length === 0) continue;

          try {
            // Create action for batch
            const createActionResponse = await fetch("/items/actions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                actionType: "bulk-create",
                status: "sending",
                userDetails: batchUsers.map((user) => ({
                  personalModule_id: user,
                })),
              }),
            });

            if (!createActionResponse.ok) {
              throw new Error(`Failed to create batch ${batch + 1}`);
            }

            const actionData = await createActionResponse.json();
            const actionId = actionData.data.id;

            // Update status to "updated"
            const updateResponse = await fetch(`/items/actions/${actionId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                status: "updated",
              }),
            });

            if (!updateResponse.ok) {
              throw new Error(`Failed to update status for batch ${batch + 1}`);
            }

            successCount += batchUsers.length;
          } catch (error) {
            failedBatches.push(batch + 1);
            console.error(`Error in batch ${batch + 1}:`, error);
          }

          // Update progress
          this.progress = Math.round(((batch + 1) / batches) * 100);

          // Refresh activities list after each successful batch
          await this.fetchActivities();
        }

        // Show success message with details
        const message =
          failedBatches.length > 0
            ? `Generated ${successCount} records successfully. Failed batches: ${failedBatches.join(
                ", "
              )}`
            : `Successfully generated ${successCount} user records!`;

        this.successMessage = message;
        setTimeout(() => {
          this.successMessage = "";
        }, 5000);
      } catch (error) {
        alert(`Error generating bulk data: ${error.message}`);
      } finally {
        this.isGenerating = false;
        this.progress = 0;
        this.usedNames.clear();
      }
    },

    // Add email validation helper
    validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailRegex.test(email);
    },
    //date format for user_created
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    },
    // action happend in flow
    getActionTypeClass(actionType) {
      if (!actionType) return "action-type-default";
      switch (actionType.toLowerCase()) {
        case "create":
          return "action-type-create";
        case "update":
          return "action-type-update";
        case "delete":
          return "action-type-delete";
        case "bulk-edit":
          return "action-type-bulk-edit";
        default:
          return "action-type-default";
      }
    },
    // get employee id
    getEmployeeId(userDetails) {
      if (userDetails && Array.isArray(userDetails)) {
        const ids = userDetails
          .map((user) => user.personalModule_id?.employeeId)
          .filter((id) => id);
        return ids.length > 0 ? ids.join(", ") : "N/A";
      }
      return "N/A";
    },
    //old and new data
    showUserDetailsPopup(activity) {
      this.userRevisionDetails = this.getUserRevisionDetails(activity);
      this.showUserEditDetailsPopup = true;
    },
    getUserRevisionDetails(activity) {
      const userDetails = activity.userDetails;
      return userDetails.map((detail) => {
        const originalData =
          this.initialUserStates.get(detail.personalModule_id.id) || {};
        const changedData = detail.personalModule_id;
        return {
          employeeId: changedData.employeeId,
          originalData: this.extractRelevantData(originalData),
          changedData: this.extractRelevantData(changedData),
        };
      });
    },
    extractRelevantData(data) {
      return {
        employeeId: data.employeeId,
        first_name: data.assignedUser?.first_name,
        phone: data.assignedUser?.phone,
        email: data.assignedUser?.email,
        role: data.assignedUser?.role?.name,
        accessOn: data.accessOn,
        tenantName: data.assignedUser?.tenant?.tenantName,
        assignedDepartment: this.formatArrayData(
          data.assignedDepartment,
          "departmentName"
        ),
        assignedAccessLevels: this.formatArrayData(
          data.assignedAccessLevels,
          "accessLevelName"
        ),
        assignedBranch: this.formatArrayData(data.assignedBranch, "branchName"),
        assignedTags: this.formatArrayData(data.assignedTags, "rfidCard"),
        assignedCards: this.formatArrayData(data.assignedCards, "rfidCard"),
      };
    },
    formatArrayData(array, key) {
      return (
        array
          ?.map((item) => item[key] || item[`${key}_id`]?.[key])
          .join(", ") || ""
      );
    },
    getFilteredFields(user) {
      return Object.keys(user.originalData).filter(
        (field) =>
          user.originalData[field] !== undefined ||
          user.changedData[field] !== undefined
      );
    },
    formatFieldName(field) {
      return field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    },
    formatFieldValue(field, value) {
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return value === undefined ? "N/A" : value;
    },
    isFieldChanged(field, user) {
      return user.originalData[field] !== user.changedData[field];
    },
    // resend the data to controller
    renderUser(activity) {
      console.log("Render user:", activity);
    },
    //fetch data data for table tabs
    async fetchActivities() {
      try {
        const userTenant = await this.fetchUserRole();
        if (!userTenant) throw new Error("User tenant not found");

        const fields = [
          "id",
          "date_created",
          "actionType",
          "status",
          "user_created.first_name",
          "userDetails.personalModule_id.employeeId",
          "userDetails.personalModule_id.assignedUser.tenant.tenantId",
          "userDetails.personalModule_id.assignedUser.tenant.tenantName",
          "userDetails.personalModule_id.controllerStatus",
        ];

        const response = await fetch(
          `/items/actions?fields[]=${fields.join(
            "&fields[]="
          )}&filter[userDetails][personalModule_id][assignedUser][tenant][tenantId][_eq]=${userTenant}&sort=-date_created`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Additional check to filter activities by tenant
        this.activities = data.data.filter((activity) => {
          // Check if the activity has userDetails and matches the user's tenant
          return activity.userDetails?.some(
            (detail) =>
              detail.personalModule_id?.assignedUser?.tenant?.tenantId ===
              userTenant
          );
        });
      } catch (error) {
        console.error("Error fetching activities:", error);
        this.activities = []; // Set empty array on error
      }
    },
    //role based authentication
    async fetchUserRole() {
      this.isLoadingPermissions = true;
      try {
        const response = await fetch(
          "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        this.userRole = data.data.role.name;
        this.newUser.tenant = data.data.tenant;

        // If current tab is not permitted, switch to first permitted tab
        if (!this.hasActiveTabPermission) {
          if (this.hasUserTabPermission) this.activeMainTab = "user";
          else if (this.hasVehicleTabPermission) this.activeMainTab = "vehicle";
          else if (this.hasVisitorTabPermission) this.activeMainTab = "visitor";
        }
        return data.data.tenant;
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        this.isLoadingPermissions = false;
      }
    },

    // Add method to check specific tab permission
    hasTabPermission(tabName) {
      switch (tabName) {
        case "user":
          return this.hasUserTabPermission;
        case "vehicle":
          return this.hasVehicleTabPermission;
        case "visitor":
          return this.hasVisitorTabPermission;
        default:
          return false;
      }
    },

    // Modify your tab switching logic
    async switchTab(tabName) {
      if (this.hasTabPermission(tabName)) {
        this.activeMainTab = tabName;
      }
    },
    //fetch drop down data
    async fetchDropdownData() {
      try {
        const userTenant = await this.fetchUserRole();
        if (!userTenant) throw new Error("User tenant not found");

        await Promise.all([
          // Departments with tenant filter
          this.fetchData(
            `/items/department?fields=id,departmentName,departmentId&filter[tenant][_eq]=${userTenant}`,
            "departments"
          ),

          // Access Levels with tenant filter
          this.fetchData(
            `/items/accesslevels?fields=id,accessLevelName,accessLevelNumber,accessType&filter[tenant][tenantId][_eq]=${userTenant}`,
            "accessLevels"
          ),

          // Branches with tenant filter
          this.fetchData(
            `/items/branch?fields=id,branchName,branchId&filter[tenant][tenantId][_eq]=${userTenant}`,
            "branches"
          ),

          // Roles without tenant filter (keep as is)
          this.fetchData(
            "/roles?fields=id,name&filter[_and][0][name][_neq]=Administrator&filter[_and][1][name][_neq]=esslAdmin",
            "roles"
          ),
        ]);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    },
    async fetchData(url, key) {
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (key === "accessLevels") {
          this.dropdownData[key] = data.data.map((level) => ({
            ...level,
            accessLevelNumber: level.accessLevelNumber || "",
            accessType: level.accessType,
          }));
        } else {
          this.dropdownData[key] = data.data;
        }
      } catch (error) {
        console.error(`Error fetching ${key}:`, error);
        this.dropdownData[key] = []; // Set empty array on error
      }
    },
    // Add this to your methods section
    getDefaultRoleId() {
      const EmployeeRole = this.dropdownData.roles.find(
        (role) => role.name === "Employee"
      );
      return EmployeeRole ? EmployeeRole.id : "";
    },
    // Search dropdown data based on field and search term
    async searchDropdownData(field, searchTerm) {
      if (!searchTerm) {
        await this.fetchDropdownData();
        return;
      }

      // Convert search term to lowercase
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      let url = "";
      switch (field) {
        case "departments":
          url = `/items/department?fields=id,departmentName,departmentId&filter[departmentName][_icontains]=${lowerCaseSearchTerm}`;
          break;
        case "accessLevels":
          url = `/items/accesslevels?fields=id,accessLevelName&filter[accessLevelName][_icontains]=${lowerCaseSearchTerm}`;
          break;
        case "branches":
          url = `/items/branch?fields=id,branchName,branchId&filter[branchName][_icontains]=${lowerCaseSearchTerm}`;
          break;
      }
      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        this.dropdownData[field] = data.data;
      } catch (error) {
        console.error(`Error fetching filtered ${field}:`, error);
      }
    },
    // Add these helper methods after changing to checkbox to normal in dropdown
    getDepartmentName(id) {
      const department = this.dropdownData.departments.find(
        (dept) => dept.id === id
      );
      return department ? department.departmentName : "";
    },

    getAccessLevelName(id) {
      const level = this.dropdownData.accessLevels.find(
        (level) => level.id === id
      );
      return level ? level.accessLevelName : "";
    },

    getBranchName(id) {
      const branch = this.dropdownData.branches.find(
        (branch) => branch.id === id
      );
      return branch ? branch.branchName : "";
    },

    // Handle selection for Add User form
    handleAddSingleSelect(field, selectedId) {
      this.newUser[field] = [selectedId];

      // Close the dropdown
      switch (field) {
        case "assignedDepartment":
          this.showAddDepartmentDropdown = false;
          break;
        case "assignedAccessLevels":
          this.showAddAccessLevelDropdown = false;
          break;
        case "assignedBranch":
          this.showAddBranchDropdown = false;
          break;
      }
    },

    // Handle selection for Edit User form
    handleEditSingleSelect(field, selectedId) {
      this.selectedUser[field] = [selectedId];

      // Close the dropdown
      switch (field) {
        case "assignedDepartment":
          this.showEditDepartmentDropdown = false;
          break;
        case "assignedAccessLevels":
          this.showEditAccessLevelDropdown = false;
          break;
        case "assignedBranch":
          this.showEditBranchDropdown = false;
          break;
      }
    },
    // upload profile
    async handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await fetch("/files", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("File upload failed");
          }
          const fileData = await response.json();
          const fileId = fileData.data.id;
          const cacheBuster = fileData.data["cache-buster"];
          const key = fileData.data.key;
          const fileUrl = `/assets/${fileId}?key=system-large-cover&cache-buster=${new Date().toISOString()}`;
          if (this.showAddUserPopup) {
            this.newUser.avatar = fileId;
          } else {
            this.selectedUser.avatar = fileId;
          }
          this.avatarPreview = fileUrl;
        } catch (error) {
          console.error("Error uploading avatar:", error);
          alert("Failed to upload avatar. Please try again.");
        }
      }
    },
    // remove profile
    removeAvatar() {
      this.avatarPreview = null;
      document.getElementById("avatar").value = "";
      if (this.showAddUserPopup) {
        this.newUser.avatar = null;
      } else {
        this.selectedUser.avatar = null;
      }
    },

    handleCardSwipe(e) {
      e.preventDefault();
      if (this.swipeTimeout) {
        clearTimeout(this.swipeTimeout);
      }
      this.cardBuffer = (this.cardBuffer || "") + e.key;

      this.swipeTimeout = setTimeout(() => {
        if (this.cardBuffer) {
          this.newCardNumber = this.cardBuffer;
          this.cardBuffer = "";
        }
      }, 100);
    },

    handleFocus() {
      // Clear the input when focused (new swipe starting)
      this.newCardNumber = "";
      this.cardBuffer = "";
    },

    async createNewCard() {
      if (this.newCardNumber && this.newCardType) {
        try {
          const existingCards = this.showAddUserPopup
            ? this.newUser.assignedCards
            : this.selectedUser.assignedCards;

          await CardValidator.validateNewCard(
            this.newCardNumber,
            this.newCardType,
            existingCards
          );

          // Get the current access level number
          const currentAccessLevels = this.showAddUserPopup
            ? this.newUser.assignedAccessLevels
            : this.selectedUser.assignedAccessLevels;

          const selectedAccessLevelId = currentAccessLevels[0];
          const selectedAccessLevel = this.dropdownData.accessLevels.find(
            (level) => level.id === selectedAccessLevelId
          );
          const accessLevelNumber =
            selectedAccessLevel?.accessLevelNumber || "";

          // Create cardAccessLevelArray with 1 for true
          const cardAccessLevelArray = `${this.newCardNumber}:1:${accessLevelNumber}`;

          const newCard = {
            rfidCard: this.newCardNumber,
            type: this.newCardType,
            cardAccess: true,
            accessLevelsId: accessLevelNumber,
            cardAccessLevelArray: cardAccessLevelArray,
          };

          if (this.showAddUserPopup) {
            this.newUser.assignedCards.push(newCard);
          } else {
            this.selectedUser.assignedCards.push({
              cardManagement_id: { ...newCard },
            });
          }

          this.newCardNumber = "";
          this.cardBuffer = "";
          this.$refs.cardInput.focus();
        } catch (error) {
          alert(error.message);
        }
      }
    },
    getAccessLevelDisplay(levelId) {
      const level = this.dropdownData.accessLevels.find(
        (l) => l.id === levelId
      );
      if (!level) return "";
      return !level.accessType
        ? `${level.accessLevelName} (Disabled)`
        : level.accessLevelName;
    },

    handleEditAccessLevel(level) {
      if (
        this.selectedUser.assignedAccessLevels.includes(level.id) ||
        level.accessType
      ) {
        this.handleAccessLevelChange("assignedAccessLevels", level.id);

        // If switching to a disabled access level
        if (!level.accessType) {
          this.selectedUser.accessOn = false;
          this.selectedUser.assignedCards = this.selectedUser.assignedCards.map(
            (card) => ({
              ...card,
              cardManagement_id: {
                ...card.cardManagement_id,
                cardAccess: false,
              },
            })
          );
        }
      }
    },

    handleAccessLevelChange(field, selectedId) {
      const selectedLevel = this.dropdownData.accessLevels.find(
        (level) => level.id === selectedId
      );

      if (!this.showExistingUserDetailsPopup && !selectedLevel.accessType) {
        return;
      }

      const accessLevelNumber = selectedLevel?.accessLevelNumber || "";

      // Update cards with new access level number and cardAccessLevelArray using 1/0
      if (this.showAddUserPopup) {
        this.newUser.assignedCards = this.newUser.assignedCards.map((card) => ({
          ...card,
          accessLevelsId: accessLevelNumber,
          cardAccessLevelArray: `${card.rfidCard}:${
            card.cardAccess ? 1 : 0
          }:${accessLevelNumber}`,
        }));
        this.handleAddSingleSelect(field, selectedId);
      } else if (this.selectedUser) {
        this.selectedUser.assignedCards = this.selectedUser.assignedCards.map(
          (card) => ({
            ...card,
            cardManagement_id: {
              ...card.cardManagement_id,
              accessLevelsId: accessLevelNumber,
              cardAccessLevelArray: `${card.cardManagement_id.rfidCard}:${
                card.cardManagement_id.cardAccess ? 1 : 0
              }:${accessLevelNumber}`,
            },
          })
        );
        this.handleEditSingleSelect(field, selectedId);
      }
    },

    // Add to data()
    data() {
      return {
        cardBuffer: "",
        swipeTimeout: null,
      };
    },
    // remove rfid card
    removeCard(index) {
      if (this.showAddUserPopup) {
        this.newUser.assignedCards.splice(index, 1);
      } else {
        this.selectedUser.assignedCards.splice(index, 1);
      }
    },
    // to show the existing data in edit popup
    async processSelectedUsers() {
      if (this.selectedUsers.length === 1) {
        const selectedUserId = this.selectedUsers[0];
        const user = this.users.find((u) => u.id === selectedUserId);
        console.log(user);
        if (user) {
          this.selectedUser = {
            ...user,
            _employeeId: user.employeeId || "",
            _firstName: user.first_name || "",
            _email: user.email || "",
            assignedDepartment: user.assignedDepartment.map(
              (dept) => dept.department_id.id
            ),
            assignedAccessLevels: user.assignedAccessLevels.map(
              (level) => level.accesslevels_id.id
            ),
            assignedBranch: user.assignedBranch.map(
              (branch) => branch.branch_id.id
            ),
            role: user.role ? user.role.id : "",
          };
          // Set form fields
          this.$nextTick(() => {
            if (this.selectedUser._employeeId) {
              this.selectedFormattedEmployeeId = this.selectedUser._employeeId;
            }
            if (this.selectedUser._firstName) {
              this.selectedFormattedFirstName = this.selectedUser._firstName;
            }
            if (this.selectedUser._email) {
              this.selectedFormattedEmail = this.selectedUser._email;
            }
          });
          this.showExistingUserDetailsPopup = true;
        }
      } else if (this.selectedUsers.length > 1) {
        this.showMultiEditPopup = true;
      }
      this.showExistingUserSearchPopup = false;
    },
    // updation in  create user details in action collection
    async updateActionStatus(actionId, status) {
      try {
        const response = await fetch(`/items/actions/${actionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: status }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update action status to ${status}`);
        }

        this.actionStatus = { ...this.actionStatus, [actionId]: status };
      } catch (error) {
        alert(`Error updating action status to ${status}:`, error);
      }
    },
    async updateControllerStatusForUser(changedAccessLevels, tenantId) {
      try {
        // Fetch all access levels for this tenant to get door numbers
        const accessLevelsResponse = await fetch(
          `/items/accesslevels?filter[tenant][tenantId][_eq]=${tenantId}` +
            "&fields[]=accessLevelName" +
            "&fields[]=accessLevelNumber" +
            "&fields[]=tenant.tenantId" +
            "&fields[]=tenant.tenantName" +
            "&fields[]=assignedDoors.doors_id.doorNumber" +
            "&fields[]=assignedDoors.doors_id.doorName" +
            "&fields[]=assignedDoors.doors_id.id" +
            "&fields[]=assignedDoors.id"
        );

        if (!accessLevelsResponse.ok) {
          throw new Error("Failed to fetch access levels");
        }

        const accessLevelsData = await accessLevelsResponse.json();
        const affectedDoorNumbers = new Set();

        // Get all door numbers associated with the changed access levels
        changedAccessLevels.forEach((accessLevelId) => {
          const accessLevel = accessLevelsData.data.find(
            (level) => level.id === accessLevelId
          );
          if (accessLevel && accessLevel.assignedDoors) {
            accessLevel.assignedDoors.forEach((door) => {
              if (door.doors_id && door.doors_id.doorNumber) {
                affectedDoorNumbers.add(door.doors_id.doorNumber);
              }
            });
          }
        });

        if (affectedDoorNumbers.size === 0) {
          return;
        }

        // Fetch all controllers for this tenant
        const controllersResponse = await fetch(
          `/items/controllers?filter[tenant][tenantId][_eq]=${tenantId}` +
            "&fields=assignedDoor.doors_id.doorNumber" +
            "&fields=assignedDoor.doors_id.doorName" +
            "&fields=assignedDoor.doors_id.id" +
            "&fields=id" +
            "&fields=controllerStatus" +
            "&fields=controllerName" +
            "&fields=status" +
            "&fields=controllerType" +
            "&fields=assignedDoor.id" +
            "&fields=tenant.tenantId" +
            "&fields=tenant.tenantName" +
            "&fields=branch.branchName" +
            "&fields=branch.id" +
            "&fields=date_create"
        );

        if (!controllersResponse.ok) {
          throw new Error("Failed to fetch controllers");
        }

        const controllersData = await controllersResponse.json();
        const doorNumbers = Array.from(affectedDoorNumbers);

        // Find controllers that need to be updated
        const controllersToUpdate = controllersData.data.filter(
          (controller) => {
            if (!controller.assignedDoor) return false;
            return controller.assignedDoor.some((door) =>
              doorNumbers.includes(door.doors_id?.doorNumber)
            );
          }
        );

        // Update controllers' status
        const updatePromises = controllersToUpdate.map((controller) =>
          fetch(`/items/controllers/${controller.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              controllerStatus: "waiting",
            }),
          })
        );

        await Promise.all(updatePromises);
      } catch (error) {
        console.error("Error updating controller status:", error);
        throw error;
      }
    },
    // submit the  new user details
    async submitNewUser(isRender = false) {
      this.isSaving = true;
      let actionId = null;
      try {
        await UserValidator.validateNewUser({
          email: this.formatInput(this.newUser._email, "email"),
          phone: this.newUser.phone,
        });

        await CardValidator.validateCardsBeforeSave(this.newUser.assignedCards);

        const userTenant = await this.fetchUserRole();
        if (!userTenant) throw new Error("User tenant not found");

        // Get the access level number from the selected access level
        const selectedAccessLevelId = this.newUser.assignedAccessLevels[0];
        const selectedAccessLevel = this.dropdownData.accessLevels.find(
          (level) => level.id === selectedAccessLevelId
        );
        const accessLevelNumber = selectedAccessLevel?.accessLevelNumber || "";

        // Process cards with access level number
        const processedCards = this.newUser.assignedCards.map((card) => ({
          cardManagement_id: {
            rfidCard: card.rfidCard,
            type: card.type,
            cardAccess: card.cardAccess,
            tenant: userTenant,
            accessLevelsId: accessLevelNumber,
            cardAccessLevelArray: `${card.rfidCard}:${
              card.cardAccess ? 1 : 0
            }:${accessLevelNumber}`,
            cardAccessLevelHex: convertToCardAccessHex(
              rfidCard,
              cardAccess,
              accessLevelNumber
            ),
          },
        }));
        if (
          this.newUser.assignedAccessLevels.length > 0 &&
          (this.newUser.accessOn || this.newUser.assignedCards.length > 0)
        ) {
          await this.updateControllerStatusForUser(
            this.newUser.assignedAccessLevels,
            userTenant
          );
        }
        const newUserPayload = {
          employeeId: this.formatInput(this.newUser._employeeId, "employeeId"),
          uniqueId: `${userTenant}-${this.newUser._employeeId}`,
          status: "active",
          accessOn: this.newUser.accessOn,
          assignedUser: {
            first_name: this.formatInput(this.newUser._firstName, "firstName"),
            email: this.formatInput(this.newUser._email, "email"),
            phone: this.newUser.phone,
            password: this.newUser.phone,
            avatar: this.newUser.avatar,
            role: this.newUser.role,
            tenant: userTenant,
          },
          assignedAccessLevels: {
            create: this.newUser.assignedAccessLevels.map((id) => ({
              accesslevels_id: { id: id },
            })),
          },
          assignedCards: {
            create: processedCards,
          },
          assignedDepartment: {
            create: this.newUser.assignedDepartment.map((id) => ({
              department_id: { id: id },
            })),
          },
          assignedBranch: {
            create: this.newUser.assignedBranch.map((id) => ({
              branch_id: { id: id },
            })),
          },
        };

        const actionPayload = {
          actionType: "create",
          status: isRender ? "rendering" : "waiting",
          userDetails: [{ personalModule_id: newUserPayload }],
        };

        const createActionResponse = await fetch("/items/actions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(actionPayload),
        });

        if (!createActionResponse.ok) {
          throw new Error("Failed to create action");
        }
        const createActionData = await createActionResponse.json();

        actionId = createActionData.data.id;
        await this.updateActionStatus(actionId, "sending");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await this.updateActionStatus(actionId, "updated");

        this.resetNewUserForm();
        this.isSaving = false;
        alert("User successfully added!");
        this.showAddUserPopup = false;
        await this.loadUsers();
        await this.fetchActivities();
      } catch (error) {
        this.isSaving = false;
        console.log("Failed to add user. Please try again.", error);
        alert("Failed to add user. Please try again.", error.message);
      }
    },
    // Update your existing resetNewUserForm method
    resetNewUserForm() {
      this.newUser = {
        avatar: null,
        employeeId: "",
        first_name: "",
        email: "",
        phone: "",
        accessOn: true,
        assignedDepartment: [],
        assignedAccessLevels: [],
        assignedBranch: [],
        role: this.getDefaultRoleId(),
        tenant: "",
        assignedCards: [],
      };
      this.avatarPreview = null;
      this.newCardNumber = "";
      this.newCardType = "rfid";
    },
    // data for existing user and popup
    async loadUsers() {
      try {
        // First get the user's tenant
        const userTenant = await this.fetchUserRole();
        if (!userTenant) throw new Error("User tenant not found");

        const fields = [
          "userDetails.personalModule_id.id",
          "userDetails.personalModule_id.employeeId",
          "userDetails.personalModule_id.accessOn",
          "userDetails.personalModule_id.status",
          "userDetails.personalModule_id.controllerStatus",
          "userDetails.personalModule_id.assignedUser.id",
          "userDetails.personalModule_id.assignedUser.first_name",
          "userDetails.personalModule_id.assignedUser.email",
          "userDetails.personalModule_id.assignedUser.phone",
          "userDetails.personalModule_id.assignedUser.avatar.id",
          "userDetails.personalModule_id.assignedUser.role.id",
          "userDetails.personalModule_id.assignedUser.role.name",
          "userDetails.personalModule_id.assignedUser.tenant",
          "userDetails.personalModule_id.assignedUser.tenant.tenantId",
          "userDetails.personalModule_id.assignedUser.tenant.tenantName",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.id",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.rfidCard",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.type",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.cardAccess",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.tenant",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.cardAccessLevelArray",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.cardAccessLevelHex",
          "userDetails.personalModule_id.assignedCards.cardManagement_id.accessLevelsId",
          "userDetails.personalModule_id.assignedCards.id",
          "userDetails.personalModule_id.assignedDepartment.department_id.id",
          "userDetails.personalModule_id.assignedDepartment.department_id.departmentId",
          "userDetails.personalModule_id.assignedDepartment.department_id.departmentName",
          "userDetails.personalModule_id.assignedDepartment.id",
          "userDetails.personalModule_id.assignedAccessLevels.accesslevels_id.id",
          "userDetails.personalModule_id.assignedAccessLevels.accesslevels_id.accessLevelName",
          "userDetails.personalModule_id.assignedAccessLevels.accesslevels_id.accessLevelNumber",
          "userDetails.personalModule_id.assignedAccessLevels.id",
          "userDetails.personalModule_id.assignedTag.cardManagement_id.id",
          "userDetails.personalModule_id.assignedTag.cardManagement_id.rfidCard",
          "userDetails.personalModule_id.assignedTag.cardManagement_id.type",
          "userDetails.personalModule_id.assignedTag.cardManagement_id.cardAccess",
          "userDetails.personalModule_id.assignedTag.id",
          "userDetails.personalModule_id.assignedBranch.branch_id.id",
          "userDetails.personalModule_id.assignedBranch.branch_id.branchName",
          "userDetails.personalModule_id.assignedBranch.branch_id.branchId",
          "userDetails.personalModule_id.assignedBranch.id",
        ];

        // Add tenant filter to the API request
        const response = await fetch(
          `/items/actions?fields=${fields.join(
            "&fields="
          )}&filter[userDetails][personalModule_id][assignedUser][tenant][tenantId][_eq]=${userTenant}&limit=25`
        );

        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const usersMap = new Map();

        // Process only users that belong to the current tenant
        data.data.forEach((action) => {
          const userDetails = action.userDetails?.[0]?.personalModule_id ?? {};

          // Check if user belongs to current tenant
          if (
            userDetails.id &&
            userDetails.assignedUser?.tenant?.tenantId === userTenant
          ) {
            console.log(
              userDetails.assignedUser?.tenant?.tenantId === userTenant
            );
            const user = {
              id: userDetails.id,
              employeeId: userDetails.employeeId ?? "",
              accessOn: userDetails.accessOn ?? false,
              status: userDetails.status ?? "",
              assigneduerId: userDetails.assignedUser.id,
              first_name: userDetails.assignedUser?.first_name ?? "",
              email: userDetails.assignedUser?.email ?? "",
              phone: userDetails.assignedUser?.phone ?? "",
              avatar: userDetails.assignedUser?.avatar?.id ?? null,
              assignedUserId: userDetails.assignedUser?.id ?? null,
              role: userDetails.assignedUser?.role
                ? {
                    id: userDetails.assignedUser.role.id,
                    name: userDetails.assignedUser.role.name,
                  }
                : null,
              assignedCards: (userDetails.assignedCards ?? []).map((card) => ({
                id: card.id,
                cardManagement_id: {
                  id: card.cardManagement_id?.id,
                  rfidCard: card.cardManagement_id?.rfidCard ?? "",
                  type: card.cardManagement_id?.type ?? "",
                  cardAccess: card.cardManagement_id?.cardAccess,
                },
              })),
              assignedDepartment: (userDetails.assignedDepartment ?? []).map(
                (dept) => ({
                  id: dept.id,
                  department_id: {
                    id: dept.department_id?.id,
                    departmentName: dept.department_id?.departmentName ?? "",
                    departmentId: dept.department_id?.departmentId ?? "",
                  },
                })
              ),
              assignedAccessLevels: (
                userDetails.assignedAccessLevels ?? []
              ).map((level) => ({
                id: level.id,
                accesslevels_id: {
                  id: level.accesslevels_id?.id,
                  accessLevelName: level.accesslevels_id?.accessLevelName ?? "",
                },
              })),
              assignedBranch: (userDetails.assignedBranch ?? []).map(
                (branch) => ({
                  id: branch.id,
                  branch_id: {
                    id: branch.branch_id?.id,
                    branchName: branch.branch_id?.branchName ?? "",
                    branchId: branch.branch_id?.branchId ?? "",
                  },
                })
              ),
            };

            usersMap.set(user.id, user);
          }
        });

        this.users = Array.from(usersMap.values());
        this.filteredUsers = this.uniqueUsers();

        // Store initial states for selected users
        this.users.forEach((user) => {
          this.initialUserStates.set(user.id, JSON.parse(JSON.stringify(user)));
        });
      } catch (error) {
        console.error("Error loading users:", error);
        this.users = [];
        this.filteredUsers = [];
      }
    },
    // unique id will show in existi g user poup
    uniqueUsers() {
      const uniqueMap = new Map();
      this.users.forEach((user) => {
        // Only add user if their employeeId is not already in uniqueMap
        if (user.employeeId && !uniqueMap.has(user.employeeId)) {
          uniqueMap.set(user.employeeId, user);
        }
      });
      return Array.from(uniqueMap.values());
    },
    // Search users with only unique employeeId entries
    searchUsers() {
      const query = this.searchQuery.toLowerCase().trim();
      const uniqueUsersList = this.uniqueUsers(); // Get unique users based on employeeId

      if (query === "") {
        this.filteredUsers = uniqueUsersList;
      } else {
        this.filteredUsers = uniqueUsersList.filter((user) => {
          const nameMatch =
            user.first_name && user.first_name.toLowerCase().includes(query);
          const employeeIdMatch =
            user.employeeId && user.employeeId.toLowerCase().includes(query);
          return nameMatch || employeeIdMatch;
        });
      }
    },
    getCardInfo(card) {
      if (card.cardManagement_id) {
        return {
          rfidCard: card.cardManagement_id.rfidCard || "No RFID",
          type: card.cardManagement_id.type || "No Type",
          cardAccess: card.cardManagement_id.cardAccess,
          id: card.cardManagement_id.id,
        };
      }
      return {
        rfidCard: card.rfidCard || "No RFID",
        type: card.type || "No Type",
        cardAccess: card.cardAccess,
      };
    },
    //   toggleCardAccess(card) {
    //   if (this.canToggleCardAccess(card)) {
    //     card.cardManagement_id.cardAccess = !card.cardManagement_id.cardAccess;
    //     if (!card.needsUpdate) {
    //       card.needsUpdate = true;
    //     }
    //   }
    // },
    toggleCardAccess(card) {
      if (this.canToggleCardAccess(card)) {
        const newAccess = !card.cardManagement_id.cardAccess;
        card.cardManagement_id.cardAccess = newAccess;

        // Update cardAccessLevelArray with 1 or 0 for access status
        const rfidCard = card.cardManagement_id.rfidCard;
        const accessLevelNumber = card.cardManagement_id.accessLevelsId || "";
        card.cardManagement_id.cardAccessLevelArray = `${rfidCard}:${
          newAccess ? 1 : 0
        }:${accessLevelNumber}`;

        if (!card.needsUpdate) {
          card.needsUpdate = true;
        }
      }
    },
    // Add this method to close the existing user details popup
    closeExistingUserDetailsPopup() {
      this.showExistingUserDetailsPopup = false;
      this.selectedUser = null;
    },

    async submitUserUpdates(isRender = false) {
      this.isSaving = true;
      try {
        const originalCards =
          this.initialUserStates.get(this.selectedUser.id)?.assignedCards || [];
        const originalUser = this.initialUserStates.get(this.selectedUser.id);
        const originalForm =
          this.initialUserStates.get(this.selectedUser.id) || {};

        // Check what's changed
        const accessLevelsChanged = !this.arraysEqual(
          originalUser.assignedAccessLevels.map((al) => al.accesslevels_id.id),
          this.selectedUser.assignedAccessLevels
        );
        const cardsChanged = !this.arraysEqual(
          originalUser.assignedCards.map((c) => c.cardManagement_id.rfidCard),
          this.selectedUser.assignedCards.map(
            (c) => c.cardManagement_id.rfidCard
          )
        );
        const accessOnChanged =
          originalUser.accessOn !== this.selectedUser.accessOn;

        // Validate new cards if any were added
        const newCards = this.selectedUser.assignedCards.filter((card) => {
          const cardNumber = card.cardManagement_id?.rfidCard || card.rfidCard;
          return !originalCards.some(
            (oc) =>
              (oc.cardManagement_id?.rfidCard || oc.rfidCard) === cardNumber
          );
        });

        if (newCards.length > 0) {
          await CardValidator.validateCardsBeforeSave(newCards, originalCards);
        }
        // alert for phone, mail
        try {
          await validation.validateUserUpdate({
            email: this.formatInput(this.selectedUser._email, "email"),
            phone: this.selectedUser.phone,
            id: this.selectedUser.id,
          });
        } catch (validationError) {
          alert(validationError.message);
          this.isSaving = false;
          return;
        }

        // Validate user data
        UserValidator.validateUserUpdate({
          email: this.formatInput(this.selectedUser._email, "email"),
          phone: this.selectedUser.phone,
        });

        // Create new action
        const newActionResponse = await fetch("/items/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: "update",
            status: "waiting",
          }),
        });

        if (!newActionResponse.ok)
          throw new Error("Failed to create new action");

        const newAction = await newActionResponse.json();
        const newActionId = newAction.data.id;
        const userTenant = await this.fetchUserRole();
        if (!userTenant) throw new Error("User tenant not found");

        // Get the access level number from the selected access level
        const selectedAccessLevelId = this.selectedUser.assignedAccessLevels[0];
        const selectedAccessLevel = this.dropdownData.accessLevels.find(
          (level) => level.id === selectedAccessLevelId
        );
        const accessLevelNumber = selectedAccessLevel?.accessLevelNumber || "";

        const form = {
          ...this.selectedUser,
          employeeId: this.formatInput(
            this.selectedUser._employeeId,
            "employeeId"
          ),
          first_name: this.formatInput(
            this.selectedUser._firstName,
            "firstName"
          ),
          email: this.formatInput(this.selectedUser._email, "email"),
        };

        const roleId = typeof form.role === "object" ? form.role.id : form.role;

        // Process card updates with access level info
        const cardUpdates = this.selectedUser.assignedCards
          .filter((card) => {
            // Only include cards that existed in original cards
            const cardNumber =
              card.cardManagement_id?.rfidCard || card.rfidCard;
            return originalCards.some(
              (oc) =>
                (oc.cardManagement_id?.rfidCard || oc.rfidCard) === cardNumber
            );
          })
          .map((card) => {
            const cardAccess = !form.accessOn
              ? false
              : card.cardManagement_id.cardAccess;
            const rfidCard = card.cardManagement_id.rfidCard;
            return {
              id: card.id,
              cardManagement_id: {
                id: card.cardManagement_id.id,
                cardAccess: cardAccess,
                accessLevelsId: accessLevelNumber,
                cardAccessLevelArray: `${card.cardManagement_id.rfidCard}:${
                  cardAccess ? 1 : 0
                }:${accessLevelNumber}`,
                cardAccessLevelHex: convertToCardAccessHex(
                  rfidCard,
                  cardAccess,
                  accessLevelNumber
                ),
              },
            };
          });

        // Process new cards with access level info
        const processedNewCards = newCards.map((card) => {
          const rfidCard = card.cardManagement_id?.rfidCard || card.rfidCard;
          return {
            cardManagement_id: {
              rfidCard: rfidCard,
              type: card.cardManagement_id?.type || card.type,
              cardAccess: form.accessOn,
              tenant: userTenant,
              accessLevelsId: accessLevelNumber,
              cardAccessLevelArray: `${rfidCard}:${
                form.accessOn ? 1 : 0
              }:${accessLevelNumber}`,
              cardAccessLevelHex: convertToCardAccessHex(
                rfidCard,
                form.accessOn,
                accessLevelNumber
              ),
            },
          };
        });

        // Update action status to sending
        await fetch(`/items/actions/${newActionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "sending" }),
        });

        // Prepare update payload
        const payload = {
          status: "updated",
          userDetails: {
            create: [
              {
                actions_id: newActionId,
                personalModule_id: {
                  id: form.id,
                  employeeId: form.employeeId,
                  status: "active",
                  accessOn: form.accessOn,
                  assignedCards: {
                    create: processedNewCards,
                    delete:
                      originalForm.assignedCards
                        ?.filter(
                          (card) =>
                            !form.assignedCards.some(
                              (nc) =>
                                this.getCardInfo(nc).rfidCard ===
                                this.getCardInfo(card).rfidCard
                            )
                        )
                        .map((card) => card.id) || [],
                    update: cardUpdates,
                  },
                  assignedAccessLevels: {
                    create: form.assignedAccessLevels
                      .filter(
                        (levelId) =>
                          !originalForm.assignedAccessLevels?.some(
                            (ol) => ol.accesslevels_id.id === levelId
                          )
                      )
                      .map((levelId) => ({
                        personalModule_id: form.id,
                        accesslevels_id: { id: levelId },
                      })),
                    delete:
                      originalForm.assignedAccessLevels
                        ?.filter(
                          (level) =>
                            !form.assignedAccessLevels.includes(
                              level.accesslevels_id.id
                            )
                        )
                        .map((level) => level.id) || [],
                  },
                  assignedBranch: {
                    create: form.assignedBranch
                      .filter(
                        (branchId) =>
                          !originalForm.assignedBranch?.some(
                            (ob) => ob.branch_id.id === branchId
                          )
                      )
                      .map((branchId) => ({
                        personalModule_id: form.id,
                        branch_id: { id: branchId },
                      })),
                    delete:
                      originalForm.assignedBranch
                        ?.filter(
                          (branch) =>
                            !form.assignedBranch.includes(branch.branch_id.id)
                        )
                        .map((branch) => branch.id) || [],
                  },
                  assignedDepartment: {
                    create: form.assignedDepartment
                      .filter(
                        (deptId) =>
                          !originalForm.assignedDepartment?.some(
                            (od) => od.department_id.id === deptId
                          )
                      )
                      .map((deptId) => ({
                        personalModule_id: form.id,
                        department_id: { id: deptId },
                      })),
                    delete:
                      originalForm.assignedDepartment
                        ?.filter(
                          (dept) =>
                            !form.assignedDepartment.includes(
                              dept.department_id.id
                            )
                        )
                        .map((dept) => dept.id) || [],
                  },
                  assignedUser: {
                    id: form.assignedUserId,
                    ...["first_name", "avatar"].reduce((acc, key) => {
                      if (form[key] !== originalForm[key]) acc[key] = form[key];
                      return acc;
                    }, {}),
                    ...(form.email !== originalForm.email
                      ? { email: form.email }
                      : {}),
                    ...(form.phone !== originalForm.phone
                      ? { phone: form.phone }
                      : {}),
                    role: roleId !== originalForm.role ? roleId : undefined,
                    tenant: userTenant,
                  },
                },
              },
            ],
            delete: [],
          },
        };

        // Send update request
        const response = await fetch(`/items/actions/${newActionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update user");

        // If there were relevant changes, update controller status
        if (accessLevelsChanged || cardsChanged || accessOnChanged) {
          try {
            // Get affected door numbers from access level
            const accessLevelResponse = await fetch(
              `/items/accesslevels?filter[tenant][tenantId][_eq]=${userTenant}` +
                "&fields[]=accessLevelName" +
                "&fields[]=accessLevelNumber" +
                "&fields[]=tenant.tenantId" +
                "&fields[]=tenant.tenantName" +
                "&fields[]=assignedDoors.doors_id.doorNumber" +
                "&fields[]=assignedDoors.doors_id.doorName" +
                "&fields[]=assignedDoors.doors_id.id" +
                "&fields[]=assignedDoors.id"
            );

            const accessLevelData = await accessLevelResponse.json();
            const relevantAccessLevel = accessLevelData.data.find(
              (level) => level.accessLevelNumber === accessLevelNumber
            );

            if (relevantAccessLevel?.assignedDoors) {
              const doorNumbers = relevantAccessLevel.assignedDoors
                .map((door) => door.doors_id?.doorNumber)
                .filter(Boolean);

              // Fetch and update affected controllers
              if (doorNumbers.length > 0) {
                const controllersResponse = await fetch(
                  `/items/controllers?filter[tenant][tenantId][_eq]=${userTenant}` +
                    "&fields=assignedDoor.doors_id.doorNumber" +
                    "&fields=assignedDoor.doors_id.doorName" +
                    "&fields=assignedDoor.doors_id.id" +
                    "&fields=id" +
                    "&fields=controllerStatus" +
                    "&fields=controllerName" +
                    "&fields=status" +
                    "&fields=controllerType" +
                    "&fields=assignedDoor.id" +
                    "&fields=tenant.tenantId" +
                    "&fields=tenant.tenantName" +
                    "&fields=branch.branchName" +
                    "&fields=branch.id"
                );

                const controllersData = await controllersResponse.json();

                // Find controllers that need updating
                const controllersToUpdate = controllersData.data.filter(
                  (controller) => {
                    if (!controller.assignedDoor) return false;
                    return controller.assignedDoor.some((door) =>
                      doorNumbers.includes(door.doors_id?.doorNumber)
                    );
                  }
                );

                // Update each controller's status
                const updatePromises = controllersToUpdate.map((controller) =>
                  fetch(`/items/controllers/${controller.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      controllerStatus: "waiting ",
                    }),
                  })
                );

                await Promise.all(updatePromises);
              }
            }
          } catch (error) {
            alert("Error updating controller status:", error);
          }
        }

        await response.json();
        this.isSaving = false;
        await this.resetAndRefreshData();
        alert("User successfully updated!");
      } catch (error) {
        this.isSaving = false;
        alert("Failed to update user. Please try again", error.message);
        console.error("Failed to update user:", error);
      }
    },
    // Helper method to compare arrays
    arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      const set = new Set(arr2);
      return arr1.every((item) => set.has(item));
    },
    handleMultiEditAccessLevel(level) {
      if (!level.accessType) {
        // Prevent selection of disabled access levels
        const index = this.newUser.assignedAccessLevels.indexOf(level.id);
        if (index > -1) {
          this.newUser.assignedAccessLevels.splice(index, 1);
        }
      }
    },
    async submitMultiUserUpdates(isRender = false) {
      try {
        const newActionResponse = await fetch("/items/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionType: "bulk-edit",
            status: isRender ? "rendering" : "pending",
          }),
        });

        if (!newActionResponse.ok)
          throw new Error("Failed to create new action");
        const newAction = await newActionResponse.json();
        const newActionId = newAction.data.id;
        const payload = {
          status: "updated",
          userDetails: {
            create: this.selectedUsers.map((userId) => {
              return {
                actions_id: newActionId,
                personalModule_id: {
                  id: userId,
                  accessOn: this.commonAccessOn,
                  assignedAccessLevels: {
                    create: this.newUser.assignedAccessLevels.map((id) => ({
                      accesslevels_id: { id: id },
                    })),
                  },
                  assignedDepartment: {
                    create: this.newUser.assignedDepartment.map((id) => ({
                      department_id: { id: id },
                    })),
                  },
                },
              };
            }),
          },
        };
        const response = await fetch(`/items/actions/${newActionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to update users");
        const state = await getCurrentState();
        const doorAccessData = generateDoorAccessData(state);
        await updateControllerDoorAccess(doorAccessData);

        const result = await response.json();
        await this.resetAndRefreshData();
        alert("Multi-User successfully updated!");
      } catch (error) {
        alert("Failed to update users. Please try again.", error);
      }
    },
    // Reset and refresh method
    async resetAndRefreshData() {
      try {
        // Reset selected user and search
        this.selectedUser = null;
        this.selectedUsers = [];
        this.searchQuery = "";

        // Reset popups
        this.showExistingUserDetailsPopup = false;
        this.showExistingUserSearchPopup = false;
        this.showMultiEditPopup = false;

        // Clear any previews
        this.avatarPreview = null;

        // Reset card related data
        this.newCardNumber = "";
        this.newCardType = "rfid";

        // Reset multi-edit specific data
        this.commonAccessOn = null;
        this.newUser.assignedDepartment = [];
        this.newUser.assignedAccessLevels = [];

        // Refresh data
        await Promise.all([this.loadUsers(), this.fetchActivities()]);

        // Reset initial states
        this.initialUserStates = new Map();
        this.users.forEach((user) => {
          this.initialUserStates.set(user.id, JSON.parse(JSON.stringify(user)));
        });
      } catch (error) {
        console.error("Error resetting and refreshing data:", error);
      }
    },
    // Close dropdowns when clicking outside
    handleClickOutside(e) {
      if (!e.target.closest(".dropdown-container")) {
        this.showAddDepartmentDropdown = false;
        this.showAddAccessLevelDropdown = false;
        this.showAddBranchDropdown = false;
        this.showEditDepartmentDropdown = false;
        this.showEditAccessLevelDropdown = false;
        this.showEditBranchDropdown = false;
      }
    },
    toggleDropdown(type) {
      // Close all dropdowns first
      this.showAddDepartmentDropdown = false;
      this.showAddAccessLevelDropdown = false;
      this.showAddBranchDropdown = false;
      this.showEditDepartmentDropdown = false;
      this.showEditAccessLevelDropdown = false;
      this.showEditBranchDropdown = false;

      // Toggle the clicked dropdown
      switch (type) {
        case "department":
          this.showAddDepartmentDropdown = !this.showAddDepartmentDropdown;
          break;
        case "accessLevel":
          this.showAddAccessLevelDropdown = !this.showAddAccessLevelDropdown;
          break;
        case "branch":
          this.showAddBranchDropdown = !this.showAddBranchDropdown;
          break;
      }
    },
    toggleEditDropdown(type) {
      // Close all dropdowns first
      this.showAddDepartmentDropdown = false;
      this.showAddAccessLevelDropdown = false;
      this.showAddBranchDropdown = false;
      this.showEditDepartmentDropdown = false;
      this.showEditAccessLevelDropdown = false;
      this.showEditBranchDropdown = false;

      // Toggle the clicked dropdown
      switch (type) {
        case "department":
          this.showEditDepartmentDropdown = !this.showEditDepartmentDropdown;
          break;
        case "accessLevel":
          this.showEditAccessLevelDropdown = !this.showEditAccessLevelDropdown;
          break;
        case "branch":
          this.showEditBranchDropdown = !this.showEditBranchDropdown;
          break;
      }
    },
  },
  mounted() {
    this.fetchActivities();
    this.fetchUserRole();
    this.fetchDropdownData();
    this.loadUsers();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    // Remove click outside listener
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.access-toggle {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: white;
}

.access-toggle.enabled {
  background-color: var(--theme--primary);
}

.access-toggle.disabled {
  background-color: #979494;
}
/* Add these new styles to your existing <style> section */
.form-grid-2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.form-group-half {
  margin-bottom: 0;
}

.form-group-half label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: bold;
}

.form-group-half .input-field {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-text {
  color: red;
  font-size: 12px;
  margin-top: 2px;
}
/* dropdown */
.dropdown-container {
  position: relative;
  width: 100%;
}

.dropdown-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background: white;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  /* border-radius: 4px; */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 178px;
  overflow-y: auto;
}

.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.options-list {
  padding: 8px 0;
}

.option-item {
  padding: 8px 16px;
  cursor: pointer;
}

.option-item:hover {
  background-color: #f5f5f5;
}

.option-item.selected {
  background-color: var(--theme--primary);
  color: white;
}

/* revistion */
.user-revision {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.revision-table-container {
  max-width: 100%;
  overflow-x: auto;
}

.revision-table {
  width: 100%;
  border-collapse: collapse;
}

.revision-table th,
.revision-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.revision-table th {
  background-color: #f2f2f2;
}

.revision-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.changed {
  color: #007bff;
  font-weight: bold;
}
/* profile */
.full-width-select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
}

.toggle-button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.toggle-button.enabled {
  background-color: var(--theme--primary);
  color: white;
}

.toggle-button.disabled {
  background-color: #979494;
  color: white;
}
/* comented */
/* .avatar-preview {
	max-width: 100px;
	max-height: 100px;
	margin-top: 10px;
  } */

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}
.form-group {
  margin-bottom: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
}

.input-field:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}
.status-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px; /* Reduced gap between elements */
}

.waiting-status {
  display: flex;
  align-items: center;
  color: #21262d; /* Changed to red color for emphasis */
  font-size: 0.9em; /* Slightly smaller font size */
  white-space: nowrap; /* Prevent text wrapping */
}

.loading-icon {
  display: inline-block;
  width: 16px; /* Reduced size */
  height: 16px; /* Reduced size */
  margin-left: 4px; /* Reduced margin */
  border: 2px solid #ff4d4f;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.no-data-message {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
  border-radius: 4px;
  margin-top: 320px;
  font-weight: bold;
}

/* New style for changed values */
.changed {
  color: #007bff;
  font-weight: bold;
}
.revision-table-container {
  max-width: 100%;
  overflow-x: auto;
}

.revision-table {
  width: 100%;
  border-collapse: collapse;
}

.revision-table th,
.revision-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.revision-table th {
  background-color: #f2f2f2;
}

.revision-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.user-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.user-details-table th,
.user-details-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.user-details-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.user-details-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.user-details-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}
.user-details {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: var(--theme--primary);
}

.user-details:hover {
  text-decoration: underline;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
/* Adjust form-grid column sizes */
.form-grid {
  /* grid-template-columns: 65% 55%; */
  gap: 24px;
}
.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
}
select,
input[type="text"],
input[type="email"],
input[type="tel"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}
.toggle-button {
  padding: 10px;
  text-align: left;
}
.full-width-select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}
.user-column {
  flex: 1 1 300px;
  max-width: 100%;
}

.edit-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.edit-details-table th,
.edit-details-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.edit-details-table th {
  background-color: #f2f2f2;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--theme--primary);
}
h2 {
  display: block;
  font-size: 1.5em;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  unicode-bidi: isolate;
}
.flow-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-size: 16px;
}

.tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.left-tabs,
.right-tabs {
  display: flex;
  gap: 10px;
}

.left-tabs button,
.right-tabs button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.left-tabs button {
  background-color: #e0e0e0;
  color: #333;
}

.left-tabs button.active {
  background-color: var(--theme--primary);
  color: white;
}

.right-tabs button {
  background-color: var(--theme--primary);
  color: white;
}

.main-tabs {
  display: flex;
  background-color: #f0f0f0;
}

.main-tabs button {
  padding: 12px 24px;
  margin-right: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;
}

.main-tabs button.active {
  background-color: var(--theme--primary);
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.action-type {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: bold;
  color: white;
}

.action-type-create {
  background-color: #ec4899; /* pink */
}

.action-type-update {
  background-color: #3b82f6; /* blue */
}

.action-type-delete {
  background-color: #ef4444; /* red */
}

.action-type-bulk-edit {
  background-color: #8b5cf6; /* purple */
}

.action-type-default {
  background-color: #6b7280; /* gray */
}

.render-button {
  background-color: var(--theme--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px; /* Reduced padding */
  white-space: nowrap; /* Prevent text wrapping */
}

.main-tabs button.active {
  background-color: var(--theme--primary);
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.user-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

.action-button {
  padding: 12px 24px;
  background-color: transparent;
  color: var(--theme--primary);
  border: 1px solid var(--theme--primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s;
}

.action-button:hover {
  background-color: var(--theme--primary);
  color: white;
}

/* Update the popup-overlay styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transform: scale(1) !important; /* Prevent zoom */
  transform-origin: center !important;
}

/* Update the popup-content styles */
.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 1200px !important; /* Fixed width */
  /* height: 800px !important;  */
  max-width: none !important; /* Override max-width */
  max-height: none !important; /* Override max-height */
  overflow: auto;
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  zoom: reset !important;
  -webkit-transform: translate(-50%, -50%) !important;
  -moz-transform: translate(-50%, -50%) !important;
  -ms-transform: translate(-50%, -50%) !important;
  margin: 0 !important;
  padding: 24px !important;
  box-sizing: border-box !important;
}

/* Add styles to prevent zoom on form elements */
.form-grid {
  transform: scale(1) !important;
  transform-origin: top left !important;
  width: 100% !important;
  height: calc(100% - 100px) !important; /* Account for header and buttons */
}

/* Ensure form elements maintain size */
input,
select,
button {
  transform: scale(1) !important;
  zoom: reset !important;
}

/* Add media query to handle very small screens */
@media screen and (max-width: 1200px) {
  .popup-content {
    width: 90% !important;
    /* height: 90% !important; */
  }
}

/* Prevent zoom on iOS devices */
@supports (-webkit-overflow-scrolling: touch) {
  .popup-content {
    -webkit-text-size-adjust: 100% !important;
  }
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="tel"],
.checkbox-dropdown {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.checkbox-dropdown {
  max-height: 170px; /* Adjust this value as needed */
  overflow-y: auto;
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-dropdown-search {
  position: sticky;
  top: 0;
  z-index: 1;
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ddd;
  background-color: white;
}

.checkbox-item {
  padding: 5px 10px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--theme--primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.btn-save,
.btn-cancel,
.btn-next {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

.btn-save {
  background-color: var(--theme--primary);
  color: white;
}

.btn-cancel {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.btn-next {
  background-color: var(--theme--primary);
  color: white;
}

.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.user-item {
  margin-bottom: 10px;
}
/* cards an tags */
.card-input,
.tag-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-field {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.btn-create {
  background-color: var(--theme--primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  width: 200px;
}
/* Make cards section scrollable */
.assigned-cards-list {
  max-height: 110px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 4px;
  margin-top: 10px;
}

.assigned-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
}

.assigned-cards-list {
  margin-top: 10px;
}

.btn-remove {
  padding: 5px 10px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.render-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* avatar */
.avatar-input {
  display: none;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  border-radius: 3%;
  overflow: hidden;
  margin-top: 15px;
  border: 2px solid #ddd;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgb(196 139 96 / 50%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
/* New styles for bulk generation */
.bulk-generate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #4caf50 !important;
  color: white !important;
  border: none !important;
  transition: background-color 0.3s ease;
}

.bulk-generate-btn:hover:not(:disabled) {
  background-color: #45a049 !important;
}

.bulk-generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.bulk-generate-btn i {
  font-size: 16px;
}

.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  margin: 10px;
  animation: slideIn 0.3s ease;
}

.success-message i {
  font-size: 20px;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Enhanced existing styles */
.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.right-tabs {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Progress animation */
@keyframes progress {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Make the table more readable during generation */
.action-tab table {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.action-tab table.loading {
  opacity: 0.7;
}

/* Style the progress text */
.progress-text {
  font-weight: 500;
  color: #666;
}

/* Additional responsive styles */
@media screen and (max-width: 768px) {
  .right-tabs {
    flex-direction: column;
    gap: 8px;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
/* accesslevel 's disable one's  */
.option-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.disabled-tag {
  color: #dc2626;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.level-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
/* Add these new styles for loadding and permisttion  */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  width: 100%;
}

/* Add new no-data container styles */
.no-data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  width: 100%;
  text-align: center;
  padding: 20px;
}

.no-data-icon {
  width: 80px;
  height: 80px;
  background-color: #f3f4f6;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.no-data-icon i {
  font-size: 40px;
  color: #6b7280;
}

.no-data-container h2 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 10px;
}

.no-data-container p {
  font-size: 16px;
  color: #6b7280;
  max-width: 300px;
  margin: 0 auto;
}
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--theme--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-container p {
  font-size: 18px;
  color: #666;
  margin-top: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-permission {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 200px);
  width: 100%;
  text-align: center;
  padding: 20px;
}

.no-permission-icon {
  width: 80px;
  height: 80px;
  background-color: #fde8e8;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.no-permission-icon i {
  font-size: 40px;
  color: #dc2626;
}

.no-permission h2 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 10px;
}

.no-permission p {
  font-size: 16px;
  color: #6b7280;
  max-width: 300px;
  margin: 0 auto;
}

/* Update existing tab styles for permission states */
.main-tabs button {
  position: relative;
  overflow: hidden;
}

.main-tabs button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animation for tab transitions */
.flow-container {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .loading-container {
    height: calc(100vh - 150px);
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
  }

  .no-permission-icon {
    width: 60px;
    height: 60px;
  }

  .no-permission-icon i {
    font-size: 30px;
  }

  .no-permission h2 {
    font-size: 20px;
  }

  .no-permission p {
    font-size: 14px;
  }
}
/* this styles for disable accesslevel  */
.option-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.disabled-tag {
  color: #dc2626;
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.level-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.option-item:not(.disabled):hover {
  background-color: #f3f4f6;
}

.option-item.selected:not(.disabled) {
  background-color: var(--theme--primary);
  color: white;
}

.option-item.selected.disabled {
  background-color: #e5e7eb;
}
/* enable disable  */
.toggle-button:disabled,
.access-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #979494 !important;
}

.toggle-button.enabled {
  background-color: var(--theme--primary);
  color: white;
}

.toggle-button.disabled {
  background-color: #979494;
  color: white;
}

.access-toggle.enabled {
  background-color: var(--theme--primary);
}

.access-toggle.disabled {
  background-color: #979494;
}
/* multiedi acceslevel diable  */
.checkbox-container.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkbox-container.disabled input {
  cursor: not-allowed;
}

.checkbox-container .level-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>
