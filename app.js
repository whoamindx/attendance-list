$('#form').submit(function(e){
	// Do not reload page
	e.preventDefault();
	// Take form data and save in LocalStorage
	const dataArray = $(this).serializeArray();
	let dataObject = {};
	dataObject.name = dataArray[0].value;
	dataObject.ramal = dataArray[1].value;
	dataObject.subject = dataArray[2].value;
	dataObject.data = new Date();
	dataObject = JSON.stringify(dataObject);
	localStorage.setItem((new Date()),dataObject);
	// Reset form
	this.reset();
	// Clears the div for the loop
	$('#cards').empty();
	// Repeat data in LocalStorage
	repeat();
})
let repeat = function(){
	let i = 0;
	for (x in localStorage){
		var y = JSON.parse(localStorage[x]);
		$('#cards').append(`<div class="card blue-grey darken-1" id="info-${i}">
										<div class="card-content white-text" style="overflow: hidden;">
											<span class="card-title">${y.name}</span>
											<p>${y.subject}</p>
										</div>
										<div class="card-action">
											<a href="#" onclick="event.preventDefault()">Ramal: ${y.ramal}</a>
											<a class="waves-effect waves-light btn" id="excluir" onclick="deleta('${y.data}')">Excluir</a>
											<a class="waves-effect waves-light btn" id="editar" onclick="edita('${y.data}','info-${i}','${y.ramal}')">Editar</a>
										</div>
									</div>`)
		i++;
	}
}
// Delete the data based on the key (date)
let deleta = function(date){
	let dataTratada = new Date(date);
	localStorage.removeItem(dataTratada);
	$('#cards').empty();
	repeat();
}

// Edit the data based on the key (date)
let edita = function(date,i,ramal){
	let dataTratada = new Date(date);

	let oldTitle = $("#"+i+' .card-title').html();
	$("#"+i+' .card-content .card-title').html(`<div class="input-field col s12">
																<input id="new-name" name="new-name" type="text" class="validate" value="${oldTitle}" required pattern="[A-Za-z]{3,}">
																<label for="new-name" data-error="Mínimo 3 caracteres" data-success="Ok"></label>
															</div>`);

	let oldSubject = $("#"+i+' .card-content p').html();
	$("#"+i+' .card-content p').html(`<div class="input-field col s12">
													<textarea id="new-subject" name="new-subject" class="materialize-textarea validate" required>${oldSubject}</textarea>
													<label for="new-subject"></label>
												</div>`);

	$("#"+i+' #excluir').remove();
	$("#"+i+' #editar').remove();
	$("#"+i+' .card-action').append(`<a class="waves-effect waves-light btn" id="editar" onclick="update('${dataTratada}','${ramal}')">Concluir</a>`);
	// repeat();
}

let update = function(data, ramal){
	let name = $('#new-name').val();
	let subject = $('#new-subject').val();
	let obj = {name: name, ramal: ramal, subject: subject, data: new Date(data)}
	obj = JSON.stringify(obj);
	localStorage.setItem(data, obj);
	$('#cards').empty();
	repeat();
}


// Backup
document.getElementById('backup').addEventListener("click",function(){
	for(let x in localStorage){
		document.getElementById('backup-code').value += "localStorage['"+x+"']="+JSON.stringify(localStorage[x])+";";
	}
});

// Import
document.getElementById('import').addEventListener("click",function(){
	let code = document.getElementById('import-code').value
	eval(code);
	$('#cards').empty();
	repeat();
	document.getElementById('import-code').value = "";
});


// Once you load the page, load the data
window.onload = () => repeat();
