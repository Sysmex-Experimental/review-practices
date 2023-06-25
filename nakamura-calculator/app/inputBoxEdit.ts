/* 入力部編集処理 */

/**
 * input-formula編集
 * @param {string} input 入力文字列
 * @param {boolean} overwrite 上書きフラグ(true:上書き,false:追加書き)
 */
export const setinputFormula = (input: string, overwrite: boolean):void => {
  const input_formula = document.getElementsByClassName("input-formula")[0] as HTMLInputElement
  if (overwrite) {
    input_formula.value = input;
  } else {
    input_formula.value += input;
  }
};

/**
 * input-formula編集
 * @param {string} input 入力文字列
 * @param {boolean} overwrite 上書きフラグ(true:上書き,false:追加書き)
 */
export const setinputMonitor = (input: string, overwrite:boolean):void => {
  const input_monitor = document.getElementsByClassName("input-monitor")[0] as HTMLInputElement
  if (overwrite) {
    input_monitor.value = input;
  } else {
    input_monitor.value += input;
  }
};
