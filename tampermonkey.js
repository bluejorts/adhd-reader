// ==UserScript==
// @name         ADHD Reader
// @namespace    https://github.com/bluejorts/adhd-reader
// @version      0.1.2
// @description  handle any wikipedia text and convert to ADHD bolding
// @author       Barry Ira
// @match        https://en.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @updateURL    https://raw.githubusercontent.com/bluejorts/adhd-reader/main/tampermonkey.js
// @downloadURL  https://raw.githubusercontent.com/bluejorts/adhd-reader/main/tampermonkey.js
// @grant        none
// ==/UserScript==

(function() {
    //Just to tell the linter that $ is defined in jquery
    /* global $ */
    'use strict';

    // These should all be put into some kind of on-page settings UI and user editable
    // leaving them here for now

    // How many words to let go by before bolding one
    let staccatoRatio = 3;
    // The percenage of the word that should be bolded
    let boldRatio = 0.33;

    let prevWordEndedSentence = false;

    function boldWord(word) {
        if(word.length == 0 || word.empty) {
            return word
        }
        let boldLength = Math.ceil(word.length * boldRatio);
        let newWord = "error";
        if(boldLength >= word.length) {
            newWord = "<b>" + word + "</b>";
        } else {
            newWord = "<b>" + word.slice(0, boldLength) + "</b>" + word.slice(boldLength);
        }
        return newWord;
    }

    function boldEveryNthWord(index, n, word) {
        // there was an attempt here to check if the last word was the end of the sentence
        // doesn't seem to be working yet... probably a js scoping thing or something
        if(prevWordEndedSentence) {
            prevWordEndedSentence = false;
            return boldWord(word)
        }
        if(word.endsWith(".")) {
            prevWordEndedSentence = true;
        }
        if (index % n == 0) {
            return boldWord(word)
        } else {
            return word
        }
    }

    function replaceInnerText(elem) {
        console.log("replacing " + elem);
        var splitText = elem.text().split(' ')
        let newText = splitText.map((word, index) => boldEveryNthWord(index, staccatoRatio, word)).join(' ');
        console.log(newText);
        elem.html(newText);
    }

    $(".mw-body-content p").each(function() {
        console.log("iterating " + $( this ));
        replaceInnerText($( this ));
    });
})();
