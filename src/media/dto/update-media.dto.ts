import { IsIn, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import { MediaType } from '../media-type.enum'
import { Transform } from 'class-transformer'
import { ApiModelPropertyOptional } from '@nestjs/swagger'

export class UpdateMediaDto {

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  title?: string

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  url?: string

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @Transform(description => description || null)
  description?: string

  @ApiModelPropertyOptional({ enum: ['IMAGE', 'VIDEO'] })
  @IsOptional()
  @IsIn(Object.values(MediaType))
  type?: MediaType
}
