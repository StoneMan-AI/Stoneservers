-- Photo Model 相关数据表结构

-- 1. Photo Models 表 - 存储模型基本信息
CREATE TABLE IF NOT EXISTS photo_models (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    eye_color VARCHAR(50) NOT NULL,
    body_type VARCHAR(50) NOT NULL,
    ethnicity VARCHAR(100) NOT NULL,
    base_prompt TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- 2. Model Photos 表 - 存储模型关联的照片
CREATE TABLE IF NOT EXISTS model_photos (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    upload_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES photo_models(id) ON DELETE CASCADE
);

-- 3. Generated Photos 表 - 存储通过 Photo AI 生成的图片
CREATE TABLE IF NOT EXISTS generated_photos (
    id SERIAL PRIMARY KEY,
    model_id INTEGER NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    prompt_used TEXT,
    generation_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES photo_models(id) ON DELETE CASCADE,
    FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE CASCADE
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_photo_models_user_email ON photo_models(user_email);
CREATE INDEX IF NOT EXISTS idx_photo_models_created_at ON photo_models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_model_photos_model_id ON model_photos(model_id);
CREATE INDEX IF NOT EXISTS idx_generated_photos_model_id ON generated_photos(model_id);
CREATE INDEX IF NOT EXISTS idx_generated_photos_user_email ON generated_photos(user_email);
