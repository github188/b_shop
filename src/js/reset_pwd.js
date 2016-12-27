$(function(){
	$("#code").val(sessionStorage.merchantNo);
		
		var shopId = $("#shopId"),
			firstPwd = $("#firstPwd"),
			secondPwd = $("#secondPwd"),
			subBtn = $("#subBtn"),
			pwd = "",
			shopCode = "",
			main = {
				//初始化
				init:function(){
					var self = this;
					sessionModule.isLogin(sessionStorage.userId);
					var info = sessionStorage.userId;
					console.log(info)
					self.initData();
					self.bindEvent();
				},
				//事件绑定
				bindEvent:function(){
					//var cheched = {first}
					var first = "",
						second = "";
					//新密码输入
					firstPwd.on("keyup",function(){
						if($(this).val().length >= 6 && $(this).val().length <=20){
							first = $(this).val();
						}
						
					});
					//确认新密码
					secondPwd.on("keyup",function(){
						second = $(this).val();
						if(first.length == second.length){
							if(first == second){
								$("#errTips").removeClass("err-tips");
								$("#errTips").addClass("right-tips");
								$("#errTips").text("两次密码一致!");
								subBtn.addClass("btn-primary");
								pwd = second;
							}else{
								$("#errTips").addClass("err-tips");
								$("#errTips").removeClass("right-tips")
								$("#errTips").text("两次密码输入不一致!");
								subBtn.removeClass("btn-primary");
							}
						}
					});
					//确定按钮事件
					subBtn.bind("click",function(){
						if($(this).hasClass("btn-primary")){
							main.postData();
						}
						
					});
				},
				//发送重置密码请求
				postData:function(){
					
					httpModule.ajaxRequest({
						name: "重置密码", // 接口名称
						type: "POST",
						url: hostIp + "jst-finance-merchant/rest/merchant/resetPwd",
						data: {
							code : shopCode,
							password : pwd
						},
						success: function(data) {
							console.log(data)
							if(data.resType === "00"){
								alert("重置成功");
								window.location.href = "home.html";
							}else{
								alert(data.msgContent);
							}
						},
					});
//					$.ajax({
//						url:"http://10.101.130.70:8080/jst-finance-merchant/rest/merchant/resetPwd",
//						type:"PUT",
//						data:{
//							code : shopCode,
//							password : pwd
//						},
//						success:function(data){
//							console.log(data);
//						}
//					})
					
				},
				//初始化数据
				initData:function(){
					shopId.val(sessionStorage.merchantNo);
					shopCode = sessionStorage.merchantNo;
				}
			};
			main.init();
	
	
	
	
	
	
	
	
	
})
