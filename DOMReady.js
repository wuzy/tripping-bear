//Document.ready函数
var DOMReady = (function(){
    var funcs = [],//当获得事件时需要执行的函数
      ready = false;
    
    //文档就绪时调用的事件处理函数
	function handler(e) {
        //如果已经运行，则直接返回
		if (ready) {
	        return;	
		}

		//如果发生readystatechange事件，其状态不是complete或interactive，则文档还未准备好
		if (e.type === "readystatechange" && (document.readyState !== "complete" || document.readyState !== "interactive")) return;

		//运行所有注册函数
		for (var i = 0; i < funcs.length; i++) {
	        funcs[i].call(document);
		}

		ready = true;
		funcs = null;
	}

	if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", handler, false);
		document.addEventListener("readystatechange", handler, false);
		document.addEventListener("load", handler, false);
	} else if (document.attachEvent) {
        document.attachEvent("onreadystatechange", handler);
		document.attachEvent("onload", handler);
	}

	//返回ready函数
	return function DOMReady(f) {
        if (ready) {
	        f.call(document);//若准备完成，则运行	
		} else {
	        funcs.push(f);	
		}
	};
})();
