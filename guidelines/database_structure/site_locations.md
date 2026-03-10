CREATE TABLE site_locations (
id BIGSERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,

    logo_url TEXT,

    description TEXT,

    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()

);

INSERT INTO site_locations
(title, slug, logo_url, description, meta_title, meta_description, meta_keywords, is_active)
VALUES

(
'Cebu',
'cebu',
'https://example.com/logos/cebu.svg',
'Cebu is one of the Philippines’ top real estate investment destinations, offering a wide selection of condominiums, houses, and commercial properties in Cebu City and nearby areas.',
'Cebu Real Estate | Houses and Condos for Sale in Cebu',
'Explore Cebu real estate listings including condominiums, houses, and investment properties in Cebu City and surrounding areas.',
'cebu real estate, cebu condos, houses for sale cebu, property for sale cebu',
TRUE
),

(
'BGC',
'bgc',
'https://example.com/logos/bgc.svg',
'Bonifacio Global City (BGC) is a premier business and residential district in Metro Manila known for luxury condominiums, modern infrastructure, and prime investment opportunities.',
'BGC Real Estate | Condos and Properties in Bonifacio Global City',
'Find premium condominiums and real estate investments in Bonifacio Global City, Metro Manila.',
'bgc real estate, bgc condos, bonifacio global city property, metro manila condos',
TRUE
),

(
'Cavite',
'cavite',
'https://example.com/logos/cavite.svg',
'Cavite offers a growing real estate market with affordable house and lot developments, subdivisions, and investment properties near Metro Manila.',
'Cavite Real Estate | House and Lot for Sale in Cavite',
'Browse houses, subdivisions, and investment properties available in Cavite.',
'cavite real estate, cavite house and lot, property for sale cavite',
TRUE
),

(
'Bacolod',
'bacolod',
'https://example.com/logos/bacolod.svg',
'Bacolod City provides affordable real estate opportunities including houses, condominiums, and residential developments in Negros Occidental.',
'Bacolod Real Estate | Properties for Sale in Bacolod',
'Discover Bacolod real estate listings including residential homes, condos, and investment properties.',
'bacolod real estate, bacolod houses for sale, negros property',
TRUE
),

(
'Bohol',
'bohol',
'https://example.com/logos/bohol.svg',
'Bohol offers unique real estate investment opportunities with beachfront properties, residential homes, and tourism-driven developments.',
'Bohol Real Estate | Beachfront and Investment Properties',
'Explore Bohol real estate including beachfront properties, houses, and tourism investments.',
'bohol real estate, bohol beachfront property, bohol investment properties',
TRUE
),

(
'Iloilo',
'iloilo',
'https://example.com/logos/iloilo.svg',
'Iloilo City is an emerging real estate hub in Western Visayas featuring condominiums, residential subdivisions, and commercial investment properties.',
'Iloilo Real Estate | Condos and Houses for Sale',
'Find Iloilo real estate listings including condominiums, residential homes, and investment opportunities.',
'iloilo real estate, iloilo condos, houses for sale iloilo',
TRUE
),

(
'Cagayan De Oro',
'cagayan-de-oro',
'https://example.com/logos/cagayan-de-oro.svg',
'Cagayan de Oro is a key economic center in Northern Mindanao offering residential homes, condominiums, and commercial real estate investments.',
'Cagayan de Oro Real Estate | Houses and Condos for Sale',
'Browse real estate listings in Cagayan de Oro including residential homes, condos, and investment properties.',
'cagayan de oro real estate, cdo property, houses for sale cdo',
TRUE
),

(
'Davao',
'davao',
'https://example.com/logos/davao.svg',
'Davao City is one of the fastest-growing real estate markets in Mindanao with residential condominiums, houses, and commercial investment opportunities.',
'Davao Real Estate | Houses and Condos in Davao City',
'Discover properties for sale in Davao including condominiums, houses, and investment opportunities.',
'davao real estate, davao condos, houses for sale davao',
TRUE
),

(
'Gensan',
'gensan',
'https://example.com/logos/gensan.svg',
'General Santos City, also known as Gensan, offers residential and commercial real estate opportunities in a growing economic hub in Mindanao.',
'General Santos Real Estate | Properties for Sale in Gensan',
'Explore houses, residential developments, and investment properties in General Santos City.',
'gensan real estate, general santos property, houses for sale gensan',
TRUE
),

(
'Pampanga',
'pampanga',
'https://example.com/logos/pampanga.svg',
'Pampanga is a fast-developing province in Central Luzon offering residential subdivisions, house and lot developments, and investment properties.',
'Pampanga Real Estate | Houses and Properties for Sale',
'Find Pampanga real estate listings including houses, residential communities, and investment opportunities.',
'pampanga real estate, pampanga houses for sale, central luzon property',
TRUE
);
