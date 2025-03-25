const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  console.log('Creating admin account...');

  const username = await new Promise((resolve) => {
    rl.question('Enter admin username: ', resolve);
  });

  const password = await new Promise((resolve) => {
    rl.question('Enter admin password: ', resolve);
  });

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    console.log('Admin account created successfully!');
    console.log(`Username: ${admin.username}`);
  } catch (error) {
    console.error('Error creating admin account:', error);
  }

  rl.close();
  await prisma.$disconnect();
}

main(); 