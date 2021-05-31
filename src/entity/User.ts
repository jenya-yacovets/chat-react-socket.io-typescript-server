import {
    BaseEntity, BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToMany, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import bcrypt from 'bcrypt'
import {IsNotEmpty} from "class-validator"
import {Exclude, Expose, Transform, Type} from "class-transformer"
import {Message} from "./Message";
import {Chat} from "./Chat";
import {Role} from "./Role";

@Entity("user")
export class User extends BaseEntity{
    @Exclude()
    private readonly saltRounds: number = Number(process.env.SALT_ROUNDS_PASS_HASH)

    @Expose()
    @IsNotEmpty()
    @PrimaryGeneratedColumn()
    id!: number

    @Expose()
    @IsNotEmpty()
    @Column({
        unique: true
    })
    login!: string

    @Expose()
    @IsNotEmpty()
    @Column()
    name!: string

    @Exclude()
    @IsNotEmpty()
    @Column()
    password!: string

    @Expose()
    @Type(() => Role)
    // @Transform(role => role.name)
    @ManyToOne(() => Role, role => role.user)
    role!: Role

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
    private async beforeInsert(): Promise<void> {
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
