/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../../typings/requirejs/require.d.ts" />

define(['angular', 'jquery', 'ts/app'], (angular :ng.IAngularStatic, $ :JQuery, app :ng.IAngularStatic) => {

    describe('`ts/app`', () => {

        it('should export an anulgar module named `whitneyit`', () => {
            expect(angular.module('whitneyit')).toBe(app);
        });

        it('should depend upon jQuery', () => {
            expect(angular.element).toBe($);
        });

    });

});
