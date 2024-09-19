import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @Column({ default: '' })
  refresh_token: string;

  @Column({ default: '' })
  token: string;

  @Column({ default: 1 })
  status: number;

  @CreateDateColumn()
  create_At: Date;

  @CreateDateColumn()
  update_At: Date;
}
