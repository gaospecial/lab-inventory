# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- 新增 `src/components/PrintButton.tsx` 组件，用于处理客户端打印功能。
- 菌株详情页现在展示更丰富的分类学信息（界、门、纲、目、科、属、种）和来源信息。
- 支持解析带空格的菌株编号（如 `MGSC 1011310`）。

### Changed
- **Database**: 核心数据表从 `strains` 迁移至 `mgsc_germplasm`。
- **UI/UX**: 菌株详情页 (`/strain/[code]`) 重构，移除旧版布局，适配新数据库 Schema。
- **Home**: 主页示例链接更新为新的菌株编号格式 (`MGSC 1011310`)。
- **Refactor**: 修复了服务器组件中使用 `onClick` 事件处理程序的错误。
- **Refactor**: 计划将 `src/app/box` 目录重命名为 `src/app/genus`，并将查询逻辑从“位置”改为“属”。

### Removed
- 暂时移除了菌株编辑功能，等待适配新 Schema。
