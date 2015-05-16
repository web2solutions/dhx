# $dhx.dataDriver


## $dhx.dataDriver overview

**What is it?**

	$dhx.dataDriver is the first indexedDB data driver/ORM focused in build DHTMLX applications.
	
	Built on top of indexedDB API, it provides an asynchronous and an API that that is very similar to DHTMLX DataStore API ( http://docs.dhtmlx.com/api__refs__datastore.html ), which is a synchronous API.


**why to use it?**

- Provide support for offline applications.

- Multi thread environment instead single thread environment. no blocking.

- Bind and Sync DHTMLX components through multiple databases and tables.

- Each app can have up to 20% of the shared pool. As an example, if the total available disk space is 50 GB, the shared pool is 25 GB, and the app can have up to 5 GB. This is calculated from 20% (up to 5 GB) of half (up to 25 GB) of the available disk space (50 GB). (https://developer.chrome.com/apps/offline_storage#temporary).

- Traditional dhtmlx DataStorage and localStorage are perfects for small amount of data, but fails when you need to storage and handle large amount of data.



### **Environment**

Every database provide support for:

- indexed columns
- primary keys
- SQL like data types: character varying, date, timestamp, text, numeric, integer
- hot validation for data types when handling data
- hot format and validation for input data on every synced and bound components
- complete API on database and table level

```javascript
	{
		// the dataset name.
	    	// String
	    	data_set_name: "",
	
	    	// the primary key name. The primary key name from table on DB
	    	// Will be used as index. String
	    	primary_key: "",

	    	// the recordset of the dataset containing all records
	    	// extended property with getter and setter pointing to a localStorage
	    	// array
	    	data: [],

	    	// the javascript object containing the RESTful end point information
	    	// object
	    	api_service: {
	        	// default RESTful end point address
	        	// String
	        	end_point: ""

	        	// Every end point returns a standardized response.
	        	// On the response there is one property which is responsible for
	        	// storing all data from this end point. This property is the data collection.
	        	// Provide here the same name returned by the end point
	        	// String
	        	,
	        	collection_name: "" // API data collection name -> MANDATORY

	        	// RESTful connection payload.
	        	// use it to send HTTP parameters to the end point
	        	// String
	        	,
	        	api_payload: "" // not mandatory
	    	},

	    	// The onSucess event fired when you creates a dataset
	    	// function
	    	onSuccess: function() {},

	    	// The onFail event fired when you try to create a dataset and there is some issue
	    	// function
	    	onFail: function() {},

	    	// The synced components collection.
	    	// Stores all the synced components.
	    	// array
	    	_synced_components: [],

	    	// The bound components collection.
	    	// Stores all the bound components.
	    	// array
	    	_bound_components: []
	}
```

**Storage size**

Currently the storage provides the following storage capacity:

- 5 MB per origin in Google Chrome, Mozilla Firefox and Opera;
- 10 MB per storage area in Internet Explorer;
- 25MB per origin on BlackBerry 10 devices

A little comparison:

5MB is +- 33 thounsand records like the following record:

	{"template_id":38,"subject":"message subject","name":"template name","data":[38,"template name","message subject"," message body"],"message":" message body"}

The oldest approchs consist in use the browser memory or cookies

### **Syntax suggar**

jDBd provides two differents type of objects referencing


**Facade** - direct object referencing

```javascript
	// dataset 1
	$dhx.jDBd.create( configuration );
	$dhx.jDBd.sync( sync_configuration );

	// dataset 2
	$dhx.jDBd.create( configuration2 );
	$dhx.jDBd.sync( sync_configuration2 );
```

**Object constructor** - variable referencing

```javascript
	// dataset 1
	var my_dataset1 = new $dhx.dataStore( configuration );
	my_dataset1.sync( sync_configuration );

	// dataset 2
	var my_dataset2 = new $dhx.dataStore( configuration2 );
	my_dataset2.sync( sync_configuration2 );
```


The **$dhx.jDBd** and **$dhx.dataStore** handles the same dataset collection system.

 * It means, does not matter which solution you use to create datasets, both are able to handle datasets created with both solutions.

 * It means you can use both solutions in your project

**Which referencing model should I use?**

You decide!

	1 - If you prefer construct objects referencing it to a variable, then use the constructor model.

	2 - If you prefer direct object referencing, then use the facade model

=========

## JDBd API

### **Methods**

##### *create( configuration )*

	Creates a dataset with given configuration.

**Constructor style**

```javascript
	var my_datastore = new $dhx.dataStore( configuration );
```

**Facade style**

```javascript
	$dhx.jDBd.create( configuration );
```

**configuration hash**

The configuration hash is a JSON notation structure containing all the configuration for the dataset that you want to create

**configuration hash _properties_ and _methods_**


    -> data_set_name

    A client side dataset is a representation of a database table.
    For best conventions, provide the name of the table on database as datastore name.
    dataset names must be unique.

    type: string
    mandatory property
    ________________________________________

    -> primary_key

    primary key name of the table

    type: string
    mandatory property
    ________________________________________

    -> data

    A static array of objects {} containing the data for filling the dataset
    if you don't pass this property AND the "api_service" object to the dataset object constructor
    the dataset will be created with no data

    type: array
    not mandatory property
    default [] - (empty datastore)
    ________________________________________

    -> api_service

    An javascript object containing 3 pairs of key/value.
    This object provide support for live data operations.
    if you don't pass this property AND the "data" property to the dataset object constructor
    the dataset will be created with no data

	-> end_point : "" string

	summary: default API end point for this dataset
	MANDATORY

	-> collection_name: "" string

	summary: API data collection name. This is the name that the end points returns as data collection name
	MANDATORY

	-> api_payload: "" string - valid pairs parameter/value for http payloads

	summary: payload that you want to send to the end point
	not mandatory

    type: object
    not mandatory object
    default none
    ________________________________________

    -> overwrite

    When you create a dataset, the datastore system checks out if already exists a dataset with the same
    name that you are trying to create. If it exists, by default, it will NOT be overwrited

    type: boolean - true, false
    not mandatory property
    Default: false
    ________________________________________

    -> onSuccess

    callback function fired when the dataset was sucessful created

    type: function
    not mandatory method
    default none
    ________________________________________

    -> onFail

    callback function fired when the dataset was NOT sucessful created

    type: function
    not mandatory method
    default none


===========

##### * *bind( bind_configuration )*


	Binds a DHTMLX "one row" component to the dataset. Ex.: forms


**The form**

When you bind a form you dont need to attach the onButtonClick event to the form to implement saving operations

The datastore system will automatically map the buttons which the name starts with the prefix "x_special_button_"

```javascript
	var settings = {
		conf_form: {
			"template": [{
					type: "settings",
					position: "label-left",
					labelWidth: 120,
					inputWidth: 160
				}, {
					type: "hidden",
					name: 'template_id',
					label: 'template_id',
					value: "",

				}, {
					type: "input",
					name: 'name',
					label: 'name',
					value: "",
					required: true,
					validate: 'NotEmpty'
				}

				, {
					type: "input",
					name: 'subject',
					label: 'subject:',
					value: "",
					required: true,
					validate: 'NotEmpty'
				}, {
					type: "input",
					name: 'message',
					label: 'message:',
					value: "",
					required: true,
					validate: 'NotEmpty'
				}, {
					type: "button",
					value: "save existing record",
					name: "x_special_button_update"
					// x_special_button_update id automatically
					// recognized when binding a form to a dataset
				}, {
					type: "button",
					value: "save as new",
					name: "x_special_button_save"
					// x_special_button_save id automatically
					// recognized when binding a form to a dataset
				}, {
					type: "button",
					value: "delete current record",
					name: "x_special_button_delete"
					// x_special_button_delete id automatically
					// recognized when binding a form to a dataset
				}

			]
		} // end form settings
	}; // end settings

	/* create dhtmlx form */
        form = new dhtmlXForm("form", settings.conf_form.template);
```

**Constructor style**

```javascript
	my_datastore.bind( {
		component: form // mandatory
        	,component_id: "form" // mandatory
	} );
```

**Facade style**

```javascript
	$dhx.jDBd.bind( {
		data_set_name: "my_dataset_name" // mandatory
		,component: form // mandatory
        	,component_id: "form" // mandatory
	} );
```

**bind_configuration hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________


    -> component

    Provide the DHTMLX component object that you want to bind to the dataset

    type: DHTMLX component object
    mandatory object
    ________________________________________


    -> component_id

    Provide a UID string which identify the component

    type: string
    mandatory property
    ________________________________________

    -> $init

    provide your custom modifier function wich will be used to format data when parsing on component
    This function will be called always when you call setCursor(), modifying the displayed record
    on the bound component

    type: function
    not mandatory property. default none.

===========

##### * *dataCount()*

	Returns the total count of items in DataStore.

**Constructor style**

```javascript
	my_datastore.dataCount();
```

**Facade style**

```javascript
	$dhx.jDBd.dataCount( {
		data_set_name: "my_dataset_name" // mandatory
	} );
```

===========

##### * *del( hash )*

	Deletes a record from the dataset

**Constructor style**

```javascript
	my_datastore.del({
	    record_id: 3,
	    live: false,
	    onSuccess: function(record_id) {
	        console.log( record_id + "saved" );
	    },
	    onFail: function(response) {
	        console.log( "was not saved" );
	    }
	});
```

**Facade style**

```javascript
	$dhx.jDBd.del({
	    data_set_name: "my_dataset_name",
	    record_id: 3,
	    live: false,
	    onSuccess: function(record_id) {
	        console.log( record_id + "saved" );
	    },
	    onFail: function(response) {
	        console.log( "was not saved" );
	    }
	});
```

**del hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________


    -> record_id

    provide the record_id of the record which you want to delete

    type: integer/string
    mandatory property
    ________________________________________


    -> live

    should the delete operation be live or not

    type: boolean
    not mandatory property, default true
    ________________________________________

    -> onSuccess

    callback function fired when the record was sucessful deleted

    type: function
    not mandatory method
    default none
    ________________________________________

    -> onFail

    callback function fired when the record was not sucessful deleted

    type: function
    not mandatory method
    default none








===========

##### * *deleteCurrentRecord( hash )*

	Deletes the record where the current cursor is located

**Constructor style**

```javascript
	my_datastore.deleteCurrentRecord({
	    live: false,
	    onSuccess: function(record_id) {
	        console.log( record_id + "saved" );
	    },
	    onFail: function(response) {
	        console.log( "was not saved" );
	    }
	});
```

**Facade style**

```javascript
	$dhx.jDBd.del({
	    data_set_name: "my_dataset_name",
	    live: false,
	    onSuccess: function(record_id) {
	        console.log( record_id + "saved" );
	    },
	    onFail: function(response) {
	        console.log( "was not saved" );
	    }
	});
```

**deleteCurrentRecord hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________

    -> live

    should the delete operation be live or not

    type: boolean
    not mandatory property, default true
    ________________________________________

    -> onSuccess

    callback function fired when the record was sucessful deleted

    type: function
    not mandatory method
    default none
    ________________________________________

    -> onFail

    callback function fired when the record was not sucessful deleted

    type: function
    not mandatory method
    default none



===========

##### * *get( hash )*

	Returns dataset data as array of JSON records

**Constructor style**

```javascript
	my_datastore.get();
```

**Facade style**

```javascript
	$dhx.jDBd.get( {
		data_set_name: "my_dataset_name" // mandatory
	} );
```

**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.


===========

##### * *getCurrentRecord( hash )*

	Returns current dataset record as JSON

**Constructor style**

```javascript
	my_datastore.getCurrentRecord();
```

**Facade style**

```javascript
	$dhx.jDBd.getCurrentRecord( {
		data_set_name: "my_dataset_name" // mandatory
	} );
```
**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.


===========

##### * *getCursor( hash )*

	Returns current cursor position. The cursor position is a record_id.

**Constructor style**

```javascript
	my_datastore.getCursor();
```

**Facade style**

```javascript
	$dhx.jDBd.getCursor( {
		data_set_name: "my_dataset_name" // mandatory
	} );

```

**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.


===========

##### * *getDataForGrid( hash )*

	Properly format dataset data as DHTMLX grid JSON required format.
	Useful for using together with grid.parse();

**Constructor style**

```javascript
	var data = my_datastore.getDataForGrid(
	{
		,filter : { "PhoneTypeID" : "1"} // list only primary phones
		,$init : function(obj) {
		    var PrimaryPhone = (obj.PrimaryPhone == 0 ? "0" : (obj.PrimaryPhone == "0" ? "0" : "1"))
		    // obj data is the array wich will be used a grid row data
		    obj.data = [obj.ContactID, obj.PhoneTypeID, obj.PhoneNumber, PrimaryPhone, obj.Ext]
		    obj.PrimaryPhone = PrimaryPhone;
		}
	});
	// fill grid
	grid.parse( data, "json" );
```

**Facade style**

```javascript
	var data = $dhx.jDBd.getDataForGrid({
		data_set_name :"ContactPhone"
		,filter : { "PhoneTypeID" : "1"} // list only primary phones
		,$init : function(obj) {
		    var PrimaryPhone = (obj.PrimaryPhone == 0 ? "0" : (obj.PrimaryPhone == "0" ? "0" : "1"))
		    // obj data is the array wich will be used a grid row data
		    obj.data = [obj.ContactID, obj.PhoneTypeID, obj.PhoneNumber, PrimaryPhone, obj.Ext]
		    obj.PrimaryPhone = PrimaryPhone;
		}
	});
	// fill grid
	grid.parse( data, "json" );
```

**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________


    -> filter

    provide the set of key/value (column/value) as JSON to be used as filtering criteria

    type: JSON
    not mandatory property. default none
    ________________________________________


    -> $init

    provide your custom modifier function wich will be used to format data when parsing on grid

    type: function
    not mandatory property. default none.


===========

##### * *insert( hash )*

	Insert a new record into the dataset

**Constructor style**

```javascript
	var hash = { name: "template name tesssst", subject: "template name tesssst", message: "message test" };
	dt.insert({
	    record: hash,
	    live: false,
	    onSuccess: function(record_id) {
	        console.log( record_id + "saved" );
	    },
	    onFail: function(response) {
	        console.log( "was not saved" );
	    }
	});
```

**Facade style**

```javascript
	var hash = { name: "template name tesssst", subject: "template name tesssst", message: "message test" };
	$dhx.jDBd.insert({
	    data_set_name: "emailmessages_templates",
	    record: hash,
	    live: false,
	    onSuccess: function(record_id) {
	        console.log( record_id + "saved" );
	    },
	    onFail: function(response) {
	        console.log( "was not saved" );
	    }
	});
```

**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________

    -> record

    provide a set of key/value (columnName/value) to be used as payload when inserting the record.
    key is the column name and value is the properly value for that conlunm on the new inserted record

    type: JSON
    mandatory property.

    ________________________________________

    -> live

    define if the operation will be performed on server and client or only on client

    type: boolean
    not mandatory property. defaut true
    ________________________________________

    -> onSuccess

    callback function fired when the record is inserted into dataset

    type: function
    not mandatory method
    default none
    ________________________________________

    -> onFail

    callback function fired when the record is not inserted into dataset

    type: function
    not mandatory method
    default none

===========

##### * *setCursor( hash )*

	Set cursor position passing a record_id

	** it will automatically change data on bound components

**Constructor style**

```javascript
	my_datastore.setCursor({
		position: 3348 // mandatory
	});
```

**Facade style**

```javascript
	$dhx.jDBd.setCursor( {
		data_set_name: "my_dataset_name" // mandatory
		,position: 3348 // mandatory
	} );
```

**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________


    -> position

    provide the record_id of the record which you want to point the cursor

    type: integer/string
    mandatory property

===========

##### * *sync( sync_configuration )*

	Syncs a multi-records component to a dataset

**Constructor style**

Sync grid

```javascript
    dt.sync({
        component: grid, // mandatory
        component_id: "grid", // mandatory
        onSuccess: function() {
            // if grid was successful synced, then
            // select the first record on the grid
            grid.selectRow(0, true, false, false);
            // bind form
            /*$dhx.jDBd.bind({
                data_set_name: "emailmessages_templates" // mandatory
                ,component: form // mandatory
                ,component_id: "form" // mandatory
            });*/
        },
        onFail: function(reason) {
            console.log(reason);
        }
    });
```

Sync combo

```javascript
    var form_combo = form.getCombo("DegreeTypeID");
    dt.sync({
        ,component: form_combo // mandatory
        ,component_id: "form_combo" // mandatory // provide a unique id
        ,$init: function(obj) {
                obj.value = obj.DegreeTypeId;
                obj.text = obj.DegreeText;
            } // not mandatory, default false
    });
```


**Facade style**

Sync grid

```javascript
    $dhx.jDBd.sync({
        data_set_name: "emailmessages_templates", // mandatory
        component: grid, // mandatory
        component_id: "grid", // mandatory
        onSuccess: function() {
            // if grid was successful synced, then
            // select the first record on the grid
            grid.selectRow(0, true, false, false);
            // bind form
            /*$dhx.jDBd.bind({
                data_set_name: "emailmessages_templates" // mandatory
                ,component: form // mandatory
                ,component_id: "form" // mandatory
            });*/
        },
        onFail: function(reason) {
            console.log(reason);

        }
    });
```

Sync combo

```javascript
    var form_combo = form.getCombo("DegreeTypeID");
    $dhx.jDBd.sync({
        data_set_name: "lkpDegree" // mandatory
        ,component: form_combo // mandatory
        ,component_id: "form_combo" // mandatory // provide a unique id
        ,$init: function(obj) {
                obj.value = obj.DegreeTypeId;
                obj.text = obj.DegreeText;
            } // not mandatory, default false
    });
```

**sync_configuration hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________


    -> component

    Provide the DHTMLX component object that you want to bind to the dataset

    type: DHTMLX component object
    mandatory object
    ________________________________________

    -> component_id

    Provide a UID string which identify the component

    type: string
    mandatory property
    ________________________________________

    -> $init

    provide your custom modifier function wich will be used to format data when parsing on component

    type: function
    not mandatory property. default none.


===========

##### * *item( hash )*

	An alias to the method getRecord();

===========

##### * *exists( hash )*

	Returns true if record exists on dataset, or false if doesnt exist

**Constructor style**

```javascript
	dt.exists({
	    record_id: 3
	})
```

**Facade style**

```javascript
	$dhx.jDBd.exists({
	    data_set_name: "emailmessages_templates",
	    record_id: 3
	})
```

**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________

    -> record_id

    provide the record_id of the record which you want to delete

    type: integer/string
    mandatory property


===========

##### * *filter( hash )*

	Filters data on synced components

**Constructor style**

```javascript
	dt.filter({
		filter : { "template_id": 3 }
	});
```

Custom filtering

```javascript
	dt.filter({
		filter : [ function(obj,value)
	    	{
			if (obj.name.indexOf(value)==0) return true;
			return false;
		}
	    , "template" ]
	});
```

Clear filter

```javascript
	dt.filter({
		filter : false
	});
```


**Facade style**

```javascript
	$dhx.jDBd.filter({
		data_set_name : "emailmessages_templates"
		,filter : { "template_id": 3 }
	});
```

Custom filtering

```javascript
	$dhx.jDBd.filter({
		data_set_name : "emailmessages_templates"
	    	,filter : [ function(obj,value)
	    	{
			if (obj.name.indexOf(value)==0) return true;
			return false;
		}
	    , "template" ]
	});
```

Clear filter

```javascript
	$dhx.jDBd.filter({
		data_set_name : "emailmessages_templates"
	    	,filter : false
	});
```




**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________

    -> filter

    filtering criteria

    type:
    	JSON for exact match Key/Value -> Column/Value operator "equal" ==
    	2 index Array for custom filtering
    	or false for rendering all data
    mandatory. default false


===========

##### * *first( hash )*

	Returns the ID of the first item ( an item with the index == 0 )

**Constructor style**

```javascript
	dt.first();
```

**Facade style**

```javascript
	$dhx.jDBd.first({
		data_set_name : "emailmessages_templates"
	});
```

** hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.


===========

##### * *idByIndex( hash )*

	Returns the record_id in accordance with given index position

**Constructor style**

```javascript
	dt.idByIndex({
		index : 0
	});
```

**Facade style**

```javascript
	$dhx.jDBd.idByIndex({
		data_set_name : "emailmessages_templates"
		,index : 0
	});
```


** hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________

    -> index

    provide the index of the record which you want to get the record_id

    type: integer
    mandatory property

===========

##### * *indexById( hash )*

	Returns index position in accordance with given record_id

**Constructor style**

```javascript
	dt.indexById({
		record_id : 3
	});
```

**Facade style**

```javascript
	$dhx.jDBd.indexById({
		data_set_name : "emailmessages_templates"
		,record_id : 3
	});
```

** hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.
    ________________________________________

    -> record_id

    provide the record_id of the record which you want to get the index

    type: integer/string
    mandatory property

===========

##### * *last( hash )*

	Returns the ID of the last item ( an item with the index == dataCount-1)

**Constructor style**

```javascript
	dt.last();
```

**Facade style**

```javascript
	$dhx.jDBd.last({
		data_set_name : "emailmessages_templates"
	});
```

** hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.

===========

##### * *next( hash )*

	Returns the ID of the next item (id of current record index + 1 )

**Constructor style**

```javascript
	dt.next();
```

**Facade style**

```javascript
	$dhx.jDBd.next({
		data_set_name : "emailmessages_templates"
	});
```

**hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.

===========

##### * *previous( hash )*

	Returns the ID of the previously item (id of current record index - 1 )

**Constructor style**

```javascript
	dt.previous();
```

**Facade style**

```javascript
	$dhx.jDBd.previous({
		data_set_name : "emailmessages_templates"
	});
```

** hash _properties_ and _methods_**


    -> data_set_name

    type: string
    mandatory property only on the facade model.


===========

##### * *remove( hash )*

	An alias to the method del();

===========

##### * *add( hash )*

	An alias to the method insert();

===========

##### * *sort( hash )*

	beta

------------------------------

#### jDBd - Facade model examples

**Create dataset with static data**

```javascript
	$dhx.jDBd.create({
		data_set_name : "tbl_clients"
		,data : [
			{ client_id : 1, name: "Mark", surname: "Livings"}
			,{ client_id : 2, name: "Eduardo", surname: "Almeida"}
		]
		,primary_key : "client_id"
		,overwrite : true // true or false, default false.
	});
```

**Create dataset consuming an API end point**

```javascript
	$dhx.jDBd.create({
		// For best conventions, use the same name of the table on the database
		data_set_name: "emailmessages_templates",

		primary_key: "template_id" // primary key name of the table

		,overwrite: true // should overwrite this dataset on the memory if it already exists?

		// provide API informations for fetching data from server when creating the dataset
		// instead providing an static array
		,api_service: {
			end_point: "/emailmessages/templates" // default API end point, use it when all end points are equal
			,collection_name: "templates" // API data collection name -> MANDATORY
			,api_payload: "columns=name,subject,message,template_id" // not mandatory
		} // not mandatory default false
		,
		onSuccess: function( dataset ) {}
		onFail: function( request ) {}
	});
```

**Sync grid**

```javascript
	$dhx.jDBd.sync({
	    data_set_name: "emailmessages_templates", // mandatory
	    component: grid, // mandatory
	    component_id: "grid", // mandatory
	    onSuccess: function() {
	        // if grid was successful synced, then
	        // select the first record on the grid
	        grid.selectRow(0, true, false, false);
	        // bind form
	        /*$dhx.jDBd.bind({
	            data_set_name: "emailmessages_templates" // mandatory
	            ,component: form // mandatory
	            ,component_id: "form" // mandatory
	        });*/
	    },
	    onFail: function(reason) {
	        console.log(reason);

	    }
	});
```


**Sync combo**

```javascript
	var form_combo = form.getCombo("DegreeTypeID");
	$dhx.jDBd.sync({
		data_set_name: "lkpDegree" // mandatory
		,component: form_combo // mandatory
		,component_id: "form_combo" // mandatory // provide a unique id
		,$init: function(obj) {
				obj.value = obj.DegreeTypeId;
				obj.text = obj.DegreeText;
			} // not mandatory, default false
	});
```

**Get dataset**

```javascript
	$dhx.jDBd.get({
		data_set_name: "tbl_clients"
	}).forEach(function(client, index, array) {
			console.log( client.client_id );
			console.log( client.name );
			console.log( client.surname );
		});
```

**Feed dhtmlx grid**

```javascript
	dhtmlxgrid.parse(
		$dhx.jDBd.getDataForGrid(
			{
				data_set_name :"tbl_clients"
				,filter : { "name": "Mark"}
			}
		), "json" );
```



**Delete one record on the specified dataset - delete from memory only**

```javascript
	$dhx.jDBd.del(
	{
		data_set_name: "tbl_clients",
		record_id: 1,
		live: false,
		onSuccess: function(record_id) {
			console.log( record_id + "deleted" );
		},
		onFail: function(response) {
			console.log( "was not deleted" );
		}
	});
```

**Delete one record on the specified dataset - delete from memory AND server**

```javascript
	$dhx.jDBd.del(
	{
		data_set_name: "tbl_clients",
		record_id: 1,
		onSuccess: function(record_id) {
			console.log( record_id + "deleted" );
		},
		onFail: function(response) {
			console.log( "was not deleted" );
		}
	});
```


**Update one record on the specified dataset - update on memory AND server**

```javascript
	var hash = dhtmlxForm.getFormData();
	$dhx.jDBd.update({
		data_set_name: "emailmessages_templates",
		record_id: 3,
		record: hash,
		onSuccess: function(record_id) {
			console.log(record_id + "updated");
		},
		onFail: function(response) {
			console.log("was not updated");
		}
	});
```

**Update one record on the specified dataset - update on memory only**

```javascript
	var hash = dhtmlxForm.getFormData();
	$dhx.jDBd.update({
		data_set_name: "emailmessages_templates",
		record_id: 3,
		record: hash,
		live: false,
		onSuccess: function(record_id) {
			console.log(record_id + "updated");
		},
		onFail: function(response) {
			console.log("was not updated");
		}
	});
```

**Insert one record on the specified dataset - save on memory AND server**

```javascript
	var hash = dhtmlxForm.getFormData();
	$dhx.jDBd.insert({
		data_set_name: "tbl_clients",
		record: hash,
		onSuccess: function(record_id) {
			console.log( record_id + "saved" );
		},
		onFail: function(response) {
			console.log( "was not saved" );
		}
	});
```

**Insert one record on the specified dataset - save on memory only**

```javascript
	var hash = dhtmlxForm.getFormData();
	$dhx.jDBd.insert({
		data_set_name: "tbl_clients",
		record: hash,
		live: false,
		onSuccess: function(record_id) {
			console.log( record_id + "saved" );
		},
		onFail: function(response) {
			console.log( "was not saved" );
		}
	});
```

**Insert one record on the specified position inside a dataset - save on memory AND server**

```javascript
	var hash = dhtmlxForm.getFormData();
	$dhx.jDBd.insert({
		data_set_name: "tbl_clients",
		record: hash,
		onSuccess: function(record_id) {
			console.log( record_id + " saved" );
		},
		onFail: function(response) {
			console.log( "was not saved" );
		}
	}, 0); // where 0 is the first position
```


#### jDBd - Constructor model examples

**Create dataset with static data**

```javascript
	var dt = new $dhx.dataStore({
		/*
			For best conventions, use the same name of the table on the database
			mandatory
		*/
		data_set_name: "tbl_clients"

		/*
			primary key name of the table
			mandatory
		*/
		,primary_key: "client_id"

		/*
			provide an static array containing the data for filling the dataset
			not mandatory, default [] (empty datastore)
		*/
		,data : [
			{ client_id : 1, name: "Mark", surname: "Livings"}
			,{ client_id : 2, name: "Eduardo", surname: "Almeida"}
		]

		/*
			should overwrite this dataset on the memory if it already exists?
			not mandatory. true, false. Default: false
		*/
		,overwrite: true


		/*
			onSuccess callback - fired if dataset was created
			not mandatory. Default none
		*/
		,onSuccess: function(dataset) {

		}
		/*
			onError callback - fired if dataset was not created
			not mandatory. Default none
		*/
		,onFail: function(response) {

		}
	});
```

**Create dataset consuming an API end point**

```javascript
	var dt = new $dhx.dataStore({
		// For best conventions, use the same name of the table on the database
		data_set_name: "emailmessages_templates"

		// primary key name of the table
		,primary_key: "template_id"

		// provide an static array containing the data for filling the dataset
		//,data : []

		// should overwrite this dataset on the memory if it already exists?
		,overwrite: true

		// provide API informations for fetching data from server when creating the dataset instead providing an static array
		,api_service: {
			end_point: "/emailmessages/templates" // default API end point, use it when all end points are equal
			,collection_name: "templates" // API data collection name -> MANDATORY
			,api_payload: "columns=name,subject,message,template_id" // not mandatory
		} // not mandatory default false

		,onSuccess: function(dataset) {

		}

		,onFail: function(response) {

		}
	});
```

**Sync grid**

```javascript
	dt.sync({
	    component: grid // mandatory
	    ,component_id: "grid" // mandatory
	    ,onSuccess: function() {
	        // if grid was successful synced, then
	        // select the first record on the grid
	        grid.selectRow(0, true, false, false);


	    },
	    onFail: function(reason) {
	        console.log(reason);
	            $dhx.hideDirections();
	    }
	});
```

**Bind form**

```javascript
	dt.bind({
                component: form // mandatory
                ,component_id: "form" // mandatory
	});
```


## Online examples

[Functional jDBd API methods examples](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/syntax_suggar.html?_enable_log=true)


[Education component](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/education.html?_enable_log=true)


[Phone component](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/phone.html?_enable_log=true)

[Email component](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/email.html?_enable_log=true)

[lkp Address Province end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpAddressProvince.html?_enable_log=true)


[lkp Address Type end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpAddressType.html?_enable_log=true)


[lkp Country end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpCountry.html?_enable_log=true)


[lkp County end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpCounty.html?_enable_log=true)


[lkp Culture end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpCulture.html?_enable_log=true)

[lkp Ethnicity end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpEthnicity.html?_enable_log=true)

[lkp Language end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpLanguage.html?_enable_log=true)

[lkp Nationality end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpNationality.html?_enable_log=true)

[lkp Religion end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpReligion.html?_enable_log=true)

[lkp State end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/lkpState.html?_enable_log=true)

[Rel lkp RelationshipSubType end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/Rel_lkp_RelationshipSubType.html?_enable_log=true)

[Rel lkp RelationshipType end point](http://cdmap01.myadoptionportal.com/modules/$dhx_Framework/examples/Rel_lkp_RelationshipType.html?_enable_log=true)


## Issues and suggestions reporting

[jDBd board @ Trello](https://trello.com/b/zplC9lfC/jdbd)


### Authors and Contributors

Eduardo Almeida (@web2solutions)
