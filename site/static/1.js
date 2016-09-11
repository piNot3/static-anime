var links = document.getElementsByTagName("span");
for(var i in links) {
	links[i].onclick = function() {
		var next = this.nextSibling;
		if(next.toggle==undefined) {
			next.toggle = true;
		}
		if(next.toggle) {
			next.style.height = next.childElementCount*29+"px";
		} else {
			next.removeAttribute("style");
		}
		next.toggle = !next.toggle;
	};
};

/*
var b = function(a, b) {
	a = a.nextSibling;
	if(a.toggle==undefined) a.toggle = true;
	if(a.toggle) {
		a.style.height = b*29+55+"px";
	} else {
		a.removeAttribute("style");
	}
	a.toggle = !a.toggle;
*/