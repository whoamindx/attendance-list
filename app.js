$('#form').submit(function(e){
	// Do not reload page
	e.preventDefault();
	// Take form data and save in LocalStorage
	const dataArray = $(this).serializeArray();
	let dataObject = {};
	dataObject.name = dataArray[0].value;
	dataObject.ramal = dataArray[1].value;
	dataObject.subject = dataArray[2].value;
	dataObject.date = new Date();
	dataObject = JSON.stringify(dataObject);
	
	// Key: receberá o indice(key) do último card no localStorage
	let key;
	for(let index = 0; localStorage.length > index; index++){
		if(localStorage.length - 1 == index){
			// Recebe todas as keys do localStorage
			const allKeys = Object.keys(localStorage)
			let storageIndice = localStorage.length - 1
			key = Number(allKeys[storageIndice])
		}
	}
	
	(typeof key != "undefined") ?
		// Adiciona o novo card com a key baseada na key do card anterior
		localStorage.setItem(key + 1, dataObject)
	:
		localStorage.setItem(0, dataObject)

	// Reset form
	this.reset();
	// Clears the div for the loop
	$('#cards').empty();
	// Repeat data in LocalStorage
	repeat();
});

let repeat = () => {
	let i = 0;
	for (key in localStorage){
		const card = JSON.parse(localStorage[key]);
		$('#cards').append(
			`<div class="card blue-grey darken-1" id="info-${i}">
				<div class="card-content white-text" style="overflow: hidden;">
					<span class="card-title">${card.name}</span>
					<p>${card.subject}</p>
				</div>
				<div class="card-action">
					<a href="#" onclick="event.preventDefault()">Ramal: ${card.ramal}</a>
					<a class="waves-effect waves-light btn" id="excluir" onclick="deleta(${key})">Excluir</a>
					<a class="waves-effect waves-light btn" id="editar" onclick="edita(${key},'info-${i}','${card.ramal}')">Editar</a>
				</div>
			</div>`
		)
		i++;
	}
};

// Delete the data based on the key (date)
let deleta = (keyCard) => {
	localStorage.removeItem(keyCard);
	$('#cards').empty();
	repeat();
}

// Edit the data based on the key (date)
let edita = (key, i, ramal) => {
	let oldTitle = $(`#${i} .card-title`).html();
	$(`#${i} .card-content .card-title`).html(`
		<div class="input-field col s12">
			<input id="new-name" name="new-name" type="text" class="validate" value="${oldTitle}" required pattern="[A-Za-z]{3,}">
			<label for="new-name" data-error="Mínimo 3 caracteres" data-success="Ok"></label>
		</div>`
	);

	let oldSubject = $(`#${i} .card-content p`).html();
	$(`#${i} .card-content p`).html(
		`<div class="input-field col s12">
			<textarea id="new-subject" name="new-subject" class="materialize-textarea validate" required>${oldSubject}</textarea>
			<label for="new-subject"></label>
		</div>`
	);

	$(`#${i} #excluir`).remove();
	$(`#${i} #editar`).remove();
	$(`#${i} .card-action`).append(`
		<a class="waves-effect waves-light btn" id="editar" onclick="update('${key}','${ramal}')">Concluir</a>
	`);
	// repeat();
}

let update = (key, ramal) => {
	let name = $('#new-name').val();
	let subject = $('#new-subject').val();
	let newCard = {
		name: name, 
		ramal: ramal, 
		subject: subject, 
		date: new Date()
	}
	newCard = JSON.stringify(newCard);
	localStorage.setItem(key, newCard);
	$('#cards').empty();
	repeat();
}

// Backup
document.getElementById('backup').addEventListener("click", () => {
	for(let x in localStorage){
		document.getElementById('backup-code').value += "localStorage['"+x+"']=" + JSON.stringify(localStorage[x]) + ";";
	}
});

// Import
document.getElementById('import').addEventListener("click", () => {
	let code = document.getElementById('import-code').value;
	eval(code);
	$('#cards').empty();
	repeat();
	document.getElementById('import-code').value = "";
});

// Once you load the page, load the data
window.onload = () => repeat();