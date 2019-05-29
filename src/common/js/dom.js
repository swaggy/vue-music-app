// dom操作的通用代码
// 
// 
// 
// 添加class
function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 判断是否有这个class
function hasClass(el, className) {
  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)")
  return reg.test(el.className)
}

function getData(el, name, val) {
  const prefix = "data-"
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(name)
  }
}


// 能力检测
let elementStyle = document.createElement('div').style

let vendor = (() => {
  // 定义游览器前缀
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  // 遍历前缀，如果游览器支持的话，就返回对应 key
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  // 如果都不支持，那肯定是有问题的，返回 false
  return false
})()

function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  // 如果 vendor 为标准，就不改变 style
  if (vendor === 'standard') {
    return style
  }

  // 否则返回 vender(也就是 webkit Moz O ms 中的一个) + 样式首字母大写
  // 例如：webkit + transform ---> webkitTransform
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
export {
  addClass,
  hasClass,
  getData,
  prefixStyle
}