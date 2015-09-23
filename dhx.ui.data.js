/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject, AVD */


$dhx.ui.data = {
	static : {
		br : {
			geo : {
				states : [{
					"name": "Rondônia",
					"abbreviation": "RO"
				}, {
					"name": "Acre",
					"abbreviation": "AC"
				}, {
					"name": "Amazonas",
					"abbreviation": "AM"
				}, {
					"name": "Roraima",
					"abbreviation": "RR"
				}, {
					"name": "Pará",
					"abbreviation": "PA"
				}, {
					"name": "Amapá",
					"abbreviation": "AP"
				}, {
					"name": "Tocantins",
					"abbreviation": "TO"
				}, {
					"name": "Maranhão",
					"abbreviation": "MA"
				}, {
					"name": "Piauí",
					"abbreviation": "PI"
				}, {
					"name": "Ceará",
					"abbreviation": "CE"
				}, {
					"name": "Rio Grande do Norte",
					"abbreviation": "RN"
				}, {
					"name": "Paraíba",
					"abbreviation": "PB"
				}, {
					"name": "Pernambuco",
					"abbreviation": "PE"
				}, {
					"name": "Alagoas",
					"abbreviation": "AL"
				}, {
					"name": "Sergipe",
					"abbreviation": "SE"
				}, {
					"name": "Bahia",
					"abbreviation": "BA"
				}, {
					"name": "Minas Gerais",
					"abbreviation": "MG"
				}, {
					"name": "Espírito Santo",
					"abbreviation": "ES"
				}, {
					"name": "Rio de Janeiro",
					"abbreviation": "RJ"
				}, {
					"name": "São Paulo",
					"abbreviation": "SP"
				}, {
					"name": "Paraná",
					"abbreviation": "PR"
				}, {
					"name": "Santa Catarina",
					"abbreviation": "SC"
				}, {
					"name": "Rio Grande do Sul",
					"abbreviation": "RS"
				}, {
					"name": "Mato Grosso do Sul",
					"abbreviation": "MS"
				}, {
					"name": "Mato Grosso",
					"abbreviation": "MT"
				}, {
					"name": "Goiás",
					"abbreviation": "GO"
				}, {
					"name": "Distrito Federal",
					"abbreviation": "DF"
				}]	
			}	
		}
		, us : {
			geo : {
				states : [{
					"name": "Alabama",
					"abbreviation": "AL"
				},
				{
					"name": "Alaska",
					"abbreviation": "AK"
				},
				{
					"name": "American Samoa",
					"abbreviation": "AS"
				},
				{
					"name": "Arizona",
					"abbreviation": "AZ"
				},
				{
					"name": "Arkansas",
					"abbreviation": "AR"
				},
				{
					"name": "California",
					"abbreviation": "CA"
				},
				{
					"name": "Colorado",
					"abbreviation": "CO"
				},
				{
					"name": "Connecticut",
					"abbreviation": "CT"
				},
				{
					"name": "Delaware",
					"abbreviation": "DE"
				},
				{
					"name": "District Of Columbia",
					"abbreviation": "DC"
				},
				{
					"name": "Federated States Of Micronesia",
					"abbreviation": "FM"
				},
				{
					"name": "Florida",
					"abbreviation": "FL"
				},
				{
					"name": "Georgia",
					"abbreviation": "GA"
				},
				{
					"name": "Guam",
					"abbreviation": "GU"
				},
				{
					"name": "Hawaii",
					"abbreviation": "HI"
				},
				{
					"name": "Idaho",
					"abbreviation": "ID"
				},
				{
					"name": "Illinois",
					"abbreviation": "IL"
				},
				{
					"name": "Indiana",
					"abbreviation": "IN"
				},
				{
					"name": "Iowa",
					"abbreviation": "IA"
				},
				{
					"name": "Kansas",
					"abbreviation": "KS"
				},
				{
					"name": "Kentucky",
					"abbreviation": "KY"
				},
				{
					"name": "Louisiana",
					"abbreviation": "LA"
				},
				{
					"name": "Maine",
					"abbreviation": "ME"
				},
				{
					"name": "Marshall Islands",
					"abbreviation": "MH"
				},
				{
					"name": "Maryland",
					"abbreviation": "MD"
				},
				{
					"name": "Massachusetts",
					"abbreviation": "MA"
				},
				{
					"name": "Michigan",
					"abbreviation": "MI"
				},
				{
					"name": "Minnesota",
					"abbreviation": "MN"
				},
				{
					"name": "Mississippi",
					"abbreviation": "MS"
				},
				{
					"name": "Missouri",
					"abbreviation": "MO"
				},
				{
					"name": "Montana",
					"abbreviation": "MT"
				},
				{
					"name": "Nebraska",
					"abbreviation": "NE"
				},
				{
					"name": "Nevada",
					"abbreviation": "NV"
				},
				{
					"name": "New Hampshire",
					"abbreviation": "NH"
				},
				{
					"name": "New Jersey",
					"abbreviation": "NJ"
				},
				{
					"name": "New Mexico",
					"abbreviation": "NM"
				},
				{
					"name": "New York",
					"abbreviation": "NY"
				},
				{
					"name": "North Carolina",
					"abbreviation": "NC"
				},
				{
					"name": "North Dakota",
					"abbreviation": "ND"
				},
				{
					"name": "Northern Mariana Islands",
					"abbreviation": "MP"
				},
				{
					"name": "Ohio",
					"abbreviation": "OH"
				},
				{
					"name": "Oklahoma",
					"abbreviation": "OK"
				},
				{
					"name": "Oregon",
					"abbreviation": "OR"
				},
				{
					"name": "Palau",
					"abbreviation": "PW"
				},
				{
					"name": "Pennsylvania",
					"abbreviation": "PA"
				},
				{
					"name": "Puerto Rico",
					"abbreviation": "PR"
				},
				{
					"name": "Rhode Island",
					"abbreviation": "RI"
				},
				{
					"name": "South Carolina",
					"abbreviation": "SC"
				},
				{
					"name": "South Dakota",
					"abbreviation": "SD"
				},
				{
					"name": "Tennessee",
					"abbreviation": "TN"
				},
				{
					"name": "Texas",
					"abbreviation": "TX"
				},
				{
					"name": "Utah",
					"abbreviation": "UT"
				},
				{
					"name": "Vermont",
					"abbreviation": "VT"
				},
				{
					"name": "Virgin Islands",
					"abbreviation": "VI"
				},
				{
					"name": "Virginia",
					"abbreviation": "VA"
				},
				{
					"name": "Washington",
					"abbreviation": "WA"
				},
				{
					"name": "West Virginia",
					"abbreviation": "WV"
				},
				{
					"name": "Wisconsin",
					"abbreviation": "WI"
				},
				{
					"name": "Wyoming",
					"abbreviation": "WY"
				}]	
			}	
		}	
	}
};

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
