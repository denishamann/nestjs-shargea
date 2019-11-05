import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
import uuid from 'uuid'
import { Transform } from 'class-transformer'
import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class UpdateCategoryDto {

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  title?: string

  @ApiModelPropertyOptional()
  @Transform(description => description || null)
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string

  @ApiModelPropertyOptional({ type: String })
  @Transform(imageId => imageId || null)
  @IsOptional()
  @IsUUID()
  imageId?: uuid

  @ApiModelPropertyOptional({ type: String })
  @Transform(parentCategoryId => parentCategoryId || null)
  @IsOptional()
  @IsUUID()
  parentCategoryId?: uuid
}
