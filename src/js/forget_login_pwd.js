jQuery(function($) {
		
	var checkCodeImg = $("#check-codeimg"),
		firstLogin = "",
		resetPwd = "",
		resetPayPwd = "",
		shopCode = "",
		obj = "alertBox",
		checkState = {
			shopId:false,
			checkcode:false
		},
		main = {
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
			//账号输入校验
			$("#shopId").myvalidate({
				filter_type: "positiveNumber", 
				enterCallback: function (obj){


				}, valCallback: function (val){
					
				}
			});
			$("#shopId").bind({
				"keyup":function(){
					if($(this).val().length < 7){
						checkState.shopId = false;
						
					}else{
						checkState.shopId = true;
						
					}
					
					if(checkState.shopId && checkState.checkcode){
						$("#nextBtn").addClass("btn-sure-on");
					}else{
						$("#nextBtn").removeClass("btn-sure-on");
					}
				},
				"blur":function(){
					if($(this).val().length < 7){
						checkState.shopId = false;
						$("#shopIdErr").text("请输入正确的商户号");
					}else{
						checkState.shopId = true;
						$("#shopIdErr").text(" ");
					}
					
					if(checkState.shopId && checkState.checkcode){
						$("#nextBtn").addClass("btn-sure-on");
					}else{
						$("#nextBtn").removeClass("btn-sure-on");
					}
				},
				"focus":function(){
					$("#shopIdErr").text(" ");
				}
			});
			//验证码输入
			$("#jsjk-checkcode").bind({
				"keyup":function(){
					if($(this).val().length < 4){
						checkState.checkcode = false;
						
					}else{
						checkState.checkcode = true;
						
					}
					
					if(checkState.shopId && checkState.checkcode){
						$("#nextBtn").addClass("btn-sure-on");
					}else{
						$("#nextBtn").removeClass("btn-sure-on");
					}
				},
				"blur":function(){
					if($(this).val().length < 4){
						checkState.checkcode = false;
						$("#shopIdErr").text("请输入正确的验证码");
					}else{
						checkState.checkcode = true;
						$("#shopIdErr").text(" ");
					}
					
					if(checkState.shopId && checkState.checkcode){
						$("#nextBtn").addClass("btn-sure-on");
					}else{
						$("#nextBtn").removeClass("btn-sure-on");
					}
				},
				"focus":function(){
					$("#shopIdErr").text(" ");
				}
			});
			//下一步按钮
			$("#nextBtn").bind("click",function(){
				if($(this).hasClass("btn-sure-on")){
					main.postData();
					//window.location.href = "forget_select_way.html?shopId="+$("#shopId").val();
				}
				
			});
			//返回按钮
			$("#backBtn").bind("click",function(){
				window.location.href = "../home/login.html";
			});
			
		},
		//生成验证码
		createCode:function(){
			checkCodeImg.attr("src", shopIp + "jst-finance-merchantFront/rest/merchantFrontCode/getCode?timeStamp="+ new Date().getTime());
		},
		//发送请求
		postData:function(){
			httpModule.ajaxRequest({
				name:"发送请求",
				type:"POST",
				async:true,
				url:shopIp + "jst-finance-merchantFront/rest/merchantController/getPhoneNoAndEmail",
				data:{
					checkCode:$("#jsjk-checkcode").val(),//验证码
					merchantId:$("#shopId").val()//商户号
				},
				success:function(data){
					console.log(data)
					if(data.resType == "00"){
						sessionStorage.userInfo = JSON.stringify(data);
						window.location.href = "forget_select_way.html";
					}else{
						$("#shopIdErr").text(data.msgContent);
						main.createCode();
					}
				}
			})
		}

	};
	main.init();
	
});