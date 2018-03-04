$(function() {
	//校验表单
	$('form').bootstrapValidator({
		//配置校验的规则
		fields: {
			//对应form中每个name属性
			username: {
				validators: {
					//非空
					notEmpty: {
						message: '用户名不能为空'
					},
					//长度
					stringLength: {
						min: 4,
						max: 10,
						message: '用户名应在4-10位'
					},
					//专门用来提示信息
					callback: {
						message: '用户名错误'
					}
				}
			},

			password: {
				validators: {
					//非空
					notEmpty: {
						message: '密码不能为空'
					},
					//长度
					stringLength: {
						min: 6,
						max: 12,
						message: '密码应在6-12位'
					},
					//专门用来提示信息
					callback : {
						message: '密码错误'
					}
				}
			}
		},

		//配置小图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		}
	});
	
	//给表单注册校验成功事件 成功时阻止表单的默认提交 使用ajax进行提交
	var $form = $('form');
	$form.on('success.form.bv' , function (e) {
		//阻止浏览器默认行为
		e.preventDefault();
		//发送ajax请求登录
		$.ajax({
			type : 'post',
			url : '/employee/employeeLogin',
			data : $form.serialize(),
			success : function (info) {
				if (info.error === 1000) {
					$form.data('bootstrapValidator').updateStatus('username' , 'INVALID' , 'callback');
				}
				if (info.error === 1001) {
					$form.data('bootstrapValidator').updateStatus('password' , 'INVALID' , 'callback');
				}
				if (info.success) {
					location.href = 'index.html';
				}
			}
		})
	});
	
	//重置表单 清除所有样式
	$("[type='reset']").on('click' , function () {
		$form.data('bootstrapValidator').resetForm(true);
	})
});