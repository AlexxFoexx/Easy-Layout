"use strict";

let gulp = require("gulp"),
    stylus = require("gulp-stylus"),
    /* compiling Stylus */
    pug = require("gulp-pug"),
    /* Pug */
    browserSync = require("browser-sync"),
    /* Server */
    autoprefixer = require("gulp-autoprefixer"),
    /* Autoprefixer */
    sourceMaps = require("gulp-sourcemaps"),
    /* Sourcemaps for CSS */
    cleanCSS = require("gulp-cleancss"),
    /* CSS compression */
    rename = require("gulp-rename"),
    /* Rename files */
    uglify = require("gulp-uglify"),
    /* JavaScript compression */
    notify = require("gulp-notify"),
    /* Message on errors */
    imageMin = require("gulp-imagemin"),
    /* Image compression  */
    notifier = require("node-notifier"),
    /* Message popup */
    plumber = require("gulp-plumber"),
    /* Stop work stoppage */
    nib = require("nib"),
    /* Libary for Stylus */
    rupture = require("rupture"),
    /* Libary for Stylus */
    del = require("del"),
    /* Delete for all */
    concat = require("gulp-concat"),
    /* Merge files */
    cheerio = require("gulp-cheerio"),
    /* Removing superfluous styles from svg*/
    svgSprite = require("gulp-svg-sprite"),
    /* Create svg-sprite */
    svgMin = require("gulp-svgmin"),
    /*  Svg compression  */
    replace = require("gulp-replace");
/* RegExp for gulp */

let path = {
    app: {
        html: "./app/pug/pages/**/*.pug",
        css: "./app/stylus/main.styl",
        js: "./app/js/common.js",
        img: "./app/img/**/*.+(jpg|jpeg|png|svg|gif|ico)",
        svg: "./app/img/svg/*.svg",
        fonts: "./app/fonts/**/*.+(ttf|eot|woff|svg)"
    },
    dest: {
        html: "./dist/",
        css: "./dist/css/",
        fonts: "./dist/fonts/",
        js: "./dist/js/",
        img: "./dist/img/",
        svg: "./dist/img/"
    },
    libs: {
        css: [
            "./app/libs/bootstrap4/dist/css/bootstrap-reboot.min.css",
            "./app/libs/bootstrap4/dist/css/bootstrap-grid.min.css",
            "./app/libs/fancybox/dist/jquery.fancybox.min.css",
            "./app/libs/swiper/dist/css/swiper.min.css"
        ],
        js: [
            "./app/libs/jquery/dist/jquery.min.js",
            "./app/libs/fancybox/dist/jquery.fancybox.min.js",
            "./app/libs/swiper/dist/js/swiper.min.js"
        ]
    },
    watch: {
        html: "./app/pug/**/*.pug",
        css: "app/stylus/**/*.styl",
        js: "app/js/common.js",
        img: "app/img/**/*.+(jpg|jpeg|png|svg|gif|ico)",
        svg: "app/img/svg/*.svg"
    }
};

gulp.task("browser-sync", function () {
    browserSync({
        server: {
            baseDir: "./dist/"
        },
        notify: false,
        open: false,
        // tunnel: true, tunnel: "project-name",
        // Demonstration page: http://project-name.localtunnel.me
    });
    gulp.watch(path.dest.html).on("change", browserSync.reload);
});

gulp.task("html", function () {
    return gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest(path.dest.html))
        .pipe(browserSync.stream());
});

gulp.task("styles", function () {
    return gulp.src(path.app.css)
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(stylus({
            use: [nib(), rupture()]
        }))
        .pipe(autoprefixer(["last 5 versions"]))
        .pipe(rename({
            basename: "main",
            suffix: ".min",
        }))
        .pipe(cleanCSS())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(path.dest.css))
        .pipe(browserSync.stream());
});

gulp.task("vendorCss", function () {
    return gulp.src(path.libs.css)
        .pipe(concat("vendor.min.css"))
        .pipe(sourceMaps.init())
        .pipe(cleanCSS())
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest(path.dest.css));
});

gulp.task("js", function () {
    return gulp.src(path.app.js)
        .pipe(plumber())
        .pipe(rename({
            basename: "common",
            suffix: ".min"
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.dest.js))
        .pipe(browserSync.stream());
});


gulp.task("vendorJs", function () {
    return gulp.src(path.libs.js)
        .pipe(concat("vendor.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(path.dest.js));
});

gulp.task("svgSprite", function () {
    return gulp.src(path.app.svg)
        .pipe(svgMin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $("[fill]").removeAttr("fill");
                $("[stroke]").removeAttr("stroke");
                $("[style]").removeAttr("style");
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(replace("&gt;", ">"))
        .pipe(svgSprite({
            mode: {
                inline: true,
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(path.dest.svg));
});


gulp.task("image-min", function () {
    return gulp.src(path.app.img)
        .pipe(imageMin())
        .pipe(gulp.dest(path.dest.img).on("error", notify.onError()));
});

gulp.task("fonts", function () {
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dest.fonts))
        .pipe(browserSync.stream());
});

gulp.task("watch", function () {
    gulp.watch(path.watch.css, gulp.series("styles"));
    gulp.watch(path.watch.html, gulp.series("html"));
    gulp.watch(path.watch.js, gulp.series("js"));
    gulp.watch(path.watch.img, gulp.series("image-min"));
    gulp.watch(path.watch.svg, gulp.series('svgSprite'));
});

gulp.task("default", gulp.parallel(
    "watch",
    "browser-sync",
    "image-min",
    "svgSprite",
    "fonts",
    "html",
    "styles",
    "js",
    "vendorCss",
    "vendorJs"
));

gulp.task("build", gulp.series(gulp.parallel(
    "html",
    "styles",
    "js",
    "image-min",
    "svgSprite",
    "fonts"
)));


gulp.task("del", function () {
    return del("./dist/**").then(function () {
        notifier.notify({
            message: "Успешно удалено бро!"
        });
    }).catch(function () {
        notifier.notify({
            message: "Бро случилась ошибка:c"
        });
    });
});