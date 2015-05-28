$dhx.REST = {
        API: {
            appName: "REST API Javascript client",
            version : '1.0.3',
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
                if (params != "") params = "&" + params
                return self.apiURL + "" + resource + "." + type + "?company_id=" + self.company_id + "&token=" + self.token + params;
            },
            XMLHttpFactories: [
                function() {
                    return new XMLHttpRequest()
                },
                function() {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                },
                function() {
                    return new ActiveXObject("Msxml3.XMLHTTP")
                },
                function() {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                }
            ],
            createHttpConnection: function() {
                var self = $dhx.REST.API;
                var xmlhttp = false;
                for (var i = 0; i < self.XMLHttpFactories.length; i++) {
                    try {
                        xmlhttp = self.XMLHttpFactories[i]();
                    } catch (e) {
                        console.log(e.stack);
                        continue;
                    }
                    break;
                }
                return xmlhttp;
            },
            startAjax: function() {
                var self = $dhx.REST.API;
                self.request = self.createHttpConnection();
            },
            queue: [],
            inProgress: false,
            process_queue: function(callback) {
                var self = $dhx.REST.API;
                //console.log(self.queue.length);
                if (self.queue.length > -0) {
                    self.inProgress = true;
                    var first_conf_on_queue = self.queue.shift();
                    //console.log("on queuee : " + first_conf_on_queue.sync);
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
                            //console.log(request);
                            //console.log("sucessCallBack");
                        },
                        error: function(request) {
                            first_conf_on_queue.error(request);
                            self.process_queue(callback);
                            self.inProgress = false;
                            //console.log(request);
                            //console.log("errorCallBack");
                        },
                        format: first_conf_on_queue.format
                    };
                    if (first_conf_on_queue.user) h["user"];
                    first_conf_on_queue.user;
                    if (first_conf_on_queue.secret) h["secret"];
                    first_conf_on_queue.secret;
                    //console.log( "process queue" ) ;
                    //console.log( first_conf_on_queue ) ;
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
                //console.log( "ajax" ) ;
                //console.log( json ) ;
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
                    pnumber = 1;;
                try {
                    if (self.request == null) self.startAjax();
                    if (!self.request) return;
                    json.url = json.url.replace(/\?&/gi, '?');
                    json.url.charAt(json.url.length - 1) == '?' ? json.url = json.url.substr(0, json.url.length - 1) : null;
                    (json.sync) ? self.request.open(json.method, json.url, false): self.request.open(json.method, json.url, true);
                    self.request.setRequestHeader('Content-type', json.method != 'GET' ? 'application/x-www-form-urlencoded' : 'text/plain');
                    //self.request.setRequestHeader("X-os", $dhx.crypt.base64_encode($dhx.REST.API.OS));
                    self.request.setRequestHeader("X-Company-ID", $dhx.REST.API.company_id || 0);
                    self.request.setRequestHeader("X-Company-Branch-ID", $dhx.REST.API.company_branch_id || 0);
                    self.request.setRequestHeader("X-Person-Group", $dhx.REST.API.group || 0);
                    self.request.setRequestHeader("X-Person-ID", $dhx.REST.API.person_id || 0);
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
                    /*( $dhx.REST.API.http_user && $dhx.REST.API.http_secret) ?
						self.request.setRequestHeader("Authorization", "Basic " +
							$dhx.crypt.base64_encode(
								$dhx.REST.API.http_user + ":" + $dhx.REST.API.http_secret
							)
						)
						:
						self.request.setRequestHeader("Authorization", "Digest " +
							$dhx.crypt.base64_encode(
								$dhx.REST.API.token
							)
						);
					*/
                    //self.request.withCredentials = true;
                    self.request.onerror = function() {
                        console.log(self.request);
                        console.log(self.request.status);
                        //var rr = '{"response" : {"response" : ' + self.request + '} }';
                        var text_response = "Error";
                        var status = self.request.status;
                        if (self.request.status == 0) {
                            text_response = "" + self.apiURL + " is offline";
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
                        if ($dhx._enable_log) console.log("=========  state changed ==========");
                        if ($dhx._enable_log) console.log(self.request.readyState);
                        if ($dhx._enable_log) console.log(self.request.status);
                        if (self.request.readyState != 4 && (self.request.status != 404 && self.request.status != 401)) {
                            try {
                                if ($dhx._enable_log) {
                                    if (self.request.readyState == 2) {
                                        if ($dhx._enable_log) console.log(self.request.readyState + " " + self.request.statusText + " sent request to " + json.url + " ");
                                        $dhx.progressOn("sending request ...");
                                    } else if (self.request.readyState == 3) {
                                        if ($dhx._enable_log) console.log(self.request.readyState + " " + self.request.statusText + " processing and receiving data packet number " +
                                            pnumber + " from " + json.url + ". ");
                                        $dhx.progressOn("processing data packet number " + pnumber + "");
                                        pnumber = pnumber + 1;
                                    }
                                }
                            } catch (e) {
                                //if( $dhx._enable_log ) console.log(e.stack);
                            }
                            return;
                        }
                        /*if (self.request.status != 200 && self.request.status != 304 && self.request.status != 0 )
						{
							console.log("error: request status: " + self.request.status)
							if( json.error )	json.error( self.request );
							return;
						}*/
                        if (self.request.readyState == 4) {
                            if ($dhx._enable_log) console.timeEnd("response received in");
                            if (self.request.status == 0) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "The API branch (" + self.apiURL + ") is offline"
                                });
                                if ($dhx._enable_log) console.warn("503 - Service Unavailable");
                                console.warn("error: request status: " + self.request.status + ". could not reach " + json.url);
                                //if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 400) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "bad request"
                                });
                                if ($dhx._enable_log) console.warn("400 - Bad request")
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
                                    //console.log("response.status " + response.status);
                                    if (response.status == "err") {
                                        if ($dhx._enable_log) console.warn(response.response);
                                        if ($dhx._enable_log) console.debug(self.request);
                                    } else {
                                        console.log(e.stack)
                                    }
                                } catch (e) {
                                    if ($dhx._enable_log) console.warn("401 - Unauthorized");
                                }
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (self.request.status == 404) {
                                dhtmlx.message({
                                    type: "error",
                                    text: "resource not found"
                                });
                                if ($dhx._enable_log) console.warn("404 - Not found");
                                if (json.error) json.error(self.request);
                                return;
                            }
                            if (typeof self.request.response === 'undefined') {
                                self.request.response = self.request.responseText;
                            }
                            if (self.request.status == 500) {
                                try {
                                    var response = JSON.parse(self.request.response);
                                    //console.log("response.status " + response.status);
                                    if (response.status == "err") {
                                        console.warn(response.response);
                                        console.debug(self.request);
                                    } else {}
                                } catch (e) {
                                    console.warn("internal server error: server side error. request status: " + self.request.status + "")
                                }
                                $dhx.progressOff("processing data packet number " + pnumber + "");
                                if (json.error) json.error(self.request);
                                return;
                            } else if (self.request.status == 502) {
                                console.warn("bad gateway: API server is offline")
                                if (json.error) json.error(self.request);
                                return;
                            } else if (self.request.status == 503) {
                                console.warn("service unavailable: API server is offline")
                                if (json.error) json.error(self.request);
                                return;
                            } else if (self.request.status == 200) {
                                if ($dhx._enable_log)
                                    if (self.request.readyState == 4) console.warn(self.request.readyState + " " + self.request.statusText +
                                        " downloaded. responseText holds complete data from " + json.url + ". ");
                                $dhx.progressOff("ready ...");
                                if (json.format = "json") {
                                    try {
                                        var response = JSON.parse(self.request.response);
                                        //console.log("response.status " + response.status);
                                        if (response.status == "err") {
                                            console.log("error message : ", response.response);
                                            if (json.error) json.error(self.request);
                                        } else {
                                            try {
                                                if (json.success) json.success(self.request)
                                            } catch (e) {
                                                if ($dhx._enable_log) console.warn(e.stack || e.message);
                                                if ($dhx._enable_log) console.warn("error on callback function");
                                                if (json.error) json.error(self.request);
                                            }
                                        }
                                    } catch (e) {
                                        if ($dhx._enable_log) console.warn("unevaluable JSON: ", self.request);
                                        if ($dhx._enable_log) console.warn(e.stack || e.message);
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
                    }
                    if (self.request.readyState == 4 && self.request.status != 0) {
                        return;
                    }
                    try {
                        //if( $dhx._enable_log ) console.log('xhr readystate: ' + self.request.readyState);
                        //if( $dhx._enable_log ) console.log('http status: ' + self.request.status);
                        if ($dhx._enable_log) console.time("response received in");
                        if ($dhx._enable_log) console.warn("-----REST client log-----");
                        if ($dhx._enable_log) console.warn(self.request.readyState + " set up " + json.method + " request for " + json.url + "");
                        window.setTimeout(function() {
                            self.request.send(json.payload);
                        }, 500);
                    } catch (e) {
                        if ($dhx._enable_log) console.warn(e.stack || e.message);
                        if ($dhx._enable_log) console.warn(self.request);
                        if (json.error) json.error(self.request);
                    }
                } catch (e) {
                    //if( $dhx._enable_log ) console.log(e.stack || e.message);
                    //if( json.error )	json.error( self.request );
                }
            },
            post: function(c) {
                    var self = $dhx.REST.API;
                    //console.log("API post");
                    if (typeof c.payload === 'undefined') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    else if (typeof c.payload === 'string')
                        if (c.payload == '') c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                        else c.payload = (($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload + "&" : "") + c.payload;
                    else c.payload = ($dhx.REST.API.default_payload) ? $dhx.REST.API.default_payload : null;
                    //console.log(c.payload);
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
                    //console.log(c.payload);
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
                // set the date we're counting down to
                var target_date = parseInt($dhx.REST.API.date_expiration);
                window.setInterval(function() {
                    // find the amount of "seconds" between now and target
                    var current_date = new Date().getTime();
                    var seconds_left = (target_date - current_date) / 1000;
                    if (target_date < current_date) {
                        $dhx.showDirections("Expired token. Please login on REST.API again ");
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
                    // format countdown string + set tag value
                    countdown.innerHTML = /*days + "d, " +*/ hours + "h, " + minutes + "m, " + seconds + "s";
                }, 1000);
            },
            authorize: function(c) {
                    var self = $dhx.REST.API,
                        url = window.location.href,
                        arr = url.split("/"),
                        origin = arr[0] + "//" + arr[2];;
                    if ($dhx.REST.API.token != '-') {
                        var target_date = parseInt($dhx.REST.API.date_expiration);
                        // find the amount of "seconds" between now and target
                        var current_date = new Date().getTime();
                        if (target_date > current_date) {
                            console.warn("You already are authenticated, bypassing the authorization ... ");
                            if (c.onSuccess) c.onSuccess($dhx.REST.API.auth_request);
                            return;
                        }
                    }
                    c.credential_token = $dhx.cookie.get("apitemp");
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
                    $dhx.showDirections(" Requesting API authorization ... ");
                    self.ajax({
                        method: "POST",
                        url: self.apiURL + "/auth.json",
                        payload: "",
                        success: success,
                        error: fail,
                        format: "json",
                        user: $dhx.crypt.base64_decode(c.credential_token).split(":")[0],
                        secret: $dhx.crypt.base64_decode(c.credential_token).split(":")[1]
                    });

                    function success(request) {
                        $dhx.hideDirections();
                        $dhx.cookie.del("apitemp");
                        var response = JSON.parse(self.request.response);
                        $dhx.REST.API.auth_status = response.auth_data.auth_status;
                        $dhx.REST.API.token = response.auth_data.token;
                        $dhx.REST.API.date_expiration = (new Number(response.auth_data.date_expiration) + 0);
                        Object.defineProperty($dhx.REST.API, 'user', {
                            value: response.auth_data.name,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'user_name', {
                            value: response.auth_data.name,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'client_session_id', {
                            value: response.auth_data.person_id,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'person_id', {
                            value: response.auth_data.person_id,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'group', {
                            value: response.auth_data.group,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'company_id', {
                            value: response.auth_data.company_id,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'company_branch_id', {
                            value: response.auth_data.company_branch_id,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'storage_quota', {
                            value: response.auth_data.storage_quota,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        Object.defineProperty($dhx.REST.API, 'time_zone', {
                            value: response.auth_data.time_zone,
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
						Object.defineProperty($dhx.REST.API, 'session', {
                            value: {
								user : $dhx.REST.API.user
								,user_name : $dhx.REST.API.user_name
								,client_session_id : $dhx.REST.API.client_session_id
								,person_id : $dhx.REST.API.person_id
								,group : $dhx.REST.API.group
								,company_id : $dhx.REST.API.company_id
								,company_branch_id : $dhx.REST.API.company_branch_id
								,storage_quota : $dhx.REST.API.storage_quota
								,time_zone : $dhx.REST.API.time_zone
							},
                            enumerable: true,
                            configurable: false,
                            writable: false
                        });
                        $dhx.REST.API.default_payload = "";
                        $dhx.REST.API.auth_request = request;
                        self._blockWhenTokenExpires();
                        if (c.onSuccess) c.onSuccess(request);
                    }

                    function fail(request) {
                        $dhx.cookie.del("apitemp")
                        var response = eval('(' + request.response + ')');
                        if (c.onFail) c.onFail(request);
                        $dhx.showDirections("Error: " + response.response);
                    }
                } // end authorize
        } // end API
    } // end REST
