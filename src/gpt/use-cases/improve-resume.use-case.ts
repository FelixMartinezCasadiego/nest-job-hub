import OpenAI from 'openai';

interface ImproveResumeOptions {
  cv: string;
  form: string;
  goal: string;
}

interface ImproveResumeResult {
  improvedCV: string;
  tokensUsed: number;
  model: string;
}

export const improveResumeUseCase = async (
  openai: OpenAI,
  options: ImproveResumeOptions,
): Promise<ImproveResumeResult> => {
  const { cv, form, goal } = options;

  if (!cv?.trim() || !goal?.trim()) {
    throw new Error('El CV y el objetivo son obligatorios');
  }

  const systemPrompt = `
Eres un experto en selección de personal y redacción de CVs.
Tu especialidad es optimizar currículums para maximizar las posibilidades de conseguir entrevistas.
Conoces cómo funcionan los sistemas ATS y qué buscan los reclutadores.
**RESTRICCIÓN: La respuesta final debe estar formateada utilizando Markdown.**
`;

  const userPrompt = `
TAREA:
Reescribe completamente este CV para hacerlo profesional, claro y optimizado para el siguiente objetivo:

OBJETIVO: "${goal}"

INSTRUCCIONES:
✓ Integra información valiosa del formulario adicional
✓ Usa palabras clave relevantes para el objetivo (ATS-friendly)
✓ Destaca logros medibles
✓ Prioriza experiencia relevante
✓ Usa verbos de acción
✓ Mantén formato claro
✓ Elimina redundancias

FORMATO DE SALIDA:
Devuelve SOLO el CV final con estas secciones:
1. Datos de Contacto
2. Resumen Profesional
3. Experiencia Profesional
4. Educación
5. Habilidades Técnicas
6. Idiomas

---
CV ORIGINAL:
${cv}

---
INFORMACIÓN ADICIONAL:
${form || 'No se proporcionó información adicional'}

---
CV OPTIMIZADO:
`;

  try {
    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_output_tokens: 3000,
      temperature: 0.3,
    });

    const text = response.output_text?.trim();

    if (!text) {
      throw new Error('El modelo no devolvió contenido válido');
    }

    return {
      improvedCV: text,
      tokensUsed: response.usage?.total_tokens || 0,
      model: response.model,
    };
  } catch (error) {
    console.error('Error al mejorar el CV:', error);

    if (error instanceof OpenAI.APIError) {
      throw new Error(
        `Error de OpenAI API (${error.status || 'N/A'}): ${error.message}`,
      );
    }

    throw error;
  }
};
