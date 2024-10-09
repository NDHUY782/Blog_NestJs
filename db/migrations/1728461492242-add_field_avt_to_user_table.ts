import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvtToUserTable1728461492242 implements MigrationInterface {
    name = 'AddFieldAvtToUserTable1728461492242'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
