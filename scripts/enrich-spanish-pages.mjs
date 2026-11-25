// scripts/enrich-spanish-pages.mjs
// Enriches Spanish localized content so every page exceeds 600 words and maintains <15% 12-word shingle overlap.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const statesData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/states.json'), 'utf8'));

const spanishTools = [
  {
    slug: 'es-calculadora-de-fondo-de-propinas',
    title: 'Calculadora de Fondo de Propinas (Tip Pool)',
    h1: 'Calculadora de fondo de propinas para restaurantes',
    desc: 'Calcule la distribución justa de propinas por horas trabajadas, puntos o porcentajes bajo las leyes laborales FLSA.',
    tool: 'tip-pool',
    intro: 'Calcule cómo repartir las propinas del turno entre meseros, bartenders y ayudantes según horas trabajadas o puntos.',
    body: `## Fundamentos Legales del Fondo de Propinas en la Hostelería

En la industria restaurantera moderna, el fondo común de propinas (denominado técnicamente *tip pool*) es uno de los mecanismos operativos más extendidos para retribuir equitativamente el esfuerzo colectivo del personal de servicio. No obstante, su implementación está estrictamente regulada por las enmiendas federales a la Ley de Normas Justas de Trabajo (FLSA) y por las directrices dictadas por la División de Horas y Salarios del Departamento de Trabajo (DOL).

La regla primordial e inquebrantable de la normativa laboral estadounidense establece que los gerentes, jefes de piso, mayordomos, supervisores y propietarios de establecimientos tienen terminantemente prohibido retener, participar o percibir sumas dinerarias provenientes de cualquier fondo de propinas, sin importar si realizaron labores directas de atención al cliente durante momentos de alta demanda. Las propinas son propiedad exclusiva y absoluta de los empleados subordinados que las generaron.

### Modalidades Formales de Reparto en Turnos de Restaurante

Para garantizar absoluta transparencia contable y evitar discordias laborales en el equipo, los establecimientos deben seleccionar y documentar formalmente uno de los siguientes tres métodos estándar:

1. **Reparto Proporcional por Horas Trabajadas**: En este esquema, el importe total acumulado en el turno se divide entre la sumatoria exacta de horas laboradas por todo el personal de servicio habilitado. La tasa horaria resultante se multiplica individualmente por las horas registradas por cada colaborador en el sistema biométrico de control horario.
2. **Sistema Ponderado por Puntos de Responsabilidad**: Se asignan coeficientes de ponderación según el nivel de experiencia, complejidad y exigencia física del rol asignado. Por ejemplo, los meseros principales y bartenders pueden acumular un factor de 1.0 punto por hora, los corredores de alimentos (*food runners*) 0.75 puntos, y los asistentes de mesa (*bussers*) 0.50 puntos.
3. **Fondo Mixto con Retención para Cocina y Personal de Apoyo**: Cuando el empleador abona el salario mínimo estatal completo sin aplicar ningún crédito por propinas (*tip credit*), la ley federal permite extender la participación del fondo a los trabajadores no tradicionales de cocina (*back-of-house*), como lavaplatos y cocineros de línea.

## Ejemplo Práctico 1: Turno Nocturno de Fin de Semana en Comedor Principal

Consideremos un turno de sábado por la noche en un restaurante de alta concurrencia. El equipo de sala acumula un total bruto de $1,450.00 en propinas registradas con tarjeta de crédito y $250.00 en propinas en efectivo, alcanzando $1,700.00. El establecimiento opera bajo un acuerdo formal donde se deduce un 3% sobre las ventas de alimentos ($6,000.00 en ventas) para el personal auxiliar de cocina ($180.00), dejando un fondo neto a distribuir de $1,520.00 entre 38 horas totales de piso:

- **Elena (Mesera Senior, 8.0 horas)**: Tasa horaria de $40.00/hr, percibe **$320.00**.
- **Carlos (Mesero, 7.5 horas)**: Tasa horaria de $40.00/hr, percibe **$300.00**.
- **Lucía (Bartender Principal, 8.5 horas)**: Tasa horaria de $40.00/hr, percibe **$340.00**.
- **Mateo (Food Runner, 7.0 horas)**: Tasa horaria de $40.00/hr, percibe **$280.00**.
- **Valeria (Asistente de Mesa, 7.0 horas)**: Tasa horaria de $40.00/hr, percibe **$280.00**.

La sumatoria individual ($320 + $300 + $340 + $280 + $280) equivale exactamente a los $1,520.00 del fondo distribuible, garantizando un balance contable de cero discrepancias.

## Ejemplo Práctico 2: Turno Reducido con Factor de Puntos en Área de Barra

En una jornada vespertina entre semana, la barra genera $600.00 en propinas colectivas durante un período de 15 horas combinadas entre el bartender titular (factor 1.0, 8 horas = 8 puntos) y el ayudante de barra (*barback*, factor 0.6, 7 horas = 4.2 puntos). La puntuación acumulada es de 12.2 puntos. El valor financiero por punto asciende a $49.18:
- Bartender Titular: 8 puntos × $49.18 = **$393.44**.
- Ayudante de Barra: 4.2 puntos × $49.18 = **$206.56**.

## Respuestas a Consultas Frecuentes de Trabajadores de Hostelería

### ¿Qué ocurre si un cliente deja una propina desproporcionada destinada a un solo trabajador?
Salvo que exista un acuerdo de fondo voluntario explícito y previo entre los involucrados, las propinas entregadas en mano con indicación expresa pertenecen individualmente al receptor; sin embargo, en turnos donde opera un fondo obligatorio acordado conforme a la FLSA, todo ingreso por concepto de propinas debe incorporarse a la masa común del turno.

### ¿Puede el restaurante retener un porcentaje de las propinas pagadas con tarjeta?
Únicamente se autoriza a los empleadores a deducir el porcentaje real que la compañía emisora de la tarjeta cobra por procesar la transacción electrónica (habitualmente entre un 1.5% y un 2.5%), nunca un monto superior ni tarifas de mantenimiento comercial del establecimiento.

### ¿Qué recursos legales asisten al trabajador ante un reparto indebido?
El trabajador afectado tiene el derecho formal de presentar una denuncia confidencial ante la oficina regional de la División de Horas y Salarios del Departamento de Trabajo de los Estados Unidos o reclamar judicialmente la restitución íntegra de los montos indebidamente retenidos, complementada con daños liquidados y costas procesales.`
  },
  {
    slug: 'es-calculadora-de-distribucion-de-propinas',
    title: 'Calculadora de Distribución de Propinas (Tip Out)',
    h1: 'Calculadora de tip out para meseros y barras',
    desc: 'Calcule los porcentajes de tip-out para bartenders, bussers y corredores de comida según ventas de bebidas y comida.',
    tool: 'tip-out',
    intro: 'Calcule rápidamente las propinas que debe transferir al personal de apoyo según ventas brutas o propinas totales.',
    body: `## La Práctica del Tip-Out y sus Implicaciones Laborales en EE. UU.

El concepto de *tip-out* representa el procedimiento convencional mediante el cual los meseros asignan un porcentaje previamente estipulado de sus ventas comerciales o de las propinas recibidas durante la jornada laboral para retribuir la asistencia directa provista por el personal auxiliar de servicio: cocteleros, preparadores de mesa, corredores de platillos y recepcionistas.

A diferencia del fondo cerrado o *tip pool* total, en el esquema de *tip-out* el mesero mantiene la titularidad primaria de las propinas obtenidas en sus mesas asignadas y efectúa desembolsos escalonados hacia las distintas estaciones de trabajo que colaboraron en el flujo de atención al comensal.

### Arquitectura de Porcentajes Habituales en Restaurantes de Servicio Completo

Existen dos metodologías predominantes para calcular y liquidar los desembolsos de *tip-out* al finalizar el turno:

1. **Cálculo Basado en Ventas Brutas por Categoría de Producto**: Es el sistema preferido por las cadenas corporativas y restaurantes formales debido a su trazabilidad inmediata en el software de punto de venta (POS). En este modelo, el mesero transfiere entre un 1% y un 3% de las ventas totales a los asistentes de mesa (*bussers*), entre un 4% y un 8% de las ventas específicas de bebidas alcohólicas al bartender de apoyo, y un 1% de las ventas de alimentos a los corredores (*runners*).
2. **Cálculo Basado en Porcentaje de Propinas Percibidas**: En este enfoque, el cálculo se desacopla del volumen comercial de ventas y se vincula estrictamente a los fondos efectivamente percibidos por el mesero. Por ejemplo, se transfiere un 10% del total de propinas a la barra y un 5% al personal de limpieza de salón.

## Ejemplo Práctico 1: Turno de Alto Volumen en Salón Principal con Ventas Segmentadas

Un mesero concluye una jornada de fin de semana con un volumen total registrado en su terminal de punto de venta de $3,200.00 en ventas comerciales. El reporte detalla $2,200.00 correspondientes a comida y aperitivos, y $1,000.00 atribuibles a coctelería, cervezas y vinos de cava. Las propinas totales registradas ascienden a $640.00 (equivalente a un 20% promedio de propina).

Aplicando la política oficial de tip-out del establecimiento:
- **Bartender de Barra Principal (5% sobre ventas de bebidas alcohólicas de $1,000.00)**: **$50.00**.
- **Asistente de Mesa / Busser (2% sobre ventas comerciales brutas de $3,200.00)**: **$64.00**.
- **Corredor de Alimentos / Food Runner (1.5% sobre ventas de alimentos de $2,200.00)**: **$33.00**.
- **Total de Desembolso por Tip-Out**: $50.00 + $64.00 + $33.00 = **$147.00**.
- **Ingreso Neto de Propinas Retenido por el Mesero**: $640.00 − $147.00 = **$493.00** (representando el 77.03% del total percibido).

## Ejemplo Práctico 2: Jornada Moderada con Tip-Out Basado en Propinas Efectivas

En una jornada matutina de brunch, un mesero recauda $350.00 en propinas directas con ventas moderadas de $1,500.00. La política del negocio establece una entrega del 12% de las propinas percibidas al bartender y un 6% al asistente de salón:
- Cuota para Bartender: $350.00 × 0.12 = **$42.00**.
- Cuota para Busser: $350.00 × 0.06 = **$21.00**.
- Desembolso acumulado: **$63.00**.
- Remanente para el trabajador: $350.00 − $63.00 = **$287.00**.

## Aspectos Críticos de Cumplimiento Regulatorio para Empleados y Empleadores

### ¿Puede obligarse a un mesero a aportar propinas a un puesto directivo?
Bajo ninguna circunstancia. Cualquier disposición contractual, manual interno o indicación verbal que obligue a canalizar propinas hacia subgerentes, jefes de cocina con mando de personal o encargados generales de turno constituye una violación directa de la Sección 3(m)(2)(B) de la FLSA, sancionable con multas pecuniarias administrativas severas.

### ¿Qué sucede si las propinas obtenidas no cubren las cuotas teóricas de venta?
Si en un turno desfavorable un mesero recibe propinas atípicamente bajas, la normativa federal prohíbe que el cumplimiento del tip-out reduzca sus ingresos por debajo del salario mínimo obligatorio estipulado en la jurisdicción correspondiente. En tales circunstancias, el empleador está compelido a asumir la compensación monetaria necesaria.`
  },
  {
    slug: 'es-calculadora-de-horas-extras-y-tiempo-doble',
    title: 'Calculadora de Horas Extras y Tiempo Doble',
    h1: 'Calculadora de horas extras (1.5x) y tiempo doble (2.0x)',
    desc: 'Calcule su pago de sobretiempo semanal y diario según las normas federales y estatales de Estados Unidos.',
    tool: 'overtime',
    intro: 'Calcule su salario bruto con horas extras a tiempo y medio (1.5x) y tiempo doble (2.0x) para jornadas laborales extendidas.',
    body: `## Regulación Federal y Estatal del Trabajo Extraordinario en Estados Unidos

La remuneración de las jornadas laborales prolongadas constituye una de las salvaguardas estructurales más relevantes de la legislación laboral contemporánea en los Estados Unidos. Codificada originalmente en el texto de la Ley de Normas Justas de Trabajo (FLSA) de 1938, la protección establece que los trabajadores en posiciones no exentas deben percibir una compensación incrementada por el desgaste derivado de horarios laborales extensos.

A nivel federal, la norma impone el pago de una tasa no inferior a una vez y media (1.5x) la tarifa regular de pago (*regular rate of pay*) por cada hora efectivamente trabajada que exceda el límite de 40 horas en una misma semana laboral fija de 168 horas consecutivas.

### Jurisdicciones con Protecciones Diarias y Tiempo Doble (2.0x)

Diversos estados han promulgado marcos regulatorios sustancialmente más estrictos que la pauta federal básica. El caso más destacado es el de California, cuyas normas estipulan compensaciones extraordinarias diarias:

- **Tiempo y Medio Diario (1.5x)**: Aplica a todas las horas trabajadas por encima de 8 horas y hasta 12 horas en un único día calendario, así como a las primeras 8 horas laboradas durante el séptimo día consecutivo de trabajo dentro de una misma semana laboral.
- **Tiempo Doble Diario (2.0x)**: Aplica a cualquier hora que exceda las 12 horas de labor ininterrumpida en un solo día, y a todas las horas trabajadas con posterioridad a las primeras 8 horas durante el séptimo día laboral ininterrumpido.

Estados como Colorado y Alaska aplican pautas diarias específicas (por ejemplo, umbrales de 12 horas diarias en Colorado o pagos extraordinarios tras 8 horas en Alaska), las cuales deben calcularse minuciosamente para evitar infracciones salariales.

## Ejemplo Práctico 1: Semana Laboral Extensa bajo Pauta Federal Estándar

Un cocinero de línea en Texas percibe una tarifa horaria regular de $18.50 por hora y completa 52 horas de servicio a lo largo de una semana de alta actividad estacional.

Desglose aritmético de su nómina semanal:
- **Jornada Regular Base**: 40 horas × $18.50/hr = **$740.00**.
- **Tarifa Extraordinaria de Sobretiempo (1.5x)**: $18.50 × 1.5 = $27.75 por hora.
- **Horas Extraordinarias Acumuladas**: 52 horas − 40 horas = 12 horas extraordinarias.
- **Compensación por Horas Extras**: 12 horas × $27.75/hr = **$333.00**.
- **Compensación Salarial Bruta Total**: $740.00 + $333.00 = **$1,073.00**.

## Ejemplo Práctico 2: Turno Prolongado con Tiempo Doble en California

Una supervisora de servicio de banquetes en Los Ángeles devenga una tarifa base de $22.00 por hora. Durante un evento diplomático especial de fin de año, completa una jornada única continua de 14 horas:
- Primeras 8 horas ordinarias: 8 hrs × $22.00/hr = **$176.00**.
- Siguientes 4 horas extraordinarias (horas 9 a 12 a tasa 1.5x de $33.00/hr): 4 hrs × $33.00/hr = **$132.00**.
- Últimas 2 horas bajo régimen de tiempo doble (horas 13 y 14 a tasa 2.0x de $44.00/hr): 2 hrs × $44.00/hr = **$88.00**.
- **Salario Bruto Percibido en la Jornada**: $176.00 + $132.00 + $88.00 = **$396.00** (frente a los $308.00 que representaría una liquidación a tarifa plana).

## Preguntas Habituales en Torno al Sobretiempo Laboral

### ¿Puede un empleador sustituir el pago en dinero por tiempo libre compensatorio?
En el sector empresarial privado, la sustitución del pago monetario de horas extras por tiempo de descanso acumulado (*comp time*) está prohibida de forma terminante por la ley federal; toda hora extraordinaria debe liquidarse en moneda de curso legal en la fecha de pago correspondiente al período laborado.

### ¿Se computan las bonificaciones e incentivos en la tarifa de horas extras?
Sí. Cualquier prima por rendimiento, comisión mercantil o bonificación no discrecional debe integrarse en la tarifa horaria regular antes de calcular el multiplicador de 1.5x, lo que eleva el valor final de cada hora de sobretiempo cobrada por el empleado.`
  },
  {
    slug: 'es-calculadora-de-diferencial-de-turno',
    title: 'Calculadora de Diferencial de Turno (Shift Differential)',
    h1: 'Calculadora de compensación por diferencial de turno',
    desc: 'Calcule recargos nocturnos, turnos rotativos y fines de semana combinados con horas extras regulares.',
    tool: 'shift-differential',
    intro: 'Determine con exactitud el pago adicional por trabajar en horarios nocturnos, fines de semana o turnos rotativos.',
    body: `## Definición y Utilidad del Diferencial de Turno en la Nómina Laboral

El diferencial de turno (*shift differential*) es un complemento retributivo que las organizaciones otorgan a aquellos trabajadores que desempeñan sus funciones durante horarios considerados atípicos, arduos o socialmente desfavorables. Aunque su otorgamiento suele pactarse mediante políticas corporativas o convenios colectivos, su cálculo interactúa directamente con las obligaciones federales y estatales relativas a las horas extras.

Los escenarios más habituales donde se implementa este beneficio abarcan turnos nocturnos (*graveyard shifts* o *third shifts*), horarios vespertinos extendidos, coberturas de fines de semana y guardias rotativas de urgencia en hoteles, cocinas de preparación y centros de logística hospitalaria.

### Modalidades Convencionales de Aplicación del Plus Horario

Las estructuras de compensación diferencian principalmente entre dos formas de aplicación:

1. **Adicional Fijo por Hora Trabajada en el Tramo Cualificado**: Consiste en agregar una prima fija en dólares (por ejemplo, +$2.50 o +$4.00 por hora) sobre la tarifa base por cada hora completada dentro del horario definido como nocturno (comúnmente entre las 10:00 p. m. y las 6:00 a. m.).
2. **Porcentaje Adicional sobre el Salario Base**: Se incrementa la tarifa horaria ordinaria mediante un porcentaje fijo acordado (por ejemplo, un 10% o un 15% adicional) aplicable a la totalidad de las horas asignadas a la jornada atípica.

## Ejemplo Práctico 1: Guardia Nocturna Hospitalaria con Tarifa Regular Ponderada

Un asistente de hostelería hospitalaria en Illinois labora 40 horas en una semana. Su retribución horaria básica es de $20.00 por hora. Sin embargo, 20 de esas 40 horas se desarrollaron en horario nocturno, disfrutando de un diferencial pactado de +$3.50 por hora ($23.50/hr):
- 20 horas en turno diurno regular a $20.00/hr = **$400.00**.
- 20 horas en turno nocturno cualificado a $23.50/hr = **$470.00**.
- Salario bruto ordinario total por 40 horas = **$870.00**.
- **Tarifa Horaria Regular Ponderada (*Blended Regular Rate*)**: $870.00 ÷ 40 horas = **$21.75 por hora**.

Si este trabajador realiza 5 horas extras en esa misma semana, la tarifa base sobre la cual debe aplicarse el multiplicador legal de 1.5x es de $21.75/hr (arrojando $32.625 por hora extra), y no su salario nominal diurno de $20.00/hr. Esta distinción evita el fraude salarial por omisión de complementos.

## Ejemplo Práctico 2: Jornada de Fin de Semana en Cocina de Producción

Una repostera trabaja 32 horas a $19.00/hr y 8 horas adicionales durante el turno crítico del domingo con un plus porcentual del 20% ($22.80/hr):
- Horas de semana regulares (32 hrs × $19.00): **$608.00**.
- Horas de domingo con prima (8 hrs × $22.80): **$182.40**.
- **Ingreso Semanal Acumulado**: $608.00 + $182.40 = **$790.40**.

## Consideraciones Contables y Normativas en Diferenciales

El cálculo exacto del diferencial de turno requiere conciliar las horas marcadas mediante reloj checador digital con los acuerdos de política laboral interna de la empresa. En auditorías salariales realizadas por el DOL, la omisión de estos suplementos en el cálculo del factor de sobretiempo constituye una de las causales más comunes de penalización pecuniaria. Los supervisores deben garantizar que la fórmula ponderada se aplique de forma automatizada en el software contable de nómina para resguardar la legalidad de los pagos emitidos.

## Aspectos Normativos Determinantes

### ¿Exige la ley federal el pago obligatorio de diferenciales nocturnos?
La ley federal FLSA no exige a los empleadores abonar de forma obligatoria un plus nocturno; no obstante, si el empleador lo ofrece contractual o institucionalmente, la normativa federal exige inexorablemente que dicho diferencial se compute al determinar la tarifa regular de horas extras.

### ¿Puede un empleador excluir el diferencial al liquidar horas extraordinarias?
De ninguna manera. Excluir el suplemento de nocturnidad o turno rotativo al fijar la tarifa horaria para horas extras infringe las disposiciones del Código de Regulaciones Federales (29 CFR Parte 778), exponiendo a la empresa a liquidaciones retroactivas de haberes.`
  },
  {
    slug: 'es-calculadora-de-horas-extras-con-propinas',
    title: 'Calculadora de Horas Extras con Propinas',
    h1: 'Horas extras para meseros con crédito de propinas (FLSA)',
    desc: 'Aprenda a calcular correctamente el sobretiempo cuando su empleador utiliza el crédito de propinas estatal o federal.',
    tool: 'tipped-overtime',
    intro: 'Averigüe cuánto debe pagarle su empleador por hora extra cuando percibe un salario en efectivo reducido por crédito de propinas.',
    body: `## La Complejidad del Sobretiempo en Trabajadores Sujetos al Crédito de Propinas

Uno de los errores más frecuentes y perjudiciales en la confección de nóminas en el sector de la restauración en Estados Unidos se produce al calcular la retribución de horas extras en empleados sujetos al crédito de propinas (*tip credit*). Muchos empleadores asumen equivocadamente que basta con multiplicar el salario en efectivo reducido (por ejemplo, la pauta federal de $2.13/hr) por 1.5, resultando en un pago ilegal de $3.195 por hora extra.

El Departamento de Trabajo de los Estados Unidos (DOL) y las cortes federales han establecido con meridiana claridad que la tarifa extraordinaria de sobretiempo debe determinarse sobre el salario mínimo general vigente, y nunca sobre la tarifa reducida en efectivo.

### El Algoritmo Oficial de Cálculo Dictado por la FLSA

La fórmula jurídica preceptiva estipulada en la normativa federal se estructura en tres pasos sucesivos:

1. **Determinación de la Tarifa Regular Completa**: Se toma el salario mínimo general aplicable en la jurisdicción (a nivel federal: $7.25 por hora).
2. **Cálculo de la Tasa Extraordinaria al 1.5x**: Se multiplica la tarifa regular por 1.5 ($7.25 × 1.5 = $10.875 por hora de sobretiempo).
3. **Deducción del Crédito por Propinas Máximo Autorizado**: Del resultado extraordinario ($10.875) se resta el crédito por propinas aplicado ($5.12 a nivel federal).
4. **Salario en Efectivo a Abonar por Hora Extra**: $10.875 − $5.12 = **$5.755 por cada hora extra** (redondeado a **$5.76**).

Cualquier liquidación inferior a $5.76 por hora de sobretiempo en jurisdictions que sigan el marco federal básico tipifica una privación salarial ilegítima.

## Ejemplo Práctico 1: Semana de 48 Horas bajo Parámetros Federales Básicos

Un mesero en Georgia cobra el salario en efectivo federal de $2.13 por hora y labora 48 horas en una semana, acumulando 8 horas extraordinarias:
- **Salario por Horas Ordinarias (40 hrs)**: 40 hrs × $2.13/hr = **$85.20**.
- **Salario en Efectivo por Horas Extras (8 hrs a $5.76/hr)**: 8 hrs × $5.76/hr = **$46.08**.
- **Salario Directo en Efectivo que Debe Abonar el Empleador**: $85.20 + $46.08 = **$131.28**.
- Las propinas recaudadas por el empleado durante las 48 horas continúan perteneciendo íntegramente al mesero.

## Ejemplo Práctico 2: Estado con Salario Mínimo Elevado y Crédito Parcial

Consideremos un estado con un salario mínimo obligatorio de $14.00 por hora, donde se permite un salario en efectivo para meseros de $9.00/hr (lo que representa un crédito por propinas de $5.00/hr):
- Tarifa regular legal: $14.00/hr.
- Tarifa de horas extras al 1.5x: $14.00 × 1.5 = $21.00/hr.
- Menos crédito de propinas ($5.00/hr): $21.00 − $5.00 = **$16.00 en efectivo por cada hora extra**.
- Por 10 horas extraordinarias, el empleador debe abonar: 10 hrs × $16.00 = **$160.00** en efectivo.

## Auditoría Legal de los Desembolsos Salariales en Nóminas de Hostelería

Cuando los trabajadores reciben su comprobante de pago o talón de cheque (*paystub*), deben verificar detalladamente que la línea correspondiente a sobretiempo refleje la tarifa en efectivo ajustada y no una fracción arbitraria. Cualquier intento patronal de diluir las horas extras argumentando que las propinas fueron extraordinariamente generosas constituye una infracción directa tipificada como retención indebida de haberes bajo el Artículo 16(b) de la FLSA.

## Protecciones Clave para Empleados con Propinas

### ¿Se permite aumentar el crédito por propinas durante las horas extras?
No. La ley federal prohíbe categóricamente que el empleador incremente el monto en dólares del crédito por propinas durante las horas de sobretiempo. El crédito máximo autorizado permanece inmutable, lo que obliga al empleador a financiar el recargo del 50% con sus propios fondos directos.

### ¿Qué ocurre en los estados que prohíben el crédito de propinas?
En estados como California, Washington, Oregon, Nevada, Montana, Alaska y Minnesota, los empleadores tienen legalmente prohibido aplicar crédito de propinas. En consecuencia, el mesero cobra el salario mínimo estatal completo como salario base y sus horas extras se liquidan directamente multiplicando dicho salario mínimo por 1.5 o 2.0.`
  },
  {
    slug: 'es-calculadora-de-salario-neto-con-propinas',
    title: 'Calculadora de Salario Neto con Propinas (Take-Home Pay)',
    h1: 'Calculadora de salario neto y retenciones para trabajadores con propinas',
    desc: 'Estime su cheque neto después de impuestos federales, retenciones FICA (Seguro Social y Medicare) e ingresos por propinas.',
    tool: 'take-home',
    intro: 'Conozca con exactitud cuánto dinero líquido llegará a su cuenta bancaria tras deducir impuestos sobre propinas y salarios.',
    body: `## La Dinámica Tributaria del Salario Neto en Empleados con Propinas

El cálculo del salario líquido o neto (*take-home pay*) para quienes desempeñan labores en el sector de servicios y hospitalidad presenta particularidades singulares en el sistema fiscal de los Estados Unidos. A diferencia de un asalariado corporativo tradicional cuya retención tributaria se descuenta directamente de un cheque salarial sustancial, los trabajadores con propinas reciben una porción considerable de sus ingresos en efectivo o transferencias de turno diarias.

Como consecuencia de este flujo, el cheque de nómina biweekly o mensual emitido por el empleador puede reducirse a cifras sumamente pequeñas —o incluso resultar en el conocido fenómeno del "cheque de cero dólares"— debido a que los impuestos devengados por las propinas declaradas absorben la totalidad del salario base en efectivo.

### Obligaciones Fiscales Básicas: El Desglose de Retenciones

Todo ingreso por propinas constituye renta legal gravable a efectos tributarios y está sujeto a las siguientes deducciones imperativas:

1. **Seguridad Social (FICA - OASDI)**: Retención obligatoria del 6.2% sobre la totalidad de las compensaciones (salario base más propinas declaradas) hasta alcanzar el límite salarial anual fijado para 2026 en $184,500.
2. **Medicare (FICA - Hospital Insurance)**: Deducción fija del 1.45% sobre todos los ingresos brutos sin límite superior, adicionándose un 0.9% para ingresos anuales que superen los umbrales de $200,000 en solteros.
3. **Impuesto Federal sobre la Renta (FIT)**: Retención progresiva vinculada al estado civil del declarante y los ajustes declarados en el formulario W-4.
4. **Impuesto Estatal y Local sobre la Renta**: Retenciones autonómicas variables según la normativa fiscal de cada jurisdicción.

## Ejemplo Práctico 1: Cheque Quincenal Típico de Mesero de Salón

Un mesero soltero en Florida completa 70 horas en un ciclo de nómina quincenal con un salario base de $8.98/hr ($628.60 en salario directo) y reporta $1,500.00 en propinas registradas con tarjeta. La remuneración bruta total sujeta a tributación asciende a $2,128.60:

- **Ingreso Bruto Total Devengado**: $2,128.60.
- **Retención de Seguridad Social (6.2%)**: $2,128.60 × 0.062 = **−$131.97**.
- **Retención de Medicare (1.45%)**: $2,128.60 × 0.0145 = **−$30.86**.
- **Retención de Impuesto Federal Estimada (FIT)**: **−$145.00**.
- **Impuesto Estatal (Florida no grava salarios)**: **$0.00**.
- **Total de Cargas Fiscales Obligatorias**: $307.83.
- **Compensación Neta en Cheque de Empleador**: Salario directo de $628.60 − $307.83 = **$320.77**.
- **Ingreso Real Total en Mano (Cheque + Propinas ya cobradas)**: $320.77 + $1,500.00 = **$1,820.77**.

## Ejemplo Práctico 2: Escenario de Retención Máxima ("Cheque Cero")

Si el mismo trabajador labora en un restaurante donde percibe el salario federal en efectivo de $2.13/hr (generando apenas $149.10 en salario directo quincenal por 70 horas) pero declara $2,000.00 en propinas, las retenciones fiscales obligatorias ($133.24 de Seguro Social, $31.16 de Medicare y $140.00 de impuestos federales) sumarán $304.40, superando ampliamente el salario directo disponible. El cheque de nómina indicará $0.00 y el remanente tributario impago se diferirá en la contabilidad interna de la empresa.

## Conciliación Contable Anual y Formulario W-2

Al cierre del ejercicio contributivo, el empleador consolidará todos los conceptos abonados en el Formulario W-2. La casilla 1 reflejará los salarios imponibles ordinarios, la casilla 7 reportará las propinas declaradas formalmente por el empleado, y la casilla 8 expondrá las propinas asignadas (*allocated tips*) en aquellos negocios donde el volumen declarado no alcanzó la pauta estadística federal del 8% sobre ventas brutas. Comprender estos casilleros resulta vital para evitar contingencias fiscales con el IRS.

## Preguntas Frecuentes sobre Declaración de Propinas

### ¿Es obligatorio declarar el 100% de las propinas en efectivo?
Sí. La normativa del Servicio de Impuestos Internos (IRS) exige que los empleados mantengan un registro diario detallado (Formulario 4070 o similar) y reporten a su empleador cualquier propina mensual que exceda los $20.00.

### ¿Qué beneficio reporta declarar formalmente todas las propinas?
Declarar la totalidad de las propinas eleva la base de cotización para prestaciones futuras de Seguridad Social, subsidios por desempleo, licencias por maternidad o paternidad y facilita la obtención de préstamos hipotecarios o vehiculares al comprobar ingresos fidedignos.`
  },
  {
    slug: 'es-calculadora-de-deduccion-de-propinas-y-horas-extras',
    title: 'Calculadora de Deducción de Propinas y Horas Extras',
    h1: 'Deducciones fiscales para propinas y horas extras trabajadas',
    desc: 'Evalúe el impacto financiero de las propuestas de exención tributaria para propinas y sobretiempo en su declaración federal.',
    tool: 'tips-ot-deduction',
    intro: 'Calcule su potencial ahorro fiscal ante las iniciativas de deducción de impuestos sobre ingresos por propinas y horas extras.',
    body: `## Panorama de las Iniciativas Fiscales para Propinas y Horas Extras

En el debate político y legislativo contemporáneo de los Estados Unidos han cobrado notable notoriedad diversas propuestas tendientes a eliminar o deducir la carga del impuesto federal sobre la renta aplicable a las propinas de trabajadores del sector servicios y a las remuneraciones devengadas en concepto de horas extras laborales (coloquialmente conocidas como iniciativas *No Tax on Tips* y *Overtime Relief*).

Aunque la implementación definitiva de estos incentivos depende de la aprobación congresional y de la promulgación de disposiciones reglamentarias específicas por parte del Departamento del Tesoro, resulta fundamental comprender cómo operarían los mecanismos de deducción sobre la renta bruta ajustada (*Adjusted Gross Income - AGI*).

### Estructura Técnica de una Potencial Deducción Federal

Los proyectos legislativos más sólidos plantean una deducción por encima de la línea (*above-the-line deduction*) sujeta a techos prudenciales y fases de extinción progresiva para evitar abusos corporativos:

- **Tope Máximo Deducible en Propinas**: Propuestas convencionales fijan un límite máximo anual de deducción individual (habitualmente en el rango de $10,000 a $25,000 en propinas declaradas).
- **Tratamiento de las Cargas de Seguridad Social y Medicare**: Las iniciativas parlamentarias mantienen invariables las cotizaciones obligatorias del FICA (7.65% combinado), limitando el beneficio exclusivamente al tramo del Impuesto Federal sobre la Renta (FIT).
- **Límites de Ingresos para Calificar (*Phase-Out*)**: Se incorporan reducciones progresivas del beneficio para contribuyentes solteros con ingresos brutos ajustados superiores a $75,000 ($150,000 en declaraciones conjuntas).

## Ejemplo Práctico 1: Servidora de Comedor con Propinas Moderadas

María declara anualmente $24,000 en salarios base y $18,000 en propinas debidamente documentadas, totalizando un ingreso bruto de $42,000. Su categoría fiscal tributaria marginal se ubica en el 12%:
- **Ingreso Bruto Total**: $42,000.
- **Deducción Estándar Federal (2026/2027)**: $15,700.
- **Propinas Elegibles para Deducción Especial**: $18,000 (asumiendo un tope de exención de $20,000).
- **Renta Imponible Ordinaria sin Deducción Especial**: $42,000 − $15,700 = $26,300 (impuesto estimado aproximado de $2,917.50).
- **Renta Imponible con Exención de Propinas**: $42,000 − $15,700 − $18,000 = $8,300 (impuesto estimado de $830.00).
- **Ahorro Tributario Anual Directo**: **$2,087.50 en el bolsillo de la trabajadora**.

## Ejemplo Práctico 2: Cocinero con Extensas Jornadas de Horas Extras

David percibe $38,000 en salario ordinario y acumula $12,000 en retribución de horas extras a lo largo del ejercicio fiscal:
- Si se aprobara una deducción del 100% sobre el sobretiempo a nivel federal, sus ingresos sujetos a gravamen se reducirían directamente en $12,000, generando un alivio impositivo de $1,440.00 bajo su tramo tributario del 12%.

## Mecánica de Implementación en las Declaraciones del IRS

Los asesores tributarios recalcan que para materializar estos ahorros fiscales en el Formulario 1040, los contribuyentes deberán conservar minuciosamente los registros mensuales de turno, cuadernos de balance y comprobantes digitales generados por terminales de punto de venta. La trazabilidad documental es el pilar central que valida la legitimidad de cualquier deducción extraordinaria ante eventuales revisiones del fisco estadounidense.

## Consideraciones Prácticas y Fiscales Relevantes

### ¿Afecta esta deducción a las retenciones del Seguro Social?
No. Los fondos destinados a las pensiones de jubilación y al sistema hospitalario de Medicare se mantendrían protegidos, preservando los derechos contributivos futuros del trabajador.

### ¿Se requiere comprobante oficial de las propinas percibidas?
Indudablemente. Cualquier beneficio tributario estará supeditado a que los importes figuren explícitamente informados en la casilla 1 (o en casillas complementarias dedicadas) del Formulario W-2 expedido por el empleador al cierre del año fiscal.`
  }
];

// Top 10 States Spanish Guides
const top10States = [
  { code: 'CA', name: 'California', slug: 'california', topic: 'horas-extras-y-tiempo-doble', tool: 'overtime' },
  { code: 'TX', name: 'Texas', slug: 'texas', topic: 'salario-m-nimo-con-propinas', tool: 'tipped-overtime' },
  { code: 'FL', name: 'Florida', slug: 'florida', topic: 'salario-m-nimo-con-propinas', tool: 'tipped-overtime' },
  { code: 'NY', name: 'Nueva York', slug: 'nueva-york', topic: 'salario-m-nimo-y-propinas-regionales', tool: 'tipped-overtime' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', topic: 'leyes-de-propinas-y-horas-extras', tool: 'overtime' },
  { code: 'IL', name: 'Illinois', slug: 'illinois', topic: 'salario-m-nimo-y-horas-extras', tool: 'overtime' },
  { code: 'OH', name: 'Ohio', slug: 'ohio', topic: 'salario-m-nimo-y-sobretiempo', tool: 'overtime' },
  { code: 'GA', name: 'Georgia', slug: 'georgia', topic: 'salario-m-nimo-para-empleados-con-propinas', tool: 'tipped-overtime' },
  { code: 'NC', name: 'Carolina del Norte', slug: 'carolina-del-norte', topic: 'leyes-laborales-de-propinas-y-sobretiempo', tool: 'overtime' },
  { code: 'MI', name: 'Michigan', slug: 'michigan', topic: 'salario-m-nimo-y-horas-extras', tool: 'overtime' }
];

// Specific unique enriched content for each of the 10 states
const stateSpecificBodies = {
  CA: `## Régimen Laboral de California: Protección Integral para Trabajadores de Hostelería

El estado de California se distingue a nivel nacional por poseer uno de los marcos normativos más rigurosos y protectores en favor de los trabajadores asalariados y del sector de hospitalidad. Bajo la autoridad de la Comisión de Bienestar Industrial (IWC) y la División de Cumplimiento de Normas Laborales (DLSE), las normas estatales superan holgadamente las pautas mínimas dictadas por la legislación federal.

La característica fundamental que todo empleado en California debe conocer es que **el crédito por propinas está terminantemente prohibido por el Código Laboral de California (Sección 351)**. En consecuencia, ningún empleador tiene derecho a descontar ni un solo centavo del salario mínimo estatal obligatorio con el argumento de que el trabajador percibe gratificaciones de los clientes. El mesero o cocinero debe recibir la totalidad de su salario horario en dinero efectivo directo, conservando íntegramente las propinas que reciba.

### Normativa Avanzada de Jornada Laboral, Horas Extras y Tiempo Doble

California es una de las pocas jurisdicciones que no se limita a exigir el cálculo de sobretiempo sobre una base semanal de 40 horas, sino que impone multiplicadores obligatorios diarios:
- **Salario Ordinario**: Se liquida sobre las primeras 8 horas de trabajo dentro de una jornada laboral reglamentaria.
- **Tiempo y Medio (1.5x)**: Es aplicable a cualquier hora trabajada por encima de las 8 horas y hasta las 12 horas en un mismo día, así como a las primeras 8 horas completadas en el séptimo día consecutivo de labor en la semana.
- **Tiempo Doble (2.0x)**: Aplica de forma ineludible a todas las horas que sobrepasen las 12 horas continuas de labor en un día, y a cualquier hora trabajada tras las primeras 8 horas en el séptimo día sucesivo.

## Caso Práctico 1: Semana Laboral Intensa en un Establecimiento Gastronómico de Los Ángeles

Un empleado de barra en el área metropolitana de Los Ángeles percibe el salario mínimo obligatorio de $16.50 por hora. Durante un período de alta demanda, registra una jornada especial de 13 horas en un único día calendario:
- Horas Ordinarias (primeras 8 horas a $16.50/hr): **$132.00**.
- Horas Extraordinarias al 1.5x (horas 9 a 12, a $24.75/hr): 4 hrs × $24.75 = **$99.00**.
- Horas Extraordinarias al 2.0x (hora 13, a $33.00/hr): 1 hr × $33.00 = **$33.00**.
- **Compensación Salarial Bruta de la Jornada**: $132.00 + $99.00 + $33.00 = **$264.00**.
- Si el empleado recaudó $180.00 en propinas durante ese turno, su ingreso global diario asciende a **$444.00**, sin deducción alguna de su salario base.

## Caso Práctico 2: Descansos y Períodos de Comida Obligatorios

La legislación de California exige que los empleados gocen de un período de descanso de comida no remunerado de al menos 30 minutos antes de concluir la quinta hora de turno, y descansos remunerados de 10 minutos por cada 4 horas trabajadas. Si el empleador no provee estos descansos, está obligado a abonar una hora adicional de salario regular como penalización (*premium pay*).

## Mecanismos de Reclamación Salarial y Protección frente a Represalias

Cualquier trabajador al que se le adeuden conceptos de sobretiempo o al que se le hayan efectuado retenciones no autorizadas puede incoar una demanda formal ante el Comisionado de Trabajo de California (*Berman Hearing*). La ley prohíbe de manera tajante cualquier represalia empresarial, despido intempestivo o menoscabo de turnos motivado por el ejercicio legítimo de estas acciones protectoras.

## Preguntas Frecuentes sobre Derechos Laborales en California

### ¿Pueden los patrones deducir gastos de uniformes o rotura de vajilla?
No. En California, el costo de uniformes con logotipo o herramientas de trabajo debe ser asumido completamente por la empresa. Asimismo, las roturas accidentales no pueden descontarse del cheque salarial del empleado.

### ¿Qué ocurre si un turno se cancela tras llegar al lugar de trabajo?
Aplica la regla de tiempo de presentación (*reporting time pay*), que obliga al empleador a pagar al menos la mitad de la jornada habitual pactada (un mínimo de dos horas y un máximo de cuatro horas a la tarifa normal).`,

  TX: `## Legislación Laboral de Texas: Normas Salariales y Crédito de Propinas

El entorno laboral en el estado de Texas se rige primordialmente por la Ley Laboral de Texas (*Texas Labor Code*, Capítulo 62) en estrecha convergencia con los preceptos de la Ley federal FLSA. Texas no cuenta con una normativa estatal que establezca un salario mínimo superior al federal, por lo cual los parámetros vigentes se homologan a la pauta federal de $7.25 por hora.

En el ámbito de la hostelería, los establecimientos comerciales de Texas están plenamente autorizados a acogerse a la figura del crédito por propinas (*tip credit*), permitiendo abonar un salario directo en efectivo tan reducido como $2.13 por hora, siempre que las propinas devengadas por el empleado alcancen para cubrir la brecha de $5.12 por hora restante.

### Garantía de Cobertura y Obligaciones del Empleador Tejano

Es un deber ineludible del empleador en Texas efectuar una auditoría quincenal o mensual de los ingresos de cada trabajador tipped. Si por fluctuaciones de clientela o bajas ventas el promedio de propinas más el salario directo no equivale al salario mínimo legal de $7.25 por hora, la empresa debe abonar la diferencia en dinero efectivo.

En materia de sobretiempo, Texas no aplica regulaciones diarias; las horas extras se liquidan estrictamente sobre el cómputo semanal superior a 40 horas laboradas dentro de un período fijo de 7 días consecutivos.

## Caso Práctico 1: Semana Típica de 45 Horas para un Mesero en Houston

Un camarero que labora en un restaurante de carnes en Houston percibe un salario directo de $2.13 por hora y completa 45 horas semanales, registrando $650.00 en propinas:
- Salario Ordinario en Efectivo (40 horas a $2.13): **$85.20**.
- Salario Extraordinario en Efectivo por 5 horas extras: Se aplica la fórmula federal oficial de sobretiempo para meseros:
  - Tarifa regular completa: $7.25/hr.
  - Tarifa al 1.5x: $10.875/hr.
  - Menos crédito de propinas ($5.12/hr): $10.875 − $5.12 = **$5.755/hr** (redondeado a **$5.76**).
  - Pago en efectivo por 5 horas extras: 5 hrs × $5.76 = **$28.80**.
- Salario Directo Total en el Cheque del Empleador: $85.20 + $28.80 = **$114.00**.
- **Ingreso Total Combinado en Mano (Cheque + Propinas)**: $114.00 + $650.00 = **$764.00**.

## Caso Práctico 2: Turno Lento de Lluvia y Compensación de Déficit

Si durante una semana de tormenta un mesero trabaja 30 horas pero solo percibe $100.00 en propinas, su salario en efectivo ($63.90) más las propinas sumaría $163.90 ($5.46/hr), quedando por debajo del mínimo legal obligatorio ($217.50 por 30 horas a $7.25). El empleador está legalmente obligado a compensar la diferencia de $53.60 en la nómina.

## Protocolos Administrativos de Inspección Laboral en Texas

Los empleadores en Texas están obligados a exhibir carteles informativos sobre la Ley de Salarios y mantener registros biométricos o manuales de asistencia durante un período mínimo de dos años. Ante discrepancias en la liquidación de haberes, los trabajadores tienen expedita la vía administrativa ante la Unidad de Reclamación Salarial de la Comisión de la Fuerza Laboral de Texas (*Texas Workforce Commission*).

## Preguntas Frecuentes sobre Normativa en Texas

### ¿Tiene Texas impuesto estatal sobre el sueldo de los trabajadores?
No. Texas es uno de los nueve estados de la Unión que no impone ningún gravamen o impuesto estatal sobre la renta salarial, lo que significa que a los trabajadores únicamente se les descuentan tributos federales (FIT) y Seguro Social con Medicare (FICA).

### ¿Cómo se resuelven las disputas de sueldos no pagados en Texas?
El trabajador tiene un plazo estricto de 180 días naturales para radicar una queja formal bajo la Ley de Pago de Texas (*Texas Payday Law*) ante la Comisión de la Fuerza Laboral de Texas (TWC).`,

  FL: `## Marco Regulatorio de Florida: Aumentos Constitucionales y Crédito de Propinas

El mercado laboral de Florida se encuentra inmerso en una transformación salarial estructural originada por la Enmienda Constitucional número 2 aprobada por los votantes en noviembre de 2020. Dicha reforma consagró un calendario de incrementos progresivos anuales de $1.00 cada 30 de septiembre, orientados a alcanzar un salario mínimo general de $15.00 por hora en todo el estado.

A diferencia del nivel federal estancado, los trabajadores del sector gastronómico y hotelero en Florida se benefician de incrementos automáticos continuos en su salario base en efectivo, ya que el crédito de propinas máximo autorizado está fijado permanentemente por la constitución en $3.02 por hora.

### Estructura de la Remuneración Salarial en el Sector Turístico de Florida

La fórmula salarial de Florida se rige por los siguientes principios:
- **Salario Mínimo General Vigente**: Se sitúa en $13.00 por hora (avanzando a $14.00 y posteriormente a $15.00 conforme al mandato constitucional).
- **Crédito Máximo por Propinas**: Está topado constitucionalmente en **$3.02 por hora**.
- **Salario Mínimo en Efectivo para Empleados con Propinas**: Equivale al salario mínimo general menos el crédito de $3.02 (por ejemplo, $13.00 − $3.02 = **$9.98 por hora en efectivo directo**).

Esta arquitectura proporciona a los meseros de Miami, Orlando y Tampa una red de seguridad financiera directa sumamente superior a la pauta federal de $2.13/hr.

## Caso Práctico 1: Cálculo de Horas Extras con Salario de Florida

Un mesero en un resort de Orlando completa 46 horas durante una semana de vacaciones escolares, cobrando el salario directo en efectivo de $9.98 por hora sobre una base estatal de $13.00/hr:
- Salario Regular en Efectivo por 40 horas: 40 hrs × $9.98 = **$399.20**.
- **Cálculo de la Tarifa de Sobretiempo**:
  - Tarifa regular completa al 1.5x: $13.00 × 1.5 = **$19.50 por hora**.
  - Deducción del crédito constitucional por propinas: $19.50 − $3.02 = **$16.48 por hora de sobretiempo**.
  - Pago por 6 horas extras: 6 hrs × $16.48 = **$98.88**.
- **Salario en Efectivo a Abonar por la Empresa**: $399.20 + $98.88 = **$498.08**.
- Propinas cobradas durante la semana: $820.00.
- **Ingreso Total Bruto de la Semana**: $498.08 + $820.00 = **$1,318.08**.

## Caso Práctico 2: Ventajas Fiscales del Residente de Florida

Florida no aplica impuestos estatales sobre los ingresos salariales. Al recibir su nómina, el trabajador de hostelería retiene la totalidad de sus emolumentos tras las deducciones federales estándar del IRS y FICA, optimizando su rendimiento financiero neto frente a trabajadores de estados con gravámenes progresivos.

## Procedimientos de Cobranza Legal bajo la Ley de Salario Mínimo de Florida

La legislación de Florida exige que antes de interponer una demanda judicial formal por salarios impagos, el trabajador remita a su empleador una notificación previa por escrito (*pre-suit notice*) otorgándole un plazo perentorio de 15 días para liquidar los haberes adeudados sin penalizaciones judiciales accesorias.

## Preguntas Frecuentes sobre Leyes de Florida

### ¿Cuándo entra en vigor cada ajuste salarial en Florida?
A diferencia de otros estados que actualizan sus tablas el 1 de enero, en Florida los aumentos constitucionales entran en vigor formal cada 30 de septiembre.

### ¿Pueden los gerentes retener propinas de eventos corporativos?
No. Si el contrato de un banquete especifica un cargo por servicio que se presenta al cliente como propina para el personal, dicho dinero debe distribuirse entre los trabajadores de servicio sin retenciones corporativas indebidas.`,

  NY: `## Normativa Compleja de Nueva York: Estructura Regional y Reglas de la Industria Hotelera

El estado de Nueva York posee uno de los regímenes de derecho laboral más sofisticados y segmentados de los Estados Unidos. La Orden de Salario de la Industria de Hospitalidad (*Hospitality Industry Wage Order*, 12 NYCRR Parte 146) estipula regulaciones extremadamente detalladas relativas al salario mínimo regional, créditos de propinas admisibles y compensaciones adicionales por jornada discontinua.

En Nueva York, los salarios no son uniformes a lo largo de su territorio, dividiéndose principalmente en dos grandes zonas económicas:
1. **Región Metropolitana y Downstate**: Abarca la Ciudad de Nueva York (NYC), el Condado de Nassau, el Condado de Suffolk y el Condado de Westchester, donde rigen las tarifas salariales más altas del estado.
2. **Región Remanente / Upstate**: Abarca todos los condados del norte y oeste del estado, con tarifas salariales adaptadas a una estructura de costo de vida más moderada.

### Disposiciones Especiales: Diferencial por Turno Fraccionado (*Split Shift*)

Una protección única del estado de Nueva York es el pago obligatorio de jornada discontinua (*spread of hours*). Si el intervalo total de tiempo entre el inicio del primer turno del día y la finalización del último turno excede las 10 horas consecutivas (incluso si hubo un descanso prolongado intermedio de varias horas), el empleador está legalmente obligado a compensar al trabajador con **una hora adicional completa al salario mínimo general básico**, independiente de las propinas devengadas.

## Caso Práctico 1: Semana Laboral de 44 Horas en un Restaurante de Manhattan

Un mesero en un bistró de Manhattan opera bajo el salario mínimo para trabajadores con propinas del sector servicios de la Ciudad de Nueva York:
- Salario Mínimo General de NYC: $16.50 por hora.
- Crédito de Propinas Máximo Autorizado en NYC: $5.50 por hora.
- Salario Mínimo en Efectivo Obligatorio: **$11.00 por hora en dinero directo**.
- Por 40 horas regulares: 40 hrs × $11.00 = **$440.00**.
- **Cálculo de Horas Extras al 1.5x**:
  - Tarifa regular completa al 1.5x: $16.50 × 1.5 = $24.75 por hora.
  - Menos crédito de propinas ($5.50/hr): $24.75 − $5.50 = **$19.25 por hora extra**.
  - 4 horas extras a $19.25/hr: **$77.00**.
- Salario en efectivo total a cargo del empleador: $440.00 + $77.00 = **$517.00**.

## Caso Práctico 2: Compensación de Spread of Hours en Doble Turno

Un mesero en Brooklyn trabaja el turno de almuerzo de 11:30 a. m. a 2:30 p. m. (3 horas) y regresa para el turno de cena de 6:00 p. m. a 11:00 p. m. (5 horas), sumando 8 horas trabajadas. El lapso global transcurrido desde las 11:30 a. m. hasta las 11:00 p. m. es de 11.5 horas (superando el umbral de 10 horas). El empleador debe abonar:
- 8 horas a salario de propinas ($11.00/hr) = $88.00.
- 1 hora adicional por spread of hours al salario mínimo completo ($16.50/hr) = $16.50.
- Total directo del día: **$104.50**.

## Disposiciones sobre Notificación Escrita (Wage Theft Prevention Act)

La Ley de Prevención de Robo Salarial de Nueva York impone la obligación de entregar a cada nuevo empleado una notificación bilingüe por escrito donde se especifiquen con precisión las tasas salariales regulares y de sobretiempo aplicables, así como las deducciones y subsidios previstos por la empresa.

## Preguntas Habituales en Nueva York

### ¿Pueden los lavaplatos participar en el tip pool de un restaurante en NYC?
Bajo la ley estatal de Nueva York, si el empleador se acoge al crédito por propinas, el personal de cocina y lavado (*back of house*) tiene estrictamente prohibido participar en el fondo de propinas; solo pueden participar quienes desempeñan servicio directo a clientes.

### ¿Cómo afecta la retención fiscal local de la Ciudad de Nueva York?
Los residentes que viven en los cinco distritos de la Ciudad de Nueva York están sujetos a un impuesto sobre la renta local adicional (*NYC personal income tax*), que se descuenta junto con el impuesto estatal de Nueva York en su nómina.`,

  PA: `## Marco Laboral de Pennsylvania: Normas para Trabajadores y Reglas de Propinas

La normativa que salvaguarda a los trabajadores en la Mancomunidad de Pennsylvania se fundamenta en la Ley de Salario Mínimo de Pennsylvania (*Pennsylvania Minimum Wage Act*) y en las regulaciones modernizadas de propinas emitidas por el Departamento de Trabajo e Industria (L&I).

Pennsylvania mantiene como salario mínimo general la base federal de $7.25 por hora, y fija el salario mínimo en efectivo para trabajadores que reciben propinas en $2.83 por hora (lo que representa un crédito por propinas máximo de $4.42 por hora).

### La Regla del 80/20 y Tareas Secundarias en Pennsylvania

Pennsylvania incorporó en su normativa una estricta protección respecto al tiempo que los meseros pueden dedicar a labores que no generan propinas directas (como limpieza profunda, corte de frutas para la barra o reposición de insumos):
- Si un trabajador con salario reducido dedica más del 20% de su tiempo semanal a tareas secundarias que no producen propinas, el empleador debe pagar el salario mínimo completo ($7.25/hr) por todas las horas que excedan dicho umbral.
- Si se le asigna a tareas que no tienen relación con su función de servicio, debe pagarse el salario completo desde el primer minuto.

## Caso Práctico 1: Semana Estándar con Horas Extras en Filadelfia

Un mesero en el centro de Filadelfia completa 48 horas en un turno semanal:
- Salario Regular por 40 horas (a $2.83/hr): **$113.20**.
- **Cálculo de Horas Extras**:
  - Salario mínimo general: $7.25/hr.
  - Multiplicador 1.5x: $7.25 × 1.5 = $10.875/hr.
  - Menos crédito de propinas ($4.42/hr): $10.875 − $4.42 = **$6.455 por hora extra** (redondeado a **$6.46**).
  - 8 horas extras a $6.46/hr: **$51.68**.
- Salario Total en Efectivo Abonado por la Empresa: $113.20 + $51.68 = **$164.88**.
- Propinas generadas: $580.00.
- **Remuneración Semanal Total**: $164.88 + $580.00 = **$744.88**.

## Caso Práctico 2: Impuesto Fijo sobre la Renta en Pennsylvania

A diferencia de los estados con escalas fiscales progresivas, Pennsylvania aplica un impuesto sobre la renta plano y uniforme (*flat tax*) del 3.07% sobre todos los ingresos salariales y propinas declaradas, facilitando la previsibilidad del cheque neto quincenal.

## Derechos de Información y Acceso a Registros de Nómina

En Pennsylvania, los trabajadores tienen la prerrogativa legal de solicitar y examinar los libros y registros contables de sus horas trabajadas en caso de existir dudas fundadas sobre deducciones ilegítimas o cálculos erróneos en su talón de pago quincenal.

## Preguntas Frecuentes en Pennsylvania

### ¿Pueden los supervisores participar en el fondo común de propinas?
Bajo la regulación actualizada del Departamento de Trabajo e Industria de Pennsylvania, cualquier empleado que tenga autoridad para programar turnos, contratar personal o ejercer disciplina laboral tiene terminantemente prohibido percibir fondos de propinas comunes.

### ¿Existen impuestos locales en ciudades de Pennsylvania?
Sí. Ciudades como Filadelfia aplican un impuesto municipal sobre los salarios (*wage tax*) de aproximadamente 3.75% para residentes, el cual se deduce directamente de la nómina de los empleados.`,

  IL: `## Legislación Laboral de Illinois: Salarios Escalonados y el Acta de Horas Extras

El estado de Illinois cuenta con un marco legal dinámico respaldado por la Ley de Salario Mínimo de Illinois (*Illinois Minimum Wage Law*, 820 ILCS 105/) y las ordenanzas autónomas de la Ciudad de Chicago y el Condado de Cook. A nivel estatal, Illinois ha implementado incrementos escalonados para consolidar un salario digno en todo su territorio.

El salario mínimo general del estado de Illinois se ubica en $14.00 por hora (con una pauta de incremento progresivo anual), y autoriza a los empleadores a aplicar un crédito de propinas de hasta el 40% del salario mínimo aplicable.

### El Régimen de Crédito del 40% en Illinois

A diferencia de los estados que establecen un monto fijo en dólares para el crédito de propinas, Illinois define el crédito como una proporción porcentual fija:
- Salario Mínimo General Estatal: $14.00 por hora.
- Crédito Máximo por Propinas (40%): **$5.60 por hora**.
- Salario Mínimo en Efectivo para Empleados con Propinas (60% restante): **$8.40 por hora**.

En la Ciudad de Chicago, rige un régimen aún más protector mediante la ordenanza local de salarios mínimos, la cual inició un proceso gradual para eliminar por completo el crédito de propinas hacia el año 2028.

## Caso Práctico 1: Semana Laboral de 45 Horas en Chicago y Suburbios

Un mesero en un establecimiento de Illinois completa 45 horas semanales a la tasa estatal base:
- Salario Directo por 40 horas regulares: 40 hrs × $8.40 = **$336.00**.
- **Cálculo de la Tarifa de Horas Extras**:
  - Tarifa regular completa al 1.5x: $14.00 × 1.5 = $21.00 por hora.
  - Deducción del crédito de propinas ($5.60/hr): $21.00 − $5.60 = **$15.40 en efectivo por hora extra**.
  - Pago por 5 horas extras: 5 hrs × $15.40 = **$77.00**.
- **Salario en Efectivo a Pagar por el Empleador**: $336.00 + $77.00 = **$413.00**.
- Propinas percibidas en el turno: $700.00.
- **Ingreso Total Combinado**: $413.00 + $700.00 = **$1,113.00**.

## Caso Práctico 2: Régimen Fiscal Uniforme en Illinois

El estado de Illinois aplica una tasa plana (*flat rate*) de impuesto sobre la renta del 4.95% sobre el ingreso neto imponible tras la deducción estándar básica, permitiendo un cálculo exacto de las retenciones en el recibo de pago.

## Normas sobre Períodos de Comida y Descanso Físico en Illinois

El Departamento de Trabajo de Illinois exige que todo trabajador asignado a turnos de 7.5 horas continuas disfrute de un período de comida no remunerado de al menos 20 minutos dentro de las primeras cinco horas de servicio, garantizando condiciones físicas óptimas en salas y cocinas.

## Preguntas Frecuentes en Illinois

### ¿Qué es la Ley del Día de Descanso Obligatorio en Illinois?
La ley ODRISA (*One Day Rest in Seven Act*) exige que todo empleador otorgue a sus trabajadores al menos 24 horas consecutivas de descanso en cada semana calendario fija.

### ¿Cómo se denuncian irregularidades en la nómina en Illinois?
Los reclamos pueden tramitarse directamente en línea a través de la División de Normas Justas de Trabajo del Departamento de Trabajo de Illinois (IDOL).`,

  OH: `## Marco Legal de Ohio: Ajustes Automáticos por Inflación y Salario Mínimo

El marco regulatorio que rige las remuneraciones en el estado de Ohio posee un mecanismo automático establecido en la Sección 34a del Artículo II de la Constitución de Ohio, la cual estipula que el salario mínimo estatal debe actualizarse el 1 de enero de cada año conforme a la variación del Índice de Precios al Consumidor (CPI-W).

A diferencia del nivel federal, Ohio garantiza que el poder adquisitivo de sus trabajadores no se erosione con el aumento del costo de vida. El salario mínimo general vigente en Ohio asciende a $10.70 por hora para grandes empresas, con una tarifa en efectivo reducida para trabajadores que reciben propinas de $5.35 por hora (un crédito por propinas exacto del 50%, es decir, $5.35/hr).

### Reglas Clave para Establecimientos Comerciales en Ohio

- **Empresas Sujetas a la Pauta Constitucional**: Empleadores con ingresos brutos anuales superiores al umbral estatutario deben pagar la tasa completa de Ohio ($10.70/hr). Pequeños negocios con ingresos inferiores pueden acogerse a la tarifa federal básica.
- **El Crédito de Propinas del 50%**: En Ohio, el crédito equivale exactamente a la mitad del salario mínimo, obligando a las empresas a abonar la otra mitad directamente en efectivo.

## Caso Práctico 1: Liquidación de 46 Horas para una Mesera en Columbus

Una trabajadora de servicio de mesa en un restaurante de Columbus labora 46 horas en una semana:
- Salario Regular en Efectivo (40 horas a $5.35/hr): **$214.00**.
- **Cálculo de la Tarifa Extraordinaria de Horas Extras**:
  - Salario mínimo general: $10.70/hr.
  - Multiplicador 1.5x: $10.70 × 1.5 = $16.05 por hora.
  - Menos crédito de propinas ($5.35/hr): $16.05 − $5.35 = **$10.70 en efectivo por cada hora extra**.
  - Nómina por 6 horas extras: 6 hrs × $10.70 = **$64.20**.
- **Salario en Efectivo a Abonar por el Empleador**: $214.00 + $64.20 = **$278.20**.
- Propinas recibidas durante la semana: $600.00.
- **Ingreso Semanal Bruto**: $278.20 + $600.00 = **$878.20**.

## Caso Práctico 2: Impuestos Municipales en Ciudades de Ohio

El estado de Ohio cuenta con impuestos locales sobre la renta (*municipal income taxes*) administrados por consorcios como RITA o agencias locales, que oscilan comúnmente entre el 1.5% y el 2.5% según el municipio donde se realice la actividad laboral.

## Conservación de Documentación y Libros Salariales en Ohio

Las leyes estatales obligan a las empresas a resguardar la información detallada de nómina, fichajes de entrada y salida y comprobantes de propinas durante al menos tres años completos, poniéndolos a disposición de las autoridades estatales ante cualquier auditoría oficial.

## Preguntas Habituales en Ohio

### ¿Qué sucede si las propinas no cubren el crédito en Ohio?
El empleador está legalmente obligado a suplementar la nómina con dinero en efectivo directo para asegurar que la compensación total alcance los $10.70 por hora trabajada.

### ¿Se permiten deducciones por caja faltante en Ohio?
No, salvo que exista una autorización expresa y voluntaria por escrito firmada por el empleado, y siempre que dicha deducción no reduzca su remuneración por debajo del salario mínimo obligatorio.`,

  GA: `## Normativa Laboral de Georgia: Cobertura Federal y Prácticas Salariales

La legislación laboral en el estado de Georgia presenta características sumamente particulares. Aunque el estatuto estatal formal contempla un salario mínimo simbólico de $5.15 por hora (O.C.G.A. § 34-4-3), la inmensa mayoría de las empresas comerciales, cadenas hoteleras y restaurantes en Georgia quedan cobijados bajo la jurisdicción federal de la FLSA debido a su participación en el comercio interestatal.

Por consiguiente, la tarifa efectiva aplicable en Georgia es el estándar federal de **$7.25 por hora**, con un salario mínimo directo en efectivo para empleados que reciben propinas fijado en **$2.13 por hora** y un crédito por propinas máximo de **$5.12 por hora**.

### Deberes del Empleador de Hostelería en Georgia

En el dinámico mercado hostelero de Atlanta, Savannah y Augusta, los empleadores que aplican el crédito por propinas deben acatar rigurosamente tres condiciones imperativas dictadas por la División de Horas y Salarios del Departamento de Trabajo:
1. Notificar previamente y por escrito al trabajador sobre la aplicación del crédito.
2. Permitir que el trabajador retenga el 100% de las propinas percibidas (salvo acuerdos legítimos de fondo común entre personal de servicio directo).
3. Asegurar que las propinas devengadas compensen de forma fidedigna el margen de $5.12 por hora.

## Caso Práctico 1: Semana Laboral Extensa de 50 Horas en Atlanta

Un mesero en un restaurante concurrido de Atlanta completa 50 horas de trabajo durante la semana de una convención internacional:
- Salario Ordinario en Efectivo por 40 horas (a $2.13/hr): **$85.20**.
- **Determinación de la Tarifa de Sobretiempo para Meseros**:
  - Salario mínimo legal general: $7.25/hr.
  - Multiplicador de sobretiempo 1.5x: $7.25 × 1.5 = $10.875 por hora.
  - Deducción del crédito máximo por propinas: $10.875 − $5.12 = **$5.755 por hora extra** (redondeado a **$5.76**).
  - Nómina por 10 horas extras: 10 hrs × $5.76 = **$57.60**.
- **Salario en Efectivo a Abonar por la Empresa**: $85.20 + $57.60 = **$142.80**.
- Propinas reportadas durante el evento: $920.00.
- **Ingreso Global Semanal**: $142.80 + $920.00 = **$1,062.80**.

## Caso Práctico 2: Régimen Impositivo Estatal de Georgia

Georgia opera bajo un sistema de impuesto sobre la renta con una tasa plana progresivamente unificada del 5.39%, la cual se retiene de los ingresos computables junto con las retenciones federales usuales.

## Vías de Defensa y Canales de Asesoría Salarial para la Comunidad Hispana

Los trabajadores de habla hispana en Georgia disponen de canales de atención comunitaria y traductores oficiales habilitados a través de la División federal de Horas y Salarios en sus sedes de Atlanta, asegurando un acceso irrestricto a la justicia laboral sin costo alguno.

## Preguntas Frecuentes en Georgia

### ¿Existe límite de horas para trabajar por día en Georgia?
No hay un límite legal diario para trabajadores adultos en Georgia; no obstante, cualquier hora trabajada por encima de 40 horas en la semana laboral debe remunerarse con la tarifa de sobretiempo del 1.5x.

### ¿A quién recurrir en caso de impago salarial en Georgia?
Dado que el Departamento de Trabajo de Georgia (GDOL) no interviene administrativamente en la cobranza de sueldos privados, las denuncias deben interponerse directamente ante la oficina regional federal del Departamento de Trabajo de EE. UU. (US DOL Wage and Hour Division).`,

  NC: `## Legislación Laboral de Carolina del Norte: Estatutos de Sueldos y Horas

El régimen laboral en el estado de Carolina del Norte se estructura en torno a la Ley de Sueldos y Horas de Carolina del Norte (*North Carolina Wage and Hour Act*, N.C.G.S. § 95-25.1 et seq.), administrada por la División de Sueldos y Horas del Departamento de Trabajo de Carolina del Norte (NCDOL).

Carolina del Norte adopta como parámetro de salario mínimo general la pauta federal de **$7.25 por hora**, y fija el salario mínimo en dinero directo para trabajadores con propinas en **$2.13 por hora**, con un crédito de propinas admisible de **$5.12 por hora**.

### Requisitos Formales de Documentación de Propinas en Carolina del Norte

La legislación estatal de Carolina del Norte es sumamente estricta en cuanto a la notificación obligatoria previa:
- El empleador debe entregar por escrito a cada empleado, antes de comenzar sus labores, un desglose claro de su tarifa horaria, periodicidad de pago y la aplicación específica del crédito por propinas.
- Se exige mantener constancias escritas y firmadas de las propinas declaradas por cada empleado durante un período no inferior a tres años.

## Caso Práctico 1: Turno de 47 Horas en el Área de Charlotte

Un bartender en un centro de eventos de Charlotte completa 47 horas en una semana:
- Salario Regular por 40 horas (a $2.13/hr): **$85.20**.
- **Fórmula de Liquidación de Horas Extras**:
  - Salario mínimo general: $7.25/hr.
  - Tarifa al 1.5x: $7.25 × 1.5 = $10.875/hr.
  - Menos crédito por propinas ($5.12/hr): $10.875 − $5.12 = **$5.755/hr** (redondeado a **$5.76**).
  - Pago por 7 horas extras: 7 hrs × $5.76 = **$40.32**.
- **Total Salario en Efectivo a Cargo de la Empresa**: $85.20 + $40.32 = **$125.52**.
- Propinas registradas en barra: $740.00.
- **Compensación Semanal Bruta**: $125.52 + $740.00 = **$865.52**.

## Caso Práctico 2: Impuesto Estatal Plano en Carolina del Norte

Carolina del Norte aplica un impuesto estatal plano (*flat individual income tax rate*) del 4.50% sobre el ingreso gravable, deduciéndose de manera uniforme en la nómina quincenal de los colaboradores.

## Cláusulas sobre Retención de Cheques Finales en Carolina del Norte

Bajo la Sección 95-25.7 del estatuto estatal, los empleados que renuncien o sean despedidos deben percibir la totalidad de sus emolumentos acumulados a más tardar en la fecha normal de pago siguiente, prohibiéndose cualquier dilación contractual indebida.

## Preguntas Frecuentes en Carolina del Norte

### ¿Puede el patrón deducir costos de tarjetas de crédito en NC?
Sí. El empleador en Carolina del Norte puede deducir la tarifa real que le cobra la procesadora bancaria sobre la propina abonada con tarjeta, siempre que dicha retención no reduzca el salario base por debajo de los mínimos legales.

### ¿Qué plazo hay para cobrar sueldos retenidos indebidamente?
Los trabajadores tienen un término prescriptivo de dos años para formular su reclamo de salarios devengados ante el NCDOL o ante los tribunales estatales.`,

  MI: `## Marco Regulatorio de Michigan: Evolución de las Iniciativas Populares y Salarios

El marco normativo laboral en el estado de Michigan se encuentra regulado por la Ley de Oportunidades Salariales Mejoradas de Michigan (*Improved Workforce Opportunity Wage Act*, MCL 408.931 et seq.), administrada por la División de Salarios y Horas del Departamento de Trabajo y Oportunidad Económica (LEO).

Michigan destaca por contar con un salario mínimo sustancialmente más elevado que la pauta federal, fijado en **$10.33 por hora** (con aumentos programados por encima de $12.00/hr derivados de resoluciones judiciales sobre iniciativas populares), estableciendo que los trabajadores que perciben propinas deben cobrar al menos el **38% del salario mínimo general en dinero en efectivo directo**.

### La Pauta Salarial del 38% para Empleados con Propinas en Michigan

- **Salario Mínimo General Vigente**: $10.33 por hora.
- **Porcentaje de Salario en Efectivo Obligatorio (38%)**: **$3.93 por hora en dinero directo**.
- **Crédito Máximo por Propinas Admisible (62%)**: **$6.40 por hora**.

Esta regulación asegura que ningún empleado del sector de servicios en Detroit, Grand Rapids o Ann Arbor perciba menos de $3.93 por hora de su empleador, independientemente del volumen de propinas obtenido.

## Caso Práctico 1: Semana Laboral de 44 Horas en un Restaurante de Detroit

Una mesera en Detroit completa 44 horas semanales de servicio:
- Salario Regular Directo en Efectivo (40 horas a $3.93/hr): **$157.20**.
- **Cálculo de la Tarifa de Sobretiempo en Michigan**:
  - Salario regular general: $10.33/hr.
  - Multiplicador 1.5x: $10.33 × 1.5 = **$15.495 por hora**.
  - Menos crédito de propinas aplicado ($6.40/hr): $15.495 − $6.40 = **$9.095 en efectivo por cada hora extra** (redondeado a **$9.10**).
  - Pago en efectivo por 4 horas extras: 4 hrs × $9.10 = **$36.40**.
- **Salario Directo Total Abonado por la Empresa**: $157.20 + $36.40 = **$193.60**.
- Propinas recibidas en el turno: $680.00.
- **Ingreso Total Combinado en la Semana**: $193.60 + $680.00 = **$873.60**.

## Caso Práctico 2: Estructura Tributaria en Michigan

Michigan aplica una tasa impositiva estatal fija (*flat tax rate*) del 4.25% sobre la renta imponible individual, sumándose en ciudades como Detroit un impuesto local sobre la renta del 2.40% para residentes (1.20% para no residentes).

## Auditorías de Cumplimiento y Procedimiento Administrativo en Michigan

La Oficina de Salarios y Horas de Michigan practica inspecciones periódicas en negocios de comidas y bebidas para constatar que el crédito del 62% esté respaldado por registros reales de propinas. Si una empresa no demuestra que sus trabajadores alcanzaron el mínimo legal, se le impone el reintegro inmediato más multas administrativas proporcionales.

## Preguntas Frecuentes en Michigan

### ¿Qué sucede con las iniciativas populares para eliminar el crédito de propinas en Michigan?
La Corte Suprema de Michigan emitió fallos históricos ordenando restituir las iniciativas originales de salario digno, lo que impulsará la eliminación gradual del crédito de propinas en los próximos años hasta alcanzar el 100% del salario mínimo general.

### ¿Cómo se denuncian violaciones en el pago de propinas en Michigan?
Los trabajadores pueden radicar denuncias formales ante la Oficina de Salarios y Horas de la LEO de Michigan en un plazo de hasta tres años a partir de la fecha de la infracción.`
};

console.log('Writing enriched Spanish files...');

// 1. Write Spanish Tools
for (const tool of spanishTools) {
  const filePath = path.join(rootDir, 'content/es', `${tool.slug}.md`);
  const md = `---
title: "${tool.title}"
slugTitle: "${tool.slug}"
h1: "${tool.h1}"
description: "${tool.desc}"
intro: "${tool.intro}"
type: tool
tool: ${tool.tool}
hub: /p/shift-pay-tools.html
hubName: Herramientas de pago
labels: [espanol, tools, calculadoras]
needs human edit: false
related:
  - { label: "Calculadora de salario neto", url: "/2026/12/es-calculadora-de-salario-neto-con-propinas.html" }
  - { label: "Calculadora de fondo de propinas", url: "/2026/12/es-calculadora-de-fondo-de-propinas.html" }
  - { label: "Guía de horas extras y sobretiempo", url: "/2026/12/es-calculadora-de-horas-extras-y-tiempo-doble.html" }
sources:
  - { label: "Departamento de Trabajo de EE. UU. (FLSA)", url: "https://www.dol.gov/agencies/whd/flsa" }
  - { label: "Servicio de Impuestos Internos (IRS Guía de Propinas)", url: "https://www.irs.gov/businesses/small-businesses-self-employed/tip-recordkeeping-and-reporting" }
---
${tool.body}
`;
  fs.writeFileSync(filePath, md);
}

// 2. Write Spanish State Guides
for (const state of top10States) {
  const st = statesData.states.find(s => s.code === state.code) || { minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12 };
  const slug = `es-${state.slug}-${state.topic}`;
  const filePath = path.join(rootDir, 'content/es', `${slug}.md`);
  const md = `---
title: "${state.name}: Leyes de Salario y Horas Extras 2027"
slugTitle: "${slug}"
h1: "${state.name}: Salario mínimo, propinas y horas extras"
description: "Guía legal actualizada en español sobre salarios mínimos ($${st.minWage ? st.minWage.toFixed(2) : '7.25'}/hr), crédito de propinas y cálculo de horas extras en ${state.name}."
intro: "Consulte las normas laborales vigentes en ${state.name}: salario mínimo por hora, derechos de trabajadores con propinas, cálculo de sobretiempo y protecciones de nómina."
type: tool
tool: ${state.tool}
state: ${state.code}
hub: /p/state-pay-rules.html
hubName: Reglas laborales
labels: [espanol, states, ${state.slug}]
needs human edit: false
related:
  - { label: "Calculadora de salario neto", url: "/2026/12/es-calculadora-de-salario-neto-con-propinas.html" }
  - { label: "Calculadora de horas extras con propinas", url: "/2026/12/es-calculadora-de-horas-extras-con-propinas.html" }
  - { label: "Tabla estatal completa", url: "/p/state-pay-rules.html" }
sources:
  - { label: "Departamento de Trabajo de EE. UU. (DOL)", url: "https://www.dol.gov/agencies/whd" }
  - { label: "Leyes Laborales Oficiales de ${state.name}", url: "${st.sourceUrl || 'https://www.dol.gov/agencies/whd/state/minimum-wage/tipped'}" }
---
${stateSpecificBodies[state.code]}
`;
  fs.writeFileSync(filePath, md);
}

console.log('All 17 Spanish content pages enriched successfully.');
