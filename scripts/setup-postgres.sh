#!/bin/bash

# 阿里云 ECS PostgreSQL 安装脚本 (Ubuntu)
# 执行方式: sudo bash setup-postgres.sh [hostname]
# 示例: sudo bash setup-postgres.sh bio-spring.top

set -e

# 获取传入的参数或使用默认值
DOMAIN=${1:-localhost}

echo "=== 实验室库存管理系统 - PostgreSQL 安装脚本 ==="
echo ""

# 检查是否以 root 运行
if [ "$EUID" -ne 0 ]; then 
  echo "请使用 sudo 运行此脚本"
  echo "用法: sudo bash $0 [hostname]"
  echo "示例: sudo bash $0 bio-spring.top"
  exit 1
fi

# 获取公网 IP
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "无法获取")

echo "使用域名: $DOMAIN"
echo "公网 IP: $PUBLIC_IP"
echo ""

# 更新系统包
echo "=== 1. 更新系统包 ==="
apt update && apt upgrade -y

# 安装 PostgreSQL
echo "=== 2. 安装 PostgreSQL ==="
apt install -y postgresql postgresql-contrib ufw

# 启动并启用 PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# 创建数据库和用户
echo "=== 3. 配置数据库 ==="

# 提示用户输入配置
read -p "请输入数据库名称 (默认: lab_inventory): " DB_NAME
DB_NAME=${DB_NAME:-lab_inventory}

read -p "请输入数据库用户名 (默认: labuser): " DB_USER
DB_USER=${DB_USER:-labuser}

read -s -p "请输入数据库密码 (至少8位): " DB_PASSWORD
echo ""

if [ ${#DB_PASSWORD} -lt 8 ]; then
  echo "错误: 密码长度至少8位"
  exit 1
fi

# 创建用户和数据库，直接使用 DB_USER 作为数据库所有者
sudo -u postgres psql <<EOF
-- 创建用户（如果不存在）
DO \$\$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;

-- 创建数据库（如果不存在），使用 DB_USER 作为所有者
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
    CREATE DATABASE $DB_NAME OWNER $DB_USER;
  ELSE
    -- 如果数据库已存在，修改所有者为 DB_USER
    ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
  END IF;
END
\$\$;

-- 连接到数据库，设置权限
\c $DB_NAME

-- 授予 schema 权限
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER SCHEMA public OWNER TO $DB_USER;

-- 授予序列权限（如果存在）
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- 授予表权限（如果存在）
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;

-- 设置默认权限，使 DB_USER 自动拥有未来创建的对象的所有权
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES FOR ROLE $DB_USER IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

\q
EOF

echo "✓ 数据库和用户创建完成"
echo "✓ 数据库 $DB_NAME 所有者是 $DB_USER"

# 配置 PostgreSQL 允许远程连接
echo "=== 4. 配置远程访问 ==="

# 获取 PostgreSQL 版本目录
PG_VERSION=$(ls /etc/postgresql/)
PG_CONF_DIR="/etc/postgresql/$PG_VERSION/main"

echo "PostgreSQL 配置文件目录: $PG_CONF_DIR"

# 备份配置文件
cp $PG_CONF_DIR/postgresql.conf $PG_CONF_DIR/postgresql.conf.backup.$(date +%Y%m%d)
cp $PG_CONF_DIR/pg_hba.conf $PG_CONF_DIR/pg_hba.conf.backup.$(date +%Y%m%d)

# 修改 postgresql.conf 监听所有接口
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" $PG_CONF_DIR/postgresql.conf
sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/g" $PG_CONF_DIR/postgresql.conf

# 配置 pg_hba.conf - 允许 Netlify 等云服务访问
# 先清除之前可能存在的重复配置
sed -i '/# Lab Inventory App/d' $PG_CONF_DIR/pg_hba.conf

cat >> $PG_CONF_DIR/pg_hba.conf <<EOF

# Lab Inventory App - 允许外网访问 (使用 scram-sha-256 加密)
hostssl $DB_NAME $DB_USER 0.0.0.0/0 scram-sha-256
host    $DB_NAME $DB_USER 0.0.0.0/0 scram-sha-256
EOF

# 启用 SSL（推荐用于外网访问）
sed -i 's/#ssl = off/ssl = on/g' $PG_CONF_DIR/postgresql.conf
sed -i 's/#ssl_ciphers/ssl_ciphers/g' $PG_CONF_DIR/postgresql.conf

# 重启 PostgreSQL
systemctl restart postgresql

echo "✓ 远程访问配置完成"

# 配置防火墙
echo "=== 5. 配置防火墙 ==="
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 5432/tcp comment 'PostgreSQL'

# 启用防火墙（如果未启用）
ufw status | grep -q "Status: inactive" && echo "y" | ufw enable || true

echo "✓ 防火墙配置完成"

echo ""
echo "=========================================="
echo "    PostgreSQL 安装配置完成！"
echo "=========================================="
echo ""
echo "连接信息:"
echo "  主机: $DOMAIN (或 $PUBLIC_IP)"
echo "  端口: 5432"
echo "  数据库: $DB_NAME"
echo "  用户名: $DB_USER"
echo "  密码: $DB_PASSWORD"
echo ""
echo "连接字符串:"
if [ "$DOMAIN" != "localhost" ]; then
  echo "  postgresql://$DB_USER:$DB_PASSWORD@$DOMAIN:5432/$DB_NAME"
fi
echo "  postgresql://$DB_USER:$DB_PASSWORD@$PUBLIC_IP:5432/$DB_NAME"
echo "  postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
echo ""
echo "=========================================="
echo "⚠️  重要安全提醒："
echo "=========================================="
echo ""
echo "1. 阿里云安全组配置:"
echo "   - 登录阿里云控制台 → ECS → 安全组"
echo "   - 添加规则: 允许 5432 端口 (PostgreSQL)"
echo "   - 建议限制源 IP（仅允许 Netlify 出口 IP）"
echo ""
echo "2. 初始化数据库表："
echo "   执行以下命令（以 $DB_USER 用户身份）："
echo ""
echo "   sudo -u $DB_USER psql -d $DB_NAME -f /path/to/init-db.sql"
echo ""
echo "   或使用："
echo "   PGPASSWORD='$DB_PASSWORD' psql -h localhost -U $DB_USER -d $DB_NAME -f init-db.sql"
echo ""
echo "3. SSL 加密:"
echo "   - 已启用 SSL 支持"
echo "   - 生产环境建议使用 SSL 连接"
echo ""
echo "4. 防火墙已开放 5432 端口"
echo "=========================================="