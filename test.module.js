CORE.createModule('test', function(sandBox) {
    var targetElement;
 
    return {
        init : function () {
            targetElement = sandBox.find('#target').first();
 
            sandBox.addEvent(targetElement, 'click', this.tell);
        },
        destroy : function () {
            sandBox.removeEvent(targetElement, 'click', this.tell);
            targetElement = null;
        },
        tell : function (e) {
            targetElement.innerHTML = 'CLICKED';
        }
    };
});
 
window.addEventListener ?
    window.addEventListener('load', CORE.startAll, false) :
    window.attachEvent && window.attachEvent('onload', CORE.startAll)
