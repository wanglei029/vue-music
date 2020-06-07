// 配置一些通用的参数 公共配置
export const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback' //为了和qq接口保持一致
}

export const ERR_OK = 0 //很多大公司都会把正确的值设置为0 为了语义化更强配置ERR_OK