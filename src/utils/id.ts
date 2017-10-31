import md5 from 'md5';
let id = 0;

export default function generateId () {// 可以传入前缀，与生成的随机数一起返回一个拼好的字符串
  return md5(id++).toString().replace(/\d/g, (num) => {
    return String.fromCharCode(parseInt(num, 10) + 65);
  });
}
