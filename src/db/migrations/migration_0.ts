export const migration0 = `
    CREATE TABLE users
    (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL
    );

    CREATE TABLE posts
    (
        id UUID PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        isPublic BOOLEAN NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;
