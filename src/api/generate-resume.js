import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  const { personal, sections } = req.body;
  const prompt = `Generate an ATS-friendly resume using:\nPersonal: ${JSON.stringify(personal)}\nExperience: ${JSON.stringify(sections.experience.map(e=>e.value))}\nEducation: ${JSON.stringify(sections.education.map(e=>e.value))}\nSkills: ${JSON.stringify(sections.skills.map(e=>e.value))}\nProjects: ${JSON.stringify(sections.projects.map(e=>e.value))}`;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 700
  });
  res.status(200).json({ resumeText: response.data.choices[0].text });
}
