$(function () {
	$('.btn_login').on('click' , function () {
		var username = $('[name=username]').val();
		var password = $('[name=password]').val();
		if (!username) {
			mui.toast('请输入用户名');
			return;
		}
		if (!password) {
			mui.toast('请输入密码');
			return;
		}
		
		$.ajax({
			type : 'post',
			url : '/user/login',
			data : {
				username : username,
				password : password
			},
			success : function (info) {
				//console.log(info);
				if (info.error) {
					mui.toast(info.message);
				}
				if (info.success) {
					//如果有retUrl 跳回retUrl指定的页面
					if (location.search.indexOf('retUrl') != -1) {
						location.href = location.search.replace('?retUrl=' , '');
					} else {
					//没有 跳到用户页
						location.href = 'user.html';
					}
				}
			}
		})
	})
})