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
		self.window[ uid ].setText("Provide some values to search.");
		self.status_bar = self.window[ uid ].attachStatusBar();
		self.status_bar.setText('search is case and special chars insentive');
	}
	
	,_layout : function( uid ){
		var self = $dhx.ui.crud.simple.View.Search;
		self.layout[ uid ] = self.window[ uid ].attachLayout($dhx.ui.crud.simple.View.settings.FormWindow.layout);
		self.layout[ uid ].cells('a').hideHeader();
	
	}
	
	
	,_form : function( uid, db_settings, schema, controllerAppId ){
		 var self = $dhx.ui.crud.simple.View.Search, that = $dhx.ui.crud.controller[controllerAppId];
		
		$dhx.ui.crud.simple.View.settings.Search.form.template[1].list = db_settings.form.template;
        self.form[uid] = self.layout[uid].cells('a').attachForm($dhx.ui.crud.simple.View.settings.Search.form.template);
		
		
		
		var hash = {};
		self.form[uid].forEachItem(function(name){
			hash[name] = '';
		});
		
		self.form[uid].setFormData(hash);
		
		self.form[ uid ].attachEvent("onButtonClick", function(name)
		{
         	if (name == "search")
			{
				that.view.grid.clearAll();
				that.view.layout.progressOn();
				self.form[ uid ].lock();
				//console.log( query );
				
				// that.model.db.schema.persons.search().where({ and :{ name : 'Jose', email : 'eduardo'} });
				schema.search.where({
					query : {
						and : self.form[ uid ].getFormData(),	
					},
					onFound : function(record_id, record, tx, event){
						//$dhx.notify('found: ', record, 'icons/db.png');
						var c = { db: 'juris', table : 'persons'}
						var schema = $dhx.dataDriver.getTableSchema(c);
						var primary_key = schema.primary_key.keyPath
						var columns = $dhx.dataDriver._getColumnsId(c).split(',');
						var data = [];
						columns.forEach(function (column, index_, array_) {
							data[index_] = record[column];
						});
						//that.view.grid.addRow(record_id, data);
					}
					,onReady : function(records, tx, event){
						var data={
							rows:[]
						};
						var c = { db: 'juris', table : 'persons'};
						var schema = $dhx.dataDriver.getTableSchema(c);
						var primary_key = schema.primary_key.keyPath;
						var columns = $dhx.dataDriver._getColumnsId(c).split(',');
						records.forEach(function(recordset, index, array) {
							var record = [];
							columns.forEach(function(column, index_, array_) {
								record[index_] = recordset[column];
							});
							data.rows.push({ id:recordset[primary_key], data: record})
						});
						
						that.view.grid.parse(data, "json"); //takes the name and format of the data source
						
						that.view.layout.progressOff();
						self.form[ uid ].unlock();
					}
					,onerror : function(){
						that.view.layout.progressOff();
						self.form[ uid ].unlock();
					}	
				});
				
				
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
