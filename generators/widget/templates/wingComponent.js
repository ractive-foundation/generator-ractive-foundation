/* global Ractive */
var Widget = function (options) {

	options.template = Ractive.defaults.templates['<%= widgetName %>'];

	this.ractive =  new Ractive(options);

};

Widget.prototype.someMethod = function() {
};
