-- Insert sample products for the marketplace
INSERT INTO products (name, description, price, category, seller_id, stock_quantity, image_urls, status) VALUES 
(
    'Recycled Cardboard Sheets',
    'High-quality recycled cardboard sheets perfect for packaging and crafts. Made from 100% post-consumer waste.',
    25.50,
    'Electronics',
    1,
    100,
    ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62'],
    'active'
),
(
    'Plastic Bottle Collection',
    'Clean PET plastic bottles ready for recycling. Collected from various sources and properly sorted.',
    15.75,
    'Clothing',
    2,
    250,
    ARRAY['https://images.unsplash.com/photo-1572274405927-2b3d8261e2b5'],
    'active'
),
(
    'Electronic Components Bundle',
    'Assorted electronic components including resistors, capacitors, and circuit boards. Perfect for DIY projects.',
    89.99,
    'Electronics',
    3,
    50,
    ARRAY['https://images.unsplash.com/photo-1518770660439-4636190af475'],
    'active'
),
(
    'Organic Waste Compost',
    'Premium organic compost made from food waste and yard trimmings. Rich in nutrients for your garden.',
    12.25,
    'Home & Garden',
    1,
    75,
    ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b'],
    'active'
),
(
    'Textile Fabric Scraps',
    'Mixed textile fabric scraps in various colors and patterns. Great for quilting and craft projects.',
    18.00,
    'Clothing',
    4,
    200,
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64'],
    'active'
),
(
    'Metal Scrap Collection',
    'Sorted metal scraps including aluminum, copper, and steel. Perfect for recycling and metalworking projects.',
    45.30,
    'Electronics',
    2,
    80,
    ARRAY['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122'],
    'active'
),
(
    'Paper Waste Bundle',
    'Clean paper waste including newspapers, magazines, and office paper. Ready for recycling processing.',
    8.50,
    'Books',
    5,
    300,
    ARRAY['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
    'active'
),
(
    'Glass Container Set',
    'Assorted glass containers and bottles. Clean and sorted by color for efficient recycling.',
    22.80,
    'Home & Garden',
    3,
    120,
    ARRAY['https://images.unsplash.com/photo-1591291621164-2c6367723315'],
    'active'
);
