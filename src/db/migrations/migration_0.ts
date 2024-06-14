export const migration0 = `
    CREATE TABLE bins
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL
    );
`;
