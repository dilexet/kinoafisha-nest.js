import { Address } from '../../database/entity/address';

export function convertAddressToString(address: Address): string {
  return `${address.houseNumber} ${address.street}, ${address.city}, ${address.country}`;
}
