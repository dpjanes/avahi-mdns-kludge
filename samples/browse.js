var browser = require('../index').browser;
browser({
}, function(error, d) {
    if (error) {
        console.log("#", error);
        return;
    }

    console.log("+", d);
});
