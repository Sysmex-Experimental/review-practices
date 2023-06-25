/** ボタン活性状態コントロール処理 */

import { countEndBracket, countStartBracket } from "./utils.js";

/**
 * 算術演算子活性状態一括切り替え
 * @param {boolean} not_use
 */
export const changeAllOperatorsDisabled = (not_use: boolean): void => {
  const operatorButtons = Array.from(
    document.getElementsByClassName("operator-button")
  ) as HTMLButtonElement[];
  operatorButtons.map((operatorButton) => (operatorButton.disabled = not_use));
};

/**
 * 算術演算子活性状態切り替え
 * @param {HTMLButtonElement} operator_button
 */
export const changeOperatorDisabled = (operator_button: HTMLButtonElement):void => {
  operator_button.disabled = !operator_button.disabled;
};

/**
 * (ボタン活性状態変更
 * @param {boolean} disabled
 */
export const changeStartBracketDisabled = (disabled: boolean):void => {
  const start_bracket = document.getElementsByClassName("start-bracket")[0] as HTMLButtonElement
  start_bracket.disabled = disabled;
};

/**
 * )ボタン活性状態変更
 * @param {boolean} disabled
 */
export const changeEndBracketDisabled = (disabled: boolean):void => {
  const end_bracket = document.getElementsByClassName("end-bracket")[0] as HTMLButtonElement
  // )の数より(の数が多い時だけ活性にする
  if (countStartBracket() > countEndBracket()) {
    end_bracket.disabled = disabled;
  } else {
    end_bracket.disabled = true;
  }
};

/**
 * )ボタン活性状態変更
 * @param {boolean} disabled
 */
export const changePointDisabled = (disabled: boolean):void => {
  const point_button = document.getElementsByClassName("point-button")[0] as HTMLButtonElement
  point_button.disabled = disabled;
};
