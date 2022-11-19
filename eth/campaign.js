import web3 from "./web3";
import ArtistJson from './build/Artist.json'

export default (id) => {
  return new web3.eth.Contract(JSON.parse(ArtistJson.interface), id)
}