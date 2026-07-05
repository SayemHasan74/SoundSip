import { connectDB } from "../lib/db.js";
import { User } from "../models/user.model.js";

const fixArtistDocuments = async () => {
    try {
        await connectDB();
        console.log("🔗 Connected to database");

        // Find all users with any artistDocuments field
        const users = await User.find({
            artistDocuments: { $exists: true }
        });

        console.log(`📊 Found ${users.length} users with artistDocuments to check`);

        let fixedCount = 0;
        let errorCount = 0;

        for (const user of users) {
            try {
                console.log(`🔍 Checking user ${user.clerkId} - artistDocuments type: ${typeof user.artistDocuments}`);
                
                let needsUpdate = false;
                let originalValue = user.artistDocuments;

                // Handle different types of malformed data
                if (typeof user.artistDocuments === 'string') {
                    console.log(`🔧 User ${user.clerkId} - artistDocuments is string, attempting to parse...`);
                    try {
                        const parsed = JSON.parse(user.artistDocuments);
                        if (Array.isArray(parsed)) {
                            user.artistDocuments = parsed;
                            console.log(`✅ Successfully parsed ${parsed.length} documents`);
                        } else {
                            console.log(`⚠️ Parsed value is not an array, setting to empty array`);
                            user.artistDocuments = [];
                        }
                        needsUpdate = true;
                    } catch (parseError) {
                        console.log(`❌ Failed to parse JSON, setting to empty array`);
                        user.artistDocuments = [];
                        needsUpdate = true;
                    }
                } else if (!Array.isArray(user.artistDocuments)) {
                    console.log(`🔧 User ${user.clerkId} - artistDocuments is not an array, setting to empty array`);
                    user.artistDocuments = [];
                    needsUpdate = true;
                } else {
                    // It's already an array, but let's validate the structure
                    const isValid = user.artistDocuments.every(doc => 
                        doc && typeof doc === 'object' && 
                        typeof doc.name === 'string' && 
                        typeof doc.url === 'string' && 
                        typeof doc.type === 'string' && 
                        typeof doc.size === 'number'
                    );
                    
                    if (!isValid) {
                        console.log(`🔧 User ${user.clerkId} - artistDocuments array has invalid structure, setting to empty array`);
                        user.artistDocuments = [];
                        needsUpdate = true;
                    } else {
                        console.log(`✅ User ${user.clerkId} - artistDocuments is valid array with ${user.artistDocuments.length} documents`);
                    }
                }

                if (needsUpdate) {
                    await user.save();
                    console.log(`✅ Fixed user ${user.clerkId}`);
                    console.log(`   Before: ${typeof originalValue} - ${JSON.stringify(originalValue).substring(0, 100)}...`);
                    console.log(`   After: ${typeof user.artistDocuments} - ${user.artistDocuments.length} documents`);
                    fixedCount++;
                }
            } catch (error) {
                console.error(`❌ Error fixing user ${user.clerkId}:`, error.message);
                errorCount++;
            }
        }

        console.log(`\n📈 Migration Summary:`);
        console.log(`✅ Fixed: ${fixedCount} users`);
        console.log(`❌ Errors: ${errorCount} users`);
        console.log(`🎯 Total processed: ${users.length} users`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
};

// Run the migration
fixArtistDocuments();
