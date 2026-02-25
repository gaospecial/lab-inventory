# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- 新增 `src/components/PrintButton.tsx` 组件，用于处理客户端打印功能。
- 菌株详情页现在展示更丰富的分类学信息（界、门、纲、目、科、属、种）和来源信息。
- 支持解析带空格的菌株编号（如 `MGSC 1011310`）。
- **用户和权限管理**: 新增基于角色的访问控制（RBAC）系统。
  - 支持三种角色：全局管理员、局部管理员、普通用户。
  - 新增用户管理界面 (`/admin/users`)，支持修改角色和删除用户。
  - 新增权限分配界面 (`/admin/users/[id]/permissions`)，为局部管理员分配菌株权限。
  - 新增数据库迁移脚本 `scripts/migrate-permissions.sql`。
  - 新增设置管理员脚本 `scripts/set-admin.js`。
- **登录系统**: 支持用户名或邮箱登录。
  - 登录界面支持 Tab 切换登录/注册。
  - 注册时自动检查邮箱和用户名是否重复。
- **菌株编辑**: 完整的编辑功能，支持修改所有字段（除 MGSC ID 外）。

### Changed
- **Database**: 核心数据表从 `strains` 迁移至 `mgsc_germplasm`。
- **UI/UX**: 菌株详情页 (`/strain/[code]`) 重构，移除旧版布局，适配新数据库 Schema。
- **Home**: 主页示例链接更新为新的菌株编号格式 (`MGSC 1011310`)。
- **Refactor**: 修复了服务器组件中使用 `onClick` 事件处理程序的错误。
- **Refactor**: 计划将 `src/app/box` 目录重命名为 `src/app/genus`，并将查询逻辑从"位置"改为"属"。
- **登录界面**: 全新设计的登录/注册界面，使用卡片式布局和渐变背景。

### Removed
- ~~暂时移除了菌株编辑功能，等待适配新 Schema。~~ (已恢复)

## [2025-02-25]

### Added
- 项目初始化，完成基础功能开发。