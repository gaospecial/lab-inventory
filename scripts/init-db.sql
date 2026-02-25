-- 实验室库存管理系统数据库初始化脚本

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 创建菌株表
CREATE TABLE IF NOT EXISTS strains (
    id SERIAL PRIMARY KEY,
    strain_code VARCHAR(50) UNIQUE NOT NULL,
    name_chinese VARCHAR(200),
    name_latin VARCHAR(200),
    catalog_name VARCHAR(100),
    catalog_id VARCHAR(50),
    taxon_kingdom VARCHAR(100),
    taxon_phylum VARCHAR(100),
    taxon_class VARCHAR(100),
    taxon_order VARCHAR(100),
    taxon_family VARCHAR(100),
    taxon_genus VARCHAR(100),
    taxon_species VARCHAR(200),
    taxon_kingdom2 VARCHAR(100),
    taxon_phylum2 VARCHAR(100),
    taxon_class2 VARCHAR(100),
    taxon_order2 VARCHAR(100),
    taxon_family2 VARCHAR(100),
    taxon_genus2 VARCHAR(100),
    taxon_species2 VARCHAR(200),
    country VARCHAR(100),
    country_origin VARCHAR(100),
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    collection_location TEXT,
    collection_date VARCHAR(50),
    collection_date_actual DATE,
    isolation_date VARCHAR(50),
    isolation_date_actual DATE,
    sampling_date VARCHAR(50),
    sampling_number VARCHAR(50),
    isolated_by VARCHAR(100),
    source_history TEXT,
    isolation_substrate VARCHAR(200),
    resource_owner VARCHAR(100),
    save_method VARCHAR(200),
    provide_format VARCHAR(100),
    physical_state VARCHAR(50),
    status_id INTEGER,
    status_name VARCHAR(50),
    purpose TEXT,
    cultivation_temperature VARCHAR(50),
    medium_type VARCHAR(100),
    cultivation_conditions TEXT,
    oxygen_requirement VARCHAR(50),
    biohazard_level VARCHAR(50),
    pathogenicity_target VARCHAR(200),
    type_strain VARCHAR(50),
    original_number VARCHAR(100),
    other_strain_code VARCHAR(100),
    platform_resource_code VARCHAR(100),
    rdna16s_login_number VARCHAR(100),
    rdna16s_sequence TEXT,
    func_gene_type VARCHAR(100),
    genome_sequencing VARCHAR(100),
    characteristics TEXT,
    description TEXT,
    extra_attribute_obj TEXT,
    create_time BIGINT,
    create_time_actual TIMESTAMP,
    update_time BIGINT,
    update_time_actual TIMESTAMP,
    create_user_id VARCHAR(50),
    create_user_name VARCHAR(100),
    update_user_id VARCHAR(50),
    update_user_name VARCHAR(100),
    sorter INTEGER DEFAULT 1,
    show_pic INTEGER DEFAULT 1,
    show_flag INTEGER DEFAULT 1,
    del_flag INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    price VARCHAR(50),
    share_way VARCHAR(100),
    transmission_route VARCHAR(100),
    location VARCHAR(200),
    contact_person TEXT,
    file_upload TEXT,
    host_name VARCHAR(200),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_strains_strain_code ON strains(strain_code);
CREATE INDEX IF NOT EXISTS idx_strains_location ON strains(location);
CREATE INDEX IF NOT EXISTS idx_strains_name_chinese ON strains(name_chinese);

-- 插入默认管理员用户（密码: admin123）
-- 注意：生产环境请修改默认密码
-- 密码使用 bcrypt 加密，下面这个哈希对应 'admin123'
-- INSERT INTO users (email, password_hash, name) 
-- VALUES ('admin@lab.local', '$2a$10$YourHashedPasswordHere', '管理员');

-- 注释：请使用登录页面的注册功能创建第一个用户，或在部署后运行以下命令创建用户：
-- node -e "
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('your-password', 10);
-- console.log('Password hash:', hash);
-- "
-- 然后将哈希值插入 users 表