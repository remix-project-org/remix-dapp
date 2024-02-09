import React, { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { BN } from 'bn.js';
import { CustomTooltip } from '../CustomTooltip';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

export function ValueUI() {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const inputValue = useRef<HTMLInputElement>({} as HTMLInputElement);

  const dispatch = useAppDispatch();
  const { sendValue, sendUnit } = useAppSelector((state) => state.settings);

  useEffect(() => {
    if (sendValue !== inputValue.current.value) {
      inputValue.current.value = sendValue;
    }
  }, [sendValue]);

  const validateValue = (e: { target: { value: any } }) => {
    const value = e.target.value;

    if (!value) {
      // assign 0 if given value is
      // - empty
      inputValue.current.value = '0';
      dispatch({ type: 'settings/save', payload: { sendValue: '0' } });
      return;
    }

    let v;
    try {
      v = new BN(value, 10);
      dispatch({
        type: 'settings/save',
        payload: { sendValue: v.toString(10) },
      });
    } catch (e) {
      // assign 0 if given value is
      // - not valid (for ex 4345-54)
      // - contains only '0's (for ex 0000) copy past or edit
      inputValue.current.value = '0';
      dispatch({ type: 'settings/save', payload: { sendValue: '0' } });
    }

    // @ts-expect-error
    if (v?.lt(0)) {
      inputValue.current.value = '0';
      dispatch({ type: 'settings/save', payload: { sendValue: '0' } });
    }
  };

  return (
    <div className="udapp_crow">
      <label className="udapp_settingsLabel" data-id="remixDRValueLabel">
        <FormattedMessage id="udapp.value" />
      </label>
      <div className="udapp_gasValueContainer">
        <CustomTooltip
          placement={'top-start'}
          tooltipClasses="text-nowrap"
          tooltipId="remixValueTooltip"
          tooltipText={<FormattedMessage id="udapp.tooltipText5" />}
        >
          <input
            ref={inputValue}
            type="number"
            min="0"
            pattern="^[0-9]"
            step="1"
            className="form-control udapp_gasNval udapp_col2"
            id="value"
            data-id="dandrValue"
            onChange={validateValue}
            value={sendValue}
          />
        </CustomTooltip>

        <select
          name="unit"
          value={sendUnit}
          className="form-control p-1 udapp_gasNvalUnit udapp_col2_2 custom-select"
          id="unit"
          onChange={(e: any) => {
            dispatch({
              type: 'settings/save',
              payload: {
                sendUnit: e.target.value,
              },
            });
          }}
        >
          <option data-unit="wei" value="wei">
            Wei
          </option>
          <option data-unit="gwei" value="gwei">
            Gwei
          </option>
          <option data-unit="finney" value="finney">
            Finney
          </option>
          <option data-unit="ether" value="ether">
            Ether
          </option>
        </select>
      </div>
    </div>
  );
}
