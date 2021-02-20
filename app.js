"use strict";

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
        } else if ([")", "%"].indexOf(last) >= 0) {
            append("*");
            append(number.toString());
        } else if (["(", "+", "u-", "b-", "*", "/"].indexOf(last) >= 0) {
            append(number.toString());
        }
    }

    function addDot() {
        const last = lastSymbol();
        if (length() === 1 && last === "0") {
            expr[lastIndex()] = ".";
        } else if (Number.isFinite(+last) && last.indexOf(".") < 0) {
            expr[lastIndex()] += ".";
        } else if ([")", "%"].indexOf(last) >= 0) {
            append("*");
            append(".");
        } else if (["(", "+", "u-", "b-", "*", "/"].indexOf(last) >= 0) {
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
            } else if (["(", "*", "/"].indexOf(last) >= 0) {
                append("u-");
            } else if ([")", "%"].indexOf(last) >= 0 || Number.isFinite(+last)) {
                append("b-");
            }
        } else if (operator === "+") {
            if ([")", "%"].indexOf(last) >= 0 || Number.isFinite(+last)) {
                append("+");
            } else if (last === "b-") {
                expr[lastIndex()] = "+";
            }
        } else if (operator === "/") {
            if ([")", "%"].indexOf(last) >= 0 || Number.isFinite(+last)) {
                append("/");
            } else if (last === "*") {
                expr[lastIndex()] = "/";
            }
        } else if (operator === "*") {
            if ([")", "%"].indexOf(last) >= 0 || Number.isFinite(+last)) {
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

    function allClear() {
        expr = ["0"];
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
            } else if (["+", "-", "*", "/"].indexOf(symbol) >= 0) {
                addOperator(symbol);
            } else if (symbol === "=") {
                evaluate();
            } else if (symbol === "%") {
                addPercent();
            }
        },
        toString() {
            console.log(expr);
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
                }
            });
            return text;
        }
    }
})();

function onClickButton(symbol) {
    expression.addSymbol(symbol);
    const element = document.getElementById("calc-result");
    element.textContent = expression.toString();
}