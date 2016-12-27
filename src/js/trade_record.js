$(function(){

	var index = "",
		startTime = "",//开始时间
		endTime = "",//结束时间
		orderNum = "", //订单号
		tradeState = "",//交易状态
		toPage = "",//页码
		main = {
			//初始化
			init:function(){
				var self = this;
				self.dataSelect();
				self.bindEvent();
			},
			//事件绑定
			bindEvent:function(){
				
				//查询按钮事件
				$("#checkMes").bind("click",function(){
					startTime = $("#startTime").val();
					endTime = $("#endTime").val();
					orderNum = $("#goodsNum").val();
					tradeState = $("#tradeState").val()
					console.log(tradeState);
				});
				
				//退款按钮事件
				$(".refund").on("click",function(){
					$("#goodsName").val($(this).parent().siblings().eq(1).text());
					$("#orderNum").val($(this).parent().siblings().eq(3).text());
					main.refundAlert();
				});
	
			},
			//日期选择
			dataSelect:function(){
				$('.date-picker').datepicker({
					autoclose: true,
					todayHighlight: true
				}).next().on(ace.click_event, function(){
					$(this).prev().focus();
				});
			},
			//退款弹框
			refundAlert:function(){
				$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
					_title: function(title) {
						var $title = this.options.title || '&nbsp;'
						if( ("title_html" in this.options) && this.options.title_html == true )
							title.html($title);
						else title.text($title);
					}
				}));
				
				var domObj = "#alert-refund";
				var titleHtml = "<div class='widget-header'><h4>请确认退款金额</h4></div>";
				var btnObj = [	
					{
						html: "<i class='ace-icon fa fa-inbox bigger-110'></i>&nbsp; 确认",
						"class" : "btn btn-xs btn-primary",
						click: function() {
							
							$( this ).dialog( "close" );
						}
					},
					{
						html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; 取消",
						"class" : "btn btn-xs btn-danger",
						click: function() {
							$( this ).dialog( "close" );
						}
					}
				];
							
				$(domObj).removeClass('hide').dialog({
					resizable: false,
					modal: true,
					title: titleHtml,
					title_html: true,
					buttons: btnObj
				});
			},
			//查询请求
			checkedMes:function(){
				
			}
			
			
		};
		main.init();
	
	
	
})
