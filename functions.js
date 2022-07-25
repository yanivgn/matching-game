//timer functions

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function loadJson(url) {
  var json;
  $.ajax({
    url: url,
    async: false,
    dataType: "json",
    success: function (response) {
      json = response;
    },
  });
  return json;
}

function getParam(param) {
  return new URLSearchParams(window.location.search).get(param);
}

function getRandomWords(number, Words) {
  return Words.map((x) => ({ x, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map((a) => a.x)
    .slice(0, number);
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