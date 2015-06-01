/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.crud.simple.View.Search = {
	
	window : []
	,strWindowID : "dbDemo.view.Search.window"
	,layout : []
	,form: []
	
	,_window : function( uid ){
		 var self = $dhx.ui.crud.simple.View.Search;
		
		self.window[uid] = new $dhx.ui.window({
            id: self.strWindowID + uid,
            left: $dhx.ui.crud.simple.View.settings.FormWindow.window.left,
            top: $dhx.ui.crud.simple.View.settings.FormWindow.window.top,
            width: $dhx.ui.crud.simple.View.settings.FormWindow.window.width,
            height: $dhx.ui.crud.simple.View.settings.FormWindow.window.height,
        });
		self.window[ uid ].button('park').hide();
		self.window[ uid ].button('minmax').hide();
		self.window[ uid ].button('stick').hide();
		
		self.window[ uid ].attachEvent("onClose", function(win){
			self.form[ uid ].unload();
            self.form[ uid ] = null;
			return true;
		});
		self.window[ uid ].setText( uid.CFC() + " - " + $dhx.ui.language.Provide_some_values_to_search);
		self.status_bar = self.window[ uid ].attachStatusBar();
		self.status_bar.setText($dhx.ui.language.insensitivity_search);
	}
	
	,_layout : function( uid ){
		var self = $dhx.ui.crud.simple.View.Search;
		self.layout[ uid ] = self.window[ uid ].attachLayout($dhx.ui.crud.simple.View.settings.FormWindow.layout);
		self.layout[ uid ].cells('a').hideHeader();
	
	}
	
	
	,_form : function( uid, db_settings, schema, controllerAppId ){
		 var self = $dhx.ui.crud.simple.View.Search, that = $dhx.ui.crud.controller[controllerAppId];
		var form_id = self.strWindowID = ".form." + uid
		$dhx.ui.crud.simple.View.settings.Search.form.template[1].list = db_settings.form.template;
        self.form[uid] = self.layout[uid].cells('a').attachForm($dhx.ui.crud.simple.View.settings.Search.form.template);
		
		
		$dhx.dhtmlx.prepareForm(form_id, $dhx.ui.crud.simple.View.settings.Search.form, self.form[uid]);
		
		$dhx.dhtmlx.formFields[form_id].forEach(function (field, index, array) {
			if (field.type == 'combo') {
				if (typeof field.dhx_table !== 'undefined') {
					if (typeof field.dhx_prop_text !== 'undefined') {
						if (typeof field.dhx_prop_value !== 'undefined') {
							var dhxCombo = self.form[uid].getCombo(field.name);
							
							//dhxCombo.DOMParent
							$dhx.dataDriver.public[field.dhx_table].sync.combo({
								component: dhxCombo
								, component_id: form_id + '_combo_' + field.name
								, $init: function (obj) {
										obj.value = obj[field.dhx_prop_value];
										obj.text = obj[field.dhx_prop_text];
									} // not mandatory, default false
								, onSuccess: function () {
								}
								, onFail: function () {
								}
							});
						}
					}
				}
			}
			else if (field.type == 'select') {
				if (typeof field.dhx_table !== 'undefined') {
					if (typeof field.dhx_prop_text !== 'undefined') {
						if (typeof field.dhx_prop_value !== 'undefined') {
							var dhxSelect = self.form[uid].getSelect(field.name);
							$dhx.dataDriver.public[field.dhx_table].sync.select({
								component: dhxSelect
								, component_id: form_id + '_select_' + field.name
								, $init: function (obj) {
										obj.value = obj[field.dhx_prop_value];
										obj.text = obj[field.dhx_prop_text];
									} // not mandatory, default false
									
								, onSuccess: function () {
								}
								, onFail: function () {
								}
							});
						}
					}
				}
			}
			else
			{
				self.form[uid].getInput(field.name).addEventListener('keyup', function(event) {
					if( this.value.length % 2 )
					{
						window.setTimeout(function(){
							self.doSearch(uid, db_settings, schema, controllerAppId);	
						}, 500);
					}
					
				});
			}
		});
		
		
		
		var hash = {};
		self.form[uid].forEachItem(function(name){
			hash[name] = '';
		});
		
		self.form[uid].setFormData(hash);
		
		self.form[ uid ].attachEvent("onButtonClick", function(name)
		{
         	if (name == "search")
			{
				self.doSearch(uid, db_settings, schema, controllerAppId);
			}
			else if (name == "clear_results")
			{
				that.view.grid.clearAll();
				schema.load(function(records, rows_affected, tx, event) {
                    that.view.helpers.disableButtonActions(controllerAppId);
					
					var data = {
						rows: []
					};
					var c = {
						db: $dhx.ui.crud.controller[controllerAppId].database
						, table: $dhx.ui.crud.controller[controllerAppId].collection
					};
					var schema = $dhx.dataDriver.getTableSchema(c);
					var primary_key = schema.primary_key.keyPath;
					var columns = $dhx.dataDriver._getColumnsId(c).split(',');
					records.forEach(function (recordset, index, array) {
						//console.log(recordset.record)
						var record = [];
						columns.forEach(function (column, index_, array_) {
							record[index_] = recordset.record[column];
						});
						data.rows.push({
							id: recordset.record[primary_key]
							, data: record
						})
					});
					that.view.grid.parse(data, "json"); //takes the name and format of the data source
					
					
                }, function(tx, event, error_message) {
                    console.log(error_message);
                });
			}
        });
	}
	
	, doSearch: function (uid, db_settings, schema, controllerAppId) {
		var self = $dhx.ui.crud.simple.View.Search
			, that = $dhx.ui.crud.controller[controllerAppId];
		that.view.grid.clearAll();
		//that.view.layout.progressOn();
		//self.form[uid].lock();
		//console.log( query );
		// that.model.db.schema.persons.search().where({ and :{ name : 'Jose', email : 'eduardo'} });
		schema.search.where({
			query: {
				and: self.form[uid].getFormData()
			, }
			, onFound: function (record_id, record, tx, event) {
				//$dhx.notify('found: ', record, 'icons/db.png');
				var c = {
					db: $dhx.ui.crud.controller[controllerAppId].database
					, table: $dhx.ui.crud.controller[controllerAppId].collection
				}
				var schema = $dhx.dataDriver.getTableSchema(c);
				var primary_key = schema.primary_key.keyPath
				var columns = $dhx.dataDriver._getColumnsId(c).split(',');
				var data = [];
				columns.forEach(function (column, index_, array_) {
					data[index_] = record[column];
				});
				//that.view.grid.addRow(record_id, data);
				self.form[uid].setFocusOnFirstActive();
			}
			, onReady: function (records, tx, event) {
				var data = {
					rows: []
				};
				var c = {
					db: $dhx.ui.crud.controller[controllerAppId].database
					, table: $dhx.ui.crud.controller[controllerAppId].collection
				};
				var schema = $dhx.dataDriver.getTableSchema(c);
				var primary_key = schema.primary_key.keyPath;
				var columns = $dhx.dataDriver._getColumnsId(c).split(',');
				records.forEach(function (recordset, index, array) {
					var record = [];
					columns.forEach(function (column, index_, array_) {
						record[index_] = recordset[column];
					});
					data.rows.push({
						id: recordset[primary_key]
						, data: record
					})
				});
				that.view.grid.parse(data, "json"); //takes the name and format of the data source
				//that.view.layout.progressOff();
				//self.form[uid].unlock();
				self.form[uid].setFocusOnFirstActive();
			}
			, onerror: function () {
				//that.view.layout.progressOff();
				//self.form[uid].unlock();
				self.form[uid].setFocusOnFirstActive();
			}
		});
	}
	
	,table : []
	
	,controller : []

	,render : function( configuration ){
		 var self = $dhx.ui.crud.simple.View.Search,
		 	database = configuration.database,
			table= configuration.table,
        	schema= configuration.schema,
			controllerAppId = configuration.appId;
		
		self.controller[ uid ] = $dhx.ui.crud.controller[controllerAppId];
		
		var uid = configuration.table;
		self.table[uid] = configuration.table;
		
		if ($dhx.ui.window_manager.isWindow(self.strWindowID + uid))
		{
			self.window[ uid ].show();
			self.window[ uid ].bringToTop();
			return;
		}
		
		
		$dhx.showDirections("starting view ... ");
		
		var db_settings = $dhx.ui.data.model.settings[configuration.database][configuration.table];
		
		self._window( uid );
		self._layout( uid );
		self._form( uid, db_settings, schema, controllerAppId );
		
		self.form[ uid ].setFocusOnFirstActive();
		
		if( configuration.fnCallBack ) configuration.fnCallBack();			
		$dhx.hideDirections();
	}
};
