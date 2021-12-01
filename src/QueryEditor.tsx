import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { DataSource } from './datasource';
import { defaultQuery, LWDataSourceOptions, LWQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<DataSource, LWQuery, LWDataSourceOptions>;

export class QueryEditor extends PureComponent<Props> {
  onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryText: event.target.value });
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { queryText } = query;

    return (
      <div className="gf-form">
        <FormField
          labelWidth={8}
          inputWidth={30}
          value={queryText || ''}
          onChange={this.onQueryTextChange}
          label="LQL Query"
          tooltip="Not used yet"
        />
      </div>
    );
  }
}
