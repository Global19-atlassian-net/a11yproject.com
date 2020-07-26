/* jshint esversion: 5 */

// Copy email address ----------------------------------------------------------
function getEmailOnly(element) {
	var emailRegex = /^(?:mailto:?)([a-zA-Z0-9_\-.]+@[a-zA-Z0-9-]+\.[a-zA-Z\-.]{2,})(?:\?subject\=.*)?$/;
	return emailRegex.exec(element.getAttribute("href"))[1];
}

function getEmailElements() {
	return document.querySelectorAll("[data-mailto]");
}

function generateCopyEmailButton(element) {
	var email = getEmailOnly(element);
	var newEl = document.createElement("button");
	newEl.className = "c-copy-email-button";
	newEl.setAttribute("data-copy-email", true);
	newEl.setAttribute("type", "button");
	newEl.addEventListener("click", function(e) {
		navigator.clipboard.writeText(email).then(function () {
			console.log('successfully copied: "' + email + '"');
		}).catch(function (error) {
			console.error('failed to copy ' + email);
		});
	});
	newEl.innerText = "Copy";
	element.after(newEl);
}

function processEmailHrefs() {
	var emailElements = getEmailElements();
	emailElements.forEach(generateCopyEmailButton);
}

if (navigator && navigator.clipboard && navigator.permissions) {
	navigator.permissions.query({
		name: 'clipboard-write'
	}).then(function (permissionStatus) {
		// Will be 'granted', 'denied' or 'prompt':
		if (permissionStatus.state === "granted") {
			processEmailHrefs();
		}

		// Listen for changes to the permission state
		permissionStatus.onchange = function () {
			if (permissionStatus.state === "granted") {
				processEmailHrefs();
			}
		};
	});
}

// Store checklist status ---------------------------------------------------
function storeChecklistItems(item) {
	localStorage.setItem(item, 'checked');
}

function removeChecklistItems(item) {
	localStorage.removeItem(item);
}

function getChecklistItemVal(item) {
	return localStorage.getItem(item);
}

function checkChecklistExists(item) {
	return getChecklistItemVal(item) === 'checked';
}

function processChecklistClick(items) {
	items.forEach(function(element){
		element.addEventListener('change', function(event) {
			if (checkChecklistExists(event.target.id)) {
				removeChecklistItems(event.target.id)
			} else {
				storeChecklistItems(event.target.id);
			}
		});
	});
}

function renderLocalStorageItems(items) {
	items.forEach(function(element){
		if (checkChecklistExists(element.id)) {
			element.checked = true;
		}
	});
}

function processChecklist() {
	var checklistItems = document.querySelectorAll('.c-checklist__checkbox input[type="checkbox"]');
	renderLocalStorageItems(checklistItems);
	processChecklistClick(checklistItems);
}

processChecklist();
