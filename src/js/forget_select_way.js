jQuery(function($){
	var userInfo = JSON.parse(sessionStorage.userInfo),
		main = {
			init:function(){
				var self = this;
				self.bindEvent();
				$("#shopId").text(userInfo.merchantId);
			},
			bindEvent:function(){
				//通过短信验证
				$("#byMessage").bind("click",function(){
					window.location.href ="reset_by_message_one.html";
				})
				//通过邮件验证
				$("#byMail").bind("click",function(){
					window.location.href ="reset_by_email.html";
				})
				//返回按钮
				$(".btn-back").bind("click",function(){
					sessionStorage.removeItem("userInfo");
					window.location.href = "forget_login_pwd.html";
				})
			},
		};
		main.init();
})
