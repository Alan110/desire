var swipe = function(obj,cfg){
	var base = {
		min_move_x: 20,
		min_move_y: 20,
		swipeLeft: function() {},
		swipeRight: function() {},
		swipeUp: function() {},
		swipeDown: function() {},
		preventDefaultEvents: true
	};

	for(var item in cfg){
		base[item] = cfg[item];
	}

	var isTouchMove, startTx, startTy;
	obj.addEventListener('touchstart', function( e ){
		var touches = e.touches[0];
		startTx = touches.clientX;
		startTy = touches.clientY;
		isTouchMove = false;
	},false);

	obj.addEventListener( 'touchmove', function( e ){
		isTouchMove = true;
		cfg.preventDefaultEvents && e.preventDefault();
	},false);

	obj.addEventListener('touchend', function( e ){
		if( !isTouchMove ){return; }

		var touches = e.changedTouches[0],
		endTx = touches.clientX,
		endTy = touches.clientY,
		distanceX = startTx - endTx,
		distanceY = startTy - endTy,
		isSwipe = false;
		if( Math.abs(distanceX) >= Math.abs(distanceY) ){
			if( distanceX > base.min_move_X){
				base.swipeRight();
			}
			else if( distanceY < (-1) * base.min_move_y ){
				base.swipeLeft();
			}
		}
		else{
			if( distanceY > base.min_move_y){
				base.swipeUp();
			}
			else if( distanceY < (-1) * base.min_move_y ){
				base.swipeDown();
			}
		}

	},false);
};

