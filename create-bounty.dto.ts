import { IsString, IsNotEmpty, MaxLength, IsInt, Min, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { BountyStatus } from '../entities/bounty.entity';

export class CreateBountyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(0)
  rewardPoints: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsEnum(BountyStatus)
  status?: BountyStatus;
}