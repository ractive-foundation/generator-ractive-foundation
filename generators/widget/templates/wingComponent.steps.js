module.exports = function () {

	// Load standard world object to be 'this' in steps.
	this.World = require('../../world').World;
	require('../../support/steps').call(this);

	// Load shared library of step definitions. Use these first!
	require('../../support/steps').call(this);

	this.Before(function (callback) {

		this.widget = {};
		this.widget.container = '.<%= widgetName %> ';
		this.widget.dummy = this.widget.container + 'h2';

		callback();

	});

};
