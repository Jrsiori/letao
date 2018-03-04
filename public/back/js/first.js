$(function() {
	var page = 1;
	var pageSize = 5;

	function render() {
		$.ajax({
			type: 'get',
			url: '/category/queryTopCategoryPaging',
			data: {
				page: page,
				pageSize: pageSize
			},
			success: function(info) {
				//console.log(info);
				$('tbody').html(template('tpl', info));
				$('#paginator').bootstrapPaginator({
					bootstrapMajorVersion: 3,
					currentPage: page,
					totalPages: Math.ceil(info.total / info.size),
					onPageClicked: function(a, b, c, p) {
						page = p;
						render();
					}
				})
			}
		})
	}
	render();

	//添加分类功能
	$('.btn_add').on('click', function() {
		$('#firstModal').modal('show');
	})

	//初始化表单校验
	var $form = $('form');
	$form.bootstrapValidator({
		//小图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		//校验规则
		fields : {
			categoryName : {
				validators : {
					notEmpty : {
						message : '一级分类的名称不能为空'
					}
				}
			}
		}
	})
	
	//给表单注册校验成功的事件
	$form.on('success.form.bv' , function (e) {
		e.preventDefault();
		$.ajax({
			type : 'post',
			url : '/category/addTopCategory',
			data : $form.serialize(),
			success : function (info) {
				if (info.success) {
					$('#firstModal').modal('hide');
					$form.data('bootstrapValidator').resetForm(true);
					page = 1;
					render();
				}
			}
		})
	})
})