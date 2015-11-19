jQuery(function($) {
    var Model = {
        newRandom: function() {
            return Math.floor(Math.random() * 100 + 1);
        },
        prevGuesses: function() {
            return {hot: [], cold: []}
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
        },
        cacheElements: function() {
            this.$hot = $('.hot');
            this.$cold = $('.cold');
            this.$answerBox = $('.answer');
            this.$guessForm = $("#guessForm");
            this.$guessBtn = $('#getGuess');
            this.$resetBtn = $('#reset');
            this.$answerBtn = $('#answer');
            this.$coldWell = $('.cold-well');
            this.$hotWell = $('.hot-well');
            this.$tryAgain = $('.tryAgain');
            this.$tryMsg = $('#tryMsg');
        },
        bindEvents: function() {
            // encountered an issue where bindings were firing on 1,2,4,8,16..
            //http://stackoverflow.com/questions/14969960/jquery-click-events-firing-multiple-times
            var self = this;
            this.$guessBtn.one().click(function() {
                var guessInput = $('#guess');
                self.checkInput(guessInput.val())
            });
            this.$resetBtn.one().click(function() {
                self.resetGame();
            });
            this.$answerBtn.one().click(function() {
                self.getAnswer();
            })
        },
        render: function() {
            console.log(this.prevGuess)
            this.$tryMsg.text(this.currentMsg);
            if (this.prevGuess.hot.length > 0) {
                this.$hotWell.css('background-color', 'red');
                this.$hotWell.fadeIn(100).fadeOut(100).fadeIn(100);
                this.$hotWell.css('background-color', '#f5f5f5');
            } else {
                this.$hot.text("Hot");
            }
            if (this.prevGuess.cold.length > 0) { 
//                this.$coldWell.css('background-color', 'blue')
                this.$coldWell.css('background-color', 'blue').fadeIn(100).fadeOut(100).fadeIn(100).css('background-color', '#f5f5f5');
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

        checkInput: function(val) {
            var self = this;
            val = Number(val);
            if (typeof val == "number" && Math.floor(val) === val) {
                if (val < 1 || val > 100) {
                    self.chgMsg("Between 1 and 100 only!");
                } else {
                    self.chgMsg("Hmm.." + val + "..?");
                    this.checkGuess(val);
                }
            } else {
                self.chgMsg('Decimal numbers only!');
            }
        },
        checkGuess: function(val) {
            var self = this;
            if (val === this.answer) { 
                this.chgMsg("You found it! " + val) 
            } else if (val > (this.answer + this.radius) || val < (this.answer - this.radius)) {
                console.log(val + " .. " + this.answer)
                this.prevGuess.cold.push(val)
                this.$cold.text(this.prevGuess.cold);   

                this.chgMsg("Brrr....not so close. ")

            } else if (val < (this.answer + this.radius) && val > (this.answer - this.radius)) {
                this.prevGuess.hot.push(val)
                this.$hot.text(this.prevGuess.hot);  

                this.radius--;

                this.chgMsg("Getting hotter..")
            }
            

        },

        // trigger appears to double each reset. 
        resetGame: function() {
            this.init();
        },

        getAnswer: function() {
            this.chgMsg("Final answer is " + this.answer);
        }
    }
    Main.init();

});