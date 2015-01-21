casper.test.begin('testing [quarks/breakpoints.scss]', function (test) {

    var
        // Our `breakpoints.rules.json` file.
        rulesObj;

    // Load up the test html page.
    casper.start('.casper-temp-dir/quarks/breakpoints.html');

    // Load up our rules.
    casper.then(function loadCssRules () {
        rulesObj = casper.loadCssRules('tests/specs/src/scss/quarks/breakpoints.rules.json');
    });

    // Ensure that all of the elements inside the rules file exist.
    casper.then(function rulesSelectorsExist () {
        casper.assertRulesSelectorsExist(rulesObj);
    });

    // Test each of our rules per viewport.
    casper.then(function rulesPass () {
        casper.assertRulesPass(rulesObj);
    });

    // Run the tests.
    casper.run();

    // Close casper.
    casper.then(function done () {
        test.done();
    });

});
