import React, { useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from '../CopyToClipboard';
import { AppContext } from '../../contexts';

export function AccountUI() {
  const intl = useIntl();
  const { appState, dispatch } = useContext(AppContext);
  const { selectedAccount, loadedAccounts, isRequesting } = appState.settings;
  const accounts = Object.keys(loadedAccounts);

  const setAccount = (account: string) => {
    dispatch({ type: 'SET_SETTINGS', payload: { selectedAccount: account } });
  };

  useEffect(() => {
    if (!selectedAccount && accounts.length > 0) setAccount(accounts[0]);
  }, [accounts, selectedAccount]);

  return (
    <div className="udapp_crow">
      <label className="udapp_settingsLabel">
        <FormattedMessage id="udapp.account" />
        {isRequesting && (
          <FontAwesomeIcon className="ml-2" icon={faSpinner} pulse />
        )}
      </label>
      <div className="udapp_account">
        <select
          id="txorigin"
          data-id="runTabSelectAccount"
          name="txorigin"
          className="form-control udapp_select custom-select pr-4"
          value={selectedAccount || ''}
          onChange={(e) => {
            setAccount(e.target.value);
          }}
        >
          {accounts.map((value, index) => (
            <option value={value} key={index}>
              {loadedAccounts[value]}
            </option>
          ))}
        </select>
        <div style={{ marginLeft: -5 }}>
          <CopyToClipboard
            tip={intl.formatMessage({ id: 'udapp.copyAccount' })}
            content={selectedAccount}
            direction="top"
          />
        </div>
      </div>
    </div>
  );
}
