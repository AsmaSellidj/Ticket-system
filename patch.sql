-- 1. Create the missing ENUM types
CREATE TYPE user_role AS ENUM ('CLIENT', 'AGENT', 'ADMIN');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_ON_CLIENT', 'RESOLVED', 'CLOSED');
CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- 2. Create the missing auto-update function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Retry the ALTER commands that failed
ALTER TABLE public.users ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE public.tickets ALTER COLUMN status TYPE ticket_status USING status::ticket_status;
ALTER TABLE public.tickets ALTER COLUMN priority TYPE ticket_priority USING UPPER(priority)::ticket_priority;

-- 4. Retry the TRIGGER commands that failed
CREATE TRIGGER update_societies_modtime BEFORE UPDATE ON public.societies FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_tickets_modtime BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_comments_modtime BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE FUNCTION update_modified_column();