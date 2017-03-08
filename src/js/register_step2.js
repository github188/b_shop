jQuery(function($){
	var inputMailEle = $("#inputMail"),
		inputPhoneEle = $("#inputPhone"),
		inputCodeEle = $("#inputCode"),
		inputPwdEle1 = $("#inputPwd1"),
		inputPwdEle2 = $("#inputPwd2"),
		inputPayPwdEle1 = $("#inputPayPwd1"),
		inputPayPwdEle2 = $("#inputPayPwd2"),
		stepBtnEle1 = $("#stepBtn1"),
		codeBtnEle = $("#codeBtn"),
		regMail = /([\w\-]+\@[\w\-]+\.[\w\-]+)/,//邮箱正则表达式
		regPhone = /^1[3|4|5|7|8][0-9]{9}$/,//手机正则
		regNumber = /^[0-9]*$/,//数字正则
		regLetter = /^[A-Za-z]+$/,//字母正则
		loginPwd = "",//记录登录密码
		payPwd = "",//记录支付密码
		codeKey = "",//记录验证码密钥
		stepState1 = {
			inputMail:false,
			inputPhone:false,
			inputCode:false,
			loginPwd:false,
			payPwd:false
		},
		inputCompanyNameEle = $("#inputCompanyName"),
		inputCompanyShortNameEle = $("#inputCompanyShortName"),
		inputCompanyTypeEle = $("#inputCompanyType"),
		inputCompanyLogoEle = $("#inputCompanyLogo"),
		businessLicenceEle = $("#businessLicence"),
		businessLicenceAdrrEle = $("#businessLicenceAdrr"),
		licenceDateStartEle = $("#licenceDateStart"),
		licenceDateEndEle = $("#licenceDateEnd"),
		licenceDateBtnEle = $("#licenceDateBtn"),
		licenceImgEle = $("#licenceImg"),
		organizationCodeEle = $("#organizationCode"),
		scopeOfBusinessEle = $("#scopeOfBusiness"),
		bankCardNoEle = $("#bankCardNo"),
		bankNameEle = $("#bankName"),
		subbranchNameEle = $("#subbranchName"),
		bankAdrrEle = $("#bankAdrr"),
		userName = $("#userName"),
		contactsNameEle = $("#contactsName"),
		contactsPhoneEle = $("#contactsPhone"),
		contactsMailEle = $("#contactsMail"),
		legalNameEle = $("#legalName"),
		legalIdCodeEle = $("#legalIdCode"),
		legalIdDateStartEle = $("#legalIdDateStart"),
		legalIdDateEndEle = $("#legalIdDateEnd"),
		legalIdDateBtnEle = $("#legalIdDateBtn"),
		legalIdImgEle = $("#legalIdImg"),
		commerceNameEle = $("#commerceName"),
		commerceIdCodeELe = $("#commerceIdCode"),
		commerceIdDateStartEle = $("#commerceIdDateStart"),
		commerceIdDateEndEle = $("#commerceIdDateEnd"),
		commerceIdDateBtnEle = $("#commerceIdDateBtn"),
		commerceImgEle = $("#commerceImg"),
		main = {
			init:function(){
				var self = this;
				
				self.bindEvent();
			},
			bindEvent:function(){
				var self = this;
				
				/******步骤1开始*****/
				//邮箱输入
				inputMailEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						if(regMail.test($(this).val())){
							stepState1.inputMail = true;
						}else{
							if($(this).val().length > 0){
								$(this).parents(".form-group").find(".help-block").text("邮箱格式不对！");
							}else{
								$(this).parents(".form-group").find(".help-block").text("邮箱不能为空！");
							}
							stepState1.inputMail = false;
						}
					},
					"focus":function(){
						$(this).parents(".form-group").find(".help-block").text("");
					}
				});
				//手机号输入
				inputPhoneEle.bind({
					"keyup":function(){
						var realvalue = this.value.replace(/\D/g, "");
						if(realvalue.length >= 11){
							realvalue = realvalue.substring(0,11);
							if(regPhone.test(realvalue)){
								stepState1.inputPhone = true;
							}else{
								$(this).parents(".form-group").find(".help-block").text("请输入正确的手机号！");
								stepState1.inputPhone = false;
							}
						}else{
							$(this).parents(".form-group").find(".help-block").text("");
							stepState1.inputPhone = false;
						}
						$(this).val(realvalue);
					},
					"blur":function(){
						if($(this).val().length > 0){
							if(regPhone.test($(this).val())){
								stepState1.inputPhone = true;
							}else{
								$(this).parents(".form-group").find(".help-block").text("请输入正确的手机号！");
								stepState1.inputPhone = false;
							}
						}else{
							$(this).parents(".form-group").find(".help-block").text("手机号不能为空！");
							stepState1.inputPhone = false;
						}
					},
					"focus":function(){
						$(this).parents(".form-group").find(".help-block").text("");
					}
				});
				//验证码输入
				inputCodeEle.bind({
					"keyup":function(){
						var codeValue = this.value.replace(/\D/g, "");
						if(codeValue.length >= 6){
							codeValue = codeValue.substring(0,6);
							stepState1.inputCode = true;
						}
						$(this).val(codeValue);
					},
					"blur":function(){
						if($(this).val().length <= 0){
							$(this).parents(".form-group").find(".help-block").text("验证码不能为空！");
							stepState1.inputCode = false;
						}else if($(this).val().length < 6 && $(this).val().length > 0){
							$(this).parents(".form-group").find(".help-block").text("验证码长度不正确！");
							stepState1.inputCode = false;
						}else{
							$(this).parents(".form-group").find(".help-block").text("");
						}
					},
					"focus":function(){
						$(this).parents(".form-group").find(".help-block").text("");
					}
				});
				//登录密码第一次输入
				inputPwdEle1.bind({
					"keyup":function(){
						if($(this).val().length > 20){
							$(this).val($(this).val().substring(0,20))
						}
						
						if(inputPwdEle2.val().length >= 6 && inputPwdEle2.val().length <= 20){//确认密码有输入且合法
							if(inputPwdEle2.val().length == $(this).val().length){
								if($(this).val() == inputPwdEle2.val()){
									loginPwd = $(this).val();
									stepState1.loginPwd = true;
									$(this).parents(".form-group").find(".help-block").text("");
									inputPwdEle2.parents(".form-group").find(".help-block").text("");
								}else{
									$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
									$("#loginPwdTips").addClass("hide");
									stepState1.loginPwd = false;
								}
							}else if(inputPwdEle2.val().length > $(this).val().length){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.loginPwd = false;
							}else{
								$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
								$("#loginPwdTips").addClass("hide");
								stepState1.loginPwd = false;
							}
							
							
						}else{
							
						}
						
						
						
					},
					"blur":function(){
						$("#loginPwdTips").addClass("hide");
						
						if($(this).val().length >= 6 && $(this).val().length <= 20){
							if(regNumber.test($(this).val())){
								$(this).parents(".form-group").find(".help-block").text("密码不能全为数字！");
								stepState1.loginPwd = false;
							}else if(regLetter.test($(this).val())){
								$(this).parents(".form-group").find(".help-block").text("密码不能全为字母！");
								stepState1.loginPwd = false;
							}else{
								$(this).parents(".form-group").find(".help-block").text("");
							}
							
							if(inputPwdEle2.val().length == $(this).val().length){
								if($(this).val() == inputPwdEle2.val()){
									$(this).parents(".form-group").find(".help-block").text("");
									stepState1.loginPwd = true;
								}else{
									$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
									stepState1.loginPwd = false;
								}
							}else if(inputPwdEle2.val().length > $(this).val().length){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.loginPwd = false;
							}else if(inputPwdEle2.val().length <= 0){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.loginPwd = false;
							}else{
								$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
								stepState1.loginPwd = false;
							}
							
							
						}else{
							$(this).parents(".form-group").find(".help-block").text("密码长度不正确！");
							stepState1.loginPwd = false;
						}
						
					},
					"focus":function(){
						$("#loginPwdTips").removeClass("hide");
						$(this).parents(".form-group").find(".help-block").text("");
					}
				});
				//登录密码第二次输入
				inputPwdEle2.bind({
					"keyup":function(){
						if($(this).val().length > 20){
							$(this).val($(this).val().substring(0,20))
						}
						
						if(inputPwdEle1.val().length >= 6 && inputPwdEle1.val().length <= 20){//第一次密码有输入且合法
							
							if(inputPwdEle1.val().length == $(this).val().length){
								if($(this).val() == inputPwdEle1.val()){
									
									loginPwd = $(this).val();
									stepState1.loginPwd = true;
									$(this).parents(".form-group").find(".help-block").text("");
									inputPwdEle1.parents(".form-group").find(".help-block").text("");
								}else{
									$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
									stepState1.loginPwd = false;
								}
							}else if(inputPwdEle1.val().length > $(this).val().length){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.loginPwd = false;
							}else if(inputPwdEle1.val().length <= 0){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.loginPwd = false;
							}else{
								$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
								stepState1.loginPwd = false;
							}
							
						}else{
							
						}
						
						
					},
					"blur":function(){
						
						if($(this).val().length >= 6 && $(this).val().length <= 20){
							if(regNumber.test($(this).val())){
								$(this).parents(".form-group").find(".help-block").text("密码不能全为数字！");
								stepState1.loginPwd = false;
							}else if(regLetter.test($(this).val())){
								$(this).parents(".form-group").find(".help-block").text("密码不能全为字母！");
								stepState1.loginPwd = false;
							}else{
								$(this).parents(".form-group").find(".help-block").text("");
							}
							
							
							if($(this).val() == inputPwdEle1.val()){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.loginPwd = true;
							}else if(inputPwdEle1.val().length <= 0){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.loginPwd = false;
							}else{
								$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
								stepState1.loginPwd = false;
							}
	
						}else{
							$(this).parents(".form-group").find(".help-block").text("密码长度不正确！");
							stepState1.loginPwd = false;
						}
						
						
					},
					"focus":function(){
						$(this).parents(".form-group").find(".help-block").text("");
					}
				});
				//支付密码第一次输入
				inputPayPwdEle1.bind({
					"keyup":function(){
						var payValue = this.value.replace(/\D/g, "");
						if(payValue.length >= 6){
							payValue = payValue.substring(0,6);
						}
						$(this).val(payValue);
						
						if(inputPayPwdEle2.val().length == 6){
							if($(this).val() == inputPayPwdEle2.val()){
								payPwd = $(this).val();
								stepState1.payPwd = true;
								$(this).parents(".form-group").find(".help-block").text("");
								inputPayPwdEle2.parents(".form-group").find(".help-block").text("");
							}else if(inputPayPwdEle2.val().length > $(this).val().length){
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.payPwd = false;
							}else{
								$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
								$("#payPwdTips").addClass("hide");
								stepState1.payPwd = false;
							}
						}else if(inputPayPwdEle2.val().length <= 0){
							$(this).parents(".form-group").find(".help-block").text("");
							stepState1.payPwd = false;
						}
						
					},
					"blur":function(){
						$("#payPwdTips").addClass("hide");
						
						if($(this).val().length < 6 && $(this).val().length > 0){
							$(this).parents(".form-group").find(".help-block").text("密码长度不正确！");
							stepState1.payPwd = false;
						}else if($(this).val().length <= 0){
							$(this).parents(".form-group").find(".help-block").text("密码不能为空！");
							stepState1.payPwd = false;
						}else{
							$(this).parents(".form-group").find(".help-block").text("");
						}
						
					},
					"focus":function(){
						$("#payPwdTips").removeClass("hide");
						$(this).parents(".form-group").find(".help-block").text("");
					}
				});
				//支付密码第二次输入
				inputPayPwdEle2.bind({
					"keyup":function(){
						var payValue = this.value.replace(/\D/g, "");
						if(payValue.length >= 6){
							payValue = payValue.substring(0,6);
						}
						$(this).val(payValue);
						
						if(inputPayPwdEle1.val().length == 6){
							if($(this).val().length == inputPayPwdEle1.val().length){
								if($(this).val() == inputPayPwdEle1.val()){
									
									payPwd = $(this).val();
									stepState1.payPwd = true;
									$(this).parents(".form-group").find(".help-block").text("");
									inputPayPwdEle1.parents(".form-group").find(".help-block").text("");
								}else{
									$(this).parents(".form-group").find(".help-block").text("两次密码输入不一致！");
									stepState1.payPwd = false;
								}
							}else{
								$(this).parents(".form-group").find(".help-block").text("");
								stepState1.payPwd = false;
							}
						}else if(inputPayPwdEle1.val().length <= 0){
							$(this).parents(".form-group").find(".help-block").text("");
							stepState1.payPwd = false;
						}else if(inputPayPwdEle1.val().length == $(this).val().length){
							$(this).parents(".form-group").find(".help-block").text("密码长度不正确！");
							stepState1.payPwd = false;
						}else{
							$(this).parents(".form-group").find(".help-block").text("");
							stepState1.payPwd = false;
						}
						
					},
					"blur":function(){
						if($(this).val().length < 6 && $(this).val().length > 0){
							$(this).parents(".form-group").find(".help-block").text("密码长度不正确！");
							stepState1.payPwd = false;
						}else if($(this).val().length <= 0){
							$(this).parents(".form-group").find(".help-block").text("密码不能为空！");
							stepState1.payPwd = false;
						}else{
							$(this).parents(".form-group").find(".help-block").text("");
						}
					},
					"focus":function(){
						$(this).parents(".form-group").find(".help-block").text("");
					}
				});
				//发送验证码
				codeBtnEle.bind("click",function(){
					if(stepState1.inputPhone){
						if($(this).hasClass("ajOn")){
							main.sendCode("inputPhone","codeBtn");
						}
						$(this).removeClass("ajOn");
					}
					
					
				});
				//步骤1下一步按钮
				stepBtnEle1.bind("click",function(){
					console.log(stepState1.inputMail && stepState1.inputMail && stepState1.inputCode && stepState1.loginPwd && stepState1.payPwd)
					if(stepState1.inputMail && stepState1.inputMail && stepState1.inputCode && stepState1.loginPwd && stepState1.payPwd){
						self.checkCode();
					}
				});
				/******步骤1结束*****/
				
				/******步骤2开始*****/
				
				//企业名称输入校验
				inputCompanyNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						var helpBlockTxt = $(this).parents(".form-group").find(".help-block").text();
						if($(this).val().length <= 0){
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt + " 企业名称不能为空！");
						}else{
							$(this).parents(".form-group").addClass("has-success");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt);
						}
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-error");
						$(this).parents(".form-group").removeClass("has-success");
						$(this).parents(".form-group").find(".help-block").text("（必填）");
					}
				});			
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						$(this).parents(".form-group").addClass("has-success");
						$(this).parents(".form-group").removeClass("has-error");
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-success");
						$(this).parents(".form-group").removeClass("has-error");
					}
				});
				//企业类型
				inputCompanyTypeEle.bind("click",function(){
					if($(this).val() == ""){
						$(this).parents(".form-group").addClass("has-error");
						$(this).parents(".form-group").removeClass("has-success");
					}else{
						$(this).parents(".form-group").addClass("has-success");
						$(this).parents(".form-group").removeClass("has-error");
					}
			
				});
				//企业Logo
				inputCompanyLogoEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						$(this).parents(".form-group").addClass("has-success");
						$(this).parents(".form-group").removeClass("has-error");
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-success");
						$(this).parents(".form-group").removeClass("has-error");
					}
				});
				//营业执照号
				businessLicenceEle.bind({
					"keyup":function(){
						var realvalue = this.value.replace(/\D/g, "");
						if(realvalue.length >= 15){
							realvalue = realvalue.substring(0,15);
						}
						$(this).val(realvalue);
					},
					"blur":function(){
						var helpBlockTxt = $(this).parents(".form-group").find(".help-block").text();
						console.log(stringModule.checkLicenceCode($(this).val()))
						if(stringModule.checkLicenceCode($(this).val()).res){//true正确，false不正确
							$(this).parents(".form-group").addClass("has-success");
							$(this).parents(".form-group").removeClass("has-error");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt);
						}else{
							$(this).parents(".form-group").removeClass("has-success");
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt + stringModule.checkLicenceCode($(this).val()).msg);
						}
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-success");
						$(this).parents(".form-group").removeClass("has-error");
						$(this).parents(".form-group").find(".help-block").text("（必填）");
					}
				});
				//营业执照所在地
				businessLicenceAdrrEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						var helpBlockTxt = $(this).parents(".form-group").find(".help-block").text();
						if($(this).val().length <= 0){
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt + " 营业执照所在地不能为空！");
						}else{
							$(this).parents(".form-group").addClass("has-success");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt);
						}
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-error");
						$(this).parents(".form-group").removeClass("has-success");
						$(this).parents(".form-group").find(".help-block").text("（必填）");
					}
				});
				//营业执照有效期
				licenceDateStartEle.bind({
					
				});
				//营业执照图片
				licenceImgEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						if($(this).val() == ""){
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").removeClass("has-success");						
						}else{
							$(this).parents(".form-group").removeClass("has-error");
							$(this).parents(".form-group").addClass("has-success");
						}
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-error");
						$(this).parents(".form-group").removeClass("has-success");
					}
				});
				//组织机构代码
				organizationCodeEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						var helpBlockTxt = $(this).parents(".form-group").find(".help-block").text();
						console.log(stringModule.checkOrgCode($(this).val()))
						if(stringModule.checkOrgCode($(this).val()).res){//true正确，false不正确
							$(this).parents(".form-group").addClass("has-success");
							$(this).parents(".form-group").removeClass("has-error");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt);
						}else{
							$(this).parents(".form-group").removeClass("has-success");
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").find(".help-block").text(helpBlockTxt + stringModule.checkOrgCode($(this).val()).msg);
						}
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-success");
						$(this).parents(".form-group").removeClass("has-error");
						$(this).parents(".form-group").find(".help-block").text("（必填）");
					}
					
				});
				//经营范围
				scopeOfBusinessEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						$(this).parents(".form-group").addClass("has-success");
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-success");
					}
				});
				//开户银行卡号
				bankCardNoEle.bind({
					"input":function(){
						var realvalue = this.value.replace(/\D/g, "");
						$(this).val(realvalue);
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						if($(this).val() == ""){
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").removeClass("has-success");						
						}else{
							$(this).parents(".form-group").removeClass("has-error");
							$(this).parents(".form-group").addClass("has-success");
						}
					},
					"focus":function(){
						$(this).parents(".form-group").removeClass("has-error");
						$(this).parents(".form-group").removeClass("has-success");
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				//企业简称
				inputCompanyShortNameEle.bind({
					"keyup":function(){
						
					},
					"blur":function(){
						
					},
					"focus":function(){
						
					}
				});
				
				
				$('.input-daterange').datepicker({
					autoclose:true,
					todayHighlight: true
				}).on("hide","input",function(){				
					if($(this).index() == 0){
						if($(this).val() == "" || $(this).next().next().val() == ""){
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").removeClass("has-success");
						}else{
							$(this).parents(".form-group").removeClass("has-error");
							$(this).parents(".form-group").addClass("has-success");
						}
					}else{
						if($(this).val() == "" || $(this).prev().prev().val() == ""){
							$(this).parents(".form-group").addClass("has-error");
							$(this).parents(".form-group").removeClass("has-success");
						}else{
							$(this).parents(".form-group").removeClass("has-error");
							$(this).parents(".form-group").addClass("has-success");
						}
					}
				});
				
				$('.upload').ace_file_input({
					style:'well',
					btn_choose:'请选择您要上传的图片',
					btn_change:null,
					no_icon:'ace-icon fa fa-cloud-upload',
					droppable:true,
					thumbnail:'small',//large | fit
					icon_remove:null,
					preview_error : function(filename, error_code) {
						//name of the file that failed
						//error_code values
						//1 = 'FILE_LOAD_FAILED',
						//2 = 'IMAGE_LOAD_FAILED',
						//3 = 'THUMBNAIL_FAILED'
						//alert(error_code);
					},
					
				}).on('change', function(){
//					console.log($(this).data('ace_input_files'));
//					console.log($(this).data('ace_input_method'));
				});
				
				
			},
			//验证码
			sendCode:function(obj,btnObj){
				var objEle = $("#"+ obj)
				var btnObjEle = $("#"+ btnObj);
				$.ajax({
					type:"POST",
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/getMsgVerifyCode",
					async:true,
					data:{
						company_tel:objEle.val().replace(/\s+/g, "")
					},
					success:function(data){
						console.log(data)
						if(data.resType == "00"){
							codeKey = data.rfkey;
							timeDown(btnObj);
							
						}else{
							alert(data.msgContent);
							btnObjEle.addClass("ajOn");
						}
					}
				});
				
				function timeDown(btnObj){
					var btnObjEle = $("#"+ btnObj);
					var count = 60;
					var clearId = setInterval(function(){
						btnObjEle.text(count + "s");
						count --;
						if(count == -1){
							btnObjEle.text("发送验证码");
							count = 60;
							btnObjEle.addClass("ajOn");
							clearInterval(clearId);
						}
					},1000);
				}	
			},
			//校验验证码
			checkCode:function(){
				httpModule.ajaxRequest({
					name:"提交第一步信息",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/matchMsgVerifyCode",
					data:{
						rfkey:codeKey,
						msgCode:inputCodeEle.val()
					},
					success:function(data){
						if(data.resType == "00"){
							main.postStepMes1();
						}else{
							alert(data.msgContent);
						}
					}
				})
			},
			//提交第一步信息
			postStepMes1:function(){
				httpModule.ajaxRequest({
					name:"提交第一步信息",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/merchantApplyFirstStep",
					data:{
						companyEmail:inputMailEle.val(),//注册邮箱
						companyTel:inputPhoneEle.val(),//注册电话
						regChannel:"",//注册渠道
						passWord:exports.encryptPwd(loginPwd),//登录密码
						payPassWord:exports.encryptPwd(JSON.stringify(payPwd))//支付密码
					},
					success:function(data){
						console.log(data);
					}
				})
			},			
			//校验银行卡类型
			checkBankType:function(){
				httpModule.ajaxRequest({
					name:"查银行编码",
					type:"POST",
					async:true,
					url:shopIp + "jst-finance-merchantFront/rest/merchantController/getBankCodeByBankName",
					data:{
						bankName:bankNameEle.val();	
					},
					success:function(data){
						
					}
				})
			}
				
		
		};
	
	main.init()
	
	
	
})