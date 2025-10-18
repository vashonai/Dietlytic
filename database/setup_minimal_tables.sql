-- Minimal database setup for NutriHelp AI Coach
-- Run this in your Supabase SQL editor to create the required tables

-- Create dietary_restrictions table
CREATE TABLE IF NOT EXISTS dietary_restrictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  restrictions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create health_conditions table
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

-- Create user_goals table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dietary_restrictions_user_id ON dietary_restrictions(user_id);
CREATE INDEX IF NOT EXISTS idx_health_conditions_user_id ON health_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_active ON user_goals(user_id, is_active);

-- Insert some sample data for testing (optional)
INSERT INTO dietary_restrictions (user_id, restrictions) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['gluten-free', 'low-sodium'])
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO health_conditions (user_id, name, type, severity, restrictions, notes) VALUES
('00000000-0000-0000-0000-000000000001', 'Type 2 Diabetes', 'chronic', 'moderate', 
 ARRAY['high sugar foods', 'processed carbohydrates'], 
 'Monitor blood glucose levels regularly')
ON CONFLICT DO NOTHING;

INSERT INTO user_goals (user_id, type, target, target_value, current_value, is_active, notes) VALUES
('00000000-0000-0000-0000-000000000001', 'weight', 'Lose 10 kg', 60.0, 70.0, true, 'Target weight for better health'),
('00000000-0000-0000-0000-000000000001', 'nutrition', 'Reduce sugar intake', 25.0, 50.0, true, 'Daily sugar limit in grams')
ON CONFLICT DO NOTHING;
