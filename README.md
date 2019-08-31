# Monero JavaScript Library

This project is a library for using a Monero wallet and daemon in JavaScript using RPC bindings to [monero-wallet-rpc](https://getmonero.org/resources/developer-guides/wallet-rpc.html) and [monero-daemon-rpc](https://getmonero.org/resources/developer-guides/daemon-rpc.html).

In addition, this project conforms to an [API specification](http://moneroecosystem.org/monero-java/monero-spec.pdf) intended to be intuitive, robust, and for long-term use in the Monero project.

## Main Features

- Manage a Monero wallet and daemon using RPC
- Cohesive APIs with rigorous focus on ease-of-use
- Fetch and process binary data from the daemon (e.g. raw blocks)
- Query wallet transactions, transfers, and outputs by their many attributes
- Be notified when blocks are added to the chain
- Full multisig support
- Over 130 passing Mocha tests

## Sample Code

This code introduces the API.  See the [jsdoc](https://moneroecosystem.org/monero-javascript/), [specification PDF](http://moneroecosystem.org/monero-java/monero-spec.pdf), or [Mocha tests](src/test/) for more details.

```js
// create a wallet that uses a monero-wallet-rpc endpoint
let wallet = new MoneroWalletRpc({
  uri: "http://localhost:38083",
  user: "rpc_user",
  pass: "abc123"
});

// get wallet balance as BigInteger
let balance = await wallet.getBalance();  // e.g. 533648366742
   
// get wallet primary address
let primaryAddress = await wallet.getPrimaryAddress();  // e.g. 59aZULsUF3YNSKGiHz4J...
    
// get address and balance of subaddress [1, 0]
let subaddress = await wallet.getSubaddress(1, 0);
let subaddressBalance = subaddress.getBalance();
let subaddressAddress = subaddress.getAddress();

// get incoming and outgoing transfers
let transfers = await wallet.getTransfers();
for (let transfer of transfers) {
  let isIncoming = transfer.getIsIncoming();
  let amount = transfer.getAmount();
  let accountIdx = transfer.getAccountIndex();
  let height = transfer.getTx().getHeight();  // will be undefined if unconfirmed
}

// get incoming transfers to account 0
transfers = await wallet.getTransfers(new MoneroTransferRequest().setAccountIndex(0).setIsIncoming(true));
for (let transfer of transfers) {
  assert(transfer.getIsIncoming());
  assert.equal(transfer.getAccountIndex(), 0);
  let amount = transfer.getAmount();
  let height = transfer.getTx().getHeight();  // will be undefined if unconfirmed
}

// send to an address from account 0
let sentTx = await wallet.send(0, "74oAtjgE2dfD1bJBo4DW...", new BigInteger(50000));

// send to multiple destinations from multiple subaddresses in account 1 which can be split into multiple transactions
// see MoneroSendRequest.js for all request options
let sentTxs = await wallet.sendSplit({
  destinations: [
    { address: "7BV7iyk9T6kfs7cPfmn7...", amount: new BigInteger(50000) },
    { address: "78NWrWGgyZeYgckJhuxm...", amount: new BigInteger(50000) }
  ],
  accountIndex: 1,
  subaddressIndices: [0, 1],
  priority: MoneroSendPriority.UNIMPORTANT // no rush
});

// get all confirmed wallet transactions
for (let tx of await wallet.getTxs(new MoneroTxRequest().setIsConfirmed(true))) {
  let txId = tx.getId();                  // e.g. f8b2f0baa80bf6b...
  let txFee = tx.getFee();                // e.g. 750000
  let isConfirmed = tx.getIsConfirmed();  // e.g. true
}

// get a wallet transaction by id
let tx = await wallet.getTx("69a0d27a3e019526cb5a969ce9f65f1433b8069b68b3ff3c6a5b992a2983f7a2");
let txId = tx.getId();                  // e.g. 69a0d27a3e019526c...
let txFee = tx.getFee();                // e.g. 750000
let isConfirmed = tx.getIsConfirmed();  // e.g. true

// get confirmed transactions
for (let tx of await wallet.getTxs({isConfirmed: true})) {
  let txId = tx.getId();                 // e.g. f8b2f0baa80bf6b...
  let txFee = tx.getFee();               // e.g. 750000
  let isConfirmed = tx.getIsConfirmed(); // e.g. true
}
```

## Daemon Sample Code

```js
  // imports
  const MoneroDaemonRpc = require("../src/daemon/MoneroDaemonRpc");
  
  // create a daemon that uses a monero-daemon-rpc endpoint
  let daemon = new MoneroDaemonRpc({uri: "http://localhost:38081"});
  
  // get daemon info
  let height = await daemon.getHeight();           // e.g. 1523651
  let feeEstimate = await daemon.getFeeEstimate(); // e.g. 750000
  
  // get first 100 blocks as a binary request
  let blocks = await daemon.getBlocksByRange(0, 100);
  
  // get block info
  for (let block of blocks) {
    let blockHeight = block.getHeight();
    let blockId = block.getId();
    let txCount = block.getTxs().length;
  }
  
  // start mining to an address with 4 threads, not in the background, and ignoring the battery
  let address = "74oAtjgE2dfD1bJBo4DWW3E6qXCAwUDMgNqUurnX9b2xUvDTwMwExiXDkZskg7Vct37tRGjzHRqL4gH4H3oag3YyMYJzrNp";
  let numThreads = 4;
  let isBackground = false;
  let ignoreBattery = false;
  await daemon.startMining(address, numThreads, isBackground, ignoreBattery);
  
  // wait for the header of the next block added to the chain
  let nextBlockHeader = await daemon.getNextBlockHeader();
  let nextNumTxs = nextBlockHeader.getNumTxs();
  
  // stop mining
  await daemon.stopMining();
```

## How to Use This Library

1. Clone the JavaScript repository: `git clone --recurse-submodules https://github.com/monero-ecosystem/monero-javascript.git`
2. Install dependencies using Node Package Manager: `npm install`

You are now ready to use this library with [monero-daemon-rpc](https://getmonero.org/resources/developer-guides/daemon-rpc.html) and [monero-wallet-rpc](https://getmonero.org/resources/developer-guides/wallet-rpc.html) endpoints.

## How to Set Up Monero RPC

1. Download and extract the latest [Monero CLI](https://getmonero.org/downloads/) for your platform.
2. Start Monero daemon locally: `./monerod --stagenet` (or use a remote daemon).
3. Create a wallet file if one does not exist.
	- Create new / open existing: `./monero-wallet-cli --daemon-address http://localhost:38081 --stagenet`
	- Restore from mnemonic seed: `./monero-wallet-cli --daemon-address http://localhost:38081 --stagenet --restore-deterministic-wallet`
4. Start monero-wallet-rpc (requires --wallet-dir to run tests):
	
	e.g. For wallet name `test_wallet_1`, user `rpc_user`, password `abc123`, stagenet: `./monero-wallet-rpc --daemon-address http://localhost:38081 --stagenet --rpc-bind-port 38083 --rpc-login rpc_user:abc123 --wallet-dir /Applications/monero-v0.14.0.3`

## How to Run Tests

1. Download this project and install its dependenices.  See [How to Use This Library](#how-to-use-this-library).
2. Run [monero-wallet-rpc](https://getmonero.org/resources/developer-guides/wallet-rpc.html) and [monero-daemon-rpc](https://getmonero.org/resources/developer-guides/daemon-rpc.html).  See [How to Set Up Monero RPC](#how-to-set-up-monero-rpc).
3. Configure the desired RPC endpoints and authentication by modifying `WALLET_RPC_CONFIG` and `DAEMON_RPC_CONFIG` in [TestUtils.js](src/test/TestUtils.js).
4. Run all tests: `npm test` or run tests by their description: `node_modules/mocha/bin/mocha src/test/TestAll --grep "Can get transactions by id" --timeout 2000000`

## Project Goals

- Offer consistent terminology and APIs for Monero's developer ecosystem
- Build a wallet adapter for a local wallet which uses client-side crypto and a daemon
- Build a wallet adapter for a MyMonero wallet which shares the view key with a 3rd party to scan the blockchain

## See Also

These libraries conform to the same [API specification](http://moneroecosystem.org/monero-java/monero-spec.pdf).

[Java reference implementation](https://github.com/monero-ecosystem/monero-java)

[C++ reference implementation](https://github.com/woodser/monero-cpp-library)

## License

This project is licensed under MIT.

## Donate

Donations are gratefully accepted.  Thank you for your support!

<p align="center">
	<img src="donate.png" width="115" height="115"/>
</p>

`46FR1GKVqFNQnDiFkH7AuzbUBrGQwz2VdaXTDD4jcjRE8YkkoTYTmZ2Vohsz9gLSqkj5EM6ai9Q7sBoX4FPPYJdGKQQXPVz`