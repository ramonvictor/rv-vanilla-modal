exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',

	capabilities: {
		'browserName': 'chrome'
	},

	onPrepare: function(){
		/*
		 * Expose global variable pointing to `browser.driver`.
		 */
		global.dvr = browser.driver;
		/*
		 * Informe Protractor to not wait AngularJS.
		 */
		browser.ignoreSynchronization = true;
	},

	specs: ['test/*.spec.js'],

	jasmineNodeOpts: {
		showColors: true
	}
};