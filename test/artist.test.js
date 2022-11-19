const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')

const options = { gasLimit: 8000000 };
const provider = ganache.provider(options);

//Web3 instance with the provider from ganache
const web3 = new Web3(provider)

//requiring the two contracts
const compiledFactoryCode = require('../eth/build/pateronFactory.json')
const compiledArtistCode = require('../eth/build/Artist.json')

//variables for later use
let accounts
let factory
let ArtistAddress
let artist

beforeEach(async () => {
  //getting the list of accounts
  accounts = await web3.eth.getAccounts()

  //deploying the contract
  //1. pass the compiledfactorycode interface as a object to web3.eth.Contract
  //2. then pass the bytecode as data in deploy
  //then use the account at 0 index with gas to send and deploy

  factory = await new web3.eth.Contract(JSON.parse(compiledFactoryCode.interface))
    .deploy({ data: compiledFactoryCode.bytecode })
    .send({ from: accounts[0], gas: '6000000' })

  //creating the campaign using the method in the factory contract
  await factory.methods.createArtist('Hello world', '10000', 'hwllo', 'youtube', 'insta', 'twitch').send({ from: accounts[0], gas: '1000000' })

  //getting the address of the deployed contract that is stored inside the contract in a array
  const addressesArray = await factory.methods.getArtist().call()
  ArtistAddress = addressesArray[0]

  //getting the campaign that is deployed using the web3.contract method
  //and passing the interface of the code with the deployed address
  artist = await new web3.eth.Contract(JSON.parse(compiledArtistCode.interface), ArtistAddress)
})

describe('Campaign', () => {
  it('Deploys a Factory', () => {
    assert.ok(factory.options.address)
  })

  it('Factory Deploys a Contract', () => {
    assert.ok(artist.options.address)
  })

  it('Manager is the person who deployed the contract', async () => {

    const manager = await artist.methods.manager().call()
    assert.equal(manager, accounts[0])
  })

  it('Users can subscribe to the artist', async () => {
    await artist.methods.registerUser().send({
      value: '200000',
      from: accounts[1]
    })

    const isAvailable = await artist.methods.subscribedUsers(accounts[1]).call();
    assert.equal(isAvailable, true);
  })
})