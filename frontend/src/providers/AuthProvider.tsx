import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId, isSignedIn } = useAuth();
	const { user } = useUser();
	const [loading, setLoading] = useState(true);
	const initializedUserId = useRef<string | null>(null);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket, fetchUsers } = useChatStore();

	// Function to sync user with backend
	const syncUserWithBackend = useCallback(async (clerkUser: any) => {
		try {
			await axiosInstance.post("/auth/callback", {
				id: clerkUser.id,
				firstName: clerkUser.firstName || "",
				lastName: clerkUser.lastName || "",
				imageUrl: clerkUser.imageUrl || "",
			});
		} catch (error) {
			console.error("❌ Failed to sync user with backend:", error);
			throw error;
		}
	}, []);

	useEffect(() => {
		let cancelled = false;

		const initAuth = async () => {
			if (!isSignedIn || !userId || !user) {
				initializedUserId.current = null;
				updateApiToken(null);
				disconnectSocket();
				setLoading(false);
				return;
			}

			try {
				const needsUserSync = initializedUserId.current !== userId;
				if (needsUserSync) setLoading(true);

				const token = await getToken();
				if (cancelled) return;
				updateApiToken(token);
				
				if (!token) throw new Error("Unable to create an authenticated session");

				if (needsUserSync) {
					// The user record must exist before protected pages start their requests.
					await syncUserWithBackend(user);
					if (cancelled) return;
					initializedUserId.current = userId;
				}

				setLoading(false);
				initSocket(userId);

				// These requests populate secondary UI and should not block the app shell.
				void Promise.allSettled([checkAdminStatus(), fetchUsers()]);
			} catch (error: any) {
				updateApiToken(null);
				console.error("Error in auth provider", error);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void initAuth();

		return () => {
			cancelled = true;
			disconnectSocket();
		};
	}, [
		getToken,
		userId,
		user,
		isSignedIn,
		checkAdminStatus,
		initSocket,
		disconnectSocket,
		fetchUsers,
		syncUserWithBackend,
	]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
