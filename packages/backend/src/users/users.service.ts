import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findByWallet(wallet: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { wallet } });
    }

    async findByHandle(handle: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { handle } });
    }

    async updateProfile(wallet: string, updateData: { handle?: string; bio?: string; displayName?: string; avatarCid?: string }): Promise<User> {
        const user = await this.findByWallet(wallet);
        if (!user) {
            throw new Error('User not found');
        }

        if (updateData.handle) {
            const existingUser = await this.findByHandle(updateData.handle);
            if (existingUser && existingUser.wallet !== wallet) {
                throw new ConflictException('Handle already taken');
            }
        }

        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }
}
