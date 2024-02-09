import Web3 from 'web3';
import BN from 'bn.js';
// import SurgeClient from 'surge-client';
import { execution } from '@remix-project/remix-lib';
import { type ModelType } from '../store';
import injected from '../../utils/injected';
import { EventsDecoder } from '../../utils/eventsDecoder';

const { txFormat } = execution;
const eventsDecoder = new EventsDecoder();

const Model: ModelType = {
  namespace: 'instance',
  state: {
    name: 'Storage',
    address: '0x82068d60D95cdfe50446E757c994c0a2116049AA',
    balance: 0,
    network: 'goerli',
    decodedResponse: {},
    abi: [
      {
        inputs: [],
        name: 'retrieve',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'num',
            type: 'uint256',
          },
        ],
        name: 'store',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    // *deploy() {
    //   const client = new SurgeClient({
    //     proxy: 'http://127.0.0.1:3003',
    //     onError: (err: Error) => {
    //       console.log(err);
    //     },
    //   });
    //   client
    //     .login({
    //       user: 'xwlyy1991@gmail.com',
    //       password: 'djq41017',
    //     })
    //     .then(() => {
    //       const files: Record<string, string> = {
    //         'dir/index.html': `<h1>Hello World!!! remixcc</h1>`,
    //         'dir/css/style.css': `html,body{margin:0}`,
    //         'dir/js/js.js': `console.log("js.js");`,
    //         'dir/level1/level2/text.txt': 'text',
    //       };

    //       client
    //         .publish({
    //           files,
    //           domain: 'remixcc-dapp.surge.sh',
    //           onProgress: ({
    //             id,
    //             progress,
    //             file,
    //           }: {
    //             id: string;
    //             progress: number;
    //             file: string;
    //           }) => {
    //             console.log({ id, progress, file });
    //           },
    //           onTick: (tick: string) => {},
    //         })
    //         .catch((err: Error) => {
    //           console.log(err);
    //         });
    //     })
    //     .catch((err: Error) => {
    //       console.log(err);
    //     });
    // },
    *runTransactions({ payload }, { put, select }) {
      console.log(payload);
      const { sendValue, sendUnit, gasLimit, selectedAccount } = yield select(
        (state) => state.settings
      );
      const { address, decodedResponse, name } = yield select(
        (state) => state.instance
      );
      const value = Web3.utils.toWei(sendValue, sendUnit);
      const { data } = txFormat.encodeData(
        payload.funcABI,
        JSON.parse('[' + payload.inputsValues + ']'),
        ''
      );
      const tx = {
        to: address,
        data,
        from: selectedAccount,
        value,
      };

      const resp = yield injected.runTx(
        tx,
        '0x' + new BN(gasLimit, 10).toString(16),
        payload.lookupOnly
      );

      const journalBlocks = yield select(
        (state) => state.terminal.journalBlocks
      );

      if (payload.lookupOnly) {
        yield put({
          type: 'instance/save',
          payload: {
            decodedResponse: {
              ...decodedResponse,
              [payload.funcIndex]: txFormat.decodeResponse(
                resp,
                payload.funcABI
              ),
            },
          },
        });

        yield put({
          type: 'terminal/save',
          payload: {
            journalBlocks: [
              ...journalBlocks,
              {
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
                        data?.replace('0x', '').substring(8),
                        payload.funcABI
                      ),
                      decodedReturnValue: txFormat.decodeResponse(
                        resp,
                        payload.funcABI
                      ),
                    },
                  },
                ],
                style: '',
                name: 'knownTransaction',
                provider: 'injected',
              },
            ],
          },
        });
      } else {
        yield put({
          type: 'terminal/save',
          payload: {
            journalBlocks: [
              ...journalBlocks,
              {
                message: [
                  {
                    tx: { ...resp.tx, receipt: resp.receipt },
                    receipt: resp.receipt,
                    resolvedData: {
                      contractName: name,
                      to: address,
                      fn: payload.funcABI.name,
                      params: eventsDecoder._decodeInputParams(
                        data?.replace('0x', '').substring(8),
                        payload.funcABI
                      ),
                    },
                  },
                ],
                style: '',
                name: 'knownTransaction',
                provider: 'injected',
              },
            ],
          },
        });
      }
    },
  },
};

export default Model;
