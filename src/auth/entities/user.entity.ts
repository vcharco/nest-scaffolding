import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('idx_users_email_isActive', ['email', 'isActive'], { unique: true })
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true, nullable: false })
  email: string;

  @Column('text', { unique: true, nullable: false })
  username: string;

  @Column('text', { nullable: false, select: false })
  password: string;

  @Column('text', { nullable: false })
  fullName: string;

  @Column('bool', { nullable: false, default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  role: string[];

  @BeforeInsert()
  lowercaseUsername() {
    this.username = this.username.toLocaleLowerCase().trim();
    this.email = this.email.toLocaleLowerCase().trim();
  }
}
