$( document ).ready(function () {

  function generateNewDeck () {

    const 	cardTypes = [['A', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5], ['6', 6], ['7', 7], ['8', 8], ['9', 9], ['10', 10], ['J', 10], ['Q', 10], ['K', 10]];
    const   deck = [];

    //DECK IS AN ARRAY OF OBJECTS(CARDS)
    for (let i = 0; i < cardTypes.length; i++) {
      deck.push({
        name: cardTypes[i][0],
        value: cardTypes[i][1],
        suit: './suits/hearts.png'
      });
      deck.push({
        name: cardTypes[i][0],
        value: cardTypes[i][1],
        suit: './suits/diamonds.png'
      });
      deck.push({
        name: cardTypes[i][0],
        value: cardTypes[i][1],
        suit: './suits/spades.png'
      });
      deck.push({
        name: cardTypes[i][0],
        value: cardTypes[i][1],
        suit: './suits/clubs.png'
      });
    }

    return deck;

  }

  function getRandomCard (deck) {
    const 	randomNumber = Math.floor(Math.random() * deck.length);
    const   card = deck[randomNumber];

    deck.splice(randomNumber, 1); //remove the card from the deck
    return card;
  }

  function Hit () {
    //CREATE, ADD and SHOW NEW CARD FOR THE USER
    const currCard = getRandomCard(newDeck);

    userCards.push(currCard);
    $('#user-area .output').append('<div>' + currCard['name'] + '<img src=\"' + currCard['suit'] + '\" />' + '</div>');
    userPoints = calculatePoints(userCards);

    //CLEAR and SHOW USER'S SCORE
    $('#user-area .score').find('span').first().remove();
    $('#user-area .score').prepend('<span>' + userPoints + '</span>');

    //LOG NEWDECK LENGTH FOR DEBUGGING PURPOSE
    //console.log('Deck length:' + newDeck.length);

    //BUSTED
    if (userPoints > 21) {
      endGame();
    }

  }

  function Stand () {

    //CLEAR and SHOW STAND or BLACKJACK
    $('#user-area .buttons').find('*').remove();
    if (userPoints === 21 && userCards.length === 2) {
      $('#user-area .buttons').append('<p class="blackjack">BLACKJACK!!!</p>');
    } else {
      $('#user-area .buttons').append('<p class="stand">YOU STAND</p>');
    }

    //NEW CARD FOR THE DEALER
    setTimeout (function () {

      const currCard = getRandomCard(newDeck);
      dealerCards.push(currCard);
      $('#dealer-area .output').append('<div>' + currCard['name'] + '<img src=\"' + currCard['suit'] + '\" />' + '</div>');
      dealerPoints = calculatePoints(dealerCards);

      //CLEAR and SHOW DEALER'S SCORE
      $('#dealer-area .score').find('span').first().remove();
      $('#dealer-area .score').prepend('<span>' + dealerPoints + '</span>');

      //LOG NEWDECK LENGTH FOR DEBUGGING PURPOSE
      //console.log('Deck length:' + newDeck.length);

      //ALWAYS ASK IF DEALER'S SCORE IS LOWER THAN USER'S SCORE or LOWER THAN 17 and USER DOESN'T HAVE BLACKJACK
      if ((dealerPoints < userPoints || dealerPoints < 17) && !(userPoints === 21 && userCards.length === 2)) {
        Stand();
      } else {
        endGame();
      }

    }, 2000);

  }

  function calculatePoints (cards) {

    let sum = 0;

    //CALCULATE SUM
    for (let i = 0; i < cards.length; i++) {
      sum += cards[i]['value'];
    }

    //ACES' HANDLING
    for (let i = 0; i < cards.length; i++) {
      if (cards[i]['value'] === 1 && (sum + 10) <= 21) {
        sum += 10;
      }
    }

    return sum;

  }

  function startGame () {

    //RESET GLOBAL VARIABLES
    newDeck = generateNewDeck();
    userCards = [];
    dealerCards = [];
    dealerPoints = 0;
    userPoints = 0;

    //GENERATE FIRST CARDS FOR DEALER AND USER
    dealerCards.push(getRandomCard(newDeck));
    userCards.push(getRandomCard(newDeck));
    userCards.push(getRandomCard(newDeck));

    //INITIALIZE POINTS FOR DEALER AND USER
    userPoints = calculatePoints(userCards);
    dealerPoints = calculatePoints(dealerCards);

    //SHOW FIRST CARDS
    $('#dealer-area .output').find('*').remove();
    $('#user-area .output').find('*').remove();
    $('#dealer-area .output').append('<div>' + dealerCards[0]['name'] + '<img src=\"' + dealerCards[0]['suit'] + '\" />' + '</div>');
    $('#user-area .output').append('<div>' + userCards[0]['name'] + '<img src=\"' + userCards[0]['suit'] + '\" />' + '</div>');
    $('#user-area .output').append('<div>' + userCards[1]['name'] + '<img src=\"' + userCards[1]['suit'] + '\" />' + '</div>');

    //CLEAR AREAS
    $('#dealer-area .message').find('*').remove();
    $('#user-area .buttons').find('*').remove();

    //USER'S BLACKJACK
    if (userPoints === 21) {

      Stand(); //a user's blackjack is always followed by a stand

    } else {

      //ADD BUTTONS HIT / STAND
      $('#user-area .buttons').append('<button id="hit">HIT</button>');
      $('#user-area .buttons').append('<button id="stand">STAND</button>');

    }

    //CLEAR and SHOW SCORES
    $('#user-area .score').find('*').first().remove();
    $('#dealer-area .score').find('*').first().remove();
    $('#user-area .score').prepend('<span>' + userPoints + '</span>');
    $('#dealer-area .score').prepend('<span>' + dealerPoints + '</span>');

    //LOG NEWDECK LENGTH FOR DEBUGGING PURPOSE
    //console.clear();
    //console.log('Deck length:' + newDeck.length);

  }

  function endGame () {

    //EVALUATE POINTS and SHOW THE RESULT
    $('#dealer-area .message').find('*').remove();
    $('#user-area .buttons').find('*').remove();

    if ((userPoints <= 21 && userPoints > dealerPoints) || (userPoints <= 21 && dealerPoints > 21)) {
      $('#dealer-area .message').append('<p class="win">YOU WIN!!!</p>');
    } else {
      $('#dealer-area .message').append('<p class="lose">YOU LOSE!!!</p>');
    }

    //ASK FOR NEW GAME
    $('#user-area .buttons').append('<button id="try-again">TRY AGAIN</button>');

  }

  //GLOBAL VARIABLES
  let 	newDeck = []; //arrays of objects(cards)
  let   userCards = [];
  let   dealerCards = [];

  let 	dealerPoints = 0;
  let   userPoints = 0;

  //ON CLICK EVENT HANDLERS
  $('#user-area').on('click', 'button#hit', Hit);
  $('#user-area').on('click', 'button#stand', Stand);
  $('#user-area').on('click', 'button#try-again', startGame);

  //ENTRY POINT
  startGame();

});
