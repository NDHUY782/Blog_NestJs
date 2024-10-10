import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteColumnImageInPost1728547815155 implements MigrationInterface {
    name = 'DeleteColumnImageInPost1728547815155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`image\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`image\` varchar(255) NULL`);
    }

}
