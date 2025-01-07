export default {
  view: "tabular_view",
  collectionName: "AccessLevel",
  defaultTab: "accessLevel",
  tabPermissions: {
    accessLevel: ["Administrator", "Admin"],
  },
  tabs: [
    {
      key: "accessLevel",
      name: "AccessLevel",
      onTabSwitch: null,
      fetchMethod: "fetchDevices",
      initialFetch: true,
      userIdUrl: "/users/me?fields[]=id&fields[]=tenant",
      bookmarkUrl: "/items/bookmark",
      rolesUrl: "/roles",
      bookmarkEnabled: true,
      allowCounters: true,
      allowDelete: false,
      allowScan: false,
      allowEdit: true,
      allowAdd: true,
      allowFilter: false,
      allowRoleFilter: false,
      allowIncognitoMode: false,
      showScanPrompt: true,
      requiresScan: false,
      checkboxCondition: () => true,
      searchQuery: {
        endpoint: "/items/accesslevels",
        method: "GET",
        requiresTenant: true,
        params: {
          fields: [
            "accessLevelName",
            "accessLevelNumber",
            "accessType",
            "status",
            "id",
            "wrkHrs.id",
            "wrkHrs.workDays",
            "tenant.tenantId",
            "tenant.tenantName",
            "assignedDoors.doors_id.doorNumber",
            "assignedDoors.doors_id.doorName",
            "assignedDoors.doors_id.id",
            "assignedDoors.id",
            "holidays",
            "_24hrs",
            "maxWorkHours",
            "workingHours",
            "date_created",
            "controllerStatus",
            "uniqueId",
          ],
          sort: ["-date_created"],
          sortFields: {
            accessLevelName: "accessLevelName",
            accessLevelNumber: "accessLevelNumber",
            assignedDoors: "assignedDoors.doors_id.doorName",
            holidays: "holidays",
            _24hrs: "_24hrs",
            workDays: "wrkHrs.workDays",
            status: "status",
            accessType: "accessType",
            workingHours: "workingHours",
            maxWorkHours: "maxWorkHours",
            tenantName: "tenant.tenantName",
          },
          searchFilters: {
            numeric: [
              `filter[_and][0][_or][0][accessLevelNumber][_eq]=%SEARCH_QUERY%`,
            ],
            string: [
              `filter[_and][0][_or][0][[accessLevelName]][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][1][status][_eq]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][2][assignedDoors][doors_id][doorName][_icontains]=%SEARCH_QUERY%`,
              `filter[_and][0][_or][3][tenant][tenantName][_icontains]=%SEARCH_QUERY%`,
            ],
            date: [`filter[_and][0][_or][0][id][_eq]=%SEARCH_QUERY%`],
          },
        },
      },
      deleteApi: {
        endpoint: "/items/accesslevels",
        method: "DELETE",
      },
      addApi: {
        endpoint: "/items/accesslevels",
        method: "POST",
      },
      addDialog: {
        title: "Add AccessLevels",
        fields: [
          {
            key: "accessLevelName",
            label: "AccessLevel Name",
            type: "text",
            dotFormat: false,
          },
          {
            key: "maxWorkHours",
            label: "Max Work Hours",
            type: "counter",
            dotFormat: false,
          },
          {
            key: "accessType",
            label: "accessType",
            type: "boolean",
            dotFormat: false,
            false: "Disabled",
            true: "Enabled",
          },
          {
            key: "holidays",
            label: "Holidays",
            type: "boolean",
            dotFormat: false,
            false: "Disabled",
            true: "Enabled",
          },
          {
            key: "_24hrs",
            label: "24hrs",
            type: "boolean",
            dotFormat: false,
            false: "Disabled",
            true: "Enabled",
          },
          {
            key: "workingHours",
            label: "Working Hours",
            type: "boolean",
            dotFormat: false,
            false: "Disabled",
            true: "Enabled",
          },
          // {
          //   commenkey: "multiInputFields",
          //   key: "wrkHrs",
          //   label: "Assigned workDays",
          //   type: "multiInput",
          //   endpoint:
          //   "/items/time?limit=25&fields[]=entryTime&fields[]=workDays&fields[]=status&fields[]=exitTime&fields[]=id",
          //   itemMethod: "GET",
          //   valueField: "id",
          //   displayField: "workDays",
          //   option: 1,
          //   dotFormat: false,
          //   requiresTenantFilter: true
          // },
          {
            commenkey: "multiInputFields",
            key: "assignedDoors",
            label: "Assigned Doors",
            type: "multiInput",
            endpoint: "/items/doors",
            itemMethod: "GET",
            valueField: "id",
            displayField: "doorName",
            option: 10,
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
        endpoint: "/items/accesslevels",
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
          single: "Edit AccessLevels ",
        },
        fields: {
          multiple: [],
          single: [
            {
              key: "accessLevelName",
              label: "AccessLevel Name",
              type: "text",
              editable: true,
              dotFormat: false,
            },
            {
              key: "maxWorkHours",
              label: "Max Work Hours",
              type: "counter",
              dotFormat: false,
              editable: true,
            },
            {
              key: "accessType",
              label: "accessType",
              type: "boolean",
              dotFormat: false,
              editable: true,
              false: "Disabled",
              true: "Enabled",
            },
            {
              key: "holidays",
              label: "Holidays",
              type: "boolean",
              dotFormat: false,
              editable: true,
              false: "Disabled",
              true: "Enabled",
            },
            {
              key: "_24hrs",
              label: "24hrs",
              type: "boolean",
              dotFormat: false,
              editable: true,
              false: "Disabled",
              true: "Enabled",
            },
            {
              key: "workingHours",
              label: "Working Hours",
              type: "boolean",
              editable: true,
              dotFormat: false,
              false: "Disabled",
              true: "Enabled",
            },
            // {
            //   commenkey: "multiInputFields",
            //   key: "wrkHrs",
            //   label: "Assigned workdays",
            //   type: "multiInput",
            //   endpoint:
            //     "/items/time?limit=25&fields[]=entryTime&fields[]=workDays&fields[]=status&fields[]=exitTime&fields[]=id",
            //   itemMethod: "GET",
            //   valueField: "id",
            //   displayField: "workDays",
            //   editable: true,
            //   option: 1,
            //   dotFormat: false,
            //   requiresTenantFilter: true
            // },
            {
              commenkey: "multiInputFields",
              key: "assignedDoors",
              label: "Assigned Doors",
              type: "multiInput",
              endpoint: "/items/doors",
              itemMethod: "GET",
              valueField: "id",
              option: 10,
              displayField: "doorName",
              editable: true,
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
        delete: ["Administrator"],
        add: ["Administrator", "Admin"],
        incognitoToggle: [],
      },
      incognito: {
        fields: [],
      },
      filterOptions: [
        {
          label: "accessLevelName",
          value: "filter[_and][0][_and][0][accessLevelName][_eq]=",
        },
        {
          label: "accessLevelNumber",
          value: "filter[_and][0][_and][0][accessLevelNumber][_eq]=",
        },
        { label: "Status", value: "filter[_and][0][_and][0][status][_eq]=" },
        {
          label: "assignedDoors",
          value:
            "filter[_and][0][_and][0][assignedDoors][doors_id][doorName][_icontains]=",
        },
        {
          label: "tenantName",
          value: "filter[_and][0][_and][0][tenant][tenantName][_icontains]=",
        },
      ],
      mandatoryFields: { accessLevelName: true },
      limitOptions: [1, 2, 3, 10, 50, 100, 500],
      defaultLimit: 50,

      export: {
        csv: { fileName: "accessLevel" },
        pdf: { fileName: "accessLevel", title: "accessLevelLog Data" },
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
      accessLevel: [
        // { key: "controllerStatus", label: "controllerStatus" },
        { key: "status", label: "Status" },
        { key: "accessLevelNumber", label: "AccessLevel Number" },
        { key: "accessLevelName", label: "AccessLevel Name" },
        { key: "accessType", label: "accessType" },
        { key: "holidays", label: "Holidays" },
        { key: "_24hrs", label: "24 Hours" },
        { key: "maxWorkHours", label: "Max Work Hours" },
        { key: "workingHours", label: "Working Hours" },
        { key: "assignedDoors", label: "Assigned Doors" },
        // { key: "wrkHrs", label: "Wrk Hrs" },
        { key: "tenantName", label: "Tenant Name" },
      ],
    },
    body: {
      accessLevel: [
        // {
        //   key: "controllerStatus",
        //   label: "controllerStatus",
        //   render: (device) =>
        //      device.controllerStatus || "Waiting for controller response",
        // },
        // {
        //   key: "status",
        //   render: (device) => ({
        //     text: device.status === "assigned"
        //     ? "Awaiting controller response"
        //       : device.status || "",
        //     dotClass: {
        //       "status-dot": true,
        //       approved: device.status === "assigned",
        //       unapproved: device.status === "unassigned",
        //       loading: device.status === "assigned"
        //     },
        //   }),
        // },
        {
          key: "status",
          render: (device) => ({
            text: device.status || "",
            dotClass: {
              "status-dot": true,
              approved: device.status === "assigned",
              unapproved: device.status === "unassigned",
              loading: device.status === "assigned",
            },
          }),
        },
        {
          key: "accessLevelNumber",
          render: (device) => device.accessLevelNumber || "",
        },
        {
          key: "accessLevelName",
          render: (device) => device.accessLevelName || "",
        },
        {
          key: "accessType",
          render: (device) => (device.accessType ? "Enabled" : "Disabled"),
        },
        {
          check: "shift",
          key: "holidays",
          render: (device) => device.holidays || "",
        },
        {
          check: "shift",
          key: "_24hrs",
          render: (device) => device._24hrs || "",
        },
        {
          key: "maxWorkHours",
          render: (device) => device.maxWorkHours || "",
        },
        {
          check: "shift",
          key: "workingHours",
          render: (device) => device.workingHours || "",
        },
        {
          key: "items",
          name: "assignedDoors",
          render: (device) => {
            const items = Array.isArray(device.assignedDoors)
              ? device.assignedDoors
              : [];
            return {
              text: "View Doors",
              click: "toggleItemList",
              list: items
                .map((d) => {
                  if (d && d.doors_id) {
                    return {
                      name: `Door ${d.doors_id.doorNumber || "Unknown"} - ${
                        d.doors_id.doorName || "Unknown"
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
        //   key: "items",
        //   name: "wrkHrs",
        //   render: (device) => {
        //     const items = device.wrkHrs && device.wrkHrs.id ? [device.wrkHrs] : [];
        //     return {
        //       text: "View Shifts",
        //       click: "toggleItemList",
        //       list: items.map((wrk) => ({
        //         name: wrk.workDays || "",
        //       })),
        //     };
        //   },
        // },
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
                      [field.valueField]: device.tenant.tenantId || "",
                      [field.displayField]: device.tenant.tenantName || "",
                    },
                  ]
                : [];
            } else if (field.key === "accessLevelName") {
              form[field.key] = device.accessLevelName || "";
            } else if (field.key === "wrkHrs") {
              form[field.key] = device.wrkHrs
                ? [
                    {
                      [field.valueField]: device.wrkHrs.id || "",
                      [field.displayField]: device.wrkHrs.workDays || "",
                    },
                  ]
                : [];
            } else if (field.key === "assignedDoors") {
              form[field.key] = device.assignedDoors
                ? device.assignedDoors.map((door) => ({
                    [field.valueField]: door.doors_id.id || "",
                    [field.displayField]: `${
                      door.doors_id?.doorNumber || ""
                    } - ${door.doors_id?.doorName || ""}`,
                    doors_id: door.doors_id?.id || "",
                    id: door.id,
                  }))
                : [];
            }
          } else {
            form[field.key] = device[field.key] || "";
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
      if (currentTab === "accessLevel") {
        return {
          tenant: userTenant,
          accessLevelName: addForm.accessLevelName,
          accessLevelNumber: addForm.accessLevelNumber,
          uniqueId: `${userTenant}-${addForm.accessLevelNumber}`,
          status: "assigned",
          controllerStatus: "waiting",
          accessType: addForm.accessType ? 1 : 0,
          holidays: addForm.holidays ? 1 : 0,
          _24hrs: addForm._24hrs ? 1 : 0,
          maxWorkHours: addForm.maxWorkHours || 0,
          workingHours: addForm.workingHours ? 1 : 0,
          wrkHrs:
            addForm.wrkHrs && addForm.wrkHrs.length > 0
              ? addForm.wrkHrs[0].id
              : null,
          assignedDoors: {
            create: addForm.assignedDoors.map((door) => ({
              accesslevels_id: "+",
              doors_id: { id: door.id },
            })),
            delete: [],
            update: [],
          },
        };
      }
      return {};
    },

    prepareEditPayload(form, currentTab, userTenant, originalForm) {
      if (currentTab === "accessLevel") {
        const payload = {
          tenant: userTenant,
          status: "assigned",
          controllerStatus: "waiting",
          accessType: form.accessType ? 1 : 0,
          accessLevelName: form.accessLevelName,
          accessLevelNumber:
            form.accessLevelNumber || originalForm.accessLevelNumber,
          holidays: form.holidays ? 1 : 0,
          _24hrs: form._24hrs ? 1 : 0,
          maxWorkHours: form.maxWorkHours || 0,
          workingHours: form.workingHours ? 1 : 0,
          wrkHrs:
            form.wrkHrs && form.wrkHrs.length > 0 ? form.wrkHrs[0].id : null,
          assignedDoors: {
            create: [],
            delete: [],
            update: [],
          },
        };

        // Handle assignedDoors changes
        form.assignedDoors.forEach((door) => {
          if (
            !originalForm.assignedDoors.some(
              (origDoor) => origDoor.id === door.id
            )
          ) {
            payload.assignedDoors.create.push({
              accesslevels_id: "+",
              doors_id: { id: door.id },
            });
          }
        });

        originalForm.assignedDoors.forEach((origDoor) => {
          if (!form.assignedDoors.some((door) => door.id === origDoor.id)) {
            payload.assignedDoors.delete.push(origDoor.id);
          }
        });

        return {
          keys: [form.id],
          data: payload,
        };
      }
      return {};
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
