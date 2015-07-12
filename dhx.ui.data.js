/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject, AVD */


$dhx.ui.data = {};
$dhx.ui.data.model = {
    db: [],
    records: [],
    schema: [],
    settings: [],
	output_tables: []

    ,
    start: function(c) {
        //console.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', c)
        var self = $dhx.ui.data.model,
            onSuccess = c.onSuccess,
            onFail = c.onFail,
            db_name = c.db,
            version = c.version,
            schema = c.schema
        	settings = c.settings,
			output_tables = c.output_tables,
            records = c.records;


        self.schema[db_name] = schema;
        self.records[db_name] = records;
		self.output_tables[db_name] = output_tables;

        var enforced_settings = {};
        for (var table in schema) {
            if (schema.hasOwnProperty(table)) {
                enforced_settings[table] = {
                    form: {
                        template: []
                    }
                };

                var db_config = schema[table];
                var clone_columns = $dhx.toArray(db_config.columns);
                clone_columns.sort(function(a, b) {
                    return a.ordinal_position - b.ordinal_position;
                });

                clone_columns.forEach(function(column, index_, array_) {

                    enforced_settings[table].form.template.push($dhx.ui.helpers.column.toFormField(column));

                });
            }
        }
        self.settings[db_name] = enforced_settings;



        try {
            if ($dhx._enable_log) console.info('starting $dhx.ui.data.model');
            self.db[db_name] = new $dhx.dataDriver.database({
                db: db_name,
                version: version,
                schema: self.schema[db_name],
                settings: self.settings[db_name],
                records: self.records[db_name],
				output_tables: self.output_tables[db_name]

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
                    console.log(response.connection);
                    console.log(response.event);
                    console.log(response.message);
                }
            });
        } catch (e) {
            console.log("	>>> error when stating the model for ", db_name);
            console.log(e.stack);
            console.log(e.message);
            console.log(" >>>>>>>>>");
        }
    }
};
