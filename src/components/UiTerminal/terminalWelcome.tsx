import React from 'react';
import { FormattedMessage } from 'react-intl';
import * as packageJson from '../../../package.json';

const TerminalWelcomeMessage = () => {
  return (
    <div className="remix_ui_terminal_block px-4 " data-id="block_null">
      <div className="remix_ui_terminal_welcome">
        {' '}
        <FormattedMessage id="terminal.welcomeText1" /> Remix{' '}
        {packageJson.version}{' '}
      </div>
    </div>
  );
};

export default TerminalWelcomeMessage;
