jQuery(function($) {

	var settlelistEle = $("#jsjk-settlelist");
	var settlebtnEle = $("#jsjk-settlebtn");
	var resetBtn = $("#reset-btn");
	var onLine = sessionModule.isLogin(sessionStorage.userId);
	var settlementNo = sessionStorage.settlementNo
	var main = {
		// 初始化执行
		init: function() {
			var self = this;
			if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
				return false;
			}
			self.bindEvent();
			self.datePicker();
			self.dataInit();
		},
		// 初始化时间选择器
		datePicker: function() {
			//开始时间
			$('#jsjk-starttime').datepicker({
				 language: "zh-CN",
				format: "yyyy-mm-dd",
				autoclose: true
			}).next().on(ace.click_event, function() {
				$(this).prev().focus();
			});
			//结束时间
			$('#jsjk-endtime').datepicker({
				 language: "zh-CN",
				format: "yyyy-mm-dd",
				autoclose: true
			}).next().on(ace.click_event, function() {
				$(this).prev().focus();
			});
			// 设置时间选择范围
			$("#jsjk-starttime").on("hide", function() {
				$("#jsjk-endtime").datepicker('setStartDate', $(this).val());
			});
			$("#jsjk-endtime").on("hide", function() {
				$("#jsjk-starttime").datepicker('setEndDate', $(this).val());
			});
		},
		// 事件绑定
		bindEvent: function() {
			// 查询按钮，重新向服务器发起请求
			settlebtnEle.bind("click", function() {
				settlelistEle.bootstrapTable('refresh', {
					silent: true
				});
			});
			// 重置查询条件(刷新页面)
            resetBtn.bind("click", function() {
            	window.location.href = window.location.href;
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
					startTime: $("#jsjk-starttime").val(),
					endTime: $("#jsjk-endtime").val(),
					merchantName: $("#jsjk-shopname").val(),
					settlementType: $("#jsjk-settletype").val(),
					settlementNo:settlementNo,
					//userId:sessionStorage.userId,
					merchantId:sessionStorage.merchantId,
					merchantMemberId:sessionStorage.merchantMemberId
//					merchantMemberId: $("#merchantMemberId").val(),
//					merchantId: $("#merchantId").val(),
//					settlementDate: $("#settlementDate").val(),
//					startTime: $("#startTime").val(),
//					endTime: $("#endTime").val(),
//					settlementState: $("#settlementState").val()
				}
				return existData;
			};
			// 封装返回数据
			bsTable.resHandler = function(res) {
				if(res.resType == "00") {
					console.log(res)
					if (res.tranCorePayOrderBeanList == undefined) {
		                return {
		                    "rows": [],
		                    "total": 0
		                };
		            }
		            return {
		                "rows": res.tranCorePayOrderBeanList,
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
			settlelistEle.bootstrapTable({
				columns: [
				{
					field: 'tranDate',
					title: '结算时间'
				}, 
//				{
//					field: 'settlementType',
//					title: '结算类型',
//					formatter: function(value, row, index) {
//						switch(row.settlementState) {
//							case "0":
//								return "结算到银行卡";
//								break;
//							case "2":
//								return "结算到余额户";
//								break;
//						}
//					}				
//					
//				}, 
				{
					field: 'orderName',
					title: '商品名称',
				}, 
				{
					field: 'busNo',
					title: '交易号'
				}, 
				{
					field: 'merchantExtenalNo',
					title: '商户订单号'
				},
				{
					field: 'merchantName',
					title: '商户名称'
				}, 
				{
					field: 'payMemberName',
					title: '交易对方'
				},
				{
					field: 'tranAmount',
					title: '订单金额',
					formatter:function(value){
						var val = value;
						if(val != null){
							val = parseInt(val)/100;
							val = val.toFixed(2);
							return val;
						}else{
							val = 0;
							val = val.toFixed(2);
							return val;
						}					
					}
				}
				,
				{
					field: 'refundAmount',
					title: '退款总额',
					formatter:function(value){
						var val = value;
						if(val != null){
							val = parseInt(val)/100;
							val = val.toFixed(2);
							return val;
						}else{
							val = 0;
							val = val.toFixed(2);
							return val;
						}					
					}
				},
				{
					field: 'tranFee',
					title: '手续费',
					formatter:function(value){
						var val = value;
						if(val != null){
							val = parseInt(val)/100;
							val = val.toFixed(2);
							return val;
						}else{
							val = 0;
							val = val.toFixed(2);
							return val;
						}					
					}
				}],
				method: 'post',
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
				url: shopIp + "jst-finance-merchantFront/rest/merchantFrontTranCore/queryList"
				//url: "http://10.101.130.205:8080/jst-oms/rest/tranCorePayOrder/queryList"
				//url:"http://10.101.130.123:8089/jst-oms/rest/tranCorePayOrder/queryList"
			});
		},
	};
	main.init();
});