var cards   = [];
var max     = 0;
var rest    = 0;
var percent = 0;
var color   = "";

$.ajax(
{
	url: 'https://steemmonsters.com/cards/get_details/',
	dataType: 'json',
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
	}
});

function w3_open()
{
	document.getElementById("nav").style.display = "block";
}

function w3_close()
{
	document.getElementById("nav").style.display = "none";
}

function showCard(id)
{
	let lvl = 0;

	function goodId(card)
	{
		return card.id === id;
	}

	card = cards.find(goodId);

	$("button").removeClass("w3-red");
	$("#"+id).toggleClass("w3-red");
	$("#max").text(card["maxcap"]);
	
	$("#smImage").attr("src","https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/"+card["name"]+"_lv"+card["maxlvl"]+".png")
	$("#now").text(card["total_printed"]);
	rest = card["maxcap"]-card["total_printed"];
	$("#rest").text(rest);
	percent = (rest/card["maxcap"]*100).toFixed(2);
	$("#percent").text(percent);
	if(percent <= 0)
	{
		$("#remaining").attr("class", "w3-text-black");
		$("#rest").html("<i class='w3-text-red fas fa-skull-crossbones w3-large'></i> This card will NEVER be printed again!");
		$("#percent").text(0);
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
	w3_close();
}
