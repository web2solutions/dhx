$dhx.ui.desktop.view.SideBar = {
	version: '1.0.3'
	, appName: 'Side Bar'
	, appId: '$dhx.ui.desktop.SideBar'
	
	, side_bar: null
	, side_button: []
	, programs_contextual_menu : []
	
	
	
	, _programs_contextual_menu: function ( c, div ) {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SideBar,
			appId = c.appId;
		self.programs_contextual_menu[ appId ] = new dhtmlXMenuObject($dhx.ui.desktop.settings.menu_contextual_programs);
		self.programs_contextual_menu[ appId ].addContextZone(div);
		self.programs_contextual_menu[ appId ].attachEvent("onClick", function (id) {
			if (id == 'open') {
				if (c.type == 'cruder') {
					that.openCruder( c );
				}
				else if (c.type == 'internal_application')
				{
					that.openInternalProgram(c);
				}
			}
			else if (id == 'close')
			{
				that.openedPrograms[c.collection].close()
			}
			else if (id == 'close_all')
			{
				for(var w in that.openedPrograms)
				{
					if(that.openedPrograms.hasOwnProperty( w ))
					{
						console.log(w);
						console.log(that.openedPrograms[w]);
						try
						{
							that.openedPrograms[w].close();	
						}
						catch(e)
						{
							
						}
					}
				}
			}
			else if (id == 'minimize_all')
			{
				for(var w in that.openedPrograms)
				{
					if(that.openedPrograms.hasOwnProperty( w))
					{
						console.log(w);
						console.log(that.openedPrograms[w]);
						try
						{
							that.openedPrograms[w].configuration.wrapper.hide();
						}
						catch(e)
						{
							
						}
						
					}
				}
			}
		});
	}
	
	
	, _side_bar: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SideBar;
		var total_pading_top = 25;
		var visible_area_height = window.innerHeight;
		self.side_bar = $dhx.createElement({
			tag_name: 'DIV'
			//, parent: that.ActiveDesktop.active_area
			, style: ''
			, class: 'dhx_ui_desktop_side_bar'
			, id: '$dhx.ui.desktop.active_area.side_bar'
			, width: 66
			, height: visible_area_height
			, resize_height: true
		});
		self.side_bar_nav_top = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.side_bar
			, style: ''
			, class: 'dhx_ui_desktop_side_bar_nav_top'
			, id: '$dhx.ui.desktop.active_area.side_bar_nav_top'
			, width: 66
			, height: 12
		});
		self.side_bar_nav_bottom = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.side_bar
			, style: ''
			, class: 'dhx_ui_desktop_side_bar_nav_bottom'
			, id: '$dhx.ui.desktop.active_area.side_bar_nav_top'
			, width: 66
			, height: 12
		});
		self._side_bar_container();
		self.side_bar_nav_top.addEventListener("click", function (event) {
			self.side_bar_container.scrollTop -= 54;
			//self.side_bar_container.style.transform = 'translateY('+(self.side_bar_container.scrollTop)+'px)';
    		//self.side_bar_container.style.transform += 'translateX('+(event.clientX-25)+'px)';
		});
		self.side_bar_nav_bottom.addEventListener("click", function (event) {
			self.side_bar_container.scrollTop += 54;
			//self.side_bar_container.style.transform = 'translateY('+(self.side_bar_container.scrollTop)+'px)';
    		//self.side_bar_container.style.transform += 'translateX('+(event.clientX-25)+'px)';
		});
	}
	
	, _side_bar_container: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SideBar;
		var total_pading_top = 25;
		var visible_area_height = window.innerHeight;
		var container_h = visible_area_height - total_pading_top;
		self.side_bar_container = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.side_bar
			, style: ''
			, class: 'dhx_ui_desktop_side_bar_container'
			, id: '$dhx.ui.desktop.active_area.side_bar_container'
			, width: 66
			, height: container_h - 12
			, resize_height: -total_pading_top
		});
		self.side_bar_container.style.clip = "rect(12px,66px," + (container_h - 11) + "px,0px)";
		window.addEventListener('resize', function () {
			visible_area_height = window.innerHeight - total_pading_top;
			self.side_bar_container.style.clip = "rect(12px,66px," + (window.innerHeight - 29) + "px,0px)";
		}, true);
	}
	
	
	, _button: function (c) {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SideBar;
		//console.log(c);
		/*
		appName : cruder.appName
					,appId : cruder.appId
					,summary : cruder.summary
					,module : cruder.module
					,icon : cruder.icon
					,database : cruder.database
					,collection : cruder.collection
					,type : 'cruder'
		
		*/
		var tooltip = tooltip = $dhx.strip_tags( c.summary );
		var strIcon = '<img alt="' + tooltip + '" title="' + tooltip + '" width="46" height="46" src="' + $dhx.ui.cdn_address + '/dhx/ui/desktop/assets/icons/' + c
			.icon + '" />';
		var settings = {
			tag_name: 'DIV'
			, parent: self.side_bar_container
			, style: c.style || ''
			, class: 'dhx_ui_desktop_side_button'
			, id: '$dhx.ui.desktop.active_area.side_button.' + c.appId
			, html: (c.icon) ? strIcon : c.html
		};
		self.side_button[c.appId] = $dhx.createElement(settings);
		
		self._programs_contextual_menu( c, self.side_button[c.appId].id );
		
		if (c.type == 'cruder') {
			self.side_button[c.appId].onclick = function (event) {
				//console.log(c);
				that.openCruder( c );
			}
		}
		else if (c.type == 'internal_application') {
			self.side_button[c.appId].onclick = function (event) {
				//console.log(c);
				that.openInternalProgram(c)
			}
		}
	}
	
	, render: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SideBar;
		try {
			$dhx.showDirections("starting view ... ");		
	
			self._side_bar();
			
			
			$dhx.ui.desktop.Registry.programs.push(new $dhx.ui.desktop.application.custom({
				appName: "$dhx Web Desktop - App Central"
				, appId: "$dhx.ui.desktop.AppCentral"
				, summary: ''
				, module: $dhx.ui.desktop.view.SearchBar
				, icon: 'applications.png'
				, database: $dhx.ui.desktop.database
				, collection: 'App central'
			}))
			$dhx.ui.desktop.Registry.programs.push(new $dhx.ui.desktop.application.custom({
				appName: "$dhx Web Desktop - Control Panel"
				, appId: "$dhx.ui.desktop.ControlPanel"
				, summary: $dhx.ui.language.ControlPanel
				, module: $dhx.ui.desktop.view.ControlPanel
				, icon: 'control_panel.png'
				, database: $dhx.ui.desktop.database
				, collection: 'Control panel'
			}))
			
			
			$dhx.ui.desktop.Registry.programs.forEach(function (cruder, index, array) {
				//alert(cruder.database)
				self._button({
					appName: cruder.appName
					, appId: cruder.appId
					, summary: cruder.summary
					, module: cruder.module
					, icon: cruder.icon
					, database: cruder.database
					, collection: cruder.collection
					, type: 'internal_application'
				});
			});
			
			
			$dhx.ui.desktop.Registry.cruders.forEach(function (cruder, index, array) {
				//alert(cruder.database)
				self._button({
					appName: cruder.appName
					, appId: cruder.appId
					, summary: cruder.summary
					, module: cruder.module
					, icon: cruder.icon
					, database: cruder.database
					, collection: cruder.collection
					, column_to_search_id : cruder.column_to_search_id
					, column_to_search_index : cruder.column_to_index
					, type: 'cruder'
				});
			});
			$dhx.hideDirections();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
};