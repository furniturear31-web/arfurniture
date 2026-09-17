CREATE TABLE IF NOT EXISTS store_settings (
  id boolean PRIMARY KEY DEFAULT TRUE,
  announcement_text text DEFAULT 'Welcome to AR FURNITURE - Premium Luxury Furniture in Vadodara',
  is_announcement_active boolean DEFAULT true,
  CONSTRAINT single_row CHECK (id)
);

-- Allow public read access
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON store_settings FOR SELECT USING (true);
CREATE POLICY "Allow update for all (admin protected by app logic)" ON store_settings FOR UPDATE USING (true);
CREATE POLICY "Allow insert for all (admin protected by app logic)" ON store_settings FOR INSERT USING (true);

INSERT INTO store_settings (id, announcement_text, is_announcement_active) 
VALUES (true, 'Festive Offer: Free Design Consultation on All Custom Orders! 🛋️', true)
ON CONFLICT (id) DO NOTHING;
