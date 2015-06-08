/*! dhx 2015-06-07 */
$dhx.ui.desktop.view.ControlPanel = {
    version: "1.0.3",
    appName: "$dhx Web Desktop - Control Panel",
    appId: "$dhx.ui.desktop.ControlPanel",
    
    render: function() {
        var that = $dhx.ui.desktop.view, self = $dhx.ui.desktop.view.ControlPanel;
        try {
            a._active_desktop()
        } catch (b) {
            console.log(b.stack)
        }
    }
};
