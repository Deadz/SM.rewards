$.ajax(
{
	url: 'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		btc_price = datas.market_data.current_price.usd;
	}
});

$.ajax(
{
	url: 'https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		eth_price = datas.market_data.current_price.usd;
	}
});

$(document).ready(function()
{
    $('#choicetoken').select2();
});

function gocalcule()
{
	coin = $('#choicetoken').val();
	numb = $('#numb').val();
	date = $('#date').val();
	date = date.split("-").reverse().join("-");
	$("[name='nbtoken']").text(numb);
	$.ajax(
	{
		url: 'https://api.coingecko.com/api/v3/coins/'+coin+'/history?date='+date,
		dataType: 'json',
		type : 'GET',
		success: function(datas)
		{
			if(typeof datas.market_data === 'undefined')
			{
				alert("Pas d'historique de prix suffisant pour "+coin+" à cette date !");
				return;
			}
			else
			{
				$('#rslt').removeClass(" w3-modal");
			}

			$('#tokenname').text(datas.name);
			$('img').prop('src', datas.image.small);

			// Prix lors de l'achat
			var $dolprice = datas.market_data.current_price.usd;
			var $btcprice = datas.market_data.current_price.btc;
			var $ethprice = datas.market_data.current_price.eth;

			$('#dolprice').html($dolprice.toFixed(2)+"<i class='fas fa-dollar-sign'></i>");
			$('#btcprice').html($btcprice.toFixed(6)+"<b>&#8383;</b>");
			$('#ethprice').html($ethprice.toFixed(6)+"<b>&#926;</b>");
			
			// Prix x le nombre de token
			var $tot_dolprice = $dolprice*numb;
			var $tot_btcprice = $btcprice*numb;
			var $tot_ethprice = $ethprice*numb;

			$('#totdolprice').html($tot_dolprice.toFixed(2)+"<i class='fas fa-dollar-sign'></i>");
			$('#totbtcprice').html($tot_btcprice.toFixed(6)+"<b>&#8383;</b>");
			$('#totethprice').html($tot_ethprice.toFixed(6)+"<b>&#926;</b>");

			// COIN TODAY
			$.ajax(
			{
				url: 'https://api.coingecko.com/api/v3/coins/'+coin+'?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false',
				dataType: 'json',
				type : 'GET',
				success: function(datas)
				{
					// Prix du token aujourd'hui
					$dolpricetoday = datas.market_data.current_price.usd;
					$btcpricetoday = datas.market_data.current_price.btc;
					$ethpricetoday = datas.market_data.current_price.eth;

					$('#dolpricetoday').html($dolpricetoday.toFixed(2)+"<i class='fas fa-dollar-sign'></i>");
					$('#btcpricetoday').html($btcpricetoday.toFixed(6)+" ("+($btcpricetoday*btc_price).toFixed(2)+"<i class='fas fa-dollar-sign'></i>)");
					$('#ethpricetoday').html($ethpricetoday.toFixed(6)+" ("+($ethpricetoday*eth_price).toFixed(2)+"<i class='fas fa-dollar-sign'></i>)");

					// Prix du jour x le nombre de token
					$tot_dolpricetoday = $dolpricetoday*numb;
					$tot_btcpricetoday = $btcpricetoday*numb;
					$tot_ethpricetoday = $ethpricetoday*numb;

					$('#totdolpricetoday').html($tot_dolpricetoday.toFixed(2)+"<i class='fas fa-dollar-sign'></i>");
					$('#totbtcpricetoday').html(($tot_btcprice*btc_price).toFixed(2)+"<i class='fas fa-dollar-sign'></i>");
					$('#totethpricetoday').html(($tot_ethprice*eth_price).toFixed(2)+"<i class='fas fa-dollar-sign'></i>");
				
					// Différence entre prix d'achat et prix du jour
					$diff_dol = ($tot_dolpricetoday-$tot_dolprice).toFixed(2);
					$diff_btc = ($tot_btcprice*btc_price-$tot_dolprice).toFixed(2);
					$diff_eth = ($tot_ethprice*eth_price-$tot_dolprice).toFixed(2);



					$diff_dolperc = ($diff_dol/$tot_dolprice*100).toFixed(2)
					$diff_btcperc = ($diff_btc/$tot_dolprice*100).toFixed(2)
					$diff_ethperc = ($diff_eth/$tot_dolprice*100).toFixed(2)

					if(($diff_dol) >= 0)
					{
						$('#pricetoday').removeClass("w3-bar w3-leftbar w3-border-red w3-pale-red").addClass("w3-bar w3-leftbar w3-border-green w3-pale-green");
						$('#gain').html("<b class='w3-text-green'>+"+$diff_dol+"$ (+"+$diff_dolperc+"%)");
					}
					else
					{
						$('#pricetoday').removeClass("w3-bar w3-leftbar w3-border-green w3-pale-green").addClass("w3-bar w3-leftbar w3-border-red w3-pale-red");
						$('#gain').html("<b class='w3-text-red'>"+$diff_dol+"$ ("+$diff_dolperc+"%)");
					}

					$('#nbbtc').html($tot_btcprice.toFixed(6)+"<b>&#8383;</b>");
					if(($diff_btc) >= 0)
					{
						$('#pricetodaybtc').removeClass("w3-bar w3-leftbar w3-border-red w3-pale-red").addClass("w3-bar w3-leftbar w3-border-green w3-pale-green");
						$('#gainbtc').html("<b class='w3-text-green'>+"+$diff_btc+"$ (+"+$diff_btcperc+"%)");
					}
					else
					{
						$('#pricetodaybtc').removeClass("w3-bar w3-leftbar w3-border-green w3-pale-green").addClass("w3-bar w3-leftbar w3-border-red w3-pale-red");
						$('#gainbtc').html("<b class='w3-text-red'>"+$diff_btc+"$ ("+$diff_btcperc+"%)");
					}

					$('#nbeth').html($tot_ethprice.toFixed(6)+"<b>&#926;</b>");
					if(($diff_btc) >= 0)
					{
						$('#pricetodayeth').removeClass("w3-bar w3-leftbar w3-border-red w3-pale-red").addClass("w3-bar w3-leftbar w3-border-green w3-pale-green");
						$('#gaineth').html("<b class='w3-text-green'>+"+$diff_eth+"$ (+"+$diff_ethperc+"%)");
					}
					else
					{
						$('#pricetodayeth').removeClass("w3-bar w3-leftbar w3-border-green w3-pale-green").addClass("w3-bar w3-leftbar w3-border-red w3-pale-red");
						$('#gaineth').html("<b class='w3-text-red'>"+$diff_eth+"$ ("+$diff_ethperc+"%)");
					}
				}
			});
			// FIN COIN TODAY
		},
		error: function(datas)
		{
			console.log(datas);
		}
	});

}