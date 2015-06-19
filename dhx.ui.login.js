/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject, wD */
$dhx.ui.login = {
	version: '1.0.3'
	, appName: '$dhx login plugin'
	, appId: '$dhx.ui.login'
	
	, window: null
	, form: null
	, status_bar: null
	
	, settings: {
		window: {
			"left": $dhx.getPagePosition("x", 400, 200)
			, "top": $dhx.getPagePosition("y", 400, 200)
			, "width": 400
			, "height": 200
			, "icon": "form.png"
			, "icon_dis": "form.png"
			
		}
		, layout: {
			 pattern: "1C"
			
		}
		, form: {
			"template": [{
				type: "settings"
				, position: "label-left"
				, labelWidth: 160
				, inputWidth: 330
			} 
			
			//,{type:"container", name:"t-rex-logo", label:"", inputWidth:330, inputHeight:100}
			
			,{
					type: 'block'
					, inputWidth: 'auto'
					, inputHeight: 'auto'
					, list: [{
							type: "input"
							, name: 'username'
							, label: ''
							, value: ""
							, validate: 'NotEmpty'
							, inputHeight: 30
							, className : 'label_login_user'
						}, {
							type: "password"
							, name: 'password'
							, label: ''
							, value: ""
							, validate: 'NotEmpty'
							, inputHeight: 30
							, className : 'label_login_pass'
						}
					]
			},{
					type: 'block'
					, inputWidth: 'auto'
					, inputHeight: 'auto'
					, list: [
						{
							type: "button"
							, name: 'login'
							//, label: 'Password:',
							, value: $dhx.ui.language.login
							//, position: 'absolute'
							//, offsetLeft: 1
							//, offsetTop: 140
						}
						,{
							type: "newcolumn"
						}
						, {
							type: "button"
							, name: 'forgot'
							//, label: 'Password:',
							, value: $dhx.ui.language.forgot_password
							//, position: 'absolute'
							//, offsetLeft: 115
							//, offsetTop: 140
						}
					]
			}]
		}
	}
	
	
	, _block_area: function () {
		var that = $dhx.ui
			, self = $dhx.ui.login;
		self.block_area = $dhx.createElement({
			tag_name: 'DIV'
			, style: ''
			, class: 'dhx_ui_desktop_login_block_area'
			, id: '$dhx.ui.desktop.login.block_area'
			, width: window.innerWidth
			, height: window.innerHeight
			, resize_width: true
			, resize_height: true
		});
	}
	
	, _window: function (c) {
		var that = $dhx.ui
			, self = $dhx.ui.login;
		if (that.window_manager.isWindow($dhx.ui.login.appId + '.window')) {
			self.window.show();
			self.window.bringToTop();
			return;
		}
		
		
		var settings = {
			id: $dhx.ui.login.appId + '.window'
			, left: $dhx.ui.login.settings.window.left
			, top: $dhx.ui.login.settings.window.top
			, width: $dhx.ui.login.settings.window.width
			, height: $dhx.ui.login.settings.window.height
		};
        self.window= new $dhx.ui.window(settings);
		
		
		
		
		self.window.button('stick').hide();
		//self.window.button('sticked').hide();
		//self.window.button('park').hide();
		self.window.button('minmax').hide();
		//self.window.button('close').hide();
		self.window.button('stick').hide();
		//self.window.button('dock').hide();
		
		self.window.hideHeader();
		self.window.denyResize();
		
		self.window.attachEvent("onClose", function (win) {
			return true;
		});
		self.window.setText("Login");
		//self.window.setIcon(self.model.window.icon, self.model.window.icon_dis);
		
	}
	
	
	
	

	
	
	, _layout: function (c) {
		var that =$dhx.ui
			, self = $dhx.ui.login;

		self.layout = self.window.attachLayout($dhx.ui.login.settings.layout);
		self.layout.cells('a').hideHeader()
		self.status_bar = self.layout.attachStatusBar();
	}
	
	, _form: function (c) {
		var that =$dhx.ui
			, self = $dhx.ui.login;

		self.form = self.layout.cells('a').attachForm($dhx.ui.login.settings.form.template);
		
		
		self.form.getInput('username').placeholder = $dhx.ui.language.username;
		self.form.getInput('password').placeholder = $dhx.ui.language.password;
		
		//self.form.getInput('username').style.paddingLeft = '30px';
		
		
		//self.form.getContainer("t-rex-logo").innerHTML = "<img src='"+$dhx.ui.cdn_address+"dhx/ui/desktop/assets/images/login.png' />";
		//self.form.getContainer("t-rex-logo").setAttribute('class','t-rex-logo');
		//self.form.getContainer("t-rex-logo").style.height = '140px';
		
		
		$dhx.dhtmlx.prepareForm($dhx.ui.login.appId + ".form", $dhx.ui.login.settings.form, self.form);
		self.form.attachEvent("onButtonClick", function (name) {
			if(name == 'login')
			{
				if ($dhx.dhtmlx.validateForm($dhx.ui.login.appId + ".form", self.form)) {
					self._login(c);
				}
			}
			if(name == 'forgot')
			{
				alert('not implemented yet');
			}
			
		});
		
		
		self.form.attachEvent("onKeyDown",function(inp, ev, name, value){
			if(ev.keyCode == 13 || ev.keyCode == '13')
			{
				if ($dhx.dhtmlx.validateForm($dhx.ui.login.appId + ".form", self.form)) {
					self._login(c);
				}
			}
		});
		
		
		self.form.setFocusOnFirstActive();
	}
	
	, _login: function (c) {
		var that =$dhx.ui
			, self = $dhx.ui.login;
		self.status_bar.setText("trying to login ...");
		self.window.progressOn();
		var hash = self.form.getFormData();
		$dhx.cookie.set("apitemp", $dhx.crypt.base64_encode($dhx.crypt.base64_encode(hash['username']) + ":" + $dhx.crypt.SHA2(navigator.userAgent + "_" + $dhx.crypt
			.SHA2(hash['password']))), $dhx.REST.API.date_expiration / 1000);
		$dhx.REST.API.authorize({
			onSuccess: function (request) {
				try
				{
					document.body.style.background = "";
					document.body.style.backgroundSize = '';
					
					self.window.close();
					self.block_area.style.display = 'none';
					
					$dhx.ui.$Session.start();
					
					if( c.onGranted )
					{
						c.onGranted();	
					}
				}catch(e)
				{
					console.log(e.stack)	
				}
				
			}
			, onFail: function (request) {
				//console.log(request);
				try {
					var json = JSON.parse(request.response);
					self.status_bar.setText(json.response);
					//dhtmlx.message( {type : "error", text : json.response} );
				}
				catch (e) {
					self.status_bar.setText('unknow server error');
					//dhtmlx.message( {type : "error", text : 'unknow server error'} );
				}
				self.window.progressOff();
			}
		});
	}
	
	, render: function (c) {
		var self = $dhx.ui.login;
		document.body.style = 'font-family:UbuntuRegular; font-size:14px;';
		document.body.style.background = "url(" + $dhx.ui.desktop.wallpappers_path + "unity.jpg) center center no-repeat";
		document.body.style.backgroundSize = 'cover';
		
		
		if(self.block_area)
		{
			self.block_area.style.display = 'block';
		}
		else
		{
			self._block_area(c);
		}
		
		
		self._window(c);
		self._layout(c);
		self._form(c);
	}
};