# Granada al Mediterráneo

Mapa editorial SVG para la sección Territorio.

- `granada-costa.svg`: propuesta completa y editable.
- `granada-costa.png`: vista previa a 1800 px de ancho.
- `granada-costa.original.svg`: relieve parcial de Quiver recuperado como SVG válido.
- `granada-costa.quiver-partial.txt`: salida literal parcial de Quiver.
- `granada-costa.prompt.json` / `granada-costa.stream.prompt.json`: encargos enviados, sin credenciales.
- `granada-costa.events.txt`: registro de la respuesta progresiva.
- `complete-map.py`: montaje y acabado local.

Autoría: relieve generado con Quiver `arrow-2-telos`. La primera petición agotó el tiempo de espera. La segunda entregó el relieve en modo progresivo y terminó con un error de la API antes de finalizar el mapa. Se recuperaron los elementos completos; la costa, el mar, la rotulación, los marcadores y el fondo uniforme se terminaron localmente. No se presenta esta versión como una respuesta íntegra de Quiver.

Fondo exacto `#1a1917`; textos `#f8f6f1`; acentos `#e27a4a`. Formato 1400 × 950, escalable.

Es una ilustración editorial con ubicaciones orientativas, no cartografía topográfica medida. Antes de utilizarla bajo los marcadores interactivos de la web hay que ajustar la correspondencia espacial. No se modificó la web.

Solo se enviaron a Quiver nombres geográficos públicos y la paleta solicitada; no se enviaron coordenadas del repositorio ni datos de proyectos.

Documentación: https://docs.quiver.ai/developers/models/text-to-svg
