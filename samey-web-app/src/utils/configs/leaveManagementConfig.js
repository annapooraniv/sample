export default {
  view: "tabular_view",
  collectionName: "Leave Permission",
  defaultTab: "leavePermission",
  tabPermissions: {
    leavePermission: ["Employee", "Manager", "Administrator"],
    leaveReq: ["Manager", "Admin", "Administrator"],
    leaveSetting: ["Employee", "Manager", "Admin", "Administrator"],
  },
  tabs: [
    {
      key: "leavePermission",
      name: "Leave Request",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      rolesUrl: "/roles",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowAdd: true,
      allowEdit: false,
      allowGen: false,
      allowFilter: false,
      allowRoleFilter: false,
      showScanPrompt: false,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/leaveRequest",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "id",
            "requestedBy.employeeId",
            "requestedBy.assignedUser.first_name",
            "requestedBy.assignedUser.tenant",
            "requestedBy",
            "leaveType",
            "date_created",
            "fromDate",
            "toDate",
            "halfDay",
            "reason",
            "status",
            "tenant.tenantId",
            "tenant.tenantName",
          ],
          filter: {
            status: {
              _neq: "archived",
            },
            // "filter[_and][0][_and][0][requestedBy][employeeId][_icontains]":
            //   null,
          },
          sort: ["-status"],
          searchFilters: {
            numeric: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
            string: [
              `filter[_and][0][_or][0][employeeId][assignedUser][first_name][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][attendance][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][mode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_and][5][reason][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_and][6][leaveType][_eq]=%SEARCH_QUERY%`,
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
        edit: [],
        delete: ["Employee", "Manager", "Administrator"],
        add: ["Employee", "Manager", "Administrator"],
        incognitoToggle: [],
      },
      filterOptions: [
        {
          label: "first_name",
          value:
            "filter[_and][0][_and][0][employeeId][assignedUser][first_name][_eq]=",
        },
        // {
        //   label: "attendance",
        //   value: "filter[_and][0][_and][0][attendance][_icontains]=",
        // },
        // {
        //   label: "mode",
        //   value: "filter[_and][0][_and][0][mode][_icontains]=",
        // },

        {
          label: "Status",
          value: "filter[_and][0][_and][0][status][_eq]=",
        },
        {
          label: "reason",
          value: "filter[_and][0][_and][0][reason][_icontains]=",
        },
        // {
        //   label: "Tenant Name",
        //   value: "filter[_and][0][_and][0][tenant][tenantName][_icontains]=",
        // },
        {
          label: "Leave Type",
          value: "filter[_and][0][_and][0][leaveType][_eq]=",
        },
        {
          label: "Half Day",
          value: "filter[_and][0][_and][0][halfDay][_eq]=",
        },
      ],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      editApi: {
        endpoint: "/items/leaveRequest",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/items/leaveRequest",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/leaveRequest",
        method: "POST",
      },
      // editDialog: {
      //   props: {
      //     showDialog: Boolean,
      //     currentTabConfig: Object,
      //     isMultiEdit: Boolean,
      //     form: Object,
      //   },
      //   title: {
      //     multiple: "Edit Leave Settings",
      //     single: "Edit Leave Settings",
      //   },
      //   headerFields: [],
      //   fields: {
      //     single: [
      //       {
      //         key: "from",
      //         label: "Leave Start",
      //         type: "date",
      //         editable: true,
      //         dotFormat: false,
      //         mandatory: true,
      //       },
      //       {
      //         key: "to",
      //         label: "Leave End",
      //         type: "date",
      //         editable: true,
      //         dotFormat: false,
      //         mandatory: true,
      //       },
      //       {
      //         key: "reason",
      //         label: "Reason",
      //         type: "textarea",
      //         editable: true,
      //         dotFormat: false,
      //         mandatory: true,
      //       },
      //       {
      //         key: "leaveType",
      //         label: "Leave Type",
      //         type: "select",
      //         options: [
      //           { value: "sickleave", label: "Sick Leave" },
      //           { value: "casualleave", label: "Casual Leave" },
      //           { value: "privilegedleave", label: "Privileged Leave" },
      //           { value: "paid", label: "Paid" },
      //           { value: "unpaid", label: "UnPaid" },
      //         ],
      //         editable: true,
      //         singleSelect: true,
      //       },
      //       {
      //         key: "halfDay",
      //         label: "Half Day",
      //         type: "boolean",
      //         editable: true,
      //       },
      //       // {
      //       //   commenkey: "multiInputFields",
      //       //   key: "tenantName",
      //       //   label: "Tenant Name",
      //       //   type: "multiInput",
      //       //   endpoint: "/items/tenant",
      //       //   itemMethod: "GET",
      //       //   editable: false,
      //       //   displayField: "tenantName",
      //       //   valueField: "tenantId",
      //       //   option: 1,
      //       // },
      //     ],
      //     multiple: [
      //       {
      //         key: "from",
      //         label: "Leave Start",
      //         type: "date",
      //         editable: true,
      //         dotFormat: false,
      //       },
      //       {
      //         key: "to",
      //         label: "Leave End",
      //         type: "date",
      //         editable: true,
      //         dotFormat: false,
      //       },
      //       {
      //         key: "reason",
      //         label: "reason",
      //         type: "textarea", // Changed to textarea for better input
      //         placeholder: "Enter reason for leave",
      //         mandatoryField: true, // Make it mandatory if needed
      //       },
      //       {
      //         key: "leaveType",
      //         label: "Leave Type",
      //         type: "select",
      //         options: [
      //           { value: "sickleave", label: "Sick Leave" },
      //           { value: "casualleave", label: "Casual Leave" },
      //           { value: "privilegedleave", label: "Privileged Leave" },
      //           { value: "paid", label: "Paid" },
      //           { value: "unpaid", label: "UnPaid" },
      //         ],
      //         editable: true,
      //         singleSelect: true,
      //       },
      //       {
      //         key: "halfDay",
      //         label: "Half Day",
      //         type: "boolean",
      //         editable: true,
      //       },
      //     ],
      //   },
      //   advance: [],
      //   tabs: [
      //     {
      //       key: "basic",
      //       label: "Basic Settings",
      //       Enabled: false,
      //     },
      //     {
      //       key: "advanced",
      //       label: "Advanced Settings",
      //       Enabled: false,
      //     },
      //   ],
      // },
      addDialog: {
        title: "Leave Request",
        fields: [
          {
            key: "from",
            label: "Leave Start",
            type: "date",
          },
          {
            key: "to",
            label: "Leave End",
            type: "date",
          },
          // {
          //   key: "reason",
          //   label: "Reason",
          //   type: "textarea",
          //   placeholder: "Enter reason for leave",
          // },
          {
            key: "leaveType",
            label: "Leave Type",
            type: "dropdown",
            options: [
              { name: "sickLeave" },
              { name: "casualLeave" },
              { name: "privilegedLeave" },
              { name: "paid" },
              { name: "unpaid" },
              { name: "weekOff" },
            ],
          },
          {
            key: "halfDay",
            label: "Half Day",
            type: "boolean",
          },
        ],
      },

      export: {
        csv: {
          fileName: "LeaveRequest",
        },
        pdf: {
          fileName: "LeaveRequest",
          title: "LeaveRequest",
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
      key: "leaveReq",
      name: "Leave Permission",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      rolesUrl: "/roles",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowAdd: false,
      allowEdit: false,
      allowGen: false,
      allowFilter: false,
      allowRoleFilter: false,
      showScanPrompt: false,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/leaveRequest",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "id",
            "requestedBy.assignedUser.first_name",
            "requestedBy.id",
            "requestedBy",
            "leaveType",
            "date_created",
            "fromDate",
            "toDate",
            "reason",
            "status",
            "tenant.tenantId",
            "tenant.tenantName",
          ],
          filter: {
            status: {
              _neq: "archived",
            },
            "filter[_and][0][_and][0][requestedBy][employeeId][_icontains]":
              null,
          },
          sort: ["-status"],
          searchFilters: {
            numeric: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
            string: [
              `filter[_and][0][_or][0][employeeId][assignedUser][first_name][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][attendance][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][mode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_and][5][reason][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_and][6][leaveType][_eq]=%SEARCH_QUERY%`,
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
        edit: [],
        delete: ["Manager", "Admin", "Administrator"],
        add: [],
        incognitoToggle: [],
      },
      filterOptions: [
        {
          label: "first_name",
          value:
            "filter[_and][0][_and][0][employeeId][assignedUser][first_name][_eq]=",
        },
        // {
        //   label: "attendance",
        //   value: "filter[_and][0][_and][0][attendance][_icontains]=",
        // },
        // {
        //   label: "mode",
        //   value: "filter[_and][0][_and][0][mode][_icontains]=",
        // },

        {
          label: "Status",
          value: "filter[_and][0][_and][0][status][_eq]=",
        },
        {
          label: "reason",
          value: "filter[_and][0][_and][0][reason][_icontains]=",
        },
        {
          label: "leaveType",
          value: "filter[_and][0][_and][0][leaveType][_eq]=",
        },
      ],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      editApi: {
        endpoint: "/items/leaveRequest",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/items/leaveRequest",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/leaveRequest",
        method: "POST",
      },
      editDialog: {
        props: {
          showDialog: Boolean,
          currentTabConfig: Object,
          isMultiEdit: Boolean,
          form: Object,
        },
        title: {
          multiple: "Edit Leave Settings",
          single: "Edit Leave Settings",
        },
        headerFields: [],
        fields: {
          single: [
            // {
            //   commenkey: "multiInputFields",
            //   key: "leaveType",
            //   label: "Leave Type",
            //   type: "multiInput",
            //   endpoint: "/items/leave",
            //   itemMethod: "GET",
            //   editable: true,
            //   dotFormat: false,
            //   displayField: "leaveType",
            //   valueField: "id",
            //   option: 1,
            // },
            {
              key: "from",
              label: "Leave Start",
              type: "date",
              editable: true,
              dotFormat: false,
              mandatory: true,
            },
            {
              key: "to",
              label: "Leave End",
              type: "date",
              editable: true,
              dotFormat: false,
              mandatory: true,
            },
            {
              key: "reason",
              label: "Reason",
              type: "textarea",
              placeholder: "Enter reason for leave",
              editable: true,
              dotFormat: false,
              mandatory: true,
            },
            {
              key: "leaveType",
              label: "Leave Type",
              type: "select",
              options: [
                { value: "sickleave", label: "Sick Leave" },
                { value: "casualleave", label: "Casual Leave" },
                { value: "privilegedleave", label: "Privileged Leave" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "UnPaid" },
              ],
              editable: true,
              singleSelect: true,
            },
          ],
          multiple: [
            // Fields for multi-edit if needed
            {
              key: "from",
              label: "Leave Start",
              type: "date",
              editable: true,
              dotFormat: false,
            },
            {
              key: "to",
              label: "Leave End",
              type: "date",
              editable: true,
              dotFormat: false,
            },
            {
              key: "reason",
              label: "Reason",
              type: "textarea",
              editable: true,
              dotFormat: false,
            },
            {
              key: "leaveType",
              label: "Leave Type",
              type: "select",
              options: [
                { value: "sickleave", label: "Sick Leave" },
                { value: "casualleave", label: "Casual Leave" },
                { value: "privilegedleave", label: "Privileged Leave" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "UnPaid" },
              ],
              editable: true,
              singleSelect: true,
            },
          ],
        },
        advance: [],
        tabs: [
          {
            key: "basic",
            label: "Basic Settings",
            Enabled: false,
          },
          {
            key: "advanced",
            label: "Advanced Settings",
            Enabled: false,
          },
        ],
      },
      addDialog: {
        title: "Leave Request",
        fields: [
          // {
          //   commenkey: "multiInputFields",
          //   key: "requestedBy",
          //   label: "Employee",
          //   type: "multiInput",
          //   endpoint: "/items/personalModule",
          //   itemMethod: "GET",
          //   dotFormat: false,
          //   displayField: "id.assignedUser.first_name",
          //   valueField: "id",
          //   option: 1,
          // },
          {
            key: "from",
            label: "leavestart",
            type: "date",
            dotFormat: false,
          },
          {
            key: "to",
            label: "leaveEnd",
            type: "date",
            dotFormat: false,
          },
          {
            key: "reason",
            label: "reason",
            type: "textarea",
            placeholder: "Enter reason for leave",
            mandatoryField: true,
          },
          // {
          //   commenkey: "multiInputFields",
          //   key: "tenantName",
          //   label: "Tenant Name",
          //   type: "multiInput",
          //   endpoint: "/items/tenant",
          //   itemMethod: "GET",
          //   option: 2,
          //   displayField: "tenantName",
          //   valueField: "tenantId",
          //   dotFormat: false,
          //   disabled: true,
          // },
        ],
      },

      export: {
        csv: {
          fileName: "LeaveRequest",
        },
        pdf: {
          fileName: "LeaveRequest",
          title: "LeaveRequest",
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
      key: "leaveSetting",
      name: "Leave Settings",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      rolesUrl: "/roles",
      bookmarkEnabled: true,
      allowDelete: true,
      allowScan: false,
      allowAdd: true,
      allowEdit: true,
      allowGen: false,
      allowFilter: true,
      allowRoleFilter: false,
      showScanPrompt: true,
      requiresScan: false,
      allowIncognitoMode: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/leaveSetting",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "iscarryForward",
            "sickLeave",
            "status",
            "tenant",
            "casualLeave",
            "privilegedLeave",
            "paid",
            "unpaid",
            "id",
          ],
          filter: {
            status: {
              _neq: "archived",
            },
            "filter[_and][0][_and][0][requestedBy][employeeId][_icontains]":
              null,
          },
          sort: ["-status"],
          searchFilters: {
            numeric: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
            string: [
              `filter[_and][0][_or][0][employeeId][assignedUser][first_name][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][attendance][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][mode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_and][5][reason][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_and][6][leaveType][_eq]=%SEARCH_QUERY%`,
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
        edit: ["Manager"],
        delete: ["Manager"],
        add: ["Employee", "Manager", "Admin", "Administrator"],
        incognitoToggle: [],
      },
      filterOptions: [
        {
          label: "first_name",
          value:
            "filter[_and][0][_and][0][employeeId][assignedUser][first_name][_eq]=",
        },
        {
          label: "attendance",
          value: "filter[_and][0][_and][0][attendance][_icontains]=",
        },
        {
          label: "mode",
          value: "filter[_and][0][_and][0][mode][_icontains]=",
        },

        {
          label: "Status",
          value: "filter[_and][0][_and][0][status][_eq]=",
        },
        {
          label: "reason",
          value: "filter[_and][0][_and][0][reason][_icontains]=",
        },
        {
          label: "leaveType",
          value: "filter[_and][0][_and][0][leaveType][_eq]=",
        },
      ],
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      editApi: {
        endpoint: "/items/leaveRequest",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/items/leaveRequest",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/leaveRequest",
        method: "POST",
      },
      editDialog: {
        props: {
          showDialog: Boolean,
          currentTabConfig: Object,
          isMultiEdit: Boolean,
          form: Object,
        },
        title: {
          multiple: "Edit Leave Settings",
          single: "Edit Leave Settings",
        },
        headerFields: [],
        fields: {
          single: [
            // {
            //   commenkey: "multiInputFields",
            //   key: "leaveType",
            //   label: "Leave Type",
            //   type: "multiInput",
            //   endpoint: "/items/leave",
            //   itemMethod: "GET",
            //   editable: true,
            //   dotFormat: false,
            //   displayField: "leaveType",
            //   valueField: "id",
            //   option: 1,
            // },
            {
              key: "from",
              label: "Leave Start",
              type: "date",
              editable: true,
              dotFormat: false,
              mandatory: true,
            },
            {
              key: "to",
              label: "Leave End",
              type: "date",
              editable: true,
              dotFormat: false,
              mandatory: true,
            },
            {
              key: "reason",
              label: "Reason",
              type: "textarea",
              placeholder: "Enter reason for leave",
              editable: true,
              dotFormat: false,
              mandatory: true,
            },
            {
              key: "leaveType",
              label: "Leave Type",
              type: "select",
              options: [
                { value: "sickleave", label: "Sick Leave" },
                { value: "casualleave", label: "Casual Leave" },
                { value: "privilegedleave", label: "Privileged Leave" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "UnPaid" },
              ],
              editable: true,
              singleSelect: true,
            },
          ],
          multiple: [
            // Fields for multi-edit if needed
            {
              key: "from",
              label: "Leave Start",
              type: "date",
              editable: true,
              dotFormat: false,
            },
            {
              key: "to",
              label: "Leave End",
              type: "date",
              editable: true,
              dotFormat: false,
            },
            {
              key: "reason",
              label: "Reason",
              type: "textarea",
              editable: true,
              dotFormat: false,
            },
            {
              key: "leaveType",
              label: "Leave Type",
              type: "select",
              options: [
                { value: "sickleave", label: "Sick Leave" },
                { value: "casualleave", label: "Casual Leave" },
                { value: "privilegedleave", label: "Privileged Leave" },
                { value: "paid", label: "Paid" },
                { value: "unpaid", label: "UnPaid" },
              ],
              editable: true,
              singleSelect: true,
            },
          ],
        },
        advance: [],
        tabs: [
          {
            key: "basic",
            label: "Basic Settings",
            Enabled: false,
          },
          {
            key: "advanced",
            label: "Advanced Settings",
            Enabled: false,
          },
        ],
      },
      addDialog: {
        title: "Leave Request",
        fields: [
          // {
          //   commenkey: "multiInputFields",
          //   key: "requestedBy",
          //   label: "Employee",
          //   type: "multiInput",
          //   endpoint: "/items/personalModule",
          //   itemMethod: "GET",
          //   dotFormat: false,
          //   displayField: "id.assignedUser.first_name",
          //   valueField: "id",
          //   option: 1,
          // },
          {
            key: "from",
            label: "leavestart",
            type: "date",
            dotFormat: false,
          },
          {
            key: "to",
            label: "leaveEnd",
            type: "date",
            dotFormat: false,
          },
          {
            key: "reason",
            label: "reason",
            type: "textarea",
            placeholder: "Enter reason for leave",
            mandatoryField: true,
          },
          // {
          //   commenkey: "multiInputFields",
          //   key: "tenantName",
          //   label: "Tenant Name",
          //   type: "multiInput",
          //   endpoint: "/items/tenant",
          //   itemMethod: "GET",
          //   option: 2,
          //   displayField: "tenantName",
          //   valueField: "tenantId",
          //   dotFormat: false,
          //   disabled: true,
          // },
        ],
      },

      export: {
        csv: {
          fileName: "LeaveRequest",
        },
        pdf: {
          fileName: "LeaveRequest",
          title: "LeaveRequest",
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
  ],
  tableContent: {
    headers: {
      leavePermission: [
        // { key: "employeeId", label: "EmployeeId" },
        // { key: "first_name", label: "EmployeeName" },
        {
          key: "appliedOn",
          label: "AppliedOn",
        },
        {
          key: "leaveType",
          label: "Leave Type",
        },
        {
          key: "from",
          label: "leavestart",
        },
        {
          key: "to",
          label: "leaveEnd",
        },
        {
          key: "reason",
          label: "reason",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "halfDay",
          label: "Half Day",
        },
      ],
      leaveReq: [
        {
          key: "employeeName",
          label: "Employee Name",
        },
        {
          key: "appliedOn",
          label: "Applied On",
        },
        {
          key: "leaveType",
          label: "Leave Type",
        },
        {
          key: "from",
          label: "Start Date",
        },
        {
          key: "to",
          label: "End Date",
        },
        {
          key: "reason",
          label: "Reason",
        },
        {
          key: "status",
          label: "Status",
        },
      ],
    },
    body: {
      leavePermission: [
        // {
        //   key: "employeeId",
        //   render: (device) => device.requestedBy.employeeId,
        // },
        // {
        //   key: "first_name",
        //   render: (device) => {
        //     return device.requestedBy.assignedUser.first_name || "N/A";
        //   },
        // },
        {
          key: "appliedOn",
          render: (device) => {
            const date = new Date(device.date_created);
            return date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          },
        },
        {
          key: "leaveType",
          render: (device) => device.leaveType,
        },

        {
          key: "from",
          render: (device) => device.fromDate,
        },
        {
          key: "to",
          render: (device) => device.toDate,
        },
        {
          key: "reason",
          render: (device) => device.reason,
        },
        {
          key: "status",
          render: (device) => {
            if (device.status === "pending") {
              return {
                text: "",
                dotClass: {
                  "status-dot": true,
                  pending: true,
                },
              };
            } else if (device.status === "approved") {
              return {
                text: "Approved",
                dotClass: {
                  "status-dot": true,
                  approved: true,
                },
              };
            } else if (device.status === "declined") {
              return {
                text: "Rejected",
                dotClass: {
                  "status-dot": true,
                  declined: true,
                },
              };
            }
            return {
              text: device.status,
              dotClass: {
                "status-dot": true,
                default: true,
              },
            };
          },
        },
        {
          key: "halfDay",
          render: (device) => (device.halfDay ? "Enable" : "Disable"),
        },

        // {
        // key: "appliedOn",
        // render: (device) => device.requestedDate,
        // },
        // {
        // key: "appliedOn",
        // render: (device) => device.requestedDate,
        // },
        // {
        // key: "tenantName",
        // render: (device) => (device.tenant ? device.tenant.tenantName : ""),
        // },
      ],
      leaveReq: [
        {
          key: "employeeName",
          render: (device) =>
            device.requestedBy?.assignedUser?.first_name || "N/A",
        },
        {
          key: "appliedOn",
          render: (device) => {
            const date = new Date(device.date_created);
            return date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });
          },
        },
        {
          key: "leaveType",
          render: (device) => device.leaveType,
        },
        {
          key: "from",
          render: (device) => device.fromDate,
        },
        {
          key: "to",
          render: (device) => device.toDate,
        },
        {
          key: "reason",
          render: (device) => device.reason,
        },
        {
          key: "status",
          render: (device) => {
            if (device.status === "pending") {
              return {
                text: device,
                dotClass: {
                  "status-dot": true,
                  pending: true,
                },
              };
            } else if (device.status === "approved") {
              return {
                text: "Approved",
                dotClass: {
                  "status-dot": true,
                  approved: true,
                },
              };
            } else if (device.status === "declined") {
              return {
                text: `Rejected${
                  device.rejectReason ? ` (${device.rejectReason})` : ""
                }`,
                dotClass: {
                  "status-dot": true,
                  declined: true,
                },
              };
            }
            return {
              text: device.status,
              dotClass: {
                "status-dot": true,
                default: true,
              },
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

      if (currentTab === "leavePermission") {
        queryParams.append(
          "filter[requestedBy][assignedUser][id][_eq]",
          userId
        );
      }
      // leave Request permission
      if (currentTab === "leaveReq") {
        if (userRole === "Manager") {
          queryParams.append(
            "filter[requestedBy][assignedBranch][branch_id][id][_eq]",
            assignedBranch
          );
          queryParams.append(
            "filter[requestedBy][assignedUser][role][name][_contains]",
            "Employee"
          );
        }
        if (userRole === "Admin") {
          queryParams.append("filter[tenant][tenantId][_eq]", userTenant);
          queryParams.append(
            "filter[requestedBy][assignedUser][role][name][_contains]",
            "Manager"
          );
        }
      }
      if (currentTab === "leaveSetting") {
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
    prepareAddPayload(addForm, currentTab, userTenant, personalModuleId) {
      if (currentTab === "leavePermission") {
        return {
          fromDate: addForm.from,
          toDate: addForm.to,
          reason: addForm.reason,
          leaveType: addForm.leaveType,
          halfDay: addForm.halfDay,
          status: "pending",
          tenant: userTenant,
          requestedBy: personalModuleId,
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
