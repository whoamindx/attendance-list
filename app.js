$('#form').submit(function(){
	// Do not reload page
	event.preventDefault();
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
	for (x in localStorage){
		var y = JSON.parse(localStorage[x]);
		$('#cards').append(`<div class="card blue-grey darken-1">
										<div class="card-content white-text">
											<span class="card-title">${y.name}</span>
											<p>${y.subject}</p>
										</div>
										<div class="card-action">
											<a href="#" onclick="event.preventDefault()">Ramal: ${y.ramal}</a>
											<a class="waves-effect waves-light btn" onclick="deleta('${y.data}')">Excluir</a>
										</div>
									</div>`)
	}
}
// Delete the data based on the key (date)
let deleta = function(date){
	let dataTratada = new Date(date);
	localStorage.removeItem(dataTratada);
	$('#cards').empty();
	repeat();
}
// Once you load the page, load the data
window.onload = () => repeat();

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
