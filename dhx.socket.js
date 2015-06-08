/*

		var msg = {
			type : ""	// message, subscribe, disconnect    -> mandatory
			,routing_key : ""			-> mandatory when type = subscribe
			,message : ""

		}

		var socket = $dhx.socket.connect(
		{
			resource : 	"ws://192.168.1.33:5000/_hippie/ws"
			,routing_key : "users online"
			,onOpen : function( messageEvent ){

			}
			,onClose : function( messageEvent ){

			}
			,onBeforeClose : function( client_id ){

			}
			,onBeforeSend : function( ){

			}
			,onMessage : function( data, messageEvent )
			{

			}
			,onError : function( error ){

			}
		});





		$(function() {
			// ws_path should be of the form ws://host/_hippie/ws
			var ws_path = "ws://192.168.1.33:5000/_hippie/ws";
			socket = new WebSocket(ws_path);
			socket.onopen = function() {
				$('#connection-status').text("Connected");
			};
			socket.onmessage = function(e) {
				var data = JSON.parse(e.data);
				console.log(e);
				if (data.msg) {
					var time = Date();
					$('ul').prepend('<li>' + time + ': ' + data.msg + '</li>');
				}
			};
		});

		function send_msg(message) {
			socket.send(JSON.stringify({ msg: message }));
		}

		*/
$dhx.socket = {
    Socket: [],
    isConnected: [],
    clientID: [],
    defaultRouting_key: "welcome",
    defaultPipe: "main pipe",
    connect: function(configuration) {
        var self = $dhx.socket;
        if ("WebSocket" in window) {
            configuration.pipe = configuration.pipe || self.defaultPipe;
            if (typeof self.isConnected[configuration.pipe] === 'undefined') self.isConnected[configuration.pipe] = false;
            if (typeof self.clientID[configuration.pipe] === 'undefined') self.clientID[configuration.pipe] = null;
            if (!self.isConnected[configuration.pipe]) {
                self.Socket[configuration.pipe] = new WebSocket(configuration.resource);
                self.Socket[configuration.pipe].onopen = function() {
                    //console.log(arguments);
                    self.isConnected[configuration.pipe] = true;
                    //already subscribed to welcome routing_key via on_new_listenerss
                    //self.Socket[ configuration.pipe ].Send( 'subscribed to welcome routing_key via on_new_listeners' );
                    /*self.Socket[ configuration.pipe ].Send( {
							type : 'id'// message, subscribe    -> mandatory
							,message : 'subscribing'
						} );*/
                    if (configuration.onOpen) configuration.onOpen(arguments);
                };
                self.Socket[configuration.pipe].onclose = function(messageEvent) {
                    if (configuration.onClose) configuration.onClose();
                };
                self.Socket[configuration.pipe].onerror = function(error) {
                    if (configuration.onError) configuration.onError(error);
                };
                self.Socket[configuration.pipe].onmessage = function(messageEvent) {
                    //console.log( messageEvent );
                    var data = JSON.parse(messageEvent.data);
                    if (data) {
                        if (data.type && data.type == "hippie.pipe.set_client_id") {
                            if (data.client_id) {
                                self.clientID[configuration.pipe] = data.client_id;
                            }
                        } else {}
                        if (configuration.onMessage) configuration.onMessage(data, messageEvent);
                    } else
                    if (configuration.onMessage) configuration.onMessage({
                        msg: "no data when onMessage"
                    }, messageEvent);
                };
                /*self.Socket[ configuration.pipe ].Send = self.Socket[ configuration.pipe ].send;*/
                self.Socket[configuration.pipe].Send = function(m, callBack) {
                        try {
                            if (configuration.onBeforeSend) configuration.onBeforeSend(m);
                            if ($dhx.isObject(m)) {
                                //console.log("im object");
                                if (typeof m["message"] === 'undefined') {
                                    dhtmlx.message({
                                        type: "error",
                                        text: "Hey Mark, I can't send an empty message"
                                    });
                                    return;
                                }
                                if (typeof m["routing_key"] === 'undefined') m["routing_key"] = self.defaultRouting_key;
                                if (typeof m["type"] === 'undefined') m["type"] = "message";
                                //console.log( m );
                                //var dataObj = JSON.parse( m["data"] ) ;
                                //if( typeof dataObj["type"] === 'undefined' )
                                //	dataObj["type"] = m["type"];
                                //m["data"] = JSON.stringify( dataObj );
                                m = JSON.stringify(m);
                            } else {
                                if (m && m != null && m != "") {
                                    m = JSON.stringify({
                                        type: "message",
                                        message: m,
                                        routing_key: self.defaultRouting_key
                                    });
                                } else {
                                    dhtmlx.message({
                                        type: "error",
                                        text: "Hey Mark, I can't send an empty message"
                                    });
                                    return;
                                }
                            }
                            m = JSON.stringify({
                                msg: m
                            });
                            //console.log( m );
                            self.Socket[configuration.pipe].send(m);
                            //console.log(m);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    //self.Socket[ configuration.pipe ].Close = self.Socket[ configuration.pipe ].close;
                self.Socket[configuration.pipe].Close = function() {
                    if (configuration.onBeforeClose) configuration.onBeforeClose(self.clientID[configuration.pipe]);
                    self.Socket[configuration.pipe].Send({
                        type: "disconnect",
                        clientID: self.clientID[configuration.pipe],
                        message: "client id: " + self.clientID[configuration.pipe] + " disconnected via onBeforeClose"
                    });
                    self.Socket[configuration.pipe].close();
                }
                self.Socket[configuration.pipe].getClientID = function() {
                    return self.clientID[configuration.pipe];
                }
                window.setInterval(function() {
                    //console.log( self.Socket[ configuration.pipe ].readyState )
                    if (self.Socket[configuration.pipe].readyState == 0)
                        if (configuration.onError) configuration.onError("The connection is not yet open.");
                    if (self.Socket[configuration.pipe].readyState == 2)
                        if (configuration.onError) configuration.onError("The connection is in the process of closing.");
                    if (self.Socket[configuration.pipe].readyState == "3")
                        if (configuration.onError) configuration.onError("The connection is closed or couldn't be opened.");
                }, 1000);
                window.onbeforeunload = function(e) {
                    self.disconnectAll();
                }
            }
            return self.Socket[configuration.pipe];
        } else {
            return {
                send: function() {
                    console.log("$dhx socket: browser not supported");
                }
            };
        }
    },
    disconnectAll: function() {
        var self = $dhx.socket;
        for (var routing_key in self.Socket) {
            self.Socket[routing_key].Close();
        }
    }
}
