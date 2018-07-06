let gulp = require("gulp"),
  stylus = require("gulp-stylus"),
  pug = require("gulp-pug"),
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
  nib = require("nib"),
  rupture = require("rupture"),
  del = require("del"),
  notifier = require("node-notifier"),
  argv = require("yargs").argv;

let path = {
  app: {
    html: "./app/pug/pages/**/*.pug",
    css: "./app/stylus/main.styl",
    js: "./app/js/common.js",
    img: "./app/img/**/*.+(jpg|png|gif|svg|icog)",
    fonts: "./app/fonts/**/*.+(ttf|eot|woff|svg)"
  },
  dest: {
    html: "./dist/",
    css: "./dist/css/",
    fonts: "./dist/fonts/",
    js: "./dist/js/",
    img: "./dist/img/",
    
  },
  libs: {
    css: [
      "./app/libs/bootstrap4/dist/css/bootstrap-grid.min.css",
      "./app/libs/normalize.css/normalize.css",
      "./app/libs/fancybox/dist/jquery.fancybox.min.css",
      "./app/libs/swiper/dist/css/swiper.min.css"
    ],
    js: [
      "./app/libs/jquery/dist/jquery.slim.min.js",
      "./app/libs/fancybox/dist/jquery.fancybox.min.js",
      "./app/libs/swiper/dist/js/swiper.min.js"
    ]
  },
  watch: {
    html: "./app/pug/**/*.pug",
    css: "app/stylus/**/*.styl",
    js: "app/js/common.js"
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
    .pipe(cleanCSS())
    .pipe(rename({
      basename: "main",
      suffix: ".min",
    }))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(path.dest.css))
    .pipe(browserSync.stream());
});

gulp.task("vendorCss", function () {
  return gulp.src(path.libs.css)
    .pipe(cleanCSS())
    .pipe(rename({
      basename: "vendor",
      suffix: ".min"
    }))
    .pipe(gulp.dest(path.dest.css));
});

gulp.task("js", function () {
  return gulp.src(path.app.js)
    .pipe(plumber())
    .pipe(rename({
      basename: "common"
    }))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(path.dest.js))
    .pipe(browserSync.stream());
});


gulp.task("vendorJs", function() {
   return gulp.src(path.libs.js)
      .pipe(uglify())
      .pipe(rename({
        basename: "vendor",
        suffix: ".min"
      }))
      .pipe(gulp.dest(path.dest.js));
});

gulp.task("image-min", function () {
  return gulp.src(path.app.img)
    .pipe(imageMin())
    .pipe(gulp.dest(path.dest.img).on("error", notify.onError()));
});

gulp.task("fonts", function() {
    return gulp.src(path.app.fonts)
      .pipe(gulp.dest(path.dest.fonts))
});

gulp.task("watch", function () {
  gulp.watch(path.watch.css, gulp.series("styles"));
  gulp.watch(path.watch.html, gulp.series("html"));
  gulp.watch(path.watch.js, gulp.series("js"));
});

gulp.task("default", gulp.parallel("watch", "browser-sync", "image-min", "fonts", "html", "styles", "js", "vendorCss", "vendorJs"));

gulp.task("build", gulp.series(gulp.parallel("html", "styles", "js", "image-min", "fonts")));



gulp.task('del', function () {
  return del("./dist/**").then(function () {
    notifier.notify({
      message: 'Успешно удалено бро!'
    });
  }).catch(function () {
    notifier.notify({
      message: 'Бро случилась ошибка:c'
    });
  });
});