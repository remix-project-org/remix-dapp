import axios from 'axios';
import Web3 from 'web3';
import BN from 'bn.js';
import { execution } from '@remix-project/remix-lib';
import txRunner from '../utils/txRunner';
import metamask from '../utils/metamask';
import walletConnect from '../utils/walletConnect';
import { EventsDecoder } from '../utils/eventsDecoder';
import buildData from '../utils/buildData';

const { txFormat } = execution;
const eventsDecoder = new EventsDecoder();

let dispatch: any, state: any;

export const initDispatch = (_dispatch: any) => {
  dispatch = _dispatch;
};

export const updateState = (_state: any) => {
  state = _state;
};

export const setProvider = async (payload: any) => {
  await dispatch({
    type: 'SET_SETTINGS',
    payload: { loadedAccounts: {} },
  });
  const { provider, networkName } = payload;
  const chainId =
    '0x' + Number(networkName.match(/\(([^)]+)\)/)[1]).toString(16);
  if (provider === 'metamask') {
    const web3Provider: any = window.ethereum;
    await metamask.addCustomNetwork(chainId);
    await web3Provider.request({ method: 'eth_requestAccounts' });
    txRunner.setProvider(web3Provider);
    txRunner.getAccounts();
  }

  if (provider === 'walletconnect') {
    txRunner.setProvider(walletConnect as any);
  }
};

export const initInstance = async () => {
  const resp = await axios.get('/instance.json');
  await dispatch({ type: 'SET_INSTANCE', payload: resp.data });
  await dispatch({
    type: 'SET_SETTINGS',
    payload: { networkName: resp.data.network },
  });
  await setProvider({
    networkName: resp.data.network,
    provider: window.ethereum ? 'metamask' : 'walletconnect',
  });
};

export const saveSettings = async (payload: any) => {
  await dispatch({ type: 'SET_SETTINGS', payload });
};

export const log = async (payload: any) => {
  const journalBlocks = state.terminal.journalBlocks;
  await dispatch({
    type: 'SET_TERMINAL',
    payload: {
      journalBlocks: [...journalBlocks, payload],
    },
  });
};

export const runTransactions = async (payload: any) => {
  console.log(payload);
  const { sendValue, sendUnit, gasLimit, selectedAccount } = state.settings;
  const { address, decodedResponse, name } = state.instance;
  const value = Web3.utils.toWei(sendValue, sendUnit);

  const { dataHex, error } = buildData(payload.funcABI, payload.inputsValues);

  if (error) {
    await log({
      message: [`${payload.logMsg} errored: ${error}`],
      style: 'text-log',
    });
    return;
  }
  const tx = {
    to: address,
    data: dataHex,
    from: selectedAccount,
    value,
  };

  if (payload.lookupOnly) {
    await log({
      message: [`${payload.logMsg}`],
      style: 'text-log',
    });
  } else {
    await log({
      message: [`${payload.logMsg} pending ... `],
      style: 'text-log',
    });
  }

  const resp: any = await txRunner.runTx(
    tx,
    '0x' + new BN(gasLimit, 10).toString(16),
    payload.lookupOnly
  );

  if (resp.error) {
    await log({
      message: [`${payload.logMsg} errored: ${resp.error}`],
      style: 'text-log',
    });
    return;
  }

  if (payload.lookupOnly) {
    await dispatch({
      type: 'SET_INSTANCE',
      payload: {
        decodedResponse: {
          ...decodedResponse,
          [payload.funcIndex]: txFormat.decodeResponse(resp, payload.funcABI),
        },
      },
    });

    await log({
      message: [
        {
          tx: {
            to: tx.to,
            isCall: true,
            from: tx.from,
            envMode: 'injected',
            input: tx.data,
            hash: 'call' + (tx.from || '') + tx.to + tx.data,
          },
          resolvedData: {
            contractName: name,
            to: address,
            fn: payload.funcABI.name,
            params: eventsDecoder._decodeInputParams(
              dataHex?.replace('0x', '').substring(8),
              payload.funcABI
            ),
            decodedReturnValue: txFormat.decodeResponse(resp, payload.funcABI),
          },
        },
      ],
      style: '',
      name: 'knownTransaction',
      provider: 'injected',
    });
  } else {
    await log({
      message: [
        {
          tx: { ...resp.tx, receipt: resp.receipt },
          receipt: resp.receipt,
          resolvedData: {
            contractName: name,
            to: address,
            fn: payload.funcABI.name,
            params: eventsDecoder._decodeInputParams(
              dataHex?.replace('0x', '').substring(8),
              payload.funcABI
            ),
          },
        },
      ],
      style: '',
      name: 'knownTransaction',
      provider: 'injected',
    });
  }
};
