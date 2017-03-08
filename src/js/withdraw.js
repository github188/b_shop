jQuery(function($){
	var basicInfo = "",//获取商户基本信息
		cardInfo = "",//银行卡信息
		cardIndex = 0,//银行卡序号
		onLine = sessionModule.isLogin(sessionStorage.userId),
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;
					basicInfo = JSON.parse(sessionStorage.basicInfo);
					
				self.getBankList();
				self.getBaseBalance();
				//self.getSettlementBalance(); 
				self.initShow();
				self.bindEvent();
				console.log(basicInfo)
			},
			bindEvent:function(){
				var checkState = {
					userState:true,//开户人
					bankState:true,//开户银行
					cardState:true,//卡号
					sumState:false,//金额
					payPwdState:false//支付密码
				}
				
				//全额提现按钮事件
				$("#allIn").bind("click",function(){
					$("#wd_withdraw").val($("#wd_sum").val());
					checkState.sumState = true;
				});
				
				//显示银行卡列表
				$("#showCardList").bind("click",function(e){
					e.stopPropagation();
					$("#cardList").removeClass("hide");
				});
				//隐藏银行卡列表
				$("body").click(function(){
					$("#cardList").addClass("hide");
				})
				//选择银行卡
				$("#cardList").on("click","li",function(){
					cardIndex = $(this).index();
					if(cardInfo[cardIndex].verifyFlag == "1"){
						$("#cardList").addClass("hide");
						$("#wd_openBankCode").val($(this).text());	
						$("#wd_openName").val(cardInfo[cardIndex].openName);
						$("#wd_openBankName").val(cardInfo[cardIndex].bankName);
					}else{
						alert("请选择已鉴权的银行卡！")
					}
					
					
					
				});
				//金额输入
				$("#wd_withdraw").mynumber({
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
	
					}, valCallback: function (val){
						if(parseInt(parseFloat($("#wd_withdraw").val())*100) <= parseInt(parseFloat($("#wd_sum").val())*100) && parseInt(parseFloat($("#wd_withdraw").val())*100) > 0){
							checkState.sumState = true;
							$("#wd_withdraw_err").text("");
						}else{
							checkState.sumState = false;
							$("#wd_withdraw_err").text("请输入正确的金额");
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
						 
					}
				});
				//开户人输入校验
				$("#wd_openName").bind({
					"keyup":function(){
						if($(this).val().length <= 1){
							checkState.userState = false;
						}else{
							checkState.userState = true;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"blur":function(){
						if($(this).val().length <= 1){
							$("#wd_openName_err").text("请输入正确的开户人");
							checkState.userState = false;
						}else{
							$("#wd_openName_err").text("");
							checkState.userState = true;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"focus":function(){
						$("#wd_openName_err").text("");
					}
				});
				//开户银行输入校验
				$("#wd_openBankName").bind({
					"keyup":function(){
						if($(this).val().length <= 1){
							checkState.bankState = false;
						}else{
							checkState.bankState = true;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"blur":function(){
						if($(this).val().length <= 1){
							$("#wd_openBankName_err").text("请输入正确的开户银行");
							checkState.bankState = false;
						}else{
							$("#wd_openBankName_err").text("");
							checkState.bankState = true;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"focus":function(){
						$("#wd_openBankName_err").text("");
					}
				});
				//银行卡输入校验
				$("#wd_openBankCode").bind({
					"keyup":function(){
						if($(this).val().length >= 15){
							checkState.cardState = true;
						}else{
							checkState.cardState = false;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"blur":function(){
						if($(this).val().length <= 15){
							$("#wd_openBankCode_err").text("请输入正确的银行卡号");
							checkState.cardState = false;
						}else{
							$("#wd_openBankCode_err").text("");
							checkState.cardState = true;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"focus":function(){
						$("#wd_openBankCode_err").text("");
					}
				});
				//支付密码输入校验
				$("#payPwd").myvalidate({
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
						
					}, valCallback: function (val){					
						 
					}
				});
				$("#payPwd").bind({
					"keyup":function(){
						if($(this).val().length == 6){
							checkState.payPwdState = true;
						}else{
							checkState.payPwdState = false;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
					},
					"blur":function(){
						if($(this).val().length < 6){
							$("#payPwd_err").text("请输入正确的支付密码");
							checkState.payPwdState = false;
						}else{
							$("#payPwd_err").text("");
							checkState.payPwdState = true;
						}
						
						if(checkState.userState && checkState.bankState && checkState.cardState && checkState.sumState && checkState.payPwdState ){
							$(".confirm-btn").addClass("confirm-btn-on");
						}else{
							$(".confirm-btn").removeClass("confirm-btn-on");
						}
						
					},
					"focus":function(){
						$("#payPwd_err").text("");
					}
				});
				
				//确认按钮事件
				$(".confirm-btn").bind("click",function(){
					if($(this).hasClass("confirm-btn-on")){
						main.withdraw();
					}
				});
			},
			//提现请求
			withdraw:function(){
				httpModule.ajaxRequest({
					name:"提现请求",
					type:"POST",
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/payMerchantCash",
					data:{
						bankCardCode:cardInfo[cardIndex].bankCode,//银行英文简称
						bankName:$("#wd_openBankName").val(),//银行名称
						bankCardNo:$("#wd_openBankCode").val(),//银行卡号
						tranAmount:parseInt(parseFloat($("#wd_withdraw").val())*100),//提现金额
						payPassWord:exports.encryptPwd($("#payPwd").val()),//支付密码
						openName:$("#wd_openName").val(),//开户人名
						remark:$("#remark").val(),//备注
						userId:sessionStorage.userId
					},
					success:function(data){
						console.log(data);
						var obj = "alertBox",
							alertTitle = "",
							alertContent = "",
							alertBtn = "",
							alertWidth = "";
						
						if(data.resType == "00"){						
							alertTitle = '<h4 class="center alert-title">提交成功</h4>';
		                    alertContent = '<div class="alert-content"> ' +
		                    					'<p class="center">您的提现申请已提交，</p>'+	 
		                    					'<p class="center">我们会在2个工作日内汇款至指定账户，</p>'+	   
		                    					'<p class="center">请注意查收。</p>'+
		                    				'</div>';
		                    alertWidth = 400;
		                    alertBtn = [
											{
												html: "确认",
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
		                    alertWidth = 330;
		                    alertBtn = [
											{
												html: "确认",
												"class" : "alert-btn",
												click: function() {
													$( this ).dialog( "close" );	
													
												}
											}
										];
							exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
						}
					}
				});
			},
			getBankList:function(){
				httpModule.ajaxRequest({
					name:"获取银行卡列表",
					type:"POST",
					async:false,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/getBankCardList",
					data:{
						userId:sessionStorage.userId
					},
					success:function(data){
						console.log(data);
						var html = "";
						var txt = "";
						cardInfo = data.bankCardBeanList;
						if(data.resType == "00"){
							for(var i = 0;i < data.bankCardBeanList.length;i++){
								if(data.bankCardBeanList[i].verifyFlag == "0"){
									txt = "(未鉴权)";
								}else{
									txt = "";
								}
								html += '<li>'+ data.bankCardBeanList[i].bankCardNo + txt +'</li>'
							}
							$("#cardList").html(html)
						}else{
							alert(data.msgContent);
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
			initShow:function(){
				$("#wd_openName").val(cardInfo[0].openName);//开户人
				$("#wd_openBankName").val(cardInfo[0].bankName);//开户银行
				$("#wd_openBankCode").val(cardInfo[0].bankCardNo);//银行卡号
				$("#wd_sum").val(sessionStorage.wdBalance);//可提现金额
				
			}
		};
		main.init();
	
	
	
});
