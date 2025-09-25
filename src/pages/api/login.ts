import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type Data = {
  success: boolean;
  userId?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ success: false, message: 'ID and password are required.' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = rows[0];

    // 사용자가 존재하고 비밀번호가 일치하는지 확인합니다.
    // 실제 프로덕션 환경에서는 bcrypt와 같은 라이브러리를 사용해 해시된 비밀번호를 비교해야 합니다.
    if (user && user.password === password) {
      // 로그인 성공
      res.status(200).json({ success: true, userId: user.id });
    } else {
      // 잘못된 자격 증명
      res.status(401).json({ success: false, message: 'Invalid ID or password.' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}