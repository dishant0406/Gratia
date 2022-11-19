import web3 from './web3.js'
import pateronFactory from './build/pateronFactory.json'

const instance = new web3.eth.Contract(JSON.parse(pateronFactory.interface), '0x034f32721eCe3ac5bfC94C525fadb15e0cB0B46F')

export default instance;