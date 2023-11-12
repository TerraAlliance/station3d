import { useEffect, useState, useMemo } from "react"
import { useWallet, useConnectedWallet, getInitialConfig } from "@terra-money/wallet-kit"
import { LCDClient as InterchainLCDClient } from "@terra-money/feather.js"
import { LCDClient } from "@terra-money/terra.js"

import { station } from "./state"

export function useInterchainLCDClient() {
  const connected = useConnectedWallet()
  const { network } = useWallet()

  useEffect(() => {
    if (connected) {
      if (station.chainID.get() !== getChainID(connected.network)) {
        station.lcd.set(new InterchainLCDClient(network))
        station.chainID.set(getChainID(connected.network))
      }
      station.address.set(connected.addresses[getChainID(connected.network)])
    } else {
      station.chainID.set("phoenix-1")
      getInitialConfig().then((defaultNetworks) => {
        station.lcd.set((p) => p || new InterchainLCDClient(defaultNetworks))
      })
    }
  }, [connected])
}

export function useTerraLCDClient() {
  const { network } = useWallet()
  const chainID = station.chainID.use()
  const lcdClient = useMemo(() => new LCDClient({ ...network?.[chainID], URL: network?.[chainID].lcd }), [network, chainID])
  return lcdClient
}

export function useQueries() {
  const lcd = station.lcd.use()
  const chainID = station.chainID.use()
  const address = station.address.use()
  // const address = "terra1j27nm2gjm0m4lsye8lspa46rax0rw4fge9awrs"

  const fetchTxs = async () => {
    let txs = []
    for (const key of ["message.sender", "transfer.recipient", "transfer.sender"]) {
      const { txs: newTxs } = await lcd.tx.search({ events: [{ key: key, value: address }], "pagination.limit": 999 }, chainID)
      txs = [...txs, ...(newTxs.reverse() || [])]
    }
    txs = txs.filter((tx, index, self) => self.findIndex((t) => t.txhash === tx.txhash) === index)
    station.data.tx.history.set(txs)
  }

  useEffect(() => {
    if (lcd && Object.keys(lcd.config).includes(chainID)) {
      lcd.bank.total(chainID, { "pagination.limit": 999 }).then(([coins]) => station.data.balance.total.set(coins._coins))
      address && lcd.bank.spendableBalances(address).then(([coins]) => station.data.bank.balance.set(coins))
      lcd.gov.proposals(chainID, { "pagination.limit": 100, proposal_status: 2 }).then(([proposals]) => station.data.govern.proposals.set(proposals))
      lcd.gov.parameters(chainID).then((parameters) => station.data.govern.parameters.set(parameters))
      lcd.staking.validators(chainID, { "pagination.limit": 999 }).then(([validators]) => station.data.stake.validators.set(validators.filter((obj) => obj.status !== "BOND_STATUS_UNBONDED")))
      lcd.staking.pool(chainID).then((pool) => station.data.stake.total.set(pool.bonded_tokens.amount.toString()))
      address && lcd.staking.delegations(address).then(([delegations]) => station.data.stake.delegations.set(delegations))

      address &&
        lcd.distribution.rewards(address).then((rewards) => {
          for (const key in rewards.rewards) {
            for (const coin in rewards.rewards[key]._coins) {
              rewards.rewards[key]._coins[coin].amount = rewards.rewards[key]._coins[coin].amount.toString()
            }
          }
          for (const coin in rewards.total._coins) {
            rewards.total._coins[coin].amount.constructor = rewards.total._coins[coin].amount.constructor.toString()
          }
          station.data.distribution.rewards.set(rewards)
        })

      address && fetchTxs()
    }
  }, [lcd, chainID, address])
}

export function useGas(msg) {
  const lcd = station.lcd.use()
  const chainID = station.chainID.use()
  const address = station.address.use()

  const { network } = useWallet()
  const [gas, setGas] = useState(null)

  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    const fetchGasLimit = async () => {
      setFetching(true)

      const t = await lcd.tx.create([{ address: address }], {
        ...msg,
        gasAdjustment: network?.[chainID]?.gasAdjustment,
        feeDenoms: ["uluna"],
      })

      setGas(t.auth_info.fee.gas_limit)
      setFetching(false)
    }
    !fetching && msg.msgs && fetchGasLimit()
  }, [msg])

  return gas
}

export function useGasPrice() {
  const chainID = station.chainID.use()
  const { network } = useWallet()
  if (network) return network[chainID]?.gasPrices["uluna"]
}

export function useTaxRate() {
  const chainID = station.chainID.use()

  const terralcd = useTerraLCDClient()
  const [taxrate, setTaxrate] = useState(null)

  useEffect(() => {
    if (chainID === "columbus-5") {
      terralcd.treasury.taxRate().then((t) => setTaxrate(Number(t)))
    }
  }, [])

  return taxrate
}

const getChainID = (network) => {
  switch (network) {
    case "mainnet":
      return "phoenix-1"
    case "testnet":
      return "pisco-1"
    case "classic":
      return "columbus-5"
    case "localterra":
      return "localterra"
  }
}
