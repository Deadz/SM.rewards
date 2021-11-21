var cards   = [];
var prices  = [];
var rest    = 0;
var percent = 0;
var today   = Date.now();

$.ajax( // Prix de vente des cartes
{
	url: 'https://game-api.splinterlands.com/market/for_sale_grouped/',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		prices = datas.filter(obj => obj.edition == 3 && obj.gold == 0);
		getRewardCards();
	}
});

$.ajax( // Nombre de DEC dans la reward pool
{
	url: 'https://game-api.splinterlands.com/players/balances?players=$REWARD_POOL&token_type=DEC',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		rewardpool = parseInt(datas[0].balance);
	}
});

function getRewardCards()
{
	$.ajax(
	{
		url: 'https://game-api.splinterlands.com/cards/get_details/',
		dataType: 'json',
		type : 'GET',
		success: function(data)
		{
			cards = data.filter(d => d["editions"].search("3") > -1);
			cards.forEach(function(card)
			{
				//console.log(card);
				switch(card["rarity"])
				{
				  case 1:
				    card['color']  = "w3-text-gray";
				    card['maxcap'] = 400000;
				    card['maxlvl'] = 10;
				    break;
				  case 2:
				  	card['color']  = "w3-text-blue";
				  	card['maxcap'] = 100000;
				  	card['maxlvl'] = 8;
				  	break;
				  case 3:
				  	card['color']  = "w3-text-purple";
				  	card['maxcap'] = 40000;
				  	card['maxlvl'] = 6;
				    break;
				  default:
				  	card['color']  = "w3-text-amber";
				  	card['maxcap'] = 10000;
				  	card['maxlvl'] = 4;
				}
				if(prices.find(p => p.card_detail_id === card.id) != undefined) //Pour eviter les erreurs avec les ajouts de new rewards
				{
					card['price'] = prices.find(p => p.card_detail_id === card.id).low_price;
					card['onsal'] = prices.find(p => p.card_detail_id === card.id).qty;
				}
				else
				{
					card['price'] = 0;
					card['onsal'] = 0;
				}
				card['distribution'].forEach(function(dist)
				{
					if(card.tier == 4)
					{
						dist.edition = "4";
					}
					if(card.tier == 7)
					{
						dist.edition = "7";
						if(dist.gold)
						{
							card['numGoldBurn'] = dist.total_burned_xp;
							card['numGold'] = dist.total_xp-dist.total_burned_xp;
						}
						else
						{
							card['numBurn'] = dist.total_burned_xp;
							card['num'] = dist.total_xp-dist.total_burned_xp;
							card['maxcap'] = card['maxcap']*20; // New print rate
						}
					}

					if(dist.gold)
					{
						card['numGoldBurn'] = xptoBCX(dist.total_burned_xp, dist.gold, dist.edition, card.rarity, dist.num_burned);
						card['numGold'] = xptoBCX(dist.total_xp, dist.gold, dist.edition, card.rarity, dist.num_cards);
					}
					else
					{
						card['numBurn'] = xptoBCX(dist.total_burned_xp, dist.gold, dist.edition, card.rarity, dist.num_burned);
						card['num'] = xptoBCX(dist.total_xp, dist.gold, dist.edition, card.rarity, dist.num_cards);
					}
				});

				card['rest'] = card.maxcap-card.total_printed;

				card['numPers'] = (card.num/(card.num+card.numBurn)*100).toFixed(0);
				card['numGoldPers'] = (card.numGold/(card.numGold+card.numGoldBurn)*100).toFixed(0);

				if(card.rest > 0)
				{
					card['finish'] = false;
				}
				else
				{
					card['finish'] = true;
				}
			});
			showCard();
		}
	});
}

function showCard()
{
	cards.forEach(function(card)
	{
		if(localStorage.getItem(card.id) === null)
		{
			let setinfocard = { idcard : card.id, pricecard : card.price, qtycard : card.onsal, date : today};
			let setjsoncard = JSON.stringify(setinfocard);
			localStorage.setItem(card.id, setjsoncard);

			getinfocard = { pricecard : card.price, qtycard : card.onsal};
		}
		else
		{
			getjsoncard = localStorage.getItem(card.id);
			getinfocard = JSON.parse(getjsoncard);

			if(((today-getinfocard['date'])/1000/60/60) >= 1)
			{
				let setinfocard = { idcard : card.id, pricecard : card.price, qtycard : card.onsal, date : today};
				let setjsoncard = JSON.stringify(setinfocard);
				localStorage.setItem(card.id, setjsoncard);
			}
		}

		percent = (card.rest/card.maxcap*100).toFixed(2);

		if(percent > 0)
		{
			if(percent < 5.01)
				percent = "<b class='w3-text-red'>"+percent+"%</b>";
			else
			{
				if(percent > 5 && percent < 20.01)
					percent = "<b class='w3-text-orange'>"+percent+"%</b>";
				else
					percent = "<b class='w3-text-green'>"+percent+"%</b>";	
			}
		}

		$('tbody').prepend("<tr class='w3-text-black' id='"+card.id+"'></tr>");
		if(card.finish)
		{
			$("#"+card.id).append("<td><img class='w3-image w3-round w3-grayscale-max' style='width:100%;max-width:100px' src='https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/"+encodeURL(card["name"])+"_lv"+card["maxlvl"]+".png'><b style='writing-mode: vertical-rl; text-orientation: sideways-left;'>#"+card.id+"</b></td>");
			$("#"+card.id).append("<td><i class='far fa-circle w3-xlarge "+card.color+"'></i> <del><b class='w3-large'>"+card.name+"</b></del><br /><i class='fas fa-skull-crossbones w3-large'></i> <b>NEVER</b> be print again!<br />Supply <i class='fas fa-chart-line'></i> : <br />"+card.total_printed.toLocaleString()+"/<b>"+card.maxcap.toLocaleString()+"</b></td><td></td>");
		}
		else
		{
			$("#"+card.id).append("<td><img class='w3-image w3-round' style='width:100%;max-width:100px' src='https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/"+encodeURL(card["name"])+"_lv"+card["maxlvl"]+".png'><b style='writing-mode: vertical-rl; text-orientation: sideways-left;'>#"+card.id+"</b></td>");
			$("#"+card.id).append("<td><p><i class='fas fa-dot-circle w3-xlarge "+card.color+"'></i> <b class='w3-large'>"+card.name+"</b></p><p><i class='fas fa-sync-alt'></i> "+card.rest.toLocaleString()+" to print out.</p>Supply <i class='fas fa-chart-line'></i>  : <br />"+card.total_printed.toLocaleString()+"/<b>"+card.maxcap.toLocaleString()+"</b></td><td>("+percent+")</td>");
		}
		$("#"+card.id).append("<td><b class='w3-row'><span class='w3-left'><i class='fas fa-level-down-alt' style='transform: rotate(-90deg);'></i> "+card.num.toLocaleString()+" BCX</span><span class='w3-right'>-"+card.numBurn.toLocaleString()+" <i class='fas fa-fire'></i> BCX <i class='fas fa-level-up-alt' style='transform: rotate(-90deg);'></i></span></b><div class='w3-row w3-small w3-round w3-red w3-border'><div class='w3-light-green w3-col w3-container w3-center w3-round w3-border w3-border-black' style='width:"+(card.numPers)+"%;'>"+card.numPers+"%</div></div><br /><div class='w3-row w3-small w3-round w3-deep-orange w3-border'><div class='w3-amber w3-col w3-container w3-center w3-round w3-border w3-border-black' style='width:"+card.numGoldPers+"%;'>"+card.numGoldPers+"%</div></div><b class='w3-row'><span class='w3-left'><i class='fas fa-level-up-alt' style='transform: rotate(-270deg);'></i> "+card.numGold.toLocaleString()+" GOLD BCX</span><span class='w3-right'>-"+card.numGoldBurn.toLocaleString()+" GOLD <i class='fas fa-fire'></i> BCX <i class='fas fa-level-down-alt' style='transform: rotate(-270deg);'></i></span></b></td>");
		$("#"+card.id).append("<td><b>"+card.price+"</b><i class='fas fa-dollar-sign'></i> / Card lvl 1<br />"+prixCard(card.price, getinfocard["pricecard"])+" "+percentCard(card.price, getinfocard["pricecard"])+"<br /><br /><i class='fas fa-shopping-cart'></i> <b>"+card.onsal+"</b> Cards, on the market.<br />"+qtyCard(card.onsal, getinfocard['qtycard'])+" "+percentCard(card.onsal, getinfocard['qtycard'])+"</td>");
	});

 // DEC POOL
	if(localStorage.getItem(decpool) === null)
	{
		localStorage.setItem(decpool, rewardpool);
		changeDecpool = "";
	}
	else
	{
		oldrewardpool = localStorage.getItem(decpool);
		localStorage.setItem(decpool, rewardpool);
		changeDecpool = rewardpool-oldrewardpool;
		if(changeDecpool > 0)
		{
			changeDecpool = '(<b class="w3-text-green">+'+changeDecpool.toLocaleString()+'</b>)';
		}
		else
		{
			changeDecpool = '(<b class="w3-text-red">'+changeDecpool.toLocaleString()+'</b>)';
		}
	}

	$("#decpool").html('DEC pool : '+rewardpool.toLocaleString()+' '+changeDecpool+'<img src="https://s2.coinmarketcap.com/static/img/coins/32x32/6264.png" class="w3-image">');
}

function percentCard(price, last)
{
	let p = ((price-last)/last*100).toFixed(2);
	if(p == 0)
	{
		return "";
	}
	else
	{
		if(p < 0)
		{
			return "(<b class='w3-text-red'>"+p+"%</b>)";
		}
		else
		{
			return "(<b class='w3-text-green'>+"+p+"%</b>)";
		}
	}
}

function prixCard(qty, last)
{
	let p = (qty-last).toFixed(3);
	if(p == 0)
	{
		return "";
	}
	else
	{
		if(p < 0)
		{
			return "<b class='w3-text-red'>"+p+"</b><b>$</b>";
		}
		else
		{
			return "<b class='w3-text-green'>+"+p+"</b><b>$</b>";
		}
	}
}

function qtyCard(qty, last)
{
	let p = (qty-last).toFixed(0);
	if(p == 0)
	{
		return "";
	}
	else
	{
		if(p < 0)
		{
			return "<b class='w3-text-red'>"+p+"</b> <b>Cards</b>";
		}
		else
		{
			return "<b class='w3-text-green'>+"+p+"</b> <b>Cards</b>";
		}
	}
}

function xptoBCX(totalxp, gold, edition, rarity, supply)
{
	if(edition == 1 || edition == 3 || edition == 2)
	{
		if(!gold)
		{
			if(rarity == 1) xp = 15;
			if(rarity == 2) xp = 75;
			if(rarity == 3) xp = 175;
			if(rarity == 4) xp = 750;

			bcx = Math.floor(totalxp/xp+parseInt(supply));
		}
		else
		{
			if(rarity == 1) xp = 200;
			if(rarity == 2) xp = 400;
			if(rarity == 3) xp = 800;
			if(rarity == 4) xp = 2000;

			bcx = Math.floor(totalxp/xp);
		}
	}
	else if(edition == 0)
	{
		if(!gold)
		{
			if(rarity == 1) xp = 20;
			if(rarity == 2) xp = 100;
			if(rarity == 3) xp = 250;
			if(rarity == 4) xp = 1000;

			bcx = Math.floor(totalxp/xp+parseInt(supply));
		}
		else
		{
			if(rarity == 1) xp = 250;
			if(rarity == 2) xp = 500;
			if(rarity == 3) xp = 1000;
			if(rarity == 4) xp = 2500;
			
			bcx = Math.floor(totalxp/xp);			
		}
	}
	else
	{
		bcx = totalxp;
	}
	return parseInt(bcx);
}

function encodeURL(str)
{
	return encodeURIComponent(str).replace(/[!'()*]/g, function(c)
	{
   	return '%' + c.charCodeAt(0).toString(16);
  	});
}

// Menu sidebar

function w3_open()
{
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close()
{
  document.getElementById("mySidebar").style.display = "none";
}

/* 
   Willmaster Table Sort
   Version 1.1
   August 17, 2016
   Updated GetDateSortingKey() to correctly sort two-digit months and days numbers with leading 0.
   Version 1.0, July 3, 2011

   Will Bontrager
   https://www.willmaster.com/
   Copyright 2011,2016 Will Bontrager Software, LLC

   This software is provided "AS IS," without 
   any warranty of any kind, without even any 
   implied warranty such as merchantability 
   or fitness for a particular purpose.
   Will Bontrager Software, LLC grants 
   you a royalty free license to use or 
   modify this software provided this 
   notice appears on all copies. 
*/
//
// One placed to customize - The id value of the table tag.

var TableIDvalue = "cardreward";

//
//////////////////////////////////////
var TableLastSortedColumn = -1;
function SortTable() {
var sortColumn = parseInt(arguments[0]);
var type = arguments.length > 1 ? arguments[1] : 'T';
var dateformat = arguments.length > 2 ? arguments[2] : '';
var table = document.getElementById(TableIDvalue);
var tbody = table.getElementsByTagName("tbody")[0];
var rows = tbody.getElementsByTagName("tr");
var arrayOfRows = new Array();
type = type.toUpperCase();
dateformat = dateformat.toLowerCase();
for(var i=0, len=rows.length; i<len; i++) {
	arrayOfRows[i] = new Object;
	arrayOfRows[i].oldIndex = i;
	var celltext = rows[i].getElementsByTagName("td")[sortColumn].innerHTML.replace(/<[^>]*>/g,"");
	if( type=='D' ) { arrayOfRows[i].value = GetDateSortingKey(dateformat,celltext); }
	else {
		var re = type=="N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
		arrayOfRows[i].value = celltext.replace(re,"").substr(0,25).toLowerCase();
		}
	}
if (sortColumn == TableLastSortedColumn) { arrayOfRows.reverse(); }
else {
	TableLastSortedColumn = sortColumn;
	switch(type) {
		case "N" : arrayOfRows.sort(CompareRowOfNumbers); break;
		case "D" : arrayOfRows.sort(CompareRowOfNumbers); break;
		default  : arrayOfRows.sort(CompareRowOfText);
		}
	}
var newTableBody = document.createElement("tbody");
for(var i=0, len=arrayOfRows.length; i<len; i++) {
	newTableBody.appendChild(rows[arrayOfRows[i].oldIndex].cloneNode(true));
	}
table.replaceChild(newTableBody,tbody);
} // function SortTable()

function CompareRowOfText(a,b) {
var aval = a.value;
var bval = b.value;
return( aval == bval ? 0 : (aval > bval ? 1 : -1) );
} // function CompareRowOfText()

function CompareRowOfNumbers(a,b) {
var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
return( aval == bval ? 0 : (aval > bval ? 1 : -1) );
} // function CompareRowOfNumbers()

function GetDateSortingKey(format,text) {
if( format.length < 1 ) { return ""; }
format = format.toLowerCase();
text = text.toLowerCase();
text = text.replace(/^[^a-z0-9]*/,"");
text = text.replace(/[^a-z0-9]*$/,"");
if( text.length < 1 ) { return ""; }
text = text.replace(/[^a-z0-9]+/g,",");
var date = text.split(",");
if( date.length < 3 ) { return ""; }
var d=0, m=0, y=0;
for( var i=0; i<3; i++ ) {
	var ts = format.substr(i,1);
	if( ts == "d" ) { d = date[i]; }
	else if( ts == "m" ) { m = date[i]; }
	else if( ts == "y" ) { y = date[i]; }
	}
d = d.replace(/^0/,"");
if( d < 10 ) { d = "0" + d; }
if( /[a-z]/.test(m) ) {
	m = m.substr(0,3);
	switch(m) {
		case "jan" : m = String(1); break;
		case "feb" : m = String(2); break;
		case "mar" : m = String(3); break;
		case "apr" : m = String(4); break;
		case "may" : m = String(5); break;
		case "jun" : m = String(6); break;
		case "jul" : m = String(7); break;
		case "aug" : m = String(8); break;
		case "sep" : m = String(9); break;
		case "oct" : m = String(10); break;
		case "nov" : m = String(11); break;
		case "dec" : m = String(12); break;
		default    : m = String(0);
		}
	}
m = m.replace(/^0/,"");
if( m < 10 ) { m = "0" + m; }
y = parseInt(y);
if( y < 100 ) { y = parseInt(y) + 2000; }
return "" + String(y) + "" + String(m) + "" + String(d) + "";
} // function GetDateSortingKey()

