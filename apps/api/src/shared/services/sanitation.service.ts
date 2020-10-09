const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);

export class SanitationService {
  static isPurified(data) {
    let isPurified = true;

    const check = obj => {
      if (typeof obj === 'string') {
        isPurified = (obj === DOMPurify.sanitize(obj));
      } else if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
          for (let i = 0, len = obj.length; i < len && isPurified; i++) {
            check(obj[i]);
          }
        } else {
          // tslint:disable-next-line:forin
          for (const prop in obj) {
            if (typeof obj[prop] === 'string') {
              isPurified = (obj[prop] === DOMPurify.sanitize(obj[prop]));
            } else if (typeof obj[prop] === 'object') {
              check(obj[prop]);
            }
            if (!isPurified) break;
          }
        }
      }
    };

    check(data);
    return isPurified;
  }
}
