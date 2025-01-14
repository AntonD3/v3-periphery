import 'hardhat-typechain'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-watcher'
import '@matterlabs/hardhat-zksync-solc'
import '@matterlabs/hardhat-zksync-verify'
import { subtask } from 'hardhat/config'
import * as path from 'path'
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from 'hardhat/builtin-tasks/task-names'

const NFT_DESCRIPTOR_PATH = 'contracts/libraries/NFTDescriptor.sol'
const NFT_DESCRIPTOR_NAME = 'NFTDescriptor'
const CONTRACTS_USES_NFT_DESCRIPTOR = ['NonfungibleTokenPositionDescriptor.sol', 'test/NFTDescriptorTest.sol']

subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS, async (_, { config }, runSuper) => {
  const paths = await runSuper()

  if (config.zksolc.settings.libraries !== undefined) {
    if (config.zksolc.settings.libraries[NFT_DESCRIPTOR_PATH] !== undefined) {
      if (config.zksolc.settings.libraries[NFT_DESCRIPTOR_PATH][NFT_DESCRIPTOR_NAME] !== undefined) {
        return paths
      }
    }
  }
  return paths.filter((solidityFilePath: any) => {
    const relativePath = path.relative(config.paths.sources, solidityFilePath)
    return !CONTRACTS_USES_NFT_DESCRIPTOR.includes(relativePath)
  })
})

export default {
  networks: {
    zkSyncTestNode: {
      url: 'http://localhost:8011',
      ethNetwork: '',
      zksync: true,
    },
    zkSyncTestnet: {
      url: 'https://testnet.era.zksync.dev',
      ethNetwork: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      zksync: true,
      verifyURL: 'https://zksync2-testnet-explorer.zksync.dev/contract_verification',
    },
    zkSyncTestnetSepolia: {
      url: 'https://sepolia.era.zksync.dev',
      ethNetwork: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      zksync: true,
      verifyURL: 'https://explorer.sepolia.era.zksync.dev/contract_verification',
    },
    zkSyncMainnet: {
      url: 'https://mainnet.era.zksync.io',
      ethNetwork: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      zksync: true,
      verifyURL: 'https://zksync2-mainnet-explorer.zksync.io/contract_verification',
    },
  },
  defaultNetwork: 'zkSyncTestNode',
  solidity: {
    version: '0.7.6',
  },
  zksolc: {
    version: '1.3.13',
    compilerSource: 'binary',
    settings: {
      metadata: {
        bytecodeHash: 'none',
      },
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
  mocha: {
    timeout: 100000000,
  },
}
