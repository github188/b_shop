$(function() {
	var info = JSON.parse(sessionStorage.getItem("tradeInfo")),
		onLine = sessionModule.isLogin(sessionStorage.userId),
		refundListEle = $("#refund-list");
		
		main = {
			//初始化
			init: function() {
				var self = this;
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				self.bindEvent();
				httpModule.ajaxRequest({
					name: "获取交易记录退款信息",
					type: "POST",
					url: shopIp + "jst-finance-merchantFront/rest/merchantFrontTranCore/queryList",
					data: {
						linkPayNo: info.linkPayNo,
						userId: sessionStorage.userId
					},
					success: function(data) {
                        console.log(data);
						if(data.resType == "00") {
	                        if(data.tranCorePayOrderBeanList.length > 0){
	                        	var refTi = '<div class="detail-title"><div class="detail-cell"><p>退款状态</p></div></div>';
	                        	var refHtml = "";
	                        	$.each(data.tranCorePayOrderBeanList, function(key, val){
	                        		if(val.refundStatus == "00"){
	                        			var staClass = "refund-success";
	                        			var staText = "退款成功";
	                        		}
	                        		if(val.refundStatus == "01"){
	                        			var staClass = "refund-doing";
	                        			var staText = "退款中...";
	                        		}
	                        		if(val.refundStatus == "02"){
	                        			var staClass = "refund-fail";
	                        			var staText = "退款失败";
	                        		}
	                        		refHtml += '<div class="refund-box '+ staClass +'"><h2 class="refund-state">' + staText + '</h2><h3 class="refund-money">￥' + (val.tranAmount / 100) + '</h3><p class="refund-info">退款编号：' + val.busNo + '</p><p class="refund-info">退款时间：' + val.tranDate + '</p><p class="w40 refund-info">退款原因：'+ val.remark +'</p></div>';
	                        	});
	                        	refHtml = '<div class="detail-refund">' + refHtml + '</div>';
	                        	refundListEle.html(refTi + refHtml);
	                        }
						} else {
							alert(data.msgContent);
						}
					}
				});
			},
			//事件绑定
			bindEvent: function() {
				//详情显示
				$("#createTime").text(info.createTime);
				$("#payTime").text(info.createTime);
				$("#goodsName").text(info.goodsName);
				$("#paySum").text("￥" + info.paySum);
				$("#shopId").text(info.shopId);
				$("#shopName").text(info.shopName);
				$("#tradeId").text(info.tradeId);
				$("#tradeType").text(info.tradeType);
			},
		};
	main.init();

});