require('dotenv').config();
const pool = require('./src/config/database');

const categorias = [
  { nombre: 'Plato del Día', nombre_en: 'Dish of the Day', emoji: '⭐', orden: 1 },
  { nombre: 'Desayunos', nombre_en: 'Breakfast', emoji: '☀️', orden: 2 },
  { nombre: 'Entrantes', nombre_en: 'Starters', emoji: '🥗', orden: 3 },
  { nombre: 'Comidas',   nombre_en: 'Mains',     emoji: '🍔', orden: 4 },
  { nombre: 'Bebidas',   nombre_en: 'Drinks',    emoji: '🥤', orden: 5 },
];

const productos = [
  // ── DESAYUNOS ──
  { categoria: 'Desayunos', subseccion: 'Tostadas (½ / enteras)', subseccion_en: 'Toast (½ / full)', nombre: 'Tostada con Mermelada', nombre_en: 'Jam Toast', descripcion: 'Homemade jam', descripcion_es: 'Mermelada casera', precio: 1.50, orden: 1 },
  { categoria: 'Desayunos', subseccion: 'Tostadas (½ / enteras)', subseccion_en: 'Toast (½ / full)', nombre: 'Tostada con Mantequilla', nombre_en: 'Butter Toast', descripcion: 'Fresh butter', descripcion_es: 'Mantequilla fresca', precio: 1.50, orden: 2 },
  { categoria: 'Desayunos', subseccion: 'Tostadas (½ / enteras)', subseccion_en: 'Toast (½ / full)', nombre: 'Tostada con Jamón', nombre_en: 'Ham Toast', descripcion: 'Cured ham', descripcion_es: 'Jamón curado', precio: 1.70, orden: 3 },
  { categoria: 'Desayunos', subseccion: 'Tostadas (½ / enteras)', subseccion_en: 'Toast (½ / full)', nombre: 'Tostada con Tomate', nombre_en: 'Tomato Toast', descripcion: 'Fresh tomato & olive oil', descripcion_es: 'Tomate y aceite de oliva', precio: 1.20, orden: 4 },
  { categoria: 'Desayunos', subseccion: 'Tostadas (½ / enteras)', subseccion_en: 'Toast (½ / full)', nombre: 'Tostada con Queso', nombre_en: 'Cheese Toast', descripcion: 'Melted cheese', descripcion_es: 'Queso fundido', precio: 1.50, orden: 5 },
  { categoria: 'Desayunos', subseccion: 'Tostadas (½ / enteras)', subseccion_en: 'Toast (½ / full)', nombre: 'Tostada con Atún', nombre_en: 'Tuna Toast', descripcion: 'Tuna with mayo', descripcion_es: 'Atún con mayonesa', precio: 2.00, orden: 6 },
  { categoria: 'Desayunos', subseccion: 'Tostadas (½ / enteras)', subseccion_en: 'Toast (½ / full)', nombre: 'Tostada con Bacon', nombre_en: 'Bacon Toast', descripcion: 'Crispy bacon', descripcion_es: 'Bacon crujiente', precio: 1.70, orden: 7 },
  { categoria: 'Desayunos', subseccion: 'Platos de Desayuno', subseccion_en: 'Breakfast Plates', nombre: 'Huevo, Bacon y Tostada', nombre_en: 'Egg, Bacon & Toast', descripcion: 'Fried egg, crispy bacon & toast', descripcion_es: 'Huevo frito, bacon crujiente y tostada', precio: 5.00, orden: 8 },
  { categoria: 'Desayunos', subseccion: 'Platos de Desayuno', subseccion_en: 'Breakfast Plates', nombre: 'Tortilla Jamón y Queso', nombre_en: 'Omelette Ham & Cheese', descripcion: 'Ham & cheese omelette with toast', descripcion_es: 'Tortilla de jamón y queso con tostada', precio: 5.00, orden: 9 },
  { categoria: 'Desayunos', subseccion: 'Platos de Desayuno', subseccion_en: 'Breakfast Plates', nombre: 'Revuelto con Lomo', nombre_en: 'Scrambled Egg with Pork Loin', descripcion: 'Scrambled eggs, onion, tomato & pork loin', descripcion_es: 'Huevos revueltos con cebolla, tomate y lomo', precio: 6.00, orden: 10 },
  { categoria: 'Desayunos', subseccion: 'Platos de Desayuno', subseccion_en: 'Breakfast Plates', nombre: 'Wrap de Huevos y Bacon', nombre_en: 'Wrap with Eggs & Bacon', descripcion: 'Flour wrap with eggs and bacon', descripcion_es: 'Wrap con huevos y bacon', precio: 6.00, orden: 11 },
  { categoria: 'Desayunos', subseccion: 'Platos de Desayuno', subseccion_en: 'Breakfast Plates', nombre: 'Churros', nombre_en: 'Churros', descripcion: 'Traditional Spanish churros', descripcion_es: 'Churros tradicionales', precio: 3.00, orden: 12 },

  // ── ENTRANTES ──
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Nuggets y Patatas', nombre_en: 'Nuggets & Chips', descripcion: 'Golden chicken nuggets with fries', descripcion_es: 'Nuggets de pollo con patatas', precio: 5.00, orden: 1 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Nachos', nombre_en: 'Nachos', descripcion: 'Tortilla chips with cheese sauce', descripcion_es: 'Nachos con salsa de queso', precio: 4.50, orden: 2 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Aros de Cebolla', nombre_en: 'Onion Rings', descripcion: 'Crispy golden onion rings', descripcion_es: 'Aros de cebolla crujientes', precio: 3.00, orden: 3 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Panini', nombre_en: 'Panini', descripcion: 'Tomato, onion, pepperoni, bacon & cheese', descripcion_es: 'Tomate, cebolla, pepperoni, bacon y queso', precio: 3.50, orden: 4 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Croquetas', nombre_en: 'Croquetas', descripcion: 'Homemade Spanish croquettes', descripcion_es: 'Croquetas caseras', precio: 3.00, orden: 5 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Patatas Fritas', nombre_en: 'French Fries', descripcion: 'Classic golden fries', descripcion_es: 'Patatas fritas clásicas', precio: 3.50, orden: 6 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Patatas Especiales', nombre_en: 'Special French Fries', descripcion: 'Loaded fries with special toppings', descripcion_es: 'Patatas con toppings especiales', precio: 4.50, orden: 7 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Huevos Rotos', nombre_en: 'Huevos Rotos', descripcion: 'Fried eggs with chips and ham', descripcion_es: 'Huevos fritos con patatas y jamón', precio: 4.50, orden: 8 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Patatas Alioli', nombre_en: 'Alioli Chips', descripcion: 'Fries with homemade alioli', descripcion_es: 'Patatas con alioli casero', precio: 4.00, orden: 9 },
  { categoria: 'Entrantes', subseccion: null, subseccion_en: null, nombre: 'Patatas Bravas', nombre_en: 'Bravas Chips', descripcion: 'Fries with spicy brava sauce', descripcion_es: 'Patatas con salsa brava picante', precio: 4.00, orden: 10 },

  // ── COMIDAS - Hamburguesas ──
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Cheese Burger', nombre_en: 'Cheese Burger', descripcion: 'Meat, lettuce, tomato, crispy onions & BBQ sauce', descripcion_es: 'Carne, lechuga, tomate, cebolla crujiente y BBQ', precio: 6.00, orden: 1 },
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Special Burger', nombre_en: 'Special Burger', descripcion: 'Meat, lettuce, tomato, crispy onions, bacon, cheese, egg & BBQ', descripcion_es: 'Carne, lechuga, tomate, cebolla, bacon, queso, huevo y BBQ', precio: 7.00, orden: 2 },
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Classic Burger', nombre_en: 'Classic Burger', descripcion: 'Meat, onions, cheese, pickle, ketchup & mustard', descripcion_es: 'Carne, cebolla, queso, pepinillo, ketchup y mostaza', precio: 6.00, orden: 3 },
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Chicken Burger', nombre_en: 'Chicken Burger', descripcion: 'Crispy chicken, cheese, lettuce, tomato & mayo', descripcion_es: 'Pollo crujiente, queso, lechuga, tomate y mayonesa', precio: 6.00, orden: 4 },
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Bacon Champions Burger', nombre_en: 'Bacon Champions Burger', descripcion: 'Meat, cheese, bacon, mushrooms, mayo & special sauce', descripcion_es: 'Carne, queso, bacon, champiñones, mayonesa y salsa especial', precio: 7.00, orden: 5 },
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Campometh Burger', nombre_en: 'Campometh Burger', descripcion: 'Meat, lettuce, tomato, onions, white cheese & sauce', descripcion_es: 'Carne, lechuga, tomate, cebollas, queso blanco y salsa', precio: 6.00, orden: 6 },
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Hot Dog', nombre_en: 'Hot Dog', descripcion: 'Classic hot dog with crispy onions', descripcion_es: 'Hot dog clásico con cebolla crujiente', precio: 3.20, orden: 7 },
  { categoria: 'Comidas', subseccion: 'Hamburguesas y Hot Dogs', subseccion_en: 'Burgers & Hot Dogs', nombre: 'Hot Dog Clásico', nombre_en: 'Hot Dog Classic', descripcion: 'Classic hot dog with onions & pickle', descripcion_es: 'Hot dog con cebolla y pepinillo', precio: 3.20, orden: 8 },

  // ── COMIDAS - Ensaladas ──
  { categoria: 'Comidas', subseccion: 'Ensaladas', subseccion_en: 'Salads', nombre: 'Ensalada Mixta', nombre_en: 'Mix Salad', descripcion: 'Lettuce, tomato, onion, carrot & beef', descripcion_es: 'Lechuga, tomate, cebolla, zanahoria y ternera', precio: 5.00, orden: 9 },
  { categoria: 'Comidas', subseccion: 'Ensaladas', subseccion_en: 'Salads', nombre: 'Ensalada de Pollo', nombre_en: 'Chicken Salad', descripcion: 'Lettuce, tomato, onion, carrot & chicken', descripcion_es: 'Lechuga, tomate, cebolla, zanahoria y pollo', precio: 6.00, orden: 10 },
  { categoria: 'Comidas', subseccion: 'Ensaladas', subseccion_en: 'Salads', nombre: 'Ensalada de Atún', nombre_en: 'Tuna Salad', descripcion: 'Lettuce, tomato, onion, carrot & tuna', descripcion_es: 'Lechuga, tomate, cebolla, zanahoria y atún', precio: 6.00, orden: 11 },
  { categoria: 'Comidas', subseccion: 'Ensaladas', subseccion_en: 'Salads', nombre: 'Ensalada César', nombre_en: 'Caesar Salad', descripcion: 'Lettuce, bacon, cheese, chicken & caesar sauce', descripcion_es: 'Lechuga, bacon, queso, pollo y salsa césar', precio: 7.00, orden: 12 },
  { categoria: 'Comidas', subseccion: 'Ensaladas', subseccion_en: 'Salads', nombre: 'Ensalada Especial', nombre_en: 'Special Salad', descripcion: 'Lettuce, tomato, ham, bacon, cheese, egg & chicken', descripcion_es: 'Lechuga, tomate, jamón, bacon, queso, huevo y pollo', precio: 7.00, orden: 13 },

  // ── COMIDAS - Wraps ──
  { categoria: 'Comidas', subseccion: 'Wraps', subseccion_en: 'Wraps', nombre: 'Wrap de Pollo', nombre_en: 'Chicken Wrap', descripcion: 'Lettuce, tomato, onion, carrot, chicken & sauce', descripcion_es: 'Lechuga, tomate, cebolla, zanahoria, pollo y salsa', precio: 5.50, notas: 'Grilled chicken +1€ / Plancha +1€', orden: 14 },
  { categoria: 'Comidas', subseccion: 'Wraps', subseccion_en: 'Wraps', nombre: 'Wrap de Atún', nombre_en: 'Tuna Wrap', descripcion: 'Lettuce, tomato, onion, carrot, tuna & sauce', descripcion_es: 'Lechuga, tomate, cebolla, zanahoria, atún y salsa', precio: 5.50, orden: 15 },
  { categoria: 'Comidas', subseccion: 'Wraps', subseccion_en: 'Wraps', nombre: 'Wrap Especial Justin', nombre_en: 'Special Justin Wrap', descripcion: 'Pork, lettuce, tomato, onion, green pepper & garlic sauce', descripcion_es: 'Cerdo, lechuga, tomate, cebolla, pimiento verde y ajo', precio: 6.00, orden: 16 },
  { categoria: 'Comidas', subseccion: 'Wraps', subseccion_en: 'Wraps', nombre: 'Wrap César', nombre_en: 'Caesar Wrap', descripcion: 'Lettuce, chicken, bacon, cheese & caesar sauce', descripcion_es: 'Lechuga, pollo, bacon, queso y salsa césar', precio: 5.50, orden: 17 },

  // ── COMIDAS - Mix del Día ──
  { categoria: 'Comidas', subseccion: 'Platos Combinados', subseccion_en: 'Combo Plates', nombre: 'Pollo, Huevo, Patatas y Ensalada', nombre_en: 'Chicken, Egg, Chips & Salad', descripcion: 'Served with salad & fries (grilled +1€)', descripcion_es: 'Con ensalada y patatas (plancha +1€)', precio: 6.50, notas: 'Grilled +1€ / Plancha +1€', orden: 18 },
  { categoria: 'Comidas', subseccion: 'Platos Combinados', subseccion_en: 'Combo Plates', nombre: 'Lomo, Patatas y Ensalada', nombre_en: 'Pork Loin, Chips & Salad', descripcion: 'Pork loin with salad & fries', descripcion_es: 'Lomo con ensalada y patatas', precio: 6.50, orden: 19 },
  { categoria: 'Comidas', subseccion: 'Platos Combinados', subseccion_en: 'Combo Plates', nombre: 'Huevo, Bacon, Salchicha y Patatas', nombre_en: 'Egg, Bacon, Sausage & Chips', descripcion: 'Hearty breakfast-style plate', descripcion_es: 'Plato contundente estilo desayuno', precio: 6.50, orden: 20 },

  // ── COMIDAS - Sándwiches ──
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Sándwich de Atún', nombre_en: 'Tuna Sandwich', descripcion: 'Tuna, lettuce, tomato & mayo', descripcion_es: 'Atún, lechuga, tomate y mayonesa', precio: 4.00, orden: 21 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Bikini', nombre_en: 'Bikini', descripcion: 'Toasted ham & cheese', descripcion_es: 'Jamón y queso tostado', precio: 3.20, orden: 22 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'B.L.T.', nombre_en: 'B.L.T.', descripcion: 'Bacon, lettuce, tomato, mayo & mustard', descripcion_es: 'Bacon, lechuga, tomate, mayonesa y mostaza', precio: 3.50, orden: 23 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Sándwich BBQ', nombre_en: 'BBQ Sandwich', descripcion: 'Cheese, bacon, onions & BBQ sauce', descripcion_es: 'Queso, bacon, cebolla y salsa BBQ', precio: 3.50, orden: 24 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Champions Sándwich', nombre_en: 'Champions Sandwich', descripcion: 'Cheese, onions & mushrooms', descripcion_es: 'Queso, cebollas y champiñones', precio: 3.50, orden: 25 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Sándwich Vegetal', nombre_en: 'Vegetables Sandwich', descripcion: 'Cheese, lettuce, tomato, onion & carrot', descripcion_es: 'Queso, lechuga, tomate, cebolla y zanahoria', precio: 3.50, orden: 26 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Sándwich Mix', nombre_en: 'Mix Sandwich', descripcion: 'Ham, cheese, egg & tomato', descripcion_es: 'Jamón, queso, huevo y tomate', precio: 4.00, orden: 27 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Sándwich Especial', nombre_en: 'Special Sandwich', descripcion: 'Chicken, egg, bacon, cheese, lettuce, tomato & sauce', descripcion_es: 'Pollo, huevo, bacon, queso, lechuga, tomate y salsa', precio: 6.00, orden: 28 },
  { categoria: 'Comidas', subseccion: 'Sandwich', subseccion_en: 'Sandwich', nombre: 'Queso y Bacon', nombre_en: 'Cheese & Bacon', descripcion: 'Melted cheese with crispy bacon', descripcion_es: 'Queso fundido con bacon crujiente', precio: 3.50, orden: 29 },

  // ── COMIDAS - Bocadillos ──
  { categoria: 'Comidas', subseccion: 'Bocadillos', subseccion_en: 'Baguettes', nombre: 'Jamón y Queso', nombre_en: 'Ham & Cheese', descripcion: 'Cured ham with cheese', descripcion_es: 'Jamón curado con queso', precio: 5.00, orden: 30 },
  { categoria: 'Comidas', subseccion: 'Bocadillos', subseccion_en: 'Baguettes', nombre: 'Lomo y Queso', nombre_en: 'Pork Loin & Cheese', descripcion: 'Pork loin with cheese', descripcion_es: 'Lomo con queso', precio: 5.00, orden: 31 },
  { categoria: 'Comidas', subseccion: 'Bocadillos', subseccion_en: 'Baguettes', nombre: 'Pollo Empanado', nombre_en: 'Breaded Chicken', descripcion: 'Breaded chicken (grilled +1€)', descripcion_es: 'Pollo empanado (plancha +1€)', precio: 5.00, notas: 'Grilled +1€ / Plancha +1€', orden: 32 },
  { categoria: 'Comidas', subseccion: 'Bocadillos', subseccion_en: 'Baguettes', nombre: 'Atún y Mayonesa', nombre_en: 'Tuna & Mayonnaise', descripcion: 'Tuna with homemade mayo', descripcion_es: 'Atún con mayonesa casera', precio: 5.00, orden: 33 },
  { categoria: 'Comidas', subseccion: 'Bocadillos', subseccion_en: 'Baguettes', nombre: 'Bocadillo de Tortilla', nombre_en: 'Omelette Baguette', descripcion: 'Spanish omelette on baguette', descripcion_es: 'Tortilla española en baguette', precio: 5.00, orden: 34 },
  { categoria: 'Comidas', subseccion: 'Bocadillos', subseccion_en: 'Baguettes', nombre: 'Chevere', nombre_en: 'Chevere', descripcion: 'Chicken, bacon, egg, cheese, lettuce, tomato, crispy onions & sauce', descripcion_es: 'Pollo, bacon, huevo, queso, lechuga, tomate, cebolla crujiente y salsa', precio: 6.50, orden: 35 },
  { categoria: 'Comidas', subseccion: 'Bocadillos', subseccion_en: 'Baguettes', nombre: 'Baguette Rhett', nombre_en: 'Rhett Baguette', descripcion: 'Egg, bacon, cheese & tomato', descripcion_es: 'Huevo, bacon, queso y tomate', precio: 5.00, orden: 36 },

  // ── BEBIDAS ──
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Agua sin Gas', nombre_en: 'Still Water', descripcion: '0.5L bottle', descripcion_es: 'Botella 0.5L', precio: 1.20, orden: 1 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Agua con Gas', nombre_en: 'Sparkling Water', descripcion: '0.5L bottle', descripcion_es: 'Botella 0.5L', precio: 1.50, orden: 2 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Coca-Cola', nombre_en: 'Coca-Cola', descripcion: '330ml', descripcion_es: '330ml', precio: 2.20, orden: 3 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Coca-Cola Zero', nombre_en: 'Coca-Cola Zero', descripcion: '330ml', descripcion_es: '330ml', precio: 2.20, orden: 4 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Fanta Naranja', nombre_en: 'Fanta Orange', descripcion: '330ml', descripcion_es: '330ml', precio: 2.20, orden: 5 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Fanta Limón', nombre_en: 'Fanta Lemon', descripcion: '330ml', descripcion_es: '330ml', precio: 2.20, orden: 6 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Limonada Natural', nombre_en: 'Fresh Lemonade', descripcion: 'Freshly made', descripcion_es: 'Recién preparada', precio: 2.80, orden: 7 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Zumo de Naranja', nombre_en: 'Orange Juice', descripcion: 'Freshly squeezed', descripcion_es: 'Recién exprimido', precio: 2.50, orden: 8 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Café', nombre_en: 'Coffee', descripcion: 'Espresso / Americano', descripcion_es: 'Espresso / Americano', precio: 1.50, orden: 9 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Café con Leche', nombre_en: 'Caffe Latte', descripcion: 'Espresso with steamed milk', descripcion_es: 'Espresso con leche al vapor', precio: 1.80, orden: 10 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Caña', nombre_en: 'Draft Beer (small)', descripcion: 'Fresh draft beer', descripcion_es: 'Cerveza fresca de grifo', precio: 2.00, orden: 11 },
  { categoria: 'Bebidas', subseccion: null, subseccion_en: null, nombre: 'Jarra', nombre_en: 'Draft Beer (large)', descripcion: '500ml draft beer', descripcion_es: 'Cerveza de grifo 500ml', precio: 3.50, orden: 12 },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Limpiar tablas
    await client.query('DELETE FROM productos');
    await client.query('DELETE FROM categorias');
    await client.query('ALTER SEQUENCE categorias_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE productos_id_seq RESTART WITH 1');

    // Insertar categorías
    const catMap = {};
    for (const cat of categorias) {
      const res = await client.query(
        `INSERT INTO categorias (nombre, nombre_en, emoji, orden) VALUES ($1, $2, $3, $4) RETURNING id`,
        [cat.nombre, cat.nombre_en, cat.emoji, cat.orden]
      );
      catMap[cat.nombre] = res.rows[0].id;
    }

    // Insertar productos
    for (const p of productos) {
      const catId = catMap[p.categoria];
      await client.query(
        `INSERT INTO productos (categoria_id, nombre, nombre_en, descripcion, descripcion_es, subseccion, subseccion_en, precio, notas, orden, disponible)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
        [catId, p.nombre, p.nombre_en, p.descripcion, p.descripcion_es, p.subseccion || null, p.subseccion_en || null, p.precio, p.notas || null, p.orden]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Menú insertado: ${categorias.length} categorías, ${productos.length} productos`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
