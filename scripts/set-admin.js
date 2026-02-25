#!/usr/bin/env node

/**
 * 设置用户为管理员
 * 用法: node scripts/set-admin.js <email>
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setAdmin(email) {
  if (!email) {
    console.error('请提供用户邮箱');
    console.error('用法: node scripts/set-admin.js <email>');
    process.exit(1);
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, name, role',
      ['admin', email]
    );

    if (result.rows.length === 0) {
      console.error(`未找到用户: ${email}`);
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('✅ 成功设置管理员权限:');
    console.log(`   ID: ${user.id}`);
    console.log(`   邮箱: ${user.email}`);
    console.log(`   姓名: ${user.name || '未设置'}`);
    console.log(`   角色: ${user.role}`);
  } catch (error) {
    console.error('❌ 设置失败:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const email = process.argv[2];
setAdmin(email);