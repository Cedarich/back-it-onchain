import { Controller, Patch, Param, Body, Get, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':wallet')
    async getUser(@Param('wallet') wallet: string) {
        const user = await this.usersService.findByWallet(wallet);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Patch(':wallet')
    async updateProfile(
        @Param('wallet') wallet: string,
        @Body() body: { handle?: string; bio?: string; displayName?: string; avatarCid?: string },
    ) {
        return this.usersService.updateProfile(wallet, body);
    }
}
