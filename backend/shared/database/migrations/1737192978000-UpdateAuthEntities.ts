import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateAuthEntities1737192978000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add role column to users table
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'role',
                type: 'varchar',
                default: "'user'",
            }),
        );

        // Make email nullable in users table
        await queryRunner.changeColumn(
            'users',
            'email',
            new TableColumn({
                name: 'email',
                type: 'varchar',
                isUnique: true,
                isNullable: true,
            }),
        );

        // Add email and phone verification columns to lawyers table
        await queryRunner.addColumn(
            'lawyers',
            new TableColumn({
                name: 'is_email_verified',
                type: 'boolean',
                default: false,
            }),
        );

        await queryRunner.addColumn(
            'lawyers',
            new TableColumn({
                name: 'is_phone_verified',
                type: 'boolean',
                default: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove columns added in up migration
        await queryRunner.dropColumn('lawyers', 'is_phone_verified');
        await queryRunner.dropColumn('lawyers', 'is_email_verified');

        // Revert email column in users table
        await queryRunner.changeColumn(
            'users',
            'email',
            new TableColumn({
                name: 'email',
                type: 'varchar',
                isUnique: true,
                isNullable: false,
            }),
        );

        // Remove role column from users table
        await queryRunner.dropColumn('users', 'role');
    }
}
