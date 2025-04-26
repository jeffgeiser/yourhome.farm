/*
  # AI Service Functions for YourHome.Farm

  1. New Functions
    - `generate_plant_tasks`: Generate tasks for a specific plant
    - `process_weather_alerts`: Check for weather alerts and create alerts

  2. Security
    - Functions use security definer to run with elevated privileges
    - Proper authorization checks within functions
*/

-- Function to generate tasks for plants based on their needs
CREATE OR REPLACE FUNCTION generate_plant_tasks(user_plant_id UUID)
RETURNS SETOF tasks
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _plant record;
  _garden_profile record;
  _task_id UUID;
  _due_date DATE;
  _description TEXT;
BEGIN
  -- Get the user ID that owns this plant for authorization
  SELECT
    garden_profiles.user_id INTO _user_id
  FROM
    user_plants
    JOIN garden_profiles ON user_plants.garden_profile_id = garden_profiles.id
  WHERE
    user_plants.id = user_plant_id;

  -- Check authorization
  IF auth.uid() <> _user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Get plant and garden details
  SELECT
    p.id,
    p.name,
    p.water_needs,
    p.sun_needs,
    p.care_instructions,
    up.planting_date,
    up.status
  INTO _plant
  FROM
    user_plants up
    JOIN plants p ON up.plant_id = p.id
  WHERE
    up.id = user_plant_id;

  SELECT
    g.location,
    g.sunlight,
    g.soil_type
  INTO _garden_profile
  FROM
    user_plants up
    JOIN garden_profiles g ON up.garden_profile_id = g.id
  WHERE
    up.id = user_plant_id;

  -- Generate watering task based on water needs
  IF _plant.water_needs LIKE '%regular%' OR _plant.water_needs LIKE '%consistent%' THEN
    _due_date := current_date + 3;
    _description := 'Water your ' || _plant.name || ' plant';
    
    INSERT INTO tasks (user_plant_id, description, due_date, status, generated_by)
    VALUES (user_plant_id, _description, _due_date, 'pending', 'ai')
    RETURNING id INTO _task_id;
  ELSIF _plant.water_needs LIKE '%low%' OR _plant.water_needs LIKE '%drought%' THEN
    _due_date := current_date + 7;
    _description := 'Check soil moisture for your ' || _plant.name || ' plant';
    
    INSERT INTO tasks (user_plant_id, description, due_date, status, generated_by)
    VALUES (user_plant_id, _description, _due_date, 'pending', 'ai')
    RETURNING id INTO _task_id;
  END IF;

  -- Generate fertilizing task
  _due_date := current_date + 30;
  _description := 'Add fertilizer to your ' || _plant.name || ' plant';
  
  INSERT INTO tasks (user_plant_id, description, due_date, status, generated_by)
  VALUES (user_plant_id, _description, _due_date, 'pending', 'ai')
  RETURNING id INTO _task_id;

  -- Generate pest check task
  _due_date := current_date + 14;
  _description := 'Check ' || _plant.name || ' for pests and diseases';
  
  INSERT INTO tasks (user_plant_id, description, due_date, status, generated_by)
  VALUES (user_plant_id, _description, _due_date, 'pending', 'ai')
  RETURNING id INTO _task_id;

  RETURN QUERY
  SELECT * FROM tasks
  WHERE user_plant_id = generate_plant_tasks.user_plant_id
  AND generated_by = 'ai';
END;
$$;

-- Function to check for weather alerts based on location
CREATE OR REPLACE FUNCTION process_weather_alerts(garden_profile_id UUID, temperature NUMERIC, weather_condition TEXT)
RETURNS SETOF alerts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _user_id UUID;
  _location TEXT;
  _alert_id UUID;
  _event_type TEXT;
  _event_date DATE;
BEGIN
  -- Get the user ID that owns this garden for authorization
  SELECT
    user_id, location INTO _user_id, _location
  FROM
    garden_profiles
  WHERE
    id = garden_profile_id;

  -- Check authorization
  IF auth.uid() <> _user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Set event date to current date
  _event_date := current_date;

  -- Check for frost alerts
  IF temperature <= 32 THEN
    _event_type := 'Frost';
    
    -- Check if there's already an active frost alert for today
    IF NOT EXISTS (
      SELECT 1 FROM alerts
      WHERE garden_profile_id = process_weather_alerts.garden_profile_id
      AND event_type = _event_type
      AND event_date = _event_date
      AND status = 'active'
    ) THEN
      INSERT INTO alerts (garden_profile_id, event_type, event_date, status)
      VALUES (garden_profile_id, _event_type, _event_date, 'active')
      RETURNING id INTO _alert_id;
    END IF;
  END IF;

  -- Check for heat wave alerts
  IF temperature >= 90 THEN
    _event_type := 'Heat Wave';
    
    -- Check if there's already an active heat wave alert for today
    IF NOT EXISTS (
      SELECT 1 FROM alerts
      WHERE garden_profile_id = process_weather_alerts.garden_profile_id
      AND event_type = _event_type
      AND event_date = _event_date
      AND status = 'active'
    ) THEN
      INSERT INTO alerts (garden_profile_id, event_type, event_date, status)
      VALUES (garden_profile_id, _event_type, _event_date, 'active')
      RETURNING id INTO _alert_id;
    END IF;
  END IF;

  -- Check for drought conditions
  IF weather_condition = 'drought' OR weather_condition = 'dry' THEN
    _event_type := 'Drought';
    
    -- Check if there's already an active drought alert
    IF NOT EXISTS (
      SELECT 1 FROM alerts
      WHERE garden_profile_id = process_weather_alerts.garden_profile_id
      AND event_type = _event_type
      AND event_date >= (current_date - 7)
      AND status = 'active'
    ) THEN
      INSERT INTO alerts (garden_profile_id, event_type, event_date, status)
      VALUES (garden_profile_id, _event_type, _event_date, 'active')
      RETURNING id INTO _alert_id;
    END IF;
  END IF;

  -- Check for high winds
  IF weather_condition = 'windy' OR weather_condition = 'storm' THEN
    _event_type := 'High Winds';
    
    -- Check if there's already an active wind alert for today
    IF NOT EXISTS (
      SELECT 1 FROM alerts
      WHERE garden_profile_id = process_weather_alerts.garden_profile_id
      AND event_type = _event_type
      AND event_date = _event_date
      AND status = 'active'
    ) THEN
      INSERT INTO alerts (garden_profile_id, event_type, event_date, status)
      VALUES (garden_profile_id, _event_type, _event_date, 'active')
      RETURNING id INTO _alert_id;
    END IF;
  END IF;

  RETURN QUERY
  SELECT * FROM alerts
  WHERE garden_profile_id = process_weather_alerts.garden_profile_id
  AND status = 'active';
END;
$$;