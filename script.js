var cardDeck = new Array(); //will hold all card objects in array
var player = new Array();  //will hold all player objects in array
var cardSuits = ["Spades", "Clubs", "Diamonds", "Hearts"];
var cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
var playerHandArray = new Array();
var backCard = document.createElement('img');
backCard.src = "/Assets/Cards/Back.png"

function Card(suit, value, point) { //Card construtor to make card objects
    this.suit = suit;
    this.value = value;
    this.point = point;
}
Card.prototype.toString = function() { //overridden toString for debugging purposes
    return ("Suit: " + this.suit + " Value: " + this.value + " Points: " + this.point);
}

function Player(name, pointValue, cards, worthOne) { //Player constructor to make player objects
    this.name = name;
    this.pointValue = pointValue;
    this.cards = cards;
    this.worthOne = worthOne; //used to determine if ace has already been converted to 1 to prevent busting
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
            var card = new Card(cardSuits[z], cardValues[x], points, false); //creating card object to be added to deck
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
            if (z == 1 && x == 0) {
                document.getElementById("houseCard1").appendChild(backCard);
            } else {
                getImage(card, z, player[z]);
            }
        }
    }
    
    console.log(player[0].cards);
    console.log(player[1].cards);
    document.getElementById("header").innerHTML = ("Total:  " + player[0].pointValue); //prints player point total to screen
}

function begin() {
    var mainMusic = document.createElement('audio');
    //music from https://youtu.be/LWOto2aOX70
    mainMusic.src = "/Assets/Audio/mainMusic.mp3"
    document.body.appendChild(mainMusic);
    mainMusic.play();
    var userPlayer = new Player("User", 0, new Array());
    var housePlayer = new Player("House", 0, new Array());
    player.push(userPlayer);
    player.push(housePlayer);
    makeDeck();
    shuffleDeck();
    dealCards();
}

function stay() {
    if (player[0].pointValue > 21) {
        setTimeout(function() {
            window.location.replace("youLose.html");
        }, 1500);
    } else {
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
        setTimeout(function() { //allows a pause before house's hidden crad is "flipped"
            changeBackCard(player[1].cards[0]);
        }, 500);
        if (player[1].pointValue > 21 || player[0].pointValue > player[1].pointValue) {
            setTimeout(function() { //3.5 secs between winning and being directed to that page
                window.location.replace("youWin.html");
            }, 3500);
        } else {
            setTimeout(function() { //3.5 secs between losing and being directed to that page
                window.location.replace("youLose.html");
            }, 3500);
        }
    }
}


function hit(x) { 
    // player[x] determines if house or player
    var card = cardDeck.pop();
    player[x].cards.push(card);
    player[x].pointValue += card.point;
    if (player[x].pointValue > 21) { //if player busts
        for(var i = 0; i < player[x].cards.length; i++) { //travers their hand
            if (player[0].cards[i].value == "Ace" && !(player[0].cards[i].worthOne)) { //if they have an ace
                player[x].pointValue = (player[x].pointValue - 10); //make ace worth 1 instead of 11
                player[x].cards[i].worthOne = true;
                break;
            }
        }
    }
    getImage(card, x, player[x]);    
    if (x == 0) {
        document.getElementById("header").innerHTML = ("Player Total:  " + player[0].pointValue);
    }
    if (x == 0 && player[0].pointValue > 21) {
        setTimeout(function() {
            window.location.replace("youLose.html");
        }, 1500);
    }
}

function getImage(card, x, player) { //pulls correct card image
    var writeArea; //div for either player of hous
    var img = document.createElement('img');
    var imgSrc = "Assets/Cards/";
    if (x == 0) { //sets the right div area
        writeArea = "playerCard" + player.cards.length;
    } else {
        writeArea = "houseCard" + player.cards.length;
    }
    switch(card.suit) {  //pulls suit of card to navigate through directory
        case "Spades":
            imgSrc += "Spades/";
            break;
        case "Hearts":
            imgSrc += "Hearts/";
            break;
        case "Diamonds":
            imgSrc += "Diamonds/";
            break;
        case "Clubs":
            imgSrc += "Clubs/";
            break;
    }
    switch(card.value) { //pulls correct card value to get correct img file
        case "Ace": 
            imgSrc += "Ace";
            break;
        case "2":
            imgSrc += "2";
            break;
        case "3":
            imgSrc += "3";
            break;
        case "4": 
            imgSrc += "4";
            break;
        case "5":
            imgSrc += "5";
            break;
        case "6":
            imgSrc += "6";
            break;
        case "7":
            imgSrc += "7";
            break;
        case "8":
            imgSrc += "8";
            break;
        case "9":
            imgSrc += "9";
            break;
        case "10": 
            imgSrc += "10";
            break;
        case "Jack":
            imgSrc += "Jack";
            break;
        case "Queen": 
            imgSrc += "Queen";
            break;
        case "King":
            imgSrc += "King";
            break;
        }
    /*
    if (x < 0) {
        imgSrc = "/Assets/Cards/Back.png"
    }*/
    imgSrc += ".png";
    img.src = imgSrc;
    document.getElementById(writeArea).appendChild(img);
}

function changeBackCard(houseCard) {
    var newSrc = "/Assets/Cards/"
        switch(houseCard.suit) {  //pulls suit of card to navigate through directory
        case "Spades":
            newSrc += "Spades/";
            break;
        case "Hearts":
            newSrc += "Hearts/";
            break;
        case "Diamonds":
            newSrc += "Diamonds/";
            break;
        case "Clubs":
            newSrc += "Clubs/";
            break;
    }
    switch(houseCard.value) { //pulls correct card value to get correct img file
        case "Ace": 
            newSrc += "Ace";
            break;
        case "2":
            newSrc += "2";
            break;
        case "3":
            newSrc += "3";
            break;
        case "4": 
            newSrc += "4";
            break;
        case "5":
            newSrc += "5";
            break;
        case "6":
            newSrc += "6";
            break;
        case "7":
            newSrc += "7";
            break;
        case "8":
            newSrc += "8";
            break;
        case "9":
            newSrc += "9";
            break;
        case "10": 
            newSrc += "10";
            break;
        case "Jack":
            newSrc += "Jack";
            break;
        case "Queen": 
            newSrc += "Queen";
            break;
        case "King":
            newSrc += "King";
            break;
        }
    newSrc += ".png"
    backCard.src = newSrc;
    document.querySelector("houseCard1").replaceChild(backCard, img);
}