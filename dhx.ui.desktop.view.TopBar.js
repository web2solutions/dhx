$dhx.ui.desktop.view.TopBar = {
	version: '1.0.3'
	, appName: '$dhx Web Desktop - Top Bar'
	, appId: '$dhx.ui.desktop.TopBar'
	
	, top_bar: null
	

	, _idiom_contextual_menu: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.TopBar;
		self.idiom_contextual_menu = new dhtmlXMenuObject($dhx.ui.desktop.settings.menu_contextual_idiom);
		self.idiom_contextual_menu.addContextZone(self.top_bar_quick_tools_idioms.id);
		self.idiom_contextual_menu.attachEvent("onClick", function (id) {
			if (id == 'portuguese') {
				$dhx.ui.i18n.setUserIdiom('pt-br');
			}
			else if (id == 'english') {
				$dhx.ui.i18n.setUserIdiom('en-us');
			}
		});
	}
	
	, _top_bar: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.TopBar;
			//console.log(that.ActiveDesktop.active_area);
		self.top_bar = $dhx.createElement({
			tag_name: 'DIV'
			//, parent: that.ActiveDesktop.active_area
			, style: ''
			, class: 'dhx_ui_desktop_top_bar'
			, id: '$dhx.ui.desktop.active_area.top_bar'
			, width: window.innerWidth
			, height: 24
			, resize_width: true
		, });
		
	}
	
	, _top_bar_left_text: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.TopBar;
		self.top_bar_left_text = $dhx.createElement({
			tag_name: 'DIV'
			//, parent: self.top_bar
			, style: ''
			, class: 'dhx_ui_desktop_top_bar_left_text'
			, id: '$dhx.ui.desktop.active_area.top_bar.left_text'
			, html: 'T-Rex webOS'
		});
	}
	
	, _top_bar_quick_tools: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.TopBar;
		self.top_bar_quick_tools = $dhx.createElement({
			tag_name: 'DIV'
			//, parent: self.top_bar
			, style: ''
			, class: 'dhx_ui_desktop_top_bar_quick_tools'
			, id: '$dhx.ui.desktop.active_area.top_bar.quick_tools'
		});
		
		self.top_bar_quick_tools_settings = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.top_bar_quick_tools
			, style: ''
			, class: 'dhx_ui_desktop_top_bar_quick_tools_settings'
			, id: '$dhx.ui.desktop.active_area.top_bar.quick_tools.settings'
			, width: 30
			, title : $dhx.ui.language.click_to_open_control_panel
		});
		
		self.top_bar_quick_tools_settings.onclick = function(){
			$dhx.ui.desktop.view.ControlPanel.render();
		};
		
		self.top_bar_quick_tools_clock = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.top_bar_quick_tools
			, style: ''
			, class: 'dhx_ui_desktop_top_bar_quick_tools_clock'
			, id: '$dhx.ui.desktop.active_area.top_bar.quick_tools.clock'
		});
		$dhx.ui.helpers.clock('$dhx.ui.desktop.active_area.top_bar.quick_tools.clock');
		self.top_bar_quick_tools_transfers = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.top_bar_quick_tools
			, style: ''
			, class: 'dhx_ui_desktop_top_bar_quick_tools_transfers'
			, id: '$dhx.ui.desktop.active_area.top_bar.quick_tools.transfers'
		});
		
		self.top_bar_quick_tools_idioms = $dhx.createElement({
			tag_name: 'DIV'
			, parent: self.top_bar_quick_tools
			, style: ''
			, class: 'dhx_ui_desktop_top_bar_quick_tools_idioms'
			, id: '$dhx.ui.desktop.active_area.top_bar.quick_tools.idioms'
			, html: $dhx.ui.i18n.idiom
			, title : $dhx.ui.language.right_click_to_select_a_language
		});
		self._idiom_contextual_menu();
		
		self.top_bar_quick_tools_idioms.onclick = function(event){
			console.log(event.clientX, event.clientY);
			self.idiom_contextual_menu.showContextMenu(event.clientX, event.clientY);
		}
	
	}

	
	, render: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.TopBar;
		try {
			self._top_bar();
			self._top_bar_left_text();
			self._top_bar_quick_tools();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
};