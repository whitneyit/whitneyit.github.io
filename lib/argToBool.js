'use strict';

var
    /**
     * @name whitneyit.lib.argToBool
     *
     * @description
     * Examines `argv` and returns a Boolean based on a property.
     *
     * By default `yargs` will make some intelligent guesses on how to parse
     * the values coming in from the cli. It will convert Numbers, Strings, and
     * of course, Booleans.
     *
     * What we want however, is a way of converting those values straight into
     * Booleans whilst making some intelligent guesses ourselves.
     *
     * Even when specifying arguments via the `.boolean()` method, yargs does
     * not convert Numbers, and Strings to Booleans:
     * https://github.com/chevex/yargs#booleankey
     *
     * So this method differs from that implementation a little by also
     * converting appropriate Numbers and Strings to said Booleans.
     *
     * @throws {TypeError} - `argv` must be an Object.
     * @throws {TypeError} - `name` must be a truthy String.
     *
     * @param {Object} argv - The cli arguments Object from `yargs`.
     * @param {String} name - The name of the argument to look for.
     *
     * @return {Boolean} - The converterd primitive for `argv[name]`.
     */
    argToBool = function argToBool (argv, name) {
    /*jscs:disable disallowImplicitTypeConversion */

        // Ensure that `argv` is an Object.
        if (typeof argv !== 'object') {
            throw new TypeError('Expected `argv` to be an Object');
        }

        // Ensure that we a have a valid String.
        if (!name || typeof name !== 'string') {
            throw new TypeError('Expected `name` to be a String');
        }

        // If `name` was not found within the `argv` Object then we can just
        // return `false` write away without need to do a conversion.
        if (!(name in argv)) {
            return false;
        }

        // Here we handle a `name` String equal to "false".
        if (typeof argv[name] === 'string') {
            return argv[name].toLowerCase() !== 'false';
        }

        // Because yargs converts "number like arguments" to actual JS Numbers,
        // we use an implicity Boolean conversion to convert numbers such as `0`,
        // and `,` to their respective Boolean values.
        //
        // Also if no value was passed to the argument, such as;
        //
        // ```sh
        // gulp foo --bar
        // ```
        //
        // Instead of;
        //
        // ```sh
        // gulp foo --bar=baz
        // ```
        //
        // Then the value of `argv[name]` will be equal to `true`. So that means, if
        // a Boolean was passed in, the `!!` will not affect the result.
        //
        // This also then allows Strings to be coverted to Boolean value.
        return !!argv[name];

    };

// Expose to node.
module.exports = argToBool;
