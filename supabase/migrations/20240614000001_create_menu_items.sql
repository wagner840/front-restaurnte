-- Create menu_items table
CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NULL,
  price numeric(10, 2) NOT NULL,
  category text NOT NULL,
  image text NULL,
  available boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT menu_items_pkey PRIMARY KEY (id)
);

-- Populate menu_items table
INSERT INTO public.menu_items (name, description, price, category) VALUES
-- Burgers
('RED BURGER', 'Famoso Pão, carne e queijo. E claro, maionese da Red.', 18.00, 'Burger'),
('RED SALAD', 'Pão, maionese, carne, queijo, alface e cebola roxa. Um pouco de burger um pouco de salada.', 20.00, 'Burger'),
('RED DUPLO x2', 'Pão, maionese, duas carnes e dois queijos.', 24.00, 'Burger'),
('RED CHEDDAR BACON', 'Pão, maionese, carne, queijos, bacon e muuuito cheddar.', 24.00, 'Burger'),
('RED BARBECUE', 'Pão, maionese, carne, cebola caramelizada e molho barbecue.', 20.00, 'Burger'),
('RED VEG', 'Pão, maionese, hambúrguer empanado de planta (mix de legumes), cebola caramelizada e molho barbecue.', 18.00, 'Burger'),
('RED VEG FUTURO', 'Pão, maionese, hambúrguer do futuro, queijo.', 20.00, 'Burger'),

-- Smash
('SMASH AMSTERDÃ (Duplo)', 'Pão brioche, smash burger, queijo, cebola e picles.', 22.00, 'Smash'),
('SMASH AMSTERDÃ (Triplo)', 'Pão brioche, smash burger, queijo, cebola e picles.', 26.00, 'Smash'),
('SMASH AMSTERDÃ (Quad)', 'Pão brioche, smash burger, queijo, cebola e picles.', 30.00, 'Smash'),
('SMASH CHEDDAR BACON (Duplo)', 'Pão brioche, smash burger, queijo cheddar cremoso, bacon em cubos, cebola e picles.', 22.00, 'Smash'),
('SMASH CHEDDAR BACON (Triplo)', 'Pão brioche, smash burger, queijo cheddar cremoso, bacon em cubos, cebola e picles.', 26.00, 'Smash'),
('SMASH CHEDDAR BACON (Quad)', 'Pão brioche, smash burger, queijo cheddar cremoso, bacon em cubos, cebola e picles.', 30.00, 'Smash'),
('SMASH BARBECUE (Duplo)', 'Pão brioche, smash burger, queijo, cebola caramelizada e molho barbecue.', 22.00, 'Smash'),
('SMASH BARBECUE (Triplo)', 'Pão brioche, smash burger, queijo, cebola caramelizada e molho barbecue.', 26.00, 'Smash'),
('SMASH BARBECUE (Quad)', 'Pão brioche, smash burger, queijo, cebola caramelizada e molho barbecue.', 30.00, 'Smash'),
('SMASH FUTURO (Duplo)', 'Pão brioche, hambúrguer do futuro, queijo, cebola caramelizada e molho barbecue.', 22.00, 'Smash'),
('SMASH FUTURO (Triplo)', 'Pão brioche, hambúrguer do futuro, queijo, cebola caramelizada e molho barbecue.', 26.00, 'Smash'),
('SMASH FUTURO (Quad)', 'Pão brioche, hambúrguer do futuro, queijo, cebola caramelizada e molho barbecue.', 30.00, 'Smash'),

-- Finger Foods
('BATATA FRITA', NULL, 10.00, 'Finger Foods'),
('BATATA CHEDDAR BACON', 'Batata canoa com cheddar cremoso e bacon em cubos.', 15.00, 'Finger Foods'),
('BITTERBALLEN', 'Empanado de carne típica da Holanda.', 15.00, 'Finger Foods'),
('ONION RINGS', NULL, 15.00, 'Finger Foods'),
('DADINHO DE TAPIOCA', NULL, 15.00, 'Finger Foods'),

-- Doce
('MINI CHURROS', NULL, 12.00, 'Doce'),
('ADICIONAL DE DOCE DE LEITE', NULL, 3.00, 'Doce'),

-- Adicionais
('SALADA', NULL, 3.00, 'Adicionais'),
('BACON', NULL, 4.00, 'Adicionais'),
('MAIONESE', NULL, 2.00, 'Adicionais'),
('CHEDDAR', NULL, 3.00, 'Adicionais'),

-- Chopp
('PILSEN', NULL, 10.00, 'Chopp'),
('WEISS', NULL, 13.00, 'Chopp'),
('BLONDE', NULL, 15.00, 'Chopp'),
('APA', NULL, 15.00, 'Chopp'),
('IPA', NULL, 18.00, 'Chopp'),

-- Vinho
('VINHO TAÇA', NULL, 15.00, 'Vinho'),
('VINHO GARRAFA', NULL, 60.00, 'Vinho'),

-- Soft
('ÁGUA COM OU SEM GÁS', NULL, 4.00, 'Soft'),
('LIMONADA', NULL, 10.00, 'Soft'),
('CHÁ', NULL, 5.00, 'Soft'),
('REFRI', NULL, 5.00, 'Soft'),
('SUCOS', NULL, 5.00, 'Soft'),
('RED BULL/MONSTER', NULL, 15.00, 'Soft'),

-- Shot
('MARACATAIA', NULL, 6.00, 'Shot'),
('JAMBU', NULL, 15.00, 'Shot'),
('JAGGERMEISTER', NULL, 20.00, 'Shot'),
('LICOR 43', NULL, 20.00, 'Shot'),
('TEQUILA', NULL, 15.00, 'Shot'),
('SHOT DA CASA', NULL, 15.00, 'Shot'),

-- Drink
('CUBA LIBRE (440ml)', NULL, 18.00, 'Drink'),
('CUBA LIBRE (1 Litro)', NULL, 50.00, 'Drink'),
('JAGGER BOMB (440ml)', NULL, 25.00, 'Drink'),
('JAGGER BOMB (1 Litro)', NULL, 70.00, 'Drink'),
('JAGGERBOMB REDBULL (440ml)', NULL, 35.00, 'Drink'),
('JAGGERBOMB REDBULL (1 Litro)', NULL, 85.00, 'Drink'),
('FIREBOMB (440ml)', NULL, 25.00, 'Drink'),
('FIREBOMB (1 Litro)', NULL, 70.00, 'Drink'),
('FIREBOMB REDBULL (440ml)', NULL, 35.00, 'Drink'),
('FIREBOMB REDBULL (1 Litro)', NULL, 85.00, 'Drink'),
('NEGRONI', NULL, 25.00, 'Drink'),
('SMIRNOFF C/ ENERGETICO (440ml)', NULL, 18.00, 'Drink'),
('SMIRNOFF C/ ENERGETICO (1 Litro)', NULL, 50.00, 'Drink'),
('SMIRNOFF C/ REDBULL (440ml)', NULL, 25.00, 'Drink'),
('SMIRNOFF C/ REDBULL (1 Litro)', NULL, 65.00, 'Drink'),
('ÁGUA DE VALETA (440ml)', NULL, 20.00, 'Drink'),
('ÁGUA DE VALETA (1 Litro)', NULL, 55.00, 'Drink'),
('MANGO LOCO (440ml)', NULL, 25.00, 'Drink'),
('MANGO LOCO (1 Litro)', NULL, 65.00, 'Drink'),
('JAMBU TÔNICA (440ml)', NULL, 25.00, 'Drink'),
('JAMBU TÔNICA (1 Litro)', NULL, 65.00, 'Drink'),
('MOSCOW MULE', NULL, 30.00, 'Drink'),
('MOJITO', NULL, 25.00, 'Drink'),
('CAIPIRINHA', NULL, 25.00, 'Drink'),
('JACK COKE (440ml)', NULL, 35.00, 'Drink'),
('JACK COKE (1 Litro)', NULL, 90.00, 'Drink'),
('JIM BEAN N'' COKE', NULL, 25.00, 'Drink'),
('GIN TÔNICA', NULL, 20.00, 'Drink'),
('GIN TROPICAL', NULL, 25.00, 'Drink'),
('GIN PINK', NULL, 25.00, 'Drink');