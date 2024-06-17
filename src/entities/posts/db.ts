import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';

import { getUser, User } from '../users/db';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ default: true })
    isPublic: boolean;

    @Column()
    content: string;

    @ManyToOne(() => User)
    user: User;
}

export type PostCreate = Pick<Post, 'title' | 'content' | 'isPublic'> & { user_id: User['id'] };
export type PostUpdate = Pick<Post, 'id'> & Partial<PostCreate>;

export async function getPosts(limit: number, offset: number): Promise<Post[]> {
    return await Post.find({
        take: limit,
        skip: offset,
        relations: {
            user: true
        }
    });
}

export async function getPostsByUserId(userId: User['id'], limit: number, offset: number): Promise<Post[]> {
    return await Post.find({
        take: limit,
        skip: offset,
        where: {
            user: {
                id: userId
            }
        },
        relations: {
            user: true
        }
    });
}

export async function getPost(id: string): Promise<Post | null> {
    return await Post.findOne({
        where: {
            id
        },
        relations: {
            user: true
        }
    });
}

export async function countPosts(): Promise<number> {
    return await Post.count();
}

export async function createPost(postCreate: PostCreate): Promise<Post> {
    let post = new Post();

    post.title = postCreate.title;
    post.content = postCreate.content;
    post.isPublic = postCreate.isPublic;

    const user = await getUser(postCreate.user_id);

    if (user === null) {
        throw new Error(``);
    }

    post.user = user;

    return await post.save();
}

export async function updatePost(postUpdate: PostUpdate): Promise<Post> {
    console.log('postUpdate', postUpdate);

    await Post.update(postUpdate.id, {
        title: postUpdate.title,
        content: postUpdate.content,
        isPublic: postUpdate.isPublic,
        user: {
            id: postUpdate.id
        }
    });

    const post = await getPost(postUpdate.id);

    if (post === null) {
        throw new Error(`updatePost: failed for id ${postUpdate.id}`);
    }

    return post;
}

export async function deletePost(id: number): Promise<number> {
    const deleteResult = await Post.delete(id);

    if (deleteResult.affected === 0) {
        throw new Error(`deletePost: could not delete post with id ${id}`);
    }

    return id;
}
