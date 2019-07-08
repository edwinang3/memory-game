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
