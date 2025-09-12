'use strict'
// 1行目に記載している 'use strict' は削除しないでください

//const dataURL = "http://127.0.0.1:5500/Assignment_FlashCard/submission/data/data.json";
const dataURL_DIG = "https://raw.githubusercontent.com/msbuhtig/sumie_mase.fnd39/main/data/data_DIG.json";
const dataURL_Eng = "https://raw.githubusercontent.com/msbuhtig/sumie_mase.fnd39/main/data/data_EnglWords.json";
const numQuestions = 3;
const imgMain = "images/jungle_track.png";
const imgEnding = "images/ending.jpeg";
const imgBadEnding = "images/badending.jfif";
const imgCollect = "images/btn_correct.jfif";
const imgIncollect = "images/btn_incorrect.jfif";

let words = [];
let currentIdx = 0;
let incollectIdx = 1;
let isLeftCollect = true;
let arrAskedIdx = [];
let dataURL = "https://raw.githubusercontent.com/msbuhtig/sumie_mase.fnd39/main/data/data.json";
let selectId = 0;

const gameStart = document.getElementById("start");
const selector = document.getElementById("selector");
const db = document.getElementById("db");
const main = document.getElementById("main");
const topic = document.getElementById("topic");
const leftCard = document.getElementById("left-card");
const rightCard = document.getElementById("right-card");
const ending = document.getElementById("ending");
const nextGame = document.getElementById("btnNextGame");


/**
 * @param {string} url - JSONファイルのパス
 */
// const getJSON = async function (url) {
//   const request = new Request(url);
//   const response = await fetch(request);
//   return await response.json();

    // JSONファイルの取込が終わったら 開始ボタンを有効化したい
    // const button = document.getElementById('myButton');
    // button.disabled = false; // disabled属性を解除
// };
const getJSON = function (url) {
  const req = new XMLHttpRequest();
  req.onload = (e) => {
    const array = req.response;
    words = [...array];
  };
  req.open("GET", url);
  req.responseType = "json";
  req.send();
  };

const checkFinal = function () {
  return (arrAskedIdx.length < numQuestions) ? true : false;
}

const postProc = function () {
  main.style.display = "none";
  document.body.style.backgroundImage = `url('${imgEnding}')`;
  ending.style.display = "block";
}

const questionRoulette = function (targetIdx) {
  if (arrAskedIdx.indexOf(targetIdx) === -1) {
    arrAskedIdx.push(targetIdx);
  } else {
    targetIdx = questionRoulette(Math.floor(Math.random() * words.length));
  }
  return targetIdx;
}

const incollectChoiceRoulette = function (targetIdx) {
  if (targetIdx === currentIdx || targetIdx === incollectIdx)
    targetIdx = incollectChoiceRoulette(Math.floor(Math.random() * words.length));
  return targetIdx;
}

const setIndex = function () {
  currentIdx = questionRoulette(Math.floor(Math.random() * words.length));
  incollectIdx = incollectChoiceRoulette(Math.floor(Math.random() * words.length));
}

const setCard = function () {
  setIndex();
  topic.textContent = words[currentIdx].topic;
  if (Math.round(Math.random()) === 0) {
    leftCard.textContent = words[currentIdx].meaning;
    rightCard.textContent = words[incollectIdx].meaning;
    isLeftCollect = true;
  } else {
    leftCard.textContent = words[incollectIdx].meaning;;
    rightCard.textContent = words[currentIdx].meaning;
    isLeftCollect = false;
  }}

const showNextTopic = function () {
  if (!checkFinal()) postProc();
  if (isLeftCollect) {
    leftCard.style.backgroundImage = "";
  } else {
    rightCard.style.backgroundImage = "";
  }
  setCard();
};

const showBadEnding = function () {
    main.style.display = "none";
    document.body.style.backgroundImage = `url('${imgBadEnding}')`;
    ending.style.display = "block";
};

document.addEventListener("DOMContentLoaded", () => {
  getJSON(dataURL);
});

leftCard.addEventListener("click", () => {
  const prevIdx = currentIdx;
  if (isLeftCollect) {
    leftCard.textContent = "";
    leftCard.style.backgroundImage = `url('${imgCollect}')`;
    const timer = setTimeout(showNextTopic, 3000);
    if (prevIdx !== currentIdx) clearTimeout(timer);
  } else {
    leftCard.textContent = "";
    leftCard.style.backgroundImage = `url('${imgIncollect}')`;
    const timer = setTimeout(showBadEnding, 3000);
  }
});

rightCard.addEventListener("click", () => {
  const prevIdx = currentIdx;
  if (isLeftCollect) {
    rightCard.textContent = "";
    rightCard.style.backgroundImage = `url('${imgIncollect}')`;
    const timer = setTimeout(showBadEnding, 3000);
  } else {
    rightCard.textContent = "";
    rightCard.style.backgroundImage = `url('${imgCollect}')`;
    const timer = setTimeout(showNextTopic, 3000);
    if (prevIdx !== currentIdx) clearTimeout(timer);
  }
});

gameStart.addEventListener("click", () => {
  gameStart.style.display = "none";
  selector.style.display = "none";
  main.style.display = "block";
  setCard();
});

nextGame.addEventListener("click", () => {
  location.reload();
  db.options[selectId].selected = true;
});

db.onchange = function(){
  if (this.value === "DIG") dataURL = dataURL_DIG;
  if (this.value === "English") dataURL = dataURL_Eng;
  getJSON(dataURL);
}

////////////////////////////////////////////////////////////////
// 発表後に追加した部分
////////////////////////////////////////////////////////////////

// 参考サイト）https://jp-seemore.com/web/28716/
////////////////////////////////////////////////////////////////
function updateLayout() {
  if (screen.orientation.type.includes("portrait")) {
    console.log("縦長のレイアウトを適用します。");
    document.body.classList.add("portrait");
    document.body.classList.remove("landscape");
  } else {
    console.log("横長のレイアウトを適用します。");
    document.body.classList.add("landscape");
    document.body.classList.remove("portrait");
  }
}

screen.orientation.addEventListener("change", updateLayout);
updateLayout(); // 初期化時にも呼び出す



// 参考サイト）https://www.jslab.digibeatrix.com/javascript-api/dom-manipulation/javascript-swipe-feature-implementation/
////////////////////////////////////////////////////////////////
let startX, startY, endX, endY; // 座標を記録する変数

// タッチ開始時の座標を取得
document.addEventListener('touchstart', function (e) {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});

// タッチ終了時の座標を取得し、スワイプ方向を判定
document.addEventListener('touchend', function (e) {
  endX = e.changedTouches[0].clientX;
  endY = e.changedTouches[0].clientY;

  let diffX = endX - startX; // X方向の移動距離
  let diffY = endY - startY; // Y方向の移動距離

  // 横方向のスワイプ判定
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      console.log('右スワイプ');
    } else {
      console.log('左スワイプ');
    }
  } 
  // 縦方向のスワイプ判定
  else {
    if (diffY > 0) {
      console.log('下スワイプ');
    } else {
      console.log('上スワイプ');
    }
  }
});