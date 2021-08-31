var cards   = [];
var prices  = [];
var rest    = 0;
var percent = 0;
var today   = Date.now();

$.ajax(
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

				card['price'] = prices.find(p => p.card_detail_id === card.id).low_price;
				card['onsal'] = prices.find(p => p.card_detail_id === card.id).qty;
				card['distribution'].forEach(function(dist)
				{
					if(card.tier == 4)
					{
						dist.edition = "4";
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
			$("#"+card.id).append("<td><img class='w3-image w3-round w3-grayscale-max' style='width:100%;max-width:100px' src='https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/"+card["name"]+"_lv"+card["maxlvl"]+".png'></td>");
			$("#"+card.id).append("<td><i class='far fa-circle w3-xlarge "+card.color+"'></i> <del><b class='w3-large'>"+card.name+"</b></del><br /><i class='fas fa-skull-crossbones w3-large'></i> <b>NEVER</b> be print again!<br />Supply <i class='fas fa-chart-line'></i> "+card.total_printed+"/<b>"+card.maxcap+"</b></td>");
		}
		else
		{
			$("#"+card.id).append("<td><img class='w3-image w3-round' style='width:100%;max-width:100px' src='https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/"+card["name"]+"_lv"+card["maxlvl"]+".png'></td>");
			$("#"+card.id).append("<td><p><i class='fas fa-dot-circle w3-xlarge "+card.color+"'></i> <b class='w3-large'>"+card.name+"</b></p><p><i class='fas fa-sync-alt'></i> "+card.rest+" remaining ("+percent+")</p>Supply <i class='fas fa-chart-line'></i> "+card.total_printed+"/<b>"+card.maxcap+"</b></td>");
		}
		$("#"+card.id).append("<td><b class='w3-row'><span class='w3-left'><i class='fas fa-level-down-alt' style='transform: rotate(-90deg);'></i> "+card.num+" BCX</span><span class='w3-right'>-"+card.numBurn+" BCX <i class='fas fa-level-up-alt' style='transform: rotate(-90deg);'></i></span></b><div class='w3-row w3-small w3-round w3-red w3-border'><div class='w3-light-green w3-col w3-container w3-center w3-round w3-border w3-border-black' style='width:"+(card.numPers)+"%;'>"+card.numPers+"%</div></div><br /><div class='w3-row w3-small w3-round w3-deep-orange w3-border'><div class='w3-amber w3-col w3-container w3-center w3-round w3-border w3-border-black' style='width:"+card.numGoldPers+"%;'>"+card.numGoldPers+"%</div></div><b class='w3-row'><span class='w3-left'><i class='fas fa-level-up-alt' style='transform: rotate(-270deg);'></i> "+card.numGold+" GOLD BCX</span><span class='w3-right'>-"+card.numGoldBurn+" GOLD BCX <i class='fas fa-level-down-alt' style='transform: rotate(-270deg);'></i></span></b></td>");
		$("#"+card.id).append("<td><b>"+card.price+"</b><i class='fas fa-dollar-sign'></i> / Card lvl 1<br />"+prixCard(card.price, getinfocard["pricecard"])+" "+percentCard(card.price, getinfocard["pricecard"])+"<br /><br /><i class='fas fa-shopping-cart'></i> <b>"+card.onsal+"</b> Cards, on the market.<br />"+qtyCard(card.onsal, getinfocard['qtycard'])+" "+percentCard(card.onsal, getinfocard['qtycard'])+"</td>");
	});
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
