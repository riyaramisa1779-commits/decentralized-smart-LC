// Script to check the current admin address of the deployed contract
// Usage: node scripts/check-admin.js

const { ethers } = require("hardhat");

async function main() {
  // Get contract address from environment or use default
  const contractAddress = process.env.CONTRACT_ADDRESS || "68729EFCffF3914776EA9Cf4bA0489a7F4c33bEc";
  
  console.log("\n🔍 Checking Admin Address...\n");
  console.log("Contract Address:", contractAddress);
  
  try {
    // Get the contract instance
    const SmartLCSystem = await ethers.getContractFactory("SmartLCSystem");
    const contract = SmartLCSystem.attach(contractAddress);
    
    // Get admin address
    const adminAddress = await contract.admin();
    
    console.log("\n✅ Admin Address Found:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:", adminAddress);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    // Get current signer for comparison
    const [signer] = await ethers.getSigners();
    const signerAddress = await signer.getAddress();
    
    console.log("Your Current Wallet:", signerAddress);
    
    if (adminAddress.toLowerCase() === signerAddress.toLowerCase()) {
      console.log("\n✅ SUCCESS: You are connected as the admin!\n");
    } else {
      console.log("\n⚠️  WARNING: You are NOT connected as the admin.");
      console.log("   Switch to the admin wallet to access admin functions.\n");
    }
    
    // Additional info
    console.log("📋 Next Steps:");
    console.log("   1. Copy the admin address above");
    console.log("   2. Import it to your wallet (MetaMask, etc.)");
    console.log("   3. Connect with that wallet in your dApp");
    console.log("   4. Navigate to /admin to access the Admin Panel\n");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\nTroubleshooting:");
    console.log("   • Make sure the contract is deployed");
    console.log("   • Check the CONTRACT_ADDRESS is correct");
    console.log("   • Verify you're on the correct network");
    console.log("   • Run: npx hardhat node (for local testing)\n");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
