$dhx.ui.desktop.settings = {
	version: '1.0.3'
	, base_path: ""
	, application_path: ""
	, icons_path: ""
	, dhtmlx_codebase_path: ""
	, menu_contextual: {
		icons_path: ''
		, context: true
			//,parent : ''
		
		, onload: function () {
			// console.log("menu loaded");
		}
		, onclick: function (id) {
			// console.log("menu clicked, id="+id);
		}
		, items: [{
			id: "settings"
			, text: $dhx.ui.language.Settings
			, items: [{
					id: "idiom"
					, text: $dhx.ui.language.SelectIdiom
					, img: 'editor.png'
					, items: [{
						id: 'portuguese'
						, text: $dhx.ui.language.Portuguese
						, img: "flags/pt-br.png"
						, type: 'radio'
						, group: "idiom"
						, checked: ($dhx.ui.i18n.getUserIdiom() == 'pt-br') ? true : ($dhx.ui.i18n.idiom == 'pt-br' ? true : false)
					}, {
						id: "sep1670"
						, type: "separator"
					}, {
						id: "english"
						, text: $dhx.ui.language.English
						, img: "flags/en.png"
						, type: 'radio'
						, group: "idiom"
						, checked: ($dhx.ui.i18n.getUserIdiom() == 'en-us') ? true : ($dhx.ui.i18n.idiom == 'en-us' ? true : false)
					}]
				}
				, {
					id: "skin"
					, text: $dhx.ui.language.Selectskin
					, img: 'skin.png'
					, items: [
						{
							id: "Unity"
							, text: 'Unity'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'Unity') ? true : false
								) : true
						}, {
							id: "sep1670911"
							, type: "separator"
						},
						{
							id: 'dhx_skyblue'
							, text: 'skyblue'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'dhx_skyblue') ? true : false
								) : false
						}, {
							//skin_subset
							id: "light-green"
							, text: 'light-green'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'light-green') ? true : false
								) : false
						}, {
							id: "clouds"
							, text: 'clouds'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'clouds') ? true : false
								) : false
						}, {
							id: "pink-yellow"
							, text: 'pink-yellow'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'pink-yellow') ? true : false
								) : false
						}, {
							id: "sep16709"
							, type: "separator"
						}, {
							id: "dhx_terrace"
							, text: 'terrace'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_terrace' && $dhx.ui.getUserSkin().skin_subset == 'dhx_terrace') ? true : false
								) : false
						}, {
							id: "terrace-blue"
							, text: 'terrace-blue'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_terrace' && $dhx.ui.getUserSkin().skin_subset == 'terrace-blue') ? true : false
								) : false
						}, {
							id: "sep167094"
							, type: "separator"
						}, {
							id: "dhx_web"
							, text: 'web'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_web' && $dhx.ui.getUserSkin().skin_subset == 'dhx_web') ? true : false
								) : false
						}
						, {
							id: "web-green"
							, text: 'web-green'
							, type: 'radio'
							, group: "skin"
							, checked: ($dhx.ui.getUserSkin()) ?
								(
									($dhx.ui.getUserSkin().skin == 'dhx_web' && $dhx.ui.getUserSkin().skin_subset == 'web-green') ? true : false
								) : false
						}
						//
					]
				}
			]
		}, {
			id: "help"
			, text: $dhx.ui.language.Help
			, items: [{
				id: "quick_help"
				, text: $dhx.ui.language.QuickHelp
				, img: "help.gif"
			}, {
				id: "sep189000"
				, type: "separator"
			}, {
				id: "bug_report"
				, text: $dhx.ui.language.ReportBug
				, img: "bug_reporting.png"
			}]
		}, {
			id: "about"
			, text: $dhx.ui.language.About
			, img: "about.png"
		}]
	}
	
	, menu_contextual_idiom: {
		icons_path: ''
		, context: true
			//,parent : ''
		
		, onload: function () {
			// console.log("menu loaded");
		}
		, onclick: function (id) {
			// console.log("menu clicked, id="+id);
		}
		, items: [{
			id: 'portuguese'
			, text: $dhx.ui.language.Portuguese
			, img: "flags/pt-br.png"
			, type: 'radio'
			, group: "idiom"
			, checked: ($dhx.ui.i18n.getUserIdiom() == 'pt-br') ? true : ($dhx.ui.i18n.idiom == 'pt-br' ? true : false)
		}, {
			id: "sep1670"
			, type: "separator"
		}, {
			id: "english"
			, text: $dhx.ui.language.English
			, img: "flags/en.png"
			, type: 'radio'
			, group: "idiom"
			, checked: ($dhx.ui.i18n.getUserIdiom() == 'en-us') ? true : ($dhx.ui.i18n.idiom == 'en-us' ? true : false)
		}]
	}
	
	, menu_contextual_programs: {
		icons_path: ''
		, context: true
			//,parent : ''
		
		, onload: function () {
			// console.log("menu loaded");
		}
		, onclick: function (id) {
			// console.log("menu clicked, id="+id);
		}
		, items: [{
			id: 'open'
			, text: $dhx.ui.language.open
		}, {
			id: "sep1670"
			, type: "separator"
		}, {
			id: "close"
			, text: $dhx.ui.language.close
			, disabled: true
		}, {
			id: "sep1671"
			, type: "separator"
		}, {
			id: "minimize_all"
			, text: $dhx.ui.language.minimizeall
		}, {
			id: "close_all"
			, text: $dhx.ui.language.closeall
		}]
	}
	
	, menu_contextual_windows: {
		icons_path: ''
		, onload: function () {
			// console.log("menu loaded");
		}
		, onclick: function (id) {
			// console.log("menu clicked, id="+id);
		}
		, items: [{
			id: "close"
			, text: $dhx.ui.language.close
		}]
	}
	
	, cruder: {
		window: {
			"left": function(){
				return $dhx.getPagePosition("x", 940, 550);	
			}
			, "top": $dhx.getPagePosition("y", 940, 550)
			, "width": 940
			, "height": 550
			, "icon": "form.png"
			, "icon_dis": "form.png"
			, skin: $dhx.ui.skin
		}
	}
	
	,ControlPanel : {
		layout_wallpapers: {
			pattern: "2U", // 3L string, layout's pattern
			skin: $dhx.ui.skin, // string, optional, "dhx_skyblue", "dhx_web", $dhx.ui.skin
		}
		,dataview_wallpapers : {
			type:{
				template:"<img width='99' height='99' src='" + $dhx.ui.desktop.wallpappers_path + "/thumbs/#file#'/>"
				,height:100
				,width : 100
			},
			tooltip:{
				template:"<b>#name#<b><br/>#file#"
			}
		}
		,layout_forms: {
			pattern: "1C", // 3L string, layout's pattern
			skin: $dhx.ui.skin, // string, optional, "dhx_skyblue", "dhx_web", $dhx.ui.skin
		}
		,toolbar_forms: {
			icons_path: "",
			items: [{
					type: "button",
					id: "save",
					text: 'save form settings'
				}]
		}
		,form_forms: {
            "template": [{
                type: "settings",
                position: "label-left",
                labelWidth: 160,
                inputWidth: 230
            }, {
                type: 'block',
                inputWidth: 'auto',
                inputHeight: 'auto',
                list: [
					{
								type: "label",
								label: $dhx.ui.language["Forms global settings"],
								labelWidth: 400,
					}
					
					,{
                        type: 'block',
                        inputWidth: 'auto',
                        inputHeight: 'auto',
                        list: [
							{
								type: 'block',
								inputWidth: 'auto',
								inputHeight: 'auto',
								list: [
									{
										type: "label",
										label: $dhx.ui.language["Capitalize form inputs"]
									}
									,{type: "btn2state", name:'capitalize', label: $dhx.ui.language["capitalize text while typing"], info:true
										, note:{text:$dhx.ui.language.capitalize_note, checked : $dhx.ui.$Session.capitalize}
									}
		
								]
							}, {
								type: 'newcolumn',
								offset: 21
							}, {
								type: 'block',
								inputWidth: 'auto',
								inputHeight: 'auto',
								list: [
									{
										type: "label",
										label: $dhx.ui.language["Latinize form inputs"]
									}
									,{type: "btn2state", name:'latinize', label: $dhx.ui.language["latinize text while typing"], info:true
										, note:{text:$dhx.ui.language.latinize_note, checked : $dhx.ui.$Session.latinize}
									}
								]
							}

                        ]
                    }
                ]
            }]
        }
		,layout_side_bar: {
			pattern: "1C", // 3L string, layout's pattern
			skin: $dhx.ui.skin, // string, optional, "dhx_skyblue", "dhx_web", $dhx.ui.skin
		}
		,tab: {
			//skin:               "dhx_skyblue",  // string, tabbar skin, optional
			mode: "top", // string, top or bottom tabs mode, optional
			align: "left", // string, left or right tabs align, optional
			close_button: true, // boolean, render closing button on tabs, optional
			content_zone: true, // boolean, enable/disable content zone, optional
			onload: function() {}, // function, callback for xml/json, optional
			arrows_mode: "auto", // mode of showing tabs arrows (auto, always)
			tabs: [ // tabs config
			
				{
					id: "wallpapers", // tab id
					text: $dhx.ui.language.Walpapersettings, // tab text
					width: 210, // numeric for tab width or null for auto, optional
					//index:   null,      // numeric for tab index or null for last position, optional
					active: true, // boolean, make tab active after adding, optional
					//enabled: false,     // boolean, false to disable tab on init
					close: false // boolean, render close button on tab, optional
				},{
					id: "forms", // tab id
					text: $dhx.ui.language.Globalformssettings, // tab text
					width: 210, // numeric for tab width or null for auto, optional
					//index:   null,      // numeric for tab index or null for last position, optional
					active: false, // boolean, make tab active after adding, optional
					//enabled: false,     // boolean, false to disable tab on init
					close: false // boolean, render close button on tab, optional
				}/*,{
					id: "side_bar", // tab id
					text: "Side bar configuration", // tab text
					width: 170, // numeric for tab width or null for auto, optional
					//index:   null,      // numeric for tab index or null for last position, optional
					active: false, // boolean, make tab active after adding, optional
					//enabled: false,     // boolean, false to disable tab on init
					close: false // boolean, render close button on tab, optional
				}*/,{
					id: "system", // tab id
					text: $dhx.ui.language.Systeminformations, // tab text
					width: 210, // numeric for tab width or null for auto, optional
					//index:   null,      // numeric for tab index or null for last position, optional
					active: false, // boolean, make tab active after adding, optional
					//enabled: false,     // boolean, false to disable tab on init
					close: false // boolean, render close button on tab, optional
				}
			]
		}
		
		,toolbar_wallpapers: {
			icons_path: "",
			items: [{
					type: "button",
					id: "save",
					text: $dhx.ui.language.setaswallpaper,
					disabled: true,
				}]
		}
	}
};