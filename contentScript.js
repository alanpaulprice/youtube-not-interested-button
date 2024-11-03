function waitForChild(parent) {
	return new Promise((resolve) => {
		const observer = new MutationObserver((mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type === 'childList') {
					const desiredChild = parent.querySelector("tp-yt-iron-dropdown");
					if (desiredChild) {
						observer.disconnect();
						resolve(desiredChild);
						break;
					}
				}
			}
		});

		observer.observe(parent, { childList: true, subtree: true });
	});
}

function createNotInterestedButton(thumbnail) {
	const button = document.createElement('button');
	button.classList.add('not-interested-button');
	button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zM3 12c0 2.31.87 4.41 2.29 6L18 5.29C16.41 3.87 14.31 3 12 3c-4.97 0-9 4.03-9 9zm15.71-6L6 18.71C7.59 20.13 9.69 21 12 21c4.97 0 9-4.03 9-9 0-2.31-.87-4.41-2.29-6z" fill-rule="evenodd"></path></svg>';
	button.style.position = 'absolute';
	button.style.top = '0.5rem';
	button.style.left = '0.5rem';
	button.style.backgroundColor = 'var(--yt-spec-static-overlay-background-solid)';
	button.style.border = 'none';
	button.style.borderRadius = '0.25rem';
	button.style.padding = '0.5rem';
	button.style.cursor = 'pointer';
	button.style.zIndex = '1000';

	button.addEventListener('click', async (event) => {
		event.stopPropagation();

		const dropdownButton = thumbnail.nextElementSibling.nextElementSibling.childNodes[2].childNodes[0].childNodes[5];
		dropdownButton.click()

		const ytdPopupContainer = document.querySelector("body > ytd-app > ytd-popup-container")
		await waitForChild(ytdPopupContainer);

		const notInterestedButton = ytdPopupContainer.childNodes[3].childNodes[1].childNodes[1].childNodes[2].childNodes[6];
		notInterestedButton.click()

		ytdPopupContainer.querySelector("tp-yt-iron-dropdown").style.display = 'none';
		ytdPopupContainer.querySelector("tp-yt-iron-dropdown").setAttribute('aria-hidden', 'true');
	});

	return button;
}

function addButtonsToThumbnails() {
	const thumbnails = document.querySelectorAll('div#thumbnail:has(ytd-thumbnail)');
	thumbnails.forEach(thumbnail => {
		const existingButton = thumbnail.querySelector('.not-interested-button');
		if (!existingButton) {
			const button = createNotInterestedButton(thumbnail);
			thumbnail.style.position = 'relative';
			thumbnail.appendChild(button);
		}
	});
}

const observer = new MutationObserver(addButtonsToThumbnails);
observer.observe(document.body, { childList: true, subtree: true });

addButtonsToThumbnails();
