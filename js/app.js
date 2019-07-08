/* GAME MECHANISM MANAGER */
const game = {
    data: {
        // initial deck arrangement
        init_card_list: [
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
            'paper-plane-o',
        ],
        // matches required to complete the game
        matches_required_to_complete(){
            return this.init_card_list.length/2;
        }
    },
    // move count manager
    moves: {
        // initial move count
        count: 0,
        // element to update move count
        element: document.getElementsByClassName('moves')[0],
        // add move count by one
        add(){
            this.count += 1;
            this.show();
        },
        // update move count
        show(){
            this.element.innerHTML = this.count;
        },
        // reset move count to zero
        reset(){
            this.count = 0;
            this.show();
        }
    },
    // rating manager
    rating: {
        // initial rating stars
        stars: 3,
        // element to update rating stars
        stars_element: document.getElementsByClassName('fa-star'), 
        // calculate rating stars based on number of moves and time passed
        calculate_rating(){
            // calculate rating for moves count only
            let moves_stars = 3;
            if(game.moves.count > 0 && game.moves.count <= 35){
                moves_stars = 3;
            }else if(game.moves.count > 35 && game.moves.count <= 60){
                moves_stars = 2;
            }else if(game.moves.count >60){
                moves_stars = 1;
            }
    
            // calculate rating for time passed only
            let time_stars = 3;
            if(timer.time.total_in_seconds > 0 && timer.time.total_in_seconds <= 40){
                time_stars = 3;
            }else if(timer.time.total_in_seconds > 40 && timer.time.total_in_seconds <= 90){
                time_stars = 2;
            }else if(timer.time.total_in_seconds >90){
                time_stars = 1;
            }
            
            // calculate final rating stars based on individual rating for moves count and for time passed  
            const final_starts = Math.floor((moves_stars + time_stars)/2);
            game.rating.stars = final_starts;
            game.rating.update_rating();
        },
        // update rating stars on the game board
        update_rating(){
            for(star of game.rating.stars_element){
                star.classList.add('awarded');
            }
            if(game.rating.stars < 3){
                for(let i=0; i< (3 - game.rating.stars); i++){
                    game.rating.stars_element[i].classList.remove('awarded');
                }
            }
        },
        // reset rating stars
        reset(){
            this.stars = 3;
            this.update_rating()
        },
    },
    // modal manager
    modal: {
        // modal overlay element
        overlay_element: document.getElementsByClassName('modal-overlay')[0],
        // modal container element
        container_element: document.getElementsByClassName('modal-container')[0],
        // hide modal
        hide(){
            game.modal.overlay_element.classList.add('fadeOut');
            game.modal.overlay_element.classList.remove('fadeIn');
            game.modal.container_element.classList.remove('slideInUp');
            game.modal.container_element.classList.add('slideOutDown');
            setTimeout(function(){
                game.modal.overlay_element.classList.add('hide');
            },300);
        },
        // show modal
        show(){
            game.modal.overlay_element.classList.remove('hide','fadeOut');
            game.modal.overlay_element.classList.add('fadeIn');
            
            game.modal.container_element.classList.add('slideInUp');
            game.modal.container_element.classList.remove('slideOutDown');
        },
        // modal action button click event
        click_event(){
            this.container_element.addEventListener('click',function handler(event){
                // reset game when modal action button is clicked
                if(event.target && event.target.matches('BUTTON')){
                    game.modal.hide();
                    game.reset();
                    game.start();
                }
            },false);
        },
        // modal intro message in HTML
        intro_message(){
            return `<h2>Matching Game</h2>
        <p>The goal of the game is to find 8 different pairs of matching cards. Flip over 2 hidden cards at a time to locate the ones that match!</p>
        <ul class="modal-deck">
            <li class="card animated rubberBand">
                <i class="fa fa-diamond"></i>
            </li>
            <li class="card animated rubberBand">
                <i class="fa fa-diamond"></i>
            </li>
        </ul>
        <button type="button">Start game</button>`;
        },
        // modal result message in HTML
        result_message(){
            return `<div class="rating-result">
            <ul class="stars">
                <li><i class="fa fa-star zoomIn animated ${(game.rating.stars >= 2) ? 'awarded':''}"></i></li>
                <li><i class="fa fa-star zoomIn animated ${(game.rating.stars >= 1) ? 'awarded':''}"></i></li>
                <li><i class="fa fa-star zoomIn animated ${(game.rating.stars >= 3) ? 'awarded':''}"></i></li>
            </ul>
        </div>
        <h2 class="result-message">Well done!</h2>
        <p>You completed this game with</p>
        <p>
            <span class="highlight-text moves-result">${game.moves.count} move${(game.moves.count > 1) ? 's':''}</span> in
            <span class="highlight-text timer-result">${(timer.time.minutes) ? `${timer.time.minutes} minute${(timer.time.minutes > 1) ? 's':''} ` : ''}${timer.time.seconds} second${(timer.time.seconds > 1) ? 's':''}</span>
        </p>
        <button type="button"><i class="fa fa-repeat"></i> Play again</button>`;
        }, 
    },
    // start game
    start(){
        // reset game deck and timer
        deck.reset();
        timer.start();
    }, 
    // game ends
    end: {
        // show modal with result message
        modal(){
            timer.stop();
            setTimeout(function(){
                game.modal.show();
                game.modal.container_element.innerHTML = game.modal.result_message();
            },1000);
            
        }
    },
    // reset game
    reset(){
        // reset moves count, rating score, timer and game deck
        this.moves.reset();
        this.rating.reset();
        timer.reset();
        deck.reset();
    },
    // initialise game
    init(){
        // show modal with intro message
        this.modal.show();
        this.modal.container_element.innerHTML = this.modal.intro_message();
        
        // add click event to modal action button
        this.modal.click_event();
        
        // add click event to deck card
        deck.click_event();
        
        // add click event to restart game button
        document.getElementsByClassName('restart')[0].addEventListener('click',function(){
            game.reset();
            game.modal.show();
            game.modal.container_element.innerHTML = game.modal.intro_message();
        });
    }
};


/* CARD DECK MANAGER */
const deck = {
    // store deck element
    element: document.getElementsByClassName('deck')[0],
    
    // Shuffle function from http://stackoverflow.com/a/2450976
    shuffle(array){
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },
    // reset card deck
    reset(){
        this.element.innerHTML = '';
        
        for(let card of this.shuffle(game.data.init_card_list)){
            const card_html = `<li class="card"><i class="fa fa-${card}"></i></li>`;
            this.element.innerHTML += card_html;
        }
        
        this.card.open_cards = [];
        this.card.match_count = 0;
    },
    // add click event to deck
    click_event(){
        const card = this.card;
        deck.element.addEventListener('click', function handler(event){
            if(event.target && event.target.matches('.card:not(.open)')){
                card.open(event.target);
            }
            // mobile
            else if (event.target && event.target.matches('I.fa') && event.target.parentElement.matches('.card:not(.open)')){
                card.open(event.target.parentElement);
            }
        },false);
    },
    // data and methods related to the cards element
    card: {
        // store open cards
        open_cards: [],
        // store number of matches
        match_count: 0,
        // add open class to card (animate card flips to open)
        open(card_element){
            card_element.classList.add('open');
            this.open_cards.push(card_element);
            game.moves.add();
            game.rating.calculate_rating();
            if(this.open_cards.length >=2){
                this.check();
            }
            
        },
        // add match class to card (animate card match)
        match(card_element){
            card_element.classList.add('match');
        },
        // add match class to card (animate incorrect cards)
        incorrect(card_element){
            card_element.classList.add('incorrect');
        },
        // remove open and incorrect class from cards (animate cards flip to close)
        close(card_element){
            const open_animation_duration = 300;
            const incorrect_animation_duration = 1000;
            const buffer = 15;
            setTimeout(function(){
                card_element.classList.remove('open', 'incorrect');
            },open_animation_duration + incorrect_animation_duration + buffer);
        },
        // check if 2 cards matches or not
        check(){
            const card_1 = this.open_cards[0];
            const card_2 = this.open_cards[1];

            const card_1_icon = card_1.lastChild.classList.value.replace(/fa\-?\ ?/g, '');
            const card_2_icon = card_2.lastChild.classList.value.replace(/fa\-?\ ?/g, '');

            if(card_1_icon == card_2_icon){
                this.match(card_1)
                this.match(card_2)
                this.match_count += 1;
                
                if(this.match_count == game.data.matches_required_to_complete()){
                    game.end.modal();
                }
            }else{
                this.incorrect(card_1)
                this.incorrect(card_2)

                this.close(card_1)
                this.close(card_2)
            }
            this.open_cards = [];
        }
    }
};

/* TIMER MANAGER */
const timer = {
    // store minutes and seconds element that needs to be updated
    minute_element: document.getElementsByClassName('minutes')[0],
    second_element: document.getElementsByClassName('seconds')[0],
    // counter for interval
    counter: 0,
    time: {
        total_in_seconds: 0,
        minutes: 0,
        seconds: 0
    },
    // start timer
    start(){
        const current_time = Date.now();
        this.count_seconds(current_time);
    },
    // count seconds and update timer for players
    count_seconds(current_time){
        this.counter = setInterval(function(){
            const delta = Date.now() - current_time;
            const total_in_seconds = Math.floor(delta / 1000);

            let minutes = Math.floor(total_in_seconds / 60);
            let seconds = total_in_seconds - minutes * 60;
            
            timer.time.total_in_seconds = total_in_seconds;
            timer.time.minutes = minutes;
            timer.time.seconds = seconds;

            if(minutes.toString().length == 1){
                minutes = `0${minutes}`;
            }
            if(seconds.toString().length == 1){
                seconds = `0${seconds}`;
            }
            timer.minute_element.innerHTML = minutes;
            timer.second_element.innerHTML = seconds;
            
            game.rating.calculate_rating();
        },1000);
    },
    // stop timer
    stop(){
        clearInterval(this.counter);
        this.counter = 0;
    },
    // reset timer
    reset(){
        this.stop();
        this.minute_element.innerHTML = '00';
        this.second_element.innerHTML = '00';
    }
}

// initialise the game
game.init();