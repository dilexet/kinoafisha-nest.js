import { AutoMap } from '@automapper/classes';
import { UserBookedOrderViewDto } from './user-booked-order-view.dto';
import { UserProfileUpdateViewDto } from './user-profile-update-view.dto';

export class UserProfileViewDto extends UserProfileUpdateViewDto {
  @AutoMap()
  orders: UserBookedOrderViewDto[];
}
