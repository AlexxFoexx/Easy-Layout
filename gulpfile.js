var gulp = require("gulp"),
    sass = require("gulp-sass"),
    browserSync = require("browser-sync"),
    autoprefixer = require("gulp-autoprefixer"),
    sourceMaps = require("gulp-sourcemaps"),
    cleanCSS = require("gulp-cleancss"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    notify = require("gulp-notify"),
    imageMin = require("gulp-imagemin"),
    gulpIf = require("gulp-if"),
    plumber = require("gulp-plumber"),
    argv = require("yargs").argv;

gulp.task("browser-sync", function() {
    browserSync({
      server: {
        baseDir: "app"
      },
      notify: false,
      open: false,
      // tunnel: true, tunnel: "project-name", 
      // Demonstration page: http://project-name.localtunnel.me
    });
    gulp.watch("app/*.html").on("change", browserSync.reload);
});

gulp.task("styles", function() {
    return gulp.src("app/sass/**/*.sass")
      .pipe(plumber())
      .pipe(sourceMaps.init())
      .pipe(sass({outputStyle: "expanded"}).on("error", notify.onError()))
      .pipe(autoprefixer(["last 15 versions"]))
      .pipe(gulpIf(argv.compressed, cleanCSS()))
      .pipe(gulpIf(argv.compressed, rename({ suffix: ".min", prefix: "" })))
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("app/css/"))
      .pipe(browserSync.stream());
});

gulp.task("js", function () {
  return gulp.src("app/js/common.js")
    .pipe(rename({basename: "scripts"}))
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("app/js/"))
    .pipe(browserSync.stream());
});

gulp.task("image-min", function () {
  return gulp.src("app/img/*.+(jpg|png|gif|svg)")
    .pipe(imageMin())
    .pipe(gulp.dest("app/img/ready-images").on("error", notify.onError()));
});

gulp.task("watch", function() {
    gulp.watch("app/sass/**/*.sass", gulp.series("styles"));
    gulp.watch("app/js/common.js", gulp.series("js"));
});

gulp.task("default", gulp.parallel("watch", "browser-sync"));

gulp.task("build", gulp.series("styles", "js", "image-min"));