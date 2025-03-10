/*
  # Therapist and Client Management Tables

  1. New Tables
    - `client_records`
      - `id` (uuid, primary key)
      - `therapist_id` (uuid, references profiles)
      - `client_id` (uuid, references profiles)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `test_assignments`
      - `id` (uuid, primary key)
      - `therapist_id` (uuid, references profiles)
      - `client_id` (uuid, references profiles)
      - `test_id` (uuid, references tests)
      - `status` (text: assigned, completed, expired)
      - `due_date` (timestamp)
      - `assigned_at` (timestamp)
      - `completed_at` (timestamp)
    
    - `test_results`
      - `id` (uuid, primary key)
      - `assignment_id` (uuid, references test_assignments)
      - `answers` (jsonb)
      - `score` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for therapist access
*/

-- Client records table
CREATE TABLE IF NOT EXISTS client_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Test assignments table
CREATE TABLE IF NOT EXISTS test_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  test_id uuid REFERENCES tests(id) ON DELETE CASCADE,
  status text DEFAULT 'assigned',
  due_date timestamptz,
  assigned_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Test results table
CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES test_assignments(id) ON DELETE CASCADE,
  answers jsonb,
  score jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE client_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Therapist policies for client records
CREATE POLICY "Therapists can manage their client records"
  ON client_records
  FOR ALL
  TO authenticated
  USING (therapist_id = auth.uid());

-- Client policies for test assignments
CREATE POLICY "Therapists can manage their test assignments"
  ON test_assignments
  FOR ALL
  TO authenticated
  USING (
    therapist_id = auth.uid() OR 
    client_id = auth.uid()
  );

-- Policies for test results
CREATE POLICY "Access to test results for involved parties"
  ON test_results
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM test_assignments
      WHERE test_assignments.id = test_results.assignment_id
      AND (test_assignments.therapist_id = auth.uid() OR test_assignments.client_id = auth.uid())
    )
  );

-- Update trigger for client records
CREATE TRIGGER update_client_records_updated_at
  BEFORE UPDATE ON client_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();