jQuery(function($){
	var basicInfo = {},
		onLine = sessionModule.isLogin(sessionStorage.userId),
		obj = "alertBox",
		alertTitle = "",
		alertContent = "",
		alertWidth = "",
		alertBtn = "",
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;				
				self.getBasicInfo();
				self.getBaseBalance();
				self.getSettlementBalance();
				self.bindEvent();
				
				$("#zhBal").text(sessionStorage.baseBalance);
				$("#jsBal").text(sessionStorage.settlementBalance);
											
			},
			bindEvent:function(){
				//未鉴权状态跳转
				$("#tips").find("a").bind("click",function(){				
					//状态判断
					if(basicInfo.billList[0].billState == "待打款" || basicInfo.billList[0].billState == "打款失败"){
						window.location.href = "../account/to_be_paid.html";
					}else if(basicInfo.billList[0].billState === "已打款" && basicInfo.billList[0].timeOutState === "正常"){
						window.location.href = "../account/amount_of_backfill.html";
					}else if(basicInfo.billList[0].billState === "已打款" && basicInfo.billList[0].timeOutState === "超时"){
						alertTitle = '<h4 class="center alert-title">重新鉴权申请</h4>';
	                    alertContent = '<div class="alert-content"> ' +
	                    					'<p class="center">您已超过两周回填金额有效期，</p>'+
	                    					'<p class="center">请重新申请发起打款验证，谢谢！</p>'+
	                    				'</div>';
	                    alertWidth = 400;
	                    alertBtn = [
										{
											html: "重新申请",
											"class" : "alert-btn",
											click: function() {
												$( this ).dialog( "close" );
												main.applyAgain();
											}
										}
									];
						exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);	
					}else if(basicInfo.billList[0].billState === "已拒绝"){
						alertTitle = '<h4 class="center alert-title">提示</h4>';
	                    alertContent = '<div class="alert-content"> ' +
	                    					'<p class="center">您的账户已被拒绝鉴权！</p>'+	                    					
	                    				'</div>';
	                    alertWidth = 400;
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
					}else if(basicInfo.billList[0].billState === "认证失败"){
						alertTitle = '<h4 class="center alert-title">打款验证失败</h4>';
	                    alertContent = '<div class="alert-content"> ' +
	                    					'<p class="center">您已3次回填打款金额错误，打款验证失败，</p>'+	 
	                    					'<p class="center">请更换对公银行账户进行验证！</p>'+	   
	                    				'</div>';
	                    alertWidth = 400;
	                    alertBtn = [
										{
											html: "马上更换",
											"class" : "alert-btn",
											click: function() {
												$( this ).dialog( "close" );	
												window.location.href = "../account/replace_bankcard.html";
											}
										}
									];
						exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
					}
				});
				
				//提现、转账、充值按钮事件
				$("#btns").on("click",".button",function(){
					var index = $(this).index();
					switch(index){
						case 0:
							alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">转账功能正在开发中，敬请期待！</p>'+	 		                    					   
		                    				'</div>';
		                    alertWidth = 400;
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
							break;
						case 1:
							if(basicInfo.authenState == "未鉴权"){
								alertTitle = '<h4 class="center alert-title">提示</h4>';
			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">您尚未完成鉴权，请先完成鉴权！</p>'+	 		                    					   
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
							}else if(parseInt(parseFloat(sessionStorage.baseBalance)*100) == "0"){
								alertTitle = '<h4 class="center alert-title">提示</h4>';
			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">账户余额为0，无法提现！</p>'+	 		                    					   
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
							}else{
								window.location.href = "../account/withdraw.html";
							}
							
							break;
						case 2:
							alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">充值功能正在开发中，敬请期待！</p>'+	 		                    					   
		                    				'</div>';
		                    alertWidth = 400;
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
							break;
						default:
							break;
					}
				});
				//添加银行卡
				$("#addBankCard").bind("click",function(){
					window.location.href = "add_bankcard.html";
				});
				//查看银行卡
				$("#checkBankCard").bind("click",function(){
					window.location.href = "check_bankcard.html";
				});
				//重置登录密码
				$("#restPwd").bind("click",function(){
					window.location.href = "reset_login_pwd.html";
				});
				//重置支付密码
				$("#resetPayPwd").bind("click",function(){
					window.location.href = "reset_pay_pwd.html";
				});
				
				
			},
			getBasicInfo:function(){
				httpModule.ajaxRequest({
					name: "获取商户基本信息", // 接口名称
					type: "GET",
					async:false,
					url: shopIp + "jst-finance-merchantFront/rest/merchantFront/getAuthenInfo",
					data: {
						userId : sessionStorage.userId
					},
					success:function(data){
						console.log(data)
						if(data.resType == "00"){
							basicInfo = data;
							sessionStorage.basicInfo = JSON.stringify(basicInfo);
							$(".top-username").text("您好，" + data.userName);//显示用户名
							$(".user-name").text(data.userName);//显示用户名
							$("#level").text(data.creditLevel + "级别");//商户级别					
							
							//鉴权状态
							$("#jqState").text(data.authenState)
							if(data.authenState == "已鉴权"){
								$(".state").addClass("state-yj");
								$(".state").removeClass("state-dj");
								$("#tips").html('您已完成鉴权，请放心使用！');
								$(".tips-icon").addClass("tips-r");
								$(".tips-icon").removeClass("tips-f");
							}else{
								$(".state").addClass("state-dj");
								$(".state").removeClass("state-yj");
								$("#tips").html('您尚未完成鉴权认证，<a href="javascript:void(0)">请立即点此申请！</a>');
								$(".tips-icon").addClass("tips-f");
								$(".tips-icon").removeClass("tips-r");
							}
							
						}
					}
				});
			},
			//超时，重新申请，发送请求
			applyAgain:function(){
				httpModule.ajaxRequest({
					name:"超时再次申请",
					type:"POST",
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/payApply",
					data:{
						listId: basicInfo.billList[0].listId
					},
					success:function(data){
						 if(data.resType === "00"){                      
	                      	alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">申请成功，请等待管理员审核结果！</p>'+	                    					
		                    				'</div>';
		                    alertWidth = 400;
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
	                   }else{
	                        alertTitle = '<h4 class="center alert-title">提示</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">'+ data.msgContent +'</p>'+	                    					
		                    				'</div>';
		                    alertWidth = 400;
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
			//获取基本户余额
			getBaseBalance:function(){
				httpModule.ajaxRequest({
					name:"获取基本账户余额",
					type:"POST",
					async:false,
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/getAccountBlance",
					data:{
						accType:"01",
						userId:sessionStorage.userId
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							var balance = data.balance/100;
							var wdBalance = (data.balance - data.frozenBalance)/100;
							sessionStorage.baseBalance = balance.toFixed(2);
							sessionStorage.wdBalance = wdBalance.toFixed(2);
							
						}else{
							alert(data.msgContent);
						}
					}
				});
			},
			//获取待结算余额
			getSettlementBalance:function(){
				httpModule.ajaxRequest({
					name:"获取待结算户余额",
					type:"POST",
					async:false,				
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/getAccountBlance",
					data:{
						accType:"02",
						userId:sessionStorage.userId
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							var balance = data.balance/100;
							sessionStorage.settlementBalance = balance.toFixed(2);
						}else{
							alert(data.msgContent);
						}
					}
				});
			},
		};
		
		main.init();


});

