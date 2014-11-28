define(['angular', 'jquery', 'js/app'], function (angular, $, app) {

    describe('`js/app`', function () {

        it('should export an anulgar module named `whitneyit`', function () {
            expect(angular.module('whitneyit')).toBe(app);
        });

        it('should depend upon jQuery', function () {
            expect(angular.element).toBe($);
        });

    });

});
