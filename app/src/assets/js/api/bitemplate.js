import request from "./request";
//获取所有模板信息
export function getAllTemplate(params) {
  return request({
    url: `/dashboard/template`,
    method: 'GET',
    params
  })
}
//获取某个模板的详情
export function getTemplate(templateId) {
  return request({
    url: `/dashboard/template/${templateId}`,
    method: 'GET',
  })
}
//添加新模板
export function addNewTemplate(data) {
  return request({
    url: `/dashboard/template`,
    method: 'POST',
    data
  })
}
//更新模板信息
export function updateTemplate(templateId,data) {
  return request({
    url: `/dashboard/template/${templateId}`,
    method: 'PUT',
    data
  })
}
//删除模板信息
export function delTemplate(templateId){
  return request({
    url: `/dashboard/template/${templateId}`,
    method: 'DELETE'
  })
}
//添加模板分组
export function addTemplateGroup(data) {
  return request({
    url: `/dashboard_group`,
    method: 'POST',
    data:Object.assign(data,{dashboardType: "Template"})
  })
}
//修改模板分组
export function updateTemplateGroup(groupId,data) {
  return request({
    url: `/dashboard_group/${groupId}`,
    method: 'PUT',
    data:Object.assign(data,{dashboardType: "Template"})
  })
}
//删除分组
export function deleteTemplateGroup(groupId) {
  return request({
    url: `/dashboard_group/${groupId}`,
    method: 'DELETE',
  })
}
