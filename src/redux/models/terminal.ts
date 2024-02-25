import { type ModelType } from '../store';

const Model: ModelType = {
  namespace: 'terminal',
  state: { journalBlocks: [], hidden: false, height: 250 },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *log({ payload }, { select, put }) {
      const journalBlocks = yield select(
        (state) => state.terminal.journalBlocks
      );
      yield put({
        type: 'terminal/save',
        payload: {
          journalBlocks: [...journalBlocks, payload],
        },
      });
    },
  },
};

export default Model;
