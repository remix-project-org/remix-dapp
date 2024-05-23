import axios from 'axios';
import Web3 from 'web3';
import BN from 'bn.js';
import { execution } from '@remix-project/remix-lib';
import injected from '../utils/injected';
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

const addCustomNetwork = async (payload: {
  chainName?: string;
  chainId: string;
  rpcUrls?: Array<string>;
  nativeCurrency?: Record<string, any>;
  blockExplorerUrls?: Array<string>;
}) => {
  const { chainId, chainName, rpcUrls, nativeCurrency, blockExplorerUrls } =
    payload;
  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        const paramsObj: Record<string, any> = {
          chainId: chainId,
          chainName: chainName,
          rpcUrls: rpcUrls,
        };
        if (nativeCurrency) paramsObj.nativeCurrency = nativeCurrency;
        if (blockExplorerUrls) paramsObj.blockExplorerUrls = blockExplorerUrls;
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [paramsObj],
        });

        await (window as any).ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }],
        });
      } catch (addError) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
};

export const connect = async (payload: any) => {
  const { networkName } = payload;
  await dispatch({ type: 'SET_SETTINGS', payload: { networkName } });
  const chainId =
    '0x' + Number(networkName.match(/\(([^)]+)\)/)[1]).toString(16);
  const paramsObj: any = { chainId };
  if (chainId === '0xa') {
    paramsObj.chainName = 'Optimism';
    paramsObj.rpcUrls = ['https://mainnet.optimism.io'];
  }
  if (chainId === '0xa4b1') {
    paramsObj.chainName = 'Arbitrum One';
    paramsObj.rpcUrls = ['https://arb1.arbitrum.io/rpc'];
  }
  if (chainId === '0x50877ed6') {
    paramsObj.chainName = 'SKALE Chaos Testnet';
    paramsObj.rpcUrls = [
      'https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix',
    ];
    paramsObj.nativeCurrency = {
      name: 'sFUEL',
      symbol: 'sFUEL',
      decimals: 18,
    };
  }
  // @ts-expect-error
  const web3Provider = window.ethereum;
  await addCustomNetwork(paramsObj);
  await web3Provider.request({ method: 'eth_requestAccounts' });
  injected.setProvider(web3Provider);
  injected.getAccounts();
  setInterval(() => {
    injected.getAccounts();
  }, 30000);
};

export const initInstance = async () => {
  const resp = await axios.get('/instance.json');
  await dispatch({ type: 'SET_INSTANCE', payload: resp.data });
  await connect({ networkName: resp.data.network });
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

  const resp: any = await injected.runTx(
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
