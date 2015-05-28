/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.crud.simple.View.settings = {
    base_path: "",
    application_path: "",
    icons_path: "",
    dhtmlx_codebase_path: "",
    layout: {
        //parent: typeof dbDemo.configuration.wrapper === 'undefined' ? document.body : dbDemo.configuration.wrapper, // id/object, parent container where the layout will be located
        parent: document.body,
        pattern: "1C", // string, layout's pattern
        skin: "dhx_terrace", // string, optional, "dhx_skyblue", "dhx_web", "dhx_terrace"
    },
    menu: {
        icons_path: '',
        onload: function() {
            // console.log("menu loaded");
        },
        onclick: function(id) {
            // console.log("menu clicked, id="+id);
        }

        ,
        items: [{
            id: "file",
            text: "File",
            items: [{
                    id: "insert",
                    text: "<u>N</u>ew",
                    img: "new.gif"
                }, {
                    id: "sep0",
                    type: "separator"
                }, {
                    id: "open",
                    text: "<u>O</u>pen selected",
                    img: "open.gif",
                    disabled: true
                }, {
                				id: "sep1"
                				, type: "separator"
                			}, {
                				id: "pdf"
                				, text: "PDF version"
                				, img: "print.gif"
                			}
                /*, {
                				id: "save"
                				, text: "Save"
                				, img: "save.gif"
                			}, {
                				id: "saveAs"
                				, text: "Save As..."
                				, enabled: false
                				, img_disabled: "save_as_dis.gif"
                			}, {
                				id: "sep1"
                				, type: "separator"
                			}, {
                				id: "print"
                				, text: "Print"
                				, img: "print.gif"
                			}, {
                				id: "pageSetup"
                				, text: "Page Setup"
                				, enabled: false
                				, img_disabled: "settings.gif"
                			}, {
                				id: "sep2"
                				, type: "separator"
                			}, {
                				id: "close"
                				, text: "Close"
                				, img: "close.png"
                			}*/
            ]
        }, {
            id: "edit",
            text: "Edit",
            items: [{
                    id: "update",
                    text: "<u>U</u>pdate selected",
                    img: "edit.png",
                    disabled: true
                }
                /*,
                			{
                				id: "edit_undo"
                				, text: "Undo"
                				, img: "undo.gif"
                			}, {
                				id: "edit_redo"
                				, text: "Redo"
                				, img: "redo.gif"
                			}, {
                				id: "sep3"
                				, type: "separator"
                			}, {
                				id: "edit_select_all"
                				, text: "Select All"
                				, img: "selection.gif"
                			}, {
                				id: "sep4"
                				, type: "separator"
                			}, {
                				id: "edit_cut"
                				, text: "Cut"
                				, img: "cut.gif"
                			}, {
                				id: "edit_copy"
                				, text: "Copy"
                				, img: "copy.gif"
                			}, {
                				id: "edit_paste"
                				, text: "Paste"
                				, img: "paste.gif"
                			}*/
            ]
        }, {
            id: "help",
            text: "Help",
            items: []
        }]
    },
    ribbon: {
        icons_path: "",
        items: [{
            id: "block_records",
            type: 'block',
            text: 'records management',
            mode: 'cols',
            list: [{
                type: "button",
                id: "insert",
                text: 'New <br> record',
                isbig: true,
                img: '32px/add.png'
            }, {
                type: "button",
                id: "open",
                text: 'Open <br> record',
                isbig: true,
                img: '48px/open.gif'
            }, {
                type: "button",
                id: "find",
                text: 'Find <br> records',
                isbig: true,
                img: '48px/page_find.png'
            }, {
                type: "button",
                id: "update",
                text: 'update selected',
                disabled: true,
                img: 'edit.png',
                img_dis: 'edit_dis.png'
            }, {
                type: "button",
                id: "delete",
                text: 'delete selected',
                disabled: true,
                img: 'delete.png',
                img_dis: 'delete_dis.png'
            }, {
                type: "separator",
                id: "sep5"
            }, {
                type: "button",
                id: "select",
                text: 'clear and fill out grid',
                img: 'reload.png'
            }]
        }, {
            id: "block_nav",
            type: 'block',
            text: 'navigation',
            mode: 'cols',
            list: [{
                type: "button",
                id: "first",
                text: 'go to the<br>first record',
                isbig: true,
                img: '48px/first.png'
            }, {
                type: "button",
                id: "last",
                text: 'go to last',
                img: 'entries.png'
            }, {
                type: "button",
                id: "previous",
                text: 'go to previous',
                img: 'previous.png'
            }, {
                type: "button",
                id: "next",
                text: 'go to next',
                img: 'next.png'
            }]
        }, {
            id: "dhx_foreign_table_management",
            type: 'block',
            text: 'related data',
            mode: 'cols',
            list: []
        }]
    },
    toolbar: {
        icon_path: "",
        items: [{
            "type": "button",
            "id": "new_form",
            "text": "create new form",
            "img": "add_form.png",
            "img_disabled": "add_form_dis.png"
                //,disabled : false
        }, {
            id: "new_s1",
            type: "separator"
        }]
    }

    ,
    tab: {
        //skin:               "dhx_skyblue",  // string, tabbar skin, optional
        mode: "bottom", // string, top or bottom tabs mode, optional
        align: "left", // string, left or right tabs align, optional
        close_button: true, // boolean, render closing button on tabs, optional
        content_zone: true, // boolean, enable/disable content zone, optional
        onload: function() {}, // function, callback for xml/json, optional
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
            },
        ]
    }

    ,
    FormWindow: {
        window: {
            "left": $dhx.getPagePosition("x", 490, 330),
            "top": $dhx.getPagePosition("y", 490, 330),
            "width": 490,
            "height": 330,
            "icon": "form.png",
            "icon_dis": "form.png",
            skin: "dhx_terrace"
        },
        layout: {
            parent: document.body, // id/object, parent container where the layout will be located
            pattern: "1C", // string, layout's pattern
            skin: "dhx_terrace", // string, optional, "dhx_skyblue", "dhx_web", "dhx_terrace"
        },
        form: {
            "template": [{
                type: "settings",
                position: "label-left",
                labelWidth: 160,
                inputWidth: 230
            }, {
                type: 'block',
                inputWidth: 'auto',
                inputHeight: 'auto',
                list: []
            }, {
                type: 'block',
                inputWidth: 'auto',
                inputHeight: 'auto',
                list: [{
                    type: "button",
                    value: "update record",
                    name: "x_special_button_update" // x_special_button_update id automatically recognized when binding a form to a dataset
                }, {
                    type: 'newcolumn'
                }, {
                    type: "button",
                    value: "save new record",
                    name: "x_special_button_save" // x_special_button_save id automatically recognized when binding a form to a dataset
                }]
            }]
        }
    },
    app_generic: {
        window: {
            "left": $dhx.getPagePosition("x", 940, 550),
            "top": $dhx.getPagePosition("y", 940, 550),
            "width": 940,
            "height": 550,
            "icon": "form.png",
            "icon_dis": "form.png",
            skin: "dhx_terrace"
        }
    },
    Search: {
        window: {
            "left": $dhx.getPagePosition("x", 490, 330),
            "top": $dhx.getPagePosition("y", 490, 330),
            "width": 490,
            "height": 330,
            "icon": "form.png",
            "icon_dis": "form.png",
            skin: "dhx_terrace"
        },
        layout: {
            parent: document.body, // id/object, parent container where the layout will be located
            pattern: "1C", // string, layout's pattern
            skin: "dhx_terrace", // string, optional, "dhx_skyblue", "dhx_web", "dhx_terrace"
        },
        form: {
            "template": [{
                type: "settings",
                position: "label-left",
                labelWidth: 160,
                inputWidth: 230
            }, {
                type: 'block',
                inputWidth: 'auto',
                inputHeight: 'auto',
                list: []
            }, {
                type: 'block',
                inputWidth: 'auto',
                inputHeight: 'auto',
                list: [{
                    type: "button",
                    value: "search",
                    name: "search" // x_special_button_update id automatically recognized when binding a form to a dataset
                }, {
                    type: "newcolumn"
                }, {
                    type: "button",
                    value: "clear results",
                    name: "clear_results" // x_special_button_update id automatically recognized when binding a form to a dataset
                }]
            }]
        }
    }
};
