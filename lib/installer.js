'use babel';
/* @flow */

import path from 'path';
import fs from 'fs';
import log4js from 'log4js';
import semver from 'semver';
import shell from 'shelljs'

const logger = log4js.getLogger('installer');
logger.setLevel('INFO');

function installPackage(pkgName: string): Promise<boolean> {
  return new Promise(resolve => {
    logger.info(`Installing ${pkgName}...`);
    shell.exec(`${atom.packages.getApmPath()} install --production ${pkgName}`, function(code, output) {
      if (code === 0) {
        atom.notifications.addSuccess(`Successfully installed/upgraded ${pkgName}.`, {
          detail: 'You will need to restart Atom for love-ide to take advantage of this packages.'
        });
        resolve(true);
      } else {
        atom.notifications.addFatalError(`Failed to install/upgrade ${pkgName}. You may need to do it manually.`, {
          detail: output
        });
        resove(false);
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
