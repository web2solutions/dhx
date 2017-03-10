
(function(namespace) {
    'use strict';
})(window.$dhx = window.$dhx || {});

(function(namespace) {
    'use strict';
})($dhx.ui = $dhx.ui || {});

(function(namespace) {
    'use strict';
})($dhx.ui.form = $dhx.ui.form || {});

$dhx.ui.form.utils = (function()
{
	var _private = 
	{
		spinner_width: 15, // spinner element width
		spinner_border: 2, // spinner border width
		input_border: 2, // dhtmlx constant, input border width
		spinner_number_of_arrows: 2, // internal CONSTANT
		wrapper_left_padding: 4, // dhtmlx constant, left padding of dhtmlx form input wrapper
		spinner_arrow_width: 8.58,
		inputClearIfEmpty: function() {
		    var that = _private,
		        self = this;

		    if (this.settings.mask_to_use == 'currency') {

		    } else if (this.settings.mask_to_use == 'integer') {

		    } else if (this.settings.mask_to_use == 'float') {

		    } else if (this.settings.mask_to_use == 'time') {

		    } else if (this.settings.mask_to_use == 'date') {

		    }
		},
		inputSetInitialValue:function( input, event )
		{
			var that = _private,
				self = this,
				keyup_event = document.createEvent("HTMLEvents"),
				change_event = document.createEvent("HTMLEvents"),
				date,
				y;

			if( this.input.value != '' )
				return;

			if( this.settings.mask_to_use == 'currency' )
			{
				this.input.value = 0;
				keyup_event.initEvent("keyup", false, true);
			    this.input.dispatchEvent(keyup_event);
			}
			else if( this.settings.mask_to_use == 'integer' )
			{
				this.input.value = 0;
			}
			else if( this.settings.mask_to_use == 'float' )
			{
				this.input.value = 0;
				keyup_event.initEvent("keyup", false, true);
				this.input.dispatchEvent(keyup_event);
			}
			else if( this.settings.mask_to_use == 'time')
			{
				this.input.value = '00:00:00';
				change_event.initEvent("change", false, true);
				this.input.dispatchEvent(change_event);
			}
			else if( this.settings.mask_to_use == 'date' )
			{
				date = d = new Date();
				y = d.getFullYear();
				this.input.value = '01/01/' + y;
				change_event.initEvent("change", false, true);
				this.input.dispatchEvent(change_event);
			}
		},
		spinnerSetSize: function(){
			var that = _private,
				div_input_width =  this.width,
				spinner_border = that.spinner_border,
				input_border = that.input_border,
				wrapper_left_padding = that.wrapper_left_padding,
				spinner_element_area = that.spinner_width + spinner_border + input_border,
				spinner_total_area =  spinner_element_area * this.number_of_spinners,
				new_input_width = div_input_width - spinner_total_area - wrapper_left_padding;
			
			// hack dhtmlx element
			this.wrapper.style.position = 'relative';
			this.wrapper.style.width = div_input_width + 'px';

			// set new global input size
			this.input_width = new_input_width;

			// set input style
			this.input.style.width = new_input_width + 'px';
			this.input.style.position = 'relative';
			this.input.style.zIndex = '10';
			if( this.number_of_spinners > 1 )
				this.input.style.marginLeft = ( that.spinner_width + that.spinner_border ) + 'px';
		},
		spinnerSetNumberOf:function(){
			var that = _private,
				self = this;

			if( this.settings.mask_to_use == 'currency' )
				self.number_of_spinners = 2;
			else if( this.settings.mask_to_use == 'float' )
				self.number_of_spinners = 2;
			else if( this.settings.mask_to_use == 'time')
				self.number_of_spinners = 3;
			else if( this.settings.mask_to_use == 'date' )
				self.number_of_spinners = 3;
		},
		spinnerSetSeparator: function(){
			var self = this;

			if(  self.settings && self.settings.mask_to_use  )
            {
            	if( self.settings.mask_to_use == 'time' )
            		self.separator = ':';
            	else if( self.settings.mask_to_use == 'date' )
	            	self.separator = '/';
            	else if( self.settings.mask_to_use == 'integer' )
            		self.separator = false;
            	else if( self.settings.mask_to_use == 'float' )
            		if( self.settings._settings )
            			self.separator = self.settings._settings.separator || '.' ;
            		else
            			self.separator = '.';
            	else if( self.settings.mask_to_use == 'currency' )
            		if( self.settings._settings )
            			self.separator = self.settings._settings.separator || '.';
            		else
            			self.separator = '.';
            }
		},
		spinnerCreateMainArrowsWrapper: function( component, position ){
			var self = this
				that = _private;

			self.main_arrows_wrapper = $dhx.createElement({
                tag_name: 'div',
                id: "spinner_main_arrows_wrapper_" + self.uid,
                parent: self.wrapper,
                style: 'position:absolute; z-index: 1;  top: 0px; right: 0px;',
                class: '',
                width: self.width,
                height: self.height
            });
		},
		spinnerCreateArrowsWrapper: function(){
			var self = this
				that = _private,
				left = 0;

			if( self.position == 'right_1' )
				left = that.wrapper_left_padding + self.component.input_width + that.input_border + ( that.spinner_width  + that.spinner_border ) + 2;
			else if( self.position == 'right_2' )
				left = that.wrapper_left_padding + self.component.input_width + that.input_border + ( ( that.spinner_width + that.spinner_border + 1 ) * 2);

			if( self.component.number_of_spinners == 1 )
				left = self.component.input_width + that.wrapper_left_padding + that.input_border;

			self.arrows_wrapper = $dhx.createElement({
	            tag_name: 'div',
	            id: "spinner_"+ self.position +"_arrow_wrapper_" + self.component.uid,
	            parent: self.component.main_arrows_wrapper,
	            style: 'position:absolute; top:0px; left:' + left + 'px;',
	            class: '',
	            width: that.spinner_width,
	            height: self.component.height
	        });
		},
		spinnerCreateArrow: function( direction ){
			var self = this
				that = _private,
				mouse_up = false,
				interval = null,
				left = 0; // 
			
			left = ( that.spinner_width / 2 ) - ( that.spinner_arrow_width / 2 );

			self[ 'arrow_element_' + direction ] = $dhx.createElement({
                tag_name: 'div',
                id: "spinner_"+ self.position +"_"+direction+"_arrow_" + self.component.uid,
                parent: self.arrows_wrapper,
                style: '',
                class: 'spinner_' + direction,
                width: that.spinner_width,
                height: ( self.component.height / that.spinner_number_of_arrows ) - that.spinner_border,
                html: '<i style="position: absolute; '+( direction == 'up' ? 'top' : 'bottom' )+': 0px; left:'+ left +'px;" data-spin="'+direction+'" class="icon-sort-'+direction+'"></i>',
            });

            self[ 'arrow_element_' + direction ].addEventListener('click', function(event)
            {
            	that.spinnerDoArrowClick.call( self, direction );
            });

            self[ 'arrow_element_' + direction ].addEventListener('mousedown', function(event)
            {
            	interval = setInterval(function(){
            		that.spinnerDoArrowClick.call( self, direction );
            	}, 100);
            });

            self[ 'arrow_element_' + direction ].addEventListener('mouseup', function(event)
            {
            	clearInterval(interval);
            });

            self[ 'arrow_element_' + direction ].addEventListener('mouseleave', function(event)
            {
            	clearInterval(interval);
            });
		},
		spinnerCreateArrows: function( ){
			var self = this
				that = _private; // 
			
			that.spinnerCreateArrowsWrapper.call( self );
			that.spinnerCreateArrow.call( self, 'up' );
			that.spinnerCreateArrow.call( self, 'down' );
		},
		spinnerSetInitialValue:function(){
			var self = this,
				that = _private,
				initial_value = '';
			// START set initial value
			that.inputSetInitialValue.call(self.component);
			initial_value = self.component.input.value;
			if (self.component.settings.mask_to_use == 'currency') {
			    if (Number(initial_value) === 0) {
			        initial_value = '0' + self.component.separator + '00';
			    }
			} 
			else if (self.component.settings.mask_to_use == 'float') initial_value = self.component.input.value;
			else if (self.component.settings.mask_to_use == 'time') initial_value = self.component.input.value;
			else if (self.component.settings.mask_to_use == 'date') initial_value = self.component.input.value;
			// END set initial value

			return initial_value;
		},
		// BUG 
		spinnerCalculateValue:function( direction ){
			var self = this,
				that = _private,
				initial_value = '',
				array_value = '',
			    v_left,
			    v_right_1,
			    v_right_2,
			    string_value = '';

			// start set default number position values
			initial_value = that.spinnerSetInitialValue.call( self )
			array_value = initial_value.split(self.component.separator);
			v_left = array_value[0] || '';
			v_left = v_left.toString().replace(/,/g,'').replace(/\./g,'');
			v_right_1 = array_value[1] || '';
			v_right_2 = array_value[2] || '';
			// end set default number position values

			// START calculate number position values
			if (self.position == 'left') 
			{
			    if(direction == 'up')  v_left = Number(v_left) + 1;
			    if(direction == 'down')  v_left = Number(v_left) - 1;
			    if( self.component.settings.mask_to_use == 'time' || self.component.settings.mask_to_use == 'date' )
			    	if( v_left.toString().length == 1  ) v_left = '0' + v_left;
			} 
			else if (self.position == 'right_1') 
			{
			    if(direction == 'up')  v_right_1 = Number(v_right_1) + 1;
			    if(direction == 'down')  v_right_1 = Number(v_right_1) - 1;
			    if( v_right_1 <= 0) v_right_1 = '00';
			    if( v_right_1.toString().length == 1  ) v_right_1 = '0' + v_right_1;
			} 
			else if (self.position == 'right_2') 
			{
			    if(direction == 'up')  v_right_2 = Number(v_right_2) + 1;
			    if(direction == 'down')	v_right_2 = Number(v_right_2) - 1;
			    if( v_right_2 <= 0) v_right_2 = '00';
			    if( v_right_2.toString().length == 1  ) v_right_2 = '0' + v_right_2;
			}
			
			string_value = String( v_left );
			
			if (v_right_1 && v_right_1 != '')
				string_value = string_value + self.component.separator + v_right_1;

			if (v_right_2 && v_right_2 != '')
				string_value = string_value + self.component.separator + v_right_2;
			// END calculate number position values, return string_value


			return string_value;
		},
		spinnerDoArrowClick:function( direction ){
			var self = this,
				that = _private;

			// calculate and set DHTMLX input value
			self.component.input.value = that.spinnerCalculateValue.call( self, direction );
			
			// dispatch arrow spinner click event
			that.spinnerDispatchArrowClickEvent.call( self );
		},
		spinnerDispatchArrowClickEvent:function(){
			var self = this,
			    evt = document.createEvent("HTMLEvents");

			if (self.component.settings.mask_to_use == 'currency')
				evt.initEvent("keyup", false, true);
			else if (self.component.settings.mask_to_use == 'float')
				evt.initEvent("keyup", false, true);
			else if (self.component.settings.mask_to_use == 'integer')
				evt.initEvent("keyup", false, true);
			else if (self.component.settings.mask_to_use == 'time')
				evt.initEvent("change", false, true);
			else if (self.component.settings.mask_to_use == 'date')
				evt.initEvent("change", false, true);

			self.component.input.dispatchEvent(evt);
		},
		spinnerSetInputEvents: function(){
			var self = this,
				that = _private;
			self.input.addEventListener('click', function(event)
			{
	            that.inputSetInitialValue.call( self );
            });
            self.input.addEventListener('blur', function(event)
			{
	            that.inputClearIfEmpty.call( self, this, event );
            });
		},
		spinnerCreate: function(){
			var self = this,
				that = _private,
				number_of_spinners_created = 0;

			// create spinners
            while( number_of_spinners_created < self.number_of_spinners )
            {
            	if( number_of_spinners_created == 0 )
            		self.left_spinner_component = new API.upDownElement( self, 'left' );
            	else if( number_of_spinners_created == 1 )
            		self.right_1_spinner_component = new API.upDownElement( self, 'right_1' );
            	else if( number_of_spinners_created == 2 )
            		self.right_2_spinner_component = new API.upDownElement( self, 'right_2' );

            	number_of_spinners_created += 1;
            }
		},
		spinnerSetComponentCss: function(){
			var self = this,
				that = _private,
				input_ccs,
				wrapper_ccs;

			// css
			input_ccs = window.getComputedStyle(self.input);
			wrapper_ccs = window.getComputedStyle(self.wrapper);

			self.width = Number(wrapper_ccs.width.replace(/px/, ''));
            self.height = Number(wrapper_ccs.height.replace(/px/, ''));

            self.input_width = Number(input_ccs.width.replace(/px/, ''));
            self.input_height = Number(input_ccs.height.replace(/px/, ''));
            // end css
		},
	},
	API = {
		spinner: function( c ){
			var self = this,
				that = _private;
			// default number of spinners per input
			self.number_of_spinners = 1;
			// dhtmlx input settings object
			self.settings = c.settings;
			// internal unique ID. Use dhtmlx input id
			self.uid = c.input.id;
			// dhtmlx form input field
			self.input = c.input;
			// dhtmlx form input field's div wrapper
			self.wrapper = c.input.parentNode;
			// div wrapper - store arrows. it is positioned behind the dhtmlx form input field
            self.main_arrows_wrapper = null;
            // value separator
            self.separator = null;
            // component size
            self.width = 0;
            self.height = 0;
            // dhtmlx input size size
            self.input_width = 0;
            self.input_height = 0;
            // spinners
            self.left_spinner_component = null;
			self.right_1_spinner_component = null;
			self.right_2_spinner_component = null;

			// set main commom input events
			that.spinnerSetInputEvents.call( self );
			// set some component css properties
			that.spinnerSetComponentCss.call( self );
            // create div wrapper
            that.spinnerCreateMainArrowsWrapper.call( self );
            // set value separator
            that.spinnerSetSeparator.call( self );
            // set number of spinner elements to this input
            that.spinnerSetNumberOf.call( self );
            // set size for each spinner element
            that.spinnerSetSize.call( self );
            // create input number spinners
            that.spinnerCreate.call( self );
		},
		upDownElement: function( component, position )
		{
			var self = this,
				that = _private,
				arrows_wrapper;
			// reference to main spinner component
			self.component = component;
			// arrows position in main spinner component area
			self.position = position; // left, right_1, right_2
			that.spinnerCreateArrows.call( self );
		},
	};

	return API;
})();