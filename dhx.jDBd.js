$dhx.jDBd = {
	data_sets: {} // store arrays
	/*
			c = {
				data_set_name : ""	// mandatory
				,data : []	// not mandatory default []
				,primary_key : ""	// mandatory

				api_service : {
					end_point : "" // default API end point, use it when all end points for this dataset are equal
					,get_colletion_end_point: ""
					,get_end_point: ""
					,post_end_point: ""
					,put_end_point: ""
					,del_end_point: ""
					,api_payload: ""
					,collection_name: ""
				}	// not mandatory default false

				,onSuccess: function(){	// not mandatory default false
				,onFail: function(){}	// not mandatory default false
				,sync : []	// not mandatory default []
				,bind : []	// not mandatory default []
				,overwrite : false	// not mandatory default false
			}
	*/
	
	, create: function (c) {
		var self = $dhx.jDBd;
		if ($dhx.Browser.name == "Explorer") {
			if ($dhx.Browser.version < 9) {
				console.log("You need IE 9 or greater. ");
				dhtmlx.message({
					type: "error"
					, text: "You need IE 9 or greater."
				});
				self.showDirections("BROWSER_VERSION_OUT_TO_DATE");
				return;
			}
		}
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when creating a dataset"
			});
			if (c.onFail) c.onFail("data_set_name is missing when creating a dataset");
			return;
		}
		if ((typeof c.primary_key === 'undefined') || (c.primary_key.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "primary_key is missing when creating a dataset"
			});
			if (c.onFail) c.onFail("primary_key is missing when creating a dataset");
			return;
		}
		try {
			/*api_service : {
				api_resource: ""
				,api_payload: ""
			} //default false */
			c.api_service = c.api_service || false;
			if (c.api_service) {
				c.api_service.end_point = c.api_service.end_point || false;
				c.api_service.get_colletion_end_point = c.api_service.get_colletion_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
				c.api_service.get_end_point = c.api_service.get_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
				c.api_service.post_end_point = c.api_service.post_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
				c.api_service.put_end_point = c.api_service.put_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
				c.api_service.del_end_point = c.api_service.del_end_point || ((c.api_service.end_point) ? c.api_service.end_point : false);
				c.api_payload = c.api_payload || "";
			}
			if ((!c.api_service.get_colletion_end_point) && (!c.api_service.get_end_point) && (!c.api_service.post_end_point) && (!c.api_service.put_end_point) && (!c
					.api_service.del_end_point)) c.api_service = false;
			//console.log( "--------------->>>>>>>>>>>>>>>>>>>>>>" );
			//console.log( c.api_service );
			c.overwrite = c.overwrite || false;
			if (typeof c.data === 'undefined') c.data = []
			$dhx.isArray(c.data) ? c.data = c.data : c.data = [];
			c.sync = (c.sync && $dhx.isArray(c.sync) ? c.sync : []) || [];
			c.bind = (c.bind && $dhx.isArray(c.bind) ? c.bind : []) || [];
			c.cursorPosition = null;
			//if( c.data.length > 0 )
			//	c.cursorPosition = 0;
			c.onSuccess = c.onSuccess || false;
			c.onFail = c.onFail || false;
			if (typeof $dhx.jDBd.data_sets[c.data_set_name] !== 'undefined')
				if (c.overwrite != true) {
					dhtmlx.message({
						type: "error"
						, text: "the dataset" + c.data_set_name + " already exists. It was not overwrited."
					});
					if (c.onSuccess) c.onSuccess(self.data_sets[c.data_set_name]);
					return;
				}
			if (c.api_service) {
				if ($dhx.REST.API.auth_status == "disconnected") {
					dhtmlx.message({
						type: "error"
						, text: "please login into REST.API before creating datasets"
					});
					if (c.onFail) c.onFail("please login into REST.API before creating datasets");
					return;
				}
				if (c.api_service.get_colletion_end_point) {
					c.api_service.api_payload = c.api_service.api_payload || "";
					$dhx.REST.API.get({
						resource: c.api_service.get_colletion_end_point
						, format: "json"
						, payload: c.api_service.api_payload
						, onSuccess: function (request) {
							var json = JSON.parse(request.response);
							if (json.status == "success") {
								$dhx.isArray(json[c.api_service.collection_name]) ? c.data = json[c.api_service.collection_name] : c.data = [];
								self._create(c);
							}
							else self._create(c);
						}
						, onFail: function (request) {
							//var json = JSON.parse( request.response );
							dhtmlx.message({
								type: "error"
								, text: request
							});
							self._create(c);
						}
					});
				}
				else self._create(c);
			}
			else self._create(c);
		}
		catch (e) {
			if (c.onFail) c.onFail(e.stack);
			console.log(e.stack);
		}
	}
	, _create: function (c) {
			var self = $dhx.jDBd;
			// ASC sort data via primary key
			c.data.sort(function (a, b) {
				return a[c.primary_key] - b[c.primary_key];
			});
			//console.log("----------------------------");
			//console.log(c.data);
			$dhx.jDBdStorage.storeObject(c.data_set_name + ".data", c.data);
			// create dataset
			self.data_sets[c.data_set_name] = {
				data_set_name: c.data_set_name
				, primary_key: c.primary_key
					//,data : c.data
				
				, api_service: c.api_service
				, onSuccess: c.onSuccess
				, onFail: c.onFail
				, _synced_components: []
				, _bound_components: []
			};
			Object.defineProperty(self.data_sets[c.data_set_name], "data", {
				get: function () {
					//console.log("got");
					//console.log(c.data_set_name);
					//console.log($dhx.jDBdStorage.get( c.data_set_name + ".data" ));
					return $dhx.jDBdStorage.get(c.data_set_name + ".data");
				}
				, set: function (value) {
					$dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", value);
				}
			});
			//console.log("syncing and binding from start");
			// sync components provided on the dataset settings
			c.sync.forEach(function (component, index, array) {
				//console.log(component);
				self.sync({
					data_set_name: c.data_set_name // mandatory
					
					, component: component // mandatory
				});
			});
			// bind components provided on the dataset settings
			c.bind.forEach(function (component, index, array) {
				//console.log(component);
				self.bind({
					data_set_name: c.data_set_name // mandatory
					
					, component: component // mandatory
				});
			});
			//console.log( "created" );
			if (c.onSuccess) c.onSuccess(self.data_sets[c.data_set_name]);
		}
		/*
			// bind form
              $dhx.jDBd.unbind({
					data_set_name: "emailmessages_templates" // mandatory
					,component: form // mandatory
					,component_id: "form" // mandatory
				});

			*/
	
	, unbind: function (c) {
			var self = $dhx.jDBd
				, bound = false
				, already_pushed_to_bound_list = false;
			/* c = { data_set_name : "", component : dhtmlxComponentObject, component_id : "", filter : {} }*/
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when creating a dataset"
				});
				return false;
			}
			if ((typeof c.component === 'undefined')) {
				dhtmlx.message({
					type: "error"
					, text: "component is missing when syncing"
				});
				return false;
			}
			if (!$dhx.isObject(c.component)) {
				dhtmlx.message({
					type: "error"
					, text: "component is not an object"
				});
				return false;
			}
			if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
				if ($dhx._enable_log) console.log("called unbind for: " + c.component_id);
				if (typeof c.component_id === 'undefined') {
					dhtmlx.message({
						type: "error"
						, text: "component_id was not set"
					});
					return false;
				}
				self.data_sets[c.data_set_name]._bound_components.forEach(function (hash, index, array) {
					if (hash.component_id == c.component_id) {
						self.data_sets[c.data_set_name]._bound_components.splice(index, 1);
					}
				});
				//if( $dhx._enable_log ) console.log("XXXXXXX end interating over bound components");
				return true;
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "dataset " + c.data_set_name + " not found"
				});
				return false;
			}
		}
		/*
			// bind form
              $dhx.jDBd.bind({
					data_set_name: "emailmessages_templates" // mandatory
					,component: form // mandatory
					,component_id: "form" // mandatory
					,api_service: {
						post_end_point: "/emailmessages/templates" // not mandatory, default false
						,put_end_point: "/emailmessages/templates" // not mandatory, default false
						,del_end_point: "/emailmessages/templates" // not mandatory, default false
						,api_payload : "company_id=25"	//
					} // not mandatory, default false / use if necessary

				});

			*/
	
	, bind: function (c) {
		var self = $dhx.jDBd
			, bound = false
			, already_pushed_to_bound_list = false;
		/* c = { data_set_name : "", component : dhtmlxComponentObject, component_id : "", filter : {} }*/
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when creating a dataset"
			});
			return false;
		}
		if ((typeof c.component === 'undefined')) {
			dhtmlx.message({
				type: "error"
				, text: "component is missing when syncing"
			});
			return false;
		}
		if (!$dhx.isObject(c.component)) {
			dhtmlx.message({
				type: "error"
				, text: "component is not an object"
			});
			return false;
		}
		if (c.api_service) {
			// bound component doesnt fetch multiple records
			//c.api_service.get_colletion_end_point = c.api_service.get_colletion_end_point || false;
			c.api_service.get_end_point = c.api_service.get_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
				.end_point : false);
			c.api_service.post_end_point = c.api_service.post_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
				.end_point : false);
			c.api_service.put_end_point = c.api_service.put_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
				.end_point : false);
			c.api_service.del_end_point = c.api_service.del_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
				.end_point : false);
			c.api_service.api_payload = c.api_service.api_payload || "";
		}
		if (!c.api_service)
			if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
		if (c.api_service)
			if ((!c.api_service.get_end_point) && (!c.api_service.post_end_point) && (!c.api_service.put_end_point) && (!c.api_service.del_end_point)) c.api_service =
				false;
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			if ($dhx._enable_log) console.log("called bind for: " + c.component_id);
			if (typeof c.component_id === 'undefined') {
				dhtmlx.message({
					type: "error"
					, text: "component_id was not set"
				});
				return false;
			}
			self.data_sets[c.data_set_name]._bound_components.forEach(function (hash, index, array) {
				if (hash.component_id == c.component_id) {
					if ($dhx._enable_log) console.log(hash.component_id + " object already exist on memory, overwriting");
					//already_pushed_to_bound_list = true;
					self.data_sets[c.data_set_name]._bound_components.splice(index, 1);
				}
			});
			c.$init = c.$init || false;
			if ($dhx._enable_log) console.log("pushing: " + c.component_id);
			self.data_sets[c.data_set_name]._bound_components.push({
				component_id: c.component_id
				, component: c.component
				, $init: c.$init
			});
			//if( $dhx._enable_log ) console.log("XXXXXXX begin interating over bound components");
			self.data_sets[c.data_set_name]._bound_components.forEach(function (hash, index, array) {
				if (hash.component_id == c.component_id) {
					var component = hash.component;
					//if( $dhx._enable_log ) console.log(component);
					if (typeof component.mytype !== 'undefined') {
						if ($dhx._enable_log) console.log("tree can not be bound");
						//if( $dhx._enable_log ) console.log(component.mytype);
					}
					if (typeof component.isTreeGrid !== 'undefined') {
						if ($dhx._enable_log) console.log("grid can not be bound");
						//if( $dhx._enable_log ) console.log(component.isTreeGrid);
					}
					if (typeof component._changeFormId !== 'undefined') {
						if ($dhx._enable_log) console.log("this component is a form");
						if (self.data_sets[c.data_set_name].cursorPosition != null) {
							var record = self.getCurrentRecord({
								data_set_name: c.data_set_name
							});
							var obj = {};
							for (i in record)
								if (record.hasOwnProperty(i)) {
									if (i != 'id') obj[i] = record[i]
								}
							if (c.$init) c.$init(obj);
							component.setFormData(obj);
						}
						component.api_service = c.api_service;
						component.attachEvent("onButtonClick", function (name) {
							if (name == "x_special_button_save") component.save();
							else if (name == "x_special_button_update") component.update();
							else if (name == "x_special_button_delete") component.erase();
						});
						component.save = function (hash, onSuccess, onFail) {
							console.log(">>>>>>>>>>>>>>>>> save");
							console.log(arguments);
							self._bound_form_save(c, component, hash, onSuccess, onFail);
						}
						component.update = function (hash, onSuccess, onFail) {
							console.log(">>>>>>>>>>>>>>>>> update");
							console.log(arguments);
							self._bound_form_update(c, component, hash, onSuccess, onFail);
						}
						component.erase = function (hash, onSuccess, onFail) {
							self._bound_form_delete(c, component, hash, onSuccess, onFail);
						}
						component.del = function (hash, onSuccess, onFail) {
							self._bound_form_delete(c, component, hash, onSuccess, onFail);
						}
						bound = true;
					}
				}
			});
			//if( $dhx._enable_log ) console.log("XXXXXXX end interating over bound components");
			return bound;
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			return false;
		}
	}
	, _bound_form_save: function (c, component, hash, onSuccess, onFail) {
		var self = $dhx.jDBd;
		// send hash properties shall to follow the same name sequences from grid columns names
		hash = hash || component.getFormData();
		onSuccess = onSuccess || false;
		onFail = onFail || false;
		if (c.api_service.api_payload.length > 0) c.api_service.api_payload = c.api_service.api_payload + "&"
		var data = [];
		//if( $dhx._enable_log ) console.log( hash );
		//if( $dhx._enable_log ) console.log( hash["data"] );
		// this is necessary when you directly call $dhx.jDBd.insert()
		// necessary for when bound forms sends a payload without or with old data collection
		//delete hash["data"];
		for (i in hash)
			if (hash.hasOwnProperty(i)) {
				console.log(i);
				if (i != "data" && i != self.data_sets[c.data_set_name].primary_key) {
					if ($dhx._enable_log) console.log(i);
					data.push(hash[i]);
				}
			}
			//hash["data"] = data;
			// this is necessary when you directly call $dhx.jDBd.insert()
		delete hash[self.data_sets[c.data_set_name].primary_key];
		delete hash['data'];
		//delete hash['id']; // grid id
		//delete hash['xxx'];
		if ($dhx._enable_log) console.log(hash);
		component.lock();
		//console.log( c.api_service );
		console.log(c.api_service.api_payload);
		console.log(c.api_service.api_payload + "hash=" + JSON.stringify(hash));
		//console.log( c.api_service );
		$dhx.jDBd.insert({
			data_set_name: c.data_set_name
			, record: hash
			, api_resource: c.api_service.post_end_point
			, api_payload: c.api_service.api_payload + "hash=" + JSON.stringify(hash)
			, onSuccess: function (record_id) {
				dhtmlx.message({
					text: "data saved"
				});
				component.unlock();
				(onSuccess) ? onSuccess(): "";
			}
			, onFail: function (response) {
				dhtmlx.message({
					type: "error"
					, text: "data was not saved"
				});
				component.unlock();
				(onFail) ? onFail(): "";
			}
		});
	}
	, _bound_form_update: function (c, component, hash, onSuccess, onFail) {
		var self = $dhx.jDBd;
		hash = hash || component.getFormData();
		onSuccess = onSuccess || false;
		onFail = onFail || false;
		if (c.api_service.api_payload.length > 0) c.api_service.api_payload = c.api_service.api_payload + "&"
		if ($dhx._enable_log) console.log(component.api_service.api_payload + "hash=" + JSON.stringify(hash));
		component.lock();
		console.log('================== _bound_form_update');
		console.log('hash', hash);
		$dhx.jDBd.update({
			data_set_name: c.data_set_name
			, record: hash
			, record_id: hash[self.data_sets[c.data_set_name].primary_key]
			, api_resource: component.api_service.post_end_point + "/" + hash[self.data_sets[c.data_set_name].primary_key]
			, api_payload: component.api_service.api_payload + "hash=" + JSON.stringify(hash)
			, onSuccess: function (record_id) {
				dhtmlx.message({
					text: "data updated"
				});
				component.unlock();
				(onSuccess) ? onSuccess(): "";
			}
			, onFail: function (response) {
				dhtmlx.message({
					type: "error"
					, text: "data was not updated"
				});
				component.unlock();
				(onFail) ? onFail(): "";
			}
		});
	}
	, _bound_form_delete: function (c, component, hash, onSuccess, onFail) {
		var self = $dhx.jDBd;
		hash = hash || component.getFormData();
		onSuccess = onSuccess || false;
		onFail = onFail || false
		component.lock();
		$dhx.jDBd.del({
			data_set_name: c.data_set_name
			, record_id: hash[self.data_sets[c.data_set_name].primary_key]
			, api_resource: component.api_service.post_end_point + "/" + hash[self.data_sets[c.data_set_name].primary_key]
			, onSuccess: function (record_id) {
				dhtmlx.message({
					text: "data deleted"
				});
				component.unlock();
				(onSuccess) ? onSuccess(): "";
			}
			, onFail: function (response) {
				dhtmlx.message({
					type: "error"
					, text: "data was not deleted"
				});
				component.unlock();
				(onFail) ? onFail(): "";
			}
		});
	}
	, deleteCurrentRecord: function (c) {
		var self = $dhx.jDBd;
		var onSuccess = c.onSuccess || false;
		var onFail = c.onFail || false
		var live = true;
		if (c.live == false) live = false;
		$dhx.showDirections("trying to delete ... ");
		$dhx.jDBd.del({
			data_set_name: c.data_set_name
			, record_id: self.getCursor({
				data_set_name: c.data_set_name
			})
			, live: live
			, onSuccess: function (record_id) {
				dhtmlx.message({
					text: "data deleted"
				});
				$dhx.hideDirections();
				(onSuccess) ? onSuccess(): "";
			}
			, onFail: function (response) {
				dhtmlx.message({
					type: "error"
					, text: "data was not deleted"
				});
				$dhx.hideDirections();
				(onFail) ? onFail(): "";
			}
		});
	}
	, sync: function (c) {
			var self = $dhx.jDBd
				, synced = false
				, already_pushed_to_synced_list = false;
			/* c = { data_set_name : "", component : dhtmlxComponentObject, component_id : "", filter : {}, order : {} }*/
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when creating a dataset"
				});
				if (c.onFail) c.onFail("data_set_name is missing when creating a dataset");
				return false;
			}
			if ((typeof c.component === 'undefined')) {
				dhtmlx.message({
					type: "error"
					, text: "component is missing when syncing"
				});
				if (c.onFail) c.onFail("component is missing when syncing");
				return false;
			}
			if (!$dhx.isObject(c.component)) {
				dhtmlx.message({
					type: "error"
					, text: "component is not an object"
				});
				if (c.onFail) c.onFail("component is not an object");
				return false;
			}
			if (c.api_service) {
				// bound component doesnt fetch multiple records
				//c.api_service.get_colletion_end_point = c.api_service.get_colletion_end_point || false;
				c.api_service.get_end_point = c.api_service.get_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
					.end_point : false);
				c.api_service.post_end_point = c.api_service.post_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
					.end_point : false);
				c.api_service.put_end_point = c.api_service.put_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
					.end_point : false);
				c.api_service.del_end_point = c.api_service.del_end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
					.end_point : false);
				c.api_service.api_payload = c.api_service.api_payload || "";
			}
			if (!c.api_service)
				if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
			if (c.api_service)
				if ((!c.api_service.get_end_point) && (!c.api_service.post_end_point) && (!c.api_service.put_end_point) && (!c.api_service.del_end_point)) c.api_service =
					false;
			if ((typeof c.filter === 'undefined')) c.filter = false;
			if (!$dhx.isObject(c.filter)) c.filter = false;
			if ((typeof c.order === 'undefined')) c.order = false;
			if (!$dhx.isObject(c.order)) c.order = false;
			c.$init = c.$init || false;
			if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
				if ($dhx._enable_log) console.log("called sync for: " + c.component_id);
				if (typeof c.component_id === 'undefined') {
					dhtmlx.message({
						type: "error"
						, text: "component_id was not set"
					});
					if (c.onFail) c.onFail("component_id was not set");
					return false;
				}
				self.data_sets[c.data_set_name]._synced_components.forEach(function (hash, index, array) {
					if (hash.component_id == c.component_id) {
						if ($dhx._enable_log) console.log(hash.component_id + " object already exist on memory, overwriting");
						//already_pushed_to_synced_list = true;
						self.data_sets[c.data_set_name]._synced_components.splice(index, 1);
					}
				});
				if ($dhx._enable_log) console.log("pushing: " + c.component_id);
				var component_settings = {
					component_id: c.component_id
					, component: c.component
				};
				if (typeof c.$init === 'function') {
					component_settings["$init"] = c.$init;
				}
				self.data_sets[c.data_set_name]._synced_components.push(component_settings);
				//c.$init( obj );
				//if( $dhx._enable_log ) console.log("XXXXXXX begin interating over synced components");
				self.data_sets[c.data_set_name]._synced_components.forEach(function (hash, index, array) {
					if (hash.component_id == c.component_id) {
						var component = hash.component;
						//if( $dhx._enable_log ) console.log("XXXXX>>>>>>>>>>>>>>>>>>>>>>>>");
						//if( $dhx._enable_log ) console.log(component);
						if (typeof component.mytype !== 'undefined') {
							//if( $dhx._enable_log ) console.log( "this component is a tree" );
							if (c.onFail) c.onFail("tree can not be synced");
							synced = false;
						}
						else if (typeof component._selOption !== 'undefined') {
							if ($dhx._enable_log) console.log("this component is a combo");
							component.clearAll(true);
							var records = [];
							self.data_sets[c.data_set_name].data.forEach(function (record, index_row, array_row) {
								// lets create a copy of the object, avoiding changes on the original referenced record ( js is mutable)
								var obj = {};
								for (i in record)
									if (record.hasOwnProperty(i)) obj[i] = record[i];
								if (c.$init) c.$init(obj);
								records.push([obj.value, obj.text]);
							});
							component.addOption(records);
							if (c.onSuccess) c.onSuccess();
							synced = true;
						}
						else if (typeof component.isTreeGrid !== 'undefined') {
							if ($dhx._enable_log) console.log("this component is a grid");
							component.clearAll();
							component.api_service = c.api_service;
							component.attachEvent("onXLS", function (grid_obj) {});
							component.attachEvent("onXLE", function (grid_obj) {
								if (c.onSuccess) c.onSuccess();
							});
							if (component.saveOnEdit) {
								component.attachEvent("onEditCell", function (stage, rId, cInd, nValue, oValue) {
									if (stage == 0) {
										// format and mask here
										return true;
									}
									else if (stage == 1) {
										return true;
									}
									else if (stage == 2) {
										if (nValue != oValue) {
											//$dhx.showDirections("saving data ... ");
											component.setRowTextBold(rId);
											var hash = {};
											hash[component.getColumnId(cInd)] = nValue;
											$dhx.jDBd.update({
												data_set_name: c.data_set_name
												, record: hash
												, record_id: self.getCursor({
													data_set_name: c.data_set_name
												})
												, api_resource: component.api_service.post_end_point + "/" + hash[self.data_sets[c.data_set_name].primary_key]
												, api_payload: component.api_service.api_payload + "&hash=" + JSON.stringify(hash)
												, onSuccess: function (record_id) {
													dhtmlx.message({
														text: "data updated"
													});
													//component.unlock();
													component.cells(rId, cInd).setValue(nValue);
													component.setRowTextNormal(rId);
													//$dhx.hideDirections();
													(c.onSuccess) ? c.onSuccess(): "";
													return true
												}
												, onFail: function (response) {
													dhtmlx.message({
														type: "error"
														, text: "data was not updated"
													});
													//component.unlock();
													component.cells(rId, cInd).setValue(oValue);
													component.setRowTextNormal(rId);
													//$dhx.hideDirections();
													(c.onFail) ? c.onFail(): "";
													return true;
												}
											});
										}
										return true;
									}
								});
							}
							//console.log( self.getDataForGrid({ data_set_name :c.data_set_name, filter : c.filter, $init : c.$init }) );
							component.parse(self.getDataForGrid({
								data_set_name: c.data_set_name
								, filter: c.filter
								, $init: c.$init
							}), "json");
							//if( $dhx._enable_log ) //console.log( self.getDataForGrid({ data_set_name: c.data_set_name, filter : c.filter }) );
							/*if( self.data_sets[ c.data_set_name ].data.length > 0 )
								self.setCursor({ data_set_name : c.data_set_name, position : 0});
							else
								self.setCursor({ data_set_name : c.data_set_name, position : null});
							*/
							synced = true;
						}
						else if (typeof component._changeFormId !== 'undefined') {
							//if( $dhx._enable_log ) console.log( "form can not be synced" );
							if (c.onFail) c.onFail("form can not be synced");
							synced = false;
						}
						else {
							if (c.onFail) c.onFail("unknow component when syncing");
						}
					}
				});
				//if( $dhx._enable_log ) console.log("XXXXXXX end interating over synced components");
				return synced;
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "dataset " + c.data_set_name + " not found"
				});
				if (c.onFail) c.onFail("dataset " + c.data_set_name + " not found");
				return false;
			}
		}
		/*
				c = {
					data_set_name : ""
					,filter : {
						property_name1 : property_value1
						,property_name2 : property_value2
					}
					,order : {

					}
				}
		*/
	
	, getDataForGrid: function (c) {
		if ($dhx._enable_log) console.time("filter dataset");
		var self = $dhx.jDBd
			, rows = []
			, c = c || {};
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when creating a dataset"
			});
			return;
		}
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') self.data_sets[c.data_set_name].data.forEach(function (row, index, array) {
			if (c.filter) {
				if (typeof c.filter.length === 'undefined') {
					var matches = false;
					for (property in c.filter) {
						if (c.filter.hasOwnProperty(property)) {
							if (row[property] == c.filter[property]) matches = true;
						}
					}
					if (matches) {
						var obj = {};
						for (i in row)
							if (row.hasOwnProperty(i)) obj[i] = row[i];
						if (c.$init) c.$init(obj);
						rows.push({
							id: obj[self.data_sets[c.data_set_name].primary_key]
							, data: obj.data
						});
					}
				}
				else if (c.filter.length == 2) {
					var matches = false;
					if (typeof c.filter[0] !== 'undefined' && typeof c.filter[1] !== 'undefined') {
						if ($dhx.isFunction(c.filter[0])) {
							matches = c.filter[0](row, c.filter[1]);
						}
					}
					if (matches) {
						var obj = {};
						for (i in row)
							if (row.hasOwnProperty(i)) obj[i] = row[i];
						if (c.$init) c.$init(obj);
						rows.push({
							id: obj[self.data_sets[c.data_set_name].primary_key]
							, data: obj.data
						});
					}
				}
				else {
					var obj = {};
					for (i in row)
						if (row.hasOwnProperty(i)) obj[i] = row[i];
					if (c.$init) c.$init(obj);
					rows.push({
						id: obj[self.data_sets[c.data_set_name].primary_key]
						, data: obj.data
					});
				}
			}
			else {
				var obj = {};
				for (i in row)
					if (row.hasOwnProperty(i)) obj[i] = row[i];
				if (c.$init) c.$init(obj);
				rows.push({
					id: obj[self.data_sets[c.data_set_name].primary_key]
					, data: obj.data
				});
			}
		});
		if ($dhx._enable_log) console.timeEnd("filter dataset");
		return {
			rows: rows
		};
	}
	, get: function (c) {
			var self = $dhx.jDBd;
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when creating a dataset"
				});
				return;
			}
			//if( $dhx._enable_log ) console.log( self.data_sets );
			//if( $dhx._enable_log ) console.log( c.data_set_name );
			if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
				return self.data_sets[c.data_set_name].data;
			}
			else return [];
		}
		/*
				c = {
					data_set_name : "",
					record_id : "",
					primary_key : "" // optional
				}
		*/
	
	, getRecord: function (c) {
		var self = $dhx.jDBd
			, record = {}
			, index_found = -1;
		if ($dhx._enable_log) console.time("get record");
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when trying to get a record"
			});
			return;
		}
		if ((typeof c.record_id === 'undefined') || (c.record_id.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "record_id is missing when trying to get a record"
			});
			return;
		}
		//if( $dhx._enable_log ) console.log( self.data_sets );
		//if( $dhx._enable_log ) console.log( c.data_set_name );
		c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
		var data = self.data_sets[c.data_set_name].data;
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			for (var x = 0; x < data.length; x++) {
				var row = data[x];
				if (typeof row[c.primary_key] !== 'undefined')
					if (row[c.primary_key] == c.record_id) index_found = x;
			}
		}
		if ($dhx._enable_log) console.timeEnd("get record");
		if (index_found >= 0) {
			//if( $dhx._enable_log ) console.log( self.data_sets[ c.data_set_name ].data[ index_found ] );
			return data[index_found];
		}
		else return record;
	}
	, setCursor: function (c) {
		var self = $dhx.jDBd
			, changed = false;
		if ($dhx._enable_log) console.log('XXXXXXXXXXXXXXXXXXX');
		if ($dhx._enable_log) console.log('set cursor for: ', c.data_set_name);
		/* c = { data_set_name : "", position : 1}*/
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when creating a dataset"
			});
			return;
		}
		if (typeof c.position === 'undefined') {
			dhtmlx.message({
				type: "error"
				, text: "position is missing when creating a dataset"
			});
			return;
		}
		if (!$dhx.isNumber(c.position)) {
			dhtmlx.message({
				type: "error"
				, text: "cursor position shall to be a valid number"
			});
			return;
		}
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			self.data_sets[c.data_set_name].data.forEach(function (row, index, array) {
				if (row[self.data_sets[c.data_set_name].primary_key] == c.position) {
					if ($dhx._enable_log) console.log("cursor from " + c.data_set_name + " was changed to the " + c.position + " record");
					self.data_sets[c.data_set_name].cursorPosition = c.position;
					changed = true;
				}
			});
			if (!changed) {
				dhtmlx.message({
					type: "error"
					, text: "the dataset " + c.data_set_name + " has no index with value: " + c.position
				});
				return self.data_sets[c.data_set_name].cursorPosition;
			}
			else {
				self.data_sets[c.data_set_name]._bound_components.forEach(function (hash, index, array) {
					var component = hash.component;
					//if( $dhx._enable_log ) console.log(component);
					if (typeof component.mytype !== 'undefined') {
						//if( $dhx._enable_log ) console.log( "tree can not be bound" );
						//if( $dhx._enable_log ) console.log(component.mytype);
					}
					else if (typeof component.isTreeGrid !== 'undefined') {
						//if( $dhx._enable_log ) console.log( "grid can not be bound" );
						//if( $dhx._enable_log ) console.log(component.isTreeGrid);
					}
					else if (typeof component._changeFormId !== 'undefined') {
						if ($dhx._enable_log) console.log("setting cursor for the bound form " + hash.component_id);
						//if( $dhx._enable_log ) console.log( self.getCurrentRecord( { data_set_name : c.data_set_name } ) );
						var record = self.getCurrentRecord({
							data_set_name: c.data_set_name
						});
						var obj = {};
						for (i in record)
							if (record.hasOwnProperty(i)) obj[i] = record[i];
						if (hash.$init) hash.$init(obj);
						try {
							component.setFormData(obj);
						}
						catch (e) {
							console.warn('Phisycal component is not available. Did you unbind the destroeyd bound components?');
							//console.log(e.stack);
						}
					}
				});
				return self.data_sets[c.data_set_name].cursorPosition;
			}
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			return false;
		}
	}
	, getCursor: function (c) {
		var self = $dhx.jDBd;
		/* c = { data_set_name : ""}*/
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when creating a dataset"
			});
			return;
		}
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			return self.data_sets[c.data_set_name].cursorPosition;
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			return null;
		}
	}
	, getCurrentRecord: function (c) {
			var self = $dhx.jDBd
				, record = {}
				, index_found = false;
			//console.log("getCurrentRecord");
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when getting current record"
				});
				return;
			}
			if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
				c.primary_key = self.data_sets[c.data_set_name].primary_key;
				c.cursorPosition = self.data_sets[c.data_set_name].cursorPosition;
				if (c.cursorPosition == null) {
					//console.trance(self.getCurrentRecord);
					dhtmlx.message({
						type: "error"
						, text: "the cursor position was not set yet"
					});
					return record;
				}
				var data = self.data_sets[c.data_set_name].data;
				if (data.length > 0) {
					data.forEach(function (row, index, array) {
						if (row[self.data_sets[c.data_set_name].primary_key] == c.cursorPosition) {
							//if( $dhx._enable_log ) console.log( row );
							record = row;
							index_found = true;
						}
					});
					if (index_found) return record;
					else {
						dhtmlx.message({
							type: "error"
							, text: "record " + c.cursorPosition + " not found"
						});
						return record;
					}
				}
				else {
					dhtmlx.message({
						type: "error"
						, text: "this " + c.data_set_name + " dataset has no records"
					});
					return record;
				}
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "dataset " + c.data_set_name + " not found"
				});
				return record;
			}
		}
		/*        */
		/*
				c = {
					data_set_name : "",
					record_id : "",
					primary_key : "" // optional
				}
		*/
	
	, item: function (c) {
		var self = $dhx.jDBd;
		//console.log( "item" );
		return self.getRecord(c);
	}
	, dataCount: function (c) {
			var self = $dhx.jDBd;
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when deleting a dataset"
				});
				return;
			}
			return self.data_sets[c.data_set_name].data.length;
		}
		/*
				c = {
					data_set_name : "",
					record_id : "",
					primary_key : "" // optional
				}
		*/
	
	, exists: function (c) {
			var self = $dhx.jDBd
				, exist = false;
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing"
				});
				return;
			}
			if ((typeof c.record_id === 'undefined')) {
				dhtmlx.message({
					type: "error"
					, text: "record_id is missing"
				});
				return;
			}
			//if( $dhx._enable_log ) console.log( self.data_sets );
			//if( $dhx._enable_log ) console.log( c.data_set_name );
			if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
				c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
				var data = self.data_sets[c.data_set_name].data;
				for (var x = 0; x < data.length; x++) {
					var row = data[x];
					if (typeof row[c.primary_key] !== 'undefined')
						if (row[c.primary_key] == c.record_id) exist = true;
				}
			}
			return exist;
		}
		/*
				c = {
					data_set_name : "",
					param : []
				}
		*/
	
	, filter: function (c) {
		var self = $dhx.jDBd;
		if ($dhx._enable_log) console.log("filtering");
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing"
			});
			return;
		}
		if ((typeof c.filter === 'undefined')) {
			c.filter || false;
		}
		c.$init = c.$init || false;
		self.data_sets[c.data_set_name]._synced_components.forEach(function (hash, index_, array) {
			var component = hash.component;
			//if( $dhx._enable_log ) console.log(component);
			if (typeof component.mytype !== 'undefined') {
				if ($dhx._enable_log) console.log("this component is a tree");
			}
			else if (typeof component.isTreeGrid !== 'undefined') {
				if ($dhx._enable_log) console.log("this component is a grid");
				component.clearAll();
				var grid_data = self.getDataForGrid({
					data_set_name: c.data_set_name
					, filter: c.filter
					, $init: c.$init
				});
				component.parse(grid_data, "json");
				//self.data_sets[c.data_set_name].data
			}
			else if (typeof component._changeFormId !== 'undefined') {}
			else if (typeof component._selOption !== 'undefined') {
				if ($dhx._enable_log) console.log("this component is a combo");
			}
		});
		return "filtered";
	}
	, first: function (c) {
		var self = $dhx.jDBd
			, record = {};
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing getting first record"
			});
			return;
		}
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			var data = self.data_sets[c.data_set_name].data;
			if (data.length > 0) {
				c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
				return data[0][c.primary_key];
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "this " + c.data_set_name + " dataset has no records"
				});
				return record;
			}
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			return record;
		}
	}
	, idByIndex: function (c) {
		var self = $dhx.jDBd;
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when getting id by index"
			});
			return;
		}
		if ((typeof c.index === 'undefined')) {
			dhtmlx.message({
				type: "error"
				, text: "index is missing when getting id by index"
			});
			return;
		}
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			c.primary_key = self.data_sets[c.data_set_name].primary_key;
			var data = self.data_sets[c.data_set_name].data;
			if (data.length > 0) {
				if (typeof data[c.index] !== 'undefined')
					if (typeof data[c.index][self.data_sets[c.data_set_name].primary_key] !== 'undefined') return data[c.index][self.data_sets[c.data_set_name].primary_key];
					else return null;
				else return null;
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "this " + c.data_set_name + " dataset has no records"
				});
				return null;
			}
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			return null;
		}
	}
	, indexById: function (c) {
		var self = $dhx.jDBd
			, index_found = -1;
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when getting index by id"
			});
			return;
		}
		if ((typeof c.record_id === 'undefined')) {
			dhtmlx.message({
				type: "error"
				, text: "record_id is missing when getting index by id"
			});
			return;
		}
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			c.primary_key = self.data_sets[c.data_set_name].primary_key;
			var data = self.data_sets[c.data_set_name].data;
			if (data.length > 0) {
				data.forEach(function (row, index, array) {
					if (row[self.data_sets[c.data_set_name].primary_key] == c.record_id) {
						index_found = index;
					}
				});
				if (index_found > -1) return index_found;
				else {
					dhtmlx.message({
						type: "error"
						, text: "record " + c.record_id + " not found"
					});
					return null;
				}
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "this " + c.data_set_name + " dataset has no records"
				});
				return null;
			}
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			return null;
		}
	}
	, last: function (c) {
		var self = $dhx.jDBd
			, record = {};
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when getting last record"
			});
			return;
		}
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			var data = self.data_sets[c.data_set_name].data;
			if (data.length > 0) {
				c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
				return data[data.length - 1][c.primary_key];
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "this " + c.data_set_name + " dataset has no records"
				});
				return record;
			}
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			return record;
		}
	}
	, next: function (c) {
			var self = $dhx.jDBd;
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when getting last record"
				});
				return;
			}
			var current_cursor = parseInt(self.getCursor({
				data_set_name: c.data_set_name
			}));
			var current_cursor_index = self.indexById({
				data_set_name: c.data_set_name
				, record_id: current_cursor
			});
			var next_cursor_index = current_cursor_index + 1;
			var next_cursor_id = self.idByIndex({
				data_set_name: c.data_set_name
				, index: next_cursor_index
			});
			if (next_cursor_id != null) {
				if ($dhx._enable_log) console.log("exist, setting next cursor");
				/*$dhx.jDBd.setCursor({
					data_set_name: c.data_set_name,
					position: next_cursor_id
				});*/
			}
			else {
				dhtmlx.message({
					type: "error"
					, text: "there is no next record on this dataset"
				});
				return null;
			}
			return next_cursor_id;
		}
		/*,parse : function ( c ) {
			var self = $dhx.jDBd;
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error",
					text: "data_set_name is missing when getting last record"
				});
				return;
			}
		}*/
	
	, previous: function (c) {
		var self = $dhx.jDBd;
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when getting previously record"
			});
			return;
		}
		var current_cursor = parseInt(self.getCursor({
			data_set_name: c.data_set_name
		}));
		var current_cursor_index = self.indexById({
			data_set_name: c.data_set_name
			, record_id: current_cursor
		});
		var next_cursor_index = current_cursor_index - 1;
		var next_cursor_id = self.idByIndex({
			data_set_name: c.data_set_name
			, index: next_cursor_index
		});
		if (next_cursor_id != null) {
			if ($dhx._enable_log) console.log("exist, setting next cursor");
			/*$dhx.jDBd.setCursor({
				data_set_name: c.data_set_name,
				position: next_cursor_id
			});*/
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "there is no previous record on this dataset"
			});
			return null;
		}
		return next_cursor_id;
	}
	, remove: function (c) {
		var self = $dhx.jDBd;
		$dhx.jDBd.del(c);
	}
	, add: function (c, index) {
		var self = $dhx.jDBd;
		$dhx.jDBd.insert(c, index);
	}
	, sort: function (data_set_name, sortFunction, direction) {
			var self = $dhx.jDBd
				, c = {};
			c.data_set_name = data_set_name;
			console.log(c.data_set_name);
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when sorting dataset"
				});
				return;
			}
			var current_data = self.data_sets[c.data_set_name].data;
			try {
				current_data.sort(sortFunction);
			}
			catch (e) {
				dhtmlx.message({
					type: "error"
					, text: "could not sort data"
				});
				return;
			}
			//$dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
			self.data_sets[c.data_set_name]._synced_components.forEach(function (hash, index, array) {
				var component = hash.component;
				//if( $dhx._enable_log ) console.log(component);
				if (typeof component.mytype !== 'undefined') {
					//if( $dhx._enable_log ) console.log( "this component is a tree" );
				}
				if (typeof component.isTreeGrid !== 'undefined') {
					if ($dhx._enable_log) console.log("this component is a grid");
					////console.log( self.getDataForGrid({ data_set_name :c.data_set_name, filter : c.filter, $init : c.$init }) );
					component.parse(self.getDataForGrid({
						data_set_name: c.data_set_name
						, filter: c.filter
						, $init: c.$init
					}), "json");
				}
				if (typeof component._changeFormId !== 'undefined') {}
			});
			//
		}
		/**/
	
	, del: function (c) {
		// c = { data_set_name :"",  primary_key :"rule_id", record_id : "", api_resource: {}, onSuccess: function(){}, onFail: function(){} }
		var self = $dhx.jDBd
			, rows = []
			, value = c.value;
		if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "data_set_name is missing when deleting a dataset"
			});
			return;
		}
		if ((typeof c.record_id === 'undefined') || (c.record_id.length === 0)) {
			dhtmlx.message({
				type: "error"
				, text: "record_id is missing when deleting a dataset"
			});
			return;
		}
		console.log(self.data_sets[c.data_set_name]);
		console.log(self.data_sets[c.data_set_name].api_service.api_payload);
		/*if ((typeof c.api_resource === 'undefined') || (c.api_resource.length === 0)) {
			dhtmlx.message({
				type: "error",
				text: "api_resource is missing when deleting a dataset"
			});
			return;
		}*/
		if (typeof c.live === 'undefined') c.live = true;
		if (c.live == false) c.live = false;
		else c.live = true;
		if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		if ($dhx._enable_log) console.log(c.live);
		if (c.api_service) {
			c.api_service.end_point = c.api_service.end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
				.end_point : false);
			c.api_service.api_payload = c.api_payload || '';
		}
		console.log(c.api_service);
		//return;
		if (!c.api_service)
			if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
			// ( ! c.api_service.get_end_point  ) && ( ! c.api_service.post_end_point  ) && ( ! c.api_service.put_end_point  ) && ( ! c.api_service.del_end_point  )
		if (c.api_service)
			if (!c.api_service.end_point) c.api_service = false;
		c.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
		if ($dhx._enable_log) console.log(" c.api_service >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		if ($dhx._enable_log) console.log(c.api_service);
		//if( $dhx._enable_log ) console.log( c.api_service.post_end_point );
		if ($dhx._enable_log) console.log(self.data_sets[c.data_set_name].api_service);

		function _delete(index) {
				var current_data = self.data_sets[c.data_set_name].data;
				current_data.splice(index, 1)
				$dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
				self.data_sets[c.data_set_name]._synced_components.forEach(function (hash, index, array) {
					var component = hash.component;
					if ($dhx._enable_log) console.log(component);
					if (typeof component.mytype !== 'undefined') {
						//if( $dhx._enable_log ) console.log( "this component is a tree" );
					}
					if (typeof component.isTreeGrid !== 'undefined') {
						if ($dhx._enable_log) console.log("this component is a grid");
						component.deleteRow(c.record_id);
						if (typeof self.data_sets[c.data_set_name].data[0] !== 'undefined') {
							$dhx.jDBd.setCursor({
								data_set_name: c.data_set_name
								, position: self.data_sets[c.data_set_name].data[0][self.data_sets[c.data_set_name].primary_key]
							});
							component.selectRow(component.getRowIndex(self.data_sets[c.data_set_name].data[0][self.data_sets[c.data_set_name].primary_key]), true, false, true);
						}
						else self.data_sets[c.data_set_name].cursorPosition = null;
					}
					if (typeof component._changeFormId !== 'undefined') {}
				});
				if (c.onSuccess) c.onSuccess(c.record_id);
			} // end _delete
		if (typeof self.data_sets[c.data_set_name] !== 'undefined') {
			c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
			//if( $dhx._enable_log ) console.log( self.data_sets[ c.data_set_name ].data );
			self.data_sets[c.data_set_name].data.forEach(function (row, index, array) {
				if (typeof row[c.primary_key] !== 'undefined')
					if (row[c.primary_key] == c.record_id)
						if (c.api_service) {
							if ($dhx.REST.API.auth_status == "disconnected") {
								dhtmlx.message({
									type: "error"
									, text: "please login into REST.API before creating datasets"
								});
								if (c.onFail) c.onFail("please login into REST.API before creating datasets");
								return;
							}
							//if (c.api_service.del_end_point) {
							if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
							if ($dhx._enable_log) console.log(c.live);
							if (c.live) {
								console.log(c.api_payload);
								c.api_service.api_payload = c.api_service.api_payload || "";
								$dhx.REST.API.del({
									resource: c.api_service.end_point + "/" + c.record_id
									, format: "json"
									, payload: c.api_payload
									, onSuccess: function (request) {
										var json = JSON.parse(request.response);
										if (json.status == "success") {
											try {
												_delete(index);
											}
											catch (e) {
												dhtmlx.message({
													type: "error"
													, text: "don't deleted. reason: " + json.response
												});
												if (c.onFail) c.onFail("don't deleted. reason: ", e.stack);
											}
										}
										else {
											dhtmlx.message({
												type: "error"
												, text: "don't deleted. reason: " + json.response
											});
											if (c.onFail) c.onFail("don't deleted. reason: " + json.response);
										}
									}
									, onFail: function (request) {
										var json = JSON.parse(request.response);
										dhtmlx.message({
											type: "error"
											, text: json.response
										});
										if (c.onFail) c.onFail("don't deleted. reason: " + json.response);
									}
								}); // call del
							}
							else // if not live
							{
								_delete(index);
							}
							//}
							//else // if not c.api_service.del_end_point
							//	_delete(index);
						}
						else // not c.api_service
							_delete(index);
			}); // end foreach
		}
		else {
			dhtmlx.message({
				type: "error"
				, text: "dataset " + c.data_set_name + " not found"
			});
			if (c.onFail) c.onFail("don't deleted. reason: " + "dataset " + c.data_set_name + " not found");
		}
	}
	, insert: function (c, index) {
			var self = $dhx.jDBd
				, rows = []
				, index = index || null;
			// c = { data_set_name :"",  primary_key :"rule_id", record : {}, api_resource: "", api_payload: "", onSuccess: function(){}, onFail: function(){} }
			//console.log( c );
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length === 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when inserting a record"
				});
				return;
			}
			if ((typeof c.record === 'undefined')) {
				dhtmlx.message({
					type: "error"
					, text: "record is missing when inserting a record"
				});
				return;
			}
			console.log('XXXXXXXXXXXX insert');
			console.log(c);
			/*if ((typeof c.api_resource === 'undefined') || (c.api_resource.length == 0) || (c.api_resource == false)) {
				dhtmlx.message({
					type: "error",
					text: "api_resource is missing when inserting a record"
				});
				return;
			}*/
			function _insert(new_id) {
				c.record[c.primary_key] = new_id;
				var current_data = self.data_sets[c.data_set_name].data;
				if ($dhx.isNumber(index)) current_data.splice(index, 0, c.record);
				else current_data.push(c.record);
				$dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
				self.data_sets[c.data_set_name]._synced_components.forEach(function (hash, index_, array) {
					var component = hash.component;
					//if( $dhx._enable_log ) console.log(component);
					if (typeof component.mytype !== 'undefined') {
						//if( $dhx._enable_log ) console.log( "this component is a tree" );
					}
					else if (typeof component.isTreeGrid !== 'undefined') {
						if ($dhx._enable_log) console.log("this component is a grid");
						var obj = {};
						for (i in c.record)
							if (c.record.hasOwnProperty(i)) obj[i] = c.record[i];
						if (hash.$init) hash.$init(obj);
						// lets prepare the grid record data
						var data = [];
						for (var i in obj)
							if (obj.hasOwnProperty(i)) {
								if (typeof component.getColIndexById(i) !== 'undefined')
									if ($dhx.isNumber(component.getColIndexById(i))) {
										data.splice(component.getColIndexById(i), 0, obj[i]);
									}
							} // end hasproperty
							// end for
						if ($dhx.isNumber(index)) component.addRow(obj[c.primary_key], data, index);
						else component.addRow(obj[c.primary_key], data);
						component.selectRow(component.getRowIndex(obj[c.primary_key]), true, false, true);
					}
					else if (typeof component._changeFormId !== 'undefined') {}
					else if (typeof component._selOption !== 'undefined') {
						if ($dhx._enable_log) console.log("this component is a combo");
						var records = [];
						var obj = {};
						for (i in c.record)
							if (c.record.hasOwnProperty(i)) obj[i] = c.record[i];
						if (hash.$init) hash.$init(obj);
						records.push([obj.value, obj.text]);
						try {
							component.addOption(records);
							component.selectOption(component.getIndexByValue(obj.value));
						}
						catch (e) {
							if ($dhx._enable_log) console.log(e.stack);
						}
					}
				});
				if (c.onSuccess) c.onSuccess(new_id);
			}
			c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;
			if (typeof c.live === 'undefined') c.live = true;
			if (c.live == false) c.live = false;
			else c.live = true;
			if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			if ($dhx._enable_log) console.log(c.live);
			if (c.api_service) {
				c.api_service.end_point = c.api_service.end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
					.end_point : false);
				/*c.api_service.get_end_point = c.api_service.get_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );

				c.api_service.post_end_point = c.api_service.post_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );

				c.api_service.put_end_point = c.api_service.put_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );

				c.api_service.del_end_point = c.api_service.del_end_point || ( ( self.data_sets[ c.data_set_name ].api_service.end_point ) ? self.data_sets[ c.data_set_name ].api_service.end_point : false );*/
				c.api_service.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
			}
			console.log(c.api_service);
			//return;
			if (!c.api_service)
				if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
				// ( ! c.api_service.get_end_point  ) && ( ! c.api_service.post_end_point  ) && ( ! c.api_service.put_end_point  ) && ( ! c.api_service.del_end_point  )
			if (c.api_service)
				if (!c.api_service.end_point) c.api_service = false;
			c.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
			if (c.api_service) {
				if ($dhx.REST.API.auth_status == "disconnected") {
					dhtmlx.message({
						type: "error"
						, text: "please login into REST.API before creating datasets"
					});
					if (c.onFail) c.onFail("please login into REST.API before creating datasets");
					return;
				}
				console.log(c.api_service.api_payload);
				if (c.api_service.end_point) {
					//if( $dhx._enable_log ) console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" );
					//if( $dhx._enable_log ) console.log( c.live );
					if (c.live) {
						$dhx.REST.API.insert({
							resource: c.api_service.end_point // mandatory
							
							, format: "json" // json, yaml, xml. Default: json. Not mandatory
							
							, payload: c.api_payload // mandatory for PUT and POST
							
							, onSuccess: function (request) // not mandatory
								{
									var json = JSON.parse(request.response);
									if (json.status == "success") {
										var data = [];
										_insert(json[c.primary_key]);
									}
									else {
										dhtmlx.message({
											type: "error"
											, text: "don't saved. reason: " + json.response
										});
										if (c.onFail) c.onFail("don't saved. reason: " + json.response);
									}
								}
							, onFail: function (request) { // not mandatory
								dhtmlx.message({
									type: "error"
									, text: request
								});
								if (c.onFail) c.onFail("don't saved. reason: " + request);
							}
						});
					}
					else // if not c.live
					{
						_insert((new Date().getTime()));
					}
				}
				else // if not c.api_service.post_end_point
				{
					_insert((new Date().getTime()));
				}
			}
			else // if not c.api_service
			{
				_insert((new Date().getTime()));
			}
		} // end insert
	
	, update: function (c) {
			var self = $dhx.jDBd
				, rows = [];
			// c = { data_set_name :"",  primary_key : int,  record_id :"string mixed", record : {}, api_resource: "", api_payload: "", onSuccess: function(){}, onFail: function(){} }
			if ((typeof c.data_set_name === 'undefined') || (c.data_set_name.length == 0)) {
				dhtmlx.message({
					type: "error"
					, text: "data_set_name is missing when updating a record"
				});
				return;
			}
			if ((typeof c.record_id === 'undefined') || (c.record_id.length == 0)) {
				dhtmlx.message({
					type: "error"
					, text: "record_id is missing when updating a record"
				});
				return;
			}
			if ((typeof c.record === 'undefined') || (c.record.length == 0)) {
				dhtmlx.message({
					type: "error"
					, text: "record is missing when updating a record"
				});
				return;
			}
			/*if ((typeof c.api_resource === 'undefined') || (c.api_resource.length == 0)) {
				dhtmlx.message({
					type: "error",
					text: "api_resource is missing when updating a record"
				});
				return;
			}*/
			c.primary_key = c.primary_key || self.data_sets[c.data_set_name].primary_key;

			function _update(record_id) {
				var updated_record_index = false;
				//c.record["id"] = json[c.primary_key];
				c.record[c.primary_key] = record_id;
				var current_data = self.data_sets[c.data_set_name].data;
				for (var x = 0; x < current_data.length; x++) {
					var row = current_data[x];
					if (typeof row[c.primary_key] !== 'undefined') {
						if (row[c.primary_key] == c.record_id) {
							for (var i in c.record)
								if (c.record.hasOwnProperty(i)) {
									current_data[x][i] = c.record[i];
								}
						}
					} // end primary key defined
				} // end for  data
				$dhx.jDBdStorage.saveDatabase(c.data_set_name + ".data", current_data);
				self.data_sets[c.data_set_name]._synced_components.forEach(function (hash, index, array) {
					var component = hash.component;
					//if( $dhx._enable_log ) console.log(component);
					if (typeof component.mytype !== 'undefined') {
						//if( $dhx._enable_log ) console.log( "this component is a tree" );
					}
					if (typeof component.isTreeGrid !== 'undefined') {
						if ($dhx._enable_log) console.log("this component is a grid, lets update");
						//self.data_sets[ c.data_set_name ].data[ updated_record_index ]
						var updated_record = self.getCurrentRecord({
							data_set_name: c.data_set_name
						});
						if ($dhx._enable_log) console.log(updated_record);
						//if( $dhx._enable_log ) console.log(updated_record);
						var obj = {};
						for (i in updated_record)
							if (updated_record.hasOwnProperty(i)) obj[i] = updated_record[i];
						if (hash.$init) hash.$init(obj);
						for (var i in obj)
							if (obj.hasOwnProperty(i)) {
								if (typeof component.getColIndexById(i) !== 'undefined')
									if ($dhx.isNumber(component.getColIndexById(i))) {
										// try to set new cell value
										try {
											component.cells(c.record_id, component.getColIndexById(i)).setValue(obj[i]);
										}
										catch (e) {
											if ($dhx._enable_log) console.log(e.stack);
										}
									}
									// end if column index is defined
							} // if has property
							// end for
							//component.selectRow(component.getRowIndex(c.record[c.primary_key]), true, false, true);
					}
					if (typeof component._changeFormId !== 'undefined') {}
				});
				if (c.onSuccess) c.onSuccess(record_id);
			}
			if (typeof c.live === 'undefined') c.live = true;
			if (c.live == false) c.live = false;
			else c.live = true;
			if ($dhx._enable_log) console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			if ($dhx._enable_log) console.log(c.live);
			if (c.api_service) {
				c.api_service.end_point = c.api_service.end_point || ((self.data_sets[c.data_set_name].api_service.end_point) ? self.data_sets[c.data_set_name].api_service
					.end_point : false);
				c.api_service.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
			}
			console.log(c.api_service);
			//return;
			if (!c.api_service)
				if (self.data_sets[c.data_set_name].api_service) c.api_service = self.data_sets[c.data_set_name].api_service;
				// ( ! c.api_service.get_end_point  ) && ( ! c.api_service.post_end_point  ) && ( ! c.api_service.put_end_point  ) && ( ! c.api_service.del_end_point  )
			if (c.api_service)
				if (!c.api_service.end_point) c.api_service = false;
			c.api_payload = c.api_payload || 'hash=' + JSON.stringify(c.record);
			if ($dhx._enable_log) console.log(" c.api_service >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			if ($dhx._enable_log) console.log(c.api_service);
			if ($dhx._enable_log) console.log(c.api_service.post_end_point);
			if ($dhx._enable_log) console.log(self.data_sets[c.data_set_name].api_service);
			if (c.api_service) {
				if ($dhx.REST.API.auth_status == "disconnected") {
					dhtmlx.message({
						type: "error"
						, text: "please login into REST.API before creating datasets"
					});
					if (c.onFail) c.onFail("please login into REST.API before creating datasets");
					return;
				}
				//if (c.api_service.put_end_point) {
				//if( $dhx._enable_log ) console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" );
				//if( $dhx._enable_log ) console.log( c.live );
				if (c.live) {
					$dhx.REST.API.put({
						resource: c.api_service.end_point + "/" + c.record_id // mandatory
						
						, format: "json" // json, yaml, xml. Default: json. Not mandatory
						
						, payload: c.api_payload // mandatory for PUT and POST
						
						, onSuccess: function (request) // not mandatory
							{
								var json = JSON.parse(request.response);
								if (json.status == "success") {
									var data = [];
									_update(json[c.primary_key]);
								}
								else {
									dhtmlx.message({
										type: "error"
										, text: "don't saved. reason: " + json.response
									});
									if (c.onFail) c.onFail("don't saved. reason: " + json.response);
								}
							}
						, onFail: function (request) { // not mandatory
							dhtmlx.message({
								type: "error"
								, text: request
							});
							if (c.onFail) c.onFail("don't saved. reason: " + request);
						}
					});
				}
				else // if not c.live
				{
					_update(c.record_id);
				}
				//}
				//else // if not c.api_service.post_end_point
				//{
				//	_update(c.record_id);
				//}
			}
			else // if not c.api_service
			{
				_update(c.record_id);
			}
		} // end update
}