const gulp = require('gulp');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const webserver = require('gulp-webserver');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const path = require('path');
const fs = require('fs');
gulp.task('server', function () {
    gulp.src('.')
    .pipe(webserver({
        host:'localhost',
        port:8080,
        livereload: true,
        fallback:'index.html',
        middleware: function (req, res, next) {
            var pathname = req.url.split('/')[1];
            var file = path.join(process.cwd(), 'data', pathname+'.json');
            res.writeHead(200, {
                'Content-Type': 'text/json;charset=utf8',
                "Access-Control-Allow-Origin":"*"
            })
            if (pathname === 'index') {
                fs.readFile(file, function (err, data) {
                    if (err) {
                        res.end('error');
                    } else {
                        res.end(JSON.stringify(data));
                    }
                });
            }
        }
    }))
});
//监听
gulp.watch = function  change() {
    console.log(1);
}
//压缩、合并css
gulp.task('minify', function () {
    gulp.src('./css/*.css')
    .pipe(concat('bound.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./css'))
});
//压缩、合并js,重命名
gulp.task('uglify', function () {
    gulp.src('./js/*.js')
    .pipe(concat('date_format.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
});
gulp.task('default', function () {
    gulp.start(['minify', 'uglify', 'server']);
});