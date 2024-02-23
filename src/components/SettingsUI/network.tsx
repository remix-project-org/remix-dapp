import React from 'react';
import { useAppSelector } from '../../redux/hooks';

export function NetworkUI() {
  const networkName = useAppSelector((state) => state.instance.network);
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
