jQuery(function($){
	var userInfo = JSON.parse(sessionStorage.userInfo),
		first = "",
		second = "",
		resetPwd = "",
		checked = {
			firstPwd:false,
			secondPwd:false
		},
		regLetter = /^[a-zA-Z]+$/,//字母正则
		regNum = /^[0-9]+$/,//数字正则
		main = {
			init:function(){
				var self = this;
				self.bindEvent();
				console.log(userInfo);
				$("#shopId").val(userInfo.merchantId);
			},
			bindEvent:function(){
				
				//第一次密码输入
				$("#firstPwd").bind({
					"keyup":function(){
						if($(this).val().length >= 6 && $(this).val().length <=20){
							first = $(this).val();
							
							if($("#secondPwd").val().length >= 6 && $("#secondPwd").val().length <=20){
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
								
							}else{
								$("#secondPwdErr").text("");
							}
						}else{
							checked.firstPwd = false;
						}
						
						if(checked.firstPwd && checked.secondPwd){
							$("#nextBtn").addClass("btn-on");
						}else{
							$("#nextBtn").removeClass("btn-on");
						}
						
					},
					"blur":function(){
						
						if($(this).val().length < 6 || $(this).val().length > 20){
							$("#firstPwdErr").text("密码长度不正确！");
							$("#secondPwdErr").text("");
							checked.firstPwd = false;
						}else{
							if(regLetter.test($(this).val())){
								$("#firstPwdErr").text("密码不能全为字母！");
								$("#secondPwdErr").text("");
								checked.firstPwd = false;
							}else if(regNum.test($(this).val())){
								$("#firstPwdErr").text("密码不能全为数字！");
								$("#secondPwdErr").text("");
								checked.firstPwd = false;
							}else{
								$("#firstPwdErr").text("");
								checked.firstPwd = true;
							}
						}
						
						if(checked.firstPwd && checked.secondPwd){
							$("#nextBtn").addClass("btn-on");
						}else{
							$("#nextBtn").removeClass("btn-on");
						}
					},
					"focus":function(){
						if($(this).val().length < 6 || $(this).val().length > 20){					
							$("#firstPwdErr").text("");
						}
					}
				});
				
				//第二次密码输入
				$("#secondPwd").bind({
					"keyup":function(){
						second = $(this).val();
						if(first.length == second.length){
							if(first == second){
								
								
								if(regLetter.test($(this).val())){
									$("#secondPwdErr").text("密码不能全为字母！");
									$("#firstPwdErr").text("");
									checked.secondPwd = false;
								}else if(regNum.test($(this).val())){
									$("#secondPwdErr").text("密码不能全为数字！");
									$("#firstPwdErr").text("");
									checked.secondPwd = false;
								}else{
									$("#firstPwdErr").text("");
									$("#secondPwdErr").text("两次密码一致!");
									checked.secondPwd = true;
									checked.firstPwd = true;
									resetPwd = second;
								}
								
								
							}else{
								$("#secondPwdErr").text("两次密码不一致!");
								checked.secondPwd = false;
							}
						}else if(first.length <= second.length){
							$("#secondPwdErr").text("两次密码不一致!");
							checked.secondPwd = false;
						}else{
							checked.secondPwd = false;
							$("#secondPwdErr").text("");
						}
										
						if(checked.firstPwd && checked.secondPwd){
							$("#nextBtn").addClass("btn-on");
						}else{
							$("#nextBtn").removeClass("btn-on");
						}
						
					},
					"blur":function(){
						if($(this).val().length < 6 || $(this).val().length > 20){				
							$("#secondPwdErr").text("密码长度不正确！");
						}
					},
					"focus":function(){
						if($(this).val().length < 6 || $(this).val().length > 20){					
							$("#secondPwdErr").text("");
						}
					}
				});
				
				
				$("#nextBtn").bind("click",function(){
					if($(this).hasClass("btn-on")){
						main.postData();
					}
				});
				$("#pervBtn").bind("click",function(){
					window.location.href = "reset_by_message_one.html";
				})
			},
			//忘记密码发送请求
			postData:function(){
				httpModule.ajaxRequest({
					name:"忘记密码发送请求",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/forgetPwd",
					data:{
						merchantId:userInfo.merchantId,
						passWord:exports.encryptPwd(resetPwd),//新密码
						passWordType:"1"
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							window.location.href = "reset_by_message_three.html";
						}else{
							alert(data.msgContent)
						}
	
					}
				});
			}
		};
		main.init();
})
