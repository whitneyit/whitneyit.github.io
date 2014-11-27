window.rjsconfig.baseUrl = '/base';
window.rjsconfig.callback = function () {
    window.__karma__.start();
};
window.rjsconfig.deps = Object.keys(window.__karma__.files) // 1.
    .filter(function (file) {
        return (/\.spec\.js$/i).test(file); // 2.
    })
    .map(function (path) {
        return path.replace(/^\/base\//, '').replace(/\.js$/, ''); // 3.
    });
for (var path in window.rjsconfig.paths) {
    window.rjsconfig.paths[path] = Array.isArray(window.rjsconfig.paths[path]) ? (
        window.rjsconfig.paths[path][window.rjsconfig.paths[path].length - 1]
    ) : (
        window.rjsconfig.paths[path]
    );
}
requirejs.config(window.rjsconfig);
