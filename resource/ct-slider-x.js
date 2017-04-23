var SliderXPrototype = Object.create(HTMLElement.prototype);
SliderXPrototype.createdCallback = function() {
    var self = this;

    // PRIVATE VARS ------------------------------------

	var _globalName = this.getAttribute('data-id'),
		_activeSlideIdx = 1,
		_nextActiveIdx = 1,
		_isActive = false;
		_time = 500; //ms


	// end PRIVATE VARS --------------------------------

	

	// PROPERIES ---------------------------------------

	this.name = 'slider-x';
	this.slideCount = 0;

	// end PROPERIES -----------------------------------



	// INIT --------------------------------------------

	function init(){
		if(_globalName) try {
			_globalName = _globalName.replace(/-([a-z])/g, _upper );
			_globalName = _globalName.replace(_globalName[0], _globalName[0].toUpperCase() );
			
			if(window['sliderX' + _globalName]){
				throw new Error('Name for "ct-slider-x" must be unique!');
			}
			
			window['sliderX' + _globalName] = self;

		} catch (e) {
			console.error(e.name + ': ' + e.message, self);
		}

		var activeSlide = self.querySelector('slide-x.active');
		if(activeSlide){
			_activeSlideIdx = Array.prototype.indexOf.call(self.querySelector("slider-x-content").children, self) + 1
		} else {
			self.querySelector('slide-x').classList.add("active");
		}

		self.setTime(_time);
	}

	// end INIT ----------------------------------------



	// METHODS -----------------------------------------

	this.setActive = function(index) {
        if(_isActive) return -1;

        self.dispatchEvent( _setActive_(index) );

    	_isActive = true;

        if(index == _activeSlideIdx) return 0;


        var cycle = 0;

        if(index > self.slideCount){
        	index = 1;
        	cycle = 1;
        } else if(index < 1){
        	index = self.slideCount;
        	cycle = 2;
        }

        if( (index > _activeSlideIdx && cycle == 0) || cycle == 1 ){
    		self.querySelector('slide-x:nth-of-type(' + index + ')').classList.add("to-left");
    		self.querySelector('slide-x:nth-of-type(' + _activeSlideIdx + ')').classList.add("to-left");
    	} else {
    		self.querySelector('slide-x:nth-of-type(' + index + ')').classList.add("to-right");
    		self.querySelector('slide-x:nth-of-type(' + _activeSlideIdx + ')').classList.add("to-right");
    	}

    	setTimeout(function() {
    		self.querySelector('slide-x:nth-of-type(' + index + ')').classList.add("next");
    	}, 1);


        setTimeout(function() {
        	self.querySelector('slide-x:nth-of-type(' + index + ')').classList.remove("to-left");
        	self.querySelector('slide-x:nth-of-type(' + index + ')').classList.remove("to-right");
        	self.querySelector('slide-x:nth-of-type(' + _activeSlideIdx + ')').classList.remove("to-left");
        	self.querySelector('slide-x:nth-of-type(' + _activeSlideIdx + ')').classList.remove("to-right");
    		self.querySelector('slide-x:nth-of-type(' + index + ')').classList.remove("next");
    		self.querySelector('slide-x.active').classList.remove("active");
    		self.querySelector('slide-x:nth-of-type(' + index + ')').classList.add("active");
        	_activeSlideIdx = index;
        	_isActive = false;

        }, _time);

		return index;
	};



	this.next = function() {
        return self.setActive(_activeSlideIdx + 1);
    };



	this.prev = function() {
		return self.setActive(_activeSlideIdx - 1);
	};



    this.getIndex = function() {
        return _activeSlideIdx;
    };



    this.setTime = function(time) {
    	_time = time;
    	_setStyle('slider-x slide-x.active{ transition: all ' + (_time/1000) +'s }');
    	_setStyle('slider-x slide-x.to-left.next{ transition: all ' + (_time/1000) +'s }');
    	_setStyle('slider-x slide-x.to-right.next{ transition: all ' + (_time/1000) +'s }');
    };

	// end METHODS -------------------------------------



	// PRIVATE METHODS ---------------------------------

	_upper = function(word) {
		return word[1].toUpperCase();
	}



	_setStyle = function(cssText) {
    	var sheet = document.createElement('style');
    	sheet.type = 'text/css';
    	window.customSheet = sheet;
    	(document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
    	return (setStyle = function(cssText, node) {
        	if(!node || node.parentNode !== sheet)
            	return sheet.appendChild(document.createTextNode(cssText));
        	node.nodeValue = cssText;
        	return node;
    	})(cssText);
	};

	// end PRIVATE METHODS -----------------------------



    // CUSTOM EVENTS -----------------------------------

    var _setActive_ = function(nextIndex){
        _nextActiveIdx = nextIndex;
        return new CustomEvent("setActive", {
            bubbles: true,
            cancelable: true,
            detail: {
                nextActiveIndex: nextIndex,
            },
        });
    };

    // end CUSTOM EVENTS -------------------------------



	init(); 

};
var SliderX = document.registerElement('slider-x', {prototype: SliderXPrototype});










var SliderXContentPrototype = Object.create(HTMLElement.prototype);
SliderXContentPrototype.createdCallback = function() {};
var SliderXContent = document.registerElement('slider-x-content', {prototype: SliderXContentPrototype});










var SlideXPrototype = Object.create(HTMLElement.prototype);
SlideXPrototype.createdCallback = function() {
	var self = this;



  	// PRIVATE VARS ------------------------------------

	var _parent = self.parentNode.parentNode,
		_sliderXIndicators = document.querySelector("slider-x-indicators[data-id='" + _parent.getAttribute("data-id") + "']");

	// end PRIVATE VARS --------------------------------



	// PROPERIES ---------------------------------------

	this.name = 'slide-x';

	// end PROPERIES -----------------------------------



	// INIT --------------------------------------------

	function init(){
		_parent.slideCount++;
		if(_sliderXIndicators && _sliderXIndicators.addIndicator) _sliderXIndicators.addIndicator();
	}

	// end INIT ----------------------------------------



	// METHODS -----------------------------------------

	this.removeIndicator = function() {
		var item = _sliderXIndicators.querySelector("slider-x-indicator");
		if(item) item.remove();
		_parent.slideCount--;
	};

	// end METHODS -------------------------------------

	init();
};


SlideXPrototype.detachedCallback = function() {
	this.removeIndicator();
};
var SlideX = document.registerElement('slide-x', {prototype: SlideXPrototype});










var SliderXControlPrototype = Object.create(HTMLElement.prototype);
SliderXControlPrototype.createdCallback = function() {
    var self = this;
    


    // PRIVATE VARS ------------------------------------

    var _controlEvent = this.getAttribute('data-event') || "next",
        _controlParams = this.getAttribute('data-params') || "[]",
        _parent = document.querySelector("slider-x[data-id='" + this.getAttribute("data-id") + "']");

    // end PRIVATE VARS --------------------------------

    

    // PROPERIES ---------------------------------------

    this.name = 'slider-x-control';
    
    // end PROPERIES -----------------------------------
    


    // EVENTS ------------------------------------------

    this.addEventListener('click', function(e) {
        _parent[_controlEvent].apply(false, eval(_controlParams) );
    });

    // end EVENTS --------------------------------------
    
};
var SliderXControl = document.registerElement('slider-x-control', {prototype: SliderXControlPrototype});










var SliderXIndicatorPrototype = Object.create(HTMLElement.prototype);
SliderXIndicatorPrototype.createdCallback = function() {
    var self = this;


    

    // PROPERIES ---------------------------------------

    this.name = 'slider-x-indicator';
    
    // end PROPERIES -----------------------------------
    


    // EVENTS ------------------------------------------

    this.addEventListener('click', function(e) {
    	var index = Array.prototype.indexOf.call(self.parentNode.children, self) + 1;
        self.parentNode.setActive(index);
    });

    // end EVENTS --------------------------------------

};
var SliderXIndicator = document.registerElement('slider-x-indicator', {prototype: SliderXIndicatorPrototype});










var SliderXIndicatorsPrototype = Object.create(HTMLElement.prototype);
SliderXIndicatorsPrototype.createdCallback = function() {
   var self = this;
    


    // PRIVATE VARS ------------------------------------

    var _sliderX = document.querySelector("slider-x[data-id='" + self.getAttribute("data-id") + "']");

    // end PRIVATE VARS --------------------------------

    

    // PROPERIES ---------------------------------------

    this.name = 'slider-x-indicators';
    
    // end PROPERIES -----------------------------------



	// INIT --------------------------------------------

	function init(){
		for(var i = 0; i < _sliderX.slideCount; i++){
			self.addIndicator();
		}
	}

	// end INIT ----------------------------------------



   	// METHODS -----------------------------------------

	this.setActive = function(index) {
		return _sliderX.setActive(index);
	};



	this.addIndicator = function(){
		var item = document.createElement("slider-x-indicator");
        self.appendChild(item);
    };



    this.removeIndicator = function(){
        var item = self.querySelector("slider-x-indicator");
        if(item) item.remove();
    }  

	// end METHODS -------------------------------------



	init();

};
var SliderXIndicatorsPrototype = document.registerElement('slider-x-indicators', {prototype: SliderXIndicatorsPrototype});



