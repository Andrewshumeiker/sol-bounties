import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BountiesService } from './bounties.service';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { UpdateBountyDto } from './dto/update-bounty.dto';

@Controller('bounties')
export class BountiesController {
  constructor(private readonly bountiesService: BountiesService) {}

  @Post()
  create(@Body() createBountyDto: CreateBountyDto) {
    return this.bountiesService.create(createBountyDto);
  }

  @Get()
  findAll() {
    return this.bountiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bountiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBountyDto: UpdateBountyDto) {
    return this.bountiesService.update(id, updateBountyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.bountiesService.remove(id);
    return { message: 'Bounty removed' };
  }
}