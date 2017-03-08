jQuery(function($){
	var main = {
			init:function(){
				var self = this;
				self.bindEvent();
			},
			bindEvent:function(){
				$("#backBtn").bind("click",function(){
					window.location.href = "../home/login.html";
				});
			}
		};
		main.init();
})
