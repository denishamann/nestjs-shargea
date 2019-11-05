import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { GetUser } from './get-user.decorator'
import { User } from './user.entity'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { UpdateUserDto } from './update-user.dto'
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiUseTags('users')
@Controller('users')
@UseGuards(AuthGuard())
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

  constructor(private readonly usersService: UsersService) {
  }

  @Get('/current')
  getCurrent(@GetUser() user: User): User {
    return user
  }

  @Patch('/current')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.usersService.updateUser(updateUserDto, user)
  }

  @Delete('/current')
  deleteCurrent(@GetUser() user: User): Promise<void> {
    return this.usersService.deleteUser(user.id)
  }
}
