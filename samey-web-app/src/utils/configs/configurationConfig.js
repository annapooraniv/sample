export default {
  view: "tabular_view",
  collectionName: "Configuration",
  defaultTab: "branch",
  get defaultTab() {
    const prevPath = document.referrer;
    const redirectSource = sessionStorage.getItem("redirectSource");

    // If coming from branch redirect button click
    if (redirectSource === "branchRedirect") {
      sessionStorage.removeItem("redirectSource"); // Clear after use
      return "branch";
    } else if (redirectSource === "departmentRedirect") {
      sessionStorage.removeItem("redirectSource");
      return "department";
    }

    return "branch"; // Default if no redirect source
  },
  tabPermissions: {
    department: ["Administrator", "Admin"],
    time: ["Administrator", "Admin"],
    holiday: ["Administrator", "Admin"],
    branch: ["Administrator", "Admin", "Manager"],
  },
  tabs: [
    {
      key: "branch",
      name: "Branch",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: false,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowEdit: false,
      allowAdd: true,
      allowFilter: false,
      allowRoleFilter: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/branch",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "branchId",
            "branchName",
            "status",
            "tenant.tenantId",
            "tenant.tenantName",
            "id",
            "date_created",
          ],
          sort: ["-date_created"],
          searchFilters: {
            numeric: [`filter[_and][0][_or][0][branchId][_eq]=%SEARCH_QUERY%`],
            string: [
              `filter[_and][0][_or][0][branchName]][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][tenant][tenantName]][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][status][_eq]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      deleteApi: {
        endpoint: "/items/branch",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/branch",
        method: "POST",
      },
      addDialog: {
        title: "Add Branch",
        fields: [
          {
            key: "branchName",
            label: "Branch Name",
            type: "text",
          },
        ],
      },
      editApi: {
        endpoint: "/items/branch",
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
              key: "branchName",
              label: "Branch Name",
              type: "text",
              editable: true,
              dotFormat: false,
            },
          ],
          advance: [],
        },
      },
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["Administrator", "Admin"],
        delete: ["Administrator", "Admin"],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      incognito: {
        fields: [],
      },
      filterOptions: [
        {
          label: "branchId",
          value: "filter[_and][0][_and][0][branchId][_eq]=",
        },
        {
          label: "branchName",
          value: "filter[_and][0][_and][0][branchName][_eq]=",
        },

        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
      ],
      mandatoryFields: { branchName: true },
      limitOptions: [50, 100, 500],
      defaultLimit: 50,

      export: {
        csv: { fileName: "Branch" },
        pdf: { fileName: "Branch", title: "Branch Details" },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Assigned",
          condition: (device) => device.status === "assigned",
        },
        failedCount: {
          label: "unAssigned",
          condition: (device) => device.status === "unassigned",
        },
        idleCount: {
          label: "Idle",
        },
      },
    },
    {
      key: "department",
      name: "Department",
      onTabSwitch: null,
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowEdit: true,
      allowAdd: true,
      allowFilter: false,
      allowRoleFilter: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/department",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "departmentId",
            "departmentName",
            "status",
            "id",
            "tenant.tenantId",
            "tenant.tenantName",
            "branch.branchName",
            "branch.id",
            "branch",
            "date_created",
          ],
          sort: ["-date_created"],
          sortFields: {
            departmentId: "departmentId",
            departmentName: "departmentName",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
            status: "status",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_and][0][_or][0][departmentId][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][[departmentName]][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][branch][branchName]][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][tenant][tenantName]][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      deleteApi: {
        endpoint: "/items/department",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/department",
        method: "POST",
      },
      addDialog: {
        title: "Add Department",
        fields: [
          {
            key: "departmentName",
            label: "Department Name",
            type: "text",
          },
          {
            commenkey: "multiInputFields",
            key: "branch",
            label: "Branch",
            type: "multiInput",
            endpoint: "/items/branch",
            itemMethod: "GET",
            displayField: "branchName",
            valueField: "id",
            dotFormat: false,
            requiresTenantFilter: true,
            roleAccess: {
              Administrator: true,
              Admin: true,
              Manager: false,
              Employee: false,
              default: false,
            },
          },
        ],
      },
      editApi: {
        endpoint: "/items/department",
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
          single: "Edit Department ",
        },

        fields: {
          single: [
            {
              key: "departmentName",
              label: "Department Name",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            {
              commenkey: "multiInputFields",
              key: "branch",
              label: "Branch",
              type: "multiInput",
              endpoint: "/items/branch",
              itemMethod: "GET",
              displayField: "branchName",
              valueField: "id",
              dotFormat: false,
              requiresTenantFilter: true,
              roleAccess: {
                Administrator: true,
                Admin: true,
                Manager: false,
                Employee: false,
                default: false,
              },
            },
          ],
          advance: [],
        },
      },

      filterOptions: [
        {
          label: "departmentId",
          value: "filter[_and][0][_and][0][departmentId][_eq]",
        },
        {
          label: "departmentName",
          value: "filter[_and][0][_and][0][departmentName][_eq]=",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
      ],
      mandatoryFields: { departmentName: true },
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["Administrator", "Admin"],
        delete: ["Administrator", "Admin"],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      incognito: {
        fields: [],
      },
      limitOptions: [50, 100, 500],
      defaultLimit: 50,

      export: {
        csv: { fileName: "Department" },
        pdf: { fileName: "Department", title: "Department Data" },
      },

      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Assigned",
          condition: (device) => device.status === "assigned",
        },
        failedCount: {
          label: "unAssigned",
          condition: (device) => device.status === "unassigned",
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
      key: "time",
      name: "Attendence Settings",
      onTabSwitch: null,
      // fetchMethod: 'fetchAttendanceSettings',
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowEdit: true,
      allowAdd: true,
      allowFilter: false,
      allowRoleFilter: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/AttendanceSetting",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "id",
            "monday",
            "tuesday",
            "wednesday",
            "status",
            "id",
            "thursday",
            "tenant.tenantName",
            "friday",
            "sunday",
            "saturday",
          ],
          sort: ["-date_created"],
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][0][entryTime][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][exitTime][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][[workDays]][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][tenant][tenantName]][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      deleteApi: {
        endpoint: "/items/time",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/time",
        method: "POST",
      },
      addDialog: {},
      editApi: {
        endpoint: "/items/time",
        method: "PATCH",
      },
      editDialog: {},
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["Administrator", "Admin"],
        delete: ["Administrator", "Admin"],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      incognito: {
        fields: [],
      },
      filterOptions: [
        {
          label: "entryTime",
          value: "filter[_and][0][_and][0][entryTime][_eq]=",
        },
        {
          label: "exitTime",
          value: "filter[_and][0][_and][0][exitTime][_eq]=",
        },
        {
          label: "workDays",
          value: "filter[_and][0][_and][0][workDays][_eq]=",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
      ],
      mandatoryFields: {},
      limitOptions: [1, 2, 3, 5, 10, 25, 30, 40, 50],
      defaultLimit: 25,

      export: {
        csv: { fileName: "Time Zone" },
        pdf: { fileName: "Time Zone", title: "Time Zone Data" },
      },

      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Assigned",
          condition: (device) => device.status === "assigned",
        },
        failedCount: {
          label: "unAssigned",
          condition: (device) => device.status === "unassigned",
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
      key: "holiday",
      name: "Holiday",
      onTabSwitch: null,
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowEdit: true,
      allowAdd: true,
      allowFilter: false,
      allowRoleFilter: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/holiday",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "event",
            "date",
            "tenant.tenantName",
            "tenant.tenantId",
            "branch.branchName",
            "branch.id",
            "status",
            "id",
            "date_created",
          ],
          sort: ["-date_created"],
          searchFilters: {
            numeric: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
            string: [
              `filter[_and][0][_or][0][[event]][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][date][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      deleteApi: {
        endpoint: "/items/holiday",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/holiday",
        method: "POST",
      },
      addDialog: {
        title: "Add Holidays",
        fields: [
          {
            key: "date",
            label: "Date",
            type: "date",
            editable: true,
            dotFormat: false,
          },
          {
            key: "event",
            label: "Events",
            type: "text",
            editable: true,
            dotFormat: false,
          },
          {
            commenkey: "multiInputFields",
            key: "branch",
            label: "Branch",
            type: "multiInput",
            endpoint: "/items/branch",
            itemMethod: "GET",
            displayField: "branchName",
            valueField: "id",
            dotFormat: false,
            requiresTenantFilter: true,
            roleAccess: {
              Administrator: true,
              Admin: true,
              Manager: false,
              Employee: false,
              default: false,
            },
          },
        ],
      },
      editApi: {
        endpoint: "/items/holiday",
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
          single: "Edit Holidays ",
        },

        fields: {
          single: [
            {
              key: "date",
              label: "Holiday date",
              type: "date",
              editable: true,
              dotFormat: false,
            },
            {
              key: "event",
              label: "Events",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            {
              commenkey: "multiInputFields",
              key: "branch",
              label: "Branch",
              type: "multiInput",
              endpoint: "/items/branch",
              itemMethod: "GET",
              displayField: "branchName",
              valueField: "id",
              dotFormat: false,
              requiresTenantFilter: true,
              roleAccess: {
                Administrator: true,
                Admin: true,
                Manager: false,
                Employee: false,
                default: false,
              },
            },
          ],
          advance: [],
        },
      },
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["Administrator", "Admin"],
        delete: ["Administrator", "Admin"],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      incognito: {
        fields: [],
      },
      filterOptions: [
        {
          label: "date",
          value: "filter[_and][0][_and][0][date][_eq]=",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
        {
          label: "Branch",
          value: "filter[_and][0][_and][0][branch][branchName][_icontains]=",
        },
        {
          label: "Tenant",
          value: "filter[_and][0][_and][0][tenant][tenantName][_icontains]=",
        },
      ],
      mandatoryFields: { date: true },
      limitOptions: [50, 100, 500],
      defaultLimit: 50,

      export: {
        csv: { fileName: "holiday" },
        pdf: { fileName: "holiday", title: "holiday Data" },
      },

      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Assigned",
          condition: (device) => device.status === "assigned",
        },
        failedCount: {
          label: "unAssigned",
          condition: (device) => device.status === "unassigned",
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
      branch: [
        { key: "status", label: "Status" },
        { key: "branchId", label: "Branch Id" },
        { key: "branchName", label: "Branch Name" },
        { key: "tenantName", label: "Tenant Name" },
      ],
      department: [
        { key: "status", label: "Status" },
        { key: "departmentId", label: "Department Id" },
        { key: "departmentName", label: "Department Name" },
        { key: "tenantName", label: "Tenant Name" },
        {
          key: "branch",
          label: "Branch Name",
          customRender: (userRole) => ({
            text: "Branch",
            showRedirect: ["Administrator", "Admin"].includes(userRole),
          }),
        },
      ],
      holiday: [
        { key: "status", label: "Status" },
        { key: "date", label: "Date" },
        { key: "event", label: "Events" },
        {
          key: "branch",
          label: "Branch Name",
          customRender: (userRole) => ({
            text: "Branch",
            showRedirect: ["Administrator", "Admin"].includes(userRole),
          }),
        },
        { key: "tenantName", label: "Tenant Name" },
      ],
    },
    body: {
      branch: [
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "assigned",
              unapproved: device.status === "unassigned",
            },
          }),
        },
        {
          key: "branchId",
          render: (device) => device.branchId || "",
        },
        {
          key: "branchName",
          render: (device) => device.branchName || "",
        },
        {
          key: "tenantName",
          render: (device) =>
            device.tenant ? device.tenant.tenantName || "" : "",
        },
      ],
      department: [
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "assigned",
              unapproved: device.status === "unassigned",
            },
          }),
        },
        {
          key: "departmentId",
          render: (device) => device.departmentId || "",
        },
        {
          key: "departmentName",
          render: (device) => device.departmentName || "",
        },
        {
          key: "tenantName",
          render: (device) =>
            device.tenant ? device.tenant.tenantName || "" : "",
        },
        {
          key: "branch",
          render: (device) =>
            device.branch ? device.branch.branchName || "" : "",
        },
      ],
      holiday: [
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "assigned",
              unapproved: device.status === "unassigned",
            },
          }),
        },
        {
          key: "date",
          render: (device) => device.date || "",
        },
        {
          key: "event",
          render: (device) => device.event || "",
        },
        {
          key: "branch",
          render: (device) =>
            device.branch ? device.branch.branchName || "" : "",
        },
        {
          key: "tenantName",
          render: (device) =>
            device.tenant ? device.tenant.tenantName || "" : "",
        },
      ],
    },
  },
  methods: {
    buildQueryFilters({
      userId,
      assignedBranch,
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

      if (userRole === "Admin") {
        queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
      }
      if (userRole === "Manager") {
        queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
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
          if (field.commenkey === "multiInputFields") {
            if (field.key === "tenantName") {
              form[field.key] = device.tenant
                ? [
                    {
                      [field.valueField]: device.tenant.tenantId ?? "",
                      [field.displayField]: device.tenant.tenantName ?? "",
                    },
                  ]
                : [];
            } else if (field.key === "wrkHrs") {
              form[field.key] = device.wrkHrs
                ? [
                    {
                      [field.valueField]: device.wrkHrs.id ?? "",
                      [field.displayField]: device.wrkHrs.workDays ?? "",
                    },
                  ]
                : [];
            } else if (field.key === "assignedDoors") {
              form[field.key] = device.assignedDoors
                ? device.assignedDoors.map((door) => ({
                    [field.valueField]: door.doors_id.id ?? "",
                    [field.displayField]: `${
                      door.doors_id?.doorNumber ?? ""
                    } - ${door.doors_id?.doorName ?? ""}`,
                    doors_id: door.doors_id?.id ?? "",
                  }))
                : [];
            } else if (field.key === "branch") {
              if (device.branch) {
                form[field.key] = [
                  {
                    [field.valueField]: device.branch.id ?? "",
                    [field.displayField]: device.branch.branchName ?? "",
                  },
                ];
              }
            } else if (field.key === "date") {
              if (device.date) {
                form[field.key] = device.date;
              }
            }
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
    prepareAddPayload(addForm, currentTab, userTenant) {
      if (currentTab === "branch") {
        return {
          branchId: addForm.branchId,
          uniqueId: `${userTenant}-${addForm.branchId}`,
          branchName: addForm.branchName,
          status: "assigned",
          tenant: userTenant,
        };
      } else if (currentTab === "department") {
        return {
          departmentId: addForm.departmentId,
          uniqueId: `${userTenant}-${addForm.departmentId}`,
          status: "assigned",
          departmentName: addForm.departmentName,
          branch:
            addForm.branch && addForm.branch.length > 0
              ? addForm.branch[0].id
              : null,
          tenant: userTenant,
        };
      } else if (currentTab === "time") {
        return {
          workDays: addForm.workDays,
          status: "assigned",
          entryTime: addForm.entryTime,
          exitTime: addForm.exitTime,
          tenant: userTenant,
        };
      } else if (currentTab === "holiday") {
        return {
          date: addForm.date,
          status: "assigned",
          event: addForm.event,
          tenant: userTenant,
          branch:
            addForm.branch && addForm.branch.length > 0
              ? addForm.branch[0].id
              : null,
        };
      }
      return {};
    },

    prepareEditPayload(form, currentTab, userTenant) {
      const payload = {
        tenant: userTenant,
      };
      if (currentTab === "department") {
        payload.departmentName = form.departmentName;
        (payload.status = "assigned"),
          (payload.branch =
            form.branch && form.branch.length > 0 ? form.branch[0].id : null);
      } else if (currentTab === "time") {
        (payload.status = "assigned"), (payload.workDays = form.workDays);
        payload.entryTime = form.entryTime;
        payload.exitTime = form.exitTime;
      } else if (currentTab === "holiday") {
        (payload.status = "assigned"), (payload.date = form.date);
        payload.event = form.event;
        payload.branch =
          form.branch && form.branch.length > 0 ? form.branch[0].id : null;
      } else if (currentTab === "branch") {
        (payload.status = "assigned"), (payload.branchName = form.branchName);
      }
      return {
        keys: [form.id],
        data: payload,
      };
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
