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
 * @returns {*}
 */
function loadConfig() {
    // let ymlFile = fs.readFileSync('config.yml', 'utf8');
    // return yaml.load(ymlFile);

    let configFile = fs.readFileSync('config.json', 'utf-8');
    return JSON.parse(configFile);
}

/**
 * Creates the given directy if it not exists.
 * @param dir {string}
 */
function ensureFolder(dir) {
    let bSuccess = false;
    if (!typechecks.isEmpty(dir)) {
        if ( !dir.startsWith( __dirname ) ) {
            dir = path.join(__dirname, dir);
        }

        bSuccess = fs.existsSync(dir);
        if ( !bSuccess ) {
            const _path = mkdirp.sync( dir );
            if ( typechecks.isNotEmpty(_path) ) {
                bSuccess = true;
            }
        }
    }
    return bSuccess;
}


/* ------------------------------
 *  ## Browser Functions
 * ------------------------------ */

/**
 * Start a server with BrowserSync to preview the site in
 * @param callback {Function}
 */
function startServer(callback) {
    browser.init({
        server: config.paths.dist.path,
        port: config.development.server.port
    });
    callback();
}

/**
 * Reload the browser with BrowserSync
 */
function reloadServer(callback) {
    browser.reload();
    callback();
}

/**
 * Watch for changes to static assets, pages, Sass, and JavaScript
 * @param callback {Function}
 */
function watch(callback) {
    gulp.watch(config.paths.src.assets, taskCopyAssets);
    gulp.watch('src/pages/**/*.html').on('change', gulp.series(taskGeneratePages, browser.reload));
    gulp.watch('src/layouts/**/*.hbs').on('change', gulp.series(taskResetPages, taskGeneratePages, browser.reload));
    gulp.watch('src/partials/**/*.hbs').on('change', gulp.series(taskResetPages, taskGeneratePages, browser.reload));

    gulp.watch('src/assets/scss/**/*.scss', taskGenerateSASS);
    gulp.watch('src/assets/img/**/*').on('change', gulp.series(taskCopyImages, browser.reload));

    gulp.watch('src/styleguide/**').on('change', gulp.series(taskGenerateStyleGuide, browser.reload));
    callback();
}


/* ------------------------------
 *  ## Build Functions
 * ------------------------------ */

/**
 * taskClean
 * Deletes dist and build folder
 * This happens every time a build starts
 * @param callback {Function}
 */
function taskClean(callback) {
    rimraf.sync(config.paths.dist.path);
    rimraf.sync(config.paths.build.path);
    callback();
}

/**
 * taskCopyAssets
 * Copy files out of the assets folder
 * This task skips over the "media/images", "js", and "scss" folders, which are parsed separately
 * @returns {*}
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
 * Copy images to the "dist" folder.
 * In production, the images are compressed
 * @returns {*}
 */
function taskCopyImages() {
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
 * @param callback {Function}
 */
function taskGenerateResizeimgScaledImages(callback) {
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
    callback();
}


/* ------------------------------
 *  ## JavaScript Functions
 * ------------------------------ */

/**
 * Combine JavaScript into one file
 * In production, the file is minified
 * @returns {*}
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
 * Load updated HTML templates and partials into Panini
 * @param callback {Function}
 */
function taskResetPages(callback) {
    panini.refresh();
    callback();
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
 * Delegates to the #generateNsgSprites methods. The callback is passed through and the flagSingleFileSprite
 * is set to true, to generate only a single sprite-set.
 *
 * @param callback {Function}
 */
function taskGenerateNsgSprite(callback) {
    return generateNsgSprite(true, callback);
}

/**
 * Task-Function
 * Delegates to the #generateNsgSprites methods. The callback is passed through and the flagSingleFileSprite
 * is set to false, to create multiple sprites-sets.
 *
 * @param callback {Function}
 */
function taskGenerateNsgSprites(callback) {
    return generateNsgSprite(false, callback);
}

/**
 *
 * @param flagSingleFileSprite {boolean}
 * @param callback {Function}
 *
 * TODO
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 */
function generateNsgSprite(flagSingleFileSprite, callback) {
    flagSingleFileSprite = typechecks.isBoolean(flagSingleFileSprite) ? flagSingleFileSprite : true;

    let spriteSources = glob.sync(path.join(config.nsg.sprite_src, '*'), {
        "ignore": ['**/*.ignore']

    })
    .filter(function (spriteSource) {
        if (fs.statSync(spriteSource).isFile()) {
            log.warn(`no parent sprite-folder defined. file '${spriteSource}' will be ignored! move image to a new/existing parent and restart the generate task.`);
            return false;
        }

        // remain only folder with images (png, jpeg, pjg
        let globImages = glob.sync( path.join(spriteSource, '**/*.{png,jpg,jpeg}' ));
        return (globImages.length >= 1);

    });


    const SPRITE_NAME_ALL_SPRITE = config.nsg.sprite_name || 'all-sprite';
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
            spriteSourceFolderName = SPRITE_NAME_ALL_SPRITE;
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
            spriteNames.forEach( async function ( spriteName ) {
                return executeNsg( spriteName, spriteImages[spriteName] );
            } );
        }
    }
    callback();
}

/**
 * Creates and runs the Node-Sprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 * @param spriteName {string}
 * @param spriteSources {string}
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
            stylesheet: config.nsg.stylesheet_template,
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
 *  ## SVG-Sprite
 * ------------------------------ */

/**
 * Task-Function
 * Delegates to the #generateSvgSpriteSprites methods. The callback is passed through and the flagSingleFileSprite
 * is set to true, to generate only a single sprite-set.
 *
 * @param callback {Function}
 */
function taskGenerateSvgSpriteSprite(callback) {
    return generateSvgSpriteSprites(true, callback);
}

/**
 * Task-Function
 * Delegates to the #generateSvgSpriteSprites methods. The callback is passed through and the flagSingleFileSprite
 * is set to false, to create multiple sprites-sets.
 *
 * @param callback {Function}
 */
function taskGenerateSvgSpriteSprites(callback) {
    return generateSvgSpriteSprites(false, callback);
}

/**
 * TODO
 * Determines all sprite folders inside the sprite-src folder and
 * runs the generateSprite function on each of them.
 *
 * @param flagSingleFileSprite {boolean}
 * @param callback {Function}
 */
function generateSvgSpriteSprites(flagSingleFileSprite, callback) {
    flagSingleFileSprite = typechecks.isBoolean(flagSingleFileSprite) ? flagSingleFileSprite : true;

    let spriteSources = glob.sync(path.join(config.svgsprite.sprite_src, '*'), {
        "ignore": ['**/*.ignore/**']
    })
    .filter(function (spriteSource) {
        if (fs.statSync(spriteSource).isFile()) {
            log.warn(`no parent sprite-folder defined. file '${spriteSource}' will be ignored! move image to a new/existing parent and restart the generate task.`);
            return false;
        }

        // remain only folder with svgs
        let globSvgs = glob.sync( path.join(spriteSource, '**/*.svg' ));
        return (globSvgs.length >= 1);

    });


    const SPRITE_NAME_ALL_SPRITE = config.svgsprite.sprite_name || 'all-sprite';
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
            spriteSourceFolderName = SPRITE_NAME_ALL_SPRITE;
        }

        // add current spriteSourceFolderName to spriteNames
        spriteNames.push(spriteSourceFolderName);

        if ( typechecks.isUndefined(spriteImages[spriteSourceFolderName])) {
            spriteImages[spriteSourceFolderName] = [];
        }

        // add specific sprite sources
        spriteImages[spriteSourceFolderName].push( path.join( spriteSource, '**/*.svg' ) );
    });

    // start nsg execution with flag depended sprite sources
    if ( typechecks.isNotEmpty(spriteImages) ) {
        if ( flagSingleFileSprite ) {
            return executeSvgSprite( spriteNames[0], spriteImages[spriteNames[0]] );
        }
        else {
            spriteNames.forEach( async function ( spriteName ) {
                return executeSvgSprite( spriteName, spriteImages[spriteNames] );
            } );
        }
    }
    callback();
}

/**
 * Creates and runs the svgsprite-Generator on the given folder.
 * Only PNG files will be used for the sprite. The output is a sprite PNG and a
 * SASS source file with all containing image informations.
 *
 * @param spriteName {string}
 * @param spriteSources {string}
 * @returns {*}
 */
function executeSvgSprite(spriteName, spriteSources) {
    const svgSpriteConfiguration = _setupSvgSpriteConfiguration(spriteName);

    return gulp.src(spriteSources, {
        "ignore": ['**/*.ignore/**']
    })
    .pipe($.svgSprite(svgSpriteConfiguration))
    .pipe(gulp.dest( config.svgsprite.sprite_target ));
}


/* ------------------------------
 *  ## Styleguide Functions
 * ------------------------------ */

/**
 * taskGenerateStyleGuide
 * @param callback
 * Generate a style guide from the Markdown content and HTML template in styleguide
 */
function taskGenerateStyleGuide(callback) {
//    let tmplSherpa = path.join(config.paths.src, config.paths.templates, config.paths.stylesherpa);
    let tmplStyleSherpa = config.stylesherpa.styleguide.template;

    //let srcSherpa = path.join(config.paths.src, config.paths.stylesherpa);
    let srcStyleSherpa = config.stylesherpa.styleguide.src;

    //let distStyleSherpa = path.join(config.paths.dist, config.paths.stylesherpa);
    let distStyleSherpa = config.stylesherpa.styleguide.dist;
    ensureFolder(distStyleSherpa);

    let targetStyleSherpa = path.join(distStyleSherpa, config.stylesherpa.styleguide.targetFilename);
    sherpa(srcStyleSherpa,
        {
            output: targetStyleSherpa,
            template: tmplStyleSherpa
        },
        callback
    );
}


/* ------------------------------
 *  ## SVG-Sprite
 * ------------------------------ */

/**
 *
 * @returns {{log: string, dest: string}}
 * @private
 */
function _setupSvgSpriteConfiguration(spriteName) {
//    let tmplSvgSpritePath = path.join(config.paths.src, config.paths.templates, config.paths.svgsprite);
    let tmplPath = config.svgsprite.templates;
    let tmplCommonPath = config.svgsprite.common_templates;

    let spriteExample = config.svgsprite.sprite_example || '-example.html';
    let spritePrefix = config.svgsprite.sprite_prefix || '';
    let spriteSuffix = config.svgsprite.sprite_suffix || '';
    let spriteRendererPrefix = config.svgsprite.sprite_renderer_prefix || '_';
    let spriteRendererSuffix = config.svgsprite.sprite_renderer_suffix || '';
    let spriteRendererExtension = config.svgsprite.sprite_renderer_extension || 'hbs';
    let stylesheetSpriteUrl = config.svgsprite.stylesheet_sprite_url || '';

    let modes = ['css', 'view', 'defs', 'symbol', 'stack'];

    // renderer definitions
    const renderer = ['css', 'less', 'scss', 'styl'];

    let svgSpriteConfigration = {
        dest: './', // Main output directory
        log: 'verbose',   // {info|debug|verbose|''|false|null}
        variables: {
            stylesheetSpriteUrl: stylesheetSpriteUrl
        }
    };

    // shape
    svgSpriteConfigration['shape'] = {
        id: { // SVG shape ID related options
            separator: '__', // Separator for directory name traversal
            _generator: function(name, file) {/**/}, // SVG shape ID generator callback
            pseudo: '~', // File name separator for shape states (e.g. ':hover')
            whitespace: '_' // Whitespace replacement for shape IDs
        },
        dimension: { // Dimension related options
            maxWidth: 2000, // Max. shape width
            maxHeight: 2000, // Max. shape height
            precision: 2, // Floating point precision
            attributes: false, // Width and height attributes on embedded shapes
        },
        spacing: { // Spacing related options
            padding: 0, // Padding around all shapes
            box: 'content' // Padding strategy (similar to CSS `box-sizing`) {content|icon|padding}
        },
        transform: ['svgo'], // List of transformations / optimizations
        _sort: function() { /*...*/ }, // SVG shape sorting callback
        meta: null, // Path to YAML file with meta / accessibility data
        align: null, // Path to YAML file with extended alignment data
        dest: '' // Output directory for optimized intermediate SVG shapes
    };

    svgSpriteConfigration['mode'] = {};

    // global mode settings
    modes.forEach( (currentMode) => {
        const filenameBase = `${spritePrefix}${spriteName}-${currentMode}${spriteSuffix}`;

        //prefix + ( config.svgsprite.name || 'svg-sprite' ) + '.css' + suffix;
        const selectorPrefix = filenameBase.replaceAll('\.', '-');

        svgSpriteConfigration['mode'][currentMode] = {
            dest: currentMode,
            prefix: `.${selectorPrefix}--%s`,
            dimensions: config.svgsprite.dimensions || '--dimensions',
            sprite: `${filenameBase}.svg`,
            bust: false,
            render: {},
            example: {
                dest: `${filenameBase}-example.html`
            }
        };

        // add example templates, if file exists
        let exampleTemplate = path.join( tmplPath, currentMode, spriteExample );
        log.info("exampleTemplate: " + exampleTemplate);

        if ( !fs.existsSync(exampleTemplate) ) {
            // otherwise add common example template, if file exists
            exampleTemplate = path.join( tmplCommonPath, spriteExample );
            log.info("exampleTemplate: " + exampleTemplate);

            if ( !fs.existsSync( exampleTemplate ) ) {
                log.info("Es existiert kein KBS spezifisches Example Template.");
                exampleTemplate = null;
            }
        }

        if ( typechecks.isNotEmpty(exampleTemplate) ) {
            svgSpriteConfigration['mode'][currentMode]['example']['template'] = exampleTemplate;
        }


        // specific properties
        switch ( currentMode ) {
            case 'css':
            case 'view':
                svgSpriteConfigration['mode'][currentMode]['layout'] = config.svgsprite.layout || 'horizontal'; //  {vertical|horizontal|diagonal|packed};
                svgSpriteConfigration['mode'][currentMode]['common'] = `${selectorPrefix}`;
                svgSpriteConfigration['mode'][currentMode]['mixin'] = `${selectorPrefix}`;
                break;

            case 'defs':
            case 'symbol':
                svgSpriteConfigration['mode'][currentMode]['inline'] = false;
                break;

            case 'stack':
                break;
        }

        // renderer Ausgaben
        renderer.forEach( (currentRenderer) => {
            let targetFile = `_${filenameBase}`;

            svgSpriteConfigration['mode'][currentMode]['render'][currentRenderer] = {
                dest: targetFile
            };

            // add renderer template, if file exists
            let rendererFile = `${spriteRendererPrefix}${currentRenderer}${spriteRendererSuffix}.${spriteRendererExtension}`;
            let rendererTemplate = path.join(tmplPath, currentMode, rendererFile);
            log.info("rendererTemplate: " + rendererTemplate);

            if ( !fs.existsSync(rendererTemplate) ) {

                // otherwise add common renderer template, if file exists
                rendererTemplate = path.join( tmplCommonPath, rendererFile );
                log.info("rendererTemplate (common): " + rendererTemplate);

                if ( !fs.existsSync( rendererTemplate ) ) {
                    log.info("Es existiert kein KBS spezifisches Example Template.");
                    rendererTemplate = null;
                }
            }

            if ( typechecks.isNotEmpty(rendererTemplate) ) {
                svgSpriteConfigration['mode'][currentMode]['render'][currentRenderer]['template'] = rendererTemplate;
            }
        });
    });

    return svgSpriteConfigration;
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
 * Task: generate-svg-sprites
 * runs: taskGenerateSvgSpriteSprites function
 */
gulp.task('generate-svgsprite-sprites', taskGenerateSvgSpriteSprites );

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
