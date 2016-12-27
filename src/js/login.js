jQuery(function($) {
	
	var loginBtnEle = $("#jsjk-login");
	var userIdEle = $("#jsjk-userid");
	var pwdEle = $("#jsjk-password");

	var main = {
		// 初始化执行
		init: function() {
			var self = this;
			self.bindEvent();
		},
		// 事件绑定
		bindEvent: function() {
			loginBtnEle.bind("click", function() {
				var userIdVal = userIdEle.val();
				var pwdVal = pwdEle.val();
				if(stringModule.CheckEmpty(userIdVal) && stringModule.CheckEmpty(pwdVal)) {
					httpModule.ajaxRequest({
						name: "登陆", // 接口名称
						type: "GET",
						url: hostIp + "jst-finance-merchant/rest/merchant/login",
						data: {
							code: userIdVal,
							password: pwdVal
						},
						success: function(data) {
							if(data.resType == "00") {
								sessionStorage.userId = data.userId;
								sessionStorage.merchantNo = data.merchantNo;
								if(data.status == "1") {
									alert("首次登录，请修改密码");
									window.location.href = "../account/base_info.html";// reset_pwd.html
								} else {
									window.location.href = "../account/index.html";
								}
							} else {
								alert(data.msgContent);
							}
						},
					});
				} else {
					alert("请输入您的账号或密码");
				}
			});
		},
	};
	main.init();
});