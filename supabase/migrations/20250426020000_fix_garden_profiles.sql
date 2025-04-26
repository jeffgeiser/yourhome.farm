-- Drop the duplicate trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Ensure the goals column is properly set up
ALTER TABLE garden_profiles 
  ALTER COLUMN goals SET DEFAULT '{}',
  ALTER COLUMN goals SET NOT NULL;

-- Add a check constraint to ensure goals is always an array
ALTER TABLE garden_profiles
  ADD CONSTRAINT goals_must_be_array 
  CHECK (array_length(goals, 1) IS NOT NULL OR goals = '{}');

-- Update the insert policy to ensure proper array handling
DROP POLICY IF EXISTS "Users can create their own garden profiles" ON garden_profiles;
CREATE POLICY "Users can create their own garden profiles"
  ON garden_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    name IS NOT NULL AND
    size IS NOT NULL AND
    location IS NOT NULL AND
    sunlight IS NOT NULL AND
    goals IS NOT NULL AND
    soil_type IS NOT NULL
  ); 