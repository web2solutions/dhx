/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */

$dhx.ui.crud.simple.View = {

    layout: null,
    menu: [],
    menu_grid: [],
    ribbon: [],
    tab: null,
    grid: null,
    status_bar: null,
    task_bar: null,
    task_bar: null,
    window: [],
    openedCRUD: [],
    strWindowID: "$dhx.ui.crud.simple.View.generic.window."

    ,
    status_bar: function(appId, icons_path) {
        this.template = "<div class='status_info' id='status_info_" + appId + "'>" + $dhx.ui.language.Initializing + " " + $dhx.ui.crud.controller[appId].appName + "</div><div class='data_transfer_info' id='data_transfer_info_" + appId + "'>" + $dhx.ui.language.no_data_transferred + "</div><div class='errors_info' id='errors_info_" + appId + "'>" + $dhx.ui.language.no_errors + "</div>"
        this._setStatus = function(m) {
            try {
                document.getElementById("status_info_" + appId).innerHTML = m;
            } catch (e) {
                console.log(e.stack);
            }

        }
        this._setStatusError = function(m) {
            try {
                document.getElementById("errors_info_" + appId).innerHTML = m;
            } catch (e) {
                console.log(e.stack);
            }

        }
        this._setStatusDataTransfer = function(m, isActive) {

            try {
                /*dhtmlx.message({
						text: m
					});*/
                if (isActive) {
                    document.getElementById("data_transfer_info_" + appId).innerHTML = m;
                    document.getElementById("data_transfer_info_" + appId).style.backgroundImage = "url(" + icons_path + "network.gif)";
                } else {
                    document.getElementById("data_transfer_info_" + appId).innerHTML = m;
                    document.getElementById("data_transfer_info_" + appId).style.backgroundImage = "url(" + icons_path + "network-accept.png)";
                }
            } catch (e) {
                console.log(e.stack);
            }

        }
        this._setStatusSocket = function(m, isOffline) {
            try {
                dhtmlx.message({
                    text: m
                });
                document.getElementById("socket_info_" + appId).innerHTML = "socket: " + m;
                document.getElementById("socket_info_" + appId).style.backgroundImage = "url(" + icons_path + "socket.gif)";
                if (isOffline) {
                    document.getElementById("socket_info_" + appId).style.backgroundImage = "url(" + icons_path + "socket_disconnected.png)";
                }
            } catch (e) {
                console.log(e.stack);
            }

        }

        this._setStatusUser = function(m, ok) {
            try {
                if (typeof ok === 'undefined') {
                    ok = true;
                }
                document.getElementById("user_info_" + appId).getElementsByTagName("span")[0].innerHTML = m;
                if (ok) {
                    document.getElementById("user_info_status_" + appId).src = "" + icons_path + "online.png";
                    //dhtmlx.message({
                    //	text: m
                    //});
                } else {
                    document.getElementById("user_info_status_" + appId).src = "" + icons_path + "offline.png";
                    dhtmlx.message({
                        type: "error",
                        text: m
                    });
                }
            } catch (e) {

            }

        }
    }

    ,
    helpers: {
        disableButtonActions: function(appId) {
            var self = $dhx.ui.crud.controller[appId].view;

            try {
                self.menu[appId].setItemDisabled('update');
                self.menu[appId].setItemDisabled('open');
                self.menu_grid[appId].setItemDisabled('update');
                self.menu_grid[appId].setItemDisabled('open');

                self.menu[appId].setItemDisabled('delete');
                self.menu_grid[appId].setItemDisabled('delete');

                if (!self.ribbon[appId])
                    return
                self.ribbon[appId].disable('delete');
                self.ribbon[appId].disable('update');
                self.ribbon[appId].disable('previous');
                self.ribbon[appId].disable('next');
                self.ribbon[appId].disable('open');
            } catch (e) {

            }


        },
        enableButtonActions: function(appId) {
            var self = $dhx.ui.crud.controller[appId].view;
            try {
                self.menu[appId].setItemEnabled('update');
                self.menu[appId].setItemEnabled('open');
                self.menu_grid[appId].setItemEnabled('update');
                self.menu_grid[appId].setItemEnabled('open');

                self.menu[appId].setItemEnabled('delete');
                self.menu_grid[appId].setItemEnabled('delete');
                if (!self.ribbon[appId])
                    return
                self.ribbon[appId].enable('delete');
                self.ribbon[appId].enable('update');
                self.ribbon[appId].enable('previous');
                self.ribbon[appId].enable('next');
                self.ribbon[appId].enable('open');
            } catch (e) {

            }

        },
        viewRecord: function(record_id, appId) {
            var self = $dhx.ui.crud.controller[appId].view;
            //alert( appId );

            var table = appId.split('crud.simple.')[1];
            table = table.split("_")[0]
                //alert(table)
            var schema = $dhx.ui.data.model.db[$dhx.ui.crud.controller[appId].database].schema[table];

            var settings = {
                wrapper: self.tab,
                record_id: record_id,
                table: table,
                db: $dhx.ui.crud.controller[appId].database
            };
            if (!self.ribbon[appId])
                settings['is_generic'] = true;

            $dhx.ui.crud.simple.View.Record.render(settings, schema);
        }
    }

    ,
    destroy: function(appId, schema) {
        try {
            var self = $dhx.ui.crud.controller[appId].view;

            //console.log(appId);
            //console.log($dhx.ui.crud.controller[appId].view);
            //console.log($dhx.ui.data.model.db[$dhx.ui.crud.controller[appId].database].schema);

            var table = appId.split('crud.simple.')[1];
            table = table.split("_app")[0];



            schema = $dhx.ui.data.model.db[$dhx.ui.crud.controller[appId].database].schema[table];

            schema.unsync.grid({
                component: self.grid,
                component_id: 'main_grid_' + appId,
                onSuccess: function() {

                },
                onFail: function() {
                    //status_bar._setStatusError();
                    alert('could not unsync grid')
                }
            });

            try {
                //self.ribbon[appId].unload();
            } catch (e) {
                //console.log(e.stack);
            }
            try {
                self.layout.cells('a').attachHTMLString('xx');
            } catch (e) {
                //console.log(e.stack);
            }

            //self.grid.destructor();
        } catch (e) {
            console.log(e.stack);
        }
    }

    ,
    _window: function(appId) {
        var self = $dhx.ui.crud.controller[appId].view;

        var settings = {
            id: self.strWindowID + "." + appId,
            left: $dhx.ui.crud.simple.View.settings.app_generic.window.left,
            top: $dhx.ui.crud.simple.View.settings.app_generic.window.top,
            width: $dhx.ui.crud.simple.View.settings.app_generic.window.width,
            height: $dhx.ui.crud.simple.View.settings.app_generic.window.height,
        };
        self.window[appId] = new $dhx.ui.window(settings);

        self.window[appId].attachEvent("onClose", function(win) {

            $dhx.ui.crud.controller[appId].destroy();

            return true;
        });
        self.window[appId].setText($dhx.ui.crud.controller[appId].collection + " management");
    }

    ,
    _layout: function(appId) {
        var self = $dhx.ui.crud.controller[appId].view;
        if ($dhx.ui.crud.controller[appId].configuration.wrapper) {
            $dhx.ui.crud.simple.View.settings.layout.parent = $dhx.ui.crud.controller[appId].configuration.wrapper;
            self.layout = new dhtmlXLayoutObject($dhx.ui.crud.simple.View.settings.layout);
        } else {
            self.layout = self.window[appId].attachLayout($dhx.ui.crud.simple.View.settings.layout);
        }

        self.layout.cells('a').hideHeader();
        self.task_bar = self.layout.attachStatusBar();
    }


    ,
    _menu: function(appId, status_bar, fk_tables, schema) {
        //alert('menu' +  appId);
        var self = $dhx.ui.crud.controller[appId].view;


        if (typeof $dhx.ui.crud.controller[appId].configuration.wrapper === 'undefined') {
            self.menu[appId] = self.window[appId].attachMenu($dhx.ui.crud.simple.View.settings.menu);
        } else {
            self.menu[appId] = $dhx.ui.crud.controller[appId].configuration.wrapper.attachMenu($dhx.ui.crud.simple.View.settings.menu);
        }

        self.menu[appId].attachEvent("onClick", function(id) {
            if (id == 'print') {

            } else if (id == 'insert') {
                $dhx.ui.crud.simple.View.FormWindow.render({
                    database: $dhx.ui.crud.controller[appId].database,
                    table: $dhx.ui.crud.controller[appId].collection,
                    schema: schema
                });
            } else if (id == 'update') {
                if (self.grid.getSelectedRowId())
                    $dhx.ui.crud.simple.View.FormWindow.render({
                        record_id: self.grid.getSelectedRowId(),
                        database: $dhx.ui.crud.controller[appId].database,
                        table: $dhx.ui.crud.controller[appId].collection,
                        schema: schema
                    });
            } else if (id == 'find') {
                $dhx.ui.crud.simple.View.Search.render({
                    database: $dhx.ui.crud.controller[appId].database,
                    table: $dhx.ui.crud.controller[appId].collection,
                    schema: schema,
                    appId: appId
                });
            } else if (id == 'open') {
                if (self.grid.getSelectedRowId())
                    self.helpers.viewRecord(self.grid.getSelectedRowId(), appId, schema);
            } else if (id == 'pdf') {
                self.grid.dhxPDF($dhx.ui.cdn_address + 'dhx/ui/bin/2pdf/generate.php', 'color', true, false, false, false, appId);
            } else if (id == 'dhx_terrace') {
                $dhx.ui.setUserSkin('dhx_terrace');
            } else if (id == 'dhx_skyblue') {
                $dhx.ui.setUserSkin('dhx_skyblue');
            } else if (id == 'dhx_web') {
                $dhx.ui.setUserSkin('dhx_web');
            } else if (id == 'web-green') {
                $dhx.ui.setUserSkin('web-green');
            }

            //
            else if (id == 'light-green') {
                $dhx.ui.setUserSkin('light-green');
            } else if (id == 'clouds') {
                $dhx.ui.setUserSkin('clouds');
            } else if (id == 'Unity') {
                $dhx.ui.setUserSkin('Unity');
            }
            //
            else if (id == 'pink-yellow') {
                $dhx.ui.setUserSkin('pink-yellow');
            } else if (id == 'terrace-blue') {
                $dhx.ui.setUserSkin('terrace-blue');
            }

            //light-green
            else if (id == 'portuguese') {
                $dhx.ui.i18n.setUserIdiom('pt-br');
            } else if (id == 'english') {
                $dhx.ui.i18n.setUserIdiom('en-us');
            } else {
                //alert(id)
                if (id.indexOf('table.') > -1) {
                    var table = id.split('.')[1];
                    self.openedCRUD[table] = new $dhx.ui.crud.simple({
                        database: $dhx.ui.crud.controller[appId].database,
                        collection: table,
                        base_path: $dhx.ui.crud.simple.View.settings.base_path
                    });
                }
            }
        });
    }



    ,
    _tab: function(appId, status_bar) {
        var self = $dhx.ui.crud.controller[appId].view;
        //alert();
        self.tab = self.layout.cells('a').attachTabbar($dhx.ui.crud.simple.View.settings.tab);

        self.status_bar = self.tab.cells('records').attachStatusBar();
        self.status_bar.setText(status_bar.template);
        self.tab.attachEvent("onTabClose", function(id) {
            try {
                //self.Record.wrapper.clean( parseInt( id ) );
            } catch (e) {
                //console.log(e.stack)	
            }
            return true;
        });
    }


    ,
    _menu_grid: function(appId, status_bar, fk_tables, schema) {
        //alert('menu' +  appId);
        var self = $dhx.ui.crud.controller[appId].view;
        self.menu_grid[appId] = new dhtmlXMenuObject();
        self.menu_grid[appId].setSkin($dhx.ui.skin);
        self.menu_grid[appId].setIconsPath($dhx.ui.crud.simple.View.settings.menu_grid.icons_path);
        self.menu_grid[appId].renderAsContextMenu();
        self.menu_grid[appId].loadStruct($dhx.ui.crud.simple.View.settings.menu_grid);
        self.menu_grid[appId].attachEvent("onClick", function(id) {
            if (id == 'print') {

            } else if (id == 'insert') {
                $dhx.ui.crud.simple.View.FormWindow.render({
                    database: $dhx.ui.crud.controller[appId].database,
                    table: $dhx.ui.crud.controller[appId].collection,
                    schema: schema
                });
            } else if (id == 'update') {
                if (self.grid.getSelectedRowId())
                    $dhx.ui.crud.simple.View.FormWindow.render({
                        record_id: self.grid.getSelectedRowId(),
                        database: $dhx.ui.crud.controller[appId].database,
                        table: $dhx.ui.crud.controller[appId].collection,
                        schema: schema
                    });
            } else if (id == 'find') {
                $dhx.ui.crud.simple.View.Search.render({
                    database: $dhx.ui.crud.controller[appId].database,
                    table: $dhx.ui.crud.controller[appId].collection,
                    schema: schema,
                    appId: appId
                });
            } else if (id == 'open') {
                if (self.grid.getSelectedRowId())
                    self.helpers.viewRecord(self.grid.getSelectedRowId(), appId, schema);
            } else if (id == 'pdf') {
                self.grid.dhxPDF($dhx.ui.cdn_address + 'dhx/ui/bin/2pdf/generate.php', 'color', true, false, false, false, appId);
            } else if (id == 'dhx_terrace') {
                $dhx.ui.setUserSkin('dhx_terrace');
            } else if (id == 'dhx_skyblue') {
                $dhx.ui.setUserSkin('dhx_skyblue');
            } else if (id == 'dhx_web') {
                $dhx.ui.setUserSkin('dhx_web');
            } else if (id == 'web-green') {
                $dhx.ui.setUserSkin('web-green');
            }

            //
            else if (id == 'light-green') {
                $dhx.ui.setUserSkin('light-green');
            } else if (id == 'clouds') {
                $dhx.ui.setUserSkin('clouds');
            }
            //
            else if (id == 'pink-yellow') {
                $dhx.ui.setUserSkin('pink-yellow');
            } else if (id == 'terrace-blue') {
                $dhx.ui.setUserSkin('terrace-blue');
            }

            //light-green
            else if (id == 'portuguese') {
                $dhx.ui.i18n.setUserIdiom('pt-br');
            } else if (id == 'english') {
                $dhx.ui.i18n.setUserIdiom('en-us');
            } else {
                if (id.indexOf('table.') > -1) {
                    var table = id.split('.')[1];
                    self.openedCRUD[table] = new $dhx.ui.crud.simple({
                        database: $dhx.ui.crud.controller[appId].database,
                        collection: table,
                        base_path: $dhx.ui.crud.simple.View.settings.base_path
                    });
                }
            }
        });
    }

    ,
    _grid: function(appId, status_bar, schema) {
        var self = $dhx.ui.crud.controller[appId].view;
        self.grid = self.tab.cells('records').attachGrid();
		self.grid.setIconsPath($dhx.ui.crud.simple.View.settings.dhtmlx_codebase_path + "imgs/");
        self.grid.enableContextMenu(self.menu_grid[appId]);

        self.grid.saveOnEdit = true;
        schema.sync.grid({
            component: self.grid,
            component_id: 'main_grid_' + appId,
            auto_configure: true,
            onSuccess: function() {},
            onFail: function() {
                status_bar._setStatusError($dhx.ui.language.could_not_sync_grid);

            }
        });
        //self.grid.attachEvent("onRowSelect", function (new_row, ind)
        //{								
        //});
    }

    ,
    _ribbon: function(appId, status_bar, schema) {
        var self = $dhx.ui.crud.controller[appId].view;
        self.ribbon[appId] = self.layout.cells('a').attachRibbon($dhx.ui.crud.simple.View.settings.ribbon);
        self.helpers.disableButtonActions(appId);
        self.ribbon[appId].attachEvent("onClick", function(id) {
            if (id == 'select') {
                self.grid.clearAll();
                schema.load(function(records, rows_affected, tx, event) {
                    self.helpers.disableButtonActions(appId);

                    var data = {
                        rows: []
                    };
                    var c = {
                        db: $dhx.ui.crud.controller[appId].database,
                        table: $dhx.ui.crud.controller[appId].collection
                    };
                    var schema = $dhx.dataDriver.getTableSchema(c);
                    var primary_key = schema.primary_key.keyPath;
                    var columns = $dhx.dataDriver._getColumnsId(c).split(',');
                    records.forEach(function(recordset, index, array) {
                        //console.log(recordset.record)
                        var record = [];
                        columns.forEach(function(column, index_, array_) {
                            record[index_] = recordset.record[column];
                        });
                        data.rows.push({
                            id: recordset.record[primary_key],
                            data: record
                        })
                    });
                    self.grid.parse(data, "json"); //takes the name and format of the data source


                }, function(tx, event, error_message) {
                    console.log(error_message);
                });
            } else if (id == 'add1000') {
                var records = [];
                //$dhx.showDirections('hold on while I do some work .... ');
                status_bar._setStatusDataTransfer('trying to add 1000 records ... ', true);
                var start = new Date().getTime();
                for (i = start; i < (start + 1000); i++) {
                    records.push({
                        status: 1,
                        client_group_id: 1,
                        rest_api_alowed_requests_per_day: 0,
                        storage_quota: 200,
                        company_id: 1,
                        title: "Mr",
                        birth_date: null,
                        group_id: 1,
                        is_offshore: 0,
                        person_id: i,
                        is_client_group: 0,
                        rest_api_last_login: null,
                        rest_api_access: 0,
                        brazilian_rg: null,
                        password: "",
                        email: i + "@web2solutions.com.br",
                        name: "Pessoa" + i,
                        nationality: null,
                        company_name: null,
                        marital_status: null,
                        date_created: null,
                        occupation: null,
                        sallary: "15000.00",
                        brazilian_inscricao_municipal: null,
                        brazilian_titulo_eleitor: null,
                        web_site_last_login: null,
                        username: i + "@web2solutions.com.br",
                        brazilian_ctps_serie: null,
                        brazilian_ctps: null,
                        brazilian_cpf: null,
                        brazilian_inscricao_estadual: null,
                        time_zone: "America/Sao_Paulo",
                        brazilian_cnpj: null,
                        trading_name: null,
                        notes: null,
                        web_site_access: 0,
                        gender: "M",
                        brazilian_oab: null,
                        company_branch_id: 1
                    });
                }

                schema.add(records, function() {
                    //$dhx.hideDirections();
                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                });
            } else if (id == 'gettotal') {
                status_bar._setStatusDataTransfer($dhx.ui.language.counting_records, true);
                schema.count(function(tx, event, total) {
                    status_bar._setStatusDataTransfer($dhx.ui.language.total_records + ': ' + total, false);
                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                });
            } else if (id == 'getquota') {
                status_bar._setStatusDataTransfer($dhx.ui.language.getting_quota_information, true);
                that.model.db._getQuota(function(used, remaining) {
                    used = (used / 1024 / 1024 / 1024);
                    remaining = (remaining / 1024 / 1024 / 1024);
                    var message = $dhx.ui.language.used + ': ' + used.toFixed(5) + 'GB. ' + $dhx.ui.language.remaining + ': ' + remaining.toFixed(2) + 'GB';
                    $dhx.notify($dhx.ui.language.Quota_information, message, 'icons/db.png');
                    status_bar._setStatusDataTransfer($dhx.ui.language.used + ': ' + used.toFixed(5) + 'GB. ' + $dhx.ui.language.remaining + ': ' + remaining.toFixed(2) + 'GB', false);
                }, function(error) {
                    status_bar._setStatusDataTransfer(error, false);
                });
            } else if (id == 'first') {
                status_bar._setStatusDataTransfer($dhx.ui.language.requesting_first_record, true);
                schema.first(function(record_id, record, tx, event) {
                    status_bar._setStatusDataTransfer('ok', false);
                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);

                });
            } else if (id == 'next') {
                status_bar._setStatusDataTransfer($dhx.ui.language.requesting_next_record, true);
                schema.next(function(record_id, record, tx, event) {
                    status_bar._setStatusDataTransfer('ok', false);

                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                    $dhx.notify('navigation', error_message, 'icons/db.png');
                });
            } else if (id == 'previous') {
                status_bar._setStatusDataTransfer($dhx.ui.language.requesting_previous_record, true);
                schema.previous(function(record_id, record, tx, event) {
                    status_bar._setStatusDataTransfer('ok', false);

                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                    $dhx.notify('navigation', error_message, 'icons/db.png');
                });
            } else if (id == 'last') {
                status_bar._setStatusDataTransfer($dhx.ui.language.requesting_last_record, true);
                schema.last(function(record_id, record, tx, event) {
                    status_bar._setStatusDataTransfer('ok', false);

                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                });
            } else if (id == 'gettablesize') {
                status_bar._setStatusDataTransfer('requesting table size', true);
                schema.getTableSizeInBytes(function(tx, event, size) {
                    //console.log( size );
                    var size = (size / 1024).toFixed(2) + " KB";
                    status_bar._setStatusDataTransfer('table size :' + size, false);
                    //$dhx.notify('total table size', size, 'icons/db.png');
                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                });
            } else if (id == 'cleartable') {
                status_bar._setStatusDataTransfer('deleting all records', true);
                schema.clearAll(function(tx, event) {
                    status_bar._setStatusDataTransfer('all records deleted', false);
                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                });
            } else if (id == 'insert') {
                $dhx.ui.crud.simple.View.FormWindow.render({
                    database: $dhx.ui.crud.controller[appId].database,
                    table: $dhx.ui.crud.controller[appId].collection,
                    schema: schema
                });
            } else if (id == 'update') {
                if (self.grid.getSelectedRowId())
                    $dhx.ui.crud.simple.View.FormWindow.render({
                        record_id: self.grid.getSelectedRowId(),
                        database: $dhx.ui.crud.controller[appId].database,
                        table: $dhx.ui.crud.controller[appId].collection,
                        schema: schema
                    });
            } else if (id == 'open') {
                if (self.grid.getSelectedRowId())
                    self.helpers.viewRecord(self.grid.getSelectedRowId(), appId, schema);
            } else if (id == 'pdf') {
                self.grid.toPDFX('codebase/grid-pdf-php/generate.php', 'color', true);
            } else if (id == 'find') {
                $dhx.ui.crud.simple.View.Search.render({
                    database: $dhx.ui.crud.controller[appId].database,
                    table: $dhx.ui.crud.controller[appId].collection,
                    schema: schema,
                    appId: appId
                });
            } else if (id == 'getCursor') {
                status_bar._setStatusDataTransfer('getting cursor', true);
                schema.getCursor(function(cursor, tx, event) {
                    status_bar._setStatusDataTransfer('cursor got ' + cursor, false);
                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                });
            } else if (id == 'delete') {
                if (self.grid.getSelectedRowId()) {
                    status_bar._setStatusDataTransfer('deleting record', true);
                    schema.del(self.grid.getSelectedRowId(), function(tx, event, record_id) {
                        status_bar._setStatusDataTransfer('record deleted: ' + record_id, false);
                        //self.grid.deleteSelectedRows();
                        self.helpers.disableButtonActions(appId);
                    }, function(tx, event, error_message) {
                        status_bar._setStatusError(error_message);
                    });
                }
            } else if (id == 'dropdb') {
                status_bar._setStatusDataTransfer('deleting database', true);
                that.model.db.drop(function(message, tx, event) {
                    status_bar._setStatusDataTransfer(message, false);
                }, function(tx, event, error_message) {
                    status_bar._setStatusError(error_message);
                });
            }
        });
    }

    ,
    controller: []

    ,
    render: function(controller) {
        var appId = controller.appId;

        if(typeof $dhx.ui.data.model.schema[controller.database][controller.collection] === 'undefined')
		{
			if ($dhx._enable_log) 
				console.error('you are trying to render a crud for a non existent table. table name: '+controller.collection);
			return;
		}

        var self = $dhx.ui.crud.controller[appId],
            schema = $dhx.ui.data.model.db[controller.database].schema[controller.collection],
			
            db_settings = $dhx.ui.data.model.settings[controller.database][controller.collection],
            fk_tables = $dhx.ui.data.model.schema[controller.database][controller.collection].foreign_keys;


        //if ($dhx.ui.crud.controller[ appId ]) {
        //	controller.configuration.wrapper.show();
        //	controller.configuration.wrapper.bringToTop();
        //	return;
        //}	
        //$dhx.showDirections("starting view ... ");



        var strWindowID = $dhx.ui.crud.simple.View.strWindowID + appId;


        if ($dhx.ui.window_manager.isWindow(strWindowID)) {
            //console.log(self.window)
            self.view.window[appId].show();
            self.view.window[appId].bringToTop();
            return;
        }


        console.log(strWindowID);

        self = $dhx.ui.crud.controller[appId].view;

        if (typeof $dhx.ui.crud.controller[appId].configuration.wrapper === 'undefined') {


            self._window(appId, status_bar, schema);

        }
        //return;

        self._layout(appId);

        var status_bar = new self.status_bar(appId, $dhx.ui.crud.simple.View.settings.icons_path);

        self._tab(appId, status_bar);


        self._menu_grid(appId, status_bar, fk_tables, schema);
        self._grid(appId, status_bar, schema);

        self._menu(appId, status_bar, fk_tables, schema);


        self.tab.tabs("records").setText($dhx.ui.crud.controller[appId].collection.toUpperCase());


        //if ($dhx.ui.crud.controller[appId].configuration.wrapper === document.body)
        //{
        self._ribbon(appId, status_bar, schema);
        //}


        var cc = 0;
        var addded = false;
        for (var column in fk_tables) {
            if (!addded) self.menu[appId].addNewSibling("edit", "fkeys_table", $dhx.ui.language.AnotherRecords, false);
            addded = true;



            self.menu[appId].addNewChild(
                "fkeys_table", cc, 'table.' + fk_tables[column].table,
                $dhx.ui.language.EditNameTable(fk_tables[column].table),
                false, "form.gif"
            );

            cc = cc + 1;
        }

        // ====== lets use the table events
        schema.attachEvent('onAfterCursorChange', function(cursor_id, table) {

            if (table == controller.collection) {
                //console.log(appId);
                //console.log(schema);
                $dhx.ui.crud.controller[appId].view.helpers.enableButtonActions(appId);


                status_bar._setStatus($dhx.ui.language.selected + ': ' + cursor_id, false);
            }


        });
        schema.attachEvent('onBeforeCursorChange', function(cursor_id) {
            //console.log('before set cursor');
        });
        schema.attachEvent('onAfterAdd', function(records, rows_affected) {
            $dhx.ui.crud.controller[appId].view.helpers.enableButtonActions(appId);
            status_bar._setStatusDataTransfer('added: ' + rows_affected + ' records', false);
        });
        schema.attachEvent('onBeforeAdd', function() {
            status_bar._setStatusDataTransfer('trying to add records ... ', false);
        });
        status_bar._setStatusDataTransfer($dhx.ui.language.counting_records, true);
        schema.count(function(tx, event, total) {
            status_bar._setStatusDataTransfer('ok', false);
            status_bar._setStatus($dhx.ui.language.total_records + ': ' + total);
        }, function(tx, event, error_message) {
            status_bar._setStatusError('error when counting records: ' + error_message);
        });



        //history.pushState('start', 'start', '#start');
        $dhx.hideDirections();
    }
};
