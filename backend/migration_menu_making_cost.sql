-- Migration to add making_cost to menu_items

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='making_cost') THEN
        ALTER TABLE menu_items ADD COLUMN making_cost DECIMAL(12,2) DEFAULT 0;
    END IF;
END $$;
