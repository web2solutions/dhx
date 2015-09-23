/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.desktop = {
	version: '1.0.3'
	, database : 'juris'
	, ws : 'ws://socket.dhtmlx.com.br/'
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
				   
				   //console.log( records[0] );
				   
				   $dhx.ui.desktop.user_settings = records[0];
				   
				   if( ! $dhx.defined($dhx.ui.desktop.user_settings.wallpaper, 'string')  )
				   {
						$dhx.ui.desktop.user_settings.wallpaper = 'default.jpg'
				   }
				   
				   if( ! $dhx.defined($dhx.ui.desktop.user_settings.wallpaperposition, 'string')  )
				   {
						$dhx.ui.desktop.user_settings.wallpaperposition = 'cover'
				   }
				   
				   
				   $dhx.ui.$Session.latinize = $dhx.ui.desktop.user_settings.latinize;
				   $dhx.ui.$Session.capitalize = $dhx.ui.desktop.user_settings.capitalize;
				   /*
				   wallpaper: "unity.jpg"
					wallpaperposition: "center"
				   */
				   
				   
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
	
	, readPlugins : function( c ){
		var that = $dhx.ui
			, self = that.desktop,
			schema = that.data.model.db[self.database].schema.t_rex_plugins;
			
			
			
		schema.load(function(records, rows_affected, tx, event) {
                    //console.log(records)
					
					for(var r in records)
					{
						if( records.hasOwnProperty(r) )
						{
							
							
							$dhx.ui.desktop.plugins.packages.push( records[r].record );
							$dhx.ui.desktop.plugins.files.push( $dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/t_rex_plugins/"+records[r].record.t_rex_plugins_id+"/"+records[r].record.file );
						}
					}
					
					
					
					if( c.onSuccess ) c.onSuccess()

                }, function(tx, event, error_message) {
                    $dhx.debug.log(error_message);
        });
			
		
	}
	
	,setCruders : function( json ){
		var that = $dhx.ui
			, self = that.desktop,
			tables = [],
			tnames = [];
			
		//console.log(json.schema);
		for(table in json.schema)
		{
			if( json.schema.hasOwnProperty(table) )
			{
				json.schema[ table ].table_name = table;
				tables.push(json.schema[ table ]);
				//tnames.push(table);
			}
		}
		tables.sort(function (a, b) {
			return a.output_ordering - b.output_ordering;
		});
	
		tables.forEach(function( tableObj, index )
		{
			var table = tableObj.table_name;
			if(tableObj.render_as_cruder == 1)
			{
				if( tableObj.column_to_search_id && tableObj.column_to_search_index )
				{
					//console.log(table, json.schema[ table ]);
					//console.log( table );
					$dhx.ui.desktop.Registry.cruders.push(
						new $dhx.ui.desktop.application.cruder({
							icon: ( tableObj.icon == null ||  tableObj.icon == '' ) ? 'foo.png' : tableObj.icon
							, collection: table
							, database: $dhx.ui.desktop.database
							, summary: tableObj.summary || tableObj.grid_name || ''
							, column_to_search_id : tableObj.column_to_search_id
							, column_to_search_index : tableObj.column_to_search_index
						})
					);	
				}
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
		
		// ================>
		$dhx.REST.API.login({
			onSuccess : function(){
				// ================>
				$dhx.REST.API.get({
					resource: "/database/model"
					, format: "json"
					, payload: ""
					, onSuccess: function (request) {
						var json = JSON.parse(request.response);
						if (json.status == "success") {
							//$dhx.debug.log(json);
							// ================>
							$dhx.ui.data.model.start({
								db: $dhx.ui.temp.db
								, version: json.version
								, schema: json.schema
								, settings: json.settings
								, records: json.records
								, output_tables: json.output_tables
								, onSuccess: function () {								
									// ================>
									self.readUserSettings({
										onSuccess: function () {
											
											
											self.setCruders( json );
											
											
											
											// ================>
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
														 // $dhx.ui.desktop.socket.close();
														};
														$dhx.ui.desktop.view.render({});
														$dhx.debug.timeEnd(tmessage);
														
														
														
													}
													
												}
												, onClose: function (messageEvent) {
													if(self.TopBar)
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
															try
															{
																self.view.TopBar.quick_tools_socket.style.backgroundImage = 'url('+myImage.src+')';
															}
															catch(e)
															{
																console.log(e.stack);
															}
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
		/*new $dhx.ui.desktop.application.cruder({
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