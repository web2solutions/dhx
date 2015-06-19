/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXWindows, jQuery, document */
$dhx.ui = {
	version: '1.0.3'
	, skin: "dhx_skyblue"
	, skin_subset: 'Unity'
	, cdn_address: $dhx.CDN
	, require: function (dependencies, callBack) {
		'use strict';
		$dhx.onDemand.load(dependencies, function () {
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
			dependencies = [],
			skin = null,
			core_deps = [];
			
		self.database = c.database;
		if (c.require) {
			if ($dhx.isArray(c.require)) {
				dependencies = c.require;
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
			$dhx.environment = "test";
			$dhx.ui.cdn_address = '//mac.web2.eti.br/';
		}
		else if (window.location.host.indexOf('api.web2.eti.br') != -1) {
			$dhx.environment = "production";
		}
		else {
			$dhx.environment = "production";
		}
		if (c.dhtmlx) {
			if (typeof window.dhx4 === 'undefined') {
				//alert($dhx.ui.skin);
				//alert($dhx.ui.skin_subset);
				//dependencies.push($dhx.ui.cdn_address + "dhx/ui/css/dhx.ui.css");
				//if (c.desktop) {
					//dependencies.push($dhx.ui.cdn_address + "dhx/ui/css/dhx.ui.desktop.css");
				//}
				if (self.skin == 'dhx_skyblue') {
					if (self.skin_subset == 'light-green') {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/light-green/dhtmlx.css");
					}
					else if (self.skin_subset == 'clouds') {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/clouds/dhtmlx.css");
					}
					else if (self.skin_subset == 'Unity') {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/Unity/dhtmlx.css");
					}
					else if (self.skin_subset == 'pink-yellow') {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/pink-yellow/dhtmlx.css");
					}
					else {
						dependencies.push($dhx.ui.cdn_address + "codebase4.2_std/dhtmlx.css");
					}
				}
				else if (self.skin == 'dhx_terrace') {
					if (self.skin_subset == 'terrace-blue') {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/terrace-blue/dhtmlx.css");
					}
					else {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/terrace/dhtmlx.css");
					}
				}
				else if (self.skin == 'dhx_web') {
					if (self.skin_subset == 'web-green') {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/web-green/dhtmlx.css");
					}
					else {
						dependencies.push($dhx.ui.cdn_address + "dhx/ui/skins/web/dhtmlx.css");
					}
				}
				//
				dependencies.push($dhx.ui.cdn_address + "codebase4.2_std/dhtmlx.js");
			}
		}
		
		//
		
		dependencies.push($dhx.ui.cdn_address + "dhx/dhx.REST.js");
		dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.login.js");
		dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.Session.js");
		dependencies.push($dhx.ui.cdn_address + "dhx/dhx.socket.js");
		dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.dhxPDF.js");


		if (c.desktop) {
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.settings.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.ActiveDesktop.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.TopBar.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.SideBar.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.ControlPanel.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.desktop.view.SearchBar.js");
		}
		if (typeof $dhx.ui.data == 'undefined') {
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.data.js");
		}
		if (typeof $dhx.dataDriver == 'undefined') {
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.dataDriver.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/latinize.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.MQ.js");
		}
		if (typeof $dhx.ui.crud == 'undefined') {
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.settings.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.Record.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.FormWindow.js");
			dependencies.push($dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.Search.js");
		}
		if (typeof jQuery === 'undefined') {
			dependencies.push($dhx.ui.cdn_address + "dhx/ui/js/jquery-1.11.1.min.js");
		}
		// Currency mask - shall to be loaded after JQUERY only
		dependencies.push($dhx.ui.cdn_address + "dhx/ui/js/jquery.price_format.1.7.min.js");
		//typeof window.JSON === 'undefined' ?
		dependencies.unshift($dhx.ui.cdn_address + "dhx/ui/js/json3.min.js"); // : "";


		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.shortcut.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.Request.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.cookie.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.dhtmlx.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.crypt.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.Encoder.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.i18n.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.i18n.pt-br.js");
		core_deps.push($dhx.ui.cdn_address + "dhx/dhx.ui.i18n.en-us.js");
		$dhx.ui.require(core_deps, function () {
			$dhx.ui.i18n.start();
			$dhx.ui.require(dependencies, function () {
				$dhx.init();

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


				self._window_manager();
				if ($dhx._enable_log)
				{
					console.info('starting $dhx.ui');
				}
				
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

				//self.temp

				/*$dhx.ui.data.model.start({
					db: c.db
					, version: c.version
					, schema: c.schema
					, settings: c.settings
					, records: c.records
					, output_tables: c.output_tables
					, onSuccess: function () {
						// call onStart for $dhx.ui.start()
						if (c.onStart) c.onStart();
					}
					, onFail: function () {}
				})*/

				if (c.onStart)
				{
					c.onStart();
				}
			});
		});
	}
};
$dhx.ui.helpers = {
	column: {
		toFormField: function (column) {
			/*
			name: 'group'
								, numeric_scale: null
								, "default": "usuario"
								, unique: false
								, format: ""
								, has_fk: true
								, dhtmlx_grid_type: "co"
								, index: true
								, dhtmlx_grid_sorting: "str"
								, required: true
								, validation: ""
								, numeric_precision: null
								, dhtmlx_form_type: "input"
								, type: "character varying"
								, foreign_table_name: "groups"
								, dhtmlx_grid_align: "left"
								, is_fk: false
								, is_nullable: "NO"
								, dhtmlx_grid_width: "*"
								, dhtmlx_grid_header: "group"
								, ordinal_position: 5
								, foreign_column_name: "group"
								, dhtmlx_grid_footer: ""
								, maxlength: "255"

			*/
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
			
			
			
			//console.log( field );
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
