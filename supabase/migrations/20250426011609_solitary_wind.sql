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