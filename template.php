<!DOCTYPE html>
<html>
  <head>
    <title>Analyze reward cards</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  </head>
  <body>
    <div class="w3-sidebar w3-bar-block w3-light-grey w3-card" style="width:300px">
      <a href="https://steemmonsters.com?ref=deadzy"><img class="w3-bar-item w3-image w3-dark-grey" src="https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/logo_untamed.png"></a>
      <h5 class="w3-bar-item w3-dark-grey"><i class="fas fa-list-ul"></i> Card reward</h5>
      <?= $tab; ?>
    </div>
    <div class="w3-container" style="margin-left:300px">
      <div class="w3-card-4 w3-dark-grey">
        <div class="w3-container w3-center">
          <h3><?= $nom ?></h3>
          <img class="w3-image" src="<?= $image ?>" alt="<?= $nom ?>"/>

          <div class="w3-section">
            <p><i class="far fa-clone"></i> Max cap : <b><?= $max ?></b></p>
            <p><i class="fas fa-chart-line"></i> Supply : <b><?= $now ?></b></p>
            <p class="<?= $color ?> w3-large"><i class="fas fa-sync-alt"></i> Remaining : <?= $rest ?> (<?= $percent ?>%)</p>
            <p><?= $err ?></p>
          </div>
        </div>
      </div>
      <div class="w3-container w3-padding-24" style="border:4px solid white">
        <h4 class="w3-right">Site made with love <i class="far fa-heart w3-text-red"></i> by <a href="https://steempeak.com/@deadzy">@deadzy</a>. You can support me with steems or by sending me cards you have in excess !</h4>
      </div>
    </div>
  </body>
</html>
