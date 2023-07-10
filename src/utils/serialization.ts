/*
 * @Descripttion: 使json序列化支持Set,Map类型
 * @version: 
 * @Date: 2023-06-24 20:40:09
 * @LastEditTime: 2023-06-24 20:44:04
 */
const { stringify, parse } = JSON

JSON.stringify = function (value, replacer, space) {
  const _replacer =
    typeof replacer === 'function'
  		? replacer
  		: function (_, value) {
    		return value
  		  }
   replacer = function (key, value) {
    value = _replacer(key, value)
    if (value instanceof Set) value = `Set{${stringify([...value])}}`
    else if (value instanceof Map) value = `Map{${stringify([...value])}}`
    return value
  	}
  return stringify(value, replacer, space)
}

JSON.parse = function (value, reviver) {
  if (!reviver)
    reviver = function (key, value) {
      if (/Set\{\[.*\]\}/.test(value))
        value = new Set(parse(value.replace(/Set\{\[(.*)\]\}/, '[$1]')))
      else if (/Map\{\[.*\]\}/.test(value))
        value = new Map(parse(value.replace(/Map\{\[(.*)\]\}/, '[$1]')))
      return value
    }
  return parse(value, reviver)
}