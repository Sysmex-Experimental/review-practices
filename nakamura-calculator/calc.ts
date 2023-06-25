/* 計算関連処理 */

import {
  countEndBracket,
  countStartBracket,
  findTopPriorityOperatorIndex,
  hasOperator,
} from "./utils.js";
/**
 * 計算結果書込処理
 */
export const setAnswer = (): void => {
  const calc_element = document.getElementsByClassName("input-formula")[0] as HTMLInputElement
  const calc_str: string = calc_element.value;
  let analyzed_formula: string[] = distinguishNumberCharactor(calc_str.split(''));

  // かっこがなくなるまで繰り返す
  while (analyzed_formula.indexOf("(") !== -1) {
    analyzed_formula = sortFormula(analyzed_formula);
  }

const input_monitor = document.getElementsByClassName("input-monitor")[0] as HTMLInputElement

  // 数式が残っていれば計算処理を行う
  if (hasOperator(analyzed_formula)) {
    input_monitor.value =
      String(calculateFormula(analyzed_formula));
  } else {
    input_monitor.value =
      analyzed_formula[0];
  }
};

/**
 * 括弧除去済数式計算処理
 * @param {string[]} analyzed_formula
 * @returns
 */
const calculateFormula = (analyzed_formula: string[]):number => {
  // 掛け算・割り算から優先して計算していく
  while (analyzed_formula.length > 2) {
    const target_operator_index: number =
      findTopPriorityOperatorIndex(analyzed_formula);

    let answer: number = calculatePart(
      Number(analyzed_formula[target_operator_index - 1]),
      analyzed_formula[target_operator_index],
      Number(analyzed_formula[target_operator_index + 1])
    );

    analyzed_formula.splice(target_operator_index - 1, 3, String(answer));
  }

  return Number(analyzed_formula[0]);
};

/**
 * 数字連結処理
 * @param {string[]} formula 数式文字列(１文字ずつ分割)
 * @returns 解析済み配列
 * @description 
 * 2桁以上の数字が配列にバラバラに格納されているので、結合して１つの数字として扱えるようにする
 * ex) 1,1,+,2,4 ⇨ 11,+,24 
 */
const distinguishNumberCharactor = (formula: string[]):string[] => {
  let analyzed: string[] = [];

  formula.map((chr: string) => {
    if (analyzed.length === 0) {
      analyzed.push(chr);
    } else {
      // 以下いずれかの条件に該当する時は連結を行う
      // 1.処理中の値が数字かつ読込済み配列の最終要素が数字
      // 2.処理中の値が小数点
      // 3.読込済み配列の長さが1かつ入っているものが"-"かつ処理中の値が数字
      if (
        (!Number.isNaN(parseInt(chr)) &&
          !Number.isNaN(parseInt(analyzed[analyzed.length - 1]))) ||
        chr === "." || (analyzed.length === 1 && analyzed[analyzed.length - 1] === "-" && !Number.isNaN(parseInt(chr)))
      ) {
        // 数字は連結する
        analyzed[analyzed.length - 1] += chr;
      } else {
        // 演算子や括弧はそのまま1文字として扱う
        analyzed.push(chr);
      }
    }
  });

  const lack_bracket_count: number = countStartBracket() - countEndBracket();
  if (lack_bracket_count !== 0) {
    // 不足分の)を補完する
    [...Array(lack_bracket_count)].map(() => analyzed.push(")"));
  }

  return analyzed;
};

/**
 * 計算処理
 * @param {number} val_a
 * @param {string} calc_operator
 * @param {number} val_b
 * @returns 計算結果
 */
const calculatePart = (val_a: number, calc_operator: string, val_b: number) => {
  let answer: number = 0;

  switch (calc_operator) {
    case "+":
      answer = val_a + val_b;
      break;
    case "-":
      answer = val_a - val_b;
      break;
    case "*":
      answer = val_a * val_b;
      break;
    case "/":
      if (val_b === 0) {
        // ０除算の場合は、０を入れておく
        answer = 0;
        break;
      }
      answer = val_a / val_b;
      break;
    default:
      // 数値入力後そのまま＝を押した場合
      answer = val_b;
  }

  return answer;
};

/**
 * 括弧分解処理
 * @param {string[]} analyze_formula
 */
const sortFormula = (analyze_formula: string[]): string[] => {
  // 括弧を使用していない場合はそのまま返却
  if (analyze_formula.indexOf("(") === -1) {
    return analyze_formula;
  }

  // 括弧を使用している場合は、括弧に基づいて計算式を並べ替える
  let analyzed: string[] = [];
  let start_bracket_count: number = 0;
  let end_bracket_count: number = 0;
  let calculated: string[] = [];

  analyze_formula.map((charactor: string) => {
    switch (charactor) {
      case "(":
        analyzed.push(charactor);
        start_bracket_count++;
        break;

      case ")":
        analyzed.push(charactor);
        end_bracket_count++;
        break;

      default:
        if (analyzed.length !== 0) {
          analyzed.push(charactor);
        } else {
          // (が未入力時は括弧ない計算処理が不要なので、初めから返却用の配列に入れる
          calculated.push(charactor);
        }

        break;
    }

    // １まとまりをまず計算
    if (
      start_bracket_count !== 0 &&
      end_bracket_count !== 0 &&
      start_bracket_count === end_bracket_count
    ) {
      if (!hasOperator(analyzed)) {
        // 演算子を含まない場合は数字のみ連結
        const remove_target: string[] = ["(", ")"];
        let return_arg: string[] = [];
        return_arg = analyzed.filter((item) => {
          return !remove_target.includes(item);
        });

        calculated.push(...return_arg);
        analyzed = [];
      } else {
        calculated.push(...analyzeFormula(analyzed));
        analyzed = [];
      }
    }
  });

  return calculated;
};

/**
 * 括弧内数式取得処理
 * @param {string[]} formula_args
 * @returns
 */
const analyzeFormula = (formula_args: string[]):string[] => {
  // 一番内側にある数式を探す
  let last_start_bracket:number = 0;
  let first_end_bracket:number = 0;
  let analyzed: string[] = [];

  for (let i:number = 0; i < formula_args.length; i++) {
    analyzed.push(formula_args[i]);

    switch (formula_args[i]) {
      case "(":
        last_start_bracket = i;
        break;
      case ")":
        first_end_bracket = i;
        break;
      default:
        break;
    }

    if (first_end_bracket !== 0) {
      // 括弧内の数式を取得
      const arg: string[] = formula_args.slice(last_start_bracket + 1, first_end_bracket);

      let answer: number = 0;
      // argに演算子がある場合は計算処理を行う
      if (hasOperator(arg)) {
        // 取得した数式を計算
        answer = calculateFormula(arg);
      } else {
        if (!Number.isNaN(parseInt(arg[0]))) {
          answer = Number(arg[0]);
        } else {
          // 入ることはあり得ないと思うが念のために異常時処理を行う
          alert("数式が異常です。");
        }
      }

      // 計算済みの部分を削除
      analyzed.splice(
        last_start_bracket,
        first_end_bracket - last_start_bracket + 1
      );

      // 未処理の数式があれば、後ろに追加する
      let remained:string[] = [];
      if (formula_args.length > first_end_bracket + 1) {
        remained = formula_args.splice(first_end_bracket + 1);
      }

      if (hasOperator(analyzed) || hasOperator(remained)) {
        analyzed.push(String(answer));
        analyzed.push(...remained);
      } else {
        analyzed = [];
        analyzed.push(String(answer));
      }

      return analyzed;
    }
  }

  return analyzed;
};
