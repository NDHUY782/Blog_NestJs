import { Post } from 'src/post/entities/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  // @Column({ nullable: true, default: null })
  // refresh_token: string;
  @Column({ nullable: true, default: null })
  refresh_token: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  create_At: Date;

  @CreateDateColumn()
  update_At: Date;
}
