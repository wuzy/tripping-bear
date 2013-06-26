
//编码对象
function encodeFormData(data) {
    if (!data) {
      return '';
	}
	var pairs = [],
		value,
		name;

	for (name in data) {
        if (!data.hasOwnProperty(name)) continue;
		if (typeof data[name] === "function") continue;//跳过方法
		value = data[name].toString();
		name = encodeURIComponent(name.replace("%20", "+"));
		value = encodeURIComponent(value.replace("%20", "+"));
		pairs.push(name + "=" + value);
	}
	
	return pairs.join("&");
}

//jsonp
function getJSONP(url, callback) {
    var cbnum = "cb" + getJSONP.counter++;
	var cbname = "getJSONP." + cbnum;

	if (url.indexOf("?") === -1) {
        url += "?jsonp=" + cbname;
	} else {
        url += "&jsonp=" + cbname;	
	}

	//创建一个script元素
	var script = document.createElement("script");
	getJSONP[cbnum] = function (response) {
	    try {
		    callback(response);
		} catch (e) {
	        delete getJSONP[cbnum];
		    script.parentNode.removeChild(script);	
		}
	};

	script.src = url;
	document.body.appendChild(script);
}
getJSONP.counter = 0;

//Document.ready函数
var DOM = {
	init: function (ele) {
		this.ele = ele;  
	},
	element: null,
	ready: (function(){
		var funcs = [],//当获得事件时需要执行的函数
			isReady = false;
		
		//文档就绪时调用的事件处理函数
		function handler(e) {
			//如果已经运行，则直接返回
			if (isReady) {
				return;	
			}

			//如果发生readystatechange事件，其状态不是complete或interactive，则文档还未准备好
			if (e.type === "readystatechange" && document.readyState !== "complete") return;

			//运行所有注册函数
			for (var i = 0; i < funcs.length; i++) {
				funcs[i].call(document);
			}

			isReady = true;
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
			if (isReady) {
				f.call(document);//若准备完成，则运行	
			} else {
				funcs.push(f);	
			}
		};
	})(),
	load: function (f) {
	    if (onLoad.loaded) {
		    window.setTimeout(f, 0);
		} else if (window.addEventListener) {
		    window.addEventListener("load", f, false);
		} else if (window.attachEvent) {
		    window.attachEvent("onload", f);
		}
	},
	
	//获取标签名
    node: function(element) {
		return {
			nodeName: element.nodeType === 1 ? element.nodeName : null,
	        children: element.childNodes,
	        hasChild: (function () { element.hasChildNodes();})(),
	        parent: element.parent,
	        next: element.nextSibling ? element.nextSibling : null,
	        prev: element.previousSibling ? element.previousSiling : null,
	        nextElemnt: (function (element) {
			    var next = element.nextSibling ? element.nextSibling : null;
			    if (next) {
			        while (element.nodeType !== 1 && element.nextSibling) {
			    	    next = next.nextSibling;
					}
					if (next.nodeType !== 1) {
					    next = null;
					}
				}
				return next;
			})(element)
		};
    },
	//将类数组对象转为数组
	makeArray: function (arrayLike) {
		var arr = null;

		try {
		    arr = [].prototype.slice.call(arrayLike, 0);
		} catch (ex) {
		    arr = [];
			
			for (var i, len = arrayLike.length; i < len; i++) {
		        arr.push(arrayLike[i]);	
			}
		}
		return arr;
	},
	addClass: function (element, className) {
        var classN = " " + element.className + " ";
		if (classN.indexOf(className) === -1) {
		    element.className += ' ' + className;
		}
	},
	removeClass: function (element, className) {
	    element.className = element.className.replace(new RegExp("(^|\\s)" + className), ""); 
	},
	outerHTML: function(element) {
	   if (element.outerHTML) {
	       return element.outerHTML;
	   } else {
	       var div = document.createElement("div");
		   document.body.appendChild(div);
		   var clone = element.cloneNode(true);
		   div.appendChild(clone);
		   var outer = div.innerHTML;
		   document.body.removeChild(div);
		   return outer;
	   }
	}
};

//事件处理程序
var EventUtil = {
    //添加事件处理函数
	addEventHandler: function(element, type, handler) {
	    if (element.addEventListener) {
		    element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
		    element.attachEvent("on" + type, handler);
		} else {
		    element["on" + type] = handler;
		}
	},
	//移除事件处理函数
	removeEventHandler: function (element, type, handler) {
        if (element.removeEventListener) {
		    element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
	        element.detachEvent("on" + type, handler);	
	    } else {
	        element["on" + type] = null;	
		}
	},
	//获取事件对象
	getEvent: function(event) {
		return event || window.event;  
	},
	//获取事件目标
	getTarget: function(event) {
	    return event.target || event.srcElement;
	},
	//取消默认行为
	preventDefault: function(event) {
	    if (event.preventDefault) {
		    event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},
	//取消冒泡
	stopPropagation: function (event) {
	    if (event.stopPropagation) {
		    event.stopPropagation();
		}  else {
	        event.cancelBubble = true;	
		}
	},
	//获取相关元素
	getRelatedTarget: function (event) {
		if (event.relatedTarget) {
		    return event.realtedTarget;
		} else if (event.fromElement) {
		    return event.fromElement;
		} else if (event.toElement) {
		    return event.toElement;
		} else {
		    return null;
		}
	},
    //获取修改键
	getKey: function (event) {
		if (event.shiftKey) {
		    return "shift";
		} else if (event.altKey) {
		    return "alt";
		} else if (event.ctrlKey) {
	        return "ctrl";	
		} else if (event.metaKey) {
	        return "meta";	
		} else {
	        return null;	
		}
    },
	//获取鼠标按钮
	getButton: function (event){
        if (this.support("MouseEvents", "2.0")) {
		    return event.button;
		} else {
		    switch (event.button) {
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
			}
		}
	},
	//获取鼠标滚轮wheelDelta属性
	getWheelDelta: function (event) {
	    if (event.wheeldelta) {
	        return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
		}  else {
		    return -event.detail * 40;
		}
	},
	//浏览器事件支持
	support: function (type, version) {
		return document.implementation.hasFeature(type, version); 
	},
	//haschange事件支持
	hasChangeSupport: function () {
		return ("onhashchange" in window) && (document.documentMode === undefined || document.documentMode > 7);  
	},
	//获取鼠标事件的鼠标位置
	position: function(event) {
	    event = this.getEvent(event);
		var pageX = event.pageX,//页面坐标位置
			pageY = event.pageY;
	
		if (pageX === undefined) {
		    pageX = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
		}
		if (pageY === undefined) {
		    pageY = event.clientY + (document.body.scrollTop || document.documentElement.scrollTop);
		}

	    return {
		    //客户区坐标位置
			client: {
				clientX: event.clientX,
				clientY: event.clientY	
			},
			//页面坐标位置
			page: {
				pageX: pageX,
				pageY: pageY
			},
			//屏幕坐标位置
			screen: {
				screenX: event.screenX,
				screenY: event.screenY
			}
		};
	},
	//获取按键字符
	getCharCode: function (event) {
	    if (typeof event.charCode === "number") {
		    return event.charCode;
		} else {
		    return event.keyCode;
		}
	},
    //操作粘贴板	
	getClipboardText: function (event) {
	    var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData("text");
	},
	//设置粘贴板
	setClipboardText: function (event, value) {
	    if (event.clipboardData) {
		    event.clipboardData.setData("text/plain", value);
		} else if (window.clipboardData) {
		    window.clipboardData.setData("text", value);
		}
	}
};

var FormUtil = {
    //取得text和textarea中选择的文本
	getSelectedText: function (textbox) {
	    if (typeof textbox.selectionStart == "number") {
	        return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
		} else if (document.selection) {
	        return document.selection.createRange().text;
		} 
	},
	//选择部分文本
	selectText: function (textbox, startIndex, stopIndex) {
	    if (textbox.setSelectionRange) {
		    textbox.setSelectionRange(startIndex, stopIndex);
		} else if (textbox.createTextRange){ 
		    var range = textbox.createTextRange();
			range.collapse(true);
			range.moveStart("character", startIndex);
			range.moveEnd("character", stopIndex - startIndex);
			range.select();
		}
		textbox.focus();
	},
	//屏蔽非数字
	filterInput: function (textbox) {
		EventUtil.addEventHandler(textbox, "keypress", function (event) {
		    event = EventUtil.getEvent(event);
			var target = EventUtil.getTarget(event);
			var charCode = EventUtil.getCharCode(event);

			if (!/\d/.test(String.fromCharCode(charCode)) && charCode > 9 && !event.ctrlKey) {
			    EventUtil.preventDefault();
			}
		});
	},
	//required表单支持
	supportRequired: function() {
	    return "required" in document.createElement("input"); 
	},
	//email表单字段的支持
	supportEmail: function () {
	    var input = document.createElement("input");
	    input.type = "email";

		return input.type === "email";
	},
	//获取select中被选择项
	getSelectedOptions: function (selectbox) {
	    var result = new Array(),
		    option = null;

		for (var i = 0, len = selectbox.options.length; i < len; i++) {
		    option = selectbox.options[i];
		    if (option.selected) {
			    result.push(option);
			}
		}
		return result;
	},
	//添加选项
	addSelect: function (selectbox, text, value) {
	    var option = new Option(text, value);
	    selectbox.add(option, undefined);
	},
	//表单序列化
	serialize: function (form) {
	    var parts = [],
	        field = null,
		    i, j, len, optLen, option, optValue;

		for (i = 0, len = form.elements.length; i < len; i++) {
	        field = form.elements[i];
			
			switch (field.type) {
				case "select-one":
				case "select-multiple":
					if (field.name.length) {
				        for (j = 0, optLen = field.options.length; j < optLen; j++) {
					        option = field.options[i];
							if (option.selected) {
						        optValue = "";
								if (option.hasAttribute) {
							        optValue = (option.hasAttribute("value") ? option.value : option.text);
								} else {
							        optValue = option.attributes["value"].specified ? option.value : option.text;	
								}
								parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
							}
						}
					}
					break;
				case undefined:
				case "file":
				case "submit":
				case "reset":
				case "button":
					break;
				case "radio":
				case "checkbox":
					if (!field.checked){
					    break;
					}
		        default: 
					if (field.name.length) {
				        parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
					}
			}
		}
		return parts.join("&");
	}
};

//富文本编辑器
var RichEdit = {
	init: function (editdiv) {
        editdiv.contentEditable =true;
	},
	backcolor: function (color) {
	    document.execCommand("backcolor", false, color);    
	},
	bold: function() {
	    document.execCommand("bold", false, null); 
	},
	copy: function () {
        document.execCommand("copy", false, null);  
	},
	//将选择的文本转为链接
	createLink: function (url) {
	    document.execCommand("createlink", false, url);	
	},
	cut: function () {
        document.execCommand("cut", false, null); 
	},
	delete: function () {
        document.execCommand("delete", false, null);			
	},
	fontName: function (fontName) {
	    document.execCommand("fontname", false, fontName); 
	},
	fontSize: function (fontSize) {
	    if (fontSize > 7) {
	        fontSize = 7;
		} else if (fontSize < 1) {
	        fontSize = 1
		} 
		document.execCommand("fontSize", false, fontSize);
	},
	foreColor: function (color) {
	    document.execCommand("forecolor", false, color);  
	},
	formatBlock: function (label) {
	    document.execCommand("formatblock", false, label);			 
	},
	indent: function () {
	    document.execCommand("indent", false, null);
	},
	insertHorizontalRule: function () {
	    document.execCommand("insertHorizontalrule", false, null); 
	},
	insertImage: function (url) {
        document.execCommand("insertimage", false, url);
	},
	insertOrderedlist: function() {
	    document.execCommand("insertorderedlist", false, null);   
	},
	insertUnorderedlist: function () {
	    document.execCommand("insertunorderedlist", false, null);
	},
    insertParagraph: function () {
	    document.execCommand("insertparagraph", false, null); 
	},
	italic: function () {
	    document.execCommand("italic", false, null);   
	},
	justifyCenter: function () {
	    document.execCommand("justifycenter", false, null);   
	},
	justifyLeft: function () {
	    document.execCommand("justifyleft", false, null); 
	},
	outdent: function () {
	    document.execCommand("outdent", false, null); 
	},
	paste: function () {
	    document.execCommand("paste", false, null);	
	},
	removeFormat: function () {
	    document.execCommand("removeformat", false, null);  
	},
	selectAll: function () {
        document.execCommand("selectAll", false, null);   
	},
	underline: function () {
	    document.execCommand("underline", false, null);   
	},
	unlink: function () {
	    document.execCommand("unlink", false, null);
	},
    commands: ["backcolor", "bold", "copy", "createlink", "cut", "delete", "fontname", "fontsize",
		"forecolor", "formatblock", "indent", "inserthorizontalrule", "insertimage", "insertorderedlist",
		"insertunorderedlist", "insertparagraph", "italic", "justifycenter", "justifyleft", "outdent",
		"paste", "removeformat", "selectall", "underline", "unlink"],
	commandEnabled: function () {
	        var enables = [],
			command;

		for (var i = 0, len = this.commands.length; i < len; i++) {
	        command = this.commands[i];
			if (document.queryCommandEnabled(command)) {
			    enables.push(command);
			}
		}
		return enables;
	},
	//返回选中文本已经应用的格式
	commandState: function () {
	    var states = [],
	        command;

	    for (var i = 0, len = this.commands.length; i < len; i++) {
		    command = this.commands[i];
			if (document.queryCommandState(command)) {
			    states.push(document.queryCommandValue(command));
			}
		}
		return states;
	}
};

var StyleUtil = {
    alpha: function (element, opacity) {
        if (document.all) {
	        element.style.filter = 'alpha(opacity' + (100 * opacity) + ')';
		} else {
	        element.style.opacity = opacity;
		}
	}
};

CommonUtil = {
    trim: function (str) {
        return str.replace(/^\s+|\s+$/, "");  
	},
    extend: function (subClass, superClass) {
        var F = function (){};
		F.prototype = superClass.prototype;
		subClass.prototype = new F();
		subClass.superClass = superClass.prototype;
		if (superClass.prototype.contructor == Object.prototype.constructor) {
	        superClass.prototype.constructor = superClass;
		}
	},
	//对象复制
    clone: function(parent, child, isDeep) {
	    var i,
		    toStr = Object.prototype.toString,
			astr = '[object Array]';
		child = child || {};

		if (!isDeep) {
		    for (i in parent) {
			    if (parent.hasOwnProperty(i)) {
				    child[i] = parent[i];
				}
			}    
		} else {
		    for (i in parent) {
			    if (parent.hasOwnProperty(i)) {
				    if (typeof parent[i] === "object") {
					    child[i] = (toStr(parent[i]) === astr) ? [] : {};
					    clone(parent[i], child[i], isDeep);
					} else {
					    child[i] = parent[i];
					}
				}
			}
		}

		return child;
	},
	
	//判断变量类型
	type: function (o) {
		if (o === null) {
			return "Null";
		} else if (o === undefined) {
			return "undefined";
		} else {
			return Object.prototype.toString.call(o).slice(8, -1);
		}
		
		/*
		function classof(o) {
		    return Object.prototype.toString.call(o).slice(8, -1);
		}
		
		// 更为完整的版本
		var t, klass, name;
		// if null
		if (o === null) { return 'null'; }
		// if NaN
		if (o !== o) { return 'nan'; }
		
		// 如果是原始值
		if ((t = typeof o) !== 'object') { return t; }
		
		// 对象
		if ((klass = classof(o)) !== 'Object') { return klass; }
		
		// 对象的构造函数名字存在
		if (o.constructor && typeof o.constructor === 'function' 
		    && (name = o.constructor.getName())) { 
			return name;
		}
		
		return 'Object';*/
		
	}
}

//判断两个字符串是否为兄弟字符串
function isBrotherStr(a, b){
	if (a.length != b.length) {
		return false;
	}
	var temp = {};
	for (var i = 0, len = a.length; i < len; i++) {
		item1 = a.charAt(i);
		item2 = b.charAt(i);
		if (temp[item1]) {
			temp[item1]++;
		} else {
			temp[item1] = 1;
		}
		if (temp[item2]) {
			temp[item2]--;
		} else {
			temp[item2] = -1;
		}
	}
	for (var p in temp) {
		if (temp.hasOwnProperty(p) && temp[p] !== 0) {
		   return false;
		}
	}
	return true;
}

ViewUtil = {
	//返回页面视口大小
    pageViewport: function() {
        var doc = document,
		    pageWidth = window.innerWidth,
	        pageHeight = window.innerHeight;

		if (typeof pageWidth !== "number") {
		    //标准模式
			if (doc.compatMode === 'CSS1Compat') {
			    pageWidth = doc.documentElement.clientWidth;
				pageHeight = doc.documentElement.clientHeight;
			} else {
			    pageWidth = doc.body.clientWidth;
				pageHeight = doc.body.clientHeight;
			}
		}

		return {
		    width: pageWidth,
			height: pageHeight
		};
	}
};


function classList(e) {
    if (e.classList) {
	    return e.classList;
	} else {
	    return new CSSClassList(e);
	}
}
//class
function CSSClassList(e) {
    this.e = e;
}

CSSClassList.prototype.contains = function(c) {
    if (c.length === 0 || c.indexOf(' ') !== -1) {
	    throw new Error("Invalid class name:'" + c + "'");
	}
    var classes = this.e.className;
	if (!classes) {
	    return false;
	}
	if (classes === c) {
	    return true;
	}

	return classes.search("\\b" + c + "\\b") !== -1;
};
CSSClassList.prototype.add = function(c) {
    if (this.contains(c)) {
	    return;
	}

	var classes = this.e.className;
	if (classes && classes[classes.length - 1] !== ' ') {
	    c = " " + c;
	}
	this.e.className += c;
};
CSSClassList.prototype.remove = function(c) {
    if (c.length === 0 || c.indexOf(" ") !== -1) {
	    throw new Error("Invalid class name:" + c );
	}
	var pattern = new RegExp("\\b" + c + "\\b\\s*", "g");
	this.e.className = this.e.className.replace(pattern, "");
};
CSSClassList.prototype.toggle = function(c) {
    if (this.contains(c)) {
	    this.remove(c);
		return false;
	} else {
	    this.add(c);
		return true;
	}
};
CSSClassList.prototype.toString = function() {
    return this.e.className;
};
CSSClassList.prototype.toArray = function() {
    return this.e.className.match(/\b\w+\b/g) || [];
}

CSSUtil = {
    //获取窗口的滚动位置
    //w表示计算的窗口
	getScrollOffset: function(w) {
        w = w || window;
		var x,
			y,
			d = w.document;
		
		//IE9 and other 
		if (w.pageXOffset != null) {
		    x = w.pageXOffset;
			y = w.pageYOffset;
		//IE 6/7/8 standard
		} else if (document.compatMode === 'CSS1Compat') {
		    x = d.documentElement.scrollLeft;
			y = d.documentElement.scrollTop;
		//IE 6/7/8 quicks
		} else {
		    x = d.body.scrollLeft;
			y = d.body.scrollTop;
		}
        return {
		    x: x,
			y: y
		};
	},
	//获取窗口的视口尺寸
	getViewport: function(w) {
		w = w || window;
		var x,
		    y,
			d = w.document;
		
		if (w.innerWidth != null) {
		    x = w.innerWidth;
			y = w.innerHeigth;
		} else if (document.compatMode === "CSS1Compat") {
		    x = d.documentElement.clientWidth;
			y = d.documentElement.clientHeight;
		} else {
		    x = d.body.clientWidth;
			y = d.body.clientHeight;
		}

		return {
		    x: x,
			y: y
		};
	},
	//获取元素的几何尺寸   相对于文档
	getElementSize: function(element) {
	    var box = element.getBoundingClientRect();//返回的坐标包含边框，内边距和内容
		var offset = this.getScrollOffset();
		var x = box.left + offset.x;
		var y = box.top + offset.y;
		var width = box.width || (box.right - box.left);
		var height = box.height || (box.bottom - box.top);

		return {
		    x: x,
			y: y,
			width: width,
			height: height
		};
	},
	//原则上与getBoundingClientRect()结果相同
	//获取元素尺寸   相对于视口的大小，没有加滚动
	//每个html元素都有offsetLeft和offsetTop属性来返回元素的X和Y坐标
	//如果父元素是定位元素，子元素返回的坐标是相对于已经定位的祖先
	getPosition: function(element) {
	    var x = 0,
		    y = 0;
		    e = element;
		while (element != null) {
		    x += element.offsetLeft;
			y += element.offsetTop;
			element = element.offsetParent;
		}

		//减去滚动条
		for (var e = e.parentNode; e !== null && e.nodeType === 1; e = e.parentNode) {
		    x -= e.scrollLeft;
			y -= e.scrollTop;
		}

		return {
		    x: x,
			y: y
		};
    }
}

function quickSort(array) {
    return  QSort(array, 0, array.length - 1);
}

function QSort(array, low, high) {
    var pivot;
	if (low < high) {
	    pivot = partition(array, low, high);
		QSort(array, low, pivot - 1);
		QSort(array, pivot + 1, high);
	}
	return array;
}

function partition(array, low, high) {
    var key = array[low];
	
	while (low < high) {
	    while (low < high && array[high] >= key) {
		    high--;
		} 
		array[low] = array[high];
		while (low < high && array[low] <= key) {
		    low++;
		}
		array[high] = array[low];
		//swap(array, low, high);
	}
	array[high] = key;
	return high;
}




//自调用构造函数
function Waffle() {
    if (this instanceof Waffle) {
	    return new Waffle();
	}
	this.stastes = 'yummy';
}

function require(file, callback) {
    var script = document.createElement("script");
	    
	script.type="text/javascript";
	//IE
	script.onreadystatechange = function(){
	    if (script.readyState === "loaded" || script.readyState === "complete") {
		    script.onreadystatechange = null;
			callback();
		}
	};
	//Other
	script.onload = function() {
	    callback();
	}
	script.src = file;
	document.body.appendChild(script);
}

var Interface = function(name, methods) {
    if (arguments.length !== 2) {
	    throw new Error("Interface constructor called with " + arguments.length + 
				"arguments, but expected exactly 2.");
	}

	this.name = name;
	this.methods = [];
	for (var i = 0, len = methods.length; i < len; i++) {
	    if (typeof methods[i] !== 'string') {
		    throw new Error("Interface constructor expects method names to be " +
					" passed in as a string");
		}
		this.methods.push(methods[i]);
	}
};

//Static class method.
Interface.ensureImplements = function(object) {
    if (arguments.length < 2) {
	    throw new Error("Function interface.ensureImplements called with " + 
				arguments.length + "arguments, but expected as least 2.");
	}

	for (var i = 1, len = arguments.length; i < len; i++) {
	    var interface = arguments[i];
		if (interface.constructor !== Interface) {
		    throw new Error("Function Interface.ensureImplements expects arguments" +
					" two and above to be instance of Interface.");
		}

		for (var j = 0, methodsLne = interface.methods.length; j < methodsLen; j++) {
		    var method = interface.methods[j];
			if (!object[method] || typeof object[method] !== 'function') {
			    throw new Error("Function Interface.ensureImplements:object " +
						"does not implement the " + interface.name +
						" interface. Method " + method + " was not found.");
			}
		}
	}
};

(function(){
    if ( !window.oye ) {
	    window['oye'] = {};
	}
    
	//确定当前浏览器是否与整个库兼容
	function isCompatible(other) { 
	    if (other === false 
			|| !Array.prototype.push
			|| !Object.hasOwnProperty
			|| !document.createElement
			|| !document.getElementsByTagName
			) {
		    return false;
		}
		return true;
	}
	window['oye']['isCompatible'] = isCompatible;

	function $() { 
	    var elements = [];

		for (var i = 0, len = arguments.length; i < len; i++) {
		    var element = arguments[i];

			if (typeof element === "string") {
			    element = document.getElementById(element);
			}

			if (arguments.length === 1) {
			    return element;
			} 

			elements.push(element);
		}

		return elements;
	}
    window['oye']['$'] = $;

	function addEvent(node, type, listener) {
	    if (!isCompatible()) {
		    return false;
		} 

		if (!(node = $(node))) {
		    return false;
		}

		if (node.addEventListener) {
		    node.addEventListener( type, listener, false );
			return true;
		} else if (node.attachEvent) {
			node['e' + type + listener] = listener;
			node[type + listener] = function() {
				node['e' + type + listener](window.event);
			};
		    node.attachEvent('on' + type, node[type+listener]);
			return true;
		} else {
		    node['on' + type] = listener;
		}
		return false;
	}
	window['oye']['addEvent'] = addEvent;

	function removeEvent(node, type, listener) {
	    if (!(node = $(node))) { 
		    return false;
		}

		if (node.removeEventListener) {
		    node.removeEventListener( type, listener, false );
			return true;
		} else if (node.attachEvent) {
		    node.detachEvent( 'on' + type, node[type + listener] );
			node[type + listener] = null;
			return true;
		}
		return false;
	}
	window['oye']['removeEvent'] = removeEvent;

	function getElementsByClassName(className, tag, parent) {
	    parent = parent || document;
        if (!(parent = $(parent))) {
		    return false;
		}

		var allTags = (tag === "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
		var matchingElements = [];

		className = className.replace(/\-/g, '\\-');
		var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");
		var element;

		for (var i = 0, len = allTags.length; i < len; i++) {
		    element = allTags[i];
			if (regex.test(element.className)) {
			    matchingElements.push(element);
			}
		}

		return matchingElements;
	}
	window['oye']['getElementsByClassName'] = getElementsByClassName;

	function toggleDisplay(node, value) {
	    if (!(node = $(node))) {
		    return false;
		}

		if (node.style.display !== 'none') {
		    node.style.display = 'none';
		} else {
		    node.style.display = value || '';
		}

		return true;
	}
	window['oye']['toggleDisplay'] = toggleDisplay;

	function insertAfter(node, referenceNode) {
	    if (!(node = $(node))) {
		    return false;
		}
		if (!(referenceNode = $(referenceNode))) {
		    return false;
		}

		return referenceNode.parentNode.insertBefore(node, referenceNode.nextSibling);
	}
	window['oye']['insertAfter'] = insertAfter;

	function removeChildren(parent) {
	    if (!(parent = $(parent))) {
		    return false;
		}

		while (parent.firstChild) {
		    parent.firstChild.parentNode.removeChild(parent.firstChild);
		}
		
		return parent;
	}
	window['oye']['removeChildren'] = removeChildren;

	function prependChild(parent, newChild) {
	    if (!(parent = $(parent))) {
		    return false;
		}

		if (!(newChild = $(newChild))) {
		    return false;
		}

		if (parent.firstChild) {
		    parent.insertBefore(newChild, parent.firstChild);
		} else {
		    parent.appendChild(newChild);
		}

		return parent;
	}
	window['oye']['prependChild'] = prependChild;

	function getBrowserWindowSize() {
	    var doc = document.documentElement;

		return {
		    width: (window.innerWidth
					|| (doc && doc.clientWidth)
					|| document.body.clientWidth),
			height: (window.innerHeight
					|| (doc && doc.clientHeight)
					|| document.body.clientHeight)
		};
	}
	window.oye.getBrowserWindowSize = getBrowserWindowSize;

	function MyLogger(id) {
	    id = id || 'oyeLogWindow';
		var logWindow = null;
		var createWindow = (function() {
		    //取得新窗口在浏览器中的位置
			var browserWindowSize = oye.getBrowserWindowSize();
			var top = ((browserWindowSize.height - 200) / 2) || 0;
			var left = ((browserWindowSize.width - 200) / 2) || 0;

			logWindow = document.createElement('ul');
			logWindow.setAttribute('id', id);
			
			logWindow.style.position = 'absolute';
			logWindow.style.top = top + 'px';
			logWindow.style.left = left + 'px';

			logWindow.style.width = '200px';
			logWindow.style.height = '200px';
			logWindow.style.overflow = 'scroll';

			logWindow.style.padding = '0';
			logWindow.style.margin = '0';
			logWindow.style.border = '1px solid black';
			logWindow.style.backgroundColor = 'white';
			logWindow.style.listStyle = 'none';
			logWindow.style.font = '10px/10px Verdana, Tahoma, Sans';

			document.body.appendChild(logWindow);
		})();
		this.writeRaw = function (message) {
		    var li = document.createElement('li');
			
			li.style.padding = '2px';
			li.style.border = '0';
			li.style.borderBottom = '1px dotted black';
			li.style.margin = '0';
			li.style.color = '#000';
			li.style.font = '9px/9px Verdana, Tahoma, Sans';
			
			if (typeof message === undefined) {
			    li.appendChild(document.createTextNode('Message was undefined'));
			} else if (typeof li.innerHTML !== undefined) {
			    li.innerHTML = message;
			} else {
			    li.appendChild(document.createTextNode(message));
			}

			logWindow.appendChild(li);
			return true;
		};
	}

	MyLogger.prototype.write = function(message) {
	    if (typeof message === 'string' && message.length === 0) {
		    return this.writeRaw('oye.log: null message');
		} 

		if (typeof message !== 'string') {
		    if (message.toString) {
			    return this.writeRaw(message.toString());
			} else {
			    return this.writeRaw(typeof message);
			}
		}

		message = message.replace(/</g,"&lt;").replace(/>/g, "&gt;");
		return this.writeRaw(message);
	};
	MyLogger.prototype.header = function(message) {
	    message = '<span style="color:white;background-color:black;font-weight:bold;padding:0px 5px;">' + message + '</span>';
		return this.writeRaw(message);
	};

	window['oye']['log'] = new MyLogger();
 
})()


//任务分割
var ProcessUtil = {
	//任务分割
	//@param {array} steps 执行任务数组
	//@param {array} args 参数数值
	//@param {function} callback 处理结束时调用的回调函数
    multistep: function(steps, args, callback) {
	    var tasks = steps.concat();
	    
		setTimeout(function(){
		    var task = tasks.shift();
			task.apply(null, args || []);

			if (tasks.length > 0) {
			    setTimeout(arguments.callee, 25);
			} else {
			    callback();
			}
		}, 25);
	},
	timedProcessArray: function(items, process, callback) {
	    var todo = items.concat();

		setTimeout(function(){
		    var start = +new Date();

			do {
			    process(todo.shift());
			} while (todo.length > 0 && (+new Date() - start < 50));

		    if (todo.length > 0) {
			    setTimeout(arguments.callee, 25);
			} else {
			    callback(items);
			}
		}, 25);
	}
}

var Profiler = {
    _data: {},
	start: function(key) {
	    Timer._data[key] = new Date();
	},
	stop: function(key) {
	    var time = Timer._data[key];
	    if (time) {
		    Timer._data[key] = new Date() - time;
		}
	},
	getTime: function(key) {
	    return Timer._data[key]; 
	}
};

var sort = {
    mergeSort: function(items) {
	    if (items.length === 1) {
		    return items;
		}
	 
		var work = [];
		for (var i = 0, len = items.length; i < len; i++) {
		    work.push(items[i]);
		}
		work.push([]);

		for (var lim = len; lim > 1; lim = (lim + 1) / 2) {
		    for (var j = 0, k = 0; k < lim; j++, k += 2) {
			    work[j] = sort.merge(work[k], work[k+1]);
			}
			work[j] = [];
		}
		return work[0];
	}
};
sort.merge = function(left, right) {
    var result = [];

	while (left.length > 0 && right.length > 0) {
	    if (left[0] < right[0]) {
		    result.push(left.shift());
		} else {
		    result.push(right.shift());
		}
	}

	return result.concat(left).concat(right);
};

var loadUtil = {
	//动态脚本无论何时启动下载，文件下载和执行都不会阻塞页面的其他进程
    loadScript: function(url, callback) {
	    var script = document.createElement('script');
		script.type = 'text/javascript';

		if (script.readyState) {
		    script.onreadystatechange = function() {
			    if (script.readyState === 'loaded' || script.readyState === 'complete') {
				    script.onreadystatechange = null;
					callback();
				}
			};
		} else {
		    script.onload = function() {
			    callback();
			};
		}

		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	//下载JavaScript代码，但是不立即执行。将脚本的执行推迟到你准备好的时候
	//缺点:不支持跨域
	loadScriptByXHR: function(url) {
	    var xhr = new XMLHttpRequest();
	    
		xhr.open('GET', url, true);
		xhr.onreadystatechange = function() {
		    if (xhr.readyState === 4) {
			    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				    var script = document.createElement('script');
					script.type = 'text/javascript';
					script.text = xhr.responseText;
					document.getElementsByTagName('head')[0].appendChild(script);
				}
			}
		}
		xhr.send(null);
	},
	loadImage: function(url, callback) {
	    var image = new Image();
	    image.src = url;

		if (image.complete) {
		    callback();
		} else {
		    image.onload = callback();
		}
	}

}

/**
 * jsonp
 var scriptElement = document.createElement('script');
 scriptElement.src = 'http://any-domain.com/javascript/lib.js';
 document.getElementsByTagName('head')[0].appendChild(scriptElement);

 function jsonCallback(jsonString) {
     var data = eval('(' + jsonString + ')');
	 //process data
 }

 lib.js：
 jsonCallback({'status': 1, "colors": ['#fff', '#000', '#ff0000']});
 */

/**
 * multipart XHR
 *
function splitImages(imageString) {
	var imageData = imageString.split('\u0001');
	var imageElement;

	for (var i = 0, len = imageData.length; i < len; i++) {
		imageElement = document.createElement('img');
		imageElement.src = 'data:image/jpg;base64,' + imageData[i];
		document.getElementById('container').appendChild(imageElement);
	}
}

var req = new XMLHttpRequest();

req.open('GET', 'rollup_images.php', true);
req.onreadystatechange = function () {
	if (req.readyState === 4) {
	    splitImages(req.responseText);
	}
};
req.send(null);


rollup_images.php
<?php
$images = array('1.jpg', '2.jpg', '3.jpg', '4.jpg');

foreach($images as $image) 
{
	$image_fh = fopen('image/' . $image, 'r');
	$image_data = fread($image_fh, filesize('image/' . $image));
	fclose($image_fh);
	$payloads[] = base64_encode($image_data);
}

$newline = chr(1);

echo implode($newline, $payloads);
?>
*/
//动态加载script和style
var Load = {
    script: function(url) {
	    var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		document.body.appendChild(url);
	},
	//加载JS文本
	scriptString: function(code) {
	    var script = document.createElement("script");
	    script.type = "text/javascript";
		try {
		    script.appendChild(document.createTextNode(code));
		//if ie
		} catch (ex) {
		    script.text = code;
		}

		document.body.appendChild(script);
	  
	},
	link: function(url) {
	    var link = document.createElement("link");
	    link.rel = "stylesheet";
		link.type = "text/css";
		link.href = url;

		//<link>元素必须添加到head中，才能保证浏览器一致的行为
		var head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(link);
	},
	linkString: function(css) {
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";

		try {
		    style.appendChild(document.createTextNode(css));
		} catch (ex) {
		    style.styleSheet.cssText = css;
		}
		var head = document.head || document.getElementsByTagName("head")[0];
		head.appendChild(head);
	}
};

//检测节点otherNode是否为refNode的后代
function contains(refNode, otherNode) {
    if (typeof refNode.contains === "function" &&
			(!client.engine.webkit || client.engine.webkit >= 522)) {
	    return refNode.contains(otherNode);
	} else if (typeof relNode.compareDocumentPosition === "function") {
	    return !!(relNode.compareDocumentPosition(otherNode) & 16);
	} else {
	    var node = otherNode.parentNode;
		do {
		    if (node === relNode) {
			    return true;
			} else {
			    node = node.parentNode;
			}
		} while (node !== null);
		return false;
	}
}

//浏览器检测
var client = function(){
    var engine = {
	    //呈现引擎
		ie: 0,
		gecko: 0,
		webkit: 0,
		khtml: 0,
		opera: 0,
		version: null
	};
	var browser = {
	    ie: 0,
		firefox: 0,
		safari: 0,
		konq: 0,
		opera: 0,
		chrome: 0,
		version: null
	};
    var system = {
	    win: false,
		mac: false,
		x11: false,

		iphone: false,
		ipod: false,
		ipad: false,
		ios: false,
		android: false,
		nokiaN: false,
		winMobile: false,

		wii: false,
		ps: false
	};

	var ua = navigator.userAgent;

	if (window.opera) {
	    engine.version = browser.verion = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.version());
	} else if (/AppleWebKit\/(\S+)/.test(ua)) {
	    engine.version = RegExp['$1'];
		engine.webkit = parseFloat(engine.version);

		//chrome or safari
		if (/Chrome\/(\S+)/.test(ua)) {
		    browser.version = RegExp['$1'];
			browser.chrome = parseFloat(engine.version);
		} else if (/Version\/(\S+)/.test(ua)) {
		    browser.version = RegExp['$1'];
			browser.safari = parseFloat(browser.version);
		} else {
		    var safariVersion = 1;
			if (engine.webkit < 100) {
			    safariVersion = 1;
			} else if (engine.webkit < 312) {
			    safariVersion = 1.2;
			} else if (engine.webkit < 412) {
			    safariVersion = 1.3;
			} else {
			    safariVersion = 2;
			}

			browser.safari = browser.version = safariVersion;
		}
	} else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
	    engine.version = browser.version = RegExp['$1'];
		engine.khtml = browser.konq = parseFloat(engine.version);
	} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
	    engine.version = RegExp['$1'];
		engine.gecko = parseFloat(engine.version);

		if (/Firefox\/(\S+)/.test(ua)) {
		    browser.version = RegExp['$1'];
			browser.firefox = parseFloat(browser.version);
		}
	} else if (/MSIE ([^;]+)/.test(ua)) {
	    engine.version = browser.version = RegExp['$1'];
		engine.ie = browser.ie = parseFloat(engine.version);
	}

	browser.ie = engine.ie;
	browser.opera = engine.opera;

	//检测平台
	var p = navigator.platform;
	system.win = p.indexOf("Win") === 0;
	system.max = p.indexOf("Mac") === 0;
	system.x11 = (p === "X11") || (p.indexOf("Linux") === 0);

	if (system.win) {
	    if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
		    if (RegExp['$1'] === "NT") {
			    switch (RegExp["$2"]) {
					case "5.0":
						system.win = "2000";
						break;
					case "5.1":
						system.win = "XP";
						break;
					case "6.0":
						system.win = "Vista";
						break;
					case "6.1":
						system.win = "7";
						break;
					default:
						system.win = "NT";
						break;
				}
			} else if (RegExp["$1"] === "9x") {
			    system.win = "ME";
			} else {
			    system.win = RegExp["$1"];
			}
		}
	}

	//移动设备
	system.iphone = ua.indexOf("iPhone") > -1;
	system.ipod = ua.indexOf("iPod") > -1;
	system.ipad = ua.indexOf("iPad") > -1;
	system.nokiaN = ua.indexOf("NokiaN") > -1;

	//windows mobile
	if (system.win === "CE") {
	    system.winMobile = system.win;
	} else if (system.win === "Ph") {
	    if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
		    system.win = "Phone";
			system.winMobile = parseFloat(RegExp['$1']);
		}
	}

	//检测IOS
	if (system.mac && ua.indexOf("Mobile") > -1) {
	    if (/CPU (?:iPhone)?OS (\d+_\d+)/.test(ua)) {
		    system.ios = parseFloat(RegExp.$1.replace("_", "."));
		} else {
		    system.ios = 2;
		}
	}

	if (/Android (\d+_\d+)/.test(ua)) {
	    system.android = parseFloat(RegExp.$1);
	}

	system.wii = ua.indexOf("Wii") > -1;
	system.ps = /playstation/i.test(ua);

	return {
	    engine: engine,
		system: system,
		browser: browser
	};
}();

var XMLUtil = {
    parse: function(xml) {
	    var xmldom = null;
	    
		if (typeof DOMParser !== "undefined") {
		    xmldom = (new DOMParser()).parseFromString(xml, "text/html");
			var errors = xmldom.getElementsByTagName("parseerror");
			if (errors.length) {
			    throw new Error("XML parsing error:" + errors[0].textContent);
			}
		} else if (typeof ActiveXObject !== "undefined") {
		    xmldom = createDocument();
			xmldom.loadXML(xml);
			if (xmldom.parseError !== 0) {
			    throw new Error("XML parsing error:" + xmldom.parseError.reason);
			}
		} else {
		    throw new Error("No XML parser avaiable.");
		}

		return xmldom;
	},
	serialize: function(xmldom) {
	    if (typeof XMLSerializer !== "undefined") {
		    return (new XMLSerializer()).serializeToString(xmldom);
		} else if (typeof xmldom.xml !== "undefined") {
		    return xmldom.xml;
		} else {
		    throw new Error("Could not serialize XML DOM");
		}
	}
};

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
	return this;
};


var Script = {
	createXHR: function() {
	    var xhr;
	    try {
		    xhr = new XMLHttpRequest();
		} catch (e) {
		    var progid = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 
				'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Miscrosoft.XMLHTTP'];
			
			for (var i = 0, len = progid.length; i < len; i++) {
			    try {
				    xhr = new ActiveXObject(progid[i]);
				} catch (e) {
				    continue;
				}
				break;
			}
		} finally {
		    return xhr;
		}
	},
    XHREval: function(url) {
	    var xhr = this.createXHR();

	    xhr.onreadystatechange = function() {
		    if (xhr.readyState === 4 && xhr.status === 200) {
			    eval(xhr.responseText);
			}
		}
		xhr.open('GET', url, true);
		xhr.send(null);
	},
	XHRInject: function(url) {
	    var xhr = this.createXHR();

	    xhr.onreadystatechange = function() {
		    if (xhr.readyState === 4 && xhr.status === 200) {
			    var script = document.createElement('script');
				document.getElementsByTagName('head')[0].appendChild(script);
				script.text = xhr.responseText;
			}
		};
		xhr.open('GET', url, true);
		xhr.send(null);
	},
	scriptDOM: function(url) {
	    var script = document.createElement('script');
	    script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	scriptIframe: function(url) {
	    var iframe = document.createElement('iframe');
		iframe.setAttribute('id', 'frameScript');
		document.body.appendChild(iframe);
		
		//通过getElementById访问iframeScript
		document.getElementById('iframeScript').contentWindow.createNewDiv();

		/**
		 * iframeScript中的createNewDiv函数
		 * 通过parent访问主页面
		 function createNewDiv() {
		     var newDiv = document.createElement('div');
			 parent.document.body.appendChild(newDiv);
		 }
		 */
	},
	scriptTag: function(url) {
	    document.write('<script type="text/javascript" src="' + url + '"><\/script>');   
	}
};

//ECMA5 方法扩展
(function(){
    //trim
	if (typeof String.prototype.trim === 'undefined') {
	    String.prototype.trim = function() {
		    return this.replace(/^\s+/, '');
		};
		/**
		 * 在进行长字符串处理时更快
		String.prototype.trim = function() {
		    this.replace(/^\s+/, '');
			for (var i = this.length - 1; i >= 0; i--) {
			    if (/\S/.test(this.charAt(i))) {
				    this = this.substring(0, i + 1);
					break;
				}
			}
			return this;
		}
		*/
	}
	
	// 获取函数名称
	Function.prototype.getName = function () {
	    return this.name || this.toString().match(/function\s*([^(]*)\)/)[1];
	};
})();










