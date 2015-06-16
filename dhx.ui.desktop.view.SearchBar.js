$dhx.ui.desktop.view.SearchBar = {
	version: '1.0.3'
	, appName: '$dhx Web Desktop - Active Desktop'
	, appId: '$dhx.ui.desktop.SearchBar'
	, div: null
	
	, _search_bar: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SearchBar;
		self.search_bar = $dhx.createElement({
			tag_name: 'DIV'
			, style: 'visibility:hidden;'
				//, parent: that.ActiveDesktop.active_area
			, class: 'dhx_ui_desktop_search_bar'
			, id: '$dhx.ui.desktop.search_bar'
			, width: window.innerWidth
			, height: window.innerHeight
			, resize_width: true
			, resize_height: true
		});
	}
	
	, _input_search: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SearchBar;
		self.input_search = $dhx.createElement({
			tag_name: 'input'
			, style: ''
			, parent: self.search_bar
			, class: 'dhx_ui_desktop_search_bar_input_search'
			, id: '$dhx.ui.desktop.search_bar.input_search'
			, width: 720 // 772 - 50 (padding)
			, height: 38 //  42 - 4 (Padding)
		});
		//self.input_search.contentEditable = true;
		self.input_search.placeholder = "Type something to search";
		
		self.input_search.autofocus = true;
		
		
		self.input_search.addEventListener('keydown', function (event) {
			if (self.input_search.value.length % 3) {
				window.setTimeout(function () {
					self.doSearch(self.input_search.value);
				}, 500);
			}
		});
	}
	
	, _results_wrapper: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SearchBar;
		self.results_wrapper = $dhx.createElement({
			tag_name: 'DIV'
			, style: ''
			, parent: self.search_bar
			, class: 'dhx_ui_desktop_search_bar_results_wrapper'
			, id: '$dhx.ui.desktop.search_bar.results_wrapper'
			, width: 1073
			, height: 530
		});
	}
	
	, _dataview_results: function (schema) {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SearchBar;
		self.dataview_results = new dhtmlXDataView({
			container: self.results_wrapper.id
			, type: {
				template: "#name# - #record_id# <br><br>location: <br><img width='46' height='46' src='" + $dhx.ui.cdn_address + 'dhx/ui/desktop/assets/icons/' + "" + "/#icon#'/><br>#program#"
				, height: 100
				, width: 300
			}
			, tooltip: {
				template: "Item: #name# - #collection# - #record_id#"
			}
		});
		self.dataview_results.attachEvent("onItemClick", function (itemId) {
		});
	}
	
	, doSearch: function (value) {
		var that = $dhx.ui.desktop
			, self = $dhx.ui.desktop.view.SearchBar
			, db = $dhx.ui.data.model.db[that.database]
			, schema = $dhx.ui.data.model.db[that.database].schema;
		self.dataview_results.clearAll();
		$dhx.ui.desktop.Registry.cruders.forEach(function (cruder, index, array)
		{
			if (cruder.column_to_search_id) {
				var hash = {};
				hash[cruder.column_to_search_index] = value;
				schema[cruder.collection].search.where({
					query: {
						and: hash
					, }
					, onFound: function (record_id, record, tx, event) {
						//$dhx.notify('found: ', record, 'icons/db.png');
					}
					, onReady: function (records, tx, event) {
						//console.log(records);
						var frecords = []
						records.forEach(function (recordset, index, array) {
							frecords.push(recordset);
							recordset['type'] = 'cruder';
							recordset['record_id'] = recordset[cruder.column_to_search_id];
							recordset['name'] = recordset[cruder.column_to_search_index];
							recordset['collection'] = cruder.collection;
							recordset['icon'] = cruder.icon;
							recordset['program'] = cruder.appName;
							self.dataview_results.add(recordset);
						});
						//console.log(frecords);
						//component.parse(frecords, "json"); //takes the name and format of the data source
					}
					, onerror: function () {
					}
				});
			}
		});
	}
	
	, open: function () {
		var self = $dhx.ui.desktop.view.SearchBar;
		if (self.search_bar.style.visibility == 'visible') {
			self.search_bar.style.visibility = 'hidden';
			self.search_bar.style.opacity = 0;
		}
		else {
			self.search_bar.style.visibility = 'visible';
			self.search_bar.style.opacity = 0.9;
			document.getElementById(self.input_search.id).focus();
		}
	}
	
	, close: function () {
		var self = $dhx.ui.desktop.view.SearchBar;
		self.search_bar.style.visibility = 'hidden';
		self.search_bar.style.opacity = 0;
		if (self.onClose) {
			self.onClose();
		}
	}
	
	, hide: function () {
		var self = $dhx.ui.desktop.view.SearchBar;
		self.search_bar.style.visibility = 'hidden';
		self.search_bar.style.opacity = 0;
	}
	
	, render: function (c) {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SearchBar;
		//console.log( c );
		try {
			if (c.onClose) {
				self.onClose = c.onClose;
			}
			self.open();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
	
	, start: function () {
		var that = $dhx.ui.desktop.view
			, self = $dhx.ui.desktop.view.SearchBar;
		try {
			// support for side bar
			self.configuration = {};
			self.configuration.wrapper = {
				close: function () {
					self.close();
				}
				, hide: function () {
					self.close();
				}
			};
			self._search_bar();
			self._input_search();
			self._results_wrapper()
			self._dataview_results();
		}
		catch (e) {
			console.log(e.stack);
		}
	}
};