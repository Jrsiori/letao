$(function() {
	//将地址栏的key值放入input
	var key = getSearch('key');
	$('.lt_search input').val(key);

	//定义全局的page与pageSize
	var page = 1;
	var pageSize = 4;

	//发送ajax 获取数据渲染
	function render(callback) {
		//$('.product').html('<div class="loading"></div>');

		var param = {};
		//必须传递的数据
		param.page = page;
		param.pageSize = pageSize;
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
				console.log(info);
				setTimeout(function() {
					callback(info);
					//$('.product').html(template('tpl', info));
				}, 500);
			}
		})
	}

//	render();

	//搜索
	$('.lt_search button').on('click', function() {
		//重置排序按钮的样式
		$('.lt_sort a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-double-down');
		//获取搜索框的值
		key = $('.lt_search input').val();
		//重新渲染 让容器下拉刷新即可
		//render();
		mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
		//在本地存储搜索记录
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
		//清空搜索框
		$('.lt_search input').val('');
	})

	//排序
	$('.lt_sort a[data-type]').on('tap', function() {
		var $this = $(this);
		if($this.hasClass('now')) {
			$this.find('span').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
		} else {
			$this.addClass("now").siblings().removeClass("now");
			$(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
		}
		//render();
		mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
	})

	//配置下拉刷新和上拉加载
	mui.init({
		pullRefresh: {
			container: '.mui-scroll-wrapper',
			down: { //下拉刷新重新加载第一页
				auto: true,
				callback: function() {
					page = 1;
					render(function(info) {
						$('.product').html(template('tpl', info));
						//结束下拉刷新
						mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
						//重置上拉加载
						mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
					})
				}
			},
			up: { //上拉加载下一页
				callback: function() {
					page++;
					render(function (info) {
						if (info.data.length > 0) {
							$('.product').append(template('tpl', info));
							mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
						} else {
							mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
						}
					})
				}
			}
		}
	})

})