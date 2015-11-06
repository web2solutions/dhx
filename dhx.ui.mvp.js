(function(namespace) {
    'use strict';


})(window.$dhx = window.$dhx || {});


(function(namespace) {
    'use strict';


})($dhx.ui = $dhx.ui || {});


(function(namespace) {
    'use strict';

    var root,
        _application,
        _router,
        /**
         * [application private application bootstrap constructor]
         * @param  {[Object]} stash [xxxxxxxxxxx]
         * @return {[Object]}       [returns an router object]
         */
        application = function(stash) {
            var appId;
            if (typeof stash.appId === 'undefined') {
                stash.appId = "" + Math.random() + "";
            }

            this.appId = stash.appId;
            root = stash.root;
            this.options = {};
            this.options.from = 'super';

            this.initialize(this.options);

            _application = this;
        },
        /**
         * [router private router constructor]
         * @param  {[Object]} stash [xxxxxxxxxxx]
         * @return {[Object]}       [returns an router object]
         */
        router = function(stash) {
            var self = this,
                hash = window.location.hash;

            // lets listen for browser navigate actions
            window.addEventListener("popstate", function(e) {
                //console.log(e);
                //console.log(location.hash.replace(/#/gi, ''));

                self.dispatch(e.state.url, false);
            });


            _router = this;

            /**
             * [if hash equal empty it means application is starting]
             * @param  {[string]} hash [reference to window.location.hash]
             */
            if (hash === '') {
                /**
                 * then dispatch the root route and call the associated Presenter method ( presenter.start() )
                 */
                this.dispatch('#', true);
            }
        },
        /**
         * [active_routes list of routes that are being active. Active routes are displayed on browser's URL bar]
         * @type {Array}
         */
        active_routes = [];

    /**
     * [application.prototype MVP aplication bootstrap constructor class prototype chain]
     * @type {Object}
     */
    application.prototype = {
        initialize: function(options) {
            //console.log('method from super');
            //console.log('app initialized from ' + options.from);
        },
        on: function(patter, fn) {

            if (pattern == "before:start") {

                fn(options);
            }

        }
    };


    /**
     * [router.prototype MVP router constructor class prototype chain]
     * @type {Object}
     */
    router.prototype = {
        dispatch: function(url, addEntry) {

            var method_name = this.appRoutes[url] || this.routes[url];
            if (typeof method_name === 'undefined') {
                throw 'can not dispatch to a not declared route. URL: ' + url;
            }

            console.log('dispatching ' + url);


            if (addEntry === true) {
                // Add History Entry using pushState
                if (!active_routes.contains(url)) {
                    var data = {
                            url: url
                        },
                        hash = window.location.hash,
                        title = url;
                    history.pushState(data, title, (url == '#' ? url : (hash === '' ? '#' : hash) + url));
                    active_routes.push(url);
                    //window.location.replace("http://www.w3schools.com");
                }
            }

            if (this.presenter[method_name]) {
                this.presenter[method_name]();
            } else if (_router[method_name]) {
                _router[method_name]();
            }
        }, 

        route: function(stash) {
            console.log( 'route' );
        }
    };

    /**
     * [$dhx.ui.mvp.router Public access to MVP router features]
     * @type {Object}
     */
    namespace.router = {
        /**
         * [extend generate a new router constructor by inheriting the mvp router and append the methods from factory]
         * @param  {[Object]} factory [a collection of public properties and methods]
         * @return {[constructor]}         [MVP router constructor]
         */
        extend: function(factory) {
            var start = function() {
                console.log('start from extend factory');
            };
            return namespace.extend({
                base : router,
                factory : factory,
                onBeforeExtend : function ( factory ){
                    /**
                     * [factory a collection of public properties and methods]
                     * @type {[Object}
                     */
                    factory = factory || {};
                    // set a presenter class if it was not set when extending the router
                    factory.presenter = factory.presenter || {
                        start: start
                    };
                    // set a start method for the presenter if it was not set when extending the router
                    factory.presenter.start = factory.presenter.start || start;

                    // set a empty collection of application routes if it was not set when extending the router
                    factory.appRoutes = factory.appRoutes || {};
                    
                    //set a empty collection of routes created on the fly if it was not set when extending the router
                    factory.routes = factory.routes || {};

                    // map root route that will call the presenter.start();
                    if (!factory.appRoutes.hasOwnProperty('#')) {
                        factory.appRoutes['#'] = 'start';
                    }
                }
            });
        }
    };


    /**
     * [$dhx.ui.mvp.application public access to MVP application bootstrap]
     * @type {Object}
     */
    namespace.application = {
        /**
         * [extend generate a new application bootrap constructor by inheriting the mvp application schema and append the methods from factory]
         * @param  {[Object]} factory [a collection of public properties and methods]
         * @return {[constructor]}         [MVP router constructor]
         */
        extend: function(factory) {
            return namespace.extend({
                base : application,
                factory : factory,
                onBeforeExtend : function (){

                }
            });
        }
    };

    /**
     * [$dhx.ui.mvp.extend generate a new constructor by inheriting a base class and appending the methods from a factory]
     * @param  {[Object]} c [A JSON object containing the following properties and methods]
     * @param  {[Constructor]}      c.base [a constructor function to be used as base class ]
     * @param  {[Object]}           c.factory [a collection of public properties and methods to be appended to the new generated constructor]
     * @return {[Constructor]} constructor [returns a new object constructor that inherits the base class and the factory]
     */
    namespace.extend = function( c ) {
        var base = c.base, 
            factory = c.factory,
            sub = null;

        if( c.onBeforeExtend )
        {
            c.onBeforeExtend(factory);
        }

        sub = function(stash) {
            stash = stash || {};
            base.call(this, stash);
            //console.log('hello from application sub');
            //console.log(arguments);
            //this.initialize( { from : 'sub' } );
        };

        sub.prototype = Object.create(base.prototype);
        sub.prototype.constructor = sub;

        for (var name in factory) {
            if (factory.hasOwnProperty(name)) {
                sub.prototype[name] = factory[name];
            }

        }
        return sub;
    };

})($dhx.ui.mvp = $dhx.ui.mvp || {});