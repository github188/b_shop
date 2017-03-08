jQuery(function($){
	var menuEle = $("#menu"),
		shMenuEle = $("#shMenu"),
		jyMenuEle = $("#jyMenu"),
		jsMenuEle = $("#jsMenu"),
		main = {
			init:function(){
				var self = this;
				self.bindEvent();
			},
			bindEvent:function(){
				//用户名
				$(".top-username").text("您好，" + sessionStorage.user);
				
				//一级菜单
				menuEle.on("click",".hsub",function(){
					var index = $(this).index();
					$(this).addClass("menu-on");
					$(this).siblings().removeClass("menu-on");
					$(this).removeClass("active");
					if($(this).hasClass("open")){
						$(this).removeClass("menu-on");	
						
																			
					}else{
						
					}
					
					if(index == 0){
						if(!$(".hsub").eq(0).hasClass("active")){
							window.location.href = "../account/index.html";
						}
					}
					
					if(index == 5){
						window.location.href = "../account/set.html";
					}
									
					if($(this).find(".nav-li").hasClass("menu-on")){
						$(this).removeClass("menu-on");						
					}else{
						
					}
					
					
				});
				
				/**二级菜单**/
				
				//我的商户
				shMenuEle.on("click",".nav-li",function(e){
					e.stopPropagation()		
					$(this).addClass("menu-on");
					$(this).siblings().removeClass("menu-on");
					
					jyMenuEle.find(".nav-li").removeClass("menu-on");
					jsMenuEle.find(".nav-li").removeClass("menu-on");
					
					var index = $(this).index();
					switch (index){
						case 0:
							window.location.href = "../account/base_info.html";
							break;
						default:
							break;
					}
					
				});
				
				//交易管理
				jyMenuEle.on("click",".nav-li",function(){
					$(this).addClass("menu-on");
					$(this).siblings().removeClass("menu-on");
					
					shMenuEle.find(".nav-li").removeClass("menu-on");
					jsMenuEle.find(".nav-li").removeClass("menu-on");
					
					var index = $(this).index();
					switch (index){
						case 0:
							window.location.href = "../account/trade_record.html";
							break;
						default:
							break;
					}
				});
				
				//结算管理
				jsMenuEle.on("click",".nav-li",function(){
					$(this).addClass("menu-on");
					$(this).siblings().removeClass("menu-on");
					
					shMenuEle.find(".nav-li").removeClass("menu-on");
					jyMenuEle.find(".nav-li").removeClass("menu-on");
					
					var index = $(this).index();
					switch (index){
						case 0:
							window.location.href = "../account/account_settle.html";
							break;
						case 1:
							window.location.href = "../account/account_settle_list.html";
							break;
						default:
							break;
					}
				});
				
				//退出事件
				$(".logout").bind("click",function(){
					sessionStorage.clear();
					window.location.href = "../home/login.html";
				});
			}
		};
		main.init();
	
	
});
