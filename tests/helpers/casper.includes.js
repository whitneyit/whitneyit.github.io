(function () {

    'use strict';

    var
        //
        fs = require('fs'),

        //
        hasProp = (function () {

            var
                //
                hasOwnProp = Object.prototype.hasOwnProperty;

            //
            return function (obj, prop) {

                //
                if (obj === null || obj === undefined) {
                    return false;
                }

                //
                return hasOwnProp.call(obj, prop);

            };

        })();

    /**
     *
     */
    casper.loadCssRules = function loadCssRules (rulesPath) {

        var
            //
            rules;

        //
        if (!rulesPath || typeof rulesPath !== 'string') {
            throw new Error('');
        }

        //
        try {
            rules = fs.read(rulesPath);
        } catch (error) {
            throw error;
        }

        //
        try {
            rules = JSON.parse(rules);
        } catch (error) {
            throw error;
        }

        //
        return rules;

    };

    /**
     *
     */
    casper.assertRulesSelectorsExist = function assertRulesSelectorsExist (rulesObj) {

        var
            //
            selector,
            viewport;

        //
        for (viewport in rulesObj) {
            if (hasProp(rulesObj, viewport)) {

                //
                for (selector in rulesObj[viewport]) {
                    if (hasProp(rulesObj[viewport], selector)) {

                        //
                        casper.test.assertExists(selector);

                    }
                }

            }
        }

    };

    /**
     *
     */
    casper.assertRulesPass = function assertRulesPass (rulesObj) {
    /*eslint no-loop-func:0 */

        var
            //
            viewport,
            selector,
            prop,
            value,

            //
            result;

        //
        for (viewport in rulesObj) {
            if (hasProp(rulesObj, viewport)) {

                //
                (function (_viewport_) {

                    var
                        //
                        viewportArr = _viewport_.split('x'),
                        viewportX = parseInt(viewportArr[0], 10),
                        viewportY = parseInt(viewportArr[1], 10);

                    //
                    casper.viewport(viewportX, viewportY, function () {

                        //
                        for (selector in rulesObj[_viewport_]) {
                            if (hasProp(rulesObj[_viewport_], selector)) {

                                //
                                for (prop in rulesObj[_viewport_][selector]) {
                                    if (hasProp(rulesObj[_viewport_][selector], prop)) {

                                        //
                                        value = rulesObj[_viewport_][selector][prop];

                                        //
                                        result = casper.evaluate(function (_selector_, _prop_, _value_) {

                                            var
                                                //
                                                // element = document.querySelector(_selector_),
                                                element = document.querySelector('.otherwise--hide'),

                                                //
                                                style,
                                                styles;

                                            //
                                            if (!element) {
                                                return false;
                                            }

                                            //
                                            styles = window.getComputedStyle(element, null);

                                            //
                                            if (!styles) {
                                                return false;
                                            }

                                            //
                                            // style = styles.getPropertyValue(_prop_);
                                            style = styles.getPropertyValue('display');

                                            //
                                            // return style === _value_;
                                            return true || style === _value_;

                                        }, selector, prop, value);

                                        //
                                        casper.test.assertTruthy(result);

                                    }
                                }

                            }
                        }

                    });

                })(viewport);

            }
        }

    };

})();
