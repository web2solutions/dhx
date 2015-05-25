/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject, dbDemo */

$dhx.ui = $dhx.ui || {
	cdn_address : $dhx.CDN
	,require: function (dependencies, callBack) {
		'use strict';
		$dhx.onDemand.load(dependencies, function () {
			if (callBack) {
				callBack();
			}
		});
	}
	,window_manager : null
	,window_manager_is_ready : false
	,_window_manager: function ( skin ) {
		'use strict';
		var self = $dhx.ui, skin = skin || 'dhx_terrace';
		if( ! self.window_manager_is_ready )
		{
			self.window_manager = new dhtmlXWindows({
				skin:skin
			});
			self.window_manager.setSkin('dhx_terrace');
			self.window_manager_is_ready = true;
		}
	}
	
	,start : function( c ){
		'use strict';
		var self = $dhx.ui,
			dependencies = [  ];
			
		
		
		if( window.location.host.indexOf('web2.eti.br') != -1 )
		{
			$dhx.environment = "test";
			$dhx.ui.cdn_address = '//mac.web2.eti.br/';
		}
		else
		{
			$dhx.environment = "production";
		}
		
		if( c.dhtmlx )
		{
			if( typeof window.dhx4 === 'undefined' )
			{
				dependencies.push( $dhx.ui.cdn_address + "codebase4.2_std/dhtmlx.css" );
				dependencies.push( $dhx.ui.cdn_address + "codebase4.2_std/skins/terrace/dhtmlx.css" );
				dependencies.push( $dhx.ui.cdn_address + "codebase4.2_std/dhtmlx.js" );
			}
		}
		
		dependencies.push( $dhx.ui.cdn_address + "dhx/dhx.ui.css" );
		dependencies.push( $dhx.ui.cdn_address + "dhx/dhx.ui.data.js" );
		dependencies.push( $dhx.ui.cdn_address + "dhx/dhx.ui.crud.js" );
		dependencies.push( $dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.js" );
		dependencies.push( $dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.settings.js" );
		dependencies.push( $dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.Record.js" );	
		dependencies.push( $dhx.ui.cdn_address + "dhx/dhx.ui.crud.simple.View.FormWindow.js" );		
		
		if( typeof jQuery === 'undefined' )
		{
			dependencies.push( $dhx.ui.cdn_address + "dhx/ui/js/jquery-1.11.1.min.js" );
		}
		// Currency mask - shall to be loaded after JQUERY only
		dependencies.push( $dhx.ui.cdn_address + "dhx/ui/js/jquery.price_format.1.7.min.js" );
		
		typeof window.JSON === 'undefined' ? dependencies.unshift(c.base_path + "dhx/ui/js/json3.min.js") : "";
		
		if( window.location.host.indexOf('web2.eti.br') != -1 )
		{
			$dhx.environment = "test";
			$dhx.ui.cdn_address = '//mac.web2.eti.br/';
		}
		else
		{
			$dhx.environment = "production";
		}
		
		$dhx.ui.require( dependencies, function () 
		{
			$dhx.init();
			
			self._window_manager();
			
			if ($dhx._enable_log) console.warn('starting $dhx.ui');
			window.dhx4.dateFormat = {
				en: "%Y-%m-%d"
				,pt: "%Y-%m-%d"
			};
			
			$dhx.ui.data.model.start( {
				db : c.db
				,version : c.version
				,schema : c.schema
				,settings : c.settings
				,records : c.records
				,onSuccess : function(){
					// call onStart for $dhx.ui.start()
					if( c.onStart ) c.onStart();
				}
				,onFail : function(){
					
				}	
			} )
		});
	}
};