# Documentación

| Documento | Para qué |
| --------- | -------- |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Cómo está montado el repositorio hoy, cómo se construye y se despliega la web, dónde encajan las apps que faltan y qué disparadores harían cambiar la arquitectura. |
| [`decisions/`](decisions/) | Por qué está montado así. Una nota por decisión, con las alternativas que se miraron y el motivo del descarte. |

La diferencia entre los dos: `ARCHITECTURE.md` describe el **estado actual** y
se reescribe cuando el estado cambia. Los ADR registran **decisiones puntuales**
y no se reescriben nunca —si una deja de valer, se escribe otra que la
sustituya—. Por eso el razonamiento sobrevive aunque el código cambie.

Para poner el proyecto en marcha, el [README de la raíz](../README.md). Para el
detalle de cada aplicación, el README de su directorio.
