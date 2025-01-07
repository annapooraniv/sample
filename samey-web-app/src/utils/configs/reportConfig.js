export default {
  view: "tabular_view",
  collectionName: "Export",
  defaultTab: "import",
  tabPermissions: {
    export: ["Administrator", "Admin"],
    import: ["Administrator", "Admin"],
  },
  tabs: [
    {
      key: "import",
      name: "Import Data",
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
      allowFilter: false,
      allowRoleFilter: false,
      allowIncognitoMode: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/import",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "branch",
            "branch.branchName",
            "collectionName",
            "generatedFile.title",
            "status",
            "user_created.first_name",
            "tenant.tenantName",
          ],
          filter: {
            status: { _neq: "archived" },
          },
          sort: ["-date_created"],
          sortFields: {
            userName: "user_created.first_name",

            collectionName: "collectionName",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
            generatedFile: "generatedFile.title",
            date: "date",
          },
          searchFilters: {
            numeric: [],
            string: [
              `filter[_and][0][_or][0][status][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][collectionName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][generatedFile][title][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][user_created][first_name][_icontains]=%SEARCH_QUERY%`,
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
          label: "CollectionName",
          value: "filter[_and][0][_and][0][collectionName][_eq]=",
        },
        {
          label: "GeneratedFile",
          value: "filter[_and][0][_and][0][generatedFile][title][_eq]=",
        },
        {
          label: "BranchName",
          value: "filter[_and][0][_and][0][branch][branchName][_icontains]=",
        },
        {
          label: "tenantName",
          value: "filter[_and][0][tenant][tenantName][_icontains]=",
        },
        {
          label: "UserName",
          value: "filter[_and][0][user_created][first_name][_icontains]=",
        },
        {
          label: "Status",
          value: "filter[_and][0][_and][0][status][_eq]=",
        },
        {
          label: "Date",
          value: "filter[_and][0][_and][0][date][_eq]",
        },
      ],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      mandatoryFields: {},
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: [],
        delete: [],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      addApi: {
        endpoint: "/items/import",
        method: "POST",
      },
      addDialog: {
        title: "Import Data",
        fields: [
          {
            key: "upload",
            label: "upload",
            type: "file",
          },
          {
            key: "collectionName",
            label: "Collection Name",
            type: "dropdown",
            options: [
              { name: "personalModule" },
              { name: "doors" },
              { name: "department" },
              { name: "accesslevels" },
              // { name: "holiday" },
              { name: "branch" },
            ],
          },
        ],
      },
      export: {
        csv: { fileName: "Import" },
        pdf: {
          fileName: "Import",
          title: "Import",
        },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Requested",
          condition: (device) => device.status === "Requested",
        },
        failedCount: {
          label: "generated",
          condition: (device) => device.status === "generated",
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
      key: "export",
      name: "Export Data",
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
      allowEdit: false,
      allowGen: false,
      allowFilter: false,
      allowRoleFilter: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/export",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "branch",
            "branch.branchName",
            "collectionName",
            "generatedFile.title",
            "generateAutomatically",
            "exportingDays",
            "status",
            "user_created.first_name",
            "tenant.tenantName",
          ],
          filter: {
            status: { _neq: "archived" },
          },
          sort: ["-date_created"],
          sortFields: {
            userName: "user_created.first_name",

            collectionName: "collectionName",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
            generatedFile: "generatedFile.title",
            date: "date",
            generateAutomatically: "generateAutomatically",
            exportingDays: "exportingDays",
          },
          searchFilters: {
            numeric: [],
            string: [
              `filter[_and][0][_or][1][exportingDays][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][generateAutomatically][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][0][status][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][collectionName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][generatedFile][title][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][user_created][first_name][_icontains]=%SEARCH_QUERY%`,
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
      addApi: {
        endpoint: "/items/export",
        method: "POST",
      },
      addDialog: {
        title: "Export Data",
        fields: [
          {
            key: "startDate",
            label: "Start Date",
            type: "date",
          },

          {
            key: "endDate",
            label: "End Date",
            type: "date",
          },
          {
            key: "collectionName",
            label: "Collection Name",
            type: "dropdown",
            options: [{ name: "attendance" }, { name: "logs" }],
          },
        ],
      },
      permissions: {
        edit: [],
        delete: [],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      filterOptions: [
        {
          label: "CollectionName",
          value: "filter[_and][0][_and][0][collectionName][_eq]=",
        },
        {
          label: "GeneratedFile",
          value: "filter[_and][0][_and][0][generatedFile][title][_eq]=",
        },
        {
          label: "BranchName",
          value: "filter[_and][0][_and][0][branch][branchName[_icontains]=",
        },
        {
          label: "tenantName",
          value: "filter[_and][0][tenant][tenantName][_icontains]=",
        },
        {
          label: "UserName",
          value: "filter[_and][0][user_created][first_name][_icontains]=",
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
          label: "GenerateAutomatically",
          value: "filter[_and][0][_and][0][generateAutomatically][_icontains]=",
        },
        {
          label: "ExportingDays",
          value: "filter[_and][0][_and][0][exportingDays][_eq]=",
        },
      ],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,

      export: {
        csv: { fileName: "Export" },
        pdf: {
          fileName: "Export",
          title: "Export",
        },
      },

      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Requested",
          condition: (device) => device.status === "Requested",
        },
        failedCount: {
          label: "generated",
          condition: (device) => device.status === "generated",
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
      export: [
        { key: "status", label: "Status" },
        { key: "collectionName", label: "Collection Name" },
        { key: "generatedFile", label: "Generated File" },
        { key: "firstName", label: "User Name" },
        { key: "generateAutomatically", label: "Generate Automatically" },
        { key: "exportingDays", label: "Exporting Days" },
        { key: "branch", label: "Branch" },
        { key: "tenantName", label: "Tenant Name" },
      ],
      import: [
        { key: "status", label: "Status" },
        { key: "collectionName", label: "Collection Name" },
        { key: "generatedFile", label: "Generated File" },
        { key: "firstName", label: "User Name" },
        { key: "branch", label: "Branch" },
        { key: "tenantName", label: "Tenant Name" },
      ],
    },
    body: {
      export: [
        {
          key: "status",
          render: (device) => ({
            text: device.status,
            dotClass: {
              "status-dot": true,
              approved: device.status === "Requested",
              unapproved: device.status === "failed",
              loading: device.status === "generated",
            },
          }),
        },
        {
          key: "collectionName",
          render: (device) => device.collectionName || "",
        },
        {
          key: "generatedFile",
          render: (device) =>
            device.generatedFile ? device.generatedFile.title : "",
        },
        {
          key: "firstName",
          render: (device) => device.user_created.first_name || "",
        },
        {
          check: "shift",
          key: "generateAutomatically",
          render: (device) => device.generateAutomatically || "",
        },
        {
          key: "exportingDays",
          render: (device) => device.exportingDays || "",
        },
        {
          key: "branch",
          render: (device) => device.branch?.branchName || " ",
        },
        {
          key: "tenantName",
          render: (device) => device.tenant?.tenantName || "",
        },
      ],
      import: [
        {
          key: "status",
          render: (device) => ({
            text: device.status,
            dotClass: {
              "status-dot": true,
              approved: device.status === "Requested",
              unapproved: device.status === "failed",
              loading: device.status === "generated",
            },
          }),
        },
        {
          key: "collectionName",
          render: (device) => device.collectionName || "",
        },
        {
          key: "generatedFile",
          render: (device) =>
            device.generatedFile ? device.generatedFile.title : "",
        },
        {
          key: "firstName",
          render: (device) => device.user_created.first_name || "",
        },
        {
          key: "branch",
          render: (device) => device.branch?.branchName || "",
        },
        {
          key: "tenantName",
          render: (device) => device.tenant?.tenantName || "",
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

      if (userRole === "Admin") {
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
    prepareAddPayload(addForm, currentTab, userTenant) {
      if (currentTab === "import") {
        return {
          generatedFile: addForm.generatedFile,
          collectionName: addForm.collectionName,
          status: "Requested",
          tenant: userTenant,
          branch:
            addForm.branch && addForm.branch.length > 0
              ? addForm.branch[0].id
              : null,
        };
      } else if (currentTab === "export") {
        return {
          startDate: addForm.startDate,
          endDate: addForm.endDate,
          collectionName: addForm.collectionName,
          status: "Requested",
          tenant: userTenant,
          branch:
            addForm.branch && addForm.branch.length > 0
              ? addForm.branch[0].id
              : null,
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
