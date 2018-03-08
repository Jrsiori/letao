$(function() {
	var page = 1;
	var pageSize = 5;
	var result = []; //用于存储上传成功的图片地址
	function render() {
		$.ajax({
			type: 'get',
			url: '/product/queryProductDetailList',
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

	//添加商品
	$('.btn_add').on('click', function() {
		$('#productModal').modal('show');
		$.ajax({
			type: 'get',
			url: '/category/querySecondCategoryPaging',
			data: {
				page: 1,
				pageSize: 100
			},
			success: function(info) {
				//console.log(info);
				$('.dropdown-menu').html(template('tpl2', info));
			}
		})
	})

	//二级分类注册事件
	$('.dropdown-menu').on('click', 'a', function() {
		//设置按钮内容
		$('.dropdown_text').text($(this).text());
		//获取id
		$("[name='brandId']").val($(this).data('id'));
		$('form').data('bootstrapValidator').updateStatus('brandId' , 'VALID');
	})

	//初始化图片上传
	$('#fileupload').fileupload({
		dataType: 'json',
		done: function(e, data) {
			//大于3张就return
			if(result.length >= 3) {
				return;
			}
			//获取上传的图片地址
			var pic = data.result.picAddr;
			//往img_box中添加图片
			$('<img src =" ' + pic + ' " width="100" height="100">').appendTo('.img_box');
			//将结果保存到数组中
			result.push(data.result);
			//根据数组的长度判断上传了几张图片
			if (result.length === 3) {
				$('form').data('bootstrapValidator').updateStatus('productLogo' , 'VALID');
			} else {
				$('form').data('bootstrapValidator').updateStatus('productLogo' , 'INVALID');
			}
		}
	})

	//表单校验
	var $form = $('form');
	$form.bootstrapValidator({
		//让隐藏的input也校验
		excluded: [],
		//配置小图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		//校验规则
		fields : {
			brandId : {
				validators : {
					notEmpty : {
						message : '请选择品牌'
					}
				}
			},
			proName : {
				validators : {
					notEmpty : {
						message : '请输入商品名称'
					}
				}
			},
			proDesc : {
				validators : {
					notEmpty : {
						message : '请输入商品描述'
					}
				}
			},
			num : {
				validators : {
					notEmpty : {
						message : '请输入商品库存'
					},
					regexp : {
						regexp : /^[1-9]\d*$/,
						message : '请输入一个有效的商品库存'
					}
				}
			},
			size : {
				validators : {
					notEmpty : {
						message : '请输入商品尺码'
					},
					regexp : {
						regexp : /^\d{2}-\d{2}$/,
						message : '请输入一个有效的尺码 (32-44)'
					}
				}
			},
			oldPrice : {
				validators : {
					notEmpty : {
						message : '请输入商品原价'
					},
					regexp : {
						regexp : /^[1-9]\d*$/,
						message : '请输入一个有效的商品原价'
					}
				}
			},
			price : {
				validators : {
					notEmpty : {
						message : '请输入商品价格'
					}
				}
			},
			productLogo : {
				validators : {
					notEmpty : {
						message : '请上传3张图片'
					}
				}
			}
		}
	})
	
	//表单验证成功
	$form.on('success.form.bv' , function (e) {
		e.preventDefault();
		var param = $form.serialize();
		param += '&picName1=' + result[0].picName + '&picAddr1=' + result[0].picAddr;
		param += '&picName2=' + result[1].picName + '&picAddr2=' + result[1].picAddr;
		param += '&picName3=' + result[2].picName + '&picAddr3=' + result[2].picAddr;
		$.ajax({
			type : 'post',
			url : '/product/addProduct',
			data : param,
			success : function (info) {
				if (info.success) {
					$('#productModal').modal('hide');
					page = 1;
					render();
					$form.data('bootstrapValidator').resetForm(true);
					$('.dropdown_text').text('请选择二级分类');
					$('.img_box').remove();
					result = [];
				}
			}
		})
	})

})