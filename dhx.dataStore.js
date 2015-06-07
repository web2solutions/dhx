$dhx.dataStore = function (c) {
	var configuration = c;
	var self = this;
	if ($dhx.Browser.name == "Explorer") {
		if ($dhx.Browser.version < 9) {
			if ($dhx._enable_log) console.log("You need IE 9 or greater. ");
			dhtmlx.message({
				type: "error"
				, text: "You need IE 9 or greater."
			});
			self.showDirections("BROWSER_VERSION_OUT_TO_DATE");
			return;
		}
	}
	if ((typeof configuration.data_set_name === 'undefined') || (configuration.data_set_name.length === 0)) {
		dhtmlx.message({
			type: "error"
			, text: "data_set_name is missing when creating a dataset"
		});
		if (configuration.onFail) configuration.onFail("data_set_name is missing when creating a dataset");
		return;
	}
	if ((typeof configuration.primary_key === 'undefined') || (configuration.primary_key.length === 0)) {
		dhtmlx.message({
			type: "error"
			, text: "primary_key is missing when creating a dataset"
		});
		if (configuration.onFail) configuration.onFail("primary_key is missing when creating a dataset");
		return;
	}
	//console.log( extensions );
	try {
		/*api_service : {
			api_resource: ""
			,api_payload: ""
		} //default false */
		configuration.api_service = configuration.api_service || false;
		if (configuration.api_service) {
			configuration.api_service.end_point = configuration.api_service.end_point || false;
			configuration.api_service.get_colletion_end_point = configuration.api_service.get_colletion_end_point || ((configuration.api_service.end_point) ?
				configuration.api_service.end_point : false);
			configuration.api_service.get_end_point = configuration.api_service.get_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point :
				false);
			configuration.api_service.post_end_point = configuration.api_service.post_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point :
				false);
			configuration.api_service.put_end_point = configuration.api_service.put_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point :
				false);
			configuration.api_service.del_end_point = configuration.api_service.del_end_point || ((configuration.api_service.end_point) ? configuration.api_service.end_point :
				false);
			configuration.api_payload = configuration.api_payload || "";
		}
		if ((!configuration.api_service.get_colletion_end_point) && (!configuration.api_service.get_end_point) && (!configuration.api_service.post_end_point) && (!
				configuration.api_service.put_end_point) && (!configuration.api_service.del_end_point)) configuration.api_service = false;
		//if( $dhx._enable_log ) console.log( "--------------->>>>>>>>>>>>>>>>>>>>>>" );
		//if( $dhx._enable_log ) console.log( configuration.api_service );
		configuration.overwrite = configuration.overwrite || false;
		if (typeof configuration.data === 'undefined') configuration.data = []
		$dhx.isArray(configuration.data) ? configuration.data = configuration.data : configuration.data = [];
		configuration.sync = (configuration.sync && $dhx.isArray(configuration.sync) ? configuration.sync : []) || [];
		configuration.bind = (configuration.bind && $dhx.isArray(configuration.bind) ? configuration.bind : []) || [];
		configuration.cursorPosition = null;
		//if( configuration.data.length > 0 )
		//	configuration.cursorPosition = 0;
		configuration.onSuccess = configuration.onSuccess || false;
		configuration.onFail = configuration.onFail || false;
		if (typeof $dhx.jDBd.data_sets[configuration.data_set_name] !== 'undefined')
			if (configuration.overwrite != true) {
				dhtmlx.message({
					type: "error"
					, text: "the dataset" + configuration.data_set_name + " already exists. It was not overwrited."
				});
				if (configuration.onSuccess) configuration.onSuccess($dhx.jDBd.data_sets[configuration.data_set_name]);
				return;
			}
		if (configuration.api_service) {
			if ($dhx.REST.API.auth_status == "disconnected") {
				dhtmlx.message({
					type: "error"
					, text: "please login into REST.API before creating datasets"
				});
				if (configuration.onFail) configuration.onFail("please login into REST.API before creating datasets");
				return;
			}
			if (configuration.api_service.get_colletion_end_point) {
				configuration.api_service.api_payload = configuration.api_service.api_payload || "";
				if ($dhx._enable_log) console.time("fetch end point data");
				//console.line("fetch end point data");
				$dhx.REST.API.get({
					resource: configuration.api_service.get_colletion_end_point
					, format: "json"
					, payload: configuration.api_service.api_payload
					, onSuccess: function (request) {
						if ($dhx._enable_log) console.timeEnd("fetch end point data");
						//console.timelineEnd();
						var json = JSON.parse(request.response);
						if (json.status == "success") {
							$dhx.isArray(json[configuration.api_service.collection_name]) ? configuration.data = json[configuration.api_service.collection_name] : configuration
								.data = [];
							self._create();
						}
						else self._create();
					}
					, onFail: function (request) {
						//var json = JSON.parse( request.response );
						dhtmlx.message({
							type: "error"
							, text: request
						});
						self._create();
					}
				});
			}
			else self._create(configuration);
		}
		else self._create(configuration);
	}
	catch (e) {
		if (configuration.onFail) configuration.onFail(e.stack);
	};
	this._create = function () {
		var self = $dhx.jDBd;
		if ($dhx._enable_log) console.time("create dataset " + c.data_set_name);
		// ASC sort data via primary key
		if ($dhx._enable_log) console.time("sorting dataset " + configuration.data_set_name);
		c.data.sort(function (a, b) {
			return a[configuration.primary_key] - b[configuration.primary_key];
		});
		if ($dhx._enable_log) console.timeEnd("sorting dataset " + configuration.data_set_name);
		//if( $dhx._enable_log ) console.log("----------------------------");
		//if( $dhx._enable_log ) console.log(configuration.data);
		$dhx.jDBdStorage.storeObject(configuration.data_set_name + ".data", c.data);
		if ($dhx._enable_log) console.time("self.data_sets " + configuration.data_set_name);
		// create dataset
		self.data_sets[configuration.data_set_name] = {
			data_set_name: configuration.data_set_name
			, primary_key: c.primary_key, //data: c.data,
			api_service: c.api_service
			, onSuccess: c.onSuccess
			, onFail: c.onFail
			, _synced_components: []
			, _bound_components: []
		};
		if ($dhx._enable_log) console.timeEnd("self.data_sets " + configuration.data_set_name);
		if ($dhx._enable_log) console.time("define properties for " + configuration.data_set_name);
		Object.defineProperty(self.data_sets[configuration.data_set_name], "data", {
			get: function () {
				//if( $dhx._enable_log ) console.log("got");
				//if( $dhx._enable_log ) console.log($dhx.jDBdStorage.get( configuration.data_set_name + ".data" ));
				return $dhx.jDBdStorage.get(configuration.data_set_name + ".data");
			}
			, set: function (value) {
				$dhx.jDBdStorage.saveDatabase(configuration.data_set_name + ".data", value);
			}
		});
		Object.defineProperty(this, "data", {
			get: function () {
				//console.log( 11111111 );
				return $dhx.jDBdStorage.get(configuration.data_set_name + ".data");
			}
		});
		if ($dhx._enable_log) console.timeEnd("define properties for " + configuration.data_set_name);
		if ($dhx._enable_log) console.timeEnd("create dataset " + configuration.data_set_name);
		if ($dhx._enable_log) console.time("execute onSuccess callback function");
		if (c.onSuccess) c.onSuccess(self.data_sets[c.data_set_name]);
		if ($dhx._enable_log) console.timeEnd("execute onSuccess callback function");
	};
	this.sync = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.sync(c);
	}
	this.bind = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.bind(c);
	}
	this.unbind = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.unbind(c);
	}
	this.insert = function (c, index) {
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.insert(c, index);
	}
	this.update = function (c) {
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.update(c);
	}
	this.del = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.del(c);
	}
	this.get = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.get(c);
	}
	this.getCurrentRecord = function (c) {
			c["data_set_name"] = configuration.data_set_name;
			return $dhx.jDBd.getCurrentRecord(c);
		}
		//deleteCurrentRecord
	this.deleteCurrentRecord = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.deleteCurrentRecord(c);
	}
	this.getCursor = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.getCursor(c);
	}
	this.getDataForGrid = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.getDataForGrid(c);
	}
	this.getRecord = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.getRecord(c);
	}
	this.setCursor = function (c) {
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.setCursor(c);
	}
	this.item = function (c) {
		c["data_set_name"] = configuration.data_set_name;
		c["record_id"] = c.record_id;
		return $dhx.jDBd.getRecord(c);
	}
	this.dataCount = function (c) {
		//return this.data.length;
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.dataCount(c);
	}
	this.exists = function (c) {
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.exists(c);
	}
	this.filter = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.filter(c);
	}
	this.first = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.first(c);
	}
	this.idByIndex = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.idByIndex(c);
	}
	this.indexById = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.indexById(c);
	}
	this.last = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.last(c);
	}
	this.next = function (c) {
			c = c || {};
			c["data_set_name"] = configuration.data_set_name;
			return $dhx.jDBd.next(c);
		}
		/*this.parse = function( c ) {
			c = c || {};
			c["data_set_name"] = configuration.data_set_name;
			return $dhx.jDBd.parse( c );
		}*/
	this.previous = function (c) {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.previous(c);
	}
	this.remove = function (c) {
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.del(c);
	}
	this.add = function (c, index) {
		c["data_set_name"] = configuration.data_set_name;
		$dhx.jDBd.insert(c, index);
	}
	this.sort = function () {
		c = c || {};
		c["data_set_name"] = configuration.data_set_name;
		return $dhx.jDBd.sort(c);
	}
}