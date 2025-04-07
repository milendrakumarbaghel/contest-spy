import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

interface RunOptions {
  code: string;
  language: string;
  input: string;
}

const dockerImages: Record<string, string> = {
  cpp: 'gcc:latest',
  python: 'python:3.11-slim',
  javascript: 'node:18-slim',
  java: 'openjdk:17-slim',
};

export const runCodeInDocker = async ({ code, language, input }: RunOptions): Promise<{ stdout: string; stderr: string }> => {
  const id = uuidv4();
  const folder = path.join('/tmp', id);
  await fs.mkdir(folder, { recursive: true });

  let filename: string;
  let runCmd: string;

  switch (language) {
    case 'cpp':
      filename = 'main.cpp';
      await fs.writeFile(`${folder}/${filename}`, code);
      runCmd = `g++ main.cpp -o main && echo "${input}" | ./main`;
      break;
    case 'python':
      filename = 'main.py';
      await fs.writeFile(`${folder}/${filename}`, code);
      runCmd = `echo "${input}" | python3 main.py`;
      break;
    case 'javascript':
      filename = 'main.js';
      await fs.writeFile(`${folder}/${filename}`, code);
      runCmd = `echo "${input}" | node main.js`;
      break;
    case 'java':
      filename = 'Main.java';
      await fs.writeFile(`${folder}/${filename}`, code);
      runCmd = `javac Main.java && echo "${input}" | java Main`;
      break;
    default:
      throw new Error('Unsupported language');
  }

  const dockerCommand = `docker run --rm \
    --memory=128m \
    --cpus=0.5 \
    --network=none \
    --pids-limit=64 \
    -v ${folder}:/app \
    -w /app \
    ${dockerImages[language]} \
    sh -c '${runCmd}'`;

  return new Promise((resolve) => {
    exec(dockerCommand, { timeout: 5000 }, (error, stdout, stderr) => {
      const isTimeout = error?.message?.includes('timed out');
      resolve({
        stdout: stdout?.trim() || '',
        stderr: isTimeout ? 'Execution timed out' : stderr?.trim() || ''
      });
    });
  });
};
