import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinTable, ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Message} from "./Message";
import {User} from "./User";

@Entity("chat")
export class Chat extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @OneToMany(() => Message, message => message.chat)
    messages!: Message[]

    @ManyToMany(() => User, user => user.chats)
    @JoinTable()
    users!: User

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    delete_at!: Date
}