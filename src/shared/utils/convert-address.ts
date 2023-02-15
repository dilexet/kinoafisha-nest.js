import { Address } from '../../database/entity/address';

export function convertAddress(address: Address): string {
  return `${address.houseNumber} ${address.street}, ${address.city}, ${address.country}`;
}
