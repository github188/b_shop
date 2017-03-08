jQuery(function($){
	var basicInfo = basicInfo = JSON.parse(sessionStorage.basicInfo),
		onLine = sessionModule.isLogin(sessionStorage.userId),
		bankList = "",
		bankIndex = 0,
		checkState = {
			openBankPoint:false,
			province:false,
			city:false,
			bankCode:false
		},
		obj = "alertBox",//弹框节点
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
				self.getBankList();
				console.log(basicInfo)
				$("#openUser").val(basicInfo.billList[0].receiveName);
			},
			bindEvent:function(){
				//显示银行列表
				$("#showBankList").bind("click",function(e){
					e.stopPropagation();
					$("#bankList").removeClass("hide");
				});
				//选择银行
				$("#bankList").on("click","li",function(){
					$("#openBankName").val($(this).text());
					$("#bankList").addClass("hide");
					bankIndex = $(this).index();
				});
				//确定按钮事件
				$(".confirm-btn").bind("click",function(){
					if($(this).hasClass("confirm-btn-on")){
						main.changeBankCard();
					}
				})
				
				/*银行卡号输入*/
				$("#bankCode").myvalidate({//输入限制
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
						
					},
					valCallback: function (val){	
						
						if($("#bankCode").val().length >= 6){
							
							for(var i = 0;i < bankList[bankIndex].cardList.length;i++){
								if($("#bankCode").val().substring(0,6) != bankList[bankIndex].cardList[i]){
									$("#bankCodeTips").text("暂不支持该银行卡！");
									checkState.bankCode = false;
									
									if(checkState.bankCode && checkState.openBankPoint && checkState.province && checkState.city){
											$(".confirm-btn").addClass("confirm-btn-on");
										}else{
											$(".confirm-btn").removeClass("confirm-btn-on");
										}
									return false;
								}else{
									if($("#bankCode").val().length > 15){
										checkState.bankCode = true;
										
										if(checkState.bankCode && checkState.openBankPoint && checkState.province && checkState.city){
											$(".confirm-btn").addClass("confirm-btn-on");
										}else{
											$(".confirm-btn").removeClass("confirm-btn-on");
										}
									}
									return false;
								}
							}
							
							
							
						}else{
							$("#bankCodeTips").text("");
							checkState.bankCode = false;
							if(checkState.bankCode && checkState.openBankPoint && checkState.province && checkState.city){
								$(".confirm-btn").addClass("confirm-btn-on");
							}else{
								$(".confirm-btn").removeClass("confirm-btn-on");
							}
						}
					}
				});
				/*输入校验*/
				$("#openBankPoint").bind({//开户网点
					"keyup":function(){
						if($(this).val().length > 1){
							checkState.openBankPoint = true;
						}else{
							checkState.openBankPoint = false;
						}
						if(checkState.bankCode && checkState.openBankPoint && checkState.province && checkState.city){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				$("#province").bind({//省市自治区
					"keyup":function(){
						if($(this).val().length > 1){
							checkState.province = true;
						}else{
							checkState.province = false;
						}
						
						if(checkState.bankCode && checkState.openBankPoint && checkState.province && checkState.city){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				$("#city").bind({//市县
					"keyup":function(){
						if($(this).val().length > 1){
							checkState.city = true;
						}else{
							checkState.city = false;
						}
						
						if(checkState.bankCode && checkState.openBankPoint && checkState.province && checkState.city){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				
			},
			//获取系统支持的银行列表
			getBankList:function(){
				httpModule.ajaxRequest({
					name:"获取银行列表",
					type:"GET",
					async:false,
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/getBankList",
					data:{
						
					},
					success:function(data){
						console.log(data);
						 if(data.resType === "00"){	
						 	bankList = data.bankCardList;
						 	$("#openBankName").val(data.bankCardList[0].bankName)
						 	var html = "";
						 	for(var i = 0;i < data.bankCardList.length;i++){
						 		html += '<li>'+ data.bankCardList[i].bankName +'</li>'
						 	}
						 	$("#bankList").html(html);
	
	                    }else{
	                        alert(data.msgContent);
	                    }
					}
				})
			},
			//更换银行卡请求
			changeBankCard:function(){
				httpModule.ajaxRequest({
					name:"更换银行卡",
					type:"POST",
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/changeAuthenBank",
					data : {
	                    listId:basicInfo.billList[0].listId,//清单ID
	                    bankName:bankList[bankIndex].bankName,//银行名称
	                    bankCode:bankList[bankIndex].bankCode,//银行编号
	                    openProvince:$("#province").val(),//开户省
	                    openCity:$("#city").val(),//开户市
	                    openBranbank:$("#openBankPoint").val(), //开户网点名称
	                    bankCardNo:$("#bankCode").val()//银行卡号
	                },
	                success:function(data){
	                	if(data.resType == "00"){
	                		alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">'+ data.msgContent +'</p>'+	                    					
		                    				'</div>';
		                    alertWidth = 300;
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
							exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
	                		
	                	}
	                	
	                }
					
					
				});
			},
		};
		main.init();
});
