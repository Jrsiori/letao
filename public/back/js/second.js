$(function() {
	var page = 1;
	var pageSize = 5;

	function render() {
		$.ajax({
			type: 'get',
			url: '/category/querySecondCategoryPaging',
			data: {
				page: page,
				pageSize: pageSize
			},
			success: function(info) {
				//console.log(info);
				$('tbody').html(template('tpl', info));
			}
		})
	}
	render();

	//添加分类功能
	$('.btn_add').on('click', function() {
		$('#secondModal').modal('show');
		$.ajax({
			type: 'get',
			url: '/category/queryTopCategoryPaging',
			data: {
				page: 1,
				pageSize: 1000
			},
			success: function(info) {
				//console.log(info);
				$('.dropdown-menu').html(template('tpl2', info));
			}
		})
	})
	$('.dropdown-menu').on('click', 'a', function() {
		var text = $(this).text();
		$('.dropdown_text').text(text);
		var id = $(this).parent().data('id');
		$("[name='categoryId']").val(id);
		$form.data('bootstrapValidator').updateStatus('categoryId' , 'VALID');
	})

	$('#fileupload').fileupload({
		dataType: 'json',
		done: function(e, data) {
			var pic = data.result.picAddr;
			$('.img_box img').attr('src', pic);
			$("[name='brandLogo']").val(pic);
			$form.data('bootstrapValidator').updateStatus('brandLogo' , 'VALID');
		}
	})

	//表单校验
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
			categoryId : {
				validators : {
					notEmpty : {
						message : '请选择一级分类'
					}
				}
			},
			brandName : {
				validators : {
					notEmpty : {
						message : '请输入品牌的名称'
					}
				}
			},
			brandLogo : {
				validators : {
					notEmpty : {
						message : '请上传品牌图片'
					}
				}
			}
		},
		excluded : []
	})

	//添加二级分类
	$form.on('success.form.bv' , function (e) {
		e.preventDefault();
		$.ajax({
			type : 'post',
			url : '/category/addSecondCategory',
			data : $form.serialize(),
			success : function (info) {
				if (info.success) {
					$('#secondModal').modal('hide');
					page = 1;
					render();
					$form.data('bootstrapValidator').resetForm(true);
					$('.dropdown_text').text('请选择一级分类');
					$('.img_box img').attr('src' , 'images/none.png');
				}
			}
		})
	})

})