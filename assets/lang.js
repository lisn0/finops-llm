/* Records an explicit language choice so the edge redirect honors it.
   When a visitor clicks the EN/ES/FR/DE/JA switcher we drop a long-lived `lang`
   cookie; worker.js reads it and stops auto-redirecting by Accept-Language. */
(function () {
	var LANGS = ['en', 'es', 'fr', 'de', 'ja'];
	document.addEventListener('click', function (e) {
		var a = e.target.closest ? e.target.closest('.langsw a[hreflang]') : null;
		if (!a) return;
		var lang = a.getAttribute('hreflang');
		if (LANGS.indexOf(lang) === -1) return;
		document.cookie = 'lang=' + lang + '; path=/; max-age=31536000; samesite=lax';
	});
})();
