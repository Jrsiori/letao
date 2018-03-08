$(function () {
	//获取验证码
	$('.btn_getcode').on('click' , function (e) {
		e.preventDefault();
		var $this = $(this)
		$this.prop('disabled' , true).addClass('disabled').text('发送中...');
		$.ajax({
			type : 'get',
			url : '/user/vCode',
			success : function (info) {
				console.log(info);
				var count = 5;
				var timeId = setInterval(function () {
					count--;
					$this.text(count + '秒后再次发送');
					if (count <= 0) {
						clearInterval(timeId);
						$this.prop('disabled' , false).removeClass('disabled').text('再次发送');
					}
				},1000)
			}
		})
	})
	
	//注册
	$('.btn_register').on('click' , function (e) {
		e.preventDefault();
		var username = $('[name=username').val();
		var password = $('[name=password').val();
		var repassword = $('#repassword').val();
		var mobile = $('[name=mobile').val();
		var vCode = $('[name=vCode').val();
		if (!username) {
			mui.toast('用户名不能为空');
			return;
		}
		if (!password) {
			mui.toast('密码不能为空');
			return;
		}
		if (repassword != password) {
			mui.toast('密码不一致');
			return;
		}
		if (!mobile) {
			mui.toast('手机号不能为空');
			return;
		}
		if (!/^1[3-9]\d{9}$/.test(mobile)) {
			mui.toast('手机号格式错误');
			return;
		}
		if (!vCode) {
			mui.toast('验证码不能为空');
			return;
		}
		
		$.ajax({
			type : 'post',
			url : '/user/register',
			data : $('form').serialize(),
			success : function (info) {
				if (info.error) {
					mui.toast(info.message);
				}
				if (info.success) {
					mui.toast('恭喜，注册成功，2秒后自动跳转到登录页');
					setTimeout(function () {
						location.href = 'login.html';
					},2000)
				}
			}
		})
		
	})
	
})