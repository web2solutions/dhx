/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true, maxerr : 1000, indent : 2, sloppy : true */
/*global $dhx, dhtmlx, Element */
$dhx.dataDriver = {
    version: '1.0.3',
    dbs: {}

    ,
    _table_to_fill_on_init: 0,
    _table_to_filled_on_init: 0,
    _total_fkeys_to_check: [],
    _total_fkeys_checked: [],
    _total_records_to_check: [],
    _total_records_checked: []


    ,
    browserPassed: function() {
        'use strict';
        if ($dhx.Browser.name == "Chrome") {
            if ($dhx.Browser.version < 31) {
                console.log("Browser is out to date");
                $dhx.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
            console.log("Browser is OK for $dhx.dataDriver");
            return true;
        } else if ($dhx.Browser.name == "Firefox") {
            if ($dhx.Browser.version < 31) {
                console.log("Browser is out to date");
                $dhx.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
            console.log("Browser is OK for $dhx.dataDriver");
            return true;
        } else if ($dhx.Browser.name == "Opera") {
            if ($dhx.Browser.version < 27) {
                console.log("Browser is out to date");
                $dhx.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
            console.log("Browser is OK for $dhx.dataDriver");
            return true;
        } else if ($dhx.Browser.name == "Safari") {
            if ($dhx.Browser.version < 7) {
                console.log("Browser is out to date");
                $dhx.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
            //alert($dhx.Browser.OS);
            //if ($dhx.Browser.OS != 'Mac') {
            //	console.log("We only support Safari on Mac");
            //	$dhx.showDirections("BROWSER_VERSION_OUT_TO_DATE");
            //	return false;
            //}
            //
            console.log("Browser is OK for $dhx.dataDriver");
            return true;
        } else if ($dhx.Browser.name == "Explorer") {
            console.log("Browser vendor not allowed");
            $dhx.showDirections("BROWSER_NOT_ALLOWED");
            return false;
        } else {
            console.log("Browser vendor not allowed");
            $dhx.showDirections("BROWSER_NOT_ALLOWED");
            return false;
        }
    }

    ,
    validDSN: function(c) {
        'use strict';
        //var that = $dhx.dataDriver;
        if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
            dhtmlx.message({
                type: "error",
                text: "db is missing when creating a database"
            });
            if (c.onFail) {
                c.onFail({
                    message: "db is missing when creating a database"
                });
            }
            return false;
        }
        if ((typeof c.schema === 'undefined')) {
            c.schema = {};
        } else {
            if ($dhx.isObject(c.schema)) {
                //
            } else {
                dhtmlx.message({
                    type: "error",
                    text: "when you pass the parameter 'schema' to the constructor, it need to be an object"
                });
                if (c.onFail) {
                    c.onFail({
                        message: "when you pass the parameter 'schema' to the constructor, it need to be an array"
                    });
                }
                return false;
            }
        }
        return c;
    }

    ,
    validTableConf: function(c) {
        'use strict';
        var that = $dhx.dataDriver;
        //console.log( 'validTableConf', c );;
        if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
            dhtmlx.message({
                type: "error",
                text: "db is missing when creating a table"
            });
            if (c.onFail) c.onFail({
                message: "db is missing when creating a table"
            });
            return false;
        }
        if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
            dhtmlx.message({
                type: "error",
                text: "table is missing when creating a table"
            });
            if (c.onFail) c.onFail({
                message: "table is missing when creating a table"
            });
            return false;
        }
        if ((typeof c.primary_key === 'undefined')) {
            dhtmlx.message({
                type: "error",
                text: "primary_key is missing when creating a table"
            });
            if (c.onFail) c.onFail({
                message: "primary_key is missing when creating a table"
            });
            return false;
        }

        return c;
    }

    ,
    validIndexConf: function(c) {
        'use strict';
        var that = $dhx.dataDriver;
        if ((typeof c.unique === 'undefined')) {
            c.unique = false;
        }
        if ((typeof c.type === 'undefined')) {
            c.type = 'character varying';
        }
        if ((typeof c.maxlength === 'undefined')) {
            c.maxlength = '-1';
        }
        if ((typeof c.default === 'undefined')) {
            c.default = '';
        }
        if ((typeof c.format === 'undefined')) {
            c.format = '';
        }
        if ((typeof c.validation === 'undefined')) {
            c.validation = '';
        }
        if ((typeof c.required === 'undefined')) {
            c.required = false;
        }

        if (c.type.toLowerCase() == 'serial')
            return {
                type: 'serial',
                required: true,
                validation: 'integer',
                unique: true
            };

        return c;
    }

    ,
    validRecord: function(schema, record) {
        'use strict';
        var that = $dhx.dataDriver,
            clone = {};
        //console.log( 'schema      ' , schema);
        if ($dhx.isObject(record)) {
            for (var column in schema.columns) {
                if (schema.columns.hasOwnProperty(column)) {
                    if (record.hasOwnProperty(column)) {

                        if (schema.columns[column].required == true) {
                            if (typeof record[column] === 'undefined' || record[column] == '' || record[column] == null) {
                                //console.log( 'XXXXXXXX>>>>>> record has ', column );
                                //console.log( record[ column ] );
                                return "column '" + column + "' is a required column";
                            }
                        }

                        if (schema.columns[column].type == "integer" && schema.columns[column].is_nullable == "NO") {
                            if (record[column].toString().length > 0) {
                                if (!that._validateValueByType(record[column], "ValidInteger", column))
                                    return "column '" + column + "' just accepts integer values. Entered value: " + record[column];
                            }
                        }
                        if (schema.columns[column].type == "date" && schema.columns[column].is_nullable == "NO") {
                            if (record[column].toString().length > 0) {
                                if (!that._validateValueByType(record[column], "ValidDate", column))
                                    return "column '" + column + "' just accepts date values. Entered value: " + record[column];
                            }
                        }
                        if (schema.columns[column].type.indexOf("timestamp") > -1 && schema.columns[column].is_nullable == "NO") {
                            if (record[column].toString().length > 0) {
                                if (!that._validateValueByType(record[column], "ValidTime", column))
                                    return "column '" + column + "' just accepts date timestamp values. Entered value: " + record[column];
                            }
                        }
                        if (schema.columns[column].type == "numeric" && schema.columns[column].is_nullable == "NO") {
                            if (record[column].toString().length > 0) {
                                if (!that._validateValueByType(record[column], "ValidNumeric", column))
                                    return "column '" + column + "' just accepts date numeric values. Entered value: " + record[column];
                            }
                        }

                        clone[column] = record[column];
                    } else {
                        //console.log( "XXXXXXXX>>>>>> record does not have ", column );
                        if (schema.columns[column].required == true) {
                            if (schema.primary_key.keyPath != column)
                                return "column '" + column + "' is a required column";
                        }
                    }
                }
            }


            /*// trocar ... comecar iterando sobre schema.columns ao inves de record
				for( var column in record )
					if( record.hasOwnProperty( column ) )
					{
						//console.log( column );
						if( typeof schema.columns[ column ] === 'undefined' )
						{
							//console.log( schema.primary_key.keyPath )
							if( schema.primary_key.keyPath != column)
								return 'column ' + column + ' does not exist';
						}
						else
						{
							
							
							if( schema.columns[ column ].required == true )
							{
								console.log( '===================' );
								console.log( 'x' );
								console.log( 'x' );
								console.log( column  );
								console.log( 'is required', schema.columns[ column ].required  );
								console.log( record[ column ] );
								
								
								console.log( 'x' );
								console.log( 'x' );
								console.log( '===================' );
								if( typeof record[ column ] === 'undefined' || record[ column ] == '' || record[ column ] == null  )
								{
									return 'column ' + column + ' is required';
								}
							}
							
							clone[ column ] = record[ column ]
						}
					} // end if has property
				// end for column in record*/
        } else {
            return 'can not parse record' + record;
        }

        clone[schema.primary_key.keyPath] = record[schema.primary_key.keyPath];
        //console.log( 'clone',  clone );
        return clone;
    }


    ,
    validRecordUpdate: function(table_schema, record) {
        'use strict';
        var that = $dhx.dataDriver,
            clone = {};
        if ($dhx.isObject(record))
            for (var column in record)
                if (record.hasOwnProperty(column)) {
                    if (typeof table_schema.columns[column] === 'undefined') {
                        if (table_schema.primary_key.keyPath != column)
						{
                            return 'column ' + column + ' does not exist';
						}
                    }
					else
					{
						//console.log(column);
						//console.log(table_schema.columns);
							
	
						if (table_schema.columns[column].type.toLowerCase() != 'serial') {
							clone[column] = record[column];
						}
					}	

					
                } else
                    return 'can not parse record' + record;

        return clone;
    }

    // can be called only when onupgradeneeded
    ,
    createTable: function(c) {
        'use strict';
        //console.log( 'createTable', c );
        try {
            if (!$dhx.dataDriver.validTableConf(c))
                return;
            var db_name = c.db,
                that = $dhx.dataDriver,
                table = null;

            //connection = that.connect( { db : '', version : ''} );

            if ($dhx.isObject(c.primary_key))
                table = that.dbs[db_name].db.createObjectStore(c.table, c.primary_key);
            else
                table = that.dbs[db_name].db.createObjectStore(c.table, {
                    keyPath: c.primary_key,
                    autoIncrement: true
                });

            if ($dhx.isObject(c.columns)) {
                for (var column in c.columns) {
                    if (c.columns.hasOwnProperty(column)) {
                        if ($dhx.dataDriver.validIndexConf(c.columns[column]) == false) continue;
                        if (c.columns[column].index) {
                            c.columns[column].unique == true ? "" : c.columns[column].unique = false;
                            table.createIndex(column, column, {
                                unique: c.columns[column].unique
                            });
                        }
                    }
                }
            }
            table.transaction.addEventListener('complete', function(event) {
                var message = "table " + c.table + " created successfully";
                if ($dhx._enable_log) console.info(message);
                if (that.dbs[db_name].onCreate) that.dbs[db_name].onCreate({
                    connection: that.dbs[db_name].connection.connection,
                    event: that.dbs[db_name].connection.event,
                    message: message
                });
            });

        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant create table ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    ,
    dropDatabase: function(c) {
        'use strict';
        var that = $dhx.dataDriver;
        try {
            that.disconnect(c.db);
            var req = that.indexedDB.deleteDatabase(c.db);
            req.onsuccess = function(event) {

                $dhx.jDBdStorage.storeObject('$dhx.db.' + c.db, JSON.stringify({}));

                if ($dhx._enable_log) console.info("Deleted database " + c.db + " successfully");
                if (c.onSuccess) c.onSuccess("Deleted database " + c.db + " successfully", req, event);
            };
            req.onerror = function(event) {
                if (c.onFail) c.onFail(req, event, event.target.error.message);
            };
            req.onblocked = function(event) {
                throw "Couldn't delete database " + c.db + " due to the operation being blocked";
                if (c.onFail) c.onFail(req, event, event.target.error.message);
            };
        } catch (e) {
            if ($dhx._enable_log) console.error('sorry Eduardo, I cant drop database ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    ,
    getTableSizeInBytes: function(c) {
        'use strict';
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                updateRequest = null,
                rows_affected = 0,
                table_schema = that.dbs[db_name].schema[c.table],
                size = 0;

            console.time("get db size operation " + $dhx.crypt.SHA2(JSON.stringify(c)));

            var tx = that.db(db_name).transaction(c.table, "readonly"),
                table = tx.objectStore(c.table),
                request = table.openCursor();

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            var str = '';

            tx.addEventListener('complete', function(event) {
                if ($dhx._enable_log) console.info('tx getTableSizeInBytes is complete done');
            });

            tx.addEventListener('onerror', function(event) {
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            request.addEventListener('success', function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    var json = JSON.stringify(cursor.value);
                    str = str + json;
                    cursor.continue();
                } else {
                    if ($dhx._enable_log) console.info('executed');
                    if ($dhx._enable_log) console.log('transaction complete - DB size computed      ', event);
                    console.timeEnd("get db size operation " + $dhx.crypt.SHA2(JSON.stringify(c)));
                    str = $dhx.UTF8.decode(str);
                    var blob = new Blob([str], {
                        type: 'text/html'
                    }); // the blob
                    if (c.onSuccess) c.onSuccess(tx, event, blob.size);
                }
            });

            request.addEventListener('error', function(event) {
                if ($dhx._enable_log) console.error('sorry Eduardo, couldnt fecth data! Error message: ' + event);
                console.timeEnd("get db size operation " + $dhx.crypt.SHA2(JSON.stringify(c)));
                if (c.onFail) c.onFail(request, event, size);
            });
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant get table size ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    // ======== Start add() methods

    // send message to listeners and call onSuccess
    ,
    _completeAdd: function(c, that, event, tx, rows_affected, timer_label, db_name, table, tableRequest, records, isOnCreate) {
            var that = $dhx.dataDriver;
            isOnCreate = isOnCreate || false;
            console.timeEnd(timer_label);
            if ($dhx._enable_log) console.info('executed _completeAdd operation at: ' + c.table);
            if ($dhx._enable_log) console.log('transaction complete      ', event);
            if ($dhx._enable_log) console.info('rows affected: ' + rows_affected);
			
			if(!c.notPublish)
			{
				$dhx.MQ.publish(that.dbs[db_name].root_topic + "." + table, {
					action: 'add',
					target: 'table',
					name: table,
					status: 'success',
					message: 'record added',
					records: records,
					onInit: isOnCreate
				});
			}
			
			
            $dhx.dataDriver.public[c.table].onAfterAdd(records, rows_affected);
            if (c.onSuccess) c.onSuccess(tx, event, rows_affected);
            records = null;
        }
        // save records on table
        ,
    _addSaveOnTable: function(c, onSuccess, onFail) {
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                table_schema = that.dbs[db_name].schema[c.table],
                rows_affected = 0,
                isOnCreate = c.isOnCreate;

            //console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> $dhx.dataDriver.add isOnCreate ', isOnCreate );

            $dhx.dataDriver.public[c.table].onBeforeAdd();

            var timer_label = "_addSaveOnTable operation at " + c.table + " " + $dhx.crypt.SHA2(JSON.stringify(c));
            console.time(timer_label);

            var tx = that.db(db_name).transaction(c.table, "readwrite"),
                table = tx.objectStore(c.table),
                records = [];

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            tx.oncomplete = function(event) {
                //console.log('from on complete');
                that._completeAdd(c, that, event, tx, rows_affected, timer_label, db_name, c.table, table, records, isOnCreate);
                //records = null;
            };
            tx.onerror = function(event) {
                if ($dhx._enable_log) console.info('error name: ', event.srcElement.error.name);
                //dhtmlx.message({
                //	type: "error",
                //	text: event.srcElement.error.message
                //});

                if ($dhx._enable_log) console.error('sorry Eduardo, couldnt add record. error message: ' + event.srcElement.error.message);
                if ($dhx._enable_log) console.info('rows affected: 0');
                console.timeEnd(timer_label);
                if (c.onFail) c.onFail(tx, event, rows_affected);
                records = null;
            };

            tx.onabort = function(event) {
                if ($dhx._enable_log) console.info('   >>>>  ABORTED   <<<<  ');
                if ($dhx._enable_log) console.log(event.target.error.name, event.target.error.message);
                console.timeEnd(timer_label);
                //if(c.onFail) c.onFail(tx, event, rows_affected);
                records = null;
            }

            function persist(r) {
                    var schema = that.getTableSchema(c);
                    var primary_key = schema.primary_key.keyPath;
                    //var columns = $dhx.dataDriver._getColumnsId(c).split(',');

                    if (typeof r[primary_key] === 'undefined') {
                        r[primary_key] = new Date().getTime();
                    }

                    if (r[primary_key] == "") {
                        r[primary_key] = new Date().getTime();
                    }

                    if (r[primary_key] == 0) {
                        r[primary_key] = new Date().getTime();
                    }
                    table.add(r);
                    records.push(r);
                }
                // single record
            if ($dhx.isObject(c.record)) {
                if ($dhx._enable_log) console.info('........... trying to insert single record on ' + c.table);
                var r = that.validRecord(table_schema, c.record);
                if ($dhx.isObject(r)) {
                    if ($dhx._enable_log) console.log('preparing record ', r);
                    rows_affected = rows_affected + 1;
                    persist(r);
                } else {
                    var cloneEvent = {};
                    cloneEvent.target = cloneEvent.target || {};
                    cloneEvent.target.error = cloneEvent.target.error || {};
                    cloneEvent.target.error.name = 'Type constraint';
                    cloneEvent.target.error.message = r;
                    if (c.onFail) c.onFail(null, cloneEvent, r);
                    if ($dhx._enable_log) console.error('sorry Eduardo, invalid record! Error message: ' + r);
                    return;
                }
            }
            // multiple record
            else if ($dhx.isArray(c.record)) {
                if ($dhx._enable_log) console.info('........... trying to insert ' + c.record.length + ' records on ' + c.table);
                if (c.record.length > 0) {
                    for (var i = 0; i < c.record.length; i++) {
                        var record = c.record[i];
                        var r = that.validRecord(table_schema, record);
                        if ($dhx.isObject(r)) {
                            if ($dhx._enable_log) console.log('preparing record ', r);
                            rows_affected = rows_affected + 1;
                            persist(r);
                        } else {
                            if ($dhx._enable_log) console.info('record ignored: ', JSON.stringify(record));
                            if ($dhx._enable_log) console.error('sorry Eduardo, invalid record! Error message: ' + r);
                            continue;
                        }
                    }
                } else {
                    if ($dhx._enable_log) console.log('any record was passed to insert');
                }
            } else {
                if ($dhx._enable_log) console.error('sorry Eduardo, I cant parse the record payload');
                return;
            }
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant update record! Error message: ' + e.message);
			
			
			 //if ($dhx._enable_log) console.error('sorry Eduardo, I cant check fkey for updating record! Error message: ' + e.message);
				
				var error_message = "value not found on column '" + column_on_error + "', please change the field '" + column_on_error + "'";
				dhtmlx.message({
                        type: "error",
                        text: error_message
                    });
				var cloneEvent = {};
                    cloneEvent.target = cloneEvent.target || {};
                    cloneEvent.target.error = cloneEvent.target.error || {};
                    cloneEvent.target.error.name = 'Type constraint';
                    cloneEvent.target.error.message = error_message;
			
			
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    ,
    _checkFkey: function(c) {
        try {
            //console.log( 'XXXXXXX fk pra checar', c );
            var that = $dhx.dataDriver,
                db_name = c.db,
                table_schema = that.dbs[db_name].schema[c.table],
                schema = that.getTableSchema(c),
                primary_key = schema.primary_key.keyPath
            found = false;


            var timer_label = "check fkey. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
            console.time(timer_label);

            var tx = that.db(db_name).transaction(c.table, "readonly"),
                table = tx.objectStore(c.table);

            tx.addEventListener('complete', function(event) {
                console.timeEnd(timer_label);
                if ($dhx._enable_log) console.info('executed');
                if ($dhx._enable_log) console.info('tx _checkFkey is completed');
            });
            tx.addEventListener('onerror', function(event) {
                console.timeEnd(timer_label);
                dhtmlx.message({
                    type: "error",
                    text: event.target.error.message
                });
                if (c.onFail) c.onFail(tx, event, event.target.error.message);
                if ($dhx._enable_log) console.log('error on transaction');
            });
            tx.addEventListener('abort', function(event) {
                console.timeEnd(timer_label);
                dhtmlx.message({
                    type: "error",
                    text: event.target.error.message
                });
                if (c.onFail) c.onFail(tx, event, event.target.error.message);
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            var index = null;
            var _checkFkey = '';
            //console.log( c.column, primary_key );
            //console.log( ( c.column == primary_key ) );

            if (c.column == primary_key) {
                //console.log( 'XXXXXX MMMM irei procurar na pk' );
                _checkFkey = table.get(parseInt(c.value));
            } else {
                //console.log( 'XXXXXX MMMM irei procurar no indice' );
                index = table.index(c.column)
                _checkFkey = index.get(c.value)
            }

            _checkFkey.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (c.onSuccess) c.onSuccess(true, tx, event);
                } else {
                    var error_message = "value " + c.value + " not found on column '" + c.column + "' from table " + c.table;
                    dhtmlx.message({
                        type: "error",
                        text: error_message
                    });

                    var cloneEvent = {};
                    cloneEvent.target = cloneEvent.target || {};
                    cloneEvent.target.error = cloneEvent.target.error || {};
                    cloneEvent.target.error.name = 'Foreign Key constraint';
                    cloneEvent.target.error.message = error_message;
                    if (c.onFail) c.onFail(tx, cloneEvent, error_message);
                }
            }
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant _checkFkey! Error message: ' + e.message);
            var error_message = "value " + c.value + " not found on column '" + c.column + "' from table " + c.table;
                    dhtmlx.message({
                        type: "error",
                        text: error_message
                    });

                    var cloneEvent = {};
                    cloneEvent.target = cloneEvent.target || {};
                    cloneEvent.target.error = cloneEvent.target.error || {};
                    cloneEvent.target.error.name = 'Foreign Key constraint';
                    cloneEvent.target.error.message = error_message;
            if (c.onFail) c.onFail(null, cloneEvent, e.message);
        }
    }

    ,
    _addCheckFkeys: function(c, onSuccess, onFail) {
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                table_schema = that.dbs[db_name].schema[c.table],
                primary_key = table_schema.primary_key.keyPath;

            rows_affected = 0,
                isOnCreate = c.isOnCreate;
            // single record
            if ($dhx.isObject(c.record)) {
                if ($dhx._enable_log) console.info('........... checking fkeys for one record ' + c.table);
                var r = that.validRecord(table_schema, c.record);
                if ($dhx.isObject(r)) {
                    var fk_check_uid = $dhx.crypt.SHA2(JSON.stringify(r));
                    that._total_fkeys_to_check[fk_check_uid] = Object.keys(table_schema.foreign_keys).length;
                    that._total_fkeys_checked[fk_check_uid] = 0;

                    for (var key in table_schema.foreign_keys) {
                        if (table_schema.foreign_keys.hasOwnProperty(key)) {
                            that._checkFkey({
                                db: c.db,
                                table: table_schema.foreign_keys[key].table,
                                column: table_schema.foreign_keys[key].column,
                                value: r[table_schema.foreign_keys[key].column],
                                onSuccess: function(found, tx, event) {
                                    that._total_fkeys_checked[fk_check_uid] = that._total_fkeys_checked[fk_check_uid] + 1;
                                    if (that._total_fkeys_checked[fk_check_uid] == that._total_fkeys_to_check[fk_check_uid]) {
                                        that._addSaveOnTable(c, onSuccess, onFail);
                                    }

                                },
                                onFail: function(tx, event, error_message) {
                                    if ($dhx._enable_log) console.error('sorry Eduardo,  value ' + r[table_schema.foreign_keys[key].column] + ' not found at the "' + table_schema.foreign_keys[key].table + '" foreign table! Error message: ', error_message);

                                    if (c.onFail) c.onFail(tx, event, error_message);
                                }
                            });
                        }
                    }
                } else {
                    var cloneEvent = {};
                    cloneEvent.target = cloneEvent.target || {};
                    cloneEvent.target.error = cloneEvent.target.error || {};
                    cloneEvent.target.error.name = 'Type constraint';
                    cloneEvent.target.error.message = r;
                    if (c.onFail) c.onFail(null, cloneEvent, r);

                    if ($dhx._enable_log) console.error('sorry Eduardo, invalid record, I cant check it fkeys! Error message: ' + r);
                    return;
                }
            }
            // multiple record
            else if ($dhx.isArray(c.record)) {
                if ($dhx._enable_log) console.info('........... checking fkeys for ' + c.record.length + ' records inserting in ' + c.table);
                if (c.record.length > 0) {
                    var uid_total_record_to_check = $dhx.crypt.SHA2(JSON.stringify(c.record));
                    that._total_records_to_check[uid_total_record_to_check] = c.record.length;
                    that._total_records_checked[uid_total_record_to_check] = 0;
                    for (var i = 0; i < c.record.length; i++) {
                        var record = c.record[i];
                        var r = that.validRecord(table_schema, record);
                        //console.log('inserindo record: ', r);


                        if ($dhx.isObject(r)) {
                            var fk_check_uid = $dhx.crypt.SHA2(JSON.stringify(r));
                            that._total_fkeys_to_check[fk_check_uid] = Object.keys(table_schema.foreign_keys).length;
                            that._total_fkeys_checked[fk_check_uid] = 0;
                            for (var key in table_schema.foreign_keys) {
                                if (table_schema.foreign_keys.hasOwnProperty(key)) {

                                    //console.log('coluna fk pra checar' + table_schema.foreign_keys[key].column);



                                    that._checkFkey({
                                        db: c.db,
                                        table: table_schema.foreign_keys[key].table,
                                        column: table_schema.foreign_keys[key].column,
                                        value: r[table_schema.foreign_keys[key].column],
                                        onSuccess: function(found, tx, event) {

                                            that._total_records_checked[uid_total_record_to_check] =
                                                that._total_records_checked[uid_total_record_to_check] + 1;

                                            that._total_fkeys_checked[fk_check_uid] =
                                                that._total_fkeys_checked[fk_check_uid] + 1;

                                            if (
                                                that._total_fkeys_to_check[fk_check_uid] ==
                                                that._total_records_checked[uid_total_record_to_check]
                                            ) {
                                                if (
                                                    that._total_fkeys_checked[fk_check_uid] ==
                                                    that._total_fkeys_to_check[fk_check_uid]
                                                ) {
                                                    that._addSaveOnTable(c, onSuccess, onFail);
                                                }
                                            }
                                        },
                                        onFail: function(tx, event, error_message) {
                                            if ($dhx._enable_log) console.error('sorry Eduardo,  value ' + r[table_schema.foreign_keys[key].column] + ' not found at the "' + table_schema.foreign_keys[key].table + '" foreign table! Error message: ', r);
                                            if (c.onFail) c.onFail(tx, event, error_message);
                                        }
                                    });
                                }
                            }
                        } else {


                            if ($dhx._enable_log) console.info('record ignored: ', JSON.stringify(record));
                            if ($dhx._enable_log) console.error('sorry Eduardo, invalid record, I cant check it fkeys! Error message: ' + r);
                            continue;
                        }
                    }
                } else {
                    if ($dhx._enable_log) console.log('any record was passed to insert');
                }
            } else {
                if ($dhx._enable_log) console.error('sorry Eduardo, I cant parse the record payload');
                return;
            }
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant add record! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    },
    add: function(c, onSuccess, onFail) {
        //'use strict';
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                table_schema = that.dbs[db_name].schema[c.table];

            $dhx.dataDriver.public[c.table].onBeforeAdd();

            var timer_label = "identify insert method " + $dhx.crypt.SHA2(JSON.stringify(c));
            console.time(timer_label);

            if (typeof table_schema.foreign_keys !== 'undefined') {
                if ($dhx.isObject(table_schema.foreign_keys)) {
                    if (Object.keys(table_schema.foreign_keys).length > 0) {
                        console.timeEnd(timer_label);
                        that._addCheckFkeys(c, onSuccess, onFail);
                        return;
                    }
                }
            }

            console.timeEnd(timer_label);
            that._addSaveOnTable(c, onSuccess, onFail);
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant add record! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    // ======== END add() methods


    // ======== Start update() methods
    ,
    update: function(c) {
        //'use strict';

        //console.log('XXXXXXX>>>>>>>>  ', c);

        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                table_schema = that.dbs[db_name].schema[c.table];

            $dhx.dataDriver.public[c.table].onBeforeUpdate();
			
			

            var timer_label = "identify update method " + $dhx.crypt.SHA2(JSON.stringify(c));
            console.time(timer_label);

            if (typeof table_schema.foreign_keys !== 'undefined') {
                if ($dhx.isObject(table_schema.foreign_keys)) {
                    if (Object.keys(table_schema.foreign_keys).length > 0) {
                        var need_check = false;
                        for (var fk in table_schema.foreign_keys) {
                            if (table_schema.foreign_keys.hasOwnProperty(fk)) {
                                if (c.record.hasOwnProperty(fk)) {
                                    need_check = true;
                                }
                            }
                        }
                        console.timeEnd(timer_label);
                        if (need_check) {
                            that._updateCheckFkeys(c);
                        } else {
							
							
							
							
							
							
							
                            that._prepareUpdateSaveOnTable(c);
                        }
                        return;
                    }
                }
            }

            console.timeEnd(timer_label);
            that._prepareUpdateSaveOnTable(c);
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant add record! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


	 ,
    _updateSaveOnIndexedDB: function(c)
	{
		var timer_label = "record update on IndexedDB. task: " + $dhx.crypt.SHA2(JSON.stringify(c)),
			db_name = c.db;
            console.time(timer_label),
			rows_affected = 0;
	}

	 ,
    _updateSaveOnServer: function(c)
	{
		var that = $dhx.dataDriver,
			timer_label = "record update on server. task: " + $dhx.crypt.SHA2(JSON.stringify(c)),
			db_name = c.db;
            console.time(timer_label),
			rows_affected = 0;
			
			var cloneEvent = {};
						cloneEvent.target = cloneEvent.target || {};
						cloneEvent.target.error = cloneEvent.target.error || {};
		
		$dhx.REST.API.put({
			resource: "/" + c.table + "/" + parseInt(c.record_id)
			, format: "json"
			, payload: "hash=" + JSON.stringify(c.record)
			, onSuccess: function (request) {
				try {
					var json = JSON.parse(request.response);
					if (json.status == "success") {
						dhtmlx.message({
							text: json.response
						});
						
						// now lets put on indexedDB table
						var tx = that.db(db_name).transaction(c.table, "readwrite"),
							table = tx.objectStore(c.table),
							updateRequest = table.put(c.record);
						
						updateRequest.addEventListener('success', function (event) {
							rows_affected = event.target.result;
							var topic = that.dbs[db_name].root_topic + "." + c.table;
							if (!c.notPublish) {
								$dhx.MQ.publish(topic, {
									action: 'update'
									, target: 'table'
									, name: c.table
									, status: 'success'
									, message: 'record updated'
									, record_id: c.record_id
									, record: c.record
									, old_record: c.old_record
								});
							}
							console.timeEnd(timer_label);
							if ($dhx._enable_log) console.info('executed');
							if ($dhx._enable_log) console.log('transaction complete      ', event);
							if ($dhx._enable_log) console.info('rows affected: ' + typeof rows_affected !== 'undefined' ? 1 : 0);
							
							if (c.onSuccess) c.onSuccess(updateRequest, event, rows_affected);
						});
						updateRequest.addEventListener('error', function (event) {
							dhtmlx.message({
								type: "error"
								, text: 'record rejected on client due: ' + event.srcElement.error.message
							});
							if ($dhx._enable_log) console.info('error name: ', event.srcElement.error.name);
							if ($dhx._enable_log) console.info('	sorry Eduardo, couldnt update record. error message: ' + event.srcElement.error.message);
							if ($dhx._enable_log) console.info('rows affected: 0');
							console.timeEnd(timer_label);
							if (c.onFail) c.onFail(updateRequest, event, rows_affected);
						});
					}
					else {
						console.timeEnd(timer_label);
						if ($dhx._enable_log) console.error(json.response);
						
							cloneEvent.target.error.name = 'Server rejected';
							cloneEvent.target.error.message = 'record rejected on server due: ' + json.response;
						if (c.onFail) c.onFail(null, cloneEvent, rows_affected);
						dhtmlx.message({
							type: "error"
							, text: 'record rejected on server due: ' + json.response
						});
					}
				}
				catch (e) {
					console.timeEnd(timer_label);
					if ($dhx._enable_log) console.error(e.stack);
					
						cloneEvent.target.error.name = 'Programming error';
						cloneEvent.target.error.message = 'programming error: ' + e.message;
					if (c.onFail) c.onFail(null, cloneEvent, rows_affected);
					dhtmlx.message({
						type: "error"
						, text: 'programming error: ' + e.message
					});
				}
			}
			, onFail: function (request) {
				console.timeEnd(timer_label);
				if ($dhx._enable_log) console.error(request.response);
				
					cloneEvent.target.error.name = 'Programming error';
					cloneEvent.target.error.message = 'server error: ' + request.response;
				if (c.onFail) c.onFail(null, cloneEvent, rows_affected);
				dhtmlx.message({
					type: "error"
					, text: 'server error: ' + request.response
				});
			}
		});
	}

    ,
    _prepareUpdateSaveOnTable: function(c) {
        //'use strict';
        //console.log( 'INSIDE UPDATE', c )
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                record_id = parseInt(c.record_id),
                updateRequest = null,
                rows_affected = 0,
                record = {},
                table_schema = that.dbs[db_name].schema[c.table],
                schema = that.getTableSchema(c),
                primary_key = schema.primary_key.keyPath;


            var timer_label = "prepare record update. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
            console.time(timer_label);

            var tx = that.db(db_name).transaction(c.table, "readonly"),
                table = tx.objectStore(c.table),
                recordIdRequest = table.get(record_id);

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            

            tx.addEventListener('complete', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('tx _prepareUpdateSaveOnTable is completed');
            });

            tx.addEventListener('onerror', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            recordIdRequest.onsuccess = function(event) {
                var data = recordIdRequest.result;
                if (typeof data !== 'undefined') {
                    if ($dhx.isObject(c.record)) {
                        if ($dhx._enable_log) console.log('........... trying to update single record ');
                        var r = that.validRecordUpdate(table_schema, c.record);
                        if ($dhx.isObject(r)) {
                            if ($dhx._enable_log) console.log('preparing record ', r);
                            for (var i in r)
                                if (r.hasOwnProperty(i)) data[i] = r[i];
                        } else {
                            console.timeEnd(timer_label);
                            if ($dhx._enable_log) console.error('sorry Eduardo, invalid record! Error message: ' + r);
                            if (c.onFail) c.onFail(updateRequest, event, rows_affected);
                            return;
                        }
                    }
					
					c.record = data;
					console.timeEnd(timer_label);
					if ($dhx._enable_log) console.info('sending record to the server ... ');
					that._updateSaveOnServer(c)
					
                    //if ($dhx._enable_log) console.info("The transaction that originated this request is ", recordIdRequest.transaction);
                } else {
                    console.timeEnd(timer_label);
                    if ($dhx._enable_log) console.error('sorry Eduardo, record ' + record_id + ' not found! ');
                    if (c.onFail) c.onFail(updateRequest, event, rows_affected);
                    return;
                }

                
            };
        } catch (e) {
            if ($dhx._enable_log) console.error('sorry Eduardo, I cant update by local id! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    ,
    _updateCheckFkeys: function(c) {
            try {
                var that = $dhx.dataDriver,
                    db_name = c.db,
                    table_schema = that.dbs[db_name].schema[c.table],
                    rows_affected = 0,
                    isOnCreate = c.isOnCreate,
                    need_to_check = false, id_on_error = null;
                // single record
                if ($dhx.isObject(c.record)) {
                    if ($dhx._enable_log) console.info('........... checking fkeys for one record ' + c.table);
                    var r = that.validRecordUpdate(table_schema, c.record);

                    if ($dhx.isObject(r)) {
                        var fk_check_uid = $dhx.crypt.SHA2(JSON.stringify(r));
                        that._total_fkeys_to_check[fk_check_uid] = 0;
                        for (var fk in table_schema.foreign_keys) {
                            if (table_schema.foreign_keys.hasOwnProperty(fk)) {
                                if (c.record.hasOwnProperty(fk)) {
                                    that._total_fkeys_to_check[fk_check_uid] = that._total_fkeys_to_check[fk_check_uid] + 1;
                                }
                            }
                        }

                        //that._total_fkeys_to_check[fk_check_uid] = Object.keys(table_schema.foreign_keys).length;
                        that._total_fkeys_checked[fk_check_uid] = 0;

                        if (that._total_fkeys_to_check[fk_check_uid] == 0) {
                            if ($dhx._enable_log) console.info('does not need to check fkey for ' + r);
                            that._prepareUpdateSaveOnTable(c);
                            return;
                        }

                        for (var column in r) {
                            if (r.hasOwnProperty(column)) {
                                for (var key in table_schema.foreign_keys) {
                                    if (table_schema.foreign_keys.hasOwnProperty(key)) {

                                        if (key == column) {
                                            need_to_check = true;
                                        }
                                    }
                                }
                            }
                        }

                        if (!need_to_check) {
                            if ($dhx._enable_log) console.info('does not need to check fkey for ' + r);
                            that._prepareUpdateSaveOnTable(c);
                            return;
                        }

                        for (var key in table_schema.foreign_keys) {
                            if (table_schema.foreign_keys.hasOwnProperty(key)) {

                                if (c.record.hasOwnProperty(key)) {
                                    // need to check
                                    if ($dhx._enable_log) console.info('need to check fkey for ' + key);
									column_on_error = key;
                                    that._checkFkey({
                                        db: c.db,
                                        table: table_schema.foreign_keys[key].table,
                                        column: table_schema.foreign_keys[key].column,
                                        value: r[table_schema.foreign_keys[key].column],
                                        onSuccess: function(found, tx, event) {
                                            that._total_fkeys_checked[fk_check_uid] = that._total_fkeys_checked[fk_check_uid] + 1;
                                            if (that._total_fkeys_checked[fk_check_uid] == that._total_fkeys_to_check[fk_check_uid]) {
                                                that._prepareUpdateSaveOnTable(c);
                                            }
                                        },
                                        onFail: function(tx, event, error_message) {
                                            if ($dhx._enable_log) console.error('sorry Eduardo,  value ' + r[table_schema.foreign_keys[key].column] + ' not found at the "' + table_schema.foreign_keys[
                                                key].table + '" foreign table! Error message: ', error_message);

                                            if (c.onFail) c.onFail(tx, event, error_message);
                                        }
                                    });
                                }
                            }
                        }
                    } else {
                        if ($dhx._enable_log) console.error('sorry Eduardo, invalid record, I cant check it fkeys! Error message: ' + r);
                        return;
                    }
                } else {
                    if ($dhx._enable_log) console.error('sorry Eduardo, I cant parse the record payload');
                    return;
                }
            } catch (e) {
				

                if ($dhx._enable_log) console.error('sorry Eduardo, I cant check fkey for updating record! Error message: ' + e.message);
				console.log(e.stack);
				
				var error_message = "value not found on column '" + column_on_error + "', please change the field '" + column_on_error + "'";
				dhtmlx.message({
                        type: "error",
                        text: error_message
                    });
				var cloneEvent = {};
                    cloneEvent.target = cloneEvent.target || {};
                    cloneEvent.target.error = cloneEvent.target.error || {};
                    cloneEvent.target.error.name = 'Type constraint';
                    cloneEvent.target.error.message = error_message;
				
                //if ($dhx._enable_log) console.info(e);
                if (c.onFail) c.onFail(null, cloneEvent, e.message);
            }
        }
        // ======== End update() methods


    ,
    load: function(c) {
        'use strict';
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                updateRequest = null,
                rows_affected = 0,
                table_schema = that.dbs[db_name].schema[c.table],
                records = [];
            $dhx.showDirections('selecting table data, please wait ... ');
            console.time("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify(c)));

            var tx = that.db(db_name).transaction(c.table, "readonly"),
                table = tx.objectStore(c.table),
                request = table.openCursor();

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            tx.addEventListener('complete', function(event) {
                if ($dhx._enable_log) console.info('tx select is completed');
                $dhx.hideDirections();
            });

            tx.addEventListener('onerror', function(event) {
                if ($dhx._enable_log) console.log('error on transaction');
                $dhx.hideDirections();
            });

            tx.addEventListener('abort', function(event) {
                if ($dhx._enable_log) console.info('transaction aborted');
                $dhx.hideDirections();
            });

            request.addEventListener('success', function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    //console.log( cursor );
                    rows_affected = rows_affected + 1;
                    records.push({
                        key: cursor.key,
                        primaryKey: cursor.primaryKey,
                        record: cursor.value
                    });

                    cursor.continue();
                } else {
                    if ($dhx._enable_log) console.info('executed');
                    if ($dhx._enable_log) console.log('transaction complete - data selected      ', event);
                    if ($dhx._enable_log) console.info('rows affected: ' + rows_affected);
                    console.timeEnd("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify(c)));


                    if (c.onSuccess) c.onSuccess(records, rows_affected, tx, event);
                    records = null;
                }
            });

            request.addEventListener('error', function(event) {
                if ($dhx._enable_log) console.error('sorry Eduardo, couldnt fecth data! Error message: ' + event);
                console.timeEnd("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify(c)));
                if (c.onFail) c.onFail(request, event, event.target.error.message);
                records = null;
            });
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant select data ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    ,
    count: function(c, onSuccess, onFail) {
        'use strict';
        try {
            var that = $dhx.dataDriver;
            var db_name = c.db;
            console.time("count operation " + c.table);
            var tx = that.db(db_name).transaction(c.table, "readonly");
            var table = tx.objectStore(c.table);
            var cursor = table.openCursor();
            //console.log(cursor);
            var counter = table.count();

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            tx.addEventListener('complete', function(event) {
                if ($dhx._enable_log) console.info('tx count is completed');
            });

            tx.addEventListener('onerror', function(event) {
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                //console.log(counter.result);
                if (c.onFail) c.onFail(tx, event, event.target.error.message);
            });

            counter.addEventListener('success', function(event) {
                console.timeEnd("count operation " + c.table);
                //console.log(counter.result);
                if (c.onSuccess) c.onSuccess(tx, event, counter.result);
            });
            counter.addEventListener('error', function(event) {
                console.timeEnd("count operation " + c.table);
                //console.log(counter.result);
                if (c.onFail) c.onFail(tx, event, event.target.error.message);


            });
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant count data ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }

    }

    ,
    del: function(c) {
        'use strict';
        try {
            var that = $dhx.dataDriver;
            var db_name = c.db,
                timer_label = "del operation " + c.table + " " + c.record_id;

            console.time(timer_label);

            var tx = that.db(db_name).transaction(c.table, "readwrite");
            var table = tx.objectStore(c.table);
            //console.log( table );
            var req = table.delete(parseInt(c.record_id));

            tx.addEventListener('complete', function(event) {
                if ($dhx._enable_log) console.info('tx del is completed');
                //console.log( event );
            });

            tx.addEventListener('onerror', function(event) {
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            req.onsuccess = function(event) {
                console.timeEnd(timer_label);
                //console.log( event );
                $dhx.dataDriver.public[c.table]._internal_cursor_position = 0;
				
				if(!c.notPublish)
				{
					$dhx.MQ.publish(that.dbs[db_name].root_topic + "." + c.table, {
						action: 'delete',
						target: 'table',
						name: c.table,
						status: 'success',
						message: 'record deleted',
						record_id: c.record_id
					});
				}

                if ($dhx._enable_log) console.info('executed');
                if ($dhx._enable_log) console.log('transaction complete - record deleted');
                if (c.onSuccess) c.onSuccess(tx, event, c.record_id);
            }
            req.onerror = function(event) {
                console.timeEnd(timer_label);
                if ($dhx._enable_log) console.error('sorry Eduardo, I cant delete all records! Error message: ' + event);
                if (c.onFail) c.onFail(tx, event, event.target.error.message);
            }
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant delete the record! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    ,
    clearAll: function(c, onSuccess, onFail) {
        'use strict';
        try {
            var that = $dhx.dataDriver;
            var db_name = c.db;
            console.time("clearAll operation " + c.table);
            var tx = that.db(db_name).transaction(c.table, "readwrite");
            var table = tx.objectStore(c.table);

            var clear_request = table.clear();

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            tx.addEventListener('complete', function(event) {
                if ($dhx._enable_log) console.info('tx cearlAll is completed');
            });

            tx.addEventListener('onerror', function(event) {
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            clear_request.addEventListener('success', function(event) {
                console.timeEnd("clearAll operation " + c.table);
                if ($dhx._enable_log) console.info('executed');
                if ($dhx._enable_log) console.log('transaction complete - table is clear');

                $dhx.MQ.publish(that.dbs[db_name].root_topic + "." + c.table, {
                    action: 'clear',
                    target: 'table',

                    name: c.table,
                    status: 'success',
                    message: 'table is empty'

                });

                if (c.onSuccess) c.onSuccess(tx, event);
            });
            clear_request.addEventListener('error', function(event) {
                console.timeEnd("clearAll operation " + c.table);
                if ($dhx._enable_log) console.error('sorry Eduardo, I cant delete all records! Error message: ' + event);
                if (c.onFail) c.onFail(tx, event, event.target.error.message);
            });
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant delete all records! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    ,
    setCursor: function(c) {
        'use strict';
        try {
            var that = $dhx.dataDriver;
            var db_name = c.db,
                timer_label = "setCursor operation " + c.table;
            console.time(timer_label);

            $dhx.dataDriver.public[c.table].onBeforeCursorChange(record_id);

            var record_id = parseInt(c.record_id);
            var tx = that.db(db_name).transaction(c.table, "readonly");
            var table = tx.objectStore(c.table),
                recordIdRequest = table.get(record_id);
            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            tx.addEventListener('complete', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('tx setCursor is completed');
            });

            tx.addEventListener('onerror', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            recordIdRequest.onsuccess = function(event) {
                var data = recordIdRequest.result;
                if (typeof data !== 'undefined') {
                    $dhx.dataDriver.public[c.table]._internal_cursor_position = record_id;
                    console.timeEnd(timer_label);
                    $dhx.dataDriver.public[c.table].onAfterCursorChange(record_id, c.table);
                    if (c.onSuccess) c.onSuccess(recordIdRequest, event, data);
                } else {
                    console.timeEnd(timer_label);
                    if ($dhx._enable_log) console.error('sorry Eduardo, record ' + record_id + ' not found! ');
                    if (c.onFail) c.onFail(recordIdRequest, event, null);
                    return;
                }
            };
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant setCursor ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    ,
    getCursor: function(c) {
        'use strict';
        try {
            var that = $dhx.dataDriver;
            var db_name = c.db,
                timer_label = "getCursor operation " + c.table;
            console.time(timer_label);
            if ($dhx.dataDriver.public[c.table]._internal_cursor_position > 0) {
                console.timeEnd(timer_label);
                if (c.onSuccess) c.onSuccess($dhx.dataDriver.public[c.table]._internal_cursor_position);
            } else {
                var tx = that.db(db_name).transaction(c.table, "readonly");
                var table = tx.objectStore(c.table);
                var cursor = table.openCursor();
                //console.log(cursor);

                c.onSuccess = c.onSuccess || false;
                c.onFail = c.onFail || false;

                tx.addEventListener('complete', function(event) {
                    if ($dhx._enable_log) console.info('tx getCursor is completed');
                });

                tx.addEventListener('onerror', function(event) {
                    if ($dhx._enable_log) console.log('error on transaction');
                });

                tx.addEventListener('abort', function(event) {
                    //console.log(counter.result);
                    if (c.onFail) c.onFail(tx, event, event.target.error.message);
                });

                cursor.addEventListener('success', function(event) {

                    var cursor = event.target.result;
                    if (cursor) {
                        $dhx.dataDriver.public[c.table]._internal_cursor_position = cursor.key;
                        if (c.onSuccess) c.onSuccess(cursor.key, tx, event);
                    } else {
                        if (c.onSuccess) c.onSuccess($dhx.dataDriver.public[c.table]._internal_cursor_position, tx, event);
                    }

                    console.timeEnd(timer_label);

                });
                cursor.addEventListener('error', function(event) {
                    console.timeEnd(timer_label);
                    //console.log(counter.result);
                    if (c.onFail) c.onFail(tx, event, event.target.error.message);
                });
            }





        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant getCursor ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    ,
    getCurrentRecord: function(c) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            var db_name = c.db,
                timer_label = "getCurrentRecord operation " + c.table;
            console.time(timer_label);

            if ($dhx.dataDriver.public[c.table]._internal_cursor_position == 0) {
                console.timeEnd(timer_label);
                if ($dhx._enable_log)
                    console.error('sorry Eduardo, record ' + $dhx.dataDriver.public[c.table]._internal_cursor_position + ' not found! ');
                if (c.onFail) c.onFail(currentRecordRequest, event, 'not found');
                return;
            }

            var tx = that.db(db_name).transaction(c.table, "readonly");
            var table = tx.objectStore(c.table),
                currentRecordRequest = table.get($dhx.dataDriver.public[c.table]._internal_cursor_position);

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            tx.addEventListener('complete', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('tx getCurrentRecord is completed');
            });

            tx.addEventListener('onerror', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            currentRecordRequest.addEventListener('success', function(event) {
                var data = currentRecordRequest.result;
                if (typeof data !== 'undefined') {
                    //console.log(data);
                    console.timeEnd(timer_label);

                    if (c.onSuccess) c.onSuccess(data, currentRecordRequest, event);
                } else {
                    console.timeEnd(timer_label);
                    if ($dhx._enable_log) console.error('sorry Eduardo, record ' + $dhx.dataDriver.public[c.table]._internal_cursor_position + ' not found! ');
                    if (c.onFail) c.onFail(currentRecordRequest, event, 'not found');
                    return;
                }
            });
            currentRecordRequest.addEventListener('error', function(event) {
                if ($dhx._enable_log) console.error('sorry Eduardo, I cant getCurrentRecord data ! Error message: ' + event.target.error.message);
                console.timeEnd(timer_label);

                if (c.onFail) c.onFail(currentRecordRequest, event, event.target.error.message);
            });
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant getCurrentRecord data ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    ,
    getRecord: function(c) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            var db_name = c.db,
                timer_label = "getRecord operation " + c.table;
            console.time(timer_label);

            //$dhx.dataDriver.public[c.table]._internal_cursor_position

            var tx = that.db(db_name).transaction(c.table, "readonly");
            var table = tx.objectStore(c.table),
                recordRequest = table.get(parseInt(c.record_id));

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            tx.addEventListener('complete', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('tx getRecord is completed');
            });

            tx.addEventListener('onerror', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.log('error on transaction');
            });

            tx.addEventListener('abort', function(event) {
                //console.timeEnd( timer_label );
                if ($dhx._enable_log) console.info('transaction aborted');
            });

            recordRequest.addEventListener('success', function(event) {
                var data = recordRequest.result;
                if (typeof data !== 'undefined') {
                    //console.log(data);
                    console.timeEnd(timer_label);

                    if (c.onSuccess) c.onSuccess(data, recordRequest, event);
                } else {
                    console.timeEnd(timer_label);
                    if ($dhx._enable_log) console.error('sorry Eduardo, record ' + c.record_id + ' not found! ');
                    if (c.onFail) c.onFail(recordRequest, event, 'not found');
                    return;
                }
            });
            recordRequest.addEventListener('error', function(event) {
                if ($dhx._enable_log) console.error('sorry Eduardo, I cant getRecord data ! Error message: ' + event.target.error.message);
                console.timeEnd(timer_label);

                if (c.onFail) c.onFail(recordRequest, event, event.target.error.message);
            });
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant getRecord data ! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    ,
    _syncGridData: function(c, component) {
        'use strict';
        var that = $dhx.dataDriver;
        //component.clearAll();
        $dhx.dataDriver.public[c.table].load(function(records, rows_affected, tx, event) {

            $dhx.MQ.publish(that.dbs[c.db].root_topic + "." + c.table, {
                action: 'load',
                target: 'table',
                name: c.table,
                status: 'success',
                message: 'sync grid',
                records: records
            });

            if (c.onSuccess) c.onSuccess(rows_affected);
        }, function(tx, event, records, rows_affected) {
            if (c.onFail) c.onFail(rows_affected);
        });
    }
	
	,_syncDataViewData: function(c, component) {
        'use strict';
        var that = $dhx.dataDriver;
        //component.clearAll();
        $dhx.dataDriver.public[c.table].load(function(records, rows_affected, tx, event) {

            $dhx.MQ.publish(that.dbs[c.db].root_topic + "." + c.table, {
                action: 'load',
                target: 'table',
                name: c.table,
                status: 'success',
                message: 'sync dataview',
                records: records
            });

            if (c.onSuccess) c.onSuccess(rows_affected);
        }, function(tx, event, records, rows_affected) {
            if (c.onFail) c.onFail(rows_affected);
        });
    }

    ,
    _syncComboData: function(c, component) {
        'use strict';
        var that = $dhx.dataDriver;
        $dhx.dataDriver.public[c.table].load(function(records, rows_affected, tx, event) {

            $dhx.MQ.publish(that.dbs[c.db].root_topic + "." + c.table, {
                action: 'load',
                target: 'table',
                name: c.table,
                target_id: component._id,
                status: 'success',
                message: 'sync combo',
                records: records
            });

            if (c.onSuccess) c.onSuccess(rows_affected);
        }, function(tx, event, records, rows_affected) {
            if (c.onFail) c.onFail(rows_affected);
        });
    }

    ,
    _syncSelectData: function(c, component) {
        'use strict';
        var that = $dhx.dataDriver;
        $dhx.dataDriver.public[c.table].load(function(records, rows_affected, tx, event) {

            $dhx.MQ.publish(that.dbs[c.db].root_topic + "." + c.table, {
                action: 'load',
                target: 'table',
                name: c.table,
                target_id: component._id,
                status: 'success',
                message: 'sync select',
                records: records
            });

            if (c.onSuccess) c.onSuccess(rows_affected);
        }, function(tx, event, records, rows_affected) {
            if (c.onFail) c.onFail(rows_affected);
        });
    }

    ,
    _syncSelectGridData: function(c, component) {
        'use strict';
        var that = $dhx.dataDriver;
        $dhx.dataDriver.public[c.table].load(function(records, rows_affected, tx, event) {

            $dhx.MQ.publish(that.dbs[c.db].root_topic + "." + c.table, {
                action: 'load',
                target: 'table',
                name: c.table,
                target_id: component._id,
                status: 'success',
                message: 'sync selectGrid',
                records: records
            });

            if (c.onSuccess) c.onSuccess(rows_affected);
        }, function(tx, event, records, rows_affected) {
            if (c.onFail) c.onFail(rows_affected);
        });
    }

    ,
    _prepareGridSaveOnEdit: function(c, component) {
        'use strict';
        var that = $dhx.dataDriver;
		
		
		component.attachEvent("onCheck", function(rId,cInd,state){
			var table_schema = that.getTableSchema(c);
            var column_name = component.getColumnId(cInd);
			$dhx.showDirections("saving data ... ");
			component.setRowTextBold(rId);
			var hash = {};
			var old_hash = {}
			hash[component.getColumnId(cInd)] = state;
			old_hash[component.getColumnId(cInd)] = (state) ? false : true ;
			
			$dhx.dataDriver.public[c.table].update(rId, hash, old_hash, function () {
				dhtmlx.message({
					text: "data updated"
				});
				component.cells(rId, cInd).setValue(state);
				component.setRowTextNormal(rId);
				$dhx.hideDirections();
			}, function () {
				dhtmlx.message({
					type: "error"
					, text: "data was not updated"
				});
				component.cells(rId, cInd).setValue((state) ? false : true);
				component.setRowTextNormal(rId);
				$dhx.hideDirections();
			});
		});
		
		
        component.attachEvent("onEditCell", function(stage, rId, cInd, nValue, oValue) {
            var table_schema = that.getTableSchema(c);
            var column_name = component.getColumnId(cInd);
            if (stage == 0) {
				//console.log(nValue, oValue);
                return true;
            } else if (stage == 1) {
				//console.log(nValue, oValue);
				if( component.editor )
				{
					if(component.editor.obj)
					{
						//console.log( grid.cells( rId, cInd) );
						// format and mask here
						var input = component.editor.obj;
						var format = table_schema.columns[column_name].format;
						that._setInputMask(input, format);
					}
				}
                return true;
            } else if (stage == 2) {
				console.log(nValue, oValue);
                if (nValue != oValue) {
                    $dhx.showDirections("saving data ... ");
                    component.setRowTextBold(rId);
                    var hash = {};
                    var old_hash = {}
                    hash[component.getColumnId(cInd)] = nValue;
                    old_hash[component.getColumnId(cInd)] = oValue;
                    var validation = table_schema.columns[column_name].validation;
                    if (table_schema.columns[column_name].required || table_schema.columns[column_name].validation.indexOf('NotEmpty') > -1) {
                        if (nValue == "") {
                            dhtmlx.message({
                                type: "error",
                                text: "this field can not be blank - data was not updated"
                            });
                            component.cells(rId, cInd).setValue(oValue);
                            component.setRowTextNormal(rId);
                            $dhx.hideDirections();
                            return false;
                        }
                    }
                    if (validation != "") {
                        if (that._validateValueByType(nValue, validation, column_name)) {} else {
                            component.cells(rId, cInd).setValue(oValue);
                            //grid.selectCell(rId,cInd);
                            //grid.editCell();
                            //component.setRowTextNormal(rId);
                            $dhx.hideDirections();
                            return false;
                        }
                    }
                    $dhx.dataDriver.public[c.table].update(rId, hash, old_hash, function() {
                        dhtmlx.message({
                            text: "data updated"
                        });
                        component.cells(rId, cInd).setValue(nValue);
                        component.setRowTextNormal(rId);
                        $dhx.hideDirections();
                    }, function() {
                        dhtmlx.message({
                            type: "error",
                            text: "data was not updated"
                        });
                        component.cells(rId, cInd).setValue(oValue);
                        component.setRowTextNormal(rId);
                        $dhx.hideDirections();
                    });
                }
                return false;
            } // end stage 2
        });
    }

    ,
    _syncSelect: function(c, component, hash) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            if ($dhx._enable_log) console.log("this component is a select");
            component._id = hash.component_id;
            component._type = hash.type;
            component._subscriber = function(topic, data) {
                var schema = that.getTableSchema(c),
                    primary_key = schema.primary_key.keyPath,
                    columns = $dhx.dataDriver._getColumnsId(c).split(',');
                //var columns = $dhx.dataDriver._getColumnsId(c).split(',');
                //console.log('xxxxxxxxxxxxxxxxxx>>>>>>>>>>>', topic, data);
                if (data.target == 'table') {
                    if (data.name == c.table) { //data.name == c.table
                        if ($dhx._enable_log) {
                            console.info(
                                hash.component_id + ' received message sent to it: ', data.target, data.name
                            );
                        }
                        if (data.action == 'add' && data.message == 'record added') {
                            data.records.forEach(function(recordset, index, array) {
                                var obj = {};
                                for (i in recordset)
                                    if (recordset.hasOwnProperty(i)) obj[i] = recordset[i];
                                if (c.$init) c.$init(obj);
                                console.log(new Option(obj.text, obj.value))
                                component.options.add(new Option(obj.text, obj.value));
                            });
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'update' && data.message == 'record updated') {

                        } else if (data.action == 'delete' && data.message == 'record deleted') {
                            console.log(component.options)

                            //component.options
                        } else if (data.action == 'clear' && data.message == 'table is empty') {
                            component.clearAll();
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'load' && data.message == 'sync select') {
                            //console.log('XXXXXXXXXXXXXXXXXXXXX', data.records);
                            try {
                                //component.clearAll();
                                var records = data.records;
                                var final_records = [];
                                var schema = $dhx.dataDriver.getTableSchema(c);
                                var primary_key = schema.primary_key.keyPath;
                                //var columns = $dhx.dataDriver._getColumnsId(c).split(',');
                                records.forEach(function(recordset, index, array) {
                                    var obj = {};
                                    for (i in recordset.record)
                                        if (recordset.record.hasOwnProperty(i)) obj[i] = recordset.record[i];
                                    if (c.$init) c.$init(obj);
                                    component.options.add(new Option(obj.text, obj.value));
                                });
                            } catch (e) {
                                console.log(e.stack);
                            }
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        }
                    }
                }
            }
            component._subscriber_token = $dhx.MQ.subscribe(
                $dhx.dataDriver.dbs[c.db].root_topic + "." + c.table, component._subscriber
            );
            that._syncSelectData(c, component);
            //console.log('select MQ token ' + component._subscriber_token)
            if ($dhx._enable_log) console.info(hash.component_id, ' is synced');

        } catch (e) {
            console.log(e.stack)
        }
    }

    ,
    _syncSelectGrid: function(c, component, hash) {
        'use strict';
        //console.log( '>>>>>>>>>>>>> >>>>>>>>', c );
        //alert();
        //c.prop_value
        //c.prop_text
        try {
            var that = $dhx.dataDriver;
            if ($dhx._enable_log) console.log("this component is a selectGrid");
            component._id = hash.component_id;
            component._type = hash.type;

            component._subscriber = function(topic, data) {
                var schema = that.getTableSchema(c),
                    primary_key = schema.primary_key.keyPath,
                    columns = $dhx.dataDriver._getColumnsId(c).split(',');
                //console.log('xxxxxxxxxxxxxxxxxx>>>>>>>>>>>', topic, data);
                if (data.target == 'table') {
                    if (data.name == c.table) { //data.name == c.table
                        if ($dhx._enable_log) {
                            console.info(
                                hash.component_id + ' received message sent to it: ', data.target, data.name
                            );
                        }
                        if (data.action == 'add' && data.message == 'record added') {
                            data.records.forEach(function(recordset, index, array) {
                                var obj = {};
                                for (i in recordset)
                                    if (recordset.hasOwnProperty(i)) obj[i] = recordset[i];

                                if (c.prop_value && c.prop_text) {
                                    if (c.$init) c.$init(obj, c.prop_value, c.prop_text);
                                } else {
                                    if (c.$init) c.$init(obj);
                                }
                                component.put(obj.value, obj.text);
                            });
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'update' && data.message == 'record updated') {

                            var obj = {};
                            for (var i in data.record)
                                if (data.record.hasOwnProperty(i)) obj[i] = data.record[i];

                            if (c.prop_value && c.prop_text) {
                                if (c.$init) c.$init(obj, c.prop_value, c.prop_text);
                            } else {
                                if (c.$init) c.$init(obj);
                            }


                            var objo = {};
                            for (var i in data.old_record)
                                if (data.old_record.hasOwnProperty(i)) objo[i] = data.old_record[i];
                            if (c.prop_value && c.prop_text) {
                                if (c.$init) c.$init(objo, c.prop_value, c.prop_text);
                            } else {
                                if (c.$init) c.$init(objo);
                            }

                            //console.log(component.values);
                            component.values.forEach(function(value, index, array) {
                                if (value == objo.value) {
                                    component.keys[index] = obj.value;
                                    component.values[index] = obj.text;
                                }
                            });
                        } else if (data.action == 'delete' && data.message == 'record deleted') {
                            console.log(component.options)

                            //component.options
                        } else if (data.action == 'clear' && data.message == 'table is empty') {
                            component.clearAll();
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'load' && data.message == 'sync selectGrid') {
                            //console.log('XXXXXXXXXXXXXXXXXXXXX', data.records);
                            try {
                                //component.clearAll();
                                var records = data.records;
                                var final_records = [];
                                var schema = $dhx.dataDriver.getTableSchema(c);
                                var primary_key = schema.primary_key.keyPath;
                                var columns = $dhx.dataDriver._getColumnsId(c).split(',');
                                records.forEach(function(recordset, index, array) {
                                    var obj = {};
                                    for (i in recordset.record)
                                        if (recordset.record.hasOwnProperty(i)) obj[i] = recordset.record[i];

                                    if (c.prop_value && c.prop_text) {
                                        if (c.$init) c.$init(obj, c.prop_value, c.prop_text);
                                    } else {
                                        if (c.$init) c.$init(obj);
                                    }

                                    //console.log('XXXXXXXXXXXXXXXXXXXXX', component);
                                    component.put(obj.value, obj.text);

                                });
                            } catch (e) {
                                console.log(e.stack);
                            }
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        }
                    }
                }
            }
            component._subscriber_token = $dhx.MQ.subscribe(
                $dhx.dataDriver.dbs[c.db].root_topic + "." + c.table, component._subscriber
            );
            that._syncSelectGridData(c, component);
            //console.log('SelectGrid MQ token ' + component._subscriber_token)
            if ($dhx._enable_log) console.info(hash.component_id, ' is synced');

        } catch (e) {
            console.log(e.stack)
        }
    }

    ,
    _syncCombo: function(c, component, hash) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            if ($dhx._enable_log) console.log("this component is a combo");
            component._id = hash.component_id;
            component._type = hash.type;
            component._subscriber = function(topic, data) {
                var schema = that.getTableSchema(c),
                    primary_key = schema.primary_key.keyPath,
                    columns = $dhx.dataDriver._getColumnsId(c).split(',');
                //console.log('xxxxxxxxxxxxxxxxxx>>>>>>>>>>>', topic, data);
                if (data.target == 'table') {
                    if (data.name == c.table) //data.name == c.table
                    {
                        if ($dhx._enable_log) {
                            console.info(
                                hash.component_id + ' received message sent to it: ', data.target, data.name
                            );
                        }
                        if (data.action == 'add' && data.message == 'record added') {
                            var records = [];
                            data.records.forEach(function(recordset, index, array) {
                                var obj = {};
                                for (i in recordset)
                                    if (recordset.hasOwnProperty(i)) obj[i] = recordset[i];
                                if (c.$init) c.$init(obj);
                                records.push([obj.value, obj.text]);
                            });
                            component.addOption(records);
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'update' && data.message == 'record updated') {
                            //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);

                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'delete' && data.message == 'record deleted') {
                            //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                            //component.deleteRow(data.record_id);
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'clear' && data.message == 'table is empty') {
                            //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                            component.clearAll();
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        } else if (data.action == 'load' && data.message == 'sync combo') {
                            //console.log('XXXXXXXXXXXXXXXXXXXXX', data.records);
                            try {
                                //component.clearAll();
                                var records = data.records;
                                var final_records = [];
                                var schema = $dhx.dataDriver.getTableSchema(c);
                                var primary_key = schema.primary_key.keyPath;
                                var columns = $dhx.dataDriver._getColumnsId(c).split(',');
                                records.forEach(function(recordset, index, array) {
                                    //console.log(recordset);
                                    var obj = {};
                                    for (i in recordset.record)
                                        if (recordset.record.hasOwnProperty(i)) obj[i] = recordset.record[i];
                                    if (c.$init) c.$init(obj);
                                    final_records.push({value: obj.value, text: obj.text});
									
									
                                });
                                //component.clearAll(true);
                                
								// here 
								component.load({options:final_records}, function(){
									var value = parseInt(component._currentComboValue);
									var index = component.getIndexByValue(value);
									component.selectOption(index, false, true);
								});
								
								//component.addOption(final_records);
                            } catch (e) {
                                console.log(e.stack);
                            }
                            if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                        }
                    }
                }
            }
            component._subscriber_token = $dhx.MQ.subscribe($dhx.dataDriver.dbs[c.db].root_topic + "." + c.table, component._subscriber);
            // clear all data from combo and parses the table selected data
            that._syncComboData(c, component);
            //console.log('combo MQ token ' + component._subscriber_token)
            if ($dhx._enable_log) console.info(hash.component_id, ' is synced');

        } catch (e) {
            console.log(e.stack)
        }
    }
	
	,
    _syncGrid: function(c, component, hash) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver,
                schema = that.getTableSchema(c),
                total_columns_to_sync = Object.keys(schema.foreign_keys).length,
                total_columns_synced = 0,
                primary_key = schema.primary_key.keyPath,
                columns = $dhx.dataDriver._getColumnsId(c).split(',');

            if ($dhx._enable_log) console.log("this component is a grid");

            component._subscriber = function(topic, data) {
                    var schema = that.getTableSchema(c),
                        primary_key = schema.primary_key.keyPath,
                        columns = $dhx.dataDriver._getColumnsId(c).split(',');

                    //console.log( 'xxxxxxxxxxxxxxxxxx>>>>>>>>>>>', topic, data );
                    if (data.target == 'table') {
                        if (data.name == c.table) {
                            if ($dhx._enable_log) {
                                console.info(
                                    hash.component_id + ' received message about it synced table: ', data.target, data.name
                                );
                            }
                            if (data.action == 'add' && data.message == 'record added') {
                                var last_id = 0;
                                data.records.forEach(function(recordset, index, array) {
                                    var record = [];
                                    columns.forEach(function(column, index_, array_) {
                                        record[index_] = recordset[column];
                                    });
                                    component.addRow(recordset[primary_key], record);
                                    last_id = recordset[primary_key];
                                    if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                                });
                                component.selectRowById(last_id, false, true, true);
                            } else if (data.action == 'update' && data.message == 'record updated') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                for (var column in data.record) {
                                    if (data.record.hasOwnProperty(column)) {
                                        var colIndex = component.getColIndexById(column);
                                        component.cells(data.record_id, colIndex).setValue(data.record[column]);
                                    }
                                }
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'delete' && data.message == 'record deleted') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                component.deleteRow(data.record_id);
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'select' && data.message == 'selected record') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                component.selectRowById(data.record_id, false, true, false);
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'clear' && data.message == 'table is empty') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                component.clearAll();
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'load' && data.message == 'sync grid') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.records);
                                try {
                                    //component.clearAll();
                                    var records = data.records;
                                    var data = {
                                        rows: []
                                    };
                                    var schema = $dhx.dataDriver.getTableSchema(c);
                                    var primary_key = schema.primary_key.keyPath;
                                    var columns = $dhx.dataDriver._getColumnsId(c).split(',');
                                    records.forEach(function(recordset, index, array) {
                                        var record = [];
                                        columns.forEach(function(column, index_, array_) {
                                            record[index_] = recordset.record[column];
                                        });
                                        data.rows.push({
                                            id: recordset.record[primary_key],
                                            data: record
                                        })
                                    });
                                    component.parse(data, "json"); //takes the name and format of the data source
                                } catch (e) {
                                    console.log(e.stack);
                                }
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            }
                        }
                    }
                }
                // pro feature
                //component.attachEvent("onXLE", function(grid_obj,count){
                //	$dhx.dataDriver.public[c.table].getCursor( function( cursor, tx, event ){
                //			component.selectRowById( cursor, false, true, true );
                //		}, function( cursor, tx, event ){
                //	} );
                //});
            if (c.auto_configure) {
                component.setHeader($dhx.dataDriver._getColumnsHeader(c)); //the headers of columns 
                component.setColTypes($dhx.dataDriver._getColumnsType(c)); //the types of columns  
                component.setColSorting($dhx.dataDriver._getColumnsSorting(c)); //the sorting types 
                component.setColAlign($dhx.dataDriver._getColumnsAlign(c)); //the alignment of columns		
                component.setInitWidths($dhx.dataDriver._getColumnsWidth(c)); //the widths of columns  
            }
            component.setColumnIds($dhx.dataDriver._getColumnsId(c));

            if (c.auto_configure) {
                component.init(); //finishes initialization and renders the grid on the page
                //console.log(  'XXXXXXXXXXXXXXXX>>>>>>>>>>>>>>>>', schema );
                component.fk_combos = [];
                for (var fk in schema.foreign_keys) {
                    var table = schema.foreign_keys[fk].table;
                    var column_value = schema.columns[fk].foreign_column_value;
                    var column_text = schema.columns[fk].foreign_column_name;

                    //var table = schema.foreign_keys[fk].table;
                    var column = schema.foreign_keys[fk].column;
                    var colIndex = component.getColIndexById(fk);
                    component.fk_combos[fk] = component.getCombo(colIndex);
                    //component._id = hash.component_id;
                    //component._type = hash.type;
                    $dhx.dataDriver.public[table].sync.selectGrid({
                        component: component.fk_combos[fk],
                        component_id: hash.component_id + '_fk_bound_' + table + '_selectGrid_' + colIndex + '_' + fk,
                        prop_value: schema.columns[fk].foreign_column_value,
                        prop_text: schema.columns[fk].foreign_column_name,
                        $init: function(obj, prop_value, prop_text) {
                                obj.value = obj[prop_value];
                                obj.text = obj[prop_text];
                            } // not mandatory, default false

                        ,
                        onSuccess: function() {
                            total_columns_synced = total_columns_synced + 1;
                            if (total_columns_synced == total_columns_to_sync) {
                                if ($dhx._enable_log) console.info(' all columns are synced in ' + hash.component_id);
                                if ($dhx._enable_log) console.info(' syncing the grid now ');
                                // clear all data from grid and parses the table selected data
                                that._syncGridData(c, component);
                            }
                        },
                        onFail: function() {

                        }
                    });
                }
            }
            if (c.paginate) {} else {
                component.enableSmartRendering(true);
            }
            component.setDateFormat("%Y-%m-%d");
            component.attachEvent("onRowSelect", function(new_row, ind) {
                $dhx.dataDriver.public[c.table].setCursor(new_row, function() {}, function() {
                    component.clearSelection();
                });
            });

            // if user setted saveOnEdit = true
            if (component.saveOnEdit) {
                that._prepareGridSaveOnEdit(c, component);
            } // end if saveOnEdit
            component._subscriber_token = $dhx.MQ.subscribe($dhx.dataDriver.dbs[c.db].root_topic + "." + c.table, component._subscriber);

            if (total_columns_to_sync == 0) {
                that._syncGridData(c, component);
            }

            //console.log('grid MQ token ' + component._subscriber_token)
            if ($dhx._enable_log) console.info(hash.component_id, ' is synced');

        } catch (e) {
            console.log(e.stack)
        }
    }
	
	
	,
    _syncDataView: function(c, component, hash) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver,
                schema = that.getTableSchema(c),
                total_columns_to_sync = Object.keys(schema.foreign_keys).length,
                total_columns_synced = 0,
                primary_key = schema.primary_key.keyPath,
                columns = $dhx.dataDriver._getColumnsId(c).split(',');

            if ($dhx._enable_log) console.log("this component is a dataview");

            component._subscriber = function(topic, data) {
                    var schema = that.getTableSchema(c),
                        primary_key = schema.primary_key.keyPath,
                        columns = $dhx.dataDriver._getColumnsId(c).split(',');

                    //console.log( 'xxxxxxxxxxxxxxxxxx>>>>>>>>>>>', topic, data );
                    if (data.target == 'table') {
                        if (data.name == c.table) {
                            if ($dhx._enable_log) {
                                console.info(
                                    hash.component_id + ' received message about it synced table: ', data.target, data.name
                                );
                            }
                            if (data.action == 'add' && data.message == 'record added') {
                                var last_id = 0;
                                data.records.forEach(function(recordset, index, array) {
                                    component.add(recordset.record);
                                    last_id = recordset[primary_key];
                                    if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                                });
								component.select(last_id);
                            } else if (data.action == 'update' && data.message == 'record updated') {
								component.set(data.record_id,data.record);
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'delete' && data.message == 'record deleted') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                component.remove(data.record_id);
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'select' && data.message == 'selected record') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                component.select(data.record_id);
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'clear' && data.message == 'table is empty') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                component.clearAll();
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            } else if (data.action == 'load' && data.message == 'sync dataview') {
                                //console.log('XXXXXXXXXXXXXXXXXXXXX', data.records);
                                try {
                                    //component.clearAll();
                                    var records = data.records;
									var frecords = []
									records.forEach(function(recordset, index, array) {
                                        frecords.push(recordset.record)
										//component.add(recordset.record);
                                    });
                                    
									//console.log(frecords);
									
                                    component.parse(frecords, "json"); //takes the name and format of the data source
                                } catch (e) {
                                    console.log(e.stack);
                                }
                                if ($dhx._enable_log) console.info(hash.component_id + ' updated ');
                            }
                        }
                    }
                }
                

            
            component._subscriber_token = $dhx.MQ.subscribe($dhx.dataDriver.dbs[c.db].root_topic + "." + c.table, component._subscriber);

            that._syncDataViewData(c, component);

            //console.log('grid MQ token ' + component._subscriber_token)
            if ($dhx._enable_log) console.info(hash.component_id, ' is synced');

        } catch (e) {
            console.log(e.stack)
        }
    }
	
	,
    sync: function(c) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            // START validate request configuration
            if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                if (c.onFail) c.onFail("db is missing when creating a dataset");
                return false;
            }
            if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                if (c.onFail) c.onFail("table is missing when creating a dataset");
                return false;
            }
            if ((typeof c.type === 'undefined') || (c.type.length === 0)) {
                if (c.onFail) c.onFail("type is missing when creating a dataset");
                return false;
            }
            if ((typeof c.component === 'undefined')) {
                if (c.onFail) c.onFail("component is missing when syncing");
                return false;
            }
            if (!$dhx.isObject(c.component)) {
                if (c.onFail) c.onFail("component is not an object");
                return false;
            }
            // END validate request configuration

            // SET default callbacks
            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            // START - Add component to ARRAY of synced components of this table
            if ($dhx._enable_log) console.info("called sync for: " + c.component_id + " on " + c.table);
            var a_components = $dhx.dataDriver.public[c.table]._synced_components;
            for (var x = 0; x < a_components.length; x++) {
                var hash = a_components[x];
                if (hash.component_id == c.component_id) {
                    if ($dhx._enable_log) console.info(hash.component_id + " object already exist on memory, please remove it first");
                    //$dhx.dataDriver.public[c.table]._synced_components.splice(index, 1);
                    if (c.onFail) c.onFail(hash.component_id + " object already exist on memory, please remove it first");
                    return;
                }
            }
            if ($dhx._enable_log) console.log("pushing: " + c.component_id);
            var component_settings = {
                component_id: c.component_id,
                component: c.component,
                type: c.type,
                synced_table: c.table
            };
            if (typeof c.$init === 'function') {
                component_settings["$init"] = c.$init;
            }
            $dhx.dataDriver.public[c.table]._synced_components.push(component_settings);
            // END - Add component to ARRAY of synced components of this table

            $dhx.dataDriver.public[c.table]._synced_components.forEach(function(hash, index, array) {
                if (hash.component_id == c.component_id) {
                    var component = hash.component;
                    if (hash.type == 'tree') {
                        //if( $dhx._enable_log ) console.log( "this component is a tree" );
                        if (c.onFail) c.onFail("tree can not be synced");
                    } else if (hash.type == 'combo') {
                        that._syncCombo(c, component, hash);
                    } else if (hash.type == 'select') {
                        that._syncSelect(c, component, hash);
                    } else if (hash.type == 'selectGrid') {
                        that._syncSelectGrid(c, component, hash);
                    } else if (hash.type == 'grid') {
                        that._syncGrid(c, component, hash);

                    } // end if grid
					else if (hash.type == 'dataview') {
                        that._syncDataView(c, component, hash);

                    } // end if grid
                    else if (hash.type == 'form') {
                        //if( $dhx._enable_log ) console.log( "form can not be synced" );
                        if (c.onFail) c.onFail("form can not be synced");
                    } else {
                        if (c.onFail) c.onFail("unknow component when syncing");
                    }
                }
            });
        } catch (e) {

            if ($dhx._enable_log) console.error('sorry Eduardo, I cant sync ' + c.component_id + ' data ! Error message: ' + e.message, e.stack);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    //,_bound_components : []
    ,
    bind: function(c) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            // START validate request configuration
            if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                if (c.onFail) c.onFail("db is missing when binding");
                return false;
            }
            if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                if (c.onFail) c.onFail("table is missing when binding");
                return false;
            }
            if ((typeof c.type === 'undefined') || (c.type.length === 0)) {

                if (c.onFail) c.onFail("type is missing when binding");
                return false;
            }
            if ((typeof c.component === 'undefined')) {
                if (c.onFail) c.onFail("component is missing binding");
                return false;
            }
            if (!$dhx.isObject(c.component)) {
                if (c.onFail) c.onFail("component is not an object");
                return false;
            }
            // END validate request configuration

            // SET default callbacks
            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            // START - Add component to ARRAY of bound components of this table
            if ($dhx._enable_log) console.info("called bind for: " + c.component_id + " on " + c.table);
            var a_components = $dhx.dataDriver.public[c.table]._bound_components;
            for (var x = 0; x < a_components.length; x++) {
                var hash = a_components[x];
                if (hash.component_id == c.component_id) {
                    if ($dhx._enable_log) console.info(hash.component_id + " object already exist on memory, please remove it first");
                    //$dhx.dataDriver.public[c.table]._bound_components.splice(index, 1);
                    if (c.onFail) c.onFail(hash.component_id + " object already exist on memory, please remove it first");
                    return;
                }
            }
            c.$init = c.$init || false;
            if ($dhx._enable_log) console.log("pushing: " + c.component_id);
            var component_settings = {
                component_id: c.component_id,
                component: c.component,
                prepare: c.prepare,
                type: c.type
            };
            if (typeof c.$init === 'function') {
                component_settings["$init"] = c.$init;
            }
            $dhx.dataDriver.public[c.table]._bound_components.push(component_settings);
            // END - Add component to ARRAY of bound components of this table

            $dhx.dataDriver.public[c.table]._bound_components.forEach(function(hash, index, array) {
                if (hash.component_id == c.component_id) {
                    var component = hash.component;
                    if (hash.type == 'form') {
                        //if ($dhx._enable_log) console.log("this component is a form");
                        var prepare = false;
                        component._id = hash.component_id;
                        component._type = hash.type;

                        if (typeof hash.prepare !== 'undefined') {
                            if (typeof hash.prepare.settings !== 'undefined') {
                                prepare = true;
                                $dhx.dhtmlx.prepareForm(hash.component_id, hash.prepare.settings, hash.component);

                                $dhx.dhtmlx.formFields[hash.component_id].forEach(function(field, index, array) {
                                    if (field.type == 'combo') {
                                        if (typeof field.dhx_table !== 'undefined') {
                                            if (typeof field.dhx_prop_text !== 'undefined') {
                                                if (typeof field.dhx_prop_value !== 'undefined') {
                                                    var dhxCombo = component.getCombo(field.name);

                                                    var dhx_crud_rapid_button = document.createElement('img');
                                                    dhx_crud_rapid_button.setAttribute('class', 'dhx_crud_rapid_button');
                                                    dhxCombo.DOMParent.appendChild(dhx_crud_rapid_button);
                                                    var schema = $dhx.ui.data.model.db[c.db].schema[field.dhx_table];

                                                    dhx_crud_rapid_button.onclick = function() {
                                                        $dhx.ui.crud.simple.View.FormWindow.render({
                                                            database: c.db,
                                                            table: field.dhx_table,
                                                            schema: schema
                                                        });
                                                    }

                                                    $dhx.dataDriver.public[field.dhx_table].sync.combo({
                                                        component: dhxCombo,
                                                        component_id: component._id + '_combo_' + field.name,
                                                        $init: function(obj) {
                                                                obj.value = obj[field.dhx_prop_value];
                                                                obj.text = obj[field.dhx_prop_text];
																//console.log(obj);
                                                            } // not mandatory, default false
                                                            ,
                                                        onSuccess: function() {

                                                        },
                                                        onFail: function() {

                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    } else if (field.type == 'select') {
                                        if (typeof field.dhx_table !== 'undefined') {
                                            if (typeof field.dhx_prop_text !== 'undefined') {
                                                if (typeof field.dhx_prop_value !== 'undefined') {
                                                    var dhxSelect = component.getSelect(field.name);

                                                    $dhx.dataDriver.public[field.dhx_table].sync.select({
                                                        component: dhxSelect,
                                                        component_id: component._id + '_select_' + field.name,
                                                        $init: function(obj) {
                                                                obj.value = obj[field.dhx_prop_value];
                                                                obj.text = obj[field.dhx_prop_text];
                                                            } // not mandatory, default false
                                                            ,
                                                        onSuccess: function() {

                                                        },
                                                        onFail: function() {

                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
									else if( field.type == 'input' )
									{
										component.getInput(field.name).addEventListener('keyup', function(event) {
											if( $dhx.ui.$Session.capitalize )
											{
												this.value = this.value.toUpperCase();
											}
											if( $dhx.ui.$Session.latinize )
											{
												this.value = this.value.latinize();
											}
										});
									}
                                });
                            }
                        }

                        // if form is editing EXISTING record
                        if (component.isEditing == true) {
                            try {
                                component.hideItem("x_special_button_save");
                            } catch (e) {}

                            var record = $dhx.dataDriver.public[c.table].getCurrentRecord(function(record) {
                                // onSuccess
                                var obj = {};
                                for (i in record)
                                    if (record.hasOwnProperty(i)) {
                                        if (i != 'id') obj[i] = record[i]
                                    }
                                if (c.$init) c.$init(obj);
                                
								component.setFormData(obj);
	
								var hash = obj,
									clone = {},
									schema = that.getTableSchema(c),
									primary_key = schema.primary_key.keyPath,
									//columns = $dhx.dataDriver._getColumnsId(c).split(','),
									record_id = hash[primary_key], field;
						
								for (var column_name in hash)
								{
									if (hash.hasOwnProperty(column_name)) {
										field = $dhx.dhtmlx.getFormItem(column_name, component._id);
										if (field.type == 'btn2state') {
										    if(hash[column_name] == true)
											{
												component.checkItem(column_name);
											}
											else
											{
												component.uncheckItem(column_name);
											}
										}
										else if (field.type == 'combo') {
										    var fcombo = component.getCombo(column_name);
											
											var value = $dhx.isNumber(hash[column_name]) ? parseInt(hash[column_name]) : hash[column_name];
											var index = fcombo.getIndexByValue(value);
											console.log(fcombo);
											console.log(value);
											console.log(index);
											fcombo.selectOption(index, false, true);
											
            								//fcombo.openSelect();
											//clone[column_name] = component.isItemChecked(column_name);
										} else {
											//clone[column_name] = hash[column_name] == '' ? null : hash[column_name];
										}
						
									}
								}
								
								
								
								
								
								
                            }, function() {
                                // onFail
                            });
                        } // if form is adding NEW record
                        else {
                            try {
                                component.hideItem("x_special_button_update");
                            } catch (e) {}
                        }

                        component.attachEvent("onButtonClick", function(name) {
                            if (name == "x_special_button_save") component.save();
                            else if (name == "x_special_button_update") component.update();
                        });
						
						
						component.attachEvent("onKeyDown",function(inp, ev, name, value){
							if(ev.keyCode == 13 || ev.keyCode == '13')
							{
								 if (component.isEditing == true)
								 {
									 component.update()
								 }
								 else
								 {
									 component.save();
								 }
							}
						});
						
						
                        component.save = function(hash, onSuccess, onFail) {
                            if (prepare) {
                                if ($dhx.dhtmlx.validateForm(c.component_id, component)) {
                                    that._bound_form_save(c, component, hash, onSuccess, onFail);
                                }
                            } else {
                                //console.log("inside prepare");
                                that._bound_form_save(c, component, hash, onSuccess, onFail);
                            }
                        }
                        component.update = function(hash, onSuccess, onFail) {
                            if (prepare) {
                                if ($dhx.dhtmlx.validateForm(c.component_id, component)) {
                                    that._bound_form_update(c, component, hash, onSuccess, onFail);
                                }
                            } else {
                                //console.log("inside prepare");
                                that._bound_form_update(c, component, hash, onSuccess, onFail);
                            }
                        }
                        component.setFocusOnFirstActive();
                        component._subscriber = function(topic, data) {
                            if (data.target == 'table') {
                                if (data.name == c.table) {
                                    if ($dhx._enable_log)
                                        console
                                        .info(
                                            hash.component_id + ' received message about it bound table: ', data.target, data.name
                                        );
                                    if (data.action == 'add' && data.message == 'record added') {
                                        var schema = that.getTableSchema(c);
                                        var primary_key = schema.primary_key.keyPath
                                        var columns = $dhx.dataDriver._getColumnsId(c).split(',');


                                    }
                                }
                            }
                        }
                        component._subscriber_token = $dhx.MQ.subscribe($dhx.dataDriver.dbs[c.db].root_topic + "." + c.table, component._subscriber);
                        //history.pushState(hash.component_id, hash.component_id, component.isEditing === true ? '#update_record' : '#add_new_record');
                        if (c.onSuccess) c.onSuccess("bound");
                        if ($dhx._enable_log) console.info(hash.component_id, ' is bound');
                    } else {
                        if (c.onFail) c.onFail("unknow component when binding");
                    }
                }
            });
        } catch (e) {
            if ($dhx._enable_log) console.error('sorry Eduardo, I cant bind ' + c.component_id + ' data ! Error message: ' + e.message);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }

    ,
    unbind: function(c) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            // START validate request configuration
            if ((typeof c.db === 'undefined') || (c.db.length === 0)) {

                if (c.onFail) c.onFail("db is missing when syncing");
                return false;
            }
            if ((typeof c.table === 'undefined') || (c.table.length === 0)) {

                if (c.onFail) c.onFail("table is missing when syncing");
                return false;
            }
            if ((typeof c.type === 'undefined') || (c.type.length === 0)) {

                if (c.onFail) c.onFail("type is missing when syncing");
                return false;
            }
            if ((typeof c.component === 'undefined')) {

                if (c.onFail) c.onFail("component is missing when syncing");
                return false;
            }
            if (!$dhx.isObject(c.component)) {

                if (c.onFail) c.onFail("component is not an object");
                return false;
            }
            // END validate request configuration

            // START - Add component to ARRAY of bound components of this table
            if ($dhx._enable_log) console.info("called unbind for: " + c.component_id + " on " + c.table);
            var a_components = $dhx.dataDriver.public[c.table]._bound_components;
            for (var x = 0; x < a_components.length; x++) {
                var hash = a_components[x];
                var component = hash.component;
                if (hash.component_id == c.component_id) {

                    $dhx.dhtmlx.formFields[hash.component_id].forEach(function(field, index, array) {
                        if (field.type == 'combo') {
                            if (typeof field.dhx_table !== 'undefined') {
                                var dhxCombo = component.getCombo(field.name);
                                $dhx.dataDriver.public[field.dhx_table].unsync.combo({
                                    component: component,
                                    component_id: component._id + '_combo_' + field.name,
                                    onSuccess: function() {

                                    },
                                    onFail: function() {

                                    }
                                });
                            }
                        } else if (field.type == 'select') {
                            if (typeof field.dhx_table !== 'undefined') {
                                var dhxCombo = component.getSelect(field.name);
                                $dhx.dataDriver.public[field.dhx_table].unsync.select({
                                    component: component,
                                    component_id: component._id + '_select_' + field.name,
                                    onSuccess: function() {

                                    },
                                    onFail: function() {

                                    }
                                });
                            }
                        }
                    });

                    if ($dhx._enable_log) console.info(hash.component_id + " object exist on memory. now it was unbound");
                    $dhx.dataDriver.public[c.table]._bound_components.splice(x, 1);
                    $dhx.MQ.unsubscribe(component._subscriber_token);

                    if (c.onSuccess) c.onSuccess(hash.component_id + " object exist on memory. now it was unbound");
                    return;
                }
            }
            if ($dhx._enable_log) console.info("component not found. it was not unbound");
            if (c.onFail) c.onFail("component not found. it was not unbound");
        } catch (e) {
            if ($dhx._enable_log) console.error('sorry Eduardo, I cant unbind ' + c.component_id + '! Error message: ' + e.message);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    ,
    unsync: function(c) {
        'use strict';
        //console.log( c );
        try {
            var that = $dhx.dataDriver;
            // START validate request configuration
            if ((typeof c.db === 'undefined') || (c.db.length === 0)) {

                if (c.onFail) c.onFail("db is missing when unsyncing");
                return false;
            }
            if ((typeof c.table === 'undefined') || (c.table.length === 0)) {

                if (c.onFail) c.onFail("table is missing when unsyncing");
                return false;
            }
            if ((typeof c.type === 'undefined') || (c.type.length === 0)) {

                if (c.onFail) c.onFail("type is missing when unsyncing");
                return false;
            }
            if ((typeof c.component === 'undefined')) {

                if (c.onFail) c.onFail("component is missing when syncing");
                return false;
            }
            if (!$dhx.isObject(c.component)) {

                if (c.onFail) c.onFail("component is not an object");
                return false;
            }
            // END validate request configuration

            //console.log( c );

            // START - Add component to ARRAY of synced components of this table
            if ($dhx._enable_log) console.info("called unsync for: " + c.component_id + " on " + c.table);
            var a_components = $dhx.dataDriver.public[c.table]._synced_components;
            for (var x = 0; x < a_components.length; x++) {
                var hash = a_components[x];
                var component = hash.component;
                if (hash.component_id == c.component_id) {
                    if (c.type == 'grid') {
                        var schema = that.getTableSchema(c);
                        var primary_key = schema.primary_key.keyPath;

                        for (var fk in schema.foreign_keys) {
                            var table = schema.foreign_keys[fk].table;
                            var column = schema.foreign_keys[fk].column;
                            var colIndex = component.getColIndexById(fk);
                            component.fk_combos[fk] = component.getCombo(colIndex);
                            //component._id = hash.component_id;
                            //component._type = hash.type;
                            $dhx.dataDriver.public[table].unsync.selectGrid({
                                component: component.fk_combos[fk],
                                component_id: hash.component_id + '_fk_bound_' + table + '_selectGrid_' + colIndex + '_' + fk,
                                onSuccess: function() {},
                                onFail: function() {}
                            });
                        }
                        if ($dhx._enable_log) console.info(hash.component_id + " object exist on memory. now it was unsynced");
                        $dhx.dataDriver.public[c.table]._synced_components.splice(x, 1);

                        console.log(component._subscriber_token);

                        $dhx.MQ.unsubscribe(component._subscriber_token);
                        if (c.onSuccess) c.onSuccess(hash.component_id + " object exist on memory. now it was unsynced");
                        return;
                    } else {
                        if ($dhx._enable_log) console.info(hash.component_id + " object exist on memory. now it was unsynced");
                        $dhx.dataDriver.public[c.table]._synced_components.splice(x, 1);
                        $dhx.MQ.unsubscribe(component._subscriber_token);
                        if (c.onSuccess) c.onSuccess(hash.component_id + " object exist on memory. now it was unsynced");
                        return;
                    }


                }
            }
            if ($dhx._enable_log) console.info("component not found. it was not unsynced");
            if (c.onFail) c.onFail("component not found. it was not unsynced");
        } catch (e) {
            if ($dhx._enable_log) console.error('sorry Eduardo, I cant unsync ' + c.component_id + '! Error message: ' + e.message);
            if (c.onFail) c.onFail(null, null, e.message);
        }
    }


    ,
    _bound_form_save: function(c, component, hash, onSuccess, onFail) {
        var that = $dhx.dataDriver;
        hash = hash || component.getFormData()
        clone = {};

        for (var column_name in hash)
            if (hash.hasOwnProperty(column_name)) {
                field = $dhx.dhtmlx.getFormItem(column_name, component._id);
                if (field.type == 'calendar') {
                    var dt = new Date(hash[column_name])
                    var year = dt.getFullYear();
                    var month = dt.getMonth() + 1;
                    var day = dt.getDate();

                    //console.log( month.toString().length );
                    if (month.toString().length == 1)
                        month = "0" + month;
                    if (day.toString().length == 1)
                        day = "0" + day;

                    clone[column_name] = year + "-" + month + "-" + day;
                } else if (field.type == 'btn2state') {
                   
                    clone[column_name] = component.isItemChecked(column_name);
                }else if (field.type == 'combo') {
                   var dhxCombo = component.getCombo(column_name);
                    clone[column_name] = dhxCombo.getSelectedValue();
                }else {
                    clone[column_name] = hash[column_name] == '' ? null : hash[column_name];
                }

            }



        onSuccess = onSuccess || false;
        onFail = onFail || false;
        if ($dhx._enable_log) console.info('trying to save new record: ', clone);
        component.lock();

        $dhx.dataDriver.public[c.table].add(clone, function(tx, event, rows_affected) {
            component.unlock();


            var hash = {};
            component.forEachItem(function(name) {
                hash[name] = '';
            });

            component.setFormData(hash);

            if ($dhx._enable_log) console.info('record saved. rows_affected: ', rows_affected);
            (onSuccess) ? onSuccess(): "";
        }, function(tx, event, rows_affected) {


            that._saveRecordCheckError(component, event, c);
            component.unlock();
            if ($dhx._enable_log) console.info('record not saved. rows_affected: ', rows_affected);
            (onFail) ? onFail(): "";
        });
    }

    ,
    _bound_form_update: function(c, component, hash, onSuccess, onFail) {
        var that = $dhx.dataDriver;
        hash = hash || component.getFormData(),
            clone = {},
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            //columns = $dhx.dataDriver._getColumnsId(c).split(','),
            record_id = hash[primary_key];

        for (var column_name in hash)
            if (hash.hasOwnProperty(column_name)) {
                field = $dhx.dhtmlx.getFormItem(column_name, component._id);
                if (field.type == 'calendar') {
                    var dt = new Date(hash[column_name])
                    var year = dt.getFullYear();
                    var month = dt.getMonth() + 1;
                    var day = dt.getDate();
                    //console.log( month.toString().length );
                    if (month.toString().length == 1)
                        month = "0" + month;
                    if (day.toString().length == 1)
                        day = "0" + day;
                    clone[column_name] = year + "-" + month + "-" + day;
                }
				else if (field.type == 'btn2state') {
                   
                    clone[column_name] = component.isItemChecked(column_name);
                }else if (field.type == 'combo') {
					var dhxCombo = component.getCombo(column_name);
                    clone[column_name] = dhxCombo.getSelectedValue();
                } else {
                    clone[column_name] = hash[column_name] == '' ? null : hash[column_name];
                }

            }

        onSuccess = onSuccess || false;
        onFail = onFail || false;

        delete clone[primary_key];
        if ($dhx._enable_log) console.info('trying to save existing record: ', clone);
        component.lock();


        $dhx.dataDriver.public[c.table].update(record_id, clone, null, function(tx, event, rows_affected) {
            component.unlock();
            if ($dhx._enable_log) console.info('record saved. rows_affected: ', rows_affected);
            (onSuccess) ? onSuccess(): "";
        }, function(tx, event, rows_affected) {




            that._saveRecordCheckError(component, event, c);

            component.unlock();
            if ($dhx._enable_log) console.info('record not saved. rows_affected: ', rows_affected);
            (onFail) ? onFail(): "";
        });
    }

    ,
    _extractColumnFromErrorMessage: function(m) {
        var that = $dhx.dataDriver;
        var re = /'(.*)'/;
        var m = m.match(re);
        if (m != null) {
            return m[0].replace(re, '$1');
        } else
            return '';
    }

    ,
    _saveRecordCheckError: function(component, event, c) {
        'use strict';
        var that = $dhx.dataDriver,
            error_type = event.target.error.name,
            error_message = event.target.error.message,
            column_name = that._extractColumnFromErrorMessage(error_message),
            input_form_label = component.getItemLabel(column_name),
            input_form_type = component.getItemType(column_name),
            input_form = null;
		//alert(column_name);

		if( column_name )
		{
			try
			{
				if (input_form_type == "combo") {
					input_form = component.getCombo(column_name);
					input_form.openSelect();
				} else if (input_form_type == "editor") {
		
				} else if (input_form_type == "multiselect") {
					input_form = component.getInput(column_name);
					var field = $dhx.dhtmlx.getFormItem(column_name, component._id);
					that._setInputHighlighted(field, component);
				} else if (input_form_type == "select") {
					component.getSelect(column_name);
					var field = $dhx.dhtmlx.getFormItem(column_name, component._id);
					that._setInputHighlighted(field, component);
				} else {
					input_form = component.getInput(column_name);
					var field = $dhx.dhtmlx.getFormItem(column_name, component._id);
					that._setInputHighlighted(field, component);
				}
			}catch(e)
			{
				dhtmlx.message({
                    type: "error",
                    text: error_message
            	});	
			}
		}
		else
		{
			dhtmlx.message({
                    type: "error",
                    text: error_message
            });
		}
        
        if (error_type == 'ConstraintError') {
            if (error_message.indexOf("at least one key does not satisfy the uniqueness requirements") > -1) {
                dhtmlx.message({
                    type: "error",
                    text: 'the table ' + c.table + ' does not accept duplicated value for ' + input_form_label
                });
            }
        }
    }

    ,
    exists: function() {
        'use strict';
        var that = $dhx.dataDriver;
    },
    filter: function() {
        'use strict';
        var that = $dhx.dataDriver;
    }

    ,
    first: function(c) {
        //console.log( c );
        var that = $dhx.dataDriver,
            db_name = c.db,
            table_schema = that.dbs[db_name].schema[c.table],
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath;


        var timer_label = "get first record. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
        console.time(timer_label);

        var tx = that.db(db_name).transaction(c.table, "readonly"),
            table = tx.objectStore(c.table);

        c.onSuccess = c.onSuccess || false;
        c.onFail = c.onFail || false;

        tx.addEventListener('complete', function(event) {
            if ($dhx._enable_log) console.info('executed');
            if ($dhx._enable_log) console.log('transaction complete', event);
            console.timeEnd(timer_label);

            if ($dhx._enable_log) console.info('tx first record is completed');
        });
        tx.addEventListener('onerror', function(event) {
            console.timeEnd(timer_label);
            if (c.onFail) c.onFail(tx, event, event.target.error.message);
            if ($dhx._enable_log) console.log('error on transaction');
        });
        tx.addEventListener('abort', function(event) {
            console.timeEnd(timer_label);
            if ($dhx._enable_log) console.info('transaction aborted');
        });
        var search = table.openCursor(); // 
        search.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                $dhx.MQ.publish(that.dbs[db_name].root_topic + "." + c.table, {
                    action: 'select',
                    target: 'table',

                    name: c.table,
                    status: 'success',
                    message: 'selected record',
                    record_id: cursor.key
                });

                if (c.onSuccess) c.onSuccess(cursor.key, cursor.value, tx, event);
                //cursor.continue();
            }
        }
    }


    ,
    next: function(c) {
        //console.log( c );
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                table_schema = that.dbs[db_name].schema[c.table],
                schema = that.getTableSchema(c),
                primary_key = schema.primary_key.keyPath,
                cursor_position = $dhx.dataDriver.public[c.table]._internal_cursor_position,
                found = false,
                sent = false;

            function notify(cursor, tx, event) {
                $dhx.MQ.publish(that.dbs[db_name].root_topic + "." + c.table, {
                    action: 'select',
                    target: 'table',

                    name: c.table,
                    status: 'success',
                    message: 'selected record',
                    record_id: cursor.key
                });
                if (c.onSuccess) c.onSuccess(cursor.key, cursor.value, tx, event);
            }


            var timer_label = "get next record. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
            console.time(timer_label);

            var tx = that.db(db_name).transaction(c.table, "readonly"),
                table = tx.objectStore(c.table);

            c.onSuccess = c.onSuccess || false;
            c.onFail = c.onFail || false;

            if (cursor_position == 0) {
                console.timeEnd(timer_label);
                if (c.onFail) c.onFail(null, null, 'please select a record before calling next()');
                if ($dhx._enable_log) console.log('please select a record before calling next()');
            }

            tx.addEventListener('complete', function(event) {
                if ($dhx._enable_log) console.info('executed');
                if ($dhx._enable_log) console.log('transaction complete', event);
                console.timeEnd(timer_label);

                if ($dhx._enable_log) console.info('tx next record is completed');
            });
            tx.addEventListener('onerror', function(event) {
                console.timeEnd(timer_label);
                if (c.onFail) c.onFail(tx, event, event.target.error.message);
                if ($dhx._enable_log) console.log('error on transaction');
            });
            tx.addEventListener('abort', function(event) {
                console.timeEnd(timer_label);
                if ($dhx._enable_log) console.info('transaction aborted');
            });
            var search = table.openCursor(); // 
            search.onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor_position == cursor.key) {
                        found = true;
                    }
                    if (cursor_position != cursor.key) {
                        if (found && !sent) {
                            notify(cursor, tx, event)
                            sent = true;
                        }
                    }

                    cursor.continue();
                }
            }
        } catch (e) {
            console.log(e.stack)
        }
    }


    ,
    previous: function(c) {
        //console.log( c );
        var that = $dhx.dataDriver,
            db_name = c.db,
            table_schema = that.dbs[db_name].schema[c.table],
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            cursor_position = $dhx.dataDriver.public[c.table]._internal_cursor_position,
            found = false,
            sent = false;

        function notify(cursor, tx, event) {
            $dhx.MQ.publish(that.dbs[db_name].root_topic + "." + c.table, {
                action: 'select',
                target: 'table',

                name: c.table,
                status: 'success',
                message: 'selected record',
                record_id: cursor.key
            });
            if (c.onSuccess) c.onSuccess(cursor.key, cursor.value, tx, event);
        }


        var timer_label = "get previous record. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
        console.time(timer_label);

        var tx = that.db(db_name).transaction(c.table, "readonly"),
            table = tx.objectStore(c.table);

        c.onSuccess = c.onSuccess || false;
        c.onFail = c.onFail || false;

        if (cursor_position == 0) {
            console.timeEnd(timer_label);
            if (c.onFail) c.onFail(null, null, 'please select a record before calling previous()');
            if ($dhx._enable_log) console.log('please select a record before calling previous()');
        }

        tx.addEventListener('complete', function(event) {
            if ($dhx._enable_log) console.info('executed');
            if ($dhx._enable_log) console.log('transaction complete', event);
            console.timeEnd(timer_label);

            if ($dhx._enable_log) console.info('tx previous record is completed');
        });
        tx.addEventListener('onerror', function(event) {
            console.timeEnd(timer_label);
            if (c.onFail) c.onFail(tx, event, event.target.error.message);
            if ($dhx._enable_log) console.log('error on transaction');
        });
        tx.addEventListener('abort', function(event) {
            console.timeEnd(timer_label);
            if ($dhx._enable_log) console.info('transaction aborted');
        });
        var search = table.openCursor(null, 'prev'); // 
        search.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor_position == cursor.key) {
                    found = true;
                }
                if (cursor_position != cursor.key) {
                    if (found && !sent) {
                        notify(cursor, tx, event)
                        sent = true;
                    }
                }

                cursor.continue();
            }
        }
    }



    ,
    idByIndex: function() {
        'use strict';
        var that = $dhx.dataDriver;
    },
    indexById: function() {
        'use strict';
        var that = $dhx.dataDriver;
    },
    item: function() {
        'use strict';
        var that = $dhx.dataDriver;
    },
    last: function(c) {
        //console.log( c );
        var that = $dhx.dataDriver,
            db_name = c.db,
            table_schema = that.dbs[db_name].schema[c.table],
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            last_record = {};


        var timer_label = "get last record. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
        console.time(timer_label);

        var tx = that.db(db_name).transaction(c.table, "readonly"),
            table = tx.objectStore(c.table);

        c.onSuccess = c.onSuccess || false;
        c.onFail = c.onFail || false;

        tx.addEventListener('complete', function(event) {
            if ($dhx._enable_log) console.info('executed');
            if ($dhx._enable_log) console.log('transaction complete', event);
            console.timeEnd(timer_label);

            if ($dhx._enable_log) console.info('tx last record is completed');
        });
        tx.addEventListener('onerror', function(event) {
            console.timeEnd(timer_label);
            if (c.onFail) c.onFail(tx, event, event.target.error.message);
            if ($dhx._enable_log) console.log('error on transaction');
        });
        tx.addEventListener('abort', function(event) {
            console.timeEnd(timer_label);
            if (c.onFail) c.onFail(tx, event, event.target.error.message);
            if ($dhx._enable_log) console.info('transaction aborted');
        });
        var search = table.openCursor(); // 
        search.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                last_record.key = cursor.key;
                last_record.value = cursor.value
                cursor.continue();
            } else {
                if (last_record.key) {
                    $dhx.MQ.publish(that.dbs[db_name].root_topic + "." + c.table, {
                        action: 'select',
                        target: 'table',

                        name: c.table,
                        status: 'success',
                        message: 'selected record',
                        record_id: last_record.key
                    });
                    if (c.onSuccess) c.onSuccess(last_record.key, last_record.value, tx, event);
                }
            }
        }
    }


    ,
    serialize: function() {
        'use strict';
        var that = $dhx.dataDriver;
    },
    sort: function() {
        'use strict';
        var that = $dhx.dataDriver;
    }




    ,
    connect: function(c) {
        'use strict';
        var that = $dhx.dataDriver;
        try {
            $dhx.showDirections('Preparing database ... ');
            var connection = that.indexedDB.open(c.db, c.version);
            if (c.onConnect) c.onConnect({
                connection: connection,
                event: null,
                message: 'connected'
            });

            if ($dhx._enable_log) console.info('connected');
            return connection;
        } catch (e) {
            if ($dhx._enable_log) console.error('sorry Eduardo, I cant connect! Error message: ' + e.message);
            if (c.onConnectError) c.onConnectError({
                connection: null,
                event: null,
                message: e.message
            });
        }

    }

    ,
    db: function(db_name) {
        'use strict';
        var that = $dhx.dataDriver;
        try {
            return that.dbs[db_name].db
        } catch (e) {
            return false;
        }
    }

    ,
    search: function(c) {
        //console.log( c );
        var that = $dhx.dataDriver,
            db_name = c.db,
            rows_affected = 0,
            columns = {},
            records = [],
            table_schema = that.dbs[db_name].schema[c.table],
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath
        query = c.query,
            operator = 'and';


        var timer_label = "search records. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
        console.time(timer_label);

        var tx = that.db(db_name).transaction(c.table, "readonly"),
            table = tx.objectStore(c.table);

        tx.addEventListener('complete', function(event) {
            if ($dhx._enable_log) console.info('executed');
            if ($dhx._enable_log) console.log('transaction complete', event);
            console.timeEnd(timer_label);
            if (c.onReady) c.onReady(records, tx, event);
            if ($dhx._enable_log) console.info('tx search is completed');
            records = null;
        });
        tx.addEventListener('onerror', function(event) {
            console.timeEnd(timer_label);
            if (c.onFail) c.onFail(tx, event, event.target.error.message);
            if ($dhx._enable_log) console.log('error on transaction');
            records = null;
        });
        tx.addEventListener('abort', function(event) {
            console.timeEnd(timer_label);
            if ($dhx._enable_log) console.info('transaction aborted');
            records = null;
        });

        if (query['and']) {
            columns = query['and'];
        } else if (query['or']) {
            operator = 'or';
            columns = query['or'];
        }
        //var index = table.index('name');
        //var search = index.get('José');
        var search = table.openCursor(); // 
        // IDBKeyRange.lowerBound("name") list a partir do valor
        // IDBKeyRange.bound("José", "eu", true, true) lista entre valores

        search.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var total_check = 0;
                var total_passed = 0;
                for (var column in columns) {
                    if (columns[column] != '' && columns[column] != null)
                        total_check = total_check + 1;
                }

                for (var column in columns) {
                    if (columns[column] != '' && columns[column] != null) {
                        if (typeof cursor.value[column] !== 'undefined') {

                            //console.log(cursor.value);
                            //console.log(cursor.value[column]);

                            if ($dhx.isNumber(cursor.value[column]) && $dhx.isNumber(columns[column])) {
                                var search_value = new Number(columns[column]);
                                var column_value = Number(cursor.value[column]);

                                if (search_value == column_value) {
                                    total_passed = total_passed + 1;
                                    if (total_passed == total_check) {
                                        rows_affected = rows_affected + 1;
                                        records.push(cursor.value);
                                        if (c.onFound) c.onFound(cursor.key, cursor.value, tx, event);
                                    }
                                }

                            } else {
                                var search_value = columns[column].toLowerCase().latinize();
                                var column_value = cursor.value[column].toLowerCase().latinize();

                                var re = new RegExp(search_value);
                                if (re.test(column_value)) {
                                    total_passed = total_passed + 1;
                                    if (total_passed == total_check) {
                                        rows_affected = rows_affected + 1;
                                        records.push(cursor.value);
                                        if (c.onFound) c.onFound(cursor.key, cursor.value, tx, event);
                                    }
                                }
                            }


                        }

                    }
                }
                cursor.continue();
            } else {

            }
        }
    }


    ,
    serialize: function(c) {
        //console.log( c );
        var that = $dhx.dataDriver,
            db_name = c.db,
            rows_affected = 0,
            columns = {},
            records = [],
            table_schema = that.dbs[db_name].schema[c.table],
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath
        query = c.query,
            operator = 'and';


        var timer_label = "serialize records. task: " + $dhx.crypt.SHA2(JSON.stringify(c));
        console.time(timer_label);

        var tx = that.db(db_name).transaction(c.table, "readonly"),
            table = tx.objectStore(c.table);

        tx.addEventListener('complete', function(event) {
            if ($dhx._enable_log) console.info('executed');
            if ($dhx._enable_log) console.log('transaction complete', event);
            console.timeEnd(timer_label);
            if (c.onSuccess) c.onSuccess(records, tx, event);
            if ($dhx._enable_log) console.info('tx serialize is completed');
        });
        tx.addEventListener('onerror', function(event) {
            console.timeEnd(timer_label);
            if (c.onFail) c.onFail(tx, event, event.target.error.message);
            if ($dhx._enable_log) console.log('error on transaction');
        });
        tx.addEventListener('abort', function(event) {
            console.timeEnd(timer_label);
            if ($dhx._enable_log) console.info('transaction aborted');
        });
        var search = table.openCursor(); // 
        search.onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                rows_affected = rows_affected + 1;
                records.push(cursor.value);
                cursor.continue();
            }
        }
    }




    ,
    public: [],
    events: [],
    _addInitialRecords: function(c, connection, event) {
        var that = $dhx.dataDriver,
            db_name = c.db,
            self = this,
            topic = 'database.' + c.db;

        that._table_to_fill_on_init = Object.keys(that.dbs[db_name].records).length;


        //c.records
		
		for(var x = 0; x <  that.dbs[db_name].output_tables.length; x++)
		{
			var table = that.dbs[db_name].output_tables[x].table_name;
			$dhx.dataDriver.public[table].add(that.dbs[db_name].records[table], function(tx, event, rows_affected) {
                    that._table_to_filled_on_init = that._table_to_filled_on_init + 1;
                    if (that._table_to_filled_on_init == that._table_to_fill_on_init) {
                        that._setReady(c, connection, event);
                    }
                    //console.log( '???????????????? ready and all records loaded' );
            }, function(tx, event, rows_affected) {

           	}, true);
		}

        //console.log( that._table_to_fill_on_init );
        //for (var table in that.dbs[db_name].records) {
        //    if (that.dbs[db_name].records.hasOwnProperty(table)) {
                
        //    }
        //}
    },
    _setReady: function(c, connection, event) {
        var that = $dhx.dataDriver,
            db_name = c.db,
            self = this,
            topic = 'database.' + c.db;
        $dhx.hideDirections();
        if ($dhx._enable_log) console.info('Database ' + db_name + ' is ready '); // , connection.result
        $dhx.MQ.publish(topic, {
            action: 'ready',
            target: 'database',
            name: db_name,
            status: 'success',
            message: 'database is ready',
            onReady: c.onReady,
            onReadyO: {
                connection: connection,
                event: event,
                message: 'ready'
            }
        });
        /*if (c.onReady) c.onReady({
				connection: connection
				, event: event
				, message: 'ready'
			});	*/

    },
    _createDatabase: function(c, self) {
        var that = $dhx.dataDriver,
            db_name = c.db,
            schema = c.schema || {},
            connection = null,
            database = null,
            upgraded = false,
            //this = self,
            topic = 'database.' + c.db;

        connection = that.connect(c);
        connection.onupgradeneeded = function(event) {
            upgraded = true;
            if ($dhx._enable_log) console.log(event);
            if ($dhx._enable_log) console.info('db ' + db_name + ' created ');
            database = connection.result;
            database.onerror = function(event) {
                // Generic error handler for all errors targeted at this database's
                //alert("Database error: " + event.target.errorCode);
                if ($dhx._enable_log) console.info('   >>>>  DATABASE CONNECTION ERROR   <<<<  ', event);
            };
            database.onversionchange = function(event) {
                if ($dhx._enable_log) console.info('   >>>>  DATABASE VERSION CHANGED   <<<<  ');
            };
            database.onabort = function(event) {
                if ($dhx._enable_log) console.info('   >>>>  DATABASE CONNECTION ABORTED   <<<<  ');
                //if ($dhx._enable_log) console.log( event );
            }
			
            that.dbs[db_name] = {
                db: database,
                name: db_name,
                schema: schema,
                records: c.records,
				output_tables : c.output_tables,
                settings: c.settings,
                version: c.version,
                connection: connection,
                event: event,
                subscriber: function(msg, data) {
                    //console.log( 'DB ROOT SUBSCRIBER: ', msg, data );
                },
                root_topic: topic
            };
            if (c.onCreate)
                that.dbs[db_name].onCreate = c.onCreate
            for (var table in c.schema)
                if (c.schema.hasOwnProperty(table)) {
                    //console.log( c.schema[ table ] );
                    self.table(table).create({
                        primary_key: c.schema[table].primary_key,
                        columns: c.schema[table].columns,
                        records: c.schema[table].records,
						output_tables : c.schema[table].output_tables,
                        onSuccess: function(response) {},
                        onFail: function(response) {}
                    });
                }
        };
        connection.onerror = function(event) {
            if ($dhx._enable_log) console.info('error when tryin to connect the ' + db_name + ' database', connection.errorCode);
            if (c.onFail) c.onFail({
                connection: connection,
                event: event,
                message: 'error when tryin to connect the ' + db_name + ' database' + connection.errorCode
            });
        };
        connection.onblocked = function(event) {
            if ($dhx._enable_log) console.info('blocked');
            if (c.onFail) c.onFail({
                connection: connection,
                event: event,
                message: 'blocked'
            });
        };
        connection.onsuccess = function(event) {
            database = connection.result;
            $dhx.jDBdStorage.storeObject('$dhx.db.' + db_name, JSON.stringify({
                version: c.version,
                hash: $dhx.crypt.SHA2(JSON.stringify(schema))
				,records_size : JSON.stringify( c.records ).length
            }));
			
            that.dbs[db_name] = {
                db: database,
                name: db_name,
                version: c.version,
                schema: schema,
                records: c.records,
				output_tables : c.output_tables,
                settings: c.settings,
                connection: connection,
                event: event,
                subscriber: function(msg, data) {
                    if ($dhx._enable_log) console.info('DB received message: ', msg, data);

                    if (data.action == 'ready' && data.name == db_name && data.status == 'success') {
                        if (data.onReady) data.onReady(data.onReadyO);
                    }
                },
                root_topic: topic
            };
            $dhx.MQ.subscribe(topic, that.dbs[db_name].subscriber);

            if (c.records) {
                if (upgraded)
				{
                    if( Object.keys(c.records).length > 0 )
					{
						that._addInitialRecords(c, connection, event);
					}
					else
					{
						that._setReady(c, connection, event);
					}
				}
                else
                {
					that._setReady(c, connection, event);	
				}
            } else {
                that._setReady(c, connection, event);
            }

        };
        // public SCHEMA API
        self.schema = {}; // public schema API
        for (var table in c.schema) {
            if (c.schema.hasOwnProperty(table)) {
                //console.log(table, db_name,  topic);
                self.schema[table] = (function(table, db_name) {
                    return {
                        attachEvent: function(eventStr, fnCallBack) {
                                typeof that.events[eventStr] === 'undefined' ? that.events[eventStr] = [] : "";
                                that.events[eventStr].push(fnCallBack)
                            }
                            //

                        ,
                        onAfterAdd: function(records, rows_affected) {
                            var eventStr = 'onAfterAdd';
                            if (typeof that.events[eventStr] !== 'undefined') {
                                that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                    fnCallBack(records, rows_affected);
                                });
                            }
                        },
                        onBeforeAdd: function() {
                                var eventStr = 'onBeforeAdd';
                                if (typeof that.events[eventStr] !== 'undefined') {
                                    that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                        fnCallBack();
                                    });
                                }
                            }
                            //

                        ,
                        onAfterCursorChange: function(cursor_id, table) {
                            var eventStr = 'onAfterCursorChange';
                            if (typeof that.events[eventStr] !== 'undefined') {
                                that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                    fnCallBack(cursor_id, table);
                                });
                            }
                        },
                        onBeforeCursorChange: function() {
                                var eventStr = 'onBeforeCursorChange';
                                if (typeof that.events[eventStr] !== 'undefined') {
                                    that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                        fnCallBack();
                                    });
                                }
                            }
                            //

                        ,
                        onAfterDelete: function(cursor_id) {
                            var eventStr = 'onAfterDelete';
                            if (typeof that.events[eventStr] !== 'undefined') {
                                that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                    fnCallBack(cursor_id);
                                });
                            }
                        },
                        onBeforeDelete: function(cursor_id) {
                                var eventStr = 'onBeforeDelete';
                                if (typeof that.events[eventStr] !== 'undefined') {
                                    that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                        fnCallBack(cursor_id);
                                    });
                                }
                            }
                            //

                        ,
                        onAfterUpdate: function(cursor_id) {
                            var eventStr = 'onAfterUpdate';
                            if (typeof that.events[eventStr] !== 'undefined') {
                                that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                    fnCallBack(cursor_id);
                                });
                            }
                        },
                        onBeforeUpdate: function(cursor_id) {
                                var eventStr = 'onBeforeUpdate';
                                if (typeof that.events[eventStr] !== 'undefined') {
                                    that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                        fnCallBack(cursor_id);
                                    });
                                }
                            }
                            //

                        ,
                        onBeforeLoading: function(cursor_id) {
                            var eventStr = 'onBeforeLoading';
                            if (typeof that.events[eventStr] !== 'undefined') {
                                that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                    fnCallBack(cursor_id);
                                });
                            }
                        },
                        onAfterLoading: function(cursor_id) {
                            var eventStr = 'onAfterLoading';
                            if (typeof that.events[eventStr] !== 'undefined') {
                                that.events[eventStr].forEach(function(fnCallBack, index, array) {
                                    fnCallBack(cursor_id);
                                });
                            }
                        }

                        ,
                        _synced_components: [],
                        _bound_components: [],
                        _internal_cursor_position: 0,
                        onAddRecord: false,
                        onUpdateRecord: false,
                        onDeleteRecord: false,
                        _subscriber: function(topic, data) {
                            if (!$dhx.isObject(data))
                                JSON.parse(data);
                            //console.log( data );
                            if (data.target == 'table') {
                                if (data.name == table) {
                                    if ($dhx._enable_log) 
									{
										console.info('the table ' + data.name + ' from ' + db_name 
											+ ' database received a message about it: ', data);
									}
                                    if (data.action == 'select' && data.message == 'selected record') {
                                        //console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
                                        self.schema[table].setCursor(data.record_id, function() {}, function() {});
                                    }
                                    if (data.action == 'add' && data.message == 'record added' && data.origin == 'server') {
                                        console.log('XXXXXXXXXXXXXXXXXXXXX', data);
										$dhx.dataDriver.public[data.name].add(data.records, function(tx, event, rows_affected) {
											if ($dhx._enable_log) console.info('record saved. rows_affected: ', rows_affected);
											//(onSuccess) ? onSuccess(): "";
										}, function(tx, event, error_message) {
											
											
											if ($dhx._enable_log) console.info('record not saved. ', error_message);
											//(onFail) ? onFail(): "";
										}, false/*isOnCreate*/, true/*notPublish*/);
                                    }
									
									if (data.action == 'update' && data.message == 'record updated' && data.origin == 'server') {
										$dhx.dataDriver.public[data.name].update(data.record_id, data.record, data.old_record, function(tx, event, rows_affected) {
											if ($dhx._enable_log) console.info('record saved. rows_affected: ', rows_affected);
										}, function(tx, event, rows_affected) {
											if ($dhx._enable_log) console.info('record not updated. ', error_message);
										}, true);
                                    }
									
									if (data.action == 'delete' && data.message == 'record deleted' && data.origin == 'server') {
										$dhx.dataDriver.public[data.name].del(data.record_id, function(tx, event, record_id) {
											if ($dhx._enable_log) console.info('record deleted. id: ', record_id);
										}, function(tx, event, error_message) {
											if ($dhx._enable_log) console.info('record not deleted. ', error_message);
										}, true);
                                    }
                                }
                            }
                        },
                        add: function(record, onSuccess, onFail, isOnCreate, notPublish) {
                            //console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> persons.add isOnCreate ', isOnCreate );
                            that.add({
                                db: db_name,
                                table: table,
                                record: record,
                                onSuccess: onSuccess,
                                onFail: onFail,
                                isOnCreate: isOnCreate || false,
								notPublish : notPublish || false
                            });
                        },
                        update: function(record_id, record, old_record, onSuccess, onFail, notPublish) {
                            that.update({
                                db: db_name,
                                table: table,
                                record_id: record_id,
                                record: record,
                                old_record: old_record,
                                onSuccess: onSuccess,
                                onFail: onFail,
								notPublish : notPublish || false
								
                            });
                        },
                        load: function(onSuccess, onFail) {
                            that.load({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        del: function(record_id, onSuccess, onFail, notPublish) {
                            that.del({
                                db: db_name,
                                table: table,
                                record_id: record_id,
                                onSuccess: onSuccess,
                                onFail: onFail,
								notPublish : notPublish || false
                            });
                        },
                        remove: function(record_id, onSuccess, onFail, notPublish) {
                            that.del({
                                db: db_name,
                                table: table,
                                record_id: record_id,
                                onSuccess: onSuccess,
                                onFail: onFail,
								notPublish : notPublish || false
                            });
                        },
                        clearAll: function(onSuccess, onFail) {
                            that.clearAll({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        count: function(onSuccess, onFail) {
                            that.count({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        getTableSizeInBytes: function(onSuccess, onFail) {
                            that.getTableSizeInBytes({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        }

                        ,
                        dataCount: function(onSuccess, onFail) {
                            that.count({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        count: function(onSuccess, onFail) {
                            that.count({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        }

                        ,
                        bind: (function(db_name, table) {
                            return {
                                form: function(c) {
                                    //console.log( c );
                                    that.bind({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        prepare: c.prepare,
                                        type: 'form',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                }
                            }
                        })(db_name, table)

                        ,
                        getCursor: function(onSuccess, onFail) {
                            that.getCursor({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        getCurrentRecord: function(onSuccess, onFail) {
                            that.getCurrentRecord({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        getRecord: function(record_id, onSuccess, onFail) {
                            that.getRecord({
                                db: db_name,
                                table: table,
                                record_id: record_id,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        }

                        ,
                        filter: (function(db_name, table) {
                            return {
                                where: function(c) {
                                    that.search({
                                        db: db_name,
                                        query: c.query,
                                        table: table,
                                        onReady: c.onReady,
                                        onFound: c.onFound,
                                        onFail: c.onFail
                                    });
                                }
                            }
                        })(db_name, table),
                        first: function(onSuccess, onFail) {
                            that.first({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        exists: function() {},
                        idByIndex: function() {},
                        indexById: function() {},
                        item: function(onSuccess, onFail) {
                            that.getCurrentRecord({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        }

                        ,
                        last: function(onSuccess, onFail) {
                            that.last({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        next: function(onSuccess, onFail) {
                            that.next({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        },
                        previous: function(onSuccess, onFail) {
                            that.previous({
                                db: db_name,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        }

                        ,
                        _getColumnsId: function(onSuccess, onFail) {
                            return that._getColumnsId({
                                db: db_name,
                                table: table
                            });
                        },
                        _getColumnsHeader: function(onSuccess, onFail) {
                            return that._getColumnsHeader({
                                db: db_name,
                                table: table
                            });
                        },
                        _getColumnsType: function(onSuccess, onFail) {
                            return that._getColumnsType({
                                db: db_name,
                                table: table
                            });
                        }

                        ,
                        _getColumnsSorting: function(onSuccess, onFail) {
                            return that._getColumnsSorting({
                                db: db_name,
                                table: table
                            });
                        },
                        _getColumnsAlign: function(onSuccess, onFail) {
                            return that._getColumnsAlign({
                                db: db_name,
                                table: table
                            });
                        },
                        _getColumnsWidth: function(onSuccess, onFail) {
                            return that._getColumnsWidth({
                                db: db_name,
                                table: table
                            });
                        }

                        ,
                        serialize: function() {},
                        sort: function() {}

                        ,
                        search: (function(db_name, table) {
                            return {
                                where: function(c) {
                                    that.search({
                                        db: db_name,
                                        query: c.query,
                                        table: table,
                                        onReady: c.onReady,
                                        onFound: c.onFound,
                                        onFail: c.onFail
                                    });
                                }
                            }
                        })(db_name, table)

                        ,
                        setCursor: function(record_id, onSuccess, onFail) {
                            that.setCursor({
                                db: db_name,
                                record_id: record_id,
                                table: table,
                                onSuccess: onSuccess,
                                onFail: onFail
                            });
                        }

                        ,
                        sync: (function(db_name, table) {
                            return {
                                grid: function(c) {
                                    //console.log( c );
                                    that.sync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'grid',
                                        auto_configure: c.auto_configure,
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                combo: function(c) {
                                    //console.log( c );
                                    that.sync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'combo',
                                        $init: c.$init,
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                select: function(c) {
                                    //console.log( c );
                                    that.sync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'select',
                                        $init: c.$init,
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                selectGrid: function(c) {
                                    //console.log( c );
                                    that.sync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'selectGrid',
                                        $init: c.$init,
                                        prop_value: c.prop_value,
                                        prop_text: c.prop_text,
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                dataview: function(c) {
                                    that.sync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'dataview',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                scheduler: function(c) {
                                    that.sync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'scheduler',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                chart: function() {
                                    that.sync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'chart',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                }
                            }
                        })(db_name, table),
                        unbind: (function(db_name, table) {
                            return {
                                form: function(c) {
                                    //console.log( c );
                                    that.unbind({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'form',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                }
                            }
                        })(db_name, table),
                        unsync: (function(db_name, table) {
                            return {
                                combo: function(c) {
                                    //console.log( c );
                                    that.unsync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'combo',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                select: function(c) {
                                    //console.log( c );
                                    that.unsync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'select',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                selectGrid: function(c) {
                                    //console.log( c );
                                    that.unsync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'selectGrid',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                },
                                grid: function(c) {
                                    //console.log( c );
                                    that.unsync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'grid',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                }
								,dataview: function(c) {
                                    //console.log( c );
                                    that.unsync({
                                        db: db_name,
                                        table: table,
                                        component: c.component,
                                        type: 'dataview',
                                        component_id: c.component_id,
                                        onSuccess: c.onSuccess,
                                        onFail: c.onFail
                                    });
                                }
                            }
                        })(db_name, table)

                        ,
                        toPDF: function() {
                            var doc = new jsPDF();
                            var specialElementHandlers = {
                                    // element with id of "bypass" - jQuery style selector
                                    '#bypassme': function(element, renderer) {
                                        // true = "handled elsewhere, bypass text extraction"
                                        return true
                                    }
                                }
                                //console.log($('.row20px').parent().parent().html());
                            doc.fromHTML($('.row20px').parent().parent().html(), 0.5 // x coord

                                , 0.5 // y coord

                                , {
                                    'width': 7.5 // max width of content on PDF

                                    ,
                                    'elementHandlers': specialElementHandlers
                                });
                            // Output as Data URI
                            doc.save('Test.pdf');
                        }
                    };
                })(table, db_name, that);
            }
            $dhx.MQ.subscribe(topic, self.schema[table]._subscriber);
            that.public[table] = self.schema[table];
        }
        // public DATABASE API .. exposed via new Object()
        self.table = function(table) {
                // create public api
                return {
                    create: function(c) {
                            //console.log( c )
                            c = c || {};
                            that.createTable({
                                db: db_name,
                                table: table,
                                columns: c.columns,
                                primary_key: c.primary_key,
                                records: c.records,
                                onSuccess: c.onSuccess,
                                onFail: c.onFail
                            });
                        } // end create table
                }
            } // end create
        self.drop = function(onSuccess, onFail) {
            'use strict';
            c = c || {};
            that.dropDatabase({
                db: db_name,
                onSuccess: onSuccess,
                onFail: onFail
            });
        }
        self._getQuota = function(onSuccess, onFail) {
            if ($dhx.Browser.name != "Chrome") {
                var err = $dhx.Browser.name + " does not provide quota management.";
                $dhx.notify('Quota information', err, 'icons/db.png');
                if (onFail) onFail(err);
                return;
            }
            var webkitStorageInfo = window.webkitStorageInfo || navigator.webkitTemporaryStorage || navigator.webkitPersistentStorage;
            webkitStorageInfo.queryUsageAndQuota(webkitStorageInfo.TEMPORARY, function(used, remaining) {
                console.log("Used quota: " + used + ", remaining quota: " + remaining);
                if (onSuccess) onSuccess(used, remaining);
            }, function(e) {
                if (onFail) onFail(e);
                console.log('Error', e);
            });
        }
    },
    database: function(c) {
        //'use strict';
	
        try {
            var that = $dhx.dataDriver,
                db_name = c.db,
                schema = c.schema || {},
                connection = null,
                database = null,
                upgraded = false,
                self = this,
                topic = 'database.' + c.db;

            $dhx.MQ.oldPublish = $dhx.MQ.publish;

            $dhx.MQ.publish = function(topic, message) 
			{
                if (message.message == 'record added')
				 {
                    if (typeof message.onInit !== 'undefined') {
                        if (message.onInit) {
                            if ($dhx._enable_log) console.info('records added on init', 'I will not send cross window message');
                            return;
                        }

                    }
                }
				//send to everybody via socket
                if (message.message == 'record added' || message.message == 'record updated' || message.message == 'record deleted' || message.message == 'change wallpaper') {
					var mclone = $dhx.extend(message)
					mclone['topic'] = topic;				
					$dhx.ui.desktop.socket.send(mclone);
                }
				// send to local only
				else
				{
					$dhx.MQ.oldPublish(topic, message);
				}				
            }

            window.addEventListener('storage', function(storageEvent) {
                if (storageEvent.key)
                    if (storageEvent.key.indexOf('message.') != -1) {
                        //console.log('>>>>>>>>>>>>>>>>>>>XXXXXXXXXXXX ', storageEvent);
                        var topic = storageEvent.key.replace('message.', "");
                        if (storageEvent.newValue) {
                            var message = JSON.parse(storageEvent.newValue);
                            console.log(message);
                            $dhx.MQ.oldPublish(topic, JSON.parse(message));
                            $dhx.jDBdStorage.deleteDatabase('message.' + topic);
                        }
                    }
            }, false);

            // lets protype indexedDB into dataDriver
            that.protectIndexedDB();

            if (!$dhx.dataDriver.browserPassed())
                return;

            if (!$dhx.dataDriver.validDSN(c))
                return;

            $dhx.isNumber(c.version) ? (c.version < 1 ? c.version = 1 : "") : c.version = 1;
			
			
			
			

            var currently_database_onclient = $dhx.jDBdStorage.get('$dhx.db.' + db_name);
            if (typeof currently_database_onclient === 'undefined') {
                if ($dhx._enable_log) console.info('there is no version for database ' + db_name + ' at indexedDB.');
                if ($dhx._enable_log) console.info('Lets create it ....');
                that._createDatabase(c, self);
            } else {
                currently_database_onclient = JSON.parse(currently_database_onclient);
                if (typeof currently_database_onclient.version === 'undefined') {
                    if ($dhx._enable_log) console.info('there is no version for database ' + db_name + ' at indexedDB.');
                    if ($dhx._enable_log) console.info('Lets create it ....');
                    that._createDatabase(c, self);
                } else {
                    if ($dhx._enable_log) console.info('there is as saved version for database ' + db_name + ' at indexedDB.');
                    //if ($dhx._enable_log) console.log(currently_database_onclient.hash, $dhx.crypt.SHA2(JSON.stringify(schema)));
					
					if ( parseInt(currently_database_onclient.version) == parseInt(c.version) ) 
					{
						if ($dhx._enable_log) console.info('local and remote databases are equal.');
						if( currently_database_onclient.records_size != JSON.stringify( c.records ).length )
						{
							if ($dhx._enable_log) console.info('need to sync data. lets create database and sync.');
							that.dropDatabase({
								db: db_name,
								onSuccess: function() {
									that._createDatabase(c, self)
								},
								onFail: function() {
	
								}
							});
						}
						else
						{
							if ($dhx._enable_log) console.info('data sync is not necessary. lets open database.');
                        	that._createDatabase(c, self);
						}
						
						
						
                    } else {
                        if ($dhx._enable_log) console.info('currently database is out to date. lets update it.');
                        that.dropDatabase({
                            db: db_name,
                            onSuccess: function() {
                                that._createDatabase(c, self)
                            },
                            onFail: function() {

                            }
                        });
                    }
                }
            }
        } catch (e) {
            console.log(e.stack);
            //console.log(e.message);	
        }
    }

    ,
    protectIndexedDB: function() {
        'use strict';
        if (typeof $dhx.dataDriver.indexedDB === 'undefined')
            Object.defineProperty($dhx.dataDriver, "indexedDB", {
                value: window.indexedDB,
                enumerable: true,
                configurable: false,
                writable: false
            });
    }

    ,
    getTableSchema: function(c) {
        'use strict';
        var that = $dhx.dataDriver;
        try {
            return $dhx.dataDriver.dbs[c.db].schema[c.table];
        } catch (e) {
            return null
        }

    }

    ,
    _getColumnsByOrdinalPosition: function(columns, position) {
        'use strict';
        for (var x = 0; x < columns.length; x++) {
            var column = columns[x];
            if (column.ordinal_position == position) {
                return column;
            }
        }
        if ($dhx._enable_log) console.info(
            'sorry Eduardo, I cant _getColumnsByOrdinalPosition! Error message: ordinal position not found'
        );
        return {};
    }

    ,
    _getColumnsId: function(c) {
        'use strict';
        var that = $dhx.dataDriver,
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            columns = [],
            sorted = [primary_key];

        for (var hash in schema.columns) {
            if (schema.columns.hasOwnProperty(hash))
                columns.push(schema.columns[hash]);
        }
        columns.sort(function(a, b) {
            return a.ordinal_position - b.ordinal_position;
        });
        for (var index = 0; index < columns.length; index++) {
            var column = columns[index];
            sorted.push(column.name);
        }
        return sorted.join(',');
    }

    ,
    _getColumnsHeader: function(c) {
        'use strict';
        var that = $dhx.dataDriver,
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            columns = [],
            sorted = [primary_key];

        for (var hash in schema.columns) {
            if (schema.columns.hasOwnProperty(hash))
                columns.push(schema.columns[hash]);
        }
        columns.sort(function(a, b) {
            return a.ordinal_position - b.ordinal_position;
        });
        for (var index = 0; index < columns.length; index++) {
            //console.log(columns[ index ])
            var column = columns[index];
            sorted.push(column.dhtmlx_grid_header);
        }
        return sorted.join(',');
    }




    ,
    _getColumnsWidth: function(c) {
        'use strict';
        var that = $dhx.dataDriver,
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            columns = [],
            sorted = ['100'];

        for (var hash in schema.columns) {
            if (schema.columns.hasOwnProperty(hash))
                columns.push(schema.columns[hash]);
        }
        columns.sort(function(a, b) {
            return a.ordinal_position - b.ordinal_position;
        });
        for (var index = 0; index < columns.length; index++) {
            var column = columns[index];
            sorted.push(column.dhtmlx_grid_width);
        }
        return sorted.join(',');
    }

    ,
    _getColumnsAlign: function(c) {
        'use strict';
        var that = $dhx.dataDriver,
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            columns = [],
            sorted = ['right'];

        for (var hash in schema.columns) {
            if (schema.columns.hasOwnProperty(hash))
                columns.push(schema.columns[hash]);
        }
        columns.sort(function(a, b) {
            return a.ordinal_position - b.ordinal_position;
        });
        for (var index = 0; index < columns.length; index++) {
            //console.log(columns[ index ])
            var column = columns[index];
            sorted.push(column.dhtmlx_grid_align);
        }
        return sorted.join(',');
    }

    ,
    _getColumnsType: function(c) {
        'use strict';
        var that = $dhx.dataDriver,
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            columns = [],
            sorted = ['ro'];

        for (var hash in schema.columns) {
            if (schema.columns.hasOwnProperty(hash))
                columns.push(schema.columns[hash]);
        }
        columns.sort(function(a, b) {
            return a.ordinal_position - b.ordinal_position;
        });
        for (var index = 0; index < columns.length; index++) {
            var column = columns[index];
            //console.log( column );
            sorted.push(columns[index].dhtmlx_grid_type);
        }
        return sorted.join(',');
    }

    ,
    _getColumnsSorting: function(c) {
        'use strict';
        var that = $dhx.dataDriver,
            schema = that.getTableSchema(c),
            primary_key = schema.primary_key.keyPath,
            columns = [],
            sorted = ['int'];

        for (var hash in schema.columns) {
            if (schema.columns.hasOwnProperty(hash))
                columns.push(schema.columns[hash]);
        }
        columns.sort(function(a, b) {
            return a.ordinal_position - b.ordinal_position;
        });
        for (var index = 0; index < columns.length; index++) {
            var column = columns[index];
            sorted.push(columns[index].dhtmlx_grid_sorting);
        }
        return sorted.join(',');
    }

    ,
    _setInputMask: function(input, mask_to_use) {

        if (mask_to_use == "currency") {
            try {
                id = input.id;
            } catch (e) {
                id = input.getAttribute("id");
            }
            $("#" + id).priceFormat({
                prefix: ''
            });
        } else if (mask_to_use == "can_currency") {
            try {
                id = input.id;
            } catch (e) {
                id = input.getAttribute("id");
            }
            $("#" + id).priceFormat({
                prefix: 'CAN '
            });
        } else if (mask_to_use == "integer") {
            input.onkeydown = function(event) {
                only_integer(this);
            };
        } else if (mask_to_use == "us_phone") {
            input.onkeypress = function(event) {
                phone_mask(this);
            };
            input.maxLength = "13";
        } else if (mask_to_use == "expiration_date") {
            input.onkeypress = function(event) {
                expiration_date(this);
            };
            input.maxLength = "5";
        } else if (mask_to_use == "cvv") {
            input.onkeydown = function(event) {
                only_integer(this);
            };
            input.maxLength = "4";
        } else if (mask_to_use == "credit_card") {
            input.onkeydown = function(event) {
                only_integer(this);
            };
            input.maxLength = "16";
        } else if (mask_to_use == "time") {
            //console.log("time mask")
            input.onkeydown = function(event) {
                time_mask(this, event);
            };
            input.maxLength = "8";
        } else if (mask_to_use == "SSN") {
            input.onkeypress = function(event) {
                ssn_mask(this);
            };
            input.maxLength = "11";
        }
    }

    ,
    _validateValueByType: function(value, validate, label) {
        var NotEmpty = validate.toString().match("NotEmpty"),
            Empty = validate.toString().match("Empty"),
            ValidEmail = validate.toString().match("ValidEmail"),
            ValidInteger = validate.toString().match("ValidInteger"),
            ValidFloat = validate.toString().match("ValidFloat"),
            ValidNumeric = validate.toString().match("ValidNumeric"),
            ValidAplhaNumeric = validate.toString().match("ValidAplhaNumeric"),
            ValidDatetime = validate.toString().match("ValidDatetime"),
            ValidDate = validate.toString().match("ValidDate"),
            ValidTime = validate.toString().match("ValidTime"),
            ValidCurrency = validate.toString().match("ValidCurrency"),
            ValidSSN = validate.toString().match("ValidSSN"),
            ValidExpirationdate = validate.toString().match("ValidExpirationdate");

        if (NotEmpty == "NotEmpty") {
            // if the value have not a lenght > 0
            if (value.toString().length < 1) {
                ////$dhx.dhtmlx._setInputInvalid( input );
                dhtmlx.message({
                    type: "error",
                    text: $dhx.ui.language.text_labels.validation_notEmpty(label)
                }); //
                return false;
            }
        }
        if (Empty == "Empty" && NotEmpty != "NotEmpty") {
            // if the value have not a lenght > 0
            if (value.toString().length > 0) {
                //$dhx.dhtmlx._setInputInvalid( input );
                dhtmlx.message({
                    type: "error",
                    text: $dhx.ui.language.text_labels.validation_Empty(label)
                });
                return false;
            }
        }
        if (ValidEmail == "ValidEmail") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value)) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidEmail(label)
                    });
                    return false;
                }
            }
        }
        if (ValidInteger == "ValidInteger") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (!value.match(/^\d+$/)) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidInteger(label)
                    });
                    return false;
                }
            }
        }
        if (ValidFloat == "ValidFloat") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (!value.match(/^\d+\.\d+$/)) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidFloat(label)
                    });
                    return false;
                }
            }
        }
        if (ValidNumeric == "ValidNumeric") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (isNaN(value)) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidNumeric(label)
                    });
                    return false;
                }
            }
        }
        if (ValidAplhaNumeric == "ValidAplhaNumeric") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (!value.match(/^[0-9a-z]+$/)) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidAplhaNumeric(label)
                    });
                    return false;
                }
            }
        }
        if (ValidDatetime == "ValidDatetime") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (isNaN(Date.parse(value))) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidDatetime(label)
                    });
                    return false;
                }
            }
        }
        if (ValidDate == "ValidDate") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (isNaN(Date.parse(value))) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidDate(label)
                    });
                    return false;
                }
            }
        }
        if (ValidTime == "ValidTime") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                var matchArray = value.match(/^(\d{1,2}):(\d{2})(:(\d{2}))?(\s?(AM|am|PM|pm))?$/);
                if (matchArray == null) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                    });
                    return false;
                }
                if (value.toString().toLowerCase().match("am") == "am" || value.toString().toLowerCase().match("pm") == "pm") {
                    if (value.split(":")[0] > 12 || (value.split(":")[1]).split(" ")[0] > 59) {
                        //$dhx.dhtmlx._setInputInvalid( input );
                        dhtmlx.message({
                            type: "error",
                            text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                        });
                        return false;
                    }
                } else {
                    if (value.split(":")[0] > 23 || value.split(":")[1] > 59) {
                        //$dhx.dhtmlx._setInputInvalid( input );
                        dhtmlx.message({
                            type: "error",
                            text: $dhx.ui.language.text_labels.validation_ValidTime(label)
                        });
                        return false;
                    }
                }
            }
        }
        if (ValidCurrency == "ValidCurrency") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (!/^\d+(?:\.\d{0,2})$/.test(value)) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidCurrency(label)
                    });
                    return false;
                }
            }
        }
        if (ValidSSN == "ValidSSN") {
            // if the value have not a lenght > 0
            if (value.length > 0) {
                if (!value.match(/^\d{3}-\d{2}-\d{4}$/)) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidSSN(label)
                    });
                    return false;
                }
            }
        }
        if (ValidExpirationdate == "ValidExpirationdate") {
            // if the value have not a lenght > 0  00/00
            if (value.length > 0) {
                if (value.length != 5) {
                    //$dhx.dhtmlx._setInputInvalid( input );
                    dhtmlx.message({
                        type: "error",
                        text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                    });
                    return false;
                } else {
                    var month = value.split("/")[0];
                    var year = value.split("/")[1];
                    if (isNaN(month) || isNaN(year)) {
                        //$dhx.dhtmlx._setInputInvalid( input );
                        dhtmlx.message({
                            type: "error",
                            text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                        });
                        return false;
                    }
                    if (!(month > 0 && month < 13)) {
                        //$dhx.dhtmlx._setInputInvalid( input );
                        dhtmlx.message({
                            type: "error",
                            text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                        });
                        return false;
                    }
                    if (!(year > 0 && year < 99)) {
                        //$dhx.dhtmlx._setInputInvalid( input );
                        dhtmlx.message({
                            type: "error",
                            text: $dhx.ui.language.text_labels.validation_ValidExpirationdate(label)
                        });
                        return false;
                    }
                }
            }
        }
        return true;
    }

    //
    ,
    disconnect: function(db_name) {
        'use strict';
        try {
            var that = $dhx.dataDriver;
            if (that.db(db_name))
                that.db(db_name).close();
        } catch (e) {
            if ($dhx._enable_log) console.error('sorry Eduardo, I cant disconnect! Error message: ' + e.message);
            //if ($dhx._enable_log) console.info(e);
            if (c.onFail) c.onFail(null, null, e.message);
        }

    }

    ,
    _setInputInvalid: function(objInput) {
        var original_color = objInput.style.backgroundColor;
		objInput.style.backgroundColor = "#fdafa3";
        objInput.focus();
		objInput.addEventListener('click', function(event) {
        	objInput.style.backgroundColor = original_color;
        });
		objInput.addEventListener('change', function(event) {
           objInput.style.backgroundColor = original_color;
        });
		objInput.addEventListener('keydown', function(event) {
           objInput.style.backgroundColor = original_color;
        });
    },
    _setInputHighlighted: function(field, DHTMLXForm) {
        //console.log( self.form[ uid ].getForm() )
        var self = $dhx.dataDriver;
        var name = field.name;
        var type = field.type;
        //console.log( field );
        //var associated_label = field.associated_label || false;
        // these if / else is just for highlightning the formfield which should be filled
        if (type == "combo") {
            var fcombo = DHTMLXForm.getCombo(name);
            fcombo.openSelect();
        } else if (type == "editor") {
            //var feditor = DHTMLXForm.getEditor(name);
        } else if (type == "multiselect") {
            self._setInputInvalid(DHTMLXForm.getSelect(name));
        } else if (type == "select") {
            self._setInputInvalid(DHTMLXForm.getSelect(name));
        } else {
            self._setInputInvalid(DHTMLXForm.getInput(name));
        }
    }

}
