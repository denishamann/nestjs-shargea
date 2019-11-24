import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, NotEquals } from 'class-validator'
import uuid from 'uuid'
import { Transform } from 'class-transformer'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'

export class CreateTransactionDto {

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  title: string

  @ApiModelPropertyOptional()
  @Transform(description => description || null)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  description?: string

  @ApiModelProperty()
  @Transform(amount => parseFloat(amount))
  @IsNotEmpty()
  @IsNumber()
  @NotEquals(0)
  amount: number

  @ApiModelPropertyOptional()
  @Transform(date => date || null)
  @IsOptional()
  @IsDateString()
  @MaxLength(250)
  date?: string

  @ApiModelPropertyOptional({ type: String })
  @Transform(imageId => imageId || null)
  @IsOptional()
  @IsUUID()
  imageId?: uuid

  @ApiModelPropertyOptional({ type: String })
  @Transform(categoryId => categoryId || null)
  @IsOptional()
  @IsUUID()
  categoryId?: uuid
}
