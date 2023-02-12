import { Controller, Get, Body, Param, Put, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookTicketsDto } from './dto/book-tickets.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { hasRole } from '../authorize/decorators/roles.decorator';
import RoleEnum from '../shared/enums/role.enum';
import { JwtAuthGuard } from '../authorize/guards/jwt-auth.guard';
import { RoleGuard } from '../authorize/guards/role.guard';

@ApiTags('Booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {
  }

  @ApiBearerAuth()
  @hasRole(RoleEnum.User)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBody({
    type: BookTicketsDto,
  })
  @Put(':sessionId')
  async bockTickets(@Res() res: Response, @Param('sessionId') sessionId: string, @Body() bookTicketsDto: BookTicketsDto) {
    console.log(bookTicketsDto);
    const result = await this.bookingService.bookTicketsAsync(sessionId, bookTicketsDto);
    return res.status(HttpStatus.OK).json(result);
  }

  @Get(':sessionId')
  async findOne(@Res() res: Response, @Param('sessionId') sessionId: string) {
    const result = await this.bookingService.getSessionDetailsAsync(sessionId);
    return res.status(HttpStatus.OK).json(result);
  }
}
