var links = document.querySelectorAll("a");
for(var i in links) {
	links[i].onclick = function() {
		this.className = "active";
		redirect(this.href);
		return false;
	};
}
function redirect(path) {
	setTimeout(function(){ location.href = path }, 300);
}