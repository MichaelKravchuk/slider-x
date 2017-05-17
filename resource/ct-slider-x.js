var SliderXPrototype = Object.create(HTMLElement.prototype);
SliderXPrototype.createdCallback = function() {
    var self = this;

    // PRIVATE VARS ------------------------------------

	var _globalName = this.getAttribute('data-id'),
        _countAactiveSlide = this.getAttribute('data-count') || 1,
		_activeSlidesIdx = [],
        _nextActiveIdx = 1,
		_prevActiveIdx = 0,
		_isActive = false,
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

		var activeSlides = self.querySelectorAll('slide-x.active');
		if(activeSlides.length != 0){
            _activeSlidesIdx = [];

            Array.prototype.forEach.call(activeSlides, function(item){
                _activeSlidesIdx.push(Array.prototype.indexOf.call(self.querySelector("slider-x-content").children, item) + 1);
            });
		} else {
            _activeSlidesIdx = _range(1, _countAactiveSlide),

            Array.prototype.forEach.call(_activeSlidesIdx, function(index, i){
                self.querySelector('slide-x:nth-child(' + index + ')').classList.add("active");
                self.querySelector('slide-x:nth-child(' + index + ')').style.left = 100 * i / _countAactiveSlide + '%';
            });
        }

		self.setTime(_time);
	}

	// end INIT ----------------------------------------



	// METHODS -----------------------------------------

	this.setActive = function(type) {
        if(_isActive) return -1;
        if(type == _center()) return 0;

        if(type == 'next'){
            _prevActiveIdx = _first();
            _pushNextIdx();
        } else if(type == 'prev'){
            _prevActiveIdx = _last();
            _pushPrevIdx();
        } else if(Number.isInteger(type)){
            _prevActiveIdx = _first();
            var split = (_countAactiveSlide / 2 - (_countAactiveSlide % 2 / 2));
            var center = type - split + 1;
            var count = center - _prevActiveIdx - split;
            type = count > 0 ? 'next' : 'prev';
            
            if(type == 'next') self.next();
            else self.prev();
            
            for(var i = 1; i < Math.abs(count); i++){
                setTimeout(function(){
                    if(type == 'next') self.next();
                    else self.prev();
                }, i * _time + i*2);
            }
         
        } else return -1;
        self.dispatchEvent( _setActive_( _first() ) );

    	_isActive = true;

        var classType = undefined;
        var direction = 1;

        if(type == 'next'){
            direction = -1;
            classType = "to-left";

            self.querySelector('slide-x:nth-of-type(' + _prevActiveIdx + ')').style.left = direction * 100 / _countAactiveSlide + '%';
            self.querySelector('slide-x:nth-of-type(' + _last() + ')').classList.add(classType);

            Array.prototype.forEach.call(_activeSlidesIdx, function(item, i){
                if(i != _activeSlidesIdx.length -1)
                self.querySelector('slide-x:nth-of-type(' + item + ')').style.left = 100 * i / _countAactiveSlide + '%';
            });

            setTimeout(function() {
                self.querySelector('slide-x:nth-of-type(' + _last() + ')').classList.add("next");
                self.querySelector('slide-x:nth-of-type(' + _last() + ')').style.left = 100 - (100 / _countAactiveSlide) + '%';
            }, 50);

        } else if(type == 'prev') {
            classType = "to-right";

            self.querySelector('slide-x:nth-of-type(' + _prevActiveIdx + ')').style.left = '100%';
            self.querySelector('slide-x:nth-of-type(' + _first() + ')').classList.add(classType);

            Array.prototype.forEach.call(_activeSlidesIdx, function(item, i){
                if(i != 0)
                self.querySelector('slide-x:nth-of-type(' + item + ')').style.left = 100 * i / _countAactiveSlide + '%';
            });

            setTimeout(function() {
                self.querySelector('slide-x:nth-of-type(' + _first() + ')').classList.add("next");
                self.querySelector('slide-x:nth-of-type(' + _first() + ')').style.left = '0%';
            }, 50);
        }



        setTimeout(function() {
            Array.prototype.forEach.call(self.querySelectorAll('slide-x'), function(item, i){
                item.classList.remove(classType);
                item.classList.remove('active');
                item.classList.remove('next');
                if( _activeSlidesIdx.indexOf(i+1) == -1 ){
                    item.style.left = "";
                }
            });

            Array.prototype.forEach.call(_activeSlidesIdx, function(index){
                self.querySelector('slide-x:nth-of-type(' + index + ')').classList.add("active");
            });

        	_isActive = false;

        }, _time);

        var SliderXIndicators = document.querySelector("slider-x-indicators[data-id='" + self.getAttribute("data-id") + "']");
        if(SliderXIndicators){
            Array.prototype.forEach.call(SliderXIndicators.querySelectorAll("slider-x-indicator.active"), function(item){
                item.classList.remove('active');
            });
            Array.prototype.forEach.call(_activeSlidesIdx, function(item){
                SliderXIndicators.querySelector("slider-x-indicator:nth-child(" + item + ")").classList.add('active');
            });
        }

		return _activeSlidesIdx;
	};



	this.next = function() {
        return self.setActive("next");
    };



	this.prev = function() {
		return self.setActive("prev");
	};



    this.getIndexes = function() {
        return _activeSlidesIdx;
    };



    this.setTime = function(time) {
    	_time = time;
        var id = self.getAttribute('data-id'); 
    	_setStyle('slider-x[data-id="' + id + '"] slide-x.active{ transition: all ' + (_time/1000) +'s linear}' +
                  'slider-x[data-id="' + id + '"] slide-x.to-left{ left: 100% }' +
                  'slider-x[data-id="' + id + '"] slide-x.to-left.next{ transition: all ' + (_time/1000) +'s linear}' +
                  'slider-x[data-id="' + id + '"] slide-x.to-right{ left: -' + (100/_countAactiveSlide) +'% }' +
                  'slider-x[data-id="' + id + '"] slide-x.to-right.next{ transition: all ' + (_time/1000) +'s linear}' +
    	          'slider-x[data-id="' + id + '"] slide-x { width: ' + (100/_countAactiveSlide) +'% }');
    };

	// end METHODS -------------------------------------



	// PRIVATE METHODS ---------------------------------

	function _upper(word) {
		return word[1].toUpperCase();
	};



    function _pushNextIdx(){
        var index = _activeSlidesIdx[_activeSlidesIdx.length-1] + 1;
        _activeSlidesIdx.shift();

        if(index > self.slideCount ){
            index = 1;
        }
        _activeSlidesIdx.push( index );

        return _activeSlidesIdx;
    };



    function _pushPrevIdx(){
        var index = _activeSlidesIdx[0] - 1;
        _activeSlidesIdx.pop();

        if(index < 1){
            index = self.slideCount;
        }

        _activeSlidesIdx.unshift(index)

        return _activeSlidesIdx;
    };



	function _setStyle(cssText) {
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



    function _range(start, count, center) {
        return Array.apply(0, Array( parseInt(count) ) )
            .map(function (element, index) { 
                return index + start;  
            });
    };



    function _first(){
        return _activeSlidesIdx[0];
    };



    function _center(){
        return _activeSlidesIdx[(_countAactiveSlide / 2 - (_countAactiveSlide % 2 / 2))];
    };



    function _last(){
        return _activeSlidesIdx[_activeSlidesIdx.length - 1];
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

        Array.prototype.forEach.call(_sliderX.getIndexes(), function(index){
            self.querySelector("slider-x-indicator:nth-child(" + index + ")").classList.add('active');
        });
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



