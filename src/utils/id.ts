import md5 from 'md5';
let id = 0;

export default function generateId () {
  return md5(id++).toString().replace(/\d/g, (num) => {
    return String.fromCharCode(parseInt(num, 10) + 65);
  });
}
