import { IsOptional, IsUUID } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class UpdateUserDto {

  @ApiModelPropertyOptional({ type: String })
  @Transform(categoryId => categoryId || null)
  @IsOptional()
  @IsUUID()
  defaultCategoryId?: string

  @ApiModelPropertyOptional({ type: String })
  @Transform(categoryId => categoryId || null)
  @IsOptional()
  @IsUUID()
  pictureId?: string
}
