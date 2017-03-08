jQuery(function($){
	
	var hasRegisterEle = $("#hasRegister"),//已注册
		noRegisterEle = $("#noRegister"),//未注册
		mailBoxEle = $("#mailBox"),//邮箱输入容器
		mailInputEle = $("#mailInput"),//邮箱输入
		mailErrEle = $("#mailErr"),//邮箱格式不对
		BTN_CELL = ".btn-cell",//按钮容器
		mailFlag = false,
		obj = "alertBox",
		alertTitle = "",
		alertContent = "",
		alertBtn = "",
		alertWidth = "",
		main = {
			init:function(){
				var self = this;
				
				self.bindEvent();
			},
			bindEvent:function(){
				var self = this;
				var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
				//勾选已注册
				hasRegisterEle.bind("click",function(){
					if(hasRegisterEle.prop("checked")){
						mailBoxEle.removeClass("hide");
					}else{
						mailBoxEle.addClass("hide")
					}	
				});
				//勾选未注册
				noRegisterEle.bind("click",function(){
					if(noRegisterEle.prop("checked")){
						mailBoxEle.addClass("hide");
					}else{
						mailBoxEle.removeClass("hide")
					}	
				});
				//邮箱输入
				mailInputEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						if(reg.test($(this).val())){
							mailErrEle.text("");
							mailFlag = true;
						}else{
							mailErrEle.text("邮箱格式不对！");
							mailFlag = false;
						}
					},
					"focus":function(){
						mailErrEle.text("");
					}
				})
				//确定按钮
				$(BTN_CELL).on("click","button",function(){
					var index = $(this).index();
					if(index == 0){
						if(hasRegisterEle.prop("checked") && mailFlag){
							self.checkInfo();							
						}else if(noRegisterEle.prop("checked")){
							window.location.href = "../account/register_step2.html"
						}else{
							alert("请填写完整信息！")
						}
					}else{
						window.location.href = "../home/login.html";
					}
				});
				
			},
			//检测注册邮箱的商户信息
			checkInfo:function(){
				httpModule.ajaxRequest({
					name:"检测注册邮箱的商户信息",
					type: "GET",
					async:true,
					url: shopIp + "jst-finance-merchantFront/rest/merchantController/getMerchantBaseByEmail",
					data: {
						companyEmail:mailInputEle.val().replace(/\s+/g, ""),
					},
					success:function(data){
						console.log(data);
						alertTitle = '<h4 class="center alert-title">提示</h4>';
						alertWidth = 400;
	                    alertBtn = [
										{
											html: "返回",
											"class" : "alert-btn",
											click: function() {
												$( this ).dialog( "close" );	
											}
										}
									];
						if(data.resType == "00"){
							if(data.state == "1"){//待审核
								
			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">您的商户信息还在等待审核，请耐心等待。</p>'+	
			                    				'</div>';
			                    
								exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
								
							}else if(data.state == "2"){//审核通过
								
			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">您已通过商户审核，请根据短信和邮件查收的商户号及注册设置的登录密码进行登录！</p>'+
			                    				'</div>';
			                    				
								exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
								
							}else if(data.state == "3"){//驳回

			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">您的商户信息审核已被驳回，请重新注册。</p>'+	 
			                    				'</div>';

								exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
								
							}else if(data.state == "4"){//不通过

			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">您的商户信息审核不通过，请重新注册。</p>'+	
			                    				'</div>';
			                 
								exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
								
							}else if(data.state == "5"){//审核中

			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">您的商户信息正在审核中，请耐心等待，我们会在1-2工作日完成审核，并以短信和邮件方式通知，请知悉！</p>'+	
			                    				'</div>';
			                 
								exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
								
							}

						}else{
							alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">'+ data.msgContent +'</p>'+	
			                    				'</div>';
			                 
							exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
						}
						
					}
				});
			}
		};
	
	main.init();
	
	
	
	
	
	
	
	
	
})