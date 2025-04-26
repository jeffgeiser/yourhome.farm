/*
  # Initial Schema for YourHome.Farm

  1. New Tables
    - `users`: Stores user information and subscription status
    - `garden_profiles`: Gardens created by users
    - `plants`: Public plant database with care instructions
    - `user_plants`: Plants that users have added to their gardens
    - `tasks`: Tasks for plant maintenance
    - `feedback`: User feedback and community posts
    - `alerts`: Weather and care alerts for gardens

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Set plants table as public read-only
*/

-- Create users table that extends the auth.users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'Trial',
  role TEXT DEFAULT 'User'
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own user data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own user data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create garden_profiles table
CREATE TABLE IF NOT EXISTS garden_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  location TEXT NOT NULL,
  sunlight TEXT NOT NULL,
  goals TEXT[] NOT NULL,
  soil_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE garden_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own garden profiles"
  ON garden_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own garden profiles"
  ON garden_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own garden profiles"
  ON garden_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own garden profiles"
  ON garden_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create plants table (public, read-only catalog)
CREATE TABLE IF NOT EXISTS plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  care_instructions TEXT NOT NULL,
  planting_seasons TEXT[] NOT NULL,
  water_needs TEXT NOT NULL,
  sun_needs TEXT NOT NULL,
  common_issues TEXT[] NOT NULL
);

ALTER TABLE plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plants are viewable by everyone"
  ON plants
  FOR SELECT
  TO authenticated
  USING (true);

-- Create user_plants table
CREATE TABLE IF NOT EXISTS user_plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garden_profile_id UUID NOT NULL REFERENCES garden_profiles(id) ON DELETE CASCADE,
  plant_id UUID NOT NULL REFERENCES plants(id) ON DELETE CASCADE,
  planting_date DATE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT DEFAULT '',
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE user_plants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view plants in their gardens"
  ON user_plants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = user_plants.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add plants to their gardens"
  ON user_plants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = user_plants.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update plants in their gardens"
  ON user_plants
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = user_plants.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete plants in their gardens"
  ON user_plants
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = user_plants.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_plant_id UUID NOT NULL REFERENCES user_plants(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  generated_by TEXT DEFAULT 'manual' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view tasks for their plants"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_plants
      JOIN garden_profiles ON user_plants.garden_profile_id = garden_profiles.id
      WHERE user_plants.id = tasks.user_plant_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks for their plants"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_plants
      JOIN garden_profiles ON user_plants.garden_profile_id = garden_profiles.id
      WHERE user_plants.id = tasks.user_plant_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks for their plants"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_plants
      JOIN garden_profiles ON user_plants.garden_profile_id = garden_profiles.id
      WHERE user_plants.id = tasks.user_plant_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks for their plants"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_plants
      JOIN garden_profiles ON user_plants.garden_profile_id = garden_profiles.id
      WHERE user_plants.id = tasks.user_plant_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_plant_id UUID NOT NULL REFERENCES user_plants(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now() NOT NULL,
  photo TEXT
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback"
  ON feedback
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own feedback"
  ON feedback
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garden_profile_id UUID NOT NULL REFERENCES garden_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  created_date TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view alerts for their gardens"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = alerts.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create alerts for their gardens"
  ON alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = alerts.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update alerts for their gardens"
  ON alerts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = alerts.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete alerts for their gardens"
  ON alerts
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM garden_profiles
      WHERE garden_profiles.id = alerts.garden_profile_id
      AND garden_profiles.user_id = auth.uid()
    )
  );

-- Create trigger to create a user record when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, subscription_status, role)
  VALUES (new.id, new.email, 'Trial', 'User');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample plants data
INSERT INTO plants (name, type, care_instructions, planting_seasons, water_needs, sun_needs, common_issues)
VALUES 
  ('Tomato', 'Vegetable', 'Plant in well-draining soil. Stake or cage for support.', ARRAY['Spring', 'Summer'], 'Regular watering, keep soil consistently moist', 'Full sun (6-8 hours)', ARRAY['Blight', 'Aphids', 'Blossom end rot']),
  ('Basil', 'Herb', 'Pinch off flower buds to encourage leaf growth.', ARRAY['Spring', 'Summer'], 'Keep soil moist but not waterlogged', 'Full sun to partial shade', ARRAY['Aphids', 'Downy mildew', 'Fusarium wilt']),
  ('Lavender', 'Herb', 'Plant in well-draining soil. Prune after flowering.', ARRAY['Spring'], 'Low water needs, drought tolerant', 'Full sun', ARRAY['Root rot', 'Leaf spot']),
  ('Strawberry', 'Fruit', 'Space plants 12-18 inches apart.', ARRAY['Spring'], 'Regular watering, 1-2 inches per week', 'Full sun', ARRAY['Powdery mildew', 'Slugs', 'Birds']),
  ('Carrot', 'Vegetable', 'Sow seeds directly in garden. Thin seedlings to 2-3 inches apart.', ARRAY['Spring', 'Fall'], 'Regular watering, especially during germination', 'Full sun to partial shade', ARRAY['Carrot fly', 'Forking', 'Cracking']),
  ('Rose', 'Flower', 'Prune in early spring. Fertilize regularly during growing season.', ARRAY['Spring'], 'Deep watering, 1-2 times per week', 'Full sun (6+ hours)', ARRAY['Blackspot', 'Aphids', 'Japanese beetles']),
  ('Cucumber', 'Vegetable', 'Provide trellis for vining varieties. Harvest frequently.', ARRAY['Late Spring', 'Summer'], 'Consistent moisture, 1-2 inches per week', 'Full sun', ARRAY['Powdery mildew', 'Cucumber beetles', 'Bitterness']),
  ('Mint', 'Herb', 'Plant in containers to prevent spreading. Harvest regularly.', ARRAY['Spring', 'Summer'], 'Regular watering, keep soil moist', 'Partial shade to full sun', ARRAY['Rust', 'Verticillium wilt', 'Aphids']),
  ('Zucchini', 'Vegetable', 'Plant in hills or rows. Harvest when fruits are 6-8 inches long.', ARRAY['Late Spring', 'Summer'], 'Regular watering, 1-2 inches per week', 'Full sun', ARRAY['Powdery mildew', 'Squash vine borer', 'Blossom end rot']),
  ('Sunflower', 'Flower', 'Sow seeds directly in garden after last frost. Support tall varieties.', ARRAY['Spring', 'Summer'], 'Moderate watering, drought tolerant once established', 'Full sun', ARRAY['Birds eating seeds', 'Fungal diseases', 'Stem damage']);