/**
 * 演算子とその優先順位
 */
const operators = [
  { name: "+", priority: 12 },
  { name: "-", priority: 12 },
  { name: "*", priority: 13 },
  { name: "/", priority: 13 },
  { name: "%", priority: 13 },
  { name: "(", priority: 0 },
  { name: ")", priority: 0 },
];

/**
 * クライアントチェック　簡易（括弧）
 * @param {string} text
 * @returns
 */
const checkBracketsSimple = function (text : string) : boolean {
  var re = /\([^()]*\)/g;

  while (text.match(re)) text = text.replace(re, "");

  if (text.match(/[()]/)) return false;

  return true;
};

/**
 * 優先順位取得
 * @param {string} exp
 * @returns 優先順位
 */
const getPriority = function (exp : string)  : number {
  for (let index = 0; index < operators.length; index++) {
    const element = operators[index];
    if (element.name === exp) {
      return element.priority;
    }
  }
  return -1;
};

/**
 * 演算子かどうか判定
 * @param {string} exp
 * @returns
 */
const isOperator = function (exp : string) : boolean {
  for (let index = 0; index < operators.length; index++) {
    const element = operators[index];
    if (element.name === exp) {
      return true;
    }
  }
  return false;
};

/**
 * 記述式を逆ポーランド式へ変換
 * @param {string} exp
 * @returns 逆ポーランド記法の配列
 */
const formulaToRpn = function (exp : string) : string[] {
  // 配列の構築
  let originArray = [];
  do {
    // 小数、整数 を取り出す
    let digit = exp.match(/(^[0-9.]+(\.[0-9]+)?)/i);
    // 簡単な小数チェック
    if (digit != null) {
      if ((digit[0].match(/\./g) || []).length > 1) {
        throw "小数点が多いです。";
      }
    }
    if (digit != null) {
      if (digit[0].charAt(0) === ".") {
        originArray.push("0" + digit[0]);
      } else {
        originArray.push(digit[0]);
      }

      exp = exp.substring(digit[0].length);
      continue;
    }

    // 演算子 を取り出す
    for (let index = 0; index < operators.length; index++) {
      const element = operators[index];
      //   alert(element.name);
      if (exp.indexOf(element.name) === 0) {
        exp = exp.substring(element.name.length);
        originArray.push(element.name);
        break;
      }
    }
  } while (exp.length > 0);

  // 出力配列
  let outputArray : string[] = [];
  // 演算子用のワーキングスタック
  let workingStack : string[] = [];
  // ひとつ前の情報（正数、負数判断用）
  let oneBefore = "";
  // 2.１つずつ取り出す
  originArray.forEach((originItem) => {
    switch (originItem) {
      case "(":
        //  ( の場合スタック配列の先頭へ
        workingStack.unshift(originItem);
        // console.log("RPN構築@右括弧:" + workingStack);
        break;
      case ")":
        // ) の場合( が出るまでスタック先頭から取り出して出力
        while (workingStack.length > 0 && workingStack[0] !== "(") {
          outputArray.push(workingStack[0]);
          workingStack.shift();
        }
        // 取り出したあと、左括弧をスタックから取り出す。
        workingStack.shift();

        // console.log("RPN構築@左括弧:" + workingStack);
        break;
      case "+":
      case "-":
        //   正数、負数の判断
        if (
          outputArray.length == 0 ||
          (oneBefore != ")" && isOperator(oneBefore))
        ) {
          if (originItem == "+") {
            outputArray.push("positive");
          } else {
            outputArray.push("negative");
          }
        } else {
          // スタック先頭の演算子が優先度高い場合、取り出す（繰り返し）
          while (
            workingStack.length > 0 &&
            getPriority(workingStack[0]) >= getPriority(originItem)
          ) {
            outputArray.push(workingStack[0]);
            // console.log("RPN構築@優先度判断あり:+-begin    " + workingStack);
            workingStack.shift();
            // console.log("RPN構築@優先度判断あり:+-enddd    " + workingStack);
          }
          //   スタックの先頭に保持する
          workingStack.unshift(originItem);
          //   console.log("RPN構築@演算子保持:+-keep    " + workingStack);
        }
        break;
      case "*":
      case "/":
      case "%":
        // スタック先頭の演算子が優先度高い場合、取り出す（繰り返し）
        while (
          workingStack.length > 0 &&
          getPriority(workingStack[0]) >= getPriority(originItem)
        ) {
          outputArray.push(workingStack[0]);
          //   console.log("RPN構築@優先度判断あり:+-begin    " + workingStack);
          workingStack.shift();
          //   console.log("RPN構築@優先度判断あり:+-enddd    " + workingStack);
        }
        //   スタックの先頭に保持する
        workingStack.unshift(originItem);
        // console.log("RPN構築@演算子保持:+-keep    " + workingStack);

        break;
      default:
        //   数値の場合、そのまま出力へ
        outputArray.push(originItem);
      // console.log("出力情報構築:" + outputArray);
    }
    oneBefore = originItem;
    // console.log("oneBefore:" + oneBefore);
  });
  // stackの情報を全部移送してから、新し演算子を入れる
  //   console.log("RPN構築@数字last:" + workingStack);
  workingStack.forEach((element) => {
    outputArray.push(element);
  });
  workingStack = [];

  //   console.log("出力情報構築（戻り値）:" + outputArray);
  return outputArray;
};

/**
 * 逆ポーランド式から計算結果を求める
 * @param {string} exp
 * @returns 計算結果
 */
const rpnToCalculatedResult = function (exp : string[]) : string {
  if (exp.length == 0) {
    return "";
  }
  // 数字なら、スタックへ
  // 記号の場合、スタックに記憶されている最も右側の2つの数値を取り出し、計算する、計算した結果を再度スタックへ格納する
  //   console.log(exp);
  let formulaArray : string[] = exp;
  let workingStack : string[] = [];
  let posneg : string = "";

  while (formulaArray.length > 0) {
    let item = formulaArray[0];
    let lastOne = null;
    let lastTwo = null;
    if (!isOperator(item)) {
      // 正数負数対応
      if (item === "positive") {
        // 続きの数字を読み込む（後ろに数字である前提）
        posneg = "+";
        formulaArray.shift();
        continue;
      } else if (item === "negative") {
        posneg = "-";
        formulaArray.shift();
        continue;
      } else {
        workingStack.push(posneg + item);
        // console.log(workingStack);
        formulaArray.shift();
        posneg = "";
        //   console.log(formulaArray);
      }
    } else {
      switch (item) {
        case "+":
          lastOne = parseFloat(workingStack.pop() || "");
          lastTwo = parseFloat(workingStack.pop() || "");
          workingStack.push((lastTwo + lastOne).toString());
          //   console.log(lastTwo + lastOne);
          break;
        case "-":
          lastOne = parseFloat(workingStack.pop() || "");
          lastTwo = parseFloat(workingStack.pop() || "");
          workingStack.push((lastTwo - lastOne).toString());
          //   console.log(lastTwo - lastOne);
          break;
        case "*":
          lastOne = parseFloat(workingStack.pop() || "");
          lastTwo = parseFloat(workingStack.pop() || "");
          if (isNaN(lastOne) || isNaN(lastTwo)) {
            throw "計算は正しく行うことができません。";
          }
          workingStack.push((lastTwo * lastOne).toString());
          //   console.log(lastTwo * lastOne);
          break;
        case "/":
          lastOne = parseFloat(workingStack.pop() || "");
          lastTwo = parseFloat(workingStack.pop() || "");
          if (isNaN(lastOne) || isNaN(lastTwo) || lastOne === 0) {
            throw "計算は正しく行うことができません。";
          }
          workingStack.push((lastTwo / lastOne).toString());
          //   console.log(lastTwo / lastOne);
          break;
        case "%":
          lastOne = parseFloat(workingStack.pop() || "");
          lastTwo = parseFloat(workingStack.pop() || "");
          if (isNaN(lastOne) || isNaN(lastTwo) || lastOne === 0) {
            throw "計算は正しく行うことができません。";
          }
          workingStack.push((lastTwo % lastOne).toString());
          //   console.log(lastTwo % lastOne);
          break;
        default:
        //   console.log("default ... strange: " + item);
      }
      formulaArray.shift();
    }
  }
  //   console.log(workingStack);
  return workingStack.pop() || "";
};
