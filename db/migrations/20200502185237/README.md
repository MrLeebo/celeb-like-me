# Migration `20200502185237`

This migration has been generated by Jeremy Liberman at 5/2/2020, 6:52:37 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Image" ADD COLUMN "updatedAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "username" text   ;

CREATE UNIQUE INDEX "Image.username" ON "public"."Image"("username")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200428100113..20200502185237
--- datamodel.dml
+++ datamodel.dml
@@ -3,12 +3,14 @@
 }
 datasource postgres {
   provider = "postgres"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 model Image {
-  createdAt DateTime @default(now())
   id        Int      @default(autoincrement()) @id
+  username  String?  @unique
   url       String   @unique
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
 }
```