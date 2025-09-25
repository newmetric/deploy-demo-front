import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const MainPage = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 userId를 확인하여 로그인 상태를 체크합니다.
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // userId가 없으면 로그인 페이지로 리디렉션합니다.
      router.push('/login');
    }
  }, [router]);


  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();

    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)(\.git)?/;
    const match = repoUrl.match(urlPattern);

    if (!match) {
      alert('Invalid GitHub repository URL format.');
      return;
    }

    const owner = match[1];
    const repo = match[2];

    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (response.status === 404) {
        alert('Repository not found. Please check if the repository is public.');
        return;
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const repoData = await response.json();

      if (repoData.private) {
        alert('Only public repositories can be deployed.');
        return;
      }

      const response2 = await fetch('/api/deployment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: localStorage.getItem('userId'),
            repoUrl: repoUrl,
        }),
      });

      if (!response2.ok) {
        throw new Error(`DB error: ${response2.statusText}`);
      }
      

      // 임시로 배포가 시작되었다는 알림을 띄우고,
      // 배포 목록 페이지로 이동합니다.
      alert(`'${repoUrl}' 배포가 시작되었습니다.`);
      router.push('/deployments');
    } catch (error) {
      console.error('Failed to verify repository:', error);
      if ((error as Error).message.includes('DB error')) {
        alert('This repository has already been deployed.');
      } else {
        alert('Failed to verify repository. Please check the URL and try again.');
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Deploy New Project</h1>
        <Link href="/deployments" style={{ textDecoration: 'underline', color: 'blue' }}>
          Go to Deployments
        </Link>
      </header>
      <main>
        <form onSubmit={handleDeploy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="repoUrl">GitHub Repository URL:</label>
            <input
              id="repoUrl"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repository"
              required
              style={{ padding: '0.5rem', minWidth: '400px' }}
            />
          </div>
          <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Deploy
          </button>
        </form>
      </main>
    </div>
  );
};

export default MainPage;