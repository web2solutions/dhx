/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject, dbDemo */

$dhx.ui.crud.simple = function(configuration) {
	console.log(configuration);
    try {
        var that = $dhx.ui.crud,
            self = this,
            defaultView = $dhx.ui.crud.simple.View,
			schema = $dhx.ui.data.model.db[configuration.database].schema[configuration.collection];
		self.appId = '$dhx.ui.crud.simple.' + configuration.collection + '_app';	
		
		
		//alert( '$dhx.ui.crud.simple.View.generic.window.' + self.appId )
		
		//console.log('$dhx.ui.crud.simple.View.generic.window.' + self.appId)
		//console.log(self.appId);
		//console.log($dhx.ui.window_manager);
		
		if ($dhx.ui.window_manager.isWindow('$dhx.ui.crud.simple.View.generic.window.' + self.appId)) {
			console.log(self);
            $dhx.ui.crud.controller[self.appId].view.window[self.appId].show();
            $dhx.ui.crud.controller[self.appId].view.window[self.appId].bringToTop();
            return;
        }
		
		//alert('passei');

        self.base_path = $dhx.CDN;
        self.appName = configuration.collection + '_app';
        self.database = configuration.database;
        self.version = 0.1;
        
        self.collection = configuration.collection;
        //self.item = configuration.item;
        self.type = 'simple';

        self.configuration = configuration;
		//alert( self.configuration.wrapper );
        self.configuration.wrapper = self.configuration.wrapper;
		
		// check if a custom view was passed to constructor
        if (configuration.customView) {
            defaultView = configuration.customView;
        }

		if( typeof configuration.base_path === 'undefined' )
		{
			if( window.location.host.indexOf('web2.eti.br') != -1 )
			{
				configuration.base_path = "http://mac.web2.eti.br/";
			}
			else
			{
				configuration.base_path = 'http://cdn.dhtmlx.com.br/';
			}
		}

		// set internal paths
        $dhx.ui.crud.simple.View.settings.base_path = configuration.base_path;
        $dhx.ui.crud.simple.View.settings.application_path = $dhx.ui.crud.simple.View.settings.base_path + "dhx/ui/";
        $dhx.ui.crud.simple.View.settings.icons_path = $dhx.ui.crud.simple.View.settings.application_path + $dhx.ui.skin + "/";
        //self.view.settings.icons_path = $dhx.ui.crud.simple.View.settings.icons_path;
        $dhx.ui.crud.simple.View.settings.ribbon.icons_path = $dhx.ui.crud.simple.View.settings.application_path + $dhx.ui.skin + "/";
        $dhx.ui.crud.simple.View.settings.menu.icons_path = $dhx.ui.crud.simple.View.settings.application_path + $dhx.ui.skin + "/";
		$dhx.ui.crud.simple.View.settings.menu_grid.icons_path = $dhx.ui.crud.simple.View.settings.application_path + $dhx.ui.skin + "/";
        $dhx.ui.crud.simple.View.settings.dhtmlx_codebase_path = configuration.base_path + 'codebase4.2_std/';

		// implement destroy via new $dhx.ui.crud.simple().destroy()
		this.destroy = function(){
			$dhx.ui.crud.controller[self.appId].view.destroy(self.appId, schema);
		}
		this.close = function(){
			self.configuration.wrapper.close();
		}

		// extend the defined view as the controller view
        this.view = $dhx.extend(defaultView, {});
		
        $dhx.ui.crud.controller[self.appId] = this;
		
		//$dhx.ui.crud.view[self.appId] = this.view;

        self.view.render(this);
		
    } catch (e) {
        if ($dhx._enable_log) console.log(">>> error when starting component:");
        console.log(e.stack);
        if ($dhx._enable_log) console.log(">>>>>>>>>");
    }
}