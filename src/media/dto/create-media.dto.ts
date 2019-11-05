import { IsIn, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import { MediaType } from '../media-type.enum'
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger'

export class CreateMediaDto {

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  title: string

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  @MaxLength(2048)
  url: string

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  description?: string

  @ApiModelPropertyOptional({ enum: ['IMAGE', 'VIDEO'] })
  @IsOptional()
  @IsIn(Object.values(MediaType))
  type?: MediaType
}
