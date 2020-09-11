const mkdirRecursive = require('mkdir-recursive');
const del = require('del');
const base64Img = require('base64-img');
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';

export class FileService {
  private readonly promisifiedStat = promisify(fs.stat);
  private readonly promisifiedReadFile = promisify(fs.readFile);
  private readonly promisifiedWriteFile = promisify(fs.writeFile);
  private readonly promisifiedTruncate = promisify(fs.truncate);
  private readonly promisifiedOpen = promisify(fs.open);
  private readonly promisifiedReaddir = promisify(fs.readdir);
  private readonly promisifiedUnlink = promisify(fs.unlink); // delete
  private readonly promisifiedClose = promisify(fs.close);
  private readonly promisifiedMkdir = promisify(fs.mkdir);

  async getStats(resourcePath) {   // resourcePath - file or folder path
    let stats;
    try {
      stats = await this.promisifiedStat(resourcePath);
    } catch (e) {
    }
    return stats;
  }

  async isExist(resourcePath) {   // resourcePath - file or folder path
    let result = false;
    try {
      await this.promisifiedStat(resourcePath);
      result = true;
    } catch (e) {
    }
    return result;
  }

  createFile(filePath) {
    return this.promisifiedOpen(filePath, 'w+');
  }

  createFolder(folderPath) {
    return this.promisifiedMkdir(folderPath); // , 'w+');
  }

  readFile(filePath, opts = 'utf8') {
    return this.promisifiedReadFile(filePath, opts);
  }

  async readJsonFile(filePath, opts = 'utf8') {
    const fileText = await this.promisifiedReadFile(filePath, opts);
    return JSON.parse(fileText);
  }

  async writeImage(filePath, data, opts = {}) {
    return this.writeFile(filePath, data, Object.assign({ encoding: 'binary' }, opts));
  }

  async writeBase64Image(folder, fileName, base64) {
    return new Promise(async (resolve, reject) => {
      try {
        base64Img.img(base64, folder, fileName, (err, response) => {
          if (err) throw(err);
          response = response.replace(/\\/g, '/');
          const ix = response.lastIndexOf('/');
          response = response.substr(ix + 1);
          resolve(response);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  // for one-time write better to use createAndCloseFile b/c of open descriptors during long process
  async writeFile(filePath, data, opts: any = {}) {
    return await this.writeToFile(filePath, data, opts);
  }

  async writeOnceJson(filePath, data, opts: any = {}) {
    return await this.createAndCloseFile(filePath, JSON.stringify(data), opts.encoding);
  }

  async appendFile(filePath, data, opts: any = {}) {
    opts.isAppend = true;
    return await this.writeToFile(filePath, data, opts);
  }

  private async writeToFile(filePath, data, opts: any) {
    if (!opts.hasOwnProperty('isVerify') || opts.isVerify) {
      delete opts.isVerify;
      await this.verifyFile(filePath);
    }

    if (!opts.isAppend && os.platform() === 'win32') {
      try {
        await this.truncateFile(path);
      } catch (e) {
      }
    }

    const flag = (opts.isAppend ? 'a+' : 'r+');
    delete opts.isAppend;
    return this.promisifiedWriteFile(filePath, data, Object.assign({ mode: 0x777, flag }, opts));
  }

  async createAndCloseFile(filePath, data, encoding: BufferEncoding = 'utf8') {
    // closing now b/c the os closes created files only on process exit, so many fds open until then
    return new Promise(async(resolve, reject) => {
      let fd = 0;
      try {
        fd = await this.createFile(path);
        const flag = (os.platform() === 'win32' ? 'r+' : 'w+');
        await this.promisifiedWriteFile(filePath, data, { mode: 0x777, flag, encoding });
        await this.promisifiedClose(fd);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  // async appendFile2(path, data) {
  //   return this.promisifiedWriteFile(path, data, { mode: 0x777, flag: 'a+' });
  // }

  truncateFile(filePath) {
    return this.promisifiedTruncate(filePath, 0);
  }

  closeFile(fd) {
    return this.promisifiedClose(fd);
  }

  async verifyFolder(folderPath) {
    return new Promise(async(resolve, reject) => {
      try {
        mkdirRecursive.mkdir(folderPath, err => {
          if (err && err.code !== 'EEXIST') {
            reject(err);
          } else {
            resolve();
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  }

  async verifyFile(filePath) {
    try {
      const isExist = await this.isExist(filePath);
      if (!isExist) {
        await this.createFile(filePath);
      }
    } catch (e) {}
  }

  async getFolderFileDetails(folderPath) {
    return new Promise<any[]>(async(resolve, reject) => {
      try {
        const fileNames = await this.promisifiedReaddir(folderPath);
        const promises = await fileNames.map(async(fileName) => {
          const stat = await this.promisifiedStat(path.join(folderPath, fileName));
          /*
          if (fileName === 'shell32.dll') {
            console.log('stat:', stat);
            console.log('typeof atime:', typeof stat.atime, JSON.stringify(stat.atime, null, 2));
            const a = stat.atime;
            const b = Date.parse(stat.atime as any);
            console.log('typeof a:', typeof a);
            console.log('typeof b:', typeof b, b);
            // console.log('typeof a:', typeof a);
          }
          */

// if (fileName === 'shell32.dll') console.log('instance of Date:', stat.mtime instanceof Date);
// if (fileName === 'shell32.dll') console.log('instance of iso:', stat.mtime instanceof Iso);
          return { fileName, isFile: stat.isFile(), createdMs: stat.birthtimeMs, size: stat.size, mtime: stat.mtime };
        });
        const entries = await Promise.all(promises);
        resolve(entries);
      } catch (e) {
        reject(e);
      }
    });
  }

  async deleteFile(filePath) {
    const isExist = await this.isExist(path);
    if (isExist) return this.promisifiedUnlink(filePath);
    return Promise.resolve(false);
  }

  async removeFolder(folderPath, opts: any = {}) {
    return new Promise(async(resolve, reject) => {
      try {
        await del([folderPath], { force: true });
        resolve();
      } catch(e) {
        if (opts.isIgnoreErrors) {
          resolve();
        } else {
          reject(e);
        }
      }
    });
  }

  async getFileSize(filePath) {
    let size = 0;
    try {
      const stats = await this.promisifiedStat(filePath);
      if (stats) size = stats['size'];
    } catch(e) {
      size = -1;
    }
    return size;
  }

  getFileFolder(filePath, opts: any = {}) {
    const ix1 = filePath.lastIndexOf('/');
    const ix2 = filePath.lastIndexOf('\\');
    let folderPath = (ix1 === -1 && ix2 === -1 ? '' : filePath.substring(0, Math.max(ix1, ix2)));
    if (opts.isAppendSep) {
      const sep = ix1 > ix2 ? '/' : '\\';
      folderPath += sep;
    }
    return folderPath;
  }

  copyFile(from, to) {
    return new Promise(async (resolve, reject) => {
      try {
        fs.copyFile(from, to, err => {
          if (err) reject(err);
          resolve();
        });
      } catch(e) {
        reject(e);
      }
    });
  }
}

// export const fileService = new FileService();
