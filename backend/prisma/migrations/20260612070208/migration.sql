/*
  Warnings:

  - You are about to drop the column `email` on the `Admin` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[Admin] DROP CONSTRAINT [Admin_email_key];
ALTER TABLE [dbo].[Admin] DROP CONSTRAINT [Admin_userName_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'Admin'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_Admin] (
    [id] INT NOT NULL IDENTITY(1,1),
    [firstName] NVARCHAR(1000) NOT NULL,
    [userName] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [Admin_role_df] DEFAULT 'admin',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Admin_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Admin_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Admin_userName_key] UNIQUE NONCLUSTERED ([userName])
);
SET IDENTITY_INSERT [dbo].[_prisma_new_Admin] ON;
IF EXISTS(SELECT * FROM [dbo].[Admin])
    EXEC('INSERT INTO [dbo].[_prisma_new_Admin] ([createdAt],[deletedAt],[firstName],[id],[password],[role],[updatedAt],[userName]) SELECT [createdAt],[deletedAt],[firstName],[id],[password],[role],[updatedAt],[userName] FROM [dbo].[Admin] WITH (holdlock tablockx)');
SET IDENTITY_INSERT [dbo].[_prisma_new_Admin] OFF;
DROP TABLE [dbo].[Admin];
EXEC SP_RENAME N'dbo._prisma_new_Admin', N'Admin';
COMMIT;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
