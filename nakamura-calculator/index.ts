/* 画面メイン処理(画面イベント処理+イベント処理から直接呼ばれる関数を定義) */
import { setAnswer } from "./calc.js";
import {
  changeAllOperatorsDisabled,
  changeOperatorDisabled,
  changeStartBracketDisabled,
  changeEndBracketDisabled,
  changePointDisabled,
} from "./buttonDisabledControl.js";
import {
  countEndBracket,
  countStartBracket,
  hasOperator,
  hasPoint,
} from "./utils.js";
import { setinputFormula, setinputMonitor } from "./inputBoxEdit.js";

let operator: string = "";

// Load時に各キーにイベント付与
onload = () => {
  const monitor = document.getElementsByClassName("input-monitor")[0] as HTMLInputElement;

  // numberキーにイベント付与
  const num_events = Array.from(
    document.getElementsByClassName("number-button")
  ) as HTMLButtonElement[];
  num_events.map((num_event: HTMLButtonElement) =>
    num_event.addEventListener("click", () => {
      monitor.value = inputNumberButton(Number(num_event.value), monitor.value);
    })
  );

  // 括弧キーにイベント付与
  const bracket_events = Array.from(
    document.getElementsByClassName("bracket-button")
  ) as HTMLButtonElement[];;
  bracket_events.map((bracket_event: HTMLButtonElement) =>
    bracket_event.addEventListener("click", () => {
      inputBracketButton(bracket_event.value, monitor.value);
    })
  );

  // 小数点キーにイベント付与
  document
    .getElementsByClassName("point-button")[0]
    .addEventListener("click", () => {
      monitor.value = inputPointButton(monitor.value);
    });

  // functionキーにイベント付与
  const function_events = Array.from(
    document.getElementsByClassName("function-button")
  ) as HTMLButtonElement[];;
  function_events.map((func_event: HTMLButtonElement) =>
    func_event.addEventListener("click", () => {
      operator = inputFunctionButton(func_event, monitor.value);
    })
  );

  // キーボード入力時のイベントを付与
  document.addEventListener('keypress', (e: KeyboardEvent) => {
    if (!Number.isNaN(parseInt(e.key))) {
      monitor.value = inputNumberButton(Number(e.key), monitor.value);
    } else {
      let button_element = document.getElementsByClassName("plus-button")[0] as HTMLButtonElement
      switch (e.key) {
        case "+":
          operator = inputFunctionButton(button_element, monitor.value);
          break;
        case "-":
          button_element = document.getElementsByClassName("minus-button")[0] as HTMLButtonElement
          operator = inputFunctionButton(button_element, monitor.value);
          break;
        case "*":
          button_element = document.getElementsByClassName("mutiple-button")[0] as HTMLButtonElement
          operator = inputFunctionButton(button_element, monitor.value);
          break;
        case "/":
          button_element = document.getElementsByClassName("divide-button")[0] as HTMLButtonElement
          operator = inputFunctionButton(button_element, monitor.value);
          break;
        case "=":
          button_element = document.getElementsByClassName("equal-button")[0] as HTMLButtonElement
          operator = inputFunctionButton(button_element, monitor.value);
          break;
        case "(" || ")":
          inputBracketButton(e.key, monitor.value);
          break;
        case ".":
          monitor.value = inputPointButton(monitor.value);
          break;
        default:
          break;
      }
    }
  })

  initialize();
};

/**
 * 初期化処理
 */
const initialize = ():void => {
  operator = "";
  changeAllOperatorsDisabled(true);
  setinputMonitor("0", true);
  changePointDisabled(true);
  changeStartBracketDisabled(false);
  changeEndBracketDisabled(true);
  setinputFormula("", true);
};

/**
 * 数字キー入力時処理
 * @param  {number} input
 * @param  {string} monitor
 * @returns 表示する数値
 */
const inputNumberButton = (input:number, monitor:string) :string => {
  let return_num: string = monitor;

  if (operator === "=") {
    // =入力後にnumberキーが入力された場合は初期化
    initialize();
    return_num = "";
  } else if (operator !== "") {
    // 算術演算子入力後にnumberキーが入力された場合は演算子をinput-formulaに書き込み
    setinputFormula(operator, false);
    setinputMonitor("0", true);
    operator = "";
    return_num = "0";
  }

  changeAllOperatorsDisabled(false);

  // 小数点を使えるようにする
  changePointDisabled(false);
  changeStartBracketDisabled(true);

  // )が入れられる場合は)ボタンを活性にする
  if (countStartBracket() !== 0 && countStartBracket() !== countEndBracket()) {
    changeEndBracketDisabled(false);
  }

  // 入力値が0かつinput-monitorの値も0の場合は、0のみを返却
  if (input === 0 && return_num === "0") {
    return return_num;
  }

  // 数字の結合を行う(小数点有無で分岐)
  if (return_num.indexOf(".") === -1) {
    return String(Number(return_num) * 10 + input);
  } else {
    return (return_num += String(input));
  }
};

/**
 * 数字キー以外の入力時処理
 * @param {HTMLButtonElement} key
 * @param {string} monitor
 * @returns なし
 */
const inputFunctionButton = (key: HTMLButtonElement, monitor: string):string => {
  const input_formula = document.getElementsByClassName("input-formula")[0] as HTMLInputElement

  switch (key.value) {
    case "=":
      if (
        String(input_formula.value).slice(
          -1
        ) !== ")"
      ) {
        setinputFormula(monitor, false);
      }

      setAnswer();

      changeAllOperatorsDisabled(false);

      // =押下時はinput-formulaを初期化
      setinputFormula("", true);
      changeStartBracketDisabled(false);
      break;
    case "clear":
      initialize();
      return "";
    default: //算術演算子ボタン押下後に別の算術演算子が押された時用に一旦全部活性にする
      // 対象の算術演算子ボタンのみを非活性にしてどれをクリックしているか分かるようにする。
      changeAllOperatorsDisabled(false);
      changeOperatorDisabled(key);

      // operatorに演算子が入っている状態でこの処理を行う場合は、演算子の切り替えのため、処理を行わない
      if (operator === "+" || operator === "-" || operator === "*" || operator === "/") {
        return key.value;
      }

      // 最後に入力したのが)の場合はinput-monitorの値を入れない
      if (
        String(input_formula.value).slice(
          -1
        ) !== ")"
      ) {
        setinputFormula(monitor, false);

        // 負数を条件から取り除く
        if (
          hasOperator(input_formula.value.split('').slice(1))
        ) {
          // 3つ以上の値の計算の場合
          setAnswer();
        }
      }

      changeStartBracketDisabled(false);
      changeEndBracketDisabled(true);

      break;
  }

  // 小数点を使えないようにする
  changePointDisabled(true);
  return key.value;
};

/**
 * 括弧入力
 * @param {string} bracket
 * @param {string} monitor
 */
const inputBracketButton = (bracket: string, monitor: string) => {
  if (operator === "=") {
    // =入力後にnumberキーが入力された場合は初期化
    initialize();
  } else if (operator !== "") {
    // 算術演算子入力後に(キーが入力された場合は演算子をinput-formulaに書き込み
    setinputFormula(operator, false);
    operator = "";
  }

  // (入力時の処理()
  if (bracket === "(") {
    setinputMonitor("0", true);
    changeAllOperatorsDisabled(true);
  }

  // )入力時の処理
  if (bracket === ")" && countStartBracket() <= countEndBracket()) {
    // )括弧の数が(括弧以上の場合は入力を無視する
    return;
  }

const input_formula = document.getElementsByClassName("input-formula")[0] as HTMLInputElement

  // // 現在入力されている数字が0でなければ、input-formulaに移す
  // )入力時の処理
  if (
    bracket === ")" &&
    String(input_formula.value).slice(
      -1
    ) !== ")"
  ) {
    setinputFormula(monitor, false);
    setAnswer();
  }

  setinputFormula(bracket, false);

  changeEndBracketDisabled(false);
};

/**
 * 小数点ボタン入力
 * @param {string} monitor
 * @returns 小数点を連結した文字列
 */
const inputPointButton = (monitor: string): string => {
  const point = ".";

  // １つの数値に対して小数点が２回押されないようにする
  if (!hasPoint()) {
    // 算術演算子ボタンは押せないようにする
    changeAllOperatorsDisabled(true);
    // 括弧ボタンは押せないようにする
    changeStartBracketDisabled(true);
    changeEndBracketDisabled(true);
    changePointDisabled(true);

    return (monitor += point);
  }

  // .入力済みの場合はそのまま
  return monitor;
};
