import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fgvbuyxtvxxoypcglkhk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZndmJ1eXh0dnh4b3lwY2dsa2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MTYzNzQsImV4cCI6MjA5MzQ5MjM3NH0.en03j28cASNB3AOdq_F8Juxo4cbllHjA7qFasoV7yXM'

export const supabase = createClient(supabaseUrl, supabaseKey)
