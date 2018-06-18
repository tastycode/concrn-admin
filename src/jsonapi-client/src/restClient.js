import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE
} from "./types";

import { jsonApiHttpClient, queryParameters } from "./fetch";

export const mapSingleRecord = (allData, singleRecord) => {
  let result = {
    id: singleRecord.id,
    ...singleRecord.attributes
  }
  if (singleRecord.relationships) {
    Object.keys(singleRecord.relationships).forEach(function(key) {
      const resolvedRelationship = resolveRelationship(allData, singleRecord.relationships[key])
      if (resolvedRelationship) {
        result[key] = resolvedRelationship
      }
      const relationshipData = singleRecord.relationships[key].data
      if (relationshipData) {
        const keyString = key + "_id";
        result[keyString] = relationshipData.id;
      }
    })
  }
  return result
}

export const resolveRelationship = (allData, relationship) => {
  if (!relationship.data) {
    // for some reason, the JSON  being passed through here is different than the JSON returned from the server.
    // instead of relationship = { data: { type: 'users', id: 1 }}, we are seeing the user record itself in the relationship hash
    // if that's the case, just assume the relationship as resolved since we don't have the type or ID to find it in `included` anyway
    return relationship
  }

  const allDataIncluded = allData.included || []
  const foundRelationship = allDataIncluded.find( includedRecord => {
    try {

      return includedRecord.type === relationship.data.type &&
        includedRecord.id === relationship.data.id
    } catch (e) {
      debugger
    }
  })
  if (!foundRelationship) {
    return
  }
  for (let relationshipKey of Object.keys(foundRelationship.relationships || [])) {
    let subRelationship = foundRelationship.relationships[relationshipKey]
    const resolvedSubRelationship = resolveRelationship(allData, subRelationship)
    if (resolvedSubRelationship) {
      foundRelationship.relationships[relationshipKey] = resolvedSubRelationship
    }
  }
  return {
    id: foundRelationship.id,
    ...foundRelationship.attributes,
    ...foundRelationship.relationships
  }
}

export default (apiUrl, httpClient = jsonApiHttpClient) => {
  /**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
  const convertRESTRequestToHTTP = (type, resource, params) => {
    let url = "";
    const options = {};
    switch (type) {
      case GET_MANY_REFERENCE:
      case GET_LIST:
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const { name, value } = params.filter;
        var query = {
          "page[size]": perPage,
          "page[number]": page
        };
        Object.keys(params.filter).forEach(key => {
          var filterField = "filter[" + key + "]";
          query[filterField] = params.filter[key];
        });
        if (type === "GET_MANY_REFERENCE") {
          const targetFilter = "filter[" + params.target + "]";
          query[targetFilter] = params.id;
        }
        if (order === "ASC") {
          query.sort = field;
        } else {
          query.sort = "-" + field;
        }
        url = `${apiUrl}/${resource}?${queryParameters(query)}`;
        break;
      case GET_ONE:
        url = `${apiUrl}/${resource}/${params.id}`;
        break;
      case GET_MANY:
        const query = { "filter[id]": params.ids.toString() };
        url = `${apiUrl}/${resource}?${queryParameters(query)}`;
        break;
      case UPDATE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = "PATCH";
        var attrs = {};
        Object.keys(params.data).forEach(
          key => (attrs[key] = params.data[key])
        );
        const updateParams = {
          data: { type: resource, id: params.id, attributes: attrs }
        };
        options.body = JSON.stringify(updateParams);
        break;
      case CREATE:
        url = `${apiUrl}/${resource}`;
        options.method = "POST";
        const createParams = {
          data: { type: resource, attributes: params.data }
        };
        options.body = JSON.stringify(createParams);
        break;
      case DELETE:
        url = `${apiUrl}/${resource}/${params.id}`;
        options.method = "DELETE";
        break;
      default:
        throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
  };

  /**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The REST request params, depending on the type
   * @returns {Object} REST response
   */
  const convertHTTPResponseToREST = (response, type, resource, params) => {
    const { headers, json } = response;
    console.log('convertHTTPResponseToREST', type)
    switch (type) {
      case GET_MANY_REFERENCE:
      case GET_LIST:
        var jsonData = json.data.map(function(dic) {
          var interDic = Object.assign(
            { id: dic.id },
            dic.attributes,
            dic.meta
          );
          if (dic.relationships) {
            Object.keys(dic.relationships).forEach(function(key) {
              var keyString = key + "_id";
              if (dic.relationships[key].data) {
                //if relationships have a data field --> assume id in data field
                const resolvedRelationship = resolveRelationship(json, dic.relationships[key])
                if (resolvedRelationship) {
                  interDic[key] = resolvedRelationship
                } else {
                  interDic[keyString] = dic.relationships[key].data.id;
                }
              } else if (dic.relationships[key].links) {
                //if relationships have a link field
                var link = dic.relationships[key].links["self"];
                httpClient(link).then(function(response) {
                  interDic[key] = {
                    data: response.json.data,
                    count: response.json.data.length
                  };
                  interDic["count"] = response.json.data.length;
                });
              }
            });
          }
          return interDic;
        });
        return { data: jsonData, total: json.meta["total"] };
      case GET_MANY:
        jsonData = json.data.map(function(obj) {
          return Object.assign({ id: obj.id }, obj.attributes);
        });
        return { data: jsonData };
      case GET_ONE:
      case UPDATE:
      case CREATE:
        return {
          data: mapSingleRecord(json, json.data)
        };
      case DELETE:
        return { data: {} };
      default:
        return { data: json.data };
    }
  };

  /**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for a REST response
   */
  return (type, resource, params) => {
    console.info('restClient:request', type, resource, params);
    const { url, options } = convertRESTRequestToHTTP(type, resource, params);
    return httpClient(url, options).then(response =>
      convertHTTPResponseToREST(response, type, resource, params)
    ).catch(error => {
      console.warn('restClient:catch', error)
      if (error.body && error.body.errors) {
        const errorMessage = error.body.errors.map( error => error.detail ).join(',')
        throw errorMessage
      } else{
        throw error
      }

    })
  };
};
