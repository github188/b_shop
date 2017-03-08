jQuery(function($){
	var userInfo = JSON.parse(sessionStorage.userInfo),
		codeKey = "",//用于校验验证码
		main = {
			init:function(){
				var self = this;
				self.bindEvent();
				$("#userPhone").val(userInfo.companyTel.substring(0,3) + '****' + userInfo.companyTel.substring(7));
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
				$("#checkCode").myvalidate({
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
	
	
					}, valCallback: function (val){
						
					}
				});
				$("#checkCode").bind({
					"keyup":function(){
						if($("#checkCode").val().length == 6){
							$("#nextBtn").addClass("btn-on");
						}else{
							$("#nextBtn").removeClass("btn-on");
							$("#checkCodeErr").text("");
						}
					},
					"blur":function(){
						if($(this).val().length < 6){
							$("#checkCodeErr").text("请输入完整的验证码！");
						}else{
							
						}
					},
					"focus":function(){
						$("#checkCodeErr").text("");
					}
				})
				//下一步按钮
				$("#nextBtn").bind("click",function(){
					main.checkCode();
					
				});
				//上一步按钮
				$("#pervBtn").bind("click",function(){
					window.location.href = "forget_select_way.html";
				})
			},
			//发送验证码
			sendCode:function(){
				httpModule.ajaxRequest({
					name:"发送验证码",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/getMsgVerifyCode",
					data:{
						company_tel:userInfo.companyTel
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							codeKey = data.rfkey;
						}else{
							alert(data.msgContent)
						}
	
					}
				});
			},
			//校验验证码
			checkCode:function(){
				httpModule.ajaxRequest({
					name:"校验验证码",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/matchMsgVerifyCode",
					data:{
						rfkey:codeKey,
						msgCode:$("#checkCode").val()						
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							window.location.href = "reset_by_message_two.html";
							$("#checkCodeErr").text("");
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
