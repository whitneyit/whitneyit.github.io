define(['angular', 'js/bootstrap'], function (angular, bootstrap) {

    describe('`js/bootstrap`', function () {

        it('should export an anulgar module named `whitneyit`', function () {
            expect(angular.module('whitneyit')).toBe(bootstrap);
        });

    });

});
