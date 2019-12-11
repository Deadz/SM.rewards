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
		cards = data;
		cards.forEach(function(card)
		{
			if(card["editions"].search("3") > -1)
			{
				switch(card["rarity"])
				{
				  case 1:
				    color = "w3-text-gray";
				    max = 400000;
				    break;
				  case 2:
				  	color = "w3-text-blue";
				  	max = 100000;
				  	break;
				  case 3:
				  	color = "w3-text-purple";
				  	max = 40000;
				    break;
				  default:
				  	color = "w3-text-amber";
				  	max = 10000;
				}
				if((max-card["total_printed"]) >= 1)
					$("#tab").append("<button id="+card['id']+" class='w3-bar-item w3-button' onclick='showCard("+card['id']+")'><i class='far fa-circle "+color+"'></i> "+card["name"]+"</button>");
				else
					$("#tab").append("<button id="+card['id']+" class='w3-bar-item w3-button' onclick='showCard("+card['id']+")'><i class='far fa-circle "+color+"'></i> <del>"+card["name"]+"</del></button>");

			}
		});
	}
});

function showCard(id)
{
	$("button").removeClass("w3-red");
	$("#"+id).toggleClass("w3-red");
	$("#name").text(cards[id-1]["name"]);
	$("#smImage").attr("src","https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/"+cards[id-1]["name"]+"_lv"+cards[id-1].stats.abilities.length+".png")
	switch(cards[id-1]["rarity"])
	{
	  case 1:
	    $("#max").text("400000");
	    max = 400000;
	    break;
	  case 2:
	  	$("#max").text("100000");
	  	max = 100000;
	  	break
	  case 3:
	  	$("#max").text("40000");
	  	max = 40000;
	    break;
	  default:
	  	$("#max").text("10000");
	  	max = 10000;
	}
	$("#now").text(cards[id-1]["total_printed"]);
	rest = max-cards[id-1]["total_printed"];
	$("#rest").text(rest);
	percent = (rest/max*100).toFixed(2);
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
}
