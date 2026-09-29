const form = document.getElementById('contact-form');
if (form) {
	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		const status = document.getElementById('contact-status');
		const button = form.querySelector('button[type="submit"]');
		status.textContent = 'Sending…';
		button.disabled = true;
		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(new FormData(form)),
			});
			const result = await response.json();
			if (!response.ok || !result.ok) throw new Error('Delivery unavailable');
			status.textContent = 'Message sent. Thank you — we will reply by email.';
			form.reset();
		} catch {
			status.textContent = 'We could not send your message. Please try again later, book a call, or email us directly.';
		} finally { button.disabled = false; }
	});
}
