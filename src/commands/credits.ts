import { getApi } from '../config';

export async function creditsCommand() {
  const api = getApi();

  try {
    const result = await api.credits();
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
}
