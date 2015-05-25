/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */

$dhx.ui.crud.simple.View = function( controller ){
	
	var self = this,
		parent = this,
		schema = $dhx.ui.data.model.db[controller.database].schema[controller.collection],
		db_settings = $dhx.ui.data.model.settings[controller.database][controller.collection],
		helpers = 
		{
			disableButtonActions : function(){
				ribbon.disable('delete');
				ribbon.disable('update');	
				ribbon.disable('previous');
				ribbon.disable('next');
				ribbon.disable('open');			
			}	
			,enableButtonActions : function(){
				ribbon.enable('delete');
				ribbon.enable('update');	
				ribbon.enable('previous');
				ribbon.enable('next');
				ribbon.enable('open');	
			}	
			,viewRecord : function( record_id ){
				$dhx.ui.crud.simple.View.Record.render({
					wrapper : tab
					,record_id : record_id
					,db : controller.database
				}, schema);
			}
		},
		layout = null,
		menu = null,
		ribbon = null,
		tab = null,
		grid = null,
		status_bar = null,
		task_bar = null;
	
	var _layout= function ( ) {
		layout = new dhtmlXLayoutObject($dhx.ui.crud.simple.View.settings.layout);
		layout.cells('a').hideHeader();
		task_bar = layout.attachStatusBar();
	}
	
	var _menu= function ( ) {
		menu = layout.cells('a').attachMenu($dhx.ui.crud.simple.View.settings.menu);
		menu.attachEvent("onClick", function (id) {
			if (id == 'print') {
				
			}
		});
	}
	
	var _tab= function ( ) {
		tab = layout.cells('a').attachTabbar($dhx.ui.crud.simple.View.settings.tab);
		status_bar = tab.cells('records').attachStatusBar();
		status_bar.setText(self.settings.status_bar.template);
		tab.attachEvent("onTabClose", function (id) {
			try {
				//Record.wrapper.clean(parseInt(id));
			}
			catch (e) {
				//console.log(e.stack)
			}
			return true;
		});
	}
	
	var _grid= function ( ) {
		grid = tab.cells('records').attachGrid();
		grid.saveOnEdit = true;
		schema.sync.grid({
			component: grid
			, component_id: 'main_grid_' + controller.appId
			,auto_configure : true
			, onSuccess: function () {}
			, onFail: function () {
				self.settings.status_bar._setStatusError('could not syn grid');	
			}
		});
		//grid.attachEvent("onRowSelect", function (new_row, ind)
		//{								
		//});
	}
	
	var _ribbon= function ( ) {
		
		ribbon = layout.cells('a').attachRibbon($dhx.ui.crud.simple.View.settings.ribbon);
		helpers.disableButtonActions();
		ribbon.attachEvent("onClick", function (id) {
			if (id == 'select') {
				schema.load(function (records, rows_affected, tx, event) {
					helpers.disableButtonActions();
				}, function (tx, event, error_message) {
					console.log(error_message);
				});
			}
			
			else if (id == 'first') {
				self.settings.status_bar._setStatusDataTransfer('requesting first record', true);
				schema.first(function (record_id, record, tx, event) {
					self.settings.status_bar._setStatusDataTransfer('id: ' + record_id, false);
				}, function (tx, event, error_message) {
					self.settings.status_bar._setStatusError(error_message);
				});
			}
			else if (id == 'next') {
				self.settings.status_bar._setStatusDataTransfer('requesting next record', true);
				schema.next(function (record_id, record, tx, event) {
					self.settings.status_bar._setStatusDataTransfer('id: ' + record_id, false);
				}, function (tx, event, error_message) {
					self.settings.status_bar._setStatusError(error_message);
					$dhx.notify('navigation', error_message, 'icons/db.png');
				});
			}
			else if (id == 'previous') {
				self.settings.status_bar._setStatusDataTransfer('requesting previous record', true);
				schema.previous(function (record_id, record, tx, event) {
					self.settings.status_bar._setStatusDataTransfer('id: ' + record_id, false);
				}, function (tx, event, error_message) {
					self.settings.status_bar._setStatusError(error_message);
					$dhx.notify('navigation', error_message, 'icons/db.png');
				});
			}
			else if (id == 'last') {
				self.settings.status_bar._setStatusDataTransfer('requesting last record', true);
				schema.last(function (record_id, record, tx, event) {
					self.settings.status_bar._setStatusDataTransfer('id: ' + record_id, false);
				}, function (tx, event, error_message) {
					self.settings.status_bar._setStatusError(error_message);
				});
			}
			else if (id == 'insert') {
				$dhx.ui.crud.simple.View.FormWindow.render({
					database : controller.database,
					table: controller.collection,
					schema : schema
				});
			}
			else if (id == 'update') {
				if (grid.getSelectedRowId())
					$dhx.ui.crud.simple.View.FormWindow.render({
						record_id: grid.getSelectedRowId(),
						database : controller.database,
						table: controller.collection,
						schema : schema
					});
			}
			else if (id == 'open') {
				if (grid.getSelectedRowId())
					helpers.viewRecord(grid.getSelectedRowId());
			}
			else if (id == 'find') {
				Search.render();
			}
			else if (id == 'delete') {
				if (grid.getSelectedRowId()) {
					self.settings.status_bar._setStatusDataTransfer('deleting record', true);
					schema.del(grid.getSelectedRowId(), function (tx, event, record_id) {
						self.settings.status_bar._setStatusDataTransfer('record deleted: ' + record_id, false);
						//grid.deleteSelectedRows();
						helpers.disableButtonActions();
					}, function (tx, event, error_message) {
						self.settings.status_bar._setStatusError(error_message);
					});
				}
			}
		});
	}
	
	this.render= function () {
		try {
			$dhx.showDirections("starting "+controller.appId+" ... ");
			_layout();
			_tab();
			_grid( );
			//_menu();
			_ribbon();
			
			// ====== lets use the table events
			schema.attachEvent('onAfterCursorChange', function (cursor_id) {
				helpers.enableButtonActions();
				self.settings.status_bar._setStatusDataTransfer('selected: ' + cursor_id, false);
			});
			schema.attachEvent('onBeforeCursorChange', function (cursor_id) {
				//console.log('before set cursor');
			});
			schema.attachEvent('onAfterAdd', function (records, rows_affected) {
				that.view.helpers.enableButtonActions();
				that.settings.status_bar._setStatusDataTransfer('added: ' + rows_affected + ' records', false);
			});
			schema.attachEvent('onBeforeAdd', function () {
				//console.log('before add record');
			});
			
			
			self.settings.status_bar._setStatusDataTransfer('counting records', true);
			schema.count(  function( tx, event, total ){
				self.settings.status_bar._setStatusDataTransfer('got total records', false);
				self.settings.status_bar._setStatus('total records: ' + total);
			}, function( tx, event, error_message ){
				self.settings.status_bar.setText('error when counting records: ' + error_message);
			});	
			$dhx.hideDirections();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
	this.destroy= function () {
		try {
			
			console.log( );
			$dhx.showDirections("starting view ... ");
			schema.unsync.grid({
				component: grid
				, component_id: 'main_grid_' + controller.appId
				, onSuccess: function () {
					//menu.unload();
					//menu = null;
					
					//ribbon.unload();
					//ribbon = null;
					
					grid.destructor();	
					tab.unload();
					tab = null;
					//layout.unload();
					//layout = null;
				}
				, onFail: function () {
					self.settings.status_bar._setStatusError('could not unsync grid');	
				}
			});
			$dhx.hideDirections();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
	
	this.settings = {
		status_bar: {
			template: "<div id='status_info'>Initializing "+controller.appName+"</div><div id='expiration_info' title='time remaining for token expiration' class='expiration_info'></div><div id='user_info'><img id='user_info_status' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvUlEQVR4XpWRy0tbQRjFz9yH3hgtruzGRqRx47aoaxvBdboo7qTtrst2WRAfDcZo/wAR/BPiRroouHHZFqmCT9DEV0uiYmjD9OZO5k5nRiPk0Rvyg8vhG74535nvEtSQTC6mXdeNozlwHGetzmB6es6fmvpAJAhCCIHZ2QQs1KMvPx5+jSByX1e1klYi/2E2ds5K2D7IaoOZmY93kSWiGapH9oqB0beiZ+iVkOjaajUyZVW7qd7BYLQXBiEwTAMED406cgU71AlWoo0N/roeTNOEadnwhY9C4Tc8z6uaSAv5/yfwfFNOd+QlIs0YyrwNjLGGT5E7UW8XVQa3lKM9bMF2OuG0AcwtAoTgHbaQjfVhEpC6ggqxnqdZqyae/mp50XWJJ2vbIB1hnI1HEVnfQzn3E3gz1q/+pc85F0FknkcEZ54u2HVOK6dFfU5SqU9pSmkcAUxu6tg6hfmoG+WbPC5eDkEzv5B4f3xyxL9sfBaHR/tC6daPb/f6XamapCcqWP6XVl5y9blFCJZOMscIOSGcnmdgWTaub65gGIbUPGxZKwRj8M0SLiZGHnagIMlUQqAJz3Y3ET3fRwOW/wEKrjnBHaxMrAAAAABJRU5ErkJggg==' /> <span>Not authorized yet</span></div><div id='data_transfer_info'> no data transferred</div><div id='socket_info' class='data_transfer_info'>socket: disconnected</div><div id='errors_info'>no errors</div>"
			, _setStatus: function (m) {
				document.getElementById("status_info").innerHTML = m;
			}
			, _setStatusError: function (m) {
				document.getElementById("errors_info").innerHTML = m;
			}
			
			, _setStatusDataTransfer: function (m, isActive) {
				/*dhtmlx.message({
					text: m
				});*/
				if (isActive) {
					document.getElementById("data_transfer_info").innerHTML = m;
					document.getElementById("data_transfer_info").style.backgroundImage = "url(" + $dhx.ui.crud.simple.View.settings.icons_path + "network.gif)";
				}
				else {
					document.getElementById("data_transfer_info").innerHTML = m;
					document.getElementById("data_transfer_info").style.backgroundImage = "url(" + $dhx.ui.crud.simple.View.settings.icons_path + "network-accept.png)";
				}
			}
			
			, _setStatusSocket: function (m, isOffline) {
				dhtmlx.message({
					text: m
				});
				document.getElementById("socket_info").innerHTML = "socket: " + m;
				document.getElementById("socket_info").style.backgroundImage = "url(" + $dhx.ui.crud.simple.View.settings.icons_path + "socket.gif)";
				if (isOffline)
					document.getElementById("socket_info").style.backgroundImage = "url(" + $dhx.ui.crud.simple.View.settings.icons_path + "socket_disconnected.png)";
			}
			
			, _setStatusUser: function (m, ok) {
				if (typeof ok === 'undefined') {
					ok = true;
				}
				document.getElementById("user_info").getElementsByTagName("span")[0].innerHTML = m;
				if (ok) {
					document.getElementById("user_info_status").src = "" + $dhx.ui.crud.simple.View.settings.icons_path + "online.png";
					//dhtmlx.message({
					//	text: m
					//});
				}
				else {
					document.getElementById("user_info_status").src = "" + $dhx.ui.crud.simple.View.settings.icons_path + "offline.png";
					dhtmlx.message({
						type: "error"
						, text: m
					});
				}
			}
		}
	}
};