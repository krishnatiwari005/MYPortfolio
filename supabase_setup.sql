-- Create the contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anon/authenticated users (since form is public)
CREATE POLICY "Allow public inserts" ON public.contact_messages FOR INSERT TO public WITH CHECK (true);

-- Create policy to allow only service_role (admin) to read messages
CREATE POLICY "Allow admin to read" ON public.contact_messages FOR SELECT TO service_role USING (true);
