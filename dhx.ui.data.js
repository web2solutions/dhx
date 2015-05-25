/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject, dbDemo */


$dhx.ui.data = {};
$dhx.ui.data.model = {
	db: []
	,records : []
	,schema: []
	,settings: []
	
	,start : function( c ){
		//console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', c)
		var self = $dhx.ui.data.model,
			onSuccess = c.onSuccess, 
			onFail = c.onFail,
			db_name = c.db,
			version = c.version,
			schema = c.schema
			settings = c.settings,
			records = c.records;
		
		
		self.schema[ db_name ] = schema;
		self.records[ db_name ] = records;
		self.settings[ db_name ] = settings;
		try
		{
			if ($dhx._enable_log) console.warn('starting $dhx.ui.data.model');
			self.db[ db_name ] = new $dhx.dataDriver.database({
				db: db_name
				, version: version
				, schema: self.schema[ db_name ]
				, settings: self.settings[ db_name ]
				, records: self.records[ db_name ]
				
				// call all the times you connect into a database	
				, onConnect: function (response) {}
				
				// called all the times you create a table	
				, onCreate: function (response) { }
					
				// call when database is ready for working	
				, onReady: function (response) {
					if(onSuccess) onSuccess();
				}
				
				// called when there is error on connection
				, onFail: function (response) {
					console.log(response.connection);
					console.log(response.event);
					console.log(response.message);
				}
			});
		}
		catch(e)
		{
			console.log("	>>> error when stating the model for ", db_name);
			console.log(e.stack);
			console.log(e.message);
			console.log(" >>>>>>>>>");
		}
	}
};