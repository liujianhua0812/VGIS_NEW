 -- 为media_files表添加uploaderid字段 (PostgreSQL/TimescaleDB语法)
-- 注意：字段已经存在，此脚本仅供参考
-- ALTER TABLE media_files ADD COLUMN IF NOT EXISTS uploaderid VARCHAR(255) NULL;

-- 添加字段注释
COMMENT ON COLUMN media_files.uploaderid IS '上传人ID';

-- 添加外键约束（可选）
-- ALTER TABLE media_file ADD CONSTRAINT fk_media_file_uploader FOREIGN KEY (uploaderId) REFERENCES user(uid) ON DELETE SET NULL ON UPDATE CASCADE;