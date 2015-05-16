# REST API RESTful client

The REST API RESTful client is a Javascript client which 
provides support to consume end points from REST RESTful API.

It means you will no longer use classical ajax calls 
to fetch content from REST API.

The basic features of the client are:

  * Provides an auth system for REST API
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



**Acessor namespace on $dhx fw**

	$dhx.REST.API

#### **$dhx.REST.API Methods**

###### *$dhx.REST.API.authorize( payload )*

	login into API and get authorization to consume content over API.

	Execute this method before trying to call the other methods

payload - JSON object

```javascript
	{
	   // a valid REST username
	   // mandatory
	   username: ''

	   // not implemented yet, works like a password
	   // mandatory for production branch only
	   ,api_key: ''

	   // Agency database name
	   // not mandatory. Default RESTTEST
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
	$dhx.REST.API.authorize({
	   onSuccess: function(request) {
		// display countdown for this logged user token expiration
		$dhx.REST.API.showCountDown("expiration_info");
	    },
	    onFail: function(request) {

	    }
	});
```

===========

###### *$dhx.REST.API.del( payload )*

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
	$dhx.REST.API.del(
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

###### *$dhx.REST.API.get( payload )*

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
	       	// generally, REST end points provides support to the following parameters:
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
	$dhx.REST.API.get({
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
	$dhx.REST.API.get({
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

###### *$dhx.REST.API.getMappedURL( configuration )*

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
	var gridURL = $dhx.REST.API.getMappedURL({
	        resource: "/LibraryFields",
	        responseType: "json",
	        params: "columns=" + self.model.conf_grid.ids + ""
	});

	console.log( gridURL );
	// https://apidev.myadoptionportal.com/LibraryFields.json?database=RESTTEST&token=f31a1770d51f06eccc3014204a50e182ff6494dc5f72ba85f6bc4256af64861e&columns=type,type_standard,name,label,caption,value,tooltip,text_size,required,use_library,library_field_id,className,mask_to_use&searchcriteria=2_Type

	myDhxGrid.load(gridURL, function () {
		// data loaded
	}, "json");
```

===========

###### *$dhx.REST.API.insert( payload )*

	an alias to $dhx.REST.API.post( payload );

===========

###### *$dhx.REST.API.list( payload )*

	an alias to $dhx.REST.API.get( payload );

===========

###### *$dhx.REST.API.post( payload )*

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

	$dhx.REST.API.post({
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

###### *$dhx.REST.API.put( payload )*

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

	$dhx.REST.API.put(
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

###### *$dhx.REST.API.showCountDown( HTML_element_ID )*

	Displays a expiration countdown for the token in use on a HTML element

===========

###### *$dhx.REST.API.update( payload )*

	an alias to $dhx.REST.API.put( payload );

================

#### **$dhx.REST.API Properties**

###### *$dhx.REST.API.agency_id*

	Stores the agency_id which is automatically passed as parameter on every end point HTTP call

	*This flag value is updated when you call REST.API.authorize()*

	**Please don´t directly assign a value to this property**

================

###### *$dhx.REST.API.auth_status*

	Stores a flag value in accordance with the login status.

	*This flag value is updated when you call REST.API.authorize()*

	**Please don´t directly assign a value to this property**

	values: disconnected / connected. Default disconnected.

================

###### *$dhx.REST.API.OS*

	Stores a flag value in accordance with what is the operational system where API is running
	it changes API environment settings when fetching end points.

	Change the flag value **before** calling  REST.API.authorize();

	values: linux / windows. Default linux.


================

###### *$dhx.REST.API.token*

	Stores a SHA256 token which will automatically passed as parameter on every end point HTTP call.
	Without a token you can't fetch end points

	*This flag value is updated when you call REST.API.authorize()*

	**Please don´t directly assign a value to this property**

================

###### *$dhx.REST.API.user*

	Stores the logged user first_name.

	When disconnected, it has the following value: nobody

	*This flag value is updated when you call REST.API.authorize()*

	**Please don´t directly assign a value to this property**

================

###### *$dhx.REST.API.database*

	Agency database name. This property value is setted inside the core in accordance with the payload
	provided when you call REST.API.authorize()

	Default RESTTEST

	*This flag value is updated when you call REST.API.authorize()*

	**Please don´t directly assign a value to this property**


================

###### *$dhx.REST.API.date_expiration*

	Stores the currently token life time in milliseconds.

	100% compatible to be used with new Date( $dhx.REST.API.date_expiration )

	*This flag value is updated when you call REST.API.authorize()*

	**Please don´t directly assign a value to this property**


================

###### *$dhx.environment*

	This propery is used to set/unset several features for development process.

	Regarding $dhx.REST.API requests, it defines on which API branch the RESTful requests will be performed

	values:

		production: http://api.dhtmlx.com.br

		dev: http://api.web2.eti.br:3000

		test: http://test.dhtmlx.com.br

================

### Authors and Contributors

Eduardo Almeida (@web2solutions)
