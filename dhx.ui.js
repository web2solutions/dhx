/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */
$dhx.ui = {
	version: '1.0.3'
	, skin: "dhx_skyblue"
	, skin_subset: 'Unity'
	, cdn_address: $dhx.CDN
	, require: function (deps, callBack) {
		'use strict';
		$dhx.onDemand.load(deps, function () {
			if (callBack) {
				callBack();
			}
		});
	}
	, window_manager: null
	, window_manager_is_ready: false
	, _window_manager: function (skin) {
		'use strict';
		var self = $dhx.ui;
		if (self.getUserSkin()) {
			skin = self.getUserSkin();
			self.skin = skin.skin;
			self.skin_subset = skin.skin_subset;
		}
		if (!self.window_manager_is_ready) {
			self.window_manager = new dhtmlXWindows({
				skin: self.skin
			});
			self.window_manager.setSkin(self.skin);
			self.window_manager_is_ready = true;
		}
	}
	, window: function (c) {
		return $dhx.ui.window_manager.createWindow(c);
	}
	, PDFjsLoaded: false

	, setUserSkin: function (skin) {
	  var self = $dhx.ui;
		dhtmlx.confirm({
			type: "confirm-warning"
			, text: $dhx.ui.language.ChangeskinAgreement
			, ok: $dhx.ui.language['continue'], // dhtmlx BUG
			cancel: $dhx.ui.language.cancel
			, callback: function (result) {
				if (result == true) {
					$dhx.ui.skin_subset = skin;
					if (skin == 'terrace-blue') {
						self.skin = 'dhx_terrace';
					}
					else if (skin == 'light-green') {
						self.skin = 'dhx_skyblue';
					}
					else if (skin == 'clouds') {
						self.skin = 'dhx_skyblue';
					}
					else if (skin == 'Unity') {
						self.skin = 'dhx_skyblue';
					}
					else if (skin == 'pink-yellow') {
						self.skin = 'dhx_skyblue';
					}
					else if (skin == 'web-green') {
						self.skin = 'dhx_web';
					}
					else {
						self.skin = skin;
					}
					$dhx.cookie.set("dhx_skin", self.skin, 99999999);
					$dhx.cookie.set("dhx_skin_subset", skin, 99999999);
					location.reload();
				}
			}
		});
	}
	, getUserSkin: function () {
		var skin = false;
		//alert($dhx.cookie.get( "dhx_skin" ))
		if (typeof $dhx.cookie.get("dhx_skin") !== 'undefined') {
			if ($dhx.cookie.get("dhx_skin") != null) {
				skin = {
					skin: $dhx.cookie.get("dhx_skin")
					, skin_subset: $dhx.cookie.get("dhx_skin_subset")
				};
			}
		}
		//alert(skin)
		return skin;
	}
	, start: function (c) {
		'use strict';
		var self = $dhx.ui,
			deps = [],
			skin = null,
			core_deps = [];
			
		self.database = c.database;
		if (c.require) {
			if ($dhx.isArray(c.require)) {
				deps = c.require;
			}
		}
		if (c.skin) {
			self.skin = c.skin.skin;
			self.skin_subset = c.skin.skin_subset;
		}
		if (self.getUserSkin()) {
			//alert();
			skin = self.getUserSkin();
			self.skin = skin.skin;
			self.skin_subset = skin.skin_subset;
		}
		if (window.location.host.indexOf('mac.web2.eti.br') != -1) {
			//alert()
			$dhx.environment = "test";
			$dhx.ui.cdn_address = '//mac.web2.eti.br/';
		}
		else if (window.location.host.indexOf('api.web2.eti.br') != -1) {
			$dhx.environment = "production";
		}
		else {
			$dhx.environment = "production";
		}
		//alert($dhx.environment)
		if (c.dhtmlx) {
			if (typeof window.dhx4 === 'undefined') {
				if (self.skin == 'dhx_skyblue') {
					if (self.skin_subset == 'light-green') {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/light-green/dhtmlx.css");
					}
					else if (self.skin_subset == 'clouds') {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/clouds/dhtmlx.css");
					}
					else if (self.skin_subset == 'Unity') {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/Unity/dhtmlx.css");
					}
					else if (self.skin_subset == 'pink-yellow') {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/pink-yellow/dhtmlx.css");
					}
					else {
						deps.push($dhx.ui.cdn_address + "codebase4.2_std/dhtmlx.css");
					}
				}
				else if (self.skin == 'dhx_terrace') {
					if (self.skin_subset == 'terrace-blue') {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/terrace-blue/dhtmlx.css");
					}
					else {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/terrace/dhtmlx.css");
					}
				}
				else if (self.skin == 'dhx_web') {
					if (self.skin_subset == 'web-green') {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/web-green/dhtmlx.css");
					}
					else {
						deps.push($dhx.ui.cdn_address + "dhx/ui/skins/web/dhtmlx.css");
					}
				}
				deps.push($dhx.ui.cdn_address + "codebase4.2_std/dhtmlx.js");
			}
		}
		
		deps.push($dhx.ui.cdn_address + "dhx/dhx.dataDriver.js");
		deps.push($dhx.ui.cdn_address + "dhx/latinize.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.MQ.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.Session.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.login.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.dhxPDF.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.settings.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.ActiveDesktop.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.TopBar.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.SideBar.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.ControlPanel.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.SearchBar.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.data.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.settings.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.Record.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.FormWindow.js");
		deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.Search.js");
		deps.push($dhx.ui.cdn_address + "dhx/ui/js/jquery-1.11.1.min.js");
		deps.push($dhx.ui.cdn_address + "dhx/ui/js/jquery.price_format.1.7.min.js");
		
		// core deps
		core_deps.push($dhx.ui.cdn_address + "dhx/ui/js/json3.min.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.REST.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.socket.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.network.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.shortcut.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.Request.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.cookie.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.dhtmlx.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.crypt.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.Encoder.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.i18n.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.i18n.pt-br.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.i18n.en-us.js");
		// load core deps
		$dhx.ui.require(core_deps, function () {
			// start language
			$dhx.ui.i18n.start();
			//start network
			$dhx.ui.network.start({
				onSuccess : function(){
					// load other deps
					$dhx.ui.require(deps, function () 
					{
						// init $dhx
						$dhx.init();
		
						// block browser's built in contextual menu
						document.body.oncontextmenu = function(){
							return false;
						};	
						document.onmousedown = function(event)
						{
						  	if( event.button == 2 )
						  	{
								return false;
						   	}
						};
						
						// dhtmlx windows stack
						self._window_manager();
						
						$dhx.debug.info('starting $dhx.ui');
											
						dhtmlXCalendarObject.prototype.langData["en"] = {
							dateformat: "%Y-%m-%d",
							monthesFNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outrubro", "Novembro", "Dezembro"],
							monthesSNames: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
							daysFNames: ["Dormingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
							daysSNames: ["D", "S", "T", "Q", "Q", "S", "S"],
							weekstart: 0,
								weekname: "D" 
						};
						
						window.dhx4.dateLang = "pt";
						window.dhx4.dateStrings = {
							pt: {
								monthFullName: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outrubro", "Novembro", "Dezembro"],
								monthShortName: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
								dayFullName: ["Dormingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
								dayShortName: ["D", "S", "T", "Q", "Q", "S", "S"]
							}
						};
						
						window.dhx4.dateFormat = {
							en: "%Y-%m-%d"
							, pt: "%Y-%m-%d"
						};
						self.dhxPDF();
		
						self.temp = c;
						
						if (c.onStart)
						{
							c.onStart();
						}
					});
				}	
			});
		});
	}
};
$dhx.ui.helpers = {
	column: {
		toFormField: function (column) {
			var field = {
				tooltip: ""
				, mask_to_use: column.format
				, value: column.default
				, maxLength: column.maxlength
				, required: column.required
				, label: column.dhtmlx_grid_header
				, validate: column.validation
					//, options: []

				, name: column.name
				, dhx_prop_text: column.foreign_column_name
				, dhx_table: column.foreign_table_name
				, dhx_prop_value: column.foreign_column_value
				, type: (column.has_fk) ? 'combo' : $dhx.ui.helpers.sqlToDhxFormType(column.type)
			};
			
			if( column.format == 'currency' )
			{
				field['value'] = 0;
				if( field['validate'].indexOf('ValidCurrency') == -1 )
				{
					field['validate'] = ( field['validate'].length > 0 ) ? field['validate'] + ',ValidCurrency' : 'ValidCurrency';
				}
			}
			
			if( column.format == 'date' )
			{
				field['value'] = 0;
				if( field['validate'].indexOf('ValidDate') == -1 )
				{
					field['validate'] = ( field['validate'].length > 0 ) ? field['validate'] + ',ValidDate' : 'ValidDate';
				}
			}
			
			if(column.is_nullable == 'NO')
			{
				if( field['validate'].indexOf('NotEmpty') == -1 )
				{
					field['validate'] = ( field['validate'].length > 0 ) ? field['validate'] + ',NotEmpty' : 'NotEmpty';
				}
			}
			
			if(column.is_fk)
			{
				if( field['validate'].indexOf('NotEmpty') == -1 )
				{
					field['validate'] = ( field['validate'].length > 0 ) ? field['validate'] + ',NotEmpty' : 'NotEmpty';
				}
			}
			
			
			
			//$dhx.debug.log( field );
			return field;
		}
	}

	, sqlToDhxFormType: function ($sql_type) {
		if ($sql_type == 'integer') {
			return 'input';
		}
		else if ($sql_type == 'bigint') {
			return 'input';
		}
		else if ($sql_type == 'numeric') {
			return 'input';
		}
		else if ($sql_type == 'character varying') {
			return 'input';
		}
		else if ($sql_type == 'text') {
			return 'input';
		}
		else if ($sql_type == 'date') {
			return 'calendar';
		}
		else if ($sql_type == 'timestamp without time zone') {
			return 'calendar';
		}
		else if ($sql_type == 'primary_key') {
			return 'hidden';
		}
		else if ($sql_type == 'boolean') {
			return 'btn2state';
		}
		return '';
	}
	
	, sqlToDhxFormMask: function ($sql_type) {
		if ($sql_type == 'integer') {
			return 'integer';
		}
		else if ($sql_type == 'bigint') {
			return 'integer';
		}
		else if ($sql_type == 'numeric') {
			return 'curency';
		}
		else if ($sql_type == 'character varying') {
			return '';
		}
		else if ($sql_type == 'text') {
			return '';
		}
		else if ($sql_type == 'date') {
			return 'date';
		}
		else if ($sql_type == 'timestamp without time zone') {
			return 'time';
		}
		return '';
	}
	
	
	,fieldTypesBySQL: function ($sql_type) {
		if ($sql_type == 'integer') {
			return [
				{ value : 'input', text : 'input' }
				//,{ value : 'slider', text : 'slider' }
			];
		}
		else if ($sql_type == 'bigint') {
			return [
				{ value : 'input', text : 'input' }
				//,{ value : 'slider', text : 'slider' }
			];
		}
		else if ($sql_type == 'numeric') {
			return [
				{ value : 'input', text : 'input' }
				//,{ value : 'slider', text : 'slider' }
			];
		}
		else if ($sql_type == 'character varying') {
			return [
				{ value : 'input', text : 'input' }
				,{ value : 'colorpicker', text : 'colorpicker' }
				,{ value : 'password', text : 'password' }
				,{ value : 'editor', text : 'editor' }
			];
		}
		else if ($sql_type == 'text') {
			return [
				{ value : 'input', text : 'input' }
				//,{ value : 'colorpicker', text : 'colorpicker' }
				//,{ value : 'password', text : 'password' }
				,{ value : 'editor', text : 'editor' }
			];
		}
		else if ($sql_type == 'date') {
			return [
				{ value : 'calendar', text : 'calendar' }
			];
		}
		else if ($sql_type == 'timestamp without time zone') {
			return [
				{ value : 'calendar', text : 'calendar' }
			];
		}
		else if ($sql_type == 'primary_key') {
			return [
				{ value : 'hidden', text : 'hidden' }
			];
		}
		else if ($sql_type == 'boolean') {
			return [
				{ value : 'btn2state', text : 'btn2state' }
				,{ value : 'checkbox', text : 'checkbox' }
			];
		}else
			return [];
	}
	
	
	
	,columnTypesBySQL: function ($sql_type) {
		if ($sql_type == 'integer') {
			return [
				{ value : 'edn', text : 'editable numeric' }
				,{ value : 'ron', text : 'read only numeric' }
				,{ value : 'ro', text : 'read only' }
				,{ value : 'coro', text : 'not editable select box' }
			];
		}
		else if ($sql_type == 'bigint') {
			return [
				{ value : 'edn', text : 'editable numeric' }
				,{ value : 'ron', text : 'read only numeric' }
				,{ value : 'ro', text : 'read only' }
			];
		}
		else if ($sql_type == 'numeric') {
			return [
				{ value : 'edn', text : 'editable numeric' }
				,{ value : 'ron', text : 'read only numeric' }
				,{ value : 'ro', text : 'read only' }
			];
		}
		else if ($sql_type == 'character varying') {
			return [
				{ value : 'ed', text : 'simple editable text' }
				,{ value : 'edtxt', text : 'editable text without html' }
				,{ value : 'ro', text : 'read only' }
				,{ value : 'coro', text : 'not editable select box' }
				//,{ value : 'co', text : 'editable select box' }
				,{ value : 'cp', text : 'color picker' }
				,{ value : 'link', text : 'link' }
			];
		}
		else if ($sql_type == 'text') {
			return [
				{ value : 'txttxt', text : 'editable textarea without html' }
				,{ value : 'ro', text : 'read only' }
			];
		}
		else if ($sql_type == 'date') {
			return [
				{ value : 'dhxCalendar', text : 'calendar' }
				,{ value : 'ro', text : 'read only' }
			];
		}
		else if ($sql_type == 'timestamp without time zone') {
			return [
				{ value : 'dhxCalendar', text : 'calendar' }
				,{ value : 'ro', text : 'read only' }
			];
		}
		else if ($sql_type == 'primary_key') {
			return [
				{ value : 'hidden', text : 'hidden' }
			];
		}
		else if ($sql_type == 'boolean') {
			return [
				{ value : 'ch', text : 'checkbox' }
				,{ value : 'ro', text : 'read only' }
			];
		}else
			return [{ value : '', text : 'please select one' }];
	}
	
	,toSQLname : function( name ){
			try {
				name = name.replace(/ /gi, "_");
				name = name.replace(/[^a-z0-9\_]/gi, '');
				name = name.toLowerCase();
				return name;
			}
			catch (e) {
				console.log(e.stack)
			};
	}
		
	,toSQLtype : function( type ){
			switch (type) 
			{
				case "cp":
					return 'varchar(20)';
					break;
				case "price":
					return 'numeric(16,2)';
					break;
				case "dhxCalendarA":
					return 'date';
					break;
				case "link":
					return 'varchar(max)';
					break;
				case "edn":
					return 'integer';
					break;
				case "txttxt":
					return 'varchar(max)';
					break;
				default:
					return 'varchar(max)';
			}
	}

	, clock: function (where) {
		function checkTime(i) {
			if (i < 10) {
				i = "0" + i
			}; // add zero in front of numbers < 10
			return i;
		}
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = checkTime(m);
		s = checkTime(s);
		document.getElementById(where).innerHTML = h + ":" + m + ":" + s;
		var t = setTimeout(function () {
			$dhx.ui.helpers.clock(where)
		}, 500);
	}
};
