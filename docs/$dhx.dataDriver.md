# $dhx.dataDriver


## $dhx.dataDriver overview

**What is it?**

	$dhx.dataDriver is the first indexedDB data driver/ORM focused in build DHTMLX applications.
	
	Built on top of indexedDB API, it provides an asynchronous and an API that that is very similar to DHTMLX DataStore API ( http://docs.dhtmlx.com/api__refs__datastore.html ), which is a synchronous API.


**What is indexedDB?**

	IndexedDB is an API for client-side storage of significant amounts of structured data, which also enables high performance searches of this data using indexes. While DOM Storage is useful for storing smaller amounts of data, it is less useful for storing larger amounts of structured data. IndexedDB provides a solution. ( https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API )


**why to use it?**

- Provide support for offline applications. Nomore blockers when your server goes offline.

- Multi thread environment instead single thread environment. no blocking.

- Bind and Sync DHTMLX components through multiple databases and tables.

- Each app can have up to GBs of size.

- Traditional dhtmlx DataStorage and localStorage are perfects for small amount of data, but fails when you need to storage and handle large amount of data. There is where $dhx.dataDriver saves you.

- move your data model from server to client

- dramatically reduce HTTP requests from your client to your server



### **Environment**

Every database provide support for:

- multiple tables
- database versioning
- indexed columns
- multi record columns. Arrays.
- primary keys
- SQL like data types: character varying, date, timestamp, text, numeric, integer
- hot validation for data types when handling data
- hot format and validation for input data on every synced and bound components
- complete API on database and table level



### **Database model**

```javascript
	db = new $dhx.dataDriver.database({
		db: 'juris'
		, version: 1
		, schema: {
			persons: {
				//collection : 'persons'
				//,item : 'person'
				//,
				primary_key: {
					autoIncrement: false
					, keyPath: "person_id"
				}
				, str_columns: 'person_id,name,email,username,age,birth_date'
				, fields: [{
							"name": "person_id"
							, "value": ""
							, "mask_to_use": ""
							, "label": "person_id"
							, "validate": ""
							, "type": "hidden"
							, "tooltip": ""
							, "maxLength": null
							, "required": false
						}, {
							"maxLength": "255"
							, "required": false
							, "value": ""
							, "mask_to_use": ""
							, "label": "name"
							, "name": "name"
							, "tooltip": ""
							, "type": "input"
							, "validate": "NotEmpty"
						}, {
							"type": "input"
							, "tooltip": ""
							, "validate": "NotEmpty,ValidEmail"
							, "mask_to_use": ""
							, "label": "email"
							, "value": ""
							, "name": "email"
							, "required": false
							, "maxLength": "255"
						}, {
							"required": false
							, "maxLength": "300"
							, "tooltip": ""
							, "type": "input"
							, "validate": "NotEmpty"
							, "value": ""
							, "label": "username"
							, "mask_to_use": ""
							, "name": "username"
						}, {
							"name": "birth_date"
							, "value": ""
							, "mask_to_use": "date"
							, "label": "birth_date"
							, "validate": "NotEmpty"
							, "tooltip": ""
							, "type": "calendar"
							, "maxLength": null
							, "required": false
							, dateformat: "%Y-%m-%d"
							, enableTime: false
							, readonly: true
						}
						, {
							"name": "age"
							, "value": ""
							, "mask_to_use": "integer"
							, "label": "age"
							, "validate": "NotEmpty"
							, "tooltip": ""
							, "type": "input"
							, "maxLength": null
							, "required": false
						}
					] // end fields
				
				, columns: {
					"name": {
						"format": ""
						, "foreign_column_name": ""
						, "has_fk": false
						, "dhtmlx_grid_footer": ""
						, "dhtmlx_grid_width": "*"
						, "ordinal_position": 0
						, "validation": ""
						, "unique": false
						, "type": "character varying"
						, "maxlength": "255"
						, "dhtmlx_form_type": "input"
						, "required": true
						, "dhtmlx_grid_header": "name"
						, "default": ""
						, "dhtmlx_grid_sorting": "str"
						, "dhtmlx_grid_type": "ed"
						, "foreign_table_name": ""
						, "index": true
						, "dhtmlx_grid_align": "left"
					}
					, "email": {
						"dhtmlx_grid_align": "left"
						, "index": true
						, "dhtmlx_grid_type": "ed"
						, "foreign_table_name": ""
						, "dhtmlx_grid_sorting": "str"
						, "default": ""
						, "dhtmlx_grid_header": "email"
						, "required": true
						, "dhtmlx_form_type": "input"
						, "maxlength": "255"
						, "type": "character varying"
						, "unique": true
						, "validation": "ValidEmail"
						, "ordinal_position": 1
						, "dhtmlx_grid_footer": ""
						, "dhtmlx_grid_width": "*"
						, "has_fk": false
						, "foreign_column_name": ""
						, "format": ""
					}
					, "username": {
						"dhtmlx_grid_width": "*"
						, "dhtmlx_grid_footer": ""
						, "ordinal_position": 2
						, "format": ""
						, "has_fk": false
						, "foreign_column_name": ""
						, "maxlength": "300"
						, "unique": false
						, "validation": ""
						, "type": "character varying"
						, "default": ""
						, "dhtmlx_grid_header": "username"
						, "required": false
						, "dhtmlx_form_type": "input"
						, "dhtmlx_grid_align": "left"
						, "index": true
						, "dhtmlx_grid_type": "ed"
						, "foreign_table_name": ""
						, "dhtmlx_grid_sorting": "str"
					}
					, "age": {
						"format": "integer"
						, "foreign_column_name": ""
						, "has_fk": false
						, "dhtmlx_grid_footer": ""
						, "dhtmlx_grid_width": "*"
						, "ordinal_position": 3
						, "validation": "ValidInteger"
						, "unique": false
						, "type": "integer"
						, "maxlength": "255"
						, "dhtmlx_form_type": "input"
						, "required": true
						, "dhtmlx_grid_header": "age"
						, "default": 0
						, "dhtmlx_grid_sorting": "int"
						, "dhtmlx_grid_type": "ed"
						, "foreign_table_name": ""
						, "index": true
						, "dhtmlx_grid_align": "left"
					}
					, "birth_date": {
						"dhtmlx_grid_width": "*"
						, "dhtmlx_grid_footer": ""
						, "ordinal_position": 4
						, "format": "date"
						, "has_fk": false
						, "foreign_column_name": ""
						, "maxlength": null
						, "validation": ""
						, "unique": false
						, "type": "date"
						, "default": ""
						, "dhtmlx_grid_header": "birth_date"
						, "required": false
						, "dhtmlx_form_type": "calendar"
						, "index": true
						, "dhtmlx_grid_align": "left"
						, "foreign_table_name": ""
						, "dhtmlx_grid_type": "dhxCalendar"
						, "dhtmlx_grid_sorting": "date"
					}
				} // end columns
			}
		}
		// call all the times you connect into a database	
		
		, onConnect: function (response) {
			//console.log( response.message );
		}
		// called only one time when you create the database	
		
		, onCreate: function (response) {
			//console.log( response.message );
			//console.log( response.connection );
			//console.log( response.event );						
		}
		// call when database is ready for working	
		
		, onReady: function (response) {
			//console.log( response.connection );
			//console.log( response.event );
			//console.log( response.message );
			if (onSuccess) onSuccess();
		}
		// called when there is error on connection
		
		, onFail: function (response) {
			console.log(response.connection);
			console.log(response.event);
			console.log(response.message);
		}
	});
```

**Storage size**

Each app may have up to 20% of the shared pool. As an example, if the total available disk space is 50 GB, the shared pool is 25 GB, and the app can have up to 5 GB. This is calculated from 20% (up to 5 GB) of half (up to 25 GB) of the available disk space (50 GB). (https://developer.chrome.com/apps/offline_storage#temporary).



## Table API

	Each table on database provide support to the following methods


*add()*
	
	Adds a new record to the dataset.

*bind()*
	
	bind an one record compoonent to a table: forms
	implement input masks and validation

*clearAll()*
	
	Removes all data from the component.

*dataCount()*
	
	Returns the total count of items in table.

*exists()*
	
	Returns true if an item with the defined ID already exists.

*filter()*
	
	Filters DataStore by provided parameters.

*first()*
	
	Returns the ID of the first item ( an item with the index == 0 )

*getCursor()*
	
	get position of virtual cursor

*item()*
	
	Returns hash of data related to the specific item.

*last()*
	
	Returns the ID of the last item ( an item with the index == dataCount-1).

*load()*
	
	loads data to the component via xml or json, usually data-values pairs

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

### Authors and Contributors

Eduardo Almeida (@web2solutions)
