sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox",
  "sap/ui/model/json/JSONModel"
], function(Controller, MessageBox, JSONModel) {
  "use strict";

  return Controller.extend("sform.form.controller.secondPage", {
    onInit: function() {
      this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this._oTable = this.getView().byId("dataTable");
      this._oModel = new JSONModel({
        data: []
      });
      this._oTable.setModel(this._oModel);
      this.getView().byId("formSection").setVisible(true);
      this.getView().byId("recordsSection").setVisible(true);
    },

    onBackPress: function() {
      this._oRouter.navTo("RoutesimpleForm");
    },
    onTabSelect: function(oEvent) {
      var sTabKey = oEvent.getParameter("key");
      var sSectionId = sTabKey === "formTab" ? "formSection" : "recordsSection";
      var oSection = this.getView().byId(sSectionId);
    
      if (oSection) {
        oSection.setVisible(true); // Show the selected section
        // Hide the other section
        this.getView().byId(sTabKey === "formTab" ? "recordsSection" : "formSection").setVisible(false);
      }
    },    
    
    onSavePress: function() {
    
      if (!this.validateSecondPageForm()) {
        MessageBox.error("Error: Fill Properly");
        return;
      }

      // Retrieve data from the second page form
      var oFormData = {
        ProductId: this.byId("productIdInput").getValue(),
        ManufactureDate: this.byId("manufactureDateInput").getValue(),
        Rating: this.byId("ratingInput").getValue(),
        ManufactureCost: this.byId("manufactureCostInput").getValue()
      };

      // Add the validation for each field before saving
      if (!this.validateField("ProductId", oFormData.ProductId, /^[a-zA-Z0-9]+$/)) {
        MessageBox.error("Error: Product ID should contain only alphanumeric characters");
        return;
      }

      if (!oFormData.ManufactureDate) {
        MessageBox.error("Error: Manufacture Date is mandatory");
        return;
      }

      if (!oFormData.Rating) {
        MessageBox.error("Error: Rating is mandatory");
        return;
      }

      if (!this.validateField("ManufactureCost", oFormData.ManufactureCost, /^\d+$/)) {
        MessageBox.error("Error: Manufacture Cost should be a numerical value");
        return;
      }

      // Add the new data to the model correctly
      this._oModel.getData().data.push(oFormData);
      this._oModel.refresh();

      // Display "Saved Successfully" pop-up
      MessageBox.success("Saved Successfully", {
        title: "Success",
        onClose: function() {
          // Clear the form inputs after successful save
          ["productIdInput", "manufactureDateInput", "ratingInput", "manufactureCostInput"].forEach(function(controlId) {
            this.byId(controlId).setValue("");
          }.bind(this));

          // Ensure that the table is visible
          this._oTable.setVisible(true);

          // Ensure that the model is set again and bind the rows
          this._oTable.setModel(this._oModel);
          this._oTable.bindRows("/data");
        }.bind(this)
      });
    },

    onSettingsPress: function() {
      if (!this._oDialog) {
        this._oDialog = new sap.m.SelectDialog({
          title: "Select Columns to Display",
          multiSelect: true,
          items: {
            path: "/columns",
            template: new sap.m.StandardListItem({
              title: "{name}"
            })
          },
          confirm: this.onColumnSelectionConfirm.bind(this),
          cancel: function() {
            this._oDialog.close();
          }.bind(this)
        });

        var aColumns = [
          { name: "Product ID" },
          { name: "Manufacture Date" },
          { name: "Rating Of Products" },
          { name: "Manufacture Cost" }
        ];

        var oModel = new sap.ui.model.json.JSONModel({
          columns: aColumns
        });

        this._oDialog.setModel(oModel);
      }

      this._oDialog.open();
    },

    onColumnSelectionConfirm: function(oEvent) {
      var aSelectedItems = oEvent.getParameter("selectedItems");
      var aSelectedColumns = [];

      aSelectedItems.forEach(function(oItem) {
        var sSelectedColumn = oItem.getTitle();
        aSelectedColumns.push(sSelectedColumn);
      });

      var oTable = this.getView().byId("dataTable");
      oTable.getColumns().forEach(function(oColumn) {
        var sColumnName = oColumn.getLabel().getText();
        oColumn.setVisible(aSelectedColumns.includes(sColumnName));
      });

      this._oDialog.close();
    },

    validateSecondPageForm: function() {
      // Add additional validation logic for the entire form if needed
      return true;
    },

    validateField: function(fieldName, value, regex) {
      // Validate the field using a regular expression
      return regex.test(value);
    }
  });
});