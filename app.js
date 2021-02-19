"use strict";

const resultLine = document.getElementById("calc-result");

let expression = (function() {
    let expr = ["0"];

    function last() {
        return expr[expr.length - 1];
    }
    
    function append(value) {
        expr[expr.length] = value;
    }
    
    function length() {
        return expr.length;
    }

    return {
        addNumber(number) {
            if (length() === 1 && expr[0].toString() === "0") {
                expr[0] = number.toString();
            } else {
                if (Number.isNaN(+last())) {
                    append(number);
                } else {
                    expr[expr.length - 1] += number;
                }
            }
        },
        addDot() {
            const l = last();
            if (Number.isFinite(+l) && l.indexOf(".") < 0) {
                expr[expr.length - 1] += ".";
            } else if (Number.isNaN(l)) {
                append("0.");
            }
        },
        allClear() {
            expr = ["0"];
        },
        toString() {
            let text = "";
            expr.forEach((v, i) => {
                if (Number.isFinite(+v)) {
                    text += v;
                }
            });
            return text;
        }
    }
})();

function onClickButton(symbol) {
    if (typeof symbol === "number") {
        expression.addNumber(symbol);
    } else if (symbol === ".") {
        expression.addDot();
    } else if (symbol === "AC") {
        expression.allClear();
    }

    printExpression();
}

function printExpression() {
    resultLine.textContent = expression.toString();
}