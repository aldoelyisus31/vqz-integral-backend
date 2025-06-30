import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileImageAndGoogleAuth1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add profile_image column to users table
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN profile_image text NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove profile_image column from users table
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN profile_image;
    `);
  }
}