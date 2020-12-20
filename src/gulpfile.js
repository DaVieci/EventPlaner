const gulp = require('gulp');
const eslint = require('gulp-eslint');
const clean = require('gulp-clean');
const install = require('gulp-install');
const gulpif = require('gulp-if');
const exec = require('gulp-exec');
const fs = require('fs');

// Installs dependencies of Backend of Frontend if not done already
gulp.task('install', (cb) => {
    let condition = false;
    if (!fs.existsSync('./backend/node_modules') || !fs.existsSync('./frontend/node_modules')) {
        condition = true;
    }
    return gulp.src(['./backend/package.json', './frontend/package.json'])
    .pipe(gulpif(condition, install()));
    })

// Cleans out build directory
gulp.task('clean', () => {
    return gulp.src('frontend/dist', {read: false, allowEmpty: true})
    .pipe(clean());
    })

// Builds Frontend for potential static deployment
gulp.task('build', () => {
    return gulp.src('.', {read: false})
    .pipe(exec('cd ./frontend && ng build'))
    .pipe(exec.reporter());
    })

// Lint the Frontend using Angular
gulp.task('lintFrontend', () => {
    return gulp.src('.', {read: false})
    .pipe(exec('cd ./frontend && ng lint'))
    .pipe(exec.reporter());
    })

// Start the Backend
gulp.task('runBackend', () => {
    console.log("Starting Backend at localhost:3000")
    return gulp.src('.', {read: false})
    .pipe(exec('cd ./backend && npm run start'))
    .pipe(exec.reporter());
    })

// Start the Frontend
gulp.task('runFrontend', () => {
    console.log("Starting Frontend at localhost:4200")
    return gulp.src('.', {read: false})
    .pipe(exec('cd ./frontend && ng serve --proxy-config ./proxy.conf.json'))
    .pipe(exec.reporter());
    })

// Run tasks in correct order
gulp.task('default',
    gulp.series(
        gulp.parallel('install', 'clean'),
        //gulp.parallel('lintFrontend'),
        gulp.parallel('build'),
        gulp.parallel('runBackend', 'runFrontend')),
        () => {})
