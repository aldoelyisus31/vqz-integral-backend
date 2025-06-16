import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTables1704587669123 implements MigrationInterface {
    name = 'CreateUserTables1704587669123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" BIGSERIAL NOT NULL,
                "username" text NOT NULL,
                "email" text NOT NULL,
                "fullName" text,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "user_credentials" (
                "id" BIGSERIAL NOT NULL,
                "password" text NOT NULL,
                "isActive" boolean NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "userId" bigint,
                CONSTRAINT "PK_1c91b9e9366f2942ec63c79ac73" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "access_history" (
                "id" BIGSERIAL NOT NULL,
                "accessAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "userId" bigint,
                CONSTRAINT "PK_0a8e07c7e575a3d62d7e43f8c2c" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "user_credentials"
            ADD CONSTRAINT "FK_user_credentials_users"
            FOREIGN KEY ("userId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "access_history"
            ADD CONSTRAINT "FK_access_history_users"
            FOREIGN KEY ("userId")
            REFERENCES "users"("id")
            ON DELETE CASCADE
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "access_history" DROP CONSTRAINT "FK_access_history_users"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_credentials" DROP CONSTRAINT "FK_user_credentials_users"
        `);
        await queryRunner.query(`DROP TABLE "access_history"`);
        await queryRunner.query(`DROP TABLE "user_credentials"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}