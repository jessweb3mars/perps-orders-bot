import axios from 'axios';
import {
  DirectSecp256k1HdWallet,
  coin,
  Coin,
} from '@cosmjs/proto-signing';
import {
	CosmWasmClient,
	MsgExecuteContractEncodeObject,
	SigningCosmWasmClient,
	SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClient, GasPrice } from '@cosmjs/stargate';

import { Decimal } from '@cosmjs/math';

// Constants
const MNEMONIC = "chat enhance stock know air layer under rabbit lens pony clever glass";
const CONTRACT_ADDRESS = "neutron15ldst8t80982akgr8w8ekcytejzkmfpgdkeq4xgtge48qs7435jqp87u3t";
const QUERY_ORDERS_CONTRACT_ADDRESS = "neutron104qkvlys7lxd5yamerwuxe869mm0fzkjtj6ynnjguu0ykhzr3vys4j6efx";
const RPC_ENDPOINT = "https://rpc-palvus.pion-1.ntrn.tech";

// Interfaces
interface PythUpdateExecuteMsg {
  update_price_feeds: { data: string[] };
}

interface ApiResponse {
  id: string;
  price: PriceInfo;
}

interface PriceInfo {
  price: string;
  conf: string;
  expo: number;
  publish_time: number;
}

interface UpdateCreditAccount {
  update_credit_account: {
    account_id: string;
    actions: Array<{
      execute_trigger_order: {
        order_id: string;
        account_id: string;
      };
    }>;
  };
}

// Main execution logic
class BlockchainOperation {
  client: Promise<SigningCosmWasmClient>;

  constructor() {
    this.client = DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: 'neutron' })
      .then(wallet => SigningCosmWasmClient.connectWithSigner(RPC_ENDPOINT, wallet, { gasPrice: GasPrice.fromString("0.25untrn") }));
  }

  async fetchPriceFeeds(): Promise<ApiResponse[]> {
    const response = await axios.get<ApiResponse[]>('https://hermes.pyth.network/api/latest_price_feeds?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819&ids[]=a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e');
    return response.data;
  }

  async processAndExecute(data: ApiResponse[]) {
    const cosmwasmClient = await this.client;
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: 'neutron' });
    const address = (await wallet.getAccounts())[0].address
    const priceData = data.map(d => ({ ...d, price: Decimal.fromAtomics(d.price.price, d.price.expo).toString() }));

    // Simulate processing logic
    console.log("Processing price data:", priceData);

    // Example execution with the processed data
    const executeMsg: PythUpdateExecuteMsg = { update_price_feeds: { data: priceData.map(pd => pd.id) } };
    await cosmwasmClient.execute(address, CONTRACT_ADDRESS, executeMsg, "auto");
  }
}

async function executePeriodically() {
  const blockchainOperation = new BlockchainOperation();
  
  async function execute() {
    try {
      const priceFeeds = await blockchainOperation.fetchPriceFeeds();
      await blockchainOperation.processAndExecute(priceFeeds);
      console.log("Executed blockchain operation successfully");
    } catch (error) {
      console.error("Error in blockchain operation:", error);
    }
  }

  // Execute immediately then periodically every 5 seconds
  execute();
  setInterval(execute, 5000);
}

executePeriodically();
