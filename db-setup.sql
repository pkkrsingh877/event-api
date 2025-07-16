-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0 AND capacity <= 1000)
);

-- Create registrations junction table for many-to-many relationship
CREATE TABLE registrations (
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (event_id, user_id) -- This composite key prevents duplicate registrations
);

-- Add some sample data (optional)

-- Sample Users
INSERT INTO users (name, email) VALUES
('Alice Johnson', 'alice.j@example.com'),
('Bob Williams', 'bob.w@example.com'),
('Charlie Brown', 'charlie.b@example.com');

-- Sample Events
INSERT INTO events (title, date, location, capacity) VALUES
('Tech Conference 2024', '2024-10-20T09:00:00Z', 'Convention Center', 500),
('Local Hackathon', '2024-11-15T10:00:00Z', 'City Library', 50),
('Art & Design Workshop', '2024-09-25T14:00:00Z', 'Community Hall', 100);
