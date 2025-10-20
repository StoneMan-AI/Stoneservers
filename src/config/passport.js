const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// 序列化用户
passport.serializeUser((user, done) => {
  console.log('💾 Passport 序列化用户:', user.email);
  done(null, user.email);
});

// 反序列化用户
passport.deserializeUser(async (email, done) => {
  try {
    console.log('🔄 Passport 反序列化用户:', email);
    const user = await User.findByEmail(email);
    if (user) {
      console.log('✅ 用户反序列化成功:', user.email);
    } else {
      console.log('❌ 用户反序列化失败 - 用户不存在:', email);
    }
    done(null, user);
  } catch (error) {
    console.error('❌ 用户反序列化错误:', error);
    done(error, null);
  }
});

// Google OAuth 策略
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.FRONTEND_URL}/auth/google/callback`,
      // 确保使用 Google 官方 OAuth 端点
      authorizationURL: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenURL: 'https://oauth2.googleapis.com/token',
      userInfoURL: 'https://www.googleapis.com/oauth2/v2/userinfo',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 获取用户邮箱
        const email = profile.emails[0].value;
        
        // 创建或查找用户
        const user = await User.findOrCreate(email);
        
        console.log('✅ 用户登录成功:', email);
        done(null, user);
      } catch (error) {
        console.error('❌ OAuth 认证失败:', error);
        done(error, null);
      }
    }
  )
);

module.exports = passport;

