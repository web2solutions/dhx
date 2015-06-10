/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.desktop = {
	version: '1.0.3'
	, database : 'juris'
	, user_settings : null
	, wallpappers_path : $dhx.ui.cdn_address + "/dhx/ui/desktop/assets/wallpapers/"
	, readUserSettings : function( c ){
		var that = $dhx.ui
			, self = that.desktop,
			schema = that.data.model.db[self.database].schema;
			
		schema.desktop_config.search.where({
            query: {
                and: { person_id : $dhx.ui.$Session.user_id},
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
			   
            },
            onerror: function() {
                
            }
        });
	}
	, start: function (c) {
		var that = $dhx.ui
			, self = that.desktop;
		self.readUserSettings({
			onSuccess : function(){
				$dhx.ui.desktop.view.render();
			}
			,onFail : function(){
				dhtmlx.message({
                    type: "error",
                    text: 'Any configuration was found for user ' + $dhx.ui.$Session.user_id
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
			, collection: 'persons'
			, database: 'juris'
			, summary: 'Cadastro de pessoas'
			, column_to_search_id : 'person_id'
			, column_to_search_index : 'name'
		})
		, new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'group.png'
			, collection: 'groups'
			, database: 'juris'
			, summary: 'Cadastro de grupo de usuário'
			, column_to_search_id : 'group_id'
			, column_to_search_index : 'group'
		})
		, new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'foo.png'
			, collection: 'companies'
			, database: 'juris'
			, summary: 'Cadastro de Empresas'
			, column_to_search_id : 'company_id'
			, column_to_search_index : 'company'
		})
		, new $dhx.ui.desktop.application.cruder({
			summary: ''
			, icon: 'foo.png'
			, collection: 'company_branches'
			, database: 'juris'
			, summary: 'Cadastro de filiais'
			, column_to_search_id : 'company_branch_id'
			, column_to_search_index : 'company_branch'
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