import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface LWQuery extends DataQuery {
  queryText?: string;
  constant: number;
}

export const defaultQuery: Partial<LWQuery> = {
  constant: 6.5,
};

/**
 * These are options configured for each DataSource instance
 */
export interface LWDataSourceOptions extends DataSourceJsonData {
  uri?: string;
  apiKeyId?: string;
  apiSecret?: string;
  bearerToken?: string;
  bearerExpiry?: Date;
}
