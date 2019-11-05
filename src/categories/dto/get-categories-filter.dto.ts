import { IsNotEmpty, IsOptional } from 'class-validator'
import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class GetCategoriesFilterDto {

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  search?: string
}
