<?php

if(!isset($_GET['carte']))
{
	$carte = 79;
}
else
{
	$carte = (int)$_GET['carte'];
}

$json = file_get_contents("https://steemmonsters.com/cards/get_details/");
$allCards = json_decode($json, true);
$tab = "";
$err = "";
if(array_search($carte, array_column($allCards, 'id')) === null)
{
	$err   = "<div class='w3-panel w3-pale-red w3-border w3-round-large'><h5><i class='fas fa-exclamation-triangle'></i> Alert!</h5><p>This id: <b>(".$carte.")</b>, doesn't exist! Like unicorns, so try something else.</p></div>";
	$carte = 89;
}

foreach ($allCards as $key => $monster) 
{
	if($monster['distribution'][0]["edition"] == 3)
	{
		if($monster['id'] == $carte)
		{
			$tab .= "<a href='http://localhost/sm/index.php?carte=".$monster['id']."' class='w3-bar-item w3-button w3-red'>".$monster['name']." (".$monster['id'].")</a>";
		}
		else
		{
			$tab .= "<a href='http://localhost/sm/index.php?carte=".$monster['id']."'  class='w3-bar-item w3-button'>".$monster['name']." (".$monster['id'].")</a>";
		}
	}
	if($monster["id"] == $carte)
	{
		foreach ($monster["distribution"] as $mInfo)
		{
			if($monster['distribution'][0]["edition"] != 3)
			{
				$err = "<div class='w3-panel w3-pale-red w3-border w3-round-large'><h5><i class='fas fa-exclamation-triangle'></i> Alert!</h5><p>This card is not a reward card, so the data displayed will be irrelevant</p></div>";
			}
		}
		$image = 'https://d36mxiodymuqjm.cloudfront.net/cards_beta/'.$monster['name'].'.png';
		$nom   = "<b>".$monster['name']."</b> (".$monster['id'].")";

		switch ($monster["rarity"])
		{
			case '1':
				$max = 400000;
				break;

			case '2':
				$max = 100000;
				break;

			case '3':
				$max = 40000;
				break;

			case '4':
				$max = 10000;
				break;
			
			default:
				# code...
				break;
		}
		$now = $monster['total_printed'];
		$rest = $max-$now;
		$percent = round($rest/$max*100, 2);
		if($percent < 6)
		$color = "w3-text-red";
		elseif ($percent > 5 && $percent < 20)
		$color = "w3-text-orange";
		else
		$color = "w3-text-green";
	}
}
require('template.php');