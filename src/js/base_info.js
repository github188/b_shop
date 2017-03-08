jQuery(function($) {
	var initInputClass = $(".jsjk-initval");
	var shopMenuEle = $("#shop-menulist");
	var menuConClass = $(".menu-content");
    var onLine = sessionModule.isLogin(sessionStorage.userId);
    
	var main = {
		// 初始化执行
		init: function() {
			var self = this;
			if(stringModule.CheckEmpty(onLine)){  // 判断用户是否处于登陆状态
				return false;
			}
			self.getInfo();
			self.bindEvent();
		},
		// 查询商户基本信息
		getInfo: function() {
			var self = this;
			httpModule.ajaxRequest({
				name: "基本信息查询", // 接口名称
				type: "GET",
				url: shopIp + "jst-finance-merchantFront/rest/merchantFront/single",
				data: {
					id: sessionStorage.userId // 1622224696800223232
				},
				success: function(data) {
					if(data.resType == "00") {
						console.log(data);
						self.showInfo(data);
					} else {
						alert(data.msgContent);
					}
				},
			});
		},
		// 显示商户基本信息
		showInfo: function(res) {
			var self = this;
			//initInputClass.attr("placeholder", "");
			$("#jsjk-companyname").html(res.base.companyName); // 企业名称
			$("#jsjk-companyshortName").html(res.base.companyShortName); // 企业简称
			$("#jsjk-companytype").html(res.base.companyType); // 企业类型
			$("#jsjk-busLicenceno").html(res.base.busLicenceNo); // 营业执照号
			$("#jsjk-busLicenceaddr").html(res.base.busLicenceAddr); // 营业执照所在地
			$("#jsjk-busLicencedate").html(res.base.busLicenceStartDate + " ~ " + res.base.busPersonEndDate); // 营业执照有效期
			$("#jsjk-agencycode").html(res.base.agencyCode); // 组织机构代码
			$("#jsjk-businessrange").html(res.base.businessRange); // 营业范围
			$("#jsjk-contactname").html(res.base.contactName); // 联系人姓名
			$("#jsjk-contacttel").html(res.base.contactTel); //  联系人手机
			$("#jsjk-contactemail").html(res.base.contactEmail); //  联系人邮箱
			$("#jsjk-corporatename").html(res.base.corporateName); // 法人姓名
			$("#jsjk-corporatecardno").html(res.base.corporateCardNo); // 法人身份证号码
			$("#jsjk-corporatedate").html(res.base.corporateStartDate + " ~ " + res.base.corporateEndDate); // 法人证件有效期
			$("#jsjk-buspersonname").html(res.base.busPersonName); // 商务人员姓名
			$("#jsjk-buspersoncode").html(res.base.busPersonCode); // 商务人员身份证号码
			$("#jsjk-buspersondate").html(res.base.busPersonStartDate + " ~ " + res.base.busPersonEndDate); // 商务人员证件有效期
			$("#jsjk-bankcardno").html(res.bankList[0].bankCardNo); // 开户银行号
			$("#jsjk-bankname").html(res.bankList[0].bankName); // 开户银行
			$("#jsjk-openbranbank").html(res.bankList[0].openBranbank); // 开户支行
			$("#jsjk-bankcity").html(res.bankList[0].openProvince + " - " + res.bankList[0].openCity); // 开户银行所在地
			$("#jsjk-openname").html(res.bankList[0].openName); // 开户人姓名
			if(res.settlementList[0].settlementType == "1"){
				$("#jsjk-settletype").html("结算到银行卡"); // 结算方式
			}
			if(res.settlementList[0].settlementType == "2"){
				$("#jsjk-settletype").html("结算到余额"); // 结算方式
			}
			if(res.settlementList[0].feeInOut == "01"){
				$("#jsjk-feeinout").html("交易内收费"); // 结算类型
			}
			if(res.settlementList[0].feeInOut == "02"){
				$("#jsjk-feeinout").html("交易外收费"); // 结算类型
			}
			$("#jsjk-settlecycle").html("T+"+res.settlementList[0].cycle); // 结算周期
			$("#jsjk-settlerate").html(res.settlementList[0].rate  + " ‰"); // 结算费率
			if(res.merchantSettlementConfList.length > 0) {
				$("#jsjk-feemerchantname").html(res.merchantSettlementConfList[0].feeMerchantName); // 分润方商户名称
				$("#jsjk-feemerchantid").html(res.merchantSettlementConfList[0].feeMerchantId); // 分润方商户号
				$("#jsjk-feerate").html(res.merchantSettlementConfList[0].feeRate + " ‰"); // 分润方比率
			}
			$("#jsjk-settlename").html(res.settlementList[0].contactName); // 联系人姓名
			$("#jsjk-settletel").html(res.settlementList[0].contactTel); // 联系人姓名
			$("#jsjk-settleemail").html(res.settlementList[0].contactEmail); // 联系人姓名
			//self.showBank(res.bankList); // 开户银行信息
			//self.showSettle(res.settlementList); // 结算人信息
			$.each(res.imageList,function(key, val){
				if(val.type == 1){
					$("#jsjk-comlogo").html("<img src='" + val.imageMin + "' />");
					return false;
				}
			});
			//self.showImg("#jsjk-companylogo", res.imageList, 1, "企业LOGO图片"); // 企业LOGO
			self.showImg("#jsjk-companylicence", res.imageList, 2, "营业执照图片"); // 营业执照
			self.showImg("#jsjk-corporateident", res.imageList, 3, "证件照片"); // 法人证件图片
			self.showImg("#jsjk-buspersonident", res.imageList, 4, "证件照片"); // 商务人员证件图片
		},
		// 事件绑定
		bindEvent: function() {
           shopMenuEle.find("li").bind("click",function(){
           	var theMenu = $(this).index();
	           	$(this).siblings("li").removeClass("menu-nav-pick");
	           	$(this).addClass("menu-nav-pick");
	           	menuConClass.eq(theMenu).removeClass("none");
	           	menuConClass.eq(theMenu).siblings(".menu-content").addClass("none");
           });
		},
		// 显示图片
		showImg: function(ele, data, type, tit) {
			var self = this;
			var imghtml = "";
			var imgtemp = ""
			$.each(data, function(key, val) {
				if(val.type == type && key <= 10) {
					imgtemp = "colorbox-" + type;
					imghtml += "<li><a href='" + val.imageMax + "' data-rel='"+imgtemp+"'><img src='" + val.imageMin + "' /><div class='text'><div class='inner'>点击放大</div></div></a><p>"+tit+"</p></li>";
					//return false;
				}
			});
			$(ele).html(imghtml);
			self.colorboxInit(imgtemp);
		},
		// 显示银行列表集合
		showBank: function(data) {
			var self = this;
			var bankCode = "";
			var bankName = "";
			var bankAddr = "";
			var bankCity = "";
			var bankHoster = "";
			$.each(data, function(key, val) {
				bankCode += "<option value='" + val.bankCardNo + "'>" + val.bankCardNo + "</option>";
				bankName += "<option value='" + val.bankName + "'>" + val.bankName + "</option>";
				bankAddr += "<option value='" + val.openBranbank + "'>" + val.openBranbank + "</option>";
				bankCity += "<option value='" + val.openProvince + " - " + val.openCity + "'>" + val.openProvince + " - " + val.openCity + "</option>";
				bankHoster += "<option value='" + val.openName + "'>" + val.openName + "</option>";
			});
			$("#jsjk-bankcardno").html(bankCode);
			$("#jsjk-bankname").html(bankName);
			$("#jsjk-openbranbank").html(bankAddr);
			$("#jsjk-bankcity").html(bankCity);
			$("#jsjk-openname").html(bankHoster);
			self.keepSelect(".jsjk-bankselect");
		},
		// 显示结算人集合
		showSettle: function(data) {
			var self = this;
			var settleType = "";
			var settlecycle = "";
			var settlerate = "";
			var settlename = "";
			var settletel = "";
			var settleemail = "";
			var type = "";
			$.each(data, function(key, val) {
				if(val.settlementType == "1"){
					type = "结算到银行卡";
				}else{
					type = "结算到余额户";
				}
				settleType += "<option value='" + val.settlementType + "'>" + type + "</option>";
				settlecycle += "<option value='" + val.cycle + "'>T+" + val.cycle + "</option>";
				settlerate += "<option value='" + val.rate + "'>" + val.rate + "</option>";
				settlename += "<option value='" + val.contactName + "'>" + val.contactName + "</option>";
				settletel += "<option value='" + val.contactTel + "'>" + val.contactTel + "</option>";
				settleemail += "<option value='" + val.contactEmail + "'>" + val.contactEmail + "</option>";
			});
			$("#jsjk-settletype").html(settleType);
			$("#jsjk-settlecycle").html(settlecycle);
			$("#jsjk-settlerate").html(settlerate);
			$("#jsjk-settlename").html(settlename);
			$("#jsjk-settletel").html(settletel);
			$("#jsjk-settleemail").html(settleemail);
            self.keepSelect(".jsjk-settleselect");
		},
		// 同步select中的同类信息
		keepSelect: function(eclass) {
			$(eclass).change(function() {
				var selectCur = $(this).prop("selectedIndex");
				for(var t = 0; t < $(eclass).length; t++) {
					$(eclass).eq(t).find("option").eq(selectCur).prop("selected", "selected");
				}
			});
		},
		// 图片浏览初始化
		colorboxInit: function(templet) {
			var $overflow = '';
			var colorbox_params = {
				rel: templet,
				reposition: true,
				scalePhotos: true,
				scrolling: false,
				previous: '<i class="ace-icon fa fa-arrow-left"></i>',
				next: '<i class="ace-icon fa fa-arrow-right"></i>',
				close: '&times;',
				current: '{current} of {total}',
				maxWidth: '100%',
				maxHeight: '100%',
				onOpen: function() {
					$overflow = document.body.style.overflow;
					document.body.style.overflow = 'hidden';
				},
				onClosed: function() {
					document.body.style.overflow = $overflow;
				},
				onComplete: function() {
					$.colorbox.resize();
				}
			};

			$('.ace-thumbnails [data-rel="'+templet+'"]').colorbox(colorbox_params);
			$("#cboxLoadingGraphic").html("<i class='ace-icon fa fa-spinner orange'></i>"); //let's add a custom loading icon
		},
	};
	main.init();
});