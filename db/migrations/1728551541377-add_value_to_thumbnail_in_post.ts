import { MigrationInterface, QueryRunner } from "typeorm";

export class AddValueToThumbnailInPost1728551541377 implements MigrationInterface {
    name = 'AddValueToThumbnailInPost1728551541377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`thumbnail\` \`thumbnail\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` CHANGE \`thumbnail\` \`thumbnail\` varchar(255) NOT NULL`);
    }

}
