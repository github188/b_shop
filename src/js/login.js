jQuery(function($) {
	
	var loginBtnEle = $("#jsjk-login");
	var userIdEle = $("#jsjk-userid");
	var pwdEle = $("#jsjk-password");
	var codeEle = $("#jsjk-checkcode");
	var checkCodeImg = $("#check-codeimg");
	var firstLogin = "";
	var resetPwd = "";
	var resetPayPwd = "";
	var shopCode = "";
	var obj = "alertBox";
	var checked = {
				firstPwd:false,
				secondPwd:false,
				payFirstPwd:false,
				paySecondPwd:false
		};
	var main = {
		// 初始化执行
		init: function() {
			var self = this;
			self.bindEvent();
			self.createCode();
		},
		// 事件绑定
		bindEvent: function() {
			var self = this;
			//更换验证码
			checkCodeImg.bind("click",function(){
				self.createCode();
			});
			//登陆按钮事件
			loginBtnEle.bind("click", function() {
				var userIdVal = userIdEle.val();
				var pwdVal = pwdEle.val();
				var codeVal = codeEle.val();
				if(stringModule.CheckEmpty(userIdVal) && stringModule.CheckEmpty(pwdVal) && stringModule.CheckEmpty(codeVal)) {
					httpModule.ajaxRequest({
						name: "登陆", // 接口名称
						type: "GET",
						async:false,
						url: shopIp + "jst-finance-merchantFront/rest/merchantFront/login",
						data: {
							code: userIdVal,
							password: exports.encryptPwd(pwdVal),
							checkCode: codeVal
						},
						success: function(data) {
							if(data.resType == "00") {
								sessionStorage.userId = data.userId;
								sessionStorage.merchantNo = data.merchantNo;
								$("#shopId").val(data.merchantNo);
								shopCode = data.merchantNo;
								if(data.status == "1") {
									alertTitle = '<h4 class="center alert-title">提示</h4>';
				                    alertContent = '<div class="alert-content"> ' +
				                    					'<p class="center">首次登录，请修改密码</p>'+	 
				                    				'</div>';
				                    alertWidth = 330;
				                    alertBtn = [
													{
														html: "知道了",
														"class" : "alert-btn",
														click: function() {
															$( this ).dialog( "close" );	
															if(firstLogin == "00"){														
																$(".reset-cell").removeClass("hide");
																main.createCode();
															}
														}
													}
												];
									exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
									
									
									main.getBaseBalance();
									main.getSettlementBalance();
									firstLogin = data.resType;
								} else {
									main.getBaseBalance();
									main.getSettlementBalance();
									window.location.href = "../account/index.html";									
								}
							} else {
								alertTitle = '<h4 class="center alert-title">提示</h4>';
			                    alertContent = '<div class="alert-content"> ' +
			                    					'<p class="center">'+data.msgContent+'</p>'+	 
			                    				'</div>';
			                    alertWidth = 330;
			                    alertBtn = [
												{
													html: "知道了",
													"class" : "alert-btn",
													click: function() {												
														$( this ).dialog( "close" ); 
														main.createCode();
														
													}
												}
											];
								exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
								
							}
						},
					});
				} else {				
					alertTitle = '<h4 class="center alert-title">提示</h4>';
                    alertContent = '<div class="alert-content"> ' +
                    					'<p class="center">请填写完整的账号、密码和验证码</p>'+	 
                    				'</div>';
                    alertWidth = 330;
                    alertBtn = [
									{
										html: "知道了",
										"class" : "alert-btn",
										click: function() {												
											$( this ).dialog( "close" ); 
											main.createCode();
										}
									}
								];
					exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
					
				}
			});
			
			//重置密码
			var first = "",
				second = "",
				payFirst = "",
				paySecond = "";		
			//新密码输入
			$("#firstPwd").on({
				"keyup":function(){
					if($(this).val().length >= 6 && $(this).val().length <=20){
						first = $(this).val();
						checked.firstPwd = true;
					}else{
						checked.firstPwd = false;
					}
					
					if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
						$(".btns").addClass("btn-sure-on");
					}else{
						$(".btns").removeClass("btn-sure-on");
					}
				},
				"blur":function(){
					if($(this).val().length < 6 || $(this).val().length > 20){
						$("#pwdTips").text("密码长度不正确！");
					}
				},
				"focus":function(){
					if($(this).val().length < 6 || $(this).val().length > 20){					
						$("#pwdTips").text("");
					}
				}
			});
			//确认新密码
			$("#secondPwd").on({
				"keyup":function(){
					second = $(this).val();
					if(first.length == second.length){
						if(first == second){
							$("#pwdTips").text("两次密码一致!");
							$("#pwdTips").css("color","#6abbd6");
							checked.secondPwd = true;
							resetPwd = second;
						}else{
							$("#pwdTips").text("两次密码不一致!");
							checked.secondPwd = false;
						}
					}else if(first.length <= second.length){
						$("#pwdTips").text("两次密码不一致!");
						checked.secondPwd = false;
					}else{
						checked.secondPwd = false;
					}
									
					if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
						$(".btns").addClass("btn-sure-on");
					}else{
						$(".btns").removeClass("btn-sure-on");
					}
				},
				"blur":function(){
					if($(this).val().length < 6 || $(this).val().length > 20){				
						$("#pwdTips").text("密码长度不正确！");
					}
				},
				"focus":function(){
					if($(this).val().length < 6 || $(this).val().length > 20){					
						$("#pwdTips").text("");
					}
				}
			});
			//支付密码第一次输入事件
			$("#payFirstPwd").myvalidate({
				filter_type: "positiveNumber", 
				enterCallback: function (obj){


				}, valCallback: function (val){
					if($("#payFirstPwd").val().length == 6){
						checked.payFirstPwd = true;
						payFirst = val;
						console.log(payFirst)
					}else{					
						checked.payFirstPwd = false;
						
					}
					
					if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
						$(".btns").addClass("btn-sure-on");
					}else{
						$(".btns").removeClass("btn-sure-on");
					}							 
				}
			});
			
			//确认支付密码
			$("#paySecondPwd").myvalidate({
				filter_type: "positiveNumber", 
				enterCallback: function (obj){


				}, valCallback: function (val){
					if($("#paySecondPwd").val().length == 6){
						paySecond = val;								
						if(payFirst == paySecond){
							checked.paySecondPwd = true;
							resetPayPwd = paySecond;								
							resetPayPwd = exports.encryptPwd(JSON.stringify(resetPayPwd));
							$("#payPwdTips").css("color","#6abbd6");
							$("#payPwdTips").text("两次密码一致！");
						}else{
							checked.paySecondPwd = false;
							$("#payPwdTips").text("两次密码不一致!");
						}
						
					}else{
						checked.paySecondPwd = false;
					}
					
					if(checked.firstPwd && checked.secondPwd && checked.payFirstPwd && checked.paySecondPwd){
						$(".btns").addClass("btn-sure-on");
					}else{
						$(".btns").removeClass("btn-sure-on");
					}
					 
				}
			});
			
			//确定按钮事件
			$(".btns").bind("click",function(){
				if($(this).hasClass("btn-sure-on")){
					main.resetPwd();
				}
				
			});

			
		},
		//生成验证码
		createCode:function(){
			checkCodeImg.attr("src", shopIp + "jst-finance-merchantFront/rest/merchantFrontCode/getCode?timeStamp="+ new Date().getTime());
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
					
					if(data.resType == "00"){
						sessionStorage.user = data.acctName;
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
		resetPwd:function(){
			httpModule.ajaxRequest({
				name: "重置密码", // 接口名称
				type: "POST",
				url: shopIp + "jst-finance-merchantFront/rest/merchantFront/resetPwd",
				data: {
					code : shopCode,
					password : exports.encryptPwd(resetPwd),
					payPassWord:resetPayPwd
				},
				success: function(data) {
					console.log(data)
					if(data.resType === "00"){
						alert("重置成功");
						sessionStorage.clear();
						window.location.href = "../home/login.html";
					}else{
						alert(data.msgContent);
					}
				},
			});
		}
		
	};
	main.init();
	
});