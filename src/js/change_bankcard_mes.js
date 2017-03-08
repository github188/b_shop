jQuery(function($){
	var basicInfo = basicInfo = JSON.parse(sessionStorage.basicInfo),
		onLine = sessionModule.isLogin(sessionStorage.userId),
		urlIndex = exports.getUrlString("index"),
		bandCardInfo = JSON.parse(sessionStorage.bankCardList),
		basicMes = "",//记录基本信息
		bankCode = "",//银行编码
		isDefault = "",//是否默认
		inputState = {//输入状态
			openUser:true,
			openBankName:true,
			openBankPoint:true,
			province:true,
			city:true,
			bankCode:true,	
		},
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;
				console.log(bandCardInfo)
				$("#openUser").val(bandCardInfo.bankCardBeanList[urlIndex].openName);
				$("#openBankName").val(bandCardInfo.bankCardBeanList[urlIndex].bankName);
				$("#openBankPoint").val(bandCardInfo.bankCardBeanList[urlIndex].openBranbank);
				$("#province").val(bandCardInfo.bankCardBeanList[urlIndex].openProvince);
				$("#city").val(bandCardInfo.bankCardBeanList[urlIndex].openCity);
				$("#bankCode").val(bandCardInfo.bankCardBeanList[urlIndex].bankCardNo);
				
				if(bandCardInfo.bankCardBeanList[urlIndex].isDefault == "1"){
					$("#setMain").val("是");
					isDefault = bandCardInfo.bankCardBeanList[urlIndex].isDefault;
				}else{
					$("#setMain").val("否");
					isDefault = bandCardInfo.bankCardBeanList[urlIndex].isDefault;
				}
				
				bankCode = bandCardInfo.bankCardBeanList[urlIndex].bankCode;
				

				self.bindEvent();
			},
			bindEvent:function(){
				//发送验证码
				$("#getCode").bind("click",function(){
					if($(this).hasClass("ajOn")){
						main.sendCode();
						main.countDown();
					}
					$(this).removeClass("ajOn");
				});
				//开户人输入
				$("#openUser").bind({
					"keyup":function(){
						if($(this).val().length > 1){
							inputState.openUser = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							inputState.openUser = false;
						}

						
					},
					"blur":function(){
						if($(this).val().length > 1){
							inputState.openUser = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							$("#openUserErr").text("请输入正确的开户人名称");
							inputState.openUser = false;
						}
					},
					"focus":function(){
						$("#openUserErr").text("");
					},
				});
				//开户银行输入
				$("#openBankName").bind({
					"keyup":function(){
						if($(this).val().length > 3){
							main.checkBankCode();						
						}else{
							
						}
					},
					"blur":function(){
						if($(this).val().length > 3){
														
						}else{
							
						}
					},
					"focus":function(){
						if($(this).val().length > 1){
														
						}else{
							
						}
					},
				});
				//开户网点输入
				$("#openBankPoint").bind({
					"keyup":function(){
						if($(this).val().length > 1){
							inputState.openBankPoint = true;
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							inputState.openBankPoint = false;
						}
					},
					"blur":function(){
						if($(this).val().length > 1){
							inputState.openBankPoint = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							$("#openBankPointErr").text("请输入正确的开户网点");
							inputState.openBankPoint = false;
						}
					},
					"focus":function(){
						$("#openBankPointErr").text("");
					},
				});
				//开户地址省输入
				$("#province").bind({
					"keyup":function(){
						if($(this).val().length > 1){
							inputState.province = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							inputState.province = false;
						}
					},
					"blur":function(){
						if($(this).val().length > 1){
							inputState.province = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							$("#provinceErr").text("请输入正确的开户地址");
							inputState.province = false;
						}
					},
					"focus":function(){
						$("#provinceErr").text("");
					},
				});
				//开户地址市县输入
				$("#city").bind({
					"keyup":function(){
						if($(this).val().length > 1){
							inputState.city = true;		
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							inputState.city = false;
						}
					},
					"blur":function(){
						if($(this).val().length > 1){
							inputState.city = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							$("#cityErr").text("请输入正确的开户地址");
							inputState.city = false;
						}
					},
					"focus":function(){
						$("#cityErr").text("");
					},
				});
				//银行账号输入
				$("#bankCode").myvalidate({//输入限制
					filter_type: "positiveNumber", 
					enterCallback: function (obj){
						
					},
					valCallback: function (val){
						
					}
				});
				$("#bankCode").bind({
					"keyup":function(){
						if($(this).val().length > 10){
							inputState.bankCode = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							
						}
					},
					"blur":function(){
						if($(this).val().length > 10){
							inputState.bankCode = true;	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							inputState.bankCode = false;
							$("#bankCodeErr").text("请输入正确的银行卡号");
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}
					},
					"focus":function(){
						$("#bankCodeErr").text("");
					},
				});
				//是否默认
				$("#yesOrNo").bind("click",function(e){
					e.stopPropagation();
					$("#answer").removeClass("hide");
				});
				$("#answer").on("click","li",function(){
					isDefault = $(this).index();
					$("#setMain").val($(this).text());
					if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
						$("#subBtn").addClass("confirm-btn-on");
					}else{
						$("#subBtn").removeClass("confirm-btn-on");
					}
					$("#answer").addClass("hide");
				});
				$("body").click(function(){
					$("#answer").addClass("hide");
				});							
				
				//确认添加按钮
				$("#subBtn").bind("click",function(){
					if($(this).hasClass("confirm-btn-on")){
						main.changeBankCard();
					}
				})
				//取消按钮
				$("#cancleBtn").bind("click",function(){
					window.location.href = "check_bankcard.html";
				})
			},
			//发送修改银行卡请求
			changeBankCard:function(){
				httpModule.ajaxRequest({
					name:"发送修改银行卡请求",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/modBankCard",
					data:{
							userId:sessionStorage.userId,//商户ID
							bankName:$("#openBankName").val(),//银行名称
							bankCode:bankCode,//银行编号
							bankCardNo:$("#bankCode").val(),//银行卡号
							openName:$("#openUser").val(),//开户人姓名
							openProvince:$("#province").val(),//开户银行所在省
							openCity:$("#city").val(),//开户银行所在市
							openBranbank:$("#openBankPoint").val(), //开户银行支行名称  
							isDefault:isDefault,//是否默认
							logId:bandCardInfo.bankCardBeanList[urlIndex].logId
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							alert(data.msgContent);
							window.location.href = "check_bankcard.html"
						}else{
							alert(data.msgContent);
						}	
					}
				});
			},			
			//查银行编码
			checkBankCode:function(){
				httpModule.ajaxRequest({
					name:"查银行编码",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/getBankCodeByBankName",
					data:{
						bankName:$("#openBankName").val()	
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							bankCode = data.bankCode;
							$("#openBankNameErr").text(" ");
							inputState.openBankName = true;
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							$("#openBankNameErr").text(data.msgContent);
							inputState.openBankName = false;
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode ){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}
					}
				});
			}
			
		};
		main.init();
})

