var linksWithHref = document.querySelectorAll("a[href]");
for(var i in linksWithHref) {
    linksWithHref[i].onclick = function() {
        this.className = "active";
        redirect(this.href);
        return false;
    };
}

function redirect(path) {
    setTimeout(function(){ location.href = path }, 300);
}

var linksToExpand = document.querySelectorAll("span");
for(var n in linksToExpand) {
    linksToExpand[n].onclick = function() {
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
}

document.querySelector("a.back").onclick = function() {
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