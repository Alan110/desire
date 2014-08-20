/**
 * Created by Alan on 2014/4/26.
 */
$.extend('slide', function($showbox, $lis, $left, $right) {
	var lis_wrap = $lis.parent(), 
		size = $lis.length, 
		now = 0,
		width = $lis.width();
		
	function move() {
		var left = (-1) * (now % size) * width;
		lis_wrap.animate({
			left : left
		})
	}

	//设置定时器
	$showbox.timer = setInterval(function() {
		now++;
		move();
	}, 4000);
	
	$showbox.hover(function() {
		clearInterval($showbox.timer);
	}, function() {
		$showbox.timer = setInterval(function() {
			now++;
			move();
		}, 4000);
	})
	
	//设置左右按钮
	if (arguments.length == 4) {
		if (!$right)
			return;
		$right.click(function() {
			now++;
			move();
		})
		if (!$left)
			return;
		$left.click(function() {
			now--;
			now = now < 0 ? size - 1 : now;
			move();
		})
	}

});
