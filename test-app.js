const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test functions
async function testEndpoint(path, expectedSuccess = true) {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const success = json.success === expectedSuccess;
          console.log(`${success ? '✅' : '❌'} ${path} - ${success ? 'PASS' : 'FAIL'}`);
          resolve(success);
        } catch (e) {
          console.log(`❌ ${path} - FAIL (Invalid JSON)`);
          resolve(false);
        }
      });
    });
    
    req.on('error', () => {
      console.log(`❌ ${path} - FAIL (Connection Error)`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${path} - FAIL (Timeout)`);
      resolve(false);
    });
  });
}

async function testPage(path) {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      const success = res.statusCode === 200;
      console.log(`${success ? '✅' : '❌'} ${path} - ${success ? 'PASS' : 'FAIL'} (${res.statusCode})`);
      resolve(success);
    });
    
    req.on('error', () => {
      console.log(`❌ ${path} - FAIL (Connection Error)`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${path} - FAIL (Timeout)`);
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Luxury E-commerce App\n');
  
  // Test API endpoints
  console.log('📡 Testing API Endpoints:');
  const apiTests = [
    testEndpoint('/api/products', true),
    testEndpoint('/api/admin/stats', false), // Should fail without auth
  ];
  
  const apiResults = await Promise.all(apiTests);
  
  // Test pages
  console.log('\n🌐 Testing Pages:');
  const pageTests = [
    testPage('/'),
    testPage('/products'),
    testPage('/auth/signin'),
    testPage('/auth/signup'),
    testPage('/admin'),
  ];
  
  const pageResults = await Promise.all(pageTests);
  
  // Summary
  const totalTests = apiResults.length + pageResults.length;
  const passedTests = apiResults.filter(Boolean).length + pageResults.filter(Boolean).length;
  
  console.log('\n📊 Test Summary:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your app is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the server and try again.');
  }
}

// Run tests
runTests().catch(console.error); 