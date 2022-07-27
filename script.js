let currentCard;
let count = 0;
let timeCount = 0;
let entered_before = false;

//to enable or disable sound
let allow_sound = true;

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
//  this code if for the timer

var minutesLabel = document.getElementById("timer");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
var timer;

//start the timer and game
$("#start_game-btn").click(function () {
  timer = setInterval(setTime, 1000);
  $("#popup_container").css("display", "none");
});

var allwords = loadJson("data.json");

var gameId = getParam("id");
let filteredWords;
let gametype;

if (!(gameId in allwords)) {
  console.log("משחק לא קיים!");
  throw new Error("Game id is missing")
} else {
  filteredWords = allwords[gameId].cards;
  game_type = allwords[gameId].media;
}

//for game of matching audio to hebrew words
if (game_type == "audio") {
  $(".instructions").text("התאימו את ההקלטות בערבית לפירוש העברי ");
}

if (game_type == "image") {
  $(".instructions").text("התאימו את התמונות לטקסט בערבית ");
}

//pick random indexes:
function shuffle(array) {
  var i = array.length,
    j = 0,
    temp;
  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

//we use 3 arrays to pick the cards randomly

//here- create array of indexes, in the size of the number of words
let number_of_pairs = filteredWords.length;
let array_of_indexes = [];
for (let i = 0; i < 2 * number_of_pairs; i++) {
  array_of_indexes.push(i);
}
let array_of_random_indexes = shuffle(array_of_indexes);

//array with double indexes to identify matching cards
let array_of_data = []; //[0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
for (let i = 0; i < number_of_pairs; i++) {
  array_of_data.push(i, i);
}

let words_array = [];
let audio_array = [];

$.each(filteredWords, function (i, word) {
  words_array.push(word["sideA"]);
  words_array.push(word["sideB"]);
});

$.each(words_array, function (i, word) {
  var d1 = document.getElementById("cards-container");
  let counter1 = -1;
  let audio_counter = -1;
  let lang = "";
  let curr_audio;
  let style_font_size = "";

  for (const element of array_of_random_indexes) {
    counter1++;

    if (counter1 % 2 == 1) {
      audio_counter++;
      curr_audio = audio_array[audio_counter];
    }
    if (element == i) {
      if (words_array[counter1]) {
        if (words_array[counter1].length > 26) {
          style_font_size = 'style="font-size: 20px; " ';
        } else if (words_array[counter1].length > 18) {
          style_font_size = 'style="font-size: 22px;" ';
        } else {
          style_font_size = 'style="font-size: 25px;" ';
        }
      }

      if (counter1 % 2 == 1) {
        lang = "sideA";
        if (game_type === "audio") {
          d1.insertAdjacentHTML(
            "beforeend",
            `<div class="card match-${array_of_data[counter1]}" data-match="${array_of_data[counter1]}" data-group="${lang}" data-audio="${words_array[counter1]}"> <img src="media/audio_icon.png" width="40" alt="play audio"> </div>`
          );
        }
        else if (game_type === "image") {
          d1.insertAdjacentHTML(
            "beforeend",
            `<div style="padding:5px;box-sizing:border-box;height:100px;overflow:hidden;" class="card match-${array_of_data[counter1]}" data-match="${array_of_data[counter1]}" data-group="${lang}"><img style="width:120px" src="${words_array[counter1]}"></div>`
          );

        }
        else {
          d1.insertAdjacentHTML(
            "beforeend",
            `<div ${style_font_size} class="card match-${array_of_data[counter1]}" data-match="${array_of_data[counter1]}" data-group="${lang}" data-audio="${curr_audio}"> ${words_array[counter1]}</div>`
          );
        }
      } else {
        lang = "sideB";
        d1.insertAdjacentHTML(
          "beforeend",
          `<div ${style_font_size} class="card match-${array_of_data[counter1]}" data-match="${array_of_data[counter1]}" data-group="${lang}"> ${words_array[counter1]} </div>`
        );
      }
    }
  }

  counter1 = -1;
});

////////////////////////////////////////////////////////////////////////////////////////////////

// code of the game:
$(".card").each(function (index, card) {
  $(card).on("click", function (e) {
    if (game_type === "audio") {
      if ($(this).data("group") == "sideA") {
        let audio1 = $(this).data("audio");
        let audio2 = new Audio(audio1);
        audio2.play();
      }
    }

    if (currentCard) {
      // if current card is the past card and "this" is the current card
      const cards = document.querySelectorAll(".card");

      cards.forEach((card) => {
        card.style.pointerEvents = "none";
      });

      if (
        $(this).data("match") === currentCard.data("match") &&
        $(this).data("group") === currentCard.data("group")
      ) {
        // if we picked the same card twice
        $(this).css("outline", "2px solid orange");
        $(this).css("background", "#F7CD7C");
        currentCard = undefined;
        $(this).css("background", "white");
        $(this).css("outline", "white");
        cards.forEach((card) => {
          card.style.pointerEvents = "auto";
        });
      } else if ($(this).data("match") === currentCard.data("match")) {
        // if we picked the right card
        if (allow_sound) {
          new Audio("media/correct.wav").play();
        }
        let match = $(".match-" + $(this).data("match"));
        match.css("outline", "2px solid green").css("background", "lightgreen");
        count++;

        setTimeout(function () {
          match.css("visibility", "hidden");
          currentCard = undefined;

          if (count == number_of_pairs) {
            clearInterval(timer);
            document.getElementById("finish_timer").textContent =
              document.getElementById("timer").textContent;
            document.getElementById("finish_seconds").textContent =
              document.getElementById("seconds").textContent;
            $("#cards-container").css("display", "none");
            $(".end").css("display", "block");

            if (allow_sound) {
              new Audio("../media/applause.mp3").play();
            }
            confetti();
          }
          cards.forEach((card) => {
            card.style.pointerEvents = "auto";
          });
        }, 250);
      } else {
        // if wrong
        if (allow_sound) {
          new Audio("media/wrong.wav").play();
        }
        $(this).css("outline", "2px solid red");
        $(this).css("background", "#ff000091");
        currentCard.css("outline", "2px solid red");
        currentCard.css("background", "#ff000091");
        var thisCard = $(this);
        currentCard.css("animation", "shake 0.5s");
        thisCard.css("animation", "shake 0.5s");

        //after a while we should remove the red on the cards
        setTimeout(function () {
          currentCard.css("outline", "2px solid white");
          currentCard.css("background", "white");
          thisCard.css("background", "white");
          thisCard.css("outline", "2px solid white");
          currentCard.css("animation", "still");
          thisCard.css("animation", "still");
          currentCard = undefined;

          cards.forEach((card) => {
            card.style.pointerEvents = "auto";
          });
        }, 500);
      }
    } else {
      // we picked the first card and currenCard is none
      $(this).css("outline", "2px solid orange");
      $(this).css("background", "#F7CD7C");
      currentCard = $(this);
    }
  });
});

//new click when we want to restart the game
$(".restart-btn").on("click", (e) => location.reload());

//new restart when we want to restart the game when it ends
$(".another_game-btn").on("click", (e) => location.reload());

// to show all the words in the end
$("#words_display-btn").click(function () {
  let words_display = document.getElementById("words_learned");

  if (!entered_before) {
    $.each(filteredWords, function (i, word) {
      words_display.insertAdjacentHTML(
        "beforeend",
        "<div>" + word["sideA"] + "   =   " + word["sideB"] + "</div>"
      );
    });
  }

  $("#words_learned").css("display", "block");
  $("#words_display-btn").css("display", "none");
  $("#words_hide-btn").css("display", "inline-block");

  entered_before = true;
});

$("#words_hide-btn").click(function () {
  $("#words_learned").css("display", "none");
  $("#words_display-btn").css("display", "inline-block");
  $("#words_hide-btn").css("display", "none");
});

parent.postMessage(document.body.offsetHeight + "px", "*");

window.addEventListener("message", function (event) {
  if (event.data.username) {
    document.querySelector(".username").innerHTML = event.data.username;
  }
});

//to enable and disable sound
$("#enable_sound").click(function () {
  allow_sound = true;
  $("#enable_sound").css("display", "none");
  $("#disable_sound").css("display", "inline-block");
});

$("#disable_sound").click(function () {
  allow_sound = false;
  $("#enable_sound").css("display", "inline-block");
  $("#disable_sound").css("display", "none");
});