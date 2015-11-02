/* globals Ractive, _ */

(function() {
    var options = {};
    options.el = document.querySelector('#container');
    options.template = Ractive.defaults.templates.test;
    options.data = {
        events: true
    };

    _.extend(options.components, Ractive.components);
    _.extend(options.computed, {
    });

    var ractive = new Ractive(options);

    ractive.on('thing', function(evt) {
    });

})();
