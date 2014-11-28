define(['angular', 'js/app'], function (angular, app) {

    describe('`js/app`', function () {

        it('should export an anulgar module named `whitneyit`', function () {
            expect(angular.module('whitneyit')).toBe(app);
        });

    });

});
