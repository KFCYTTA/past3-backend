import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { getUser, User } from '../users/db';
import { Post } from '../posts/db';
@Entity()
export class Collaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.collaborators)
  user: User;

  @ManyToOne(() => Post, (post) => post.id)
  post: Post;
}