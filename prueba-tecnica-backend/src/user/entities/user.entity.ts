import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'admin',
  EXTERNAL = 'external'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column('text', { unique: true })
  email: string;
  
  @Column('text', { select: false })
  password: string;
  
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EXTERNAL
  })
  role: UserRole;
  
  @Column('boolean', { default: true })
  isActive: boolean;
  
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}