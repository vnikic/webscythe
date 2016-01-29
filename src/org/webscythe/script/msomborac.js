var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("http://www.blic.rs/", {javascriptenabled:false});

w.evaluate(function() {
    document.location.href = document.querySelectorAll("#blic_naslovna_print")[1].href;
});

for (var i = 1; i <= 1; i++) {
    var imgUrl = w.evaluate(function() {
        return document.querySelector(".mainPhotoImg").src;
    });
    w.download(imgUrl, "c:/temp/webscythe/somborac" + i + ".jpg");
}
