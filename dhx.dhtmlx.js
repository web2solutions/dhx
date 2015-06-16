$dhx.dhtmlx = {
    grid: {
        formatData: function(primary_key, data) {
            var rows = [];
            if (typeof data !== 'undefined') data.forEach(function(row, index, array) {
                var obj = {};
                for (i in row)
                    if (row.hasOwnProperty(i)) obj[i] = row[i];
                rows.push({
                    id: obj[primary_key],
                    data: obj.data
                });
            });
            return {
                rows: rows
            };
        }
    }
    /*form  validation*/
    ,
    formFields: [],
    formFields_tofill: [],
    formFields_filled: [],
    
    getFormFields: function(form_id) {
        var self = $dhx.dhtmlx;
        if (typeof self.formFields[form_id] !== 'undefined') return self.formFields[form_id];
        else return [];
    },
    prepareForm: function(uid, JSONformConfiguration, DHTMLXForm) {
        var self = $dhx.dhtmlx;
        self.formFields[uid] = []; // clean the array of formFields
        self.formFields_tofill[uid] = 0;
        self._setFormFieldsToBind(JSONformConfiguration.template, uid);
        self._setFormMasks(uid, DHTMLXForm);
        DHTMLXForm.attachEvent("onChange", function(id, value) {
            for (var x = 0; x < $dhx.dhtmlx.formFields[uid].length; x++) {
                var field = $dhx.dhtmlx.formFields[uid][x];
                if (field.type == "checkbox") {
                    if (field.trigger) {
                        if (field.name == id) {
                            //console.log(DHTMLXForm);
                            //console.log(field.trigger);
                            if (DHTMLXForm.getItemValue(field.trigger).indexOf(value + "-,-") == -1) /* nao aberta */ {
                                var fstr = DHTMLXForm.getItemValue(field.trigger) + value + "-,-";
                                DHTMLXForm.setItemValue(field.trigger, fstr);
                            } else {
                                var oldWord = value + "-,-";
                                var fstr = DHTMLXForm.getItemValue(field.trigger).replace(new RegExp(oldWord, "g"), "");
                                DHTMLXForm.setItemValue(field.trigger, fstr);
                            }
                        }
                    }
                }
            }
        });
    },
    _setFormFieldsToBind: function(json, uid, appended_on_the_fly) {
        var self = $dhx.dhtmlx;
        // iterates over all items of the form's JSON
        //console.log(json.length);
        //console.log(json);
        try {
            for (var x = 0; x < json.length; x++) {
                json[x] = json[x] || {};
                var formField = json[x];
                //console.log(formField);
                // catch the type of the item
                try {
                    formField.type = formField.type || "button";
                } catch (e) {
                    //console.log('formField.type = formField.type || "button" : ' + e.stack || e.message);
                    //console.log(formField);
                }
                var type = formField.type;
                //var type = formField.type || "";
                //console.log(type);
                // if the item has one of each following type, we'll discard it
                if (type == "newcolumn" || type == "settings" || type == "button") {
                    continue; // discard the item
                }
                try {
                    if (typeof self.formFields[uid] === 'undefined') {
                        self.formFields[uid] = [];
                    }
                } catch (e) {
                    //console.log("if(! self.formFields[ uid ]) === " + e.stack || e.message);
                }
                // if the item has a "block" type, we need to catch the items inside of the list property of the block
                if (type == "block") {
                    if (appended_on_the_fly) {
                        self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                    } else {
                        self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                    }
                } else if (type == "label" && formField.list) {
                    //if(formField.list)
                    //{
                    if (appended_on_the_fly) {
                        self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                    } else {
                        self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                    }
                    //}
                } else if (type == "checkbox" && formField.list) {
                    //if(formField.list)
                    //{
                    if (appended_on_the_fly) {
                        self.formFields[uid].unshift(formField);
                        self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                        self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                    } else {
                        self.formFields[uid].push(formField);
                        self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                        self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                    }
                    //}
                } else if (type == "fieldset" && formField.list) {
                    //if(formField.list)
                    //{
                    if (appended_on_the_fly) {
                        self.formFields[uid].unshift(formField);
                        self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                        self._setFormFieldsToBind(formField.list, uid, true); // use this same function to catch the items inside of the list
                    } else {
                        self.formFields[uid].push(formField);
                        self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                        self._setFormFieldsToBind(formField.list, uid); // use this same function to catch the items inside of the list
                    }
                    //console.log(" fieldset ");
                    //}
                }
                // if not, we push the formfield into the self.formFields[ uid ] array
                else {
                    if (appended_on_the_fly) {
                        self.formFields[uid].unshift(formField);
                        //console.log("unshift")
                    } else {
                        self.formFields[uid].push(formField);
                        //console.log("push")
                    }
                    self.formFields_tofill[uid] = self.formFields_tofill[uid] + 1;
                }
            }
        } catch (e) {
            //console.log("_setFormFieldsToBind method " + e.stack || e.message);
        }
    },
    _setFormMasks: function(uid, DHTMLXForm) {
        var self = $dhx.dhtmlx;
        //console.log(self.formFields[ uid ]);
        for (var x = 0; x < self.formFields[uid].length; x++) {
            var field = self.formFields[uid][x];
            // check if the item has a name. Lets assume that all the fields which should be validate has a name
            if (field.name) {
                var mask_to_use, name, type, id = null;
                mask_to_use = field.mask_to_use || "";
                //console.log(mask_to_use);
                if (typeof field.type === 'undefined') {
                    field.type = "";
                }
                type = field.type || "";
                name = field.name || "";
                if (type != "input") {
                    continue;
                }
                //console.log(name);
                //formFields_filled
                if (mask_to_use == "currency") {
                    try {
                        id = DHTMLXForm.getInput(name).id;
                    } catch (e) {
                        id = DHTMLXForm.getInput(name).getAttribute("id");
                    }
                    $("#" + id).priceFormat({
                        prefix: ''
                    });
                } else if (mask_to_use == "can_currency") {
                    try {
                        id = DHTMLXForm.getInput(name).id;
                    } catch (e) {
                        id = DHTMLXForm.getInput(name).getAttribute("id");
                    }
                    $("#" + id).priceFormat({
                        prefix: 'CAN '
                    });
                } else if (mask_to_use == "integer") {
                    DHTMLXForm.getInput(name).onkeydown = function(event) {
                        only_integer(this);
                    };
                } else if (mask_to_use == "us_phone") {
                    DHTMLXForm.getInput(name).onkeypress = function(event) {
                        phone_mask(this);
                    };
                    DHTMLXForm.getInput(name).maxLength = "13";
                } else if (mask_to_use == "expiration_date") {
                    DHTMLXForm.getInput(name).onkeypress = function(event) {
                        expiration_date(this);
                    };
                    DHTMLXForm.getInput(name).maxLength = "5";
                } else if (mask_to_use == "cvv") {
                    DHTMLXForm.getInput(name).onkeydown = function(event) {
                        only_integer(this);
                    };
                    DHTMLXForm.getInput(name).maxLength = "4";
                } else if (mask_to_use == "credit_card") {
                    DHTMLXForm.getInput(name).onkeydown = function(event) {
                        only_integer(this);
                    };
                    DHTMLXForm.getInput(name).maxLength = "16";
                } else if (mask_to_use == "time") {
                    //console.log("time mask")
                    DHTMLXForm.getInput(name).onkeydown = function(event) {
                        time_mask(this, event);
                    };
                    DHTMLXForm.getInput(name).maxLength = "8";
                } else if (mask_to_use == "SSN") {
                    DHTMLXForm.getInput(name).onkeypress = function(event) {
                        ssn_mask(this);
                    };
                    DHTMLXForm.getInput(name).maxLength = "11";
                }
            } // END - check if the item has a name.
        } // END FOR
    },
    getFormItem: function(name, uid) {
        var self = $dhx.dhtmlx;
        if (self.formFields[uid] === undefined) {
            return false;
        }
        for (var x = 0; x < self.formFields[uid].length; x++) {
            var field = self.formFields[uid][x];
            if (field.name == name) {
                return field;
            }
        }
        return false;
    },
    getFormDataAsPayload: function(uid, DHTMLXForm) {
        var self = $dhx.dhtmlx,
            hash = DHTMLXForm.getFormData(),
            payload = "";
        for (var formfield in hash) {
            payload = payload + formfield + "=" + encodeURIComponent(hash[formfield]) + "&";
        }
        if (payload == "") return null;
        if (payload.charAt(payload.length - 1) == '&') payload = payload.substr(0, payload.length - 1);
        return payload;
    },
    validateForm: function(uid, DHTMLXForm) {
        var self = $dhx.dhtmlx,
            hash;
        hash = DHTMLXForm.getFormData();
        for (var fieldname in hash) {
            if (hash.hasOwnProperty(fieldname)) {
                //console.log(DHTMLXForm.getForm())
                // check if the item has a name. Lets assume that all the fields which should be validate has a name
                var field = self.getFormItem(fieldname, uid);
                if (!field) {
                    continue;
                }
                if (field.name) {
                    //console.log(field.name);
                    var name, type, value, validate, label;
                    name = field.name;
                    type = field.type || "";
                    label = field.label || "";
                    try {
                        value = DHTMLXForm.getInput(fieldname).value;
                    } catch (e) {
                        value = hash[fieldname] || "";
                    }
                    validate = field.validate || "";
                    //console.log(validate);
                    //==== DO the validations
                    // if the value is not valid, the function will returns, terminating the execution
                    //==== NotEmpty validation
                    var NotEmpty = validate.toString().match("NotEmpty");
                    if (NotEmpty == "NotEmpty") {
                        // if the value have not a lenght > 0
                        if (value.toString().length < 1) {
                            self._setInputHighlighted(field, uid, DHTMLXForm);
                            dhtmlx.message({
                                type: "error",
                                text: $dhx.ui.language.text_labels.validation_notEmpty(label)
                            }); //
                            return;
                        }
                    }
                    var Empty = validate.toString().match("Empty");
                    if (Empty == "Empty" && NotEmpty != "NotEmpty") {
                        // if the value have not a lenght > 0
                        if (value.toString().length > 0) {
                            self._setInputHighlighted(field, uid, DHTMLXForm);
                            dhtmlx.message({
                                type: "error",
                                text: $dhx.ui.language.text_labels.validation_Empty(label)
                            });
                            return;
                        }
                    }
                    var ValidEmail = validate.toString().match("ValidEmail");
                    if (ValidEmail == "ValidEmail") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value)) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidEmail(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidInteger = validate.toString().match("ValidInteger");
                    if (ValidInteger == "ValidInteger") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!value.match(/^\d+$/)) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidInteger(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidFloat = validate.toString().match("ValidFloat");
                    if (ValidFloat == "ValidFloat") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!value.match(/^\d+\.\d+$/)) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidFloat(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidNumeric = validate.toString().match("ValidNumeric");
                    if (ValidNumeric == "ValidNumeric") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (isNaN(value)) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidNumeric(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidAplhaNumeric = validate.toString().match("ValidAplhaNumeric");
                    if (ValidAplhaNumeric == "ValidAplhaNumeric") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!value.match(/^[0-9a-z]+$/)) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidAplhaNumeric(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidDatetime = validate.toString().match("ValidDatetime");
                    if (ValidDatetime == "ValidDatetime") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (isNaN(Date.parse(value))) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidDatetime(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidDate = validate.toString().match("ValidDate");
                    if (ValidDate == "ValidDate") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (isNaN(Date.parse(value))) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidDate(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidTime = validate.toString().match("ValidTime");
                    if (ValidTime == "ValidTime") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            var matchArray = value.match(/^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/);
                            if (matchArray == null) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                                });
                                return;
                            }
                            if (value.toString().toLowerCase().match("am") == "am" || value.toString().toLowerCase().match("pm") == "pm") {
                                if (value.split(":")[0] > 12 || (value.split(":")[1]).split(" ")[0] > 59) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                                    });
                                    return;
                                }
                            } else {
                                if (value.split(":")[0] > 23 || value.split(":")[1] > 59) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                                    });
                                    return;
                                }
                            }
                        }
                    }
                    var ValidCurrency = validate.toString().match("ValidCurrency");
                    if (ValidCurrency == "ValidCurrency") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!/^\d+(?:\.\d{0,2})$/.test(value)) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidCurrency(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidSSN = validate.toString().match("ValidSSN");
                    if (ValidSSN == "ValidSSN") {
                        // if the value have not a lenght > 0
                        if (value.length > 0) {
                            if (!value.match(/^\d{3}-\d{2}-\d{4}$/)) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidSSN(label)
                                });
                                return;
                            }
                        }
                    }
                    var ValidExpirationdate = validate.toString().match("ValidExpirationdate");
                    if (ValidExpirationdate == "ValidExpirationdate") {
                        // if the value have not a lenght > 0  00/00
                        if (value.length > 0) {
                            if (value.length != 5) {
                                self._setInputHighlighted(field, uid, DHTMLXForm);
                                dhtmlx.message({
                                    type: "error",
                                    text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                });
                                return;
                            } else {
                                var month = value.split("/")[0];
                                var year = value.split("/")[1];
                                if (isNaN(month) || isNaN(year)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                    });
                                    return;
                                }
                                if (!(month > 0 && month < 13)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                    });
                                    return;
                                }
                                if (!(year > 0 && year < 99)) {
                                    self._setInputHighlighted(field, uid, DHTMLXForm);
                                    dhtmlx.message({
                                        type: "error",
                                        text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                                    });
                                    return;
                                }
                            }
                        }
                    }
                } // end if have name
            }
        } // end for
        return true;
    },
    _setInputInvalid: function(objInput) {
        var original_color = objInput.style.backgroundColor;
		objInput.style.backgroundColor = "#fdafa3";
        objInput.focus();
		objInput.addEventListener('click', function(event) {
        	objInput.style.backgroundColor = original_color;
        });
		objInput.addEventListener('change', function(event) {
           objInput.style.backgroundColor = original_color;
        });
		objInput.addEventListener('keydown', function(event) {
           objInput.style.backgroundColor = original_color;
        });
    },
    _setInputHighlighted: function(field, uid, DHTMLXForm) {
        //console.log( self.form[ uid ].getForm() )
        var self = $dhx.dhtmlx;
        var name = field.name;
        var type = field.type;
        //console.log( field );
        //var associated_label = field.associated_label || false;
        // these if / else is just for highlightning the formfield which should be filled
        if (type == "combo") {
            var fcombo = DHTMLXForm.getCombo(name);
            fcombo.openSelect();
        } else if (type == "editor") {
            //var feditor = DHTMLXForm.getEditor(name);
        } else if (type == "multiselect") {
            self._setInputInvalid(DHTMLXForm.getSelect(name), uid);
        } else if (type == "select") {
            self._setInputInvalid(DHTMLXForm.getSelect(name), uid);
        } else {
            self._setInputInvalid(DHTMLXForm.getInput(name));
        }
    }
}
