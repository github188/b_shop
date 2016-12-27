$(function(){
	
	var resultData = {},
		changBink = "",
		bankCardIndex = 0,
		selectedBank = "",//选择的银行卡
	    userId = "";
		main = {
		//初始化
		init:function(){
			var self = this;
			sessionModule.isLogin(sessionStorage.userId);
			userId = sessionStorage.userId;
			self.postData();
			self.bindEvent();
			self.initData();
			
			//console.log(sessionStorage.userId);
		},
		//事件绑定
		bindEvent:function(){
			//未完成鉴权
			$("#authenContent").bind("click",function(e){
				e.preventDefault();
				main.alertBox();
			});
			//银行卡选择
			$("#bankList").on("click",function(){
				bankCardIndex = ($(this).prop("selectedIndex"));
				//console.log(bankCardIndex);
			});
			//校验银行卡号
            $("#openCardNo").on("keyup",function(event){
            	var bankBin = selectedBank[bankCardIndex].cardList;
            	//console.log(bankBin)
            	if($(this).val().length >= 6){
            		for(var i = 0;i<bankBin.length;i++){
            			if($(this).val().substring(0,6) == bankBin[i]){
            				$("#errCardTips").text(" ");
            				return ;
            			}else{
            				//$(this).val(" ");
            				$("#errCardTips").text("你选择的银行不支持该卡号，请核对后重试!");
            				         				
            			}
            		}			      
            	}else{
            		$("#errCardTips").text(" ");
            	}
            	      	
            });
		},
		//弹出框
		alertBox:function(){
			//override dialog's title function to allow for HTML titles
			$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
				_title: function(title) {
					var $title = this.options.title || '&nbsp;'
					if( ("title_html" in this.options) && this.options.title_html == true )
						title.html($title);
					else title.text($title);
				}
			}));
			var domObj = "",
				titleHtml = "",
				btnObj = "";
				
				if(resultData.billState === "待打款" || resultData.billState === "打款失败"){//待打款
		            var curData = JSON.parse(sessionStorage.currentData);
		            $("#openName").val(curData.receiveName);
		            $("#openBank").val(curData.bankName);
		            $("#openBankCode").val(curData.receiveCardNo);
					
					domObj = "#alert-wait";
					titleHtml = "<div class='widget-header'><h4>带打款验证</h4></div>";
					btnObj = [					
						{
							html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; 返回",
							"class" : "btn btn-xs",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					];
				}else if(changBink == "change"){//更换银行卡
					domObj = "#alert-change";
					titleHtml = "<div class='widget-header'><h4>更换银行卡</h4></div>";
					btnObj = [	
						{
							html: "<i class='ace-icon fa fa-inbox bigger-110'></i>&nbsp; 确认无误&提交",
							"class" : "btn btn-xs btn-primary",
							click: function() {
								main.changeBank();
								$( this ).dialog( "close" );
							}
						},
						{
							html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; 取消",
							"class" : "btn btn-xs",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					];
				}else if(resultData.billState === "已打款" && resultData.timeOutState === "正常"){//打款回填金额
					domObj = "#alert-fill";
					titleHtml = "<div class='widget-header'><h4>回填金额</h4></div>";
					btnObj = [	
						{
							html: "<i class='ace-icon fa fa-inbox bigger-110'></i>&nbsp; 确认无误&提交",
							"class" : "btn btn-xs btn-primary",
							click: function() {
								main.submitSum();
								$( this ).dialog( "close" );
							}
						},
						{
							html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; 取消",
							"class" : "btn btn-xs",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					];
				}else if(resultData.billState === "认证失败" || resultData.billState === "已拒绝"){//3次回填金额错误
					domObj = "#alert-err";
					titleHtml = "<div class='widget-header'><h4>回填金额</h4></div>";
					btnObj = [	
						{
							html: "<i class='ace-icon fa fa-inbox bigger-110'></i>&nbsp; 马上申请",
							"class" : "btn btn-xs btn-primary",
							click: function() {
								$( this ).dialog( "close" );
								changBink = "change";
								$("#userOpenName").val(sessionStorage.userName );		//商户名称
								main.getBankList();
								main.alertBox();
							}
						}
					];
				}else if(resultData.billState === "已打款" && resultData.timeOutState === "超时"){
					domObj = "#alert-fail";
					titleHtml = "<div class='widget-header'><h4>重新鉴权申请</h4></div>";
					btnObj = [	
						{
							html: "<i class='ace-icon fa fa-inbox bigger-110'></i>&nbsp; 确认申请",
							"class" : "btn btn-xs btn-primary",
							click: function() {
								main.applyAgain();
								$( this ).dialog( "close" );
							}
						},
						{
							html: "<i class='ace-icon fa fa-times bigger-110'></i>&nbsp; 取消",
							"class" : "btn btn-xs",
							click: function() {
								$( this ).dialog( "close" );
							}
						}
					];
				}
			$(domObj).removeClass('hide').dialog({
					resizable: false,
					modal: true,
					title: titleHtml,
					title_html: true,
					buttons: btnObj
			});
			
		},
		//发送请求
		postData:function(){
			httpModule.ajaxRequest({
				name: "获取商户基本信息", // 接口名称
				type: "GET",
				url: hostIp + "jst-finance-merchant/rest/merchant/getAuthenInfo",
				data: {
					userId : userId
				},
				success: function(data) {
					console.log(data)
					if(data.resType === "00"){
                    	sessionStorage.userName = data.userName;
                    	$("#userName").text(data.userName);		//商户名称
						$("#userLevel").text(data.creditLevel + "级别");		//商户等级
						$("#authenState").text(data.authenState);	//鉴权状态

						//鉴权清单暂时只取一条
						if(data.billList != null && data.billList.length > 0){
							resultData = data.billList[0];
							
							sessionStorage.currentData = JSON.stringify(resultData);
                            if(data.billList[0].billState === "认证成功"){
                            	$("#authenContent").addClass("green");
                                $("#authenContent").html("您已完成鉴权认证，请放心使用！");
                            }else{
                            	$("#authenContent").removeClass("green");
                                $("#authenContent").html("您尚未完成鉴权认证，请立即点此申请");
                            }
                           // main.checkMes();
						}
                    }else{
                        alert(data.msgContent);
                    }
				},
			});
		},
		//回款认证查询错误次数
		checkMes:function(){
			var payErrorNum = 0;
            var bankCodeVal = resultData.receiveCardNo.substring(0,4) + "*********" + resultData.receiveCardNo.substring(resultData.receiveCardNo.length - 4);
            $("#cardCode").text(bankCodeVal);
            $("#bankName").text(resultData.bankName);
            
			httpModule.ajaxRequest({
				name: "回款认证查询错误次数", // 接口名称
				type: "GET",
				url: hostIp + "jst-finance-merchant/rest/merchant/getAuthenErrorNum",
				data: {
					listId:resultData.listId,
				},
				success: function(data) {
					console.log(data)
					if(data.resType === "00"){
                        payErrorNum = data.payErrorNum
                        //如果当前错误次数等于默认最大错误次数，隐藏回款输入框,禁止提交按钮
                        if(data.errorNum >= data.payErrorNum){
                            main.alertBox();
                        }else{
                        	//main.alertBox();
                            $("#payTime").html("您有" + data.payErrorNum + "次回填打款金额机会，还剩余"+(data.payErrorNum - data.errorNum)+"次回填打款金额机会，请查询确认后再行填写！");
                        }
                    }else{
                        alert(data.msgContent);
                    }
				},
			});
		},
		//超时，重新申请，发送请求
		applyAgain:function(){
			httpModule.ajaxRequest({
				name:"再次申请",
				type:"POST",
				url:hostIp + "jst-finance-merchant/rest/merchant/payApply",
				data:{
					listId: resultData.listId
				},
				success:function(data){
					 if(data.resType === "00"){
                        alert("申请成功，请等待管理员审核结果");
                        //window.location.href = "home.html";
                    }else{
                        alert(data.msgContent);
                    }
				}
			});
		},
		//提交回填金额请求
		submitSum:function(){		
			httpModule.ajaxRequest({
				name:"再次申请",
				type:"POST",
				url:hostIp + "jst-finance-merchant/rest/merchant/amountAuthen",
				data:{
					listId: resultData.listId, //清单ID
                    amount:parseFloat($("#inputSum").val()) * 100
				},
				success:function(data){
					console.log(data);
					  if(data.resType === "00"){
                        if(data.success){
                            alert("认证成功");
                           	window.location.href = "index.html";
                        }else{
                            alert("认证失败");
                            window.location.href = "index.html";
                        }
                    }
				}
			});
		},
		//更换银行卡，获取银行卡列表
		getBankList:function(){
			//默认银行卡卡BIN列表
            var allBankCardList = null;
            //选中的银行卡卡BIN列表
            var selCardList = null;
			httpModule.ajaxRequest({
				name:"获取银行卡列表",
				type:"GET",
				url:hostIp + "jst-finance-merchant/rest/merchant/getBankList",
				data:{
					
				},
				success:function(data){
					console.log(data);
					 if(data.resType === "00"){	
					 	selectedBank = data.bankCardList;
                        allBankCardList = data.bankCardList;
                        $.each(allBankCardList,function(i,item){
                            if(i === 0){
                                selCardList = item;
                                $("#bankList").append("<option value='"+item.bankCode+"' selected='selected'>"+item.bankName+"</option>");
                            }else{
                                $("#bankList").append("<option value='"+item.bankCode+"'>"+item.bankName+"</option>");
                            }
                        });

                    }else{
                        alert(data.msgContent);
                    }
				}
			})
		},
		//更换银行卡后提交数据，发送请求
		changeBank:function(){
			httpModule.ajaxRequest({
				name:"更换银行卡",
				type:"POST",
				url:hostIp + "jst-finance-merchant/rest/merchant/changeAuthenBank",
				data : {
                    listId:resultData.listId,                 //清单ID
                    bankName:selectedBank[bankCardIndex].bankName,         //银行名称
                    bankCode:selectedBank[bankCardIndex].bankCode,         //银行编号
                    openProvince:$("#openProvince").val(), //开户省
                    openCity:$("#openCity").val(),         //开户市
                    openBranbank:$("#openBranch").val(),   //开户网点名称
                    bankCardNo:$("#openCardNo").val()      //银行卡号
                },
                success:function(data){
                	console.log(data);
                }
				
				
			});
		},
		//初始化显示
		initData:function(){
			$("#zhBal").text("9999");
			$("#jsBal").text("8888");
			
		}
	};
	main.init();
	
	
})
