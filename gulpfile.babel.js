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
const $ = plugins();

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
 * @param cb
 */
function startServer(cb) {
    browser.init({
        server: config.paths.dist.path,
        port: config.development.server.port
    });
    cb();
}

/**
 * Reload the browser with BrowserSync
 */
function reloadServer(cb) {
    browser.reload();
    cb();
}

/**
 * Watch for changes to static assets, pages, Sass, and JavaScript
 * @param cb
 */
function watch(cb) {
    gulp.watch(config.paths.src.assets, taskCopyAssets);
    gulp.watch('src/pages/**/*.hbs').on('change', gulp.series(taskGeneratePages, browser.reload));
    gulp.watch('src/layouts/**/*.hbs').on('change', gulp.series(taskResetPages, taskGeneratePages, browser.reload));
    gulp.watch('src/partials/**/*.hbs').on('change', gulp.series(taskResetPages, taskGeneratePages, browser.reload));

    gulp.watch('src/assets/scss/**/*.scss', taskGenerateSASS);
    gulp.watch('src/assets/js/**/*.js').on('change', gulp.series(taskGenerateJS, taskCopyInitJs, browser.reload));
    gulp.watch('src/assets/img/**/*').on('change', gulp.series(taskCopyImages, browser.reload));

    gulp.watch('src/styleguide/**').on('change', gulp.series(taskGenerateStyleGuide, browser.reload));
    cb();
}


/* ------------------------------
 *  ## Build Functions
 * ------------------------------ */

/**
 * taskClean
 * @param cb
 * Deletes dist and build folder
 * This happens every time a build starts
 */
function taskClean(cb) {
    rimraf.sync(config.paths.dist.path);
    rimraf.sync(config.paths.build.path);
    cb();
}

/**
 * taskCopyAssets
 * @returns {*}
 * Copy files out of the assets folder
 * This task skips over the "media/images", "js", and "scss" folders, which are parsed separately
 */
function taskCopyAssets() {
    return gulp.src([
        "src/assets/**/!(scss|js|images)/*",


        "_src/assets/fonts/**/*",
        "_src/assets/js/**/*",
        "_src/assets/vendor/**/*",


        "___!src/assets/media/images{,/**}",
        "___!src/assets/js{,/**}",
        "___!src/assets/scss{,/**}"
    ]).pipe(gulp.dest(
        path.join(config.paths.dist.path, config.paths.dist.assets)
    ));
}

/**
 * TODO
 * @returns {*}
 */
function taskCopyInitJs() {
    return gulp.src("src/assets/vendors/gsb/js/init.js").pipe(gulp.dest(path.join(config.paths.dist.path, config.paths.dist.assets, 'js')));
}

/**
 * TODO
 * @returns {*}
 */
function taskCopyGsbModules() {
    return gulp.src("src/assets/vendors/gsb/js/gsb/**/*.js").pipe(gulp.dest(path.join(config.paths.dist.path, config.paths.dist.assets, '/js/gsb')));
}

/**
 * Copy images to the "dist" folder.
 * In production, the images are compressed
 */
function taskCopyImages(cb) {
    return gulp.src([
        'src/assets/media/images/**'
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
    ))).pipe(gulp.dest('dist/assets/media/images'));
}


/* ------------------------------
 *  ## resizeimg
 * ------------------------------ */

/**
 * taskGenerateResizeimgScaledImages
 * @param cb
 */
function taskGenerateResizeimgScaledImages(cb) {
    let files = glob.sync(
        config.resizeimg.src,
        {
            "absolute": true,
            "ignore": ['**/*.ignore/**']
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
                                    // check configured height / widht
                                    let resizeimgOptions = {};
                                    let bHasWidth = typechecks.isNumeric(dimension.width);
                                    let bHasHeight = typechecks.isNumeric(dimension.height);

                                    if (!bHasWidth && !bHasHeight) {
                                        log.warn(`size '${dimensionKey}' has no height and width!`);
                                        continue;
                                    }


                                    // set auto dimension for missing config
                                    if (!bHasWidth) {
                                        // dimension.width = -1;
                                        dimension.width = "auto";
                                    }
                                    if (!bHasHeight) {
                                        // dimension.height = -1;
                                        dimension.height = "auto";
                                    }


                                    // create targetFolder
                                    let targetPath = path.join(absolutPathPrefix, config.resizeimg.target);
                                    let subFolder = "";

                                    // SubFolder check
                                    let subFoldersEndIndex = filename.lastIndexOf('/');
                                    if (subFoldersEndIndex > -1) {
                                        subFolder = filename.substring(0, subFoldersEndIndex);
                                    }

                                    targetPath = path.join(targetPath, subFolder);
                                    if (typechecks.isTrue(config.resizeimg.options.createFolders)) {
                                        targetPath = path.join(targetPath, dimensionKey);
                                    }
                                    ensureFolder(targetPath);


                                    // create Filename
                                    let targetFilename = "";
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

                                    let targetFile = path.join(targetPath, targetFilename);


                                    // create resizeimg options
                                    if (typechecks.isNumeric(dimension.width)) {
                                        resizeimgOptions['width'] = dimension.width;
                                    }
                                    if (typechecks.isNumeric(dimension.height)) {
                                        resizeimgOptions['height'] = dimension.height;
                                    }


                                    // generate resized images
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
    cb();
}


/* ------------------------------
 *  ## JavaScript Functions
 * ------------------------------ */

/**
 * Combine JavaScript into one file
 * In production, the file is minified
 */
function taskGenerateJS() {
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
function taskGeneratePages() {
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
 * @param cb
 * Load updated HTML templates and partials into Panini
 */
function taskResetPages(cb) {
    panini.refresh();
    cb();
}


/* ------------------------------
 *  ## SASS Functions
 * ------------------------------ */

/**
 * Compile Sass into CSS
 * In production, the CSS is compressed
 */
function taskGenerateSASS() {
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
 *  ## node-sprite-generator (nsg)
 * ------------------------------ */

/**
 * Task-Function
 * TODO
 */
function taskGenerateNsgSprite(cb) {
    return generateNsgSprite(true, cb);
}

/**
 * Task-Function
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function taskGenerateNsgSprites(cb) {
    return generateNsgSprite(false, cb);
}

/**
 * TODO
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function generateNsgSprite(flagSingleFileSprite, cb) {
    flagSingleFileSprite = typechecks.isBoolean(flagSingleFileSprite) ? flagSingleFileSprite : true;

    let spriteSources = glob.sync(path.join(config.nsg.sprite_src, '*'), {
        "ignore": ['**/*.ignore']

    })
    .filter(function (spriteSource) {
        if (fs.statSync(spriteSource).isFile()) {
            log.warn(`no parent sprite-folder definied. file '${spriteSource}' will be ignored! move image to a new/existing parent and restart the generate task.`);
            return false;
        }

        // remain only folder with images (png, jpeg, pjg
        let globImages = glob.sync( path.join(spriteSource, '**/*.{png,jpg,jpeg}' ));
        return (globImages.length >= 1);

    });


    const SPRITENAME_ALL_SPRITE = 'all-sprite';
    let spriteNames = [];
    let spriteImages = {};


    // determine individual sprite name and imageSources for determined sprite sources
    spriteSources.forEach( function(spriteSource, index) {
        let spriteSourceFolderName;
        if (!flagSingleFileSprite) {
            spriteSourceFolderName = spriteSource;
            let lastFolderIndex = spriteSource.lastIndexOf('/') + 1;
            if ( spriteSourceFolderName.length > lastFolderIndex ) {
                spriteSourceFolderName = spriteSource.substring(lastFolderIndex);
            }
        }
        else {
            spriteSourceFolderName = SPRITENAME_ALL_SPRITE;
        }

        // add current spriteSourceFolderName to spriteNames
        spriteNames.push(spriteSourceFolderName);

        if ( typechecks.isUndefined(spriteImages[spriteSourceFolderName])) {
            spriteImages[spriteSourceFolderName] = [];
        }

        // add specific sprite sources
        spriteImages[spriteSourceFolderName].push( path.join( spriteSource, '**/*.{png,jpg,jpeg}' ) );
    });

    // start nsg execution with flag depended sprite sources
    if ( typechecks.isNotEmpty(spriteImages) ) {
        if ( flagSingleFileSprite ) {
            return executeNsg( spriteNames[0], spriteImages[spriteNames[0]] );
        }
        else {
            spriteSources.forEach( async function ( spriteSource, index ) {
                return await executeNsg( spriteNames[index], spriteImages[spriteNames[index]] );
            } );
        }
    }
    cb();
}

/**
 * Creates and runs the Node-Sprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 * @param spriteName
 * @param spriteSources
 * @returns {*}
 */
function executeNsg(spriteName, spriteSources) {
    return new Promise(function(resolve, reject) {
        log(`Start generating sprite for '${spriteName}'.`);

        let spriteFilename = `${config.nsg.sprite_prefix}${spriteName}${config.nsg.sprite_suffix}.png`;
        let spritePath = path.join(config.nsg.sprite_target, spriteFilename);
        let stylesheetFilename =`${config.nsg.stylesheet_prefix}${spriteName}${config.nsg.stylesheet_suffix}${config.nsg.stylesheet_extension}`;
        let stylesheetPath = path.join(config.nsg.stylesheet_target, stylesheetFilename);
        let stylesheetPrefix = `${config.nsg.sprite_prefix}${spriteName}${config.nsg.sprite_suffix}-`;
        let stylesheetSpriteUrl = `${config.nsg.stylesheet_sprite_url}${spriteFilename}`;

        const nsgConfig = {
            spritePath: spritePath,
            src: spriteSources,
            stylesheet: config.nsg.stylesheet,
            stylesheetPath: stylesheetPath,
            stylesheetOptions: {
                prefix: stylesheetPrefix,
                spritePath: stylesheetSpriteUrl,
                pixelRatio: config.nsg.pixelRatio
            },
            compositor: config.nsg.compositor,
            layout: config.nsg.layout,
            layoutOptions: {
                padding: 30
            }
        };

        nsg( nsgConfig, function (err) {
            if (err) {
                log.error(err);
                reject(err);
            }
            else {
                log(`Sprite for '${spriteName}' generated!`);
                resolve();
            }
        });
    });
}


/* ------------------------------
 *  ## Styleguide Functions
 * ------------------------------ */

/**
 * taskGenerateStyleGuide
 * @param cb
 * Generate a style guide from the Markdown content and HTML template in styleguide
 */
function taskGenerateStyleGuide(cb) {
    let target = path.join(config.paths.dist.path, 'doc');
    ensureFolder(target);
    sherpa('src/styleguide/index.md',
        {
            output: path.join(target, 'styleguide.html'),
            template: 'src/templates/styleguide/template.hbs'
        },
        cb
    );
}


/* ------------------------------
 *  ## SVG-Sprite
 * ------------------------------ */

/**
 * taskGenerateSvgSpriteSprite
 * @returns {*}
 */
function taskGenerateSvgSpriteSprite() {
    return gulp.src(config.svgsprite.src, {
        "ignore": ['**/*.ignore/**']
    }).pipe($.svgSprite({
        dest: './',
        bust: false,
        mode: {
            css: {
                sprite: "sprites/sprite.css.svg",
                layout: config.svgsprite.layout,
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
    })).pipe(gulp.dest('build/svg-sprites'));
}



/* ==================================================================================================================
 *  # Tasks
 * ================================================================================================================== */

/**
 * Task: clean
 * runs: taskClean function
 */
gulp.task('clean', taskClean );

/**
 * Task: copy-assets
 * runs: taskCopyAssets function
 */
gulp.task('copy-assets', taskCopyAssets );

/**
 * Task: copy-images
 * runs: taskCopyImages function
 */
gulp.task('copy-images', taskCopyImages );

/**
 * Task: copy-init-js
 * runs: taskCopyInitJs function
 */
gulp.task('copy-init-js', taskCopyInitJs );

/**
 * Task: copy-gsb-modules
 * runs: taskCopyGsbModules function
 */
gulp.task('copy-gsb-modules', taskCopyGsbModules );

/**
 * Task: generate-js
 * runs: taskGenerateJS function
 */
gulp.task('generate-js', taskGenerateJS );

/**
 * Task: generate-pages
 * runs: taskGeneratePages function
 */
gulp.task('generate-pages', taskGeneratePages );

/**
 * Task: generate-sass
 * runs: taskGenerateSASS function
 */
gulp.task('generate-sass', taskGenerateSASS );

/**
 * Task: generate-resizeimg-scaled-images
 * runs: taskGenerateResizeimgScaledImages function
 */
gulp.task('generate-resizeimg-scaled-images', taskGenerateResizeimgScaledImages );

/**
 * Task: generate-nsg-sprite
 * runs: taskGenerateNsgSprite function
 */
gulp.task('generate-nsg-sprite', taskGenerateNsgSprite );

/**
 * Task: generate-nsg-sprites
 * runs: taskGenerateNsgSprites function
 */
gulp.task('generate-nsg-sprites', taskGenerateNsgSprites );

/**
 * Task: generate-svg-sprite
 * runs: taskGenerateSvgSpriteSprite function
 */
gulp.task('generate-svgsprite-sprite', taskGenerateSvgSpriteSprite );

/**
 * Task: generate-styleguide
 * runs: taskGenerateStyleGuide function
 */
gulp.task('generate-styleguide', taskGenerateStyleGuide );

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
