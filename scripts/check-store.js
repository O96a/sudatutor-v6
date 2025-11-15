/**
 * Check File Search Store status and document count
 * Run with: node check-store.js
 */

const API_KEY = process.env.GEMINI_API_KEY || 'GEMINI_API_KEY';
const STORE_NAME = 'fileSearchStores/sudan-curriculum-file-searc-0yuzv4zzxz09';

async function checkStore() {
    console.log('=== File Search Store Status ===\n');
    
    try {
        // Get store info
        const storeRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${STORE_NAME}?key=${API_KEY}`
        );
        
        if (!storeRes.ok) {
            throw new Error(`HTTP ${storeRes.status}`);
        }
        
        const store = await storeRes.json();
        
        console.log('Store:', store.name);
        console.log('Display Name:', store.displayName);
        console.log('Created:', store.createTime);
        console.log('\nDocument Counts:');
        console.log('  Active:', store.activeDocumentsCount || 0);
        console.log('  Pending:', store.pendingDocumentsCount || 0);
        console.log('  Failed:', store.failedDocumentsCount || 0);
        console.log('  Total Size:', (store.sizeBytes || 0), 'bytes');
        
        const total = (store.activeDocumentsCount || 0) + 
                      (store.pendingDocumentsCount || 0) + 
                      (store.failedDocumentsCount || 0);
        
        console.log('\n✓ Total documents:', total);
        
        if ((store.pendingDocumentsCount || 0) > 0) {
            console.log('\n⏳ Some documents are still being processed...');
        }
        
        if ((store.failedDocumentsCount || 0) > 0) {
            console.log('\n⚠️  Some documents failed to upload!');
        }
        
        if ((store.activeDocumentsCount || 0) === 117) {
            console.log('\n🎉 All 117 curriculum files are active and ready!');
            console.log('\nYou can now run: npm run dev');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkStore();
