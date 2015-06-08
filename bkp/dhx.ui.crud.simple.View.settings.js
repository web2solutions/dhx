/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.crud.simple.View.settings = {
	base_path: ""
	, application_path: ""
	, icons_path: ""
	, dhtmlx_codebase_path: ""
	, layout: {
		//parent: typeof dbDemo.configuration.wrapper === 'undefined' ? document.body : dbDemo.configuration.wrapper, // id/object, parent container where the layout will be located
		parent: document.body
		, pattern: "1C", // string, layout's pattern
		skin: $dhx.ui.skin, // string, optional, "dhx_skyblue", "dhx_web", $dhx.ui.skin
	}
	, menu: {
		icons_path: ''
		, onload: function () {
			// console.log("menu loaded");
		}
		, onclick: function (id) {
			// console.log("menu clicked, id="+id);
		}
		,top_text : '$dhx'
		, items: [{
			id: "file"
			, text: $dhx.ui.language.File
			, items: [{
					id: "insert"
					, text: $dhx.ui.language.New
					, img: "new.gif"
					,hotkey: "Ctrl+Alt+N"
				}, {
					id: "sep0"
					, type: "separator"
				},{
					id: "find"
					, text: $dhx.ui.language.FindRecords
					, img: "view.png"
					, img_disabled: "view_dis.png"
					,hotkey: "Ctrl+Alt+V"
				}, {
					id: "open"
					, text: $dhx.ui.language.OpenSelected
					, img: "open.gif"
					, img_disabled: "open_dis.gif"
					, disabled: true
					,hotkey: "Ctrl+Alt+O"
				}, {
					id: "sep1"
					, type: "separator"
				}, {
					id: "pdf"
					, text: $dhx.ui.language.PDFVersion
					, img: "print.gif"
					,hotkey: "Ctrl+Shit+P"
				}
			]
		}, {
			id: "edit"
			, text: $dhx.ui.language.Edit
			, items: [{
					id: "update"
					, text: $dhx.ui.language.UpdateSelect
					, img: "edit.png"
					, img_disabled: "edit_dis.png"
					, disabled: true
					,hotkey: "Ctrl+Alt+U"
				},
				{
					id: "delete"
					, text: $dhx.ui.language.Deleteselected
					, img: "delete.png"
					, img_disabled: "delete_dis.png"
					, disabled: true
					,hotkey: "Del"
				}
			]
		}, {
			id: "settings"
			, text: $dhx.ui.language.Settings
			, items: [
				{
					id: "grid_column_size"
					, text: $dhx.ui.language.Gridsettings
					, img: "grid.png"
				},{
					id: "form_settings"
					, text: $dhx.ui.language.Formsettings
					, img: "body.png"
				},{
					id: "sep104"
					, type: "separator"
				}
				, {
					id: "idiom"
					, text: $dhx.ui.language.SelectIdiom
					,img : 'editor.png'
					, items: [
						{
							id: 'portuguese'
							, text: $dhx.ui.language.Portuguese
							, img: "flags/pt-br.png"
							,type : 'radio'
							,group: "idiom"
							,checked : ( $dhx.ui.i18n.getUserIdiom() == 'pt-br' ) ? true : ($dhx.ui.i18n.idiom == 'pt-br' ? true : false)
						},{
							id: "sep1670"
							, type: "separator"
						}, {
							id: "english"
							, text: $dhx.ui.language.English
							, img: "flags/en.png"
							,type : 'radio'
							,group: "idiom"
							,checked : ( $dhx.ui.i18n.getUserIdiom() == 'en-us' ) ? true : ($dhx.ui.i18n.idiom == 'en-us' ? true : false)
						}
					]
				}
				, {
					id: "skin"
					, text: $dhx.ui.language.Selectskin
					,img : 'skin.png'
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
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'dhx_skyblue') ? true : false
								) : false
						}, {
							
							//skin_subset
							id: "light-green"
							, text: 'light-green'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'light-green') ? true : false
								) : false
						}, {
							id: "clouds"
							, text: 'clouds'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'clouds') ? true : false
								) : false
						}, {
							id: "pink-yellow"
							, text: 'pink-yellow'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_skyblue' && $dhx.ui.getUserSkin().skin_subset == 'pink-yellow') ? true : false
								) : false
						},{
							id: "sep16709"
							, type: "separator"
						}, {
							id: "dhx_terrace"
							, text: 'terrace'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_terrace' && $dhx.ui.getUserSkin().skin_subset == 'dhx_terrace') ? true : false
								) : false
						}, {
							id: "terrace-blue"
							, text: 'terrace-blue'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_terrace' && $dhx.ui.getUserSkin().skin_subset == 'terrace-blue') ? true : false
								) : false
						},{
							id: "sep167094"
							, type: "separator"
						}, {
							id: "dhx_web"
							, text: 'web'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_web' && $dhx.ui.getUserSkin().skin_subset == 'dhx_web') ? true : false
								) : false
						}
						,{
							id: "web-green"
							, text: 'web-green'
							,type : 'radio'
							,group: "skin"
							,checked : ( $dhx.ui.getUserSkin() ) ? 
								( 
									( $dhx.ui.getUserSkin().skin == 'dhx_web' && $dhx.ui.getUserSkin().skin_subset == 'web-green') ? true : false
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
		}]
	}
	, menu_grid: {
		icons_path: ''
		, onload: function () {
			// console.log("menu loaded");
		}
		, onclick: function (id) {
			// console.log("menu clicked, id="+id);
		}
		
		, items: [
				{
					id: "find"
					, text: $dhx.ui.language.FindRecords
					, img: "view.png"
					, img_disabled: "view_dis.png"
				},
				
				
				{
					id: "insert"
					, text: $dhx.ui.language.New
					, img: "new.gif"
				}, {
					id: "sep0"
					, type: "separator"
				}, {
					id: "open"
					, text: $dhx.ui.language.OpenSelected
					, img: "open.gif"
					, img_disabled: "open_dis.gif"
					, disabled: true
				},{
					id: "update"
					, text: $dhx.ui.language.UpdateSelect
					, img: "edit.png"
					, img_disabled: "edit_dis.png"
					, disabled: true
				},{
					id: "delete"
					, text: $dhx.ui.language.Deleteselected
					, img: "delete.png"
					, img_disabled: "delete_dis.png"
					, disabled: true
				}, {
					id: "sep1"
					, type: "separator"
				}, {
					id: "pdf"
					, text: $dhx.ui.language.PDFVersion
					, img: "print.gif"
				}
				
				,{
					id: "grid_column_size"
					, text: $dhx.ui.language.SetUpGridColumns
					, img: "grid.png"
				}
		]
	}
	, ribbon: {
		icons_path: ""
		, items: [
			{
				id: "block_records"
				, type: 'block'
				, text: $dhx.ui.language.recordsmanagement
				, mode: 'cols'
				, list: [{
					type: "button"
					, id: "insert"
					, text: $dhx.ui.language.Newrecord
					, isbig: true
					, img: '32px/add.png'
				}, {
					type: "button"
					, id: "open"
					, text: $dhx.ui.language.Openrecord
					, isbig: true
					, img: '48px/open.gif'
				}, {
					type: "button"
					, id: "find"
					, text: $dhx.ui.language.FindRecords
					, isbig: true
					, img: '48px/page_find.png'
				}, {
					type: "button"
					, id: "update"
					, text: $dhx.ui.language.updateselected
					, disabled: true
					, img: 'edit.png'
					, img_dis: 'edit_dis.png'
				}, {
					type: "button"
					, id: "delete"
					, text: $dhx.ui.language.deleteselected
					, disabled: true
					, img: 'delete.png'
					, img_dis: 'delete_dis.png'
				}, {
					type: "separator"
					, id: "sep5"
				}, {
					type: "button"
					, id: "select"
					, text: $dhx.ui.language.reloaddata
					, img: 'reload.png'
				}]
			}, {
				id: "block_nav"
				, type: 'block'
				, text: $dhx.ui.language.quicknavigation
				, mode: 'cols'
				, list: [{
					type: "button"
					, id: "first"
					, text:  $dhx.ui.language.gotofirstrecord
					, isbig: true
					, img: '48px/first.png'
				}, {
					type: "button"
					, id: "last"
					, text: $dhx.ui.language.gotolast
					, img: 'entries.png'
				}, {
					type: "button"
					, id: "previous"
					, text: $dhx.ui.language.gotoprevious
					, img: 'previous.png'
				}, {
					type: "button"
					, id: "next"
					, text: $dhx.ui.language.gotonext
					, img: 'next.png'
				}]
			}
			,{
				id: "block_1_debug tools"
				, type: 'block'
				, text: 'debug tools'
				, mode: 'cols'
				, list: [
					{
						type: "button"
						, id: "add1000"
						, text: 'Add 1000 records into persons'
					}, {
						type: "button"
						, id: "adderror"
						, text: 'Add with error'
					}
					
				 ]
			}
		]
	}
	, toolbar: {
		icon_path: ""
		, items: []
	}
	
	, tab: {
		//skin:               "dhx_skyblue",  // string, tabbar skin, optional
		mode: "bottom", // string, top or bottom tabs mode, optional
		align: "left", // string, left or right tabs align, optional
		close_button: true, // boolean, render closing button on tabs, optional
		content_zone: true, // boolean, enable/disable content zone, optional
		onload: function () {}, // function, callback for xml/json, optional
		arrows_mode: "auto", // mode of showing tabs arrows (auto, always)
		tabs: [ // tabs config
			{
				id: "records", // tab id
				text: "Records", // tab text
				width: 170, // numeric for tab width or null for auto, optional
				//index:   null,      // numeric for tab index or null for last position, optional
				active: true, // boolean, make tab active after adding, optional
				//enabled: false,     // boolean, false to disable tab on init
				close: false // boolean, render close button on tab, optional
			}
		, ]
	}
	
	, FormWindow: {
		window: {
			"left": $dhx.getPagePosition("x", 530, 430)
			, "top": $dhx.getPagePosition("y", 530, 430)
			, "width": 530
			, "height": 430
			, "icon": "form.png"
			, "icon_dis": "form.png"
			, skin: $dhx.ui.skin
		}
		, layout: {
			parent: document.body, // id/object, parent container where the layout will be located
			pattern: "1C", // string, layout's pattern
			skin: $dhx.ui.skin, // string, optional, "dhx_skyblue", "dhx_web", $dhx.ui.skin
		}
		, form: {
			"template": [{
				type: "settings"
				, position: "label-left"
				, labelWidth: 160
				, inputWidth: 230
			}, {
				type: 'block'
				, inputWidth: 'auto'
				, inputHeight: 'auto'
				, list: [
					{
						type: 'block'
						, inputWidth: 'auto'
						, inputHeight: 'auto'
						, list: [
						
						
						]
					},{
							type: 'newcolumn', offset : 21
					}
					,{
						type: 'block'
						, inputWidth: 'auto'
						, inputHeight: 'auto'
						, list: [
						
						
						]
					}
				
				]
			}, {
				type: 'block'
				, inputWidth: 'auto'
				, inputHeight: 'auto'
				, list: [{
					type: "button"
					, value: $dhx.ui.language.update_record
					, name: "x_special_button_update" // x_special_button_update id automatically recognized when binding a form to a dataset
				}
				
			,{
					type: 'block'
					, inputWidth: 'auto'
					, inputHeight: 'auto'
					, list: [
						{
							type: "button"
							, value: $dhx.ui.language.save_record
							, name: "x_special_button_save" // x_special_button_save id automatically recognized when binding a form to a dataset
						}
					]
				}
				]
			}]
		}
	}
	, app_generic: {
		window: {
			"left": $dhx.getPagePosition("x", 940, 550)
			, "top": $dhx.getPagePosition("y", 940, 550)
			, "width": 940
			, "height": 550
			, "icon": "form.png"
			, "icon_dis": "form.png"
			, skin: $dhx.ui.skin
		}
	}
	, Search: {
		window: {
			"left": $dhx.getPagePosition("x", 490, 330)
			, "top": $dhx.getPagePosition("y", 490, 330)
			, "width": 490
			, "height": 330
			, "icon": "form.png"
			, "icon_dis": "form.png"
			, skin: $dhx.ui.skin
		}
		, layout: {
			parent: document.body, // id/object, parent container where the layout will be located
			pattern: "1C", // string, layout's pattern
			skin: $dhx.ui.skin, // string, optional, "dhx_skyblue", "dhx_web", $dhx.ui.skin
		}
		, form: {
			"template": [{
				type: "settings"
				, position: "label-left"
				, labelWidth: 160
				, inputWidth: 230
			}, {
				type: 'block'
				, inputWidth: 'auto'
				, inputHeight: 'auto'
				, list: []
			}, {
				type: 'block'
				, inputWidth: 'auto'
				, inputHeight: 'auto'
				, list: [{
					type: "button"
					, value: $dhx.ui.language.search
					, name: "search" // x_special_button_update id automatically recognized when binding a form to a dataset
				}, {
					type: "newcolumn"
				}, {
					type: "button"
					, value: $dhx.ui.language.clear_results
					, name: "clear_results" // x_special_button_update id automatically recognized when binding a form to a dataset
				}]
			}]
		}
	}
};