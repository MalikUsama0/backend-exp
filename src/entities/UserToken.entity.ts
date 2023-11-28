import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  forgotPasswordToken: string;

  @Column({ nullable: true })
  forgotPasswordTokenExpiry: Date;

  @ManyToOne(() => User, (user) => user.token)
  user?: User;
}
