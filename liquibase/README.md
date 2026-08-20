# Liquibase

This directory is intentionally kept without migration files in the application-base phase.

The laboratory will later start from the PostgreSQL schema and use Liquibase `generate-changelog` to capture the current database state. From that point forward, Liquibase will own database schema changes.

Do not introduce Prisma, Sequelize, or another migration mechanism.
