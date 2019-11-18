import { BigDecimal } from '@graphprotocol/graph-ts'
import { Transfer } from './types/Socks/Socks'
import { SockOwner, SockManufacturer } from './types/schema'

export function handleTransfer(event: Transfer): void {
  let sockToID = event.params.to.toHex()
  let userTo = SockOwner.load(sockToID)
  if (userTo == null) {
    userTo = new SockOwner(sockToID)
    userTo.sockBalance = BigDecimal.fromString('0')
  }
  userTo.sockBalance = userTo.sockBalance.plus(
    event.params.value.toBigDecimal()
    .div(bigDecimalExp18())
  )
  userTo.save()

  let userFromID = event.params.from.toHex()
  let userFrom = SockOwner.load(userFromID)
  if (userFrom == null) {
    userFrom = new SockOwner(userFromID)
    userFrom.sockBalance = BigDecimal.fromString('0')
  }
  userFrom.sockBalance = userFrom.sockBalance.plus(
    event.params.value.toBigDecimal()
    .div(bigDecimalExp18())
  )
  userFrom.save()

  let manufacturer = SockManufacturer.load('Unisocks Edition 0')
  if (manufacturer == null) {
    manufacturer = new SockManufacturer('1')
    manufacturer.symbol = 'SOCKS'
    manufacturer.decimals = 18
    manufacturer.totalSupply = BigDecimal.fromString("500").times(bigDecimalExp18())
    manufacturer.save()
  }
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString('1000000000000000000')
}

export function zeroBD(): BigDecimal {
  return BigDecimal.fromString('0')
}
