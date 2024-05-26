import React, { useContext } from 'react';
import { NetworkUI } from './network';
import { AccountUI } from './account';
import { GasPriceUI } from './gasPrice';
import { ValueUI } from './value';
import { LocaleUI } from './locale';
// import { ThemeUI } from './theme';
import { FormattedMessage, useIntl } from 'react-intl';
import CopyToClipboard from '../CopyToClipboard';
import { shortenAddress } from '../UiHelper';
import { AppContext } from '../../contexts';

export function SettingsUI() {
  const intl = useIntl();
  const { appState } = useContext(AppContext);
  const { balance, name, address, verified } = appState.instance;

  return (
    <div className="px-4">
      <div className="p-2 w-auto d-flex justify-content-between align-items-center">
        <h1>Remix DApp</h1>
        <LocaleUI />
      </div>
      <div className="bg-light my-4 p-3">
        <NetworkUI />
        <div className="bg-transparent d-flex m-0 p-0 border-0 alert alert-secondary">
          <div
            className="input-grou w-100 flex-nowrap"
            style={{ display: 'contents' }}
          >
            <div className="w-100 input-group-prepend">
              <span
                className="input-group-text border-0 p-0 bg-transparent text-uppercase"
                style={{ fontSize: 11 }}
              >
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
        {/* <ThemeUI /> */}
      </div>
      {verified && (
        <a
          href={`https://remix.ethereum.org/address/${address}`}
          className="btn btn-primary mt-4"
          role="button"
          aria-disabled="true"
          target="_blank"
        >
          <FormattedMessage id="udapp.viewSourceCode" />
        </a>
      )}
    </div>
  );
}
