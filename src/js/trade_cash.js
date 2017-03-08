$(function() {

	var userId = sessionStorage.userId,
		onLine = sessionModule.isLogin(sessionStorage.userId),
		tableEle = $("#lists"),
		settlementNo = sessionStorage.settlementNo,
		checkBtn = $("#checkMes"),
		resetBtn = $("#reset-btn"),
		startTime = "", //开始时间
		endTime = "", //结束时间
		orderNum = "", //订单号
		tradeState = "", //交易状态
		index = "", //当前点击的行索引
		resultData = "", //接收数据
		refundBtn = "", //
		page = 1, //页码
		state = "", //交易状态
		tradeSum = "",
		refundSum = "",
		obj = "alertBox",
		alertTitle = "",
		alertContent = "",
		alertBtn = "",
		alertWidth = "";
	main = {
		//初始化
		init: function() {
			if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
				return false;
			}
			var self = this;
			self.datePicker();
			self.dataInit();
			self.bindEvent();
			self.checkBoxEvent();
		},
		//事件绑定
		bindEvent: function() {

			// 查询按钮，重新向服务器发起请求
			checkBtn.bind("click", function() {
				tableEle.bootstrapTable('refresh', {
					silent: true
				});
			});
			
			// 重置查询条件(刷新页面)
            resetBtn.bind("click", function() {
            	window.location.href = window.location.href;
            });
            
			//退款按钮事件
			tableEle.on("click", ".refund", function() {
				index = $(this).parents("tr").index();
				$("#goodsName").val(resultData.tranCoreCashWithDrawApplyOrderList[index].orderName);
				$("#orderNum").val(resultData.tranCoreCashWithDrawApplyOrderList[index].busNo);
				main.refundAlert();

			});
			//退款金额输入事件
			$("#refundSum").mynumber({
				filter_type: "positiveNumber",
				enterCallback: function(obj) {

				},
				valCallback: function(val) {
					//pressup callback,  return value					
					console.log("sds")
				}
			});
			$("#refundSum").on({
				"focus": function() {
					$("#refundSum_err").text("");
				}
			})

			//详情按钮事件 待开发
//			tableEle.on("click", ".details", function() {
//				index = $(this).parents("tr").index();
//
//				if(resultData.tranCoreCashWithDrawApplyOrderList[index].busType == "1") {
//					var typeTxt = "支付";
//				}
//              if(resultData.tranCoreCashWithDrawApplyOrderList[index].busType == "2") {
//					var typeTxt = "退款";
//				}
//				var payData = {
//					tranAmout: (resultData.tranCoreCashWithDrawApplyOrderList[index].tranAmount / 100).toFixed(2),
//					createTime: resultData.tranCoreCashWithDrawApplyOrderList[index].createTime,
//					
//					linkPayNo: resultData.tranCoreCashWithDrawApplyOrderList[index].busNo,
//					
//					payTime: resultData.tranCoreCashWithDrawApplyOrderList[index].tranDate,
//					goodsName: resultData.tranCoreCashWithDrawApplyOrderList[index].orderName,
//					
//					shopId: resultData.tranCoreCashWithDrawApplyOrderList[index].merchantExtenalNo,
//					shopName: resultData.tranCoreCashWithDrawApplyOrderList[index].merchantName,
//					tradeId: resultData.tranCoreCashWithDrawApplyOrderList[index].busNo,
//					tradeType: typeTxt,
//				}
//				sessionStorage.setItem("tradeInfo", JSON.stringify(payData));
//				window.location.href = "trade_detail.html";
//			});
		},
		//复选框事件
		checkBoxEvent: function() {
			//复选框选择事件
			$("#payCheckBox").bind("click", function() {
				if($(this).get(0).checked) {
					console.log(111)
				} else {
					console.log(222)
				}
			});
			$("#refundCheckBox").bind("click", function() {
				if($(this).get(0).checked) {
					console.log(111)
				} else {
					console.log(222)
				}
			});
			$("#withdrawCheckBox").bind("click", function() {
				if($(this).get(0).checked) {
					console.log(111)
				} else {
					console.log(222)
				}
			});
			$("#transferCheckBox").bind("click", function() {
				if($(this).get(0).checked) {
					console.log(111)
				} else {
					console.log(222)
				}
			});
		},
		// 初始化时间选择器
		datePicker: function() {
			//开始时间
			$("#startTime").datepicker({
				language: "zh-CN",
				format: "yyyy-mm-dd",
				autoclose: true
			}).next().on(ace.click_event, function() {
				$(this).prev().focus();
			});
			//结束时间
			$("#endTime").datepicker({
				language: "zh-CN",
				format: "yyyy-mm-dd",
				autoclose: true
			}).next().on(ace.click_event, function() {
				$(this).prev().focus();
			});
			// 设置时间选择范围
			$("#startTime").on("hide", function() {
				$("#endTime").datepicker('setStartDate', $(this).val());
			});
			$("#endTime").on("hide", function() {
				$("#startTime").datepicker('setEndDate', $(this).val());
			});
		},
		//退款弹框
		refundAlert: function() {
			$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
				_title: function(title) {
					var $title = this.options.title || '&nbsp;'
					if(("title_html" in this.options) && this.options.title_html == true)
						title.html($title);
					else title.text($title);
				}
			}));

			var domObj = "#alert-refund";
			var titleHtml = "<h4 class='alert-title center'>请确认退款金额</h4>";
			var btnObj = [{
				html: " 确认",
				"class": "alert-btn",
				click: function() {
					if($("#refundSum").val().length <= 0) {
						$("#refundSum_err").text("请输入正确的金额");
					} else {
						main.refundPost();
						$(this).dialog("close");
					}

				}
			}];

			$(domObj).removeClass('hide').dialog({
				resizable: false,
				modal: true,
				width: 400,
				title: titleHtml,
				title_html: true,
				buttons: btnObj
			});
		},
		// 初始化数据
		dataInit: function() {
			var bsTable = {};
			// 查询条件
			bsTable.paramsGroup = function(params) {
				var existData = {
					pageSize: params.limit,
					currentPage: params.offset / params.limit + 1,
					startTime: $("#startTime").val(),
					endTime: $("#endTime").val(),
					//busNo: $("#goodsNum").val(),
					//merchantId: sessionStorage.merchantId,
					//state: $("#tradeState").val(),
					userId: sessionStorage.userId,

				}
				return existData;
			};
			// 封装返回数据
			bsTable.resHandler = function(res) {
				if(res.resType == "00") {
					console.log(res)
					resultData = res;
					if(res.tranCoreCashWithDrawApplyOrderList == undefined) {
						return {
							"rows": [],
							"total": 0
						};
					}
					return {
						"rows": res.tranCoreCashWithDrawApplyOrderList,
						"total": res.numCount
					};

				} else {
					return {
						"rows": [],
						"total": 0
					};
				}
			};
			// 加载数据
			tableEle.bootstrapTable({
				columns: [{
					field: 'createTime',
					title: '创建时间'
				}, {
					field: 'busNo',
					title: '订单流水号',
				}, {
					field: 'tranAmout',
					title: '提现金额(元)',
					formatter: function(value) {
						refundSum = value;
						var val = value;
						if(val != null) {
							val = parseInt(val) / 100;
							val = val.toFixed(2);
							return val;
						} else {
							val = 0;
							val = val.toFixed(2);
							return val;
						}
					}
				}, {
					field: '',
					title: '提现银行'
				}, {
					field: 'bankAcctNo',
					title: '提现银行卡号',
				}, {
					field: 'trandate',
					title: '银行处理时间',
				},
				{
					field: 'state',
					title: '状态',
					formatter: function(value) {
						var text;
						switch(value) {
							case "0":
								text = "提现成功";
								break;
							case "1":
								text = "待处理";
								break;
							case "2":
								text = "处理中";
								break;
							case "3":
								text = "提现失败";
								break;
						}
						return text;
					}
				}, {
					field: 'linkPayNo',
					title: '银行处理流水',
				}, {
					field: '',
					title: '操作',
					formatter: function(value, row, index) {
						var handleHtml = '<div class="oper"><button class="trade-btn-table details">详情</button></div>';
						return handleHtml;
					}
				}],
				method: 'get',
				striped: true,
				dataType: "json",
				pagination: true,
				queryParamsType: "limit",
				singleSelect: false,
				contentType: "application/x-www-form-urlencoded",
				pageSize: 10,
				pageNumber: 1,
				pageList: [10, 20, 30],
				search: false, //不显示 搜索框
				showColumns: false, //不显示下拉框（选择显示的列）
				sidePagination: "server", //服务端请求
				queryParams: bsTable.paramsGroup,
				responseHandler: bsTable.resHandler,
				url: shopIp + "jst-finance-merchantFront/rest/merchantFrontTranCore/queryPayOrderList"
					//url:"http://10.101.130.123:8089/jst-oms/rest/tranCorePayOrder/queryList",

			});
		},

		//退款请求
		refundPost: function() {
			httpModule.ajaxRequest({
				name: "退款请求",
				type: "POST",
				url: shopIp + "jst-finance-merchantFront/rest/merchantFront/refundApply",
				//url:"http://10.101.130.123:8089/jst-finance-merchantFront/rest/merchantFront/refundApply",
				data: {
					busNo: resultData.tranCoreCashWithDrawApplyOrderList[index].busNo, //流水号
					refundType: "1", //退款类型1，退款至余额 2，退款至银行卡
					refundAmount: parseInt(parseFloat($("#refundSum").val()) * 100), //退款金额
					sceneCode: "202100003", //场景码
					merchantExtenalNo: resultData.tranCoreCashWithDrawApplyOrderList[index].merchantExtenalNo,
					payMobile: resultData.tranCoreCashWithDrawApplyOrderList[index].payMemberMobile,
					remark:$("#refundReason").val()
				},
				success: function(data) {
					console.log(data);
					if(data.resType == "00") {
						alert(data.msgContent);
						window.location.href = "trade_record.html";
					} else {
						alert(data.msgContent);
					}

				}

			})
		}

	};
	main.init();
});