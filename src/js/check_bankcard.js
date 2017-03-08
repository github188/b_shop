jQuery(function($){
	var basicInfo = basicInfo = JSON.parse(sessionStorage.basicInfo),
		onLine = sessionModule.isLogin(sessionStorage.userId),		
		main = {
			init:function(){
				if(stringModule.CheckEmpty(onLine)) { // 判断用户是否处于登陆状态
					return false;
				}
				var self = this;
				
				self.initData();
				self.bindEvent();
				
			},
			bindEvent:function(){
				//添加银行卡
				$(".add-btn").bind("click",function(){
					window.location.href = "add_bankcard.html";
				});
				
				//
				$("#sum").bind({
					"keyup":function(){
						console.log($(this).val())
					}
				})
				
			},
			initData:function(){
				$('#querylist').bootstrapTable({
					columns: [{
						field: 'bankName',
						title: '银行名称',
					},{
						field: 'openCity',
						title: '开户银行所在城市'
					},{
						field: 'openBranbank',
						title: '开户银行支行名称',
					},{
						field: 'bankCardNo',
						title: '银行卡号',
					},
					{
						field: 'isDefault',
						title: '是否默认',
						formatter:function(value,row,index){
							if (row.isDefault == "1") {
								return "是";
							}
							if (row.isDefault == "0") {
								return "否";
							}
						}
					},{
						field: 'verifyFlag',
						title: '操作',
						formatter: function(value, row, index) {
							var showclass = "",
								changeHref = ""
								showHref = "",
								reviseBtn = "";
							if(row.verifyFlag == "1"){
								showclass = "authentication-btn";
								showHref = '';
								changeHref = "javascript:void(0)";
								reviseBtn = "authentication-btn";
							}else{
								showclass = "authentication-btn-on";
								showHref = 'authentication('+index+')';
								changeHref = "change_bankcard_mes.html?index="+index;
								reviseBtn = "revise-btn"
							}
							var handleHtml = '<div class="oper">'+
												'<a class="table-btn '+ reviseBtn +'" href="'+ changeHref +'">修改</a>'+
												'<a class="table-btn '+ showclass + '" href="javascript:void(0)" onclick="'+ showHref +'">鉴权</a>'+
												'<a class="table-btn delete-btn" href="javascript:void(0)" onclick="deleteClick('+index+')">删除</a>'+
											'</div>';
							return handleHtml;
						}
					}
					],
					method: 'GET',
					striped: true,
					dataType: "json",
					pagination: false,
					queryParamsType: "limit",
					singleSelect: false,
					contentType: "application/x-www-form-urlencoded",
					pageSize: 10,
					pageNumber:1,
					pageList: [10, 20, 30],
					search: false, //不显示 搜索框
					showColumns: false, //不显示下拉框（选择显示的列）
					escape:false,        //字符转义
					sidePagination: "server", //服务端请求
					queryParams: {"userId":sessionStorage.userId},
					responseHandler: responseHandler,
					url:shopIp + "jst-finance-merchantFront/rest//merchantController/getBankCardList",
				});
				
				function responseHandler(res) {
					bankList = res;
					
					console.log(res)
					if (res.resType == "00") {
						sessionStorage.bankCardList = JSON.stringify(bankList);
						if (res.bankCardBeanList === undefined){
							return {
								"rows": [],
								"total": 0
							};				
						};	
						return {
							"rows": res.bankCardBeanList,
							"total": res.numCount
						};
					} else {
						return {
							"rows": [],
							"total": 0
						};
					}
				}
				
					
			}
			
		};
		main.init();
		
		
	
	
});
//记录银行卡列表
var bankList = "";

//删除银行卡按钮
function deleteClick(index){
	var obj = "alertBox",
		alertTitle = '<h4 class="center alert-title">提示</h4>';
        alertContent = '<div class="alert-content"> ' +
        					'<p class="center">请确认是否删除'+ bankList.bankCardBeanList[index].bankCardNo+'银行卡?</p>'+	 					
        				'</div>';
        alertWidth = 400;
        alertBtn = [
						{
							html: "确认",
							"class" : "alert-btn",
							click: function() {
								var that = $(this);
								
								httpModule.ajaxRequest({
									name:"删除银行卡",
									type:"POST",
									async:false,
									url:shopIp + "jst-finance-merchantFront/rest/merchantController/delBankCard",
									data:{
								        userId:sessionStorage.userId,
								        bankCardNo:bankList.bankCardBeanList[index].bankCardNo,
								        logId:bankList.bankCardBeanList[index].logId
									},
									success:function(data){
										if(data.resType == "00"){
											that.dialog( "close" );
											window.location.href = "check_bankcard.html";
										}else{
											alertTitle = '<h4 class="center alert-title">提示</h4>';
									        alertContent = '<div class="alert-content"> ' +
									        					'<p class="center">'+ data.msgContent +'</p>'+	 									        					
									        				'</div>';
									        alertBtn = [
										        	{
														html: "取消",
														"class" : "alert-btn",
														click: function() {
															$( this ).dialog( "close" );							
														}
													}
												]
										}
											
									}
								});
							}
						},
						{
							html: "取消",
							"class" : "alert-btn",
							click: function() {
								$( this ).dialog( "close" );							
							}
						}
					];
		exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
}
//银行卡鉴权操作
function authentication(index){
	console.log(index)
	
	httpModule.ajaxRequest({
		name:"银行卡鉴权操作",
		type:"POST",
		async:false,
		url:shopIp + "jst-finance-merchantFront/rest/merchantController/vfyBankCard",
		data:{
	        userId:sessionStorage.userId,
	        receiveCardNo:bankList.bankCardBeanList[index].bankCardNo,
		},
		success:function(data){
			console.log(data)
			var mes = data;
			var obj = "alertBox",
				alertTitle = "",
				alertContent = "",
				alertWidth = 400,
				alertBtn = [];
					
				if(data.resType == "00"){
					if(data.payListState == "1" && data.timeOutState == "0"){//已打款，未超时
						alertTitle = '<h4 class="center alert-title">提示</h4>';
				        alertContent = '<div class="alert-content"> ' +
				        					'<p class="center">尊敬的商户，您好！捷顺通将向您以下账户随机打入一笔小额金额,</p>'+		        					
				        					'<p class="center">以便验证银行卡真实性，请关注短信或邮件信息提醒，谢谢！</p>'+
				        					'<div class="auth-cell">'+
				        						'<span>打款金额（元）：</span>'+
				        						'<input type="text" id="sum" placeholder="请输入金额"/>'+
				        					'</div>'+
				        				'</div>';
				        alertWidth = 600;
						alertBtn = [
								{
									html: "确认",
									"class" : "alert-btn",
									click: function() {
										$(this).dialog( "close" );
										
										httpModule.ajaxRequest({
											name:"提交回填金额",
											type:"POST",
											async:false,
											url:shopIp + "jst-finance-merchantFront/rest/merchantFront/amountAuthen",
											data:{
												listId: mes.listId, //清单ID
							                    amount:parseInt(parseFloat($("#sum").val()) * 100)
											},
											success:function(data){
												console.log(data)
												if(data.success){
													alert(data.msgContent);
													window.location.href = "check_bankcard.html";
												}else{
													alert("回填金额错误,您还有" +data.errorTimes+ "次回填机会！")
												}
												
											}
										})
									}
								},
							];
					}else if(data.payListState == "5"){//三次回填金额错误
						alertTitle = '<h4 class="center alert-title">提示</h4>';
				        alertContent = '<div class="alert-content"> ' +
				        					'<p class="center">您已3次回填打款金额错误，打款验证失败，</p>'+
				        					'<p class="center">请更换银行账户进行验证！</p>'+
				        				'</div>';
				        alertWidth = 380;
				        alertBtn = [
								{
									html: "确认",
									"class" : "alert-btn",
									click: function() {
										$(this).dialog( "close" );
										window.location.href = "add_bankcard.html";									
									}
								},
							];
					}else if(data.payListState == "0"){//待打款
						alertTitle = '<h4 class="center alert-title">提示</h4>';
				        alertContent = '<div class="alert-content"> ' +
				        					'<p class="center">尊敬的商户，您好! 捷顺通将向该账户随机打入一笔小额金额，</p>'+
				        					'<p class="center">以便验证银行卡真实性，请关注短信或邮件信息提醒，谢谢！</p>'+
				        				'</div>';
				        alertWidth = 380;
				        alertBtn = [
								{
									html: "确认",
									"class" : "alert-btn",
									click: function() {
										$(this).dialog( "close" );								
									}
								},
							];
					}else if(data.payListState == "3"){//拒绝打款
						alertTitle = '<h4 class="center alert-title">提示</h4>';
				        alertContent = '<div class="alert-content"> ' +
				        					'<p class="center">该银行卡已被拒绝鉴权</p>'+				        					
				        				'</div>';
				        alertWidth = 380;
				        alertBtn = [
								{
									html: "确认",
									"class" : "alert-btn",
									click: function() {
										$(this).dialog( "close" );								
									}
								},
							];
					}else if(data.payListState == "1" && data.timeOutState == "1"){//已打款，超时
						alertTitle = '<h4 class="center alert-title">提示</h4>';
				        alertContent = '<div class="alert-content"> ' +
				        					'<p class="center">您已超过两周回填金额有效期，请重新申请发起打款验证，谢谢！</p>'+				        					
				        				'</div>';
				        alertWidth = 380;
				        alertBtn = [
								{
									html: "确认",
									"class" : "alert-btn",
									click: function() {
										$(this).dialog( "close" );
										httpModule.ajaxRequest({
											name:"超时再次申请",
											type:"POST",
											url:shopIp + "jst-finance-merchantFront/rest/merchantFront/payApply",
											data:{
												listId: mes.listId
											},
											success:function(data){
												if(data.resType == "00"){
													alert(data.msgContent);
												}else{
													alert(data.msgContent);
												}
											}
										})
									}
								},
							];
					}
					
					
					
					
					
					
				}else{
					alertTitle = '<h4 class="center alert-title">提示</h4>';
			        alertContent = '<div class="alert-content"> ' +
			        					'<p class="center">' + data.msgContent + '</p>'+				
			        				'</div>';
			        alertWidth = 400;
					alertBtn = [
							{
								html: "确认",
								"class" : "alert-btn",
								click: function() {
									$(this).dialog( "close" );
								}
							},
						];
				}
				
				exports.alertBox(obj,alertTitle,alertContent,alertBtn,alertWidth);
		}
	})
	
	
}

