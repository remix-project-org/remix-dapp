import { type ModelType } from '../store';
import injected from '../../utils/injected';

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
      yield addCustomNetwork(paramsObj);
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
