
module.exports = function flash(options) {
    return function (req, res, next) {
        req.flash = _flash;
        next();
    }
};

function _flash(type, msg) {
    if (this.session === undefined) throw Error('req.flash() requires sessions');
    var msgs = this.session.flash = this.session.flash || {};
    if (type && msg) {
        // write
        // Use Array.isArray instead of util.isArray to avoid deprecation warning
        if (Array.isArray(msg)) {
            msg.forEach(function (val) {
                (msgs[type] = msgs[type] || []).push(val);
            });
            return msgs[type].length;
        }
        (msgs[type] = msgs[type] || []).push(msg);
        return msgs[type].length;
    } else if (type) {
        // read
        var arr = msgs[type];
        delete msgs[type];
        return arr || [];
    } else {
        // read all
        this.session.flash = {};
        return msgs;
    }
}
