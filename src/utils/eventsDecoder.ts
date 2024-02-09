'use strict';
import { ethers } from 'ethers';
import { toBuffer, addHexPrefix } from '@ethereumjs/util';
import { execution } from '@remix-project/remix-lib';

const {
  txHelper: { visitContracts, makeFullTypeDefinition },
} = execution;

/**
 * Register to txListener and extract events
 *
 */
export class EventsDecoder {
  /**
   * use Transaction Receipt to decode logs. assume that the transaction as already been resolved by txListener.
   * logs are decoded only if the contract if known by remix.
   *
   * @param {Object} tx - transaction object
   * @param {Function} cb - callback
   */
  parseLogs(
    tx: any,
    receipt: any,
    contractName: any,
    compiledContracts: any,
    cb: any
  ) {
    if (tx.isCall) return cb(null, { decoded: [], raw: [] });
    this._decodeLogs(tx, receipt, contractName, compiledContracts, cb);
  }

  _decodeLogs(tx: any, receipt: any, contract: any, contracts: any, cb: any) {
    if (!contract || !receipt) {
      return cb('cannot decode logs - contract or receipt not resolved ', null);
    }
    if (!receipt.logs) {
      return cb(null, { decoded: [], raw: [] });
    }
    this._decodeEvents(tx, receipt.logs, contract, contracts, cb);
  }

  _eventABI(contract: any): any {
    const eventABI: any = {};
    const abi = new ethers.utils.Interface(contract.abi);
    for (const e in abi.events) {
      const event = abi.getEvent(e);
      eventABI[abi.getEventTopic(e).replace('0x', '')] = {
        event: event.name,
        inputs: event.inputs,
        object: event,
        abi,
      };
    }
    return eventABI;
  }

  _eventsABI(compiledContracts: any): Record<string, unknown> {
    const eventsABI: Record<string, unknown> = {};
    visitContracts(compiledContracts, (contract: any) => {
      eventsABI[contract.name] = this._eventABI(contract.object);
    });
    return eventsABI;
  }

  _event(hash: any, eventsABI: any) {
    // get all the events responding to that hash.
    const contracts = [];
    for (const k in eventsABI) {
      if (eventsABI[k][hash]) {
        const event = eventsABI[k][hash];
        contracts.push(event);
      }
    }
    return contracts;
  }

  _stringifyBigNumber(value: any): string {
    return value._isBigNumber ? value.toString() : value;
  }

  _stringifyEvent(value: any): any {
    if (value === null || value === undefined) return ' - ';
    if (value._ethersType) value.type = value._ethersType;
    if (Array.isArray(value)) {
      // for struct && array
      return value.map((item: any) => {
        return this._stringifyEvent(item);
      });
    } else {
      return this._stringifyBigNumber(value);
    }
  }

  _decodeEvents(
    tx: any,
    logs: any,
    contractName: any,
    compiledContracts: any,
    cb: any
  ) {
    const eventsABI = this._eventsABI(compiledContracts);
    const events = [];
    for (const i in logs) {
      // [address, topics, mem]
      const log = logs[i];
      const topicId = log.topics[0];
      const eventAbis = this._event(topicId.replace('0x', ''), eventsABI);
      for (const eventAbi of eventAbis) {
        try {
          if (eventAbi) {
            const decodedlog = eventAbi.abi.parseLog(log);
            const decoded: any = {};
            for (const v in decodedlog.args) {
              decoded[v] = this._stringifyEvent(decodedlog.args[v]);
            }
            events.push({
              from: log.address,
              topic: topicId,
              event: eventAbi.event,
              args: decoded,
            });
          } else {
            events.push({
              from: log.address,
              data: log.data,
              topics: log.topics,
            });
          }
          break; // if one of the iteration is successful
        } catch (e) {
          continue;
        }
      }
    }
    cb(null, { decoded: events, raw: logs });
  }

  _decodeInputParams(data: any, abi: any) {
    data = toBuffer(addHexPrefix(data));
    if (!data.length) data = new Uint8Array(32 * abi.inputs.length); // ensuring the data is at least filled by 0 cause `AbiCoder` throws if there's not engouh data

    const inputTypes = [];
    for (let i = 0; i < abi.inputs.length; i++) {
      const type = abi.inputs[i].type;
      inputTypes.push(
        type.indexOf('tuple') === 0
          ? makeFullTypeDefinition(abi.inputs[i])
          : type
      );
    }
    const abiCoder = new ethers.utils.AbiCoder();
    const decoded = abiCoder.decode(inputTypes, data);
    const ret: any = {};
    for (const k in abi.inputs) {
      ret[abi.inputs[k].type + ' ' + abi.inputs[k].name] = decoded[k];
    }
    return ret;
  }

  _parseInputParams(decoded: any, abi: any) {
    const ret: any = {};
    for (const k in abi.inputs) {
      ret[abi.inputs[k].type + ' ' + abi.inputs[k].name] = decoded[k];
    }
    return ret;
  }
}
