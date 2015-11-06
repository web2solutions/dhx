/*jslint browser: true, devel: true, white: true */
/*global $dhx, dhtmlx */

;
(function(namespace) {
    'use strict';


})(window.$dhx = window.$dhx || {});

;
(function(namespace) {
    'use strict';


})($dhx.ui = $dhx.ui || {});



;
(function(namespace) {
    'use strict';

    var cache = {},

        routes = {},

        controllers = [],

        tmpl = function(str, data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.

            //if(str.length == 0 )
            //    return function(){};

            //console.log(str, ' <<<<<');
            //console.log( document.getElementById(str).innerText );

            var fn = null;

            if( !/\W/.test(str)  )
            {
                fn = cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML);
            }
            else
            {
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                fn = new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +

                        // Introduce the data as local variables using with(){}
                        "with(obj){p.push('" +

                        // Convert the template into pure JavaScript
                        str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'") + "');}return p.join('');");
            }

            //console.log(data ? fn(data) : fn)

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        },
        el = null,
        route_stash = [],
        router = function() {
            var url = location.hash.slice(1) || '#'
                ,   route = routes[url];

            // Is it a route without template?
            if (route && !route.view && !route.presenter) {
                // Just initiate controller:
                return route.controller ? route.controller : null;
            } 
            else if (route && !route.view && route.presenter) {
                //return route.controller ? route.controller : null;
            } 
            else if (route && route.view && !route.presenter) {
                // Lazy load view element:
                el = route.wrapper;
                // Clear existing observer:
                //if (route_stash) {
                //    Object.unobserve(route_stash.controller, route_stash.render);
                //    route_stash = null;
                //    el.innerHTML = '';
                //}
                // Do we have both a view and a route?
                if (el && route && route.controller) {
                    // Set route_stash route information:


                    route_stash = {
                        controller: route.controller,
                        template: tmpl(route.view),
                        render: function() {
                            console.log('rendering view for ', url);
                            // Render route template with John Resig's template engine:
                            el.innerHTML = this.template(this.controller);
                        },
                        publish: function() {
                            //console.log()
                            $dhx.MQ.publish( route.channel, this );
                        },
                    };
                    // Render directly:
                    route_stash.render();
                    // And observe for changes:
                    Object.observe(route_stash.controller, route_stash.publish.bind(route_stash));
                }
            }

        };



    namespace.on = function(event, fnCallBack) {
        if (event == 'DOMready') {
            document.addEventListener('DOMContentLoaded', fnCallBack);
        }
    };

    namespace.application = function(stash) {
        var appId;
        if (typeof stash.appId === 'undefined') {
            stash.appId = "" + Math.random() + "";
        }

        appId = stash.appId;


        this.route = function(stash) {
            var path = stash.path,
                view = stash.view || false,
                presenter = stash.presenter || false,
                controller = null,
                wrapper = stash.wrapper || document.body,
                channel = appId + '.' + path;

            if( routes[path] )
            {
                throw 'this route is already registered';
                return;
            }

            controller = new stash.controller;

            controller._subscriber_token = $dhx.MQ.subscribe(  channel , function( channel, data ){
                console.log( channel, data)
            });

            routes[path] = {
                view: view,
                presenter: presenter,
                controller: controller,
                wrapper: wrapper,
                channel : channel
            };



            /*
                    
                    
                    
                    component._subscriber_token = $dhx.MQ.subscribe(
                        $dhx.dataDriver.dbs[c.db].root_topic + "." + c.table, component._subscriber
                    );
                     */

            return routes[path].controller;
        };
        
        this.base = window.location.origin + window.location.pathname;

        this.dispatch = function( stash ){

            stash.path = stash.path || location.hash.slice(1) || '/';

            var newURL = this.base + '#' + ( stash.path == '#' ? '' : stash.path )
            var oldURL = this.base + (  window.location.hash ? '#' + window.location.hash : '' );
            
            var ev = {isTrusted : true, newURL: newURL, oldURL : oldURL};


            //console.log(location.hash.slice(1) || '/');
            var stateObj = { stash: JSON.stringify(stash)  };
            history.pushState(stateObj, stash.path, '#' + ( stash.path == '#' ? '' : stash.path ));


            //this.base + '#' + stash.path

            window.dispatchEvent(new HashChangeEvent("hashchange", ev))
        }

        // Listen on hash change:
        window.addEventListener('hashchange', router);

        // Listen on page load:
        //window.addEventListener('load', router);


        stash.path = '#';
        stash.view = false;
        stash.view = false;
        this.app = this.route(stash);

        this.dispatch(stash);

       
        console.log( this.base  );


        //window.dispatchEvent(new HashChangeEvent( {newURL: 'dddd', oldURL : 'xx'} ))

        //location.hash = '#';
    };



})($dhx.ui.mvc = $dhx.ui.mvc || {});


