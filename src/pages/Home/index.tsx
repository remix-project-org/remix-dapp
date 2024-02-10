import React, { useEffect } from 'react';
import { UniversalDappUI } from '../../components/UniversalDappUI';
import { SettingsUI } from '../../components/SettingsUI';
import RemixUiTerminal from '../../components/UiTerminal';
import DragBar from '../../components/DragBar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const height = useAppSelector((state) => state.terminal.height);
  useEffect(() => {
    dispatch({ type: 'settings/connect' });
    dispatch({ type: 'instance/init' });
  }, []);

  return (
    <div>
      <div
        className="row m-0"
        style={{ height: window.innerHeight - height - 5, overflowY: 'auto' }}
      >
        <div className="col-9 d-inline-block">
          <UniversalDappUI />
        </div>
        <div className="col-3 d-inline-block">
          <SettingsUI />
        </div>
      </div>
      <DragBar />
      <RemixUiTerminal />
    </div>
  );
};

export default HomePage;
