import web3 from './web3.js'
import pateronFactory from './build/pateronFactory.json'

const instance = new web3.eth.Contract(JSON.parse(pateronFactory.interface), '0x814aB90a3C49ab63954c959d67E8cfFf95897BC1')

export default instance;