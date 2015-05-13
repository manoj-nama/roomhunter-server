exports.BufferedReader = function (buffer, encoding) {
    var newLineOctet = new Buffer("\n")[0];
    this.eachLine = function (func) {
        var line = [];
        for (var i = 0; i < buffer.length; i++) {
            if (buffer[i] == newLineOctet) {
                func(new Buffer(line).toString(encoding));
                line = [];
            } else {
                line.push(buffer[i]);
            }
        }
    };
    var start = 0;
    var end = buffer.length;
    this.readLine = function () {
        if (start >= end) return null;
        var line = [];
        for (; start < end; start++) {
            if (buffer[start] == newLineOctet) {
                break;
            } else {
                line.push(buffer[start]);
            }
        }
        start++;
        return new Buffer(line).toString(encoding);
    };
};