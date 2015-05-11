# MAP API RESTful client

The MAP API RESTful client is a Javascript client which provides support to consume end points from MAP RESTful API.

It means you will no longer use classical ajax calls to fetch content from MAP API.

The basic features of the client are:

  * Provides an auth system for MAP API
  * Creates database resources
  * List database resources
  * Update database resources
  * Deletes database resources
  * Upload files to server disk
  * List Files from server disk
  * Delete files from server disk
  * Search files on server disk
  * Generic dinamic table inquirier for fast filling DHTMLX grids
  * Generic dinamic table search for filtering data on DHTMLX combos

**About MAP API**

  [https://github.com/web2solutions/MAP-API/blob/master/README.md](https://github.com/web2solutions/MAP-API/blob/master/README.md)
	
**End points documentation**

  [http://cdmap01.myadoptionportal.com/modules/API_DOC/](http://cdmap01.myadoptionportal.com/modules/API_DOC/)
	

**Acessor namespace on CAIRS fw**

	CAIRS.MAP.API
	
#### **CAIRS.MAP.API Methods**

###### *CAIRS.MAP.API.authorize( payload )*

	login into API and get authorization to consume content over API.
	
	Execute this method before trying to call the other methods

payload - JSON object

```javascript
	{
	   // a valid MAP username
	   // mandatory
	   username: ''
	   
	   // not implemented yet, works like a password
	   // mandatory for production branch only
	   ,api_key: ''
	   
	   // Agency database name
	   // not mandatory. Default MAPTEST
	   ,database: ''
	   
	   // agency ID
	   // mandatory
	   ,agency_id: ''
	   
	   // success callback function
	   // fired when browser receives the end point response with no errors
	   // not mandatory. Default none
	   // inside the scope function you have access to the RESTful request object
	   ,onSuccess: function(request) {}
	
	   // error callback function
	   // fired when browser receives the end point response with errors
	   // not mandatory. Default none
	   // inside the scope function you have access to the RESTful request object
	   ,onFail: function(request) {}
	}
```

example:

```javascript
	CAIRS.MAP.API.authorize({
	   username: 'restoremleahy@adoptionassociates.net',
	   database: "MAPTEST",
	   agency_id: 25,
	   onSuccess: function(request) {
		// display countdown for this logged user token expiration
		CAIRS.MAP.API.showCountDown("expiration_info");
	    },
	    onFail: function(request) {
	        
	    }
	});
```

===========

###### *CAIRS.MAP.API.del( payload )*

	deletes an item on a end point

payload - JSON object

```javascript
	{
		// API end point address
		// mandatory - API end point address
		resource: ""
		
		// response format. values: json, xml and yaml
		// not mandatory, default json.
		,format: ""
		
		// success callback function
		// fired when browser receives the end point response with no errors
		// inside the scope function you have access to the RESTful request object
		,onSuccess: function(request) {}
		
		// error callback function
		// fired when browser receives the end point response with errors
		// inside the scope function you have access to the RESTful request object
		,onFail: function(request) {}
	}
```

example:

```javascript
	CAIRS.MAP.API.del(
	{
	    
	    // 1 is the ID of the record which I want to delete
	    resource: "/forms/1" 
	    
	    format: "json",
	    onSuccess: function(request) {
	        var json = JSON.parse(request.response);
	        dhtmlx.message({
	            text: json.response
	        });
	    },
	    onFail: function(request) {
	        var json = JSON.parse(request.response);
	        dhtmlx.message({
	            type: "error",
	            text: json.response
	        });
	    }
	});
```

===========

###### *CAIRS.MAP.API.get( payload )*

	list all/one item(s) from an end point

payload - JSON object

```javascript
	{
		// API end point address
		// mandatory - API end point address
		resource: ""
		
		// response format. values: json, xml and yaml
		// not mandatory, default json.
		,format: ""
		
		// url query payload
	       	// pass parameters to the End point via GET (url)
	       	// not mandatory, default none
	       	// generally, MAP end points provides support to the following parameters:
	       	//	columns, filter, filter_operator and order.
	       	// 	please check the end point documentation
		,payload: "" 
		
		// success callback function
		// fired when browser receives the end point response with no errors
		// inside the scope function you have access to the RESTful request object
		,onSuccess: function(request) {}
		
		// error callback function
		// fired when browser receives the end point response with errors
		// inside the scope function you have access to the RESTful request object
		,onFail: function(request) {}
	}
```

example getting all records:

```javascript
	// it will return only the columns formlabel,formname, ordered by formname ASC
	CAIRS.MAP.API.get({
	    resource: "/forms",
	    format: "json",
	    payload: "columns=formlabel,formname&order=" + JSON.stringify({
	        direction: 'ASC',
	        orderby: 'formname'
	    }),
	    onSuccess: function(request) {
	        var json = JSON.parse(request.response);
	        if (json.status == "success") {
	            
	            // forms is the data collection name returned by the end point.
	            // each end point returns a specific data collection name
	            alert(json.forms);
	            console.log(json.forms);
	            alert(json.forms[0].formname);
	        }
	    },
	    onFail: function(request) {
	        var json = JSON.parse(request.response);
	    }
	});
```

example getting just one record:

```javascript
	// it will return only the columns formlabel,formname
	CAIRS.MAP.API.get({
	    resource: "/forms/2898",
	    format: "json",
	    payload: "columns=formlabel,formname&order=" + JSON.stringify({
	        direction: 'ASC',
	        orderby: 'formname'
	    }),
	    onSuccess: function(request) {
	        var json = JSON.parse(request.response);
	        if (json.status == "success") {
	            
	            // hash is a 100% compatible JSON object to be used 
	            // together with form.setFormData( json.hash );
	            alert(json.hash);
	            console.log(json.hash);
	            alert(json.hash.formname);
	        }
	    },
	    onFail: function(request) {
	        var json = JSON.parse(request.response);
	    }
	});
```

===========

###### *CAIRS.MAP.API.getMappedURL( configuration )*

	gets a end point URL address properly formated to be consumed by DHTMLX grids
	
configuration - JSON

```javascript	
	{
	       	// API end point address
	       	// mandatory - API end point address
	       	resource: "", 
		
		// response format. values: json, xml and yaml
		// not mandatory, default json
		responseType: "", 
	       	
	       	// url query payload
	       	// pass parameters to the End point via GET (url)
	       	// not mandatory, default none
	       	params: ""
	}
```
	
example:

```javascript
	var gridURL = CAIRS.MAP.API.getMappedURL({
	        resource: "/LibraryFields",
	        responseType: "json",
	        params: "columns=" + self.model.conf_grid.ids + ""
	});
	
	console.log( gridURL );
	// https://apidev.myadoptionportal.com/LibraryFields.json?database=MAPTEST&token=f31a1770d51f06eccc3014204a50e182ff6494dc5f72ba85f6bc4256af64861e&columns=type,type_standard,name,label,caption,value,tooltip,text_size,required,use_library,library_field_id,className,mask_to_use&searchcriteria=2_Type
	    
	myDhxGrid.load(gridURL, function () { 
		// data loaded 
	}, "json");
```

===========

###### *CAIRS.MAP.API.insert( payload )*

	an alias to CAIRS.MAP.API.post( payload );

===========

###### *CAIRS.MAP.API.list( payload )*

	an alias to CAIRS.MAP.API.get( payload );

===========

###### *CAIRS.MAP.API.post( payload )*

	creates an item on an end point

payload - JSON object

```javascript
	{
		// API end point address
		// mandatory - API end point address
		resource: ""
		
		// response format. values: json, xml and yaml
		// not mandatory, default json.
		,format: ""
		
		// url query payload
	       	// pass parameters to the End point via POST
	       	// mandatory. 
	       	// mandatory parameter: hash
	       	//	hash is a JSON 100% compatible with form.getFormData() hash
	       	//	this hash holds pairs of key/values
	       	//	where key is the column name from a table and value is the
	       	//	properly value for that column
		,payload: "hash={}" 
		
		// success callback function
		// fired when browser receives the end point response with no errors
		// inside the scope function you have access to the RESTful request object
		,onSuccess: function(request) {}
		
		// error callback function
		// fired when browser receives the end point response with errors
		// inside the scope function you have access to the RESTful request object
		,onFail: function(request) {}
	}
```
	
example:

```javascript
	var hash = {
	    "formname": "form_form_name",
	    "formlabel": "form name",
	    "formtext": "text",
	    "captcha": "",
	    "key_id": "",
	    "form_agency_id": "25",
	    "numofrecords": "",
	    "submissionmsg": "submission message",
	    "formtype": "1",
	    "formdisplaytype": "1",
	    "adminalert": "",
	    "autorespond": "",
	    "tiplocation": "A",
	    "displaycolumns": "S",
	    "display": "S",
	    "preview": "",
	    "nomultiple": "",
	    "formindex": "D",
	    "redirecturl": " "
	};
	
	CAIRS.MAP.API.post({
	    resource: "/forms",
	    format: "json",
	    payload: "hash=" + JSON.stringify(hash),
	    onSuccess: function(request) {
	        var json = JSON.parse(request.response);
	        console.log(request);
	        alert("Id of the new form: " + json.form_id);
	    },
	    onFail: function(request) {
	        var json = eval('(' + request.response + ')');
	    }
	});
```

===========

###### *CAIRS.MAP.API.put( payload )*

	updates an item on an end point
	
payload - JSON object

```javascript
	{
		// API end point address
		// mandatory - API end point address
		resource: ""
		
		// response format. values: json, xml and yaml
		// not mandatory, default json.
		,format: ""
		
		// url query payload
	       	// pass parameters to the End point via PUT
	       	// mandatory. 
	       	// mandatory parameter: hash
	       	//	hash is a JSON 100% compatible with form.getFormData() hash
	       	//	this hash holds pairs of key/values
	       	//	where key is the column name from a table and value is the
	       	//	properly value for that column
		,payload: "hash={}" 
		
		// success callback function
		// fired when browser receives the end point response with no errors
		// inside the scope function you have access to the RESTful request object
		,onSuccess: function(request) {}
		
		// error callback function
		// fired when browser receives the end point response with errors
		// inside the scope function you have access to the RESTful request object
		,onFail: function(request) {}
	}
```

example:

```javascript
	var hash = {
	    "formname": "form_form_name",
	    "formlabel": "form name changed example",
	    "formtext": "text",
	    "captcha": "",
	    "key_id": "",
	    "form_agency_id": "25",
	    "numofrecords": "",
	    "submissionmsg": "submission message",
	    "formtype": "1",
	    "formdisplaytype": "1",
	    "adminalert": "",
	    "autorespond": "",
	    "tiplocation": "A",
	    "displaycolumns": "S",
	    "display": "S",
	    "preview": "",
	    "nomultiple": "",
	    "formindex": "D",
	    "redirecturl": " "
	};
	
	CAIRS.MAP.API.put(
	{
	    
	    // 2898 is the id of the record which you want update
	    resource: "/forms/2898", 
	    
	    format: "json",
	    payload: "hash=" + JSON.stringify(hash),
	    onSuccess: function(request) {
	        var json = JSON.parse(request.response);
	        console.log(request);
	        alert("Id of the updated form: " + json.form_id);
	    },
	    onFail: function(request) {
	        var json = JSON.parse(request.response);
	    }
	});
```

===========

###### *CAIRS.MAP.API.showCountDown( HTML_element_ID )*

	Displays a expiration countdown for the token in use on a HTML element

===========

###### *CAIRS.MAP.API.update( payload )*

	an alias to CAIRS.MAP.API.put( payload );

================

#### **CAIRS.MAP.API Properties**

###### *CAIRS.MAP.API.agency_id*

	Stores the agency_id which is automatically passed as parameter on every end point HTTP call
	
	*This flag value is updated when you call MAP.API.authorize()*
	
	**Please don´t directly assign a value to this property**

================

###### *CAIRS.MAP.API.auth_status*

	Stores a flag value in accordance with the login status.
	
	*This flag value is updated when you call MAP.API.authorize()*
	
	**Please don´t directly assign a value to this property**
	
	values: disconnected / connected. Default disconnected.

================

###### *CAIRS.MAP.API.OS*

	Stores a flag value in accordance with what is the operational system where API is running
	it changes API environment settings when fetching end points.
	
	Change the flag value **before** calling  MAP.API.authorize();
	
	values: linux / windows. Default linux.


================

###### *CAIRS.MAP.API.token*

	Stores a SHA256 token which will automatically passed as parameter on every end point HTTP call.
	Without a token you can't fetch end points
	
	*This flag value is updated when you call MAP.API.authorize()*
	
	**Please don´t directly assign a value to this property**

================

###### *CAIRS.MAP.API.user*

	Stores the logged user first_name.
	
	When disconnected, it has the following value: nobody
	
	*This flag value is updated when you call MAP.API.authorize()*
	
	**Please don´t directly assign a value to this property**

================

###### *CAIRS.MAP.API.database*

	Agency database name. This property value is setted inside the core in accordance with the payload
	provided when you call MAP.API.authorize()
	
	Default MAPTEST
	
	*This flag value is updated when you call MAP.API.authorize()*
	
	**Please don´t directly assign a value to this property**


================

###### *CAIRS.MAP.API.date_expiration*

	Stores the currently token life time in milliseconds.
	
	100% compatible to be used with new Date( CAIRS.MAP.API.date_expiration )
	
	*This flag value is updated when you call MAP.API.authorize()*
	
	**Please don´t directly assign a value to this property**


================

###### *CAIRS.environment*

	This propery is used to set/unset several features for development process.
	
	Regarding CAIRS.MAP.API requests, it defines on which API branch the RESTful requests will be performed
	
	values:
	
		production: https://api.myadoptionportal.com
		
		dev: https://apidev.myadoptionportal.com
		
		test: https://perltest.myadoptionportal.com

================

## Caveats

### Generic dinamic table inquirier for fast filling DHTMLX grids

MAP API provides a exclusive end point which provides support to query any table on a database and fill one grid.

It is very useful when you need fast fill a grid with data from one table from a database.

Let's supose you need to fill one grid with data from a table from an agency database, but, on that time, MAP API doesn't provides any end point which fetchs data from the table that you need to use as datasource on your grid, then you can use the CAIRS.MAP.API.getMappedURL() method to fetch content from any table from the database.

**End point address**

	/dhtmlx/grid/feed.json
	
**Parameters**

	table_name
		The table name from where the End Point will return data
	
	primary_key
		The primary key name of the table
	
	columns
		The column names from the table that you want to display on your grid
	
	filter
		A JSON object containing pairs of key/values. Key are column names and values
		are string which will be used to search foron that column
	
	order
		A JSON object containing two properties: orderby and direction
		
			orderby
				is the name of the column to be used as ordering criteria
				
			direction
				is a valid SQL keyword that defines the direction of the ordering
				ASC/DESC

**Example of usage**

```javascript
	var gridURL = CAIRS.MAP.API.getMappedURL({
	    resource: "/dhtmlx/grid/feed", // generic end point
	    responseType: "json", // not mandatory, default json
	    
	    // mandatory for this API End Point ( /dhtmlx/grid/feed.json )
	    params: "table_name=formmaker_properties&primary_key=form_id&columns=" + that.model.conf_grid.ids + "&filter=" + JSON.stringify({formlabel : 'aravind'}) + "&order=" + JSON.stringify({orderby : 'formlabel', direction:'ASC'}) 
	});
	

	grid.load(gridURL, function() {
	    // data loaded on grid
	}, "json");
```
=======
### Generic dinamic table search for filtering data on DHTMLX combos

MAP API provides a exclusive end point which provides support to query any table on a database and search for data.

It is very useful when you need to implement generic DHTMLX combos with filtering

**End point address**

	/dhtmlx/combo/feed.xml
	
**Parameters**

	table_name
		The table name from where the End Point will return data
		mandatory
	
	primary_key
		The primary key name of the table
		mandatory
	
	column_to_search
		The column name from the table that you want to search on
		mandatory
	
	value_column
		the column name to be used as id for the combo options.
		not mandatory. default: primary key name


**Example of usage**

```javascript
	combo = new dhtmlXCombo("combo", "combo", 200);
	var combo_url = CAIRS.MAP.API.getMappedURL({
	    resource: "/dhtmlx/combo/feed",
	    responseType: "xml",
	    params: "column_to_search=name&table_name=emailmessages_templates&primary_key=template_id"
	});
	combo.enableFilteringMode(true, combo_url, true, true);
```


## Online examples

[Search contact using DHTMLX combo](http://cdmap01.myadoptionportal.com/modules/CAIRS_Framework/examples/contact_dhtmlx_combo_end_point.html?_enable_log=true)


[Generic end point for DHTMLX combos](http://cdmap01.myadoptionportal.com/modules/CAIRS_Framework/examples/generic_dhtmlx_combo_end_point.html?_enable_log=true)


### Authors and Contributors

Eduardo Almeida (@web2solutions)
