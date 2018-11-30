//NL-static-build-process 0.9.0

var gulp = require("gulp");
var gulpIf = require("gulp-if");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
//templating
var twig = require("gulp-twig");
//concat & minify
var useref = require("gulp-useref");
var uglify = require("gulp-uglify");
var cssnano = require("gulp-cssnano");
var htmlmin = require("gulp-htmlmin");
var gzip = require("gulp-gzip");
var rev = require("gulp-rev");
var revRewrite = require("gulp-rev-rewrite");

//dev help
var plumber = require("gulp-plumber");
var sourcemaps = require("gulp-sourcemaps");
//compatibility
var prefixer = require("gulp-autoprefixer");
//deal with images
var imagemin = require("gulp-imagemin");
var imageminJpegtran = require("imagemin-jpegtran");
var imageminPngquant = require("imagemin-pngquant");
var imageminWebp = require("imagemin-webp");
var extReplace = require("gulp-ext-replace");
var cache = require("gulp-cache");
//clean it up
var del = require("del");
var runSequence = require("run-sequence");

//default tasks - just call gulp
/*gulp.task('default', function(callback){
  //sets up dev build area
  runSequence(['sass','templates','browserSync','watch'],
    callback
  );
});*/

//*==   DEVELOPMENT   ===========================================================*//
//RUNNING DEV
gulp.task("dev", ["browserSync", "sass", "js", "twig"], function() {
  //watches for sass compile needed
  gulp.watch("src/scss/**/*.scss", ["sass"]);

  //watches for twig compile needed
  gulp.watch("src/**/*.html", ["twig"]);

  //watches for js changes and copy files over
  gulp.watch("src/**/*.js", ["js"]);

  //reloads browser whenever HTML changes
  gulp.watch("dev/*.html", browserSync.reload);

  //reload browser on js file changes
  //gulp.watch('dev/**/*.js', broswerSync.reload);
});

//Setup browswerSync
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "dev"
    },
    browser: "google chrome"
  });
});

//dynamically build twig pages
gulp.task("twig", function() {
  return gulp
    .src("src/pages/*.html")
    .pipe(twig())
    .pipe(gulp.dest("dev"));
});

//SCSS Compile
gulp.task("sass", function() {
  //Individual file: return gulp.src('app/scss/style.scss')

  //Just main gets sassified
  return gulp
    .src("src/scss/main.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dev/assets/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );

  //All files inside scss get sassified
  //return gulp.src('app/scss/**/*.scss')
  //  .pipe(sass())
  //  .pipe(gulp.dest('app/css'))
  //  .pipe(browserSync.reload({
  //    stream: true
  //  }))
});

//Copy js files to dev
gulp.task("js", function() {
  gulp.src("src/js/*.js").pipe(gulp.dest("dev/assets/js"));
});

//Copy libs files to dev
gulp.task("libs", function() {
  gulp.src("src/libs/**").pipe(gulp.dest("dev/assets/libs"));
});

//*==   DISTRIBUTIION   =========================================================*//

//Build distrubution copy
gulp.task("build", function(callback) {
  runSequence(
    "clean:dist",
    ["twig", "files"],
    ["sass", "js"],
    "catMin",
    "rev:name",
    "rev:rewrite",
    "minZip",
    callback
  );
});

//rev naming
gulp.task("rev:name", function() {
  return gulp
    .src("dist/assets/**/*+(js|css)")
    .pipe(rev())
    .pipe(gulp.dest("dist/assets/"))
    .pipe(rev.manifest())
    .pipe(gulp.dest("dist/assets"));
});

gulp.task("rev:rewrite", function() {
  const manifest = gulp.src("dist/assets/rev-manifest.json");

  return gulp
    .src("dist/*.html")
    .pipe(revRewrite({ manifest }))
    .pipe(gulp.dest("dist"));
});

//minify HTML and gzip
gulp.task("minZip", function() {
  //minify HTML
  gulp
    .src("dist/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));

  //Hide GZIP for now until server configed
  //gulp.src("dist/**/*.+(js|css)").pipe(gzip()).pipe(gulp.dest("dist/"));
});

//Concat and minify
gulp.task("catMin", function() {
  //concats and minifys JS
  return (
    gulp
      .src("dev/*.html")
      .pipe(useref())
      //minifies only if it's JS
      .pipe(gulpIf("*.js", uglify()))
      //minifies if CSS
      .pipe(gulpIf("*.css", cssnano()))
      .pipe(gulpIf("*.css", prefixer("last 2 versions")))
      .pipe(gulp.dest("dist"))
  );
});

//Copy libs files to dev
gulp.task("files", function() {
  gulp.src("src/libs/**").pipe(gulp.dest("dist/assets/libs"));
  gulp.src("dev/assets/images/**").pipe(gulp.dest("dist/assets/images"));
});

//clean it up
gulp.task("clean:dist", function() {
  return del.sync("dist/**");
});

//*==   HELPER FUNCTIONS   ======================================================*//

//optimize images
gulp.task("images", function() {
  return gulp
    .src("src/images/**/*.+(png|jpg|gif|svg)")
    .pipe(
      cache(
        imagemin([
          imageminPngquant({
            speed: 1,
            quality: 80
          }),
          imageminJpegtran({
            progressive: true
          })
        ])
      )
    )
    .pipe(gulp.dest("dev/assets/images"));
});

gulp.task("responsiveImages", function() {
  return gulp
    .src("src/images/**/*.+(png|jpg|gif)")
    .pipe(
      imagemin([
        imageminWebp({
          quality: 75
        })
      ])
    )
    .pipe(extReplace(".webp"))
    .pipe(gulp.dest("dev/assets/images"));
});
