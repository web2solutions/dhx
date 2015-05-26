/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */

$dhx.ui.crud.simple.View = {
	
	layout : null
	,menu : []
	,ribbon : []
	,tab: null
	,grid: null
	,status_bar : null
	,task_bar : null
	,task_bar : null
	,window : []
	,openedCRUD : []
	, strWindowID: "$dhx.ui.crud.simple.View.generic.window."
	
	,status_bar : function ( appId, icons_path ){
			this.template = "<div id='status_info'>Initializing "+$dhx.ui.controller[ appId ].appName+"</div><div id='expiration_info' title='time remaining for token expiration' class='expiration_info'></div><div id='user_info'><img id='user_info_status' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvUlEQVR4XpWRy0tbQRjFz9yH3hgtruzGRqRx47aoaxvBdboo7qTtrst2WRAfDcZo/wAR/BPiRroouHHZFqmCT9DEV0uiYmjD9OZO5k5nRiPk0Rvyg8vhG74535nvEtSQTC6mXdeNozlwHGetzmB6es6fmvpAJAhCCIHZ2QQs1KMvPx5+jSByX1e1klYi/2E2ds5K2D7IaoOZmY93kSWiGapH9oqB0beiZ+iVkOjaajUyZVW7qd7BYLQXBiEwTAMED406cgU71AlWoo0N/roeTNOEadnwhY9C4Tc8z6uaSAv5/yfwfFNOd+QlIs0YyrwNjLGGT5E7UW8XVQa3lKM9bMF2OuG0AcwtAoTgHbaQjfVhEpC6ggqxnqdZqyae/mp50XWJJ2vbIB1hnI1HEVnfQzn3E3gz1q/+pc85F0FknkcEZ54u2HVOK6dFfU5SqU9pSmkcAUxu6tg6hfmoG+WbPC5eDkEzv5B4f3xyxL9sfBaHR/tC6daPb/f6XamapCcqWP6XVl5y9blFCJZOMscIOSGcnmdgWTaub65gGIbUPGxZKwRj8M0SLiZGHnagIMlUQqAJz3Y3ET3fRwOW/wEKrjnBHaxMrAAAAABJRU5ErkJggg==' /> <span>Not authorized yet</span></div><div id='data_transfer_info'> no data transferred</div><div id='socket_info' class='data_transfer_info'>socket: disconnected</div><div id='errors_info'>no errors</div>"
			this._setStatus = function (m) {
				document.getElementById("status_info").innerHTML = m;
			}
			this._setStatusError= function (m) {
				document.getElementById("errors_info").innerHTML = m;
			}
			this._setStatusDataTransfer= function (m, isActive) {
				/*dhtmlx.message({
					text: m
				});*/
				if (isActive) {
					document.getElementById("data_transfer_info").innerHTML = m;
					document.getElementById("data_transfer_info").style.backgroundImage = "url(" + icons_path + "network.gif)";
				}
				else {
					document.getElementById("data_transfer_info").innerHTML = m;
					document.getElementById("data_transfer_info").style.backgroundImage = "url(" + icons_path + "network-accept.png)";
				}
			}
			this._setStatusSocket= function (m, isOffline) {
				dhtmlx.message({
					text: m
				});
				document.getElementById("socket_info").innerHTML = "socket: " + m;
				document.getElementById("socket_info").style.backgroundImage = "url(" + icons_path + "socket.gif)";
				if (isOffline)
					document.getElementById("socket_info").style.backgroundImage = "url(" + icons_path + "socket_disconnected.png)";
			}
			
			this._setStatusUser= function (m, ok) {
				if (typeof ok === 'undefined') {
					ok = true;
				}
				document.getElementById("user_info").getElementsByTagName("span")[0].innerHTML = m;
				if (ok) {
					document.getElementById("user_info_status").src = "" + icons_path + "online.png";
					//dhtmlx.message({
					//	text: m
					//});
				}
				else {
					document.getElementById("user_info_status").src = "" + icons_path + "offline.png";
					dhtmlx.message({
						type: "error"
						, text: m
					});
				}
			}
	}
	
	,helpers : 
	{
		disableButtonActions : function( appId ){
			var self = $dhx.ui.controller[ appId ].view;
			
			self.menu[ appId ].setItemDisabled('update');
			self.menu[ appId ].setItemDisabled('open');
			if( ! self.ribbon[ appId ] )
				return
			self.ribbon[ appId ].disable('delete');
			self.ribbon[ appId ].disable('update');	
			self.ribbon[ appId ].disable('previous');
			self.ribbon[ appId ].disable('next');
			self.ribbon[ appId ].disable('open');			
		}	
		,enableButtonActions : function(  appId  ){
			var self = $dhx.ui.controller[ appId ].view;
			self.menu[ appId ].setItemEnabled('update');
			self.menu[ appId ].setItemEnabled('open');
			if( ! self.ribbon[ appId ] )
				return
			self.ribbon[ appId ].enable('delete');
			self.ribbon[ appId ].enable('update');	
			self.ribbon[ appId ].enable('previous');
			self.ribbon[ appId ].enable('next');
			self.ribbon[ appId ].enable('open');	
		}	
		,viewRecord : function( record_id, appId){
			var self = $dhx.ui.controller[ appId ].view;
			//alert( appId );
			
			var table = appId.split('crud.simple.')[1];
			table = table.split("_")[0]
			//alert(table)
			var schema = $dhx.ui.data.model.db['juris'].schema[table];
			
			var settings = {
					wrapper : self.tab
					,record_id : record_id
					,table : table
					,db : $dhx.ui.controller[ appId ].database
			};
			if( ! self.ribbon[ appId ] )
				settings['is_generic'] = true;
			
			$dhx.ui.crud.simple.View.Record.render(settings, schema);
		}
	}
	
	,destroy : function ( appId, schema, status_bar ) {
		try {
			var self = $dhx.ui.controller[ appId ].view;
			//console.log( );
			//console.log( $dhx.ui.controller );
			//alert( 'destroy ' + appId );
			//alert( $dhx.ui.controller[ appId ].appId );
			$dhx.showDirections("starting view ... ");
			
			self.grid.destructor();
			
			//self.menu[ appId ].unload();
			//self.menu[ appId ] = null;
			//self.ribbon[ appId ].unload();
			//self.ribbon[ appId ] = null;
			
			//self.tab.unload();
			//self.tab = null;
			//self.layout.unload();
			//self.layout = null;
			
			'$dhx.ui.crud.simple.groups_app'
			
			var table = appId.split('crud.simple.')[1];
			table = table.split("_")[0]
			
			schema = $dhx.ui.data.model.db['juris'].schema[table];
			
			schema.unsync.grid({
				component: self.grid
				, component_id: 'main_grid_' + appId
				, onSuccess: function () {
					
				}
				, onFail: function () {
					status_bar._setStatusError('could not unsync grid');	
				}
			});
			$dhx.hideDirections();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
	
	, _window: function ( uid, appId, schema, onClose ) {
		console.log($dhx.ui.controller)
		var self = $dhx.ui.controller[ appId ].view;
		
		self.window[uid] = $dhx.ui.window_manager.createWindow({
			id: self.strWindowID + appId
			, left: $dhx.ui.crud.simple.View.settings.app_generic.window.left
			, top: $dhx.ui.crud.simple.View.settings.app_generic.window.top
			, width: $dhx.ui.crud.simple.View.settings.app_generic.window.width
			, height: $dhx.ui.crud.simple.View.settings.app_generic.window.height
		, });
		//alert( '_window ' + appId);
		self.window[uid].attachEvent("onClose", function (win) {
			
			if(onClose) onClose();
			win.hide();
			return;
		});
		
		self.window[uid].setText("");
		self.window[uid].attachStatusBar();
		return self.window[uid];
	}
	
	,_layout : function(  appId  ){
		var self = $dhx.ui.controller[ appId ].view;
		
		console.log( $dhx.ui.controller[ appId ] )
		
		if( $dhx.ui.controller[ appId ].configuration.wrapper === document.body )
			self.layout = new dhtmlXLayoutObject( $dhx.ui.crud.simple.View.settings.layout );	
		else
			self.layout = $dhx.ui.controller[ appId ].configuration.wrapper.attachLayout( $dhx.ui.crud.simple.View.settings.layout );	
				
		self.layout.cells('a').hideHeader();
		self.task_bar = self.layout.attachStatusBar();
	}
	
	
	,_menu : function(  appId, status_bar, fk_tables, schema  ){
		//alert('menu' +  appId);
		var self = $dhx.ui.controller[ appId ].view;
		self.menu[ appId ] = self.layout.cells('a').attachMenu( $dhx.ui.crud.simple.View.settings.menu );
		self.menu[ appId ].attachEvent("onClick", function (id) {
			if (id == 'print') {
				
			}
			else if (id == 'insert') {
				$dhx.ui.crud.simple.View.FormWindow.render({
					database : $dhx.ui.controller[ appId ].database,
					table: $dhx.ui.controller[ appId ].collection,
					schema : schema
				});
			}
			else if (id == 'update') {
				if (self.grid.getSelectedRowId())
					$dhx.ui.crud.simple.View.FormWindow.render({
						record_id: self.grid.getSelectedRowId(),
						database : $dhx.ui.controller[ appId ].database,
						table: $dhx.ui.controller[ appId ].collection,
						schema : schema
					});
			}
			else if (id == 'open') {
				if( self.grid.getSelectedRowId() )
					self.helpers.viewRecord(self.grid.getSelectedRowId(), appId, schema);
			}
			else
			{
				
				if( id.indexOf('table.') > -1)
				{
					var table = id.split('.')[1];
					
					console.log( fk_tables );
					for( var column in fk_tables )
					{
						console.log( fk_tables )
						var uid = column + "." + fk_tables[column].table;
						//alert( 'onClick ' + appId);
						
						
						//appId = '$dhx.ui.crud.simple.' + fk_tables[column].table + '_app';
						
						var wrapper = self._window( uid, appId, schema, function(){
								$dhx.ui.controller[ '$dhx.ui.crud.simple.' + fk_tables[column].table + '_app' ].view.destroy( '$dhx.ui.crud.simple.' + fk_tables[column].table + '_app', schema, status_bar );
								//self.openedCRUD[ uid ]  = null;
								
						} );
						//alert(fk_tables[column].table)
						self.openedCRUD[ uid ] = new $dhx.ui.crud.simple( {
							wrapper : wrapper
							,database : $dhx.ui.controller[ appId ].database
							,collection : fk_tables[column].table
							,base_path : $dhx.ui.crud.simple.View.settings.base_path
						} );
					}
				}
			}
		});
	}
	
	,_tab : function(  appId, status_bar ){
		var self = $dhx.ui.controller[ appId ].view;
		//alert();
		self.tab = self.layout.cells('a').attachTabbar( $dhx.ui.crud.simple.View.settings.tab );
		
		if( $dhx.ui.controller[ appId ].configuration.wrapper === document.body )
		{
			self.status_bar = self.tab.cells('records').attachStatusBar();
			self.status_bar.setText( status_bar.template );
		}
		
		
		
		
		self.tab.attachEvent("onTabClose", function(id)
		{
			try
			{
				//self.Record.wrapper.clean( parseInt( id ) );
			}
			catch(e)
			{
				//console.log(e.stack)	
			}
			return true;
		});
	}


	,_grid : function( appId, status_bar, schema ){
		var self = $dhx.ui.controller[ appId ].view;
		self.grid = self.tab.cells('records').attachGrid();		
		
		// enable live edit via $dhx.dataDriver
		self.grid.saveOnEdit = true;
		
		/*
			the sync() method will internally do:
			
				if auto_configure : true
					setHeader(); setColumnIds(); setColTypes();  setColSorting();  setColAlign();  
					setInitWidths(); init();  
					
				if paginate ! true 
					enableSmartRendering(true); 
			
			- auto setDateFormat("%Y-%m-%d");
			- auto creates a MQ subscriber for grid
			- auto syncs grid with table for all CRUD operations
			
			Note: if you want to personalu the grid look, please do it by editing your model
		*/
		schema.sync.grid({
			component: self.grid
			, component_id: 'main_grid_' + appId
			,auto_configure : true
			, onSuccess: function () {}
			, onFail: function () {
				status_bar._setStatusError('could not syn grid');	
			}
		});
		
		//self.grid.attachEvent("onRowSelect", function (new_row, ind)
		//{								
		//});
	}
	
	,_ribbon : function(  appId, status_bar, schema  ){
		var self = $dhx.ui.controller[ appId ].view;
		self.ribbon[ appId ] = self.layout.cells('a').attachRibbon( $dhx.ui.crud.simple.View.settings.ribbon );
		self.helpers.disableButtonActions( appId );
		self.ribbon[ appId ].attachEvent("onClick", function (id) {
			if (id == 'select') {
				schema.load(  function( records, rows_affected, tx, event ){
					self.helpers.disableButtonActions( controller );
				}, function( tx, event, error_message ){
					console.log(error_message);
				} );	
			}
			else if (id == 'gettotal') {
				status_bar._setStatusDataTransfer('counting records', true);
				schema.count(  function( tx, event, total ){
					status_bar._setStatusDataTransfer('total records: '+ total, false);
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);	
				});	
			}
			else if (id == 'getquota') {
				
				status_bar._setStatusDataTransfer('getting quota information', true);
				that.model.db._getQuota(  function(  used, remaining ){
					used = ( used / 1024  / 1024  / 1024 );
					remaining = ( remaining / 1024  / 1024  / 1024 );
					var message = 'used: ' + used.toFixed(5) + 'GB. remaining: '+remaining.toFixed(2) + 'GB';
					$dhx.notify('Quota information', message, 'icons/db.png');
					status_bar._setStatusDataTransfer('used: ' + used.toFixed(5) + 'GB. remaining: '+remaining.toFixed(2) + 'GB', false);
				}, function( error ){
					status_bar._setStatusDataTransfer(error, false);
				});	
			}
			else if (id == 'first') {
				status_bar._setStatusDataTransfer('requesting first record', true);
				schema.first(  function( record_id, record, tx, event ){
						status_bar._setStatusDataTransfer('id: ' +record_id, false);
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);
					
				});	
			}
			else if (id == 'next') {
				status_bar._setStatusDataTransfer('requesting next record', true);
				schema.next(  function( record_id, record, tx, event ){
						status_bar._setStatusDataTransfer('id: ' +record_id, false);
						
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);
					$dhx.notify('navigation', error_message, 'icons/db.png');	
				});	
			}
			else if (id == 'previous') {
				status_bar._setStatusDataTransfer('requesting previous record', true);
				schema.previous(  function( record_id, record, tx, event ){
						status_bar._setStatusDataTransfer('id: ' +record_id, false);
						
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);
					$dhx.notify('navigation', error_message, 'icons/db.png');		
				});	
			}
			else if (id == 'last') {
				status_bar._setStatusDataTransfer('requesting last record', true);
				schema.last(  function( record_id, record, tx, event ){
						status_bar._setStatusDataTransfer('id: ' +record_id, false);
						
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);	
				});	
			}
			else if (id == 'gettablesize') {
				status_bar._setStatusDataTransfer('requesting table size', true);
				schema.getTableSizeInBytes( function( tx, event, size ){
					//console.log( size );
					var size = ( size / 1024 ).toFixed(2) + " KB";
					status_bar._setStatusDataTransfer('table size :'+ size, false);
					//$dhx.notify('total table size', size, 'icons/db.png');
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);	
				} );	
			}
			else if (id == 'cleartable') {
				status_bar._setStatusDataTransfer('deleting all records', true);
				schema.clearAll(function (tx, event) {
					status_bar._setStatusDataTransfer('all records deleted', false);
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);	
				});
			}
			else if (id == 'insert') {
				$dhx.ui.crud.simple.View.FormWindow.render({
					database : $dhx.ui.controller[ appId ].database,
					table: $dhx.ui.controller[ appId ].collection,
					schema : schema
				});
			}
			else if (id == 'update') {
				if (self.grid.getSelectedRowId())
					$dhx.ui.crud.simple.View.FormWindow.render({
						record_id: self.grid.getSelectedRowId(),
						database : $dhx.ui.controller[ appId ].database,
						table: $dhx.ui.controller[ appId ].collection,
						schema : schema
					});
			}
			else if (id == 'open') {
				if( self.grid.getSelectedRowId() )
					self.helpers.viewRecord(self.grid.getSelectedRowId(), appId, schema);
			}
			else if (id == 'find') {
				self.Search.render();
			}
			else if (id == 'getCursor') {
				status_bar._setStatusDataTransfer('getting cursor', true);
				schema.getCursor(function (cursor, tx, event) {
					status_bar._setStatusDataTransfer('cursor got ' + cursor, false);
				}, function( tx, event, error_message ){
					status_bar._setStatusError(error_message);	
				});
			}
			else if (id == 'delete') {
				if (self.grid.getSelectedRowId()) 
				{
					status_bar._setStatusDataTransfer('deleting record', true);
					schema.del(self.grid.getSelectedRowId(), function (tx, event, record_id) {
						status_bar._setStatusDataTransfer('record deleted: ' + record_id, false);
						//self.grid.deleteSelectedRows();
						self.helpers.disableButtonActions( controller );
					}, function( tx, event, error_message ){
						status_bar._setStatusError(error_message);	
					});
				}
			}
			else if (id == 'dropdb') {
				status_bar._setStatusDataTransfer('deleting database', true);
				that.model.db.drop( function(message, tx, event){
					status_bar._setStatusDataTransfer(message, false);
					}, function( tx, event, error_message ){
						status_bar._setStatusError(error_message);	
				});
			}
		});
	}

	,controller : []

	,render : function( controller ){
		
		//alert( appId );
		var appId = controller.appId;
		
		console.log( 'XXXXXXXXXXXXXMMMMMMXXXXXMMMMXXX', controller );
		
		var self = $dhx.ui.controller[ appId ],
			schema = $dhx.ui.data.model.db[controller.database].schema[controller.collection],
			db_settings = $dhx.ui.data.model.settings[controller.database][controller.collection],
			fk_tables = $dhx.ui.data.model.schema[controller.database][controller.collection].foreign_keys;
			
			
		//if ($dhx.ui.controller[ appId ]) {
		//	controller.configuration.wrapper.show();
		//	controller.configuration.wrapper.bringToTop();
		//	return;
		//}	
		
			
		
		self = $dhx.ui.controller[ appId ].view;
		
			
		$dhx.showDirections("starting view ... ");
		self._layout( appId );
		
		var status_bar = new self.status_bar( appId, $dhx.ui.crud.simple.View.settings.icons_path );
		
		self._tab( appId, status_bar );
		self._grid( appId, status_bar, schema );
		self._menu( appId, status_bar, fk_tables, schema );
		
		self.tab.tabs("records").setText($dhx.ui.controller[ appId ].collection.toUpperCase());
		
		
		if( $dhx.ui.controller[ appId ].configuration.wrapper === document.body )
			self._ribbon( appId, status_bar, schema  );	
		
		
		
		
		var cc = 0;
		var addded = false;
		for( var column in fk_tables )
		{
			if( ! addded ) self.menu[ appId ].addNewSibling("edit", "fkeys_table", "Related tables", false);
			addded = true
			
			self.menu[ appId ].addNewChild("fkeys_table", cc, 'table.' + fk_tables[column].table, 'edit ' + fk_tables[column].table + " table", false, "form.gif");
			cc= cc + 1;
		}
		
		// ====== lets use the table events
		schema.attachEvent('onAfterCursorChange', function (cursor_id, table) {
			
			if( table == controller.collection)
			{
				console.log( appId );
				console.log( schema );
				$dhx.ui.controller[ appId ].view.helpers.enableButtonActions( appId );
				status_bar._setStatusDataTransfer('selected: ' + cursor_id, false);
			}
			
			
		});
		schema.attachEvent('onBeforeCursorChange', function (cursor_id) {
			//console.log('before set cursor');
		});
		schema.attachEvent('onAfterAdd', function (records, rows_affected) {
			$dhx.ui.controller[ appId ].view.helpers.enableButtonActions( appId );
			status_bar._setStatusDataTransfer('added: ' + rows_affected + ' records', false);
		});
		schema.attachEvent('onBeforeAdd', function () {
			//console.log('before add record');
		});
		status_bar._setStatusDataTransfer('counting records', true);
		schema.count(function (tx, event, total) {
			status_bar._setStatusDataTransfer('got total records', false);
			status_bar._setStatus('total records: ' + total);
		}, function (tx, event, error_message) {
			status_bar.setText('error when counting records: ' + error_message);
		});
		
		window.addEventListener('popstate', function(event) {
			console.log('popstate fired!');			
			console.log(event);
			console.log(event.state);
		});
		
		history.pushState('start', 'start', '#start');
		$dhx.hideDirections();
	}
};
