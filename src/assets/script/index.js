/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he wishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game.
*/

/**
 * SCORE CONTROLLER
 * @public
 */
let ScoreController = (function () {

    let roundScore, activePlayer, dice;

    activePlayer = 0;

    return {

        /**
         * Clear roundScore.
         */
        clearRoundScore() {
            roundScore = 0;
        },

        /**
         * Get active player.
         * @return {number}
         */
        getActivePlayer() {
            return activePlayer;
        },

        /**
         * Change active player
         */
        changeActivePlayer() {
            activePlayer = (activePlayer === 0 ? 1 : 0);
        },
        /**
         * Get dice.
         * @public
         * @return {number}
         */
        getDice() {
            if (typeof dice === undefined) {
                dice = Math.floor(Math.random() * 6) + 1;
            }

            return dice;
        }
    }

}());

/**
 * UI CONTROLLER
 * @public
 */
let UIController = (function (ScoreCtrl) {

    const DOMStrings = {
        dice: '.dice',
        btnRoll: '.btn-roll',
        btnHold: '.btn-hold',
        btnNew: '.btn-new'
    }

    /**
     * Hide dice.
     */
    let hideDice = function () {
        document.querySelector(DOMStrings.dice).style.display = 'none';
    }


    return {

        /**
         * DOM selectors.
         * @public
         */
        getDOMStrings: function () {
            return DOMStrings;
        },
        /**
         * Clear roundScore.
         */
        clearScore() {
            ScoreCtrl.clearRoundScore();

            document.getElementById('current-' + 0).textContent = '0';
            document.getElementById('current-' + 1).textContent = '0';
        },

        /**
         * Move to next player.
         * @public
         */
        moveToNextPlayer() {
            let activePlayer, playerPanelClass;

            // Get active player
            activePlayer = ScoreCtrl.getActivePlayer();

            // Active player class list.
            playerPanelClass = document.querySelector('.player-' + activePlayer + '-panel').classList;

            // Remove active class
            playerPanelClass.remove('active');

            // Change active player
            ScoreCtrl.changeActivePlayer();

            // CurrentScore
            playerPanelClass.add('active');

            // Hide dice
            hideDice();
        },

        /**
         * Display the dice with the result
         * @public
         */
        displayDice() {
            let dice = ScoreCtrl.getDice();
            document.querySelector(DOMStrings.dice).style.display = 'block';
            document.querySelector(DOMStrings.dice).src = './assets/img/dice-' + dice + '.png';
        }
    }

}(ScoreController));

/**
 * GLOBAL APP CONTROLLER
 * @public
 * @type {{init: controller.init}}
 */
let controller = (function (UICtrl, ScoreCtrl) {


    /**
     * /**
     * Event listeners for adding new item.
     * @private
     */
    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMStrings();

        let scores, players, roundScore, activePlayer, gamePlaying, dice, playerPanelClass;

        playerPanelClass = document.querySelector('.player-' + activePlayer + '-panel').classList;

        // Roll button
        document.querySelector(DOM.btnRoll).addEventListener('click', function () {
            if (gamePlaying) {

                // Random number
                dice = ScoreCtrl.getDice();

                // Display the result
                UICtrl.displayDice();

                // Update the round if the rolled number was not a 1
                if (dice !== 1) {
                    // Add score
                    document.getElementById('current-' + activePlayer).textContent = (roundScore += dice);

                } else {
                    // Clear roundScore
                    UICtrl.clearScore();

                    // Next player
                    UICtrl.moveToNextPlayer();
                }
            }
        })

        // Hold button
        document.querySelector(DOM.btnHold).addEventListener('click', function () {
            if (gamePlaying) {
                // Add CurrentScore to global score
                scores[activePlayer] += roundScore;

                // Update UI
                document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

                // Check if player won the game
                if (scores[activePlayer] >= 100) {
                    document.getElementById('name-' + activePlayer).textContent = 'Winner';
                    document.querySelector(DOM.dice).style.display = 'none';

                    playerPanelClass.add('winner');
                    playerPanelClass.remove('active');

                    gamePlaying = false;
                } else {
                    // Clear roundScore
                    UICtrl.clearScore();

                    // Next player
                    UICtrl.moveToNextPlayer();
                }
            }
        })

        // New button
        document.querySelector(DOM.btnNew).addEventListener('click', init);

        // Init base settings
        function init() {
            scores = [0, 0];
            activePlayer = 0;
            roundScore = 0;
            players = [0, 1];
            gamePlaying = true;

            document.querySelector(DOM.dice).style.display = 'none';

            for (let i in players) {
                document.getElementById('score-' + i).textContent = scores[i];
                document.getElementById('current-' + i).textContent = '0';
                document.getElementById('name-' + i).textContent = 'Player ' + (parseInt(i) === 1 ? 2 : 1);
            }

            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('active');
        }
    }

    return {
        /**
         * Initializing application.
         * @public
         */
        init: function () {
            console.log('Application has started.');

            setupEventListeners();
        }
    }

}(UIController, ScoreController))

/**
 * Run app.
 */
controller.init();
