import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { LWDataSourceOptions } from './types';

const { FormField } = LegacyForms;

interface Props extends DataSourcePluginOptionsEditorProps<LWDataSourceOptions> {}

interface State {}

export class ConfigEditor extends PureComponent<Props, State> {
  onUriChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      uri: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  // Secure field (only sent to the backend)
  onAPIKeyIdChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      apiKeyId: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  onAPISecretChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onOptionsChange, options } = this.props;
    const jsonData = {
      ...options.jsonData,
      apiSecret: event.target.value,
    };
    onOptionsChange({ ...options, jsonData });
  };

  render() {
    const { options } = this.props;
    const { jsonData } = options;

    return (
      <div className="gf-form-group">
        <div className="gf-form">
          <FormField
            label="Account URL"
            labelWidth={8}
            inputWidth={20}
            onChange={this.onUriChange}
            value={jsonData.uri || ''}
            placeholder="Your Lacework account URL"
          />
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <FormField
              value={jsonData.apiKeyId || ''}
              label="API Key ID"
              placeholder="Your API Key Id"
              labelWidth={8}
              inputWidth={20}
              onChange={this.onAPIKeyIdChange}
            />
          </div>
        </div>

        <div className="gf-form-inline">
          <div className="gf-form">
            <FormField
              value={jsonData.apiSecret || ''}
              label="API Secret"
              placeholder="Your Secret"
              labelWidth={8}
              inputWidth={20}
              onChange={this.onAPISecretChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
