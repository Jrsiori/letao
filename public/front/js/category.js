$(function () {
	$.ajax({
		type : 'get',
		url : '/category/queryTopCategory',
		success : function (info) {
			//console.log(info);
			$('.first').html( template('tmp-nav' , info) );
			renderSecond(info.rows[0].id);
		}
	})
	
	$('.first').on('click' , 'li' , function () {
		$(this).addClass('now').siblings().removeClass('now');
		
		var id = $(this).data('id');
		renderSecond(id);
		mui('.mui-scroll-wrapper').scroll()[1].scrollTo(0,0,300);
	})
	
	function renderSecond (id) {
		$.ajax({
			type : 'get',
			url : '/category/querySecondCategory',
			data : {
				id : id
			},
			success : function (info) {
				console.log(info);
				$('.second').html( template('tmp-content' , info) );
			}
		})
	}
})