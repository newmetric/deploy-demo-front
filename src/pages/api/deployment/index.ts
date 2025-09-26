import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

export type DeployedProject = {
    id: string;
    user_id: string;
    repo_url: string;
    status: string;
    created_at: Date;
    updated_at: Date;
};

// Next.js의 개발 환경에서는 파일이 변경될 때마다 모듈이 다시 로드될 수 있으므로,
// 전역(global) 객체에 풀을 저장하여 연결이 중복 생성되는 것을 방지합니다.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const demoBackendUrl = process.env.DEMO_BACKEND_URL || 'http://localhost:8080';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET: 현재 사용자의 모든 프로젝트 목록 조회
  if (req.method === 'GET') {
    const { userId } = req.query;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
      // 'projects' 테이블이 있고 'user_id' 컬럼이 있다고 가정합니다.
      const { rows } = await pool.query('SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // POST: 새로운 프로젝트 생성
  if (req.method === 'POST') {
    const { userId, repoUrl } = req.body;

    if (!userId || !repoUrl) {
      return res.status(400).json({ message: 'User ID and Repository URL are required.' });
    }

    try {
      const runInsertQuery = function() {
        return new Promise(async (resolve, reject) => {
          const { rows } = await pool.query(
            'INSERT INTO projects (user_id, repo_url, status) VALUES ($1, $2, $3) RETURNING *',
              [userId, repoUrl, 'queued'] // 초기 상태를 'queued'로 설정
          );
          resolve(rows[0]);
        });
      };

      const postCreateContainerCall = function() {
        return new Promise(async (resolve, reject) => {
          const response = await fetch(`${demoBackendUrl}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId, repo_url: repoUrl }),
          });

          if (!response.ok) {
            return reject(new Error(`Demo backend error: ${response.statusText}`));
          }

          const data = await response.json();
          resolve(data);
        });
      }

      const [_, rows] = await Promise.all([
        postCreateContainerCall(),
        runInsertQuery()
      ]);

      // 'projects' 테이블에 새로운 레코드를 삽입합니다.
      
      return res.status(201).json(rows);
    } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // 허용되지 않은 메소드 처리
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}