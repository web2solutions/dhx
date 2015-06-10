/*jslint browser: true, devel: true, eqeq: true, newcap: true, nomen: true, white: true, maxerr : 1000, indent : 2, sloppy : true */
/*global $dhx, dhtmlx, Element */
var $dhx = {
    version: '1.0.3',
    _enable_log: false,
    windowWidth: 0,
    windowHeight: 0,
    /**
		@function loadScript -  load javascript files - code injection
		@param {string}	url - the url of a given javascript file which will be loaded
		@param {function}	callback - 	function  callback which will be executed after the javascript file 100% loaded
	*/
    loadScript: function(url, callback) {
            url = url + ".js";
            var script = document.createElement('script');
            script.type = 'text/javascript';
            if (script.readyState) { //IE
                script.onreadystatechange = function() {
                    console.log(script.readyState);
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                script.onload = function() {
                    callback();
                };
            }
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        }
        /* load javascript files - code injection */
        ,
    environment: "test",
    onDemand: {
        queue: [],
        load: function(url, callback) {
            var self = $dhx.onDemand;
            var uid = new Date().getTime();
            self.queue[uid] = [];
            //console.log("load");
            //$dhx.exposeForEach();
            if ($dhx.isArray(url)) {
                url.forEach(function(path, index, array) {
                    if ($dhx.environment != "production") self.queue[uid].push(path + "?uistring=" + (new Date()).getTime());
                    else self.queue[uid].push(path);
                });
            } else {
                self.queue[uid].push(url);
            }
            $dhx.showDirections("Loading_Files");
            self.process_queue(callback, uid);
        },
        process_queue: function(callback, uid) {
            var self = $dhx.onDemand;
            //console.log(self.queue.length);
            if (self.queue[uid].length > 0) {
                var first_on_queue = self.queue[uid].shift();
                try {
                    document.getElementById("$dhx_splash_div_file_info").innerHTML = 'loading <br>' + first_on_queue.split("/")[first_on_queue.split("/").length - 1];
                } catch (e) {}
                $dhx.lScript(first_on_queue, function() {
                    try {
                        document.getElementById("$dhx_splash_div_file_info").innerHTML = '';
                    } catch (e) {}
                    self.process_queue(callback, uid);
                });
            } else {
                $dhx.hideDirections();
                callback();
            }
        }
    }
    /**
		@function loadScript -  load script - code injection
		@param {string}	url - the url of a given javascript file which will be loaded
		@param {function}	callback - 	function  callback which will be executed after the javascript file 100% loaded
	*/
    ,
    lScript: function(url, callback) {
        var self = this,
            arrType, type, s, nodeType, node, tag_id = url.split("?")[0];
        //console.log("lScript");
        //console.log(url);
        //console.log(document.getElementById(url));
        if (document.getElementById(url) == null) {
            arrType = url.split(".");
            type = arrType[arrType.length - 1];
            //console.log(url);
            if (url.indexOf(".css") != -1) {
                nodeType = "link";
                node = document.createElement(nodeType);
                //node = document.createStyleSheet(url);
                node.setAttribute("rel", "stylesheet");
                node.setAttribute("type", "text/css");
                if (url.indexOf("?") != -1) node.setAttribute("href", url);
                else node.setAttribute("href", url);
            } else {
                nodeType = "script";
                node = document.createElement(nodeType);

                node.setAttribute("type", "text/javascript");
                node.async = 'true';
                if (url.indexOf("?") != -1) node.setAttribute("src", url);
                else node.setAttribute("src", url);
            }
            node.setAttribute("id", url);
            if (node.readyState) {

                node.onreadystatechange = function() {
                    if (node.readyState == 'loaded' || node.readyState == 'complete') {
                        console.log(node.readyState);
                        node.onreadystatechange = null;
                        //console.log("loaded  " + url);
                        callback();
                    }
                };
            } else {
                //console.log(type);
                if (url.indexOf(".css") != -1) {
                    callback();
                } else {
                    //console.log("no ie");
                    //console.log(node.onload);
                    node.onload = function() {
                        //console.log("loaded");
                        //console.log("loaded  " + url);
                        callback();
                    };

                    node.onerror = function(e) {
                        if ($dhx._enable_log) console.log("error on loading file: " + e.target.src.split("/")[e.target.src.split("/").length - 1]);
                        //console.log("loaded  " + url);
                        document.getElementById("$dhx_splash_div_file_info").innerHTML = '<br>error</b> when loading the file: <br>' + e.target.src.split("/")[e.target.src.split("/").length - 1];
                        //callback();
                    };
                }
            }
            //console.log( url );
            //console.log(document.getElementsByTagName('head')[0].appendChild(node));
            document.getElementsByTagName('head')[0].appendChild(node);
            //s = document.getElementsByTagName('script')[0];
            //s.parentNode.insertBefore(node, s);
        } else {
            //console.log("already exist");
            callback();
        }
    }


    ,
    getElementPosition: function(x, cordinate) {
        //console.log("element");
        var o = document.getElementById(x);
        var l = o.offsetLeft;
        var t = o.offsetTop;
        while (o = o.offsetParent) l += o.offsetLeft;
        o = document.getElementById(x);
        while (o = o.offsetParent) t += o.offsetTop;
        if (cordinate == "y") {
            //console.log(cordinate + ": " + _y);
            return t - 150;
        } else {
            //console.log(cordinate + ": " + _x);
            return l - 200;
        }
    },
    getPagePosition: function(cordinate, width, height) {
            var self = this,
                l = 0,
                t = 0,
                d = document,
                w = window;
            if (!window.pageYOffset) {
                if (!(document.documentElement.scrollTop == 0)) {
                    t = d.documentElement.scrollTop;
                    l = d.documentElement.clientWidth;
                } else {
                    t = d.body.scrollTop;
                    l = document.body.clientWidth;
                }
            } else {
                t = w.pageYOffset;
                l = w.innerWidth;
            }
            l = (l / 2) - (width / 2);
            if (window.innerHeight) {
                t = t + (window.innerHeight / 2) - (height / 2);
            } else {
                t = t + (document.body.clientHeight / 2) - (height / 2);
            }
            if (cordinate == "y") {
                return t;
            } else {
                return l;
            }
        }
        /**
		@object Browser -  performs Browser and OS identifying

		@property Browser.name
		@property Browser.version
		@property Browser.OS

			usable properties
				Browser.name
				Browser.version
				Browser.OS
	*/
        ,
    Browser: {
        /* quirksmode.org */
        init: function() {
            this.name = this.searchString(this.dataBrowser) || "An unknown browser";
            this.onLine = (navigator.onLine) || "Unknow connection status";
            this.cookieEnabled = (navigator.cookieEnabled) || "Unknow cookies permission";
            this.plugins = (navigator.plugins) || "Unknow plugins";
            /*

			navigator.geolocation = [object Geolocation]
			navigator.onLine = true
			navigator.cookieEnabled = true
			navigator.vendorSub =
			navigator.vendor = Google Inc.
			navigator.productSub = 20030107
			navigator.product = Gecko
			navigator.mimeTypes = [object MimeTypeArray]
			navigator.plugins = [object PluginArray]
			navigator.platform = Win32
			navigator.userAgent = Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31
			navigator.language = pt-BR
			navigator.appVersion = 5.0 (Windows NT 6.2) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31
			navigator.appName = Netscape
			navigator.appCodeName = Mozilla
			navigator.doNotTrack = null
			navigator.javaEnabled = function javaEnabled() { [native code] }
			navigator.getStorageUpdates = function getStorageUpdates() { [native code] }
			navigator.registerProtocolHandler = function registerProtocolHandler() { [native code] }
			navigator.webkitGetGamepads = function webkitGetGamepads() { [native code] }
			navigator.webkitGetUserMedia = function webkitGetUserMedia() { [native code] }

			*/
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function(data) {
            for (var i = 0; i < data.length; i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1) return data[i].identity;
                } else if (dataProp) return data[i].identity;
            }
        },
        searchVersion: function(dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
        },
        isPlugin: function(which_plugin) {
            (typeof which_plugin === 'undefined') ? which_plugin = "notspecified": "";
            for (var plugin in $dhx.Browser.plugins) {
                if ($dhx.Browser.plugins.hasOwnProperty(plugin)) {
                    (typeof $dhx.Browser.plugins[plugin].name === 'undefined') ? $dhx.Browser.plugins[plugin].name = "Unknow plugin": "";
                    var regex = new RegExp("" + which_plugin.toString() + "", "g");
                    if (typeof $dhx.Browser.plugins[plugin].name !== 'undefined') {
                        if ($dhx.Browser.plugins[plugin].name.match(regex)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        dataBrowser: [{
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        }, {
            string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        }, {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        }, {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        }, {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        }, {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        }, {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        }, {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        }, { // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        }, {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        }, {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        }, { // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }],
        dataOS: [{
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        }, {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        }, {
            string: navigator.userAgent,
            subString: "iPhone",
            identity: "iPhone/iPod"
        }, {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }]
    }
    /**
		@function getAndSetWindowDimension -  get the current window width and height and set the public properties $dhx.windowWidth and $dhx.windowHeight
	*/
    ,
    getAndSetWindowDimension: function() {
            var self = $dhx,
                d = document,
                w = window;
            // w3c
            if (w.innerWidth) {
                self.windowWidth = w.innerWidth;
                self.windowHeight = w.innerHeight;
            } else { // old IEs
                if (!(d.documentElement.scrollTop == 0)) {
                    $dhx.windowWidth = d.documentElement.clientWidth;
                    $dhx.windowHeight = d.documentElement.clientHeight;
                } else {
                    $dhx.windowWidth = d.body.clientWidth;
                    $dhx.windowHeight = d.body.clientHeight;
                }
            }
        }
        /**
		@function checkBrowserStuff -  check if the current browser is able to run AJAX applications
		@return {boolean} - true / false
	*/

    ,
    hideDirections: function() {
        try {
            document.getElementById("$dhx_wrapper_splash").parentNode.removeChild(document.getElementById("$dhx_wrapper_splash"));
            document.getElementById("$dhx_splash").parentNode.removeChild(document.getElementById("$dhx_splash"));
            document.getElementById("$dhx_splash_div_file_info").parentNode.removeChild(document.getElementById("$dhx_splash_div_file_info"));
            //document.getElementById("$dhx_splash").style.display = "none";
        } catch (e) {}
    },
    showDirections: function(m) {
        var self = this,
            template = '',
            div_wrapper, div_splash, div_file_info;
        div_wrapper = document.createElement("DIV");
        div_wrapper.setAttribute("style", '-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; filter: alpha(opacity=50);');
        div_wrapper.setAttribute("id", '$dhx_wrapper_splash');
        div_wrapper.style.width = "100%";
        div_wrapper.style.height = "100%";
        div_wrapper.style.position = "fixed";
        div_wrapper.style.top = "0";
        div_wrapper.style.left = "0";
        div_wrapper.style.zIndex = "9999";
        div_wrapper.style.backgroundColor = "#000000";
        div_wrapper.style.opacity = "0.5";
        div_splash = document.createElement("DIV");
        div_splash.setAttribute("style", 'font-size:17px;padding-top:95px;padding-right:50px;padding-left:8px;color:#F0F0F0;line-height:18px;');
        div_splash.setAttribute("id", '$dhx_splash');
        div_splash.style.width = "560px";
        div_splash.style.height = "243px";
        div_splash.style.position = "fixed";
        //div_splash.style.margin = "auto";
        if (self.windowHeight == 0) {
            self.getAndSetWindowDimension();
        }
        div_splash.style.top = ((self.windowHeight / 2) - 183) + "px";
        div_splash.style.left = ((self.windowWidth / 2) - 250) + "px";
        div_splash.style.zIndex = "99999";
        //div_splash.style.backgroundColor = "#ffffff";
        div_splash.style.backgroundImage = "url('" + splash_base64 + "')";

        div_splash.style.backgroundRepeat = "no-repeat";
        div_splash.style.opacity = "1";
        div_splash.style.textAlign = "left";

        div_file_info = document.createElement("DIV");
        div_file_info.setAttribute("style", "white-space:nowrap;font-size:14px; color:white;");
        div_file_info.setAttribute("id", '$dhx_splash_div_file_info');
        div_file_info.style.width = "400px";
        div_file_info.style.height = "30px";
        div_file_info.style.position = "fixed";
        div_file_info.style.top = ((self.windowHeight / 2) - 30) + "px";
        div_file_info.style.left = ((self.windowWidth / 2) - 150) + "px";
        div_file_info.style.zIndex = "999999";
        //div_file_info.style.backgroundImage = "url(" + $dhx_location + "imgs/splash.png)";




        if (m == "MSXML") {
            template = template + '<b>Your browser is out of date</b> <br>';
            template = template + 'Your computer does not have a necessary component installed <br>';
            template = template + '<b>Please click <a target="_blank" style="color:#003399;" href="http://www.microsoft.com/en-us/download/details.aspx?id=19662" title="download">here</a> to install the component or use Firefox or Google Chrome</b>';
        } else if (m == "COMPONENTS_DISABLED") {
            template = template + 'You are running Internet Explorer under <b>"no add-ons"</b> mode, <br>';
            template = template + 'or ActiveXs are disabled <br>';
            template = template + 'Close your browser and open the Internet Explorer again by reaching:<br><b>Start menu -> All Programs -> Internet Explorer</b>';
        } else if (m == "PDF_MISSING") {
            template = template + 'The Acrobat Reader plugin could not be found! <br>';
            template = template + 'If you are running IE, the ActiveXs may be disabled. Try to enable it. <br>';
            template = template + 'You can also try to install Acrobat reader. <b>Please click <a target="_blank" style="color:#003399;" href="http://get.adobe.com/br/reader/" title="download">here</a> to download and install free Acrobat Reader</b>';
        } else if (m == "BROWSER_VERSION_OUT_TO_DATE") {
            template = template + 'You are running ' + $dhx.Browser.name + ' ' + $dhx.Browser.version + '.<br>';
            template = template + 'This version is not supported anymore.<br>';
            template = template + 'Please download and install a new version of it.';
        } else if (m == "BROWSER_NOT_ALLOWED") {
            template = template + 'You are running ' + $dhx.Browser.name + ' ' + $dhx.Browser.version + '.<br>';
            template = template + 'This Browser vendor is not supported.<br>';
            template = template + 'List of supported browsers: <b>Internet Explorer 8+, Safari, Chrome 13+, Firefox 5+</b>';
        } else if (m == "Loading_Files") {
            template = template + '';
            template = template + '<b>Loading files ...</b><br>';
            template = template + 'please wait!';
        } else if (typeof m === 'undefined') {
            template = template + '';
            template = template + '<b> ...</b><br>';
            template = template + 'please wait!';
        } else {
            template = template + '';
            template = template + m;
            //template = template + 'please wait!';
        }
        div_splash.innerHTML = template;
        //document.getElementById("$dhx_wrapper_splash").style.display = "none";
        //document.getElementById("$dhx_splash").style.display = "none";
        if (document.getElementById("$dhx_wrapper_splash") === null) {
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
                document.body.appendChild(div_file_info);
            } catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
                document.getElementsByTagName('body')[0].appendChild(div_file_info);
            }
        } else {
            document.getElementById("$dhx_wrapper_splash").style.display = "block";
            document.getElementById("$dhx_splash").style.display = "block";
            document.getElementById("$dhx_splash_div_file_info").style.display = "block";
        }
    },
    progressOff: function() {
        try {
            document.getElementById("$dhx_wrapper_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_wrapper_loading_wheel"));
            document.getElementById("$dhx_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_loading_wheel"));
            //document.getElementById("$dhx_splash").style.display = "none";
        } catch (e) {}
    },
    progressOn: function(m) {
        var self = this,
            template = '',
            div_wrapper, div_splash;
        div_wrapper = document.createElement("DIV");
        div_wrapper.setAttribute("style", 'filter: alpha(opacity=15); -moz-opacity: 0.15; opacity: 0.15; background-color: #93C0E7;');
        div_wrapper.setAttribute("id", '$dhx_wrapper_loading_wheel');
        div_wrapper.style.width = "100%";
        div_wrapper.style.height = "100%";
        div_wrapper.style.position = "fixed";
        div_wrapper.style.top = "0";
        div_wrapper.style.left = "0";
        div_wrapper.style.zIndex = "999888";
        //div_wrapper.style.backgroundColor = "#000000";
        //div_wrapper.style.opacity = "0.5";
        div_splash = document.createElement("DIV");
        div_splash.setAttribute("style", 'font-family:Tahoma, Geneva, sans-serif; font-size:11px; color:#069; text-align:center; padding-top:30px;padding-left:10px;');
        div_splash.setAttribute("id", '$dhx_loading_wheel');
        div_splash.style.width = "233px";
        div_splash.style.height = "21px";
        div_splash.style.position = "fixed";
        //div_splash.style.margin = "auto";
        if (self.windowHeight == 0) {
            self.getAndSetWindowDimension();
        }
        div_splash.style.top = ((self.windowHeight / 2) - 25) + "px";
        div_splash.style.left = ((self.windowWidth / 2) - 121) + "px";
        div_splash.style.zIndex = "999999";
        //div_splash.style.backgroundColor = "#ffffff";
        div_splash.style.backgroundImage = "url('" + loading_gif + "')";
        div_splash.style.backgroundRepeat = "no-repeat";
        div_splash.style.opacity = "1";
        div_splash.style.textAlign = "left";
        //console.log('XXXXXXXXXXXXXXXXXXXX');
        //console.log(m);
        div_splash.innerHTML = m;
        //document.getElementById("$dhx_wrapper_loading_wheel").style.display = "none";
        //document.getElementById("$dhx_splash").style.display = "none";
        if (document.getElementById("$dhx_wrapper_loading_wheel") === null) {
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
            } catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
            }
        } else {
            document.getElementById("$dhx_wrapper_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_wrapper_loading_wheel"));
            document.getElementById("$dhx_loading_wheel").parentNode.removeChild(document.getElementById("$dhx_loading_wheel"));
            try {
                document.body.appendChild(div_wrapper);
                document.body.appendChild(div_splash);
            } catch (e) {
                document.getElementsByTagName('body')[0].appendChild(div_wrapper);
                document.getElementsByTagName('body')[0].appendChild(div_splash);
            }
        }
    },

    toWords: function(s) {
        // Convert numbers to words
        // copyright 25th July 2006, by Stephen Chapman http://javascript.about.com
        // permission to use this Javascript on your web page is granted
        // provided that all of the code (including this copyright notice) is
        // used exactly as shown (you can change the numbering system if you wish)
        // American Numbering System
        var th = ['', 'thousand', 'million', 'billion', 'trillion'];
        // uncomment this line for English Number System
        // var th = ['','thousand','million', 'milliard','billion'];
        var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        //function toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if (s != parseFloat(s)) return 'not a number';
        var x = s.indexOf('.');
        if (x == -1) x = s.length;
        if (x > 15) return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for (var i = 0; i < x; i++) {
            if ((x - i) % 3 == 2) {
                if (n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                } else if (n[i] != 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            } else if (n[i] != 0) {
                str += dg[n[i]] + ' ';
                if ((x - i) % 3 == 0) str += 'hundred ';
                sk = 1;
            }
            if ((x - i) % 3 == 1) {
                if (sk) str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if (x != s.length) {
            var y = s.length;
            str += 'point ';
            for (var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
        }
        return str.replace(/\s+/g, ' ');
        //}
    },


    isArray: function(what) {
        return Object.prototype.toString.call(what) === '[object Array]';
    },
    isObject: function(what) {
        return ((typeof what == "object") && (what !== null) && (Object.prototype.toString.call(what) !== '[object Array]'));
    },
    isNumber: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isValidDate: function(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]") return false;
        return !isNaN(d.getTime());
    },
    isDate: function(d) {
        if (Object.prototype.toString.call(d) !== "[object Date]") return false;
        return !isNaN(d.getTime());
    },
    isFunction: function(obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },
    toCurrency: function(num) {
        x = 0;
        if (num < 0) {
            num = Math.abs(num);
            x = 1;
        }
        if (isNaN(num)) num = "0";
        cents = Math.floor((num * 100 + 0.5) % 100);
        num = Math.floor((num * 100 + 0.5) / 100).toString();
        if (cents < 10) cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
        ret = num + '.' + cents;
        if (x == 1) ret = ' - ' + ret;
        return ret;
    },
    getParentByID: function(id) {
            try {
                return document.getElementById(id).parentNode;
            } catch (e) {
                return false;
            }
        }
        /**
		@function parseFloat - Convert currency string to a Javascript Float number

		@parameter currency - string or number for converting to javascript float type
			mandatory

		@parameter places - places after decimal, default: 2
			not mandatory

		@scope $dhx.parseFloat(currency, places);
	*/
        ,
    parseFloat: function(currency, places) {
            (typeof places === 'undefined') ? places = 2: "";
            currency = currency.replace(",", "");
            return parseFloat(currency).toFixed(places);
        }
        /**

		@function ext -  check if the current browser is able to run AJAX applications

		@parameter parentClass - An Object Literal Class which will be the inherited class, OR, null
			if null, NO Parent Class will be inherited when creating your Class
			mandatory

		@parameter objClass - An Object Literal notation of your Class
			mandatory

		@parameter nameSpaceName - string value holding the namespace path where the created
			Class will be appended as top level, OR false, OR undefined
			not mandory - default: The created object will be appended on the top level of window object

		@return object

	*/
        ,
    ext: function(parentClass, objClass, nameSpaceName) {
            var self = this,
                ob;
            (typeof nameSpaceName === 'undefined') ? nameSpaceName = false: "";
            for (var className in objClass) {
                if (nameSpaceName) {
                    var first_level = true;
                    var last_level = '';
                    nameSpaceName.split(".").forEach(function(level, index, array) {
                        if (first_level) {
                            window[level] = window[level] || {};
                            //console.log(window[level]);
                            //ob = window[level][className];
                            last_level = window[level];
                            first_level = false;
                        } else {
                            //console.log(last_level);
                            last_level[level] = last_level[level] || {};
                            //console.log(last_level[ level ]);
                            last_level = last_level[level];
                        }
                    });
                    //console.log(last_level);
                    //console.log(className);
                    ((parentClass) && parentClass != null) ? last_level[className] = Object.create(parentClass): last_level[className] = {};
                    ob = last_level[className];
                    for (var item in objClass[className]) {
                        last_level[className][item] = last_level[item] || {}
                        last_level[className][item] = objClass[className][item];
                        ob[item] = last_level[className][item];
                    }
                    //console.log(className);
                    //console.log( root.NameSpace.usingNameSpace );
                } else {
                    ((parentClass) && parentClass != null) ? window[className] = Object.create(parentClass): window[className] = {};
                    ob = window[className];
                    for (var item in objClass[className]) {
                        ob[item] = objClass[className][item];
                    }
                }
            }
            return ob;
        }
        //,utils : {
        // $dhx.utils.shortcut.add(strAtalho, fnCallback);


    ,
    $_GET: function(id) {
        return $dhx.Request.QueryString(id).Item(1);
    },
    $Request: function(id) {
        return $dhx.Request.QueryString(id).Item(1);
    },
    param: function(id) {
        return $dhx.Request.QueryString(id).Item(1);
    },
    forceDownload: function(fileURI, fileName) {
        var myTempWindow = window.open(fileURI, '', 'left=10000,screenX=10000');
        myTempWindow.document.execCommand('SaveAs', 'null', fileName);
        myTempWindow.close();
    }

    /*

		$dhx.addEvent(window, 'popstate', function (event) {
		  //event
		  //event.state
		});

	*/
    ,
    addEvent: (function() {
        if (document.addEventListener) {
            return function(el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.addEventListener(type, fn, false);
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        } else {
            return function(el, type, fn) {
                if (el && el.nodeName || el === window) {
                    el.attachEvent('on' + type, function() {
                        return fn.call(el, window.event);
                    });
                } else if (el && el.length) {
                    for (var i = 0; i < el.length; i++) {
                        addEvent(el[i], type, fn);
                    }
                }
            };
        }
    })()

    ,
    UTF8: {
        encode: function(s) {
            for (var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l; s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]);
            return s.join("");
        },
        decode: function(s) {
            for (var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
                ((a = s[i][c](0)) & 0x80) && (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ? o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = ""));
            return s.join("");
        }
    }

    // From MDN
    ,
    notify: function(title, text, img) {
        img = img || 'http://cdn.dhtmlx.com.br/dhx/notify.png';
        // Let's check if the browser supports notifications
        if (!"Notification" in window) {
            console.log("This browser does not support notifications.");
        }
        // Let's check if the user is okay to get some notification
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(title, {
                body: text,
                icon: img
            });
            //window.navigator.vibrate(500);
        }
        // Otherwise, we need to ask the user for permission
        // Note, Chrome does not implement the permission static property
        // So we have to check for NOT 'denied' instead of 'default'
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function(permission) {
                // Whatever the user answers, we make sure Chrome stores the information
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                // If the user is okay, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(title, {
                        body: text,
                        icon: img
                    });
                }
            });
        }
    }





    ,
    jDBdStorage: {
        storeObject: function(dataset_name, dataOBJ) {
            if ($dhx._enable_log) console.time("storeObject " + dataset_name);
            localStorage.setItem(dataset_name, JSON.stringify(dataOBJ));
            if ($dhx._enable_log) console.timeEnd("storeObject " + dataset_name);
        },
        insertRecord: function(dataset_name, record, index) {
            var currently_store_string = localStorage[dataset_name];
            var currently_store_object = JSON.parse(currently_store_string);
            currently_store_object.push(record);
            $dhx.jDBdStorage.saveDatabase(dataset_name, currently_data_array);
        },
        saveDatabase: function(dataset_name, payload) {
            if ($dhx._enable_log) console.time("save dataset " + dataset_name);
            localStorage.setItem(dataset_name, JSON.stringify(payload));
            if ($dhx._enable_log) console.timeEnd("save dataset " + dataset_name);
        },
        deleteDatabase: function(dataset_name) {
            if ($dhx._enable_log) console.time("delete dataset " + dataset_name);
            localStorage.removeItem(dataset_name);
            if ($dhx._enable_log) console.timeEnd("delete dataset " + dataset_name);
        },
        get: function(dataset_name) {
            if ($dhx._enable_log) console.time("get local storage " + dataset_name);
            var currently_store_string = localStorage[dataset_name];
            if ($dhx._enable_log) console.timeEnd("get local storage " + dataset_name);
            if (localStorage[dataset_name]) {
                if ($dhx._enable_log) console.time("parse dataset " + dataset_name);
                var parsed = JSON.parse(currently_store_string);
                if ($dhx._enable_log) console.timeEnd("parse dataset " + dataset_name);
                return parsed;
            } else return localStorage[dataset_name];
        },
        getTotalRecords: function(dataset_name) {
            var currently_store_string = localStorage[dataset_name];
            if (localStorage[dataset_name]) {
                var array = JSON.parse(currently_store_string);
                return array.length;
            } else return 0;
        }
    }


    ,
    strip_tags: function(str, allowed_tags) {
        var key = '',
            allowed = false;
        var matches = [];
        var allowed_array = [];
        var allowed_tag = '';
        var i = 0;
        var k = '';
        var html = '';
        var replacer = function(search, replace, str) {
            return str.split(search).join(replace);
        };
        // Build allowes tags associative array
        if (allowed_tags) {
            allowed_array = allowed_tags.match(/([a-zA-Z0-9]+)/gi);
        }
        str += '';
        // Match tags
        matches = str.match(/(<\/?[\S][^>]*>)/gi);
        // Go through all HTML tags
        for (key in matches) {
            if (isNaN(key)) {
                // IE7 Hack
                continue;
            }
            // Save HTML tag
            html = matches[key].toString();
            // Is tag not in allowed list? Remove from str!
            allowed = false;
            // Go through all allowed tags
            for (k in allowed_array) { // Init
                allowed_tag = allowed_array[k];
                i = -1;
                if (i != 0) {
                    i = html.toLowerCase().indexOf('<' + allowed_tag + '>');
                }
                if (i != 0) {
                    i = html.toLowerCase().indexOf('<' + allowed_tag + ' ');
                }
                if (i != 0) {
                    i = html.toLowerCase().indexOf('</' + allowed_tag);
                }
                // Determine
                if (i == 0) {
                    allowed = true;
                    break;
                }
            }
            if (!allowed) {
                str = replacer(html, "", str); // Custom replace. No regexing
            }
        }
        return str;
    },
    isDHTMLXmodified: false,
    modifyDHTMLXloader: function() {
            var self = this;
            if (self.isDHTMLXmodified) {
                return;
            }
            if (typeof dtmlXMLLoaderObject !== 'undefined') {
                dtmlXMLLoaderObject.prototype.loadXML = function(a, b, c, d) {
                    this.rSeed && (a += (a.indexOf("?") != -1 ? "&" : "?") + "a_dhx_rSeed=" + (new Date).valueOf());
                    this.filePath = a;
                    this.xmlDoc = !_isIE && window.XMLHttpRequest ? new XMLHttpRequest : new XMLHttpRequest;
                    if (this.async) this.xmlDoc.onreadystatechange = new this.waitLoadFunction(this);
                    this.xmlDoc.open(b ? "POST" : "GET", a, this.async);
                    d ? (this.xmlDoc.setRequestHeader("User-Agent", "dhtmlxRPC v0.1 (" + navigator.userAgent + ")"), this.xmlDoc.setRequestHeader("Content-type", "text/xml")) : b && this.xmlDoc.setRequestHeader("Content-type", this.contenttype || "application/x-www-form-urlencoded");
                    this.xmlDoc.setRequestHeader("X-Requested-With", "DHTMLX grid parser");
                    this.xmlDoc.setRequestHeader("X-browser-name", $dhx.Browser.name);
                    this.xmlDoc.setRequestHeader("X-browser-version", $dhx.Browser.version);
                    this.xmlDoc.setRequestHeader("X-browser-os", $dhx.Browser.OS);
                    this.xmlDoc.setRequestHeader("X-browser-screen-width", screen.width);
                    this.xmlDoc.setRequestHeader("X-browser-screen-height", screen.height);
                    this.xmlDoc.setRequestHeader("X-Company-ID", $dhx.REST.API.company_id || 0);
                    this.xmlDoc.setRequestHeader("X-Company-Branch-ID", $dhx.REST.API.company_branch_id || 0);
                    this.xmlDoc.setRequestHeader("X-Person-Group", $dhx.REST.API.group || 0);
                    this.xmlDoc.setRequestHeader("X-Person-ID", $dhx.REST.API.person_id || 0);
                    //this.xmlDoc.setRequestHeader("X-Person-Type", $dhx.REST.API.person_type || '');
                    this.xmlDoc.setRequestHeader("X-client-session-id", $dhx.REST.API.client_session_id || 0);
                    this.xmlDoc.setRequestHeader("Authorization", "Digest " + $dhx.crypt.base64_encode($dhx.REST.API.token));
                    this.xmlDoc.send(c);
                    this.async || (new this.waitLoadFunction(this))()
                };
            }
            typeof window.dhtmlxAjax === 'undefined' ? (typeof dhx4.ajax !== 'undefined' ? window.dhtmlxAjax = dhx4.ajax : "") : "";
            dhtmlx.ajax.prototype = {
                getXHR: function() {
                    return dhtmlx.z ? new XMLHttpRequest : new XMLHttpRequest
                },
                send: function(a, b, c) {
                    var d = this.getXHR();
                    typeof c == "function" && (c = [c]);
                    if (typeof b == "object") {
                        var e = [],
                            f;
                        for (f in b) {
                            var g = b[f];
                            if (g === null || g === dhtmlx.undefined) g = "";
                            e.push(f + "=" + encodeURIComponent(g))
                        }
                        b = e.join("&")
                    }
                    b && !this.post && (a = a + (a.indexOf("?") != -1 ? "&" : "?") + b, b = null);
                    d.open(this.post ? "POST" : "GET", a, !this.Bb);
                    this.post && d.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    var h = this;
                    d.onreadystatechange = function() {
                        if (!d.readyState || d.readyState == 4) {
                            if (c && h)
                                for (var a = 0; a < c.length; a++) c[a] && c[a].call(h.master || h, d.responseText, d.responseXML, d);
                            c = h = h.master = null
                        }
                    };
                    d.send(b || null);
                    return d
                },
                get: function(a, b, c) {
                    this.post = !1;
                    return this.send(a, b, c)
                },
                post: function(a, b, c) {
                    this.post = !0;
                    return this.send(a, b, c)
                },
                sync: function() {
                    this.Bb = !0;
                    return this
                }
            };
            dhx.ajax.prototype = {
                master: null,
                getXHR: function() {
                    return dhx.env.isIE ? new XMLHttpRequest : new XMLHttpRequest
                },
                send: function(a, b, c) {
                    var d = this.getXHR();
                    dhx.isArray(c) || (c = [c]);
                    if (typeof b == "object") {
                        var e = [],
                            f;
                        for (f in b) {
                            var g = b[f];
                            if (g === null || g === dhx.undefined) g = "";
                            e.push(f + "=" + encodeURIComponent(g))
                        }
                        b = e.join("&")
                    }
                    b && this.request === "GET" && (a = a + (a.indexOf("?") != -1 ? "&" : "?") + b, b = null);
                    d.open(this.request, a, !this.Bb);
                    this.request === "POST" && d.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    var h = this;
                    d.onreadystatechange = function() {
                        if (!d.readyState || d.readyState == 4) {
                            dhx.ajax.count++;
                            if (c && h)
                                for (var a = 0; a < c.length; a++)
                                    if (c[a]) {
                                        var b = c[a].success || c[a];
                                        if (d.status >= 400 || !d.status && !d.responseText) b = c[a].error;
                                        b && b.call(h.master || h, d.responseText, d.responseXML, d)
                                    }
                            if (h) h.master = null;
                            c = h = null
                        }
                    };
                    d.send(b || null);
                    return d
                },
                get: function(a, b, c) {
                    arguments.length == 2 && (c = b, b = null);
                    this.request = "GET";
                    return this.send(a, b, c)
                },
                post: function(a, b, c) {
                    this.request = "POST";
                    return this.send(a, b, c)
                },
                put: function(a, b, c) {
                    this.request = "PUT";
                    return this.send(a, b, c)
                },
                del: function(a, b, c) {
                    this.request = "DELETE";
                    return this.send(a, b, c)
                },
                sync: function() {
                    this.Bb = !0;
                    return this
                },
                bind: function(a) {
                    this.master = a;
                    return this
                }
            };
            self.isDHTMLXmodified = true;
            if ($dhx._enable_log) console.log("some dhtmlx methods were modified");
        }
        /**
		@function init -  performs all the necessary tasks before let the user to use the $dhx object
	*/
        ,
    init: function(c) {
        var self = this;

        if ($dhx.$_GET("_enable_log") !== null) {
            if ($dhx.$_GET("_enable_log") == "true") $dhx._enable_log = true;
            console.log(
                "%c $dhx framework started ",
                'background: #00ebbe; color: #fff; font-size: 12px; padding: 12px; line-height: 36px; font-family: Helvetica, Arial, sans-serif;'
            );
        }
        //console.log(
        //		"%c under the hood, guy? why? \n\n\n thank you for reading my code", 
        //		'background: red; color: #fff; font-size: 30px; padding: 30px; line-height: 36px; font-family: Helvetica, Arial, sans-serif;'
        //	);
        if ($dhx._enable_log) console.info('starting $dhx');
        self.Browser.init();
        if (typeof c !== 'undefined') {
            if (c.plugins) {}
        }
        if (!self.isDHTMLXmodified) {
            self.modifyDHTMLXloader();
        }
    },
    toArray: function(obj) {
        var array = [];
        for (var index in obj) {
            if (obj.hasOwnProperty(index)) {
                array.push(obj[index])
            }
        }
        return array;
    },
    extend: function(parent, child) {
        if (typeof child === 'undefined') {
            child = {};
        }
        if (!$dhx.isObject(child)) {
            child = {};
        }
        if (typeof parent === 'undefined') {
            parent = {};
        }

        if (!$dhx.isObject(parent)) {
            parent = {};
        }
        for (var i in parent) {
            if (parent.hasOwnProperty(i)) {
                child[i] = parent[i];
            }
        }
        return child;
    },
    dhx_elements: {},
    createElement: function(c) {
        //console.log( JSON.stringify(c)  )
        var element = document.createElement(c.tag_name),
            id = c.id || 'el_' + window.dhx4.nexId();
        element.setAttribute('style', c.style || '');
        element.setAttribute('class', c.class || '');
        if (c.title) element.setAttribute('title', c.title);

        $dhx.dhx_elements[id] = c;
        element.setAttribute('id', id);
        if ($dhx.dhx_elements[id].parent) {
            $dhx.dhx_elements[id].parent.appendChild(element);
        } else {
            document.body.appendChild(element);
        }
        if ($dhx.dhx_elements[id].html) {
            element.innerHTML = $dhx.dhx_elements[id].html;
        }

        if ($dhx.dhx_elements[id].width) element.style.width = $dhx.dhx_elements[id].width + 'px';
        if ($dhx.dhx_elements[id].height) element.style.height = $dhx.dhx_elements[id].height + 'px';

        window.addEventListener('resize', function() {
            for (var id in $dhx.dhx_elements) {
                var element = document.getElementById(id);

                if (typeof $dhx.dhx_elements[id].resize_width === 'undefined') {
                    $dhx.dhx_elements[id].resize_width = false;
                }
                if (typeof $dhx.dhx_elements[id].resize_height === 'undefined') {
                    $dhx.dhx_elements[id].resize_height = false;
                }


                if ($dhx.dhx_elements[id].resize_width == true) {
                    element.style.width = window.innerWidth + 'px';
                } else if ($dhx.isNumber($dhx.dhx_elements[id].resize_width) && $dhx.dhx_elements[id].resize_width != false) {
                    element.style.width = window.innerWidth + ($dhx.dhx_elements[id].resize_width) + 'px';
                }

                if ($dhx.dhx_elements[id].resize_height == true) {
                    element.style.height = window.innerHeight + 'px';
                } else if ($dhx.isNumber($dhx.dhx_elements[id].resize_height) && $dhx.dhx_elements[id].resize_height != false) {
                    element.style.height = window.innerHeight + ($dhx.dhx_elements[id].resize_height) + 'px';
                }


                //console.log(element);
                //console.log($dhx.dhx_elements[ id ].resize_height);
                //console.log($dhx.dhx_elements[ id ].resize_width);
            }



            //if($dhx.dhx_elements[ id ].resize_height) element.style.height = $dhx.dhx_elements[ id ].resize_height() + 'px';

        }, true);


        //console.log(element);
        return element;
    },
    cdn1URL: '//cdn.dhtmlx.com.br/'
};
Object.defineProperty($dhx, 'CDN', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: '//cdn.dhtmlx.com.br/',
    enumerable: true,
    configurable: false,
    writable: false
});
Object.defineProperty($dhx, 'version', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: "1.0.0",
    enumerable: true,
    configurable: false,
    writable: false
});
Object.defineProperty($dhx, 'Author', {
    //get: function() { return bValue; },
    //set: function(newValue) { },
    value: 'José Eduardo Perotta de Almeida (www.web2solutions.com.br)',
    enumerable: true,
    configurable: false,
    writable: false
});
window.onload = function() {
    $dhx.init();
};


$dhx.cookie = {
    set: function(sKey, sValue, vEnd, bSecure) {
        var sPath = false,
            sDomain = window.location.hostname;
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=." + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    del: function(sKey, sPath, sDomain) {
        var self = $dhx.cookie;
        var sPath = false,
            sDomain = window.location.hostname;
        if (!self.hasItem(sKey)) {
            return false;
        }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function(sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    setByKey: function(cookieName, keyName, value, lngDays) {
        var self = $dhx.cookie;
        try {
            var thisCookies = unescape(self.get(cookieName));
            if (thisCookies) {
                thisCookies = thisCookies.split("&");
                ///for(){
                thisCookies.forEach(function(cookie, index, array) {
                    cookie = cookie.split("=");
                    //console.log(cookie[0]);
                    //console.log(cookie);
                    if (cookie[0] == keyName) {
                        return;
                    }
                });
                var newcookie = self.get(cookieName) + "&" + keyName + "=" + value + "";
                self.set(cookieName, newcookie, lngDays);
            } else {
                self.set(cookieName, "" + keyName + "=" + value + "", 360);
            }
            return true;
        } catch (e) {
            //console.log(e.stack);
            return false;
        }
    },
    get: function(sKey) {
        if (!sKey) {
            return null;
        }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    getByKey: function(cookiename, cookiekey) {
        var self = $dhx.cookie;
        try {
            var cookievalue = self.get(cookiename);
            if (cookievalue == "") return false;
            try {
                cookievaluesep = cookievalue.split("&");
            } catch (e) {
                return false;
            }
            for (c = 0; c < cookievaluesep.length; c++) {
                cookienamevalue = cookievaluesep[c].split("=");
                if (cookienamevalue.length > 1) //it has multi valued cookie
                {
                    if (cookienamevalue[0] == cookiekey) return unescape(cookienamevalue[1].toString().replace(/\+/gi, " "));
                } else return false;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
}
