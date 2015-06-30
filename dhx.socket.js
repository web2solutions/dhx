/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */

$dhx = $dhx || {};
$dhx.socket = $dhx.socket || {
	message : function( m ){
		var self = $dhx.extend(m, this);
		
		self.action = m.action || 'none';
		self.user_id = $dhx.ui.$Session.user_id || 6;
		self.message = m.message || '$dhx system';       
        self.name = m.name || 'none';
		self.records = m.records || [];
		self.record_id = m.record_id || -1;
		self.status = m.status || 'none';
		self.target = m.target || 'none';
		self.client_session_id = $dhx.ui.$Session.client_session_id;
		self.topic = m.topic || '$dhx.socket';
		self.browser = $dhx.Browser.name;
		self.userAgent = navigator.userAgent;
		return self;
	}
	,tryin : 2 // seconds
	,connect : function( s, c, reconnect ){
		var socket = new WebSocket(c.resource)
		socket.onopen = function (event) {
			//$dhx.debug.log('socket onopen: ');
			// lets set the client id to the socket transaction
			var message = s.send( { message : 'login', action : 'set user' } );	
			if(reconnect)
			{
				$dhx.debug.info('socket reconnected. user id: ', message.user_id);
				if (c.onOpen) c.onOpen(event, true);
			}
			else
			{
				$dhx.debug.info('socket connected. user id: ', message.user_id);
				if (c.onOpen) c.onOpen(event, false);
			}
		};
		socket.onclose = function (event) {
			$dhx.debug.warn('socket closed');
			if (c.onClose) c.onClose();
			if (c.reConnect)
			{
				$dhx.debug.warn('reconnecting in '+$dhx.socket.tryin+' seconds');
				var timer = window.setTimeout(function(){
					$dhx.debug.warn('reconnecting now');
					s.reconnect();
					window.clearTimeout(timer);
				}, $dhx.socket.tryin * 1000);
			}
		};
		socket.onerror = function (event) {
			$dhx.debug.error('socket error');
			if (c.onError) c.onError(event);
		};
		socket.onmessage = function (event) {
			
			if(event.data.message != 'keep alive')
			{
				//$dhx.debug.log('socket onmessage: ', event.data);
			}			
			if(typeof event.data !== 'undefined' )
			{
				try
				{
					var data = JSON.parse(event.data);
					if(data.message != 'keep alive')
					{
						$dhx.debug.info('socket received data: ', data);
					}
					if (c.onMessage) c.onMessage(data, event);	
				}
				catch(e)
				{
					$dhx.debug.error( e.stack );
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
				$dhx.debug.error('Please send your message in JSON format.');
				$dhx.debug.info('message sent: ', m);
				$dhx.debug.info('format sent: ', typeof m);
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