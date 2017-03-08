jQuery(function($) {

	var settlelistEle = $("#billLists");
	var checkBtn = $("#checkMes");
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
			$('#startTime').datepicker({
				 language: "zh-CN",
				format: "yyyy-mm-dd",
				autoclose: true
			}).next().on(ace.click_event, function() {
				$(this).prev().focus();
			});
			//结束时间
			$('#endTime').datepicker({
				 language: "zh-CN",
				format: "yyyy-mm-dd",
				autoclose: true
			}).next().on(ace.click_event, function() {
				$(this).prev().focus();
			});
		},
		// 事件绑定
		bindEvent: function() {
			// 查询按钮，重新向服务器发起请求
			checkBtn.bind("click", function() {
				settlelistEle.bootstrapTable('refresh', {
					silent: true
				});
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
					merchantName: $("#jsjk-shopname").val(),
					settlementType: $("#jsjk-settletype").val(),
					settlementNo:settlementNo,
					userId:sessionStorage.userId
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
					title: '生成时间'
				}, 
				{
					field: 'orderName',
					title: '应收金额',
				}, 
				{
					field: 'busNo',
					title: '应付金额'
				}, 
				{
					field: 'payMemberId',
					title: '结算金额'
				},
				{
					field: 'merchantName',
					title: '操作',
					formatter: function(value, row, index) {
						var handleHtml = '<a class = "download" href="javascript:void(0)">下载</a>';
						return handleHtml;
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
				url: omsIp + "/jst-oms/rest/tranCorePayOrder/queryList"
				
			});
		},
	};
	main.init();
});