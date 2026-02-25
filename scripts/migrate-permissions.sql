-- 实验室库存管理系统权限迁移脚本
-- 执行此脚本添加用户角色和菌株权限管理功能

-- ============================================
-- 1. 添加用户角色字段
-- ============================================

-- 检查并添加 role 字段
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';
        CREATE INDEX idx_users_role ON users(role);
        RAISE NOTICE 'Added role column to users table';
    ELSE
        RAISE NOTICE 'role column already exists';
    END IF;
END $$;

-- ============================================
-- 2. 创建菌株权限表
-- ============================================

-- 删除旧表（如果存在）以便重新创建
DROP TABLE IF EXISTS strain_permissions;

-- 创建局部管理员权限表
CREATE TABLE strain_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    strain_code VARCHAR(50) NOT NULL REFERENCES strains(strain_code) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT NOW(),
    granted_by INTEGER REFERENCES users(id),
    UNIQUE(user_id, strain_code)
);

-- 创建索引
CREATE INDEX idx_strain_permissions_user ON strain_permissions(user_id);
CREATE INDEX idx_strain_permissions_strain ON strain_permissions(strain_code);

-- ============================================
-- 3. 添加权限变更记录表（可选，用于审计）
-- ============================================

DROP TABLE IF EXISTS permission_audit_log;

CREATE TABLE permission_audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- 'grant', 'revoke', 'role_change'
    strain_code VARCHAR(50),
    old_role VARCHAR(20),
    new_role VARCHAR(20),
    performed_by INTEGER NOT NULL REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_permission_audit_user ON permission_audit_log(user_id);
CREATE INDEX idx_permission_audit_performed_by ON permission_audit_log(performed_by);

-- ============================================
-- 4. 设置第一个用户为管理员（如果需要）
-- ============================================

-- 取消注释以下行来将第一个用户设为管理员
-- UPDATE users SET role = 'admin' WHERE id = (SELECT MIN(id) FROM users);

-- 或者指定邮箱设为管理员
-- UPDATE users SET role = 'admin' WHERE email = 'admin@lab.local';

-- 查看当前用户角色分布
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- 查看权限表结构
SELECT 'strain_permissions table created successfully' as status;