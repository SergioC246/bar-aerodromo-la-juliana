const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URLS = {
  cliente: 'https://bar-aerodromo-la-juliana.onrender.com/',
  cocina: 'https://bar-aerodromo-la-juliana.onrender.com/cocina.html',
  admin: 'https://bar-aerodromo-la-juliana.onrender.com/admin.html'
};

const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

async function takeScreenshots() {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR);
  }

  const browser = await puppeteer.launch({ headless: true });

  try {
    // Cliente
    console.log('📸 Capturando página del cliente...');
    let page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(URLS.cliente, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'cliente.png'), fullPage: true });
    await page.close();

    // Cocina
    console.log('📸 Capturando página de cocina...');
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(URLS.cocina, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'cocina.png'), fullPage: true });
    await page.close();

    // Admin
    console.log('📸 Capturando página de admin...');
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(URLS.admin, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'admin.png'), fullPage: true });
    await page.close();

    console.log('✅ Capturas completadas');
  } catch (error) {
    console.error('❌ Error tomando capturas:', error);
  } finally {
    await browser.close();
  }
}

async function generatePDF() {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentación - Bar Aerodromo La Juliana</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }

    .page {
      background: white;
      padding: 40px;
      margin: 20px auto;
      max-width: 900px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      page-break-after: always;
    }

    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .cover h1 {
      font-size: 3em;
      margin-bottom: 20px;
    }

    .cover p {
      font-size: 1.3em;
      opacity: 0.9;
    }

    h1 {
      color: #667eea;
      border-bottom: 3px solid #667eea;
      padding-bottom: 15px;
      margin: 30px 0 20px 0;
      font-size: 2em;
    }

    h2 {
      color: #764ba2;
      margin: 25px 0 15px 0;
      font-size: 1.5em;
    }

    h3 {
      color: #667eea;
      margin: 20px 0 10px 0;
      font-size: 1.2em;
    }

    p, li {
      margin-bottom: 10px;
      font-size: 0.95em;
      line-height: 1.8;
    }

    .section {
      margin: 30px 0;
    }

    .flow-item {
      background: #f0f4ff;
      padding: 15px;
      margin: 10px 0;
      border-left: 4px solid #667eea;
      border-radius: 4px;
    }

    .step {
      display: flex;
      align-items: flex-start;
      margin: 15px 0;
    }

    .step-number {
      background: #667eea;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      flex-shrink: 0;
      font-weight: bold;
    }

    .step-content {
      flex: 1;
    }

    ul {
      margin-left: 20px;
    }

    ul li {
      margin-bottom: 8px;
    }

    .screenshot-container {
      margin: 20px 0;
      text-align: center;
    }

    .screenshot-container img {
      max-width: 100%;
      height: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .screenshot-label {
      font-size: 0.9em;
      color: #666;
      margin-top: 10px;
      font-style: italic;
    }

    .features {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }

    .feature-box {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 4px;
      border: 1px solid #eee;
    }

    .feature-box h4 {
      color: #667eea;
      margin-bottom: 8px;
    }

    .highlight {
      background: #fff3cd;
      padding: 15px;
      border-radius: 4px;
      border-left: 4px solid #ffc107;
      margin: 15px 0;
    }

    .toc {
      background: #f0f4ff;
      padding: 20px;
      border-radius: 4px;
      margin: 20px 0;
    }

    .toc ul {
      margin-left: 20px;
    }

    .toc li {
      margin: 8px 0;
    }

    .toc a {
      color: #667eea;
      text-decoration: none;
    }

    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #999;
      font-size: 0.9em;
    }

    @media print {
      .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
      }
      body {
        background: white;
      }
    }
  </style>
</head>
<body>
  <!-- PORTADA -->
  <div class="page cover">
    <h1>🍽️ Bar Aerodromo La Juliana</h1>
    <p>Presentación Completa del Sistema</p>
    <p style="margin-top: 40px; font-size: 1em;">Guía de Usuario - Cliente, Cocina y Admin</p>
  </div>

  <!-- ÍNDICE -->
  <div class="page">
    <h1>📑 Índice de Contenidos</h1>
    <div class="toc">
      <ul>
        <li><strong>1. Introducción</strong> - Qué es Bar Aerodromo La Juliana</li>
        <li><strong>2. Flujo del Cliente</strong> - Desde el código QR hasta el pago</li>
        <li><strong>3. Flujo de Cocina</strong> - Panel de comandas y preparación</li>
        <li><strong>4. Panel de Admin</strong> - Gestión completa del negocio</li>
        <li><strong>5. Conclusión</strong> - Resumen y soporte</li>
      </ul>
    </div>
  </div>

  <!-- INTRODUCCIÓN -->
  <div class="page">
    <h1>1. Introducción</h1>
    <h2>¿Qué es Bar Aerodromo La Juliana?</h2>
    <p>Bar Aerodromo La Juliana es un <strong>sistema de gestión de pedidos y comandas digital</strong> diseñado para optimizar la experiencia tanto de clientes como del personal del bar/restaurante.</p>

    <h2>Características Principales</h2>
    <div class="features">
      <div class="feature-box">
        <h4>📱 Acceso por QR</h4>
        <p>Los clientes escanean un código QR desde su mesa para acceder al menú digital</p>
      </div>
      <div class="feature-box">
        <h4>🛒 Carrito de Compras</h4>
        <p>Selecciona múltiples platos y gestiona tu pedido fácilmente</p>
      </div>
      <div class="feature-box">
        <h4>👨‍🍳 Cocina Digital</h4>
        <p>El equipo de cocina recibe las comandas en tiempo real</p>
      </div>
      <div class="feature-box">
        <h4>📊 Panel de Admin</h4>
        <p>Control total sobre menú, pedidos e informes del negocio</p>
      </div>
    </div>

    <h2>Seguridad y Autenticación</h2>
    <p>El sistema utiliza <strong>tokens JWT</strong> para proteger la información sensible del admin y de los pedidos. Solo los usuarios autorizados pueden acceder a cada sección.</p>
  </div>

  <!-- FLUJO DEL CLIENTE - PARTE 1 -->
  <div class="page">
    <h1>2. Flujo del Cliente</h1>
    <h2>Descripción General</h2>
    <p>El cliente sigue estos pasos para hacer su pedido:</p>

    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <h3>Escanear Código QR</h3>
        <p>Desde su mesa, el cliente escanea el código QR impreso usando su teléfono. Esto lo redirige automáticamente a la página de pedidos.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <h3>Ver Menú y Seleccionar Platos</h3>
        <p>Se muestra el menú completo organizado por categorías. El cliente puede ver fotos, descripciones y precios de cada plato.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <h3>Añadir al Carrito</h3>
        <p>Selecciona la cantidad deseada y añade los platos al carrito. Puede ver el total actualizado en tiempo real.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">4</div>
      <div class="step-content">
        <h3>Rellenar Datos Personales</h3>
        <p>Ingresa nombre, teléfono y cualquier nota especial para el pedido (alergias, preferencias, etc.)</p>
      </div>
    </div>

    <div class="step">
      <div class="step-number">5</div>
      <div class="step-content">
        <h3>Proceder al Pago</h3>
        <p>El cliente se dirige a caja para completar el pago. El pedido ya está registrado en el sistema.</p>
      </div>
    </div>
  </div>

  <!-- FLUJO DEL CLIENTE - PARTE 2 (PANTALLA) -->
  <div class="page">
    <h1>2. Flujo del Cliente - Vista Detallada</h1>
    <h2>Interfaz del Cliente</h2>
    <p>A continuación se muestra la pantalla principal del cliente:</p>

    <div class="screenshot-container">
      <p><strong>Página Principal - Menú de Pedidos</strong></p>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; color: #999;">
        [CAPTURA DE PANTALLA: Cliente - Menú Principal]
      </div>
      <div class="screenshot-label">
        Aquí el cliente puede ver todas las categorías de platos y seleccionar los que desea
      </div>
    </div>

    <h2>Elementos Principales</h2>
    <ul>
      <li><strong>Categorías:</strong> Organizadas en tabs para fácil navegación</li>
      <li><strong>Platos:</strong> Muestra nombre, descripción, precio e imagen</li>
      <li><strong>Cantidad:</strong> Botones + y - para seleccionar cantidad</li>
      <li><strong>Carrito:</strong> Botón flotante que muestra el total de items y total de precio</li>
      <li><strong>Total:</strong> Se actualiza en tiempo real conforme añades platos</li>
    </ul>
  </div>

  <!-- CARRITO Y DATOS -->
  <div class="page">
    <h1>2. Flujo del Cliente - Carrito y Datos</h1>

    <h2>Vista del Carrito</h2>
    <div class="screenshot-container">
      <p><strong>Pantalla del Carrito</strong></p>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; color: #999;">
        [CAPTURA DE PANTALLA: Carrito de Compras]
      </div>
      <div class="screenshot-label">
        Aquí se muestran todos los platos seleccionados con la opción de modificar cantidades o eliminar items
      </div>
    </div>

    <h2>Formulario de Datos</h2>
    <h3>Información Requerida:</h3>
    <ul>
      <li><strong>Nombre Completo:</strong> Para identificar el pedido</li>
      <li><strong>Teléfono:</strong> Contacto en caso de necesario</li>
      <li><strong>Número de Mesa:</strong> Dónde será entregado el pedido (opcional)</li>
      <li><strong>Notas Especiales:</strong> Alergias, preferencias, instrucciones especiales (opcional)</li>
    </ul>

    <div class="highlight">
      <strong>💡 Consejo:</strong> Es importante que los clientes verifiquen sus datos antes de enviar el pedido, ya que esto agiliza la preparación y entrega.
    </div>
  </div>

  <!-- FLUJO COCINA -->
  <div class="page">
    <h1>3. Flujo de Cocina</h1>
    <h2>Panel de Cocina - Propósito</h2>
    <p>El panel de cocina es donde el equipo de preparación ve <strong>todas las comandas</strong> que deben preparar en tiempo real. Los pedidos llegan automáticamente a medida que los clientes los envían.</p>

    <h2>Secciones Principales</h2>

    <div class="flow-item">
      <h3>🔴 Comandas en Proceso</h3>
      <p>Muestra todos los pedidos que están siendo preparados actualmente. Cada comanda contiene:</p>
      <ul>
        <li>Número de pedido único</li>
        <li>Nombre del cliente</li>
        <li>Número de mesa</li>
        <li>Lista completa de platos a preparar</li>
        <li>Notas especiales o alergias</li>
        <li>Hora de recepción del pedido</li>
        <li>Botón para marcar como completado</li>
      </ul>
    </div>

    <div class="flow-item">
      <h3>✅ Comandas Completadas</h3>
      <p>Muestra todos los pedidos que ya fueron preparados y están listos para entregar. Se pueden ver para referencia o para verificar lo que se ha hecho.</p>
    </div>

    <div class="flow-item">
      <h3>🕐 Reloj en Tiempo Real</h3>
      <p>Un reloj digital muestra la hora actual. Esto permite al equipo de cocina saber exactamente cuánto tiempo lleva cada pedido en preparación y tomar decisiones sobre prioridades.</p>
    </div>
  </div>

  <!-- COCINA - VISTA DETALLADA -->
  <div class="page">
    <h1>3. Flujo de Cocina - Vista Detallada</h1>

    <div class="screenshot-container">
      <p><strong>Panel de Cocina - Comandas en Proceso</strong></p>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; color: #999;">
        [CAPTURA DE PANTALLA: Panel Cocina]
      </div>
      <div class="screenshot-label">
        Vista en tiempo real de todas las comandas que están siendo preparadas
      </div>
    </div>

    <h2>Cómo Usar el Panel</h2>
    <ol>
      <li><strong>Ver las comandas:</strong> Aparecen automáticamente cuando un cliente envía un pedido</li>
      <li><strong>Leer la comanda:</strong> Verifica el nombre del cliente, mesa y platos a preparar</li>
      <li><strong>Verificar notas:</strong> Lee cualquier alergia o preferencia especial</li>
      <li><strong>Preparar el pedido:</strong> Comienza a preparar todos los platos</li>
      <li><strong>Marcar como completado:</strong> Cuando todo esté listo, presiona el botón "Completado"</li>
      <li><strong>En la sección completadas:</strong> El pedido se mueve a "Comandas Completadas" para verificación final</li>
    </ol>

    <h2>Ventajas del Sistema</h2>
    <ul>
      <li>✅ Sin papeles - más limpio y ordenado</li>
      <li>✅ Tiempo real - los pedidos llegan instantáneamente</li>
      <li>✅ Priorización - pueden ver cuáles son los más antiguos</li>
      <li>✅ Notas visibles - alergias y preferencias siempre a la vista</li>
      <li>✅ Reloj integrado - control de tiempo de preparación</li>
    </ul>
  </div>

  <!-- PANEL ADMIN - INTRODUCCIÓN -->
  <div class="page">
    <h1>4. Panel de Administración</h1>
    <h2>Visión General</h2>
    <p>El panel de admin es el <strong>centro de control del negocio</strong>. Aquí el administrador puede:</p>

    <ul>
      <li>✏️ Gestionar el menú (crear, editar, eliminar platos)</li>
      <li>📋 Ver y gestionar todos los pedidos</li>
      <li>📊 Consultar informes y estadísticas de ventas</li>
      <li>👥 Controlar usuarios y accesos</li>
      <li>💰 Análisis de ingresos y productos más vendidos</li>
    </ul>

    <div class="highlight">
      <strong>🔐 Acceso Protegido:</strong> Solo usuarios autenticados pueden acceder al panel de admin. Se requiere una contraseña segura.
    </div>

    <h2>Estructura del Panel</h2>
    <p>El panel está dividido en tres secciones principales que veremos en detalle:</p>
    <ol>
      <li>Panel de Categorías y Menú</li>
      <li>Panel de Pedidos</li>
      <li>Panel de Informes y Estadísticas</li>
    </ol>
  </div>

  <!-- ADMIN - CATEGORÍAS -->
  <div class="page">
    <h1>4. Panel de Administración - Categorías y Menú</h1>

    <h2>¿Qué es la sección de Categorías?</h2>
    <p>Aquí puedes gestionar <strong>todas las categorías de platos</strong> (Entrada, Plato Principal, Postre, Bebidas, etc.) y los platos dentro de cada categoría.</p>

    <div class="screenshot-container">
      <p><strong>Panel de Categorías</strong></p>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; color: #999;">
        [CAPTURA DE PANTALLA: Admin - Categorías]
      </div>
      <div class="screenshot-label">
        Vista completa del panel de gestión de menú y categorías
      </div>
    </div>

    <h2>Operaciones Principales</h2>

    <h3>1️⃣ Agregar una Nueva Categoría</h3>
    <ul>
      <li>Presiona el botón "+ Nueva Categoría"</li>
      <li>Ingresa el nombre (ej: "Entradas", "Postres")</li>
      <li>Guarda los cambios</li>
    </ul>

    <h3>2️⃣ Agregar un Plato a una Categoría</h3>
    <ul>
      <li>Selecciona la categoría donde quieres agregar el plato</li>
      <li>Presiona "+ Nuevo Plato"</li>
      <li>Completa los datos:
        <ul>
          <li><strong>Nombre:</strong> Del plato</li>
          <li><strong>Descripción:</strong> Breve descripción de ingredientes</li>
          <li><strong>Precio:</strong> Costo del plato</li>
          <li><strong>Imagen:</strong> Foto del plato (opcional pero recomendado)</li>
        </ul>
      </li>
      <li>Guarda el plato</li>
    </ul>
  </div>

  <!-- ADMIN - EDITAR Y ELIMINAR -->
  <div class="page">
    <h1>4. Panel de Administración - Editar y Eliminar</h1>

    <h3>3️⃣ Modificar un Plato Existente</h3>
    <ul>
      <li>Busca el plato en la categoría correspondiente</li>
      <li>Presiona el botón "Editar" o el icono de lápiz ✏️</li>
      <li>Modifica los datos que necesites:
        <ul>
          <li>Cambiar nombre</li>
          <li>Actualizar descripción</li>
          <li>Ajustar precio</li>
          <li>Cambiar imagen</li>
        </ul>
      </li>
      <li>Guarda los cambios</li>
    </ul>

    <h3>4️⃣ Eliminar un Plato</h3>
    <ul>
      <li>Localiza el plato que deseas eliminar</li>
      <li>Presiona el botón "Eliminar" o icono de papelera 🗑️</li>
      <li>Confirma la acción (generalmente te pedirá confirmación)</li>
      <li>El plato se elimina del menú inmediatamente</li>
    </ul>

    <div class="highlight">
      <strong>⚠️ Importante:</strong> Al eliminar un plato, este ya no estará visible para los clientes. Los pedidos anteriores que incluían este plato no se afectarán.
    </div>

    <h2>Mejores Prácticas</h2>
    <ul>
      <li>Mantén los precios actualizados</li>
      <li>Usa descripciones claras que ayuden a vender el plato</li>
      <li>Añade imágenes de buena calidad</li>
      <li>Organiza los platos en categorías lógicas</li>
      <li>Revisa regularmente el menú para eliminar platos no disponibles</li>
    </ul>
  </div>

  <!-- ADMIN - PEDIDOS -->
  <div class="page">
    <h1>4. Panel de Administración - Gestión de Pedidos</h1>

    <h2>Panel de Pedidos</h2>
    <p>En esta sección puedes <strong>ver y gestionar todos los pedidos</strong> realizados en el sistema. Los pedidos se organizan <strong>por día</strong> para facilitar el seguimiento.</p>

    <div class="screenshot-container">
      <p><strong>Panel de Pedidos</strong></p>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; color: #999;">
        [CAPTURA DE PANTALLA: Admin - Pedidos]
      </div>
      <div class="screenshot-label">
        Vista de todos los pedidos filtrados por día
      </div>
    </div>

    <h2>Características Principales</h2>

    <h3>🗓️ Filtrado por Día</h3>
    <p>Los pedidos están organizados por fecha. Puedes:</p>
    <ul>
      <li>Seleccionar una fecha específica</li>
      <li>Ver todos los pedidos de ese día</li>
      <li>Navegar entre días fácilmente</li>
    </ul>

    <h3>📝 Información de Cada Pedido</h3>
    <p>Para cada pedido se muestra:</p>
    <ul>
      <li><strong>ID del Pedido:</strong> Número único de identificación</li>
      <li><strong>Cliente:</strong> Nombre de la persona que hizo el pedido</li>
      <li><strong>Platos:</strong> Lista de todos los artículos pedidos</li>
      <li><strong>Monto Total:</strong> Precio total del pedido</li>
      <li><strong>Hora:</strong> Cuándo se realizó el pedido</li>
      <li><strong>Notas:</strong> Cualquier instrucción especial</li>
    </ul>
  </div>

  <!-- ADMIN - INFORME DIARIO -->
  <div class="page">
    <h1>4. Panel de Administración - Informe Diario</h1>

    <h2>Generar Informe del Día</h2>
    <p>Una de las funciones más útiles es la capacidad de <strong>generar un informe detallado</strong> de todo lo que se vendió en un día específico.</p>

    <h3>¿Cómo Generar el Informe?</h3>
    <ol>
      <li>Selecciona la fecha del día que deseas analizar</li>
      <li>Presiona el botón "Generar Informe" o similar</li>
      <li>Se abrirá una vista con el informe completo del día</li>
    </ol>

    <h3>Información que Incluye el Informe</h3>
    <ul>
      <li><strong>Fecha:</strong> Del informe</li>
      <li><strong>Total de Pedidos:</strong> Cuántos pedidos se hicieron</li>
      <li><strong>Ingresos Totales:</strong> Dinero total generado</li>
      <li><strong>Ticket Promedio:</strong> Gasto promedio por cliente</li>
      <li><strong>Platos Vendidos:</strong> Cantidad de cada plato vendido</li>
      <li><strong>Resumen por Categoría:</strong> Ingresos por tipo de plato</li>
    </ul>

    <div class="highlight">
      <strong>📊 Útil para:</strong> Análisis de ventas, planificación de inventario, identificar platos populares, y tomar decisiones de negocio.
    </div>

    <h2>Opciones de Informe</h2>
    <ul>
      <li>📱 Ver en pantalla</li>
      <li>🖨️ Imprimir</li>
      <li>📥 Descargar como PDF</li>
      <li>📊 Exportar datos</li>
    </ul>
  </div>

  <!-- ADMIN - INFORMES Y ESTADÍSTICAS -->
  <div class="page">
    <h1>4. Panel de Administración - Informes y Estadísticas</h1>

    <h2>Panel de Informes - Propósito</h2>
    <p>Esta sección proporciona <strong>análisis profundos del negocio</strong>. Aquí puedes ver tendencias, identificar tus productos estrella y tomar decisiones estratégicas.</p>

    <div class="screenshot-container">
      <p><strong>Panel de Informes y Estadísticas</strong></p>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 4px; text-align: center; color: #999;">
        [CAPTURA DE PANTALLA: Admin - Informes]
      </div>
      <div class="screenshot-label">
        Vista completa de estadísticas y análisis de ventas
      </div>
    </div>

    <h2>Métricas Principales</h2>

    <h3>📈 Platos Más Vendidos</h3>
    <p>Clasificación de todos los platos ordenados por cantidad de ventas:</p>
    <ul>
      <li>Nombre del plato</li>
      <li>Cantidad vendida</li>
      <li>Ingresos generados</li>
      <li>Porcentaje del total de ventas</li>
      <li>Gráficos visuales</li>
    </ul>

    <h3>💰 Ingresos por Período</h3>
    <ul>
      <li>Ventas totales del período seleccionado</li>
      <li>Comparación con períodos anteriores</li>
      <li>Tendencias (subida/bajada)</li>
      <li>Gráficos de ingresos</li>
    </ul>

    <h3>🥘 Análisis por Categoría</h3>
    <ul>
      <li>Qué categoría genera más ingresos</li>
      <li>Cuál es más popular entre clientes</li>
      <li>Margen de ganancias por categoría</li>
    </ul>
  </div>

  <!-- ADMIN - INFORMES CONTINUACIÓN -->
  <div class="page">
    <h1>4. Panel de Administración - Análisis Detallado</h1>

    <h2>¿Qué Información Puedo Extraer?</h2>

    <h3>1. Platos Estrella 🌟</h3>
    <p>Identifica cuáles son tus productos más vendidos. Esto te ayuda a:</p>
    <ul>
      <li>Asegurar que siempre hay inventario suficiente</li>
      <li>Destacarlos en el menú</li>
      <li>Crear promociones basadas en productos populares</li>
    </ul>

    <h3>2. Platos Poco Vendidos</h3>
    <p>Puedes identificar:</p>
    <ul>
      <li>Platos que no atraen clientes (considerar eliminar)</li>
      <li>Oportunidades para mejorar presentación o precio</li>
      <li>Productos que requieren mejor promoción</li>
    </ul>

    <h3>3. Rendimiento Temporal</h3>
    <ul>
      <li>¿En qué días se vende más?</li>
      <li>¿Cuál es la hora pico?</li>
      <li>¿Hay patrones semanales?</li>
      <li>Planificar personal según demanda</li>
    </ul>

    <h3>4. Análisis Financiero</h3>
    <ul>
      <li>Ingresos totales por período</li>
      <li>Ticket promedio de venta</li>
      <li>Ganancias netas (si se incluye costo de productos)</li>
      <li>Proyecciones de ingresos futuros</li>
    </ul>

    <h2>Casos de Uso Prácticos</h2>
    <div class="flow-item">
      <strong>Caso 1: Fin de Mes</strong><br>
      Genera un informe del mes completo para ver tu desempeño general, ingresos totales y tendencias de ventas.
    </div>

    <div class="flow-item">
      <strong>Caso 2: Decisiones de Menú</strong><br>
      Usa los datos de platos más vendidos para decidir qué platos mantener, cuáles eliminar y qué nuevos productos probar.
    </div>

    <div class="flow-item">
      <strong>Caso 3: Control de Inventario</strong><br>
      Sabe cuántos ingredientes necesitas según las ventas históricas para no quedarte sin stock.
    </div>
  </div>

  <!-- RESUMEN Y CONCLUSIÓN -->
  <div class="page">
    <h1>5. Resumen y Conclusión</h1>

    <h2>¿Qué Hemos Aprendido?</h2>
    <p>Bar Aerodromo La Juliana ofrece una solución completa para gestionar un negocio de comida y bebidas con tres interfaces específicas:</p>

    <div class="features">
      <div class="feature-box">
        <h4>👥 Para Clientes</h4>
        <p>Una experiencia fácil de usar para ordenar desde sus mesas mediante QR, carrito intuitivo, y pago seguro.</p>
      </div>
      <div class="feature-box">
        <h4>👨‍🍳 Para Cocina</h4>
        <p>Un panel en tiempo real que muestra todas las comandas, permitiendo control de tiempos y notas especiales.</p>
      </div>
      <div class="feature-box">
        <h4>📊 Para Administración</h4>
        <p>Control total del negocio: menú, pedidos, estadísticas y análisis detallados para tomar mejores decisiones.</p>
      </div>
      <div class="feature-box">
        <h4>⚡ Para el Negocio</h4>
        <p>Mejora en eficiencia, reducción de errores, mejor experiencia del cliente y datos para crecer.</p>
      </div>
    </div>

    <h2>Ventajas del Sistema</h2>
    <ul>
      <li>✅ Sin papeles - más limpio y organizado</li>
      <li>✅ Tiempo real - información instantánea</li>
      <li>✅ Acceso desde el celular - los clientes ya tienen sus teléfonos</li>
      <li>✅ Reportes automáticos - datos siempre listos</li>
      <li>✅ Escalable - funciona para 1 mesa o 100 mesas</li>
      <li>✅ Seguro - autenticación y datos protegidos</li>
      <li>✅ Acceso en línea - funciona desde cualquier dispositivo</li>
    </ul>

    <h2>Próximos Pasos</h2>
    <ul>
      <li>🎓 Capacitar al personal en el uso del panel de cocina</li>
      <li>🎓 Entrenar a los administradores en la gestión del menú e informes</li>
      <li>📋 Configurar el menú inicial con todas las categorías y platos</li>
      <li>🖨️ Imprimir códigos QR para las mesas</li>
      <li>📊 Revisar regularmente los informes para mejorar el negocio</li>
    </ul>

    <h2>Soporte y Ayuda</h2>
    <p>Si tienes preguntas sobre cómo usar cualquier sección del sistema, contacta con el administrador técnico o consulta la documentación en línea.</p>
  </div>

  <!-- PÁGINA FINAL -->
  <div class="page" style="text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 100vh;">
    <h1 style="font-size: 2em; margin-bottom: 20px;">¡Gracias!</h1>
    <p style="font-size: 1.2em; margin-bottom: 30px;">Esperamos que este documento te haya ayudado a entender completamente cómo funciona el sistema.</p>
    <p><strong>¡A disfrutar de Bar Aerodromo La Juliana!</strong></p>
    <div class="footer" style="margin-top: 60px; border: none;">
      <p>Documento generado: ${new Date().toLocaleDateString('es-ES')}</p>
      <p style="margin-top: 10px; color: #667eea;">www.bar-aerodromo-la-juliana.onrender.com</p>
    </div>
  </div>

</body>
</html>
`;

  const outputPath = path.join(__dirname, 'presentation.html');
  fs.writeFileSync(outputPath, html);
  console.log('✅ Presentación HTML creada en:', outputPath);
  console.log('\n📌 Para convertir a PDF:');
  console.log('   1. Abre el archivo en el navegador');
  console.log('   2. Presiona Ctrl+P (o Cmd+P en Mac)');
  console.log('   3. Selecciona "Guardar como PDF"');
  console.log('   4. Guarda en tu carpeta deseada');
}

async function main() {
  console.log('🚀 Iniciando generación de presentación...\n');

  try {
    console.log('📸 Tomando capturas de pantalla...');
    await takeScreenshots();

    console.log('\n📄 Generando documento HTML...');
    await generatePDF();

    console.log('\n✅ ¡Presentación completada!\n');
    console.log('📁 Archivos generados:');
    console.log('   - presentation.html (en ./backend)');
    console.log('   - screenshots/ (carpeta con imágenes)\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
