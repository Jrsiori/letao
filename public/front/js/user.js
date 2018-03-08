$(function () {
	//获取用户信息 渲染
	$.ajax({
		type : 'get',
		url : '/user/queryUserMessage',
		success : function (info) {
			//console.log(info);
			if (info.error) {
				location.href = 'login.html';
			}
			$('.userinfo').html( template('tpl' , info) );
		}
	})
	
	//退出
	$('.btn_logout').on('click' , function () {
		$.ajax({
			type : 'get' , 
			url : '/user/logout',
			success : function (info) {
				if (info.success) {
					location.href = 'login.html';
				}
			}
		})
	})
	
})