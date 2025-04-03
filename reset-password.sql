-- Reset Admin Password to "admin@420" using bcrypt hash
UPDATE users 
SET password = '$2a$10$7F.vOwE.OO.PUcUHWtfdZu9TvqUEoguDYDFJsrdgNLc.F5FCgkwrC' 
WHERE username = 'admin';