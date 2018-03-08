$(function () {
	
	//从地址栏中获取productId 根据id发送ajax请求 渲染
	var productId = getSearch('productId');
	//console.log(productId);
	$.ajax({
		type : 'get',
		url : '/product/queryProductDetail',
		data : {
			id : productId
		},
		success : function (info) {
			
			
			//给Info添加一个数组 用于渲染选择尺码的盒子
			var tempArr = info.size.split('-');
			var arr = [];
			for (var i = +tempArr[0]; i <= tempArr[1]; i++) {
				arr.push(i);
			}
			info.sizeArr = arr;
			console.log(info);
			
			$('.mui-scroll').html( template('tpl' , info) );
			//重新初始化轮播图
			mui('.mui-slider').slider({
				interval : 1000
			});
			//重新初始化numbox
			mui('.mui-numbox').numbox();
			
			//选择尺码
			$('.size span').on('click' , function () {
				$(this).addClass('now').siblings().removeClass('now');
			})
		}
	})

	//加入购物车 给按钮注册点击事件 获取productId , num , size 发送ajax
	$('.btn_add_cart').on('click' , function () {
		var size = $('.size span.now').text();
		var num = $('.mui-numbox-input').val();
		//没选择尺码
		if (!size) {
			mui.toast('请选择尺码');return
		}
		$.ajax({
			type : 'post',
			url : '/cart/addCart',
			data : {
				productId : productId,
				num : num,
				size : size
			},
			success : function (info) {
				//console.log(info);
				if (info.error) {
					//未登录 跳转到登录页 把当前页面地址传递过去用于返回
					location.href = 'login.html?retUrl=' + location.href;
				}
				if (info.success) {
					mui.confirm('添加成功' , '温馨提示' , ['去购物车' , '继续浏览'] , function (e) {
						if (e.index == 0) {
							location.href = 'cart.html';
						}
					})
				}
			}
		})
	})

})