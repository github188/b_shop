jQuery(function($){
	var userInfo = JSON.parse(sessionStorage.userInfo),
		codeKey = "",//用于校验验证码
		main = {
			init:function(){
				var self = this;
				self.bindEvent();
				//$("#companyEmail").val(userInfo.companyEmail.substring(0,3) + '****' + userInfo.companyEmail.substring(7));
				console.log(userInfo)
			},
			bindEvent:function(){
				//发送验证码
				$("#sendCode").bind("click",function(){
					if($(this).hasClass("ajOn")){
						main.sendCode();
						main.countDown();
					}
					$(this).removeClass("ajOn");
				});
				
				//验证码输入校验
//				$("#checkCode").myvalidate({
//					filter_type: "positiveNumber", 
//					enterCallback: function (obj){
//	
//	
//					}, valCallback: function (val){
//						
//					}
//				});

				$("#companyEmail").bind({
					"keyup":function(){	
						$("#nextBtn").addClass("btn-on");
					},
					"blur":function(){
						$("#nextBtn").addClass("btn-on");
					}
					});

				//下一步按钮
				$("#nextBtn").bind("click",function(){
					main.sendemail();
					
				});
				//上一步按钮
				$("#pervBtn").bind("click",function(){
					window.location.href = "forget_select_way.html";
				})
			},
	
			//发送邮件请求
			sendemail:function(){
				httpModule.ajaxRequest({
					name:"校验验证码",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantFrontCode/fgtpwSendEmail",
					data:{
						userId:userInfo.userId,
						merchantId:userInfo.merchantId,
						companyEmail:$("#companyEmail").val()
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							$("#nextBtn").removeClass("btn-on");
							window.location.href = "../home/login.html";
							//alert("邮件已发送到"+userInfo.companyEmail.substring(0,3) + "****" + userInfo.companyEmail.substring(7)+"邮箱");
							alert("请访问邮件中给出的网页链接地址，根据页面提示完成密码重设。");
						}else{
							$("#nextBtn").removeClass("btn-on");
							$("#checkCodeErr").text(data.msgContent);
						}
					}
				});
			},
			//倒计时
			countDown:function(){	
				var count = 60;
				var clearId = setInterval(function(){
					$("#sendCode").text("重新发送("+count + "s)");
					count --;
					if(count == -1){
						$("#sendCode").text("发送验证码");
						count = 60;
						$("#sendCode").addClass("ajOn");
						clearInterval(clearId);
					}
				},1000);
			},
		};
		main.init();
})
