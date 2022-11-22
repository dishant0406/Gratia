import web3 from './web3.js'
import pateronFactory from './build/pateronFactory.json'

const instance = new web3.eth.Contract(JSON.parse(pateronFactory.interface), '0x612076c29461d83a1385DF80c2FA8232B71E3244')

export default instance;