/*! dhx 2015-06-07 */
$dhx.ui.desktop.view.ControlPanel = {
	version: "1.0.3"
	, appName: "$dhx Web Desktop - Control Panel"
	, appId: "$dhx.ui.desktop.ControlPanel"
	
	, window: null
	, tab: null
	
	, _tab: function () {
		var self = $dhx.ui.desktop.view.ControlPanel;
		//alert();
		self.tab = self.window.attachTabbar($dhx.ui.desktop.settings.ControlPanel.tab);
		//self.status_bar = self.tab.cells('records').attachStatusBar();
		self.tab.attachEvent("onTabClose", function (id) {
			try {
				//self.Record.wrapper.clean( parseInt( id ) );
			}
			catch (e) {
				//console.log(e.stack)	
			}
			return true;
		});
		self.tab.attachEvent("onTabClick", function (id) {
			try {
				if (id == 'system') {
				}
			}
			catch (e) {
				//console.log(e.stack)	
			}
			return true;
		});
	}
	
	
	, _layout_forms: function () {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.layout_forms = self.tab.cells('forms').attachLayout($dhx.ui.desktop.settings.ControlPanel.layout_forms);
		//self.layout_forms.cells('a').hideHeader();
		
	}
	
	, _toolbar_forms: function (schema) {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.toolbar_forms = self.tab.cells('forms').attachToolbar($dhx.ui.desktop.settings.ControlPanel.toolbar_forms);
		self.toolbar_forms.setIconSize(24);
		
	}
	
	, _form_forms: function ( schema ) {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.form_forms = self.tab.cells('forms').attachForm($dhx.ui.desktop.settings.ControlPanel.form_forms.template);
		
		if( $dhx.ui.$Session.capitalize )
		{
			self.form_forms.checkItem('capitalize');	
		}
		if( $dhx.ui.$Session.latinize )
		{
			self.form_forms.checkItem('latinize');		
		}
		
		self.form_forms.attachEvent("onChange", function (name, value){
			var action = self.form_forms.isItemChecked(name);
			dhtmlx.confirm({
					type: "confirm-warning",
					text: 'Do you really want to '+( (action) ? 'enable' : 'disable'  )+' the auto '+name+' feature?',
					ok: $dhx.ui.language.continue, // dhtmlx BUG
					cancel: $dhx.ui.language.cancel,
					callback: function(result) {
						if (result == true) {
							$dhx.ui.$Session[name] = action;
							var new_record = {};
							new_record[name] = action;
							var old_record = {};
							old_record[name] = action ? false : true;
							schema.desktop_config.update(
								$dhx.ui.desktop.user_settings.desktop_config_id
								, new_record
								, old_record
							);
						}
						else
						{
							if(action)
							{
								self.form_forms.uncheckItem(name);
							}
							else
							{
								self.form_forms.checkItem(name);
							}
						}
					}
			});
		});
	}
	
	
	, _layout_side_bar: function () {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.layout_side_bar = self.tab.cells('side_bar').attachLayout($dhx.ui.desktop.settings.ControlPanel.layout_side_bar);
		//self.layout_forms.cells('a').hideHeader();
		
	}
	
	, _layout_system_information: function () {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.layout_system_information = self.tab.cells('system').attachLayout($dhx.ui.desktop.settings.ControlPanel.layout_wallpapers);
		self.layout_system_information.cells('a').setText($dhx.ui.language['Live quota information']);
		self.layout_system_information.cells('b').hideHeader();
		
		console.log( navigator );
		//Notification.permission
		var tpl = '<div><strong>Environment information</strong> \
						<br> Browser:	' + $dhx.Browser.name + '			\
						<br> Version:	' + $dhx.Browser.version +
			'			\
						<br> Browser is online:	' + navigator.onLine + '			\
						<br> Cookie is enabled:	' + navigator.cookieEnabled + '			\
						<br> Language:	' +
			navigator.language + '			\
						<br> Operational System:	' + $dhx.Browser.OS + '			\
						<br><br></div>\
						<div><strong>Notifications permission</strong><br><input type="button" id="dhx_npermission" value="'+Notification.permission+'" onclick="$dhx.ui.desktop.view.ControlPanel.askPermission()" /><br> <br></div>									\
						<div id="dhx_quota"></div>									\
		';
		self.text_system_information = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.preview_wallpaper
			, style: 'width:100%;height:100%;overflow:auto;background:#d9d9d9; padding: 10px; font-size:13px;'
			, class: ''
			, id: '' + $dhx.ui.desktop.view.ControlPanel.appId + ".system_information.text"
			, html: tpl
		});
		self.layout_system_information.cells('b').attachObject(self.text_system_information.id);
	}
	
	,askPermission : function(){
		Notification.requestPermission(function(permission) {
                // Whatever the user answers, we make sure Chrome stores the information
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
				document.getElementById('dhx_npermission').value = permission;
                // If the user is okay, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification('Notification test', {
                        body: 'it is working!'
						,icon: $dhx.ui.cdn_address + 'dhx/ui/imgs/notify.png'
                    });
                }
            });	
	}
	
	, _chart_system_information: function (db) {
		var self = $dhx.ui.desktop.view.ControlPanel;
		if (window.webkitStorageInfo || navigator.webkitTemporaryStorage || navigator.webkitPersistentStorage) {
			self.chart_system_information = self.layout_system_information.cells('a').attachChart({
				view: "bar"
				, value: "#size#"
				, color: "#color#"
				, width: 30
				, radius: 0
				, gradient: "rising"
				, tooltip: {
					template: "#size#"
				}
				, xAxis: {
					template: "'#resource#"
					, title: $dhx.ui.language["quota usage"]
				}
				, yAxis: {
					title: $dhx.ui.language["Size in GB"]
				}
			});
			db._getQuota(function (used, remaining) {
				used = (used / 1024 / 1024 / 1024);
				remaining = (remaining / 1024 / 1024 / 1024);
				var chart_dataset = [{
					size: used.toFixed(5)
					, resource: $dhx.ui.language.used
					, color: "#ee3639"
				}, {
					size: remaining.toFixed(2)
					, resource: $dhx.ui.language.remaining
					, color: "#67c324"
				}];
				self.chart_system_information.parse(chart_dataset, "json");
				document.getElementById('dhx_quota').innerHTML =
					'<strong>Quota information</strong> <br><strong>' +
					$dhx.ui.language.used + '</strong>: ' + used.toFixed(5) + 'GB. <br><strong>' +
					$dhx.ui.language.remaining + '</strong>: ' + remaining.toFixed(2) + 'GB';
			}, function (error) {
				// status_bar._setStatusDataTransfer(error, false);
			});
		}
	}
	
	, _layout_wallpapers: function () {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.layout_wallpapers = self.tab.cells('wallpapers').attachLayout($dhx.ui.desktop.settings.ControlPanel.layout_wallpapers);
		self.layout_wallpapers.cells('a').hideHeader();
		self.layout_wallpapers.cells('b').hideHeader();
		//self.layout_wallpapers.cells('c').hideHeader();
		self.layout_wallpapers.cells('b').setWidth(390);
		//self.task_bar = self.layout.attachStatusBar();
	}
	, _preview_wallpaper: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.ControlPanel;
		self.preview_wallpaper = $dhx.createElement({
			tag_name: 'DIV'
			, parent: that.hidden_wrapper
			, style: 'width:100%;height:100%;overflow:auto;background:#ccc'
			, class: ''
			, id: $dhx.ui.desktop.view.ControlPanel.appId + ".preview_wallpaper"
		});
		self.bmonitor = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.preview_wallpaper
			, style: 'background:#ccc; margin:auto; margin-top:100px;'
			, class: ''
			, id: '' + $dhx.ui.desktop.view.ControlPanel.appId + ".preview_wallpaper.bmonitor"
			, width: 432
			, height: 252
		});
		self.bmonitor.style.background = "url(" + $dhx.ui.desktop.wallpappers_path + "thumbs_g/" + $dhx.ui.desktop.user_settings.wallpaper + ") center center no-repeat";
		self.bmonitor.style.backgroundSize = "432px 252px";
		self.monitor = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.bmonitor
			, style: 'background:url(' + $dhx.ui.desktop.wallpappers_path + 'monitor.png) center center no-repeat'
			, class: ''
			, id: '' + $dhx.ui.desktop.view.ControlPanel.appId + ".preview_wallpaper.bmonitor.monitor"
			, width: 432
			, height: 252
		});
		self.layout_wallpapers.cells('a').attachObject(self.preview_wallpaper.id);
	}
	
	, _toolbar_wallpapers: function (schema) {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.toolbar_wallpapers = self.layout_wallpapers.attachToolbar($dhx.ui.desktop.settings.ControlPanel.toolbar_wallpapers);
		self.toolbar_wallpapers.setIconSize(24);
		self.toolbar_wallpapers.attachEvent("onClick", function (id) {
			//$dhx.ui.desktop.user_settings.wallpaper
			//alert(self.temporaryWallpaper);
			schema.desktop_config.update(
				$dhx.ui.desktop.user_settings.desktop_config_id
				, {
					wallpaper: self.temporaryWallpaper
				}
				, {
					wallpaper: $dhx.ui.desktop.user_settings.wallpaper
				}
				, function () {
					//alert('now')
					try
					{
						$dhx.MQ.publish($dhx.ui.desktop.view.ActiveDesktop.appId, {
							action: 'change wallpaper',
							target: $dhx.ui.desktop.view.ActiveDesktop.active_area.id,
							name: '',
							status: 'success',
							message: 'change wallpaper',
							wallpaper : self.temporaryWallpaper,
							user_id : $dhx.ui.$Session.user_id
						});
					}
					catch(e)
					{
						console.log(e.stack)	
					}
				}
				, function () {
				}
			)
		});
	}
	
	, temporaryWallpaper: ''
	
	, _dataview_wallpapers: function (schema) {
		var self = $dhx.ui.desktop.view.ControlPanel;
		self.dataview_wallpapers = self.layout_wallpapers.cells('b').attachDataView($dhx.ui.desktop.settings.ControlPanel.dataview_wallpapers);
		self.dataview_wallpapers.attachEvent("onItemClick", function (itemId) {
			self.toolbar_wallpapers.enableItem('save');
			self.temporaryWallpaper = this.get(itemId).file ;
			self.bmonitor.style.background = "url(" + $dhx.ui.desktop.wallpappers_path + "thumbs_g/" +  self.temporaryWallpaper + ") center center no-repeat";
			self.bmonitor.style.backgroundSize = "432px 252px";
		});
		schema.desktop_wallpapers.sync.dataview({
			component: self.dataview_wallpapers
			, component_id: $dhx.ui.desktop.view.ControlPanel.appId + '.dataview_wallpapers'
			, onSuccess: function () {
			}
			, onFail: function () {
			}
		});
		self.layout_wallpapers.cells('b').attachStatusBar().setText($dhx.ui.language.Click_on_a_wallpaper_to_preview);
	}
	
	,close : function(){
		var that = $dhx.ui.desktop
			, self = $dhx.ui.desktop.view.ControlPanel;
		self.window.close();
	}
	
	, render: function ( c ) {
		var that = $dhx.ui.desktop
			, self = $dhx.ui.desktop.view.ControlPanel
			, db = $dhx.ui.data.model.db[that.database]
			, schema = $dhx.ui.data.model.db[that.database].schema;
			
			
		if(self.window)
		{
			self.window.show();
            self.window.bringToTop();
            return;
		}
			
		self.window = that.view._window({
			appId: $dhx.ui.desktop.view.ControlPanel.appId
			, summary: $dhx.ui.language.ControlPanel
			, onClose: function () {
				self.window = false;
				
				if( c && c.onClose )
				{
					c.onClose();	
				}
				
				schema.desktop_wallpapers.unsync.dataview({
					component: self.dataview_wallpapers
					, component_id: $dhx.ui.desktop.view.ControlPanel.appId + '.dataview_wallpapers'
					, onSuccess: function () {
					}
					, onFail: function () {
					}
				});
			}
		});
		// support for side bar
		self.configuration = {};
		self.configuration.wrapper = self.window; 
		// support for side bar
		
		
		self._tab();

		
		self._layout_wallpapers();
		self._preview_wallpaper();
		self._toolbar_wallpapers( schema );
		self._dataview_wallpapers( schema );
		
		
		self._layout_forms();
		self._form_forms( schema );
		//self._toolbar_forms( schema )
		
		//self._layout_side_bar()
		
		self._layout_system_information();
		self._chart_system_information( db );
		
	}
};