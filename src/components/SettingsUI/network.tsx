import React, { useContext } from 'react';
import { AppContext } from '../../contexts';

export function NetworkUI() {
  const { appState } = useContext(AppContext);
  const networkName = appState.settings.networkName;
  return (
    <div className="">
      <div className="udapp_settingsLabel"></div>
      <div className="udapp_environment" data-id="settingsNetworkEnv">
        <span className="udapp_network badge badge-secondary">
          {networkName}
        </span>
      </div>
    </div>
  );
}
