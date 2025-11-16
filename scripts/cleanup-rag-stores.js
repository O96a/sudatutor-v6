// Cleanup script to delete old RAG stores
// Run with: node cleanup-rag-stores.js

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY environment variable not set');
    console.error('Please set it with: export GEMINI_API_KEY="your-api-key"');
    process.exit(1);
}

async function listRagStores() {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/corpora?key=${API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.corpora || [];
    } catch (error) {
        console.error('Error listing RAG stores:', error.message);
        return [];
    }
}

async function deleteRagStore(name) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${name}?force=true&key=${API_KEY}`,
            { method: 'DELETE' }
        );
        
        return response.ok;
    } catch (error) {
        console.error(`Error deleting ${name}:`, error.message);
        return false;
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('=== RAG Store Cleanup ===\n');
    console.log('Listing all RAG stores...\n');
    
    const stores = await listRagStores();
    
    if (stores.length === 0) {
        console.log('✓ No RAG stores found. Storage is clean!');
        console.log('\nYou can now run: npm run dev');
        return;
    }
    
    console.log(`Found ${stores.length} RAG stores:\n`);
    stores.forEach(s => console.log(`  - ${s.name}`));
    console.log('');
    
    let deleted = 0;
    let errors = 0;
    
    for (const store of stores) {
        console.log(`Deleting: ${store.name}...`);
        const success = await deleteRagStore(store.name);
        
        if (success) {
            deleted++;
            console.log(`  ✓ Deleted`);
        } else {
            errors++;
            console.log(`  ✗ Failed`);
        }
        
        // Wait 500ms between deletions to avoid rate limiting
        await delay(500);
    }
    
    console.log('\n=== Cleanup Complete ===');
    console.log(`Deleted: ${deleted}`);
    console.log(`Errors: ${errors}`);
    
    if (errors > 0) {
        console.log('\n⚠️  Some stores failed to delete.');
        console.log('Try running the cleanup-aggressive.js script instead.');
    } else {
        console.log('\n✓ All stores deleted successfully!');
    }
    
    console.log('\nYou can now run: npm run dev');
}

main();
