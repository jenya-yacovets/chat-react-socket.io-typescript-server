import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {Chat} from "./Chat";

@Entity("message")
export class Message extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({
        type: "text"
    })
    text!: string

    @ManyToOne(() => Chat, chat => chat.messages)
    chat!: Chat

    @ManyToOne(() => User, user => user.messages)
    user!: User

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    delete_at!: Date
}