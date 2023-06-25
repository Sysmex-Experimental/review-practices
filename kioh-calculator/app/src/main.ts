import { Modal } from 'bootstrap';

// ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※

// 制御フラグ、計算後、続けて入力する際に、新規式のスタートとしてみなすかどうか。
// true -> 新規式スタートとします。false -> しません。
let nextMode = false;

document.addEventListener(
  "DOMContentLoaded",
  function () {
    var btns = document
      .getElementsByClassName("main")[0]
      .querySelectorAll(".btn");

    btns.forEach((element) => {
      element.addEventListener(
        "click",
        function (this: HTMLInputElement) {
          //押されたボタンのValueで処理を振り分けます。
          switch (this.value) {
            case "AC":
              reset();
              break;
            case "equals":
              // =を押したときに 1.式を上段に書き込む　2.結果を計算する

              try {
                document.getElementById("formulaArea")!.innerText =
                  document.getElementById("resultArea")!.innerText;

                // document.getElementById("resultArea").innerText = eval(
                //   document.getElementById("resultArea").innerText
                // );
                if (
                  checkBracketsSimple(
                    document.getElementById("resultArea")!.innerText
                  )
                ) {
                  document.getElementById("resultArea")!.innerText =
                    rpnToCalculatedResult(
                      formulaToRpn(
                        document.getElementById("resultArea")!.innerText
                      )
                    );
                } else {
                  $("#errorContent").html(
                    "入力された式の括弧を記述を確認してください。計算できない記述になっています。" +
                      "<br/>" +
                      "<br/>" +
                      "入力された式　：　" + document.getElementById("resultArea")!.innerText +
                      "<br/>" +
                      "<br/>" +
                      "入力されている式を確認して、ACボタンで初期してください。"
                  );

                  $("#errorModal").modal("show");
                }
                
                nextMode = true;
              } catch (error) {
                $("#errorContent").html(
                  "入力された式が何かの問題があります（そのまま四則計算ができません）。" +
                    "<br/>" +
                    "<br/>" +
                    "内部エラー情報：　" +
                    error +
                    "<br/>" +
                    "入力された式　：　" +
                    document.getElementById("resultArea")!.innerText +
                    "<br/>" +
                    "<br/>" +
                    "入力されている式を確認して、ACボタンで初期してください。"
                );

                $("#errorModal").modal("show");
              }

              break;
            default:
              // 数字が来たら、式を更新する
              result(this.value);
          }
        },
        false
      );
    });
  },
  false
);

/**
 * 式を更新
 * @param {string} val 
 */
const result = function (val : string) {
  let formula = document.getElementById("formulaArea")!.innerText;

  // 新規入力モードの場合、一度メイン表示エリアをクリアします。
  if (nextMode) {
    document.getElementById("resultArea")!.innerText = "";
    nextMode = false;
  }

  // 0表記（初期表記とみなす）場合、一度空白にしてから式文字列を作ります。
  let result = document.getElementById("resultArea")!.innerText;
  if (result === "0") {
    result = "";
  }
  // 式文字列を結合します。
  document.getElementById("resultArea")!.innerText = result + val;
};

/**
 * 諸々リセットします。
 */
const reset = function () {
  document.getElementById("formulaArea")!.innerText = "Good Luck(^^)";
  document.getElementById("resultArea")!.innerText = "0";

  // for (let index = 1; index <= 6; index++) {
  //   document.getElementById("lotsixbox"+ index).innerText = "";
  // }

  nextMode = true;
};

/**
 * やり直し
 * @returns
 */
const getBack = function () {
  if (document.getElementById("resultArea")!.innerText === "0") {
    return;
  } else if (document.getElementById("resultArea")!.innerText.length == 1) {
    document.getElementById("resultArea")!.innerText = "0";
  } else {
    document.getElementById("resultArea")!.innerText = document
      .getElementById("resultArea")!
      .innerText.slice(0, -1);
  }
};

/**
 * 貼り付け
 */
document.addEventListener("paste", (event) => {
  // alert("1");
  // let paste = (event.clipboardData || window.clipboardData).getData("text");
  let paste = (event.clipboardData)?.getData("text");

  document.getElementById("resultArea")!.innerText = paste || "";

  event.preventDefault();
});

/**
 * イベント
 * @param {} event
 * @returns
 */
document.onkeydown = function (event) {
  // alert(event.key);
  if (event.key === "Enter") {
    document.getElementById("equalButton")!.click();
    return false;
  } else if (event.key === "Escape") {
    reset();
    // return false;
  } else if (event.key === "1") {
    result(event.key);
  } else if (event.key === "2") {
    result(event.key);
  } else if (event.key === "3") {
    result(event.key);
  } else if (event.key === "4") {
    result(event.key);
  } else if (event.key === "5") {
    result(event.key);
  } else if (event.key === "6") {
    result(event.key);
  } else if (event.key === "7") {
    result(event.key);
  } else if (event.key === "8") {
    result(event.key);
  } else if (event.key === "9") {
    result(event.key);
  } else if (event.key === "0") {
    result(event.key);
  } else if (event.key === ".") {
    result(event.key);
  } else if (event.key === "(") {
    result(event.key);
  } else if (event.key === ")") {
    result(event.key);
  } else if (event.key === "%") {
    result(event.key);
  } else if (event.key === "/") {
    result(event.key);
  } else if (event.key === "*") {
    result(event.key);
  } else if (event.key === "+") {
    result(event.key);
  } else if (event.key === "-") {
    result(event.key);
  } else if (event.key === "Backspace") {
    getBack();
  }
};

// ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※

// ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
// 以下おまけです。。。
// const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const myLot =  function () {
//   let lot6 = new Array();
//   for (let index = 1; index <= 41; index++) {
//     lot6.push(index);
//   }

//   for (let index = 1; index <= 6; index++) {
//     lot6 = arrayRemove(lot6, setLot(lot6, "lotsixbox"+ index));
//   }
// };

// const setLot = function(lot6, target) {
//   let lotNumber = 0;
//   //一つ目をセット
//   for (let index = 0; index < 500; index++) {
//     // await _sleep(0.01);
//     document.getElementById(target).innerText = Math.floor(
//       Math.random() * 41 + 1
//     );
//   }
//   // 確定
//   lotNumber = Math.floor(Math.random() * 41 + 1);
//   while(!lot6.includes(lotNumber))
//   {
//     lotNumber = Math.floor(Math.random() * 41 + 1);
//   }
//   document.getElementById(target).innerText = lotNumber;
//   return lotNumber;
// }

// const arrayRemove = function (arr, value) {
//   return arr.filter(function(ele){
//       return ele != value;
//   });
// }
// ※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※※
