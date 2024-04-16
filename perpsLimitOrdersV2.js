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
// Constants
var mnemonic = "chat enhance stock know air layer under rabbit lens pony clever glass";
var contractAddress = "neutron15ldst8t80982akgr8w8ekcytejzkmfpgdkeq4xgtge48qs7435jqp87u3t";
var queryOrdersContractAddress = "neutron1tcquuh8jhqjcch3qryg2n7nupz0u74a2kfh0h7pyp0l5k65arzasp7yscx";
var chainId = "pion-1";
var rpcEndpoint = "https://rpc-palvus.pion-1.ntrn.tech";
// Utility Functions
var fetchPriceFeeds = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = 'https://hermes.pyth.network/api/latest_price_feeds?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819&ids[]=a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e';
                return [4 /*yield*/, axios_1.default.get(url)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
        }
    });
}); };
var createWallet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wallet;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' })];
            case 1:
                wallet = _a.sent();
                return [2 /*return*/, cosmwasm_stargate_1.SigningCosmWasmClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: stargate_1.GasPrice.fromString('0.25untrn') })];
        }
    });
}); };
// Main Logic
var execute = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cosmwasmClient, wallet, address, priceFeeds, feedIds, pricesDictionary, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, createWallet()];
            case 1:
                cosmwasmClient = _a.sent();
                return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' })];
            case 2:
                wallet = _a.sent();
                return [4 /*yield*/, wallet.getAccounts()];
            case 3:
                address = (_a.sent())[0].address;
                return [4 /*yield*/, fetchPriceFeeds()];
            case 4:
                priceFeeds = _a.sent();
                feedIds = priceFeeds.map(function (feed) { return feed.id; });
                pricesDictionary = processPriceFeeds(priceFeeds);
                console.log("Processed Prices:", pricesDictionary);
                console.log("Feed IDs:", feedIds);
                // Example execute contract call
                return [4 /*yield*/, updatePriceFeeds(cosmwasmClient, address, feedIds)];
            case 5:
                // Example execute contract call
                _a.sent();
                // Example query and process trigger orders
                //await queryAndProcessTriggerOrders(cosmwasmClient, address);
                console.log('Execution completed');
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error('Error executing logic:', error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
var processPriceFeeds = function (priceFeeds) {
    return priceFeeds.reduce(function (acc, feed) {
        var _a = feed.price, price = _a.price, expo = _a.expo;
        acc[feed.id] = Number(price) / Math.pow(10, Math.abs(expo));
        return acc;
    }, {});
};
var updatePriceFeeds = function (client, address, feedIds) { return __awaiter(void 0, void 0, void 0, function () {
    var executeMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                executeMsg = { update_price_feeds: { data: feedIds } };
                return [4 /*yield*/, client.execute(address, contractAddress, executeMsg, 'auto', '', [(0, proto_signing_1.coin)(1, 'untrn')])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// Periodic Execution
setInterval(execute, 5000);
