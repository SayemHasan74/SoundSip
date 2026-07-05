import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { axiosInstance } from "@/lib/axios";
import { Bug, RefreshCw, TestTube } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const AdminDebugPanel = () => {
	const { isAdmin, checkAdminStatus } = useAuthStore();
	const { songs, albums, fetchSongs, fetchAlbums } = useMusicStore();
	const [isTesting, setIsTesting] = useState(false);

	const testAdminAccess = async () => {
		setIsTesting(true);
		try {
			console.log("🔍 Testing admin access...");
			const response = await axiosInstance.get("/admin/check");
			console.log("✅ Admin check response:", response.data);
			toast.success("Admin access confirmed!");
		} catch (error: any) {
			console.error("❌ Admin access test failed:", error);
			toast.error("Admin access test failed: " + (error.response?.data?.message || error.message));
		} finally {
			setIsTesting(false);
		}
	};

	const testSongsEndpoint = async () => {
		setIsTesting(true);
		try {
			console.log("🔍 Testing songs endpoint...");
			const response = await axiosInstance.get("/songs");
			console.log("✅ Songs endpoint response:", response.data);
			toast.success(`Found ${response.data.length} songs`);
		} catch (error: any) {
			console.error("❌ Songs endpoint test failed:", error);
			toast.error("Songs endpoint test failed: " + (error.response?.data?.message || error.message));
		} finally {
			setIsTesting(false);
		}
	};

	const testAlbumsEndpoint = async () => {
		setIsTesting(true);
		try {
			console.log("🔍 Testing albums endpoint...");
			const response = await axiosInstance.get("/albums");
			console.log("✅ Albums endpoint response:", response.data);
			toast.success(`Found ${response.data.length} albums`);
		} catch (error: any) {
			console.error("❌ Albums endpoint test failed:", error);
			toast.error("Albums endpoint test failed: " + (error.response?.data?.message || error.message));
		} finally {
			setIsTesting(false);
		}
	};

	const testFormData = async () => {
		setIsTesting(true);
		try {
			console.log("🔍 Testing form data upload...");
			
			// Create a simple test form data
			const formData = new FormData();
			formData.append("title", "Test Song");
			formData.append("artist", "Test Artist");
			formData.append("genre", "Pop");
			formData.append("duration", "3.5");
			
			// Create dummy files
			const audioBlob = new Blob(["dummy audio content"], { type: "audio/mpeg" });
			const imageBlob = new Blob(["dummy image content"], { type: "image/jpeg" });
			
			formData.append("audioFile", audioBlob, "test-audio.mp3");
			formData.append("imageFile", imageBlob, "test-image.jpg");
			
			const response = await axiosInstance.post("/admin/test-form", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			
			console.log("✅ Form data test response:", response.data);
			toast.success("Form data test successful!");
		} catch (error: any) {
			console.error("❌ Form data test failed:", error);
			toast.error("Form data test failed: " + (error.response?.data?.message || error.message));
		} finally {
			setIsTesting(false);
		}
	};

	const refreshData = async () => {
		setIsTesting(true);
		try {
			console.log("🔄 Refreshing data...");
			await Promise.all([fetchSongs(), fetchAlbums()]);
			toast.success("Data refreshed successfully!");
		} catch (error: any) {
			console.error("❌ Data refresh failed:", error);
			toast.error("Data refresh failed: " + (error.response?.data?.message || error.message));
		} finally {
			setIsTesting(false);
		}
	};

	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Bug className="h-5 w-5 text-orange-500" />
					Admin Debug Panel
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="text-sm">
						<strong>Admin Status:</strong> {isAdmin ? "✅ Admin" : "❌ Not Admin"}
					</div>
					<div className="text-sm">
						<strong>Songs Loaded:</strong> {songs.length}
					</div>
					<div className="text-sm">
						<strong>Albums Loaded:</strong> {albums.length}
					</div>
					<div className="text-sm">
						<strong>Testing:</strong> {isTesting ? "🔄 Running..." : "⏸️ Idle"}
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						onClick={testAdminAccess}
						disabled={isTesting}
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
					>
						<TestTube className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Test Admin Access</span>
						<span className="sm:hidden">Admin Test</span>
					</Button>

					<Button
						onClick={testSongsEndpoint}
						disabled={isTesting}
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
					>
						<TestTube className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Test Songs API</span>
						<span className="sm:hidden">Songs API</span>
					</Button>

					<Button
						onClick={testAlbumsEndpoint}
						disabled={isTesting}
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
					>
						<TestTube className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Test Albums API</span>
						<span className="sm:hidden">Albums API</span>
					</Button>

					<Button
						onClick={testFormData}
						disabled={isTesting}
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
					>
						<TestTube className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Test Form Data</span>
						<span className="sm:hidden">Form Test</span>
					</Button>

					<Button
						onClick={refreshData}
						disabled={isTesting}
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Refresh Data</span>
						<span className="sm:hidden">Refresh</span>
					</Button>

					<Button
						onClick={checkAdminStatus}
						disabled={isTesting}
						variant="outline"
						size="sm"
						className="text-xs sm:text-sm"
					>
						<RefreshCw className="mr-2 h-4 w-4" />
						<span className="hidden sm:inline">Check Admin Status</span>
						<span className="sm:hidden">Check Status</span>
					</Button>
				</div>

				<div className="text-xs text-zinc-400">
					<p>Check the browser console for detailed logs.</p>
					<p>Make sure you're logged in with an admin account.</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminDebugPanel;
