var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow();

var someFunc = function() {
    return Math.PI * 2;
};

var test1 = w.evaluate(function(k) {
    var x = k * 2;
    return x + 11;
}, someFunc());
sys.println("test1 = " + (test1 * 2.22));

var test2 = w.evaluate(function(s1, s2) {
    return s1 + " - " + s2.value;
}, "mama", {key:"KIKI22", value:456.34});
sys.println(test2);

var test3 = w.evaluate(function(arr) {
    var sum = 0.0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}, [1, 3, 5, 7, 9, 11]);
sys.println(test3);

var test4 = w.evaluate(function(arr) {
    arr.push("ququ");
    arr.push("sasa");
    arr.push("MACA");
    return arr;
}, ["a", "b"]);
sys.println("test4[4] = " + test4[4]);

var test5 = w.evaluate(function(o) {
    o.sasa = "Magarac";
    return o;
}, {koja:"petar", mica:[1, 2, 3, 4], sajko: 123.222});
sys.println("test5 = " + test5);
sys.log(test5);
sys.println("test5 = " + JSON.stringify(test5));
sys.println("test5.sasa = " + test5.sasa);

w.evaluate(function() {
    fff = function() {
        return "zvekan";
    }
});
sys.println(w.evaluate(function() {
    return fff();
}));

sys.println("1. " + parseInt("10"));
sys.println("2. " + parseInt(12.32));
sys.println("3. " + parseInt("aaa"));
