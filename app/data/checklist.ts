export type ChecklistItem = {
  id: string;
  text: string;
};

export type ChecklistSection = {
  section: string;
  items: ChecklistItem[];
};

export const checklist: ChecklistSection[] = [
  {
    section: "Entorno Sala de Ventas (2)",
    items: [
      { id: "1.1", text: "Entorno y calle donde se ubica la Sala de Venta se encuentra ordenada, limpia, sin basura ni grafittis" },
      { id: "1.2", text: "Proyecto cuenta con publicidad de la marca en el entorno cercano." },
    ],
  },
  {
    section: "Cierro (11)",
    items: [
      { id: "2.1", text: "Se identifica claramente el acceso a la Sala de Ventas" },
      { id: "2.2", text: "Hay lugar para estacionar" },
      { id: "2.3", text: "Estacionamiento se encuentra señalizado" },
      { id: "2.4", text: "Proyecto cuenta con iluminación para ser visto de noche" },
      { id: "2.5", text: "Jardín se encuentra limpio y ordenado" },
      { id: "2.6", text: "Cierro de obra de encuentra en buenas condiciones (limpio, y no rayado)" },
      { id: "2.7", text: "Logo de marca se encuentra instalado" },
      { id: "2.8", text: "Gráfica de cierro incluye: programa, metraje, propuesta de valor, PPP y teléfono" },
      { id: "2.9", text: "Letreros cubre árbol se encuentran en buen estado" },
      { id: "2.10", text: "Letrero de la grúa se encuentra iluminado" },
      { id: "2.11", text: "Pizarras con información de proyecto se encuentran en buen estado" },
    ],
  },
  {
    section: "Acceso limpieza y orden (6)",
    items: [
      { id: "3.1", text: "Hay conexión a través del citófono a la sala de ventas" },
      { id: "3.2", text: "Existe cierre magnético y alarma en sala de ventas" },
      { id: "3.3", text: "Existe cartel para guiar a cliente donde se encuentra citófono" },
      { id: "3.4", text: "Sala de ventas se encuentra limpia (puertas, cielos, suelos y muros, vidrios, sin manchas y de color blanco, tonalidad homogénea)" },
      { id: "3.5", text: "Sala de ventas se encuentra ordenada (escritorios limpios, sin residuos visibles y ordenados)" },
      { id: "3.6", text: "Sector de espera se encuentra en buen estado, limpio y despejado" },
    ],
  },
  {
    section: "Marketing (11)",
    items: [
      { id: "4.1", text: "Se muestran las terminaciones del proyecto" },
      { id: "4.2", text: "Se encuentran instalados los cuadros (ventas y logo)" },
      { id: "4.3", text: "Existe pantalla táctil funcionando (se proyecta lo que corresponde render, barriografía)" },
      { id: "4.4", text: "Hay disponible planos y láminas de tipologías (guardadas y no a la vista)" },
      { id: "4.5", text: "Hay una pantalla de barrio y entorno, instalada y encendida (en el privado)" },
      { id: "4.6", text: "Hay material POP (lápices, mouse pad, carpetas de cotizaciones no a la vista)" },
      { id: "4.7", text: "Se transmite lo que se quiere dar a conocer del proyecto. Coherencia entre gráfica y producto en venta (Propuesta de Valor)" },
      { id: "4.8", text: "Hay café Nespresso para ofrecer. Cafetera funcionando y con cápsulas de café" },
      { id: "4.9", text: "Está funcionando el dispensador de agua" },
      { id: "4.10", text: "Está encendido el aroma de la marca" },
      { id: "4.11", text: "Es agradable la temperatura (aire acondicionado o calefacción)" },
    ],
  },
  {
    section: "Sistemas eléctricos, cableados y baños (5)",
    items: [
      { id: "5.1", text: "Tiene todas las ampolletas o tubos de cielo limpios" },
      { id: "5.2", text: "Están ordenados y bien instalados los cables" },
      { id: "5.3", text: "Grifería y artefactos funcionando correctamente, sin goteras y buen estado (llaves, cadenas de WC)" },
      { id: "5.4", text: "Están todos los dispensadores limpios con producto (jabón, papel higiénico)" },
      { id: "5.5", text: "El basurero está limpio, ½ capacidad (nunca lleno)" },
    ],
  },
  {
    section: "Piloto (26)",
    items: [
      { id: "6.1", text: "Señalética direccional a la Sala de Ventas y Piloto" },
      { id: "6.2", text: "Escalera y pasamanos se encuentran en buenas condiciones" },
      { id: "6.3", text: "Letrero 'Disponible' se encuentra en buen estado" },
      { id: "6.4", text: "Letrero 'Lienzo Visita Piloto' se encuentra en buen estado" },
      { id: "6.5", text: "Letrero 'Corona Edificio' se encuentra en buen estado" },
      { id: "6.6", text: "Está correcta la señalización a los pilotos, en buen estado" },
      { id: "6.7", text: "Están en buen estado totem y señalética" },
      { id: "6.8", text: "Están instalados y en buen estado, los acrílicos con el plano de cada piloto" },
      { id: "6.9", text: "Están instalados los adhesivos parte de la decoración" },
      { id: "6.10", text: "Está el aroma de marca en los pilotos" },
      { id: "6.11", text: "¿Están prendidas las pantallas?, con video definido por marketing" },
      { id: "6.12", text: "Hay música en el piloto" },
      { id: "6.13", text: "¿Es agradable la temperatura? (aire acondicionado o calefacción)" },
      { id: "6.14", text: "Están las luces encendidas, las ampolletas funcionando (switch en on cuando visitan piloto)" },
      { id: "6.15", text: "Están derechos los cuadros" },
      { id: "6.16", text: "Están las cortinas roller abiertas (según sol)" },
      { id: "6.17", text: "Está en buen estado la decoración" },
      { id: "6.18", text: "Está limpio el interior de cada piloto, sin polvo (esquinas, cuadros, vidrios, pintura, etc.)" },
      { id: "6.19", text: "Están limpias y estiradas las alfombras" },
      { id: "6.20", text: "Están instaladas las huinchas baño no habilitado" },
      { id: "6.21", text: "Están las terrazas barridas, ordenadas y limpias" },
      { id: "6.22", text: "Las manillas de puertas funcionan correctamente" },
      { id: "6.23", text: "Las ventanas están funcionando correctamente" },
      { id: "6.24", text: "Los muebles de cocina y baños, están en buen estado" },
      { id: "6.25", text: "Se encuentran limpios y sin elementos de sala de ventas (ej, toalla nova, papel higiénico, artículos de aseo, entre otros); clóset, cajones de cocina, baños, espacios de guardado" },
      { id: "6.26", text: "Se encuentra limpio y sin elementos de sala de ventas (ej: toalla nova, papel higiénico, otros)" },
    ],
  },
  {
    section: "Presentación Vendedor (2)",
    items: [
      { id: "7.1", text: "Utiliza uniforme completo y piocha identificatoria" },
      { id: "7.2", text: "Uniforme se encuentra impecable (ropa y zapatos)" },
    ],
  },
];