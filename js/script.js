'use strict'
// 1行目に記載している 'use strict' は削除しないでください

// const words = [
//   { word: "apple", meaning: "りんご" },
//   { word: "banana", meaning: "バナナ" },
//   { word: "cat", meaning: "猫" },
//   { word: "dog", meaning: "犬" },
//   { word: "elephant", meaning: "象" }
// ];

//const dataURL = "http://127.0.0.1:5500/Assignment_FlashCard/submission/data/data.json";
const dataURL = "https://raw.githubusercontent.com/msbuhtig/sumie_mase.fnd39/main/data/data.json";
const numQuestions = 3;
const imgEnding = "images/ending.jpeg";
const imgBadEnding = "images/badending.jfif";
const imgCollect = "images/btn_correct.jfif";
const imgIncollect = "images/btn_incorrect.jfif";

let words = [];
let currentIdx = 0;
let incollectIdx = 1;
let isLeftCollect = true;
let arrAskedIdx = [];

const gameStart = document.getElementById("start");
const main = document.getElementById("main");
const topic = document.getElementById("topic");
const leftCard = document.getElementById("left-card");
const leftWord = document.getElementById("left-word");
const leftAnswer = document.getElementById("left-answer");
const rightCard = document.getElementById("right-card");
const rightWord = document.getElementById("right-word");
const rightAnswer = document.getElementById("right-answer");
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
  main.remove();
  document.body.style.backgroundImage = `url('${imgEnding}')`;
  ending.style.display = "block";
//  ending.textContent = "おめでとうござます！ 全問正解です";
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
  console.log("targetIdx: ", targetIdx, "currentIdx: ", currentIdx, "incollectIdx: ", incollectIdx);

  if (targetIdx === currentIdx || targetIdx === incollectIdx)
    targetIdx = incollectChoiceRoulette(Math.floor(Math.random() * words.length));
  return targetIdx;
}

const setIndex = function () {
  currentIdx = questionRoulette(Math.floor(Math.random() * words.length));
  incollectIdx = incollectChoiceRoulette(Math.floor(Math.random() * words.length));
  console.log(currentIdx, incollectIdx);
}

const setCard = function () {
  setIndex();
  topic.textContent = words[currentIdx].topic;
  if (Math.round(Math.random()) === 0) {
    leftWord.textContent = words[currentIdx].meaning;
    rightWord.textContent = words[incollectIdx].meaning;
    isLeftCollect = true;
  } else {
    leftWord.textContent = words[incollectIdx].meaning;;
    rightWord.textContent = words[currentIdx].meaning;
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
    main.remove();
    document.body.style.backgroundImage = `url('${imgBadEnding}')`;
    ending.style.display = "block";
};

document.addEventListener("DOMContentLoaded", () => {
  getJSON(dataURL);
});

leftCard.addEventListener("click", () => {
  const prevIdx = currentIdx;
  if (isLeftCollect) {
    leftWord.textContent = "";
    leftCard.style.backgroundImage = `url('${imgCollect}')`;
    const timer = setTimeout(showNextTopic, 3000);
    if (prevIdx !== currentIdx) clearTimeout(timer);
  } else {
    leftWord.textContent = "";
    leftCard.style.backgroundImage = `url('${imgIncollect}')`;
    const timer = setTimeout(showBadEnding, 1000);
  }
});

rightCard.addEventListener("click", () => { // 右のカードをクリックしたら
  const prevIdx = currentIdx;
  if (isLeftCollect) {  // 左のカードが正解だったら
    rightWord.textContent = "";
    rightCard.style.backgroundImage = `url('${imgIncollect}')`; // 右のカードに 失敗 の画像を表示
    const timer = setTimeout(showBadEnding, 1000);
  } else {
    rightWord.textContent = "";
    rightCard.style.backgroundImage = `url('${imgCollect}')`;
    const timer = setTimeout(showNextTopic, 3000);
    if (prevIdx !== currentIdx) clearTimeout(timer);
  }
});

gameStart.addEventListener("click", () => {
  gameStart.remove();
  main.style.display = "block";
  setCard();
  leftWord.style.display = "block";
  rightWord.style.display = "block";
});

nextGame.addEventListener("click", () => {
  location.reload();
});
