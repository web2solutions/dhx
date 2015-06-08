/*! dhx 2015-06-07 */
$dhx.ui.desktop = {
    version: "1.0.3",
    start: function(a) {
        $dhx.ui.desktop.view.render()
    }
}, $dhx.ui.desktop.application = {
    cruder: function(a) {
        this.summary = a.summary || "$dhx application", this.icon = a.icon || "bogus.png", this.database = a.database, this.collection = a.collection, this.appId = "$dhx.ui.crud.simple." + a.collection + "_app", this.appName = "cruder " + a.collection, this.module = {}, this.summary = a.summary || "$dhx application"
    },
    custom: function(a) {
        this.appName = a.appName, this.appId = a.appId, this.database = "", this.collection = "", this.summary = a.summary || "$dhx application", this.icon = a.icon || "bogus.png", this.module = a.module
    }
}, $dhx.ui.desktop.Registry = {
    programs: [new $dhx.ui.desktop.application.custom({
        appName: "Apps central",
        appId: "Apps$Central",
        summary: "",
        icon: "",
        module: {}
    })],
    cruders: [new $dhx.ui.desktop.application.cruder({
        summary: "",
        icon: "persons.png",
        collection: "persons",
        database: "juris",
        summary: "Cadastro de pessoas"
    }), new $dhx.ui.desktop.application.cruder({
        summary: "",
        icon: "group.png",
        collection: "groups",
        database: "juris",
        summary: "Cadastro de grupo de usuário"
    }), new $dhx.ui.desktop.application.cruder({
        summary: "",
        icon: "foo.png",
        collection: "companies",
        database: "juris",
        summary: "Cadastro de Empresas"
    }), new $dhx.ui.desktop.application.cruder({
        summary: "",
        icon: "foo.png",
        collection: "company_branches",
        database: "juris",
        summary: "Cadastro de filiais"
    }), new $dhx.ui.desktop.application.cruder({
        summary: "",
        icon: "foo.png",
        collection: "desktop_wallpapers",
        database: "juris",
        summary: "Cadastro de wallpapers"
    })]
};
