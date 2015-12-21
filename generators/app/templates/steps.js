/**
 *
 * var steps = require('../../../support/steps.js');
 * steps.call(this);
 *
 */
var _ = require('lodash-compat');
var helper = require('../node_modules/ractive-foundation/src/support/testHelpers');
var steps = require('../node_modules/ractive-foundation/src/support/steps');

module.exports = function () {

	steps();

	// add extra tests here
	this.Given(/^I have loaded plugin "([^"]*)" use case "([^"]*)"$/,
		function (plugin, useCase, callback) {
			this.client.loadPluginUseCase(plugin, useCase).then(function () {
				callback();
			});
		}
	);

};
