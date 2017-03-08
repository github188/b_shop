$(function(){
	$("#code").val(sessionStorage.merchantNo);
		
		var shopId = $("#shopId"),
			firstPwd = $("#firstPwd"),
			secondPwd = $("#secondPwd"),
			subBtn = $("#subBtn"),
			pwd = "",
			payPwd = "",
			shopCode = "",
			onLine = sessionModule.isLogin(sessionStorage.userId),
			checked = {
				firstPwd:false,
				secondPwd:false,
				payFirstPwd:false,
				paySecondPwd:false
			},
			main = {
				//初始化
				init:function(){
					var self = this;
					if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
						return false;
					}
					var info = sessionStorage.userId;
					console.log(info)
					self.initData();
					self.bindEvent();
				},
				//事件绑定
				bindEvent:function(){
					
					var first = "",
						second = "",
						payFirst = ""
						paySecond = "";
					//新密码输入
					firstPwd.on("keyup",function(){
						if($(this).val().length >= 6 && $(this).val().length <=20){
							first = $(this).val();
							checked.firstPwd = true;
						}else{
							checked.firstPwd = false;
						}
						
						if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
							subBtn.addClass("btn-primary");
						}else{
							subBtn.removeClass("btn-primary");
						}
						
					});
					firstPwd.on("blur",function(){
						if($(this).val().length < 6 || $(this).val().length > 20){
							$("#errFirstTips").addClass("red");
							$("#errFirstTips").removeClass("blue");
							$("#errFirstTips").text("密码长度不正确！")
						}
					});
					firstPwd.on("focus",function(){
						if($(this).val().length < 6 || $(this).val().length > 20){
							$("#errFirstTips").removeClass("red");
							$("#errFirstTips").addClass("blue");
							$("#errFirstTips").text("密码6-20位,必须包含字母和数字，字母区分大小写")
						}
					});
					//确认新密码输入
					secondPwd.on("keyup",function(){
						second = $(this).val();
						if(first.length == second.length){
							if(first == second){
								$("#errSecondTips").removeClass("red");
								$("#errSecondTips").addClass("blue");
								$("#errSecondTips").text("两次密码一致!");
								checked.secondPwd = true;
								pwd = second;
							}else{
								$("#errSecondTips").addClass("red");
								$("#errSecondTips").removeClass("blue");
								$("#errSecondTips").text("两次密码输入不一致!");
								checked.secondPwd = false;
							}
						}else if(first.length <= second.length){
							$("#errSecondTips").addClass("red");
							$("#errSecondTips").removeClass("blue")
							$("#errSecondTips").text("两次密码输入不一致!");
							checked.secondPwd = false;
						}else{
							checked.secondPwd = false;
						}
						
						
						if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
							subBtn.addClass("btn-primary");
						}else{
							subBtn.removeClass("btn-primary");
						}
						
					});
					secondPwd.on("blur",function(){
						if($(this).val().length < 6 || $(this).val().length > 20){
							$("#errSecondTips").addClass("red");
							$("#errSecondTips").removeClass("blue");
							$("#errSecondTips").text("密码长度不正确！")
						}
					});
					secondPwd.on("focus",function(){
						if($(this).val().length < 6 || $(this).val().length > 20){
							$("#errSecondTips").removeClass("red");
							$("#errSecondTips").addClass("blue");
							$("#errSecondTips").text("密码6-20位,必须包含字母和数字，字母区分大小写")
						}
					});
					//支付密码第一次输入事件
					$("#payFirstPwd").myvalidate({
						filter_type: "positiveNumber", 
						enterCallback: function (obj){
		
		
						}, valCallback: function (val){
							if($("#payFirstPwd").val().length == 6){
								checked.payFirstPwd = true;
								payFirst = val;
								console.log(payFirst)
							}else{					
								checked.payFirstPwd = false;
								
							}
							
							if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
								subBtn.addClass("btn-primary");
							}else{
								subBtn.removeClass("btn-primary");
							}							 
						}
					});
					//确认支付密码
					$("#paySecondPwd").myvalidate({
						filter_type: "positiveNumber", 
						enterCallback: function (obj){
		
		
						}, valCallback: function (val){
							if($("#paySecondPwd").val().length == 6){
								paySecond = val;								
								if(payFirst == paySecond){
									checked.paySecondPwd = true;
									payPwd = paySecond;								
									payPwd = exports.encryptPwd(JSON.stringify(payPwd));
									console.log(payPwd)
								}else{
									checked.paySecondPwd = false;
								}
								
							}else{
								checked.paySecondPwd = false;
							}
							
							if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
								subBtn.addClass("btn-primary");
							}else{
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
						url: shopIp + "jst-finance-merchantFront/rest/merchantFront/resetPwd",
						data: {
							code : shopCode,
							password : exports.encryptPwd(pwd),
							payPassWord:payPwd
						},
						success: function(data) {
							console.log(data)
							if(data.resType === "00"){
								alert("重置成功");
								window.location.href = "../home/login.html";
							}else{
								alert(data.msgContent);
							}
						},
					});
					
				},
				//初始化数据
				initData:function(){
					shopId.val(sessionStorage.merchantNo);
					shopCode = sessionStorage.merchantNo;
				}
			};
			main.init();
	
	
	
	
	
	
	
	
	
})
