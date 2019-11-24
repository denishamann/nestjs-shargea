import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class GetTransactionsFilterDto {

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  search?: string
}
