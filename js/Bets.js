CargarCandidatos();
// START ADDRESSES
var address=[];
address[0] = candidatos[0].address; // FERNANDEZ
address[1] = candidatos[1].address; // MACRI
address[2] = candidatos[2].address; // LAVAGNA
address[3] = candidatos[3].address; // DEL CANO 
address[4] = candidatos[4].address; // Castiñeira
address[5] = candidatos[5].address; // ESPERT
address[6] = candidatos[6].address; // CENTURION
address[7] = candidatos[7].address; // BIONDINI
address[8] = candidatos[8].address; // FERIS

// END ADDRESSES

// START BETS
var bet_html = [];
bet_html[0] = bet_html[1] = bet_html[2] = bet_html[3] = bet_html[4] = bet_html[5] = bet_html[6] = bet_html[7] = bet_html[8] = "";
// END BETS

var addresses_query = address.join(",");

function api_callback(response) {
	var data = response.data;

	var balance = [];
	address.forEach((addr,index)=>{
		balance[index] = data && data.addresses[addr] ? data.addresses[addr].received : 0;
	});

	// array sum
	var total_balance_candidates = balance.reduce((a, b) => a + b, 0);

	var profit = 0.99;
	var satoshi = 100000000;

	var bet = [];
	address.forEach((addr,index)=>{
		bet[index] = total_balance_candidates != 0 ? ( total_balance_candidates / balance[index] ) * profit : 1;
	});

	bet.map((b,index)=>{ return b < 1 ? 1 : b });

	bet_html.forEach((b_html,index)=>{
		if(bet[index] != Infinity)
			bet_html[index] = bet[index].toFixed(2)+" X";
		else
			bet_html[index] = "-";
	});

	address.forEach((addr,index)=>{
		$(".bet"+address[index]).html(bet_html[index]);
		$(".balance"+address[index]).html(balance[index]/100000+" mBTC <br>vs<br> "+(total_balance_candidates-balance[index])/100000+" mBTC");
	});

	$(".candidatosContainer div.title").after("<div><strong>Pozo total: "+total_balance_candidates/100000+" mBTC</strong></div>")
}

api_promise = null;
function CargarBets() {
	api_promise = new Promise((resolve,reject)=>{
		$.getJSON("https://api.blockchair.com/bitcoin/dashboards/addresses/"+addresses_query)
		.done(resolve)
		.fail(reject);
	}).then(api_callback).catch(api_callback)
}
