import {
    BaseEntity, BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToMany, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import bcrypt from 'bcrypt'
import {IsNotEmpty} from "class-validator"
import {Exclude} from "class-transformer"
import {Message} from "./Message";
import {Chat} from "./Chat";

@Entity("user")
export class User extends BaseEntity{
    private readonly saltRounds: number = Number(process.env.SALT_ROUNDS_PASS_HASH)

    @PrimaryGeneratedColumn()
    id!: number

    @IsNotEmpty()
    @Column()
    login!: string

    @IsNotEmpty()
    @Column()
    name!: string

    @IsNotEmpty()
    @Exclude()
    @Column()
    password!: string

    @Column( {
        default: 1
    })
    role!: number

    @OneToMany(() => Message, message => message.user)
    messages!: Message[]

    @ManyToMany(() => Chat, chat => chat.users)
    chats!: Chat

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    delete_at!: Date

    @BeforeInsert()
    async beforeInsert(): Promise<void> {
        this.password = await this.genHash(this.password)
    }

    public async genHash(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, this.saltRounds, (error, hash) => {
                if(!error) {
                    resolve(hash)
                } else {
                    reject(error)
                }
            })
        })
    }

    public async verifyPassword(password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.password, (error, res) => {
                if (!error) {
                    resolve(res)
                } else {
                    reject(error)
                }
            })
        })
    }
}
