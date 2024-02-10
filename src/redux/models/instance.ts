import Web3 from 'web3';
import BN from 'bn.js';
import axios from 'axios';
import { execution } from '@remix-project/remix-lib';
import { type ModelType } from '../store';
import injected from '../../utils/injected';
import { EventsDecoder } from '../../utils/eventsDecoder';

const { txFormat } = execution;
const eventsDecoder = new EventsDecoder();

const Model: ModelType = {
  namespace: 'instance',
  state: {
    name: '',
    address: '',
    balance: 0,
    network: '',
    decodedResponse: {},
    abi: [],
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *init(_, { put }) {
      const resp = yield axios.get('/instance.json');
      yield put({ type: 'instance/save', payload: resp.data });
    },
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
