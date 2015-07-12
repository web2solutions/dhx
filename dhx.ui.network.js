/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx*/


$dhx.ui.network = {
	state : navigator.onLine ? 'online' : 'offline'
	,host : window.location.host
	,cdn : $dhx.CDN
	,REST : $dhx.REST.API
	,socket : null
	,start : function( c ){
		c = c || {};
		window.addEventListener('online',  function(){
			$dhx.ui.net.state = 'online';
		});
		window.addEventListener('offline', function(){
			$dhx.ui.net.state = 'offline';
		});	
		
		if(c.onSuccess)
		{
			c.onSuccess();	
		}
	}
};