jQuery(function($){
	var	basicInfo = JSON.parse(sessionStorage.basicInfo), 
		onLine = sessionModule.isLogin(sessionStorage.userId),
		sumEle = $("#sum"),//回填金额DOM节点
		alertObj = "alertBox",
		alertTitle = "",//弹框标题
		alertWidth = "",//弹框宽度
		alertContent = "",//弹框内容
		alertBtn = "",//弹框按钮
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;
				
				self.bindEvent();
				self.checkMes();
				console.log(basicInfo);
				$("#bankName").text(basicInfo.billList[0].bankName);
				$("#bandCode").text(basicInfo.billList[0].receiveCardNo.substring(0,4) + "********" +
					basicInfo.billList[0].receiveCardNo.substring(basicInfo.billList[0].receiveCardNo.length-4));
			},
			bindEvent:function(){
				//回填金额校验
				sumEle.mynumber({
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
		
					}, valCallback: function (val){
						
						if(sumEle.val().length > 0 && parseInt(parseFloat(sumEle.val())*100) != 0){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					}
				});
				//确定按钮事件
				$(".confirm-btn").bind("click",function(){
					if($(this).hasClass("confirm-btn-on") && parseInt($("#errorNum").text()) > 0){
						main.submitSum();		
					}else{
						alertTitle = '<h4 class="center alert-title">打款验证失败</h4>';
	                    alertContent = '<div class="alert-content"> ' +
	                    					'<p class="center">您已'+ $("#payErrorNum").text() +'次回填打款金额错误，打款验证失败，</p>'+
	                    					'<p class="center">请更换银行账户进行验证！</p>'+
	                    				'</div>';
	                    alertWidth = 400;
	                    alertBtn = [
										{
											html: "马上更换",
											"class" : "alert-btn",
											click: function() {
												$( this ).dialog( "close" );
												main.checkMes();
												window.location.href = "../account/replace_bankcard.html";
											}
										}
									];
                        exports.alertBox(alertObj,alertTitle,alertContent,alertBtn,alertWidth);
					}
				});
			},
			//提交回填金额请求
			submitSum:function(){		
				httpModule.ajaxRequest({
					name:"提交回填金额",
					type:"POST",
					async:false,
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/amountAuthen",
					data:{
						listId: basicInfo.billList[0].listId, //清单ID
	                    amount:parseInt(parseFloat($("#sum").val()) * 100)
					},
					success:function(data){
						console.log(data);
						if(data.resType === "00"){//回填金额正确
	                        if(data.success){
	                            alertTitle = '<h4 class="center alert-title">提示</h4>';
			                    alertContent = '<div class="alert-content"><p class="center">认证成功!</p></div>';
			                    alertWidth = 330;
			                    alertBtn = [	
												{
													html: "知道了",
													"class" : "alert-btn",
													click: function() {
														$( this ).dialog( "close" );
														window.location.href = "../account/index.html";
													}
												}
											];
	                            exports.alertBox(alertObj,alertTitle,alertContent,alertBtn,alertWidth);
	                        }else{//回填金额错误
	                        	if(data.errorTimes < data.times && data.errorTimes != 0){//回填次数小于系统最大次数
	                        		alertTitle = '<h4 class="center alert-title">填写金额错误</h4>';
				                    alertContent = '<div class="alert-content"> ' +
				                    					'<p class="center">您剩余'+ data.errorTimes +'次回填打款金额机会，</p>'+
				                    					'<p class="center">若'+ data.times +'次输错后需要更换银行卡重新发起认证！</p>'+
				                    				'</div>';
				                    alertWidth = 400;
				                    alertBtn = [	
													{
														html: "重新填写",
														"class" : "alert-btn",
														click: function() {
															$( this ).dialog( "close" );
															main.checkMes();
														}
													}
												];
		                            exports.alertBox(alertObj,alertTitle,alertContent,alertBtn,alertWidth);
	                        	}else{
	                        		var count = data.times-data.errorTimes;
	                        		alertTitle = '<h4 class="center alert-title">打款验证失败</h4>';
				                    alertContent = '<div class="alert-content"> ' +
				                    					'<p class="center">您已'+ count +'次回填打款金额错误，打款验证失败，</p>'+
				                    					'<p class="center">请更换银行账户进行验证！</p>'+
				                    				'</div>';
				                    alertWidth = 400;
				                    alertBtn = [
													{
														html: "马上更换",
														"class" : "alert-btn",
														click: function() {
															$( this ).dialog( "close" );
															main.checkMes();
															window.location.href = "../account/replace_bankcard.html";
														}
													}
												];
		                            exports.alertBox(alertObj,alertTitle,alertContent,alertBtn,alertWidth);
	                        	}
	                            
	                        }
	                    }else{
	                    	alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"><p class="center">'+ data. msgContent+'</p></div>';
		                    alertWidth = 330;
		                    alertBtn = [	
											{
												html: "知道了",
												"class" : "alert-btn",
												click: function() {
													$( this ).dialog( "close" );
													main.checkMes();
												}
											}
										];
                            exports.alertBox(alertObj,alertTitle,alertContent,alertBtn,alertWidth);
	                    }
					}
				});
			},
			//回款认证查询错误次数
			checkMes:function(){
				httpModule.ajaxRequest({
					name: "回款认证查询错误次数", // 接口名称
					type: "GET",
					async:false,
					url: shopIp + "jst-finance-merchantFront/rest/merchantFront/getAuthenErrorNum",
					data: {
						listId:basicInfo.billList[0].listId,
					},
					success: function(data) {
						console.log(data)
						if(data.resType === "00"){
	                        payErrorNum = data.payErrorNum
	                        $("#payErrorNum").text(data.payErrorNum);	
	                        $("#errorNum").text(data.payErrorNum - data.errorNum);
	                        
	                    }else{
	                        alert(data.msgContent);
	                    }
					},
				});
			}
		};
		main.init();
});
