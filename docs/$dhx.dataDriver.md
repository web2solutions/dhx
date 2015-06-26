# $dhx.dataDriver


## Overview

**What is $dhx.dataDriver?**

	$dhx.dataDriver is the first indexedDB Javascript data driver/ORM focused on building
	DHTMLX applications.
	
	Built on top of indexedDB API, it provides an asynchronous and offline/online support API that 
	is very similar to DHTMLX DataStore API ( http://docs.dhtmlx.com/api__refs__datastore.html ), 
	which is a synchronous and online API.

	Traditional dhtmlx DataStorage and localStorage are perfects for small amount of data, but fails 
	when you need to storage and handle large amount of data. There is where $dhx.dataDriver saves you.


**What is indexedDB?**

**"** *IndexedDB is an API for client-side storage of significant amounts of structured data, 
which also enables high performance searches of this data using indexes.*

*While DOM Storage is useful for storing amounts of data, it is less useful for storing 
larger amounts of structured data. IndexedDB provides a solution.* **"** 


	reference: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API


### **$dhx.dataDriver features**

- Provide support for offline applications. Nomore blockers when your server goes offline.

- Cross window state. Persist application state over opened browser tabs/windows.

- Multi thread environment instead single thread environment. no blocking.

- Uses a MQ system for implementing interoperable communication between:

	 database elements X components X server X browser windows

	 ![$dhx.dataDriver stack](http://cdn.dhtmlx.com.br/dhx/docs/DHXMQ.jpg)

- Bind 'one record' DHTMLX components. Eg: forms

- Sync 'multiple records' DHTMLX components. Eg: grid, scheduler

- Strong typed columns

- SQL like data types: character varying, date, timestamp, text, numeric, integer

- Hot validation and properly masking for input of data. Eg: edit on grid, forms, etc.

- Primary keys

- Foreign Keys

- Each app can have up to GBs of size.

- Each app can consume multiple databases and multiple tables

- Search of over records with no case and special chars sensitivity

- Very fast environment with support for big amount of data

- move your data model from server to client

- dramatically reduce HTTP requests from your client to your server

- multi record columns. Arrays.

- indexed columns

- database versioning

- complete API on database on table level

- Interactive log system. Good for debuging

- Benchmark of queries/requests



### **Database model**


	**Model**

```javascript
			var model = {
				db: null
				, output_tables: [{
					output_ordering: 1
					, table_name: "grupos"
				}]
				, records: {
					grupos: [{
						grupo: "admin"
						, grupo_id: 1
					}, {
						grupo: "usuario"
						, grupo_id: 2
					}, {
						grupo: "advogado"
						, grupo_id: 3
					}, {
						grupo: "cliente"
						, grupo_id: 4
					}]
					
				}
				, settings: {
					grupos: {
						form: {
							template: [{
								mask_to_use: ""
								, name: "grupo_id"
								, validate: "NotEmpty"
								, label: "grupo_id"
								, maxLength: null
								, tooltip: ""
								, required: !0
								, type: "hidden"
							}, {
								mask_to_use: ""
								, name: "grupo"
								, label: "grupo"
								, validate: ""
								, tooltip: ""
								, value: ""
								, maxLength: "255"
								, type: "input"
								, required: !1
							}]
						}
					}
				}
				, schema: {
					grupos: {
						foreign_keys: {}
						, primary_key: {
							autoIncrement: !1
							, keyPath: "grupo_id"
						}
						, columns: {
							grupo: {
								required: !1
								, ordinal_position: 2
								, dhtmlx_grid_footer: ""
								, foreign_table_name: ""
								, dhtmlx_grid_header: "grupo"
								, foreign_column_name: ""
								, validation: ""
								, format: ""
								, has_fk: !1
								, is_fk: !1
								, dhtmlx_grid_width: "*"
								, unique: !1
								, name: "grupo"
								, dhtmlx_grid_align: "left"
								, type: "character varying"
								, maxlength: "255"
								, dhtmlx_grid_type: "ed"
								, numeric_scale: null
								, index: !0
								, dhtmlx_grid_sorting: "str"
								, foreign_column_value: ""
								, numeric_precision: null
								, dhtmlx_form_type: "input"
								, is_nullable: "NO"
								, "default": ""
							}
						}
					}
				}
			};
```



	**constructor**

```javascript
			var db = new $dhx.dataDriver.database({
                db: 'my_db_name',
                version: 1,
                schema: model.schema,
                settings: model.settings,
                records: model.records,
				output_tables: model.output_tables

                // call all the times you connect into a database	
                ,
                onConnect: function(response) {}

                // called all the times you create a table	
                ,
                onCreate: function(response) {}

                // call when database is ready for working	
                ,
                onReady: function(response) {
                    if (onSuccess) onSuccess();
                }

                // called when there is error on connection
                ,
                onFail: function(response) {
                    
                }
            });
```

**Storage size**

Each app may have up to 20% of the shared pool. As an example, if the total available disk space is 50 GB, the shared pool is 25 GB, and the app can have up to 5 GB. This is calculated from 20% (up to 5 GB) of half (up to 25 GB) of the available disk space (50 GB). (https://developer.chrome.com/apps/offline_storage#temporary).



## Table API

	Each table on database provide support to the following methods

	on the following examples, please consider that 'persons' is a database table


*add()*
	
	Adds a new record to the dataset.
	Sends a 'new record' message to the MQ system
	Automatically adds records to the synced components

- Add one record

```javascript
	db.schema.persons.add({
		person_id: new Date().getTime()
		, username: "eduardo"
		, name: "Eduardo Almeida"
		, age: 30
		, birth_date: '1984-08-28'
		, email: "eduardo@web2solutions.com"
	});
```

- Add multiple records

```javascript
	var records = [];
	var start = new Date().getTime();
	for (i = start; i < (start + 1000); i++) {
		records.push({
			person_id: i
			, username: "username_" + i + new Date().getTime()
			, name: "name " + i + new Date().getTime()
			, age: 35
			, birth_date: '1984-08-28'
			, email: "email_" + i + new Date().getTime() + "@company.com"
		});
	}
	db.schema.persons.add(records);
```

*bind()*
	
	bind an one record compoonent to a table: Ex: forms
	implement input masks and validation
	bind a table listener to be used by the bound component


```javascript
	var form_settings = {
		template : [
			{ "name": "person_id", "value": "", "mask_to_use": "", "label": "person_id", "validate": "", "type": "hidden", "tooltip": "", "maxLength": null,  "required": false}, 
			{ "maxLength": "255", "required": false,  "value": "", "mask_to_use": "", "label": "name", "name": "name", "tooltip": "", "type": "input", "validate": "NotEmpty"},
			{ "type": "input", "tooltip": "", "validate": "NotEmpty,ValidEmail", "mask_to_use": "", "label": "email", "value": "", "name": "email", "required": false,  "maxLength": "255"},
			{ "required": false,  "maxLength": "300", "tooltip": "", "type": "input", "validate": "NotEmpty", "value": "", "label": "username", "mask_to_use": "", "name": "username"}, 
			{ "name": "birth_date", "value": "", "mask_to_use": "date", "label": "birth_date", "validate": "NotEmpty", "tooltip": "", "type": "calendar", "maxLength": null,  "required": false,  dateformat:"%Y-%m-%d",  enableTime : false,  readonly : true},
			{ "name": "age", "value": "", "mask_to_use": "integer", "label": "age", "validate": "NotEmpty", "tooltip": "", "type": "input", "maxLength": null,  "required": false}
		]
	}
	var form = window.attachForm( form_settings.template );
	
	// is the form editing a record? set true for filling out the form with record data
	self.form.isEditing = false;
	//self.form.isEditing = true;
	
	db.schema.persons.bind.form({
		component: form
		,component_id: "dbDemo.view.CRUDwindow.form_"
		
		// provide hot validation and input masking
		// not mandatory, default undefined	
		,prepare: { 
			settings: form_settings
		}
		,onSuccess: function () {}
		,onFail: function () {}
	});
```

*clearAll()*
	
	Removes all data from a table and synced components

```javascript
	var onSuccess = function (tx, event) {
			console.log( total );
	}
	var onFail = function (tx, event, error_message) {
			console.log( error_message );
	}
	
	db.schema.persons.clearAll( onSuccess, onFail );
```

*dataCount()*
	
	Returns the total count of items in table.

```javascript
	var onSuccess = function (tx, event, total) {
			console.log(total);
			$dhx.notify('total records on table', total, 'icons/db.png');
	}
	var onFail = function (tx, event, error_message) {
			console.log( error_message );
	}
	
	db.schema.persons.dataCount( onSuccess, onFail );
	// or
	db.schema.persons.count( onSuccess, onFail );

```

*filter() and search()*
	
	Filters table data by provided parameters.
	Sends a message to MQ system telling the found records

	The search is case and special chars insensitive. It means, if you search for 'Anõs', or 'José', 
	it will return all entries with 'anos' or 'jose'

```javascript
	db.schema.persons.search.where({
		query: {
			and: form.getFormData() // get form payload to be used as parameter for filtering. Uses the AND operator to satisfy ALL rules
			// or: form.getFormData() // get form payload to be used as parameter for filtering. Uses the OR operator to satisfy ANY rule
		, }
		// called each times the query finds a record
		// slower when handling BIG amount of data
		, onFound: function (record_id, record, tx, event) {
			//$dhx.notify('found: ', record, 'icons/db.png');
			var c = {
				db: 'juris'
				, table: 'persons'
			}
			var schema = $dhx.dataDriver.getTableSchema(c);
			var primary_key = schema.primary_key.keyPath
			var columns = $dhx.dataDriver._getColumnsId(c).split(',');
			var data = [];
			columns.forEach(function (column, index_, array_) {
				data[index_] = record[column];
			});
			that.view.grid.addRow(record_id, data);
		}
		// called ONE time when query is ready and found ALL records
		// faster when handling BIG amount of data
		, onReady: function (records, tx, event) {
			var data = {
				rows: []
			};
			var c = {
				db: 'juris'
				, table: 'persons'
			}
			var schema = $dhx.dataDriver.getTableSchema(c);
			var primary_key = schema.primary_key.keyPath;
			var columns = $dhx.dataDriver._getColumnsId(c).split(',');
			records.forEach(function (recordset, index, array) {
				var record = [];
				columns.forEach(function (column, index_, array_) {
					record[index_] = recordset[column];
				});
				data.rows.push({
					id: recordset[primary_key]
					, data: record
				})
			});
			grid.parse(data, "json"); //takes the name and format of the data source
			layout.progressOff();
			form.unlock();
		}
		// called when there is any error on the request / transaction
		, onerror: function ( tx, event, error_message  ) {
			console.log( error_message )
			layout.progressOff();
			form.unlock();
		}
	});
```

*first()*
	
	Returns the ID of the first item on table

```javascript
	var onSuccess = function (record_id, record, tx, event) {
			console.log(record_id);
	}
	var onFail = function (tx, event, error_message ) {
			//console.log( error_message );
	}
	
	db.schema.persons.first( onSuccess,  onFail );

```

*getCursor()*
	
	get current position of table cursor

```javascript
	var onSuccess = function (record_id, tx, event) {
			$dhx.notify('getCursor', record_id, 'icons/db.png');
	}
	var onFail = function (tx, event, error_message ) {
			//console.log( error_message );
	}
	
	db.schema.persons.getCursor( onSuccess, onFail );

```

*item()*
	
	Returns hash of data related to the specific item.

```javascript
	var onSuccess = function (record, tx, event) {
			console.log( record );
	}
	var onFail = function (tx, event, error_message ) {
			console.log( error_message );
	}
	
	db.schema.persons.item( onSuccess, onFail );

```

*last()*
	
	Returns the ID of the last item on table.

```javascript
	var onSuccess = function (record_id, record, tx, event) {
			console.log(record_id);
	}
	var onFail = function (tx, event, error_message ) {
			//console.log( error_message );
	}
	
	db.schema.persons.last( onSuccess,  onFail );

```

*load()*
	
	clear synced component data and loads table data into it

```javascript
	var onSuccess = function (records, rows_affected, tx, event) {
			console.log(records);
	}
	var onFail = function (tx, event, error_message ) {
			//console.log( error_message );
	}
	
	db.schema.persons.load(  onSuccess, onFail );
	
```

*next()*
	
	Returns the ID of the next item ( an item with the index == current + 1).

*previous()*
	
	Returns the ID of the previous item ( an item with the index == current - 1).

*remove()*
	
	Removes item by the ID.

*serialize()*
	
	serializes data to a JSON object .

*setCursor()*
	
	set virtual cursor

*sort()*
	
	Sorts a dataset.

*sync()*
	
	sync a multiple record compoonent to a table: grid
	implement input masks and validation
	implement live edit on cells double click

*unbind()*
	
	unbinds components

*update()*
	
	Updates a specific item.


### Status

	under development

### Online demo

	http://www.dhtmlx.com.br/dbDemo/?_enable_log=true

### ToDo

	- avoid to delete and rebuild entire database when server structure changes
	- update record of synced components when editing a record on a table
	- display javascript memory at control panel
	- webmail
	- text editor application
	- File Explorer
	- ability to add tables to existing databases (changing version)
	- Full documentation
	- Implement proxy class for server communication
		- REST calls through $dhx.REST.API. -> for loading big datasets
		- Websocket -> calls for live updating and syncing data
		- AMQP calls through flash plugin

	- exist()
	- toPDF() method on table level
	- onAfterAdd() event	Occurs after item adding is finished.
	- onAfterCursorChange() event	event called after value of cursor was changed
	- onAfterDelete() event	Occurs after item deleting is finished.
	- onBeforeAdd() event	Occurs before item adding is initiated.
	- onBeforeCursorChange() event	event called just before value of cursor will be changed
	- onBeforeDelete() event	Occurs before item deleting is initiated.
	- onDataRequest() event	called when component issue dynamic request for a data
	- onLoadError() event	occurs when server side returns invalid response during data loading
	- onStoreUpdated() event	occurs when data was changed by any means
	- onXLE() event	fires when the data loading is finished and a component or data is rendered
	- onXLS() event	fires when starts loading data

	- check fkey when deleting
	- permissions
	- user set grid dimensions
	- update main grid column when editing a sub crud 




	Limitations:

	- Dont create FKs pointing to text columns ... only to primary key columns
	**Solved** - support both varchar and integer column




### LICENSE AND COPYRIGHT

	Copyright 2015 José Eduardo Perotta de Almeida.

AGPL license.


### BUGS AND LIMITATIONS

No bugs have been reported.

Please report any bugs or feature requests through the email address: eduardo at web2solutions.com.br

### DISCLAIMER OF WARRANTY

BECAUSE THIS SOFTWARE IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION.

IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR REDISTRIBUTE THE SOFTWARE AS PERMITTED BY THE ABOVE LICENCE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
