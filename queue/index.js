var q = (function(window,undefined){

	var q = function(task){
		return new init(task);
	};

	var init = q.prototype.init;
	init = function(task){
		this.queue = [];		
		this.queue.push(task);
	};

	var fn = init.prototype;
	fn.wait = function(time){
		var self = this;
		this.queue.push(function(){
			setTimeout(function(){
				self.next();	
			},time)	;
		});
		return this;
	};

	fn.then = function(task){
		this.queue.push(task);
		return this;
	};

	fn.next = function(){
		var action = this.queue.shift();	
		action && action.call(this);
		return this;
	};

	fn.start = function(){
		this.next();		
		return this;
	};

	return q;
})(window,undefined);

