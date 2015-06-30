$dhx.ui.desktop.view.ActiveDesktop = {
	version: '1.0.3'
	, appName: '$dhx Web Desktop - Active Desktop'
	, appId: '$dhx.ui.desktop.ActiveDesktop'
	, div: null
	
	, _active_area: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.ActiveDesktop;
		self.active_area = $dhx.createElement({
			tag_name: 'DIV'
			, style: ''
			, class: 'dhx_ui_desktop_active_area'
			, id: '$dhx.ui.desktop.active_area'
			, width: window.innerWidth
			, height: window.innerHeight
			, resize_width: true
			, resize_height: true
			
		});
		
		self.active_area._subscriber = function (topic, data) {
			if( typeof data.user_id !== 'undefined' )
			{
				if( data.user_id == $dhx.ui.$Session.user_id )
				{
					if (data.target == self.active_area.id) {
						
						$dhx.debug.info( 'Active Area from Active Desktop received message sent to it: ', topic, data );
						
						if (data.action == 'change wallpaper') {
							self.active_area.style.background = "url(" + $dhx.ui.desktop.wallpappers_path +  data.wallpaper +
								") center center no-repeat";
							self.active_area.style.backgroundSize = 'cover';
							
							$dhx.debug.info(self.active_area.id + ' updated ');
						}
					}
				}
			}
		}
		self.active_area._subscriber_token = $dhx.MQ.subscribe(
			$dhx.ui.desktop.view.ActiveDesktop.appId, self.active_area._subscriber
		);
		
		//alert(self.active_area._subscriber_token);
		//self.active_area._subscriber();
		
		
		self._active_area_contextual_menu();
		
		
		self.active_area.style.background = "url( "+ 
			$dhx.ui.desktop.wallpappers_path + $dhx.ui.desktop.user_settings.wallpaper
			+") center center no-repeat";
		self.active_area.style.backgroundSize = "cover";
		
		
		/*self.active_area.addEventListener('drop', function(e){
			// this / e.target is current target element.
			//alert();
		  //if (e.stopPropagation) {
			//e.stopPropagation(); // stops the browser from redirecting.
		  //}
		  	$dhx.debug.log('drop')
		
			//$dhx.debug.log(dragSrcEl.innerHTML);
			$dhx.debug.log(this.innerHTML);
			$dhx.debug.log(e.dataTransfer.getData('text/html'));
		
		  
		  return false;
		}, false);*/
		
	}
	
	, _active_area_contextual_menu: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.ActiveDesktop;
		//$dhx.ui.desktop.settings.menu_contextual.parent = self.active_area.id;
		self.active_area_contextual_menu = new dhtmlXMenuObject($dhx.ui.desktop.settings.menu_contextual);
		self.active_area_contextual_menu.addContextZone(self.active_area.id);
		self.active_area_contextual_menu.attachEvent("onClick", function (id) {
			if (id == 'dhx_terrace') {
				$dhx.ui.setUserSkin('dhx_terrace');
			}
			else if (id == 'dhx_skyblue') {
				$dhx.ui.setUserSkin('dhx_skyblue');
			}
			else if (id == 'dhx_web') {
				$dhx.ui.setUserSkin('dhx_web');
			}
			else if (id == 'web-green') {
				$dhx.ui.setUserSkin('web-green');
			}
			//
			else if (id == 'light-green') {
				$dhx.ui.setUserSkin('light-green');
			}
			else if (id == 'clouds') {
				$dhx.ui.setUserSkin('clouds');
			}
			else if (id == 'Unity') {
                $dhx.ui.setUserSkin('Unity');
            } 
			//
			else if (id == 'pink-yellow') {
				$dhx.ui.setUserSkin('pink-yellow');
			}
			else if (id == 'terrace-blue') {
				$dhx.ui.setUserSkin('terrace-blue');
			}
			//light-green
			else if (id == 'portuguese') {
				$dhx.ui.i18n.setUserIdiom('pt-br');
			}
			else if (id == 'english') {
				$dhx.ui.i18n.setUserIdiom('en-us');
			}
		});
	}
	
	
	
	, render: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.ActiveDesktop;
		try {
			self._active_area();
			
			
			
		}
		catch (e) {
			$dhx.debug.error(e.message, e.stack);;
		}
	}
};