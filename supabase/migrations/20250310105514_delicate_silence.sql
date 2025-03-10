/*
  # Admin CMS Tables Setup

  1. New Tables
    - `tests`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration` (integer, minutes)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `test_questions`
      - `id` (uuid, primary key)
      - `test_id` (uuid, foreign key)
      - `question` (text)
      - `type` (text)
      - `options` (jsonb)
      - `order` (integer)
      
    - `meditations`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `duration` (integer)
      - `audio_url` (text)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Tests table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration integer,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Test questions table
CREATE TABLE IF NOT EXISTS test_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  question text NOT NULL,
  type text NOT NULL,
  options jsonb,
  "order" integer,
  created_at timestamptz DEFAULT now()
);

-- Meditations table
CREATE TABLE IF NOT EXISTS meditations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  duration integer,
  audio_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;

-- Admin policies for tests
CREATE POLICY "Allow full access for admins on tests"
  ON tests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin policies for test questions
CREATE POLICY "Allow full access for admins on test questions"
  ON test_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admin policies for meditations
CREATE POLICY "Allow full access for admins on meditations"
  ON meditations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for tests table
CREATE TRIGGER update_tests_updated_at
  BEFORE UPDATE ON tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();