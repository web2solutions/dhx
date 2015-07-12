/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx */
$dhx.component = $dhx.component || {
	checkCommomConfiguration : function( c, type ){
		if( c.parent )
		{
			
		}
		else
		{	
			var error_message = "parent is missing when creating "+type+" component";
			$dhx.debug.error(error_message);
			dhtmlx.message({
				type: "error",
				text: error_message
            });
			return false;
		}
		
		if( c.settings )
		{
			
		}
		else
		{
			var error_message = "settings is missing when creating "+type+" component";
			$dhx.debug.error(error_message);
			dhtmlx.message({
				type: "error",
				text: error_message
            });
			return false;
		}
		return true;
		
	}
	,form : function( c ){
		var dhxForm = null, self = this, that = $dhx.component;
		
		if( ! that.checkCommomConfiguration(c, 'form') )
		{
			return;	
		}
		
		
		if( typeof c.parent == 'string' )
		{
			dhxForm = new dhtmlXForm(c.parent, c.settings.template);
		}
		else
		{
			dhxForm = c.parent.attachForm(c.settings.template);
		}
		$dhx.dhtmlx.prepareForm(c.id, c.settings, dhxForm);
		
		dhxForm.fields = $dhx.dhtmlx.getFormFields(c.id);
		dhxForm.getFields = function(){
			//console.log(c.id);
			//console.log($dhx.dhtmlx.formFields);
			$dhx.dhtmlx.getFormFields(c.id);	
		}
		
		dhxForm.getField = function( name ){
			//console.log(c.id);
			//console.log($dhx.dhtmlx.formFields);
			$dhx.dhtmlx.getFormItem(name, c.id);	
		}
		
		dhxForm.getFieldsName = function(){
			$dhx.dhtmlx.getFormFields(c.id);	
		}
		dhxForm.check = function(){
			return $dhx.dhtmlx.validateForm(c.id, dhxForm)	
		}
		dhxForm.fill = function( hash ){
			//console.log( hash );
			dhxForm.setFormData(hash);
			
			/*for( var i in hash )
			{
				if( hash.hasOwnProperty(i) )
				{
					var f = dhxForm.getField( i )
						, v = hash[i];
					if( f.type == 'combo' )
					{
						
					}
				}
			}*/
		}
		
		dhxForm.on = function( ev, fn ){
			if( ev == 'change')
			{
				dhxForm.attachEvent("onChange", function (name, value, state){
				
				});
			}
			
		}
		
		return dhxForm;
	}
	
	
	,toolbar : function( c ){
		var dhxToolbar = null, self = this, that = $dhx.component;
		
		if( ! that.checkCommomConfiguration(c, 'toolbar') )
		{
			return;	
		}
		
		if( typeof c.parent == 'string' )
		{
			c.settings.parent = c.parent;
			dhxToolbar = new dhtmlXToolbarObject(c.settings);
		}
		else
		{
			delete c.settings.parent;
			dhxToolbar = c.parent.attachToolbar(c.settings);
		}
		
		if( c.iconSize )
		{
			dhxToolbar.setIconSize( parseInt( c.iconSize) );
		}
		
		return dhxToolbar;
	}
	
	,menu : function( c ){
		var dhxMenu = null, self = this, that = $dhx.component;
		
		if( ! that.checkCommomConfiguration(c, 'menu') )
		{
			return;	
		}
		
		if( typeof c.parent == 'string' )
		{
			c.settings.parent = c.parent;
			dhxMenu = new dhtmlXMenuObject(c.settings);
		}
		else
		{
			delete c.settings.parent;
			dhxMenu = c.parent.attachMenu(c.settings);
		}
		
		return dhxMenu;
	}
	
	
	,tree : function( c ){
		var dhxTree = null
			, self = this
			, that = $dhx.component
			, width = c.width ? width : '100%'
			, height = c.height ? c.height : '100%'
			, rootId = c.rootId ? c.rootId : 0;
		
	
		
		if( typeof c.parent == 'string' )
		{
			dhxTree = dhtmlXTreeObject( c.parent, width, height, rootId );
		}
		else
		{
			dhxTree = c.parent.attachTree();
		}
		
		
		
		if( c.setImagePath )
		{
			dhxTree.setImagePath(c.setImagePath);
		}
		
		
		
		if( c.enableDragAndDrop )
		{
			dhxTree.enableDragAndDrop(true);
		}
		
		
		
		if( c.setDragBehavior )
		{
			dhxTree.setDragBehavior('complex');
		}
		
		
		
		if( c.enableItemEditor )
		{
			dhxTree.enableItemEditor(true);
		}
		
		//alert(c.enableKeyboardNavigation);
		
		if( c.enableKeyboardNavigation )
		{
			//dhxTree.enableKeyboardNavigation(true);
			// pro only
		}

		
		//console.log(dhxTree);	
		
		
		return dhxTree;
	}
	
	
	,grid : function( c ){
		var dhxGrid = null, self = this, that = $dhx.component;
		
		if( ! that.checkCommomConfiguration(c, 'toolbar') )
		{
			return;	
		}
		
		if( typeof c.parent == 'string' )
		{
			dhxGrid = new dhtmlXGridObject( c.parent );
		}
		else
		{
			delete c.settings.parent;
			dhxGrid = c.parent.attachGrid(c.settings);
		}
		
		if( c.settings.header ) 
			dhxGrid.setHeader( $dhx.isArray(c.settings.header) ? c.settings.header.join(',') : c.settings.header );
		if( c.settings.id ) 
			dhxGrid.setColumnIds( $dhx.isArray(c.settings.id) ? c.settings.id.join(',') : c.settings.id );
		if( c.settings.width ) 
			dhxGrid.setInitWidths( $dhx.isArray(c.settings.width) ? c.settings.width.join(',') : c.settings.width );
		if( c.settings.align ) 
			dhxGrid.setColAlign( $dhx.isArray(c.settings.align) ? c.settings.align.join(',') : c.settings.align );
		if( c.settings.type ) 
			dhxGrid.setColTypes( $dhx.isArray(c.settings.type) ? c.settings.type.join(',') : c.settings.type );
		if( c.settings.sorting ) 
			dhxGrid.setColSorting( $dhx.isArray(c.settings.sorting) ? c.settings.sorting.join(',') : c.settings.sorting );		

		dhxGrid.init();
		
		
		
		if( c.iconSize )
		{
			dhxGrid.setIconSize( parseInt( c.iconSize) );
		}
		
		return dhxGrid;
	}
}