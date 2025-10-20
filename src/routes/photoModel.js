const express = require('express');
const { query } = require('../database/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Multer storage config: save to /uploads/models (mounted COS path)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = '/uploads/models'; // 直接使用挂载的 COS 目录
    console.log('📁 Multer destination 检查:', {
      path: dest,
      exists: fs.existsSync(dest),
      isDirectory: fs.existsSync(dest) ? fs.statSync(dest).isDirectory() : false,
      writable: fs.existsSync(dest) ? fs.accessSync(dest, fs.constants.W_OK) === undefined : false
    });
    
    if (!fs.existsSync(dest)) {
      console.log('📁 目录不存在，尝试创建:', dest);
      try {
        fs.mkdirSync(dest, { recursive: true });
        console.log('📁 目录创建成功');
      } catch (e) {
        console.error('📁 目录创建失败:', e);
      }
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '_' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = unique + ext;
    console.log('📁 生成文件名:', { original: file.originalname, generated: filename });
    cb(null, filename);
  }
});
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 1 // 每次只处理一个文件
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// 中间件：检查用户认证
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ success: false, message: '用户未登录' });
  }
  next();
};

// 测试挂载目录状态
router.get('/test-upload-dir', requireAuth, (req, res) => {
  try {
    const testDir = '/uploads/models';
    const testFile = path.join(testDir, 'test.txt');
    
    console.log('🔍 测试挂载目录状态:', {
      dir: testDir,
      exists: fs.existsSync(testDir),
      isDir: fs.existsSync(testDir) ? fs.statSync(testDir).isDirectory() : false,
      writable: fs.existsSync(testDir) ? (() => {
        try { fs.accessSync(testDir, fs.constants.W_OK); return true; } catch { return false; }
      })() : false
    });
    
    // 尝试写入测试文件
    try {
      fs.writeFileSync(testFile, 'test content');
      console.log('✅ 测试文件写入成功');
      fs.unlinkSync(testFile); // 删除测试文件
      console.log('✅ 测试文件删除成功');
    } catch (e) {
      console.error('❌ 测试文件操作失败:', e);
    }
    
    res.json({
      success: true,
      dir: testDir,
      exists: fs.existsSync(testDir),
      isDirectory: fs.existsSync(testDir) ? fs.statSync(testDir).isDirectory() : false,
      writable: fs.existsSync(testDir) ? (() => {
        try { fs.accessSync(testDir, fs.constants.W_OK); return true; } catch { return false; }
      })() : false
    });
  } catch (error) {
    console.error('测试目录失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

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

// 上传训练图片，返回可访问的相对路径 /uploads/models/xxx
router.post('/models/upload', requireAuth, (req, res, next) => {
  console.log('📁 上传请求开始处理:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    user: req.user?.email
  });
  next();
}, upload.single('photos'), (err, req, res, next) => {
  if (err) {
    console.error('📁 Multer 错误:', err);
    return res.status(400).json({ success: false, message: 'File upload error: ' + err.message });
  }
  next();
}, async (req, res) => {
  try {
    console.log('📁 上传请求接收:', {
      hasFile: !!req.file,
      body: req.body,
      user: req.user?.email
    });
    
    const file = req.file;
    if (!file) {
      console.error('📁 没有接收到文件');
      return res.status(400).json({ success: false, message: 'No file received' });
    }
    
    console.log('📁 文件详情:', {
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    });
    
    const mapped = [{
      name: file.originalname,
      path: `/uploads/models/${path.basename(file.path)}`,
      size: file.size,
      type: file.mimetype,
      uploadOrder: 1,
    }];
    
    console.log('📁 返回路径:', mapped);
    res.json({ success: true, files: mapped });
  } catch (error) {
    console.error('上传图片失败:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
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
