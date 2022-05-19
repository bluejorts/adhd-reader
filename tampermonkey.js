// ==UserScript==
// @name         ADHD Reader
// @namespace    http://jorts.space/
// @version      0.1
// @description  handle any wikipedia text and convert to ADHD bolding
// @author       Barry Ira
// @match        https://en.wikipedia.org/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    //Just to tell the linter that $ is defined in jquery
    /* global $ */
    'use strict';

    let prevWordEndedSentence = false;

    function boldWord(word) {
        console.log("original " + word);
        if(word.length == 0 || word.empty) {
            return word
        }
        let boldLength = Math.ceil(word.length * 0.33)
        console.log("length " + boldLength);
        let newWord = "error";
        if(boldLength >= word.length) {
            newWord = "<b>" + word + "</b>";
        } else {
            newWord = "<b>" + word.slice(0, boldLength) + "</b>" + word.slice(boldLength);
        }
        console.log("new " + newWord);
        return newWord;
    }

    function boldEveryNthWord(index, n, word) {
        // there was an attempt here to check if the last word was the end of the sentence
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
        let newText = splitText.map((word, index) => boldEveryNthWord(index, 3, word)).join(' ');
        console.log(newText);
        elem.html(newText);
    }

    $(".mw-body-content p").each(function() {
        console.log("iterating " + $( this ));
        replaceInnerText($( this ));
    });
})();
