document.getElementsByTagName("a")[1].onclick = function() {
	this.className ="back active";
	setTimeout(function(){
		if(document.referrer.includes("127")) {
			window.history.back()
		} else {
			window.location = "/" + window.location.pathname.split("/")[1]
		}
	},300);
	return false;
}