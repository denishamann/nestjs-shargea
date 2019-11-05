import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator'
import uuid from 'uuid'
import { Transform } from 'class-transformer'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'

export class CreateCategoryDto {

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  title: string

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
  @Transform(categoryId => categoryId || null)
  @IsOptional()
  @IsUUID()
  parentCategoryId?: uuid
}
