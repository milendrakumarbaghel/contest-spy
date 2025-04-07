import stringSimilarity from 'string-similarity';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HF_API_URL = 'https://api-inference.huggingface.co/models/Sahithyan/code-bert-similarity';
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY || '';

const headers = {
  Authorization: `Bearer ${HF_TOKEN}`,
  'Content-Type': 'application/json',
};

async function getAISimilarity(code1: string, code2: string): Promise<number> {
  try {
    const response = await axios.post(HF_API_URL, {
      inputs: {
        source_sentence: code1,
        sentence: code2,
      },
    }, { headers });

    return response.data?.score || 0;
  } catch (err) {
    console.error('❌ AI similarity check failed:', err.message);
    return 0;
  }
}

function getStringSimilarity(code1: string, code2: string): number {
  return stringSimilarity.compareTwoStrings(code1, code2); // Returns 0.0 - 1.0
}

export const detectPlagiarismCombined = async (problemId: string) => {
  const submissions = await prisma.submission.findMany({ where: { problemId } });

  for (let i = 0; i < submissions.length; i++) {
    for (let j = i + 1; j < submissions.length; j++) {
      const sub1 = submissions[i];
      const sub2 = submissions[j];

      const aiScore = await getAISimilarity(sub1.code, sub2.code);
      const strScore = getStringSimilarity(sub1.code, sub2.code);

      // We can use a weighted approach or a strict threshold
      const weightedScore = (aiScore * 0.7) + (strScore * 0.3);

      if (weightedScore >= 0.9 || (aiScore >= 0.88 && strScore >= 0.8)) {
        await prisma.submission.update({
          where: { id: sub1.id },
          data: { plagiarized: true },
        });

        await prisma.submission.update({
          where: { id: sub2.id },
          data: { plagiarized: true },
        });

        console.log(`🚨 Plagiarism detected:
  - Submissions: ${sub1.id} & ${sub2.id}
  - AI Score: ${aiScore.toFixed(3)}
  - String Score: ${strScore.toFixed(3)}
  - Combined: ${weightedScore.toFixed(3)}
        `);
      }
    }
  }
};
