var cards   = [];
var prices  = [];
var rest    = 0;
var percent = 0;
var today   = Date.now();

$.ajax(
{
	url: 'https://steemmonsters.com/market/for_sale_grouped/',
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
		url: 'https://steemmonsters.com/cards/get_details/',
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

				if((card['maxcap']-card["total_printed"]) >= 1)
					$("#tab").append("<button id="+card['id']+" class='w3-bar-item w3-button' onclick='showCard("+card['id']+")'><i class='fas fa-dot-circle "+card["color"]+"'></i> "+card["name"]+"</button>");
				else
					$("#tab").append("<button id="+card['id']+" class='w3-bar-item w3-button' onclick='showCard("+card['id']+")'><i class='far fa-circle "+card["color"]+"'></i> <del class='w3-text-black'>"+card["name"]+"</del></button>");

			});
			showCard(79);
		}
	});
}

function w3_open()
{
	document.getElementById("nav").style.width = "100%";
	document.getElementById("nav").style.display = "block";
}

function w3_close()
{
	document.getElementById("nav").style.width = "300px";
	document.getElementById("nav").style.display = "none";
}

function showCard(id)
{
	price = prices.find(p => p.card_detail_id === id);
	card = cards.find(c => c.id === id);
	let ind = cards.lastIndexOf(card);

	if(localStorage.getItem(card['id']) === null)
	{
		let setinfocard = { idcard : id, pricecard : price['low_price'], qtycard : price['qty'], date : today};
		let setjsoncard = JSON.stringify(setinfocard);
		localStorage.setItem(id, setjsoncard);

		getinfocard = { pricecard : price['low_price'], qtycard : price['qty']};
	}
	else
	{
		getjsoncard = localStorage.getItem(id);
		getinfocard = JSON.parse(getjsoncard);

		if(((today-getinfocard['date'])/1000/60/60) >= 1)
		{
			let setinfocard = { idcard : id, pricecard : price['low_price'], qtycard : price['qty'], date : today};
			let setjsoncard = JSON.stringify(setinfocard);
			localStorage.setItem(id, setjsoncard);
		}
	}

	if(ind > 0)
	{
		$("#left").html("<button class='w3-button w3-left w3-hover-dark-grey w3-hover-text-black'><i onclick='showCard("+cards[ind-1]["id"]+")' class='w3-jumbo fas fa-arrow-alt-circle-left'></i></button>");
	}
	else
	{
		$("#left").html("");
	}
	if(ind < cards.length-1)
	{
		$("#right").html("<button class='w3-button w3-right w3-hover-dark-grey w3-hover-text-black'><i onclick='showCard("+cards[ind+1]["id"]+")' class='w3-jumbo fas fa-arrow-alt-circle-right'></i></button>");
	}
	else
	{
		$("#right").html("");
	}

	// menu selected
	$("button").removeClass("w3-red");
	$("#"+id).toggleClass("w3-red");

	card["distribution"].forEach(function(dist)
	{
		if(card.tier == 4)
		{
			dist.edition = "4";
		}
		
		if(dist.gold)
		{
			burnG = xptoBCX(dist.total_burned_xp, dist.gold, dist.edition, card.rarity, dist.num_burned);
			G = xptoBCX(dist.total_xp, dist.gold, dist.edition, card.rarity, dist.num_cards);
		}
		else
		{
			burnN = xptoBCX(dist.total_burned_xp, dist.gold, dist.edition, card.rarity, dist.num_burned);
			N = xptoBCX(dist.total_xp, dist.gold, dist.edition, card.rarity, dist.num_cards);
		}
	});
	$("#max").text(card["maxcap"]);
	$("#price").html(price['low_price']+"$ "+percentCard(price['low_price'], getinfocard["pricecard"]));
	$("#onsale").html(price['qty']+" "+qtyCard(price['qty'], getinfocard['qtycard'])+percentCard(price['qty'], getinfocard['qtycard']));
	$("#smImage").attr("src","https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/"+card["name"]+"_lv"+card["maxlvl"]+".png")
	$("#now").text(card["total_printed"]);
	rest = card["maxcap"]-card["total_printed"];
	$("#rest").html("<i class='fas fa-sync-alt'></i> "+rest);
	percent = (rest/card["maxcap"]*100).toFixed(2);
	$("#percent").text("("+percent+"%) remaining");
	if(percent <= 0)
	{
		$("#remaining").attr("class", "w3-text-black");
		$("#rest").html("<i class='fas fa-skull-crossbones w3-large'></i> This card will <b class='w3-text-red'>NEVER</b> be printed again!");
		$("#percent").text("");
	}
	else
	{
		if(percent < 5.01)
			$("#remaining").attr("class", "w3-text-red");
		else
		{
			if(percent > 5 && percent < 20.01)
				$("#remaining").attr("class", "w3-text-orange");
			else
				$("#remaining").attr("class", "w3-text-green");	
		}
	}
	perc = 0;
	$("#chartRBasicText").html("<i class='fas fa-level-down-alt' style='transform: rotate(-90deg);'></i> "+N+" BCX");
	$("#chartBBasicText").html("-"+burnN+" BCX <i class='fas fa-level-up-alt' style='transform: rotate(-90deg);'></i>");
	perc = (N/(N+burnN)*100).toFixed(0);
	$("#chartRBasic").width((perc-34)+"%");
	$("#chartRBasic").text(perc+"%");
	perc = 0;
	$("#chartRGoldText").html("<i class='fas fa-level-up-alt' style='transform: rotate(-270deg);'></i> "+G+" Gold BCX");
	$("#chartBGoldText").html("-"+burnG+" Gold BCX <i class='fas fa-level-down-alt' style='transform: rotate(-270deg);'></i>");
	perc = (G/(G+burnG)*100).toFixed(0);
	$("#chartRGold").width((perc-34)+"%");
	$("#chartRGold").text(perc+"%");

	w3_close();
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
			return "(<b class='w3-text-red'>"+p+"</b>)";
		}
		else
		{
			return "(<b class='w3-text-green'>+"+p+"</b>)";
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
