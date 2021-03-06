/**
 * Looks for potential hotspot string comparisons
 * @author Adam Baldwin / Jon Lamendola
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var keywords = '((' + [
    'password',
    'secret',
    'api',
    'apiKey',
    'token',
    'auth',
    'pass',
    'hash'
].join(')|(') + '))';

var re = new RegExp('^' + keywords + '$', 'im');

function containsKeyword (node) {
    if (node.type === 'Identifier') {
        if (re.test(node.name))
            return true;
        }
        return
}

module.exports = function(context) {

    "use strict";

    var getSource = function (token) {
        return token.loc.start.line+ ':  ' + context.getSourceLines().slice(token.loc.start.line-1, token.loc.end.line).join('\n\t');
    }

    return {
        "IfStatement": function(node) {
            if (node.test && node.test.type === 'BinaryExpression') {
                if (node.test.operator === '==' || node.test.operator === '===' || node.test.operator === '!=' || node.test.operator === '!==') {

                    var token = context.getTokens(node)[0];

                    if (node.test.left) {
                    var left = containsKeyword(node.test.left);
                        if (left) {
                            return context.report(node, "Potential timing attack, left side: " + left + '\n\t' + getSource(token));
                        }
                    }

                    if (node.test.right) {
                    var right = containsKeyword(node.test.right);
                        if (right) {
                            return context.report(node, "Potential timing attack, right side: " + right + '\n\t' + getSource(token));
                        }
                    }
                }
            }
        }
    };

};
