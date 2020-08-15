/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game.
*/

/**
 * UI CONTROLLER
 * @public
 */
let UIController = (function () {

}());

/**
 * GLOBAL APP CONTROLLER
 * @public
 * @type {{init: controller.init}}
 */
let controller = (function (UICtrl) {

    return {

        /**
         * Initializing application.
         * @public
         */
        init: function () {
            console.log('Application has started.');
        }
    }

}(UIController))

/**
 * Run app.
 */
controller.init();

(function () {

    let scores, players, roundScore, activePlayer, $dice, $btnRoll, $btnHold, $btnNew, gamePlaying, dice,
        playerPanelClass;

    $dice = document.querySelector('.dice');
    $btnRoll = document.querySelector('.btn-roll');
    $btnHold = document.querySelector('.btn-hold');
    $btnNew = document.querySelector('.btn-new');

    init();

    playerPanelClass = document.querySelector('.player-' + activePlayer + '-panel').classList;

    // Next player function
    function nextPlayer() {

        // Clear roundScore
        roundScore = 0;
        for (let i in players) {
            document.getElementById('current-' + i).textContent = '0';
        }

        // Remove active class
        playerPanelClass.remove('active');

        // Next player
        activePlayer = (activePlayer === 0 ? 1 : 0);

        // CurrentScore
        playerPanelClass.add('active');

        // Hide dice
        $dice.style.display = 'none';
    }

    // Roll button
    $btnRoll.addEventListener('click', function () {
        if (gamePlaying) {
            // Random number
            dice = Math.floor(Math.random() * 6) + 1;

            // Display the result
            $dice.style.display = 'block';
            $dice.src = './assets/img/dice-' + dice + '.png';

            // Update the round if the rolled number was not a 1
            if (dice !== 1) {
                // Add score
                document.getElementById('current-' + activePlayer).textContent = (roundScore += dice);

            } else {
                // Next player
                nextPlayer();
            }
        }
    })

    // Hold button
    $btnHold.addEventListener('click', function () {
        if (gamePlaying) {
            // Add CurrentScore to global score
            scores[activePlayer] += roundScore;

            // Update UI
            document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

            // Check if player won the game
            if (scores[activePlayer] >= 100) {
                document.getElementById('name-' + activePlayer).textContent = 'Winner';
                $dice.style.display = 'none';

                playerPanelClass.add('winner');
                playerPanelClass.remove('active');

                gamePlaying = false;
            } else {
                // Next player
                nextPlayer();
            }
        }
    })

    // New button
    $btnNew.addEventListener('click', init);

    // Init base settings
    function init() {
        scores = [0, 0];
        activePlayer = 0;
        roundScore = 0;
        players = [0, 1];
        gamePlaying = true;

        $dice.style.display = 'none';

        for (let i in players) {
            document.getElementById('score-' + i).textContent = scores[i];
            document.getElementById('current-' + i).textContent = '0';
            document.getElementById('name-' + i).textContent = 'Player ' + (parseInt(i) === 1 ? 2 : 1);
        }

        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
    }

}());
