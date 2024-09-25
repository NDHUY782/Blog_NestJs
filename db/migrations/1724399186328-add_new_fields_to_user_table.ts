import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewFieldsToUserTable1724399186328
  implements MigrationInterface
{
  name = 'AddNewFieldsToUserTable1724399186328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`refresh_token\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`token\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`create_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`update_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`update_At\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`create_At\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`token\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`refresh_token\``,
    );
  }
}
