INSERT INTO users (id, username, password, "updatedAt", role)
VALUES (gen_random_uuid(), 'admin', '$2b$10$QTcEhEYjDcaabA04zBvm0ONwqjlWKob/WYGy3G1IBpyFmM1rXs3Ie', CURRENT_TIMESTAMP, 'ADMIN')
ON CONFLICT (username) DO NOTHING;