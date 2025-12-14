-- Create saved_recipes table for users to save their favorite recipes
CREATE TABLE public.saved_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT[] NOT NULL,
  instructions TEXT[] NOT NULL,
  prep_time TEXT,
  is_vegetarian BOOLEAN DEFAULT false,
  is_healthy BOOLEAN DEFAULT false,
  source TEXT,
  url TEXT,
  serving_size INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved recipes" 
ON public.saved_recipes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save recipes" 
ON public.saved_recipes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their saved recipes" 
ON public.saved_recipes 
FOR DELETE 
USING (auth.uid() = user_id);