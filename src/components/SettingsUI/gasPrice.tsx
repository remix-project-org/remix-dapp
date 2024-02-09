import React from 'react';
import { CustomTooltip } from '../CustomTooltip';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export function GasPriceUI() {
  const dispatch = useAppDispatch();
  const handleGasLimit = (e: any) => {
    dispatch({ type: 'settings/save', payload: { gasLimit: e.target.value } });
  };

  const gasLimit = useAppSelector((state) => state.settings.gasLimit);

  return (
    <div className="udapp_crow">
      <label className="udapp_settingsLabel">
        <FormattedMessage id="udapp.gasLimit" />
      </label>
      <CustomTooltip
        placement={'top'}
        tooltipClasses="text-nowrap"
        tooltipId="remixGasPriceTooltip"
        tooltipText={<FormattedMessage id="udapp.tooltipText4" />}
      >
        <input
          type="number"
          className="form-control udapp_gasNval udapp_col2"
          id="gasLimit"
          value={gasLimit}
          onChange={handleGasLimit}
        />
      </CustomTooltip>
    </div>
  );
}
