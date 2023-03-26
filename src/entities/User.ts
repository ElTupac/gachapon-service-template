import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail, IsPhoneNumber, Length } from "class-validator";

@Entity({ name: "gachapon_users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column("varchar", { length: 50 })
  @IsEmail()
  mail!: string;
  @Column("varchar", { length: 18 })
  @IsPhoneNumber()
  phone?: string;
  @Column("varchar", { length: 50 })
  @Length(8, 50)
  name!: string;
  @Column("timestamp")
  created_at?: number;
}
