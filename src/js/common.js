// 公共参数

var hostIp = "http://10.101.130.8:8810/"; // 调试主机IP

var stringModule = {};
var httpModule = {};
var sessionModule = {};

/**
 * 判断是否为空
 * 有值返回ture，否则返回false
 */
stringModule.CheckEmpty = function(str) {
	if(str != "" && str != null && str != undefined) {
		return true;
	} else if(str == 0 && typeof(str) == "number") {
		return true;
	} else {
		return false;
	}
}

/**
 * jQuery的ajax方法
 * 请求方式默认POST
 */
httpModule.ajaxRequest = function(res) {
	if(stringModule.CheckEmpty(res.name)) {
		var reqName = res.name;  // 接口名称描述
	} else {
		var reqName = "";
	}
	var options = $.extend({
		type: "POST",
		url: "http://" + location.hostname + "/",
		data: {},
		dataType: "json",
		success: function() {},
		error: function(err) {
			console.log(reqName + " → " + "状态码：" + err.status + " " + "状态描述：" + err.statusText);
		},
		complete: function() {}
	}, res);
	$.ajax({
		type: options.type,
		url: options.url,
		data: options.data,
		dataType: options.dataType,
		success: options.success,
		error: options.error,
		complete: options.complete
	});

}

/**
 * 判断用户是否处于登陆状态
 * 不在登录状态下，进行提示并跳转到指定页面，默认是登陆页
 */
sessionModule.isLogin = function(str, tips, url) {
	var reqUrl = "../home/login.html";
	var tipsCon = "请先登录！";
	reqUrl = url == "" || url == null || url == undefined ? reqUrl : url;
	tipsCon = tips == "" || tips == null || url == undefined ? tipsCon : tips;
	if(!stringModule.CheckEmpty(str)) {
		alert(tipsCon);
		window.location.href = reqUrl;
	}

}