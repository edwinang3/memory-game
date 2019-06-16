/*
 * Create a list that holds all of your cards
 */
const init_card_list = [
    'bomb',
    'bolt',
    'diamond',
    'bomb',
    'bicycle',
    'paper-plane-o',
    'anchor',
    'leaf',
    'cube',
    'bolt',
    'diamond',
    'cube',
    'leaf',
    'anchor',
    'bicycle',
    'paper-plane-o'
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// reset card deck
function reset_card_deck(){
    document.getElementsByClassName('deck')[0].innerHTML = '';
    
    for(let card of shuffle(init_card_list)){
        const card_html = `<li class="card"><i class="fa fa-${card}"></i></li>`;
        document.getElementsByClassName('deck')[0].innerHTML += card_html;
    }
}

function reset_timer(){
    document.getElementsByClassName('play-time')[0].innerHTML = '00:00';
}

function reset_rating(){
    document.getElementsByClassName('moves')[0].innerHTML = '0';
    let stars = document.getElementsByClassName('fa-star');
    
    for(let star of stars){
        star.classList.remove('hide');
    }
}

function reset_game(){
    reset_card_deck();
    reset_timer();
    reset_rating();
}

reset_game();





/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
