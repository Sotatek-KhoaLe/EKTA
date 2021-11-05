// import {
//   PrimaryGeneratedColumn,
//   CreateDateColumn,
//   UpdateDateColumn,
//   ManyToOne,
//   JoinColumn,
//   DeleteDateColumn,
//   VersionColumn,
// } from 'typeorm';
//
// import { User } from '@/user/entities/user.entity';
// import { BaseEntity } from './model.interface';
//
// class BaseEntityCRUD extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;
//
//   @ManyToOne(() => User, { nullable: false })
//   @JoinColumn({ referencedColumnName: 'username' })
//   createdBy: User;
//
//   @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
//   updatedAt: Date;
//
//   @ManyToOne(() => User, { nullable: true })
//   @JoinColumn({ referencedColumnName: 'username' })
//   updatedBy: User;
//
//   @DeleteDateColumn()
//   deletedAt: Date;
//
//   @ManyToOne(() => User, { nullable: true })
//   @JoinColumn({ referencedColumnName: 'username' })
//   deletedBy: User;
// }
