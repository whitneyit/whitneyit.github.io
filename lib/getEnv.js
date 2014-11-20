'use strict';

var
    // Pull in our packages.
    fs   = require('fs'),
    yaml = require('js-yaml').safeLoad,

    /**
     * @name whitneyit.lib.getEnv#defaultEnvName
     *
     * @description
     * The name of the file to look for the environment data.
     *
     * @type {String}
     */
    defaultEnvName = 'production',

    /**
     * @name whitneyit.lib.getEnv#defaultFilename
     *
     * @description
     * The name of the file to look for the environment data.
     *
     * @type {String}
     */
    defaultFilename = '.env.yml',

    /**
     * @name whitneyit.lib.getEnv#defaultProp
     *
     * @description
     * The name of the property to look for on the `argv` Object.
     *
     * @type {String}
     */
    defaultProp = 'env',

    /**
     * @name whitneyit.lib.getEnv
     *
     * @description
     * Determines the environment name and fetches its data.
     *
     * Here we will search for and parse a yaml file to JSON. The file that we
     * end up loading depends upon the environment that was specified to the
     * `gulp` command. Given the following.
     *
     * ```sh
     * $ gulp build             # Environment set to "production"
     * $ gulp build --env=local # Environment set to "local"
     * ```
     *
     * With the two examples above they would both try and fetch matching yaml
     * files. They are, `.env.yml` for production, and `.env.local.yml` for
     * local.
     *
     * If no environment is specified, or if the environment os specified is
     * equal to `defaultEnvName`, the yaml file specified by `defaultFilename`
     * will be loaded else a pattern of `".env." + name + ".yml"` will be
     * loaded.
     *
     * If these files are not found an appropriate Error will be thrown.
     *
     * @throws {TypeError} - `argv` must be an Object.
     * @throws {TypeError} - `prop` must be a truthy String.
     * @throws {Error}     - Could not find `envFile`.
     * @throws {Error}     - Could not parse `envData`.
     *
     * @param {Object} argv   - The cli arguments Object from `yargs`.
     * @param {String} [prop] - The prop of the argument to look for.
     *
     * @return {Object} - The environment name and data.
     */
    getEnv = function getEnv (argv, prop) {

        // Ensure that `argv` is an Object.
        if (typeof argv !== 'object') {
            throw new TypeError('Could not detect environment. Expected `argv` to be an Object');
        }

        // If no `prop` for the environment variable was provided, we will
        // default to the value that we defined above.
        if (typeof prop === 'undefined') {
            prop = defaultProp;
        }

        // Ensure that we a have a valid String for `prop`.
        if (!prop || typeof prop !== 'string') {
            throw new TypeError('Could not detect environment. Expected `prop` to be a String');
        }

        var
            // Allocate our variables.
            envData,
            envName = defaultEnvName,
            envFile = defaultFilename;

        // Only update the environment to something other than the default when
        // we have a new valid environment name.
        if (typeof argv[prop] === 'string' && argv[prop] !== defaultEnvName) {
            envName = argv[prop].toLowerCase();
            envFile = '.env.' + envName + '.yml';
        }

        // Test to see if our environment file exists.
        try {
            envData = fs.readFileSync(envFile);
        } catch (err) {
            throw new Error('Could not set environment. File "' + envFile + '" does not exist.');
        }

        // Parse our environment file.
        try {
            envData = yaml(envData);
        } catch (err) {
            throw new Error('Could not set environment. Could not parse "' + envFile + '".');
        }

        // Return the name of the environment and its data.
        return {
            'name' : envName,
            'data' : envData
        };

    };

// Expose to node.
module.exports = getEnv;
