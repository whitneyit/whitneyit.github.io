// We wrap this file because it is going to be exposed to browsers and we do not
// want to pollute the global namespace.
(function (window) {

    'use strict';

    var
        /**
         * @name karma#baseUrl
         *
         * @description
         * This must be set to `/base` because that is where they are kept
         * within the `karma` test server
         */
        baseUrl = '/base',

        /**
         * @name karma#callback
         *
         * @description
         * This is the callback that we will shoot off when `requirejs` is done
         * and is all happy. The reason we are calling `karma.start()` is
         * because this way, we now have a clean point of entry to write any
         * new code that we may need to run before we boot `karma`.
         */
        callback = function () {

            // With requirejs all sorted, we now kickoff `karma`.
            window.__karma__.start();

        },

        /**
         * @name karma#deps
         *
         * @description
         * This instrcuts `requirejs` what files must be loaded before we can
         * start the app.
         *
         * 1. The `__karma__.files` Object contains a mapping of all of the
         *    files that were passed to `karma.conf.js`. The Object is a map of
         *    filename to timestamp pairs. We use `Object.keys` to extract just
         *    the names of the files.
         *
         * 2. Next we want to filter the files. We want to do this because we
         *    don't need to load all of the files that are being passed in to
         *    `karma`. Most of the files that are passed to `karma` are just
         *    there so that they end up being coped to the server.
         *
         *    We are looking to filter our just the test cases. This is because
         *    each of our spec files should be responsible for loading their own
         *    dependencies just like in the real app.
         *
         * 3. Lastly, we just have to convert the file structure defined by
         *    `karma` to that of `requirejs`. That means that we strip off the
         *    "baseUrl" and remove the `.js` extension.
         */
        deps = Object.keys(window.__karma__.files) // 1.
            .filter(function (file) {
                return (/\.spec\.js$/i).test(file); // 2.
            })
            .map(function (path) {
                return path.replace(/^\/base\//, '').replace(/\.js$/, ''); // 3.
            }),

        /**
         * @name karma#map
         *
         * @description
         * Here we remap certain module IDs to others. This is mainly used to
         * resolve issues with multiple module IDs pointing to the same module.
         *
         * As quoted from the requirejs docs:
         *
         * > The paths config was used to set two module IDs to the same file,
         * > and that file only has one anonymous module in it. If module IDs
         * > "something" and "lib/something" are both configured to point to the
         * > same "scripts/libs/something.js" file, and something.js only has
         * > one anonymous module in it, this kind of timeout error can occur.
         * > The fix is to make sure all module ID references use the same ID
         * > (either choose "something" or "lib/something" for all references),
         * > or use map config.
         */
        map = {
            '*' : {
                'bower/handlebars' : 'hbs/handlebars'
            }
        },

        /**
         * @name karma#paths
         *
         * @description
         * Just like any standard `requirejs` app, we can define some paths.
         * This allows us to just type in the abbreviated names, instead of the
         * full paths that are required.
         */
        paths = {
            // Copy any requirejs paths here.
        },

        /**
         * @name karma#plugins
         *
         * @description
         * If you are using some of requirejs's plugins, you can can configure
         * how they are defined here.
         */
        plugins = {

            // Place any plugin config Objects here.

            /**
             * @name karma#plugins-i18n
             *
             * @description
             * Here we demonstrate how to configure the `i18n` plugin.
             *
             * // RequireJS Internationalization Plugin
             * // https://github.com/requirejs/i18n/
             * 'i18n' : {
             *     'locale' : 'en-AU'
             * }
             */

        },

        /**
         * @name karma#shim
         *
         * @description
         * Next we shim our non AMD libs. In our case, we are not currently
         * using any libraries so this is simply just an empty Object.
         */
        shim = {
            // Copy any requirejs shims here.
        },

        // And lastly we define some variables to be used to aid in attaching
        // the above config to the requirejs config Object.
        config,
        plugin;

    // Here we attach all of our above config to this one `config` variable.
    // This is what will be passed to the `requirejs.config` method.
    config = {
        'baseUrl'  : baseUrl,
        'callback' : callback,
        'deps'     : deps,
        'map'      : map,
        'paths'    : paths,
        'shim'     : shim
    };

    // Next we attach our plugins to the `config` Object making sure that we
    // don't copy in any properties weren't defined on `config` directly.
    for (plugin in plugins) {
        if (Object.prototype.hasOwnProperty.call(plugins, plugin)) {
            config[plugin] = plugins[plugin];
        }
    }

    /**
     * @name karma
     *
     * @description
     * With all the above stuff defined, we can simply just pass the settings
     * across to `requirejs`.
     */
    requirejs.config(config);

})(this);
