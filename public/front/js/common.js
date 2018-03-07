//初始化区域滚动
mui('.mui-scroll-wrapper').scroll({
	indicators: false, //是否显示滚动条
});

//初始化轮播图
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
});

//把地址栏所有参数封装成对象
function getSearch (key) {
	var search = location.search;
	search = decodeURI(search);
	search = search.slice(1); //去掉开头的?号
	var arr = search.split('&');
	var obj = {};
	arr.forEach(function (ele) {
		var k = ele.split('=')[0];
		var v = ele.split('=')[1];
		obj[k] = v;
	})
	return obj[key];
}