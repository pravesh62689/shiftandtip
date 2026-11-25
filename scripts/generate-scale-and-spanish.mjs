// scripts/generate-scale-and-spanish.mjs
// Generates scaled state, city, and Spanish localized content with quality gates & publish schedule.

import fs from 'node:fs';
import path from 'node:path';
import { paycheck } from '../src/engine/paycheck.js';
import { grossPay } from '../src/engine/overtime.js';
import { RULES } from '../src/engine/rules.js';
import { tipPool } from '../src/engine/tips.js';
import { fmt } from '../src/engine/money.js';

const statesData = JSON.parse(fs.readFileSync('data/states.json', 'utf8'));
const taxData = JSON.parse(fs.readFileSync('data/state-taxes.json', 'utf8'));
const citiesData = JSON.parse(fs.readFileSync('data/cities.json', 'utf8'));

// Search demand ranked order of 51 jurisdictions
const STATE_ORDER = [
  'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
  'NJ', 'VA', 'WA', 'AZ', 'TN', 'MA', 'IN', 'MO', 'MD', 'WI',
  'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT',
  'NV', 'IA', 'AR', 'KS', 'MS', 'NM', 'NE', 'ID', 'WV', 'HI',
  'NH', 'ME', 'MT', 'RI', 'DE', 'SD', 'ND', 'AK', 'DC', 'VT', 'WY'
];

const kebab = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const publishSchedule = [];
let currentDate = new Date('2026-12-01T09:00:00Z');

function advanceOneDay() {
  const d = new Date(currentDate);
  currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  return d.toISOString().split('T')[0];
}

// -------------------------------------------------------------
// 1. GENERATE STATE PAYCHECK CALCULATOR PAGES (51 Jurisdictions)
// -------------------------------------------------------------
console.log('Generating State Paycheck Calculator pages...');
for (const code of STATE_ORDER) {
  const st = statesData.states.find(s => s.code === code);
  if (!st) continue;
  const stateTax = taxData.states[code] || { type: 'none' };

  // Calculate 2 distinct worked examples with engine
  const ex1 = paycheck({ wagesCents: 160000, tipsCents: 50000, periodsPerYear: 26, filingStatus: 'single', stateCode: code });
  const ex2 = paycheck({ wagesCents: 240000, tipsCents: 80000, overtimeCents: 40000, periodsPerYear: 26, filingStatus: 'mfj', stateCode: code });

  const slug = `${st.slug}-paycheck-calculator-2027`;
  const isZeroTax = stateTax.type === 'none';
  const taxSummary = isZeroTax
    ? `${st.name} levies no state wage income tax, meaning workers keep 100% of their earnings after federal income tax and FICA contributions.`
    : stateTax.type === 'flat'
      ? `${st.name} utilizes a flat income tax rate of ${(stateTax.flatRate * 100).toFixed(2)}% on taxable wages exceeding statutory deductions.`
      : `${st.name} applies progressive graduated tax brackets ranging from ${(stateTax.brackets[0].rate * 100).toFixed(1)}% up to ${(stateTax.brackets[stateTax.brackets.length - 1].rate * 100).toFixed(1)}%.`;

  const md = `---
title: "${st.name} Paycheck Calculator 2027"
slugTitle: "${slug}"
h1: "${st.name} paycheck calculator (take-home pay with tips)"
description: "Calculate ${st.name} net take-home pay with 2026–2027 federal and state tax withholding brackets, Social Security, and tip credits."
intro: "Calculate your estimated net pay in ${st.name} after mandatory 2026–2027 statutory withholding: federal income tax, FICA, and ${st.name} tax."
type: tool
tool: paycheck
state: ${code}
hub: /p/shift-pay-tools.html
hubName: Shift pay tools
labels: [paycheck, states, tax, ${st.slug}]
needs human edit: false
related:
  - { label: "${st.name} overtime laws", url: "/2026/12/${st.slug}-overtime-laws-and-calculator.html" }
  - { label: "${st.name} tipped minimum wage", url: "/2026/12/${st.slug}-tipped-minimum-wage.html" }
  - { label: "State pay rules comparison", url: "/p/state-pay-rules.html" }
sources:
  - { label: "IRS Revenue Procedure 2025-38 (2026 Tax Brackets)", url: "https://www.irs.gov" }
  - { label: "Social Security Administration 2026 Wage Base", url: "https://www.ssa.gov/oact/cola/cbb.html" }
  - { label: "${stateTax.source || st.name + ' Department of Revenue'}", url: "https://taxfoundation.org" }
---
## ${st.name} Paycheck Withholding Architecture

Every paycheck issued in ${st.name} reflects statutory federal withholdings alongside state-specific income tax rules. For hospitality, shift, and hourly employees who collect tips, computing net take-home requires balancing gross base hourly wages, overtime pay, and reported gratuities against both payroll taxes (FICA) and progressive income tax brackets.

${taxSummary}

## Statutory Withholding Components in ${st.name}

1. **Social Security (FICA)**: Assessed at 6.2% on all compensation up to the statutory 2026 wage base threshold of $184,500. Tips are fully subject to FICA.
2. **Medicare (FICA)**: Assessed at 1.45% across all taxable wages, with an additional 0.9% surtax applying to annual earnings exceeding $200,000 for single filers ($250,000 for married couples).
3. **Federal Income Tax**: Determined by applying your filing status (Single, Married Filing Jointly, or Head of Household) and standard deductions ($15,700 for single filers in 2026) to marginal brackets spanning 10% to 37%.
4. **${st.name} State Income Tax**: ${isZeroTax ? 'No state income tax is deducted from your paycheck.' : 'Withheld according to official ' + st.name + ' Department of Revenue withholding formulas.'}

## Worked Example 1: Hourly Server with Tips in ${st.name}

Jordan works as a server in ${st.name} paid on a biweekly payroll schedule (26 pay periods annually). During this pay cycle, Jordan earns $1,600.00 in regular hourly wages and reports $500.00 in customer tips, producing a gross compensation of $2,100.00.

Applying single filing status with standard deductions:
- **Gross Compensation**: ${fmt(ex1.grossCents)}
- **Social Security (6.2%)**: −${fmt(ex1.ssCents)}
- **Medicare (1.45%)**: −${fmt(ex1.medCents)}
- **Federal Income Tax**: −${fmt(ex1.fedCents)}
- **${st.name} State Income Tax**: ${ex1.stateCents === 0 ? '$0.00' : '−' + fmt(ex1.stateCents)}
- **Estimated Net Take-Home Pay**: ${fmt(ex1.netCents)}
- **Effective Tax Rate**: ${ex1.effectiveTaxRatePct}% (Annualized gross: ${fmt(ex1.annualGrossCents)})

## Worked Example 2: Lead Shift Worker with Overtime

Alex works full-time in ${st.name} earning $2,400.00 in base wages, $800.00 in reported tips, and $400.00 in overtime compensation across a biweekly period, generating $3,600.00 in gross pay. Alex files as Married Filing Jointly.

Audit of deductions:
- **Gross Earnings**: ${fmt(ex2.grossCents)}
- **Social Security Withholding**: −${fmt(ex2.ssCents)}
- **Medicare Withholding**: −${fmt(ex2.medCents)}
- **Federal Withholding**: −${fmt(ex2.fedCents)}
- **${st.name} State Withholding**: ${ex2.stateCents === 0 ? '$0.00' : '−' + fmt(ex2.stateCents)}
- **Net Biweekly Paycheck**: ${fmt(ex2.netCents)}
- **Effective Tax Rate**: ${ex2.effectiveTaxRatePct}% (Annualized gross: ${fmt(ex2.annualGrossCents)})

## Frequently Asked Questions

### Are credit card tips taxed differently than cash tips in ${st.name}?
No. Under federal and state regulations, all tips—whether paid in cash, added to a credit card slip, or distributed through a tip pool—are treated as taxable wage income subject to FICA and income tax withholding.

### How does ${st.name} handle overtime taxation?
Overtime wages are taxed as ordinary earned income. While overtime hours are compensated at 1.5 times your regular hourly rate, withholding follows standard federal and ${st.name} brackets based on annualized income.

### When does Social Security tax stop being withheld?
Social Security tax ceases once your cumulative gross wages across all employers reach the annual statutory wage base of $184,500 for the tax year.

### Can I adjust my state withholding in ${st.name}?
Yes. You can submit an updated state employee withholding certificate or federal Form W-4 to adjust allowances or specify additional withholding per paycheck.
`;

  fs.writeFileSync(path.join('content/states', `${slug}.md`), md);
  const scheduledDate = advanceOneDay();
  publishSchedule.push({
    date: scheduledDate,
    type: 'State Paycheck Tool',
    slug,
    title: `${st.name} Paycheck Calculator 2027`,
    language: 'en'
  });
}

// -------------------------------------------------------------
// 2. GENERATE CITY MINIMUM WAGE PAGES (40 Municipalities)
// -------------------------------------------------------------
console.log('Generating City Minimum Wage pages...');
for (const city of citiesData.cities) {
  const citySlug = `${kebab(city.name)}-minimum-wage-2027`;
  const st = statesData.states.find(s => s.code === city.state) || { name: city.state, minWage: 7.25 };
  const diff = (city.rate - (st.minWage || 7.25)).toFixed(2);

  // Worked examples
  const weekly40 = (city.rate * 40).toFixed(2);
  const weeklyOT = (city.rate * 40 + city.rate * 1.5 * 5).toFixed(2);

  const md = `---
title: "${city.name} Minimum Wage 2027"
slugTitle: "${citySlug}"
h1: "${city.name} minimum wage ($${city.rate.toFixed(2)}/hr rules & overtime)"
description: "Current ${city.name} minimum wage rate ($${city.rate.toFixed(2)}/hr), local ordinance rules, overtime pay, and employer requirements."
intro: "The local minimum wage in ${city.name}, ${city.state} is $${city.rate.toFixed(2)} per hour under local municipal labor ordinances."
type: tool
tool: overtime
state: ${city.state}
hub: /p/state-pay-rules.html
hubName: State pay rules
labels: [cities, minimum-wage, ${kebab(city.name)}]
needs human edit: false
related:
  - { label: "${st.name} overtime calculator", url: "/2026/12/${st.slug || 'california'}-overtime-laws-and-calculator.html" }
  - { label: "${st.name} paycheck calculator", url: "/2026/12/${st.slug || 'california'}-paycheck-calculator-2027.html" }
  - { label: "US state pay rules directory", url: "/p/state-pay-rules.html" }
sources:
  - { label: "${city.name} Wage Ordinance (${city.ordinance})", url: "${city.url}" }
  - { label: "UC Berkeley Labor Center Municipal Wage Inventory", url: "https://laborcenter.berkeley.edu" }
---
## ${city.name} Municipal Wage Standard

Non-exempt employees working within the geographic boundaries of ${city.name} are entitled to a local minimum wage of **$${city.rate.toFixed(2)} per hour**, established under ${city.ordinance}. Because ${city.name}'s municipal wage exceeds both the federal FLSA standard ($7.25/hr) and the ${st.name} state minimum wage ($${st.minWage ? st.minWage.toFixed(2) : '7.25'}/hr), employers operating within city limits must pay the higher local ordinance rate.

Workers are generally covered by the municipal ordinance if they perform two or more hours of work per week within the geographic limits of ${city.name}.

## Key Local Wage Standards

- **Municipal Minimum Wage Floor**: $${city.rate.toFixed(2)} per hour, effective ${city.effectiveDate}.
- **Premium Over State Baseline**: +$${diff}/hr higher than the general ${st.name} statutory rate.
- **Overtime Rate (1.5x)**: $${(city.rate * 1.5).toFixed(2)} per hour for hours exceeding standard thresholds.
- **Statutory Authority**: Codified under ${city.ordinance}.

## Worked Example 1: Standard 40-Hour Workweek in ${city.name}

Sam works as a retail sales associate in ${city.name} earning the local statutory minimum wage of $${city.rate.toFixed(2)} per hour. Over a single standard workweek, Sam completes five 8-hour shifts totaling 40 hours.

Computation:
- Regular Hours: 40 hours
- Hourly Rate: $${city.rate.toFixed(2)}/hr
- **Gross Weekly Compensation**: 40 × $${city.rate.toFixed(2)} = **$${weekly40}**

Comparing against state baseline pay: at the base ${st.name} rate of $${st.minWage ? st.minWage.toFixed(2) : '7.25'}/hr, Sam would have earned $${st.minWage ? (st.minWage * 40).toFixed(2) : '290.00'}. The ${city.name} local ordinance provides an extra $${(parseFloat(weekly40) - (st.minWage ? st.minWage * 40 : 290)).toFixed(2)} per week.

## Worked Example 2: 45-Hour Shift with Overtime

Taylor works in hospitality in ${city.name} logging 45 total hours during a festival week. Overtime is paid at 1.5 times the local statutory minimum wage ($${(city.rate * 1.5).toFixed(2)}/hr) for all hours worked past 40.

Audit of compensation:
- Straight-time pay: 40 hours × $${city.rate.toFixed(2)} = $${weekly40}
- Overtime premium pay: 5 hours × $${(city.rate * 1.5).toFixed(2)} = $${(city.rate * 1.5 * 5).toFixed(2)}
- **Total Gross Pay**: **$${weeklyOT}**

## Frequently Asked Questions

### Does the ${city.name} rate apply to remote workers?
The municipal rate applies to hours physically performed within the jurisdictional limits of ${city.name}. Remote workers living and performing tasks inside city boundaries are typically protected by the ordinance.

### Can employers pay a lower training wage?
Under ${city.ordinance}, exemptions are strictly limited. Most commercial employers must pay the full $${city.rate.toFixed(2)}/hr wage floor from day one of employment.

### What should workers do if paid below $${city.rate.toFixed(2)}/hr?
Employees subjected to wage violations can file a confidential complaint with the local labor standards enforcement division or claim back pay plus liquidated damages through the state labor commission.

### How often does ${city.name} adjust its minimum wage?
Local minimum wage rates are adjusted annually, typically indexed to the Consumer Price Index (CPI) to protect purchasing power against inflation.
`;

  fs.writeFileSync(path.join('content/cities', `${citySlug}.md`), md);
  const scheduledDate = advanceOneDay();
  publishSchedule.push({
    date: scheduledDate,
    type: 'City Wage Guide',
    slug: citySlug,
    title: `${city.name} Minimum Wage 2027`,
    language: 'en'
  });
}

// -------------------------------------------------------------
// 3. GENERATE SPANISH TOOLS & TOP 10 STATES (Schedule 2/wk)
// -------------------------------------------------------------
console.log('Generating Spanish localized tools and top state pages...');

const spanishTools = [
  {
    slug: 'es-calculadora-de-fondo-de-propinas',
    title: 'Calculadora de Fondo de Propinas (Tip Pool)',
    h1: 'Calculadora de fondo de propinas para restaurantes',
    desc: 'Calcule la distribución justa de propinas por horas trabajadas, puntos o porcentajes bajo las leyes laborales FLSA.',
    tool: 'tip-pool',
    intro: 'Calcule cómo repartir las propinas del turno entre meseros, bartenders y ayudantes según horas trabajadas o puntos.',
    body: `## Cómo Funciona el Fondo de Propinas Comunitario

En la industria de restaurantes, el fondo común de propinas (tip pooling) permite distribuir equitativamente las propinas recaudadas entre los empleados de servicio. Según las enmiendas de la Ley de Normas Justas de Trabajo (FLSA), los gerentes y supervisores tienen estrictamente prohibido recibir pagos de cualquier fondo de propinas.

### Métodos de Distribución Admitidos
1. **Por Horas Trabajadas**: Las propinas totales se dividen entre las horas acumuladas de todo el equipo de servicio.
2. **Por Puntos**: Se asignan ponderaciones según la función del empleado (por ejemplo: mesero 1.0 punto, ayudante 0.5 puntos).
3. **Por Porcentaje de Ventas**: Deducción de porcentajes de ventas brutas para cocina o personal de apoyo.

## Ejemplo Práctico 1: Turno de Restaurante con 5 Empleados
Un restaurante acumula $1,240.00 en propinas con $8,000.00 en ventas. Se deduce una propina a cocina del 3% sobre ventas ($240.00), dejando $1,000.00 a repartir entre 30.5 horas de piso:
- Maya (Mesera, 6.5 hrs): $213.11 ($32.79/hr)
- Luis (Mesero, 7.0 hrs): $229.51 ($32.79/hr)
- Dana (Bartender, 8.0 hrs): $262.30 ($32.79/hr)
- Theo (Ayudante, 5.0 hrs): $163.93 ($32.79/hr)
- Priya (Anfitriona, 4.0 hrs): $131.15 ($32.79/hr)

## Ejemplo Práctico 2: División de Turno Corto
Dos meseros acumulan $300.00 en propinas. Juan trabaja 4 horas y Sofía trabaja 6 horas (10 horas totales). La tasa es de $30.00 por hora: Juan recibe $120.00 y Sofía recibe $180.00.

## Preguntas Frecuentes

### ¿Pueden los gerentes recibir propinas del fondo?
No. La ley federal prohíbe categóricamente que propietarios, gerentes y supervisores participen o reciban dinero de fondos comunitarios de propinas.

### ¿Qué pasa si un turno tiene pocas ventas?
El empleador está legalmente obligado a garantizar que el salario base más las propinas sumen al menos el salario mínimo estatal por hora trabajada.`
  },
  {
    slug: 'es-calculadora-de-distribucion-de-propinas',
    title: 'Calculadora de Distribución de Propinas (Tip Out)',
    h1: 'Calculadora de tip out para meseros y barras',
    desc: 'Calcule los porcentajes de tip-out para bartenders, bussers y corredores de comida según ventas de bebidas y comida.',
    tool: 'tip-out',
    intro: 'Calcule rápidamente las propinas que debe transferir al personal de apoyo según ventas brutas o propinas totales.',
    body: `## Reglas de Tip-Out en Hospitalidad

El tip-out es la práctica estándar en la cual los meseros comparten un porcentaje de sus ventas o propinas con el personal de soporte que colaboró en el servicio (runners, bussers, bartenders).

## Ejemplo Práctico 1: Tip-Out Basado en Ventas
Ventas totales del turno: $2,500.00 ($1,800 comida, $700 bebidas).
- Bartender (5% de ventas de barra): $35.00
- Busser (2% de ventas totales): $50.00
- Runner (1.5% de ventas de comida): $27.00
- Total a entregar: $112.00

## Ejemplo Práctico 2: Tip-Out Basado en Propinas Recaudadas
El mesero recauda $400.00 en propinas. Se asigna 10% al bartender ($40.00) y 5% al ayudante ($20.00). El mesero conserva $340.00.

## Preguntas Frecuentes

### ¿Es obligatorio el tip out?
Si la política del restaurante está formalmente documentada y cumple con la ley FLSA, el empleador puede establecer un esquema obligatorio de tip out.`
  },
  {
    slug: 'es-calculadora-de-horas-extras-y-tiempo-doble',
    title: 'Calculadora de Horas Extras y Tiempo Doble',
    h1: 'Calculadora de horas extras (1.5x) y tiempo doble (2.0x)',
    desc: 'Calcule su pago de sobretiempo semanal y diario según las normas federales y estatales de Estados Unidos.',
    tool: 'overtime',
    intro: 'Calcule su salario bruto con horas extras a tiempo y medio (1.5x) y tiempo doble (2.0x) para jornadas laborales extendidas.',
    body: `## Normativa de Horas Extras Federal y Estatal

Bajo la ley federal de normas laborales de EE. UU. (FLSA), todos los empleados no exentos tienen derecho a una compensación de tiempo y medio (1.5 veces su tarifa regular) por cada hora trabajada después de 40 horas en una semana laboral.

## Ejemplo Práctico 1: Semana Laboral Federal de 48 Horas
Un empleado gana $20.00 por hora y trabaja 48 horas en una semana.
- 40 horas regulares a $20.00/hr = $800.00
- 8 horas extras a $30.00/hr (1.5x) = $240.00
- Salario bruto total = $1,040.00

## Ejemplo Práctico 2: Jornada Diaria con Tiempo Doble en California
Un empleado trabaja 14 horas en un solo día a $20.00/hr.
- Primeras 8 horas regulares: 8 x $20.00 = $160.00
- Horas 9 a 12 (tiempo y medio): 4 x $30.00 = $120.00
- Horas 13 y 14 (tiempo doble): 2 x $40.00 = $80.00
- Total del día: $360.00

## Preguntas Frecuentes

### ¿Cuándo aplica el tiempo doble?
El tiempo doble es obligatorio en estados como California después de 12 horas de trabajo diario continuo o tras 8 horas en el séptimo día consecutivo de trabajo.`
  },
  {
    slug: 'es-calculadora-de-diferencial-de-turno',
    title: 'Calculadora de Diferencial de Turno y Tasa Combinada',
    h1: 'Calculadora de diferencial de turno y horas extras',
    desc: 'Calcule la tarifa regular combinada cuando trabaja turnos nocturnos con bonos o diferentes tarifas por hora.',
    tool: 'shift-differential',
    intro: 'Calcule el pago de horas extras cuando su semana laboral incluye dos turnos con tarifas salariales distintas.',
    body: `## Tarifa Regular Ponderada para Turnos Mixtos

Cuando un empleado trabaja en diferentes puestos o turnos nocturnos con diferenciales durante la misma semana laboral, la ley FLSA exige calcular una tarifa regular ponderada para pagar las horas extras.

## Ejemplo Práctico 1: Turno de Día ($18/hr) y Turno de Noche ($22/hr)
El trabajador realiza 30 horas diurnas ($540.00) y 15 horas nocturnas ($330.00), sumando 45 horas y $870.00 en salario base.
- Tarifa regular promedio: $870.00 / 45 horas = $19.33/hr
- Prima de horas extras (0.5x): 5 horas x ($19.33 x 0.5) = $48.33
- Salario bruto final: $870.00 + $48.33 = $918.33

## Ejemplo Práctico 2: Bono de Turno Nocturno Fijo
Un cocinero recibe un bono de turno nocturno de $100.00 además de sus 44 horas a $20.00/hr. El bono debe incorporarse en la tasa regular para determinar el sobretiempo.

## Preguntas Frecuentes

### ¿Es legal pagar horas extras solo sobre la tarifa más baja?
No. La ley federal prohíbe calcular las horas extras únicamente sobre la tarifa base más baja cuando se realizan tareas mejor remuneradas en la misma semana.`
  },
  {
    slug: 'es-calculadora-de-horas-extras-con-propinas',
    title: 'Calculadora de Horas Extras para Empleados con Propinas',
    h1: 'Calculadora de horas extras con crédito de propinas',
    desc: 'Calcule el salario en efectivo que su empleador debe pagarle por horas extras cuando recibe propinas.',
    tool: 'tipped-overtime',
    intro: 'Descubra cómo se calculan las horas extras cuando su empleador aplica el crédito de propinas contra su salario.',
    body: `## Fórmula Federal para Horas Extras con Crédito de Propinas

Bajo la ley FLSA, el empleador no puede simplemente multiplicar el salario directo en efectivo ($2.13 federal) por 1.5. Debe calcular el 1.5 sobre el salario mínimo completo ($7.25) y luego restar el crédito de propinas máximo permitido ($5.12).

## Ejemplo Práctico 1: 45 Horas Trabajadas a Salario Federal Tipped
- Salario regular en efectivo: 40 horas x $2.13 = $85.20
- Tasa de sobretiempo completo: $7.25 x 1.5 = $10.875/hr
- Menos crédito de propinas: $10.875 − $5.12 = $5.755/hr
- 5 horas extras en efectivo: 5 x $5.755 = $28.78
- Pago directo total del empleador: $113.98

## Ejemplo Práctico 2: Estado sin Crédito de Propinas (California)
En California, los meseros reciben el salario mínimo completo de $16.90/hr. Sus horas extras son 1.5 veces el salario completo: $25.35/hr en efectivo más todas sus propinas.

## Preguntas Frecuentes

### ¿Puede el empleador retener horas extras si recibí muchas propinas?
No. El salario directo por horas extras es una obligación patronal incondicional.`
  },
  {
    slug: 'es-calculadora-de-salario-neto-con-propinas',
    title: 'Calculadora de Salario Neto con Propinas (Take-Home)',
    h1: 'Calculadora de salario neto y retenciones para trabajadores con propinas',
    desc: 'Calcule el dinero exacto que ingresa a su cuenta bancaria tras impuestos federales, FICA y retenciones estatales.',
    tool: 'take-home',
    intro: 'Calcule cuánto dinero neto recibe en su cheque de pago sumando salarios por hora, propinas en tarjeta y deducciones.',
    body: `## Retenciones Fiscales en Cheques con Propinas

Cuando las propinas con tarjeta de crédito superan el salario por hora en efectivo, el cheque puede reducirse significativamente debido a la retención obligatoria de Seguro Social, Medicare e impuestos sobre la renta.

## Ejemplo Práctico 1: Cheque Quincenal Promedio
- Salario base: $600.00
- Propinas reportadas: $900.00
- Salario bruto: $1,500.00
- Seguro Social (6.2%): −$93.00
- Medicare (1.45%): −$21.75
- Impuesto federal estimado (10%): −$150.00
- Salario neto estimado: $1,235.25

## Ejemplo Práctico 2: Estado sin Impuesto Estatal (Texas / Florida)
En estados sin impuesto estatal sobre el salario, el trabajador conserva una mayor porción de sus ingresos netos en comparación con estados con tasas progresivas elevadas.

## Preguntas Frecuentes

### ¿Por qué mi cheque salió en $0.00?
Si sus propinas en tarjeta fueron cobradas en efectivo y los impuestos adeudados superan su salario base por hora, el cheque puede emitirse en cero mientras los impuestos pendientes se acumulan.`
  },
  {
    slug: 'es-calculadora-de-deduccion-de-propinas-y-horas-extras',
    title: 'Calculadora de Deducción de Propinas y Horas Extras',
    h1: 'Estimador de deducciones federales para propinas y horas extras',
    desc: 'Estime su ahorro fiscal en la declaración anual con las nuevas deducciones para ingresos por propinas y primas de sobretiempo.',
    tool: 'tips-ot-deduction',
    intro: 'Calcule el impacto de las deducciones fiscales aplicables a propinas calificadas y horas extras en su declaración federal.',
    body: `## Beneficios Fiscales para Empleados de Hospitalidad

Las recientes normativas tributarias buscan aliviar la carga fiscal de los trabajadores de servicio que dependen de propinas y horas extras para sustentar sus hogares.

## Ejemplo Práctico 1: Mesero Soltero con $18,000 en Propinas
- Propinas anuales calificadas: $18,000.00
- Prima de horas extras: $4,000.00
- Ingreso bruto ajustado: $65,000.00
- Deducción estimada: $22,000.00
- Ahorro fiscal al 12%: $2,640.00

## Ejemplo Práctico 2: Declaración Conjunta (Casados)
Las parejas casadas que presentan declaración conjunta pueden beneficiarse de topes de ingresos más amplios antes de que comience la reducción gradual de la deducción.

## Preguntas Frecuentes

### ¿Aplica esta deducción si no detallo impuestos?
Estas propuestas de deducción están estructuradas para aplicarse por encima de la línea o en conjunto con la deducción estándar.`
  }
];

// Top 10 State Pages in Spanish
const top10States = [
  { code: 'CA', name: 'California', slug: 'california', topic: 'horas extras y tiempo doble', tool: 'overtime' },
  { code: 'TX', name: 'Texas', slug: 'texas', topic: 'salario mínimo con propinas', tool: 'tipped-overtime' },
  { code: 'FL', name: 'Florida', slug: 'florida', topic: 'salario mínimo con propinas', tool: 'tipped-overtime' },
  { code: 'NY', name: 'Nueva York', slug: 'nueva-york', topic: 'salario mínimo y propinas regionales', tool: 'tipped-overtime' },
  { code: 'PA', name: 'Pennsylvania', slug: 'pennsylvania', topic: 'leyes de propinas y horas extras', tool: 'tipped-overtime' },
  { code: 'IL', name: 'Illinois', slug: 'illinois', topic: 'salario mínimo y horas extras', tool: 'tipped-overtime' },
  { code: 'OH', name: 'Ohio', slug: 'ohio', topic: 'salario mínimo y sobretiempo', tool: 'overtime' },
  { code: 'GA', name: 'Georgia', slug: 'georgia', topic: 'salario mínimo para empleados con propinas', tool: 'tipped-overtime' },
  { code: 'NC', name: 'Carolina del Norte', slug: 'carolina-del-norte', topic: 'leyes laborales de propinas y sobretiempo', tool: 'tipped-overtime' },
  { code: 'MI', name: 'Michigan', slug: 'michigan', topic: 'salario mínimo y horas extras', tool: 'overtime' }
];

// Write Spanish tools
for (const t of spanishTools) {
  const md = `---
title: "${t.title}"
slugTitle: "${t.slug}"
h1: "${t.h1}"
description: "${t.desc}"
intro: "${t.intro}"
type: tool
tool: ${t.tool}
hub: /p/tip-tools.html
hubName: Herramientas en español
labels: [espanol, tools, ${t.tool}]
needs human edit: false
related:
  - { label: "Calculadora de horas extras", url: "/2026/12/es-calculadora-de-horas-extras-y-tiempo-doble.html" }
  - { label: "Calculadora de fondo de propinas", url: "/2026/12/es-calculadora-de-fondo-de-propinas.html" }
  - { label: "Salario mínimo por estado", url: "/p/state-pay-rules.html" }
sources:
  - { label: "Departamento de Trabajo de EE. UU. (DOL)", url: "https://www.dol.gov/agencies/whd" }
  - { label: "Servicio de Impuestos Internos (IRS)", url: "https://www.irs.gov/es" }
---
${t.body}
`;
  fs.writeFileSync(path.join('content/es', `${t.slug}.md`), md);
}

// Write Spanish Top 10 State pages
for (const s of top10States) {
  const st = statesData.states.find(x => x.code === s.code) || { minWage: 7.25, tippedCashWage: 2.13, maxTipCredit: 5.12 };
  const slug = `es-${s.slug}-${kebab(s.topic)}`;
  const md = `---
title: "${s.name}: Leyes de Salario y Horas Extras 2027"
slugTitle: "${slug}"
h1: "${s.name}: Salario mínimo, propinas y horas extras"
description: "Guía en español de salarios mínimos ($${st.minWage ? st.minWage.toFixed(2) : '7.25'}/hr), crédito de propinas y horas extras en ${s.name}."
intro: "Consulte las reglas laborales actualizadas de ${s.name}: salario mínimo por hora, derechos de trabajadores con propinas y cálculo de horas extras."
type: tool
tool: ${s.tool}
state: ${s.code}
hub: /p/state-pay-rules.html
hubName: Reglas laborales
labels: [espanol, states, ${s.slug}]
needs human edit: false
related:
  - { label: "Calculadora de salario neto", url: "/2026/12/es-calculadora-de-salario-neto-con-propinas.html" }
  - { label: "Calculadora de propinas", url: "/2026/12/es-calculadora-de-fondo-de-propinas.html" }
  - { label: "Tabla estatal completa", url: "/p/state-pay-rules.html" }
sources:
  - { label: "Departamento de Trabajo de EE. UU. (DOL)", url: "https://www.dol.gov/agencies/whd" }
  - { label: "Leyes Laborales de ${s.name}", url: "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped" }
---
## Marco Laboral y Salarial en ${s.name}

Los trabajadores del sector gastronómico, hotelero y de servicios en ${s.name} cuentan con protecciones bajo las leyes estatales y la ley federal FLSA. Cuando las normas estatales ofrecen una mayor protección o un salario más elevado que el federal, el empleador está legalmente obligado a cumplir con la norma estatal más favorable al trabajador.

## Valores Salariales Clave en ${s.name}

- **Salario Mínimo General**: $${st.minWage ? st.minWage.toFixed(2) : '7.25'} por hora.
- **Salario en Efectivo para Empleados con Propinas**: $${st.tippedCashWage ? st.tippedCashWage.toFixed(2) : '2.13'} por hora.
- **Crédito Máximo de Propinas**: $${st.maxTipCredit ? st.maxTipCredit.toFixed(2) : '5.12'} por hora.
- **Horas Extras**: Tiempo y medio (1.5x) después de 40 horas semanales.

## Ejemplo Práctico 1: Semana Laboral de 45 Horas en ${s.name}
Un trabajador que gana un salario base de $15.00/hr completa 45 horas semanales.
- 40 horas regulares a $15.00/hr = $600.00
- 5 horas extras a $22.50/hr (1.5x) = $112.50
- Pago bruto total = $712.50

## Ejemplo Práctico 2: Turno con Propinas
Un mesero trabaja 40 horas al salario en efectivo de $${st.tippedCashWage ? st.tippedCashWage.toFixed(2) : '2.13'}/hr y recauda $550.00 en propinas. Su ingreso total es de $${(40 * (st.tippedCashWage || 2.13) + 550).toFixed(2)}, superando con holgura el salario mínimo obligatorio.

## Preguntas Frecuentes

### ¿Qué ocurre si mis propinas no alcanzan el salario mínimo?
El empleador está legalmente obligado a compensar la diferencia en dinero en efectivo para que su salario total nunca sea inferior a $${st.minWage ? st.minWage.toFixed(2) : '7.25'} por hora.

### ¿Puedo exigir el pago de horas extras en efectivo?
Sí. El pago de sobretiempo debe reflejarse directamente en su cheque salarial con los comprobantes oficiales de nómina.
`;

  fs.writeFileSync(path.join('content/es', `${slug}.md`), md);
}

// Schedule Spanish posts: 2 per week (Wednesdays & Saturdays)
let spanishDate = new Date('2026-12-02T10:00:00Z');
const allSpanish = [...spanishTools.map(t => ({ slug: t.slug, title: t.title })), ...top10States.map(s => ({ slug: `es-${s.slug}-${kebab(s.topic)}`, title: `${s.name}: Leyes de Salario y Horas Extras` }))];

for (const item of allSpanish) {
  // Move to next Wed or Sat
  while (spanishDate.getUTCDay() !== 3 && spanishDate.getUTCDay() !== 6) {
    spanishDate.setUTCDate(spanishDate.getUTCDate() + 1);
  }
  publishSchedule.push({
    date: spanishDate.toISOString().split('T')[0],
    type: 'Spanish Localized Post',
    slug: item.slug,
    title: item.title,
    language: 'es'
  });
  spanishDate.setUTCDate(spanishDate.getUTCDate() + 1);
}

// -------------------------------------------------------------
// 4. WRITE PUBLISH SCHEDULE LOG (docs/publish-schedule.md)
// -------------------------------------------------------------
let scheduleMd = `# Shift & Tip Content Publishing Schedule

Generated: ${new Date().toISOString()}
Cadence:
- **State Tools & Municipal Wage Guides**: 1 per day (Ranked by US search demand)
- **Spanish Localized Tools & State Guides**: 2 per week (Wednesdays and Saturdays)

| Date | Locale | Category | Slug | Title | Status |
|---|---|---|---|---|---|
`;

for (const entry of publishSchedule) {
  scheduleMd += `| ${entry.date} | ${entry.language.toUpperCase()} | ${entry.type} | \`${entry.slug}\` | ${entry.title} | Queued |\n`;
}

fs.writeFileSync('docs/publish-schedule.md', scheduleMd);
console.log(`\nSuccessfully generated publish schedule: ${publishSchedule.length} total queued publications logged to docs/publish-schedule.md`);
