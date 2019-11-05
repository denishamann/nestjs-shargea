import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class GetEntriesFilterDto {

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  search?: string
}
