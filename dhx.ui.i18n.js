/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true */
/*global $dhx, dhtmlx, dhtmlXLayoutObject, dbDemo */

$dhx.ui.i18n = $dhx.ui.i18n || {
	version: '1.0.3'
	, idiom: 'pt-br'
	, setIdiom: function (idiom) {
		$dhx.ui.i18n.idiom = idiom;
	}
	, start: function (idiom) {
		if(idiom)
		{
			$dhx.ui.i18n.idiom = idiom;
		}
	}
};
