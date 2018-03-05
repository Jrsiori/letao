$(function () {
	//禁用进度环
	NProgress.configure({
		showSpinner : false
	});
	
	$(document).ajaxStart(function () {
		//进度条加载效果
		NProgress.start();
	});
	$(document).ajaxStop(function () {
		setTimeout(function () {
			NProgress.done();
		},500);
	});
	
	//二级菜单的显示隐藏
	$('.second').prev().on('click' , function () {
		$(this).next().stop(true).slideToggle();
	})
	
	//侧边栏的显示隐藏
	$('.icon_menu').on('click' , function () {
		$('.lt_aside').toggleClass('now');
		$('.lt_main').toggleClass('now');
		$('.lt_header').toggleClass('now');
	})
	
	//退出登录功能
	$('.icon_logout').on('click', function () {
		//显示模态框
		$('#logoutModal').modal('show');
	})
	$('.btn_logout').on('click' , function () {
		//告诉服务器需要推出 把对应的session销毁
		$.ajax({
			type : 'get',
			url : '/employee/employeeLogout',
			success : function (info	) {
				if (info.success) {
					location.href = 'login.html';
				}
			}
		})
	})
	
	//查询是否登录
	if (location.href.indexOf('login.html') == -1) {
		$.ajax({
			type : 'get',
			url : '/employee/checkRootLogin',
			success : function (info	) {
				if (info.error === 400) {
					location.href = 'login.html';
				}
			}
		})
	}
});