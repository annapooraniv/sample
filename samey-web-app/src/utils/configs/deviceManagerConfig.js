export default {
  view: "tabular_view",
  collectionName: "Device Manager",
  defaultTab: "scanControllers",
  // get defaultTab() {
  //   const redirectSource = sessionStorage.getItem('redirectSource');
  //   // Handle redirects from dashboard
  //   if (redirectSource === 'doorsRedirect') {
  //     sessionStorage.removeItem('redirectSource');
  //     return 'DoorManagement';
  //   }

  // },
  tabPermissions: {
    scanControllers: ["esslAdmin", "Administrator", "Admin"],
    deviceControllers: ["esslAdmin", "Administrator", "Admin"],
    DoorManagement: ["Administrator", "Admin"],
  },
  tabs: [
    {
      key: "scanControllers",
      name: "UnApproved Devices",
      fetchMethod: "scanNetworkDevices",
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant&fields[]=role.name",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: false,
      allowCounters: true,
      allowDelete: true,
      allowScan: true,
      allowAdd: false,
      allowEdit: true,
      allowFilter: false,
      allowRoleFilter: true,
      allowIncognitoMode: false,
      showScanPrompt: true,
      initialFetch: true,
      requiresScan: false,
      checkboxCondition: (device) => device.status === "unApproved",
      scanPromptMessage: "Click the scan button to fetch controllers.",
      searchQuery: {
        endpoint: "/items/controllers",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "assignedDoor.doors_id.doorNumber",
            "assignedDoor.doors_id.doorName",
            "assignedDoor.doors_id.id",
            "id",
            "controllerIP",
            "serverIp",
            "controllerStatus",
            "controllerName",
            "controllerImage.id",
            "controllerImage.type",
            "controllerImage.title",
            "status",
            "controllerType",
            "assignedDoor.id",
            "doorMode",
            "timerMode",
            "interlockMode",
            "time_difference",
            "interval",
            "parkingMode",
            "attendanceMode",
            "sn",
            "antiPassbackMode",
            "tenant.tenantId",
            "tenant.tenantName",
            "branch.branchName",
            "branch.id",
            "date_created",
          ],
          status: { _neq: "archived" },
          sort: ["-status"],
          sortFields: {
            assignedDoor: "assignedDoor.doors_id.doorName",
            controllerIP: "controllerIP",
            serverIp: "serverIp",
            controllerName: "controllerName",
            doorMode: "doorMode",
            timerMode: "timerMode",
            interlockMode: "interlockMode",
            antiPassbackMode: "antiPassbackMode",
            status: "status",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][0][controllerType][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][assignedDoor][doors_id][doorNumber][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][controllerName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][assignedDoor][doors_id][doorName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][doorMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][6][timerMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][7][interlockMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][8][antiPassbackMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][9][serverIp][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][10][controllerIP][_icontains]=%SEARCH_QUERY%`,
            ],

            date: [`filter[_ and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      filterOptions: [
        {
          label: "Server IP",
          value: "filter[_and][0][_and][0][serverIp][_icontains]=",
        },
        {
          label: "Device IP",
          value: "filter[_and][0][_and][0][controllerIP][_icontains]=",
        },
        {
          label: "Device Name",
          value: "filter[_and][0][_and][0][controllerName][_eq]=",
        },
        {
          label: "Device Type",
          value: "filter[_and][0][_and][0][controllerType][_eq]=",
          validation: "validateInteger",
          errorMessage: "Device Type must be an integer",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
        {
          label: "Assigned Doors",
          value:
            "filter[_and][0][_and][0][assignedDoor][doors_id][doorName][_icontains]=",
        },
        {
          label: "Tenant Name",
          value: "filter[_and][0][_and][0][tenant][tenantName][_icontains]=",
        },
        {
          label: "Branch",
          value: "filter[_and][0][_and][0][branch][branchName][_icontains]=",
        },
        {
          label: "doorMode",
          value: "filter[_and][0][_and][0][doorMode][_eq]=",
        },
        {
          label: "timerMode",
          value: "filter[_and][0][_and][0][timerMode][_eq]=",
        },
        {
          label: "interlockMode",
          value: "filter[_and][0][_and][0][interlockMode][_eq]=",
        },
        {
          label: "antiPassbackMode",
          value: "filter[_and][0][_and][0][antiPassbackMode][_eq]=",
        },
      ],
      mandatoryFields: {
        controllerType: true,
      },
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["esslAdmin", "Admin", "Administrator"],
        delete: ["esslAdmin", "Administrator", "Admin"],
        add: ["esslAdmin", "Administrator"],
        incognitoToggle: [],
      },
      limitOptions: [1, 2, 5, 10, 50, 100, 500],
      defaultLimit: 50,
      deleteApi: {
        endpoint: "/items/controllers",
        method: "DELETE",
        payload: {
          keys: [],
        },
      },
      //edit the data
      editApi: {
        endpoint: "/items/controllers",
        method: "PATCH",
        singleEdit: {
          payload: {
            keys: [],
            data: {
              serverIp: "",
              controllerIP: "",
              controllerName: "",
              controllerType: 0,
              status: "",
              assignedDoor: {
                create: [],
                delete: [],
                update: [],
              },
            },
          },
        },
        multiEdit: {
          payload: {
            keys: [],
            data: {
              serverIp: "",
            },
          },
        },
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
          multiple: "Edit Multiple Devices",
          single: "Edit Devices Settings",
        },
        headerFields: [
          { key: "controllerName", label: "DeviceName", align: "left" },
          {
            key: "controllerType",
            label: "controllerType",
            align: "center",
            suffix: "D",
          },
          { key: "status", label: "status", align: "right" },
        ],
        fields: {
          multiple: [
            {
              key: "serverIp",
              label: "Server IP",
              type: "text",
              editable: true,
            },
          ],
          single: [
            { key: "serverIp", label: "Server IP", editable: true },
            {
              key: "controllerIP",
              label: "Device IP",
              editable: true,
            },
            {
              key: "controllerType",
              label: "Controller Type",
              type: "select",
              editable: true,
              options: [
                { value: "1", label: "1 D" },
                { value: "2", label: "2 D" },
                { value: "3", label: "3 D" },
                { value: "4", label: "4 D" },
              ],
              dotFormat: false,
            },
            {
              key: "controllerImage",
              label: "Profile",
              type: "file",
              editable: true,
            },

            {
              commenkey: "multiInputFields",
              key: "assignedDoor",
              label: "Assigned Doors",
              editable: true,
              itemLabel: "door",
              placeholder: "Select doors",
              searchPlaceholder: "Search doors...",
              multipledoors: true,
              type: "dropdown",
              endpoint:
                "/items/doors?fields[]=id&fields[]=doorNumber&fields[]=doorName",
              itemMethod: "GET",
              displayField: " doorNumber - doorName",
              valueField: "id",
              requiresTenantFilter: true,
            },
            {
              commenkey: "multiInputFields",
              key: "branch",
              label: "Branch",
              type: "multiInput",
              endpoint: "/items/branch",
              itemMethod: "GET",

              displayField: "branchName",
              option: 1,
              valueField: "id",
              dotFormat: false,
              requiresTenantFilter: true,
              roleAccess: {
                esslAdmin: false,
                Administrator: true,
                Admin: true,
                Manager: false,
                Employee: false,
                default: false,
              },
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
                esslAdmin: true,
                Administrator: true,
                Admin: false,
                Manager: false,
                Employee: false,
                default: false,
              },
            },
          ],
          advance: [
            {
              key: "doorMode",
              label: "Door Mode",
              editable: true,
              dotFormat: false,
              controllerType: [2, 3, 4],
              type: "select",
              options: [
                { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "timerMode",
              label: "Timer Mode",
              editable: true,
              dotFormat: false,
              controllerType: [2, 3, 4],
              type: "select",
              options: [
                { value: "DOTL10-RETURN0", label: "DOTL10-RETURN0" },
                { value: "DOTL15-RETURN0", label: "DOTL15-RETURN0" },
                { value: "DOTL20-RETURN20", label: "DOTL20-RETURN20" },
              ],
            },
            {
              key: "interlockMode",
              label: "Interlock Mode",
              editable: true,
              dotFormat: false,
              controllerType: [2, 3, 4],
              type: "select",
              options: [
                { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "antiPassbackMode",
              label: "AntiPassback Mode",
              editable: true,
              dotFormat: false,
              controllerType: [2, 3, 4],
              type: "select",
              options: [
                { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "parkingMode",
              label: "Parking Mode",
              editable: true,
              dotFormat: false,
              controllerType: [1],
              type: "input",
              options: [
                { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "attendanceMode",
              label: "Attendance Mode",
              editable: true,
              dotFormat: false,
              controllerType: [1],
              type: "select",
              options: [
                // { value: "0", label: "Entry Only Mode" },
                // { value: "1", label: "Entry & Exit Mode" },
                { value: "in", label: "In" },
                { value: "out", label: "Out" },
              ],
            },
            // {
            //   key: "time_difference",
            //   label: "Time Difference",
            //   editable: true,
            //   dotFormat: false,
            //   controllerType: [2, 3, 4],
            //   type: "text",
            // },
            // {
            //   key: "interval",
            //   label: "Interval",
            //   editable: true,
            //   dotFormat: false,
            //   controllerType: [2, 3, 4],
            //   type: "text",
            // },
            // {
            //   key: "sn",
            //   label: "Serial Number",
            //   editable: true,
            //   dotFormat: false,
            //   controllerType: [1, 2, 3, 4],
            //   type: "text",
            // }
          ],
          viewModes: [
            "timerMode",
            "interlockMode",
            "time_difference",
            "interval",
            "parkingMode",
            "attendanceMode",
            "sn",
            "antiPassbackMode",
          ],
        },
        tabs: [
          { key: "basic", label: "Basic Settings", showEditTabs: true },
          { key: "advanced", label: "Advanced Settings", showEditTabs: true },
        ],
      },
      addApi: {
        endpoint: "/items/controllers",
        method: "POST",
      },
      addDialog: {
        title: "Add Devices",
        fields: [
          {
            key: "controllerImage",
            label: "Device Image",
            type: "file",
            dotFormat: false,
          },
          { key: "", label: "", type: "", dotFormat: false },
          {
            key: "id",
            label: "Device ID",
            type: "text",
            editable: false,
            dotFormat: false,
          },
          // { key: "serverIp", label: "Server IP", type: "text",  dotFormat: true },
          // { key: "controllerIP", label: "Device IP", type: "text", dotFormat: true },
          {
            key: "controllerName",
            label: "Device Name",
            type: "text",
            dotFormat: false,
          },
          {
            key: "controllerType",
            label: "Device Type",
            type: "select",
            options: [
              { value: "1", label: "1 D" },
              { value: "2", label: "2 D" },
              { value: "3", label: "3 D" },
              { value: "4", label: "4 D" },
            ],
            dotFormat: false,
          },
          {
            key: "doorMode",
            label: "Door Mode",
            type: "select",
            options: [
              { value: "4Reader-4Switch", label: "4Reader-4Switch" },
              { value: "6Reader-2Switch", label: "6Reader-2Switch" },
              { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
            ],
            editable: true,
            singleSelect: true,
          },
          {
            key: "interlockMode",
            label: "Interlock Mode",
            type: "select",
            options: [
              { value: "4Reader-4Switch", label: "4Reader-4Switch" },
              { value: "6Reader-2Switch", label: "6Reader-2Switch" },
              { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
            ],
            editable: true,
            singleSelect: true,
          },
          {
            key: "timerMode",
            label: "Timer Mode",
            type: "select",
            options: [
              { value: "DOTL10-RETURN0", label: "DOTL10-RETURN0" },
              { value: "DOTL15-RETURN0", label: "DOTL15-RETURN0" },
              { value: "DOTL20-RETURN20", label: "DOTL20-RETURN20" },
            ],
            editable: true,
            singleSelect: true,
          },
          {
            key: "antiPassbackMode",
            label: "AntiPassback Mode",
            type: "select",
            options: [
              { value: "4Reader-4Switch", label: "4Reader-4Switch" },
              { value: "6Reader-2Switch", label: "6Reader-2Switch" },
              { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
            ],
            editable: true,
            singleSelect: true,
          },
          {
            key: "parkingMode",
            label: "Parking Mode",
            dotFormat: false,
            controllerType: [1],
            type: "select",
            options: [
              { value: "", label: "" },
              { value: "4Reader-4Switch", label: "4Reader-4Switch" },
              { value: "6Reader-2Switch", label: "6Reader-2Switch" },
              { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
            ],
          },
          {
            key: "attendanceMode",
            label: "Attendance Mode",

            dotFormat: false,
            controllerType: [1],
            type: "select",
            options: [
              // { value: "0", label: "Entry Only Mode" },
              // { value: "1", label: "Entry & Exit Mode" },
              { value: "in", label: "In" },
              { value: "out", label: "Out" },
            ],
          },

          {
            commenkey: "multiInputFields",
            key: "tenantName",
            label: "TenantName",

            itemLabel: "Tenant",
            placeholder: "Select tenant",
            searchPlaceholder: "Search tenant",
            multipledoors: true,
            type: "dropdown",
            endpoint: "/items/tenant",
            itemMethod: "GET",
            displayField: "tenantName",
            valueField: "tenantId",
            option: 1,
            // requiresTenantFilter: false,
            roleAccess: {
              Administrator: true,
              esslAdmin: true,
              Admin: false,
              Manager: false,
              Employee: false,
              default: false,
            },
          },
        ],
      },

      export: {
        csv: { fileName: "scan_controller" },
        pdf: { fileName: "scan_controller", title: "Scan Device Data" },
      },
      pagination: {
        itemsPerPage: 25,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Approved",
          condition: (device) => device.status === "approved",
        },
        failedCount: {
          label: "Unapproved",
          condition: (device) => device.status === "unApproved",
        },
        idleCount: {
          label: "Idle",
          // No condition means it will count all devices
        },
      },
    },
    {
      key: "deviceControllers",
      name: "Approved Devices",
      onTabSwitch: null,
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant&fields[]=role.name",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: true,
      allowScan: false,
      allowAdd: false,
      allowEdit: true,
      allowFilter: false,
      allowRoleFilter: true,
      allowIncognitoMode: false,
      showScanPrompt: true,
      requiresScan: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/controllers",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "assignedDoor.doors_id.doorNumber",
            "assignedDoor.doors_id.doorName",
            "assignedDoor.doors_id.id",
            "id",
            "controllerIP",
            "serverIp",
            "controllerStatus",
            "controllerName",
            "status",
            "controllerType",
            "controllerImage.id",
            "controllerImage.type",
            "controllerImage.title",
            "assignedDoor.id",
            "doorMode",
            "timerMode",
            "interlockMode",
            "time_difference",
            "interval",
            "parkingMode",
            "attendanceMode",
            "sn",
            "antiPassbackMode",
            "tenant.tenantId",
            "tenant.tenantName",
            "branch.branchName",
            "branch.id",
            "date_created",
          ],
          status: { _eq: "approved" },
          // sort: [_eq: "approved"],
          sortFields: {
            assignedDoor: "assignedDoor.doors_id.doorName",
            controllerIP: "controllerIP",
            serverIp: "serverIp",
            controllerName: "controllerName",
            doorMode: "doorMode",
            timerMode: "timerMode",
            interlockMode: "interlockMode",
            antiPassbackMode: "antiPassbackMode",
            status: "status",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][0][controllerType][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][assignedDoor][doors_id][doorNumber][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][controllerName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][assignedDoor][doors_id][doorName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][doorMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][6][timerMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][7][interlockMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][8][antiPassbackMode][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][9][serverIp][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][10][controllerIP][_icontains]=%SEARCH_QUERY%`,
            ],

            date: [`filter[_ and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      filterOptions: [
        {
          label: "Server IP",
          value: "filter[_and][0][_and][0][serverIp][_icontains]=",
        },
        {
          label: "Device IP",
          value: "filter[_and][0][_and][0][controllerIP][_icontains]=",
        },
        {
          label: "Device Name",
          value: "filter[_and][0][_and][0][controllerName][_eq]=",
        },
        {
          label: "Device Type",
          value: "filter[_and][0][_and][0][controllerType][_eq]=",
          validation: "validateInteger",
          errorMessage: "Device Type must be an integer",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
        {
          label: "Assigned Doors",
          value:
            "filter[_and][0][_and][0][assignedDoor][doors_id][doorName][_icontains]=",
        },
        {
          label: "Tenant Name",
          value: "filter[_and][0][_and][0][tenant][tenantName][_icontains]=",
        },
        {
          label: "Branch",
          value: "filter[_and][0][_and][0][branch][branchName][_icontains]=",
        },
        {
          label: "doorMode",
          value: "filter[_and][0][_and][0][doorMode][_eq]=",
        },
        {
          label: "timerMode",
          value: "filter[_and][0][_and][0][timerMode][_eq]=",
        },
        {
          label: "interlockMode",
          value: "filter[_and][0][_and][0][interlockMode][_eq]=",
        },
        {
          label: "antiPassbackMode",
          value: "filter[_and][0][_and][0][antiPassbackMode][_eq]=",
        },
      ],
      mandatoryFields: {
        controllerType: true,
      },
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      //delete data
      deleteApi: {
        endpoint: "/items/controllers",
        method: "DELETE",
        payload: {
          keys: [],
        },
      },
      //edit the data
      editApi: {
        endpoint: "/items/controllers",
        method: "PATCH",
        singleEdit: {
          payload: {
            keys: [],
            data: {
              serverIp: "",
              controllerIP: "",
              controllerName: "",
              controllerType: 0,
              status: "",
              assignedDoor: {
                create: [],
                delete: [],
                update: [],
              },
            },
          },
        },
        multiEdit: {
          payload: {
            keys: [],
            data: {
              serverIp: "",
            },
          },
        },
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
          multiple: "Edit Multiple Devices",

          single: "Edit Devices Settings",
        },
        headerFields: [
          { key: "controllerName", label: "controllerName", align: "left" },
          {
            key: "controllerType",
            label: "controllerType",
            align: "center",
            suffix: "D",
          },
          { key: "status", label: "status", align: "right" },
        ],
        fields: {
          multiple: [
            {
              key: "serverIp",
              label: "Server IP",
              type: "text",
              editable: true,
              dotFormat: true,
            },
          ],
          single: [
            {
              key: "serverIp",
              label: "Server IP",
              editable: true,
              dotFormat: true,
            },
            {
              key: "controllerIP",
              label: "Device IP",
              editable: true,
              dotFormat: true,
            },
            {
              key: "controllerType",
              label: "Device Type",
              type: "select",
              editable: true,
              options: [
                { value: "1", label: "1 D" },
                { value: "2", label: "2 D" },
                { value: "3", label: "3 D" },
                { value: "4", label: "4 D" },
              ],
              dotFormat: false,
            },
            {
              key: "controllerImage",
              label: "Profile",
              type: "file",
              editable: true,
            },
            {
              commenkey: "multiInputFields",
              key: "assignedDoor",
              label: "Assigned Doors",
              editable: true,
              dotFormat: false,
              itemLabel: "door",
              placeholder: "Select doors",
              searchPlaceholder: "Search doors...",
              multipledoors: true,
              type: "dropdown",
              endpoint:
                "/items/doors?fields[]=id&fields[]=doorNumber&fields[]=doorName",
              itemMethod: "GET",
              displayField: "doorNumber - doorName",
              valueField: "id",
              requiresTenantFilter: true,
            },
            {
              commenkey: "multiInputFields",
              key: "branch",
              label: "Branch",
              type: "multiInput",
              endpoint: "/items/branch",
              itemMethod: "GET",

              displayField: "branchName",
              option: 1,
              valueField: "id",
              dotFormat: false,
              requiresTenantFilter: true,
              roleAccess: {
                esslAdmin: false,
                Administrator: true,
                Admin: true,
                Manager: false,
                Employee: false,
                default: false,
              },
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
                esslAdmin: true,
                Administrator: true,
                Admin: false,
                Manager: false,
                Employee: false,
                default: false,
              },
            },
          ],
          advance: [
            {
              key: "doorMode",
              label: "Door Mode",
              editable: true,
              dotFormat: false,
              type: "select",
              options: [
                { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "timerMode",
              label: "Timer Mode",
              editable: true,
              dotFormat: false,
              type: "select",
              options: [
                { value: "DOTL10-RETURN0", label: "DOTL10-RETURN0" },
                { value: "DOTL15-RETURN0", label: "DOTL15-RETURN0" },
                { value: "DOTL20-RETURN20", label: "DOTL20-RETURN20" },
              ],
            },
            {
              key: "interlockMode",
              label: "Interlock Mode",
              editable: true,
              dotFormat: false,
              type: "select",
              options: [
                { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "antiPassbackMode",
              label: "AntiPassback Mode",
              editable: true,
              dotFormat: false,
              type: "select",
              options: [
                { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "parkingMode",
              label: "Parking Mode",
              editable: true,
              dotFormat: false,
              type: "select",
              options: [
                // { value: "4Reader-4Switch", label: "4Reader-4Switch" },
                // { value: "6Reader-2Switch", label: "6Reader-2Switch" },
                // { value: "$t:4Reader-4Switch", label: "4Reader-4Switch" },
              ],
            },
            {
              key: "attendanceMode",
              label: "Attendance Mode",
              editable: true,
              dotFormat: false,

              type: "select",
              options: [
                { value: "0", label: "Entry Only Mode" },
                { value: "1", label: "Entry & Exit Mode" },
              ],
            },
          ],
          viewModes: [
            "timerMode",
            "interlockMode",
            "time_difference",
            "interval",
            "parkingMode",
            "attendanceMode",
            "sn",
            "antiPassbackMode",
          ],
        },
        tabs: [
          { key: "basic", label: "Basic Settings" },
          { key: "advanced", label: "Advanced Settings" },
        ],
      },
      //create the data
      addApi: {
        endpoint: "/items/controllers",
        method: "POST",
        payload: {
          controllerName: "",
          controllerType: 0,
          serverIp: "",
          controllerIP: "",
          assignedDoor: {
            create: [],
            delete: [],
            update: [],
          },
        },
      },
      addDialog: {
        title: "Add Devices",
        fields: [],
      },

      export: {
        csv: { fileName: "device_controller" },
        pdf: { fileName: "device_controller", title: "Device Device Data" },
      },
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["esslAdmin", "Admin", "Administrator"],
        delete: ["esslAdmin", "Administrator", "Admin"],
        add: [],
        incognitoToggle: [],
      },
      pagination: {
        itemsPerPage: 50,
        totalItems: 0,
      },
      counters: {
        activeCount: {
          label: "Approved",
          condition: (device) => device.status === "approved",
        },
        failedCount: {
          label: "UnApproved",
          condition: (device) => device.status === "unApproved",
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
      key: "DoorManagement",
      name: "Door Management",
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant&fields[]=role.name",
      bookmarkUrl: "/items/bookmark",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: false,
      allowScan: false,
      allowAdd: true,
      allowEdit: true,
      allowFilter: false,
      allowRoleFilter: false,
      allowIncognitoMode: false,
      showScanPrompt: true,
      requiresScan: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/doors",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "id",
            "doorNumber",
            "doorName",
            "assignedDepts",
            "status",
            "doorType",
            "accesslevels.accesslevels_id.id",
            "assignedDepts.department_id.departmentName",
            "assignedDepts.department_id.id",
            "assignedDepartment.department_id.departmentId",
            "accesslevels.accesslevels_id.accessLevelName",
            "assignedDepts.id",
            "assignedAccessLevels.id",
            "tenant.tenantId",
            "tenant.tenantName",
            "branch.branchName",
            "branch.branchId",
            "branch.id",
            "date_created",
          ],
          filter: {
            status: { _neq: "archived" },
          },
          sort: ["-date_created"],
          sortFields: {
            doorNumber: "doorNumber",
            doorName: "doorName",
            doorType: "doorType",
            departmentName: "assignedDepts.department_id.departmentName",
            accessLevels: "accesslevels.accesslevels_id.accessLevelName",
            status: "status",
            tenantName: "tenant.tenantName",
            branchName: "branch.branchName",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][0][doorNumber][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][doorName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][assignedDepts][department_id][departmentName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][5][accesslevels][accesslevels_id][accessLevelName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][branch][branchName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][4][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][6][doorType][_eq]=%SEARCH_QUERY%`,
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
          label: "Door Number",
          value: "filter[_and][0][_and][0][doorNumber][_eq]=",
          validation: "validateInteger",
          errorMessage: "Door Number must be an integer",
        },
        {
          label: "Door Name",
          value: "filter[_and][0][_and][0][doorName][_icontains]=",
        },
        {
          label: "doorType",
          value: "filter[_and][0][_and][0][doorType][_icontains]=",
        },
        {
          label: "Assigned Department",
          value:
            "filter[_and][0][_and][0][assignedDepts][department_id][departmentName][_icontains]=",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
        {
          label: "Access Level",
          value:
            "filter[_and][0][_and][0][accesslevels][accesslevels_id][accessLevelName][_icontains]=",
        },
        {
          label: "Tenant Name",
          value: "filter[_and][0][_and][0][tenant][tenantName][_icontains]=",
        },
        {
          label: "Branch",
          value: "filter[_and][0][_and][0][branch][branchName][_icontains]=",
        },
      ],
      mandatoryFields: {
        doorName: true,
      },
      userRoleUrl: "/users/me?fields[]=id&fields[]=role.name&fields[]=tenant",
      permissions: {
        edit: ["Administrator", "Admin"],
        delete: ["Administrator"],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      form: {
        status: "",
        doorNumber: "",
        doorName: "",
        assignedDepts: "",
        id: "",
        accessLevel: [],
        assignedDepartment: [],
      },
      limitOptions: [50, 100, 500],
      defaultLimit: 50,
      editApi: {
        endpoint: "/items/doors",
        method: "PATCH",
      },
      deleteApi: {
        endpoint: "/items/doors",
        method: "DELETE",
      },

      addApi: {
        endpoint: "/items/doors",
        method: "POST",
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
          multiple: "Edit Multiple Doors Settings ",
          single: "Edit Doors Settings",
        },
        headerFields: [],
        fields: {
          multiple: [
            {
              commenkey: "multiInputFields",
              key: "assignedDepartment",
              label: "Assigned Department",
              type: "multiInput",
              endpoint: "/items/department",
              itemMethod: "GET",
              editable: true,
              displayField: "departmentName",
              valueField: "departmentId",
              editable: true,
              dotFormat: false,
              option: 1,
              requiresTenantFilter: true,
            },
          ],
          single: [
            {
              key: "doorName",
              label: "Door Name",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            {
              key: "doorType",
              label: "Door Type",
              type: "select",
              options: [
                { value: "mainDoor", label: "Main Door" },
                { value: "subDoor", label: "Sub Door" },
              ],
              editable: true,
              singleSelect: true,
            },
            {
              commenkey: "multiInputFields",
              key: "assignedDepartment",
              label: "Assign Existing Department",
              type: "multiInput",
              endpoint: "/items/department",
              itemMethod: "GET",
              editable: true,
              dotFormat: false,
              option: 1,
              displayField: "departmentName",
              valueField: "departmentId",
              requiresTenantFilter: true,
              roleAccess: {
                Administrator: true,
                Admin: true,
                Manager: false,
                Employee: false,
                default: true,
              },
            },
            {
              commenkey: "multiInputFields",
              key: "branch",
              label: "Branch",
              type: "multiInput",
              endpoint: "/items/branch",
              itemMethod: "GET",
              editable: true,
              displayField: "branchName",
              option: 1,
              valueField: "id",
              dotFormat: false,
              requiresTenantFilter: true,
              roleAccess: {
                Administrator: true,
                Admin: true,
                Manager: false,
                Employee: false,
                default: true,
              },
            },
          ],
        },
        tabs: [],
      },
      addDialog: {
        title: "Add Doors",
        fields: [
          {
            key: "doorName",
            label: "Door Name",
            type: "text",
            editable: true,
            dotFormat: false,
          },
          {
            key: "doorType",
            label: "Door Type",
            type: "select",
            options: [
              { value: "mainDoor", label: "Main Door" },
              { value: "subDoor", label: "Sub Door" },
            ],
            editable: true,
            singleSelect: true,
          },
          {
            commenkey: "multiInputFields",
            key: "assignedDepartment",
            label: "Assigned Department",
            type: "multiInput",
            endpoint: "/items/department",
            itemMethod: "GET",
            option: 1,
            displayField: "departmentName",
            valueField: "departmentId",
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
          {
            commenkey: "multiInputFields",
            key: "branch",
            label: "Branch",
            type: "multiInput",
            endpoint: "/items/branch",
            itemMethod: "GET",
            editable: true,
            displayField: "branchName",
            option: 1,
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
      //access view
      accessLevelApi: {
        endpoint: "/items/accesslevels",
        params: {
          fields: [
            "id",
            "accessLevelNumber",
            "tenant.tenantName",
            "wrkHrs.workDays",
            "holidays",
            "_24hrs",
            "maxWorkHours",
            "workingHours",
            "assignedDoors.doors_id.doorName",
            "assignedDoors.doors_id.doorNumber",
          ],
        },
      },
      // view access value show
      accessLevel: [
        {
          label: "ID",
          key: "accessLevelNumber",
          render: (device) => device.accessLevelNumber || " ",
        },
        {
          label: "Tenant",
          key: "tenantName",
          render: (device) =>
            device.tenant ? device.tenant.tenantName : "No Tenant",
        },
        {
          label: "Shift",
          key: "workDays",
          render: (device) => (device.wrkHrs && device.wrkHrs.workDays) || " ",
        },
        {
          label: "_24hrs",
          key: "_24hrs",
          render: (device) => device._24hrs || " ",
        },
        {
          label: "holidays",
          key: "holidays",
          render: (device) => device.holidays || " ",
        },
        {
          label: "maxWorkHours",
          key: "maxWorkHours",
          render: (device) => device.maxWorkHours || " ",
        },
        {
          label: "workingHours",
          key: "workingHours",
          render: (device) => device.workingHours || " ",
        },
        {
          label: "DoorsNumber",
          key: "assignedDoors",
          render: (device) =>
            Array.isArray(device.assignedDoors)
              ? device.assignedDoors
                  .map(
                    (door) => (door.doors_id && door.doors_id.doorNumber) || " "
                  )
                  .join(", ")
              : " ",
        },
        {
          label: "DoorsName",
          key: "assignedDoors",
          render: (device) =>
            Array.isArray(device.assignedDoors)
              ? device.assignedDoors
                  .map(
                    (door) => (door.doors_id && door.doors_id.doorName) || " "
                  )
                  .join(", ")
              : " ",
        },
      ],
      export: {
        csv: { fileName: "DoorManagement" },
        pdf: {
          fileName: "DoorManagement",
          title: "DoorManagement Data",
        },
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
      scanControllers: [
        { key: "controllerStatus", label: "DeviceStatus" },
        { key: "status", label: "Status" },
        { key: "controllerImage", label: "DeviceImage" },
        { key: "serverIp", label: "Server IP" },
        { key: "controllerIP", label: "Device IP" },
        { key: "controllerName", label: "Device Name" },
        { key: "controllerType", label: "Device Type" },
        { key: "assignedDoor", label: "Assigned Doors" },
        { key: "doorMode", label: "Door Mode" },
        { key: "timerMode", label: "Timer Mode" },
        { key: "interlockMode", label: "Interlock Mode" },
        { key: "antiPassbackMode", label: "AntiPassback Mode" },
        { key: "tenantName", label: "Tenant Name" },
        {
          key: "branchName",
          label: "Branch Name",
          customRender: (userRole) => ({
            text: "Branch",
            showRedirect: ["Administrator", "Admin"].includes(userRole),
          }),
        },
      ],
      deviceControllers: [
        { key: "controllerStatus", label: "DeviceStatus" },
        { key: "status", label: "Status" },
        { key: "controllerImage", label: "DeviceImage" },
        { key: "serverIp", label: "Server IP" },
        { key: "controllerIP", label: "Device IP" },
        { key: "controllerName", label: "Device Name" },
        { key: "controllerType", label: "Device Type" },
        { key: "assignedDoor", label: "Assigned Doors" },
        { key: "doorMode", label: "Door Mode" },
        { key: "timerMode", label: "Timer Mode" },
        { key: "interlockMode", label: "Interlock Mode" },
        { key: "antiPassbackMode", label: "AntiPassback Mode" },
        { key: "parkingMode", label: "parking Mode" },
        { key: "attendanceMode", label: "attendance Mode" },
        { key: "tenantName", label: "Tenant Name" },
        {
          key: "branchName",
          label: "Branch Name",
          customRender: (userRole) => ({
            text: "Branch",
            showRedirect: ["Administrator", "Admin"].includes(userRole),
          }),
        },
      ],
      DoorManagement: [
        { key: "status", label: "Status" },
        { key: "doorNumber", label: "Door Number" },
        { key: "doorName", label: "Door Name" },
        { key: "doorType", label: "Door Type" },
        { key: "departmentName", label: "Assigned Department" },
        { key: "accesslevels", label: "Access Levels" },
        { key: "tenantName", label: "Tenant Name" },
        {
          key: "branchName",
          label: "Branch Name",
          customRender: (userRole) => ({
            text: "Branch",
            showRedirect: ["Administrator", "Admin"].includes(userRole),
          }),
        },
      ],
    },
    body: {
      scanControllers: [
        {
          key: "controllerStatus",

          render: (device) => device.controllerStatus || "waiting",
        },
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "approved",
              unapproved: device.status === "unApproved",
            },
          }),
        },
        {
          key: "controllerImage",
          render: (device) => {
            return device && device.controllerImage && device.controllerImage.id
              ? `/assets/${device.controllerImage.id}?key=system-large-cover`
              : "";
          },
        },
        {
          key: "serverIp",
          render: (device) => device.serverIp || "",
        },
        {
          key: "controllerIP",
          render: (device) => device.controllerIP || "",
        },
        {
          key: "controllerName",
          render: (device) => device.controllerName || "",
        },
        {
          key: "controllerType",
          render: (device) =>
            device.controllerType ? `${device.controllerType} D` : "",
        },
        {
          key: "items",
          render: (device) => {
            const items = Array.isArray(device.assignedDoor)
              ? device.assignedDoor
              : [];
            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((door) => {
                  if (door && door.doors_id) {
                    return {
                      name: ` Door${door.doors_id.doorNumber || ""} - ${
                        door.doors_id.doorName || ""
                      }`,
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
        },
        {
          key: "doorMode",
          render: (device) => device.doorMode || "",
        },
        {
          key: "timerMode",
          render: (device) => device.timerMode || "",
        },
        {
          key: "interlockMode",
          render: (device) => device.interlockMode || "",
        },
        {
          key: "antiPassbackMode",
          render: (device) => device.antiPassbackMode || "",
        },
        {
          key: "tenantName",
          render: (device) => (device.tenant ? device.tenant.tenantName : ""),
        },
        {
          key: "branchName",
          render: (device) => (device.branch ? device.branch.branchName : ""),
        },
      ],
      deviceControllers: [
        {
          key: "controllerStatus",

          render: (device) => device.controllerStatus || "waiting",
        },
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "approved",
              unapproved: device.status === "unApproved",
            },
          }),
        },
        {
          key: "controllerImage",
          render: (device) => {
            return device && device.controllerImage && device.controllerImage.id
              ? `/assets/${device.controllerImage.id}?key=system-large-cover`
              : "";
          },
        },
        {
          key: "serverIp",
          render: (device) => device.serverIp || "",
        },
        {
          key: "controllerIP",
          render: (device) => device.controllerIP || "",
        },
        {
          key: "controllerName",
          render: (device) => device.controllerName || "",
        },
        {
          key: "controllerType",
          render: (device) =>
            device.controllerType ? `${device.controllerType} D` : "",
        },
        {
          key: "items",
          render: (device) => {
            const items = Array.isArray(device.assignedDoor)
              ? device.assignedDoor
              : [];
            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((door) => {
                  if (door && door.doors_id) {
                    return {
                      name: ` Door${door.doors_id.doorNumber || ""} - ${
                        door.doors_id.doorName || ""
                      }`,
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
        },
        {
          key: "doorMode",
          render: (device) => device.doorMode || "",
        },
        {
          key: "timerMode",
          render: (device) => device.timerMode || "",
        },
        {
          key: "interlockMode",
          render: (device) => device.interlockMode || "",
        },
        {
          key: "antiPassbackMode",
          render: (device) => device.antiPassbackMode || "",
        },
        {
          key: "parkingMode",
          render: (device) => device.parkingMode || "",
        },
        {
          key: "attendanceMode",
          render: (device) => device.attendanceMode || "",
        },
        {
          key: "tenantName",
          render: (device) => (device.tenant ? device.tenant.tenantName : ""),
        },
        {
          key: "branchName",
          render: (device) => (device.branch ? device.branch.branchName : ""),
        },
      ],
      DoorManagement: [
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
          key: "doorNumber",
          render: (device) => device.doorNumber || "",
        },
        {
          key: "doorName",
          render: (device) => device.doorName || "",
        },
        {
          key: "doorType",
          render: (device) =>
            device.doorType === "mainDoor" ? "mainDoor" : "subDoor",
        },
        {
          key: "items",
          name: "department",
          render: (device) => {
            const items = Array.isArray(device.assignedDepts)
              ? device.assignedDepts
              : [];
            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((dept) => {
                  if (dept && dept.department_id) {
                    return {
                      name: dept.department_id.departmentName || "",
                    };
                  }
                  return null;
                })
                .filter(Boolean),
            };
          },
        },
        {
          key: "items",
          name: "Access Levels",
          render: (device) => {
            const items = Array.isArray(device.accesslevels)
              ? device.accesslevels
              : [];
            return {
              text: "View",
              click: "toggleItemList",
              list: items
                .map((level) => {
                  if (level && level.accesslevels_id) {
                    return {
                      name: `${level.accesslevels_id.accessLevelName || ""}`,
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
          key: "tenantName",
          render: (device) => (device.tenant ? device.tenant.tenantName : ""),
        },
        {
          key: "branchName",
          render: (device) => (device.branch ? device.branch.branchName : ""),
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
      if (currentTab === "deviceControllers") {
        queryParams.append("filter[status][_eq]", "approved");
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
        alert("Please select at least one device to edit doors.");
        return;
      }

      let form = {};
      const fields = this.currentTabConfig.editDialog.fields.single;

      if (!isMultiEdit) {
        const device = selectedDevices[0];
        form.controllerType = device.controllerType?.toString() || "1";

        fields.forEach((field) => {
          if (field.key === "assignedDoor") {
            const deviceControllerType = parseInt(form.controllerType);
            form[field.key] = Array(deviceControllerType)
              .fill()
              .map((_, index) => {
                const door = device.assignedDoor && device.assignedDoor[index];

                if (door && door.doors_id) {
                  return {
                    id: door.doors_id.id,
                    doorNumber: door.doors_id.doorNumber,
                    doorName: door.doors_id.doorName,
                    displayText: `Door ${door.doors_id.doorNumber} - ${door.doors_id.doorName}`,
                  };
                } else {
                  return {
                    id: null,
                    doorNumber: "",
                    doorName: "",
                    displayText: `Select Door ${index + 1}`,
                  };
                }
              });
          } else if (field.key === "controllerImage") {
            const avatarId =
              device.controllerImage?.id || device.controllerImage;
            form.controllerImage = avatarId;

            this.avatarPreview = avatarId
              ? `/assets/${avatarId}?key=system-large-cover`
              : "";
          } else if (field.commenkey === "multiInputFields") {
            if (field.key === "assignedDepartment") {
              form[field.key] = (device.assignedDepts || [])
                .filter((dept) => dept && dept.department_id)
                .map((dept) => ({
                  [field.valueField]: dept.department_id?.id ?? "",
                  [field.displayField]:
                    dept.department_id?.departmentName ?? "",
                  assignedDepartment_id: dept.id ?? "",
                }));
            } else if (field.key === "accessLevel") {
              form[field.key] = (device.assignedAccessLevels || [])
                .filter((level) => level && level.accesslevels_id)
                .map((level) => ({
                  [field.valueField]: level.accesslevels_id?.id ?? "",
                  [field.displayField]:
                    level.accesslevels_id?.accessLevelName ?? "",
                  assignedAccessLevels_id: level.id ?? "",
                }));
            } else if (field.key === "tenantName") {
              form[field.key] = device.tenant
                ? [
                    {
                      [field.valueField]: device.tenant.tenantId || "",
                      [field.displayField]: device.tenant.tenantName || "",
                    },
                  ]
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
            }
          } else {
            form[field.key] = device[field.key] ?? "";
          }
        });

        // Store original assigned door data for comparison during edit
        form.originalassignedDoor = device.assignedDoor;

        // Handle controller type specific fields
        const deviceControllerType = parseInt(form.controllerType);
        if (deviceControllerType) {
          const allowedFields = {
            1: ["parkingMode", "attendanceMode"],
            2: ["doorMode", "timerMode", "interlockMode", "antiPassbackMode"],
            3: ["doorMode", "timerMode", "interlockMode", "antiPassbackMode"],
            4: ["doorMode", "timerMode", "interlockMode", "antiPassbackMode"],
          };

          const visibleFields = allowedFields[deviceControllerType] || [];

          if (this.currentTabConfig.editDialog?.fields?.advance) {
            // Filter advance fields based on controller type
            this.advanceFields =
              this.currentTabConfig.editDialog.fields.advance.filter((field) =>
                visibleFields.includes(field.key)
              );

            // Set initial values for visible advance fields
            this.advanceFields.forEach((field) => {
              form[field.key] = device[field.key] || "";
            });
          }
        } else {
          this.advanceFields = []; // Reset advance fields if no controller type
        }

        form.id = device.id;
      } else {
        // Handle multi-edit case
        form.ids = selectedDevices.map((device) => Number(device.id));
        this.advanceFields = [];
      }

      // Initialize filter and search states
      this.filteredAddItems = {};
      this.searchQueries = {};
      this.activeIndex = {};

      // Set up form states
      this.form = form;
      this.originalForm = JSON.parse(JSON.stringify(form));
      this.isMultiEdit = isMultiEdit;
      this.showDialog = true;
      this.addForm = form;

      // Initialize dropdowns and fetch items for edit fields
      fields.forEach((field) => {
        if (
          field.key === "assignedDoor" ||
          field.commenkey === "multiInputFields"
        ) {
          if (!this.filteredAddItems[field.key]) {
            this.filteredAddItems[field.key] = [];
          }
          this.addSearchQueries[field.key] = "";
          this.fetchEditItems(field);
        }
      });
    },
    prepareEditPayload(form, currentTab, userTenant, originalForm) {
      if (!Array.isArray(form.ids)) {
        if (
          currentTab === "deviceControllers" ||
          currentTab === "scanControllers"
        ) {
          const payload = {
            keys: [form.id],
            data: {},
          };

          // Fields to compare and add if changed
          const fieldMappings = {
            serverIp: "serverIp",
            controllerIP: "controllerIP",
            controllerName: "controllerName",
            avatar: "controllerImage",
            doorMode: "doorMode",
            timerMode: "timerMode",
            interlockMode: "interlockMode",
            antiPassbackMode: "antiPassbackMode",
            parkingMode: "parkingMode",
            attendanceMode: "attendanceMode",
            controllerType: "controllerType",
          };

          // Add changed fields to payload
          Object.entries(fieldMappings).forEach(([formKey, payloadKey]) => {
            if (form[formKey] !== originalForm[formKey]) {
              // Special handling for controllerType to ensure it's an integer
              if (formKey === "controllerType") {
                payload.data[payloadKey] = parseInt(form[formKey]);
              } else {
                payload.data[payloadKey] = form[formKey];
              }
            }
          });
          // Handle tenant
          const tenantId = form.tenantName?.[0]?.tenantId;
          const originalTenantId = originalForm.tenantName?.[0]?.tenantId;
          if (tenantId !== originalTenantId) {
            payload.data.tenant = tenantId || userTenant;
          }

          // Handle assignedDoor changes
          let assignedDoorChanged = false;

          if (form.assignedDoor && Array.isArray(form.assignedDoor)) {
            const originalDoors = form.originalassignedDoor || [];
            const newDoors = form.assignedDoor;

            payload.data.assignedDoor = {
              create: [],
              delete: [],
              update: [],
            };

            // Check for doors to create
            newDoors.forEach((door) => {
              if (
                door &&
                door.id &&
                !originalDoors.some(
                  (od) => od && od.doors_id && od.doors_id.id === door.id
                )
              ) {
                assignedDoorChanged = true;
                payload.data.assignedDoor.create.push({
                  controllers_id: form.id,
                  doors_id: { id: door.id },
                });
              }
            });

            // Check for doors to delete
            originalDoors.forEach((originalDoor) => {
              if (
                originalDoor &&
                originalDoor.doors_id &&
                originalDoor.doors_id.id &&
                !newDoors.some((nd) => nd.id === originalDoor.doors_id.id)
              ) {
                assignedDoorChanged = true;
                payload.data.assignedDoor.delete.push(originalDoor.id);
              }
            });
          }

          if (assignedDoorChanged) {
            payload.data.controllerStatus = "waiting";
            payload.data.status = form.assignedDoor?.some((door) => door?.id)
              ? "approved"
              : "unApproved";
          } else {
            delete payload.data.assignedDoor;
          }

          return Object.keys(payload.data).length ? payload : null;
        }
        // Door tab handling
        else if (currentTab === "DoorManagement") {
          const payload = {
            keys: [form.id],
            data: {
              doorNumber: form.doorNumber,
              doorName: form.doorName,
              doorType: form.doorType,
              status: "assigned",
              tenant: form.tenantName[0]?.tenantId || userTenant,
              branch: form.branch[0]?.id,
              assignedDepts: {
                create: [],
                update: [],
                delete: [],
              },
            },
          };

          // Handle assignedDepts
          if (form.assignedDepartment) {
            const originalDepartments = originalForm.assignedDepartment || [];
            const newDepartments = form.assignedDepartment;

            newDepartments.forEach((dept) => {
              if (
                !originalDepartments.some(
                  (od) => od.departmentId === dept.departmentId
                )
              ) {
                payload.data.assignedDepts.create.push({
                  doors_id: form.id,
                  department_id: { id: dept.id },
                });
              }
            });

            originalDepartments.forEach((dept) => {
              if (
                !newDepartments.some(
                  (nd) => nd.departmentId === dept.departmentId
                ) &&
                dept.assignedDepartment_id
              ) {
                payload.data.assignedDepts.delete.push(
                  dept.assignedDepartment_id
                );
              }
            });
          }

          return payload;
        }
      }
      // Multi-edit scenario
      else {
        // Multi-edit for controllers
        if (
          currentTab === "deviceControllers" ||
          currentTab === "scanControllers"
        ) {
          return {
            keys: form.ids,
            data: {
              serverIp: form.serverIp,
              tenant: userTenant,
            },
          };
        }
        // Multi-edit for door
        else if (currentTab === "DoorManagement") {
          const payload = {
            keys: form.ids,
            data: {
              tenant: userTenant,
              assignedAccessLevels: {
                create: [],
                update: [],
                delete: [],
              },
              assignedDepts: {
                create: [],
                update: [],
                delete: [],
              },
            },
          };

          // Handle assignedAccessLevels for multi-edit
          if (form.accessLevel && form.accessLevel.length > 0) {
            payload.data.assignedAccessLevels.create = form.accessLevel.map(
              (level) => ({
                doors_id: "+",
                accesslevels_id: { id: level.id },
              })
            );
          }

          // Handle assignedDepts for multi-edit
          if (form.assignedDepartment && form.assignedDepartment.length > 0) {
            payload.data.assignedDepts.create = form.assignedDepartment.map(
              (dept) => ({
                doors_id: "+",
                department_id: { id: dept.id },
              })
            );
          }

          return payload;
        }
      }
    },
    prepareAddPayload(addForm, currentTab, userTenant) {
      if (currentTab === "scanControllers") {
        return {
          id: addForm.id,
          controllerName: addForm.controllerName,
          serverIp: addForm.serverIp,
          controllerIP: addForm.controllerIP,
          controllerImage: addForm.avatar,
          tenant: addForm.tenantName[0]?.tenantId || userTenant,
          branch: addForm.branch[0]?.id,
          status: "unApproved",
          controllerType: addForm.controllerType,
          doorMode: addForm.doorMode,
          interlockMode: addForm.interlockMode,
          timerMode: addForm.timerMode,
          antiPassbackMode: addForm.antiPassbackMode,
          parkingMode: addForm.parkingMode,
          attendanceMode: addForm.attendanceMode,
        };
      }

      if (currentTab === "DoorManagement") {
        return {
          doorNumber: addForm.doorNumber,
          uniqueId: `${userTenant}-${addForm.doorNumber}`,
          doorName: addForm.doorName,
          tenant: addForm.tenantName[0]?.tenantId || userTenant,
          branch: addForm.branch[0]?.id,
          status: "assigned",
          doorType: addForm.doorType,
          assignedDepts: {
            create: addForm.assignedDepartment.map((dept) => ({
              doors_id: "+",
              department_id: { id: dept.id },
            })),
            update: [],
            delete: [],
          },
        };
      }
      return {};
    },
    getMultiInputs(form, key) {
      return form[key] || [];
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
    async validation(payload) {
      let isDuplicate = false;
      // Separate queries for doorName and doorNumber
      const doorNameUrl = `/items/doors?filter[doorName][_eq]=${payload.doorName}`;
      const doorNumberUrl = `/items/doors?filter[doorNumber][_eq]=${payload.doorNumber}`;

      try {
        const [doorNameResponse, doorNumberResponse] = await Promise.all([
          fetch(doorNameUrl),
          fetch(doorNumberUrl),
        ]);
        const existingDoorNameData = await doorNameResponse.json();
        const existingDoorNumberData = await doorNumberResponse.json();
        if (existingDoorNameData.data && existingDoorNameData.data.length > 0) {
          alert(`Door Name ${payload.doorName} already exists!`);
          isDuplicate = true;
        }
        if (
          existingDoorNumberData.data &&
          existingDoorNumberData.data.length > 0
        ) {
          alert(`Door Number ${payload.doorNumber} already exists!`);
          isDuplicate = true;
        }
      } catch (error) {
        console.error("Error fetching door data:", error);
      }
      return !isDuplicate;
    },
  },
};
