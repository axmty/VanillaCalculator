"use strict";

const calcResult = document.getElementById("calc-result");
const calcGhostParenthesis = document.getElementById("calc-ghost-parenthesis");

const expression = (function() {
    let expr = ["0"];

    function lastSymbol() {
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
        const last = lastSymbol();
        if (last === "0") {
            expr[lastIndex()] = number.toString();
        } else if (Number.isFinite(+last) || last === ".") {
            expr[lastIndex()] += number;
        } else if ([")", "%"].includes(last)) {
            append("*");
            append(number.toString());
        } else if (["(", "+", "u-", "b-", "*", "/"].includes(last)) {
            append(number.toString());
        }
    }

    function addDot() {
        const last = lastSymbol();
        if (length() === 1 && last === "0") {
            expr[lastIndex()] = ".";
        } else if (Number.isFinite(+last) && !last.includes(".")) {
            expr[lastIndex()] += ".";
        } else if ([")", "%"].includes(last)) {
            append("*");
            append(".");
        } else if (["(", "+", "u-", "b-", "*", "/"].includes(last)) {
            append(".");
        }
    }

    function addOperator(operator) {
        const last = lastSymbol();
        if (operator === "-") {
            if (length() === 1 && last === "0") {
                expr[lastIndex()] = "u-";
            } else if (last === "+") {
                expr[lastIndex()] = "b-";
            } else if (["(", "*", "/"].includes(last)) {
                append("u-");
            } else if ([")", "%"].includes(last) || Number.isFinite(+last)) {
                append("b-");
            }
        } else if (operator === "+") {
            if ([")", "%"].includes(last) || Number.isFinite(+last)) {
                append("+");
            } else if (last === "b-") {
                expr[lastIndex()] = "+";
            }
        } else if (operator === "/") {
            if ([")", "%"].includes(last) || Number.isFinite(+last)) {
                append("/");
            } else if (last === "*") {
                expr[lastIndex()] = "/";
            }
        } else if (operator === "*") {
            if ([")", "%"].includes(last) || Number.isFinite(+last)) {
                append("*");
            } else if (last === "/") {
                expr[lastIndex()] = "*";
            }
        }
    }

    function addPercent() {
        const last = lastSymbol();
        if (Number.isFinite(+last) || last === ")") {
            append("%");
        }
    }

    function addLeftParenthesis() {
        const last = lastSymbol();
        if (length() === 1 && last === "0") {
            expr[lastIndex()] = "(";
        } else {
            append("(");
        }
    }

    function addRightParenthesis() {
        append(")");
    }

    function allClear() {
        expr = ["0"];
    }

    function evaluate() {
        transformToEvaluable();
        expr = [eval(expr.join("")).toString()];
    }

    function countMissingRightParenthesis() {
        return expr.reduce((cnt, s) => {
            if (s === "(") {
                cnt++;
            } else if (s === ")") {
                cnt--;
            }
            return cnt;
        }, 0);
    }

    function transformToEvaluable() {
        expr.forEach((s, i) => {
            if (s === "%") {
                expr[i] = "*0.01";
            }
        });
        const missingRightParenthesis = countMissingRightParenthesis();
        for (let i = 0; i < missingRightParenthesis; i++) {
            append(")");
        }
    }

    return {
        addSymbol(symbol) {
            if (typeof symbol === "number") {
                addNumber(symbol);
            } else if (symbol === ".") {
                addDot();
            } else if (symbol === "AC") {
                allClear();
            } else if (["+", "-", "*", "/"].includes(symbol)) {
                addOperator(symbol);
            } else if (symbol === "=") {
                evaluate();
            } else if (symbol === "%") {
                addPercent();
            } else if (symbol === "=") {
                evaluate();
            } else if (symbol === "(") {
                addLeftParenthesis();
            } else if (symbol === ")") {
                addRightParenthesis();
            }
        },
        toString() {
            let text = "";
            expr.forEach((s, i) => {
                if (Number.isFinite(+s) || s === ".") {
                    text += s;
                } else if (s === "+") {
                    text += " + ";
                } else if (s === "b-") {
                    text += " - ";
                } else if (s === "u-") {
                    text += "-";
                } else if (s === "*") {
                    text += " × ";
                } else if (s === "/") {
                    text += " ÷ ";
                } else if (s === "%") {
                    text += "%";
                } else if (["(", ")"].includes(s)) {
                    text += s;
                }
            });
            return text;
        },
        countMissingRightParenthesis
    }
})();

function onClickButton(symbol) {
    expression.addSymbol(symbol);
    calcResult.textContent = expression.toString();
    let ghostParenthesis = "";
    let countGhostParenthesis = expression.countMissingRightParenthesis()
    for (let i = 0; i < countGhostParenthesis; i++) {
        ghostParenthesis += ")";
    }
    calcGhostParenthesis.textContent = ghostParenthesis;
}