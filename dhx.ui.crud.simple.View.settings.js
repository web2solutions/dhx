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
		skin: "dhx_terrace", // string, optional, "dhx_skyblue", "dhx_web", "dhx_terrace"
	}
	, menu: {
		icons_path: ''
		, onload: function () {
			// console.log("menu loaded");
		}
		, onclick: function (id) {
			// console.log("menu clicked, id="+id);
		}
		
		, items: [{
			id: "file"
			, text: $dhx.ui.language.File
			, items: [{
					id: "insert"
					, text: $dhx.ui.language.New
					, img: "new.gif"
				}, {
					id: "sep0"
					, type: "separator"
				},{
					id: "find"
					, text: $dhx.ui.language.FindRecords
					, img: "view.png"
					, img_disabled: "view_dis.png"
				}, {
					id: "open"
					, text: $dhx.ui.language.OpenSelected
					, img: "open.gif"
					, img_disabled: "open_dis.gif"
					, disabled: true
				}, {
					id: "sep1"
					, type: "separator"
				}, {
					id: "pdf"
					, text: $dhx.ui.language.PDFVersion
					, img: "print.gif"
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
				},
				{
					id: "delete"
					, text: $dhx.ui.language.Deleteselected
					, img: "delete.png"
					, img_disabled: "delete_dis.png"
					, disabled: true
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
							id: $dhx.ui.language.Portuguese
							, text: "<u>P</u>ortugês"
							, img: "flags/pt-br.png"
						},{
							id: "sep1670"
							, type: "separator"
						}, {
							id: "english"
							, text: $dhx.ui.language.English
							, img: "flags/en.png"
						}
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
		, items: [{
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
		}]
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
			"left": $dhx.getPagePosition("x", 490, 330)
			, "top": $dhx.getPagePosition("y", 490, 330)
			, "width": 490
			, "height": 330
			, "icon": "form.png"
			, "icon_dis": "form.png"
			, skin: "dhx_terrace"
		}
		, layout: {
			parent: document.body, // id/object, parent container where the layout will be located
			pattern: "1C", // string, layout's pattern
			skin: "dhx_terrace", // string, optional, "dhx_skyblue", "dhx_web", "dhx_terrace"
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
					, value: "update record"
					, name: "x_special_button_update" // x_special_button_update id automatically recognized when binding a form to a dataset
				}, {
					type: 'newcolumn'
				}, {
					type: "button"
					, value: "save new record"
					, name: "x_special_button_save" // x_special_button_save id automatically recognized when binding a form to a dataset
				}]
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
			, skin: "dhx_terrace"
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
			, skin: "dhx_terrace"
		}
		, layout: {
			parent: document.body, // id/object, parent container where the layout will be located
			pattern: "1C", // string, layout's pattern
			skin: "dhx_terrace", // string, optional, "dhx_skyblue", "dhx_web", "dhx_terrace"
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
					, value: "search"
					, name: "search" // x_special_button_update id automatically recognized when binding a form to a dataset
				}, {
					type: "newcolumn"
				}, {
					type: "button"
					, value: "clear results"
					, name: "clear_results" // x_special_button_update id automatically recognized when binding a form to a dataset
				}]
			}]
		}
	}
};