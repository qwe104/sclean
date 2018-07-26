const glob = require('glob');

const argv = require('../data/argv');
const pathInfo = require('../data/path_info');
const logger = require('../util/logger');
const sequenceSuffix = require('../util/sequence_suffix');
const share = require('../share/restore');
const projectConfig = require('../project_config');

/**
 * Find all existing packages, from old to new.
 *
 * @type {*|{define}}
 */
share.packages = glob.sync(`${projectConfig.target}-*.zip`);

if (!share.packages || !share.packages.length) {
  logger.error(`
  No archive packages in current directory.
  `);
  process.exit(1);
}

const index = parseInt(argv.i, 10) || parseInt(argv.index, 10) || 0;

// Index is greater than total length.
if (index > share.packages.length) {
  logger.error(`
  Index "${index}" is greater than packages' length "${share.packages.length}".
  `);
  process.exit(1);
}

share.index = index || 1;

const processArgv = process.argv;
// Modify `process.argv` for `gulp-cli`.
process.argv = [processArgv[0], processArgv[1], 'restore', '--gulpfile', pathInfo.gulpFile];

require('gulp-cli')(err => {
  if (err) {
    logger.error(err.stack || err);
  } else {
    logger.success(`
  Restore '${projectConfig.target}' directory to last ${share.index}${sequenceSuffix(
      share.index
    )} archive state successfully, 
  with filename of '${share.restoreZip}'.
    `);
  }
});
