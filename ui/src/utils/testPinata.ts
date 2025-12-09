import { pinataService } from '../services/pinata.service';

/**
 * Test Pinata connection and configuration
 * Run this in browser console: import('./utils/testPinata').then(m => m.testPinataConnection())
 */
export async function testPinataConnection(): Promise<void> {
  console.log('🧪 Testing Pinata IPFS Connection...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('- VITE_PINATA_API_KEY:', import.meta.env.VITE_PINATA_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('- VITE_PINATA_SECRET_KEY:', import.meta.env.VITE_PINATA_SECRET_KEY ? '✅ Set' : '❌ Missing');
  console.log('- VITE_IPFS_GATEWAY:', import.meta.env.VITE_IPFS_GATEWAY || 'Using default\n');

  if (!import.meta.env.VITE_PINATA_API_KEY || !import.meta.env.VITE_PINATA_SECRET_KEY) {
    console.error('❌ Pinata API credentials not configured!');
    console.log('\n📖 Setup Instructions:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your Pinata API keys');
    console.log('3. Restart the development server\n');
    return;
  }

  // Test authentication
  console.log('🔐 Testing Authentication...');
  try {
    const isConnected = await pinataService.testConnection();
    if (isConnected) {
      console.log('✅ Authentication successful!\n');
      console.log('🎉 Pinata IPFS is ready to use!');
      console.log('You can now upload documents in the Document Management page.\n');
    } else {
      console.error('❌ Authentication failed!');
      console.log('Please check your API keys in the .env file.\n');
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('- Verify API keys are correct');
    console.log('- Check internet connection');
    console.log('- Ensure API key has proper permissions\n');
  }
}

// Auto-run if imported directly
if (import.meta.env.DEV) {
  console.log('💡 Tip: Run testPinataConnection() in console to test Pinata setup');
}
