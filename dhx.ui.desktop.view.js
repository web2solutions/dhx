$dhx.ui.desktop.view = {
	version: '1.0.3'
	, appName: '$dhx Web Desktop - view module'
	, appId: '$dhx.ui.desktop.vew'
	
	,window : []
	,window_context_menu : []
	, openedPrograms: []
	,initialY : 30 
	,initialX : 60
	,currentlyY : 30 
	,currentlyX : 60
	,positionIncrease : true
	
	,_window : function( c ){
		var self = $dhx.ui.desktop.view, appId = c.appId;
		
		var settings = {
            id: appId,
            left: self.currentlyX,
            top: self.currentlyY,
            width: $dhx.ui.desktop.settings.cruder.window.width,
            height: $dhx.ui.desktop.settings.cruder.window.height,
        };
		
		if( self.positionIncrease )
		{
			self.currentlyX = self.currentlyX + 60;
			self.currentlyY = self.currentlyY + 30;
		}
		
		if( !self.positionIncrease )
		{
			self.currentlyX = self.currentlyX - 60;
			self.currentlyY = self.currentlyY - 30;
		}
		
		if(  self.currentlyX <= self.initialX )
		{
			self.positionIncrease = true;
		}
		
		if(  self.currentlyY >= ( window.innerHeight -300) )
		{
			self.positionIncrease = false;
		}
		
		self.window[appId] = new $dhx.ui.window(settings);
		self.window[ appId ].attachEvent("onClose", function(win)
		{
			if(c.onClose)
			{
				c.onClose();
			}
			delete self.window[appId];
			//console.log( self.openedPrograms[ c.collection ] );
			return true;
		});
		self.window[ appId ].setText(c.summary);
		//console.log( 'end  window' );
		//self.status_bar = self.window[ appId ].attachStatusBar();
		//self.status_bar.setText('search is case and special chars insentive');
		self._window_context_menu( c );
				
		return self.window[ appId ];
	}
	
	
	,_window_context_menu : function( c ){
		var self = $dhx.ui.desktop.view, appId = c.appId;
		self.window_context_menu[ appId ] = self.window[ appId ].attachContextMenu($dhx.ui.desktop.settings.menu_contextual_windows);
		self.window_context_menu[ appId ].attachEvent("onClick", function (id)
		{
			if (id == 'close')
			{
				self.openedPrograms[c.collection].close()
			}
			else if (id == 'close_all')
			{
				for(var w in that.openedPrograms)
				{
					if(self.openedPrograms.hasOwnProperty( w))
					{
						console.log(w);
						self.openedPrograms[w].close();
					}
				}
			}
		});

	}
	
	,disableAllOpenShortcuts : function( appId ){
		try
		{
			var self = $dhx.ui.desktop.view;
			self.SideBar.programs_contextual_menu[ appId ].setItemDisabled('open');
		}catch(e)
		{
			//console.log(e.stack);
		}
	}
	
	,enableAllOpenShortcuts : function( appId ){
		try
		{
			var self = $dhx.ui.desktop.view;
			self.SideBar.programs_contextual_menu[ appId ].setItemEnabled('open')
		}catch(e)
		{
			//console.log(e.stack);
		}
	}
	
	,disableAllCloseShortcuts : function( appId ){
		try
		{
			var self = $dhx.ui.desktop.view;
			self.SideBar.programs_contextual_menu[ appId ].setItemDisabled('close');
		}catch(e)
		{
			//console.log(e.stack);
		}
	}
	
	,enableAllCloseShortcuts : function( appId ){
		try
		{
			var self = $dhx.ui.desktop.view;
			self.SideBar.programs_contextual_menu[ appId ].setItemEnabled('close');
		}catch(e)
		{
			console.log(appId, e.stack);
		}
	}
	
	,openCruder : function(c){
		var self = $dhx.ui.desktop.view, appId = c.appId;
		//alert(self.openedPrograms[c.collection])
		if( typeof self.openedPrograms[c.collection] === 'undefined' )
		{
			c.onClose = function(){
				$dhx.ui.crud.controller[appId].destroy();
				//console.log( self.openedPrograms[ c.collection ] );
				delete self.openedPrograms[ c.collection ];
				
				self.enableAllOpenShortcuts( appId );
				self.disableAllCloseShortcuts( appId );
			}
			
			self.openedPrograms[c.collection] = new $dhx.ui.crud.simple({
				wrapper : $dhx.ui.desktop.view._window( c )
				,database: c.database
				, collection: c.collection
				, base_path: $dhx.ui.cdn_address
			});
			
			self.disableAllOpenShortcuts( appId );
			self.enableAllCloseShortcuts( appId );
		}
		else
		{
			$dhx.ui.desktop.view.window[appId].show();
			$dhx.ui.desktop.view.window[appId].bringToTop();
			return;
		}
	}
	
	
	,openInternalProgram : function(c){
		var self = $dhx.ui.desktop.view, appId = c.appId;
		//alert(self.openedPrograms[c.collection])
		if( typeof self.openedPrograms[c.collection] === 'undefined' )
		{
			//alert(c.module.window)
			self.openedPrograms[c.collection] = c.module;
			c.onClose = function(){
				delete self.openedPrograms[ c.collection ];
				self.enableAllOpenShortcuts( appId );
				self.disableAllCloseShortcuts( appId );
			}
			//console.log(c)
			c.module.render( c );
			
			self.disableAllOpenShortcuts( appId );
			self.enableAllCloseShortcuts( appId );
		}
		else
		{
			self.openedPrograms[c.collection].render( c );
			return;
		}
	}
	
	, render: function () {
		var that = $dhx.ui.desktop
			, self = $dhx.ui.desktop.view;
		try {
			$dhx.showDirections("starting view ... ");
			$dhx.ui._window_manager();
			$dhx.ui.desktop.settings.base_path = $dhx.ui.cdn_address;
			$dhx.ui.desktop.settings.application_path = $dhx.ui.desktop.settings.base_path + "dhx/ui/";
			$dhx.ui.desktop.settings.icons_path = $dhx.ui.desktop.settings.application_path + $dhx.ui.skin + "/";
			$dhx.ui.desktop.settings.menu_contextual.icons_path = $dhx.ui.desktop.settings.application_path + $dhx.ui.skin + "/";
			$dhx.ui.desktop.settings.menu_contextual_idiom.icons_path = $dhx.ui.desktop.settings.application_path + $dhx.ui.skin + "/";
			$dhx.ui.desktop.settings.ControlPanel.toolbar_wallpapers.icons_path = $dhx.ui.desktop.settings.application_path + $dhx.ui.skin + "/";
			/*document.body.oncontextmenu = function(){
				return false;	
			} 
			
			document.onmousedown=function(event)
			{
			  if(event.button==2)
			   {
				 return false;    
			   }
			};*/
			
			self.hidden_wrapper = $dhx.createElement({
				tag_name: 'DIV'
				, style: 'display:none;'
				, class: ''
				, id: '$dhx.wrapper'
			});
			
			
			self.ActiveDesktop.render();
			self.SearchBar.start();
			self.TopBar.render();
			self.SideBar.render();
			
			
			$dhx.hideDirections();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
};