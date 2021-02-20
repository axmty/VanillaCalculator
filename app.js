"use strict";

const expression = (function() {
    let expr = ["0"];

    function last() {
        return expr[expr.length - 1];
    }
    
    function append(symbol) {
        expr[expr.length] = symbol;
    }
    
    function length() {
        return expr.length;
    }

    function lastIndex() {
        return expr.length - 1;
    }

    function addNumber(number) {
        const l = last();
        if (l === "0") {
            expr[lastIndex()] = number.toString();
        } else if (isNaN(last())) {
            append(number.toString());
        } else {
            expr[lastIndex()] += number;
        }
    }

    function addDot() {
        const l = last();
        if (isNumber(l) && l.indexOf(".") < 0) {
            expr[lastIndex()] += ".";
        } else if (isNaN(l)) {
            append(".");
        }
    }

    function addOperator(operator) {
        const l = last();
        if (operator === "-") {
            if ((length() === 1 && l === "0") || l === "+") {
                expr[lastIndex()] = "-";
            } else if (l !== "-") {
                append("-");
            }
        } else if (isNumber(last())) {
            append(operator);
        }
    }

    function allClear() {
        expr = ["0"];
    }

    function isOperator(symbol) {
        return "+-*/".indexOf(symbol) >= 0;
    }

    function isNumber(value) {
        return Number.isFinite(+value) || value == ".";
    }

    function isNaN(value) {
        return window.isNaN(value) && value !== ".";
    }

    function evaluate() {
        expr = [eval(expr.join("")).toString()];
    }

    return {
        addSymbol(symbol) {
            if (typeof symbol === "number") {
                addNumber(symbol);
            } else if (symbol === ".") {
                addDot();
            } else if (symbol === "AC") {
                allClear();
            } else if (isOperator(symbol)) {
                addOperator(symbol);
            } else if (symbol === "=") {
                evaluate();
            }
        },
        toString() {
            let text = "";
            expr.forEach((s, i) => {
                if (isNumber(s)) {
                    text += s;
                } else if (isOperator(s)) {
                    if (i > 0 && isNumber(expr[i - 1])) {
                        text += ` ${s} `;
                    } else {
                        text += s;
                    }
                }
            });
            return text;
        }
    }
})();

const printer = (function(element) {
    return {
        printExpression(expression) {
            element.textContent = expression.toString();
        }
    }
})(document.getElementById("calc-result"));

function onClickButton(symbol) {
    expression.addSymbol(symbol);
    printer.printExpression(expression);
}