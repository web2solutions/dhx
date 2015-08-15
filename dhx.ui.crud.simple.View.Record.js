/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject */
$dhx.ui.crud.simple.View.Record = {

    wrapper: [],
    strTabID: "$dhx.ui.crud.simple.View.Record.tab.",
    form: [],
    layout: []

    ,
    formTemplates: []

    ,
    _layout: function(uid) {
        var self = $dhx.ui.crud.simple.View.Record;
        self.layout[uid] = self.wrapper[uid].attachLayout($dhx.ui.crud.simple.View.settings.layout);
        self.layout[uid].cells('a').hideHeader();
    }

    ,
    _form: function(uid) {
        var self = $dhx.ui.crud.simple.View.Record;
        self.form[uid] = self.layout[uid].cells('a').attachForm(self.formTemplates[uid].template);
        self.form[uid].attachEvent("onButtonClick", function(name) {

        });
    }

    ,
    render: function(configuration, schema) {
        var self = $dhx.ui.crud.simple.View.Record;
        console.log(configuration)
        configuration = configuration || {};
        var uid = configuration.record_id;
        var tabId = self.strTabID + uid;

        if (typeof self.wrapper[uid] !== 'undefined') {
            if (self.wrapper[uid].tabbar != null) {
                //console.log(self.wrapper[ uid ]);
                configuration.wrapper.cells(uid).setActive();
                return;
            }
        }

        

        schema.getRecord(uid, function(record, recordRequest, event) {
            
			//var view = $dhx.ui.crud.controller["$dhx.ui.crud.simple."+configuration.table+"_app"].view;
			//var colIndex = view.grid.getColIndexById(field.name);
			//var column_value = view.grid.cells(uid, colIndex).getTitle() || view.grid.cells(uid, colIndex).getValue();
			
			configuration.wrapper.addTab(uid, "preview " + uid, null, null, true, true);
			
			
			
			
            self.wrapper[uid] = configuration.wrapper.cells(uid);
            self.formTemplates[uid] = {
                "template": [{
                    type: "settings",
                    position: "label-left",
                    labelWidth: 160,
                    inputWidth: (configuration.is_generic) ?
                        ($dhx.ui.crud.simple.View.settings.app_generic.window.width - 160 - 170) : ($dhx.windowWidth - 420),
                    inputHeight: 30,
                    labelHeight: 30
                }, {
                    type: 'block',
                    inputWidth: 'auto',
                    inputHeight: 30,
                    labelHeight: 30,
                    list: []
                }]
            }

            //$dhx.ui.crud.simple.View.settings.app_generic.window.height
            //$dhx.ui.crud.simple.View.settings.app_generic.window.width

            $dhx.dataDriver.dbs[configuration.db].settings[configuration.table].form.template.forEach(function(field, index_, array_) {
                //console.log(field);
				var ffield = {};
                ffield.type = 'template';

                ffield.name = field.name;
                ffield.label = field.label;
                
				var view = $dhx.ui.crud.controller["$dhx.ui.crud.simple."+configuration.table+"_app"].view;
				var colIndex = view.grid.getColIndexById(field.name);
				var column_value = view.grid.cells(uid, colIndex).getTitle() || view.grid.cells(uid, colIndex).getValue();
				ffield.value = column_value;

                ffield.format = function(name, value) {
                    // to access form instance from format function
                    // you cann use the following method:
                    // var form = this.getForm();
					
					if( field.type == 'vault' )
					{
						//vault_type
						if( field.vault_type == 'images' )
						{
							var strTemplate = "<div class='record_text' >";
							value.split(',').forEach(function( image, index ){
								strTemplate += "<img onclick='new $dhx.ui.viewer.image(\""+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+$dhx.REST.API.company_id+"/"+configuration.table+"/"+uid+"/"+image+"\")' title='"+image+"' width='200' src='"+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+$dhx.REST.API.company_id+"/"+configuration.table+"/"+uid+"/"+image+"' />"
							});
							strTemplate += "</div>";
							return strTemplate;
						}
						else if( field.vault_type == 'pdf' )
						{
							var strTemplate = "<div class='record_text'>";
							value.split(',').forEach(function( image, index ){
								strTemplate += "<div class='record_text_pdf_item' onclick='new $dhx.ui.viewer.pdf(\""+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+$dhx.REST.API.company_id+"/"+configuration.table+"/"+uid+"/"+image+"\")' title='"+image+"'><img src='"+$dhx.ui.cdn_address+"dhx/ui/desktop/assets/icons/pdf.png' /><br>" + image.substr( 6, 6, image.length ) + " ...</div>"
							});
							strTemplate += "</div>";
							return strTemplate;
						}
						else
						{
							var strTemplate = "<div class='record_text'>";
							value.split(',').forEach(function( image, index ){
								console.log(image);
								strTemplate += "<a download='"+image+"'  class='record_text_pdf_item' href='"+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+$dhx.REST.API.company_id+"/"+configuration.table+"/"+uid+"/"+image+"'  title='"+image+"'><img src='"+$dhx.ui.cdn_address+"dhx/ui/desktop/assets/icons/"+image.substr(image.length - 3)+".png' /><br>" + image.substr( 6, 6, image.length ) + " ...</a>"
							});
							strTemplate += "</div>";
							return strTemplate;
							//return "<div class='record_text' style='height:200px;'>" + value + "</div>";
						}// $dhx.forceDownload(fileURI, fileName)
					}
					else
					{
						return "<div class='record_text'>" + value + "</div>";
					}
					
                    
                };
                self.formTemplates[uid].template[1].list.push(ffield);
            });
            $dhx.showDirections("starting view ... ");
            self._layout(uid);
            self._form(uid);
            if (configuration.fnCallBack) configuration.fnCallBack();
            $dhx.hideDirections();
        }, function(recordRequest, event, error_message) {

        });
    }
};
