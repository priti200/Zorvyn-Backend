const bcrypt = require('bcryptjs');

(async () => {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);

  console.log('Original password:', password);
  console.log('Generated hash:', hash);

  const isMatch = await bcrypt.compare(password, hash);
  console.log('Password comparison result:', isMatch);
})();