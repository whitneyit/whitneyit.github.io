'use strict';

var
    // Pull in the git package. Here we use the same `git` module that our
    // `gulpfile.js` uses. This means that we only have to maintain one package.
    git = require('gulp-git'),

    // Pull in Kris Kowals Q promise library.
    q = require('q'),

    /**
     * @name whitneyit.lib.isBranch#defaultForced
     *
     * @description
     * Whether or not we want to forcfully override the `isBranch` check.
     *
     * @type {Boolean}
     */
    defaultForced = false,

    /**
     * @name whitneyit.lib.isBranch
     *
     * @description
     * Accept a String an check to see if we are on that git branch.
     *
     * This allows us to check whether or not we are eligable to execute certain
     * tasks within `gulp`. A prime example of this is to determine if we are
     * able to release to production. If you are not on the `master` branch
     * then you should not be able to deploy.
     *
     * @throws {TypeError} - `target` must be a truthy String.
     * @throws {TypeError} - `forced` must be an Boolean.
     *
     * @param {String|Void} target - The target branch name to compare against.
     * @param {Boolean}     forced - Whter or not the user did a force release.
     */
    isBranch = function isBranch (target, forced) {

        // If we were passed in anything other than a String for
        // `branch` we throw an Error to indicate that we are unable
        // to match that branch. We also check for a falsy value of
        // `target` so as to catch an empty String.
        if (!target || typeof target !== 'string') {
            throw new Error('Could not detect branch. Target branch must be a String.');
        }

        // If no `forced` was provided, we will default to the value that we
        // defined above.
        if (typeof forced === 'undefined') {
            forced = defaultForced;
        }

        // Ensure that we a have a valid Boolean for `forced`.
        if (typeof forced !== 'boolean') {
            throw new Error('Could not detect branch. The `forced` argument must be a Boolean');
        }

        var
            // Created a deferred Object to handle the async `git` command.
            deferred = q.defer();

        // If we are being force just resolve the Promise straight away.
        if (forced === true) {
            deferred.resolve('forced');

        // Otherwise make the async call to the `git` command.
        } else {

            // Here we execute the `git branch` command.
            git.exec({'args' : 'branch'}, function (err, stdout) {

                // If an Error occured inform the user.
                if (err) {
                    deferred.reject('Could not determine current branch.');
                    return;
                }

                var
                    // This is a placeholder for the current branch.
                    current;

                // Find the current branch from `stdout`. Here `stdout` is a
                // String with newlines seperating the branches, with one of
                // those lines starting with an asterix.
                //
                // When logged to the console it will looks like the following;
                //
                // ```sh
                // "master"
                // "* develop"
                // "feature/foo"
                // ```
                //
                // Our RegExp targets the String begeinging with an asterix and
                // then it assigns the first match to the `current` variable.
                stdout.replace(/(?:\*\s*)(\w*)/g, function (match, p1) {
                    current = p1;
                });

                // If the branch that we are currently on does not match that
                // target, then we can assert that we are not on that branch.
                if (current !== target) {
                    deferred.reject('Can only release whilst on "master".');
                    return;
                }

                // If we get to here it means that the branch name that was
                // passed in matches the branch that we are currently on.
                deferred.resolve(current);

            });

        }

        // Return a promise.
        return deferred.promise;

    };

// Expose to node.js
module.exports = isBranch;
