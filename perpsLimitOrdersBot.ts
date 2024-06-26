import axios from 'axios';
import {
	CosmWasmClient,
	MsgExecuteContractEncodeObject,
	SigningCosmWasmClient,
	SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClient, GasPrice } from '@cosmjs/stargate';
import {
	AccountData,
	coin,
  Coin,
	DirectSecp256k1HdWallet,
	EncodeObject,
	GeneratedType,
	Registry,
} from '@cosmjs/proto-signing'

import { HdPath } from '@cosmjs/crypto'

// mnemonic
const mnemonic = "chat enhance stock know air layer under rabbit lens pony clever glass";
// contract address
const contractAddress = "neutron15ldst8t80982akgr8w8ekcytejzkmfpgdkeq4xgtge48qs7435jqp87u3t";
//const contractAddress = "neutron1f86ct5az9qpz2hqfd5uxru02px2a3tz5zkw7hugd7acqq496dcms22ehpy";
const queryOrdersContractAddress = "neutron1pn5xdjv8zzw48h9m5zfu89h7cx7hnxldhhrq7tpzh0jwm568vgms9yamxa"
// neutron190l83w5l37adyfgh2sqc0nymfklw85thhh0nf8g3uxye9q0e0xkq0a8yct
//chain id
const chainId = "pion-1";

//blockchain rpc endpoint
const rpcEndpoint = "https://rpc-palvus.pion-1.ntrn.tech";
let pricesDictionary: { [key: string]: any } = {};
interface PythUpdateExecuteMsg {
  update_price_feeds: { data: string[] }
}

type MsgExecuteContractValue = {
  sender: string;
  contract: string;
  msg: PythUpdateExecuteMsg;
  funds?: Coin[];
};


// simple datastructure for the response
interface ApiResponse {
  id: string;
  price: PriceInfo;
  ema_price: PriceInfo;
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
    actions: [{
      execute_trigger_order: {
        order_id: string;
        account_id: string;
      };
    }];
  };
}


function replacer(key: string, value: any): any {
  const seen = new WeakSet();
  return (key: string, value: object) => {
      if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
              return;
          }
          seen.add(value);
      }
      return value;
  };
}


async function execute(): Promise<void> {
  try {
    // neutron
    const cosmwasmClient = await getWallet();

    //fetch all our markets



    // http 
    const response = await axios.get<ApiResponse[]>('https://hermes.pyth.network/api/latest_price_feeds?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819&ids[]=a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e');
    const feedIds : string[] =  [];
   
    response.data.forEach((asset) => {
      // console.log(`Id: ${asset.id}`);
      // console.log(`Price: ${asset.price.price}`);
      // console.log(`Expo: ${asset.price.expo}`);
      let price = asset.price.price;
      let expo = asset.price.expo; // -8 , -7, -6, +100
      let feedId = asset.id; 
      // convert the price
      if (expo < 0) {
        let result = Number(price) / Math.pow(10, Math.abs(expo));
        
        //Determine the orders that should be executed
        feedIds.push(feedId)
        
        switch(asset.id){
          case 'b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819':
            pricesDictionary["atom"] = result 
          case 'a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e':
            pricesDictionary["untrn"] = result 
        }
      }

    });
    console.log(`untrn Result: ${pricesDictionary["untrn"]}`);
    console.log(`atom Result: ${pricesDictionary["atom"]}`);

    console.log(feedIds);
    //const vaas = await axios.get<ApiResponse[]>('https://hermes.pyth.network/api/latest_vaas?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819&ids[]=a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e');
    const vaas = await axios.get<ApiResponse[]>('https://hermes.pyth.network/api/latest_vaas?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819');

    //console.log(vaas.data[0]);
    let request_data = vaas.data[0]

    // get wallet address
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' });
    const addresses = await wallet.getAccounts();
    const address = addresses[0].address;

    const txResponse = await cosmwasmClient.execute(
      address,
      contractAddress,
      {
        'update_price_feeds': {
          'data': [request_data]
        }
      },
      'auto',
      '',
      [coin(1, 'untrn')]
    );
     
   
    console.log('transactionHash:' + txResponse.transactionHash);

    //fetch the trigger orders
    const queryTriggerOrders = {
      all_trigger_orders: { 
      },
    };
    const redo = await wallet.getAccounts();
    const queryResponse = await cosmwasmClient.queryContractSmart(queryOrdersContractAddress, queryTriggerOrders);

    queryResponse.forEach((result: any) => {
      console.log(`Order ID: ${result.order_id}, Account ID: ${result.account_id}`);
      // result.order.actions.forEach((action: any, index: number) => {
      //   if (action.open_perp) {
      //     console.log(`  Action ${index + 1}: Open Perp - Denom: ${action.open_perp.denom}, Size: ${action.open_perp.size}`);
      //   }
      // });
      //console.log(`  Keeper Fee: ${result.order.keeper_fee.amount} ${result.order.keeper_fee.denom}`);
      result.order.triggers.forEach((trigger: any, index: number) => {
        if (trigger.price_trigger) {
          determineTrigger(address, cosmwasmClient,result.account_id, result.order_id, trigger, index)
        }
      });
  });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function getWallet(): Promise<SigningCosmWasmClient>{
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' });

  // neutron
  const cosmwasmClient = await SigningCosmWasmClient.connectWithSigner(
    rpcEndpoint,
    wallet,
    {
      gasPrice: GasPrice.fromString('0.25untrn'),
    }
  );

  return cosmwasmClient
}

async function updateOraclePrice(){
  let cosmwasmClient = await getWallet();
  //const vaas = await axios.get<ApiResponse[]>('https://hermes.pyth.network/api/latest_vaas?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819&ids[]=a8e6517966a52cb1df864b2764f3629fde3f21d2b640b5c572fcd654cbccd65e');
  const vaas = await axios.get<ApiResponse[]>('https://hermes.pyth.network/api/latest_vaas?ids[]=b00b60f88b03a6a625a8d1c048c3f66653edf217439983d037e7222c4e612819');

  //console.log(vaas.data[0]);
  let request_data = vaas.data[0]

  // get wallet address
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'neutron' });
  const addresses = await wallet.getAccounts();
  const address = addresses[0].address;

  const txResponse = await cosmwasmClient.execute(
    address,
    contractAddress,
    {
      'update_price_feeds': {
        'data': [request_data]
      }
    },
    'auto',
    '',
    [coin(1, 'untrn')]
  );
   
 
  console.log('transactionHash:' + txResponse.transactionHash);

}

function determineTrigger(address:string, cosmwasmClient: SigningCosmWasmClient,account_id: any, order_id:any, trigger: any, index:number): any {
  let price;
  switch (trigger.price_trigger.denom){
     //atom
     case 'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9':
        price = pricesDictionary["atom"]
     //untrn
     case 'untrn':
        price = pricesDictionary["untrn"]
  }
  
  if (trigger.price_trigger.trigger_type === 'less_than' && price > trigger.price_trigger.oracle_price ){
    console.log(`trigger less_than Trigger ${index + 1}: Price Trigger - Denom: ${trigger.price_trigger.denom},Oracle Price: ${pricesDictionary["untrn"]} ,trigger Price: ${trigger.price_trigger.oracle_price}, Type: ${trigger.price_trigger.trigger_type}`);
    executeTrigger(address, cosmwasmClient, account_id, order_id, trigger);
  }
  else if (trigger.price_trigger.trigger_type === 'greater_than' && price < trigger.price_trigger.oracle_price ){
    console.log(`trigger greater_than Trigger ${index + 1}: Price Trigger - Denom: ${trigger.price_trigger.denom}, Oracle Price: ${pricesDictionary["untrn"]}, trigger Price: ${trigger.price_trigger.oracle_price}, Type: ${trigger.price_trigger.trigger_type}`);
    executeTrigger(address, cosmwasmClient, account_id, order_id, trigger);
  }
}

async function executeTrigger(address:string, cosmwasmClient:SigningCosmWasmClient, account_id:any, order_id: any, trigger: any) :Promise<void>{
  const accountUpdateRequest: UpdateCreditAccount = {
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

  //console.log(JSON.stringify(accountUpdateRequest));
  

  //trigger execution call
  //const account = await cosmwasmClient.getAccount(address);
  //console.log("account sequence: " + account.sequence);
  try{
    const txResponse = await cosmwasmClient.execute(
      address,
      queryOrdersContractAddress,
      accountUpdateRequest,
      'auto',
      '',
      []
    );

    console.log("trigger order:" + txResponse.transactionHash)
  }
  catch(error){
    console.log(error.message)
  }
}




// cron job
setInterval(execute, 5000);