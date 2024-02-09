import React from 'react';
import { NetworkUI } from './network';
import { AccountUI } from './account';
import { GasPriceUI } from './gasPrice';
import { ValueUI } from './value';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAppSelector } from '../../redux/hooks';
import CopyToClipboard from '../CopyToClipboard';
import { shortenAddress } from '../UiHelper';

export function SettingsUI() {
  const intl = useIntl();
  const { balance, name, address } = useAppSelector((state) => state.instance);
  return (
    <div className="udapp_settings">
      <NetworkUI />
      <div className="udapp_title pb-0 alert alert-secondary">
        <div className="input-group udapp_nameNbuts">
          <div className="udapp_titleText input-group-prepend">
            <span className="input-group-text udapp_spanTitleText">
              {name} at {shortenAddress(address)}
            </span>
          </div>
          <div className="btn">
            <CopyToClipboard
              tip={intl.formatMessage({ id: 'udapp.copy' })}
              content={address}
              direction={'top'}
            />
          </div>
        </div>
      </div>
      <div className="d-flex" data-id="instanceContractBal">
        <label>
          <FormattedMessage id="udapp.balance" />: {balance} ETH
        </label>
      </div>
      <AccountUI />
      <GasPriceUI />
      <ValueUI />
    </div>
  );
}
