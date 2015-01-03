var showPassword = function(){
	var inputTags = document.getElementsByTagName("input");
	for(var i=0; i<inputTags.length; i++)
	{
		if(inputTags[i].getAttribute("type")==="password")
		{
			inputTags[i].setAttribute("type","text");
			inputTags[i].setAttribute("unmaskpasswordflag","1");
			inputTags[i].setAttribute("autocompleteorg",inputTags[i].getAttribute("autocomplete"));
			inputTags[i].setAttribute("autocomplete","off");
		}
	}
};

var hidePassword = function(){
	var inputTags = document.getElementsByTagName("input");
	for(var i=0; i<inputTags.length; i++)
	{
		if(inputTags[i].getAttribute("unmaskpasswordflag")==="1")
		{
			inputTags[i].setAttribute("type","password");
			if(inputTags[i].getAttribute("autocompleteorg") == "null")
			{
				inputTags[i].removeAttribute("autocomplete");
			}else{
				inputTags[i].setAttribute("autocomplete",inputTags[i].getAttribute("autocompleteorg"));
			}
			inputTags[i].removeAttribute("autocompleteorg");
			inputTags[i].removeAttribute("unmaskpasswordflag");
		}
	}
};

var showHidePassword = function(tabId){
	chrome.tabs.getSelected(null,function(tab) {
		var url = tab.url;
		if(url.match(/^https?:\/\/.+$/)){
			if(window.localStorage.getItem("showPassword")=="SHOW"){
				chrome.tabs.executeScript(tabId,{code:'(' + showPassword.toString() + ')()',allFrames:true},null);
			}else{
				chrome.tabs.executeScript(tabId,{code:'(' + hidePassword.toString() + ')()',allFrames:true},null);
			}
		}
	});
};

var setBrowserActionIcon = function(tabId){
	if(window.localStorage.getItem("showPassword")=="SHOW"){
		chrome.browserAction.setIcon({path:'img/ic_visibility_black_48dp.png'});
	}else{
		chrome.browserAction.setIcon({path:'img/ic_visibility_off_black_48dp.png'});
	}
};

var turnoverBrowserActionIcon = function(tabId){
	if(window.localStorage.getItem("showPassword")=="SHOW"){
		chrome.browserAction.setIcon({path:'img/ic_visibility_off_black_48dp.png'});
	}else{
		chrome.browserAction.setIcon({path:'img/ic_visibility_black_48dp.png'});
	}
};

var turnoverlocalStorageFlag = function(tabId){
	if(window.localStorage.getItem("showPassword")=="SHOW"){
		window.localStorage.setItem("showPassword","HIDE");
	}else{
		window.localStorage.setItem("showPassword","SHOW");
	}
};

setBrowserActionIcon();

chrome.browserAction.onClicked.addListener(
	function(tab){
		turnoverBrowserActionIcon();
		turnoverlocalStorageFlag();
		showHidePassword();
	}
);

chrome.tabs.onActivated.addListener(
	function(activeInfo){
		showHidePassword(activeInfo.tabId);
	}
);

chrome.tabs.onUpdated.addListener(
	function(tabId,changeInfo,tab){
		if(changeInfo.status=='complete')
		{
			showHidePassword(tabId);
		}
	}
);
