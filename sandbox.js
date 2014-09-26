var Sandbox = {
    create: function(core, moduleSelector) {
        var CONTAINER = core.dom.query('#' + moduleSelector);
 
        return {
            find: function(selector) {
                return CONTAINER.query(selector);
            },
            addEvent: function(element, type, fn) {
                core.dom.bind(element, type, fn);
            },
            removeEvent: function(element, type, fn) {
                core.dom.unbind(element, type, fn);
            },
            notify: function(evt) {
                if (core.isObject(evt) && evt.type) {
                    core.triggerEvent(evt);
                }
            },
            listen: function(evts) {
                if (core.isObj(evts)) {
                    core.registerEvents(evts, moduleSelector);
                }
            },
            ignore: function(evts) {
                if (core.isArr(evts)) {
                    core.removeEvents(evts, moduleSelector);
                }
            },
            createElement: function(el, config) {
                // MOVE TO CORE
                var i, child, text;
                el = core.dom.create(el);
 
                if (config) {
                    if (config.children && core.isArr(config.children)) {
                        i = 0;
                        while (child = config.children[i]) {
                            el.appendChild(child);
                            i++;
                        }
                        delete config.children;
                    }
 
                    if (config.text) {
                        el.appendChild(document.createTextNode(config.text));
                        delete config.text;
                    }
 
                    core.dom.applyAttr(el, config);
                }
 
                return el;
            }
        }
    }
}
