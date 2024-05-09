import React, { useState, useEffect, useRef, type SyntheticEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { CommentCount, DiscussionEmbed } from 'disqus-react';
import { CustomTooltip } from '../CustomTooltip';
import RenderCall from './RenderCall';
import RenderKnownTransactions from './RenderKnownTransactions';
import parse from 'html-react-parser';

import { KNOWN_TRANSACTION } from './types';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import './index.css';

export interface ClipboardEvent<T = Element> extends SyntheticEvent<T, any> {
  clipboardData: DataTransfer;
}

export const RemixUiTerminal = (props: any) => {
  const dispatch = useAppDispatch();
  const { journalBlocks, height, hidden } = useAppSelector(
    (state) => state.terminal
  );
  const { shortname } = useAppSelector((state) => state.instance);

  const [showTableHash, setShowTableHash] = useState<any[]>([]);
  const [display, setDisplay] = useState('transaction');

  const messagesEndRef = useRef<any>(null);
  const typeWriterIndexes = useRef<any>([]);

  // terminal dragable
  const panelRef = useRef(null);
  const terminalMenu = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [journalBlocks.length]);

  const handleClearConsole = () => {
    typeWriterIndexes.current = [];
    dispatch({ type: 'terminal/save', payload: { journalBlocks: [] } });
  };
  /* start of autoComplete */

  const txDetails = (event: any, tx: any) => {
    if (showTableHash.includes(tx.hash)) {
      const index = showTableHash.indexOf(tx.hash);
      if (index > -1) {
        setShowTableHash((prevState) => prevState.filter((x) => x !== tx.hash));
      }
    } else {
      setShowTableHash((prevState) => [...prevState, tx.hash]);
    }
    scrollToBottom();
  };

  const handleToggleTerminal = () => {
    dispatch({
      type: 'terminal/save',
      payload: { hidden: !hidden, height: hidden ? 250 : 35 },
    });
  };

  const classNameBlock = 'remix_ui_terminal_block px-4 py-1 text-break';

  return (
    <div className="terminal-wrap fixed-bottom" style={{ height }}>
      <div
        id="terminal-view"
        className="panel"
        data-id="terminalContainer-view"
      >
        <div
          style={{ flexGrow: 1 }}
          className="remix_ui_terminal_panel"
          ref={panelRef}
        >
          <div className="remix_ui_terminal_bar d-flex">
            <div
              className="remix_ui_terminal_menu d-flex w-100 align-items-center position-relative border-top border-dark bg-light"
              ref={terminalMenu}
              data-id="terminalToggleMenu"
            >
              <CustomTooltip
                placement="top"
                tooltipId="terminalToggle"
                tooltipClasses="text-nowrap"
                tooltipText={
                  !hidden ? (
                    <FormattedMessage id="terminal.hideTerminal" />
                  ) : (
                    <FormattedMessage id="terminal.showTerminal" />
                  )
                }
              >
                <i
                  className={`mx-2 remix_ui_terminal_toggleTerminal fas ${
                    !hidden ? 'fa-angle-double-down' : 'fa-angle-double-up'
                  }`}
                  data-id="terminalToggleIcon"
                  onClick={handleToggleTerminal}
                ></i>
              </CustomTooltip>
              <div
                className="mx-2 cursor_pointer"
                id="clearConsole"
                data-id="terminalClearConsole"
                onClick={handleClearConsole}
              >
                <CustomTooltip
                  placement="top"
                  tooltipId="terminalClear"
                  tooltipClasses="text-nowrap"
                  tooltipText={<FormattedMessage id="terminal.clearConsole" />}
                >
                  <i className="fas fa-ban" aria-hidden="true"></i>
                </CustomTooltip>
              </div>
              <div
                className="pl-2 cursor_pointer"
                onClick={() => {
                  setDisplay('transaction');
                }}
              >
                {
                  journalBlocks.filter(
                    (item: any) => item.name === 'knownTransaction'
                  ).length
                }{' '}
                Transactions
              </div>
              {shortname && (
                <div
                  className="pl-3 cursor_pointer"
                  onClick={() => {
                    setDisplay('comment');
                  }}
                >
                  <CommentCount
                    shortname="remix-dapp"
                    config={{ url: window.origin }}
                  >
                    Comments
                  </CommentCount>
                </div>
              )}
            </div>
          </div>
          <div
            tabIndex={-1}
            className="remix_ui_terminal_container d-flex h-100 m-0 flex-column"
            data-id="terminalContainer"
          >
            <div
              className={`position-relative flex-column-reverse h-100 ${
                display === 'transaction' ? 'd-flex' : 'd-none'
              }`}
            >
              <div
                id="journal"
                className="remix_ui_terminal_journal d-flex flex-column pt-3 pb-4 px-2 mx-2 mr-0"
                data-id="terminalJournal"
              >
                {journalBlocks?.map((x: any, index: number) => {
                  if (x.name === KNOWN_TRANSACTION) {
                    return x.message.map((trans: any) => {
                      return (
                        <div
                          className={classNameBlock}
                          data-id={`block_tx${trans.tx.hash}`}
                          key={index}
                        >
                          {trans.tx.isCall ? (
                            <RenderCall
                              tx={trans.tx}
                              resolvedData={trans.resolvedData}
                              logs={trans.logs}
                              index={index}
                              showTableHash={showTableHash}
                              txDetails={txDetails}
                            />
                          ) : (
                            <RenderKnownTransactions
                              tx={trans.tx}
                              receipt={trans.receipt}
                              resolvedData={trans.resolvedData}
                              logs={trans.logs}
                              index={index}
                              showTableHash={showTableHash}
                              txDetails={txDetails}
                              provider={x.provider}
                            />
                          )}
                        </div>
                      );
                    });
                  } else if (Array.isArray(x.message)) {
                    return x.message.map((msg: any, i: number) => {
                      if (React.isValidElement(msg)) {
                        return (
                          <div className="px-4 block" data-id="block" key={i}>
                            <span className={x.style}>{msg}</span>
                          </div>
                        );
                      } else if (typeof msg === 'object') {
                        if (msg.value && isHtml(msg.value)) {
                          return (
                            <div
                              className={classNameBlock}
                              data-id="block"
                              key={i}
                            >
                              <span className={x.style}>
                                {parse(msg.value)}{' '}
                              </span>
                            </div>
                          );
                        }
                        let stringified;
                        try {
                          stringified = JSON.stringify(msg);
                        } catch (e) {
                          console.error(e);
                          stringified = '< value not displayable >';
                        }
                        return (
                          <div
                            className={classNameBlock}
                            data-id="block"
                            key={i}
                          >
                            <span className={x.style}>{stringified} </span>
                          </div>
                        );
                      } else {
                        // typeWriterIndexes: we don't want to rerender using typewriter when the react component updates
                        if (
                          x.typewriter &&
                          !typeWriterIndexes.current.includes(index)
                        ) {
                          typeWriterIndexes.current.push(index);
                          return (
                            <div
                              className={classNameBlock}
                              data-id="block"
                              key={index}
                            >
                              <span
                                ref={(element) => {
                                  typewrite(
                                    element,
                                    msg ? msg.toString() : null,
                                    () => {
                                      scrollToBottom();
                                    }
                                  );
                                }}
                                className={x.style}
                              ></span>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              className={classNameBlock}
                              data-id="block"
                              key={i}
                            >
                              <span className={x.style}>
                                {msg ? msg.toString() : null}
                              </span>
                            </div>
                          );
                        }
                      }
                    });
                  } else {
                    // typeWriterIndexes: we don't want to rerender using typewriter when the react component updates
                    if (
                      x.typewriter &&
                      !typeWriterIndexes.current.includes(index)
                    ) {
                      typeWriterIndexes.current.push(index);
                      return (
                        <div
                          className={classNameBlock}
                          data-id="block"
                          key={index}
                        >
                          {' '}
                          <span
                            ref={(element) => {
                              typewrite(element, x.message, () => {
                                scrollToBottom();
                              });
                            }}
                            className={x.style}
                          ></span>
                        </div>
                      );
                    } else {
                      if (typeof x.message !== 'function') {
                        return (
                          <div
                            className={classNameBlock}
                            data-id="block"
                            key={index}
                          >
                            {' '}
                            <span className={x.style}> {x.message}</span>
                          </div>
                        );
                      }
                      return null;
                    }
                  }
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {shortname && (
              <div className={`p-3 ${display === 'comment' ? '' : 'd-none'}`}>
                <DiscussionEmbed
                  shortname={shortname}
                  config={{ url: window.origin }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const typewrite = (elementsRef: any, message: any, callback: any) => {
  (() => {
    let count = 0;
    const id = setInterval(() => {
      if (!elementsRef) return;
      count++;
      elementsRef.innerText = message.substr(0, count);
      // scroll when new line ` <br>
      if (elementsRef.lastChild.tagName === `BR`) callback();
      if (message.length === count) {
        clearInterval(id);
        callback();
      }
    }, 5);
  })();
};

function isHtml(value: any) {
  if (!value.indexOf) return false;
  return (
    value.indexOf('<div') !== -1 ||
    value.indexOf('<span') !== -1 ||
    value.indexOf('<p') !== -1 ||
    value.indexOf('<label') !== -1 ||
    value.indexOf('<b') !== -1
  );
}

export default RemixUiTerminal;
