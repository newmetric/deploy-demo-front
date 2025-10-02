import { useEffect, useState } from 'react';
import Link from 'next/link';

// DeployedProject 타입을 api 파일에서 가져오는 것은 괜찮습니다.
// 타입은 빌드 시점에 사라지므로 런타임 코드에 영향을 주지 않습니다.
import type { DeployedProject } from '../api/deployment';

const DeploymentsPage = () => {
  const [projects, setProjects] = useState<DeployedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // 로그인 페이지로 리디렉션 또는 다른 처리
      return;
    }

    const fetchProjects = async () => {
      try {
        // fetch를 사용해 API 엔드포인트를 호출합니다.
        const response = await fetch(`/api/deployment?userId=${userId}`);
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDeleteAll = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in');
      return;
    }

    try {
      const response = await fetch(`/api/deployment?userId=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete projects');
      }

      // 삭제 후 프로젝트 목록을 비웁니다.
      setProjects([]);
      alert('All deployments deleted successfully');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Deployments</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`https://l2-demo-${project.id}.think-factory.newmetric.xyz`}>
              {project.repo_url} - <strong>{project.status}</strong>
            </Link>
          </li>
        ))}
      </ul>
      <form onSubmit={handleDeleteAll}>
        <button type="submit">Delete All Deployments</button>
      </form>
    </div>
  );
};

export default DeploymentsPage;