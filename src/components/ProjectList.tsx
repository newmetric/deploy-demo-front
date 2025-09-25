import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState([] as { id: string; repo_url: string }[]);

    useEffect(() => {
        const fetchProjects = async () => {

            const userId = localStorage.getItem('userId');
            if (!userId) {
                //todo: 로그인 페이지로 리디렉션
                const routeModule = useRouter();
                routeModule.push('/login');

                return;
            }

            //TODO: 실제 API 호출로 교체해야 합니다.
            const data = await fetch(`/api/deployment?userId=${userId}`).then(res => res.json());
            setProjects(data);
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h2>Deployed Projects</h2>
            <ul>
                {projects.map((project) => (
                    <li key={project.id}>
                        <Link href={`/deployments/${project.id}`}>
                            {project.repo_url}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;