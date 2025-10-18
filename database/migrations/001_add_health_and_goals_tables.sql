-- Migration to add health conditions, goals, and dietary restrictions tables
-- Run this in your Supabase SQL editor

-- Health Conditions Table
CREATE TABLE IF NOT EXISTS health_conditions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('chronic', 'temporary', 'allergy', 'intolerance')),
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  restrictions TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Goals Table
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('weight', 'fitness', 'nutrition', 'health')),
  target VARCHAR(255) NOT NULL,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  deadline TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dietary Restrictions Table
CREATE TABLE IF NOT EXISTS dietary_restrictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restrictions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- User Preferences Table (update existing if needed)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meal_reminders BOOLEAN DEFAULT true,
  fasting_reminders BOOLEAN DEFAULT true,
  weekly_reports BOOLEAN DEFAULT true,
  coach_messages BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_conditions_user_id ON health_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_active ON user_goals(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_dietary_restrictions_user_id ON dietary_restrictions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_health_conditions_updated_at 
    BEFORE UPDATE ON health_conditions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at 
    BEFORE UPDATE ON user_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dietary_restrictions_updated_at 
    BEFORE UPDATE ON dietary_restrictions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample health conditions for testing
INSERT INTO health_conditions (user_id, name, type, severity, restrictions, notes) VALUES
('00000000-0000-0000-0000-000000000001', 'Type 2 Diabetes', 'chronic', 'moderate', 
 ARRAY['high sugar foods', 'processed carbohydrates', 'sugary beverages'], 
 'Monitor blood glucose levels regularly');

-- Insert some sample goals
INSERT INTO user_goals (user_id, type, target, target_value, current_value, is_active, notes) VALUES
('00000000-0000-0000-0000-000000000001', 'weight', 'Lose 10 kg', 60.0, 70.0, true, 'Target weight for better health'),
('00000000-0000-0000-0000-000000000001', 'nutrition', 'Reduce sugar intake', 25.0, 50.0, true, 'Daily sugar limit in grams');

-- Insert dietary restrictions
INSERT INTO dietary_restrictions (user_id, restrictions) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['gluten-free', 'low-sodium', 'dairy-free']);

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON health_conditions TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_goals TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON dietary_restrictions TO authenticated;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON user_preferences TO authenticated;
