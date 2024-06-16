export const migration0 = `
CREATE TABLE user (
  id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  type ENUM('free', 'pro') NOT NULL DEFAULT 'free',
  PRIMARY KEY (id)
);

CREATE TABLE collaborator (
  id UUID NOT NULL,
  userId VARCHAR(255),
  postId UUID,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (postId) REFERENCES post(id)
);

CREATE TABLE post (
  id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  isPublic BOOLEAN NOT NULL DEFAULT TRUE,
  content TEXT NOT NULL,
  userId VARCHAR(255),
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES user(id)
);
`;
