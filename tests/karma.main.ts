/// <reference path="../typings/requirejs/require.d.ts" />
interface Window {
    __karma__ :any;
    requirejs :Require;
    rjsconfig :RequireConfig;
}
window.rjsconfig.baseUrl = '/base';
window.rjsconfig.callback = () => {
    window.__karma__.start();
};
window.rjsconfig.deps = Object.keys(window.__karma__.files)
    .filter((file) => {
        return (/\.spec\.js$/i).test(file);
    })
    .map((path) => {
        return path.replace(/^\/base\//, '').replace(/\.js$/, '');
    });
for (var path in window.rjsconfig.paths) {
    window.rjsconfig.paths[path] = Array.isArray(window.rjsconfig.paths[path]) ? (
        window.rjsconfig.paths[path][window.rjsconfig.paths[path].length - 1]
    ) : (
        window.rjsconfig.paths[path]
    );
}
window.requirejs.config(window.rjsconfig);
