jQuery(function($){
	var basicInfo = JSON.parse(sessionStorage.basicInfo),
		onLine = sessionModule.isLogin(sessionStorage.userId),
		obj = "alertBox",
		first = "",
		second = "",
		resetPwd = "",
		checked = {
			firstPwd:false,
			secondPwd:false,
			oldPwd:false
		},
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;
				console.log(basicInfo);
				$("#userName").val(basicInfo.merchantId);
				
				self.bindEvent();
			},
			bindEvent:function(){
				//原密码输入
				$("#oldPwd").myvalidate({
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
	
	
					}, valCallback: function (val){
						
					}
				});
				$("#oldPwd").bind({
					"keyup":function(){
						if($(this).val().length >= 6){
							first = $(this).val();
							checked.oldPwd = true;
						}else{
							checked.oldPwd = false;
						}
						
						if(checked.firstPwd && checked.secondPwd && checked.oldPwd){
							$("#subBtn").addClass("confirm-btn-on");
						}else{
							$("#subBtn").removeClass("confirm-btn-on");
						}
						
						
					},
					"blur":function(){
						if($(this).val().length < 6){
							$("#oldPwdErr").text("密码长度不正确！");
						}
					},
					"focus":function(){
						$("#oldPwdErr").text("");
					}
				});
				//第一次输入新密码
				$("#firstPwd").myvalidate({
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
	
	
					}, valCallback: function (val){
						
					}
				});
				$("#firstPwd").bind({
					"keyup":function(){
						if($(this).val().length >= 6){
							first = $(this).val();
							
							if($("#secondPwd").val().length >= 6){
								if(first == second){
									checked.firstPwd = true;
									checked.secondPwd = true;
									$("#secondPwdErr").text("两次密码一致!");
								}else{
									checked.firstPwd = false;
									$("#secondPwdErr").text("两次密码不一致!");
								}
							}else if($("#secondPwd").val().length <= 0){
								checked.firstPwd = true;
								
							}
						}else{
							checked.firstPwd = false;
						}
						
						if(checked.firstPwd && checked.secondPwd && checked.oldPwd){
							$("#subBtn").addClass("confirm-btn-on");
						}else{
							$("#subBtn").removeClass("confirm-btn-on");
						}
						
					},
					"blur":function(){
						if($(this).val().length < 6){
							$("#firstPwdErr").text("密码长度不正确！");
						}
					},
					"focus":function(){
						if($(this).val().length < 6){					
							$("#firstPwdErr").text("");
						}
					}
				});
				//再次输入新密码
				$("#secondPwd").myvalidate({
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
	
	
					}, valCallback: function (val){
						
					}
				});
				$("#secondPwd").bind({
					"keyup":function(){
						second = $(this).val();
						if(first.length == second.length){
							if(first == second){
								$("#secondPwdErr").text("两次密码一致!");
								$("#secondPwdErr").css("color","#6abbd6");
								checked.secondPwd = true;
								checked.firstPwd = true;
								resetPwd = second;
							}else{
								$("#secondPwdErr").text("两次密码不一致!");
								checked.secondPwd = false;
							}
						}else{
							
							checked.secondPwd = false;
						}
										
						if(checked.firstPwd && checked.secondPwd && checked.oldPwd){
							$("#subBtn").addClass("confirm-btn-on");
						}else{
							$("#subBtn").removeClass("confirm-btn-on");
						}
						
					},
					"blur":function(){
						if($(this).val().length < 6){				
							$("#secondPwdErr").text("密码长度不正确！");
						}
					},
					"focus":function(){
						if($(this).val().length < 6){					
							$("#secondPwdErr").text("");
						}
					}
				});
				//确认按钮
				$("#subBtn").bind("click",function(){				
					if($(this).hasClass("confirm-btn-on")){
						main.postData();
					}
				});
				//取消按钮
				$("#cancleBtn").bind("click",function(){
					window.location.href = "index.html";
				})
			},
			//发送重置支付密码请求
			postData:function(){
				httpModule.ajaxRequest({
					name:"发送重置支付密码请求",
					type:"POST",
					async:false,
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/updPassword",
					data:{
						userId:sessionStorage.userId,
						newPassWord:exports.encryptPwd(resetPwd),//新密码
						passWord:exports.encryptPwd($("#oldPwd").val()),//原密码
						passWordType:"2"//密码类型
					},
					success:function(data){						
						if(data.resType == "00"){
							
							alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">'+data.msgContent+'</p>'+	 
		                    				'</div>';
		                    alertWidth = 330;
		                    alertBtn = [
											{
												html: "确定",
												"class" : "alert-btn",
												click: function() {												
													$( this ).dialog( "close" ); 
													
													window.location.href = "index.html";
												}
											}
										];
							exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
							
						}else{
							alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">'+data.msgContent+'</p>'+	 
		                    				'</div>';
		                    alertWidth = 330;
		                    alertBtn = [
											{
												html: "知道了",
												"class" : "alert-btn",
												click: function() {												
													$( this ).dialog( "close" ); 											
												}
											}
										];
							exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
						}
					}
				})
			}
			
		};
		main.init();
});
