import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true, default: null })
  thumbnail: string;

  //   @Column({ nullable: true, default: null })
  //   image: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @CreateDateColumn()
  create_At: Date;

  @UpdateDateColumn()
  update_At: Date;
}
