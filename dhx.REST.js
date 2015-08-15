$dhx.REST = {
        API: {
            appName: "$dhx REST client",
            version: '1.0.3',
            apiURL: "http://api.dhtmlx.com.br",
            apiURLdev: "http://api.web2.eti.br:3000",
            apiURLtest: "http://api.web2.eti.br:3000",
            OS: "linux",
            token: "-",
            date_expiration: 0,
            user: "nobody",
            http_user: false,
            http_secret: false,
            auth_status: "disconnected",
            request: null,
			session : {},
            isXDR: false,
            default_payload: ""
                /**
					@method  $dhx.REST.API.getMappedURL

					example:

					var gridURL = $dhx.REST.API.getMappedURL( {
						resource : "/LibraryFields",  // mandatory
						responseType : "json", // not mandatory, default json
						params : "columns=" + self.model.conf_grid.ids + "" // not mandatory, default none
					} );

				*/

            ,
            getMappedURL: function(configuration) {
                var self = $dhx.REST.API;
                resource = configuration.resource || false;
                type = configuration.responseType || false;
                params = configuration.params || false;
                resource = resource || null;
                if (resource === null) return null;
                type = type || "json";
                type = type.toLowerCase();
                if (type != "json" && type != "xml" && type != "yaml") type = type || "json";
                params = params || "";
                if (params != "") params = "&" + params;
				if ($dhx.environment == "dev") self.apiURL = self.apiURLdev;
                else if ($dhx.environment == "production") self.apiURL = self.apiURL;
                else self.apiURL = self.apiURLtest;
                return self.apiURL + "" + resource + "." + type + "?token=" + $dhx.REST.API.token + params;
            },
            startAjax: function() {
                var self = $dhx.REST.API;
				 try {
                	self.request = new XMLHttpRequest();
                } catch (e) {
                	$dhx.debug.error(e.message, e.stack);;
                }
            },
            queue: [],
            inProgress: false,
            process_queue: function(callback) {
                var self = $dhx.REST.API;
                //$dhx.debug.log(self.queue.length);
                if (self.queue.length > -0) {
                    self.inProgress = true;
                    var first_conf_on_queue = self.queue.shift();
                    //$dhx.debug.log("on queuee : " + first_conf_on_queue.sync);
                    first_conf_on_queue.sync = first_conf_on_queue.sync || false;
                    var h = {
                        method: first_conf_on_queue.method,
                        url: first_conf_on_queue.url,
                        payload: first_conf_on_queue.payload,
                        sync: first_conf_on_queue.sync,
                        success: function(request) {
                            first_conf_on_queue.success(request);
                            self.process_queue(callback);
                            self.inProgress = false;
                            //$dhx.debug.log(request);
                            //$dhx.debug.log("sucessCallBack");
                        },
                        error: function(request) {
                            first_conf_on_queue.error(request);
                            self.process_queue(callback);
                            self.inProgress = false;
                            //$dhx.debug.log(request);
                            //$dhx.debug.log("errorCallBack");
                        },
                        format: first_conf_on_queue.format
                    };
                    if (first_conf_on_queue.user) h["user"];
                    first_conf_on_queue.user;
                    if (first_conf_on_queue.secret) h["secret"];
                    first_conf_on_queue.secret;
                    //$dhx.debug.log( "process queue" ) ;
                    //$dhx.debug.log( first_conf_on_queue ) ;
                    self.fetch(h);
                } else {
                    $dhx.hideDirections();
                    if (callback) callback();
                }
            },
            ajax: function(json) {
                var self = $dhx.REST.API;
                self.queue.push(json);
                //$dhx.showDirections("Loading_Files");
                //$dhx.debug.log( "ajax" ) ;
                //$dhx.debug.log( json ) ;
                if (json.user) $dhx.REST.API.http_user = json.user;
                else $dhx.REST.API.http_user = false;
                if (json.secret) $dhx.REST.API.http_secret = json.secret;
                else $dhx.REST.API.http_secret = false
                if (!self.inProgress) self.process_queue();
            },
            fetch: function(json) {
                var self = $dhx.REST.API,
                    url = window.location.href,
                    arr = url.split("/"),
                    origin = arr[0] + "//" + arr[2],
                    pnumber = 1;
                try {
                    if (self.request == null) self.startAjax();
                    if (!self.request) return;
                    json.url = json.url.replace(/\?&/gi, '?');
                    json.url.charAt(json.url.length - 1) == '?' ? json.url = json.url.substr(0, json.url.length - 1) : null;
                    self.request.open(json.method, json.url, true);
                    self.request.setRequestHeader('Content-type', json.method != 'GET' ? 'application/x-www-form-urlencoded' : 'text/plain');
                    //self.request.setRequestHeader("X-os", $dhx.crypt.base64_encode($dhx.REST.API.OS));
                    self.request.setRequestHeader("X-Company-ID", $dhx.REST.API.company_id || 0);

                    self.request.setRequestHeader("X-User-Group", $dhx.REST.API.group || 0);
                    self.request.setRequestHeader("X-User-ID", $dhx.REST.API.api_user_id || 0);
                    //self.request.setRequestHeader("X-Person-Type", $dhx.REST.API.person_type || '');
                    self.request.setRequestHeader("X-client-session-id", $dhx.REST.API.client_session_id || 0);
                    self.request.setRequestHeader("X-browser-name", $dhx.Browser.name);
                    self.request.setRequestHeader("X-browser-version", $dhx.Browser.version);
                    self.request.setRequestHeader("X-browser-os", $dhx.Browser.OS);
                    self.request.setRequestHeader("X-browser-screen-width", screen.width);
                    self.request.setRequestHeader("X-browser-screen-height", screen.height);
                    self.request.setRequestHeader("X-branch", ($dhx.environment == 'test' ? $dhx.environment : (($dhx.environment == 'dev') ? $dhx.environment : ($dhx.environment ==
                        'production') ? $dhx.environment : 'test')));
                    self.request.setRequestHeader("X-Requested-With", $dhx.REST.API.appName + " " + $dhx.REST.API.version);
                    if ($dhx.REST.API.http_user && $dhx.REST.API.http_secret) {
                        self.request.setRequestHeader("Authorization", "Basic " + $dhx.crypt.base64_encode($dhx.REST.API.http_user + ":" + $dhx.REST.API.http_secret));
                        // ie sucks
                        self.request.setRequestHeader("X-Authorization", "Basic " + $dhx.crypt.base64_encode($dhx.REST.API.http_user + ":" + $dhx.REST.API.http_secret));
                    } else {
                        self.request.setRequestHeader("Authorization", "Digest " + $dhx.crypt.base64_encode($dhx.REST.API.token));
                        self.request.setRequestHeader("X-Authorization", "Digest " + $dhx.crypt.base64_encode($dhx.REST.API.token));
                    }
					
                    self.request.onerror = function() {
                        $dhx.debug.log(self.request);
                        $dhx.debug.log(self.request.status);
                        //var rr = '{"response" : {"response" : ' + self.request + '} }';
                        var text_response = "Error";
                        var status = self.request.status;
                        if (self.request.status == 0) {
                            text_response = "API is offline - " + self.apiURL + "";
                            status = 503;
                        }
                        if (json.error) {
                            json.error({
                                "statusText": self.request.statusText,
                                "status": status,
                                "response": "{\"response\":\"" + text_response + "\",\"status\":\"err\"}",
                                "responseType": "json",
                                "responseXML": null,
                                "responseText": "{\"response\":\"" + text_response + "\",\"status\":\"err\"}"
                            });
                        }
                    }
                    self.request.ontimeout = function() {
                        if (json.error) json.error(self.request);
                    }
                    self.request.onreadystatechange = function() {
						try
						{
							$dhx.ui.desktop.view.setRESTon();
						}catch(e){}
						
                        $dhx.debug.log("=========  state changed ==========");
                        $dhx.debug.log(self.request.readyState);
                        $dhx.debug.log(self.request.status);
                        if (self.request.readyState != 4 && (self.request.status != 404 && self.request.status != 401)) {
                            try {

                                    if (self.request.readyState == 2) {
                                        $dhx.debug.log(self.request.readyState + " " + self.request.statusText + " sent request to " + json.url + " ");
                                        $dhx.progressOn("sending request ...");
                                    } else if (self.request.readyState == 3) {
                                        $dhx.debug.log(self.request.readyState + " " + self.request.statusText + " processing and receiving data packet number " +
                                            pnumber + " from " + json.url + ". ");
                                        $dhx.progressOn("processing data packet number " + pnumber + "");
                                        pnumber = pnumber + 1;
                                    }

                            } catch (e) {
                                //$dhx.debug.error(e.message, e.stack);;
                            }
                            return;
                        }
                        /*if (self.request.status != 200 && self.request.status != 304 && self.request.status != 0 )
						{
							$dhx.debug.log("error: request status: " + self.request.status)
							if( json.error )	json.error( self.request );
							return;
						}*/
                        if (self.request.readyState == 4) {
							
							try
							{
								$dhx.ui.desktop.view.setRESToff();
							}catch(e){}
							
							$dhx.debug.timeEnd("response received in");
                            if (self.request.status == 0) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "The API branch (" + self.apiURL + ") is offline"
                                });
                                $dhx.debug.warn("503 - Service Unavailable");
                                $dhx.debug.warn("error: request status: " + self.request.status + ". could not reach " + json.url);
                                //if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 400) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "bad request"
                                });
                                $dhx.debug.warn("400 - Bad request")
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 401) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "unauthorized access"
                                });
                                try {
                                    var response = JSON.parse(self.request.response);
                                    //$dhx.debug.log("response.status " + response.status);
                                    if (response.status == "err") {
                                        $dhx.debug.warn(response.response);
                                        $dhx.debug.debug(self.request);
                                    } else {
                                        $dhx.debug.error(e.message, e.stack);
                                    }
                                } catch (e) {
                                    $dhx.debug.warn("401 - Unauthorized");
                                }
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 404) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "resource not found"
                                });
                                $dhx.debug.warn("404 - Not found");
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (typeof self.request.response === 'undefined') {
                                self.request.response = self.request.responseText;
                            }
                            if (self.request.status == 500) {
                                try {
                                    var response = JSON.parse(self.request.response);
                                    //$dhx.debug.log("response.status " + response.status);
                                    if (response.status == "err") {
                                        $dhx.debug.warn(response.response);
                                        $dhx.debug.debug(self.request);
                                    } else {}
                                } catch (e) {
                                    $dhx.debug.warn("internal server error: server side error. request status: " + self.request.status + "")
                                }
                                $dhx.progressOff("processing data packet number " + pnumber + "");
                                if (json.error) json.error(self.request);
                                return;
                            } else if (self.request.status == 502) {
                                $dhx.debug.warn("bad gateway: API server is unavailable")
                                if (json.error) json.error(self.request);
                                return;
                            } else if (self.request.status == 503) {
                                $dhx.debug.warn("service unavailable: API server is unavailable")
                                if (json.error) json.error(self.request);
                                return;
                            } else if (self.request.status == 200) {

                                if (self.request.readyState == 4)
								{
									$dhx.debug.warn(self.request.readyState + " " + self.request.statusText + " downloaded. responseText holds complete data from " + json.url + ". ");
								}
								$dhx.progressOff("ready ...");
                                if (json.format = "json") {
                                    try {
                                        var response = JSON.parse(self.request.response);
                                        $dhx.debug.log("response ", response);
                                        if (response.status == "err") {
                                            $dhx.debug.log("error message : ", response.response);
                                            if (json.error) json.error(self.request);
                                        } else {
                                            try {
												//console.log('calling success');
												//console.log(self.request);
                                                if (json.success) json.success(self.request)
                                            } catch (e) {
                                                $dhx.debug.warn(e.stack || e.message);
                                                $dhx.debug.warn("error on callback function");
                                                if (json.error) json.error(self.request);
                                            }
                                        }
                                    } catch (e) {
                                        $dhx.debug.warn("unevaluable JSON: ", self.request);
                                        $dhx.debug.warn(e.stack || e.message);
                                        var response = {
                                            "response": self.request
                                        };
                                        if (json.error) json.error(JSON.stringify(response));
                                    }
                                } else {
                                    if (json.success) json.success(self.request);
                                }
                            }
                        }
                    }// end ready state
                    if (self.request.readyState == 4 && self.request.status != 0) {
                        return;
                    }
                    try {
                        //$dhx.debug.log('xhr readystate: ' + self.request.readyState);
                        //$dhx.debug.log('http status: ' + self.request.status);
                        $dhx.debug.time("response received in");
                        $dhx.debug.warn("-----REST client log-----");
                        $dhx.debug.warn(self.request.readyState + " set up " + json.method + " request to " + json.url + "");
                        self.request.send(json.payload);
                    } catch (e) {
                        $dhx.debug.warn(e.stack || e.message);
                        $dhx.debug.warn(self.request);
                        if (json.error) json.error(self.request);
                    }
                } catch (e) {
                    //$dhx.debug.log(e.stack || e.message);
                    //if( json.error )	json.error( self.request );
                }
            },
            post: function(c) {
                    var self = $dhx.REST.API;
                    //$dhx.debug.log("API post");
                    if (typeof c.payload === 'undefined') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    else if (typeof c.payload === 'string')
                        if (c.payload == '') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                        else c.payload = (($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload + "&" : "") + c.payload;
                    else c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    //$dhx.debug.log(c.payload);
                    if (!$dhx.isFunction(c.onSuccess)) {
                        c.onSuccess = false;
                    }
                    if (!$dhx.isFunction(c.onFail)) {
                        c.onFail = false;
                    }
                    if (typeof c.format === 'undefined') {
                        c.format = "json";
                    }
                    if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                        c.format = "json";
                    }
                    if (typeof c.sync === 'undefined') {
                        c.sync = false;
                    }
                    self.ajax({
                        method: "POST",
                        url: self.apiURL + c.resource + "." + c.format + "?",
                        payload: c.payload,
                        success: c.onSuccess,
                        error: c.onFail,
                        format: c.format,
                        sync: c.sync
                    });
                }
                /* Alias for post method */

            ,
            insert: function(c) {
                var self = $dhx.REST.API;
                self.post(c);
            },
            put: function(c) {
                    var self = $dhx.REST.API;
                    if (typeof c.payload === 'undefined') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    else if (typeof c.payload === 'string')
                        if (c.payload == '') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                        else c.payload = (($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload + "&" : "") + c.payload;
                    else c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    //$dhx.debug.log(c.payload);
                    if (!$dhx.isFunction(c.onSuccess)) {
                        c.onSuccess = false;
                    }
                    if (!$dhx.isFunction(c.onFail)) {
                        c.onFail = false;
                    }
                    if (typeof c.format === 'undefined') {
                        c.format = "json";
                    }
                    if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                        c.format = "json";
                    }
                    if (typeof c.sync === 'undefined') {
                        c.sync = false;
                    }
                    self.ajax({
                        method: "PUT",
                        url: self.apiURL + c.resource + "." + c.format + "?",
                        payload: c.payload,
                        success: c.onSuccess,
                        error: c.onFail,
                        format: c.format,
                        sync: c.sync
                    });
                }
                /* Alias for put method */

            ,
            update: function(c) {
                var self = $dhx.REST.API;
                self.put(c);
            },
            get: function(c) {
                    var self = $dhx.REST.API,
                        fURL;
                    // GET does not send payloads
                    //c.payload = null;
                    if (!$dhx.isFunction(c.onSuccess)) {
                        c.onSuccess = false;
                    }
                    if (!$dhx.isFunction(c.onFail)) {
                        c.onFail = false;
                    }
                    if (typeof c.format === 'undefined') {
                        c.format = "json";
                    }
                    if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                        c.format = "json";
                    }
                    if (typeof c.payload === 'undefined') {
                        c.payload = "";
                    }
                    if (c.payload == "") {
                        fURL = self.apiURL + c.resource + "." + c.format + "?" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API.default_payload : "");
                    } else {
                        fURL = self.apiURL + c.resource + "." + c.format + "?" + ((c.payload) ? "&" + c.payload : "") + "" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API
                            .default_payload : "")
                    }
                    if (typeof c.sync === 'undefined') {
                        c.sync = false;
                    }
                    self.ajax({
                        method: "GET",
                        url: fURL,
                        payload: null,
                        success: c.onSuccess,
                        error: c.onFail,
                        format: c.format,
                        sync: c.sync
                    });
                }
                /* Alias for get method */

            ,
            list: function(c) {
                var self = $dhx.REST.API;
                self.get(c);
            },
            del: function(c) {
                var self = $dhx.REST.API,
                    url;
                // DELETE does not send payloads
                if (typeof c.payload === 'undefined') {
                    c.payload = null;
                }
                if (!$dhx.isFunction(c.onSuccess)) {
                    c.onSuccess = false;
                }
                if (!$dhx.isFunction(c.onFail)) {
                    c.onFail = false;
                }
                if (typeof c.format === 'undefined') {
                    c.format = "json";
                }
                if (c.format != 'json' && c.format != 'yaml' && c.format != 'xml') {
                    c.format = "json";
                }
                if (typeof c.sync === 'undefined') {
                    c.sync = false;
                }
                if (typeof c.payload === 'undefined') {
                    url = self.apiURL + c.resource + "." + c.format + "?" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API.default_payload : "");
                } else {
                    url = self.apiURL + c.resource + "." + c.format + "?" + ((c.payload) ? "&" + c.payload : "") + "" + (($dhx.REST.API.default_payload) ? "&" + $dhx.REST.API
                        .default_payload : "");
                }
                self.ajax({
                    method: "DELETE",
                    url: url,
                    payload: null,
                    success: c.onSuccess,
                    error: c.onFail,
                    format: c.format,
                    sync: c.sync
                });
            },
            _blockWhenTokenExpires: function() {
				var self = $dhx.REST.API;
                // set the date we're counting down to
                var target_date = parseInt(self.date_expiration);
                var expiresloop = window.setInterval(function() {
                    // find the amount of "seconds" between now and target
                    var current_date = new Date().getTime();
                    var seconds_left = (target_date - current_date) / 1000;
					//$dhx.debug.log(target_date, current_date);
                    if (target_date < current_date) {
						window.clearInterval(expiresloop);
						$dhx.ui.login.render(
						{
							onGranted : function()
							{
								self._blockWhenTokenExpires();
							}
							,onDenied : function(){
								dhtmlx.message({
									type: "error",
									text: 'Denied access'
								});
							}	
						});
						$dhx.ui.login.status_bar.setText('<span class="red">'+ $dhx.ui.language.expired_token_message + '</span>');
                    }
                }, 60000);
            },
            showCountDown: function(elementID) {
                // set the date we're counting down to
                var target_date = parseInt($dhx.REST.API.date_expiration);
                // variables for time units
                var days, hours, minutes, seconds;
                // get tag element
                var countdown = document.getElementById(elementID);
                // update the tag with id "countdown" every 1 second
                window.setInterval(function() {
                    // find the amount of "seconds" between now and target
                    var current_date = new Date().getTime();
                    var seconds_left = (target_date - current_date) / 1000;
                    // do some time calculations
                    days = parseInt(seconds_left / 86400);
                    seconds_left = seconds_left % 86400;
                    hours = parseInt(seconds_left / 3600);
                    seconds_left = seconds_left % 3600;
                    minutes = parseInt(seconds_left / 60);
                    seconds = parseInt(seconds_left % 60);
					
					if(seconds.toString().length == 1)
					{
						seconds = "0" + seconds;	
					}
					
					if(minutes.toString().length == 1)
					{
						minutes = "0" + minutes;	
					}
					if(hours.toString().length == 1)
					{
						hours = "0" + hours;	
					}
					
                    // format countdown string + set tag value
                    countdown.innerHTML = /*days + "d, " +*/ hours + "h, " + minutes + "m, " + seconds + "s";
                }, 500);
            }
			
			,_loginScreen : function( c ){
				var  self = $dhx.REST.API;
				$dhx.ui.login.render(
				{
					onGranted : function()
					{
						if(c.onSuccess) 
						{	
							c.onSuccess(); 
						}
					}
					,onDenied : function(){
						if( c.onFail )
						{
							c.onFail();	
						}
					}	
				});
			}
			
			
			,login : function( c ){
				var  self = $dhx.REST.API,
					request = null,
					response = null,
					target_date = null,
					current_date = null
					
				request = $dhx.jDBdStorage.get('$dhx.REST.request') || null;
				
				if( request == null )
				{
					self._loginScreen( c );
					return;	
				}
				// bug on firefox not getting properly json with session information
				try
				{
					request = JSON.parse( request );
					response = JSON.parse( request.response );
				}
				catch(e)
				{
					self._loginScreen( c );
					return;	
				}
				
				
				
				if (response.auth_data.token != '-') {
					target_date = parseInt(response.auth_data.date_expiration);
					current_date = new Date().getTime();
					if (target_date <= current_date) {
						self._loginScreen( c );
						return;		
					}
				}
				self._grantLogin( c, request ); 
			}
			
			
			,_grantLogin : function(c, request){
				var self = $dhx.REST.API;
				
				//$dhx.cookie.del("apitemp");
				//$dhx.jDBdStorage.storeObject('$dhx.db.' + c.db, JSON.stringify({}));
				var response = JSON.parse(request.response);
				$dhx.REST.API.auth_status = response.auth_data.auth_status;
				$dhx.REST.API.token = response.auth_data.token;
				$dhx.REST.API.date_expiration = (new Number(response.auth_data.date_expiration) + 0);
				
				Object.defineProperty($dhx.REST.API, 'user', {
					value: response.auth_data.name
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'username', {
					value: response.auth_data.username
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'client_session_id', {
					value: response.auth_data.client_session_id + "_" + (new Date().getTime())
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'api_user_id', {
					value: response.auth_data.api_user_id
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'entity_id', {
					value: response.auth_data.entity_id
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'group', {
					value: response.auth_data.group
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'company_id', {
					value: response.auth_data.company_id
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'time_zone', {
					value: response.auth_data.time_zone
					, enumerable: false
					, configurable: false
					, writable: false
				});
				Object.defineProperty($dhx.REST.API, 'session', {
					value: {
						user: $dhx.REST.API.user
						, username: $dhx.REST.API.username
						, client_session_id: $dhx.REST.API.client_session_id
						, user_id: $dhx.REST.API.api_user_id
						, group: $dhx.REST.API.group
						, company_id: $dhx.REST.API.company_id
						, storage_quota: $dhx.REST.API.storage_quota
						, time_zone: $dhx.REST.API.time_zone
					}
					, enumerable: false
					, configurable: false
					, writable: false
				});
				$dhx.REST.API.default_payload = "";
				$dhx.REST.API.auth_request = request;
				
				$dhx.hideDirections();
				
				self._blockWhenTokenExpires();
				
				if( typeof $dhx.ui.$Session !== 'undefined' )
				{
					$dhx.ui.$Session.start();
				}
				
				if ($dhx.environment == "dev") self.apiURL = self.apiURLdev;
                else if ($dhx.environment == "production") self.apiURL = self.apiURL;
                else self.apiURL = self.apiURLtest;
				
				if (c.onSuccess) c.onSuccess(request);
			}
			
			,
            authorize: function(c) {
                    var self = $dhx.REST.API,
                        url = window.location.href,
                        arr = url.split("/"),
                        origin = arr[0] + "//" + arr[2];
						
                    if ($dhx.REST.API.token != '-') {
                        var target_date = parseInt($dhx.REST.API.date_expiration);
                        // find the amount of "seconds" between now and target
                        var current_date = new Date().getTime();
                        if (target_date > current_date) {
                            $dhx.debug.warn("You already are authenticated, bypassing the authorization ... ");
                            if (c.onSuccess) c.onSuccess($dhx.REST.API.auth_request);
                            return;
                        }
                    }
                    //c.credential_token = $dhx.cookie.get("apitemp");
                    if ( typeof c.credential_token === 'undefined' ) {
                        $dhx.showDirections("Error: application needs a credential's token to authenticate ");
                        return;
                    }
					if (c.credential_token == null) {
                        $dhx.showDirections("Error: application needs a credential's token to authenticate ");
                        return;
                    }
                    $dhx.showDirections("authenticating through the REST API ... ");
                    c.onSuccess = c.onSuccess || false;
                    c.onFail = c.onFail || false;
                    if ($dhx.environment == "dev") self.apiURL = self.apiURLdev;
                    else if ($dhx.environment == "production") self.apiURL = self.apiURL;
                    else self.apiURL = self.apiURLtest;
                    if ($dhx.crypt.base64_decode(c.credential_token).split(":").length != 2) {
                        dhtmlx.message({
                            type: "error",
                            text: "invalid API secret"
                        }); //
                        $dhx.showDirections("Error: invalid API secret");
                        return;
                    }
					
					

                    function fail(request) {
                        //$dhx.cookie.del("apitemp")
                        var response = JSON.parse( request.response );
                        if (c.onFail) c.onFail(request);
                        $dhx.showDirections("Error: " + response.response);
                    }
					
                    $dhx.showDirections(" Requesting API authorization ... ");
                    self.ajax({
                        method: "POST",
                        url: self.apiURL + "/auth.json",
                        payload: "",
                        success: function() {
							//var request = arguments[0];
							console.log(arguments);
							console.log(typeof arguments[0]);
							var h = {};
							
							h['response'] = arguments[0].response
							console.log(JSON.stringify(h));
							
							
						   $dhx.jDBdStorage.storeObject('$dhx.REST.request', JSON.stringify(h));
						   self._grantLogin( c, arguments[0] ); 
						},
                        error: fail,
                        format: "json",
                        user: $dhx.crypt.base64_decode(c.credential_token).split(":")[0],
                        secret: $dhx.crypt.base64_decode(c.credential_token).split(":")[1]
                    });

                    
                } // end authorize
        } // end API
    } // end REST
