-- 만약 테이블이 이미 존재한다면 삭제합니다. (개발 환경 초기화용)
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;

-- 'users' 테이블을 생성합니다.
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS '애플리케이션 사용자 정보';
COMMENT ON COLUMN users.id IS '사용자 ID (로그인 시 사용)';
COMMENT ON COLUMN users.password IS '사용자 비밀번호 (실제 프로덕션에서는 해시하여 저장해야 합니다)';

-- 'testuser'를 생성합니다.
-- 실제 애플리케이션에서는 절대 비밀번호를 평문으로 저장하면 안 됩니다.
INSERT INTO users (id, password) VALUES ('testuser', 'password123');

-- 'projects' 테이블을 생성합니다.
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    repo_url VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 테이블에 대한 설명을 추가합니다.
COMMENT ON TABLE projects IS '사용자가 배포한 프로젝트 목록';
COMMENT ON COLUMN projects.id IS '프로젝트 고유 ID';
COMMENT ON COLUMN projects.user_id IS '프로젝트를 소유한 사용자 ID (users 테이블 참조)';
COMMENT ON COLUMN projects.repo_url IS '배포된 GitHub 레포지토리 URL';
COMMENT ON COLUMN projects.status IS '배포 상태 (예: queued, in_progress, success, failed)';
COMMENT ON COLUMN projects.created_at IS '프로젝트 생성 시각';

-- 'testuser'를 위한 샘플 데이터를 추가합니다.
-- INSERT INTO projects (user_id, repo_url, status) VALUES
-- ('testuser', 'https://github.com/testuser/project-alpha', 'success'),
-- ('testuser', 'https://github.com/testuser/project-beta', 'in_progress'),
-- ('testuser', 'https://github.com/testuser/project-gamma', 'failed');

-- 데이터가 잘 들어갔는지 확인합니다.
SELECT * FROM users;
-- SELECT * FROM projects;