/*global Ractive, superagent*/
setTimeout(function() {
	var hash = window.location.hash.match(/\/components\/([^\/]+)\/use-cases\/([^\/]+).json/);
	var name = hash[1];
	var useCase = hash[2];
	var url = ['/components/', name, '/use-cases/', useCase, '.json'];

	if (document.querySelector instanceof Function) {
		var title = document.querySelector('head title');
		title.innerHTML = name + ' / ' + useCase + ' - ' + title.innerHTML;
	}

	superagent.get(url.join(''), function (err, res) {
		var data = res.body && res.body.data || {},
			config = {
				el: '#childComponent',
				data: function () {
					return _.extend(data, {
						isDataModel: true
					});
				}
			};
		console.log('data', res);
		if (res.body && res.body.template) {
			console.log('templates', Ractive.defaults.templates);
			config.template = Ractive.defaults.templates[res.body.template];
			window.currentComponent = new Ractive(config);
		} else {
			window.currentComponent = new Ractive.components[name](config);
		}

	});
}, 100);
