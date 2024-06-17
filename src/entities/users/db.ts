import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
    @Column({ primary: true })
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ default: 'free' })
    type: 'free' | 'pro';
}

export type UserCreate = Pick<User, 'id'|'username' | 'type'>;
export type UserUpdate = Pick<User, 'id'> & Partial<UserCreate>;

export async function getUsers(limit: number, offset: number): Promise<User[]> {
    return await User.find({
        take: limit,
        skip: offset
    });
}

export async function getUser(id: string): Promise<User | null> {
    return await User.findOne({
        where: {
            id
        }
    });
}

export async function countUsers(): Promise<number> {
    return await User.count();
}

export async function createUser(userCreate: UserCreate): Promise<User> {
    let user = new User();

    user.id = userCreate.id;
    user.username = userCreate.username;
    user.type = userCreate.type;

    return await user.save();
}

export async function updateUser(userUpdate: UserUpdate): Promise<User> {
    await User.update(userUpdate.id, {
        username: userUpdate.username,
        type: userUpdate.type
    });

    const user = await getUser(userUpdate.id);

    if (user === null) {
        throw new Error(`updateUser: failed for id ${userUpdate.id}`);
    }

    return user;
}

export async function deleteUser(id: number): Promise<number> {
    const deleteResult = await User.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deleteUser: could not delete user with id ${id}`);
    }

    return id;
}
