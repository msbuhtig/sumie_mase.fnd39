'use strict'
// 1行目に記載している 'use strict' は削除しないでください

// const words = [
//   { word: "apple", meaning: "りんご" },
//   { word: "banana", meaning: "バナナ" },
//   { word: "cat", meaning: "猫" },
//   { word: "dog", meaning: "犬" },
//   { word: "elephant", meaning: "象" }
// ];

let words = [];
let currentIdx = 0;
let nextIdx = 1;
let cntCollect = 0;

const gameStart = document.getElementsByClassName("start")[0];
const main = document.getElementsByClassName("main")[0];
const topic = document.getElementById("topic");
const leftCard = document.getElementById("left-card");
const leftWord = document.getElementById("left-word");
const leftAnswer = document.getElementById("left-answer");
const rightCard = document.getElementById("right-card");
const rightWord = document.getElementById("right-word");
const rightAnswer = document.getElementById("right-answer");


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
    console.log(words);
  };
  req.open("GET", url);
  req.responseType = "json";
  req.send();
  };

/**
 * @param {block|none} leftword - 左側のBOXに回答選択肢を表示するかどうか（"block" ⇒ 表示 / "none"  ⇒ 非表示）
 * @param {block|none} leftans - 左側のBOXに「正解」「不正解」を表示するかどうか（"block" ⇒ 表示 / "none"  ⇒ 非表示）
 * @param {block|none} rightword - 右側のBOXに回答選択肢を表示するかどうか（"block" ⇒ 表示 / "none"  ⇒ 非表示）
 * @param {block|none} rightans - 右側のBOXに「正解」「不正解」を表示するかどうか（"block" ⇒ 表示 / "none"  ⇒ 非表示）
 */
const updateDisplay = function (leftword, leftans, rightword, rightans) {
  leftWord.style.display = leftword;
  leftAnswer.style.display = leftans;
  rightWord.style.display = rightword;
  rightAnswer.style.display = rightans;
};

const showNextTopic = function () {
  currentIdx = (currentIdx + 1) % words.length;
  nextIdx = (nextIdx + 1) % words.length;
  topic.textContent = words[currentIdx].topic;
  if (Math.round(Math.random()) === 0) {
    leftWord.textContent = words[currentIdx].meaning;
    rightWord.textContent = words[nextIdx].meaning;
    leftAnswer.textContent = "正解";
    rightAnswer.textContent = "不正解・・・";
  } else {
    leftWord.textContent = words[nextIdx].meaning;
    rightWord.textContent = words[currentIdx].meaning;
    leftAnswer.textContent = "不正解・・・";
    rightAnswer.textContent = "正解";
  }
  updateDisplay("block", "none", "block", "none");
};

document.addEventListener("DOMContentLoaded", () => {
  getJSON("https://github.com/msbuhtig/sumie_mase.fnd39/blob/main/data/data.json");
});

leftCard.addEventListener("click", () => {
  const prevIdx = currentIdx;
  updateDisplay("none", "block", "block", "none");
  const timer = setTimeout(showNextTopic, 3000);
  if (prevIdx !== currentIdx) clearTimeout(timer);
});

rightCard.addEventListener("click", () => {
  const prevIdx = currentIdx;
  updateDisplay("block", "none", "none", "block");
  const timer = setTimeout(showNextTopic, 3000);
  if (prevIdx !== currentIdx) clearTimeout(timer);
});

gameStart.addEventListener("click", () => {
  gameStart.remove();
  main.style.display = "block";
  topic.textContent = words[0].topic;
  leftWord.textContent = words[0].meaning;
  rightWord.textContent = words[1].meaning;
  leftAnswer.textContent = "正解";
  rightAnswer.textContent = "不正解・・・";
  updateDisplay("block", "none", "block", "none");
});

