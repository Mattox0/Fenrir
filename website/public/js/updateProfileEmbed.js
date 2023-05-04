const inputEmbeds = document.querySelectorAll('input, textarea');

inputEmbeds.forEach(element => {
	element.addEventListener('input', inputOnChange);
});

function inputOnChange(e) {
	const id = e.target.id;
	const embedElement = document.querySelector(`p[embedid="${id}"], div[embedid="${id}"]`);
	if (!embedElement) return;
	['footer', 'description'].forEach((element) => {
		if (embedElement.className.includes(element)) embedElement.innerHTML = e.target.value;
		if (embedElement.className.includes(element) && e.target.value === '') embedElement.innerHTML = profile[e.target.getAttribute("name")];
	})
	switch (embedElement.className) {
		case 'embed-pseudo':
			embedElement.innerHTML = `<span class="code">Pseudo</span><i class="fr-arrow"></i> ${e.target.value}`;
			if (e.target.value === '' && profile.pseudo) embedElement.innerHTML = `<span class="code">Pseudo</span><i class="fr-arrow"></i> ${profile.pseudo}`;
			if (e.target.value === '' && !profile.pseudo) embedElement.innerHTML = ``;
			break;
		case 'embed-film':
			embedElement.innerHTML = `<span class="code">Film favori</span><i class="fr-arrow"></i> ${e.target.value}`;
			if (e.target.value === '' && profile.film) embedElement.innerHTML = `<span class="code">Film favori</span><i class="fr-arrow"></i> ${profile.film}`;
			if (e.target.value === '' && !profile.film) embedElement.innerHTML = ``;
			break;
		case 'embed-musique':
			embedElement.innerHTML = `<span class="code">Style musical</span><i class="fr-arrow"></i> ${e.target.value}`;
			if (e.target.value === '' && profile.musique) embedElement.innerHTML = `<span class="code">Style musical</span><i class="fr-arrow"></i> ${profile.musique}`;
			if (e.target.value === '' && !profile.musique) embedElement.innerHTML = ``;
			break;
		case 'embed-repas':
			embedElement.innerHTML = `<span class="code">Plat favori</span><i class="fr-arrow"></i> ${e.target.value}`;
			if (e.target.value === '' && profile.repas) embedElement.innerHTML = `<span class="code">Plat favori</span><i class="fr-arrow"></i> ${profile.repas}`;
			if (e.target.value === '' && !profile.repas) embedElement.innerHTML = ``;
			break;
		case 'embed-adjectifs':
			embedElement.innerHTML = `<span class="code">Personalité</span><i class="fr-arrow"></i> ${e.target.value}`;
			if (e.target.value === '' && profile.adjectifs) embedElement.innerHTML = `<span class="code">Personalité</span><i class="fr-arrow"></i> ${profile.adjectifs}`;
			if (e.target.value === '' && !profile.adjectifs) embedElement.innerHTML = ``;
			break;
		case 'embed-image':
			embedElement.style.backgroundImage = `url(${e.target.value})`;
			if (e.target.value === '' && profile.image) embedElement.style.backgroundImage = `url(${profile.image})`;
			if (e.target.value === '' && !profile.image) embedElement.style.backgroundImage = ``;
			break;
		case 'left-bar':
			if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(e.target.value)) {
				if (e.target.value.startsWith('#')) e.target.value = e.target.value.slice(1)
				embedElement.style.backgroundColor = `#${e.target.value}`
			} else {
				if (profile.couleur_hexa) embedElement.style.backgroundColor = `#${profile.couleur_hexa}`
				else embedElement.style.backgroundColor = `#6DB1BF`
			}
	}		
}