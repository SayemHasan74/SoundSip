import { connectDB } from "../lib/db.js";
import { User } from "../models/user.model.js";

const testSchema = async () => {
    try {
        await connectDB();
        console.log("🔗 Connected to database");

        // Test the schema definition
        console.log("📋 Testing artistDocuments schema...");
        
        // Get the schema definition
        const schema = User.schema;
        const artistDocumentsPath = schema.path('artistDocuments');
        
        console.log("📄 artistDocuments schema type:", artistDocumentsPath.instance);
        console.log("📄 artistDocuments schema options:", artistDocumentsPath.options);
        
        // Test creating a user with artistDocuments
        const testUser = new User({
            fullName: "Test User",
            imageUrl: "https://example.com/image.jpg",
            clerkId: "test_clerk_id_" + Date.now(),
            artistDocuments: [
                {
                    name: "test.jpg",
                    url: "/uploads/test.jpg",
                    type: "image/jpeg",
                    size: 12345
                }
            ]
        });
        
        console.log("✅ Test user created successfully");
        console.log("📄 artistDocuments value:", testUser.artistDocuments);
        console.log("📄 artistDocuments type:", typeof testUser.artistDocuments);
        console.log("📄 Is array:", Array.isArray(testUser.artistDocuments));
        
        // Validate the document
        const validationError = testUser.validateSync();
        if (validationError) {
            console.error("❌ Validation error:", validationError.message);
        } else {
            console.log("✅ Validation passed");
        }
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Test failed:", error);
        process.exit(1);
    }
};

// Run the test
testSchema();
