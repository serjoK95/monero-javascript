const TestMoneroWalletCommon = require("./TestMoneroWalletCommon");
let MoneroWalletWasm;	// async import before tests run

/**
 * Tests a Monero wallet using WebAssembly to bridge to monero-project's wallet2.
 */
class TestMoneroWalletWasm extends TestMoneroWalletCommon {
  
  constructor() {
    super(TestUtils.getDaemonRpc());
  }
  
  async getTestWallet() {
    return TestUtils.getWalletWasm();
  }
  
  async createRandomWallet() {
    let wallet = await MoneroWalletWasm.createWalletRandom(TestUtils.TEST_WALLETS_DIR + "/" + GenUtils.uuidv4(), TestUtils.WALLET_PASSWORD, TestUtils.NETWORK_TYPE, TestUtils.getDaemonRpc().getRpcConnection());
    //await wallet.startSyncing();  // TODO
    return wallet;
  }
  
  async openWallet(path) {
    let wallet = await MoneroWalletWasm.openWallet(path, TestUtils.WALLET_PASSWORD, TestUtils.NETWORK_TYPE, TestUtils.getDaemonRpc().getRpcConnection());
    return wallet;
  }
  
  runTests(config) {
    let that = this;
    describe("TEST MONERO WALLET WASM", function() {
      
      // initialize wallet
      before(async function() {
        MoneroWalletWasm = await require("../main/js/wallet/MoneroWalletWasm")();
        that.wallet = await that.getTestWallet(); // TODO: update in TestMoneroWalletWasm.js
        TestUtils.TX_POOL_WALLET_TRACKER.reset(); // all wallets need to wait for txs to confirm to reliably sync
      });
      
      // save wallet after tests
      after(async function() {
        console.log("Saving wallet on shut down");
        await that.wallet.save();
      });
      
      // run tests specific to wallet wasm
      that._testWalletWasm(config);
      
      // run common tests
      that.runCommonTests(config);
    });
  }
  
  // ---------------------------------- PRIVATE -------------------------------
  
  _testWalletWasm(config) {
    let that = this;
    let daemon = this.daemon;
    describe("Tests specific to WASM wallet", function() {
      
      // ---------------------------- BEGIN TESTS ---------------------------------

      // TODO
//      it("Can create a wallet from a mnemonic phrase", async function() {
//        let err;
//        try {
//          
//          // create wallet with mnemonic and defaults
//          let path = GenUtils.uuidv4();
//          await that.wallet.createWalletFromMnemonic(path, TestUtils.WALLET_PASSWORD, TestUtils.MNEMONIC, TestUtils.FIRST_RECEIVE_HEIGHT);
//          assert.equal(await that.wallet.getMnemonic(), TestUtils.MNEMONIC);
//          assert.equal(await that.wallet.getPrimaryAddress(), TestUtils.ADDRESS);
//          if (await that.wallet.getHeight() !== 1) console.log("WARNING: createWalletFromMnemonic() already has height as if synced");
//          if ((await that.wallet.getTxs()).length !== 0) console.log("WARNING: createWalletFromMnemonic() already has txs as if synced");
//          //assert.equal(await that.wallet.getHeight(), 1);                               // TODO monero core: sometimes height is as if synced
//          //assert.equal((await that.wallet.getTxs()).length, 0); // wallet is not synced // TODO monero core: sometimes wallet has txs as if synced
//          await that.wallet.sync();
//          assert.equal(await that.wallet.getHeight(), await daemon.getHeight());
//          let txs = await that.wallet.getTxs();
//          assert(txs.length > 0); // wallet is used
//          assert.equal(txs[0].getHeight(), TestUtils.FIRST_RECEIVE_HEIGHT);
//          await that.wallet.close();
//          
//          // create wallet with non-defaults
//          path = GenUtils.uuidv4();
//          await that.wallet.createWalletFromMnemonic(path, TestUtils.WALLET_PASSWORD, TestUtils.MNEMONIC, TestUtils.FIRST_RECEIVE_HEIGHT, "German", "my offset!", false);
//          MoneroUtils.validateMnemonic(await that.wallet.getMnemonic());
//          assert.notEqual(await that.wallet.getMnemonic(), TestUtils.MNEMONIC);  // mnemonic is different because of offset
//          assert.notEqual(await that.wallet.getPrimaryAddress(), TestUtils.ADDRESS);
//          assert.equal(await that.wallet.getHeight(), 1);
//          await that.wallet.close();
//          
//        } catch (e) {
//          console.log("Caught error so will call open!");
//          err = e;
//        }
//        
//        // open main test wallet for other tests
//        await that.wallet.openWallet(TestUtils.WALLET_RPC_NAME_1, TestUtils.WALLET_PASSWORD);
//        
//        // throw error if there was one
//        if (err) throw err;
//      });
//      
//      it("Can open wallets", async function() {
//        let err;
//        try {
//          
//          // create names of test wallets
//          let numTestWallets = 3;
//          let names = [];
//          for (let i = 0; i < numTestWallets; i++) names.add(GenUtils.uuidv4());
//          
//          // create test wallets
//          let mnemonics = [];
//          for (let name of names) {
//            await that.wallet.createWalletRandom(name, TestUtils.WALLET_PASSWORD);
//            mnemonics.add(await that.wallet.getMnemonic());
//            await that.wallet.close();
//          }
//          
//          // open test wallets
//          for (let i = 0; i < numTestWallets; i++) {
//            await that.wallet.openWallet(names[i], TestUtils.WALLET_PASSWORD);
//            assert.equal(await that.wallet.getMnemonic(), mnemonics[i]);
//            await that.wallet.close();
//          }
//          
//          // attempt to re-open already opened wallet
//          try {
//            await that.wallet.openWallet(names[numTestWallets - 1], TestUtils.WALLET_PASSWORD);
//          } catch (e) {
//            assert.equal(e.getCode(), -1);
//          }
//          
//          // attempt to open non-existent
//          try {
//            await that.wallet.openWallet("btc_integrity", TestUtils.WALLET_PASSWORD);
//          } catch (e) {
//            assert.equal( e.getCode(), -1);  // -1 indicates wallet does not exist (or is open by another app)
//          }
//        } catch (e) {
//          let err = e;
//        }
//        
//        // open main test wallet for other tests
//        try {
//          await that.wallet.openWallet(TestUtils.WALLET_RPC_NAME_1, TestUtils.WALLET_PASSWORD);
//        } catch (e) {
//          assert.equal(e.getCode(), -1); // ok if wallet is already open
//        }
//        
//        // throw error if there was one
//        if (err) throw err;
//      });
//      
//      it("Can indicate if multisig import is needed for correct balance information", async function() {
//        assert.equal(await that.wallet.isMultisigImportNeeded(), false); // TODO: test with multisig wallet
//      });
//
//      it("Can tag accounts and query accounts by tag", async function() {
//        
//        // get accounts
//        let accounts = await that.wallet.getAccounts();
//        assert(accounts.length >= 3, "Not enough accounts to test; run create account test");
//        
//        // tag some of the accounts
//        let tag = new MoneroAccountTag("my_tag_" + GenUtils.uuidv4(), "my tag label", [0, 1]);
//        await that.wallet.tagAccounts(tag.getTag(), tag.getAccountIndices());
//        
//        // query accounts by tag
//        let taggedAccounts = await that.wallet.getAccounts(undefined, tag.getTag());
//        assert.equal(taggedAccounts.length, 2);
//        assert.equal(taggedAccounts[0].getIndex(), 0);
//        assert.equal(taggedAccounts[0].getTag(), tag.getTag());
//        assert.equal(taggedAccounts[1].getIndex(), 1);
//        assert.equal(taggedAccounts[1].getTag(), tag.getTag());
//
//        // set tag label
//        await that.wallet.setAccountTagLabel(tag.getTag(), tag.getLabel());
//        
//        // fetch tags and ensure new tag is contained
//        let tags = await that.wallet.getAccountTags();
//        assert(GenUtils.arrayContains(tags, tag));
//        
//        // re-tag an account
//        let tag2 = new MoneroAccountTag("my_tag_" + GenUtils.uuidv4(), "my tag label 2", [1]);
//        await that.wallet.tagAccounts(tag2.getTag(), tag2.getAccountIndices());
//        let taggedAccounts2 = await that.wallet.getAccounts(undefined, tag2.getTag())
//        assert.equal(taggedAccounts2.length, 1);
//        assert.equal(taggedAccounts2[0].getIndex(), 1);
//        assert.equal(taggedAccounts2[0].getTag(), tag2.getTag());
//        
//        // re-query original tag which only applies to one account now
//        taggedAccounts = await that.wallet.getAccounts(undefined, tag.getTag());
//        assert.equal(taggedAccounts.length, 1);
//        assert.equal(taggedAccounts[0].getIndex(), 0);
//        assert.equal(taggedAccounts[0].getTag(), tag.getTag());
//        
//        // untag and query accounts
//        await that.wallet.untagAccounts([0, 1]);
//        assert.equal((await that.wallet.getAccountTags()).length, 0);
//        try {
//          await that.wallet.getAccounts(undefined, tag.getTag());
//          fail("Should have thrown exception with unregistered tag");
//        } catch (e) {
//          assert.equal(e.getCode(), -1);
//        }
//        
//        // test that non-existing tag returns no accounts
//        try {
//          await that.wallet.getAccounts(undefined, "non_existing_tag");
//          fail("Should have thrown exception with unregistered tag");
//        } catch (e) {
//          assert.equal(e.getCode(), -1);
//        }
//      });
//      
//      it("Can fetch accounts and subaddresses without balance info because this is another RPC call", async function() {
//        let accounts = await that.wallet.getAccounts(true, undefined, true);
//        assert(accounts.length > 0);
//        for (let account of accounts) {
//          assert(account.getSubaddresses().length > 0);
//          for (let subaddress of account.getSubaddresses()) {
//            assert.equal(typeof subaddress.getAddress(), "string");
//            assert(subaddress.getAddress().length > 0);
//            assert(subaddress.getAccountIndex() >= 0);
//            assert(subaddress.getIndex() >= 0);
//            assert(subaddress.getLabel() === undefined || typeof subaddress.getLabel() === "string");
//            if (typeof subaddress.getLabel() === "string") assert(subaddress.getLabel().length > 0);
//            assert.equal(typeof subaddress.isUsed(), "boolean");
//            assert.equal(subaddress.getNumUnspentOutputs(), undefined);
//            assert.equal(subaddress.getBalance(), undefined);
//            assert.equal(subaddress.getUnlockedBalance(), undefined);
//          }
//        }
//      });
//      
//      it("Has an address book", async function() {
//        
//        // initial state
//        let entries = await that.wallet.getAddressBookEntries();
//        let numEntriesStart = entries.length
//        for (let entry of entries) testAddressBookEntry(entry);
//        
//        // test adding standard addresses
//        const NUM_ENTRIES = 5;
//        let address = (await that.wallet.getSubaddress(0, 0)).getAddress();
//        let indices = [];
//        for (let i = 0; i < NUM_ENTRIES; i++) {
//          indices.push(await that.wallet.addAddressBookEntry(address, "hi there!"));
//        }
//        entries = await that.wallet.getAddressBookEntries();
//        assert.equal(entries.length, numEntriesStart + NUM_ENTRIES);
//        for (let idx of indices) {
//          let found = false;
//          for (let entry of entries) {
//            if (idx === entry.getIndex()) {
//              testAddressBookEntry(entry);
//              assert.equal(entry.getAddress(), address);
//              assert.equal(entry.getDescription(), "hi there!");
//              found = true;
//              break;
//            }
//          }
//          assert(found, "Index " + idx + " not found in address book indices");
//        }
//        
//        // delete entries at starting index
//        let deleteIdx = indices[0];
//        for (let i = 0; i < indices.length; i++) {
//          await that.wallet.deleteAddressBookEntry(deleteIdx);
//        }
//        entries = await that.wallet.getAddressBookEntries();
//        assert.equal(entries.length, numEntriesStart);
//        
//        // test adding integrated addresses
//        indices = [];
//        let paymentId = "03284e41c342f03"; // payment id less one character
//        let integratedAddresses = {};
//        let integratedDescriptions = {};
//        for (let i = 0; i < NUM_ENTRIES; i++) {
//          let integratedAddress = await that.wallet.getIntegratedAddress(paymentId + i); // create unique integrated address
//          let uuid = GenUtils.uuidv4();
//          let idx = await that.wallet.addAddressBookEntry(integratedAddress.toString(), uuid);
//          indices.push(idx);
//          integratedAddresses[idx] = integratedAddress;
//          integratedDescriptions[idx] = uuid;
//        }
//        entries = await that.wallet.getAddressBookEntries();
//        assert.equal(entries.length, numEntriesStart + NUM_ENTRIES);
//        for (let idx of indices) {
//          let found = false;
//          for (let entry of entries) {
//            if (idx === entry.getIndex()) {
//              testAddressBookEntry(entry);
//              assert.equal(entry.getDescription(), integratedDescriptions[idx]);
//              assert.equal(entry.getAddress(), integratedAddresses[idx].getStandardAddress());
//              assert(MoneroUtils.paymentIdsEqual(integratedAddresses[idx].getPaymentId(), entry.getPaymentId()));
//              found = true;
//              break;
//            }
//          }
//          assert(found, "Index " + idx + " not found in address book indices");
//        }
//        
//        // delete entries at starting index
//        deleteIdx = indices[0];
//        for (let i = 0; i < indices.length; i++) {
//          await that.wallet.deleteAddressBookEntry(deleteIdx);
//        }
//        entries = await that.wallet.getAddressBookEntries();
//        assert.equal(entries.length, numEntriesStart);
//      });
//      
//      it("Can rescan spent", async function() {
//        await that.wallet.rescanSpent();
//      });
//      
//      it("Can save the wallet file", async function() {
//        await that.wallet.save();
//      });
//      
//      it("Can close a wallet", async function() {
//        
//        // create a test wallet
//        let path = GenUtils.uuidv4();
//        await that.wallet.createWalletRandom(path, TestUtils.WALLET_PASSWORD);
//        await that.wallet.sync();
//        assert((await that.wallet.getHeight()) > 1);
//        
//        // close the wallet
//        await that.wallet.close();
//        
//        // attempt to interact with the wallet
//        try {
//          await that.wallet.getHeight();
//        } catch (e) {
//          assert.equal(e.getCode(), -13);
//          assert.equal(e.message, "No wallet file");
//        }
//        try {
//          await that.wallet.getMnemonic();
//        } catch (e) {
//          assert.equal(e.getCode(), -13);
//          assert.equal(e.message, "No wallet file");
//        }
//        try {
//          await that.wallet.sync();
//        } catch (e) {
//          assert.equal(e.getCode(), -13);
//          assert.equal(e.message, "No wallet file");
//        }
//        
//        // re-open the wallet
//        await that.wallet.openWallet(path, TestUtils.WALLET_PASSWORD);
//        await that.wallet.sync();
//        assert.equal(await that.wallet.getHeight(), await daemon.getHeight());
//        
//        // close the wallet
//        await that.wallet.close();
//        
//        // re-open main test wallet for other tests
//        await that.wallet.openWallet(TestUtils.WALLET_RPC_NAME_1, TestUtils.WALLET_PASSWORD);
//      });
//      
//      if (false)  // disabled so server not actually stopped
//      it("Can stop the RPC server", async function() {
//        await that.wallet.stop();
//      });
    });
  }
}

///**
// * Internal class to test progress updates.
// */
//class SyncProgressTester {
//  
//  constructor(wallet, startHeight, endHeight, noMidway, noProgress) {
//    assert(wallet);
//    assert(startHeight >= 0);
//    assert(endHeight >= 0);
//    this.wallet = wallet;
//    this.startHeight = startHeight;
//    this.endHeight = endHeight;
//    this.noMidway = noMidway;
//    this.noProgress = noProgress;
//    this.firstProgress = undefined;
//    this.lastProgress = undefined;
//    this.midwayFound = false;
//  }
//  
//  onProgress(progress) {
//    assert(!this.noProgress, "Should not call progress");
//    assert.equal(progress.totalBlocks, this.endHeight - this.startHeight + 1);
//    assert(progress.doneBlocks >= 0 && progress.doneBlocks <= progress.totalBlocks);
//    if (this.noMidway) assert(progress.percent === 0 || progress.percent === 1);
//    if (progress.percent > 0 && progress.percent < 1) this.midwayFound = true;
//    assert(progress.message);
//    if (this.firstProgress == undefined) {
//      this.firstProgress = progress;
//      assert(progress.percent === 0);
//      assert(progress.doneBlocks === 0);
//    } else {
//      assert(progress.percent > this.lastProgress.percent);
//      assert(progress.doneBlocks >= this.lastProgress.doneBlocks && progress.doneBlocks <= progress.totalBlocks);
//    }
//    this.lastProgress = progress;
//  }
//  
//  testDone() {
//    
//    // nothing to test if no progress called
//    if (this.noProgress) {
//      assert(!this.firstProgress);
//      return;
//    }
//    
//    // test first progress
//    assert(this.firstProgress, "Progress was never updated");
//    assert.equal(this.firstProgress.percent, 0);
//    assert.equal(this.firstProgress.doneBlocks, 0);
//    
//    // test midway progress
//    if (this.endHeight > this.startHeight && !this.noMidway) assert(this.midwayFound, "No midway progress reported but it should have been");
//    else assert(!this.midwayFound, "No midway progress should have been reported but it was");
//    
//    // test last progress
//    assert.equal(this.lastProgress.percent, 1);
//    assert.equal(this.lastProgress.doneBlocks, this.endHeight - this.startHeight + 1);
//    assert.equal(this.lastProgress.totalBlocks, this.lastProgress.doneBlocks);
//  }
//}

module.exports = TestMoneroWalletWasm;
