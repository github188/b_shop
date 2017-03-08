jQuery(function($){
	var basicInfo = JSON.parse(sessionStorage.basicInfo),
		onLine = sessionModule.isLogin(sessionStorage.userId),
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;
					
				self.bindEvent();
				console.log(basicInfo)
			},
			bindEvent:function(){
				$("#openName").val(basicInfo.billList[0].receiveName);//开户人
	            $("#openBank").val(basicInfo.billList[0].bankName);//开户银行
	            $("#openBankCode").val(basicInfo.billList[0].receiveCardNo);//银行卡号
	            
	            //确认按钮
	            $("#sureBtn").bind("click",function(){
	            	console.log(123)
	            	window.location.href = "../account/index.html";
	            });
			}
			
		};
		main.init();
})
