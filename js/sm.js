$pseudo = ["clove71", "smalp", "spswhale", "aggroed", "tendershepard", "nateaguila", "yabapmatt", "cryptomancer", "brybro27"];
i       = 0;
$today  = Date.now();
weburl  = window.location.pathname;
$.ajax( // Prix du DEC & SPS
{
	url: 'https://prices.splinterlands.com/prices',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		$decPrice = datas.dec;
		$spsPrice = datas.sps;
		Stalk($pseudo[i]);
	}
});

function Stalk(pseudo)
{
	dataUser = new Object();
	$.ajax( // Data token splinterlands
	{
		url: 'https://api2.splinterlands.com/players/balances?username='+pseudo,
		dataType: 'json',
		type : 'GET',
		success: function(datas)
		{	
			dataUser.PSEUDO  = pseudo;
			if(datas.find(e => e.token === "SPS"))
				dataUser.SPS     = datas.find(e => e.token === "SPS").balance;
			if(datas.find(e => e.token === "SPSP"))
				dataUser.SPSP    = datas.find(e => e.token === "SPSP").balance;
			if(datas.find(e => e.token === "DEC"))
				dataUser.DEC     = datas.find(e => e.token === "DEC").balance;
			if(datas.find(e => e.token === "VOUCHER"))
				dataUser.VOUCHER = datas.find(e => e.token === "VOUCHER").balance;
			else
				dataUser.VOUCHER = 0;
			if(datas.find(e => e.token === "CHAOS"))
				dataUser.CHAOS   = datas.find(e => e.token === "CHAOS").balance;
			else
				dataUser.CHAOS = 0;
			console.log("Token IG "+pseudo);
			
			var settings = 
			{
				"url": "https://api.hive-engine.com/rpc/contracts",
				"method": "POST",
				"timeout": 0,
				"headers": 
				{
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				"data": JSON.stringify(
				{
					"jsonrpc": "2.0",
					"id": 1,
					"method": "find",
					"params": 
					{
						"contract" : "tokens",
						"table"    : "balances",
						"query"    : {"account" : pseudo},
						"limit"    : 100,
						"offset"   : 0,
						"indexes"  : []
					},
					"id" : 1
				}),
			};

			$.ajax(settings).done(function (response) // DATA hive-engine
			{
				console.log(response.result);
				if(response.result.find(e => e.symbol === "SPS"))
					dataUser.SPS     += parseFloat(response.result.find(e => e.symbol === "SPS").balance);
				if(response.result.find(e => e.symbol === "DEC"))
					dataUser.DEC     += parseFloat(response.result.find(e => e.symbol === "DEC").balance);
				if(response.result.find(e => e.symbol === "VOUCHER"))
					dataUser.VOUCHER += parseFloat(response.result.find(e => e.symbol === "VOUCHER").balance);
				if(response.result.find(e => e.symbol === "CHAOS"))
					dataUser.CHAOS   += parseFloat(response.result.find(e => e.symbol === "CHAOS").balance);

				$.ajax( // DATA power
				{
					url: 'https://api2.splinterlands.com/players/sps?username='+pseudo,
					dataType: 'json',
					type : 'GET',
					success: function(datas)
					{
						airdropDay = "";
						collection = 0;
						datas.airdrop.reverse().forEach(function(item)
						{
							if(airdropDay === "")
							{
								airdropDay = item.airdrop_day;
							}
							else
							{
								if(airdropDay === item.airdrop_day)
								{
									if(item.asset_symbol === "CARD")
									{
										collection += item.airdrop_points;
									}
								}
							}
						});

						dataUser.POWER = collection;
						dataUser.DATE  = $today;

						if(localStorage.getItem(pseudo) !== null)
						{
							View(dataUser);
							if((($today-JSON.parse(localStorage.getItem(pseudo)).DATE)/1000/60/60/24) >= 1)
							{
								localStorage.setItem(pseudo, JSON.stringify(dataUser));
							}
						}
						else
						{
							localStorage.setItem(pseudo, JSON.stringify(dataUser));
							View(dataUser);
						}

						if(i < $pseudo.length-1)
						{
							i++;
							Stalk($pseudo[i]);
						}
					}
				});
			});
		}
	});
}

function Change(qty, last, asset)
{
	let p = (qty-last);
	let v = "";
	if(p == 0)
	{
		return "";
	}
	else
	{
		if(asset === "dec")
		{
			v = "| "+(p*$decPrice).toFixed(2)+" $";
		}
		if(asset === "sps")
		{
			v = "| "+(p*$spsPrice).toFixed(2)+" $";
		}
		if(p < 0)
		{
			return "(<b class='w3-text-red'>"+p.toLocaleString()+" "+v+"</b>)";
		}
		else
		{
			return "(<b class='w3-text-teal'>+"+p.toLocaleString()+" "+v+"</b>)";
		}
	}
}

function View(info)
{
	last = JSON.parse(localStorage.getItem(info.PSEUDO));
	let pseudo = info.PSEUDO;
	if (info.PSEUDO === "smalp" || info.PSEUDO === "spswhale" || info.PSEUDO === "tendershepard")
		info.PSEUDO = info.PSEUDO+" (Aggroed)";
	$("#view").append(`<div class='w3-container w3-border w3-round-xlarge w3-gray w3-margin'><h3 class='w3-bottombar'>${info.PSEUDO}</h3>
		<div><img style="width:32px;" class="w3-image" src='https://s2.coinmarketcap.com/static/img/coins/64x64/11035.png'> SPS : ${info.SPS.toLocaleString()} ${Change(info.SPS,last.SPS, "sps")} || <a href="${weburl}tx.html?username=${pseudo}&token_type=SPS" target="_blank"><i class="fas fa-binoculars"></i> last tx</a></div>
		<div><img style="width:32px;" class="w3-image" src='https://s2.coinmarketcap.com/static/img/coins/64x64/11035.png'> SPS staked : ${info.SPSP.toLocaleString()} ${Change(info.SPSP,last.SPSP, "sps")}</div>
		<div><img style="width:32px;" class="w3-image" src='https://s2.coinmarketcap.com/static/img/coins/64x64/6264.png'> DEC : ${info.DEC.toLocaleString()} ${Change(info.DEC,last.DEC, "dec")}  || <a href="${weburl}tx.html?username=${pseudo}&token_type=DEC" target="_blank"><i class="fas fa-binoculars"></i> last tx</a></div>
		<div><img style="width:32px;" class="w3-image" src='https://d36mxiodymuqjm.cloudfront.net/website/icons/img_voucher_chaos-legion_200.png'> Voucher : ${info.VOUCHER.toLocaleString()} ${Change(info.VOUCHER,last.VOUCHER, "voucher")}  || <a href="${weburl}tx.html?username=${pseudo}&token_type=VOUCHER" target="_blank"><i class="fas fa-binoculars"></i> last tx</a></div>
		<div><img style="width:32px;" class="w3-image" src='https://i.imgur.com/wLuSPIt.png'> Packs Chaos Legion : ${info.CHAOS.toLocaleString()} ${Change(info.CHAOS,last.CHAOS, "chaos")}</div>
		<div><img style="width:32px;" class="w3-image" src='https://cdn.pixabay.com/photo/2020/04/03/07/07/comic-speech-bubbles-4997664_960_720.png'> Collection : ${info.POWER.toLocaleString()} ${Change(info.POWER,last.POWER, "power")}</div>
		</div>`);
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