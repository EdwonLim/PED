(function(window, undefined) {

    var packages = {};

    var eventManager = (function() {
        var cache = {};

        var Event = (function() {

            var evt = function(type, args, config) {
                this.type = type;
                this.args = args;
                this.config = config;
                this.keep = true;
            };

            evt.prototype = {
                stopEvent : function() {
                    this.keep = false;
                },
                release : function() {
                    this.keep = true;
                    fireEvent(this.type, this.args, this.config, this);
                }
            };

            return evt;
        })();

        var define = function (type) {
            cache[type] = {
                before : null,
                main : [],
                after : null
            };
        };

        var beforeEvent = function(type, fn) {
            var obj = cache[type];
            if (obj) {
                obj.before = fn;
                return true;
            }
            return false;
        };

        var addListener = function(type, fn, isOnce) {
            var obj = cache[type];
            if (obj) {
                obj.main.push({
                    fn : fn,
                    isOnce : !!isOnce
                });
                return true;
            }
            return false;
        };

        var afterEvent = function(type, fn) {
            var obj = cache[type];
            if (obj) {
                obj.after = fn;
                return true;
            }
            return false;
        };

        var fireEvent = function(type, args, config, event) {
            var obj = cache[type];
            if (obj) {
                var queue = obj.main, beforeFun = obj.before, afterFun = obj.after;
                if (beforeFun && beforeFun.apply && !(config.jump === false)) {
                    try {
                        beforeFun.apply(event, [event, args]);
                    } catch (exp) {}
                    config.jump = false;
                }
                if (event.keep) {
                    event.release = null;
                    for (var i = 0, l = queue.length; i < l; i ++) {
                        var fn = queue[i].fn, isOnce = queue[i].isOnce;
                        if (fn && fn.apply) {
                            try {
                                fn.apply(event, [event, args]);
                            } catch (exp) {}
                            if (isOnce) {
                                l --;
                                queue.splice(i, 1);
                            }
                        }
                    }
                }
                if (afterFun && afterFun.apply && event.keep) {
                    try {
                        afterFun.apply(event, [event, args]);
                    } catch (exp) {}
                }
            }
        };

        return {
            define : define,
            fireEvent : function(type, args, config) {
                config = config || {};
                return fireEvent(type, args, config, new Event(type, args, config));
            },
            beforeEvent : beforeEvent,
            addEventListener : addListener,
            afterEvent : afterEvent
        };
    })();

    var dataManager = (function() {
        var cache = {};

        var mergedResult = function(rs, r, isMerged) {
            for (var key in r) {
                if (rs[key]) {
                    if (isMerged) {
                        if (!rs[key].slice) {
                            rs[key] = [].concat(rs[key]);
                        }
                        rs[key] = rs[key].concat(r[key]);
                    } else {
                        rs[key] = r[key];
                    }
                } else {
                    rs[key] = r[key];
                }
            }
        };

        return {
            define : function(type, isMerged) {
                cache[type] = {
                    queue : [],
                    isMerged : !!isMerged
                };
            },
            value : function(type, args) {
                var obj = cache[type], rs = {};
                if (obj) {
                    var queue = obj.queue, isMerged = obj.isMerged;
                    for (var i = 0, l = queue.length; i < l; i ++) {
                        var fn = queue[i], r = {};
                        if (fn && fn.apply) {
                            try {
                                r = fn.apply({}, [args]);
                            } catch (exp) {}
                            mergedResult(rs, r, isMerged);
                        }
                    }
                }
                return rs;
            },
            calc : function(type, fn) {
                var obj = cache[type];
                if (obj) {
                    obj.queue.push(fn);
                    return true;
                }
                return false;
            }
        }
    })();

    var register = function(ns, maker) {
        var NSList = ns.split('.'), step = packages, k;
        while(k = NSList.shift()) {
            if (NSList.length) {
                if(step[k] === undefined){
                    step[k] = {};
                }
                step = step[k];
            } else {
                try {
                    step[k] = maker(packages, eventManager, dataManager);
                    return true;
                } catch (exp) {}
            }
        }
        return false;
    };

    window.PED = {
        register : register
    };

})(window);