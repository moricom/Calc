//カンマ区切り参考  https://webllica.com/add-comma-as-thousands-separator/
/**
 * 数値の3桁カンマ区切り
 * 入力値をカンマ区切りにして返却
 * [引数]   numVal: 入力数値
 * [返却値] String(): カンマ区切りされた文字列
 */
function addFigure(numVal: string): string {
  // 空の場合そのまま返却
  if (numVal == '') {
    return '';
  }
  // 全角から半角へ変換し、既にカンマが入力されていたら事前に削除
  numVal = numVal.replace(/,/g, '').trim();
  // 数値でなければそのまま返却
  if (!/^[+|-]?(\d*)(\.\d*)?$/.test(numVal)) {
    return numVal;
  }
  // 整数部分と小数部分に分割
  const numData: string[] = numVal.toString().split('.');
  // 整数部分を3桁カンマ区切りへ
  numData[0] = Number(numData[0])
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // 小数部分と結合して返却
  return numData.join('.');
}

/**
 * カンマ外し
 * 入力値のカンマを取り除いて返却
 * [引数]   strVal: 半角でカンマ区切りされた数値
 * [返却値] String(): カンマを削除した数値
 */
function delFigure(strVal: string): string {
  return strVal.replace(/,/g, '');
}

let INPUT_ELEMENT: HTMLInputElement;
let PREVIEW_ELEMENT: HTMLInputElement;
let PREV_SYMBOL: string;
let HAS_CALCULATED: boolean = true;
let STACK: number;

const handleOnLoad = () => {
  INPUT_ELEMENT = document.getElementById('input') as HTMLInputElement;
  PREVIEW_ELEMENT = document.getElementById('preview') as HTMLInputElement;
  const deleteButton: HTMLDivElement = document.getElementById('circle') as HTMLDivElement;
  const buttonContainer: HTMLDivElement = document.getElementById('buttons') as HTMLDivElement;
  const buttons: HTMLLinkElement[] = (buttonContainer.getElementsByTagName(
    'a'
  ) as unknown) as HTMLLinkElement[];

  for (let i: number = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', handleOnButtonClick);
  }
  deleteButton.addEventListener('click', handleOnDeleteClick);
};

const handleOnDeleteClick = (): void => {
  let value: string = INPUT_ELEMENT.value;
  value = value.slice(0, -1);
  INPUT_ELEMENT.value = addFigure(value);
};

const handleOnButtonClick = (event: MouseEvent): void => {
  let value: string = INPUT_ELEMENT.value;
  let text: string = (event.currentTarget as HTMLLinkElement).textContent!.replace(/\s+/g, '');
  if (value === 'overFlow') {
    return;
  }
  if (HAS_CALCULATED) {
    //初期化された状態
    switch (text) {
      case 'C':
        reset();
        break;
      case '.':
        if (value.indexOf('.') === -1) {
          INPUT_ELEMENT.value += '.';
        }
        break;
      case '=':
        break;
      case '÷':
      case '×':
      case '-':
      case '+':
        removeSelect();
        ((event.currentTarget as HTMLLinkElement).parentElement as HTMLDivElement).classList.add(
          'select'
        );
        if (value === '') {
          return;
        } else {
          STACK = parseFloat(delFigure(value));
          PREV_SYMBOL = text;
          PREVIEW_ELEMENT.value = value;
          INPUT_ELEMENT.value = '';
          HAS_CALCULATED = false;
        }
        break;
      default:
        addNumber(text);
    }
  } else {
    let result: number | string | void;
    switch (text) {
      case 'C':
        reset();
        removeSelect();
        break;
      case '.':
        if (value.indexOf('.') === -1) {
          INPUT_ELEMENT.value += '.';
        }
        break;
      case '=':
        PREVIEW_ELEMENT.value = '';
        INPUT_ELEMENT.value = addFigure(String(math(PREV_SYMBOL, parseFloat(delFigure(value)))));
        // STACK = 0;
        PREV_SYMBOL = text;
        HAS_CALCULATED = true;
        removeSelect();
        // TODO: inputElementの削除アニメーション作成
        break;
      case '÷':
      case '×':
      case '-':
      case '+':
        removeSelect();
        ((event.currentTarget as HTMLLinkElement).parentElement as HTMLDivElement).classList.add(
          'select'
        );
        if (value === '') {
          PREV_SYMBOL = text;
          break;
        }
        result = math(PREV_SYMBOL, parseFloat(delFigure(value)));
        if (result === null || result === undefined) {
          result = 'error';
        } else {
          STACK = result as number;
          PREV_SYMBOL = text;
          INPUT_ELEMENT.value = '';
        }
        PREVIEW_ELEMENT.value = addFigure(String(result));
        break;
      default:
        addNumber(text);
        result = math(PREV_SYMBOL, parseFloat(delFigure(value)));
        if (result !== null || result !== undefined) {
          result = 'error';
        } else {
          if (result > 10 * 14) {
            result = 'overflow';
          } else {
            STACK = result as number;
          }
        }
        PREVIEW_ELEMENT.value = addFigure(String(result));
        PREVIEW_ELEMENT.value = addFigure(
          String(math(PREV_SYMBOL, parseFloat(delFigure(INPUT_ELEMENT.value))))
        );
    }
  }
};

const removeSelect = (): void => {
  const buttonContainer: HTMLDivElement = document.getElementById('buttons') as HTMLDivElement;
  const buttons: HTMLLinkElement[] = (buttonContainer.getElementsByTagName(
    'div'
  ) as unknown) as HTMLLinkElement[];

  for (let i: number = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('select');
  }
};

const reset = (): void => {
  INPUT_ELEMENT.value = '0';
  PREVIEW_ELEMENT.value = '';
  STACK = 0;
  PREV_SYMBOL = '';
  HAS_CALCULATED = true;
};

/**
 * ナンバーディスプレイに数字をスタック
 */
const addNumber = (num: string): void => {
  if (INPUT_ELEMENT.value.length < 14) {
    INPUT_ELEMENT.value = addFigure(INPUT_ELEMENT.value + num);
  }
};

/** 計算用 */
const math = (symbol: string, num: number): number | void => {
  switch (symbol) {
    case '÷':
      return STACK / num;
    case '×':
      return STACK * num;
    case '-':
      return STACK - num;
    case '+':
      return STACK + num;
    default:
      return;
  }
};

window.onload = handleOnLoad;
