/*! dhx 2015-06-07 */
$dhx.ui={version:"1.0.3",skin:"dhx_skyblue",skin_subset:"Unity",cdn_address:$dhx.CDN,require:function(a,b){"use strict";$dhx.onDemand.load(a,function(){b&&b()})},window_manager:null,window_manager_is_ready:!1,_window_manager:function(a){"use strict";var b=$dhx.ui;if(b.getUserSkin()){var a=b.getUserSkin();b.skin=a.skin,b.skin_subset=a.skin_subset}b.window_manager_is_ready||(b.window_manager=new dhtmlXWindows({skin:b.skin}),b.window_manager.setSkin(b.skin),b.window_manager_is_ready=!0)},window:function(a){return $dhx.ui.window_manager.createWindow(a)},PDFjsLoaded:!1,dhxPDF:function(){dhtmlXGridObject.prototype.dhxPDF=function(a,b,c,d,e,f,g){function h(a){for(var b=[],e=1;e<r.hdr.rows.length;e++){b[e]=[];for(var f=0;f<r._cCount;f++){var g=r.hdr.rows[e].childNodes[f];b[e][f]||(b[e][f]=[0,0]),g&&(b[e][g._cellIndexS]=[g.colSpan,g.rowSpan])}}var h="<rows profile='"+a+"'";c&&(h+=" header='"+c+"'"),d&&(h+=" footer='"+d+"'"),h+="><head>"+r._serialiseExportConfig(b).replace(/^<head/,"<columns").replace(/head>$/,"columns>");for(var e=2;e<r.hdr.rows.length;e++){for(var i=0,k=r.hdr.rows[e],l="",f=0;f<r._cCount;f++)if(r._srClmn&&!r._srClmn[f]||r._hrrar[f]&&(!r._fake||f>=r._fake.hdrLabels.length))i++;else{var m=b[e][f],n=m[0]&&m[0]>1?' colspan="'+m[0]+'" ':"";m[1]&&m[1]>1&&(n+=' rowspan="'+m[1]+'" ',i=-1);var o="",p=k;r._fake&&f<r._fake._cCount&&(p=r._fake.hdr.rows[e]);for(var q=0;q<p.cells.length;q++)if(p.cells[q]._cellIndexS==f){o=p.cells[q].getElementsByTagName("SELECT").length?"":_isIE?p.cells[q].innerText:p.cells[q].textContent,o=o.replace(/[ \n\r\t\xA0]+/," ");break}o&&" "!=o||i++,l+="<column"+n+"><![CDATA["+o+"]]></column>"}i!=r._cCount&&(h+="\n<columns>"+l+"</columns>")}return h+="</head>\n",h+=j()}function i(){var a=[];if(e)for(var b=0;b<e.length;b++)a.push(l(r.getRowIndex(e[b])));else for(var b=0;b<r.getRowsNum();b++)a.push(l(b));return a.join("\n")}function j(){var a=["<foot>"];if(!r.ftr)return"";for(var b=1;b<r.ftr.rows.length;b++){a.push("<columns>");for(var c=r.ftr.rows[b],d=0;d<r._cCount;d++)if(!(r._srClmn&&!r._srClmn[d]||r._hrrar[d]&&(!r._fake||d>=r._fake.hdrLabels.length))){for(var e=0;e<c.cells.length;e++){var f="",g="";if(c.cells[e]._cellIndexS==d){f=_isIE?c.cells[e].innerText:c.cells[e].textContent,f=f.replace(/[ \n\r\t\xA0]+/," "),c.cells[e].colSpan&&1!=c.cells[e].colSpan&&(g=" colspan='"+c.cells[e].colSpan+"' "),c.cells[e].rowSpan&&1!=c.cells[e].rowSpan&&(g=" rowspan='"+c.cells[e].rowSpan+"' ");break}}a.push("<column"+g+"><![CDATA["+f+"]]></column>")}a.push("</columns>")}return a.push("</foot>"),a.join("\n")}function k(a,b){return(window.getComputedStyle?window.getComputedStyle(a,null)[b]:a.currentStyle?a.currentStyle[b]:null)||""}function l(a){if(!r.rowsBuffer[a])return"";var b=r.render_row(a);if("none"==b.style.display)return"";for(var c=r.isTreeGrid()?' level="'+r.getLevel(b.idd)+'"':"",d="<row"+c+">",e=0;e<r._cCount;e++)if((!r._srClmn||r._srClmn[e])&&(!r._hrrar[e]||r._fake&&e<r._fake.hdrLabels.length)){var f=r.cells(b.idd,e);if(q){var g=k(f.cell,"color"),h=k(f.cell,"backgroundColor"),i=k(f.cell,"font-weight")||k(f.cell,"fontWeight"),j=k(f.cell,"font-style")||k(f.cell,"fontStyle"),l=k(f.cell,"text-align")||k(f.cell,"textAlign"),m=k(f.cell,"font-family")||k(f.cell,"fontFamily");("transparent"==h||"rgba(0, 0, 0, 0)"==h)&&(h="rgb(255,255,255)"),d+="<cell bgColor='"+h+"' textColor='"+g+"' bold='"+i+"' italic='"+j+"' align='"+l+"' font='"+m+"'>"}else d+="<cell>";d+="<![CDATA["+(f.getContent?f.getContent():f.getTitle())+"]]></cell>"}return d+"</row>"}function m(){var a="</rows>";return a}function n(){var c=document.createElement("div");c.style.height="100%",c.style.width="100%";var d="grid_"+g+".pdf";c.id=(new Date).getTime();var e=new $dhx.ui.window({id:(new Date).getTime()-1e3,left:$dhx.ui.crud.simple.View.settings.app_generic.window.left,top:$dhx.ui.crud.simple.View.settings.app_generic.window.top,width:800,height:500});e.button("park").hide(),e.button("minmax").hide(),e.button("stick").hide(),e.setText("Grid PDF version");var f=e.attachStatusBar();f.setText("Press ctrl+p (cmd+p Mac) to print it"),document.body.appendChild(c);var j="form_"+r.uid();c.innerHTML='<iframe name="pdfFrame" width="100%" height="100%" frameborder="0"></iframe><form style="display:none;" id="'+j+'" method="post" action="'+a+'" accept-charset="utf-8"  enctype="application/x-www-form-urlencoded" target="pdfFrame"><input type="hidden" name="grid_xml" id="grid_xml"/><input type="hidden" name="viewer" id="viewer" value="'+$dhx.ui.cdn_address+"dhx/ui/pdfjs/web/viewer.php?pdf_name="+$dhx.ui.cdn_address+"dhx/ui/bin/2pdf/"+d+'"/><input type="hidden" name="pdf_name" id="pdf_name" value="'+d+'"/> </form>',e.attachObject(c.id),document.getElementById(j).firstChild.value=encodeURIComponent(h(b).replace("–","-")+i()+m()),document.getElementById(j).submit(),r=null,o&&(o.el.parentNode.className+=" rowselected",o.el.className+=" cellselected"),o=null}var o={row:this.getSelectedRowId(),col:this.getSelectedCellIndex()};if(null===o.row||-1===o.col)o=!1;else if(o.row&&-1!==o.row.indexOf(this.delim)){var p=this.cells(o.row,o.col).cell;p.parentNode.className=p.parentNode.className.replace(" rowselected",""),p.className=p.className.replace(" cellselected",""),o.el=p}else o=!1;b=b||"color";var q="full_color"==b,r=this;r._asCDATA=!0,"undefined"==typeof f?this.target=' target="_blank"':this.target=f,eXcell_ch.prototype.getContent=function(){return this.getValue()},eXcell_ra.prototype.getContent=function(){return this.getValue()},n()}},setUserSkin:function(a){dhtmlx.confirm({type:"confirm-warning",text:$dhx.ui.language.ChangeskinAgreement,ok:$dhx.ui.language["continue"],cancel:$dhx.ui.language.cancel,callback:function(b){1==b&&($dhx.ui.skin_subset=a,"terrace-blue"==a?self.skin="dhx_terrace":"light-green"==a?self.skin="dhx_skyblue":"clouds"==a?self.skin="dhx_skyblue":"Unity"==a?self.skin="dhx_skyblue":"pink-yellow"==a?self.skin="dhx_skyblue":"web-green"==a?self.skin="dhx_web":self.skin=a,$dhx.cookie.set("dhx_skin",self.skin,99999999),$dhx.cookie.set("dhx_skin_subset",a,99999999),location.reload())}})},getUserSkin:function(){var a=!1;return"undefined"!=typeof $dhx.cookie.get("dhx_skin")&&null!=$dhx.cookie.get("dhx_skin")&&(a={skin:$dhx.cookie.get("dhx_skin"),skin_subset:$dhx.cookie.get("dhx_skin_subset")}),a},start:function(a){"use strict";var b=$dhx.ui,c=[];if(b.database=a.database,a.require&&$dhx.isArray(a.require)&&(c=require),a.skin&&(b.skin=a.skin.skin,b.skin_subset=a.skin.skin_subset),b.getUserSkin()){var d=b.getUserSkin();b.skin=d.skin,b.skin_subset=d.skin_subset}-1!=window.location.host.indexOf("web2.eti.br")?($dhx.environment="test",$dhx.ui.cdn_address="//mac.web2.eti.br/"):-1!=window.location.host.indexOf("10.0.0.9")?($dhx.environment="test",$dhx.ui.cdn_address="//10.0.0.9/"):$dhx.environment="production",a.dhtmlx&&"undefined"==typeof window.dhx4&&(c.push($dhx.ui.cdn_address+"dhx/ui/css/dhx.ui.css"),a.desktop&&c.push($dhx.ui.cdn_address+"dhx/ui/css/dhx.ui.desktop.css"),"dhx_skyblue"==b.skin?"light-green"==b.skin_subset?c.push($dhx.ui.cdn_address+"dhx/ui/skins/light-green/dhtmlx.css"):"clouds"==b.skin_subset?c.push($dhx.ui.cdn_address+"dhx/ui/skins/clouds/dhtmlx.css"):"Unity"==b.skin_subset?c.push($dhx.ui.cdn_address+"dhx/ui/skins/Unity/dhtmlx.css"):"pink-yellow"==b.skin_subset?c.push($dhx.ui.cdn_address+"dhx/ui/skins/pink-yellow/dhtmlx.css"):c.push($dhx.ui.cdn_address+"codebase4.2_std/dhtmlx.css"):"dhx_terrace"==b.skin?"terrace-blue"==b.skin_subset?c.push($dhx.ui.cdn_address+"dhx/ui/skins/terrace-blue/dhtmlx.css"):c.push($dhx.ui.cdn_address+"dhx/ui/skins/terrace/dhtmlx.css"):"dhx_web"==b.skin&&("web-green"==b.skin_subset?c.push($dhx.ui.cdn_address+"dhx/ui/skins/web-green/dhtmlx.css"):c.push($dhx.ui.cdn_address+"dhx/ui/skins/web/dhtmlx.css")),c.push($dhx.ui.cdn_address+"codebase4.2_std/dhtmlx.js")),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.Session.js"),a.desktop&&(c.push($dhx.ui.cdn_address+"dhx/dhx.ui.desktop.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.desktop.settings.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.desktop.view.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.desktop.view.ActiveDesktop.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.desktop.view.TopBar.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.desktop.view.SideBar.js")),"undefined"==typeof $dhx.ui.data&&c.push($dhx.ui.cdn_address+"dhx/dhx.ui.data.js"),"undefined"==typeof $dhx.dataDriver&&(c.push($dhx.ui.cdn_address+"dhx/dhx.dataDriver.js"),c.push($dhx.ui.cdn_address+"dhx/latinize.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.MQ.js")),"undefined"==typeof $dhx.ui.crud&&(c.push($dhx.ui.cdn_address+"dhx/dhx.ui.crud.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.crud.simple.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.crud.simple.View.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.crud.simple.View.settings.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.crud.simple.View.Record.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.crud.simple.View.FormWindow.js"),c.push($dhx.ui.cdn_address+"dhx/dhx.ui.crud.simple.View.Search.js")),"undefined"==typeof jQuery&&c.push($dhx.ui.cdn_address+"dhx/ui/js/jquery-1.11.1.min.js"),c.push($dhx.ui.cdn_address+"dhx/ui/js/jquery.price_format.1.7.min.js"),c.unshift($dhx.ui.cdn_address+"dhx/ui/js/json3.min.js");var e=[];e.push($dhx.ui.cdn_address+"dhx/dhx.shortcut.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.Request.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.cookie.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.dhtmlx.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.crypt.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.Encoder.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.ui.i18n.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.ui.i18n.pt-br.js"),e.push($dhx.ui.cdn_address+"dhx/dhx.ui.i18n.en-us.js"),$dhx.ui.require(e,function(){$dhx.ui.i18n.start(),$dhx.ui.require(c,function(){$dhx.init(),b._window_manager(),$dhx._enable_log&&console.warn("starting $dhx.ui"),window.dhx4.dateFormat={en:"%Y-%m-%d",pt:"%Y-%m-%d"},b.dhxPDF(),$dhx.ui.data.model.start({db:a.db,version:a.version,schema:a.schema,settings:a.settings,records:a.records,onSuccess:function(){a.onStart&&a.onStart()},onFail:function(){}})})})}},$dhx.ui.helpers={column:{toFormField:function(a){var b={tooltip:"",mask_to_use:"",value:"",maxLength:a.maxlength,required:a.required,label:a.dhtmlx_grid_header,validate:a.validation,name:a.name,dhx_prop_text:a.foreign_column_name,dhx_table:a.foreign_table_name,dhx_prop_value:a.foreign_column_value,type:a.has_fk?"combo":$dhx.ui.helpers.sqlToDhxFormType(a.type)};return b}},sqlToDhxFormType:function(a){return"integer"==a?"input":"bigint"==a?"input":"numeric"==a?"input":"character varying"==a?"input":"text"==a?"input":"date"==a?"calendar":"timestamp without time zone"==a?"calendar":"primary_key"==a?"hidden":""},clock:function(a){function b(a){return 10>a&&(a="0"+a),a}var c=new Date,d=c.getHours(),e=c.getMinutes(),f=c.getSeconds();e=b(e),f=b(f),document.getElementById(a).innerHTML=d+":"+e+":"+f;setTimeout(function(){$dhx.ui.helpers.clock(a)},500)}};