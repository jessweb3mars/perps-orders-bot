"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var cosmwasm_stargate_1 = require("@cosmjs/cosmwasm-stargate");
var stargate_1 = require("@cosmjs/stargate");
var proto_signing_1 = require("@cosmjs/proto-signing");
// mnemonic
var mnemonic = "chat enhance stock know air layer under rabbit lens pony clever glass";
// contract address
var contractAddress = "neutron15ldst8t80982akgr8w8ekcytejzkmfpgdkeq4xgtge48qs7435jqp87u3t";
//const contractAddress = "neutron1f86ct5az9qpz2hqfd5uxru02px2a3tz5zkw7hugd7acqq496dcms22ehpy";
var queryOrdersContractAddress = "neutron1pn5xdjv8zzw48h9m5zfu89h7cx7hnxldhhrq7tpzh0jwm568vgms9yamxa";
// neutron190l83w5l37adyfgh2sqc0nymfklw85thhh0nf8g3uxye9q0e0xkq0a8yct
//chain id
var chainId = "pion-1";
//blockchain rpc endpoint
var rpcEndpoint = "https://rpc-palvus.pion-1.ntrn.tech";
var pricesDictionary = {};
function replacer(key, value) {
    var seen = new WeakSet();
    return function (key, value) {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}
function execute() {
    return __awaiter(this, void 0, void 0, function () {
        var cosmwasmClient_1, response, feedIds_1, vaas, request_data, wallet, addresses, address_1, txResponse, queryTriggerOrders, redo, queryResponse, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, getWallet()];
                case 1:
                    cosmwasmClient_1 = _a.sent();
                    return [4 /*yield*/, axios_1.default.get('https://hermes.pyth.network/api/latest_price_feeds?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819&ids[]=a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e')];
                case 2:
                    response = _a.sent();
                    feedIds_1 = [];
                    response.data.forEach(function (asset) {
                        // console.log(`Id: ${asset.id}`);
                        // console.log(`Price: ${asset.price.price}`);
                        // console.log(`Expo: ${asset.price.expo}`);
                        var price = asset.price.price;
                        var expo = asset.price.expo; // -8 , -7, -6, +100
                        var feedId = asset.id;
                        // convert the price
                        if (expo < 0) {
                            var result = Number(price) / Math.pow(10, Math.abs(expo));
                            //Determine the orders that should be executed
                            feedIds_1.push(feedId);
                            switch (asset.id) {
                                case 'b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819':
                                    pricesDictionary["atom"] = result;
                                case 'a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e':
                                    pricesDictionary["untrn"] = result;
                            }
                        }
                    });
                    console.log("untrn Result: ".concat(pricesDictionary["untrn"]));
                    console.log("atom Result: ".concat(pricesDictionary["atom"]));
                    console.log(feedIds_1);
                    return [4 /*yield*/, axios_1.default.get('https://hermes.pyth.network/api/latest_vaas?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819')];
                case 3:
                    vaas = _a.sent();
                    request_data = vaas.data[0];
                    return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' })];
                case 4:
                    wallet = _a.sent();
                    return [4 /*yield*/, wallet.getAccounts()];
                case 5:
                    addresses = _a.sent();
                    address_1 = addresses[0].address;
                    return [4 /*yield*/, cosmwasmClient_1.execute(address_1, contractAddress, {
                            'update_price_feeds': {
                                'data': [request_data]
                            }
                        }, 'auto', '', [(0, proto_signing_1.coin)(1, 'untrn')])];
                case 6:
                    txResponse = _a.sent();
                    console.log('transactionHash:' + txResponse.transactionHash);
                    queryTriggerOrders = {
                        all_trigger_orders: {},
                    };
                    return [4 /*yield*/, wallet.getAccounts()];
                case 7:
                    redo = _a.sent();
                    return [4 /*yield*/, cosmwasmClient_1.queryContractSmart(queryOrdersContractAddress, queryTriggerOrders)];
                case 8:
                    queryResponse = _a.sent();
                    queryResponse.forEach(function (result) {
                        console.log("Order ID: ".concat(result.order_id, ", Account ID: ").concat(result.account_id));
                        // result.order.actions.forEach((action: any, index: number) => {
                        //   if (action.open_perp) {
                        //     console.log(`  Action ${index + 1}: Open Perp - Denom: ${action.open_perp.denom}, Size: ${action.open_perp.size}`);
                        //   }
                        // });
                        //console.log(`  Keeper Fee: ${result.order.keeper_fee.amount} ${result.order.keeper_fee.denom}`);
                        result.order.triggers.forEach(function (trigger, index) {
                            if (trigger.price_trigger) {
                                determineTrigger(address_1, cosmwasmClient_1, result.account_id, result.order_id, trigger, index);
                            }
                        });
                    });
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    console.error('Error fetching data:', error_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function getWallet() {
    return __awaiter(this, void 0, void 0, function () {
        var wallet, cosmwasmClient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' })];
                case 1:
                    wallet = _a.sent();
                    return [4 /*yield*/, cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, {
                            gasPrice: stargate_1.GasPrice.fromString('0.25untrn'),
                        })];
                case 2:
                    cosmwasmClient = _a.sent();
                    return [2 /*return*/, cosmwasmClient];
            }
        });
    });
}
function updateOraclePrice() {
    return __awaiter(this, void 0, void 0, function () {
        var cosmwasmClient, vaas, request_data, wallet, addresses, address, txResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getWallet()];
                case 1:
                    cosmwasmClient = _a.sent();
                    return [4 /*yield*/, axios_1.default.get('https://hermes.pyth.network/api/latest_vaas?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819')];
                case 2:
                    vaas = _a.sent();
                    request_data = vaas.data[0];
                    return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' })];
                case 3:
                    wallet = _a.sent();
                    return [4 /*yield*/, wallet.getAccounts()];
                case 4:
                    addresses = _a.sent();
                    address = addresses[0].address;
                    return [4 /*yield*/, cosmwasmClient.execute(address, contractAddress, {
                            'update_price_feeds': {
                                'data': [request_data]
                            }
                        }, 'auto', '', [(0, proto_signing_1.coin)(1, 'untrn')])];
                case 5:
                    txResponse = _a.sent();
                    console.log('transactionHash:' + txResponse.transactionHash);
                    return [2 /*return*/];
            }
        });
    });
}
function determineTrigger(address, cosmwasmClient, account_id, order_id, trigger, index) {
    var price;
    switch (trigger.price_trigger.denom) {
        //atom
        case 'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9':
            price = pricesDictionary["atom"];
        //untrn
        case 'untrn':
            price = pricesDictionary["untrn"];
    }
    if (trigger.price_trigger.trigger_type === 'less_than' && price > trigger.price_trigger.oracle_price) {
        console.log("trigger less_than Trigger ".concat(index + 1, ": Price Trigger - Denom: ").concat(trigger.price_trigger.denom, ",Oracle Price: ").concat(pricesDictionary["untrn"], " ,trigger Price: ").concat(trigger.price_trigger.oracle_price, ", Type: ").concat(trigger.price_trigger.trigger_type));
        executeTrigger(address, cosmwasmClient, account_id, order_id, trigger);
    }
    else if (trigger.price_trigger.trigger_type === 'greater_than' && price < trigger.price_trigger.oracle_price) {
        console.log("trigger greater_than Trigger ".concat(index + 1, ": Price Trigger - Denom: ").concat(trigger.price_trigger.denom, ", Oracle Price: ").concat(pricesDictionary["untrn"], ", trigger Price: ").concat(trigger.price_trigger.oracle_price, ", Type: ").concat(trigger.price_trigger.trigger_type));
        executeTrigger(address, cosmwasmClient, account_id, order_id, trigger);
    }
}
function executeTrigger(address, cosmwasmClient, account_id, order_id, trigger) {
    return __awaiter(this, void 0, void 0, function () {
        var accountUpdateRequest, txResponse, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accountUpdateRequest = {
                        update_credit_account: {
                            account_id: account_id,
                            actions: [{
                                    execute_trigger_order: {
                                        order_id: order_id,
                                        account_id: account_id
                                    }
                                }]
                        }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cosmwasmClient.execute(address, queryOrdersContractAddress, accountUpdateRequest, 'auto', '', [])];
                case 2:
                    txResponse = _a.sent();
                    console.log("trigger order:" + txResponse.transactionHash);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// cron job
setInterval(execute, 5000);
