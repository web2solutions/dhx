/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.crud.simple.View.FormWindow = {
    window: [],
    strWindowID: "$dhx.ui.crud.simple.View.window.",
    layout: [],
    form: []

    ,
    _window: function(uid, schema, db_settings) {
        var self = $dhx.ui.crud.simple.View.FormWindow, left, top, width, height;
		
		
		if( db_settings.form.template.length > 9 )
		{
			left = $dhx.getPagePosition("x", 950, 430)
			top = $dhx.getPagePosition("y", 950, 430)
			width = 950;
			height = 430;
		}
		else
		{
			left = $dhx.ui.crud.simple.View.settings.FormWindow.window.left;
			top = $dhx.ui.crud.simple.View.settings.FormWindow.window.top;
			width = $dhx.ui.crud.simple.View.settings.FormWindow.window.width;
			height = $dhx.ui.crud.simple.View.settings.FormWindow.window.height;
		}
		
        self.window[uid] = new $dhx.ui.window({
            id: self.strWindowID + uid,
            left: left,
            top: top,
            width: width,
            height: height,
        });
        self.window[uid].button('park').hide();
        self.window[uid].button('minmax').hide();
        self.window[uid].button('stick').hide();
        self.window[uid].attachEvent("onClose", function(win) {
            schema.unbind.form({
                component: self.form[uid],
                component_id: "$dhx.ui.crud.simple.View.form." + uid + ".",
                onSuccess: function() {
                    self.form[uid].unload();
                    self.form[uid] = null;
                },
                onFail: function() {
                    $dhx.ui.crud.simple.View.settings.status_bar._setStatusError('could not unbind from');
                }
            });
            return true;
        });
        if (uid == 'new') {

        } else {

        }
        self.window[uid].setText(self.table[uid].CFC() + " - " + $dhx.ui.language.Filloutthefields);
        self.status_bar = self.window[uid].attachStatusBar();
    }

    ,
    _layout: function(uid, schema) {
        var self = $dhx.ui.crud.simple.View.FormWindow;
        self.layout[uid] = self.window[uid].attachLayout($dhx.ui.crud.simple.View.settings.FormWindow.layout);
        self.layout[uid].cells('a').hideHeader();
        if (uid == 'new') {} else {}
    }

    ,
    _form: function(uid, db_settings, schema) {
        var self = $dhx.ui.crud.simple.View.FormWindow;
        //
		
		
		var form_template = $dhx.extend( $dhx.ui.crud.simple.View.settings.FormWindow.form );
		
		//console.log( schema );
		
		if( db_settings.form.template.length <= 9 )
		{
			form_template.template[1].list[0].list = db_settings.form.template;
			form_template.template[1].list[2].list = [];
			//form_template.template[1].list = db_settings.form.template;
		}
		else
		{
			form_template.template[1].list[2].list = [];
			form_template.template[1].list[0].list = [];
			for( var x = 0; x < db_settings.form.template.length; x++)
			{
				//console.log( field );
				var field = db_settings.form.template[x];
				if( x % 2 )
				{
					form_template.template[1].list[2].list.push(field);
				}
				else
				{
					form_template.template[1].list[0].list.push(field);
				}
			}
		}
		
		self.form[uid] = self.layout[uid].cells('a').attachForm(form_template.template);
        //$dhx.dhtmlx.prepareForm("$dhx.ui.crud.simple.View.form" + uid, form_template, self.form[ uid ]);
        if ($dhx.isNumber(uid)) {
            self.form[uid].isEditing = true;
        } else {
            self.form[uid].isEditing = false;
        }
		
		
        schema.bind.form({
            component: self.form[uid],
            component_id: "$dhx.ui.crud.simple.View.form." + uid + "."
                // not mandatory, default undefined

            ,
            prepare: {
                settings: form_template
            }
            //,component_settings : 

            ,
            onSuccess: function() {
				
				
				
				
				
				
			},
            onFail: function() {
                $dhx.ui.crud.simple.View.settings.status_bar._setStatusError('could not bind form');
            }
        });
    }

    ,
    table: []

    ,
    render: function(configuration) {
        var self = $dhx.ui.crud.simple.View.FormWindow;
        configuration = configuration || {};
        var uid = typeof configuration.record_id === 'undefined' ? 'new_' + configuration.table : configuration.record_id;
        self.table[uid] = configuration.table;
		
        if ($dhx.ui.window_manager.isWindow(self.strWindowID + uid)) {
            self.window[uid].show();
            self.window[uid].bringToTop();
            return;
        }
		
		var db_settings = $dhx.ui.data.model.settings[configuration.database][configuration.table];	
		
		console.log(  );	
       
        $dhx.showDirections("starting view ... ");
        self._window(uid, configuration.schema, db_settings);
        self._layout(uid);
        self._form(uid, db_settings, configuration.schema);
        if (configuration.fnCallBack) {
            configuration.fnCallBack();
        }
        //self.Builder.render();
        $dhx.hideDirections();



    }
};
