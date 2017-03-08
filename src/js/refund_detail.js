$(function(){
	var info = JSON.parse(sessionStorage.getItem("tradeInfo")),
		onLine = sessionModule.isLogin(sessionStorage.userId),
		tableEle = $("#lists"),
		main = {
			//初始化
			init:function(){
				var self = this;
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				self.bindEvent();
				self.dataInit();
			},
			//事件绑定
			bindEvent:function(){
				//详情显示
				$("#createTime").text(info.createTime);
				$("#payTime").text(info.payTime);
				$("#goodsName").text(info.goodsName);
				$("#paySum").text(info.paySum);
				$("#shopId").text(info.shopId);
				$("#shopName").text(info.shopName);
				$("#tradeId").text(info.tradeId);
				$("#tradeType").text(info.tradeType);
			},
			// 初始化数据
			dataInit: function() {
				var bsTable = {};
				// 查询条件
				bsTable.paramsGroup = function(params) {
					var existData = {
						pageSize: params.limit,
						currentPage: params.offset / params.limit + 1,
						busNo:sessionStorage.busNo,
						userId:sessionStorage.userId
					}
					return existData;
				};
				// 封装返回数据
				bsTable.resHandler = function(res) {
					if(res.resType == "00") {
						console.log(res)
						resultData = res;
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
				tableEle.bootstrapTable({
					columns: [
					{
						field: 'createTime',
						title: '订单创建时间'
					}, 
					{
						field: 'expiredTime',
						title: '付款时间',
					}, 
					{
						field: 'orderName',
						title: '商品名称'
					}, 
					{
						field:"tranAmount",
						title:"交易总额",
						formatter:function(value){
							var val = value;
							if(val !=null){
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
						field: 'busNo',
						title: '交易号'
					},
					{
						field: 'merchantExtenalNo',
						title: '商户订单号'
					},
					{
						field: 'merchantName',
						title: '商户名称',
					},
					{
						field: 'tranDate',
						title: '退款时间',
					},
					{
						field: 'refundAmount',
						title: '退款金额',
						formatter:function(value){
							var val = value;
							if(val !=null){
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
						field: 'refundStatus',
						title: '退款状态',
						formatter:function(value){
							var text;
							switch (value) {
							case "00":
								text = "退款成功";
								break;
							case "01":
								text = "退款中";						
								break;
							case "02":
								text = "退款失败";						
								break;							
							}
							return text;
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
					//url:"http://10.101.130.123:8089/jst-oms/rest/tranCorePayOrder/queryList",
					
				});
			}
			
		};
		main.init();
		
	
	
})
