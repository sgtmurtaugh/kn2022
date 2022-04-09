'use strict';

import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import fs       from 'fs';
import path     from 'path';
import mkdirp   from 'make-dir';
import yargs    from 'yargs';
// TODO: YAML wieder aktivieren, da die YAML config self references und nested values verwenden kann
import yaml     from 'js-yaml';
import nsg      from 'node-sprite-generator';
import promise  from 'es6-promise';
import browser  from 'browser-sync';
import rimraf   from 'rimraf';
import panini   from 'panini';
import sherpa   from 'style-sherpa';
//import typechecks from './gulp/functions/type-checks';
import typechecks from '@sgtmurtaugh/typechecks';
import glob     from 'glob';
//import svgSpritesheet from '@mariusgundersen/gulp-svg-spritesheet';
import log from 'fancy-log';

const resizeImage   = require('resize-img');

// Load all Gulp plugins into one variable
const $ = plugins({ 'DEBUG': true });

// Promise Definition for Tasks without Streams or existing Promises
const Promise = promise.Promise;

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
// const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();
const config = loadConfig();



/* ==================================================================================================================
 *  # Functions
 * ================================================================================================================== */

/* ------------------------------
 *  ## Helper Functions
 * ------------------------------ */

/**
 * Load the JSON Config
 */
function loadConfig() {
    // let ymlFile = fs.readFileSync('config.yml', 'utf8');
    // return yaml.load(ymlFile);

    let configFile = fs.readFileSync('config.json', 'utf-8');
    return JSON.parse(configFile);
}

/**
 * Creates the given directy if it not exists.
 * @param dir
 */
function ensureFolder(dir) {
    let bSuccess = false;
    if (!typechecks.isEmpty(dir)) {
        if ( !dir.startsWith( __dirname ) ) {
            dir = path.join(__dirname, dir);
        }

        if ( !(bSuccess = fs.existsSync(dir)) ) {
            const path = mkdirp.sync( dir );
            if ( typechecks.isNotEmpty(path) ) {
                bSuccess = true;
            }
        }
    }
    return bSuccess;
}

// /**
//  * Determines all files of a given directory
//  */
// function getFiles(dir) {
//     return fs.readdirSync(dir)
//         .filter(function (file) {
//             return fs.statSync(path.join(dir, file)).isFile();
//         });
// }

/**
 * Determines all subfolders of a given directory
 */
function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


/* ------------------------------
 *  ## Browser Functions
 * ------------------------------ */

/**
 * Start a server with BrowserSync to preview the site in
 * @param done
 */
function startServer(done) {
    browser.init({
        server: config.paths.dist.path,
        port: config.development.server.port
    });
    done();
}

/**
 * Reload the browser with BrowserSync
 */
function reloadServer(done) {
    browser.reload();
    done();
}

/**
 * Watch for changes to static assets, pages, Sass, and JavaScript
 * @param done
 */
function watch(done) {
    gulp.watch(config.paths.src.assets, copyAssets);
    gulp.watch('src/pages/**/*.html').on('change', gulp.series(generatePages, browser.reload));
    gulp.watch('src/{layouts,partials}/**/{*.html,*.hbs}').on('change', gulp.series(resetPages, generatePages, browser.reload));
    gulp.watch('src/assets/scss/**/*.scss', generateSASS);
    gulp.watch('src/assets/js/**/*.js').on('change', gulp.series(generateJS, copyInitJs, browser.reload));
    gulp.watch('src/assets/img/**/*').on('change', gulp.series(copyImages, browser.reload));
    gulp.watch('src/styleguide/**').on('change', gulp.series(generateStyleGuide, browser.reload));
    done();
}


/* ------------------------------
 *  ## Build Functions
 * ------------------------------ */

/**
 * clean
 * @param done
 * Deletes dist and build folder
 * This happens every time a build starts
 */
function clean(done) {
    rimraf(config.paths.dist.path, done);
    rimraf(config.paths.build.path, done);
}

/**
 * copyAssets
 * @returns {*}
 * Copy files out of the assets folder
 * This task skips over the "img", "js", and "scss" folders, which are parsed separately
 */
function copyAssets() {
    return gulp.src([
        "src/assets/**/*",
        "!src/assets/img{,/**}",
        "!src/assets/img-src{,/**}",
        "!src/assets/js{,/**}",
        "!src/assets/scss{,/**}"
    ]).pipe(gulp.dest(
        config.paths.dist.path + '/' + config.paths.dist.assets
    ));
}

/**
 * TODO
 * @returns {*}
 */
function copyInitJs() {
    return gulp.src("src/assets/vendors/gsb/js/init.js").pipe(gulp.dest(config.paths.dist.path + '/' + config.paths.dist.assets + '/js'));
}

/**
 * TODO
 * @returns {*}
 */
function copyGsbModules() {
    return gulp.src("src/assets/vendors/gsb/js/gsb/**/*.js").pipe(gulp.dest(config.paths.dist.path + '/' + config.paths.dist.assets + '/js/gsb'));

}

/**
 * Copy images to the "dist" folder.
 * In production, the images are compressed
 * //TODO: Hier muessen alle src Ordner ignoriert werden! Leider greift die Logik hier noch nicht
 */
function copyImages() {
    return gulp.src([
        'src/assets/img/**'
    ]).pipe($.if(PRODUCTION, $.imagemin(
        [
            $.imagemin.gifsicle({interlaced: true}),
            $.imagemin.mozjpeg({quality: 75, progressive: true}),
            $.imagemin.optipng({optimizationLevel: 5}),
            $.imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]
        /** gulp-imigemin groesser 3
         {
            progressive: true
        }
         */
    ))).pipe(gulp.dest('dist/assets/img'));
}


/* ------------------------------
 *  ## Image Scaler Functions
 * ------------------------------ */

/**
 * generateScaledImages
 * @param done
 */
function generateScaledImages(done) {
    // let files = gulp.src(config.sharp.src);
    let files = glob.sync(
        config.resizeimg.src,
        {
            "absolute": true
        }
    );

    for (let file of files) {
        if (typechecks.isNotEmpty(file)) {
            let indexRelativPath = file.indexOf(config.resizeimg.path);

            if (indexRelativPath > -1) {
                let absolutPathPrefix = "";
                if (indexRelativPath > 0) {
                    absolutPathPrefix = file.substring(0, indexRelativPath);
                }

                if (file.length > indexRelativPath) {
                    let filename = file.substring(indexRelativPath + config.resizeimg.path.length);

                    for( let dimensionKey in config.resizeimg.sizes ) {
                        let indexExtension = filename.lastIndexOf('.');

                        if (indexExtension > -1) {
                            if (config.resizeimg.sizes.hasOwnProperty(dimensionKey)) {
                                let dimension = config.resizeimg.sizes[dimensionKey];

                                if (typechecks.isNotEmpty(dimension)) {
                                    // Pruefen, ob height und width gesetzt sind
                                    let resizeimgOptions = {};
                                    let bHasWidth = typechecks.isNumeric(dimension.width);
                                    let bHasHeight = typechecks.isNumeric(dimension.height);

                                    // Fehlen beide Dimensionsangaben, dann diese Groese ueberspringen
                                    if (!bHasWidth && !bHasHeight) {
                                        log("size '" + dimensionKey + "' besitzt weder eine Hoehen noch eine Breitenangabe!");
                                        continue;
                                    }

                                    // default setzen, wenn nur eine Dimensionsangabe angegeben wurde
                                    if (!bHasWidth) {
                                        // dimension.width = -1;
                                        dimension.width = "auto";
                                    }
                                    if (!bHasHeight) {
                                        // dimension.height = -1;
                                        dimension.height = "auto";
                                    }

                                    // Zielpfad, Filename und Subfolder ermitteln
                                    let targetPath = path.join(absolutPathPrefix, config.resizeimg.target);
                                    let subFolder = "";
                                    let targetFilename = "";

                                    // SubFolder check
                                    let subFoldersEndIndex = filename.lastIndexOf('/');
                                    if (subFoldersEndIndex > -1) {
                                        subFolder = filename.substring(0, subFoldersEndIndex);
                                    }

                                    if (typechecks.isTrue(config.resizeimg.options.createFolders)) {
                                        targetPath = path.join(targetPath, dimensionKey);
                                    }

                                    if (subFoldersEndIndex > -1) {
                                        targetFilename = filename.substring(subFoldersEndIndex, indexExtension);
                                    }
                                    else {
                                        targetFilename = filename.substring(0, indexExtension);
                                    }

                                    if (typechecks.isFalse(config.resizeimg.options.createFolders)) {
                                        targetFilename += '_';
                                        targetFilename += dimensionKey;
                                    }

                                    targetFilename += filename.substring(indexExtension);

                                    if (typechecks.isNumeric(dimension.width)) {
                                        resizeimgOptions['width'] = dimension.width;
                                    }
                                    if (typechecks.isNumeric(dimension.height)) {
                                        resizeimgOptions['height'] = dimension.height;
                                    }

                                    targetPath = path.join(targetPath, subFolder);
                                    ensureFolder(targetPath);

                                    let targetFile = path.join(targetPath, targetFilename);
                                    log('targetFile ' + targetFile);
                                    resizeImage(fs.readFileSync(file), resizeimgOptions).then(buf => {
                                        fs.writeFileSync(targetFile, buf);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    done();
}


/* ------------------------------
 *  ## JavaScript Functions
 * ------------------------------ */

/**
 * Combine JavaScript into one file
 * In production, the file is minified
 */
function generateJS() {
    return gulp.src(config.paths.src.javascript)
        .pipe($.sourcemaps.init())
        .pipe($.concat('app.js'))
        .pipe($.babel())
        .pipe($.if(PRODUCTION, $.uglify()
            .on('error', e => { console.log(e); })
        ))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(config.paths.dist.javascript));
}


/* ------------------------------
 *  ## Pages Functions
 * ------------------------------ */

/**
 * Copy page templates into finished HTML files
 * @returns {*}
 */
function generatePages() {
    return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
        .pipe(panini({
            root: 'src/pages/',
            layouts: 'src/layouts/',
            partials: 'src/partials/',
            data: 'src/data/',
            helpers: 'src/helpers/'
        }))
        .pipe(gulp.dest(config.paths.dist.path));
}

/**
 * resetPages
 * @param done
 * Load updated HTML templates and partials into Panini
 */
function resetPages(done) {
    panini.refresh();
    done();
}


/* ------------------------------
 *  ## SASS Functions
 * ------------------------------ */

/**
 * Compile Sass into CSS
 * In production, the CSS is compressed
 */
function generateSASS() {
    return gulp.src(config.paths.src.sass)
        .pipe($.sourcemaps.init())
        .pipe($.dartSass().on('error', $.dartSass.logError))
        .pipe($.autoprefixer())
        // Comment in the pipe below to run UnCSS in production
        // .pipe($.if(PRODUCTION, $.uncss(UNCSS_OPTIONS)))
        .pipe($.if(PRODUCTION, $.cssnano()))
        .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
        .pipe(gulp.dest(config.paths.dist.css))
        .pipe(browser.reload({ stream: true }));
}


/* ------------------------------
 *  ## Sprite Functions
 * ------------------------------ */

/**
 * Task-Function
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function generateSprites(done) {
    let folders = getFolders(config.nsg.sprite_src);
    folders.forEach( async function (folder) {
        return await generateSprite(folder);
    });
    done();
}

/**
 * Task-Function
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function generateSingleSprite() {
    return generateSprite(null);
}

/**
 * Creates and runs the Node-Sprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 * @param folder
 * @returns {*}
 */
function generateSprite(folder) {
    let currentSprite = folder;
    if (typechecks.isEmpty(folder)) {
        folder = '';
        currentSprite = 'all-sprites';
    }

    return new Promise(function(resolve, reject) {
        log(`Start generating sprite for '${currentSprite}'.`);

        let spriteName =        `-${config.nsg.sprite_prefix}${currentSprite}${config.nsg.sprite_suffix}-`;
        let spriteFilename =    `${config.nsg.sprite_prefix}${currentSprite}${config.nsg.sprite_suffix}.png`;
        let stylesheetFilename =`${config.nsg.stylesheet_prefix}${currentSprite}${config.nsg.stylesheet_suffix}${config.nsg.stylesheet_extension}`;

        const nsgConfig = {
            spritePath: path.join(config.nsg.sprite_target, spriteFilename),
            src: [
                path.join(config.nsg.sprite_src, folder, '**/*.{png,jpg,jpeg}')
            ],
            stylesheet: 'scss',
            stylesheetPath: path.join(config.nsg.stylesheet_target, stylesheetFilename ),
            stylesheetOptions: {
                prefix: spriteName,
                spritePath: `src/assets/img/sprites/${spriteFilename}`
            },
            compositor: 'jimp',
            layout: 'packed',
            layoutOptions: {
                padding: 30
            }
        };

        nsg( nsgConfig, function (err) {
            if (err) {
                reject(err);
            }
            else {
                log(`Sprite for '${currentSprite}' generated!`);
                resolve();
            }
        });
        resolve();
    });
}


/* ------------------------------
 *  ## Styleguide Functions
 * ------------------------------ */

/**
 * generateStyleGuide
 * @param done
 * Generate a style guide from the Markdown content and HTML template in styleguide
 */
function generateStyleGuide(done) {
    let target = config.paths.dist.path + '/doc';
    ensureFolder(target);
    sherpa('src/styleguide/index.md',
        {
            output: target + '/styleguide.html',
            template: 'src/templates/styleguide/template.hbs'
        },
        done
    );
}


/* ------------------------------
 *  ## SVG Sprite Functions
 * ------------------------------ */

/**
 * generateSvgSprite
 * @returns {*}
 */
function generateSvgSprite() {
    return gulp.src(config.svgsprite.src)
        .pipe($.svgSprite({
            dest: './',
            bust: false,
            mode: {
                css: {
                    sprite: "sprites/sprite.css.svg",
                    layout: 'diagonal',
                    prefix: ".svgsprite-%s",
                    dimensions: "-dims",
                    mixin: 'sprite',
                    render: {
                        css: {
                            dest: 'css/_svg-sprite.css'
                        },
                        scss: {
                            dest: 'scss/_svg-sprite.scss'
                        },
                        less: {
                            dest: 'less/_svg-sprite.less'
                        },
                        styl: {
                            dest: 'styl/_svg-sprite.styl'
                        }
                    },
                    example: {
                        dest: 'html/svg-sprite-example.html'
                    }
                },
            },
            shape: {
                spacing: {
                    padding: 1,
                    box: 'padding'
                }
            }
        }))
        .pipe(gulp.dest('build/svg-sprites'));
}



/* ==================================================================================================================
 *  # Tasks
 * ================================================================================================================== */

/**
 * Task: clean-dist
 * runs: clean function
 */
gulp.task('clean', clean );

/**
 * Task: copy-assets
 * runs: copyAssets function
 */
gulp.task('copy-assets', copyAssets );

/**
 * Task: copy-images
 * runs: copyImages function
 */
gulp.task('copy-images', copyImages );

/**
 * Task: copy-init-js
 * runs: copyInitJs function
 */
gulp.task('copy-init-js', copyInitJs );

/**
 * Task: copy-gsb-modules
 * runs: copyGsbModules function
 */
gulp.task('copy-gsb-modules', copyGsbModules );

/**
 * Task: generate-js
 * runs: generateJS function
 */
gulp.task('generate-js', generateJS );

/**
 * Task: generate-pages
 * runs: generatePages function
 */
gulp.task('generate-pages', generatePages );

/**
 * Task: generate-sass
 * runs: generateSASS function
 */
gulp.task('generate-sass', generateSASS );

/**
 * Task: generate-scaled-images
 * runs: generateScaledImages function
 */
gulp.task('generate-scaled-images', generateScaledImages );

/**
 * Task: generate-sprites
 * runs: generateSprites function
 */
gulp.task('generate-sprites', generateSprites );

/**
 * Task: generate-single-sprite
 * runs: generateSingleSprite function
 */
gulp.task('generate-single-sprite', generateSingleSprite );

/**
 * Task: generate-svg-sprite
 * runs: generateSvgSprite function
 */
gulp.task('generate-svg-sprite', generateSvgSprite );

/**
 * Task: generate-styleguide
 * runs: generateStyleGuide function
 */
gulp.task('generate-styleguide', generateStyleGuide );

/**
 * Task: run-server
 * runs: startServer function, watch function
 */
gulp.task('run-server',
    gulp.series(
        startServer,
        watch
    )
);


/**
 * Task: built
 * runs: generate-sass task, generate-js task, copy-images task
 */
gulp.task('built',
    gulp.series(
        'clean',
        'generate-svg-sprite',
        gulp.parallel(
            'generate-js',
            'copy-assets',
            'copy-init-js',
            'copy-gsb-modules',
            'generate-sass',
            'copy-images',
            'generate-pages'
        ),
        'generate-styleguide'
    )
);


/**
 * Task: default
 * runs: built task, run-server task
 */
gulp.task('default',
    gulp.series(
        'built',
        'run-server'
    )
);
