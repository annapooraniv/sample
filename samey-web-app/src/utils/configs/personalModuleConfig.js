export default {
  view: "tabular_view",
  collectionName: "PersonalModule",
  defaultTab: "PersonalModule",
  // get defaultTab() {
  //   const prevPath = document.referrer;
  //   const redirectSource = sessionStorage.getItem('redirectSource');
  //   // Handle redirects from dashboard
  //   if (redirectSource === 'PersonalModuleRedirect') {
  //     sessionStorage.removeItem('redirectSource');
  //     return 'PersonalModule';
  //   }
  //   },
  tabPermissions: {
    TenantManagement: ["esslAdmin", "Administrator"],
    PersonalModule: ["esslAdmin", "Administrator", "Admin", "Manager"],
    RolesManagement: ["esslAdmin", "Administrator", "Admin"],
    alert: ["Administrator", "Admin"],
  },
  tabs: [
    {
      key: "TenantManagement",
      name: "Tenant management",
      onTabSwitch: null,
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      rolesUrl: "/roles",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowAdd: false,
      allowEdit: true,
      allowFilter: false,
      allowRoleFilter: false,
      allowIncognitoMode: false,
      showScanPrompt: true,
      requiresScan: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/tenant",
        method: "GET",
        params: {
          fields: [
            "tenantId",
            "tenantName",
            "subscribedOn",
            "renewedOn",
            "doorLicense",
            "userLicense",
            "status",
            "validity",
            "panOrGst",
          ],
          statusFilter: {
            key: "filter[status][_neq]",
            value: "archived",
          },
          sort: ["-date_created"],
          sortFields: {
            tenantId: "tenantId",
            tenantName: "tenantName",
            subscribedOn: "subscribedOn",
            renewedOn: "renewedOn",
            doorLicense: "doorLicense",
            userLicense: "userLicense",
            status: "status",
            validity: "validity",
          },
          searchFilters: {
            searchFilters: {
              numeric: [
                `filter[_and][0][_or][0][doorLicense][_eq]=%SEARCH_QUERY%`,
                `filter[_and][0][_or][1][userLicense][_eq]=%SEARCH_QUERY%`,
              ],
              string: [
                `filter[_and][0][_or][0][panOrGst][_icontains]=%SEARCH_QUERY%`,
                `filter[_and][0][_or][1][tenantName][_icontains]=%SEARCH_QUERY%`,
                `filter[_and][0][_or][2][status][_eq]=%SEARCH_QUERY%`,
              ],
              date: [
                `filter[_and][0][_or][0][subscribedOn][_eq]=%SEARCH_QUERY%`,
                `filter[_and][0][_or][1][validity][_eq]=%SEARCH_QUERY%`,
                `filter[_and][0][_or][2][renewedOn][_eq]=%SEARCH_QUERY%`,
              ],
            },
          },
        },
      },
      filterOptions: [
        {
          label: "Tenant Name",
          value: "filter[_and][0][_and][0][tenantName][_icontains]",
        },
        {
          label: "Subscribed On",
          value: "filter[_and][0][_and][0][subscribedOn][_eq]",
        },
        {
          label: "Renewed On",
          value: "filter[_and][0][_and][0][renewedOn][_eq]",
        },
        {
          label: "Door License",
          value: "filter[_and][0][_and][0][doorLicense][_eq]",
        },
        {
          label: "Status",
          value: "filter[_and][0][_and][0][status][_eq]",
        },
        {
          label: "Validity",
          value: "filter[_and][0][_and][0][Validity][_icontains]",
        },
      ],
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
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      editApi: {
        endpoint: "/items/tenant",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/items/tenant",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/tenant",
        method: "POST",
      },
      mandatoryFields: {},
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["esslAdmin", "Administrator"],
        delete: ["esslAdmin", "Administrator"],
        add: ["esslAdmin", "Administrator"],
        incognitoToggle: [],
      },
      addDialog: {
        title: "Add tenantManagement Information",
        fields: [
          {
            key: "tenantName",
            label: "Tenant Name",
            type: "text",
            editable: true,
            dotFormat: false,
          },
          {
            key: "panOrGst",
            label: "PAN or GST",
            type: "text",
            editable: true,
            dotFormat: false,
            uppercase: true,
          },
          {
            key: "subscribedOn",
            label: "Subscribed On",
            type: "date",
            editable: true,
            dotFormat: false,
          },
          {
            key: "renewedOn",
            label: "Renewed On",
            type: "date",
            editable: true,
            dotFormat: false,
          },
          {
            key: "doorLicense",
            label: "Door License",
            type: "number",
            editable: true,
            dotFormat: false,
          },
          {
            key: "userLicense",
            label: "User License",
            type: "number",
            editable: true,
            dotFormat: false,
          },
          {
            key: "validity",
            label: "Validity",
            type: "date",
            editable: true,
            dotFormat: false,
          },
        ],
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
          single: "Edit tenantManagement Information",
        },
        headerFields: [],
        fields: {
          // multiple: [

          // ],
          single: [
            {
              key: "tenantName",
              label: "Company Name",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            {
              key: "subscribedOn",
              label: "Subscribed On",
              type: "date",
              editable: true,
              dotFormat: false,
            },
            {
              key: "renewedOn",
              label: "Renewed On",
              type: "date",
              editable: true,
              dotFormat: false,
            },
            {
              key: "doorLicense",
              label: "Door License",
              type: "number",
              editable: true,
              dotFormat: false,
            },
            {
              key: "userLicense",
              label: "User License",
              type: "number",
              editable: true,
              dotFormat: false,
            },
            {
              key: "validity",
              label: "Validity",
              type: "date",
              editable: true,
              dotFormat: false,
            },
          ],
          advance: [],
        },
        tabs: [
          { key: "basic", label: "Basic Settings", Enabled: false },
          { key: "", label: "", Enabled: false },
        ],
      },
      incognito: {
        fields: [],
      },
      export: {
        csv: { fileName: "Tenant Management" },
        pdf: {
          fileName: "tenantManagement",
          title: "Tenant Management Data",
        },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Active",
          condition: (device) => device.status === "active",
        },
        failedCount: {
          label: "InActive",
          condition: (device) => device.status === "inactive",
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
      key: "PersonalModule",
      name: "Personal Module",
      onTabSwitch: null,
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant&fields[]=role.name",
      bookmarkUrl: "/items/bookmark",
      rolesUrl: "/roles",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowAdd: true,
      allowEdit: true,
      allowFilter: false,
      allowRoleFilter: true,
      allowIncognitoMode: true,
      showScanPrompt: true,
      requiresScan: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/personalModule",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "employeeId",
            "accessOn",
            "status",
            "assignedCards.cardManagement_id.id",
            "assignedCards.cardManagement_id.rfidCard",
            "assignedCards.cardManagement_id.type",
            "assignedCards.cardManagement_id.cardAccess",
            "assignedTag.cardManagement_id.rfidCard",
            "assignedTag.cardManagement_id.type",
            "assignedTag.cardManagement_id.cardAccess",
            "assignedDepartment.department_id.id",
            "assignedDepartment.department_id.departmentName",
            "assignedDepartment.department_id.departmentId",
            "assignedAccessLevels.accesslevels_id.accessLevelName",
            "assignedAccessLevels.accesslevels_id.id",
            "assignedAccessLevels.accesslevels_id.accessLevelNumber",
            "assignedAccessLevels.accesslevels_id.wrkHrs.exitTime",
            "assignedAccessLevels.accesslevels_id.wrkHrs.entryTime",
            "assignedAccessLevels.accesslevels_id.wrkHrs.workDays",
            "id",
            "assignedCards.id",
            "assignedTag.id",
            "assignedDepartment.id",
            "assignedAccessLevels.id",
            "workingHours.id",
            "workingHours.time_id.id",
            "workingHours.time_id.workDays",
            "workingHours.time_id.entryTime",
            "workingHours.time_id.exitTime",
            "assignedBranch.branch_id.branchName",
            "assignedBranch.branch_id.id",
            "assignedBranch.id",
            "assignedUser.first_name",
            "assignedUser.phone",
            "assignedUser.email",
            "assignedUser.avatar.id",
            "assignedUser.avatar.type",
            "assignedUser.avatar.title",
            "assignedUser.tenant.tenantId",
            "assignedUser.tenant.tenantName",
            "assignedUser.role.name",
            "assignedUser.role.id",
            "assignedUser.id",
            "date_created",
            "assignedUser.accountNumber",
            "assignedUser.aadhar",
            "assignedUser.IFSC",
            "assignedUser.gender",
            "assignedUser.UPI",
            "assignedUser.dateOfLeaving",
            "assignedUser.dateOfJoining",
            "assignedUser.DOB",
            "assignedUser.PFAccountNumber",
            "assignedUser.maritalStatus",
            "assignedUser.ESIAccountNumber",
            "assignedUser.officeEmail",
            "assignedUser.pan",
            "assignedUser.gst",
          ],
          statusFilter: {
            key: "filter[status][_neq]",
            value: "archived",
          },
          sort: ["-date_created"],
          sortFields: {
            employeeId: "employeeId",
            accessOn: "accessOn",
            status: "status",
            first_name: "assignedUser.first_name",
            phone: "assignedUser.phone",
            email: "assignedUser.email",
            tenantName: "assignedUser.tenant.tenantName",
            role: "assignedUser.role.name",
            assignedCards: "assignedCards.cardManagement_id.rfidCard",
            assignedTag: "assignedTag.cardManagement_id.rfidCard",
            assignedDepartment:
              "assignedDepartment.department_id.departmentName",
            assignedAccessLevels:
              "assignedAccessLevels.accesslevels_id.accessLevelName",
            workDays: "assignedAccessLevels.accesslevels_id.wrkHrs.workDays",
            entryTime: "assignedAccessLevels.accesslevels_id.wrkHrs.entryTime",
            exitTime: "assignedAccessLevels.accesslevels_id.wrkHrs.exitTime",
            branchName: "assignedBranch.branch_id.branchName",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][0][assignedUser][phone][_contains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][assignedCards][cardManagement_id][rfidCard][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][assignedTag][cardManagement_id][rfidCard][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][employeeId][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][assignedUser][first_name][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][assignedUser][email][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][assignedDepartment][department_id][departmentName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][assignedBranch][branch_id][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][assignedUser][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][assignedUser][role][name][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][6][assignedAccessLevels][accesslevels_id][wrkHrs][workDays][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][7][assignedAccessLevels][accesslevels_id][accessLevelName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][8][employeeId][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
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
          label: "Employee ID",
          value: "filter[_and][0][_and][0][employeeId][_eq]=",
        },
        {
          label: "person Name",
          value:
            "filter[_and][0][_and][0][assignedUser][first_name][_icontains]=",
        },
        {
          label: "Email",
          value: "filter[_and][0][_and][0][assignedUser][email][_icontains]=",
        },
        {
          label: "Phone",
          value: "filter[_and][0][_and][0][assignedUser][phone][_eq]=",
        },
        {
          label: "User Role",
          value:
            "filter[_and][0][_and][0][assignedUser][role][name][_icontains]=",
        },
        {
          label: "Tenant Name",
          value:
            "filter[_and][0][_and][0][assignedUser][tenant][tenantName][_icontains]=",
        },
        {
          label: "Access Levels",
          value:
            "filter[_and][0][_and][0][assignedAccessLevels][accessLevelName][_icontains]=",
        },
        {
          label: "Assigned Cards",
          value:
            "filter[_and][0][assignedCards][cardManagement_id][rfidCard][_eq]=",
        },
        {
          label: "Assigned Tags",
          value:
            "filter[_and][0][assignedTag][cardManagement_id][rfidCard][_eq]=",
        },
        {
          label: "Assigned Department",
          value:
            "filter[_and][0][_and][0][assignedDepartment][department_id][departmentName][_icontains]=",
        },
        {
          label: "Branch",
          value:
            "filter[_and][0][_and][0][assignedBranch][branch_id][branchName][_icontains]=",
        },
        {
          label: "workDays",
          value:
            "filter[_and][0][_and][0][assignedAccessLevels][accesslevels_id][wrkHrs][workDays][_eq]=",
        },
      ],
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
      form: {
        status: "",
        employeeId: "",
        first_name: "",
        phone: "",
        accessOn: "",
        email: "",
        id: "",
        accessLevel: [],
        assignedDepartment: [],
        assignedCards: [],
        assignedTag: [],
        assignedBranch: [],
        assignedUser: {},
      },
      limitOptions: [50, 100, 500, 1000, 3000, 5000],
      defaultLimit: 50,
      editApi: {
        endpoint: "/items/personalModule",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/items/personalModule",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/personalModule",
        method: "POST",
      },
      //for view access
      accessLevelApi: {
        endpoint: "/items/accesslevels",
        params: {
          fields: [
            "id",
            "accessLevelNumber",
            "tenant.tenantName",
            "holidays",
            "_24hrs",
            "maxWorkHours",
            "workingHours",
            "assignedDoors.doors_id.doorName",
            "assignedDoors.doors_id.doorNumber",
          ],
        },
      },
      accessLevel: [
        {
          label: "ID",
          key: "accessLevelNumber",
          render: (device) => device.accessLevelNumber ?? "",
        },
        {
          label: "Tenant",
          key: "tenantName",
          render: (device) =>
            device.tenant && device.tenant.tenantName
              ? device.tenant.tenantName
              : "",
        },
        {
          key: "holidays",
          render: (device) => device.holidays || "",
        },
        {
          key: "_24hrs",
          render: (device) => device._24hrs || "",
        },
        {
          key: "maxWorkHours",
          render: (device) => device.maxWorkHours || "",
        },
        {
          key: "workingHours",
          render: (device) => device.workingHours || "",
        },
        {
          label: "DoorsNumber",
          key: "assignedDoors",
          render: (device) =>
            device.assignedDoors
              ?.map((door) => door.doors_id?.doorNumber || "")
              .join(", ") || "",
        },
        {
          label: "DoorsName",
          key: "assignedDoors",
          render: (device) =>
            device.assignedDoors
              ?.map((door) => door.doors_id?.doorName || "")
              .join(", ") || "",
        },
      ],
      mandatoryFields: {
        employeeId: true,
        first_name: true,
        phone: true,
        email: true,
      },
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["esslAdmin", "Administrator"],
        delete: ["esslAdmin", "Administrator", "Admin"],
        add: ["esslAdmin", "Administrator"],
        incognitoToggle: ["esslAdmin", "Administrator", "Admin"],
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
          multiple: "Edit Multiple PersonalModule Settings",
          single: "Edit PersonalModule Settings",
        },
        headerFields: [
          { key: "employeeId", label: "Employee ID", align: "left" },
          {
            key: "first_name",
            label: "first Name",
            align: "center",
          },
        ],
        fields: {
          multiple: [
            // {
            //   commenkey: "multiInputFields",
            //   key: "assignedDepartment",
            //   label: "Assign Department",
            //   type: "multiInput",
            //   endpoint: "/items/department",
            //   itemMethod: "GET",
            //   editable: true,
            //   dotFormat: false,
            //   displayField: "departmentName",
            //   valueField: "departmentId",
            //   requiresTenantFilter: true,
            // },
            // {
            //   commenkey: "multiInputFields",
            //   key: "accessLevel",
            //   label: "Assign Access Level",
            //   type: "multiInput",
            //   endpoint: "/items/accesslevels",
            //   itemMethod: "GET",
            //   editable: true,
            //   dotFormat: false,
            //   displayField: "accessLevelName",
            //   valueField: "id",
            //   requiresTenantFilter: true,
            // },
            // {
            //   key: "accessOn",
            //   label: "Access On",
            //   type: "boolean",
            //   editable: true,
            //   dotFormat: false,
            //   true: "Enabled",
            //   false: "Disabled",
            // },
          ],
          single: [
            {
              key: "employeeId",
              label: "Employee ID",
              type: "number",
              editable: true,
              dotFormat: false,
            },
            {
              key: "first_name",
              label: "First Name",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            {
              key: "phone",
              label: "Phone",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            {
              key: "email",
              label: "Email",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            // {
            //   key: "avatar",
            //   label: "Profile",
            //   type: "file",
            //   editable: true,
            //   dotFormat: false,
            // },
            {
              key: "accessOn",
              label: "Access On",
              type: "boolean",
              editable: true,
              dotFormat: false,
              true: "Enabled",
              false: "Disabled",
            },
            {
              commenkey: "multiInputFields",
              key: "role",
              label: "Role",
              type: "multiInput",
              endpoint: "/roles?filter[name][_eq]=Admin",
              itemMethod: "GET",
              displayField: "name",
              valueField: "id",
              dotFormat: false,
              option: 1,
              disabledFor: ["tenantManager"],
              roleAccess: {
                Administrator: true,
                Admin: false,
                Manager: false,
                Employee: false,
                esslAdmin: true,
              },
            },
            // {
            //   commenkey: "multiInputFields",
            //   key: "assignedDepartment",
            //   label: "Assign Department",
            //   type: "multiInput",
            //   endpoint: "/items/department",
            //   itemMethod: "GET",
            //   editable: true,
            //   dotFormat: false,
            //   option: 1,
            //   displayField: "departmentName",
            //   valueField: "departmentId",
            //   requiresTenantFilter: true,
            // },
            {
              commenkey: "multiInputFields",
              key: "tenantName",
              label: "TenantName",
              editable: true,
              itemLabel: "Tenant",
              placeholder: "Select tenant",
              searchPlaceholder: "Search tenant...",
              multipledoors: true,
              type: "dropdown",
              endpoint: "/items/tenant",
              itemMethod: "GET",
              displayField: "tenantName",
              valueField: "tenantId",
              option: 1,
              requiresTenantFilter: false,
              roleAccess: {
                Administrator: true,
                Admin: false,
                Manager: false,
                Employee: false,
                esslAdmin: true,
              },
            },
            // {
            //   commenkey: "multiInputFields",
            //   key: "accessLevel",
            //   label: "Assign Access Level",
            //   type: "multiInput",
            //   endpoint: "/items/accesslevels",
            //   itemMethod: "GET",
            //   editable: true,
            //   dotFormat: false,
            //   option: 1,
            //   displayField: "accessLevelName",
            //   valueField: "id",
            //   requiresTenantFilter: true,
            // },
            // {
            //   commenkey: "multiInputFields",
            //   key: "branch",
            //   label: "Branch",
            //   type: "multiInput",
            //   endpoint: "/items/branch",
            //   itemMethod: "GET",
            //   editable: true,
            //   displayField: "branchName",
            //   option: 1,
            //   valueField: "id",
            //   dotFormat: false,
            //   requiresTenantFilter: true,
            // },
            // {
            //   addkey: "Cards",
            //   mainkey: "assignedCards",
            //   label: "Assign Cards",
            //   displayField: "rfidCard",
            //   valueField: "id",
            //   type: "number",
            //   dotFormat: false,
            // },
            // {
            //   addkey: "Tags",
            //   mainkey: "assignedTag",
            //   label: "Assign Tags",
            //   displayField: "rfidCard",
            //   valueField: "id",
            //   type: "number",
            //   dotFormat: false,
            // },
          ],
          advance: [],
        },
      },
      addDialog: {
        title: "Add Personal Information",
        fields: [
          // {
          //   key: "avatar",
          //   label: "Profile",
          //   type: "file",
          //   editable: true,
          //   dotFormat: false,
          // },
          {
            key: "employeeId",
            label: "Employee ID",
            type: "text",

            dotFormat: false,
          },
          {
            key: "first_name",
            label: "First Name",
            type: "text",
            editable: true,
            dotFormat: false,
          },
          {
            key: "email",
            label: "Email",
            type: "text",
            editable: true,
            dotFormat: false,
          },
          {
            key: "phone",
            label: "Phone",
            type: "text",
            editable: true,
            dotFormat: false,
          },
          {
            key: "accessOn",
            label: "Access On",
            type: "boolean",
            dotFormat: false,
            editable: true,
            true: "Enabled",
            false: "Disabled",
          },
          {
            commenkey: "multiInputFields",
            key: "tenantName",
            label: "TenantName",
            editable: true,
            itemLabel: "Tenant",
            placeholder: "Select tenant",
            searchPlaceholder: "Search tenant...",
            multipledoors: true,
            type: "dropdown",
            endpoint: "/items/tenant",
            itemMethod: "GET",
            displayField: "tenantName",
            valueField: "tenantId",
            option: 1,
            requiresTenantFilter: false,
            roleAccess: {
              Administrator: true,
              Admin: false,
              Manager: false,
              Employee: false,
              esslAdmin: true,
            },
          },
          {
            commenkey: "multiInputFields",
            key: "role",
            label: "Role",
            type: "multiInput",
            endpoint: "/roles?filter[name][_eq]=Admin",
            itemMethod: "GET",
            option: 1,
            displayField: "name",
            valueField: "id",
            dotFormat: false,
            roleAccess: {
              Administrator: true,
              Admin: false,
              Manager: false,
              Employee: false,
              esslAdmin: true,
            },
          },
          // {
          //   commenkey: "multiInputFields",
          //   key: "assignedDepartment",
          //   label: "Assigned Department",
          //   type: "multiInput",
          //   endpoint: "/items/department",
          //   itemMethod: "GET",
          //   option: 1,
          //   displayField: "departmentName",
          //   valueField: "departmentId",
          //   dotFormat: false,
          //   requiresTenantFilter: true,
          // },
          // {
          //   commenkey: "multiInputFields",
          //   key: "accessLevel",
          //   label: "Assigned Access Level",
          //   type: "multiInput",
          //   endpoint: "/items/accesslevels",
          //   itemMethod: "GET",
          //   option: 1,
          //   displayField: "accessLevelName",
          //   valueField: "id",
          //   dotFormat: false,
          //   requiresTenantFilter: true,
          // },
          // {
          //   commenkey: "multiInputFields",
          //   key: "branch",
          //   label: "Branch",
          //   type: "multiInput",
          //   endpoint: "/items/branch",
          //   option: 1,
          //   itemMethod: "GET",
          //   displayField: "branchName",
          //   valueField: "id",
          //   dotFormat: false,
          //   requiresTenantFilter: true,
          // },
          // {
          //   key: "Cards",
          //   mainkey: "assignedCards",
          //   label: "Assign Cards ",
          //   displayField: "rfidCard",
          //   valueField: "id",
          //   type: "number",
          //   dotFormat: false,
          // },
        ],
      },
      incognito: {
        fields: [
          "phone",
          "email",
          "employeeId",
          "assignedCards",
          "assignedTag",
        ],
      },
      export: {
        csv: { fileName: "PersonalModule" },
        pdf: {
          fileName: "PersonalModule",
          title: "PersonalModule Data",
        },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Active",
          condition: (device) => device.status === "active",
        },
        failedCount: {
          label: "InActive",
          condition: (device) => device.status === "inactive",
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
      key: "RolesManagement",
      name: "Roles Management",
      onTabSwitch: null,
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: false,
      rolesUrl: "/roles",
      allowDelete: false,
      allowCounters: false,
      allowScan: false,
      allowAdd: false,
      allowEdit: false,
      allowFilter: false,
      allowRoleFilter: false,
      allowIncognitoMode: false,
      showScanPrompt: false,
      requiresScan: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/roles",
        method: "GET",
        params: {
          fields: ["id", "name", "icon", "description", "users"],
          name: { _neq: "Administrator" },
          sort: ["name"],
          sortFields: {
            name: "name",
            icon: "icon",
            description: "description",
            users: "users",
          },
          searchFilters: {
            numeric: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
            string: [
              `filter[_and][0][_or][0][name][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][users][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      filterOptions: [{ label: "No options ", value: "" }],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      editApi: {
        endpoint: "/roles",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/roles",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/roles",
        method: "POST",
      },
      mandatoryFields: {},
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name",
      permissions: {
        edit: [],
        delete: [],
        add: [],
        incognitoToggle: [],
      },
      editDialog: {
        title: {
          multiple: "Edit Multiple Roles",
          single: "Edit Role",
        },
        headerFields: [{ key: "name", label: "Role Name", align: "left" }],
        fields: {
          single: [
            {
              key: "name",
              label: "Name",
              type: "text",
              editable: true,
              dotFormat: false,
            },
          ],
          multiple: [],
        },
      },
      addDialog: {
        title: "Add New Role",
        fields: [{ key: "name", label: "Name", type: "text" }],
      },
      incognito: {
        fields: [],
      },
      export: {
        csv: { fileName: "RolesManagement" },
        pdf: {
          fileName: "RolesManagement",
          title: "RolesManagement Data",
        },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
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
      key: "alert",
      name: "Alerts & Notification",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      onTabSwitch: null,
      userIdUrl: "/users/me?fields[]=id",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: false,
      permissions: {
        edit: ["Administrator", "Admin"],
        delete: ["Administrator", "Admin"],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      allowDelete: true,
      allowCounters: true,
      allowScan: false,
      allowAdd: true,
      allowEdit: true,
      allowFilter: false,
      allowRoleFilter: true,
      allowIncognitoMode: false,
      showScanPrompt: false,
      requiresScan: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/alert",
        method: "GET",
        params: {
          fields: [
            "e_mail",
            "push",
            "roles.directus_roles_id.name",
            "roles.directus_roles_id.id",
            "status",
            "sms",
            "roles.id",
            "notifications.notifications_id.id",
            "notifications.notifications_id.message",
            "id",
          ],
          sort: ["sort"],
          sortFields: {
            e_mail: "e_mail",
            push: "ush",
            name: "roles.directus_roles_id.name",
            status: "status",
            sms: "sms",
            notifications: "notifications.notifications_id.message",
          },
          searchFilters: {
            numeric: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
            string: [
              `filter[_and][0][_or][0][roles][directus_roles_id][name][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][notifications][notifications_id][message][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      filterOptions: [
        {
          label: "Name",
          value: "filter[roles][directus_roles_id][name][_icontains]=",
        },
        {
          label: "Notifications",
          value:
            "filter[notifications][notifications_id][message][_icontains]=",
        },
      ],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,

      editApi: {
        endpoint: "/items/alert",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/items/alert",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/alert",
        method: "POST",
      },
      mandatoryFields: {},
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name",

      editDialog: {
        title: {
          multiple: "Edit Multiple Roles",
          single: "Edit Role",
        },
        headerFields: [{ key: "name", label: "Role Name", align: "left" }],
        fields: {
          single: [
            {
              key: "e_mail",
              label: "Email",
              type: "boolean",
              dotFormat: false,
              editable: true,
            },
            {
              key: "push",
              label: "Push ",
              type: "boolean",
              editable: true,
              dotFormat: false,
            },
            {
              key: "sms",
              label: "SMS",
              type: "boolean",
              editable: true,
              dotFormat: false,
            },
            {
              commenkey: "multiInputFields",
              key: "notifications",
              label: "Notifications",
              type: "multiInput",
              editable: true,
              endpoint: "/items/notifications",
              itemMethod: "GET",
              displayField: "message",
              valueField: "id",
              dotFormat: false,
              // option: null,
              roleAccess: {
                Administrator: true,
                Admin: false,
                Manager: false,
                Employee: false,
                esslAdmin: true,
              },
            },
            {
              commenkey: "multiInputFields",
              key: "roles",
              label: "Roles",
              type: "multiInput",
              endpoint: "/roles?filter[_and][0][name][_neq]=Administrator",
              itemMethod: "GET",
              displayField: "name",
              valueField: "id",
              dotFormat: false,
              option: 1,
              roleAccess: {
                Administrator: true,
                Admin: false,
                Manager: false,
                Employee: false,
                esslAdmin: true,
              },
            },
          ],
          multiple: [
            {
              key: "enforce_tfa",
              label: "Enforce 2FA",
              type: "boolean",
              editable: true,
            },
            {
              key: "admin_access",
              label: "Admin Access",
              type: "boolean",
              editable: true,
            },
            {
              key: "app_access",
              label: "App Access",
              type: "boolean",
              editable: true,
            },
          ],
        },
      },
      addDialog: {
        title: "Add New Alerts&Notification",
        fields: [
          { key: "e_mail", label: "Email", type: "boolean" },
          { key: "push", label: "Push ", type: "boolean" },
          { key: "sms", label: "SMS", type: "boolean" },
          {
            commenkey: "multiInputFields",
            key: "notifications",
            label: "Notifications",
            type: "multiInput",
            endpoint: "/items/notifications",
            itemMethod: "GET",
            displayField: "message",
            valueField: "id",
            dotFormat: false,
            // option: null,
            roleAccess: {
              Administrator: true,
              Admin: true,
              Manager: false,
              Employee: false,
              esslAdmin: false,
            },
          },
          {
            commenkey: "multiInputFields",
            key: "roles",
            label: "Roles",
            type: "multiInput",
            endpoint: "/roles?filter[_and][0][name][_neq]=Administrator",
            itemMethod: "GET",
            displayField: "name",
            valueField: "id",
            dotFormat: false,
            option: 1,
            roleAccess: {
              Administrator: true,
              Admin: true,
              Manager: false,
              Employee: false,
              esslAdmin: false,
            },
          },
        ],
      },
      incognito: {
        fields: [],
      },
      export: {
        csv: { fileName: "RolesManagement" },
        pdf: {
          fileName: "RolesManagement",
          title: "RolesManagement Data",
        },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Active",
          condition: (device) => device.status === "active",
        },
        failedCount: {
          label: "InActive",
          condition: (device) => device.status === "inactive",
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
      TenantManagement: [
        // { key: "status", label: "Status" },
        { key: "tenantName", label: "Company Name" },
        { key: "panOrGst", label: "PAN or GST" },
        { key: "subscribedOn", label: "Subscribed On" },
        { key: "renewedOn", label: "Renewed On" },
        { key: "doorLicense", label: "Door License" },
        { key: "userLicense", label: "User License" },
        { key: "validity", label: "Validity" },
      ],
      PersonalModule: [
        // { key: "controllerStatus", label: "controllerStatus"},
        { key: "status", label: "Status" },
        { key: "avatar", label: "Profile" },
        { key: "employeeId", label: "Employee ID" },
        { key: "first_name", label: "person Name" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "tenantName", label: "Tenant Name" },
        { key: "role", label: "Role" },
        { key: "accessOn", label: "Access On" },
        { key: "assignedAccessLevels", label: "Access Levels" },
        { key: "assignedCards", label: "Assigned Cards" },
        { key: "assignedTag", label: "Assigned Tags" },
        { key: "assignedDepartment", label: "Assigned Department" },
        // { key: "workDays", label: "workDays" },
        // { key: "entryTime", label: "Entry Time" },
        // { key: "exitTime", label: "Exit Time" },
        {
          key: "assignedBranch",
          label: "Branch",
          customRender: (userRole) => ({
            text: "Branch",
            showRedirect: ["Administrator", "Admin"].includes(userRole),
          }),
        },
      ],
      RolesManagement: [
        { key: "name", label: "Name" },
        { key: "users", label: "Users" },
      ],
      alert: [
        { key: "status", label: "Status" },
        { key: "e_mail", label: "Email" },
        { key: "push", label: "Push " },
        { key: "sms", label: "SMS" },
        { key: "name", label: "Role Name" },
        { key: "notifications", label: "Notifications" },
      ],
    },
    body: {
      TenantManagement: [
        // {
        //   key: "status",
        //   render: (device) => ({
        //     text: device?.status || "",
        //     dotClass: {
        //       "status-dot": true,
        //       approved: device?.status === "active",
        //       unapproved: device?.status === "inactive"
        //     }
        //   })
        // },
        {
          key: "items",
          name: "Tenant Name",
          render: (device) => {
            if (!device) return null;
            return {
              text: "View",
              click: "toggleItemList",
              list: [
                {
                  name: device.tenantName || "",
                  id: device.tenantId || "",
                  button: true,
                },
              ],
            };
          },
        },
        {
          key: "panOrGst",
          render: (device) => device?.panOrGst || null,
        },
        {
          key: "subscribedOn",
          render: (device) => device?.subscribedOn || null,
        },
        {
          key: "renewedOn",
          render: (device) => device?.renewedOn || null,
        },
        {
          key: "doorLicense",
          render: (device) => device?.doorLicense || null,
        },
        {
          key: "userLicense",
          render: (device) => device?.userLicense || null,
        },
        {
          key: "validity",
          render: (device) => device?.validity || "",
        },
      ],
      PersonalModule: [
        // {
        //   key: "controllerStatus",
        //   render: (device) => device.controllerStatus || "Waiting for controller response",
        // },
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "active",
              unapproved: device.status === "inactive",
            },
          }),
        },
        {
          key: "avatar",
          render: (device) => {
            return device.assignedUser?.avatar?.id
              ? `/assets/${device.assignedUser.avatar.id}`
              : "";
          },
        },
        {
          key: "employeeId",
          render: (device, incognitoMode, maskData) =>
            incognitoMode && device.employeeId != null
              ? maskData(device.employeeId.toString(), "")
              : device.employeeId || "",
        },
        {
          key: "first_name",
          render: (device) => device.assignedUser?.first_name || "",
        },
        {
          key: "phone",
          render: (device, incognitoMode, maskData) =>
            incognitoMode && device.assignedUser?.phone != null
              ? maskData(device.assignedUser.phone.toString(), "number")
              : device.assignedUser?.phone || "",
        },
        {
          key: "email",
          render: (device, incognitoMode, maskData) =>
            incognitoMode && device.assignedUser?.email != null
              ? maskData(device.assignedUser.email, "email")
              : device.assignedUser?.email || "",
        },
        {
          key: "tenantName",
          render: (device) => device.assignedUser?.tenant?.tenantName || "",
        },
        {
          key: "role",
          render: (device) => device.assignedUser?.role?.name || "",
        },
        {
          key: "accessOn",
          render: (device) => (device.accessOn ? "Enabled" : "Disabled"),
        },
        {
          key: "items",
          name: "Access Levels",
          render: (device) => {
            const items = Array.isArray(device.assignedAccessLevels)
              ? device.assignedAccessLevels
              : [];
            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((level) => {
                  if (level?.accesslevels_id) {
                    return {
                      name: `${level.accesslevels_id.accessLevelName || ""} (${
                        level.accesslevels_id.accessLevelNumber || ""
                      })`,
                      id: level.accesslevels_id.id,
                      uniqueId: level.id,
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
          button: true,
        },
        {
          key: "items",
          name: "Assigned Cards",
          render: (
            device,
            incognitoMode = false,
            maskData = (data) => data
          ) => {
            const items = Array.isArray(device.assignedCards)
              ? device.assignedCards.filter(
                  (card) => card?.cardManagement_id?.type === "rfid"
                )
              : [];

            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((card) => {
                  if (card && card.cardManagement_id) {
                    const cardNumber = card.cardManagement_id.rfidCard || "";
                    return cardNumber
                      ? {
                          name: incognitoMode
                            ? maskData(cardNumber, "number")
                            : `${cardNumber} (${
                                card.cardManagement_id.cardAccess
                                  ? "Enabled"
                                  : "Disabled"
                              })`,
                          id: card.cardManagement_id.id,
                          uniqueId: card.id,
                        }
                      : null;
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
        },
        {
          key: "items",
          name: "Assigned Tags",
          render: (
            device,
            incognitoMode = false,
            maskData = (data) => data
          ) => {
            const items = Array.isArray(device.assignedCards)
              ? device.assignedCards.filter(
                  (card) => card?.cardManagement_id?.type === "tag"
                )
              : [];

            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((tag) => {
                  if (tag && tag.cardManagement_id) {
                    const tagNumber = tag.cardManagement_id.rfidCard || "";
                    return tagNumber
                      ? {
                          name: incognitoMode
                            ? maskData(tagNumber, "number")
                            : `${tagNumber} (${
                                tag.cardManagement_id.cardAccess
                                  ? "Enabled"
                                  : "Disabled"
                              })`,
                          id: tag.cardManagement_id.id,
                          uniqueId: tag.id,
                        }
                      : null;
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
        },
        {
          key: "items",
          name: "department",
          render: (device) => {
            const items = Array.isArray(device.assignedDepartment)
              ? device.assignedDepartment
              : [];
            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((dept) => {
                  if (dept && dept.department_id) {
                    return {
                      name: `dept${dept.department_id.departmentId || ""} - ${
                        dept.department_id.departmentName || ""
                      }`,
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
        },
        // {
        //   key: "workDays",
        //   render: (device) => {
        //     if (
        //       device.assignedAccessLevels &&
        //       device.assignedAccessLevels.length > 0
        //     ) {
        //       return device.assignedAccessLevels
        //         .map((level) =>
        //           level.accesslevels_id && level.accesslevels_id.wrkHrs
        //             ? level.accesslevels_id.wrkHrs.workDays || ""
        //             : ""
        //         )
        //         .join(", ");
        //     }
        //     return "";
        //   },
        // },
        // {
        //   key: "entryTime",
        //   render: (device) => {
        //     if (
        //       device.assignedAccessLevels &&
        //       device.assignedAccessLevels.length > 0
        //     ) {
        //       return device.assignedAccessLevels
        //         .map((level) =>
        //           level.accesslevels_id && level.accesslevels_id.wrkHrs
        //             ? level.accesslevels_id.wrkHrs.entryTime || ""
        //             : ""
        //         )
        //         .join(", ");
        //     }
        //     return "";
        //   },
        // },
        // {
        //   key: "exitTime",
        //   render: (device) => {
        //     if (
        //       device.assignedAccessLevels &&
        //       device.assignedAccessLevels.length > 0
        //     ) {
        //       return device.assignedAccessLevels
        //         .map((level) =>
        //           level.accesslevels_id && level.accesslevels_id.wrkHrs
        //             ? level.accesslevels_id.wrkHrs.exitTime || ""
        //             : ""
        //         )
        //         .join(", ");
        //     }
        //     return "";
        //   },
        // },
        {
          key: "assignedBranch",
          render: (device) =>
            device.assignedBranch
              ? device.assignedBranch
                  .map((branch) => branch.branch_id?.branchName || "")
                  .join(", ")
              : "",
        },
      ],
      RolesManagement: [
        {
          key: "name",
          render: (role) => role.name || "",
        },
        {
          popup: "UserDetails",
          key: "Users",
          render: (role) => ({
            text: "View",
            userIds: role.users,
            hasUsers: Array.isArray(role.users) && role.users.length > 0,
          }),
        },
      ],
      alert: [
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "active",
              unapproved: device.status === "inactive",
            },
          }),
        },
        {
          check: "shift",
          key: "e_mail",
          render: (device) => device.e_mail || "",
        },
        {
          check: "shift",
          key: "push",
          render: (device) => device.push || "",
        },
        {
          check: "shift",
          key: "sms",
          render: (device) => device.sms || "",
        },
        {
          key: "name",
          render: (device) =>
            Array.isArray(device.roles)
              ? device.roles
                  .map((role) => role?.directus_roles_id?.name || "")
                  .filter(Boolean)
                  .join(", ")
              : "",
        },
        {
          key: "items",
          name: "notifications",
          render: (device) => {
            const items = Array.isArray(device.notifications)
              ? device.notifications
              : [];
            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((noti) => {
                  if (noti?.notifications_id) {
                    return {
                      name: `${noti.notifications_id.id || " "} - ${
                        noti.notifications_id.message || " "
                      }`,
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
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
      if (currentTab === "PersonalModule") {
        if (userRole === "Administrator" || userRole === "esslAdmin") {
          queryParams.append("filter[assignedUser][role][name][_eq]", "Admin");
        }
        if (userRole === "Admin") {
          queryParams.append(
            "filter[assignedUser][tenant][tenantId][_eq]",
            userTenant
          );
        }
        if (userRole === "Manager") {
          queryParams.append(
            "filter[assignedUser][tenant][tenantId][_eq]",
            userTenant
          );
        }
      }
      // if (currentTab === 'RolesManagement') {
      //   if (userRole === 'esslAdmin') {
      //     params.append("name[_neq]", "Administrator");
      //   }
      //   if (userRole === 'Admin') {

      //     params.append("name[_neq]", "esslAdmin");
      //     params.append("name[_neq]", "Administrator");
      //   }
      // }
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
    //role based permistion
    checkPermission(action, userRole) {
      return this.permissions[action].includes(userRole);
    },

    openEditDialog() {
      const devices = this.tabData[this.currentTab].devices;
      const selectedDevices = devices.filter((device) => device.selected);
      const isMultiEdit = selectedDevices.length > 1;

      if (selectedDevices.length === 0) {
        alert("Please select at least one item to edit.");
        return;
      }

      let form = {};
      const fields = this.currentTabConfig.editDialog.fields.single;
      if (!isMultiEdit) {
        const device = selectedDevices[0];

        // Handle TenantManagement specific fields first
        if (this.currentTab === "TenantManagement") {
          form = {
            tenantId: device.tenantId || "",
            tenantName: device.tenantName || "",
            subscribedOn: device.subscribedOn || "",
            renewedOn: device.renewedOn || "",
            doorLicense: device.doorLicense || "",
            userLicense: device.userLicense || "",
            validity: device.validity || "",
          };
        } else {
          // Handle other fields as before
          fields.forEach((field) => {
            if (field.commenkey === "multiInputFields") {
              if (field.key === "assignedDepartment") {
                form[field.key] = (device.assignedDepartment || []).map(
                  (dept) => ({
                    [field.valueField]: dept.department_id?.departmentId || "",
                    [field.displayField]:
                      dept.department_id?.departmentName || "",
                    assignedDepartment_id: dept.id || "",
                  })
                );
              } else if (field.key === "tenantName") {
                form[field.key] = device.assignedUser?.tenant
                  ? [
                      {
                        [field.valueField]:
                          device.assignedUser?.tenant?.tenantId || "",
                        [field.displayField]:
                          device.assignedUser?.tenant?.tenantName || "",
                      },
                    ]
                  : [];
              } else if (field.key === "notifications") {
                form[field.key] = (device.notifications || []).map((noti) => ({
                  [field.valueField]: noti.notifications_id?.id || "",
                  [field.displayField]: noti.notifications_id?.message || "",
                  notifications_id: noti.notifications_id?.id || "",
                }));
              } else if (field.key === "accessLevel") {
                form[field.key] = (device.assignedAccessLevels || []).map(
                  (level) => ({
                    [field.valueField]: level.accesslevels_id?.id || "",
                    [field.displayField]:
                      level.accesslevels_id?.accessLevelName || "",
                    assignedAccessLevels_id: level.id || "",
                  })
                );
              } else if (field.key === "branch") {
                form[field.key] = (device.assignedBranch || []).map(
                  (branch) => ({
                    [field.valueField]: branch.branch_id?.id || "",
                    [field.displayField]: branch.branch_id?.branchName || "",
                    assignedBranch_id: branch.id || "",
                  })
                );
              } else if (field.key === "role") {
                form[field.key] =
                  device.assignedUser && device.assignedUser.role
                    ? [
                        {
                          [field.valueField]: device.assignedUser.role.id || "",
                          [field.displayField]:
                            device.assignedUser.role.name || "",
                          id: device.assignedUser.role.id || "",
                        },
                      ]
                    : [];
              } else if (field.key === "roles") {
                form[field.key] = (device.roles || []).map((role) => ({
                  [field.valueField]: role.directus_roles_id?.id || "",
                  [field.displayField]: role.directus_roles_id?.name || "",
                  directus_roles_id: role.directus_roles_id?.id || "",
                }));
              } else {
                form[field.key] = (device[field.key] || []).map((item) => ({
                  [field.valueField]: item[field.valueField] || item.id || "",
                  [field.displayField]:
                    item[field.displayField] ||
                    item.name ||
                    item.accessLevelName ||
                    item.departmentName ||
                    "",
                }));
              }
            } else if (field.addkey === "Cards") {
              form[field.mainkey] = (device.assignedCards || []).map(
                (card) => ({
                  rfidCard: card.cardManagement_id?.rfidCard || "",
                  type: card.cardManagement_id?.type || "",
                  assignedCard_id: card.id || "",
                  cardAccess: card.cardManagement_id?.cardAccess || "",
                  cardManagement_id: card.cardManagement_id?.id || "",
                })
              );
            } else if (field.addkey === "Tags") {
              form.assignedTag = (device.assignedTag || []).map((tag) => ({
                rfidCard: tag.cardManagement_id?.rfidCard || "",
                type: tag.cardManagement_id?.type || "tag",
                assignedTag_id: tag.id || "",
                cardAccess: tag.cardManagement_id?.cardAccess || "",
                cardManagement_id: tag.cardManagement_id?.id || "",
              }));
            } else if (field.key === "assignedDoors") {
              form[field.key] = (device.assignedDoors || []).map((door) => ({
                id: door.door_id?.id || "",
                displayText: door.door_id?.doorName || door.door_id?.id || "",
              }));
            } else if (field.key === "avatar") {
              const avatarId =
                device.assignedUser?.avatar?.id ||
                device.assignedUser?.avatar ||
                "";
              form.avatar = avatarId;
              this.avatarPreview = avatarId
                ? `/assets/${avatarId}?key=system-large-cover`
                : "";
            } else if (["phone", "email", "first_name"].includes(field.key)) {
              form[field.key] = device.assignedUser
                ? device.assignedUser[field.key] || ""
                : "";
            } else {
              form[field.key] = device[field.key] || "";
            }

            if (device.assignedUser) {
              form.assignedUser = {
                id: device.assignedUser.id || "",
                tenant: this.userTenant,
              };
            }
          });

          form.id = device.id || "";
        }
      } else {
        form.ids = selectedDevices.map((device) => device.id);
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

    prepareEditPayload(form, currentTab, userTenant, originalForm) {
      if (currentTab === "TenantManagement") {
        return {
          keys: [form.tenantId],
          data: {
            status: "active",
            tenantName: form.tenantName,
            subscribedOn: form.subscribedOn,
            renewedOn: form.renewedOn,
            doorLicense: form.doorLicense,
            userLicense: form.userLicense,
            validity: form.validity,
          },
        };
      } else if (currentTab === "RolesManagement") {
        if (!Array.isArray(form.ids)) {
          return {
            keys: [form.id],
            data: {
              name: form.name,
              icon: form.icon,
              description: form.description,
              ip_access: form.ip_access,
              enforce_tfa: form.enforce_tfa,
              admin_access: form.admin_access,
              app_access: form.app_access,
            },
          };
        }
      } else if (currentTab === "PersonalModule") {
        if (!Array.isArray(form.ids)) {
          const payload = {
            keys: [form.id],
            data: {},
          };
          if (originalForm.status !== "active") {
            payload.data.status = "active";
          }
          payload.data.assignedUser = {
            id: form.assignedUser.id,
            tenant: form.tenantName[0]?.tenantId || userTenant,
          };

          let userFieldsChanged = false;
          const userFieldsToCheck = [
            "first_name",
            "phone",
            "email",
            "role",
            "avatar",
          ];

          userFieldsToCheck.forEach((field) => {
            if (field === "role") {
              if (
                form.role?.length > 0 &&
                (!originalForm.role?.length ||
                  form.role[0].id !== originalForm.role[0].id)
              ) {
                payload.data.assignedUser.role = form.role[0].id;
                userFieldsChanged = true;
              } else if (
                form.role?.length === 0 &&
                originalForm.role?.length > 0
              ) {
                payload.data.assignedUser.role = null;
                userFieldsChanged = true;
              }
            } else if (field === "avatar") {
              if (form.avatar !== originalForm.avatar) {
                payload.data.assignedUser.avatar = form.avatar || null;
                userFieldsChanged = true;
              }
            } else {
              if (form[field] !== originalForm[field]) {
                payload.data.assignedUser[field] = form[field];
                userFieldsChanged = true;
                if (field === "phone") {
                  payload.data.assignedUser.password = form[field];
                }
              }
            }
          });

          // Reset assignedUser if no fields changed
          if (!userFieldsChanged) {
            payload.data.assignedUser = {
              id: form.assignedUser.id,
              tenant: form.tenantName[0]?.tenantId || userTenant,
            };
          }

          // Check basic fields
          const fieldsToCheck = ["employeeId", "accessOn"];
          fieldsToCheck.forEach((field) => {
            if (form[field] !== originalForm[field]) {
              payload.data[field] = form[field];
            }
          });

          // Handle relations
          const relationChecks = {
            accessLevel: {
              key: "assignedAccessLevels",
              idKey: "accesslevels_id",
              moduleKey: "personalModule_id",
            },
            branch: {
              key: "assignedBranch",
              idKey: "branch_id",
              moduleKey: "personalModule_id",
            },
            assignedCards: {
              key: "assignedCards",
              rfidCheck: true,
              type: "card",
            },
            assignedTag: {
              key: "assignedTag",
              rfidCheck: true,
              type: "tag",
            },
            assignedDepartment: {
              key: "assignedDepartment",
              idKey: "department_id",
              moduleKey: "personalModule_id",
            },
          };

          Object.entries(relationChecks).forEach(([formKey, config]) => {
            if (
              JSON.stringify(form[formKey]) !==
              JSON.stringify(originalForm[formKey])
            ) {
              const relationType = config.key;
              payload.data[relationType] = {
                create: [],
                update: [],
                delete: [],
              };

              // Handle RFID-based relations
              if (config.rfidCheck) {
                form[formKey].forEach((item) => {
                  if (
                    !originalForm[formKey].some(
                      (orig) => orig.rfidCard === item.rfidCard
                    )
                  ) {
                    payload.data[relationType].create.push({
                      cardManagement_id: {
                        rfidCard: item.rfidCard,
                        type: item.type || config.type,
                      },
                    });
                  }
                });

                originalForm[formKey].forEach((item) => {
                  if (
                    !form[formKey].some(
                      (curr) => curr.rfidCard === item.rfidCard
                    )
                  ) {
                    payload.data[relationType].delete.push(
                      item[`${relationType}_id`]
                    );
                  }
                });
              }
              // Handle ID-based relations
              else {
                form[formKey].forEach((item) => {
                  if (
                    !originalForm[formKey].some((orig) => orig.id === item.id)
                  ) {
                    payload.data[relationType].create.push({
                      [config.moduleKey]: form.id,
                      [config.idKey]: { id: item.id },
                    });
                  }
                });

                originalForm[formKey].forEach((item) => {
                  const deleteKey = `${relationType}_id`;
                  if (!form[formKey].some((curr) => curr.id === item.id)) {
                    payload.data[relationType].delete.push(item[deleteKey]);
                  }
                });
              }

              // Remove empty relation objects
              if (
                !payload.data[relationType].create.length &&
                !payload.data[relationType].update.length &&
                !payload.data[relationType].delete.length
              ) {
                delete payload.data[relationType];
              }
            }
          });

          return Object.keys(payload.data).length ? payload : null;
        } else {
          // Multi-edit scenario
          const payload = {
            keys: form.ids,
            data: {},
          };

          if (form.accessOn !== undefined) {
            payload.data.accessOn = form.accessOn;
          }

          if (form.accessLevel?.length > 0) {
            payload.data.assignedAccessLevels = {
              create: form.accessLevel.map((level) => ({
                personalModule_id: "+",
                accesslevels_id: { id: level.id },
              })),
            };
          }

          if (form.assignedDepartment?.length > 0) {
            payload.data.assignedDepartment = {
              create: form.assignedDepartment.map((dept) => ({
                personalModule_id: "+",
                department_id: { id: dept.id },
              })),
            };
          }

          return Object.keys(payload.data).length ? payload : null;
        }
      } else if (currentTab === "alert") {
        const payload = {
          keys: [form.id],
          data: {
            status: "assigned",
          },
        };
        const fieldsToCheck = ["push", "e_mail", "sms"];
        fieldsToCheck.forEach((field) => {
          if (form[field] !== originalForm[field]) {
            payload.data[field] = form[field];
          }
        });

        // Handle notifications
        if (
          JSON.stringify(form.notifications) !==
          JSON.stringify(originalForm.notifications)
        ) {
          payload.data.notifications = { create: [], update: [], delete: [] };

          form.notifications.forEach((noti) => {
            if (!originalForm.notifications.some((on) => on.id === noti.id)) {
              payload.data.notifications.create.push({
                alert_id: form.id,
                notifications_id: { id: noti.id },
              });
            }
          });

          originalForm.notifications.forEach((noti) => {
            if (!form.notifications.some((n) => n.id === noti.id)) {
              payload.data.notifications.delete.push(noti.notifications_id);
            }
          });
        }

        // Handle roles
        if (JSON.stringify(form.roles) !== JSON.stringify(originalForm.roles)) {
          payload.data.roles = { create: [], update: [], delete: [] };

          form.roles.forEach((role) => {
            if (!originalForm.roles.some((or) => or.id === role.id)) {
              payload.data.roles.create.push({
                alert_id: form.id,
                directus_roles_id: { id: role.id },
              });
            }
          });

          originalForm.roles.forEach((role) => {
            if (!form.roles.some((r) => r.id === role.id)) {
              payload.data.roles.delete.push(role.id);
            }
          });
        }
        return payload;
      }
    },
    prepareAddPayload(addForm, currentTab, userTenant) {
      if (currentTab === "TenantManagement") {
        const generatedTenantId = crypto.randomUUID();
        return {
          status: "active",
          tenantId: generatedTenantId,
          tenantName: addForm.tenantName,
          panOrGst: addForm.panOrGst,
          subscribedOn: addForm.subscribedOn,
          renewedOn: addForm.renewedOn,
          doorLicense: addForm.doorLicense,
          userLicense: addForm.userLicense,
          validity: addForm.validity,
          // user: {
          //   employeeId:addForm.employeeId,
          //   accessOn: "false",
          // uniqueId: `${generatedTenantId}-${employeeId}`,
          //   status: "inactive",
          //   assignedUser: {
          //   first_name: addForm.first_name,
          //   email: addForm.email,
          //   phone: addForm.phone,
          //   password: addForm.phone,
          //   tenant: generatedTenantId,
          //   role: addForm.role.id,
          // }
          // }
        };
      } else if (currentTab === "RolesManagement") {
        return {
          name: addForm.name,
          icon: addForm.icon,
          description: addForm.description,
        };
      } else if (currentTab === "alert") {
        return {
          e_mail: addForm.e_mail,
          status: "assigned",
          push: addForm.push,
          sms: addForm.sms,
          notifications: {
            create: addForm.notifications.map((noti) => ({
              alert_id: "+",
              notifications_id: { id: noti.id },
            })),

            update: [],
            delete: [],
          },
          roles: {
            create: addForm.roles.map((role) => ({
              alert_id: "+",
              directus_roles_id: { id: role.id },
            })),
            update: [],
            delete: [],
          },
        };
      } else if (currentTab === "PersonalModule") {
        return {
          employeeId: addForm.employeeId,
          accessOn: addForm.accessOn,

          status: "active",
          assignedUser: {
            first_name: addForm.first_name,
            email: addForm.email,
            phone: addForm.phone,
            password: addForm.phone,
            avatar: addForm.avatar,
            tenant: addForm.tenantName[0]?.tenantId || userTenant,
            role:
              addForm.role && addForm.role.length > 0
                ? addForm.role[0].id
                : null,
          },
          uniqueId: `${addForm.tenantName?.[0]?.tenantId || userTenant}-${
            addForm.employeeId
          }`,
          // assignedAccessLevels: {
          //   create: addForm.accessLevel.map((level) => ({
          //     personalModule_id: "+",
          //     accesslevels_id: { id: level.id },
          //   })),
          //   update: [],
          //   delete: [],
          // },
          // assignedBranch: {
          //   create: (addForm.branch || []).map((branch) => ({
          //     personalModule_id: "+",
          //     branch_id: { id: branch.id },
          //   })),
          //   update: [],
          //   delete: [],
          // },
          // assignedCards: {
          //   create: addForm.assignedCards.map((card) => ({
          //     cardManagement_id: {
          //       rfidCard: card.rfidCard,
          //       type: card.type || "card",
          //     },
          //   })),
          //   update: [],
          //   delete: [],
          // },
          // assignedTag: {
          //   create: addForm.assignedTag.map((tag) => ({
          //     cardManagement_id: {
          //       rfidCard: tag.rfidCard,
          //       type: tag.type || "tag",
          //     },
          //   })),
          //   update: [],
          //   delete: [],
          // },
          // assignedDepartment: {
          //   create: addForm.assignedDepartment.map((dept) => ({
          //     personalModule_id: "+",
          //     department_id: { id: dept.id },
          //   })),
          //   update: [],
          //   delete: [],
          // },
        };
      } else {
        console.error("Unknown tab:", currentTab);
        return {};
      }
    },
    async validation(payload) {
      let isDuplicate = false;

      // Check if there are cards or tags to validate
      const hasCards =
        payload.assignedCards?.create?.length > 0 ||
        payload.assignedTag?.create?.length > 0;

      if (hasCards) {
        // Check for existing RFID cards and tags
        const rfidCards = payload.assignedCards.create.map(
          (card) => card.cardManagement_id.rfidCard
        );
        const rfidTags = payload.assignedTag.create.map(
          (tag) => tag.cardManagement_id.rfidCard
        );
        const allRfidItems = [...rfidCards, ...rfidTags];

        if (allRfidItems.length > 0) {
          const card = `/items/cardManagement?rfidCard[_in]=${allRfidItems.join(
            ","
          )}`;
          const cardResponse = await fetch(card);
          const existingCardData = await cardResponse.json();

          if (existingCardData.data && existingCardData.data.length > 0) {
            const existingRfidItems = existingCardData.data.map(
              (item) => item.rfidCard
            );
            const duplicateItems = allRfidItems.filter((item) =>
              existingRfidItems.includes(item)
            );

            if (duplicateItems.length > 0) {
              alert(
                `RFID Card(s) or Tag(s) ${duplicateItems.join(
                  ", "
                )} already exist in cardManagement!`
              );
              console.log("Duplicate cards or tags found:", duplicateItems);
              isDuplicate = true;
            }
          }
        }
      }

      // Check for existing employee ID
      const personalUrl = `/items/personalModule?filter[_or][0][employeeId][_eq]=${payload.employeeId}`;
      const personalResponse = await fetch(personalUrl);
      const existingPersonalData = await personalResponse.json();

      if (existingPersonalData.data && existingPersonalData.data.length > 0) {
        existingPersonalData.data.forEach((item) => {
          if (item.employeeId === payload.employeeId) {
            alert(`Employee ID ${payload.employeeId} already exists!`);
            isDuplicate = true;
          }
        });
      }

      // Check for existing phone number and email
      const rolesUrl = `/roles?fields=users.email,users.phone`;
      const rolesResponse = await fetch(rolesUrl);
      const rolesData = await rolesResponse.json();

      if (rolesData.data) {
        const allUsers = rolesData.data.flatMap((role) => role.users || []);

        const duplicateEmail = allUsers.find(
          (user) => user.email === payload.assignedUser.email
        );
        if (duplicateEmail) {
          alert(`Email ${payload.assignedUser.email} already exists!`);
          isDuplicate = true;
        }

        const duplicatePhone = allUsers.find(
          (user) => user.phone === payload.assignedUser.phone
        );
        if (duplicatePhone) {
          alert(`Phone number ${payload.assignedUser.phone} already exists!`);
          isDuplicate = true;
        }
      }

      return !isDuplicate;
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
