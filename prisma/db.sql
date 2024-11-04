CREATE TABLE "conversations" (
    "id" BIGINT NOT NULL,
    "browser" VARCHAR(255) NOT NULL,
    "os" VARCHAR(255) NOT NULL,
    "device" VARCHAR(255) NOT NULL,
    "countryCode" VARCHAR(255) NOT NULL,
    "generatedCategory" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "bots"(
    "id" BIGINT NOT NULL,
    "workspaceId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "language" VARCHAR(255) NOT NULL,
    "systemMessage" TEXT NOT NULL,
    "placeholderMessage" VARCHAR(255) NOT NULL,
    "welcomeMess" VARCHAR(255) NOT NULL,
    "starterQuestions" JSON NOT NULL,
    "modelId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "bot_sources"(
    "id" BIGINT NOT NULL,
    "botId" BIGINT NOT NULL,
    "sourceId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "vectors"(
    "id" BIGINT NOT NULL,
    "source_id" BIGINT NOT NULL,
    "embeddings" vector(1024),
    "chunkContent" VARCHAR(255) NOT NULL,
    "chunkLength" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "users"(
    "id" UUID NOT NULL,
    "workspaceId" BIGINT NOT NULL,
    "name" VARCHAR(255) NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "roleId" BIGINT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "invitedBy" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "lastLoggedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "sessions"(
    "id" UUID NOT NULL,
    "userId" BIGINT NOT NULL,
    "accessToken" VARCHAR(255) NOT NULL,
    "refreshToken" VARCHAR(255) NOT NULL,
    "ipAddress" VARCHAR(255) NOT NULL,
    "device" VARCHAR(255) NOT NULL,
    "os" VARCHAR(255) NOT NULL,
    "browser" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "expiresAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "chats"(
    "id" BIGINT NOT NULL,
    "botId" BIGINT NOT NULL,
    "conversationId" BIGINT NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "tokens" INTEGER NOT NULL,
    "usages" BIGINT NOT NULL,
    "feedback" VARCHAR(255) NOT NULL,
    "sourceIds" VARCHAR(255) NOT NULL,
    "sourceURLs" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "techniques"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slugName" VARCHAR(255) NOT NULL,
    "planId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);


CREATE TABLE "bot_customizations"(
    "id" BIGINT NOT NULL,
    "botId" BIGINT NOT NULL,
    "avatarURL" VARCHAR(255) NOT NULL,
    "userAvatarURL" BIGINT NOT NULL,
    "assitantAvatarURl" BIGINT NOT NULL,
    "userMessageColor" VARCHAR(255) NOT NULL,
    "assitantMessageColor" VARCHAR(255) NOT NULL,
    "fontId" BIGINT NOT NULL,
    "welcomeMessage" VARCHAR(255) NOT NULL,
    "showSources" BOOLEAN NOT NULL,
    "sendButtonText" VARCHAR(255) NOT NULL,
    "customCSS" TEXT NULL,
    "embedAngle" VARCHAR(255) NOT NULL,
    "embedWidgetSize" VARCHAR(255) NOT NULL,
    "embedWidgetIconURL" VARCHAR(255) NOT NULL,
    "embedAutoOpen" BOOLEAN NOT NULL,
    "embedPingMessage" VARCHAR(255) NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "workspaces"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "planId" BIGINT NOT NULL,
    "ownerId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "syncs"(
    "id" BIGINT NOT NULL,
    "sourceId" BIGINT NOT NULL,
    "message" VARCHAR(255) NULL,
    "status" VARCHAR(255) NOT NULL,
    "startedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "succeedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "errorAt" TIMESTAMP(0) WITHOUT TIME ZONE NULL,
    "cancelledAt" TIMESTAMP(0) WITHOUT TIME ZONE NULL
);

CREATE TABLE "source_vectors"(
    "id" BIGINT NOT NULL,
    "sourceId" BIGINT NOT NULL,
    "vectorId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "models"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "planId" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE TABLE "roles"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);
CREATE TABLE "sources"(
    "id" BIGINT NOT NULL,
    "workspaceId" BIGINT NOT NULL,
    "techniqueId" BIGINT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "summary" TEXT NOT NULL,
    "contentType" VARCHAR(255) NOT NULL,
    "contentLength" INTEGER NOT NULL,
    "contentHash" VARCHAR(255) NOT NULL,
    "syncTime" TIME(0) WITHOUT TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "plan_features"(
    "id" BIGINT NOT NULL,
    "planId" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "allowed" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "plans"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slugName" BIGINT NOT NULL,
    "billingCycle" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "subscriptions"(
    "id" BIGINT NOT NULL,
    "workspaceId" BIGINT NOT NULL,
    "planId" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "payments"(
    "id" BIGINT NOT NULL,
    "workspaceId" BIGINT NOT NULL,
    "subscriptionId" BIGINT NOT NULL,
    "amount" FLOAT(53) NOT NULL,
    "paymentMethodId" BIGINT NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "paidAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE "payment_methods"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "status" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE "invoices"(
    "id" BIGINT NOT NULL,
    "paymentId" BIGINT NOT NULL,
    "invoiceCode" VARCHAR(255) NOT NULL,
    "issuedAt" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "dueDate" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);

-- Triggers to Auto-update updatedAt
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Extension to generate UUIDs
CREATE EXTENSION "uuid-ossp";

-- pgVector extension to handle embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- SET enable_seqscan = off;
CREATE INDEX ON vectors USING ivfflat (embedding);
-- CREATE INDEX ON vectors USING ivfflat (embedding) WITH (lists = 100);


-- Pre-compute Similarities and Cache Results
-----------------------------------------------
-- CREATE MATERIALIZED VIEW cached_similar_vectors AS
-- SELECT source_id, chunkContent, embedding
-- FROM vectors
-- WHERE source_id IN ('c3f32b1e', 'b4b7c53b')
-- LIMIT 100;

-- REFRESH MATERIALIZED VIEW cached_similar_vectors;

-- ALTER TABLE vectors ALTER COLUMN content SET STORAGE EXTENDED;
-- ALTER TABLE vectors ALTER COLUMN embedding SET STORAGE EXTENDED;

CREATE INDEX vectors_embedding_idx ON vectors USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX vectors_content_idx ON vectors USING gin (to_tsvector('english', "chunkContent"));
CREATE INDEX sources_workspace_idx ON sources ("workspaceId");
CREATE INDEX sources_content_type_idx ON sources ("contentType");
CREATE INDEX sources_created_at_idx ON sources ("createdAt");