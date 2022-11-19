const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs-extra')
const Web3 = require('web3');
const pateronFactory = require('./build/pateronFactory.json')

const provider = new HDWalletProvider(
  'easy bunker pass enroll sausage tribe green suit slow party damage cake',
  // remember to change this to your own phrase!
  // 'https://frosty-capable-card.ethereum-goerli.discover.quiknode.pro/57a47e849babccd5f99103c5cbb07ce77eb22178/'
  'https://polygon-mumbai.infura.io/v3/65dbc40929444e25937620632bc7591f'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(pateronFactory.interface))
      .deploy({ data: pateronFactory.bytecode })
      .send({ gas: '10000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);

    const storeTheAddress = async () => {
      try {
        await fs.writeJson(`${__dirname}/deployedAddress.json`, { deployedAddress: result.options.address })
      } catch (err) {
        console.log(err)
      }
    }

    storeTheAddress()

    provider.engine.stop();
  } catch (err) {
    console.log(err)
  }
};
deploy();