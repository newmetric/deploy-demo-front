import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // URL에서 [id] 값을 가져옵니다.

  // GET: 특정 ID의 프로젝트 조회
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Project not found.' });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // PUT: 특정 ID의 프로젝트 상태 업데이트 (예시)
  if (req.method === 'PUT') {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }
    try {
      const { rows } = await pool.query(
        'UPDATE projects SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Project not found.' });
      }
      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // DELETE: 특정 ID의 프로젝트 삭제
  if (req.method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Project not found.' });
      }
      return res.status(204).end(); // No Content
    } catch (error) {
      console.error('Database Error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // 허용되지 않은 메소드 처리
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}