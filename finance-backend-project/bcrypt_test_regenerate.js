const bcrypt = require('bcryptjs');

(async () => {
  const password = 'password123';

  // Regenerate the hash
  const newHash = await bcrypt.hash(password, 10);
  console.log('Regenerated hash:', newHash);

  // Compare with the regenerated hash
  const isMatch = await bcrypt.compare(password, newHash);
  console.log('Password comparison with regenerated hash:', isMatch);
})();