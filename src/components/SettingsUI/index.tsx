import React, { useContext } from 'react';
import { NetworkUI } from './network';
import { AccountUI } from './account';
import { GasPriceUI } from './gasPrice';
import { ValueUI } from './value';
import { LocaleUI } from './locale';
import { ThemeUI } from './theme';
import { FormattedMessage, useIntl } from 'react-intl';
import CopyToClipboard from '../CopyToClipboard';
import { shortenAddress } from '../UiHelper';
import { AppContext } from '../../contexts';

export function SettingsUI() {
  const intl = useIntl();
  const { appState } = useContext(AppContext);
  const { balance, name, address, shareTo } = appState.instance;
  const getBoxPositionOnWindowCenter = (width: number, height: number) => ({
    left:
      window.outerWidth / 2 +
      (window.screenX || window.screenLeft || 0) -
      width / 2,
    top:
      window.outerHeight / 2 +
      (window.screenY || window.screenTop || 0) -
      height / 2,
  });
  let windowConfig: any = {
    width: 600,
    height: 400,
  };
  windowConfig = Object.assign(
    windowConfig,
    getBoxPositionOnWindowCenter(windowConfig.width, windowConfig.height)
  );
  const shareUrl = encodeURIComponent(window.origin);
  const shareTitle = encodeURIComponent('Hello everyone, this is my dapp!');
  return (
    <div className="udapp_settings">
      {shareTo && (
        <>
          {shareTo.includes('twitter') && (
            <i
              className="fab fa-twitter btn"
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
                  '',
                  Object.keys(windowConfig)
                    .map((key) => `${key}=${windowConfig[key]}`)
                    .join(', ')
                );
              }}
            />
          )}
          {shareTo.includes('facebook') && (
            <i
              className="fab fa-facebook btn"
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                  '',
                  Object.keys(windowConfig)
                    .map((key) => `${key}=${windowConfig[key]}`)
                    .join(', ')
                );
              }}
            />
          )}
        </>
      )}
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
      <LocaleUI />
      <ThemeUI />
    </div>
  );
}
