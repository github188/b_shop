jQuery(function($){
	var basicInfo = basicInfo = JSON.parse(sessionStorage.basicInfo),
		onLine = sessionModule.isLogin(sessionStorage.userId),
		basicMes = "",//记录基本信息
		codeKey = "",//记录验证码跟踪码
		bankCode = "",//银行编码
		isDefault = 0,//是否默认
		inputState = {//输入状态
			openUser:false,
			openBankName:false,
			openBankPoint:false,
			province:false,
			city:false,
			bankCode:false,
			identifyingCode:false		
		},
		checkedFlag = false,
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;
				self.getUserInfo();
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							inputState.bankCode = false;
							$("#bankCodeErr").text("请输入正确的银行卡号");
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
					$("#answer").addClass("hide");
				});
				$("body").click(function(){
					$("#answer").addClass("hide");
				});
				
				//验证码输入
				$("#identifyingCode").bind({
					"keyup":function(){
						if($(this).val().length >= 6){
							if(!checkedFlag){
								main.checkCode();
							}
														
						}else{
							
						}
					},
					"blur":function(){
						if($(this).val().length < 6){
							inputState.identifyingCode = false;
							$("#identifyingCodeErr").text("请输入正确的验证码")
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}						
						}else{
							
						}
					},
					"focus":function(){
						
					},
				});
				
				//确认添加按钮
				$("#subBtn").bind("click",function(){
					if($(this).hasClass("confirm-btn-on")){
						main.addBankCard();
					}
				})
				//取消按钮
				$("#cancleBtn").bind("click",function(){
					window.location.href = "index.html";
				})
			},
			//获取用户基本信息
			getUserInfo:function(){
				httpModule.ajaxRequest({
					name:"获取用户基本信息",
					type:"POST",
					async:false,
					url:shopIp + "jst-finance-merchantFront/rest/merchantFront/getMchtBaseInfo",
					data:{
						userId:sessionStorage.userId
					},
					success:function(data){
						basicMes = data;
						console.log(data);
						if(data.resType == "00"){
							$("#userPhone").val(data.base.companyTel.substring(0,3) + "****" + data.base.companyTel.substring(7));
						}else{
							alert(data.msgContent);
						}
					}
				});
			},
			//发送添加银行卡请求
			addBankCard:function(){
				httpModule.ajaxRequest({
					name:"发送添加银行卡请求",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/addBankCard",
					data:{
							userId:sessionStorage.userId,//商户ID
							bankName:$("#openBankName").val(),//银行名称
							bankCode:bankCode,//银行编号
							bankCardNo:$("#bankCode").val(),//银行卡号
							openName:$("#openUser").val(),//开户人姓名
							openProvince:$("#province").val(),//开户银行所在省
							openCity:$("#city").val(),//开户银行所在市
							openBranbank:$("#openBankPoint").val(), //开户银行支行名称  
							isDefault:isDefault//是否默认
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
			//发送验证码
			sendCode:function(){
				httpModule.ajaxRequest({
					name:"发送验证码",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/getMsgVerifyCode",
					data:{
						company_tel:basicMes.base.companyTel
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
						msgCode:$("#identifyingCode").val()
						
					},
					success:function(data){
						console.log(data);
						if(data.resType == "00"){
							inputState.identifyingCode = true;
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
							checkedFlag = true;
						}else{
							inputState.identifyingCode = false;
							$("#identifyingCodeErr").text("请输入正确的验证码");	
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}
					}
				});
			},
			//倒计时
			countDown:function(){	
				var count = 60;
				var clearId = setInterval(function(){
					$("#getCode").text(count + "s");
					count --;
					if(count == -1){
						$("#getCode").text("发送验证码");
						count = 60;
						$("#getCode").addClass("ajOn");
						clearInterval(clearId);
					}
				},1000);
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
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
								$("#subBtn").addClass("confirm-btn-on");
							}else{
								$("#subBtn").removeClass("confirm-btn-on");
							}
						}else{
							$("#openBankNameErr").text(data.msgContent);
							inputState.openBankName = false;
							if(inputState.openUser && inputState.openBankName && inputState.openBankPoint && inputState.province && inputState.city && inputState.bankCode && inputState.identifyingCode){
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
