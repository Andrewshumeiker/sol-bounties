import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Bounty, BountyStatus } from './entities/bounty.entity';
import { CreateBountyDto } from './dto/create-bounty.dto';
import { UpdateBountyDto } from './dto/update-bounty.dto';

@Injectable()
export class BountiesService {
  /**
   * Temporal storage of bounties. In a real application this would be
   * persisted in a database. This array is reset on every reload.
   */
  private readonly bounties: Bounty[] = [];

  create(createBountyDto: CreateBountyDto): Bounty {
    const newBounty: Bounty = {
      id: uuid(),
      title: createBountyDto.title,
      description: createBountyDto.description,
      rewardPoints: createBountyDto.rewardPoints,
      deadline: createBountyDto.deadline ? new Date(createBountyDto.deadline) : null,
      status: createBountyDto.status ?? BountyStatus.DRAFT,
      // relations are not set in this stub implementation
      createdBy: undefined as any,
      submissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bounties.push(newBounty);
    return newBounty;
  }

  findAll(): Bounty[] {
    return this.bounties;
  }

  findOne(id: string): Bounty {
    const bounty = this.bounties.find((b) => b.id === id);
    if (!bounty) {
      throw new NotFoundException(`Bounty with id ${id} not found`);
    }
    return bounty;
  }

  update(id: string, updateBountyDto: UpdateBountyDto): Bounty {
    const bounty = this.findOne(id);
    Object.assign(bounty, updateBountyDto);
    bounty.updatedAt = new Date();
    return bounty;
  }

  remove(id: string): void {
    const index = this.bounties.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Bounty with id ${id} not found`);
    }
    this.bounties.splice(index, 1);
  }
}