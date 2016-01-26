/* globals Ractive, _ */

(function() {
	var options = {
		el: document.querySelector('#container'),
		template: Ractive.partials.base,
		components: Ractive.components,
		data: {
			events: true
		},
		computed: {
		}
	};

	var ractive = new Ractive(options);

	ractive.on('thing', function(evt) {
	});

})();
