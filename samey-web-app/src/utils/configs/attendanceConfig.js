export default {
  view: "tabular_view",
  collectionName: "Attendance",
  defaultTab: "Attendance",
  tabPermissions: {
    Logs: ["Administrator", "Admin", "Manager", "Employee"],
    Attendance: ["Administrator", "Admin", "Manager", "Employee"],
  },
  tabs: [
    {
      key: "Attendance",
      name: "Attendance",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      rolesUrl: "/roles",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: false,
      allowScan: false,
      allowAdd: false,
      allowEdit: true,
      allowGen: false,
      allowFilter: true,
      allowRoleFilter: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/attendance",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "employeeId.employeeId",
            "employeeId.assignedBranch.branch_id.branchName",
            "status",
            "date",
            "attendance",
            "id",
            "mode",
            "tenant",
            "inTime",
            "outTime",
            "tenant.tenantId",
            "tenant.tenantName",

            "date_created",
            "onTime",
            "overTime",
            "lateBy",
            "workHours",
            "breakTime",
          ],
          filter: {
            status: { _neq: "archived" },
          },
          sort: ["-date_created"],
          sortFields: {
            employeeId: "employeeId.employeeId",
            mode: "mode",
            date: "date",
            attendance: "attendance",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
            status: "status",
            inTime: "inTime",
            outTime: "outTime",
            onTime: "onTime",
            overTime: "overTime",
            lateBy: "lateBy",
            workHours: "workHours",
            breakTime: "breakTime",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][1][employeeId][employeeId][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][1][attendance][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][mode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][6][lateBy][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][7][employeeId][employeeId][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][date][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      filterDate: [
        {
          label: "Month",
          value: "filter[_and][0][_and][0][month(date)][_eq]",
          type: "month",
        },
        {
          label: "Range",
          value: "filter[_and][0][_and][0][date][_between]",
          type: "range",
        },
        {
          label: "Date",
          value: "filter[_and][0][_and][0][date][_eq]",
          type: "date",
        },
      ],
      mandatoryFields: {},
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["Administrator", "Admin"],
        delete: [],
        add: [],
        incognitoToggle: [],
      },
      filterOptions: [
        {
          label: "employeeId",
          value: "filter[_and][0][_and][0][employeeId][employeeId][_eq]=",
        },
        {
          label: "inTime",
          value: "filter[_and][0][_and][0][inTime][_eq]=",
        },
        {
          label: "outTime",
          value: "filter[_and][0][_and][0][outTime][_eq]=",
        },
        {
          label: "attendance",
          value: "filter[_and][0][_and][0][attendance][_icontains]=",
        },
        {
          label: "Date",
          value: "filter[_and][0][_and][0][date][_eq]",
        },
        {
          label: "mode",
          value: "filter[_and][0][_and][0][mode][_icontains]=",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
        {
          label: "tenantName",
          value: "filter[_and][0][tenant][tenantName][_icontains]=",
        },
        {
          label: "branchName",
          value: "filter[_and][0][branch][branchName][_icontains]=",
        },
        {
          label: "onTime",
          value: "filter[_and][0][_and][0][onTime][_eq]=",
        },
        {
          label: "overTime",
          value: "filter[_and][0][_and][0][overTime][_eq]=",
        },
        {
          label: "lateBy",
          value: "filter[_and][0][_and][0][lateBy][_eq]=",
        },
      ],
      editApi: {
        endpoint: "/items/attendance",
        method: "PATCH",
      },
      editDialog: {
        props: {
          showDialog: Boolean,
          currentTabConfig: Object,
          isMultiEdit: Boolean,
          form: Object,
          allAvailableDoors: Array,
        },
        title: {
          single: "Edit Branch ",
        },

        fields: {
          single: [
            {
              key: "inTime",
              label: "In Time",
              type: "time",
              editable: true,
              dotFormat: false,
            },
            {
              key: "outTime",
              label: "Out Time",
              type: "time",
              editable: true,
              dotFormat: false,
            },
            {
              commenkey: "dropdowns",
              key: "attendance",
              label: "Attendance",
              type: "dropdown",
              editable: true,
              dotFormat: false,
              options: [
                { name: "Present" },
                { name: "Absent" },
                { name: "Leave" },
                { name: "Onduty" },
              ],
            },
            {
              commenkey: "dropdowns",
              key: "mode",
              label: "Mode",
              type: "text",
              editable: true,
              dotFormat: false,
              options: [
                { name: "RFID" },
                { name: "ThroughApp" },
                { name: "Fingerprint" },
                { name: "Tags" },
              ],
            },

            {
              key: "onTime",
              label: "onTime",
              type: "time",
              editable: true,
              dotFormat: false,
            },
            {
              key: "overTime",
              label: "overTime",
              type: "time",
              editable: true,
              dotFormat: false,
            },
            {
              key: "lateBy",
              label: "lateBy",
              type: "time",
              editable: true,
              dotFormat: false,
            },
          ],
          advance: [],
        },
      },
      limitOptions: [50, 100, 500],
      defaultLimit: 50,

      export: {
        csv: { fileName: "Attendance" },
        pdf: {
          fileName: "Attendance",
          title: "Attendance",
        },
      },

      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Absent",
          condition: (device) => device.attendance === "absent",
        },
        failedCount: {
          label: "Present",
          condition: (device) => device.attendance === "present",
        },
        idleCount: {
          label: "Idle",
        },
      },
      methods: {
        onTabClick: "fetchDevices",
        onMount: "fetchDevices",
      },
    },
    {
      key: "Logs",
      name: "Logs",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: false,
      allowScan: false,
      allowAdd: false,
      allowEdit: false,
      allowGen: false,
      allowFilter: true,
      allowRoleFilter: false,
      allowIncognitoMode: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/logs",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "action",
            "employeeId.employeeId",
            "mode",
            "timeStamp",
            "date",
            "id",
            "tenant",
            "tenant.tenantId",
            "tenant.tenantName",
            "employeeId.assignedBranch.branch_id.branchName",
            "date_created",
            "door.doorNumber",
            "door.doorName",
            "faceId",
          ],
          filter: {
            status: { _neq: "archived" },
          },
          sort: ["-date_created"],
          sortFields: {
            action: "action",
            employeeId: "employeeId.employeeId",
            mode: "mode",
            timeStamp: "timeStamp",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
            doorName: "door.doorName",
            date: "date",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][0][employeeId][employeeId][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][status][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][action][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][mode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][door][doorName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][6][employeeId][employeeId][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][date][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      filterDate: [
        {
          label: "Month",
          value: "filter[_and][0][_and][0][month(date)][_eq]",
          type: "month",
        },
        {
          label: "Range",
          value: "filter[_and][0][_and][0][date][_between]",
          type: "range",
        },
        {
          label: "Date",
          value: "filter[_and][0][_and][0][date][_eq]",
          type: "date",
        },
      ],
      filterOptions: [
        {
          label: "Action",
          value: "filter[_and][0][_and][0][action][_eq]=",
          validation: "validateInteger",
          errorMessage: "Controller Type must be an integer",
        },
        {
          label: "Employee Id",
          value: "filter[_and][0][_and][0][employeeId][_eq]=",
        },
        {
          label: "Mode",
          value: "filter[_and][0][_and][0][mode][_icontains]=",
        },
        {
          label: "tenantName",
          value: "filter[_and][0][tenant][tenantName][_icontains]=",
        },
        {
          label: "Status",
          value: "filter[_and][0][_and][0][status][_eq]=",
        },
        {
          label: "Date",
          value: "filter[_and][0][_and][0][date][_eq]",
        },
        {
          label: "Doors",
          value: "filter[_and][0][door][doorName][_icontains]=",
        },
      ],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      mandatoryFields: {},
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: [],
        delete: [],
        add: [],
        incognitoToggle: [],
      },
      export: {
        csv: { fileName: "Logs" },
        pdf: {
          fileName: "Logs",
          title: "Logs",
        },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "People In ",
          condition: (device) => device.action === "in",
        },
        failedCount: {
          label: "People Out ",
          condition: (device) => device.action === "out",
        },
        idleCount: {
          label: "Idle",
        },
      },
      methods: {
        onTabClick: "fetchDevices",
        onMount: "fetchDevices",
      },
    },
  ],
  tableContent: {
    headers: {
      Attendance: [
        { key: "date", label: "Date" },
        { key: "employeeId", label: "Employee Id" },
        { key: "inTime", label: "In Time" },
        { key: "outTime", label: "Out Time" },
        { key: "attendance", label: "Attendance" },
        { key: "mode", label: "Mode" },
        { key: "branchName", label: "Branch Name" },
        { key: "tenantName", label: "Tenant Name" },
        { key: "day", label: "Day" },
        { key: "onTime", label: "onTime" },
        { key: "overTime", label: "overTime" },
        { key: "lateBy", label: "lateBy" },
        { key: "workHours", label: "workHours" },
        { key: "breakTime", label: "breakTime" },
      ],
      Logs: [
        { key: "action", label: "Action" },
        { key: "employeeId", label: "Employee Id" },
        { key: "mode", label: "Mode" },
        { key: "entryTime", label: "Entry Time" },
        { key: "exitTime", label: "Exit Time" },
        { key: "date", label: "Date" },
        { key: "branchName", label: "Branch Name" },
        { key: "tenantName", label: "Tenant Name" },
        { key: "door", label: "Door" },
      ],
    },
    body: {
      Attendance: [
        {
          key: "date",
          render: (device) => device.date || "",
        },
        {
          key: "employeeId",
          render: (device) =>
            device.employeeId ? device.employeeId.employeeId || "" : "",
        },
        {
          key: "inTime",
          render: (device) => device.inTime || "",
        },
        {
          key: "outTime",
          render: (device) => device.outTime || "",
        },
        {
          key: "attendance",
          render: (device) => device.attendance || "",
        },
        {
          key: "mode",
          render: (device) => device.mode || "",
        },
        {
          key: "branchName",
          render: (device) =>
            device.employeeId?.assignedBranch?.[0]?.branch_id?.branchName || "",
        },

        {
          key: "tenantName",
          render: (device) =>
            device.tenant ? device.tenant.tenantName || "" : "",
        },
        {
          key: "day",
          render: (device) => device.day || "",
        },
        {
          key: "onTime",
          render: (device) => device.onTime || "",
        },
        {
          key: "overTime",
          render: (device) => device.overTime || "",
        },
        {
          key: "lateBy",
          render: (device) => device.lateBy || "",
        },
        {
          key: "workHours",
          render: (device) => device.workHours || "",
        },
        {
          key: "breakTime",
          render: (device) => device.breakTime || "",
        },
      ],
      Logs: [
        {
          key: "action",
          render: (device) => device.action || "",
        },
        {
          key: "employeeId",
          render: (device) =>
            device.employeeId ? device.employeeId.employeeId || "" : "",
        },
        {
          key: "mode",
          render: (device) => device.mode || "",
        },
        {
          key: "entryTime",
          render: (device) =>
            device.action === "in" ? device.timeStamp || "" : "",
        },
        {
          key: "exitTime",
          render: (device) =>
            device.action === "out" ? device.timeStamp || "" : "",
        },
        {
          key: "date",
          render: (device) => device.date || "",
        },
        {
          key: "branchName",
          render: (device) =>
            device.employeeId?.assignedBranch?.[0]?.branch_id?.branchName || "",
        },
        {
          key: "tenantName",
          render: (device) =>
            device.tenant ? device.tenant.tenantName || "" : "",
        },
        {
          key: "door",
          render: (device) =>
            `${device.door?.doorNumber || ""} - ${device.door?.doorName || ""}`,
        },
      ],
    },
  },
  methods: {
    buildQueryFilters({
      assignedBranch,
      userId,
      userTenant,
      userRole,
      currentTab,
      tabData,
      currentTabData,
      params,
      selectedRole,
    }) {
      const queryParams = new URLSearchParams();

      // Role based filters
      if (currentTab === "Attendance") {
        if (userRole === "Administrator") {
          queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
        }
        if (userRole === "Admin") {
          queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
        }
        if (userRole === "Employee") {
          queryParams.append(
            "filter[employeeId][assignedUser][id][_eq]",
            userId
          );
        }
        if (userRole === "Manager") {
          queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
          queryParams.append(
            "filter[employeeId][assignedUser][role][name][_eq]",
            userRole
          );
        }
      }
      if (currentTab === "Logs") {
        if (userRole === "Administrator") {
          queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
        }
        if (userRole === "Admin") {
          queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
        }
        if (userRole === "Employee") {
          queryParams.append(
            "filter[employeeId][assignedUser][id][_eq]",
            userId
          );
        }
        if (userRole === "Manager") {
          queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
        }
      }

      // Search and filter conditions
      if (tabData.filter && tabData.filter.trim() !== "") {
        const combinedParams = new URLSearchParams(
          tabData.filter + (tabData.query || "")
        );
        combinedParams.forEach((value, key) => {
          if (key.startsWith("filter[")) {
            queryParams.append(key, value);
          }
        });
      } else if (tabData.query && tabData.query.trim() !== "") {
        const searchQuery = tabData.query.trim();
        const isDate = /^\d{4}-\d{2}-\d{2}$/.test(searchQuery);
        const isNumeric = !isNaN(searchQuery);
        const orConditions = isNumeric
          ? params.searchFilters.numeric
          : isDate
          ? params.searchFilters.date
          : params.searchFilters.string;

        orConditions.forEach((condition) => {
          const finalCondition = condition.replace(
            "%SEARCH_QUERY%",
            searchQuery
          );
          queryParams.append(
            finalCondition.split("=")[0],
            finalCondition.split("=")[1]
          );
        });
      }

      // Date Filter
      if (currentTabData.dateFilter && currentTabData.dateFilter.type) {
        const filterType = currentTabData.dateFilter.type;
        if (
          filterType === "range" &&
          currentTabData.dateFilter.start &&
          currentTabData.dateFilter.end
        ) {
          queryParams.append(
            `filter[_and][0][_and][0][date][_between]`,
            `[${currentTabData.dateFilter.start},${currentTabData.dateFilter.end}]`
          );
        } else if (filterType === "date" && currentTabData.dateFilter.value) {
          queryParams.append(
            `filter[_and][0][_and][0][date][_eq]`,
            currentTabData.dateFilter.value
          );
        } else if (filterType === "month" && currentTabData.dateFilter.value) {
          const monthValue = currentTabData.dateFilter.value.substring(5, 7);
          queryParams.append(
            `filter[_and][0][_and][0][month(date)][_eq]`,
            monthValue
          );
        }
      }

      // Selected role filter
      if (selectedRole) {
        queryParams.append(
          `filter[_and][0][assignedUser][role][name][_icontains]`,
          selectedRole.name
        );
      }

      return queryParams;
    },
    openEditDialog() {
      const devices = this.tabData[this.currentTab].devices;
      const selectedDevices = devices.filter((device) => device.selected);
      const isMultiEdit = selectedDevices.length > 1;

      if (selectedDevices.length === 0) {
        alert("Please select at least one item to edit.");
        return;
      }
      if (selectedDevices.length > 1) {
        alert("No multi select is available in edit .");
        return;
      }
      let form = {};
      const fields = this.currentTabConfig.editDialog.fields.single;

      if (!isMultiEdit) {
        const device = selectedDevices[0];
        fields.forEach((field) => {
          if (field.commenkey === "dropdowns") {
            form[field.key] = device[field.key];
            console.log("", form[field.key]);
          } else {
            form[field.key] = device[field.key] ?? "";
          }
        });

        form.id = device.id;
      } else {
        form.ids = selectedDevices.map((device) => Number(device.id));
      }

      this.form = form;
      this.originalForm = JSON.parse(JSON.stringify(form));

      this.isMultiEdit = isMultiEdit;
      this.showDialog = true;
      this.addForm = form;

      fields.forEach((field) => {
        if (field.commenkey === "multiInputFields") {
          if (!this.filteredAddItems[field.key]) {
            this.filteredAddItems[field.key] = [];
          }
          this.addSearchQueries[field.key] = "";
          this.fetchEditItems(field);
        }
      });
    },
    prepareEditPayload(form, currentTab, userTenant) {
      if (currentTab === "Attendance") {
        const payload = {
          tenant: userTenant,
          date: form.date,
          inTime: form.inTime,
          outTime: form.outTime,
          attendance: form.attendance,
          mode: form.mode,
          onTime: form.onTime,
          overTime: form.overTime,
          lateBy: form.lateBy,
        };

        Object.keys(payload).forEach((key) => {
          if (payload[key] === undefined || payload[key] === null) {
            delete payload[key];
          }
        });

        console.log("payload", payload);
        return {
          keys: [form.id],
          data: payload,
        };
      }
    },
    async fetchPersonalModuleId(userId) {
      try {
        const response = await fetch(
          `/items/personalModule?filter[_and][0][assignedUser][id][_eq]=${userId}&fields[]= assignedBranch.branch_id.branchId &fields[]= id`
        );
        const data = await response.json();
        const personalModuleId = data.data?.[0]?.id || null;

        // Extract only the branch IDs
        const assignedBranchIds =
          data.data?.[0]?.assignedBranch?.map(
            (branch) => branch.branch_id?.branchId
          ) || [];
        return { personalModuleId, assignedBranchIds };
      } catch (error) {
        console.error("Error fetching personal module:", error);
        return null;
      }
    },
  },
};
