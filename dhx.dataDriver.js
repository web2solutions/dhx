/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true, maxerr : 1000, indent : 2, sloppy : true */
/*global $dhx, dhtmlx, Element */
$dhx.dataDriver = {

		dbs : {}

		,browserPassed : function(){
			'use strict';
			if ($dhx.Browser.name == "Explorer") {
                $dhx.showDirections("BROWSER_VERSION_OUT_TO_DATE");
                return false;
            }
			return true;
		}

		,validDSN : function(c){
			'use strict';
			//var that = $dhx.dataDriver;
			if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "db is missing when creating a database"
                });
                if (c.onFail) { c.onFail({ message : "db is missing when creating a database" }); }
                return false;
            }
			if ((typeof c.schema === 'undefined')) {
               c.schema = {};
            }
			else
			{
				if( $dhx.isObject( c.schema ) )
				{
						//
				}
				else
				{
					dhtmlx.message({
						type: "error",
						text: "when you pass the parameter 'schema' to the constructor, it need to be an object"
					});
					if (c.onFail)
					{
						c.onFail({ message : "when you pass the parameter 'schema' to the constructor, it need to be an array" });
					}
					return false;
				}
			}
			return c;
		}

		,validTableConf : function(c){
			'use strict';
			var that = $dhx.dataDriver;
			//console.log( 'validTableConf', c );;
			if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "db is missing when creating a table"
                });
                if (c.onFail) c.onFail({ message : "db is missing when creating a table" });
                return false;
            }
			if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                dhtmlx.message({
                    type: "error",
                    text: "table is missing when creating a table"
                });
                if (c.onFail) c.onFail({ message : "table is missing when creating a table" });
                return false;
            }
			if ((typeof c.primary_key === 'undefined')) {
                dhtmlx.message({
                    type: "error",
                    text: "primary_key is missing when creating a table"
                });
                if (c.onFail) c.onFail({ message : "primary_key is missing when creating a table" });
                return false;
            }

			return c;
		}

		,validIndexConf : function(c){
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

			if( c.type.toLowerCase() == 'serial')
				return {
					type : 'serial'
					,required : true
					,validation : 'integer'
					,unique : true
				};

			return c;
		}

		,validRecord : function(table_schema, record){
			'use strict';
			var that = $dhx.dataDriver, clone = {};
			//console.log( 'table_schema      ' , table_schema)
			if( $dhx.isObject(record) )
			{
				for( var column in record )
					if( record.hasOwnProperty( column ) )
					{
						//console.log( column );
						if( typeof table_schema.columns[ column ] === 'undefined' )
						{
							//console.log( table_schema.primary_key.keyPath )
							if( table_schema.primary_key.keyPath != column)
								return 'column ' + column + ' does not exist';
						}
						clone[ column ] = record[ column ]
					}
			}
			else
			{
				return 'can not parse record' + record;
			}
			//console.log( clone );
			return clone;
		}


		,validRecordUpdate : function(table_schema, record){
			'use strict';
			var that = $dhx.dataDriver, clone = {};
			if( $dhx.isObject(record) )
				for( var column in record )
					if( record.hasOwnProperty( column ) )
					{
						if( typeof table_schema.columns[ column ] === 'undefined' )
						{
							if( table_schema.primary_key.keyPath != column)
								return 'column ' + column + ' does not exist';
						}

						if( table_schema.columns[ column ].type.toLowerCase() != 'serial' )
						{
							clone[ column ] = record[ column ];
						}
					}
			else
				return 'can not parse record' + record;

			return clone;
		}

		// can be called only when onupgradeneeded
		,createTable : function( c ){
			'use strict';
			//console.log( 'createTable', c );
			try
			{
				if( ! $dhx.dataDriver.validTableConf( c ) )
					return;
				var db_name = c.db, that = $dhx.dataDriver, table = null;

				//connection = that.connect( { db : '', version : ''} );

				if( $dhx.isObject(c.primary_key) )
					table = that.dbs[db_name].db.createObjectStore(c.table, c.primary_key);
				else
					table = that.dbs[db_name].db.createObjectStore(c.table, {
						keyPath: c.primary_key
						,autoIncrement: true
					});

				if( $dhx.isObject(c.columns) )
				{
					for ( var column in c.columns )
					{
						if( c.columns.hasOwnProperty ( column ) )
						{
							if( $dhx.dataDriver.validIndexConf( c.columns[ column ] ) == false ) continue;
							if( c.columns[ column ].index )
							{
								c.columns[ column ].unique == true ? "" : c.columns[ column ].unique = false;
								table.createIndex(column, column, {
									unique: c.columns[ column ].unique
								});
							}
						}
					}
				}
				table.transaction.oncomplete = function(event) {
					var message = "table " + c.table + " created successfully";
					if ($dhx._enable_log) console.warn(message);
					if( that.dbs[db_name].onCreate ) that.dbs[db_name].onCreate({
						connection : that.dbs[db_name].connection.connection
						,event : that.dbs[db_name].connection.event
						,message : message
					});
				}
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant create table ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,dropDatabase : function( c ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				that.disconnect( c.db );
				var req = that.indexedDB.deleteDatabase( c.db );
				req.onsuccess = function () {
					if ($dhx._enable_log) console.warn("Deleted database " + c.db + " successfully");
				};
				req.onerror = function () {
					throw "Couldn't delete database " + c.db;
				};
				req.onblocked = function () {
					throw "Couldn't delete database " + c.db + " due to the operation being blocked";
				};
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant drop database ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,getTableSizeInBytes : function(c){
			'use strict';
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					updateRequest = null,
					rows_affected = 0,
					table_schema = that.dbs[db_name].schema[c.table],
					size = 0;

				console.time("get db size operation " + $dhx.crypt.SHA2(JSON.stringify( c )));

				var tx = that.db(db_name).transaction(c.table, "readonly"),
					table = tx.objectStore(c.table),
					request = table.openCursor();

				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				var str = '';

				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx getTableSizeInBytes is complete done');
				});

				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});

				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
				});

				request.addEventListener('success', function(event)
				{
					var cursor = event.target.result;
					if(cursor) {
						var json = JSON.stringify(cursor.value);
						str = str + json;
						cursor.continue();
					} else {
						if ($dhx._enable_log) console.warn( 'executed' );
						if ($dhx._enable_log) console.log('transaction complete - DB size computed      ', event);
						console.timeEnd("get db size operation " + $dhx.crypt.SHA2(JSON.stringify( c )));
						str = $dhx.UTF8.decode(str);
						var blob = new Blob([str], {type : 'text/html'}); // the blob
						if (c.onSuccess) c.onSuccess(tx, event, blob.size);
					}
				});

				request.addEventListener('error', function(event) {
					if ($dhx._enable_log) console.warn('sorry Eduardo, couldnt fecth data! Error message: ' + event);
					console.timeEnd("get db size operation " + $dhx.crypt.SHA2(JSON.stringify( c )));
					if (c.onFail) c.onFail(request, event, size);
				});
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant get table size ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,add : function(c, onSuccess, onFail){
			//'use strict';
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					table_schema = that.dbs[ db_name ].schema[ c.table ],
					rows_affected = 0;
				var timer_label  = "insert operation " + $dhx.crypt.SHA2(JSON.stringify( c ));
				console.time( timer_label );

				var tx = that.db(db_name).transaction(c.table, "readwrite"),
					table = tx.objectStore(c.table),
					records = [];

				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				tx.oncomplete = function( event ) {
					if ($dhx._enable_log) console.warn( 'executed' );
					if ($dhx._enable_log) console.log('transaction complete      ', event);
					if ($dhx._enable_log) console.warn( 'rows affected: ' + rows_affected );
					console.timeEnd( timer_label );

					PubSub.publish( that.dbs[ db_name ].root_topic + "." + c.table, {
						action : 'add',
						target : 'table',
						target_obj : table,
						name : c.table,
						status : 'success',
						message : 'record added'
						,records : records
					} );


					if( c.onSuccess ) c.onSuccess(tx, event, rows_affected);
				};
				tx.onerror = function( event ) {
					if ($dhx._enable_log) console.warn( 'error name: ', event.srcElement.error.name );
					
					//dhtmlx.message({
					//	type: "error",
					//	text: event.srcElement.error.message
					//});
					
					if ($dhx._enable_log) console.warn(  '	sorry Eduardo, couldnt add record. error message: '+ event.srcElement.error.message ) ;
					if ($dhx._enable_log) console.warn( 'rows affected: 0' );
					console.timeEnd( timer_label );
					if(c.onFail) c.onFail(tx, event, rows_affected);
				};

				tx.onabort = function (event) {
					if ($dhx._enable_log) console.warn( '   >>>>  ABORTED   <<<<  ' );
					if ($dhx._enable_log) console.log( event.target.error.name, event.target.error.message );
					console.timeEnd( timer_label );
					//if(c.onFail) c.onFail(tx, event, rows_affected);
				}
				
				function persist( r ){
					var schema = that.getTableSchema(c);
					var primary_key = schema.primary_key.keyPath;
					//var columns = schema.str_columns.split(',');
					
					if( typeof r[primary_key] === 'undefined' )
					{
						r[primary_key] = new Date().getTime();
					}
					
					if( r[primary_key] == "" )
					{
						r[primary_key] = new Date().getTime();
					}
					
					if( r[primary_key] == 0 )
					{
						r[primary_key] = new Date().getTime();
					}
					table.add(r);
					records.push(r);
				}
				// single record
				if ($dhx.isObject(c.record)) {
					if ($dhx._enable_log) console.log('........... trying to insert single record ');
					var r = that.validRecord(table_schema, c.record);
					if ($dhx.isObject(r)) {
						if ($dhx._enable_log) console.log('preparing record ', r);
						rows_affected = rows_affected + 1;
						persist(r);
					}
					else {
						if ($dhx._enable_log) console.warn('sorry Eduardo, invalid record! Error message: ' + r);
						return;
					}
				}
				// multiple record
				else if ($dhx.isArray(c.record)) {
					if ($dhx._enable_log) console.log('........... trying to insert multiple records ');
					for (var i = 0; i < c.record.length; i++) {
						var record = c.record[i];
						var r = that.validRecord(table_schema, record);
						if ($dhx.isObject(r)) {
							if ($dhx._enable_log) console.log('preparing record ', r);
							rows_affected = rows_affected + 1;
							persist(r);
						}
						else {
							if ($dhx._enable_log) console.warn('record ignored: ', JSON.stringify(record) );
							if ($dhx._enable_log) console.warn('sorry Eduardo, invalid record! Error message: ' + r);
							continue;
						}
					}
				}
				else {
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant parse the record payload');
					return;
				}
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant add record! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,update : function(c){
			//'use strict';
			console.log( 'INSIDE UPDATE', c )
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					record_id = parseInt( c.record_id ),
					updateRequest = null,
					rows_affected = 0,
					record = {},
					table_schema = that.dbs[db_name].schema[c.table],
					schema = that.getTableSchema(c),
					primary_key = schema.primary_key.keyPath;

				//console.time("record update. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
				//console.timeEnd("record update. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
				var timer_label = "record update. task: " + $dhx.crypt.SHA2(JSON.stringify( c ));
				console.time( timer_label );

				var tx = that.db(db_name).transaction(c.table, "readwrite"),
					table = tx.objectStore(c.table),
					recordIdRequest = table.get(record_id);

				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				
				function persist( data ){
					record = data;
					return table.put(data);
				}

				tx.addEventListener('complete', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('tx update is completed');
				});

				tx.addEventListener('onerror', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.log('error on transaction');
				});

				tx.addEventListener('abort', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('transaction aborted');
				});

				recordIdRequest.onsuccess = function(event)
				{
					var data = recordIdRequest.result;
					if(typeof data !== 'undefined' )
					{
						if ($dhx.isObject(c.record)) {
							if ($dhx._enable_log) console.log('........... trying to update single record ');
							var r = that.validRecordUpdate(table_schema, c.record);
							if ($dhx.isObject(r)) {
								if ($dhx._enable_log) console.log('preparing record ', r);
								for (var i in r)
									if (r.hasOwnProperty(i)) data[i] = r[i];
							}
							else {
								console.timeEnd( timer_label );
								if ($dhx._enable_log) console.warn('sorry Eduardo, invalid record! Error message: ' + r);
								if (c.onFail) c.onFail(updateRequest, event, rows_affected);
								return;
							}
						}
						updateRequest = persist( data );
						//if ($dhx._enable_log) console.warn("The transaction that originated this request is ", recordIdRequest.transaction);
					}
					else
					{
						console.timeEnd( timer_label );
						if ($dhx._enable_log) console.warn('sorry Eduardo, record '+record_id+' not found! ');
						if (c.onFail) c.onFail(updateRequest, event, rows_affected);
						return;
					}

					updateRequest.addEventListener('success', function(event)
					{
						rows_affected = event.target.result;
						var topic = that.dbs[ db_name ].root_topic + "." + c.table;
						PubSub.publish( topic, {
							action : 'update',
							target : 'table',
							target_obj : table,
							name : c.table,
							status : 'success',
							message : 'record updated'
							,record_id : record_id
							,record : record
						} );
						
						console.timeEnd( timer_label );
						
						if ($dhx._enable_log) console.warn( 'executed' );
						if ($dhx._enable_log) console.log('transaction complete      ', event);
						if ($dhx._enable_log) console.warn( 'rows affected: ' +  typeof rows_affected !== 'undefined' ? 1 : 0 );

						if (c.onSuccess) c.onSuccess(updateRequest, event, rows_affected);
					});
					
					updateRequest.addEventListener('error', function(event) {
						if ($dhx._enable_log) console.warn( 'error name: ', event.srcElement.error.name );
						//dhtmlx.message({
						//			type: "error",
						//			text: event.srcElement.error.message
						//});
						if ($dhx._enable_log) console.warn(  '	sorry Eduardo, couldnt update record. error message: '+ event.srcElement.error.message ) ;
						if ($dhx._enable_log) console.warn( 'rows affected: 0' );
						console.timeEnd( timer_label );
						if(c.onFail) c.onFail(updateRequest, event, rows_affected);
					});
				};
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant update by local id! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,select : function(c){
			'use strict';
			try
			{
				var that = $dhx.dataDriver,
					db_name = c.db,
					updateRequest = null,
					rows_affected = 0,
					table_schema = that.dbs[db_name].schema[c.table],
					records = [];
				$dhx.showDirections('selecting table data, please wait ... ');
				console.time("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));

				var tx = that.db(db_name).transaction(c.table, "readonly"),
					table = tx.objectStore(c.table),
					request = table.openCursor();

				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx select is completed');
					$dhx.hideDirections();
				});

				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
					$dhx.hideDirections();
				});

				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
					$dhx.hideDirections();
				});

				request.addEventListener('success', function(event)
				{
					var cursor = event.target.result;
					if(cursor) {
						//console.log( cursor );
						rows_affected = rows_affected + 1;
						records.push({
							key : cursor.key
							,primaryKey : cursor.primaryKey
							,record : cursor.value
						});

						cursor.continue();
					} else {
						if ($dhx._enable_log) console.warn( 'executed' );
						if ($dhx._enable_log) console.log('transaction complete - data selected      ', event);
						if ($dhx._enable_log) console.warn( 'rows affected: ' + rows_affected );
						console.timeEnd("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));



						if (c.onSuccess) c.onSuccess(tx, event, records, rows_affected);
					}
				});

				request.addEventListener('error', function(event) {
					if ($dhx._enable_log) console.warn('sorry Eduardo, couldnt fecth data! Error message: ' + event);
					console.timeEnd("select table data. task: " + $dhx.crypt.SHA2(JSON.stringify( c )));
					if (c.onFail) c.onFail(request, event, records, rows_affected);
				});
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant select data ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,count : function(c, onSuccess, onFail){
			'use strict';
			try
			{
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

				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx count is completed');
				});

				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});

				tx.addEventListener('abort', function( event ) {
					//console.log(counter.result);
					if( c.onFail ) c.onFail(tx, event, counter.result);
				});

				counter.addEventListener('success', function( event ) {
					console.timeEnd("count operation " + c.table);
					//console.log(counter.result);
					if( c.onSuccess ) c.onSuccess(tx, event, counter.result);
				});
				counter.addEventListener('error', function( event ) {
					console.timeEnd("count operation " + c.table);
					//console.log(counter.result);
					if( c.onFail ) c.onFail(tx, event, counter.result);
				});
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant count data ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}

		}

		,del : function( c ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "del operation " + c.table + " " + c.record_id;

				console.time( timer_label );

				var tx = that.db(db_name).transaction(c.table, "readwrite");
				var table = tx.objectStore(c.table);
				console.log( table );
				var req = table.delete( parseInt( c.record_id ) );

				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx del is completed');
					console.log( event );
				});

				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});

				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
				});

				req.onsuccess = function (event) {
					console.timeEnd(timer_label);
					//console.log( event );
					$dhx.dataDriver.public[c.table]._internal_cursor_position = 0;
					if ($dhx._enable_log) console.warn( 'executed' );
					if ($dhx._enable_log) console.log('transaction complete - record deleted');
					if( c.onSuccess ) c.onSuccess(tx, event, c.record_id);
				}
				req.onerror = function (event) {
					console.timeEnd(timer_label);
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete all records! Error message: ' + event);
					if( c.onFail ) c.onFail(tx, event);
				}
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete the record! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,clearAll : function(c, onSuccess, onFail){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db;
				console.time("clearAll operation " + c.table);
				var tx = that.db(db_name).transaction(c.table, "readwrite");
				var table = tx.objectStore(c.table);

				var clear_request = table.clear();

				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				tx.addEventListener('complete', function( event ) {
					if ($dhx._enable_log) console.warn('tx cearlAll is completed');
				});

				tx.addEventListener('onerror', function( event ) {
					if ($dhx._enable_log) console.log('error on transaction');
				});

				tx.addEventListener('abort', function( event ) {
					if ($dhx._enable_log) console.warn('transaction aborted');
				});

				clear_request.addEventListener('success', function( event ) {
					console.timeEnd("clearAll operation " + c.table);
					if ($dhx._enable_log) console.warn( 'executed' );
					if ($dhx._enable_log) console.log('transaction complete - table is clear');
					
					PubSub.publish( that.dbs[ db_name ].root_topic + "." + c.table, {
						action : 'clear',
						target : 'table',
						target_obj : table,
						name : c.table,
						status : 'success',
						message : 'table is empty'
						
					} );
					
					if( c.onSuccess ) c.onSuccess(tx, event);
				});
				clear_request.addEventListener('error', function( event ) {
					console.timeEnd("clearAll operation " + c.table);
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete all records! Error message: ' + event);
					if( c.onFail ) c.onFail(tx, event);
				});
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant delete all records! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}


		,setCursor : function( c ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "setCursor operation " + c.table;
				console.time(timer_label);
				var record_id = parseInt( c.record_id );
				var tx = that.db(db_name).transaction(c.table, "readonly");
				var table = tx.objectStore(c.table),
					recordIdRequest = table.get(record_id);
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				tx.addEventListener('complete', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('tx setCursor is completed');
				});

				tx.addEventListener('onerror', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.log('error on transaction');
				});

				tx.addEventListener('abort', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('transaction aborted');
				});

				recordIdRequest.onsuccess = function(event)
				{
					var data = recordIdRequest.result;
					if(typeof data !== 'undefined' )
					{
						$dhx.dataDriver.public[c.table]._internal_cursor_position = record_id;
						console.timeEnd( timer_label );

						if (c.onSuccess) c.onSuccess(recordIdRequest, event, data);
					}
					else
					{
						console.timeEnd( timer_label );
						if ($dhx._enable_log) console.warn('sorry Eduardo, record '+record_id+' not found! ');
						if (c.onFail) c.onFail(recordIdRequest, event, null);
						return;
					}
				};
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant setCursor ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,getCursor : function( c ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "getCursor operation " + c.table;
				console.time(timer_label);
				if( $dhx.dataDriver.public[c.table]._internal_cursor_position > 0 )
				{
					console.timeEnd(timer_label);
					if( c.onSuccess ) c.onSuccess( $dhx.dataDriver.public[c.table]._internal_cursor_position );
				}
				else
				{
					var tx = that.db(db_name).transaction(c.table, "readonly");
					var table = tx.objectStore(c.table);
					var cursor = table.openCursor();
					//console.log(cursor);

					c.onSuccess = c.onSuccess || false;
					c.onFail = c.onFail || false;

					tx.addEventListener('complete', function( event ) {
						if ($dhx._enable_log) console.warn('tx getCursor is completed');
					});

					tx.addEventListener('onerror', function( event ) {
						if ($dhx._enable_log) console.log('error on transaction');
					});

					tx.addEventListener('abort', function( event ) {
						console.log(counter.result);
						if( c.onFail ) c.onFail(tx, event, counter.result);
					});

					cursor.addEventListener('success', function( event ) {

						var cursor = event.target.result;
						if(cursor) {
							$dhx.dataDriver.public[c.table]._internal_cursor_position = cursor.key;
							if( c.onSuccess ) c.onSuccess(cursor.key, tx, event);
						} else {
							if( c.onSuccess ) c.onSuccess($dhx.dataDriver.public[c.table]._internal_cursor_position, tx, event);
						}

						console.timeEnd(timer_label);

					});
					cursor.addEventListener('error', function( event ) {
						console.timeEnd(timer_label);
						console.log(counter.result);
						if( c.onFail ) c.onFail(null, tx, event);
					});
				}





			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant getCursor ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}


		,getCurrentRecord : function( c ){
			'use strict';
			console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				var db_name = c.db, timer_label = "getCurrentRecord operation " + c.table;
				console.time(timer_label);

				//$dhx.dataDriver.public[c.table]._internal_cursor_position

				var tx = that.db(db_name).transaction(c.table, "readonly");
				var table = tx.objectStore(c.table)
					,currentRecordRequest = table.get($dhx.dataDriver.public[c.table]._internal_cursor_position);

				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				tx.addEventListener('complete', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('tx getCurrentRecord is completed');
				});

				tx.addEventListener('onerror', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.log('error on transaction');
				});

				tx.addEventListener('abort', function( event ) {
					//console.timeEnd( timer_label );
					if ($dhx._enable_log) console.warn('transaction aborted');
				});

				currentRecordRequest.addEventListener('success', function( event ) {
					var data = currentRecordRequest.result;
					if(typeof data !== 'undefined' )
					{
						console.log(data);
						console.timeEnd( timer_label );

						if (c.onSuccess) c.onSuccess(data, currentRecordRequest, event);
					}
					else
					{
						console.timeEnd( timer_label );
						if ($dhx._enable_log) console.warn('sorry Eduardo, record '+record_id+' not found! ');
						if (c.onFail) c.onFail(null, currentRecordRequest, event);
						return;
					}
				});
				currentRecordRequest.addEventListener('error', function( event ) {
					if ($dhx._enable_log) console.warn('sorry Eduardo, I cant getCurrentRecord data ! Error message: ' + event.target.error.message);
					console.timeEnd(timer_label);

					if( c.onFail ) c.onFail(null, currentRecordRequest, event);
				});
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant getCurrentRecord data ! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}
		}


		,_syncGridData : function(  c, component ){
			'use strict';
			var that = $dhx.dataDriver;
			component.clearAll();
			$dhx.dataDriver.public[c.table].select(function(tx, event, records, rows_affected) {
				var data = {
					rows: []
				};
				records.forEach(function(recordset, index, array) {
					var schema = that.getTableSchema(c);
					var primary_key = schema.primary_key.keyPath;
					var columns = schema.str_columns.split(',');
					var record = [];
					columns.forEach(function(column, index_, array_) {
						record[index_] = recordset.record[column];
					});
					data.rows.push({
						id: recordset.record[primary_key],
						data: record
					})
				});
				//component.loadStruct(data);
				component.parse(data, "json"); //takes the name and format of the data source
				if (c.onSuccess) c.onSuccess(rows_affected);
			}, function(tx, event, records, rows_affected) {
				if (c.onFail) c.onFail(rows_affected);
			});
		}

		,_prepareGridSaveOnEdit : function( c, component ){
			'use strict';
			var that = $dhx.dataDriver;
			component.attachEvent("onEditCell", function(stage, rId, cInd, nValue, oValue) {
				var table_schema = that.getTableSchema(c);
				var column_name = component.getColumnId(cInd);
				if (stage == 0) {
					return true;
				}
				else if (stage == 1 && component.editor.obj) {
					//console.log( grid.cells( rId, cInd) );
					// format and mask here
					var input = component.editor.obj;
					var format = table_schema.columns[column_name].format;
					that._setInputMask(input, format);

					return true;
				}
				else if (stage == 2) {
					if (nValue != oValue) {
						$dhx.showDirections("saving data ... ");
						component.setRowTextBold(rId);
						var hash = {};
						hash[component.getColumnId(cInd)] = nValue;
						var validation = table_schema.columns[column_name].validation;
						if (table_schema.columns[column_name].required) {
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
							if (that._validateValueByType(nValue, validation, column_name)) {}
							else {
								component.cells(rId, cInd).setValue(oValue);
								//grid.selectCell(rId,cInd);
								//grid.editCell();
								//component.setRowTextNormal(rId);
								$dhx.hideDirections();
								return false;
							}
						}
						$dhx.dataDriver.public[c.table].update(rId, hash, function() {
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

		//,_synced_components : []
		,sync : function( c ){
			'use strict';
			//console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				// START validate request configuration
				if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "db is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("db is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "table is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("table is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.type === 'undefined') || (c.type.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "type of component is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("type is missing when creating a dataset");
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    if (c.onFail) c.onFail("component is missing when syncing");
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    if (c.onFail) c.onFail("component is not an object");
                    return false;
                }
				// END validate request configuration

				// SET default callbacks
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				// START - Add component to ARRAY of synced components of this table
				if ($dhx._enable_log) console.warn("called sync for: " + c.component_id + " on " + c.table);
				var a_components = $dhx.dataDriver.public[c.table]._synced_components;
				for( var x = 0; x < a_components.length; x++)
				{
					var hash = a_components[ x ];
					if (hash.component_id == c.component_id) {
						if ($dhx._enable_log) console.warn(hash.component_id + " object already exist on memory, please remove it first");
						//$dhx.dataDriver.public[c.table]._synced_components.splice(index, 1);
						if (c.onFail) c.onFail(hash.component_id + " object already exist on memory, please remove it first");
						return;
					}
				}
				if ($dhx._enable_log) console.log("pushing: " + c.component_id);
				var component_settings = {
					component_id: c.component_id,
					component: c.component,
					type : c.type
				};
				if (typeof c.$init === 'function') {
					component_settings["$init"] = c.$init;
				}
				$dhx.dataDriver.public[c.table]._synced_components.push(component_settings);
				// END - Add component to ARRAY of synced components of this table

				$dhx.dataDriver.public[c.table]._synced_components.forEach(function(hash, index, array)
				{
					if (hash.component_id == c.component_id) {
						var component = hash.component;
						if (hash.type == 'tree') {
							//if( $dhx._enable_log ) console.log( "this component is a tree" );
							if (c.onFail) c.onFail("tree can not be synced");
						}
						else if (hash.type == 'combo') {
							if ($dhx._enable_log) console.log("this component is a combo");
							component.clearAll(true);
							var records = [];
							$dhx.dataDriver.public[c.table].data.forEach(function(record, index_row, array_row) {
								// lets create a copy of the object, avoiding changes on the original referenced record ( js is mutable)
								var obj = {};
								for (i in record)
									if (record.hasOwnProperty(i)) obj[i] = record[i];
								if (c.$init) c.$init(obj);
								records.push([obj.value, obj.text]);
							});
							component.addOption(records);
							if (c.onSuccess) c.onSuccess();
						}
						else if (hash.type == 'grid') {
							

							//component.attachEvent("onXLS", function(grid_obj) {

							//});
							component._subscriber = function( topic, data ){
								//console.log( topic, data );
								if(data.target == 'table')
								{
									if(data.name == c.table)
									{
										if( $dhx._enable_log ) console.warn( hash.component_id + ' received message about it synced table: ', data.target, data.name );
										
										var schema = that.getTableSchema(c);
										var primary_key = schema.primary_key.keyPath
										var columns = schema.str_columns.split(',');
										if(data.action == 'add' && data.message == 'record added')
										{
											data.records.forEach(function(recordset, index, array) {
												var record = [];

												columns.forEach(function(column, index_, array_) {
													record[ index_ ] = recordset[ column ];
												});


												component.addRow(recordset[primary_key], record);
												if( $dhx._enable_log ) console.warn( hash.component_id + ' updated ' );
											});
										}
										else if(data.action == 'update' && data.message == 'record updated')
										{
											console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
											
											for(var column in data.record)
											{
												if(data.record.hasOwnProperty( column ))	
												{
													var colIndex = component.getColIndexById(column);
													component.cells(data.record_id, colIndex).setValue( data.record[column] );
												}
											}
											if( $dhx._enable_log ) console.warn( hash.component_id + ' updated ' );
										}
										else if(data.action == 'clear' && data.message == 'table is empty')
										{
											console.log('XXXXXXXXXXXXXXXXXXXXX', data.record);
											
											component.clearAll();
											if( $dhx._enable_log ) console.warn( hash.component_id + ' updated ' );
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
							PubSub.subscribe( $dhx.dataDriver.dbs[ c.db ].root_topic + "." + c.table, component._subscriber );

							// if user setted saveOnEdit = true
							if (component.saveOnEdit)
							{
								that._prepareGridSaveOnEdit(c, component);
							} // end if saveOnEdit

							// clear all data from grid and parses the table selected data
							that._syncGridData(c, component);
							
							if ($dhx._enable_log) console.warn( hash.component_id, ' is synced');

						} // end if grid
						else if (hash.type == 'form') {
							//if( $dhx._enable_log ) console.log( "form can not be synced" );
							if (c.onFail) c.onFail("form can not be synced");
						}
						else {
							if (c.onFail) c.onFail("unknow component when syncing");
						}
					}
				});
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant sync '+c.component_id+' data ! Error message: ' + e.message);
				if( c.onFail ) c.onFail(null, null);
			}
		}


		//,_bound_components : []
		,bind : function( c ){
			'use strict';
			//console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				// START validate request configuration
				if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "db is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("db is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "table is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("table is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.type === 'undefined') || (c.type.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "type of component is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("type is missing when creating a dataset");
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    if (c.onFail) c.onFail("component is missing when syncing");
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    if (c.onFail) c.onFail("component is not an object");
                    return false;
                }
				// END validate request configuration

				// SET default callbacks
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;

				// START - Add component to ARRAY of bound components of this table
				if ($dhx._enable_log) console.warn("called bind for: " + c.component_id + " on " + c.table);
				var a_components = $dhx.dataDriver.public[c.table]._bound_components;
				for( var x = 0; x < a_components.length; x++)
				{
					var hash = a_components[ x ];
					if (hash.component_id == c.component_id) {
						if ($dhx._enable_log) console.warn(hash.component_id + " object already exist on memory, please remove it first");
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
					type : c.type
				};
				if (typeof c.$init === 'function') {
					component_settings["$init"] = c.$init;
				}
				$dhx.dataDriver.public[c.table]._bound_components.push(component_settings);
				// END - Add component to ARRAY of bound components of this table

				$dhx.dataDriver.public[c.table]._bound_components.forEach(function(hash, index, array)
				{
					if (hash.component_id == c.component_id) {
						var component = hash.component;
						if (hash.type == 'tree') {
							//if( $dhx._enable_log ) console.log( "this component is a tree" );
							if (c.onFail) c.onFail("warn can not be bound");

						}
						else if (hash.type == 'combo') {
							if ($dhx._enable_log) console.log("this component is a combo");
							if (c.onFail) c.onFail("warn can not be bound");
						}
						else if (hash.type == 'grid') {
							if( $dhx._enable_log ) console.warn( "grid can not be bound" );
							if (c.onFail) c.onFail("grid can not be bound");

						} // end if grid
						else if (hash.type == 'form') {
							//if ($dhx._enable_log) console.log("this component is a form");
							//console.log( "XXXXXXXXXXXXXXXXXX>>>>>>>>>>>>>>>>", hash );
							var prepare = false;
							
							
							 //console.log(">>>>>>>>>>>>>>>>> component.save");
                             //console.log(hash);
							 
							 component._id = hash.component_id;
							 component._type = hash.type;
							
							if( typeof hash.prepare !== 'undefined' )
							{
								if( typeof hash.prepare.settings !== 'undefined' )
								{
									prepare = true;
									$dhx.dhtmlx.prepareForm(hash.component_id, hash.prepare.settings, hash.component);
								}
							}
							
							// if form is editing EXISTING record
							if (component.isEditing == true )
							{
								try
								{
									component.hideItem("x_special_button_save");
								}catch(e){}
								
                                var record = $dhx.dataDriver.public[c.table].getCurrentRecord( function( record )
								{
									// onSuccess
										var obj = {};
										for (i in record)
											if (record.hasOwnProperty(i)) {
												if (i != 'id') obj[i] = record[i]
											}
										if (c.$init) c.$init(obj);
										component.setFormData(obj);
									}, function(){
									// onFail
								});
                            }// if form is adding NEW record
							else
							{
								try
								{
									component.hideItem("x_special_button_update");
								}catch(e){}	
							}

                            component.attachEvent("onButtonClick", function(name)
							{
                                if (name == "x_special_button_save") component.save();
                                else if (name == "x_special_button_update") component.update();
                            });
                            component.save = function(hash, onSuccess, onFail)
							{
								if( prepare )
								{
									if ($dhx.dhtmlx.validateForm(c.component_id, component)) {
			 							that._bound_form_save(c, component, hash, onSuccess, onFail);
			 						}	
								}
								else
								{
									console.log("inside prepare");
									that._bound_form_save(c, component, hash, onSuccess, onFail);
								}	
                            }
                            component.update = function(hash, onSuccess, onFail)
							{
                                if( prepare )
								{
									if ($dhx.dhtmlx.validateForm(c.component_id, component)) {
			 							that._bound_form_update(c, component, hash, onSuccess, onFail);
			 						}	
								}
								else
								{
									console.log("inside prepare");
									that._bound_form_update(c, component, hash, onSuccess, onFail);
								}
                            }
     
							component._subscriber = function( topic, data )
							{
								if(data.target == 'table')
								{
									if(data.name == c.table)
									{
										if( $dhx._enable_log )
											console
												.warn(
													hash.component_id + ' received message about it bound table: '
													, data.target
													, data.name
												);
										if(data.action == 'add' && data.message == 'record added')
										{
											var schema = that.getTableSchema(c);
											var primary_key = schema.primary_key.keyPath
											var columns = schema.str_columns.split(',');


										}
									}
								}
							}
							component._subscriber_token = PubSub.subscribe( $dhx.dataDriver.dbs[ c.db ].root_topic + "." + c.table, component._subscriber );
							//history.pushState(hash.component_id, hash.component_id, component.isEditing === true ? '#update_record' : '#add_new_record');
							if (c.onSuccess) c.onSuccess("bound");
							if ($dhx._enable_log) console.warn( hash.component_id, ' is bound');
						}
						else {
							if (c.onFail) c.onFail("unknow component when binding");
						}
					}
				});
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant bind '+c.component_id+' data ! Error message: ' + e.message);
				if( c.onFail ) c.onFail(null, null);
			}
		}

		,unbind : function( c ){
			'use strict';
			//console.log( c );
			try
			{
				var that = $dhx.dataDriver;
				// START validate request configuration
				if ((typeof c.db === 'undefined') || (c.db.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "db is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("db is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.table === 'undefined') || (c.table.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "table is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("table is missing when creating a dataset");
                    return false;
                }
				if ((typeof c.type === 'undefined') || (c.type.length === 0)) {
                    dhtmlx.message({
                        type: "error",
                        text: "type of component is missing when creating a dataset"
                    });
                    if (c.onFail) c.onFail("type is missing when creating a dataset");
                    return false;
                }
                if ((typeof c.component === 'undefined')) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is missing when syncing"
                    });
                    if (c.onFail) c.onFail("component is missing when syncing");
                    return false;
                }
                if (!$dhx.isObject(c.component)) {
                    dhtmlx.message({
                        type: "error",
                        text: "component is not an object"
                    });
                    if (c.onFail) c.onFail("component is not an object");
                    return false;
                }
				// END validate request configuration
				// SET default callbacks
				c.onSuccess = c.onSuccess || false;
				c.onFail = c.onFail || false;
				// START - Add component to ARRAY of bound components of this table
				if ($dhx._enable_log) console.warn("called unbind for: " + c.component_id + " on " + c.table);
				var a_components = $dhx.dataDriver.public[c.table]._bound_components;
				for( var x = 0; x < a_components.length; x++)
				{
					var hash = a_components[ x ];
					var component = hash.component;
					if (hash.component_id == c.component_id) {
						if ($dhx._enable_log) console.warn(hash.component_id + " object exist on memory. now it was unbound");
						$dhx.dataDriver.public[c.table]._bound_components.splice(x, 1);
						PubSub.unsubscribe( component._subscriber_token );
						if (c.onSuccess) c.onSuccess(hash.component_id + " object exist on memory. now it was unbound");
						return;
					}
				}
				if ($dhx._enable_log) console.warn("component not found. it was not unbound");
				if( c.onFail ) c.onFail("component not found. it was not unbound");
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant unbind '+c.component_id+'! Error message: ' + e.message);
				if( c.onFail ) c.onFail(null, null);
			}
		}
		
		
		,_bound_form_save: function(c, component, hash, onSuccess, onFail) {
            var that = $dhx.dataDriver;
				hash = hash || component.getFormData()
				clone = {};
				
			for( var column_name in hash )
				if( hash.hasOwnProperty ( column_name ) )
				{
					field = $dhx.dhtmlx.getFormItem(column_name, component._id);
					if( field.type == 'calendar' )
					{
						var dt = new Date( hash[ column_name ] )
						var year = dt.getFullYear();
						var month = dt.getMonth() + 1;
						var day = dt.getDate();
						
						console.log( month.toString().length );
						if(month.toString().length == 1)
							month = "0" + month;
						if(day.toString().length == 1)
							day = "0" + day;
						
						clone[ column_name ] = year + "-" + month + "-" + day;
					}
					else
					{
						clone[ column_name ] = hash[ column_name ];
					}
					
				}
			
			
			
            onSuccess = onSuccess || false;
            onFail = onFail || false;
            if ($dhx._enable_log) console.warn('trying to save new record: ', clone);
            component.lock();
			$dhx.dataDriver.public[c.table].add( clone, function( tx, event, rows_affected )
			{
                    component.unlock();
					if ($dhx._enable_log) console.warn('record saved. rows_affected: ', rows_affected);
                    (onSuccess) ? onSuccess(): "";
				}, function( tx, event, rows_affected ){
					that._saveRecordCheckError( component, event, c );
					component.unlock();
					if ($dhx._enable_log) console.warn('record not saved. rows_affected: ', rows_affected);
                    (onFail) ? onFail(): "";
			} );	
        }
		
		,_bound_form_update: function(c, component, hash, onSuccess, onFail) {
            var that = $dhx.dataDriver;
				hash = hash || component.getFormData(),
				clone = {},
				schema = that.getTableSchema(c),
				primary_key = schema.primary_key.keyPath,
				//columns = schema.str_columns.split(','),
				record_id = hash[primary_key];
            
			for( var column_name in hash )
				if( hash.hasOwnProperty ( column_name ) )
				{
					field = $dhx.dhtmlx.getFormItem(column_name, component._id);
					if( field.type == 'calendar' )
					{
						var dt = new Date( hash[ column_name ] )
						var year = dt.getFullYear();
						var month = dt.getMonth() + 1;
						var day = dt.getDate();
						console.log( month.toString().length );
						if(month.toString().length == 1)
							month = "0" + month;
						if(day.toString().length == 1)
							day = "0" + day;
						clone[ column_name ] = year + "-" + month + "-" + day;
					}
					else
					{
						clone[ column_name ] = hash[ column_name ];
					}
					
				}
			
            onSuccess = onSuccess || false;
            onFail = onFail || false;
			
			delete clone[primary_key];
            if ($dhx._enable_log) console.warn('trying to save existing record: ', clone);
            component.lock();
			$dhx.dataDriver.public[c.table].update( record_id, clone, function( tx, event, rows_affected )
			{
                    component.unlock();
					if ($dhx._enable_log) console.warn('record saved. rows_affected: ', rows_affected);
                    (onSuccess) ? onSuccess(): "";
				}, function( tx, event, rows_affected ){
					that._saveRecordCheckError( component, event, c );
                    component.unlock();
					if ($dhx._enable_log) console.warn('record not saved. rows_affected: ', rows_affected);
                    (onFail) ? onFail(): "";
			} );	
        }
		
		,_extractColumnFromErrorMessage : function( m ){
			var that = $dhx.dataDriver;
			var re = /'(.*)'/;
			var m = m.match(re);
			if (m != null)
			{
				return m[0].replace(re, '$1');
			}
			else
				return '';
		}
		
		,_saveRecordCheckError : function(component, event, c){
			'use strict';
			var that = $dhx.dataDriver,
				error_type = event.target.error.name,
				error_message = event.target.error.message,
				column_name = that._extractColumnFromErrorMessage( error_message ),
				input_form_label = component.getItemLabel(column_name),
				input_form = null;
				
			if (component._type == "combo") {
				input_form = component.getCombo(column_name);
				input_form.openSelect();
			}
			else if (component._type == "editor") {}
			else if (component._type == "multiselect") {
				input_form = component.getInput(column_name);
				var field = $dhx.dhtmlx.getFormItem(column_name, component._id);
				that._setInputHighlighted(field, component);
			}
			else if (component._type == "select") {
				component.getSelect(column_name);
				var field = $dhx.dhtmlx.getFormItem(column_name, component._id);
				that._setInputHighlighted(field, component);
			}
			else {
				input_form = component.getInput(column_name);
				var field = $dhx.dhtmlx.getFormItem(column_name, component._id);
				that._setInputHighlighted(field, component);
			}
			if (error_type == 'ConstraintError') {
				if (error_message.indexOf("at least one key does not satisfy the uniqueness requirements") > -1) {
					dhtmlx.message({
						type: "error"
						, text: 'the table ' + c.table + ' does not accept duplicated value for ' + input_form_label
					});
				}
			}
		}
		
		, exists: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, filter: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, first: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, idByIndex: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, indexById: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, item: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, last: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, next: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, previous: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, serialize: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}
		, sort: function () {
			'use strict';
			var that = $dhx.dataDriver;
		}	

		


		,connect : function( c ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				$dhx.showDirections('Preparing database ... ');
				var connection = that.indexedDB.open(c.db, c.version);
				if( c.onConnect ) c.onConnect({
					connection : connection
					,event : null
					,message : 'connected'
				});

				if ($dhx._enable_log) console.warn( 'connected' );
				return connection;
			}
			catch(e)
			{
				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant connect! Error message: ' + e.message);
				if( c.onConnectError ) c.onConnectError({
					connection : null
					,event : null
					,message : e.message
				});
			}

		}

		,db : function ( db_name ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				return that.dbs[ db_name ].db
			}
			catch (e){
				return false;
			}
		}

		,public : []

		,database : function( c ){
			'use strict';
			var that = $dhx.dataDriver,
				db_name = c.db,
				schema = c.schema || {},
				connection = null,
				database = null,
				db_exist = true,
				self = this,
				topic = 'database.' + c.db;

			// lets protype indexedDB into dataDriver
			that.protectIndexedDB();

			if( ! $dhx.dataDriver.browserPassed() )
				return;

			if( ! $dhx.dataDriver.validDSN( c ) )
				return;

			$dhx.isNumber( c.version ) ? ( c.version < 1 ? c.version = 1 : "" ) : c.version = 1;

			connection = that.connect( c );

			connection.onupgradeneeded = function(event)
			{
				db_exist = false;
				if ($dhx._enable_log) console.log( event );
				if ($dhx._enable_log) console.warn( 'db ' + db_name + ' created ' );

				database = connection.result;
				database.onerror = function(event) {
				  // Generic error handler for all errors targeted at this database's
				  //alert("Database error: " + event.target.errorCode);
				  if ($dhx._enable_log) console.warn( '   >>>>  DATABASE CONNECTION ERROR   <<<<  ', event );
				};
				database.onversionchange = function (event) {
					if ($dhx._enable_log) console.warn( '   >>>>  DATABASE VERSION CHANGED   <<<<  ' );
				};

				database.onabort = function (event) {
					if ($dhx._enable_log) console.warn( '   >>>>  DATABASE CONNECTION ABORTED   <<<<  ' );
					//if ($dhx._enable_log) console.log( event );
				}

				that.dbs[ db_name ] = {
					db : database
					,name : db_name
					,schema : schema
					,version : c.version
					,connection : connection
					,event : event
					,subscriber : function( msg, data ){
						console.log( 'DB ROOT SUBSCRIBER: ', msg, data );
					}
					,root_topic : topic
				};

				if( c.onCreate )
					that.dbs[ db_name ].onCreate = c.onCreate

				for( var table in c.schema )
					if( c.schema.hasOwnProperty ( table ) )
					{
						self.table( table ).create({
							primary_key : c.schema[ table ].primary_key
							,columns : c.schema[ table ].columns
							,onSuccess	 : function( response ){

							}
							,onFail	 : function( response ){ }
						});
					}
			};

			connection.onerror = function(event) {
				if ($dhx._enable_log) console.warn( 'error when tryin to connect the ' + db_name + ' database', connection.errorCode );
				if (c.onFail) c.onFail({
					connection : connection
					,event : event
					,message : 'error when tryin to connect the ' + db_name + ' database' + connection.errorCode
				});
			};

			connection.onblocked = function(event) {
				if ($dhx._enable_log) console.warn('blocked');
				if (c.onFail) c.onFail({
					connection : connection
					,event : event
					,message : 'blocked'
				});
			};

			connection.onsuccess = function(event) {

				database = connection.result;
				that.dbs[ db_name ] = {
					db : database
					,name : db_name
					,version : c.version
					,schema : schema
					,connection : connection
					,event : event
					,subscriber : function( msg, data ){
						if( $dhx._enable_log ) console.warn( 'DB received message: ', msg, data );
					}
					,root_topic : topic
				};

				PubSub.subscribe( topic, that.dbs[ db_name ].subscriber );

				if ($dhx._enable_log) console.warn('Database ' + db_name + ' is ready '); // , connection.result

				PubSub.publish( topic, {
					action : 'ready',
					target : 'database',
					target_obj : that.dbs[ db_name ].db,
					name : db_name,
					status : 'success',
					message : 'database is ready'
				} );

				$dhx.hideDirections();
				if( c.onReady ) c.onReady({
					connection : connection
					,event : event
					,message : 'ready'
				});
			};


			// public SCHEMA API
			this.schema = {}; // public schema API
			for( var table in c.schema )
			{
				if( c.schema.hasOwnProperty ( table ) )
				{
					//console.log(table, db_name,  topic);
					self.schema[table] = (function( table, db_name ) {
						return {
							_subscriber : function( topic, data ){
								if(data.target == 'table')
								{
									if(data.name == table)
									{
										if ($dhx._enable_log) console.log('table ' + data.name + ' from ' + db_name + ' database received message just right now: ', data.target, data.name );
									}
								}
							}
							,_synced_components : []
							,_bound_components : []
							,_internal_cursor_position : 0
							,add: function(record, onSuccess, onFail) {
								console.log(table);
								that.add({
									db: db_name,
									table: table,
									record: record,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							update: function(record_id, record, onSuccess, onFail) {
								that.update({
									db: db_name,
									table: table,
									record_id: record_id,
									record: record,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							select : function( onSuccess, onFail ){
								that.select({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							del: function( record_id, onSuccess, onFail ) {
								that.del({
									db: db_name,
									table: table,
									record_id: record_id,
									onSuccess: onSuccess,
									onFail: onFail
								});
							},
							clearAll: function( onSuccess, onFail ) {
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
							}
							,getTableSizeInBytes: function( onSuccess, onFail ) {
								that.getTableSizeInBytes({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}

							,dataCount : function( onSuccess, onFail ){
								that.count({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}

							,bind : (function( db_name, table  ){
								return{
									form : function(c){
										//console.log( c );
										that.bind({
											db: db_name,
											table: table,
											component : c.component,
											prepare : c.prepare,
											type : 'form',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});
									}
								}
							})( db_name, table )
							
							,getCursor : function( onSuccess, onFail ){
								that.getCursor({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							,getCurrentRecord : function( onSuccess, onFail ){
								that.getCurrentRecord({
									db: db_name,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							
							
							,exists : function(){
								
							}
							,filter : function(){
								
							}
							,first : function(){
								
							}
							,idByIndex : function(){
								
							}
							,indexById : function(){
								
							}
							,item : function(){
								
							}
							,last : function(){
								
							}
							,next : function(){
								
							}
							,previous : function(){
								
							}
							,serialize : function(){
								
							}
							,sort : function(){
								
							}
							
							
							
							,setCursor : function( record_id, onSuccess, onFail){
								that.setCursor({
									db: db_name,
									record_id: record_id,
									table: table,
									onSuccess: onSuccess,
									onFail: onFail
								});
							}
							
							,sync : (function( db_name, table  ){
								return{
									grid : function(c){
										//console.log( c );
										that.sync({
											db: db_name,
											table: table,
											component : c.component,
											type : 'grid',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});
									}
									,dataview : function(c){
										that.sync({
											db: db_name,
											table: table,
											component : c.componet,
											type : 'dataview',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});
									}
									,scheduler : function(c){
										that.sync({
											db: db_name,
											table: table,
											component : c.componet,
											type : 'scheduler',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});
									}
									,chart : function(){
										that.sync({
											db: db_name,
											table: table,
											component : c.componet,
											type : 'chart',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});
									}
								}
							})( db_name, table )
							,unbind : (function( db_name, table  ){
								return{
									form : function(c){
										//console.log( c );
										that.unbind({
											db: db_name,
											table: table,
											component : c.component,
											type : 'form',
											component_id : c.component_id,
											onSuccess: c.onSuccess,
											onFail: c.onFail
										});
									}
								}
							})( db_name, table )
						};
					})(  table, db_name, that );
				}

				PubSub.subscribe( topic, self.schema[table]._subscriber );
				that.public[table] = self.schema[table];
			}




			// public DATABASE API .. exposed via new Object()
			this.table = function( table ){
				// create public api
				return{
					create : function( c ){
						c = c || {};
						that.createTable( {
							db : db_name
							,table : table
							,columns : c.columns
							,primary_key : c.primary_key
							,onSuccess	 : c.onSuccess
							,onFail	 : c.onFail
						} );
					}// end create table
				}
			} // end create

			this.drop = function( c ){
				'use strict';
				c = c || {};
				that.dropDatabase	( {
					db : db_name
					,onSuccess	 : c.onSuccess
					,onFail	 : c.onFail
				} );
			}

		}

		,protectIndexedDB : function( ){
			'use strict';
			if( typeof $dhx.dataDriver.indexedDB === 'undefined' )
				Object.defineProperty($dhx.dataDriver, "indexedDB", {
                    value: window.indexedDB,
					enumerable: true,
					configurable: false,
					writable: false
            	});
		}
		
		,getTableSchema : function( c ){
			'use strict';
			var that = $dhx.dataDriver;
			try
			{
				return $dhx.dataDriver.dbs[ c.db ].schema[c.table];
			}
			catch(e)
			{
				return null
			}

		}

		,_setInputMask : function(input, mask_to_use){

			if (mask_to_use == "currency") {
				try {
					id = input.id;
				}
				catch (e) {
					id = input.getAttribute("id");
				}
				$("#" + id).priceFormat({
					prefix: ''
				});
			}
			else if (mask_to_use == "can_currency") {
				try {
					id = input.id;
				}
				catch (e) {
					id = input.getAttribute("id");
				}
				$("#" + id).priceFormat({
					prefix: 'CAN '
				});
			}
			else if (mask_to_use == "integer") {
				input.onkeydown = function(event) {
					only_integer(this);
				};
			}
			else if (mask_to_use == "us_phone") {
				input.onkeypress = function(event) {
					phone_mask(this);
				};
				input.maxLength = "13";
			}
			else if (mask_to_use == "expiration_date") {
				input.onkeypress = function(event) {
					expiration_date(this);
				};
				input.maxLength = "5";
			}
			else if (mask_to_use == "cvv") {
				input.onkeydown = function(event) {
					only_integer(this);
				};
				input.maxLength = "4";
			}
			else if (mask_to_use == "credit_card") {
				input.onkeydown = function(event) {
					only_integer(this);
				};
				input.maxLength = "16";
			}
			else if (mask_to_use == "time") {
				//console.log("time mask")
				input.onkeydown = function(event) {
					time_mask(this, event);
				};
				input.maxLength = "8";
			}
			else if (mask_to_use == "SSN") {
				input.onkeypress = function(event) {
					ssn_mask(this);
				};
				input.maxLength = "11";
			}
		}

		,_validateValueByType : function(value, validate, label){
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
						text: $dhx.dhtmlx.text_labels.validation_notEmpty(label)
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
						text: $dhx.dhtmlx.text_labels.validation_Empty(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidEmail(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidInteger(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidFloat(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidNumeric(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidAplhaNumeric(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidDatetime(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidDate(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidTime(label)
						});
						return false;
					}
					if (value.toString().toLowerCase().match("am") == "am" || value.toString().toLowerCase().match("pm") == "pm") {
						if (value.split(":")[0] > 12 || (value.split(":")[1]).split(" ")[0] > 59) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidTime(label)
							});
							return false;
						}
					}
					else {
						if (value.split(":")[0] > 23 || value.split(":")[1] > 59) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidTime(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidCurrency(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidSSN(label)
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
							text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
						});
						return false;
					}
					else {
						var month = value.split("/")[0];
						var year = value.split("/")[1];
						if (isNaN(month) || isNaN(year)) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
							});
							return false;
						}
						if (!(month > 0 && month < 13)) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
							});
							return false;
						}
						if (!(year > 0 && year < 99)) {
							//$dhx.dhtmlx._setInputInvalid( input );
							dhtmlx.message({
								type: "error",
								text: $dhx.dhtmlx.text_labels.validation_ValidExpirationdate(label)
							});
							return false;
						}
					}
				}
			}
			return true;
		}

		//
		,disconnect : function( db_name ){
			'use strict';
			try
			{
				var that = $dhx.dataDriver;
				if( that.db( db_name ) )
					that.db( db_name ).close();
			}
			catch(e)
			{

				if ($dhx._enable_log) console.warn('sorry Eduardo, I cant disconnect! Error message: ' + e.message);
				//if ($dhx._enable_log) console.warn(e);
				if( c.onFail ) c.onFail(null, null);
			}

		}
		
		,_setInputInvalid: function(objInput) {
            objInput.style.backgroundColor = "#fdafa3";
            objInput.focus();
            objInput.onclick = function() {
                objInput.style.backgroundColor = "#fff";
            }
            objInput.onchange = function() {
                objInput.style.backgroundColor = "#fff";
            }
            objInput.onkeydown = function() {
                objInput.style.backgroundColor = "#fff";
            }
        },
        _setInputHighlighted: function(field, DHTMLXForm) {
            //console.log( self.form[ uid ].getForm() )
            var self =  $dhx.dataDriver;
            var name = field.name;
            var type = field.type;
            //console.log( field );
            //var associated_label = field.associated_label || false;
            // these if / else is just for highlightning the formfield which should be filled
            if (type == "combo") {
                var fcombo = DHTMLXForm.getCombo(name);
                fcombo.openSelect();
            }
            else if (type == "editor") {
                //var feditor = DHTMLXForm.getEditor(name);
            }
            else if (type == "multiselect") {
                self._setInputInvalid(DHTMLXForm.getSelect(name));
            }
            else if (type == "select") {
                self._setInputInvalid(DHTMLXForm.getSelect(name));
            }
            else {
                self._setInputInvalid(DHTMLXForm.getInput(name));
            }
        }
	}
