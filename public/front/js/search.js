$(function () {
	//封装一个函数从本地缓存中获取到历史记录 是个数组 如果没有返回空数组
	function getHistory () {
		var history = localStorage.getItem('search_list') || '[]';
		var arr = JSON.parse(history);
		return arr;
	}
	
	//渲染
	function render () {
		var arr = getHistory();
		$('.lt_history').html( template('tpl' , {list:arr}) );
	}
	render();
	
	//全部清空
	$('.lt_history').on('click' , '.btn_empty' , function () {
		//弹出确认框
		mui.confirm('确定要清空所有历史记录吗？' , '温馨提示' , ['取消' , '确认'] , function (e) {
			console.log(e.index);
			if (e.index == 1) {
				localStorage.removeItem('search_list');
				render();
			}
		})
	})
	
	//单个删除
	$('.lt_history').on('click' , '.btn_delete' , function () {
		var that = this;
		mui.confirm('确定要删除这条历史记录吗？' , '温馨提示' , ['取消' , '确认'] , function (e) {
			if (e.index === 1) {
				var index = $(that).data('index');
				var arr = getHistory();
				arr.splice(index , 1);
				localStorage.setItem('search_list' , JSON.stringify(arr));
				render();
			}
		})
	})
	
	//增加
	$('.lt_search button').on('click' , function () {
		var value = $('.lt_search input').val().trim();
		$('.lt_search input').val('');
		if (value == '') {
			mui.toast('请输入搜索关键字');
			return;
		}
		var arr = getHistory();
		var index = arr.indexOf(value);
		if (index != -1) {
			arr.splice(index , 1);
		}
		if (arr.length >= 10) {
			arr.pop();
		}
		arr.unshift(value);
		localStorage.setItem('search_list' , JSON.stringify(arr));
		render();
	})
	
})