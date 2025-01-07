// src/utils/filters/queryFilters.js
export default {
    // Filter configurations
    
        PersonalModule: {
            showAdmin: ['Administrator', 'esslAdmin'],
            showManager: ['Admin'],
            showEmployee: ['Manager'],
            // showTenant: ['Employee', 'Admin', 'Manager']
          
        },
        TenantManagement:{
            showAdmin: [],
            showManager: [],
            showEmployee: [],
            showTenant: []
        },
        filter:{
            showAdmin: [],
            showManager: [],
            showEmployee: [],
            showTenant: []
        },
    
      

  
    // Build query parameters
    buildQueryFilters({userTenant, userRole, userBranch, currentTab, tabData, currentTabData, params, selectedRole}) {
      const queryParams = new URLSearchParams();
      
      // Role based filters
      if (currentTab === 'PersonalModule') {
        if (this.PersonalModule.showAdmin.includes(userRole)) {
          queryParams.append("filter[assignedUser][role][name][_contains]", "Admin");
        }
        if (this.PersonalModule.showManager.includes(userRole)) {
          queryParams.append("filter[assignedUser][role][name][_contains]", "Manager");
          queryParams.append("filter[assignedUser][tenant][tenantId][_eq]", userTenant);
        }
        if (this.PersonalModule.showEmployee.includes(userRole)) {
          queryParams.append("filter[assignedUser][role][name][_contains]", "Employee");
          queryParams.append("filter[assignedUser][tenant][tenantId][_eq]", userTenant);
        }
        
      }
      else {
        if (this.filter.showAdmin.includes(userRole))
        queryParams.append("filter[tenant][tenantId][_eq]", this.userTenant);
      }
  
      // Rest of your existing code remains the same
      params.fields.forEach((field) => {
        queryParams.append("fields[]", field);
      });

        // Date Filter
    if (currentTabData.dateFilter && currentTabData.dateFilter.type) {
        const filterType = currentTabData.dateFilter.type;
    
        if (filterType === "range" && currentTabData.dateFilter.start && currentTabData.dateFilter.end) {
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
    
      // Handle filter and query
      if (tabData.filter && tabData.filter.trim() !== "") {
        const combinedParams = new URLSearchParams(
          tabData.filter + (tabData.query || "")
        );
    
        combinedParams.forEach((value, key) => {
          if (key.startsWith("filter[")) {
            queryParams.append(key, value);
          } else {
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
          const finalCondition = condition.replace("%SEARCH_QUERY%", searchQuery);
          queryParams.append(
            finalCondition.split("=")[0],
            finalCondition.split("=")[1]
          );
        });
      }
    
      // Role filter
      if (selectedRole) {
        queryParams.append(
          `filter[_and][0][assignedUser][role][name][_contains]`,
          selectedRole.name
        );
      }
  
      // ... rest of your code ...
  
      return queryParams;
    }
  };

