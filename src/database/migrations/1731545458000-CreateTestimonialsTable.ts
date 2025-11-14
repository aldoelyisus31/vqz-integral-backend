import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTestimonialsTable1731545458000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'testimonials',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'identity',
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'image_path',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'stars',
            type: 'int',
            isNullable: false,
            default: 5,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
            default: null,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('testimonials');
  }
}
