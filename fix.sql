-- 1. Fix the status column: Drop the old text default, cast the type, and apply the new ENUM default
ALTER TABLE public.tickets ALTER COLUMN status DROP DEFAULT;
ALTER TABLE public.tickets ALTER COLUMN status TYPE ticket_status USING status::ticket_status;
ALTER TABLE public.tickets ALTER COLUMN status SET DEFAULT 'OPEN'::ticket_status;

-- 2. Fix the priority column: Drop the old text-based check constraint, then cast the type
ALTER TABLE public.tickets DROP CONSTRAINT IF EXISTS tickets_priority_check;
ALTER TABLE public.tickets ALTER COLUMN priority TYPE ticket_priority USING UPPER(priority)::ticket_priority;