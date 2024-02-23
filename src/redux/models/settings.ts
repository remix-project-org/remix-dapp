import { type ModelType } from '../store';
import injected from '../../utils/injected';

const Model: ModelType = {
  namespace: 'settings',
  state: {
    sendValue: '0',
    sendUnit: 'wei',
    gasLimit: 3000000,
    networkName: 'Goerli',
    loadedAccounts: {},
    isRequesting: false,
    isSuccessful: false,
    error: null,
    selectedAccount: '',
    selectedLocaleCode: 'en',
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *connect({ payload }, { put }) {
      const { networkName } = payload;
      yield put({ type: 'settings/save', payload: { networkName } });
      const chainId = networkName.match(/\(([^)]+)\)/)[1];
      // @ts-expect-error
      const web3Provider = window.ethereum;
      yield web3Provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + Number(chainId).toString(16) }],
      });
      yield web3Provider.request({ method: 'eth_requestAccounts' });
      injected.setProvider(web3Provider);
      injected.getAccounts();
      setInterval(() => {
        injected.getAccounts();
      }, 30000);
    },
  },
};

export default Model;
