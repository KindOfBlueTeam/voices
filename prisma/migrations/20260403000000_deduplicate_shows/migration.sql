-- Deduplicate shows: for each group of (title, type, year) keep the oldest row,
-- re-point any characters that referenced a duplicate, then delete the duplicates.

-- 1. Re-assign characters from duplicate shows to the canonical (oldest) show.
UPDATE "characters" c
SET "showId" = keeper."id"
FROM (
  SELECT
    DISTINCT ON (title, type, year) id,
    title,
    type,
    year
  FROM "shows"
  ORDER BY title, type, year, id ASC
) AS keeper
JOIN "shows" dup ON dup.title = keeper.title
  AND dup.type = keeper.type
  AND (dup.year = keeper.year OR (dup.year IS NULL AND keeper.year IS NULL))
WHERE c."showId" = dup.id
  AND dup.id <> keeper.id;

-- 2. Delete duplicate show rows (non-canonical ones).
DELETE FROM "shows"
WHERE id NOT IN (
  SELECT DISTINCT ON (title, type, year) id
  FROM "shows"
  ORDER BY title, type, year, id ASC
);

-- 3. Add unique constraint. Postgres allows multiple NULLs through a standard
--    unique index, so we also add a partial unique index for the year IS NULL case.
ALTER TABLE "shows" ADD CONSTRAINT "shows_title_type_year_key" UNIQUE ("title", "type", "year");

CREATE UNIQUE INDEX "shows_title_type_no_year_key"
  ON "shows" ("title", "type")
  WHERE "year" IS NULL;
