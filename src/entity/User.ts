import {
    BaseEntity, BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import bcrypt from 'bcrypt'
import {IsNotEmpty} from "class-validator"
import {Exclude} from "class-transformer"

@Entity("user")
export class User extends BaseEntity{
    @Exclude()
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

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    delete_at!: Date

    @BeforeInsert()
    async beforeInsert() {
        this.password = await bcrypt.hash(this.password, this.saltRounds)
    }

    public async verifyPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }
}
