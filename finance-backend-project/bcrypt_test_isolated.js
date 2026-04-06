const bcrypt = require('bcryptjs');

(async () => {
  const password = 'password123';
  const storedHash = '$2a$10$8/EeI4WZQnCmCi0rZ7UhNeTE4lGd9BSHxuYE8weSD3NtiReugfIBS'; // Use the hash from the logs

  console.log('Stored hash:', storedHash);
  console.log('Provided password:', password);

  const isMatch = await bcrypt.compare(password, storedHash);
  console.log('Password comparison result:', isMatch);
})();