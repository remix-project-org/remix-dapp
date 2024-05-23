import React, { useContext, useEffect } from 'react';
import { UniversalDappUI } from '../../components/UniversalDappUI';
import { SettingsUI } from '../../components/SettingsUI';
import RemixUiTerminal from '../../components/UiTerminal';
import DragBar from '../../components/DragBar';
import { AppContext } from '../../contexts';
import { initInstance } from '../../actions';

const HomePage: React.FC = () => {
  const { appState } = useContext(AppContext);
  const height = appState.terminal.height;
  useEffect(() => {
    initInstance();
  }, []);

  return (
    <div>
      <div
        className="row m-0 pt-3"
        style={{ height: window.innerHeight - height - 5, overflowY: 'auto' }}
      >
        <div className="col-9 d-inline-block pr-0">
          <UniversalDappUI />
        </div>
        <div className="col-3 d-inline-block pl-0">
          <SettingsUI />
        </div>
      </div>
      <DragBar />
      <RemixUiTerminal />
    </div>
  );
};

export default HomePage;
