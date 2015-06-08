/*! dhx 2015-06-07 */
$dhx.dhtmlx={grid:{formatData:function(a,b){var c=[];return"undefined"!=typeof b&&b.forEach(function(b,d,e){var f={};for(i in b)b.hasOwnProperty(i)&&(f[i]=b[i]);c.push({id:f[a],data:f.data})}),{rows:c}}},formFields:[],formFields_tofill:[],formFields_filled:[],text_labels:{validation_notEmpty:function(a){return"The '"+a+"' field value can not be empty"},validation_Empty:function(a){return"The '"+a+"' field value should be empty"},validation_ValidEmail:function(a){return"The "+a+" field value is not a valid e-mail"},validation_ValidInteger:function(a){return"The "+a+" field should be a valid integer value"},validation_ValidFloat:function(a){return"The "+a+" field should be a valid float value"},validation_ValidNumeric:function(a){return"The "+a+" field value should be a valid numeric value"},validation_ValidAplhaNumeric:function(a){return"The "+a+" field value should be a valid alpha numeric value"},validation_ValidDatetime:function(a){return"The "+a+" field value should be a valid date time value"},validation_ValidExpirationdate:function(a){return"The "+a+" field value should be a valid expiration date"},validation_ValidDate:function(a){return"The "+a+" field value should be a valid date value"},validation_ValidTime:function(a){return"The "+a+" field value should be a valid time value"},validation_ValidCurrency:function(a){return"The "+a+" field should be a valid currency value"},validation_ValidSSN:function(a){return"The "+a+" field should be a valid social security number value"}},getFormFields:function(a){var b=$dhx.dhtmlx;return"undefined"!=typeof b.formFields[a]?b.formFields[a]:[]},prepareForm:function(a,b,c){var d=$dhx.dhtmlx;d.formFields[a]=[],d.formFields_tofill[a]=0,d._setFormFieldsToBind(b.template,a),d._setFormMasks(a,c),c.attachEvent("onChange",function(b,d){for(var e=0;e<$dhx.dhtmlx.formFields[a].length;e++){var f=$dhx.dhtmlx.formFields[a][e];if("checkbox"==f.type&&f.trigger&&f.name==b)if(-1==c.getItemValue(f.trigger).indexOf(d+"-,-")){var g=c.getItemValue(f.trigger)+d+"-,-";c.setItemValue(f.trigger,g)}else{var h=d+"-,-",g=c.getItemValue(f.trigger).replace(new RegExp(h,"g"),"");c.setItemValue(f.trigger,g)}}})},_setFormFieldsToBind:function(a,b,c){var d=$dhx.dhtmlx;try{for(var e=0;e<a.length;e++){a[e]=a[e]||{};var f=a[e];try{f.type=f.type||"button"}catch(g){}var h=f.type;if("newcolumn"!=h&&"settings"!=h&&"button"!=h){try{"undefined"==typeof d.formFields[b]&&(d.formFields[b]=[])}catch(g){}"block"==h?c?d._setFormFieldsToBind(f.list,b,!0):d._setFormFieldsToBind(f.list,b):"label"==h&&f.list?c?d._setFormFieldsToBind(f.list,b,!0):d._setFormFieldsToBind(f.list,b):"checkbox"==h&&f.list?c?(d.formFields[b].unshift(f),d.formFields_tofill[b]=d.formFields_tofill[b]+1,d._setFormFieldsToBind(f.list,b,!0)):(d.formFields[b].push(f),d.formFields_tofill[b]=d.formFields_tofill[b]+1,d._setFormFieldsToBind(f.list,b)):"fieldset"==h&&f.list?c?(d.formFields[b].unshift(f),d.formFields_tofill[b]=d.formFields_tofill[b]+1,d._setFormFieldsToBind(f.list,b,!0)):(d.formFields[b].push(f),d.formFields_tofill[b]=d.formFields_tofill[b]+1,d._setFormFieldsToBind(f.list,b)):(c?d.formFields[b].unshift(f):d.formFields[b].push(f),d.formFields_tofill[b]=d.formFields_tofill[b]+1)}}}catch(g){}},_setFormMasks:function(a,b){for(var c=$dhx.dhtmlx,d=0;d<c.formFields[a].length;d++){var e=c.formFields[a][d];if(e.name){var f,g,h,i=null;if(f=e.mask_to_use||"","undefined"==typeof e.type&&(e.type=""),h=e.type||"",g=e.name||"","input"!=h)continue;if("currency"==f){try{i=b.getInput(g).id}catch(j){i=b.getInput(g).getAttribute("id")}$("#"+i).priceFormat({prefix:""})}else if("can_currency"==f){try{i=b.getInput(g).id}catch(j){i=b.getInput(g).getAttribute("id")}$("#"+i).priceFormat({prefix:"CAN "})}else"integer"==f?b.getInput(g).onkeydown=function(a){only_integer(this)}:"us_phone"==f?(b.getInput(g).onkeypress=function(a){phone_mask(this)},b.getInput(g).maxLength="13"):"expiration_date"==f?(b.getInput(g).onkeypress=function(a){expiration_date(this)},b.getInput(g).maxLength="5"):"cvv"==f?(b.getInput(g).onkeydown=function(a){only_integer(this)},b.getInput(g).maxLength="4"):"credit_card"==f?(b.getInput(g).onkeydown=function(a){only_integer(this)},b.getInput(g).maxLength="16"):"time"==f?(b.getInput(g).onkeydown=function(a){time_mask(this,a)},b.getInput(g).maxLength="8"):"SSN"==f&&(b.getInput(g).onkeypress=function(a){ssn_mask(this)},b.getInput(g).maxLength="11")}}},getFormItem:function(a,b){var c=$dhx.dhtmlx;if(void 0===c.formFields[b])return!1;for(var d=0;d<c.formFields[b].length;d++){var e=c.formFields[b][d];if(e.name==a)return e}return!1},getFormDataAsPayload:function(a,b){var c=($dhx.dhtmlx,b.getFormData()),d="";for(var e in c)d=d+e+"="+encodeURIComponent(c[e])+"&";return""==d?null:("&"==d.charAt(d.length-1)&&(d=d.substr(0,d.length-1)),d)},validateForm:function(a,b){var c,d=$dhx.dhtmlx;c=b.getFormData();for(var e in c)if(c.hasOwnProperty(e)){var f=d.getFormItem(e,a);if(!f)continue;if(f.name){var g,h,i,j,k;g=f.name,h=f.type||"",k=f.label||"";try{i=b.getInput(e).value}catch(l){i=c[e]||""}j=f.validate||"";var m=j.toString().match("NotEmpty");if("NotEmpty"==m&&i.toString().length<1)return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_notEmpty(k)});var n=j.toString().match("Empty");if("Empty"==n&&"NotEmpty"!=m&&i.toString().length>0)return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_Empty(k)});var o=j.toString().match("ValidEmail");if("ValidEmail"==o&&i.length>0&&!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(i))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidEmail(k)});var p=j.toString().match("ValidInteger");if("ValidInteger"==p&&i.length>0&&!i.match(/^\d+$/))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidInteger(k)});var q=j.toString().match("ValidFloat");if("ValidFloat"==q&&i.length>0&&!i.match(/^\d+\.\d+$/))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidFloat(k)});var r=j.toString().match("ValidNumeric");if("ValidNumeric"==r&&i.length>0&&isNaN(i))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidNumeric(k)});var s=j.toString().match("ValidAplhaNumeric");if("ValidAplhaNumeric"==s&&i.length>0&&!i.match(/^[0-9a-z]+$/))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidAplhaNumeric(k)});var t=j.toString().match("ValidDatetime");if("ValidDatetime"==t&&i.length>0&&isNaN(Date.parse(i)))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidDatetime(k)});var u=j.toString().match("ValidDate");if("ValidDate"==u&&i.length>0&&isNaN(Date.parse(i)))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidDate(k)});var v=j.toString().match("ValidTime");if("ValidTime"==v&&i.length>0){var w=i.match(/^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/);if(null==w)return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidTime(k)});if("am"==i.toString().toLowerCase().match("am")||"pm"==i.toString().toLowerCase().match("pm")){if(i.split(":")[0]>12||i.split(":")[1].split(" ")[0]>59)return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidTime(k)})}else if(i.split(":")[0]>23||i.split(":")[1]>59)return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidTime(k)})}var x=j.toString().match("ValidCurrency");if("ValidCurrency"==x&&i.length>0&&!/^\d+(?:\.\d{0,2})$/.test(i))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidCurrency(k)});var y=j.toString().match("ValidSSN");if("ValidSSN"==y&&i.length>0&&!i.match(/^\d{3}-\d{2}-\d{4}$/))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidSSN(k)});var z=j.toString().match("ValidExpirationdate");if("ValidExpirationdate"==z&&i.length>0){if(5!=i.length)return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidExpirationdate(k)});var A=i.split("/")[0],B=i.split("/")[1];if(isNaN(A)||isNaN(B))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidExpirationdate(k)});if(!(A>0&&13>A))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidExpirationdate(k)});if(!(B>0&&99>B))return d._setInputHighlighted(f,a,b),void dhtmlx.message({type:"error",text:d.text_labels.validation_ValidExpirationdate(k)})}}}return!0},_setInputInvalid:function(a){a.style.backgroundColor="#fdafa3",a.focus(),a.onclick=function(){a.style.backgroundColor="#fff"},a.onchange=function(){a.style.backgroundColor="#fff"},a.onkeydown=function(){a.style.backgroundColor="#fff"}},_setInputHighlighted:function(a,b,c){var d=$dhx.dhtmlx,e=a.name,f=a.type;if("combo"==f){var g=c.getCombo(e);g.openSelect()}else"editor"==f||("multiselect"==f?d._setInputInvalid(c.getSelect(e),b):"select"==f?d._setInputInvalid(c.getSelect(e),b):d._setInputInvalid(c.getInput(e)))}};