
//获取层级树
import request from "./request";

export function getHierarchy() {
  return request({
    url: `/hierarchy`,
    method: 'get',
  })
}

export function getHierarchySeries() {
  return request({
    url: `/series`,
    method: 'get',
  })
}

export function getNodesByModel(model) {
  return request({
    url: `/hierarchy/group`,
    method: 'get',
    params: {
      model
    }
  })
}

export function getNodeDetail(instanceId) {
  return request({
    url: `/hierarchy/${instanceId}`,
    method: 'get',
  })
}

export function getNodeChildren(instanceId, model) {
  return request({
    url: `/hierarchy/${instanceId}/children`,
    method: 'get',
    params: {
      model
    }
  })
}

export function getNodeParents(instanceId, model) {
  return request({
    url: `/hierarchy/${instanceId}/parent`,
    method: 'get',
    params: {
      model
    }
  })
}

export function getStaticAttributeValues(instanceId, names = [], labels = []) {
  return request({
    url: `/hierarchy/${instanceId}/attributes`,
    method: 'POST',
    data: {
      attributeNames: names,
      labelSelectors: labels
    }
  })
}

export function getMultipleAttributeValues (instanceIds, names = [], labels = []) {
  return request({
    url: `/hierarchy/attributes`,
    method: 'POST',
    data: {
      instanceIds,
      attributeNames: names,
      labelSelectors: labels
    }
  })
}

export function getSeriesHistoryValues (instanceId, names = [], params = {}) {
  return request({
    url: `/hierarchy/${instanceId}/series`,
    method: 'POST',
    data: Object.assign({
      seriesNames: names,
      order: 'ASC'
    }, params)
  })
}

export function getSeriesLatestValues (instanceId, names = [], aggregation, method, before) {
  return request({
    url: `/hierarchy/${instanceId}/series/latest`,
    method: 'POST',
    data: {
      seriesNames: names,
      aggregation,
      method,
      before
    }
  })
}

export function getMultipleSeriesHistoryValues (instanceIds, names = [], params = {}) {
  return request({
    url: `/hierarchy/series`,
    method: 'POST',
    data: Object.assign({
      instanceIds,
      seriesNames: names,
      order: 'ASC'
    }, params)
  })
}

export function getMultipleSeriesLatestValues (instanceIds, names = [], aggregation, method, before) {
  return request({
    url: `/hierarchy/series/latest`,
    method: 'POST',
    data: {
      instanceIds,
      seriesNames: names,
      aggregation,
      method,
      before
    }
  })
}

export function getDataTables(instanceId) {
  return request({
    url: `/hierarchy/tables/${instanceId}`,
    method: 'GET'
  })
}

export function getTableRecords (tableId, filters) {
  return request({
      url: `/hierarchy/tables/${tableId}/records`,
      method: 'POST',
      data: {filters}
    })
}

export function getPIDList(instanceId) {
  return request({
    url: `/hierarchy/${instanceId}/pid`,
    method: 'get',
  })
}

/**
 * 13.9接口
 * @param instanceId
 * @param pidId
 * @returns {AxiosPromise}
 */
export function getPID(instanceId, pidId) {
  return request({
    url: `/hierarchy/${instanceId}/pid/${pidId}`,
    method: 'get',
  })
}
