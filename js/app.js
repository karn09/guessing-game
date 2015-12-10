// Project Requirements:

// DONE - When a game begins, there should be a random number generated between 1-100.
// DONE - The user should have an input field where they can submit a guess.
// DONE After the user submits a guess, indicate whether their guess is 'hot' or 'cold'. Let the user know if they need to guess higher or lower.
// DONE Allow the user to guess only a certain amount of times. When they run out of guesses let them know the game is over.
// DONE - Feel free to use prompts to get user input on your first version.
// DONE - For the final version of your project, you'll need to create an HTML-based interface for getting user inputs and giving feedback on guesses.
// DONE - Validate inputs that they are real numbers between 1-100.
// DONE - Create a new game button that resets the game.
// DONE - Store all of the guesses and create a way to check if the guess is a repeat.
// DONE (Double check) - Track the user's previous guess. Let them know if they are getting “hotter” or “colder” based on their previous guess.
// DONE - Create a button that provides the answer (Give me a Hint).
// DONE - Submit the guess by pressing enter or clicking the submit button.
// DONE (make this look nicer) - After a user guesses a number keep a visual list of Hot and Cold answers that the user can see.
// Change the background color, add an image, or do something creative when the user guesses the correct answer.


// TODO:
// DONE - create and display array of hints depending on guesses left. 
// DONE - if winning number found, stop accepting additional input
// DONE if no more guesses availible, stop accepting additional input
// display numbers previously guessed - maybe for numbers > x digits away- show in cold panel. as gets closer- show in hot panel
// cool winning panel popup? 

jQuery(function($) {
    var Model = {
        newRandom: function() {
            return Math.floor(Math.random() * 100 + 1);
        },
        prevGuesses: function() {
            return {
                hot: [],
                cold: []
            }
        }
    }
    var Main = {
        init: function() {
            this.answer = Model.newRandom();
            this.radius = 15;
            this.prevGuess = Model.prevGuesses();
            this.currentMsg = 'Enter a number above!';
            this.cacheElements();
            this.bindEvents();
            this.render();
            this.guesses = 0;
            this.maxGuess = 5;
            this.currDigitsAway = 0;
        },
        cacheElements: function() {
            this.$hot = $('.hot');
            this.$cold = $('.cold');
            this.$answerBox = $('.answer');
            this.$guessForm = $("#guessForm");
            this.$guessBtn = $('#getGuess');
            this.$resetBtn = $('#reset');
            this.$guessInput = $('#guess');
            this.$answerBtn = $('#answer');
            this.$coldWell = $('.cold-well');
            this.$hotWell = $('.hot-well');
            this.$tryAgain = $('.tryAgain');
            this.$tryMsg = $('#tryMsg');
        },
        // on reset, clear out all bindings so that multiple clicks aren't accidentally registered. removes all bindings when game is reset. Otherwise, 
        // will 'lock' buttons thar are not reset.

        clearEvents: function(arg) {
            if (arg === 'reset') {
                this.$resetBtn.unbind();
            };
            this.$guessBtn.unbind();
            this.$guessInput.unbind();
            this.$answerBtn.unbind();
        },
        bindEvents: function() {
            // encountered an issue where bindings were firing on 1,2,4,8,16..this seemed due to multiple bindings being created on game reset
            //http://stackoverflow.com/questions/14969960/jquery-click-events-firing-multiple-times
            // above solution suggested .one to make sure button was only clicked once. found that this was not a full solution with odd behavior occuring
            // with hint and reset buttons. 
            var self = this;
            this.$guessBtn.click(function() {
                var currentVal = $('#guess');
                self.checkInput(self.getCurrentGuess());
            });
            this.$guessInput.keypress(function(e) {
                if (e.keyCode === 13) {
                    var currentVal = $('#guess');
                    self.checkInput(self.getCurrentGuess());
                }
            })
            this.$resetBtn.click(function() {
                self.resetGame();
            });
            this.$answerBtn.click(function() {
                self.getHint();
            })
        },

        getCurrentGuess: function() {
            var currentVal = $('#guess');
            return currentVal.val();
        },

        render: function() {

            this.$tryMsg.text(this.currentMsg);


            if (this.prevGuess.hot.length > 0) {
                this.$hotWell.css('background-color', 'red').fadeIn(100).fadeOut(100).fadeIn(100).css('background-color', '#f5f5f5');
                this.$hot.text(this.prevGuess.hot);

            } else {
                this.$hot.text("Hot");
            }

            if (this.prevGuess.cold.length > 0) {
                this.$coldWell.css('background-color', 'blue').fadeIn(100).fadeOut(100).fadeIn(100).css('background-color', '#f5f5f5');
                this.$cold.text(this.prevGuess.cold);

                //              this.$coldWell.css('background-color', '#f5f5f5')
            } else {
                this.$cold.text("Cold");
            }
        },
        // render Try again popup over Hot/Cold button for 2s, leaving hot/cold
        // lit up

        chgMsg: function(msg) {
            this.currentMsg = msg;
            this.render();
        },
        // make sure input is an actual number between 1-100
        checkInput: function(val) {
            var self = this;
            val = Number(val);
            if (this.guesses === this.maxGuess) {
                this.chgMsg("Maybe it's time you gave up and started a new game.")
                self.clearEvents();
            } else {
                if (typeof val == "number" && Math.floor(val) === val) {
                    if (val < 1 || val > 100) {
                        self.chgMsg("Between 1 and 100 only!");
                    } else {
                        if (this.guesses < this.maxGuess) {
                            this.checkGuess(val);
                            this.guesses++;
                        }
                    }
                } else {
                    self.chgMsg('Decimal numbers only!');
                }
            }
        },
        // check input value for nearness to generated value and push to hot/cold obj arrays.
        checkGuess: function(val) {
            var self = this;
            if (val === this.answer) {
                this.chgMsg("You found it! " + val);
                this.clearEvents;
            } else if (this.prevGuess.hot.indexOf(val) !== -1 || this.prevGuess.cold.indexOf(val) !== -1) {
                this.chgMsg("Why not guess a new number..")
            } else {
                this.chgMsg(this.lowerOrHigher(val))
            }
        },
        // check if # is lower or higher.
        lowerOrHigher: function(val) {
            var resp = 'Your guess is ';
            this.currDigitsAway = Math.ceil(Math.abs(this.answer - val) / 5) * 5;
            if (val < this.answer) {
                resp += 'lower than the answer and ';
            } else if (val > this.answer) {
                resp += 'greater than the answer and ';
            }
            resp += 'within ' + this.currDigitsAway + ' digits';
            return resp;
        },

        // call init to reset game. 
        resetGame: function() {
            this.clearEvents('reset');
            this.init();
        },

        // set msg to final answer. 
        getHint: function() {
            var self = this;
            var hintText = '';

            var hints;

            var hintRange = function() {
                var currentGuess = Number(self.getCurrentGuess());
                var min, max;
                if (currentGuess < self.answer) {
                    min = currentGuess;
                    max = currentGuess + self.currDigitsAway;
                } else if (currentGuess > self.answer) {
                    max = currentGuess
                    min = currentGuess - self.currDigitsAway;
                }
                return [min, max];
            };

            var generateRandomHints = function(len) {
                var hintArray = [];
                var range = hintRange();
                while (hintArray.length !== len) {
                    var rand = Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
                    if (hintArray.indexOf(rand) === -1 && rand != self.answer) {
                        hintArray.push(rand);
                    }
                }
                return hintArray;
            };

            if (this.guesses === 1) {
                hints = generateRandomHints(7);
            } else if (this.guesses === 2) {
                hints = generateRandomHints(5);
            } else if (this.guesses === 3) {
                hints = generateRandomHints(2);
            } else if (this.guesses === 4) {
                hints = generateRandomHints(1);
            };

            hints.push(self.answer);
            hints.sort(function() {
                return 0.5 - Math.random()
            }); // https://css-tricks.com/snippets/javascript/shuffle-array/
            this.chgMsg("Hints are: " + hints.join(', '));
        }
    }
    Main.init();

});