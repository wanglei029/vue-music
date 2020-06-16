function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
/* 洗牌函数 */
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
/* 实现节流 
  参数接受 一个函数 时间
  返回一个函数
  函数柯里化
  原理：对某一个函数做节流就会返回一个新的函数
  新的函数就会延迟去执行我们要节流的函数
  
  例如：我们在200毫秒之内多次调用debounce函数
  第一次调用会创建定时器 timer
  第二次调用 会先判断是否存在timer 如果存在则清楚计时器timer 重新开始计时
  这样就达到短时间内多次调用debounce但只会执行一次传入的参数函数 func 的目的
*/
export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}