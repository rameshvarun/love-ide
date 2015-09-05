'use babel';
/* @flow */

import path from 'path';
import fs from 'fs';
import log4js from 'log4js';
import semver from 'semver';
import child_process from 'child_process';

const logger = log4js.getLogger('installer');
logger.setLevel('INFO');

/**
 * Helper function to install a package using APM.
 */
function installPackage(pkgName: string): Promise<boolean> {
  return new Promise(resolve => {
    logger.info(`Installing ${pkgName}...`);

    var command = `${atom.packages.getApmPath()} install --production ${pkgName}`;
    child_process.exec(command, (err, stdout, stderr) => {
      if (err) {
        // Error while installing package. Return false.
        atom.notifications.addFatalError(`Failed to install/upgrade ${pkgName}. You may need to do it manually.`, {
          detail: stderr
        });
        resolve(false);
      } else {
        // Successfully installed package. Return true.
        atom.notifications.addSuccess(`Successfully installed/upgraded ${pkgName}.`, {
          detail: 'You will need to restart Atom for love-ide to take advantage of this packages.'
        });
        resolve(true);
      }
    });
  });
}

export default async function install() {
  logger.trace('Checking if there are packages that need to be installed.');

  var packageMetadata = atom.packages.getAvailablePackageMetadata();

  var packageInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));
  var dependencies = packageInfo['package-dependencies'];
  for (var [pkgName, version] of dependencies) {
    logger.trace(`Checking if package '${pkgName}' needs to be installed.`);

    var [installedPkg] = packageMetadata.filter(metadata => metadata.name == pkgName);
    if (installedPkg) {
      logger.trace(`${pkgName} is already installed.`);
      logger.trace(`Installed version is ${installedPkg.version}, we want ${version}.`)
      if (semver.gt(version, installedPkg.version)) {
        await installPackage(pkgName);
      }
    } else {
      logger.trace(`${pkgName} is not installed.`);
      await installPackage(pkgName);
    }
  }
}
