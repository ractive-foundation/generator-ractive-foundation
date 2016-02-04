/* global Ractive */
Ractive<%= parent %>.extend({
	template: Ractive<%= parent %>.defaults.templates['<%= componentName %>'],
	isolated: true
});
