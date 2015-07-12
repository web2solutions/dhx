/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.desktop = {
	version: '1.0.3'
	, database : 'juris'
	, ws : 'ws://10.0.0.9:4000/'
	, socket : ''
	, user_settings : null
	, wallpappers_path : $dhx.ui.cdn_address + "/dhx/ui/desktop/assets/wallpapers/"
	, readUserSettings : function( c ){
		var that = $dhx.ui
			, self = that.desktop,
			schema = that.data.model.db[self.database].schema;
			
		schema.desktop_config.search.where({
            query: {
                and: { user_id : $dhx.ui.$Session.user_id},
            },
            onFound: function(record_id, record, tx, event) {
                
            },
            onReady: function(records, tx, event) {
               if( records.length > 0 )
			   {
				   //$dhx.debug.log( records[0] );
				   
				   $dhx.ui.desktop.user_settings = records[0];
				   $dhx.ui.$Session.latinize = $dhx.ui.desktop.user_settings.latinize;
				   $dhx.ui.$Session.capitalize = $dhx.ui.desktop.user_settings.capitalize;
				   
				   if( c.onSuccess ) c.onSuccess()
			   }
			   else
			   {
				   $dhx.notify('Settings error', 'could not find settings for this user: ' + $dhx.ui.$Session.user_id + '\nDesktop can not start', 'icons/db.png');
			   }
			   
            },
            onerror: function() {
                $dhx.notify('Settings error', 'could not find settings for this user: ' + $dhx.ui.$Session.user_id + '\nDesktop can not start', 'icons/db.png');
            }
        });
	}
	, start: function (c) {
		var that = $dhx.ui
			, self = that.desktop,
			tmessage = 'T-Rex is attacking in';
			
		if( $dhx.jDBdStorage.get('$dhx.ui.desktop.isOnline') == 'yes' )
		{
			$dhx.notify('Loading error', 'You can not use this application in two tabs. Please use another browser', 'icons/db.png');
			return;	
		}
		
		$dhx.debug.time(tmessage);
		
		dhtmlx.message.position="bottom";
			
		$dhx.REST.API.login({
			onSuccess : function(){
				$dhx.REST.API.get({
					resource: "/database/model"
					, format: "json"
					, payload: ""
					, onSuccess: function (request) {
						var json = JSON.parse(request.response);
						if (json.status == "success") {
							//$dhx.debug.log(json);
							$dhx.ui.data.model.start({
								db: $dhx.ui.temp.db
								, version: json.version
								, schema: json.schema
								, settings: json.settings
								, records: json.records
								, output_tables: json.output_tables
								, onSuccess: function () {
									self.readUserSettings({
										onSuccess: function () {
											$dhx.ui.desktop.socket = new $dhx.socket.service({
												resource: $dhx.ui.desktop.ws
												, reConnect: true
												, onOpen: function (messageEvent, isReconnect) {
													
													$dhx.ui.desktop.socket.send({
														message: $dhx.ui.$Session.user + ' is online'
														, action: 'notify all users'
													});
													
													if(self.view.TopBar.quick_tools_socket)
													{
														self.view.TopBar.quick_tools_socket.style.backgroundImage = 'url('+ $dhx.ui.cdn_address + 'dhx/ui/desktop/assets/icons/socket.gif)';
														self.view.TopBar.quick_tools_socket.title = $dhx.ui.language.realtime_communication_is_on;
													}
													
													if( isReconnect )
													{
														
													}
													else
													{
														$dhx.jDBdStorage.storeObject('$dhx.ui.desktop.isOnline', 'yes');
														window.onbeforeunload = function(e) {
														  $dhx.jDBdStorage.storeObject('$dhx.ui.desktop.isOnline', 'no');
														};
														$dhx.ui.desktop.view.render({});
														$dhx.debug.timeEnd(tmessage);
													}
													
												}
												, onClose: function (messageEvent) {
													
													if(self.TopBar.quick_tools_socket)
													{
														self.view.TopBar.quick_tools_socket.style.backgroundImage = 'url('+ $dhx.ui.cdn_address + 'dhx/ui/desktop/assets/icons/socket_disconnected.png)';
														self.view.TopBar.quick_tools_socket.title = $dhx.ui.language.realtime_communication_is_off;
													}
												}
												, onBeforeClose: function (user_id) {
												}
												, onBeforeSend: function () {
												}
												, onMessage: function (message, messageEvent) {
													if(self.view.TopBar.quick_tools_socket)
													{
														var myImage = new Image();
														myImage.src = $dhx.ui.cdn_address + 'dhx/ui/desktop/assets/icons/socket.gif?uid=' + (new Date().getTime());
														myImage.onload = function(){
															//self.view.TopBar.quick_tools_socket.style.backgroundImage = 'none';
															self.view.TopBar.quick_tools_socket.style.backgroundImage = 'url('+myImage.src+')';
														}
													}
														
													if (message.action) {
														
														if (message.action == 'notify all users') {
															dhtmlx.message({
																//type: "error",
																text: message.message
															});
														}
														else {
															$dhx.jDBdStorage.storeObject('message.' + message.topic, JSON.stringify(message));
															$dhx.MQ.oldPublish(message.topic, message);
														}
														
													}
												}
												, onError: function (messageEvent) {
													$dhx.debug.timeEnd(tmessage);
												}
											});
											
											
											
										}
										, onFail: function () {
											$dhx.debug.timeEnd(tmessage);
											dhtmlx.message({
												type: "error"
												, text: 'Any configuration was found for user ' + $dhx.ui.$Session.user_id
											});
										}
									}); // end readUserSettings
								}
								, onFail: function () {
									$dhx.debug.timeEnd(tmessage);	
								}
							}); // end model start
						}
					}
					, onFail: function (request) {
						//var json = JSON.parse(request.response);
						$dhx.debug.timeEnd(tmessage);
					} // end request model
				});
			}
			,onFail : function(){
				$dhx.debug.timeEnd(tmessage);
				dhtmlx.message({
					type: "error",
					text: 'Denied access'
				});
			}	
		})
	}
};

$dhx.ui.desktop.application = {
	cruder: function (c) {
		this.summary = c.summary || '$dhx application';
		this.icon = c.icon || 'bogus.png';
		this.database = c.database
		this.collection = c.collection
		this.appId = '$dhx.ui.crud.simple.' + c.collection + '_app';
		this.appName = 'cruder ' + c.collection;
		this.module = {};
		this.summary = c.summary || '$dhx application';
		this.column_to_search_id = c.column_to_search_id || false;
		this.column_to_search_index = c.column_to_search_index || false;
	}
	, custom: function (c) {
		this.appName = c.appName;
		this.appId = c.appId;
		this.database = c.database
		this.collection = c.collection
		this.summary = c.summary || '$dhx application';
		this.icon = c.icon || 'bogus.png';
		this.module = c.module;
	}
}


$dhx.ui.desktop.Registry = {
	programs: [
		
	]
	, cruders: [
		new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'persons.png'
			, collection: 'entidades'
			, database: 'juris'
			, summary: 'Cadastro de pessoas'
			, column_to_search_id : 'entidade_id'
			, column_to_search_index : 'nome'
		})
		, new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'group.png'
			, collection: 'grupos'
			, database: 'juris'
			, summary: 'Cadastro de grupo de usuário'
			, column_to_search_id : 'grupo_id'
			, column_to_search_index : 'grupo'
		})
		, new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'foo.png'
			, collection: 'empresas'
			, database: 'juris'
			, summary: 'Cadastro de Empresas'
			, column_to_search_id : 'empresa_id'
			, column_to_search_index : 'empresa'
		})
		
		/*, new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'foo.png'
			, collection: 'desktop_wallpapers'
			, database: 'juris'
			, summary: 'Cadastro de wallpapers'
			, column_to_search_id : 'desktop_wallpaper_id'
			, column_to_search_index : 'name'
		}), new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'foo.png'
			, collection: 'desktop_config'
			, database: 'juris'
			, summary: 'Configurações de desktop'
			//, column_to_search_id : 'desktop_config_id'
			//, column_to_search_index : 'desktop_config'
		})*/
	]
};