/*! dhx 2015-06-01 */
$dhx.socket={Socket:[],isConnected:[],clientID:[],defaultRouting_key:"welcome",defaultPipe:"main pipe",connect:function(a){var b=$dhx.socket;return"WebSocket"in window?(a.pipe=a.pipe||b.defaultPipe,"undefined"==typeof b.isConnected[a.pipe]&&(b.isConnected[a.pipe]=!1),"undefined"==typeof b.clientID[a.pipe]&&(b.clientID[a.pipe]=null),b.isConnected[a.pipe]||(b.Socket[a.pipe]=new WebSocket(a.resource),b.Socket[a.pipe].onopen=function(){b.isConnected[a.pipe]=!0,a.onOpen&&a.onOpen(arguments)},b.Socket[a.pipe].onclose=function(b){a.onClose&&a.onClose()},b.Socket[a.pipe].onerror=function(b){a.onError&&a.onError(b)},b.Socket[a.pipe].onmessage=function(c){var d=JSON.parse(c.data);d?(d.type&&"hippie.pipe.set_client_id"==d.type&&d.client_id&&(b.clientID[a.pipe]=d.client_id),a.onMessage&&a.onMessage(d,c)):a.onMessage&&a.onMessage({msg:"no data when onMessage"},c)},b.Socket[a.pipe].Send=function(c,d){try{if(a.onBeforeSend&&a.onBeforeSend(c),$dhx.isObject(c)){if("undefined"==typeof c.message)return void dhtmlx.message({type:"error",text:"Hey Mark, I can't send an empty message"});"undefined"==typeof c.routing_key&&(c.routing_key=b.defaultRouting_key),"undefined"==typeof c.type&&(c.type="message"),c=JSON.stringify(c)}else{if(!c||null==c||""==c)return void dhtmlx.message({type:"error",text:"Hey Mark, I can't send an empty message"});c=JSON.stringify({type:"message",message:c,routing_key:b.defaultRouting_key})}c=JSON.stringify({msg:c}),b.Socket[a.pipe].send(c)}catch(e){console.log(e)}},b.Socket[a.pipe].Close=function(){a.onBeforeClose&&a.onBeforeClose(b.clientID[a.pipe]),b.Socket[a.pipe].Send({type:"disconnect",clientID:b.clientID[a.pipe],message:"client id: "+b.clientID[a.pipe]+" disconnected via onBeforeClose"}),b.Socket[a.pipe].close()},b.Socket[a.pipe].getClientID=function(){return b.clientID[a.pipe]},window.setInterval(function(){0==b.Socket[a.pipe].readyState&&a.onError&&a.onError("The connection is not yet open."),2==b.Socket[a.pipe].readyState&&a.onError&&a.onError("The connection is in the process of closing."),"3"==b.Socket[a.pipe].readyState&&a.onError&&a.onError("The connection is closed or couldn't be opened.")},1e3),window.onbeforeunload=function(a){b.disconnectAll()}),b.Socket[a.pipe]):{send:function(){console.log("$dhx socket: browser not supported")}}},disconnectAll:function(){var a=$dhx.socket;for(var b in a.Socket)a.Socket[b].Close()}};