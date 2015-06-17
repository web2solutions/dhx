/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */

$dhx = $dhx || {};
$dhx.socket = $dhx.socket || {
	message : function( m ){
		var self = this;
		
		self = $dhx.extend(m, this);
		
		self.action = m.action || 'none';
		self.user_id = $dhx.ui.$Session.user_id || 6;
		self.message = m.message || '$dhx system';       
        self.name = m.name || 'none';
		self.records = m.records || [];
		self.record_id = m.record_id || -1;
		self.status = m.status || 'none';
		self.target = m.target || 'none';
		self.topic = m.topic || '$dhx.socket';
		//self.browser = m.topic || '$dhx.socket';
		return self;
	}
	,tryin : 3 // seconds
	,connect : function( s, c, reconnect ){
		var socket = new WebSocket(c.resource)
		socket.onopen = function (event) {
			//if ($dhx._enable_log) console.log('socket onopen: ');
			// lets set the client id to the socket transaction
			var message = s.send( { message : 'login', action : 'set user' } );	
			if(reconnect)
			{
				if ($dhx._enable_log) console.info('socket reconnected. user id: ', message.user_id);
				if (c.onOpen) c.onOpen(event, true);
			}
			else
			{
				if ($dhx._enable_log) console.info('socket connected. user id: ', message.user_id);
				if (c.onOpen) c.onOpen(event, false);
			}
			
		};
		socket.onclose = function (event) {
			if ($dhx._enable_log) console.warn('socket closed');
			if (c.onClose) c.onClose();
			if (c.reConnect)
			{
				
				if ($dhx._enable_log) console.warn('reconnecting in '+$dhx.socket.tryin+' seconds');
				var timer = window.setTimeout(function(){
					if ($dhx._enable_log) console.warn('reconnecting now');
					s.reconnect();
					window.clearTimeout(timer);
				}, $dhx.socket.tryin * 1000);
			}
		};
		socket.onerror = function (event) {
			if ($dhx._enable_log) console.error('socket error');
			if (c.onError) c.onError(event);
		};
		socket.onmessage = function (event) {
			
			if(event.data.message != 'keep alive')
			{
				//if ($dhx._enable_log) console.log('socket onmessage: ', event.data);
			}
			
			
			if(typeof event.data !== 'undefined' )
			{
				try
				{
					var data = JSON.parse(event.data);
					if(data.message != 'keep alive')
					{
						if ($dhx._enable_log) console.info('socket received data: ', data);
					}
					if (c.onMessage) c.onMessage(data, event);	
				}
				catch(e)
				{
					console.error( e.stack );
				}
			}
		};
		return socket;
	}
	,service : function( c ){
		var self = $dhx.socket, socket;
		socket = self.connect(this, c);
		this.send = function( m, callBack ){
			
			if( $dhx.isObject(m) )
			{
				
				m = JSON.stringify(new $dhx.socket.message( m ));
				socket.send(m);
			}
			else
			{
				dhtmlx.message({
                    type: "error",
                    text: 'error sending message via socket'
                }); //
				console.error('Please send your message in JSON format.');
				console.info('message sent: ', m);
				console.info('format sent: ', typeof m);
				return {};
			}
			return JSON.parse(m);
		}
		this.reconnect = function(){
			socket = self.connect(this, c, true)
		}
		//this
	}
}