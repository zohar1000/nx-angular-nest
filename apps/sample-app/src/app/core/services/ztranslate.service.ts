// import { AppText } from '../../shared/consts/app-texts.const';

export const ztranslate = (value, params?) => {
  if (!params) return value;
  const keys = Object.keys(params);
  for (let i = 0, len = keys.length; i < len && value !== undefined; i++) {
    const key = keys[i];
    const regExp = new RegExp('{' + key + '}', 'g');
    value = value.replace(regExp, params[key]);
  }
  return value;
}

// old - path is a string like in transloco
/*export const ztranslate = (path, params?) => {
  let keys = path.split('.');
  let value: any = AppText;
  for (let i = 0, len = keys.length; i < len && value !== undefined; i++) {
    value = value[keys[i]];
  }
  if (value === undefined) {
    console.error('Error translating - invalid path, path:', path, ', params:', params);
    return '*** TRANSLATION ERROR ***';
  }
  if (!params) return value;
  keys = Object.keys(params);
  for (let i = 0, len = keys.length; i < len && value !== undefined; i++) {
    const key = keys[i];
    const regExp = new RegExp('\\{{' + key + '\\}}', 'g');
    value = value.replace(regExp, params[key]);
  }
  return value;
}*/
