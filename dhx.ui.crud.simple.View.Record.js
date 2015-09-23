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
    _layout: function(tabId) {
        var self = $dhx.ui.crud.simple.View.Record;
        self.layout[tabId] = self.wrapper[tabId].attachLayout($dhx.ui.crud.simple.View.settings.layout);
        self.layout[tabId].cells('a').hideHeader();
    }

    ,
    _form: function(tabId) {
        var self = $dhx.ui.crud.simple.View.Record;
        self.form[tabId] = self.layout[tabId].cells('a').attachForm(self.formTemplates[tabId].template);
        self.form[tabId].attachEvent("onButtonClick", function(name) {

        });
    }

    ,
    render: function(configuration, schema) {
        var self = $dhx.ui.crud.simple.View.Record;
        //console.log(configuration)
        configuration = configuration || {};
        //var uid = configuration.record_id;
        var tabId = self.strTabID + configuration.table + '.' + configuration.record_id;
		
		//console.log(self.wrapper);
		//console.log(tabId);

        if (typeof self.wrapper[tabId] !== 'undefined') {
            if (self.wrapper[tabId].tabbar != null) {
                //console.log(self.wrapper[ tabId ]);
                configuration.wrapper.cells(tabId).setActive();
                return;
            }
        }

        

        schema.getRecord(configuration.record_id, function(record, recordRequest, event) {
            
			//var view = $dhx.ui.crud.controller["$dhx.ui.crud.simple."+configuration.table+"_app"].view;
			//var colIndex = view.grid.getColIndexById(field.name);
			//var column_value = view.grid.cells(configuration.record_id, colIndex).getTitle() || view.grid.cells(configuration.record_id, colIndex).getValue();
			
			configuration.wrapper.addTab(tabId, "preview " + tabId, null, null, true, true);
			
            self.wrapper[tabId] = configuration.wrapper.cells(tabId);
            self.formTemplates[tabId] = {
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
				var column_value = view.grid.cells(configuration.record_id, colIndex).getTitle() || view.grid.cells(configuration.record_id, colIndex).getValue();
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
								if( image.length > 3 )
									strTemplate += "<img onclick='new $dhx.ui.viewer.image(\""+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+configuration.table+"/"+configuration.record_id+"/"+image+"\")' title='"+image+"' width='200' src='"+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+configuration.table+"/"+configuration.record_id+"/"+image+"' />"
							});
							strTemplate += "</div>";
							return strTemplate;
						}
						else if( field.vault_type == 'pdf' )
						{
							var strTemplate = "<div class='record_text'>";
							value.split(',').forEach(function( image, index ){
								
								if( image.length > 3 )
									strTemplate += "<div class='record_text_pdf_item' onclick='new $dhx.ui.viewer.pdf(\""+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+configuration.record_id+"/"+image+"\")' title='"+image+"'><img src='"+$dhx.ui.cdn_address+"dhx/ui/desktop/assets/icons/pdf.png' /><br>" + image.substr( 6, 6, image.length ) + " ...</div>"
							});
							strTemplate += "</div>";
							return strTemplate;
						}
						else
						{
							var strTemplate = "<div class='record_text'>";
							value.split(',').forEach(function( image, index ){
								//alert(image);
								if( image.length > 3 )
									strTemplate += "<a download='"+image+"'  class='record_text_pdf_item' href='"+$dhx.ui.cdn_address+""+$dhx.ui.desktop.database +"/"+configuration.table+"/"+configuration.record_id+"/"+image+"'  title='"+image+"'><img src='"+$dhx.ui.cdn_address+"dhx/ui/desktop/assets/icons/"+image.split('.')[1]+".png' /><br>" + image.substr( 6, 6, image.length ) + " ...</a>"
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
                self.formTemplates[tabId].template[1].list.push(ffield);
            });
            $dhx.showDirections("starting view ... ");
            self._layout(tabId);
            self._form(tabId);
            if (configuration.fnCallBack) configuration.fnCallBack();
            $dhx.hideDirections();
        }, function(recordRequest, event, error_message) {

        });
    }
};
