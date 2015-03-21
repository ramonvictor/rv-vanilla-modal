var visibleClass = 'rv-vanilla-modal-is-open';

describe('rv-vanilla-modal:open', function() {

	beforeEach(function(){
		browser.get('http://localhost:8080');
	});

	it('should show modal', function() {
		var modalTrigger = dvr.findElement(by.css('[data-rv-vanilla-modal]'));
		var modal = dvr.findElement(by.css(modalTrigger.getAttribute('data-rv-vanilla-modal')));

		// Trigger open modal button
		modalTrigger.click();

		// Wait animation
		dvr.sleep(600);

		// Expectations
		expect(modal.getAttribute('class'))
			.toContain(visibleClass);

		expect(modal.isDisplayed())
			.toBeTruthy();
	});
});

describe('rv-vanilla-modal:close', function() {
	it('should close modal', function() {
		var visibleModal = dvr.findElement(by.css('.rv-vanilla-modal-is-open'));
		var closeBtn = visibleModal.findElement(by.css('.rv-vanilla-modal-close'));

		// Trigger close modal
		closeBtn.click();

		// Wait animation
		dvr.sleep(600);

		expect(visibleModal.getAttribute('class'))
			.not.toContain(visibleClass);

		expect(visibleModal.isDisplayed())
			.toBeFalsy();
	});
});