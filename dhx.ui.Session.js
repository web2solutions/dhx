/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.$Application = (function() {

    return {};
})();



$dhx.ui.$Session = (function() {

    return {
	
		latinize : false
		,capitalize : false	
		
	};
})();

Object.defineProperty($dhx.ui.$Session, 'user_id', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: (
        (typeof $dhx.REST !== 'undefined') ? (typeof $dhx.REST.API.session.user_id !== 'undefined' ?
            $dhx.REST.API.session.user_id : 3) : 3
    ),
    enumerable: true,
    configurable: false,
    writable: true
});
Object.defineProperty($dhx.ui.$Session, 'SessionID', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: (
        (typeof $dhx.REST !== 'undefined') ? (typeof $dhx.REST.API.session.client_session_id !== 'undefined' ?
            $dhx.REST.API.session.client_session_id : -1) : -1
    ),
    enumerable: true,
    configurable: false,
    writable: true
});
if ($dhx.REST)
    $dhx.ui.$Session = $dhx.extend($dhx.REST.API.session, $dhx.ui.$Session);
