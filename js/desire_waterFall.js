/**
 * Created by Alan on 2014/4/26.
 */
$.extend('waterFall', function($wrap, $lis) {
	var li_width = $lis.width();
	var size = parseInt($wrap.width() / li_width);

	var heights = new Array(size);
	for (var i = 0; i < size; i++) {
		heights[i] = 0;
	}
	//存储一行left
	var lefts = new Array(size)
	for (var i = 0; i < size; i++) {
		lefts[i] = (i % size) * li_width;
	}
	var min_index = 0;
	//遍历所有li
	$lis.each(function(){
		//计算left，top
		var left = lefts[min_index];
		var top = heights[min_index];
		//更新高度数组和最小索引
		heights[min_index] += $(this).height();
		for (var j = 0; j < heights.length; j++) {
			if (heights[j] < heights[min_index]) {
				min_index = j;
			}
		}
		//添加到文档
		$(this).css({left:left+'px',top:top+'px'});
	})
}); 