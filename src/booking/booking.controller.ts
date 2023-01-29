import { Controller, Get, Body, Param, Put, Res, HttpStatus } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookTicketsDto } from './dto/book-tickets.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {
  }

  @ApiBody({
    type: BookTicketsDto,
  })
  @Put(':sessionId')
  async update(@Res() res: Response, @Param('sessionId') sessionId: string, @Body() bookTicketsDto: BookTicketsDto) {
    const result = await this.bookingService.bookTicketsAsync(sessionId, bookTicketsDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':sessionId')
  async findOne(@Res() res: Response, @Param('sessionId') sessionId: string) {
    const result = await this.bookingService.getSessionDetailsAsync(sessionId);
    return res.status(HttpStatus.OK).json(result);
  }
}
