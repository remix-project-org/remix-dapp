import React, { useContext, useEffect, useState } from 'react';
import { UniversalDappUI } from '../../components/UniversalDappUI';
import { SettingsUI } from '../../components/SettingsUI';
import RemixUiTerminal from '../../components/UiTerminal';
import DragBar from '../../components/DragBar';
import DappTop from '../../components/DappTop';
import { AppContext } from '../../contexts';
import { initInstance } from '../../actions';
import { isMobile } from '../../utils/tools';
import TxList from '../../components/UiTerminal/TxList';

const HomePage: React.FC = () => {
  const {
    appState: { terminal },
  } = useContext(AppContext);
  const [active, setActive] = useState('functions');
  const { height } = terminal;
  useEffect(() => {
    initInstance();
  }, []);

  return isMobile() ? (
    <div>
      <div
        className={`${
          active === 'functions' ? '' : 'd-none'
        } col-xl-9 col-lg-8 col-md-7 pr-0`}
      >
        <DappTop />
        <UniversalDappUI />
      </div>
      <div className={`${active === 'transactions' ? '' : 'd-none'}`}>
        <TxList />
      </div>
      <div
        className={`${
          active === 'settings' ? '' : 'd-none'
        } col-xl-3 col-lg-4 col-md-5 pl-0`}
      >
        <SettingsUI />
      </div>
      <ul className="nav justify-content-center fixed-bottom row bg-light">
        <li
          className="nav-item col text-center p-2"
          onClick={() => {
            setActive('functions');
          }}
        >
          Functions
        </li>
        <li
          className="nav-item col text-center p-2"
          onClick={() => {
            setActive('transactions');
          }}
        >
          Transactions
        </li>
        <li
          className="nav-item col text-center p-2"
          onClick={() => {
            setActive('settings');
          }}
        >
          Settings
        </li>
      </ul>
    </div>
  ) : (
    <div>
      <div
        className="row m-0 pt-3"
        style={{ height: window.innerHeight - height - 5, overflowY: 'auto' }}
      >
        <div className="col-xl-9 col-lg-8 col-md-7 d-inline-block pr-0">
          <DappTop />
          <UniversalDappUI />
        </div>
        <div className="col-xl-3 col-lg-4 col-md-5 d-inline-block pl-0">
          <SettingsUI />
        </div>
      </div>
      <DragBar />
      <RemixUiTerminal />
    </div>
  );
};

export default HomePage;
