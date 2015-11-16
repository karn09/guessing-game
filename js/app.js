jQuery(function($) {
    var Model = {
        newRandom: function() {
            return Math.floor(Math.random() * 100 + 1);
        },
        prevGuesses: function() {
            return new Array;
        }
    }
    var View = {
        init: function() {
            this.answer = Model.newRandom();
            this.prevGuess = Model.prevGuesses();
            this.cacheElements();
            this.bindEvents();
        },
        cacheElements: function() {
            this.$hot = $('.hot');
            this.$cold = $('.cold');
            this.$answer = $('.answer');
            this.$guessForm = $("#guessForm");
            this.$guessBtn = $('#getGuess');
            this.$resetBtn = $('.reset');
            this.$answerBtn = $('.answer');
            this.$tryAgain = $('.tryAgain');
            this.$tryMsg = $('#tryMsg');
        },
        bindEvents: function() {
            this.$guessBtn.click(function() {
                var guessInput = $('#guess');
                Control.checkInput(guessInput.val())
            });
            this.$resetBtn.click(function() {
                Control.resetGame();
            });
            this.$answerBtn.click(function() {
                Control.getAnswer();
            })
        },
        // render Try again popup over Hot/Cold button for 2s, leaving hot/cold
        // lit up
        tryAgain: function(err) {
            var self = this;
            if (err) {
                self.$answer.hide(1, function() {
                    self.$tryAgain.show(1, function() {
                        if (err === "bound") {
                            self.$tryMsg.text("Between 1 and 100 only!");
                        }
                        if (err === "dec") {
                            self.$tryMsg.text("Decimal numbers only!");
                        }
                    }).hide(2500);
                }).show(2500);
            }
        }
    }
    var Control = {
        checkInput: function(val) {
            val = Number(val);
            if (typeof val == "number" && Math.floor(val) === val) {
                if (val < 1 || val > 100) {
                    View.tryAgain("bound");
                    console.log("Between 1 and 100 only!");
                } else {
                    console.log("What did you guess? " + val);
                }
            } else {
                View.tryAgain("dec")
                console.log('Decimal numbers only!');
            }
        },
        resetGame: function() {},
        getAnswer: function() {}
    }
    View.init();
});