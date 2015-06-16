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
				   //console.log( records[0] );
				   
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
			, self = that.desktop;
			
		$dhx.ui.login.render(
		{
			onGranted : function()
			{
				
				$dhx.REST.API.get({
					resource: "/database/getmodel",
					format: "json",
					payload: "",
					onSuccess: function(request) {
						var json = JSON.parse(request.response);
						if (json.status == "success") {
							console.log(json);							
							$dhx.ui.data.model.start(
							{
								db: $dhx.ui.temp.db
								, version: json.version
								, schema: json.schema
								, settings: json.settings
								, records: json.records
								, output_tables: json.output_tables
								, onSuccess: function () {
									self.readUserSettings({
										onSuccess : function(){
											$dhx.ui.desktop.view.render();
											
											$dhx.ui.desktop.socket = new $dhx.socket.service(
											{
												resource : 	$dhx.ui.desktop.ws
												,reConnect : true
												,onOpen : function( messageEvent ){
													$dhx.ui.desktop.socket.send( { message : $dhx.ui.$Session.user + ' is online', action : 'notify all users' } );
												}
												,onClose : function( messageEvent ){
													
												}
												,onBeforeClose : function( user_id ){
									
												}
												,onBeforeSend : function( ){
									
												}
												,onMessage : function( data, messageEvent )
												{
													if(data.action)
													{
														if(data.action == 'notify all users')	
														{
															dhtmlx.message({
																//type: "error",
																text: data.message
															});
														}
													}
												}
												,onError : function( messageEvent ){
									
												}
											});
											
											
											
										}
										,onFail : function(){
											dhtmlx.message({
												type: "error",
												text: 'Any configuration was found for user ' + $dhx.ui.$Session.user_id
											});
										}	
									}); // end readUserSettings
								}
								, onFail: function () {}
							}); // end model start
							
						}
					},
					onFail: function(request) {
						var json = JSON.parse(request.response);
					}
				});
				
				/*
				,version :2
					,schema : my_db_structure.schema
					,settings : my_db_structure.settings
					,records : my_db_structure.records
					,output_tables : my_db_structure.output_tables
				*/
				
				
			}
			,onDenied : function(){
				dhtmlx.message({
					type: "error",
					text: 'Denied access'
				});
			}	
		});
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
		
		, new $dhx.ui.desktop.application.cruder({
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
		})
	]
};