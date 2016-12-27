jQuery(function($) {
	var initInputClass = $(".jsjk-initval");

	var main = {
		// 初始化执行
		init: function() {
			var self = this;
			sessionModule.isLogin(sessionStorage.userId); // 判断用户是否处于登陆状态
			self.getInfo();
			self.bindEvent();
		},
		// 查询商户基本信息
		getInfo: function() {
			var self = this;
			httpModule.ajaxRequest({
				name: "基本信息查询", // 接口名称
				type: "GET",
				url: hostIp + "/jst-finance-merchant/rest/merchant/single",
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
			initInputClass.attr("placeholder", "");
			$("#jsjk-companyname").val(res.base.companyName); // 企业名称
			$("#jsjk-companyshortName").val(res.base.companyShortName); // 企业简称
			$("#jsjk-companytype").val(res.base.companyType); // 企业类型
			$("#jsjk-busLicenceno").val(res.base.busLicenceNo); // 营业执照号
			$("#jsjk-busLicenceaddr").val(res.base.busLicenceAddr); // 营业执照所在地
			$("#jsjk-busLicencedate").val(res.base.busLicenceStartDate + " ~ " + res.base.busPersonEndDate); // 营业执照有效期
			$("#jsjk-agencycode").val(res.base.agencyCode); // 组织机构代码
			$("#jsjk-businessrange").val(res.base.businessRange); // 营业范围
			$("#jsjk-contactname").val(res.base.contactName); // 联系人姓名
			$("#jsjk-contacttel").val(res.base.contactTel); //  联系人手机
			$("#jsjk-contactemail").val(res.base.contactEmail); //  联系人邮箱
			$("#jsjk-corporatename").val(res.base.corporateName); // 法人姓名
			$("#jsjk-corporatecardno").val(res.base.corporateCardNo); // 法人身份证号码
			$("#jsjk-corporatedate").val(res.base.corporateStartDate + " ~ " + res.base.corporateEndDate); // 法人证件有效期
			$("#jsjk-buspersonname").val(res.base.busPersonName); // 商务人员姓名
			$("#jsjk-buspersoncode").val(res.base.busPersonCode); // 商务人员身份证号码
			$("#jsjk-buspersondate").val(res.base.busPersonStartDate + " ~ " + res.base.busPersonEndDate); // 商务人员证件有效期
			self.showBank(res.bankList); // 开户银行信息
			self.showSettle(res.settlementList); // 结算人信息
			self.showImg("#jsjk-companylogo", res.imageList, 1); // 企业LOGO
			self.showImg("#jsjk-companylicence", res.imageList, 2); // 营业执照
			self.showImg("#jsjk-corporateident", res.imageList, 3); // 法人证件图片
			self.showImg("#jsjk-buspersonident", res.imageList, 4); // 商务人员证件图片
		},
		// 事件绑定
		bindEvent: function() {

		},
		// 显示图片
		showImg: function(ele, data, type) {
			var self = this;
			var imghtml = "";
			var imgtemp = ""
			$.each(data, function(key, val) {
				if(val.type == type) {
					imgtemp = "colorbox-" + type;
					imghtml += "<li><a href='" + val.imageMax + "' data-rel='"+imgtemp+"'><img src='" + val.imageMin + "' /><div class='text'><div class='inner'>点击放大</div></div></a></li>";
					return false;
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
			$.each(data, function(key, val) {
				settleType += "<option value='" + val.settlementType + "'>" + val.settlementType + "</option>";
				settlecycle += "<option value='" + val.cycle + "'>" + val.cycle + "</option>";
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