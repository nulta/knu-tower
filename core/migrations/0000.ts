/**
 * Migration #0000: Database Initialization
 */

export const id = "0000"

export const sql = `
    CREATE TABLE posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        category TEXT NOT NULL,
        source TEXT,
        remote_url TEXT
    ) STRICT;

    CREATE INDEX posts_category_index ON posts (category);
    CREATE INDEX posts_source_index ON posts (source);

    CREATE TABLE tags (
        name TEXT,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        PRIMARY KEY (name, post_id)
    ) STRICT;

    CREATE TABLE sources (
        name TEXT PRIMARY KEY,
        last_fetched_at INTEGER NOT NULL DEFAULT 0,
        last_fetched_id TEXT
    ) STRICT;

    CREATE TABLE posts_normalized (
        normalized_title TEXT PRIMARY KEY,
        id TEXT REFERENCES posts(id) ON DELETE CASCADE
    ) STRICT;
`
