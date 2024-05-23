import React, { useContext } from 'react';
import { AppContext } from '../../contexts';

export function NetworkUI() {
  const { appState } = useContext(AppContext);
  const networkName = appState.settings.networkName;
  return (
    <div className="">
      <div></div>
      <div
        className="d-flex align-items-center position-relative w-100"
        data-id="settingsNetworkEnv"
      >
        <span className="badge badge-secondary">{networkName}</span>
      </div>
    </div>
  );
}
