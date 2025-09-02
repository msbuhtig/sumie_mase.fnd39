'use strict'
// 1行目に記載している 'use strict' は削除しないでください

// const words = [
//   { word: "apple", meaning: "りんご" },
//   { word: "banana", meaning: "バナナ" },
//   { word: "cat", meaning: "猫" },
//   { word: "dog", meaning: "犬" },
//   { word: "elephant", meaning: "象" }
// ];

const dataURL = "http://127.0.0.1:5500/Assignment_FlashCard/submission/data/data.json";
const numQuestions = 10;
const imgEnding = "images/bg_ending.jpeg";
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

const questionRoulette = function () {
  const targetIdx = (Math.floor(Math.random() * words.length));
  if (arrAskedIdx.indexOf(targetIdx) !== -1) {
    questionRoulette();
  } else {
    arrAskedIdx.push(targetIdx);
    return targetIdx;
  }
}

const incollectChoiceRoulette = function () {
  const targetIdx = (Math.floor(Math.random() * words.length));
  if (targetIdx === currentIdx || targetIdx === incollectIdx) {
    incollectChoiceRoulette();
  } else {
    return targetIdx;
  }
}

const showNextTopic = function () {
  if (!checkFinal()) postProc();

  if (isLeftCollect) {
    leftCard.style.backgroundImage = "";
  } else {
    rightCard.style.backgroundImage = "";
  }

  currentIdx = questionRoulette();
  incollectIdx = incollectChoiceRoulette();
  topic.textContent = words[currentIdx].topic;
  if (Math.round(Math.random()) === 0) {
    leftWord.textContent = words[currentIdx].meaning;
    rightWord.textContent = words[incollectIdx].meaning;
    isLeftCollect = true;
  } else {
    leftWord.textContent = words[incollectIdx].meaning;;
    rightWord.textContent = words[currentIdx].meaning;
    isLeftCollect = false;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  getJSON(dataURL);
});

leftCard.addEventListener("click", () => {
  const prevIdx = currentIdx;
  if (isLeftCollect) {
    leftWord.textContent = "";
    leftCard.style.backgroundImage = `url('${imgCollect}')`;
  } else {
    rightWord.textContent = "";
    rightCard.style.backgroundImage = `url('${imgCollect}')`;
  }
  const timer = setTimeout(showNextTopic, 3000);
  if (prevIdx !== currentIdx) clearTimeout(timer);
});

rightCard.addEventListener("click", () => {
  const prevIdx = currentIdx;
  if (isLeftCollect) {
    leftWord.textContent = "";
    leftCard.style.backgroundImage = `url('${imgCollect}')`;
  } else {
    rightWord.textContent = "";
    rightCard.style.backgroundImage = `url('${imgCollect}')`;
  }
  const timer = setTimeout(showNextTopic, 3000);
  if (prevIdx !== currentIdx) clearTimeout(timer);
});

gameStart.addEventListener("click", () => {
  gameStart.remove();
  main.style.display = "block";

  currentIdx = questionRoulette();
  incollectIdx = incollectChoiceRoulette();

  topic.textContent = words[currentIdx].topic;
  if (Math.round(Math.random()) === 0) {
    leftWord.textContent = words[currentIdx].meaning;
    rightWord.textContent = words[incollectIdx].meaning;
    isLeftCollect = true;
  } else {
    leftWord.textContent = words[incollectIdx].meaning;;
    rightWord.textContent = words[currentIdx].meaning;
    isLeftCollect = false;
  }

  leftWord.style.display = "block";
  rightWord.style.display = "block";
});

nextGame.addEventListener("click", () => {
  location.reload();
});
