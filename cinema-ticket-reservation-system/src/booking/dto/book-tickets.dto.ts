import { ApiProperty } from '@nestjs/swagger';

export class BookTicketsDto {
  @ApiProperty({
    type: String,
    example: '235e95cf-dccc-4830-8b55-815aeb2d9e02',
  })
  userProfileId: string;

  @ApiProperty({
    type: String,
    isArray: true,
    example: [
      '6fe03277-11e5-4e7e-984e-1d5c3c045dc8',
      'e322080d-5a4f-4b27-964d-94208a542868',
      '758ebd2b-83cd-4bec-8d6e-8f96901d3e20',
      '2040c794-7558-4076-b1ed-b236fb8899bb',
    ],
  })
  sessionSeatsId: string[];
}
