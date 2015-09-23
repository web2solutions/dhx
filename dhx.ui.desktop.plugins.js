/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */


$dhx.ui.desktop.plugins = {
	register : function( appId, plugin ){
		$dhx.ui.desktop.plugins.registered[ appId ] = plugin; 
	}
	, registered : []
	, files : []
	, packages : []
};


$dhx.ui.desktop.plugin = function( c ){
	var plugin = this,
		_tray_icon = null,
		plugin_id = '$dhx.ui.desktop.active_area.top_bar.quick_tools.' + plugin.appName;
	
	this.c = c;
	
	this.appName = c.appName;//'MyPluginName';
	this.summary = c.summary;//'Plugin desc';
	this.appId = c.appId;//window.dhx4.newId();
	
	this.strWindowID = "$dhx.ui.crud.simple.View.window.";
	
	this.tray = c.tray || true;
	this.side_bar = c.side_bar || true;
	this.settings = {
		icon_tray : c.icon || 'foo.png'
		, icon_side_bar : c.icon || 'foo.png'
	};
	
	plugin = this;
	
	this.tray_icon = function(){
		
		return	_tray_icon;
	}
	
	this._view = {
		tray : function(){
			var self = this;
			//console.log(plugin);
			//console.log(this);
			var tray_bar = $dhx.ui.desktop.view.TopBar;
			_tray_icon = $dhx.createElement({
				tag_name: 'DIV'
				, parent: tray_bar.quick_tools
				, style: ''
				, class: 'dhx_ui_desktop_top_bar_quick_tools_plugins'
				, id: plugin_id
				, title : plugin.summary
				, html : '<img title="'+plugin.summary+'" width="18" src="'+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/t_rex_plugins/"+plugin.c.appId.replace(/plugin_/g,'')+"/"+plugin.settings.icon_tray+'"> '
			});
			
			_tray_icon.onclick = function(){
				plugin.view.render( plugin );
			}
		}
		
		,side_bar : function(){
			
		}
	
		,render : function(){
			var self = plugin;
			//console.log('$dhx.ui.desktop.plugin._view.render called');
			self._view.tray();
			self._view.side_bar();
		}
	};
	
	this.destroy = function(){
		var self = this;
		
		var e = document.getElementById(plugin_id);
		e.parentNode.removeChild(e);
		
		if( self.view)
		{
			try{
				self.view.destroy();	
			}
			catch(e)
			{
				
			}
		}
		//delete $dhx.ui.desktop.plugins[ self.appId ];
	}
	
	this.setIcon = function( icon ){
		plugin.settings.icon_tray;
	}
	
	this.init = function(){
		var controller = this, strCssIconWindow = plugin.appId + '_window_icon';
		if( ! $dhx.defined( controller.appName, 'string' ) )
		{
			var error_message = 'The appName is missing. Can not start plugin!';
			console.error(error_message, controller.c);
			dhtmlx.message({
				type: "error",
				text: error_message
			});
			return;	
		}
		plugin.view = controller.view;
		plugin.model = controller.model || {};
		plugin.model.database = $dhx.ui.data.model.db[$dhx.ui.desktop.database]
		
		//console.log($dhx.ui.data);
		//console.log($dhx.ui.data.model);
		//console.log($dhx.ui.data.model.db);
		//console.log();
		
		
		
		//schema = $dhx.ui.data.model.db[$dhx.ui.crud.controller[appId].database].schema[table];
		
		if( $dhx.isObject( controller.c.window ) )
		{
			// add plugin window icon css rule
			var style = document.createElement('style');
			style.type = 'text/css';
			style.innerHTML = 'div.dhxwin_hdr div.dhxwin_icon.'+strCssIconWindow+' { width:18px; height: 18px; display:block; right: 7px; top: 7px;background-size:18px 18px; background-image: url('+$dhx.ui.cdn_address+$dhx.ui.desktop.database +'/t_rex_plugins/'+plugin.c.appId.replace(/plugin_/g,'')+'/'+plugin.settings.icon_tray+'); }';
			document.getElementsByTagName('head')[document.getElementsByTagName('head').length-1].appendChild(style);
			
			plugin.view.window = null;
			plugin.view._window = function(){
				var self = plugin.view,
					left, top, width, height;
					
				if ($dhx.ui.window_manager.isWindow(plugin.strWindowID + plugin.appId)) {
					self.window.show();
					self.window.bringToTop();
					self.window.park();
					return;
				}
		
				left = plugin.c.window.left;
				top = plugin.c.window.top;
				width = plugin.c.window.width;
				height = plugin.c.window.height;

				self.window = new $dhx.ui.window({
					id: plugin.strWindowID + plugin.appId,
					left: left,
					top: top,
					width: width,
					height: height,
				});
				self.window.setIconCss(strCssIconWindow);
				//self.window[plugin.appId].button('park').hide();
				//self.window[plugin.appId].button('minmax').hide();
				//self.window[plugin.appId].button('stick').hide();
				self.window.attachEvent("onClose", function(win) {
					
					return true;
				});
				
				self.window.attachEvent("onParkUp", function(win){
					win.hide();
				});
				
				self.window.setText(plugin.c.appName + ' - ' + plugin.c.summary);
				//self.status_bar = self.window[plugin.appId].attachStatusBar();
			};
		}
		
		
		
		
		controller._view.render();
		
		//console.log( plugin );
		//console.log( controller );
		//console.log( plugin );
	
		//$dhx.ui.desktop.plugins[ self.appId ] = self;
	}
};