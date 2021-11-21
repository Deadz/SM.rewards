// Menu sidebar

function w3_open()
{
  document.getElementById("mySidebar").style.display = "block";
}

function w3_close()
{
  document.getElementById("mySidebar").style.display = "none";
}

String.prototype.capitalize = function()
{
   return this.charAt(0).toUpperCase() + this.slice(1);
}

const queryString = window.location.search;
const weburl      = window.location.pathname;
const urlParams = new URLSearchParams(queryString);
const username  = urlParams.get('username');
const tokentyp  = urlParams.get('token_type');

$.ajax(
{
  url: 'https://api2.splinterlands.com/players/balance_history?username='+username+'&token_type='+tokentyp,
  dataType: 'json',
  type : 'GET',
  crossDomain: true,
  success: function(datas)
  {
    $("#viewh1").append(`<b>${username.capitalize()}</b>'s transactions (${tokentyp})`);
    datas.forEach((element) =>
    {
      console.log(element);
      day  = new Date(element.created_date);
      dayz = new Date(Date.now());
      dayz.setDate(dayz.getDate()-1);
      console.log(day);
      element.player = element.player.capitalize();

      if(dayz <= day)
      {
        day = `<u><i>${day.toLocaleString()}</i></u>`;
      }
      else
      {
        day = `<i>${day.toLocaleString()}</i>`;
      }

      if(element.counterparty === "sl-hive" || element.counterparty === "steem-eng" || element.counterparty === "sl-bsc" || element.counterparty === "sl-eth" || element.counterparty === "sl-wax")
        element.counterparty = "(WALLET) "+element.counterparty;
      else
        element.counterparty = "<a href='"+weburl+"?username="+element.counterparty+"&token_type="+tokentyp+"'>"+element.counterparty.capitalize()+"</a>";

      switch (element.type)
      {
        case 'voucher_drop': // Airdrop voucher
          $("#view").append(`<li class="w3-padding-small w3-pale-yellow">
          ${day} <i class="fas fa-circle"></i> <b>${element.player}</b> recieved <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(airdropped)</b>
          </li>`);
        break;
        case 'token_transfer': // Token transfer
          if(element.amount > 0)
          {
            $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-long-arrow-alt-up"></i>
            <i>${day.toLocaleString()}</i> - <b>${element.player}</b> recieved <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} from <b>${element.counterparty}</b>
            </li>`);
          }
          else
          {
            $("#view").append(`<li class="w3-padding-small w3-pale-red"><i class="fas fa-long-arrow-alt-down"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> send <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} to <b>${element.counterparty}</b>
          </li>`);
          }
        break;
        case 'purchase_cl_presale_pack_voucher': // Buy pack (VOUCHER)
          $("#view").append(`<li class="w3-padding-small w3-khaki"><i class="fas fa-fire"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> paid <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} for <b>card pack</b>
          </li>`);
        break;
        case 'purchase_cl_presale_pack': // Buy pack (SPS)
          $("#view").append(`<li class="w3-padding-small w3-khaki"><i class="far fa-circle"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> paid <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} for <b>card pack</b>
          </li>`);
        break;
        case 'claim_staking_rewards': // SPS claim
          $("#view").append(`<li class="w3-padding-small w3-pale-blue"><i class="far fa-circle"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> claim <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} for <b>(staking)</b>
          </li>`);
        break;
        case 'token_award': // SPS airdrop
          $("#view").append(`<li class="w3-padding-small w3-pale-yellow"><i class="far fa-circle"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> recieved <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(airdropped)</b>
          </li>`);
        break;
        case 'stake_tokens': // SPS stake
          $("#view").append(`<li class="w3-padding-small w3-lime"><i class="fas fa-gem"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> stake <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp}
          </li>`);
        break;
        case 'token_unstaking': // SPS UNSTAKE
          $("#view").append(`<li class="w3-padding-small w3-orange"><i class="fas fa-bolt"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> unstake <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp}
          </li>`);
        break;
        case 'tournament_prize': // Price tournament
          $("#view").append(`<li class="w3-padding-small w3-light-grey"><i class="fas fa-award"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> recieved <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(tournament prize)</b>
          </li>`);
        break;
        case 'enter_tournament': // Tournament fee
          $("#view").append(`<li class="w3-padding-small w3-light-grey"><i class="far fa-circle"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> paid <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(tournament fee)</b> 
          </li>`);
        break;
        case 'rental_payment_fees': // Rental fee
          $("#view").append(`<li class="w3-padding-small w3-light-grey"><i class="fas fa-funnel-dollar"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> paid <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Rental fee)</b> 
          </li>`);
        break;
        case 'rental_payment': // Rental payement +
          $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> earn <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Rental payment)</b> 
          </li>`);
        break;
        case 'market_rental': // Rental payement -
          $("#view").append(`<li class="w3-padding-small w3-pale-red"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> paid <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Rental payment)</b> 
          </li>`);
        break;
        case 'quest_rewards': // Quest reward
          $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> earn <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Quest rewards)</b> 
          </li>`);
        break;
        case 'dec_reward': // Match reward
          $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> earn <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Match rewards)</b> 
          </li>`);
        break;
        case 'season_rewards': // Season reward
          $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> earn <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Season rewards)</b> 
          </li>`);
        break;
        case 'withdraw': // Token transfer (DEC)
          if(element.amount > 0)
          {
            $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-long-arrow-alt-up"></i>
            <i>${day.toLocaleString()}</i> - <b>${element.player}</b> recieved <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} from <b>${element.counterparty}</b>
            </li>`);
          }
          else
          {
            $("#view").append(`<li class="w3-padding-small w3-pale-red"><i class="fas fa-long-arrow-alt-down"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> send <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} to <b>${element.counterparty}</b>
          </li>`);
          }
        break;
        case 'rental_refund': // Refund rental
          $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> earn <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Rental refund)</b> 
          </li>`);
        break;
        case 'market_purchase': // Market purchase
          if(element.amount > 0)
          {
            $("#view").append(`<li class="w3-padding-small w3-pale-green"><i class="fas fa-dollar-sign"></i>
            <i>${day.toLocaleString()}</i> - <b>${element.player}</b> earn <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} from <b>${element.counterparty}</b> (Market sell)
            </li>`);
          }
          else
          {
            $("#view").append(`<li class="w3-padding-small w3-pale-red"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> spend <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} to <b>${element.counterparty}</b> (Market buy)
          </li>`);
          }
        break;
        case 'market_fees': // Market fee
          $("#view").append(`<li class="w3-padding-small w3-light-grey"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> paid <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Market fee)</b> 
          </li>`);
        break;
        case 'tournament_payment': // Tournament payement
          $("#view").append(`<li class="w3-padding-small w3-light-grey"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> paid <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Création tournament)</b> 
          </li>`);
        break;
        case 'unpaid_prizes': // Unpaid prizes
          $("#view").append(`<li class="w3-padding-small w3-light-grey"><i class="fas fa-dollar-sign"></i>
          <i>${day.toLocaleString()}</i> - <b>${element.player}</b> refund <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} <b>(Unpaid prizes)</b> 
          </li>`);
        break;
        
        default:
          $("#view").append(`<li class="w3-padding-small w3-light-grey">
          <b>${element.player}</b> send <b class="w3-tag w3-grey w3-round-large">${element.amount}</b> ${tokentyp} to <b>${element.counterparty}</b>
          </li>`);
      }
    });
    $("#spin").addClass(" w3-hide");
  },
  error:function(datas){ console.log(datas);}
});