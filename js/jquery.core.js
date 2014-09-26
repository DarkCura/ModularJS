var CORE = {};
 
(function (context) {
    var moduleData = {};
 
    toString = function (anything) {
        return Object.prototype.toString.call(anything);
    };
 
    debug = true;
 
    context.debug = function (on) {
            debug = on ? true : false;
        };
    context.createModule = function (moduleID, creator) {
            if (typeof moduleID === 'string' && typeof creator === 'function') {
                temp = creator(Sandbox.create(this, moduleID));
                if (temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
                    temp = null;
                    moduleData[moduleID] = {
                        create: creator,
                        instance: null
                    };
                } else {
                    context.log(3, "Module '" + moduleID + "' Registration : FAILED : Instance has no init or destroy functions");
                }
            } else {
                context.log(3, "Module '" + toString(moduleID) + "' Registration : FAILED : One or more arguments are of incorrect type");
            }
        };
    context.start = function (moduleID) {
            var mod = moduleData[moduleID];
            if (mod) {
                mod.instance = mod.create(Sandbox.create(this, moduleID));
                mod.instance.init();
            }
        };
    context.startAll = function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    context.start(moduleID);
                }
            }
        };
    context.stop = function (moduleID) {
            var data;
            if (data = moduleData[moduleID] && data.instance) {
                data.instance.destroy();
                data.instance = null;
            } else {
                context.log(2, "Stop Module '" + moduleID + "' : FAILED : Module does not exist or has not been started");
            }
        };
    context.stopAll = function () {
            var moduleID;
            for (moduleID in moduleData) {
                if (moduleData.hasOwnProperty(moduleID)) {
                    context.stop(moduleID);
                }
            }
        };
    context.registerEvents = function (evts, mod) {
            if (this.isObj(evts) && mod) {
                if (moduleData[mod]) {
                    moduleData[mod].events = evts;
                } else {
                    context.log(2, "Module '" + toString(mod) + "' : FAILED : Module does not exist");
                }
            } else {
                context.log(3, "Module '" + toString(mod) + "' Register Events : FAILED : One or more arguments are of incorrect type");
            }
        };
    context.triggerEvent = function (evt) {
            var mod;
            for (mod in moduleData) {
                if (moduleData.hasOwnProperty(mod)) {
                    mod = moduleData[mod];
                    if (mod.events && mod.events[evt.type]) {
                        mod.events[evt.type](evt.data);
                    }
                }
            }
        };
    context.removeEvents = function (evts, mod) {
            if (this.isObj(evts) && mod && (mod == moduleData[mod]) && mod.events) {
                delete mod.events;
            }
        };
    context.log = function (severity, message) {
            if (debug) {
                console[(severity === 1) ? 'log' : (severity === 2) ? 'warn' : 'error'](message);
            } else {
                //SEND TO SERVER
            }
        };
    context.dom = {
            query: function (selector, ctx) {
                var ret = {},
                    that = this,
                    jqEls, i = 0;
 
                if (ctx && ctx.find) {
                    jqEls = ctx.find(selector);
                } else {
                    jqEls = jQuery(selector);
                }
 
                ret = jqEls.get();
                ret.length = jqEls.length;
                ret.query = function (sel) {
                    return that.query(sel, jqEls);
                };
                ret.first = function() {
                    if (jqEls) {
                        if (jqEls.length > 0) {
                            return jqEls.get(0);
                        }
                    }
 
                    return null;
                };
 
                return ret;
            },
            bind: function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).bind(evt, fn);
                } else {
                    context.log(3, "Element '" + toString(element) + "' : Event '" + toString(evt) + "' : Function '" + toString(fn) + "' : FAILED : One or more arguments are of incorrect type");
                }
            },
            unbind: function (element, evt, fn) {
                if (element && evt) {
                    if (typeof evt === 'function') {
                        fn = evt;
                        evt = 'click';
                    }
                    jQuery(element).unbind(evt, fn);
                } else {
                    context.log(3, "Element '" + toString(element) + "' : Event '" + toString(evt) + "' : Function '" + toString(fn) + "' : FAILED : One or more arguments are of incorrect type");
                }
            },
            create: function (el) {
                return document.createElement(el);
            },
            applyAttr: function (el, attrs) {
                jQuery(el).attr(attrs);
            }
        };
    context.isArray = function (arr) {
            return jQuery.isArray(arr);
        };
    context.isObject = function (obj) {
            return jQuery.isPlainObject(obj);
        };
})(CORE);
