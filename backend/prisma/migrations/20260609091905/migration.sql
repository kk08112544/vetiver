BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Topic] (
    [id] INT NOT NULL IDENTITY(1,1),
    [slug] NVARCHAR(1000) NOT NULL,
    [order] INT NOT NULL CONSTRAINT [Topic_order_df] DEFAULT 0,
    [title] NVARCHAR(1000) NOT NULL,
    [icon] NVARCHAR(1000) NOT NULL,
    [accent] NVARCHAR(1000) NOT NULL,
    [intro] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Topic_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Topic_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Topic_slug_key] UNIQUE NONCLUSTERED ([slug])
);

-- CreateTable
CREATE TABLE [dbo].[Section] (
    [id] INT NOT NULL IDENTITY(1,1),
    [order] INT NOT NULL CONSTRAINT [Section_order_df] DEFAULT 0,
    [heading] NVARCHAR(1000) NOT NULL,
    [body] NVARCHAR(1000),
    [items] NVARCHAR(1000) NOT NULL CONSTRAINT [Section_items_df] DEFAULT '[]',
    [topicId] INT NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Section_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Section_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Admin] (
    [id] INT NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [firstName] NVARCHAR(1000) NOT NULL,
    [userName] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [role] NVARCHAR(1000) NOT NULL CONSTRAINT [Admin_role_df] DEFAULT 'admin',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Admin_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    [deletedAt] DATETIME2,
    CONSTRAINT [Admin_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Admin_userName_key] UNIQUE NONCLUSTERED ([userName])
);

-- AddForeignKey
ALTER TABLE [dbo].[Section] ADD CONSTRAINT [Section_topicId_fkey] FOREIGN KEY ([topicId]) REFERENCES [dbo].[Topic]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
