import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator'
import { ApiModelProperty } from '@nestjs/swagger'

export class AuthCredentialsDto {

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(320)
  @IsEmail()
  email: string

  @ApiModelProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak.' })
  password: string
}
