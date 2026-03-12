-- =============================================
-- Migration 009: Auth Trigger
-- The Ally-Ability Network
-- =============================================

-- Create a function to handle new user signups from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, disability_type, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'learner'::user_role),
    COALESCE((NEW.raw_user_meta_data->>'disability_type')::disability_type, 'none'::disability_type),
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
