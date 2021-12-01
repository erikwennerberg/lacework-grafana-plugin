import { getBackendSrv } from '@grafana/runtime';

import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';

import { LWQuery, LWDataSourceOptions } from './types';

export class DataSource extends DataSourceApi<LWQuery, LWDataSourceOptions> {
  uri: string;
  url: string;
  apiKeyId: string;
  apiSecret: string;

  constructor(instanceSettings: DataSourceInstanceSettings<LWDataSourceOptions>) {
    super(instanceSettings);
    this.url = instanceSettings.url === undefined ? '' : instanceSettings.url;
    this.uri = instanceSettings.jsonData.uri === undefined ? '' : instanceSettings.jsonData.uri;
    this.apiKeyId = instanceSettings.jsonData.apiKeyId === undefined ? '' : instanceSettings.jsonData.apiKeyId;
    this.apiSecret = instanceSettings.jsonData.apiSecret === undefined ? '' : instanceSettings.jsonData.apiSecret;
  }

  async query(options: DataQueryRequest<LWQuery>): Promise<DataQueryResponse> {
    const promises = options.targets.map(query =>
      this.doRequest(query, options).then(response => {
        const frame = new MutableDataFrame({
          refId: query.refId,
          meta: {
            preferredVisualisationType: 'logs',
          },
          fields: [
            { name: 'time', type: FieldType.time },
            { name: 'content', type: FieldType.string },
          ],
        });

        response.data.data.forEach((event: any) => {
          frame.add({ time: event.EVENT_TIME, content: event.EVENT, id: event.EVENT.eventID });
        });

        return frame;
      })
    );

    return Promise.all(promises).then(data => ({ data }));
  }

  async doRequest(query: LWQuery, options: DataQueryRequest<LWQuery>) {
    const token = await this.getBearerToken();
    const result = await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: this.url + '/__proxy' + '/api/v2/Queries/execute',
      data:
        '{"query":{"queryText":"' +
        query.queryText +
        '","evaluatorId": "Cloudtrail"},"arguments":[{"name": "StartTimeRange", "value": "' +
        options.range.from.toISOString() +
        '"},{"name": "EndTimeRange", "value": "' +
        options.range.to.toISOString() +
        '"}]}',
      headers: { Authorization: 'Bearer ' + token },
    });

    return result;
  }

  async testRequest() {
    const token = await this.getBearerToken();
    const result = await getBackendSrv().datasourceRequest({
      method: 'GET',
      url: this.url + '/__proxy' + '/api/v2/Queries',
      headers: { Authorization: 'Bearer ' + token },
    });

    return result;
  }

  async getBearerToken() {
    const token_result = await getBackendSrv().datasourceRequest({
      method: 'POST',
      url: this.url + '/__tokenproxy' + '/api/v2/access/tokens',
      data: '{"keyId": "' + this.apiKeyId + '","expiryTime": 3600}',
    });
    return token_result.data.token;
  }

  async testDatasource() {
    // Implement a health check for your data source.
    const errorMessageBase = 'Data source is not working';

    try {
      let result = await this.testRequest();

      if (result.status === 200) {
        return { status: 'success', message: 'Data source is working', title: 'Success' };
      }

      return {
        message: result.statusText ? result.statusText : errorMessageBase,
        status: 'error',
        title: 'Error',
      };
    } catch (err) {
      if (typeof err === 'string') {
        return {
          status: 'error',
          message: err,
        };
      } else {
        return {
          status: 'error',
          message: 'unknown error',
        };
      }
    }
  }
}
