sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox"
], function(Controller, JSONModel, MessageBox) {
  "use strict";

  return Controller.extend("sform.form.controller.simpleForm", {
    onInit: function() {
      var oModel = new JSONModel({
        data: [],
        tableVisible: true
      });
      this.getView().setModel(oModel);
    },

    onSavePress: function() {
      // Validate the form fields
      if (!this.validateForm()) {
        MessageBox.error("Error: Fill Properly");
        return;
      }

      var oModel = this.getView().getModel();
      var oData = oModel.getProperty("/data");
      var oFormData = {
        SerialNumber: oData.length + 1,
        Name: this.byId("nameInput").getValue(),
        Email: this.byId("emailInput").getValue(),
        Gender: this.byId("genderInput").getSelectedButton().getText(),
        Address: this.byId("addressInput").getValue(),
        ProductName: this.byId("productNameInput").getValue(),
        TotalCost: this.byId("totalCostInput").getValue(),
        DateOfDelivery: this.byId("deliveryDateInput").getValue()
      };

      // Add the validation for each field before saving
      if (!this.validateField("Name", oFormData.Name, /^[a-zA-Z\s]+$/)) {
        MessageBox.error("Error: Name should contain only alphabets");
        return;
      }

      if (!this.validateField("Email", oFormData.Email, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
        MessageBox.error("Error: Invalid Email address");
        return;
      }

      if (!this.validateField("Address", oFormData.Address, /^[a-zA-Z0-9\s]+$/)) {
        MessageBox.error("Error: Address should contain only alphanumeric characters");
        return;
      }

      if (!this.validateField("ProductName", oFormData.ProductName, /^[a-zA-Z\s]+$/)) {
        MessageBox.error("Error: Product Name should contain only alphabets");
        return;
      }

      if (!this.validateField("TotalCost", oFormData.TotalCost, /^\d+$/)) {
        MessageBox.error("Error: Total Cost should be a numerical value");
        return;
      }

      oData.push(oFormData);
      oModel.setProperty("/data", oData);

      this.byId("nameInput").setValue("");
      this.byId("emailInput").setValue("");
      this.byId("genderInput").setSelectedIndex(0);
      this.byId("addressInput").setValue("");
      this.byId("productNameInput").setValue("");
      this.byId("totalCostInput").setValue("");
      this.byId("deliveryDateInput").setValue("");
    },

    validateField: function(fieldName, value, regex) {
      // Validate the field using a regular expression
      return regex.test(value);
    },

    validateForm: function() {
      // Validate the entire form
      var isValid = true;

      // Add additional validation logic for the entire form if needed

      return isValid;
    },

    onNextPagePress: function() {
      this.getOwnerComponent().getRouter().navTo("secondPage");
    },

    onPanelToggle: function () {
      var oModel = this.getView().getModel();
      var bTableVisible = oModel.getProperty("/tableVisible");
      oModel.setProperty("/tableVisible", !bTableVisible);
    }
  });
});
