$(function() {
	//将地址栏的key值放入input
	var key = getSearch('key');
	$('.lt_search input').val(key);

	//发送ajax 获取数据渲染
	function render() {
		$('.product').html('<div class="loading"></div>');

		var param = {};
		//必须传递的数据
		param.page = 1;
		param.pageSize = 100;
		param.proName = key;

		//对于price与num两个参数不一定要加
		//判断价格是否有now这个类，如果有now这个类，就需要传递price
		//判断库存是否有now这个类，如果有now这个类，就需要传递num
		//如果确定值：1 升序   2 降序
		var temp = $('.lt_sort a.now');
		if(temp.length > 0) {
			var sortName = temp.data('type');
			var sortValue = temp.find('span').hasClass('fa-angle-down') ? 1 : 2;
			param[sortName] = sortValue;
		}
		$.ajax({
			type: 'get',
			url: '/product/queryProduct',
			data: param,
			success: function(info) {
				//console.log(info);
				setTimeout(function() {
					$('.product').html(template('tpl', info));
				}, 500);
			}
		})
	}

	render();

	//搜索
	$('.lt_search button').on('click', function() {
		$('.lt_sort a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-double-down');
		key = $('.lt_search input').val();
		render();
		var arr = JSON.parse(localStorage.getItem('search_list') || '[]');
		var index = arr.indexOf(key);
		if(index != -1) {
			arr.splice(index, 1);
		}
		if(arr.length >= 10) {
			arr.pop();
		}
		arr.unshift(key);
		localStorage.setItem('search_list', JSON.stringify(arr));
	})

	//排序
	$('.lt_sort a[data-type]').on('click', function() {
		var $this = $(this);
		if($this.hasClass('now')) {
			$this.find('span').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
		} else {
			$this.addClass("now").siblings().removeClass("now");
			$(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
		}
		render();
	})

})