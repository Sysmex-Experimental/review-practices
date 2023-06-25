/* その他処理 */

/**
 * 小数点入力済み判断
 * @returns 判定結果(入力済み:true, 未入力:false)
 */
export const hasPoint = (): boolean => {
  const input_monitor = document.getElementsByClassName("input-monitor")[0] as HTMLInputElement
  const monitor: string = input_monitor.value;

  if (monitor.indexOf(".") !== -1) {
    return true;
  } else {
    return false;
  }
};

/**
 * 演算子有無判定処理
 * @param {string[]} formula
 * @return 判定結果(有り:true, 無し:false)
 * @description
 */
export const hasOperator = (formula: string[]):boolean => {
  if (
    formula.indexOf("+") !== -1 ||
    formula.indexOf("-") !== -1 ||
    formula.indexOf("*") !== -1 ||
    formula.indexOf("/") !== -1
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * (個数カウント
 * @returns (の個数
 */
export const countStartBracket = (): number => {
  const input_formula = document.getElementsByClassName("input-formula")[0] as HTMLInputElement
  const formula: string = input_formula.value
  const START_BRACKET: string = "(";

  return countString(formula, START_BRACKET);
};

/**
 * )個数カウント
 * @returns (の個数
 */
export const countEndBracket = (): number => {
  const input_formula = document.getElementsByClassName("input-formula")[0] as HTMLInputElement
  const formula: string = input_formula.value
  const END_BRACKET: string = ")";

  return countString(formula, END_BRACKET);
};

/**
 * 検索文字列数カウント
 * @param {string} all_str 全文
 * @param {string} target_str 検索文字列
 * @returns 検索文字列の個数
 */
const countString = (all_str: string, target_str: string): number => {
  if (all_str.indexOf(target_str) !== -1) {
    let count: number = 0;
    const str: string[] = all_str.split('');
    str.map((chr: string) => {
      if (chr === target_str) {
        count++;
      }
    });
    return count;
  }

  return 0;
};

/**
 * 優先計算箇所検索処理
 * @param {string[]} formula
 * @returns 次に計算する箇所の演算子の要素番号
 */
export const findTopPriorityOperatorIndex = (formula: string[]):number => {
  const multiple_index:number = formula.indexOf("*");
  const divide_index:number = formula.indexOf("/");

  if (multiple_index === -1) {
    // 掛け算・割り算無し
    return divide_index === -1 ? 1 : divide_index;
  } else if (divide_index === -1) {
    return multiple_index;
  } else if (multiple_index <= divide_index) {
    return multiple_index;
  } else {
    return divide_index;
  }
};
