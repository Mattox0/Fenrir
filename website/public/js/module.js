const modules = document.querySelectorAll('.case');
const overlay = document.querySelectorAll('.log-overlay');
const moduleSelectButton = document.querySelector('#btn-select');
const moduleUnselectButton = document.querySelector('#btn-unselect');

modules.forEach((module) => {
	module.addEventListener('click', onModule);
});
overlay.forEach((overlay) => {
	overlay.addEventListener('click', onOverlay);
})
moduleSelectButton.addEventListener('click', onSelectModuleButton);
moduleUnselectButton.addEventListener('click', onUnselectModuleButton);


function onModule(e) {
	let module = e.target;
	while (!module.classList.contains('module-check')) {
		module = module.parentNode;
	}
	if (module.firstElementChild.classList.contains('active')) {
		module.firstElementChild.classList.remove('active');
		module.firstElementChild.querySelector('i').style.display = 'none';
		module.parentNode.querySelector('.log-overlay').style.display = 'block';
	} else {
		module.firstElementChild.classList.add('active');
		module.firstElementChild.querySelector('i').style.display = 'block';
		module.parentNode.querySelector('.log-overlay').style.display = 'none';
	}
}

function onOverlay(e) {
	e.target.style.display = 'none';
	let parent = e.target.parentNode;
	parent.querySelector('.module-check').querySelector('.case').classList.add('active');
	parent.querySelector('.module-check').querySelector('.case').querySelector('i').style.display = 'block';
}

function onSelectModuleButton(e) {
	let modulesCheck = document.querySelectorAll('.module-check');
	modulesCheck.forEach((moduleCheck) => {
		if (!moduleCheck.querySelector('.case').classList.contains('active')) {
			moduleCheck.querySelector('input').checked = true;
			moduleCheck.querySelector('.case').classList.add('active');
			moduleCheck.querySelector('.case').querySelector('i').style.display = 'block';
			moduleCheck.parentNode.querySelector('.log-overlay').style.display = 'none';
		}
	})
}

function onUnselectModuleButton(e) {
	let modulesCheck = document.querySelectorAll('.module-check');
	modulesCheck.forEach((moduleCheck) => {
		if (moduleCheck.querySelector('.case').classList.contains('active')) {
			moduleCheck.querySelector('input').checked = false;
			moduleCheck.querySelector('.case').classList.remove('active');
			moduleCheck.querySelector('.case').querySelector('i').style.display = 'none';
			moduleCheck.parentNode.querySelector('.log-overlay').style.display = 'block';
		}
	})
}