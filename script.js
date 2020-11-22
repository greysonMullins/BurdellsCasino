var cardDeck = new Array(); //will hold all card objects in array
var player = new Array();  //will hold all player objects in array
var cardSuits = ["Spades", "Clubs", "Diamonds", "Hearts"];
var cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

function Card(suit, value, point) { //Card construtor to make card objects
    this.suit = suit;
    this.value = value;
    this.point = point;
}
Card.prototype.toString = function() { //overridden toString for debugging purposes
    return ("Suit: " + this.suit + " Value: " + this.value + " Points: " + this.point);
}

function Player(name, pointValue, cards) { //Player constructor to make player objects
    this.name = name;
    this.pointValue = pointValue;
    this.cards = cards;
}
Player.prototype.toString = function() { //overrideen toString for debuggin purposes
    return ("Name: " + this.name + " Point Value: " + this.pointValue + " Cards: " + this.cards);
}

function makeDeck() { 
    for(var x = 0; x < cardValues.length; x++) { //iterates through array of values
        for(var z = 0; z < cardSuits.length; z++) { //interates through arrray of suites
            //adds each suit for specified X value to deck
            var points = parseInt(cardValues[x]);
            if(cardValues[x] == "Jack" || cardValues[x] == "Queen" || cardValues[x] == "King")
                points = 10;
            if(cardValues[x] == "Ace" )
                    points = 11;
            var card = new Card(cardSuits[z], cardValues[x], points); //creating card object to be added to deck
            cardDeck.push(card);
        }
    }
}

function shuffleDeck() { //imma have to ask grace to comment this cause tbh I don't understand the logic lol
    for(var x = 0; x < 500; x++) {
        var playerCards = Math.floor(Math.random() * cardDeck.length);
        var houseCards = Math.floor(Math.random() * cardDeck.length);
        var hold = cardDeck[playerCards];
        
        cardDeck[playerCards] = cardDeck[houseCards];
        cardDeck[houseCards] = hold;
    }
}

function dealCards() {
    for(var x = 0; x < 2; x++) { //only two cards per player in black jack
        for(var z = 0; z < player.length; z++) { //gives one card to each player before going back round the table
            var card = cardDeck.pop();
            player[z].cards.push(card);
            player[z].pointValue += card.point;
        }
    }
}

function begin() {
    console.log("Game Started");
    document.getElementById('clickStart').value = "Restart";
    //document.getElementById("update").style.display = "N/A";
    var userPlayer = new Player("User", 0, new Array());
    var housePlayer = new Player("House", 0, new Array());
    player.push(userPlayer);
    player.push(housePlayer);
    makeDeck();
    shuffleDeck();
    dealCards();
    document.getElementById("cardWriting").innerHTML = ("Player Cards:  " + player[0].cards[0].value + " of " + player[0].cards[0].suit + " and " + player[0].cards[1].value + " of " + player[0].cards[1].suit + "\nTotal: " + player[0].pointValue);
    document.getElementById("cardWritingHOUSE").innerHTML = ("House Card:  " + player[1].cards[1].value + " of " + player[0].cards[1].suit);
    
    //document.getElementById('player ' + userPlayer).classList.add('current');
}

function stay() {
    console.log("Stayed...House Total: " + player[1].pointValue) //for debuggin
    var i = 0 //only allowers the 50/50 hit to run three times
    while (player[1].pointValue < 17 && i < 3) { //continues to have house "hit" until points total over 17, or the 50/50 hit option has been run 3 times
        if (player[1].pointValue <= 12) { //house always hits if points less than 12
            hit(1);
        } else if (player[1].pointValue > 12 && player[1].pointValue < 17) { //50/50 chance of hit if value btwn 12 and 17
            var rand = Math.random(); 
            if (rand > 0.5) {
                hit(1);
            }
            i++;
        }
    }
    document.getElementById("cardWritingHOUSE").innerHTML = "House Total: " + player[1].pointValue; //shows user what the house has in hand
    if (player[1].pointValue > 21) { //win/lose screen must be cleaned up for final submission
        document.getElementById("outcome").innerHTML = "You Won";
    } else {
        if (player[0].pointValue > player[1].pointValue) {
            document.getElementById("outcome").innerHTML = "You Won";
        } else {
            document.getElementById("outcome").innerHTML = "You Lost";
        }
    }
}


function hit(x) { 
    // player[x] determines if house or player
    var writeArea; //determines which <p> is edited to display text rep of cards
    var card = cardDeck.pop();
    player[x].cards.push(card);
    if (x == 0) {
        writeArea = "cardWriting";
    } else {
        writeArea = "cardWritingHOUSE";
    }
    player[x].pointValue += card.point;
    //Writes out which card was added and current point total
    document.getElementById(writeArea).innerHTML = (card.value + " of " + card.suit + " added.  \nTotal now: " + player[x].pointValue);
    if (player[0].pointValue > 21) { //ends game if player busts, need to clean this up for final project
        document.write("GAME OVER");
    }
    //statusPoints(); //where is this method?
    //if player busts here it should be a game over   
}
