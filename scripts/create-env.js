const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment files...\n');

const envFiles = [
    {
        example: 'backend/.env.example',
        target: 'backend/.env',
        name: 'Backend'
    },
    {
        example: 'frontend/.env.example',
        target: 'frontend/.env',
        name: 'Frontend'
    }
];

let allGood = true;

envFiles.forEach(({ example, target, name }) => {
    const examplePath = path.resolve(example);
    const targetPath = path.resolve(target);

    if (!fs.existsSync(examplePath)) {
        console.log(`❌ ${name}: ${example} not found`);
        allGood = false;
        return;
    }

    if (fs.existsSync(targetPath)) {
        console.log(`✅ ${name}: ${target} already exists`);
        return;
    }

    try {
        const content = fs.readFileSync(examplePath, 'utf8');
        fs.writeFileSync(targetPath, content);
        console.log(`✅ ${name}: Created ${target} from ${example}`);
    } catch (error) {
        console.log(`❌ ${name}: Failed to create ${target}`);
        console.log(`   Error: ${error.message}`);
        allGood = false;
    }
});

if (allGood) {
    console.log('\n🎉 Environment files ready!');
    console.log('\n📝 Next steps:');
    console.log('1. Edit backend/.env with your database credentials');
    console.log('2. Run: npm run prisma:push');
    console.log('3. Run: npm run dev');
} else {
    console.log('\n❌ Some environment files could not be created');
    console.log('Please check the errors above and try again');
    process.exit(1);
}