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
				self.showInfo();
			},
			// 展示退款信息
			showInfo: function(){
                	var refTi = '<div class="detail-title"><div class="detail-cell"><p>退款状态</p></div></div>';
                		if(info.refundStatus == "00"){
                			var staClass = "refund-success";
                			var staText = "退款成功";
                		}
                		if(info.refundStatus == "01"){
                			var staClass = "refund-doing";
                			var staText = "退款中...";
                		}
                		if(info.refundStatus == "02"){
                			var staClass = "refund-fail";
                			var staText = "退款失败";
                		}
                	var refHtml = '<div class="refund-box '+ staClass +'"><h2 class="refund-state">' + staText + '</h2><h3 class="refund-money">￥' + info.paySum + '</h3><p class="refund-info">退款编号：' + info.tradeId + '</p><p class="refund-info">退款时间：' + info.createTime + '</p><p class="w40 refund-info">退款原因：'+ info.remarkMsg +'</p></div>';
	                	refHtml = '<div class="detail-refund">' + refHtml + '</div>';
	                	refundListEle.html(refHtml);
			},
			//事件绑定
			bindEvent: function() {
				//详情显示
//				$("#createTime").text(info.createTime);
//				$("#payTime").text(info.payTime);
//				$("#goodsName").text(info.goodsName);
//				$("#paySum").text("￥" + info.paySum);
//				$("#shopId").text(info.shopId);
//				$("#shopName").text(info.shopName);
//				$("#tradeId").text(info.tradeId);
//				$("#tradeType").text(info.tradeType);
			},
		};
	main.init();

});