import { type ModelType } from '../store';

const Model: ModelType = {
  namespace: 'terminal',
  state: { journalBlocks: [], hidden: false, height: 250 },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {},
};

export default Model;
