/*! dhx 2015-06-07 */
$dhx.ui.desktop.view.ActiveDesktop = {
    version: "1.0.3",
    appName: "$dhx Web Desktop - Active Desktop",
    appId: "$dhx.ui.desktop.ActiveDesktop",
    active_desktop: null,
    _active_desktop: function() {
        var a = ($dhx.ui.desktop.view, $dhx.ui.desktop.view.ActiveDesktop);
        a.active_desktop = $dhx.createElement({
            tag_name: "DIV",
            style: "",
            "class": "dhx_ui_desktop_active_area",
            id: "$dhx.ui.desktop.active_area",
            width: window.innerWidth,
            height: window.innerHeight,
            resize_width: !0,
            resize_height: !0
        }), a._active_desktop_contextual_menu()
    },
    _active_desktop_contextual_menu: function() {
        var a = ($dhx.ui.desktop.view, $dhx.ui.desktop.view.ActiveDesktop);
        a.active_desktop_contextual_menu = new dhtmlXMenuObject($dhx.ui.desktop.settings.menu_contextual), a.active_desktop_contextual_menu.addContextZone(a.active_desktop.id), a.active_desktop_contextual_menu.attachEvent("onClick", function(a) {
            "dhx_terrace" == a ? $dhx.ui.setUserSkin("dhx_terrace") : "dhx_skyblue" == a ? $dhx.ui.setUserSkin("dhx_skyblue") : "dhx_web" == a ? $dhx.ui.setUserSkin("dhx_web") : "web-green" == a ? $dhx.ui.setUserSkin("web-green") : "light-green" == a ? $dhx.ui.setUserSkin("light-green") : "clouds" == a ? $dhx.ui.setUserSkin("clouds") : "Unity" == a ? $dhx.ui.setUserSkin("Unity") : "pink-yellow" == a ? $dhx.ui.setUserSkin("pink-yellow") : "terrace-blue" == a ? $dhx.ui.setUserSkin("terrace-blue") : "portuguese" == a ? $dhx.ui.i18n.setUserIdiom("pt-br") : "english" == a && $dhx.ui.i18n.setUserIdiom("en-us")
        })
    },
    _idiom_contextual_menu: function() {
        var a = ($dhx.ui.desktop.view, $dhx.ui.desktop.view.ActiveDesktop);
        a.idiom_contextual_menu = new dhtmlXMenuObject($dhx.ui.desktop.settings.menu_contextual_idiom), a.idiom_contextual_menu.addContextZone(a.top_bar_quick_tools_idioms.id), a.idiom_contextual_menu.attachEvent("onClick", function(a) {
            "portuguese" == a ? $dhx.ui.i18n.setUserIdiom("pt-br") : "english" == a && $dhx.ui.i18n.setUserIdiom("en-us")
        })
    },
    render: function() {
        var a = ($dhx.ui.desktop.view, $dhx.ui.desktop.view.ActiveDesktop);
        try {
            a._active_desktop()
        } catch (b) {
            console.log(b.stack)
        }
    }
};
