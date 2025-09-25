import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ProjectDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [projectStatus, setProjectStatus] = useState(null as string | null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let id = router.query.id as string;
        if (id) {
            const fetchProjectStatus = async () => {
                try {
                    const response = await fetch(`/api/deployment/${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch project status');
                    }
                    const data = await response.json();
                    console.log(data.status);
                    setProjectStatus(data.status);
                } catch (error) {
                    console.error("Failed to fetch project status:", error);
                    // Handle error appropriately in the UI
                    setProjectStatus('Error fetching status');
                }
                setLoading(false);
            };
            fetchProjectStatus();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Project Detail for {id}</h1>
            <p>Status: {projectStatus}</p>
            {/* Add RPC call functionality here */}
        </div>
    );
};

export default ProjectDetail;