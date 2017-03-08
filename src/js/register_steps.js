jQuery(function($) {

	var checkAreaClass = $(".check-area");
	var checkItemClass = $(".check-item");
	var checkSceAClass = $(".check-scene-a");
	var checkSceBClass = $(".check-scene-b");
	//var checkSceCClass = $(".check-scene-c");
	var checkParamClass = $(".check-param");
	var regUploadClass = $(".reg-imgupload");
	var checkDatepickClass = $(".check-datepicker");
	var regLongdateClass = $(".reg-longdate");
	var regEmailEle = $("#reg-shopemail");
	var regMobileEle = $("#reg-shopmobile");
	var regBankcardEle = $("#reg-shopbankcard");
	var regBankNameEle = $("#reg-shopbankname");
	var regBankCodeEle = $("#reg-shopbankcode");
	var firstepClass = $(".check-firstep");
	var secstepClass = $(".check-secstep");
	var thistepClass = $(".check-thistep");
	var thibtnClass = $(".check-thistep-btn");
	var nextBtnEle = $("#reg-nextbtn");
	var checkBtnEle = $("#reg-checkbtn");
	var sureBtnEle = $("#reg-surebtn");
	var intoBtnEle = $("#reg-intobtn");
	var backBtnEle = $("#reg-backbtn");
	var regFeeidEle = $("#reg-feemerchantid");
	var regFeenameEle = $("#reg-feemerchantname");
	var regFeerateEle = $("#reg-feerate");
	var formResult = false;

	var main = {
		// 初始化执行
		init: function() {
			var self = this;
			self.bindEvent();
			self.aceUpload();
			self.aceDatepicker();
		},
		// 事件绑定
		bindEvent: function(data) {
			var self = this;
			// 焦点离开时校验
			checkItemClass.blur(function() {
				if($(this).hasClass("check-allow")) {
					if(stringModule.CheckEmpty($(this).val())) {
						self.validateValue($(this));
					} else {
						self.validateDeal($(this), true, "(非必填)", false);
					}
				} else {
					if($(this).attr("id") == "reg-feemerchantid") {
						self.getFeename($(this).val());
					} else {
						self.validateValue($(this));
					}
				}
			});
			// 先填写分润方商户号
			regFeeidEle.bind("input", function() {
				var theVal = $(this).val();
				if(theVal.length > 0) {
					$(this).removeClass("check-allow");
					$(this).addClass("check-scene-c");
					$(this).attr("data-res", "lock");
					if(!stringModule.CheckEmpty(regFeerateEle.val())) {
						regFeerateEle.removeClass("check-allow");
						regFeerateEle.addClass("check-scene-c");
						regFeerateEle.attr("data-res", "lock");
					}
					if(theVal.length >= 7) {
						self.getFeename(theVal);
					}
				} else {
					$(this).addClass("check-allow");
					$(this).removeClass("check-scene-c");
					$(this).attr("data-res", "pass");
					regFeenameEle.val("");
					self.validateDeal(regFeenameEle, true, "(非必填)", false);
					if(!stringModule.CheckEmpty(regFeerateEle.val())) {
						regFeerateEle.addClass("check-allow");
						regFeerateEle.removeClass("check-scene-c");
						regFeerateEle.attr("data-res", "pass");
						self.validateDeal(regFeerateEle, true, "(非必填)", false);
					}
				}
			});
			// 先写分润比率的情况
			regFeerateEle.bind("input", function() {
				if($(this).val().length > 0 && !stringModule.CheckEmpty(regFeeidEle.val())) {
					regFeeidEle.removeClass("check-allow");
					regFeeidEle.addClass("check-scene-c");
					regFeeidEle.attr("data-res", "lock");
				}
				if($(this).val().length == 0 && !stringModule.CheckEmpty(regFeeidEle.val())) {
					regFeeidEle.addClass("check-allow");
					regFeeidEle.removeClass("check-scene-c");
					regFeeidEle.attr("data-res", "pass");
					self.validateDeal(regFeeidEle, true, "(非必填)", false);
				}
			});
			// 完成注册第一步
			nextBtnEle.click(function() {
				var theResult = self.validateScene(checkSceAClass);
				if(theResult.res) {
					
					httpModule.ajaxRequest({
						name: "注册邮箱校验", // 接口名称
						type: "GET",
						url: httpModule.setHostUrl() + "jst-oms/rest/merchant/checkEmail",
						data: {
							"email": regEmailEle.val()
						},
						success: function(data) {
							if(data.resType == "00") {
								firstepClass.addClass("hidden");
								thistepClass.addClass("hidden");
								thibtnClass.addClass("hidden");
								secstepClass.removeClass("hidden");
							} else {
								alert(data.msgContent);
							}
						},
						complete: function() {
							$.loading.end();
						}
					});
				} else {
					self.validateDeal($("#" + theResult.eid), false, $("#" + theResult.eid).attr("data-info"), true);
				}
			});
			// 确定第二步
			checkBtnEle.click(function() {
				var theResult = self.validateScene(checkSceBClass);
				if(theResult.res) {
					firstepClass.addClass("hidden");
					secstepClass.addClass("hidden");
					thibtnClass.addClass("hidden");
					thistepClass.removeClass("hidden");
				} else {
					self.validateDeal($("#" + theResult.eid), false, $("#" + theResult.eid).attr("data-info"), true);
				}
			});
			// 进入检查状态等待提交
			sureBtnEle.click(function() {
				var theResult = self.validateScene($(".check-scene-c"));
				if(theResult.res) {
					sureBtnEle.addClass("hidden");
					checkParamClass.attr("disabled", "disabled");
					checkAreaClass.removeClass("hidden");
					intoBtnEle.removeClass("hidden");
					backBtnEle.removeClass("hidden");
				} else {
					self.validateDeal($("#" + theResult.eid), false, $("#" + theResult.eid).attr("data-info"), true);
				}
			});
			// 确定无误&提交
			intoBtnEle.click(function() {
				checkParamClass.removeAttr("disabled");
			
				$.ajax({
					url: httpModule.setHostUrl() + "jst-oms/rest/merchant/apply",
					type: "POST",
					xhr: function() {
						myXhr = $.ajaxSettings.xhr();
						return myXhr;
					},
					data: new FormData($("#reg-shopform")[0]),
					dataType: "json",
					success: function(data) {
						$.loading.end();
						console.log(data);
						if(data.resType == "00") {
							window.location.href = "shopList.html";
						} else {
							alert(data.msgContent);
						}
					},
					error: function(err) {
						$.loading.end();
						alert("商户注册 " + err.status + "：" + err.statusText);
					},
					cache: false,
					contentType: false,
					processData: false
				});
			});
			// 返回修改
			backBtnEle.click(function() {
				sureBtnEle.removeClass("hidden");
				checkParamClass.removeAttr("disabled");
				intoBtnEle.addClass("hidden");
				backBtnEle.addClass("hidden");
			});
			// 有效期为长期
			regLongdateClass.change(function() {
				var startDateEle = $(this).parents(".check-area").find(".check-datepicker").eq(0);
				var endDateEle = $(this).parents(".check-area").find(".check-datepicker").eq(1);
				startDateEle.val(dateModule.formatDate(new Date(), "yyyy-MM-dd"));
				endDateEle.val(dateModule.formatDate(dateModule.futureDate(50), "yyyy-MM-dd"));
				if($(this).prop("checked")) { // 有效期为长期
					startDateEle.attr("disabled", "disabled");
					endDateEle.attr("disabled", "disabled");
					self.validateDeal(startDateEle, true, "ok", false);
					self.validateDeal(endDateEle, true, "ok", false);
				} else {
					startDateEle.removeAttr("disabled");
					endDateEle.removeAttr("disabled", "disabled");
				}
			});
			// 监听输入的银行卡号码
			regBankcardEle.bind("input", function() {
				var theValue = this.value;
				if(theValue.length >= 15) { // theValue.length == 6 || theValue.length >= 15
					httpModule.ajaxRequest({
						name: "获取银行卡类型", // 接口名称
						type: "GET",
						url: httpModule.setHostUrl() + "jst-oms/rest/merchant/getCardBinInfo",
						data: {
							"bankCardNo": regBankcardEle.val().substring(0, 6)
						},
						success: function(data) {
							if(data.resType == "00") {
								if(stringModule.CheckEmpty(data.bankCardbinlistBean)) {
									if(data.bankCardbinlistBean.bankCardType == "01") {
										regBankNameEle.val(data.bankCardbinlistBean.bankName);
										regBankCodeEle.val(data.bankCardbinlistBean.bankCode);
										//										if(theValue.length >= 15 && theValue.length <= 19) {
										//											self.validateDeal(regBankcardEle, true, "ok", false);
										//										}
									} else {
										self.validateDeal(regBankcardEle, false, "暂不支持该卡业务", false);
										regBankNameEle.val("");
										regBankCodeEle.val("");
									}
								} else {
									//self.validateDeal(regBankcardEle, false, "暂不支持该卡号", false);
									//regBankNameEle.val("");
									regBankCodeEle.val("");
								}
							} else {
								//self.validateDeal(regBankcardEle, false, "暂不支持该卡号", false);
								//regBankNameEle.val("");
								regBankCodeEle.val("");
							}
						},
					});
				}
			});
		},
		// 获取分润商户名称
		getFeename: function(feeid) {
			var self = this;
			if(stringModule.CheckEmpty(feeid)) {
				httpModule.ajaxRequest({
					name: "获取分润商户名称", // 接口名称
					type: "GET",
					url: httpModule.setHostUrl() + "jst-oms/rest/merchant/getMerchantName",
					data: {
						"merchantNo": feeid
					},
					success: function(data) {
						if(data.resType == "00") {
							regFeenameEle.val(data.userName);
							self.validateValue(regFeenameEle);
							self.validateDeal(regFeeidEle, true, "ok", false);
						} else {
							self.validateDeal(regFeeidEle, false, regFeeidEle.attr("data-info"), false);
							regFeenameEle.val("");
							self.validateDeal(regFeenameEle, true, "(系统填写)", false);
							alert(data.msgContent);
						}
					},
					complete: function() {

					}
				});
			}
		},
		// 检验场景下的所有字段是否合法
		validateScene: function(sce) {
			var baseData = [];
			var lockItem;
			formResult = true;
			// 获取需要验证的input要素
			sce.each(function() {
				var theData = {
					eid: this.id,
					type: $(this).attr("data-type"),
					res: $(this).attr("data-res")
				};
				baseData.push(theData);
			});
			// 校验全部字段是否通过验证
			$.each(baseData, function(key, val) {
				if(val.res == "lock") {
					formResult = false;
					lockItem = val.eid;
					return false;
				}
			});
			console.log(formResult);
			console.log(baseData);
			return {
				res: formResult,
				eid: lockItem
			};
		},
		// 验证当前字段
		validateValue: function(ele, elesib) {
			var self = this;
			var theValue = ele.val();
			var theType = ele.attr("data-type");
			var theInfo = ele.attr("data-info");
			var theRes = stringModule.regexpRule(theType, theValue, theInfo);
			// 校验字段是否通过校验
			if(theRes.result) {
				// 非时间字段
				if(!ele.hasClass("check-datepicker")) { //!ele.hasClass("check-datepicker") && !ele.hasClass("check-bank")
					self.validateDeal(ele, true, theRes.warn, false);
				}
				// 时间字段
				if(stringModule.CheckEmpty(elesib)) {
					var sibRes = stringModule.regexpRule(elesib.attr("data-type"), elesib.val(), elesib.attr("data-info"));
					if(sibRes.result) {
						self.validateDeal(ele, true, theRes.warn, false);
						self.validateDeal(elesib, true, sibRes.warn, false);
					} else {
						self.validateDeal(elesib, false, sibRes.warn, false);
					}
				}
			} else {
				// 非上传图片字段
				if(!ele.hasClass("reg-imgupload")) {
					self.validateDeal(ele, false, theRes.warn, false);
				}
			}
		},
		// 验证字段结果处理
		validateDeal: function(ele, res, tips, scroll) {
			ele.parents(".check-area").find(".check-tips").html(tips);
			if(res) {
				ele.parents(".check-area").removeClass("has-error");
				ele.parents(".check-area").addClass("has-success");
				ele.attr("data-res", "pass");
			} else {
				ele.parents(".check-area").removeClass("has-success");
				ele.parents(".check-area").addClass("has-error");
				ele.attr("data-res", "lock");
				if(scroll) {
					$("html,body").animate({
						scrollTop: ele.offset().top - 100
					}, 500, function() {
						ele.focus()
					});
				}
			}
		},
		// 上传input初始化
		aceUpload: function() {
			var self = this;
			regUploadClass.ace_file_input({
				style: 'well',
				btn_choose: '请 上 传 您 的 图 片',
				btn_change: null,
				no_icon: 'icon-cloud-upload',
				droppable: true,
				thumbnail: 'small', // 上传前缩略图展示 large | fit 
				//,icon_remove:null//set null, to hide remove/reset button
				/*,before_change:function(files, dropped) {
					//Check an example below
					//or examples/file-upload.html
					return true;
				}*/
				before_remove: function() {
					if($(this).hasClass("check-allow")) {
						self.validateDeal($(this), true, "(非必填)", false);
					} else {
						self.validateDeal($(this), false, $(this).attr("data-info"), false);
					}
					return true;
				},
				preview_error: function(filename, error_code) {
					//name of the file that failed
					//error_code values
					//1 = 'FILE_LOAD_FAILED',
					//2 = 'IMAGE_LOAD_FAILED',
					//3 = 'THUMBNAIL_FAILED'
					//alert(error_code);
				},
				before_change: function(files, dropped) {
					//files is a "File" object array in modern browsers
					//files is a "string" (file name) array in older browsers
					//dropped=true if files are drag & dropped
					var maxFileNum = files.length < 2 ? files.length : 2; // 最多只能上传2张图片
					var maxFileSize = 2 * 1000 * 1000; // 每张图片不能超过2M
					var resFile = true;

					if(files.length > 2) {
						alert("抱歉，最多只能上传2张图片");
						return false;
					} else {
						for(var i = 0; i < maxFileNum; i++) {
							if(files[i].size > maxFileSize) {
								resFile = false;
							}
						}
						// 验证是否已经上传图片
						if(resFile) {
							if($(this).hasClass("check-allow")) {
								if(files.length > 0) {
									self.validateDeal($(this), true, "ok", false);
								} else {
									self.validateDeal($(this), true, "(非必填)", false);
								}
							} else {
								if(files.length > 0) {
									self.validateDeal($(this), true, "ok", false);
								} else {
									self.validateDeal($(this), false, $(this).attr("data-info"), false);
								}
							}
							return files;
						} else {
							alert("每张图片不能超过2M");
							return false;
						}
					}

					//    if( typeof file === 'string') {
					//        older browsers that don't support FileReader API, such as IE
					//        here, file is just a filename string
					//        if (file is valid) valid_files.push(file);
					//    } else if( 'File' in window && file instanceof window.File ) {
					//        file is a "File" object with following properties
					//        file.name
					//        file.type (mime type)
					//        file.size
					//        if (file is valid) valid_files.push(file);
					//    }

					//return true;//original input files
					//return false;//all are invalid, but don't reset input
					//return -1;//all are invalid, reset input
				}
			});
		},
		// 时间选择初始化
		aceDatepicker: function() {
			var self = this;
			checkDatepickClass.datepicker({
				autoclose: true
			}).on("hide", function() {
				var sibEle = $(this).siblings(".check-datepicker").eq(0);
				var limType = $(this).index();
				var limTime = $(this).val();
				self.validateValue($(this), sibEle);
				if(limType == 0) {
					sibEle.datepicker('setStartDate', limTime);
				}
				if(limType == 1) {
					sibEle.datepicker('setEndDate', limTime);
				}
			});
		},
	}
	main.init();
});