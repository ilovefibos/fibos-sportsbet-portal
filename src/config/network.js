export const networks = {
  testnet: {
    protocol: 'https',
    blockchain: 'fibos',
    host: 'testnet.fibos.fo',
    port: 443,
    chainId: '68cee14f598d88d340b50940b6ddfba28c444b46cd5f33201ace82c78896793a',
  },
  local: {
    blockchain: 'fibos',
    host: '127.0.0.1',
    port: 8888,
    protocol: 'http',
    chainId: '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a',
    verbose: true,
    debug: true,
  },
  fibosrocks: {
    protocol: 'https',
    blockchain: 'fibos',
    host: 'api.fibos.rocks',
    port: 443,
    chainId: '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a',
  },
}
export default networks
