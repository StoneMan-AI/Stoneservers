const express = require('express');
const { query } = require('../database/db');
const router = express.Router();

// 中间件：检查用户认证
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ success: false, message: '用户未登录' });
  }
  next();
};

// 获取用户的所有 Photo Models
router.get('/models', requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT pm.*, 
              COUNT(mp.id) as photo_count,
              COUNT(gp.id) as generated_photo_count
       FROM photo_models pm
       LEFT JOIN model_photos mp ON pm.id = mp.model_id
       LEFT JOIN generated_photos gp ON pm.id = gp.model_id
       WHERE pm.user_email = $1
       GROUP BY pm.id
       ORDER BY pm.created_at DESC`,
      [req.user.email]
    );

    res.json({
      success: true,
      models: result.rows
    });
  } catch (error) {
    console.error('获取 Photo Models 失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 创建新的 Photo Model
router.post('/models', requireAuth, async (req, res) => {
  try {
    const { name, type, age, eyeColor, bodyType, ethnicity, photos } = req.body;
    
    // 检查用户模型配额
    const userResult = await query(
      'SELECT model_quota FROM users WHERE email = $1',
      [req.user.email]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }
    
    const currentQuota = userResult.rows[0].model_quota;
    if (currentQuota <= 0) {
      return res.status(400).json({ success: false, message: '模型配额已用完' });
    }

    // 生成基础 Prompt
    const basePrompt = `AI Model for ${name}: ${type}, ${age} years old, ${eyeColor} eyes, ${bodyType} body type, ${ethnicity} ethnicity. This model is trained on ${photos.length} high-quality photos and optimized for photo generation.`;

    // 开始事务
    await query('BEGIN');

    try {
      // 创建 Photo Model
      const modelResult = await query(
        `INSERT INTO photo_models (user_email, name, type, age, eye_color, body_type, ethnicity, base_prompt)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [req.user.email, name, type, age, eyeColor, bodyType, ethnicity, basePrompt]
      );

      const modelId = modelResult.rows[0].id;

      // 保存关联的照片信息
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        await query(
          `INSERT INTO model_photos (model_id, file_name, file_path, file_size, file_type, upload_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [modelId, photo.name, photo.path, photo.size, photo.type, i + 1]
        );
      }

      // 更新用户配额
      await query(
        'UPDATE users SET model_quota = model_quota - 1 WHERE email = $1',
        [req.user.email]
      );

      await query('COMMIT');

      res.json({
        success: true,
        model: modelResult.rows[0],
        message: 'Photo Model 创建成功'
      });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('创建 Photo Model 失败:', error);
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

// 获取特定 Model 的详细信息
router.get('/models/:id', requireAuth, async (req, res) => {
  try {
    const modelId = req.params.id;
    
    // 获取模型基本信息
    const modelResult = await query(
      'SELECT * FROM photo_models WHERE id = $1 AND user_email = $2',
      [modelId, req.user.email]
    );

    if (modelResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: '模型不存在' });
    }

    // 获取关联的照片
    const photosResult = await query(
      'SELECT * FROM model_photos WHERE model_id = $1 ORDER BY upload_order',
      [modelId]
    );

    // 获取生成的图片
    const generatedPhotosResult = await query(
      'SELECT * FROM generated_photos WHERE model_id = $1 ORDER BY created_at DESC',
      [modelId]
    );

    res.json({
      success: true,
      model: {
        ...modelResult.rows[0],
        photos: photosResult.rows,
        generatedPhotos: generatedPhotosResult.rows
      }
    });
  } catch (error) {
    console.error('获取 Model 详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

// 保存生成的图片
router.post('/models/:id/generated-photos', requireAuth, async (req, res) => {
  try {
    const modelId = req.params.id;
    const { photoUrl, promptUsed, generationSettings } = req.body;

    // 验证模型所有权
    const modelResult = await query(
      'SELECT id FROM photo_models WHERE id = $1 AND user_email = $2',
      [modelId, req.user.email]
    );

    if (modelResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: '模型不存在' });
    }

    // 保存生成的图片
    const result = await query(
      `INSERT INTO generated_photos (model_id, user_email, photo_url, prompt_used, generation_settings)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [modelId, req.user.email, photoUrl, promptUsed, generationSettings]
    );

    res.json({
      success: true,
      generatedPhoto: result.rows[0]
    });
  } catch (error) {
    console.error('保存生成图片失败:', error);
    res.status(500).json({ success: false, message: '保存失败' });
  }
});

module.exports = router;
