$(function () {
	function render () {
		$.ajax({
			type : 'get',
			url : '/cart/queryCart',
			success : function (info) {
				//console.log(info);
				setTimeout(function () {
					//没有登录 跳到登录页 登陆后需要跳转回来
					if (info.error) {
						location.href = 'login.html?retUrl=' + location.href;
					}
					
					$('#OA_task_2').html( template('tpl' , {info : info}) );
					
					//结束下拉刷新
					mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
					
					//重置总金额
					$('.lt_order span').text('0.00');
					
				},1000)
			}
		})
	}
	
	//配置下拉刷新
	mui.init({
		pullRefresh : {
			container : '.mui-scroll-wrapper',
			down : {
				auto : true, //进入页面自动下拉刷新一次
				callback : function () {
					render();
				}
			}
		}
	})
	
	//删除功能
	$('#OA_task_2').on('tap' , '.btn_delete' , function () {
		var id = $(this).data('id');
		mui.confirm('是否要删除这件商品？' , '温馨提示' , ['取消' , '确认'] , function (e) {
			if (e.index === 1) {
				$.ajax({
					type : 'get',
					url : '/cart/deleteCart',
					data : {
						id : [id]
					},
					success : function (info) {
						if (info.success) {
							mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
						}
					}
				})
			}
		})
	})
	
	//修改
	$('#OA_task_2').on('tap' , '.btn_edit' , function () {
		//console.log(123);
		var data = this.dataset;
		
		var html = template('editTpl' , data);
		
		//替换掉html中所有的换行
		html = html.replace(/\n/g, '');
		mui.confirm(html , '编辑商品' , ['取消' , '确认'] , function (e) {
			if (e.index === 1) {
				var id = data.id;
				var size = $('.lt_edit_size span.now').text();
				var num = $('.mui-numbox-input').val();
				$.ajax({
					type : 'post',
					url : '/cart/updateCart',
					data : {
						id : id,
						size : size,
						num : num
					},
					success : function (info) {
						if (info.success) {
							mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
						}
					}
				})
			}
		})
		//给span注册tap事件
		$('.lt_edit_size span').on('tap' , function () {
			$(this).addClass('now').siblings().removeClass('now');
		})
		//初始化numbox
		mui('.mui-numbox').numbox();
	})
	
	//计算总金额
	$('#OA_task_2').on('change' , '.ck' , function () {
		var total = 0;
		$(':checked').each(function () {
			var price = $(this).data('price');
			var num = $(this).data('num');
			total += price * num;
		})
		$('.lt_order span').text(total.toFixed(2));
	})
	
})