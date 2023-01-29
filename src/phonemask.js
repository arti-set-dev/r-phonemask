export default class MaskPhone {
  constructor(selector, options) {
    let defaultOptions = {
      isInput: () => { },
      isKeydown: () => { },
    };
    this.options = Object.assign(defaultOptions, options);
    this.tels = document.querySelectorAll(selector);
    this.regTel = /\D/g;

    this.events();
  }

  events() {
    document.addEventListener('DOMContentLoaded', () => {
      if (this.tels.length > 0) {
        this.tels.forEach(telEl => {
          document.addEventListener('input', (e) => {
            if (e.target == telEl) {
              this.masked(e);
              this.options.isInput(this);
            }
          })
          document.addEventListener('keydown', (e) => {
            if (e.target == telEl) {
              this.deleteFirstSymbols(e);
              this.options.isKeydown(this);
            }
          })
        })
      }
    })
  }

  numberFilter(inputTelElem) {
    return inputTelElem.value.replace(this.regTel, '');
  }

  masked(e) {
    const inputTel = e.target;
    const cursorPosiion = inputTel.selectionStart;
    const valueLength = inputTel.value.length;
    this.inputNumberValue = this.numberFilter(inputTel);
    inputTel.value = this.inputNumberValue;
    this.ruNumbers = ['7', '8', '9'];
    let firstSymbols = '';
    let formatting = '';
    if (this.ruNumbers.includes(this.inputNumberValue[0]) && this.inputNumberValue != '') {
      if (this.inputNumberValue[0] == '7' || this.inputNumberValue[0] == '9') {
        firstSymbols = '+7';
        inputTel.setAttribute('maxlength', 18);
      } else {
        firstSymbols = '8';
        inputTel.setAttribute('maxlength', 17);
      }
      if (this.inputNumberValue[0] == '9') {
        this.inputNumberValue = '9' + this.inputNumberValue;
      }
      formatting = inputTel.value = firstSymbols + ' ';
      if (this.inputNumberValue.length > 1) {
        formatting += '(' + this.inputNumberValue.substring(1, 4);
      }
      if (this.inputNumberValue.length >= 5) {
        formatting += ') ' + this.inputNumberValue.substring(4, 7);
      }
      if (this.inputNumberValue.length >= 8) {
        formatting += '-' + this.inputNumberValue.substring(7, 9);
      }
      if (this.inputNumberValue.length >= 10) {
        formatting += '-' + this.inputNumberValue.substring(9, 11);
      }
    }
    if (!this.ruNumbers.includes(this.inputNumberValue[0]) && this.inputNumberValue != '') {
      formatting = '+' + this.inputNumberValue;
      inputTel.setAttribute('maxlength', 13);
    }
    inputTel.value = formatting;
    let currSymbol = e.data;
    currSymbol = !this.regTel.test(currSymbol)
    if (valueLength != cursorPosiion) {
      if (currSymbol != this.regTel.test(currSymbol) && e.data != null) {
        inputTel.selectionStart = inputTel.selectionEnd = cursorPosiion - 1;
      } else {
        inputTel.selectionStart = inputTel.selectionEnd = cursorPosiion;
      }
    }
  }

  deleteFirstSymbols(e) {
    const inputTel = e.target;
    const valueLength = inputTel.value.length;
    if (e.keyCode == 8 && this.inputNumberValue != undefined) {
      if (this.ruNumbers.includes(this.inputNumberValue[0])) {
        if (valueLength <= 3) {
          inputTel.value = '';
        }
      }
    }
  }
}