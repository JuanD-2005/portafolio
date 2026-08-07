# /public/projects/ — capturas del catálogo

Convención de nombres: `{id}.png`, donde `{id}` es el mismo slug que ya
identifica al proyecto en `data/projects.ts` (`archiveProjects[].id`).

⚠️ Esta carpeta es **`/public/projects/`** (plural) — distinta de la ya
existente `/public/project/` (singular), que usan las 3 tarjetas
destacadas (`DeviceMockup`). No son la misma carpeta ni sirven al mismo
componente.

## Cómo agregar una captura

1. Soltar el archivo acá con el nombre exacto de abajo (formato `.png`;
   si el archivo original es `.jpg`/`.jpeg`, cambiar la extensión en
   `thumbnailUrl` dentro de `data/projects.ts` para que coincida).
2. Listo — `ProjectScreenshot` ya apunta a esa ruta para cada proyecto,
   no hace falta tocar código. El archivo aparece automáticamente en el
   catálogo (panel de detalle desktop / hoja inferior mobile) la próxima
   vez que se cargue la página.

## Nombres esperados (los 11 proyectos del archivo)

- `kan.png`
- `rnn.png`
- `fuzzy.png`
- `cv-pipeline.png`
- `matlab-ann.png`
- `smartstation.png`
- `card-pocalipsis.png`
- `pygames-course.png`
- `rotary-club.png`
- `interactive-interfaces.png`
- `math-page.png`

Mientras un archivo no exista (o falle al cargar), `ProjectScreenshot`
cae automáticamente al mismo gradiente de respaldo que usa `DeviceMockup`
— no hace falta borrar ni comentar nada mientras tanto.
