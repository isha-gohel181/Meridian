import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ishagohel181_db_user:DowKSvrk3sJ14Ml4@cluster0.meojiss.mongodb.net/xpertqa?retryWrites=true&w=majority';

async function resetAdmin() {
  console.log('Connecting to MongoDB at:', MONGO_URI);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log('✅ Connected to MongoDB');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Admin@123', salt);

  const admins = [
    {
      fullName: 'Xpertqa Admin',
      email: 'admin@xpertqa.in',
      password: hashedPassword,
      role: 'admin',
      is_verify: true,
      emailVerified: true,
      status: 'active',
      isActive: true,
      profilePicture: 'default-profile.png'
    }
  ];

  for (const adminData of admins) {
    let user = await User.findOne({ email: adminData.email.toLowerCase() });
    if (user) {
      user.password = adminData.password;
      user.role = 'admin';
      user.is_verify = true;
      user.emailVerified = true;
      user.status = 'active';
      user.isActive = true;
      user.fullName = adminData.fullName;
      await user.save();
      console.log(`✅ Updated admin user: ${adminData.email}`);
    } else {
      user = await User.create(adminData);
      console.log(`✅ Created new admin user: ${adminData.email}`);
    }
  }

  console.log('\n=============================================');
  console.log('🎉 Admin account reset successfully:');
  console.log('---------------------------------------------');
  console.log('📧 Primary Email  : admin@xpertqa.in');
  console.log('🔑 Password       : Admin@123');
  console.log('🛡️ Role           : admin');
  console.log('=============================================\n');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
}

resetAdmin().catch(err => {
  console.error('❌ Error resetting admin:', err);
  process.exit(1);
});
