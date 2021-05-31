import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {IsNotEmpty} from "class-validator";
import {Expose, Type} from "class-transformer";

@Entity()
export class Role {

    @Expose()
    @IsNotEmpty()
    @PrimaryGeneratedColumn()
    id!: number

    @Expose()
    @IsNotEmpty()
    @Column()
    name!: string

    @Type(() => User)
    @OneToMany(() => User, user => user.role)
    user!: User

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    delete_at!: Date
}