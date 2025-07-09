
export function validate(user, request = {}, superOnly, signInRequired) {
  if (superOnly) {
    return user && user.isSuper
  }
  else if (request.action) {
    return user && ( user.isSuper || user.role.privileges.filter(privilege => privilege.action.name === request.action && privilege.resource.name === request.resources).length !== 0 )
  }
  else if (request.resources) {
    return user && ( user.isSuper || user.role.privileges.filter(privilege => privilege.resource.name === request.resources).length !== 0 )
  }
  else if (signInRequired) {
    return user
  }
  else {
    return true
  }
}

export let MonthMap = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ]

export function formatValue(value, series) {
  if (!value || value === 0) return '-'
  if (!series) return value
  if (series.dataType === 'Decimal' && series.precision >= 0) {
    return parseFloat(parseFloat(value).toFixed(series.precision))
  }
  else if (series.dataType === 'Integer') {
    return parseInt(value)
  }
  else if (series.dataType === 'Date') {
    return new Date(value).format('dd/MM/yyyy')
  }
  return value
}

// 通用的保存文件的方法
export function downloadFile(name, blob) {
  const d = document.createElement("a")
  d.href = window.URL.createObjectURL(blob)
  d.download = name
  d.style.display = "none"
  document.body.appendChild(d)
  d.click()
  document.body.removeChild(d)
  window.URL.revokeObjectURL(d.href)
}
